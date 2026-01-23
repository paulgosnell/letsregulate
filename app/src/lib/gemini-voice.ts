// Gemini 2.5 Live API Voice Integration
// Real-time bidirectional voice chat using WebSockets

export type GeminiVoice = "Aoede" | "Charon" | "Fenrir" | "Kore" | "Puck";

export interface GeminiVoiceConfig {
  voice?: GeminiVoice;
  systemPrompt?: string;
  firstMessage?: string;
  onStatusChange?: (status: "connecting" | "connected" | "disconnected" | "error") => void;
  onMessage?: (role: "user" | "agent", text: string) => void;
  onAgentSpeaking?: (isSpeaking: boolean) => void;
  onMicrophoneActive?: (isActive: boolean) => void;
  onError?: (error: string) => void;
}

export class GeminiVoiceConversation {
  private config: GeminiVoiceConfig;
  private ws: WebSocket | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private audioPlayerNode: AudioWorkletNode | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private isMounted = true;
  private isConnecting = false;

  constructor(config: GeminiVoiceConfig = {}) {
    this.config = {
      voice: "Kore", // Professional, clear voice good for children
      ...config,
    };
  }

  // Audio conversion utilities
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
    let binary = "";
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

  // Downsample from browser sample rate to 16kHz for Gemini
  private downsampleBuffer(
    buffer: Float32Array,
    inputSampleRate: number,
    outputSampleRate: number
  ): Float32Array {
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

  // Initialize audio output at 24kHz (Gemini's output sample rate)
  private async initAudioOutput(): Promise<void> {
    if (this.outputAudioContext && this.audioPlayerNode) return;

    // Create AudioContext - browsers may require user interaction first
    const audioContext = new AudioContext({ sampleRate: 24000 });
    this.outputAudioContext = audioContext;

    // Resume if suspended (required by browser autoplay policies)
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    // Check if we were unmounted during the await
    if (!this.isMounted || this.outputAudioContext !== audioContext) {
      if (audioContext.state !== "closed") {
        audioContext.close();
      }
      return;
    }

    // Load the AudioWorklet module
    await audioContext.audioWorklet.addModule("/pcm-player-processor.js");

    // Check again after the await - component may have unmounted
    if (!this.isMounted || this.outputAudioContext !== audioContext) {
      if (audioContext.state !== "closed") {
        audioContext.close();
      }
      return;
    }

    // Create the player node only after module is loaded
    this.audioPlayerNode = new AudioWorkletNode(
      audioContext,
      "pcm-player-processor"
    );

    this.audioPlayerNode.connect(audioContext.destination);
  }

  private playAudio(base64Audio: string): void {
    if (!this.audioPlayerNode) return;

    if (this.outputAudioContext?.state === "suspended") {
      this.outputAudioContext.resume();
    }

    const arrayBuffer = this.base64ToArrayBuffer(base64Audio);
    this.audioPlayerNode.port.postMessage(arrayBuffer);
  }

  private stopAudio(): void {
    if (this.audioPlayerNode) {
      this.audioPlayerNode.port.postMessage({ command: "endOfAudio" });
    }
  }

  async initialize(): Promise<GeminiVoiceConversation> {
    console.log("GeminiVoice: initialize() called");
    if (this.isConnecting || this.ws) {
      console.log("GeminiVoice: Already connecting or connected, skipping");
      return this;
    }
    this.isConnecting = true;

    try {
      this.config.onStatusChange?.("connecting");

      console.log("GeminiVoice: Initializing audio output...");
      await this.initAudioOutput();
      console.log("GeminiVoice: Audio output initialized");

      // Get WebSocket URL from Supabase Edge Function
      // Using direct fetch with timeout as workaround for Supabase client hanging issue
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase environment variables");
      }

      // Get auth token from localStorage
      const tokenKey = `sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token`;
      const tokenData = localStorage.getItem(tokenKey);
      const accessToken = tokenData ? JSON.parse(tokenData)?.access_token : null;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let wsUrl: string;
      let model: string;

      try {
        console.log("GeminiVoice: Calling edge function gemini-voice-session...");
        const response = await fetch(`${supabaseUrl}/functions/v1/gemini-voice-session`, {
          method: "POST",
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": accessToken ? `Bearer ${accessToken}` : `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log("GeminiVoice: Edge function response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("GeminiVoice: Edge function error:", errorData);
          throw new Error(errorData.error || `Edge function error: ${response.status}`);
        }

        const data = await response.json();
        console.log("GeminiVoice: Edge function returned data:", { hasWsUrl: !!data?.wsUrl, model: data?.model });
        if (!data?.wsUrl) {
          throw new Error("Failed to get session config");
        }

        wsUrl = data.wsUrl;
        model = data.model;
        console.log("GeminiVoice: Got WebSocket URL, connecting...");
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          throw new Error("Voice session request timed out");
        }
        throw fetchError;
      }

      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        // Send setup message for Gemini Live API
        const setupMessage = {
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: "audio",
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: this.config.voice,
                  },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: this.config.systemPrompt || "You are a helpful assistant." }],
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
              // Binary audio - decode and play
              const arrayBuffer = await event.data.arrayBuffer();
              const base64 = this.arrayBufferToBase64(arrayBuffer);
              this.playAudio(base64);
              return;
            }
          } else {
            data = JSON.parse(event.data);
          }

          const msg = data as Record<string, unknown>;

          // Connection confirmed
          if (msg.setupComplete) {
            this.isConnecting = false;
            if (this.isMounted) {
              this.config.onStatusChange?.("connected");
            }
            await this.startMicrophone();

            // Send initial greeting request
            if (this.config.firstMessage) {
              const greetingMessage = {
                clientContent: {
                  turns: [
                    {
                      role: "user",
                      parts: [{ text: `Please say: "${this.config.firstMessage}"` }],
                    },
                  ],
                  turnComplete: true,
                },
              };
              ws.send(JSON.stringify(greetingMessage));
            }
          }

          // Handle server responses
          if (msg.serverContent) {
            const serverContent = msg.serverContent as Record<string, unknown>;
            const modelTurn = serverContent.modelTurn as Record<string, unknown> | undefined;

            if (modelTurn?.parts) {
              const parts = modelTurn.parts as Array<Record<string, unknown>>;
              for (const part of parts) {
                // Audio data
                if (part.inlineData) {
                  const inlineData = part.inlineData as Record<string, unknown>;
                  if (this.isMounted) this.config.onAgentSpeaking?.(true);
                  this.playAudio(inlineData.data as string);
                }
                // Text transcript
                if (part.text) {
                  this.config.onMessage?.("agent", part.text as string);
                }
              }
            }

            if (serverContent.turnComplete) {
              if (this.isMounted) this.config.onAgentSpeaking?.(false);
            }

            // Handle interruption
            if (serverContent.interrupted) {
              this.stopAudio();
              if (this.isMounted) this.config.onAgentSpeaking?.(false);
            }
          }
        } catch {
          // Message parse error - ignore
        }
      };

      ws.onerror = () => {
        this.isConnecting = false;
        if (this.isMounted) {
          this.config.onError?.("Connection error. Please try again.");
          this.config.onStatusChange?.("error");
        }
      };

      ws.onclose = (event) => {
        this.isConnecting = false;
        this.ws = null;
        if (this.isMounted) {
          if (event.code !== 1000 && event.reason) {
            this.config.onError?.(`Connection closed: ${event.reason}`);
          }
          this.config.onStatusChange?.("disconnected");
        }
      };

      return this;
    } catch (err) {
      this.isConnecting = false;
      if (this.isMounted) {
        this.config.onError?.(err instanceof Error ? err.message : "Failed to connect");
        this.config.onStatusChange?.("error");
      }
      throw err;
    }
  }

  // Microphone setup with correct sample rate and format
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

      // Check if unmounted during the await
      if (!this.isMounted) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      this.mediaStream = stream;

      // Input context (browser may give different sample rate, we'll downsample)
      this.inputAudioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.inputAudioContext.createMediaStreamSource(stream);

      const processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
      this.processor = processor;

      // Voice activity detection
      let isSpeaking = false;
      const silenceThreshold = 0.01;
      let silenceCount = 0;

      processor.onaudioprocess = (e) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);

        // Calculate RMS for voice activity
        const rms = Math.sqrt(
          inputData.reduce((sum, val) => sum + val * val, 0) / inputData.length
        );

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

        // Downsample and convert to PCM
        const downsampled = this.downsampleBuffer(
          inputData,
          this.inputAudioContext!.sampleRate,
          16000
        );
        const pcmData = this.floatTo16BitPCM(downsampled);
        const base64Audio = this.arrayBufferToBase64(pcmData);

        // Send real-time audio input to Gemini
        const audioMessage = {
          realtimeInput: {
            mediaChunks: [
              {
                mimeType: "audio/pcm;rate=16000",
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
      this.config.onError?.("Failed to access microphone. Please check permissions.");
    }
  }

  async endSession(): Promise<void> {
    this.isMounted = false;
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
    if (this.outputAudioContext) {
      this.outputAudioContext.close();
      this.outputAudioContext = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    this.isConnecting = false;
    this.config.onStatusChange?.("disconnected");
  }

  isActive(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
