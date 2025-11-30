import { ChatMessage } from '../../types';
import { formatDate } from '../../utils/helpers';
interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4 animate-fade-in`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-base leading-relaxed ${isUser
          ? 'bg-lavender text-white rounded-br-none'
          : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
          }`}
      >
        {message.content}
      </div>
      <div className={`text-xs text-slate-400 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
        {formatDate(message.timestamp)}
      </div>
    </div>
  );
}
