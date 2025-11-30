import { supabase } from './supabase';

export type VoiceOption = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';

export interface VoiceConfig {
  onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  onMessage?: (role: 'user' | 'agent', text: string) => void;
  onAgentSpeaking?: (isSpeaking: boolean) => void;
  onMicrophoneActive?: (isActive: boolean) => void;
  systemPrompt?: string;
  firstMessage?: string;
  voice?: VoiceOption;
}

export class VoiceConversation {
  private config: VoiceConfig;
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioStream: MediaStream | null = null;
  private remoteAudio: HTMLAudioElement | null = null;
  private currentTranscript: string = '';
  private isConnected: boolean = false;

  constructor(config: VoiceConfig = {}) {
    this.config = {
      voice: 'coral', // Default voice - friendly and clear
      ...config
    };
  }

  async initialize() {
    try {
      this.config.onStatusChange?.('connecting');

      // Create audio element for playback
      this.remoteAudio = document.createElement('audio');
      this.remoteAudio.autoplay = true;

      // 1. Get ephemeral key from Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('openai-realtime-session', {
        body: { voice: this.config.voice }
      });

      if (error || !data?.client_secret) {
        throw new Error(error?.message || 'Failed to get session token');
      }

      const clientSecret = data.client_secret;

      // 2. Get microphone access
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // 3. Create WebRTC peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // 4. Handle incoming audio from OpenAI
      this.peerConnection.ontrack = (event) => {
        if (this.remoteAudio && event.streams[0]) {
          this.remoteAudio.srcObject = event.streams[0];
        }
      };

      // 5. Add local audio track (microphone)
      const audioTrack = this.audioStream.getAudioTracks()[0];
      this.peerConnection.addTrack(audioTrack, this.audioStream);

      // 6. Create data channel for events
      this.dataChannel = this.peerConnection.createDataChannel('oai-events');
      this.dataChannel.onmessage = this.handleDataChannelMessage.bind(this);

      // 7. Create and send SDP offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      const sdpResponse = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clientSecret.value}`,
          'Content-Type': 'application/sdp'
        },
        body: offer.sdp
      });

      if (!sdpResponse.ok) {
        throw new Error('Failed to connect to OpenAI Realtime API');
      }

      // 8. Set remote description from OpenAI's answer
      const answerSdp = await sdpResponse.text();
      await this.peerConnection.setRemoteDescription({ type: 'answer', sdp: answerSdp });

      // 9. Monitor connection state
      this.peerConnection.onconnectionstatechange = () => {
        const state = this.peerConnection?.connectionState;
        if (state === 'failed' || state === 'disconnected') {
          this.config.onStatusChange?.('error');
          this.endSession();
        }
      };

      this.isConnected = true;
      return this;

    } catch (error) {
      console.error('Failed to initialize voice conversation:', error);
      this.config.onStatusChange?.('error');
      throw error;
    }
  }

  private handleDataChannelMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      console.log('[Voice] Event:', data.type);

      switch (data.type) {
        case 'session.created':
          // Session ready - send configuration
          this.sendSessionConfig();
          break;

        case 'session.updated':
          this.config.onStatusChange?.('connected');
          break;

        case 'input_audio_buffer.speech_started':
          this.config.onMicrophoneActive?.(true);
          this.config.onAgentSpeaking?.(false);
          break;

        case 'input_audio_buffer.speech_stopped':
          this.config.onMicrophoneActive?.(false);
          break;

        case 'conversation.item.input_audio_transcription.completed':
          if (data.transcript) {
            this.config.onMessage?.('user', data.transcript);
          }
          break;

        case 'response.audio_transcript.delta':
          if (data.delta) {
            this.currentTranscript += data.delta;
          }
          break;

        case 'response.audio_transcript.done':
          if (data.transcript || this.currentTranscript) {
            this.config.onMessage?.('agent', data.transcript || this.currentTranscript);
            this.currentTranscript = '';
          }
          break;

        case 'response.audio.started':
        case 'output_audio_buffer.started':
          this.config.onAgentSpeaking?.(true);
          this.config.onMicrophoneActive?.(false);
          break;

        case 'response.audio.stopped':
        case 'output_audio_buffer.stopped':
        case 'response.done':
          this.config.onAgentSpeaking?.(false);
          this.currentTranscript = '';
          break;

        case 'error':
          console.error('[Voice] Error:', data.error);
          this.config.onStatusChange?.('error');
          break;
      }
    } catch (err) {
      console.error('[Voice] Parse error:', err);
    }
  }

  private sendSessionConfig() {
    if (this.dataChannel?.readyState !== 'open') return;

    // Send session configuration
    this.dataChannel.send(JSON.stringify({
      type: 'session.update',
      session: {
        instructions: this.config.systemPrompt || 'You are a helpful assistant.',
        voice: this.config.voice,
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 600
        }
      }
    }));

    // Send first message if provided
    if (this.config.firstMessage) {
      setTimeout(() => {
        if (this.dataChannel?.readyState === 'open') {
          this.dataChannel.send(JSON.stringify({
            type: 'response.create',
            response: {
              modalities: ['text', 'audio'],
              instructions: `Say exactly: "${this.config.firstMessage}"`
            }
          }));
        }
      }, 500);
    }
  }

  async endSession() {
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    if (this.remoteAudio) {
      this.remoteAudio.srcObject = null;
      this.remoteAudio = null;
    }
    this.isConnected = false;
    this.config.onStatusChange?.('disconnected');
  }

  isActive(): boolean {
    return this.isConnected;
  }
}
