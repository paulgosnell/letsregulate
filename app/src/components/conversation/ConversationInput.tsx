import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { ConversationMode, ConversationStatus } from '../../lib/gemini-conversation';

interface ConversationInputProps {
  mode: ConversationMode;
  status: ConversationStatus;
  onSendText: (text: string) => void;
  onStartVoice: () => void;
  onStopVoice: () => void;
  isLoading?: boolean;
  isAgentSpeaking?: boolean;
  isMicActive?: boolean;
}

const MAX_CHARS = 500;

export function ConversationInput({
  mode,
  status,
  onSendText,
  onStartVoice,
  onStopVoice,
  isLoading,
  isAgentSpeaking,
  isMicActive,
}: ConversationInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    onSendText(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Voice/Video mode - show voice controls
  if (mode === 'voice' || mode === 'video') {
    const isConnected = status === 'connected';
    const isConnecting = status === 'connecting';

    return (
      <div className="p-4 border-t border-slate-light/20">
        <div className="flex flex-col items-center gap-4">
          {/* Status text */}
          <p className="text-sm text-slate/60">
            {isConnecting && 'Connecting to Luma...'}
            {isConnected && isAgentSpeaking && 'Luma is speaking...'}
            {isConnected && isMicActive && 'Listening...'}
            {isConnected && !isAgentSpeaking && !isMicActive && 'Connected - You can talk now!'}
            {status === 'error' && 'Connection error - tap to retry'}
            {status === 'idle' && 'Tap to start voice chat'}
          </p>

          {/* Voice control button */}
          <button
            onClick={() => {
              if (isConnected) {
                onStopVoice();
              } else if (status !== 'connecting') {
                onStartVoice();
              }
            }}
            disabled={isConnecting}
            className={`
              w-16 h-16 rounded-full
              flex items-center justify-center
              transition-all duration-300
              ${isConnected
                ? 'bg-rose text-white hover:bg-rose/80'
                : 'bg-mint text-white hover:bg-mint/80'
              }
              ${isConnecting ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}
              shadow-lg active:scale-95
            `}
          >
            {isConnected ? <MicOff size={28} /> : <Mic size={28} />}
          </button>

          <p className="text-xs text-slate/40">
            {isConnected ? 'Tap to end call' : 'Tap to start'}
          </p>
        </div>
      </div>
    );
  }

  // Text mode - show text input
  return (
    <div className="p-4 border-t border-slate-light/20">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder="Type a message to Luma..."
            disabled={isLoading}
            rows={1}
            className="
              w-full px-4 py-3 pr-12
              rounded-2xl border border-slate-light/30
              focus:border-lavender focus:ring-2 focus:ring-lavender/20
              outline-none transition-all duration-200
              bg-white/50 backdrop-blur-sm
              resize-none max-h-32
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />

          {/* Character count */}
          <span
            className={`
              absolute right-3 bottom-3 text-xs
              ${input.length > MAX_CHARS * 0.9 ? 'text-rose' : 'text-slate/40'}
            `}
          >
            {input.length}/{MAX_CHARS}
          </span>
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="
            w-12 h-12 rounded-full
            bg-lavender text-white
            flex items-center justify-center
            shadow-md hover:bg-lavender-dark
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95
          "
          title="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
