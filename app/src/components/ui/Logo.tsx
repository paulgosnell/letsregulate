import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Logo({
  size = 'medium',
  className = ''
}: LogoProps) {
  const dimensions = {
    small: { width: 180, height: 80 },
    medium: { width: 280, height: 120 },
    large: { width: 400, height: 180 }
  };

  const { width, height } = dimensions[size];

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 400 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <defs>
        {/* Circle gradient */}
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6D5F5" />
          <stop offset="50%" stopColor="#D9E8FF" />
          <stop offset="100%" stopColor="#FFE5D9" />
        </linearGradient>

        {/* Wave gradient */}
        <linearGradient id="logoWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C4A7E7" />
          <stop offset="50%" stopColor="#A4CAFE" />
          <stop offset="100%" stopColor="#FFB3D1" />
        </linearGradient>

        {/* Text gradient */}
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9B7EBD" />
          <stop offset="50%" stopColor="#6FA3E0" />
          <stop offset="100%" stopColor="#FF8BB8" />
        </linearGradient>
      </defs>

      {/* Circle background */}
      <motion.circle
        cx="200"
        cy="90"
        r="75"
        fill="url(#circleGradient)"
        opacity="0.3"
        initial={{ scale: 0.95 }}
        animate={{ scale: [0.95, 1, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Circle stroke */}
      <circle
        cx="200"
        cy="90"
        r="75"
        fill="none"
        stroke="url(#circleGradient)"
        strokeWidth="3"
        opacity="0.6"
      />

      {/* Wave at bottom of circle */}
      <motion.path
        d="M 130 130 Q 165 115 200 130 T 270 130"
        fill="none"
        stroke="url(#logoWaveGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: 1,
          d: [
            "M 130 130 Q 165 115 200 130 T 270 130",
            "M 130 130 Q 165 145 200 130 T 270 130",
            "M 130 130 Q 165 115 200 130 T 270 130"
          ]
        }}
        transition={{
          pathLength: { duration: 1.5, ease: "easeInOut" },
          d: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Text: "Lets Regulate" */}
      <text
        x="200"
        y="95"
        fontFamily="Quicksand, Nunito, sans-serif"
        fontSize="38"
        fontWeight="700"
        textAnchor="middle"
        fill="url(#textGradient)"
        style={{ letterSpacing: '0.5px' }}
      >
        <tspan x="200" dy="0">Lets Regulate</tspan>
      </text>
    </motion.svg>
  );
}
