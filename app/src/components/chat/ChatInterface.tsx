import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageBubble } from './MessageBubble';
import { VoiceChat } from './VoiceChat';
import { useChat } from '../../hooks/useChat';
interface ChatInterfaceProps {
  userId: string;
  sessionId: string;
  mood?: string;
  onToolSuggested?: (tool: string) => void;
}

export function ChatInterface({ userId, sessionId, mood, onToolSuggested }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [showVoiceMode, setShowVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, loading, toolSuggestion, sendUserMessage } = useChat(
    sessionId,
    userId,
    mood
  );

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Notify parent of tool suggestion
  useEffect(() => {
    if (toolSuggestion?.tool && onToolSuggested) {
      onToolSuggested(toolSuggestion.tool);
    }
  }, [toolSuggestion, onToolSuggested]);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    await sendUserMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Show voice mode if enabled
  if (showVoiceMode) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <VoiceChat
          mood={mood}
          onClose={() => setShowVoiceMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 min-h-[400px]">
            <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-white ring-4 ring-lavender/20 animate-float">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source
                  src="https://wgrqgcwabpebxtkwmnkb.supabase.co/storage/v1/object/public/video/lumna.mov"
                  type="video/quicktime"
                />
                <source
                  src="https://wgrqgcwabpebxtkwmnkb.supabase.co/storage/v1/object/public/video/lumna.mov"
                  type="video/mp4"
                />
              </video>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-700">Hi! I'm Luma</h2>
              <p className="text-slate-500 text-lg">I'm here to listen.</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl rounded-tl-none w-fit">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form
          className="relative flex items-end gap-2 bg-slate-50 p-2 rounded-3xl border border-slate-200 focus-within:border-lavender focus-within:ring-2 focus-within:ring-lavender/20 transition-all shadow-sm"
          onSubmit={handleSubmit}
        >
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent border-0 focus:ring-0 p-3 max-h-32 resize-none text-slate-700 placeholder:text-slate-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How are you feeling?"
            disabled={loading}
            maxLength={500}
            rows={1}
          />

          <div className="flex items-center gap-1 pb-1 pr-1">
            <span className="text-xs text-slate-400 px-2 hidden sm:block">
              {input.length}/500
            </span>

            <button
              type="button"
              className="p-2 text-slate-400 hover:text-lavender-dark hover:bg-lavender/10 rounded-full transition-colors"
              onClick={() => setShowVoiceMode(true)}
              aria-label="Switch to voice chat"
              title="Talk to Luma"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>

            <button
              type="submit"
              className="p-2 bg-lavender text-white rounded-full hover:bg-lavender-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={input.trim() ? "translate-x-0.5" : ""}
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
