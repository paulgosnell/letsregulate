import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { GeminiConversation, ConversationMode, ConversationStatus } from '../../lib/gemini-conversation';
import { ChatMessage, ToolSuggestion } from '../../types';
import { saveMessage, loadConversationHistory } from '../../lib/supabase';
import { LumaAvatar } from './LumaAvatar';
import { ModeToggle } from './ModeToggle';
import { TextChatArea } from './TextChatArea';
import { VideoCallArea } from './VideoCallArea';
import { ConversationInput } from './ConversationInput';

interface ConversationUIProps {
  userId: string;
  sessionId: string;
  mood?: string;
  onToolSuggested?: (tool: string) => void;
  onClose?: () => void;
}

export function ConversationUI({
  userId,
  sessionId,
  mood,
  onToolSuggested,
  onClose,
}: ConversationUIProps) {
  // State
  const [mode, setMode] = useState<ConversationMode>('text');
  const [status, setStatus] = useState<ConversationStatus>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [audioAmplitude, setAudioAmplitude] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // Refs
  const conversationRef = useRef<GeminiConversation | null>(null);
  const isInitialized = useRef(false);

  // Initialize conversation
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Load conversation history
    loadConversationHistory(sessionId)
      .then((history) => {
        const chatMessages: ChatMessage[] = history.map((msg) => ({
          id: msg.id,
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
          timestamp: new Date(msg.created_at || Date.now()),
        }));
        setMessages(chatMessages);
      })
      .catch(console.error);

    // Create conversation instance
    conversationRef.current = new GeminiConversation({
      mood,
      voice: 'Kore',
      onStatusChange: setStatus,
      onMessage: (role, text) => {
        const newMessage: ChatMessage = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: role === 'user' ? 'user' : 'assistant',
          content: text,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);

        // Save to database
        saveMessage(sessionId, userId, role === 'user' ? 'user' : 'assistant', text)
          .catch(console.error);
      },
      onAgentSpeaking: setIsAgentSpeaking,
      onMicrophoneActive: setIsMicActive,
      onToolSuggestion: (tool: ToolSuggestion) => {
        if (tool.tool) {
          onToolSuggested?.(tool.tool);
        }
      },
      onError: setError,
      onAudioAmplitude: setAudioAmplitude,
    });

    return () => {
      conversationRef.current?.endSession();
    };
  }, [sessionId, userId, mood, onToolSuggested]);

  // Handle mode changes
  const handleModeChange = useCallback(async (newMode: ConversationMode) => {
    if (!conversationRef.current) return;

    setError(null);

    try {
      await conversationRef.current.switchMode(newMode);
      setMode(newMode);

      // Handle video stream
      if (newMode === 'video') {
        const stream = conversationRef.current.getVideoStream();
        setVideoStream(stream);
      } else {
        setVideoStream(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch mode');
    }
  }, []);

  // Send text message
  const handleSendText = useCallback(async (text: string) => {
    if (!conversationRef.current || isLoading) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message
    saveMessage(sessionId, userId, 'user', text).catch(console.error);

    setIsLoading(true);
    setError(null);

    try {
      // Get response (the onMessage callback will handle adding it to state)
      await conversationRef.current.sendTextMessage(text, messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, userId, messages, isLoading]);

  // Start voice
  const handleStartVoice = useCallback(async () => {
    if (!conversationRef.current) return;

    setError(null);
    try {
      await conversationRef.current.startVoice();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start voice');
    }
  }, []);

  // Stop voice
  const handleStopVoice = useCallback(async () => {
    if (!conversationRef.current) return;

    try {
      await conversationRef.current.stopVoice();
    } catch (err) {
      console.error('Error stopping voice:', err);
    }
  }, []);

  // Capture and analyze image
  const handleImageCapture = useCallback(async (imageBase64: string) => {
    if (!conversationRef.current || isAnalyzingImage) return;

    setIsAnalyzingImage(true);
    setError(null);

    try {
      await conversationRef.current.analyzeImage(imageBase64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setIsAnalyzingImage(false);
    }
  }, [isAnalyzingImage]);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-light/20">
        <div className="flex items-center gap-3">
          <LumaAvatar
            mode={mode}
            isAgentSpeaking={isAgentSpeaking}
            isListening={isMicActive}
            audioAmplitude={audioAmplitude}
            size="small"
          />
          <div>
            <h2 className="font-semibold text-slate">Chat with Luma</h2>
            <p className="text-xs text-slate/60">
              {status === 'connecting' && 'Connecting...'}
              {status === 'connected' && (mode === 'voice' || mode === 'video') && (
                isAgentSpeaking ? 'Speaking...' : isMicActive ? 'Listening...' : 'Connected'
              )}
              {status === 'idle' && 'Your Regulation Buddy'}
              {status === 'error' && 'Connection error'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle
            currentMode={mode}
            onModeChange={handleModeChange}
            disabled={status === 'connecting'}
          />

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-light/10 transition-colors"
              title="Close"
            >
              <X size={20} className="text-slate/60" />
            </button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Voice/Video mode - Show large avatar */}
        {(mode === 'voice' || mode === 'video') && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
            <LumaAvatar
              mode={mode}
              isAgentSpeaking={isAgentSpeaking}
              isListening={isMicActive}
              audioAmplitude={audioAmplitude}
              size="large"
            />

            {mode === 'video' && (
              <div className="w-full max-w-sm aspect-[4/3]">
                <VideoCallArea
                  stream={videoStream}
                  onCapture={handleImageCapture}
                  isAnalyzing={isAnalyzingImage}
                />
              </div>
            )}

            {/* Error display */}
            {error && (
              <p className="text-rose text-sm text-center">{error}</p>
            )}
          </div>
        )}

        {/* Text mode - Show chat */}
        {mode === 'text' && (
          <TextChatArea messages={messages} isLoading={isLoading} />
        )}
      </div>

      {/* Input area */}
      <ConversationInput
        mode={mode}
        status={status}
        onSendText={handleSendText}
        onStartVoice={handleStartVoice}
        onStopVoice={handleStopVoice}
        isLoading={isLoading}
        isAgentSpeaking={isAgentSpeaking}
        isMicActive={isMicActive}
      />

      {/* Error toast */}
      {error && mode === 'text' && (
        <div className="absolute bottom-20 left-4 right-4 p-3 bg-rose/10 border border-rose/20 rounded-xl text-rose text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
