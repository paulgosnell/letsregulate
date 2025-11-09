import { useState, useEffect } from 'react';
import { BREATHING_CYCLE_DURATION, BREATHING_CYCLES_TOTAL } from '../../utils/constants';
import './BreathingExercise.css';

interface BreathingExerciseProps {
  onComplete: () => void;
  onExit: () => void;
}

type BreathingPhase = 'in' | 'hold1' | 'out' | 'hold2';

const PHASE_LABELS: Record<BreathingPhase, string> = {
  in: 'Breathe in...',
  hold1: 'Hold...',
  out: 'Breathe out...',
  hold2: 'Hold...'
};

const PHASES: BreathingPhase[] = ['in', 'hold1', 'out', 'hold2'];

export function BreathingExercise({ onComplete, onExit }: BreathingExerciseProps) {
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('in');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next phase
          const currentPhaseIndex = PHASES.indexOf(currentPhase);
          if (currentPhaseIndex === PHASES.length - 1) {
            // End of cycle
            if (currentCycle >= BREATHING_CYCLES_TOTAL) {
              clearInterval(phaseTimer);
              onComplete();
              return 100;
            } else {
              setCurrentCycle(currentCycle + 1);
              setCurrentPhase('in');
              return 0;
            }
          } else {
            setCurrentPhase(PHASES[currentPhaseIndex + 1]);
            return 0;
          }
        }
        return prev + (100 / (BREATHING_CYCLE_DURATION * 10));
      });
    }, 100);

    return () => clearInterval(phaseTimer);
  }, [currentPhase, currentCycle, onComplete]);

  const circleScale = currentPhase === 'in' ? 1 + (progress / 100) * 0.5 : currentPhase === 'out' ? 1.5 - (progress / 100) * 0.5 : currentPhase === 'hold1' ? 1.5 : 1;

  return (
    <div className="breathing-exercise">
      <button className="exit-button" onClick={onExit} aria-label="Exit exercise">
        ✕
      </button>

      <div className="breathing-header">
        <h2 className="breathing-title">Breathing Exercise</h2>
        <p className="breathing-cycle">
          Cycle {currentCycle} of {BREATHING_CYCLES_TOTAL}
        </p>
      </div>

      <div className="breathing-visual">
        <div
          className="breathing-circle"
          style={{
            transform: `scale(${circleScale})`,
            transition: 'transform 0.1s linear'
          }}
        >
          <div className="breathing-circle-inner"></div>
        </div>
      </div>

      <div className="breathing-instruction">
        <p className="breathing-text">{PHASE_LABELS[currentPhase]}</p>
        <div className="breathing-progress-bar">
          <div
            className="breathing-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <p className="breathing-hint">Follow the circle as it grows and shrinks</p>
    </div>
  );
}
