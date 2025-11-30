import { motion } from 'framer-motion';
import WaveBackground from './WaveBackground';
import BreathingAnimation from './BreathingAnimation';
import Logo from './Logo';
import { APP_URL } from '../utils/constants';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cream to-lavender-light">
      <WaveBackground color="#9B7EBD" className="opacity-40" />

      {/* Header with Logo and Launch App */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Logo size="medium" />
          <a href={APP_URL} target="_blank" rel="noopener noreferrer">
            <button className="btn-primary text-base">
              Launch App
            </button>
          </a>
        </div>
      </div>

      {/* Large bubble - bottom right (100px from bottom) */}
      <div className="absolute bottom-[100px] right-8 z-10">
        <BreathingAnimation size={100} color="#6FA3E0" opacity={0.4} />
      </div>

      {/* Small bubble - left side, vertically centered */}
      <div className="absolute top-1/2 -translate-y-1/2 left-12 z-10">
        <BreathingAnimation size={60} color="#FFB3D1" opacity={0.35} />
      </div>

      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            A lifelong toolkit for
            <br />
            <span className="bg-gradient-to-r from-lavender-dark via-sky-dark to-rose-dark bg-clip-text text-transparent">emotional wellbeing</span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl md:text-3xl text-slate mb-8 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Helping children feel safe, strong and seen.
          </motion.p>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-slate max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Let's Regulate gives families and schools the tools to understand emotions,
            find calm, and grow confident together.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <a href={APP_URL} target="_blank" rel="noopener noreferrer">
              <button className="btn-primary text-lg">
                Get Started
              </button>
            </a>
            <button
              onClick={() => scrollToSection('what-it-is')}
              className="btn-secondary text-lg"
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
