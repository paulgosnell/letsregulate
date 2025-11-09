import { motion } from 'framer-motion';

interface WaveBackgroundProps {
  amplitude?: number;
  frequency?: number;
  speed?: number;
  color?: string;
  className?: string;
}

export default function WaveBackground({
  amplitude: _amplitude = 20,
  frequency: _frequency = 0.01,
  speed: _speed = 0.5,
  color = '#E6D5F5',
  className = ''
}: WaveBackgroundProps) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}
    >
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 560"
      >
        <motion.path
          d="M0,320 C320,300 420,380 640,360 C860,340 1000,280 1440,300 L1440,560 L0,560 Z"
          fill={color}
          initial={{ d: "M0,320 C320,300 420,380 640,360 C860,340 1000,280 1440,300 L1440,560 L0,560 Z" }}
          animate={{
            d: [
              "M0,320 C320,300 420,380 640,360 C860,340 1000,280 1440,300 L1440,560 L0,560 Z",
              "M0,300 C320,330 420,340 640,380 C860,350 1000,310 1440,280 L1440,560 L0,560 Z",
              "M0,320 C320,300 420,380 640,360 C860,340 1000,280 1440,300 L1440,560 L0,560 Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M0,360 C360,340 540,400 720,380 C900,360 1080,320 1440,340 L1440,560 L0,560 Z"
          fill={color}
          opacity={0.5}
          initial={{ d: "M0,360 C360,340 540,400 720,380 C900,360 1080,320 1440,340 L1440,560 L0,560 Z" }}
          animate={{
            d: [
              "M0,360 C360,340 540,400 720,380 C900,360 1080,320 1440,340 L1440,560 L0,560 Z",
              "M0,340 C360,370 540,360 720,400 C900,380 1080,350 1440,320 L1440,560 L0,560 Z",
              "M0,360 C360,340 540,400 720,380 C900,360 1080,320 1440,340 L1440,560 L0,560 Z"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );
}
