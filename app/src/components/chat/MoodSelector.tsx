import { MoodType } from '../../types';
import { MOOD_ICONS, MOOD_LABELS, MOOD_COLORS } from '../../utils/constants';
import { playHapticFeedback } from '../../utils/helpers';
import './MoodSelector.css';

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
    <div className="mood-selector">
      <h2 className="mood-title">How are you feeling?</h2>
      <p className="mood-subtitle">Pick the icon that matches your mood</p>

      <div className="mood-grid">
        {MOODS.map((mood) => {
          const Icon = MOOD_ICONS[mood];
          return (
            <button
              key={mood}
              className="mood-button"
              onClick={() => handleMoodClick(mood)}
              disabled={disabled}
              aria-label={MOOD_LABELS[mood]}
            >
              <Icon className="mood-icon" size={48} color={MOOD_COLORS[mood]} strokeWidth={2} />
              <span className="mood-label">{MOOD_LABELS[mood]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
