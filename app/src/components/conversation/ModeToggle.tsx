import { MessageSquare, Phone, Video } from 'lucide-react';
import { ConversationMode } from '../../lib/gemini-conversation';

interface ModeToggleProps {
  currentMode: ConversationMode;
  onModeChange: (mode: ConversationMode) => void;
  disabled?: boolean;
}

export function ModeToggle({ currentMode, onModeChange, disabled }: ModeToggleProps) {
  const modes: { mode: ConversationMode; icon: typeof MessageSquare; label: string }[] = [
    { mode: 'text', icon: MessageSquare, label: 'Text' },
    { mode: 'voice', icon: Phone, label: 'Voice' },
    { mode: 'video', icon: Video, label: 'Video' },
  ];

  return (
    <div className="flex gap-2 p-1.5 bg-slate-light/10 rounded-full">
      {modes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => !disabled && onModeChange(mode)}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            transition-all duration-200
            ${currentMode === mode
              ? 'bg-white shadow-md text-lavender-dark'
              : 'text-slate hover:bg-white/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={label}
        >
          <Icon size={18} />
          <span className="text-sm font-medium hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
