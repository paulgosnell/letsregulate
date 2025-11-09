import { useState, useMemo } from 'react';
import { AFFIRMATIONS } from '../../utils/constants';
import { getRandomItems } from '../../utils/helpers';
import './AffirmationExercise.css';

interface AffirmationExerciseProps {
  onComplete: () => void;
  onExit: () => void;
}

const AFFIRMATIONS_COUNT = 5;

export function AffirmationExercise({ onComplete, onExit }: AffirmationExerciseProps) {
  const selectedAffirmations = useMemo(
    () => getRandomItems(AFFIRMATIONS, AFFIRMATIONS_COUNT),
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  const handleNext = () => {
    if (currentIndex < selectedAffirmations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowFinal(true);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (showFinal) {
    return (
      <div className="affirmation-exercise">
        <div className="affirmation-final">
          <div className="affirmation-final-icon">🌟</div>
          <h2 className="affirmation-final-title">You did great!</h2>
          <p className="affirmation-final-text">
            Remember these positive thoughts whenever you need them.
          </p>
          <button className="affirmation-complete-button" onClick={handleComplete}>
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="affirmation-exercise">
      <button className="exit-button" onClick={onExit} aria-label="Exit exercise">
        ✕
      </button>

      <div className="affirmation-header">
        <h2 className="affirmation-title">Positive Affirmations</h2>
        <p className="affirmation-count">
          {currentIndex + 1} of {selectedAffirmations.length}
        </p>
      </div>

      <div className="affirmation-card">
        <div className="affirmation-icon">✨</div>
        <p className="affirmation-text">{selectedAffirmations[currentIndex]}</p>
      </div>

      <div className="affirmation-dots">
        {selectedAffirmations.map((_, index) => (
          <div
            key={index}
            className={`affirmation-dot ${index === currentIndex ? 'active' : ''} ${
              index < currentIndex ? 'completed' : ''
            }`}
          />
        ))}
      </div>

      <button className="affirmation-next-button" onClick={handleNext}>
        {currentIndex < selectedAffirmations.length - 1 ? 'Next' : 'Complete'}
      </button>

      <p className="affirmation-hint">Read slowly and take a deep breath</p>
    </div>
  );
}
