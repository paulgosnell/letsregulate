import { MoodType } from '../../types';

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType) => void;
}

const MOODS: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: 'happy', emoji: '😊', label: 'Happy', color: 'bg-peach hover:bg-peach/80' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'bg-sky hover:bg-sky/80' },
  { type: 'angry', emoji: '😠', label: 'Angry', color: 'bg-rose hover:bg-rose/80' },
  { type: 'worried', emoji: '😟', label: 'Worried', color: 'bg-lavender hover:bg-lavender/80' },
  { type: 'calm', emoji: '😌', label: 'Calm', color: 'bg-mint hover:bg-mint/80' },
  { type: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-peach hover:bg-peach/80' },
  { type: 'scared', emoji: '😨', label: 'Scared', color: 'bg-lavender hover:bg-lavender/80' },
];

export function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate mb-2">
          How are you feeling?
        </h2>
        <p className="text-slate/60 mb-8">
          Tap on the mood that best describes how you're feeling right now
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
          {MOODS.map((mood) => (
            <button
              key={mood.type}
              onClick={() => onMoodSelect(mood.type)}
              className={`
                ${mood.color}
                p-4 sm:p-5 rounded-2xl
                flex flex-col items-center gap-2
                transition-all duration-200
                active:scale-95
                shadow-sm hover:shadow-md
              `}
            >
              <span className="text-3xl sm:text-4xl">{mood.emoji}</span>
              <span className="text-sm font-medium text-slate">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
