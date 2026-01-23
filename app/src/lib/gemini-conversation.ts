// Unified Gemini Conversation Class
// Handles text, voice, and video modes with a single API

import { getLumaSystemPrompt, getLumaVoicePrompt, getLumaVisionPrompt, getLumaGreeting, detectToolSuggestion } from './prompts';
import { ToolSuggestion, ChatMessage } from '../types';

export type ConversationMode = 'text' | 'voice' | 'video';
export type ConversationStatus = 'idle' | 'connecting' | 'connected' | 'error';
export type GeminiVoice = 'Aoede' | 'Charon' | 'Fenrir' | 'Kore' | 'Puck';

export interface GeminiConversationConfig {
  mood?: string;
  voice?: GeminiVoice;
  onStatusChange?: (status: ConversationStatus) => void;
  onMessage?: (role: 'user' | 'assistant', text: string) => void;
  onAgentSpeaking?: (isSpeaking: boolean) => void;
  onMicrophoneActive?: (isActive: boolean) => void;
  onToolSuggestion?: (tool: ToolSuggestion) => void;
  onError?: (error: string) => void;
  onAudioAmplitude?: (amplitude: number) => void; // For avatar animation
}

export class GeminiConversation {
  private config: GeminiConversationConfig;
  private mode: ConversationMode = 'text';
  private status: ConversationStatus = 'idle';

  // Voice/Video mode state
  private ws: WebSocket | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private audioPlayerNode: AudioWorkletNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private isMounted = true;
  private isConnecting = false;

  // Video mode state
  private videoStream: MediaStream | null = null;

  constructor(config: GeminiConversationConfig = {}) {
    this.config = {
      voice: 'Kore',
      ...config,
    };
  }

  // ==================== MODE MANAGEMENT ====================

  getMode(): ConversationMode {
    return this.mode;
  }

  getStatus(): ConversationStatus {
    return this.status;
  }

  async switchMode(newMode: ConversationMode): Promise<void> {
    if (newMode === this.mode) return;

    // Clean up current mode
    if (this.mode === 'voice' || this.mode === 'video') {
      await this.stopVoice();
    }
    if (this.mode === 'video') {
      this.stopCamera();
    }

    this.mode = newMode;

    // Initialize new mode
    if (newMode === 'voice' || newMode === 'video') {
      await this.startVoice();
    }
    if (newMode === 'video') {
      await this.startCamera();
    }
  }

  // ==================== TEXT MODE ====================

  async sendTextMessage(content: string, conversationHistory: ChatMessage[] = []): Promise<{ reply: string; toolSuggestion?: ToolSuggestion }> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Get auth token
    const tokenKey = `sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token`;
    const tokenData = localStorage.getItem(tokenKey);
    const accessToken = tokenData ? JSON.parse(tokenData)?.access_token : null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      // Build messages array with history
      const messages = [
        ...conversationHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content },
      ];

      const response = await fetch(`${supabaseUrl}/functions/v1/gemini-text`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': accessToken ? `Bearer ${accessToken}` : `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          systemPrompt: getLumaSystemPrompt(this.config.mood),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || '';
      const toolSuggestion = data.toolSuggestion || detectToolSuggestion(reply);

      // Notify callbacks
      this.config.onMessage?.('assistant', reply);
      if (toolSuggestion) {
        this.config.onToolSuggestion?.(toolSuggestion);
      }

      return { reply, toolSuggestion };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  // ==================== VISION MODE ====================

  async analyzeImage(imageBase64: string, prompt?: string): Promise<string> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const tokenKey = `sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token`;
    const tokenData = localStorage.getItem(tokenKey);
    const accessToken = tokenData ? JSON.parse(tokenData)?.access_token : null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/gemini-vision`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': accessToken ? `Bearer ${accessToken}` : `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          prompt: prompt || 'What do you see? Respond as Luma, the caring Regulation Buddy.',
          systemPrompt: getLumaVisionPrompt(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || '';

      this.config.onMessage?.('assistant', reply);

      return reply;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Vision request timed out');
      }
      throw error;
    }
  }

  // ==================== VOICE MODE ====================

  async startVoice(): Promise<void> {
    if (this.isConnecting || this.ws) return;
    this.isConnecting = true;
    this.setStatus('connecting');

    try {
      await this.initAudioOutput();

      // Get WebSocket URL from edge function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
      }

      const tokenKey = `sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token`;
      const tokenData = localStorage.getItem(tokenKey);
      const accessToken = tokenData ? JSON.parse(tokenData)?.access_token : null;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${supabaseUrl}/functions/v1/gemini-voice-session`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': accessToken ? `Bearer ${accessToken}` : `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Edge function error: ${response.status}`);
      }

      const { wsUrl, model } = await response.json();
      if (!wsUrl) {
        throw new Error('Failed to get session config');
      }

      // Connect WebSocket
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        const setupMessage = {
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: 'audio',
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: this.config.voice,
                  },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: getLumaVoicePrompt(this.config.mood) }],
            },
          },
        };

        ws.send(JSON.stringify(setupMessage));
      };

      ws.onmessage = async (event) => {
        try {
          let data: unknown;

          if (event.data instanceof Blob) {
            const text = await event.data.text();
            try {
              data = JSON.parse(text);
            } catch {
              const arrayBuffer = await event.data.arrayBuffer();
              const base64 = this.arrayBufferToBase64(arrayBuffer);
              this.playAudio(base64);
              return;
            }
          } else {
            data = JSON.parse(event.data);
          }

          const msg = data as Record<string, unknown>;

          if (msg.setupComplete) {
            this.isConnecting = false;
            if (this.isMounted) {
              this.setStatus('connected');
            }
            await this.startMicrophone();

            // Send greeting
            const greeting = getLumaGreeting(this.config.mood);
            const greetingMessage = {
              clientContent: {
                turns: [
                  {
                    role: 'user',
                    parts: [{ text: `Please say: "${greeting}"` }],
                  },
                ],
                turnComplete: true,
              },
            };
            ws.send(JSON.stringify(greetingMessage));
          }

          if (msg.serverContent) {
            const serverContent = msg.serverContent as Record<string, unknown>;
            const modelTurn = serverContent.modelTurn as Record<string, unknown> | undefined;

            if (modelTurn?.parts) {
              const parts = modelTurn.parts as Array<Record<string, unknown>>;
              for (const part of parts) {
                if (part.inlineData) {
                  const inlineData = part.inlineData as Record<string, unknown>;
                  if (this.isMounted) this.config.onAgentSpeaking?.(true);
                  this.playAudio(inlineData.data as string);
                }
                if (part.text) {
                  const text = part.text as string;
                  this.config.onMessage?.('assistant', text);
                  const toolSuggestion = detectToolSuggestion(text);
                  if (toolSuggestion) {
                    this.config.onToolSuggestion?.(toolSuggestion);
                  }
                }
              }
            }

            if (serverContent.turnComplete) {
              if (this.isMounted) this.config.onAgentSpeaking?.(false);
            }

            if (serverContent.interrupted) {
              this.stopAudio();
              if (this.isMounted) this.config.onAgentSpeaking?.(false);
            }
          }
        } catch {
          // Parse error - ignore
        }
      };

      ws.onerror = () => {
        this.isConnecting = false;
        if (this.isMounted) {
          this.config.onError?.('Connection error. Please try again.');
          this.setStatus('error');
        }
      };

      ws.onclose = (event) => {
        this.isConnecting = false;
        this.ws = null;
        if (this.isMounted) {
          if (event.code !== 1000 && event.reason) {
            this.config.onError?.(`Connection closed: ${event.reason}`);
          }
          this.setStatus('idle');
        }
      };
    } catch (err) {
      this.isConnecting = false;
      if (this.isMounted) {
        this.config.onError?.(err instanceof Error ? err.message : 'Failed to connect');
        this.setStatus('error');
      }
      throw err;
    }
  }

  async stopVoice(): Promise<void> {
    this.stopAudio();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.inputAudioContext) {
      this.inputAudioContext.close();
      this.inputAudioContext = null;
    }
    if (this.audioPlayerNode) {
      this.audioPlayerNode.disconnect();
      this.audioPlayerNode = null;
    }
    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }
    if (this.outputAudioContext) {
      if (this.outputAudioContext.state !== 'closed') {
        this.outputAudioContext.close();
      }
      this.outputAudioContext = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }

    this.isConnecting = false;
    this.setStatus('idle');
  }

  // ==================== CAMERA ====================

  async startCamera(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 },
    });
    this.videoStream = stream;
    return stream;
  }

  stopCamera(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((t) => t.stop());
      this.videoStream = null;
    }
  }

  getVideoStream(): MediaStream | null {
    return this.videoStream;
  }

  // ==================== AUDIO UTILITIES ====================

  private async initAudioOutput(): Promise<void> {
    if (this.outputAudioContext && this.audioPlayerNode) return;

    const audioContext = new AudioContext({ sampleRate: 24000 });
    this.outputAudioContext = audioContext;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    if (!this.isMounted || this.outputAudioContext !== audioContext) {
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
      return;
    }

    await audioContext.audioWorklet.addModule('/pcm-player-processor.js');

    if (!this.isMounted || this.outputAudioContext !== audioContext) {
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
      return;
    }

    this.audioPlayerNode = new AudioWorkletNode(audioContext, 'pcm-player-processor');

    // Add analyser for amplitude detection (for avatar animation)
    this.analyserNode = audioContext.createAnalyser();
    this.analyserNode.fftSize = 256;

    this.audioPlayerNode.connect(this.analyserNode);
    this.analyserNode.connect(audioContext.destination);

    // Start amplitude monitoring
    this.monitorAmplitude();
  }

  private monitorAmplitude(): void {
    if (!this.analyserNode || !this.isMounted) return;

    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);

    const checkAmplitude = () => {
      if (!this.analyserNode || !this.isMounted) return;

      this.analyserNode.getByteFrequencyData(dataArray);
      const amplitude = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
      this.config.onAudioAmplitude?.(amplitude);

      requestAnimationFrame(checkAmplitude);
    };

    checkAmplitude();
  }

  private playAudio(base64Audio: string): void {
    if (!this.audioPlayerNode) return;

    if (this.outputAudioContext?.state === 'suspended') {
      this.outputAudioContext.resume();
    }

    const arrayBuffer = this.base64ToArrayBuffer(base64Audio);
    this.audioPlayerNode.port.postMessage(arrayBuffer);
  }

  private stopAudio(): void {
    if (this.audioPlayerNode) {
      this.audioPlayerNode.port.postMessage({ command: 'endOfAudio' });
    }
  }

  private async startMicrophone(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      if (!this.isMounted) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      this.mediaStream = stream;
      this.inputAudioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.inputAudioContext.createMediaStreamSource(stream);

      const processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
      this.processor = processor;

      let isSpeaking = false;
      const silenceThreshold = 0.01;
      let silenceCount = 0;

      processor.onaudioprocess = (e) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const rms = Math.sqrt(inputData.reduce((sum, val) => sum + val * val, 0) / inputData.length);

        if (rms > silenceThreshold) {
          if (!isSpeaking) {
            isSpeaking = true;
            if (this.isMounted) this.config.onMicrophoneActive?.(true);
          }
          silenceCount = 0;
        } else {
          silenceCount++;
          if (silenceCount > 10 && isSpeaking) {
            isSpeaking = false;
            if (this.isMounted) this.config.onMicrophoneActive?.(false);
          }
        }

        const downsampled = this.downsampleBuffer(inputData, this.inputAudioContext!.sampleRate, 16000);
        const pcmData = this.floatTo16BitPCM(downsampled);
        const base64Audio = this.arrayBufferToBase64(pcmData);

        const audioMessage = {
          realtimeInput: {
            mediaChunks: [
              {
                mimeType: 'audio/pcm;rate=16000',
                data: base64Audio,
              },
            ],
          },
        };

        this.ws.send(JSON.stringify(audioMessage));
      };

      source.connect(processor);
      processor.connect(this.inputAudioContext.destination);
    } catch {
      this.config.onError?.('Failed to access microphone. Please check permissions.');
    }
  }

  // ==================== CONVERSION UTILITIES ====================

  private floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private downsampleBuffer(buffer: Float32Array, inputSampleRate: number, outputSampleRate: number): Float32Array {
    if (inputSampleRate === outputSampleRate) return buffer;
    const ratio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const index = Math.round(i * ratio);
      result[i] = buffer[index];
    }
    return result;
  }

  // ==================== LIFECYCLE ====================

  private setStatus(status: ConversationStatus): void {
    this.status = status;
    this.config.onStatusChange?.(status);
  }

  async endSession(): Promise<void> {
    this.isMounted = false;
    await this.stopVoice();
    this.stopCamera();
    this.setStatus('idle');
  }

  isActive(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
