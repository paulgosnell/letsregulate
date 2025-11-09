import { motion } from 'framer-motion';

interface BreathingAnimationProps {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

export default function BreathingAnimation({
  size = 120,
  color = '#8B9D83',
  opacity = 0.3,
  className = ''
}: BreathingAnimationProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          opacity: opacity
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
        className="rounded-full absolute"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          backgroundColor: '#D5F5E6', // mint-light for better contrast
          opacity: opacity * 1.8
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [opacity * 1.8, opacity * 2.5, opacity * 1.8]
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
