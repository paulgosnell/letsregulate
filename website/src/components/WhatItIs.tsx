import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import BreathingAnimation from './BreathingAnimation';

export default function WhatItIs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="what-it-is" className="relative bg-gradient-to-b from-lavender-light to-cream">
      <div className="section-container" ref={ref}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              <BreathingAnimation size={280} color="#7BC9A6" opacity={0.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-4 border-mint-dark rounded-full border-t-transparent"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate mb-6">
              What is Let's Regulate?
            </h2>
            <div className="space-y-4 text-base sm:text-lg text-slate leading-relaxed">
              <p>
                Let's Regulate is an AI-powered wellbeing toolkit for children — blending
                mindfulness, breathwork, and creative play to build emotional balance.
              </p>
              <p>
                Children learn to recognise their feelings, calm their bodies, and find confidence
                through guided games, stories, and exercises.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
