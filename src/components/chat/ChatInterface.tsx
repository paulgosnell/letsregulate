import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageBubble } from './MessageBubble';
import { useChat } from '../../hooks/useChat';
import './ChatInterface.css';

interface ChatInterfaceProps {
  userId: string;
  sessionId: string;
  mood?: string;
  onToolSuggested?: (tool: string) => void;
}

export function ChatInterface({ userId, sessionId, mood, onToolSuggested }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
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

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <h2>Hi! I'm your Regulation Buddy</h2>
            <p>Tell me how you're feeling today, and we can chat about it together.</p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {loading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={loading}
          maxLength={500}
          rows={1}
        />
        <button
          type="submit"
          className="chat-send-button"
          disabled={!input.trim() || loading}
          aria-label="Send message"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>

      <div className="chat-character-count">
        {input.length}/500
      </div>
    </div>
  );
}
