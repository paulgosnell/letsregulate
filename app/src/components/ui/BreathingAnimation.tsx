import { motion } from 'framer-motion';

interface BreathingAnimationProps {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

export default function BreathingAnimation({
  size = 120,
  color = '#C4A7E7',
  opacity = 0.3,
  className = ''
}: BreathingAnimationProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          opacity: opacity,
          borderRadius: '50%'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [opacity, opacity * 1.5, opacity]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: size * 0.7,
          height: size * 0.7,
          backgroundColor: color,
          opacity: opacity * 1.5,
          borderRadius: '50%'
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [opacity * 1.5, opacity * 2, opacity * 1.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
