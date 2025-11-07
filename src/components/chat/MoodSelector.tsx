import { MoodType } from '../../types';
import { MOOD_EMOJIS, MOOD_LABELS } from '../../utils/constants';
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
      <p className="mood-subtitle">Pick the emoji that matches your mood</p>

      <div className="mood-grid">
        {MOODS.map((mood) => (
          <button
            key={mood}
            className="mood-button"
            onClick={() => handleMoodClick(mood)}
            disabled={disabled}
            aria-label={MOOD_LABELS[mood]}
          >
            <span className="mood-emoji">{MOOD_EMOJIS[mood]}</span>
            <span className="mood-label">{MOOD_LABELS[mood]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
