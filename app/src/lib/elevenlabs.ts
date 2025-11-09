import { Conversation } from '@elevenlabs/client';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

export interface VoiceConfig {
  onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  onMessage?: (role: 'user' | 'agent', text: string) => void;
  onAgentSpeaking?: (isSpeaking: boolean) => void;
  onMicrophoneActive?: (isActive: boolean) => void;
  systemPrompt?: string;
  firstMessage?: string;
}

export class VoiceConversation {
  private conversation: Conversation | null = null;
  private config: VoiceConfig;

  constructor(config: VoiceConfig = {}) {
    this.config = config;
  }

  async initialize() {
    if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
      throw new Error('ElevenLabs credentials not configured. Please add VITE_ELEVENLABS_API_KEY and VITE_ELEVENLABS_AGENT_ID to your .env.local file');
    }

    try {
      this.config.onStatusChange?.('connecting');

      // Get signed URL for secure connection
      const signedUrl = await this.getSignedUrl();

      // Initialize conversation with system prompt override
      this.conversation = await Conversation.startSession({
        signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: this.config.systemPrompt || 'You are Regulation Buddy, a helpful emotional support assistant.',
            },
            firstMessage: this.config.firstMessage || 'Hi! I\'m your Regulation Buddy. How are you feeling today?',
            language: 'en',
          },
        },
        onConnect: () => {
          this.config.onStatusChange?.('connected');
        },
        onDisconnect: () => {
          this.config.onStatusChange?.('disconnected');
        },
        onError: (error) => {
          console.error('Conversation error:', error);
          this.config.onStatusChange?.('error');
        },
        onMessage: (message) => {
          const role = message.source === 'user' ? 'user' : 'agent';
          this.config.onMessage?.(role, message.message);
        },
        onModeChange: (mode) => {
          // speaking = agent is talking
          // listening = agent is listening to user
          this.config.onAgentSpeaking?.(mode.mode === 'speaking');
          this.config.onMicrophoneActive?.(mode.mode === 'listening');
        },
      });

      return this.conversation;
    } catch (error) {
      console.error('Failed to initialize voice conversation:', error);
      this.config.onStatusChange?.('error');
      throw error;
    }
  }

  private async getSignedUrl(): Promise<string> {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      // Fallback to public WebSocket URL if signed URL fails
      return `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${ELEVENLABS_AGENT_ID}`;
    }

    const data = await response.json();
    return data.signed_url || `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${ELEVENLABS_AGENT_ID}`;
  }

  async sendText(text: string) {
    if (!this.conversation) {
      throw new Error('Conversation not initialized');
    }

    await this.conversation.sendUserInput(text);
  }

  async endSession() {
    if (this.conversation) {
      await this.conversation.endSession();
      this.conversation = null;
    }
  }

  isConnected(): boolean {
    return this.conversation !== null;
  }
}
