import { useState, useEffect } from 'react';
import { MOVEMENT_STEPS, MOVEMENT_STEP_DURATION } from '../../utils/constants';
import './MovementExercise.css';

interface MovementExerciseProps {
  onComplete: () => void;
  onExit: () => void;
}

export function MovementExercise({ onComplete, onExit }: MovementExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStep >= MOVEMENT_STEPS.length - 1) {
            clearInterval(progressTimer);
            onComplete();
            return 100;
          } else {
            setCurrentStep(currentStep + 1);
            return 0;
          }
        }
        return prev + (100 / (MOVEMENT_STEP_DURATION * 10));
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, [currentStep, onComplete]);

  return (
    <div className="movement-exercise">
      <button className="exit-button" onClick={onExit} aria-label="Exit exercise">
        ✕
      </button>

      <div className="movement-header">
        <h2 className="movement-title">Movement Exercise</h2>
        <p className="movement-step-count">
          Step {currentStep + 1} of {MOVEMENT_STEPS.length}
        </p>
      </div>

      <div className="movement-visual">
        <div className="movement-icon">
          {currentStep === 0 && '🌳'}
          {currentStep === 1 && '💪'}
          {currentStep === 2 && '🙇'}
          {currentStep === 3 && '🔄'}
          {currentStep === 4 && '👋'}
          {currentStep === 5 && '😊'}
        </div>
      </div>

      <div className="movement-instruction">
        <p className="movement-text">{MOVEMENT_STEPS[currentStep]}</p>
        <div className="movement-progress-bar">
          <div
            className="movement-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="movement-timer">{Math.ceil((100 - progress) / 10)}s</p>
      </div>

      <button
        className="movement-next-button"
        onClick={() => {
          if (currentStep < MOVEMENT_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            setProgress(0);
          } else {
            onComplete();
          }
        }}
      >
        {currentStep < MOVEMENT_STEPS.length - 1 ? 'Next Step' : 'Finish'}
      </button>
    </div>
  );
}
