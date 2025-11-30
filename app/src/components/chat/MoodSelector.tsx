import { MoodType } from '../../types';
import { MOOD_ICONS, MOOD_LABELS, MOOD_COLORS } from '../../utils/constants';
import { playHapticFeedback } from '../../utils/helpers';

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType) => void;
  disabled?: boolean;
}

const MOODS: MoodType[] = ['happy', 'sad', 'angry', 'worried', 'calm', 'excited', 'scared'];

export function MoodSelector({ onMoodSelect, disabled = false }: MoodSelectorProps) {
  const handleMoodClick = (mood: MoodType) => {
    if (disabled) return;
    playHapticFeedback('medium');
    onMoodSelect(mood);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-700 mb-3">How are you feeling?</h2>
        <p className="text-slate-500 text-lg">Pick the icon that matches your mood</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
        {MOODS.map((mood) => {
          const Icon = MOOD_ICONS[mood];
          const color = MOOD_COLORS[mood];

          return (
            <button
              key={mood}
              className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white border-2 border-transparent shadow-sm hover:shadow-xl hover:scale-105 hover:border-lavender transition-all duration-300 active:scale-95"
              onClick={() => handleMoodClick(mood)}
              disabled={disabled}
              aria-label={MOOD_LABELS[mood]}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:rotate-6"
                style={{ backgroundColor: `${color}20` }} // 20% opacity background
              >
                <Icon
                  size={48}
                  color={color}
                  strokeWidth={2.5}
                  className="drop-shadow-sm"
                />
              </div>
              <span className="font-bold text-lg text-slate-600 group-hover:text-lavender-dark transition-colors">
                {MOOD_LABELS[mood]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
