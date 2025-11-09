import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart } from 'lucide-react';

export default function WhyItMatters() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-it-matters" className="relative bg-gradient-to-b from-cream to-peach-light overflow-hidden">
      {/* Floating bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-12 h-12 bg-rose-dark rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="section-container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex justify-center mb-8">
              <Heart className="w-16 h-16 text-rose-dark fill-rose-dark" />
            </div>

            <blockquote className="text-2xl sm:text-3xl md:text-4xl text-slate font-medium text-center leading-relaxed mb-8">
              "Children aren't born knowing how to regulate — it's something they learn.
              Let's Regulate helps them practice calm, confidence, and connection through play."
            </blockquote>

            <p className="text-base sm:text-lg text-center text-slate italic">
              Created by children's wellbeing specialists, blending neuroscience and heart.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
