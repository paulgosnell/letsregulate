import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import WaveBackground from './WaveBackground';
import BreathingAnimation from './BreathingAnimation';
import EmailSignup from './EmailSignup';

export default function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleEmailSubmit = async (email: string) => {
    // Simulate API call
    console.log('Email submitted:', email);
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
  };

  return (
    <section id="cta" className="relative bg-gradient-to-b from-peach-light to-lavender overflow-hidden min-h-[600px] flex items-center">
      <WaveBackground color="#9B7EBD" className="opacity-50" />

      <div className="absolute top-1/4 left-10 opacity-40">
        <BreathingAnimation size={150} color="#C4A7E7" opacity={0.6} />
      </div>

      <div className="absolute bottom-1/4 right-10 opacity-40">
        <BreathingAnimation size={120} color="#A4CAFE" opacity={0.6} />
      </div>

      <div className="section-container relative z-10 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate mb-8 max-w-4xl mx-auto leading-tight">
            Join thousands of parents helping their children feel calm, connected, and confident.
          </h2>

          <EmailSignup
            placeholder="Enter your email"
            buttonText="Join the Waitlist"
            onSubmit={handleEmailSubmit}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate text-sm mt-6 opacity-80"
          >
            We respect your privacy. Unsubscribe anytime.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
