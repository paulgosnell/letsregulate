import { ChatMessage } from '../../types';
import { formatDate } from '../../utils/helpers';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`message-bubble ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-content">
        {message.content}
      </div>
      <div className="message-timestamp">
        {formatDate(message.timestamp)}
      </div>
    </div>
  );
}
