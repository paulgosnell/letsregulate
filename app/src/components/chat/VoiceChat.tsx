import { useState, useEffect, useRef } from 'react';
import { VoiceConversation } from '../../lib/elevenlabs';
import './VoiceChat.css';

interface VoiceChatProps {
  onClose: () => void;
  mood?: string;
}

export function VoiceChat({ onClose, mood }: VoiceChatProps) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; text: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const conversationRef = useRef<VoiceConversation | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeVoice();
    }

    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession();
        conversationRef.current = null;
      }
      hasInitialized.current = false;
    };
  }, []);

  const initializeVoice = async () => {
    try {
      const conversation = new VoiceConversation({
        systemPrompt: `You are Regulation Buddy, a warm, patient, and nurturing emotional support companion for children aged 3-17. Your role is to help children understand and manage their emotions through gentle conversation.

PERSONALITY:
- Warm & nurturing (like a caring friend)
- Gentle & patient (never rushed)
- Playful & engaging (age-appropriate fun)
- Honest & authentic (real, not patronizing)

COMMUNICATION STYLE:
- Use simple, age-appropriate language
- Keep responses short (2-3 sentences max)
- Ask one question at a time
- Reflect feelings back: "It sounds like you're feeling..."
- Validate emotions: "That makes sense. It's okay to feel..."
- Use metaphors kids understand (breathing like blowing bubbles)

CONVERSATION APPROACH:
1. Listen actively and acknowledge feelings
2. Help name the emotion if they're struggling
3. Explore what triggered the feeling
4. Suggest simple coping tools when appropriate (breathing, movement, affirmations)
5. Celebrate small wins and progress

TONE:
- Conversational and natural (not scripted)
- Encouraging without being over-the-top
- Curious and genuinely interested
- Safe and non-judgmental

BOUNDARIES:
- You're a supportive friend, not a therapist
- For serious concerns, gently suggest talking to a trusted adult
- Keep conversations age-appropriate and positive
- Focus on emotional regulation skills

Remember: Every big feeling is valid, and you're here to help them work through it together.${mood ? `\n\nThe child is currently feeling: ${mood}` : ''}`,
        firstMessage: mood
          ? `Hi there! I heard you're feeling ${mood} today. That's totally okay - all feelings are welcome here. Want to tell me more about it?`
          : `Hi! I'm your Regulation Buddy. I'm here to talk with you about how you're feeling. How are you doing today?`,
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
          if (newStatus === 'error') {
            setError('Connection failed. Please check your ElevenLabs credentials.');
          }
        },
        onMessage: (role, text) => {
          setMessages(prev => [...prev, { role, text }]);
        },
        onAgentSpeaking: setIsAgentSpeaking,
        onMicrophoneActive: setIsMicActive,
      });

      conversationRef.current = conversation;
      await conversation.initialize();
    } catch (err) {
      console.error('Voice initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start voice chat');
      setStatus('error');
    }
  };

  const handleEndCall = async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
    }
    onClose();
  };

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting to Regulation Buddy...';
      case 'connected':
        if (isAgentSpeaking) return 'Regulation Buddy is speaking...';
        if (isMicActive) return 'Listening...';
        return 'Connected - You can talk now!';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return error || 'Connection error';
      default:
        return 'Starting...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return isAgentSpeaking ? 'var(--lavender)' : isMicActive ? 'var(--mint)' : 'var(--sky)';
      case 'connecting':
        return 'var(--peach)';
      case 'error':
        return 'var(--color-error)';
      default:
        return 'var(--slate)';
    }
  };

  return (
    <div className="voice-chat-container">
      {/* Status Header */}
      <div className="voice-chat-header">
        <button
          className="voice-close-button"
          onClick={handleEndCall}
          aria-label="End voice chat"
        >
          ×
        </button>
        <h2 className="voice-chat-title">Voice Chat</h2>
        <p
          className="voice-chat-status"
          style={{ color: getStatusColor() }}
        >
          {getStatusText()}
        </p>
      </div>

      {/* Visual Indicator */}
      <div className="voice-indicator-container">
        {status === 'connecting' ? (
          <div className="voice-connecting-spinner" />
        ) : status === 'connected' ? (
          <div className="voice-wave-container">
            {isAgentSpeaking ? (
              // Agent speaking waves
              <div className="voice-wave-group">
                <div className="voice-wave" style={{ backgroundColor: 'var(--lavender)', animationDelay: '0s' }} />
                <div className="voice-wave" style={{ backgroundColor: 'var(--sky)', animationDelay: '0.1s' }} />
                <div className="voice-wave" style={{ backgroundColor: 'var(--rose)', animationDelay: '0.2s' }} />
                <div className="voice-wave" style={{ backgroundColor: 'var(--peach)', animationDelay: '0.3s' }} />
                <div className="voice-wave" style={{ backgroundColor: 'var(--mint)', animationDelay: '0.4s' }} />
              </div>
            ) : isMicActive ? (
              // Listening pulse
              <div className="voice-pulse" style={{ backgroundColor: 'var(--mint)' }} />
            ) : (
              // Idle state
              <div className="voice-idle-circle" style={{ borderColor: 'var(--sky)' }} />
            )}
          </div>
        ) : status === 'error' ? (
          <div className="voice-error-icon">⚠️</div>
        ) : null}
      </div>

      {/* Transcript */}
      {messages.length > 0 && (
        <div className="voice-transcript">
          <h3 className="voice-transcript-title">Conversation</h3>
          <div className="voice-transcript-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`voice-message voice-message-${msg.role}`}
              >
                <span className="voice-message-label">
                  {msg.role === 'user' ? 'You' : 'Regulation Buddy'}:
                </span>
                <span className="voice-message-text">{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* End Call Button */}
      <button
        className="voice-end-button"
        onClick={handleEndCall}
        disabled={status === 'connecting'}
      >
        {status === 'connecting' ? 'Connecting...' : 'End Voice Chat'}
      </button>
    </div>
  );
}
