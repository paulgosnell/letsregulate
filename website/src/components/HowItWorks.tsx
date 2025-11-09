import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { User, MessageCircle, Gift } from 'lucide-react';

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      title: "Create your profile",
      description: "Personalise your toolkit with your child's age, interests, and needs.",
      icon: User,
      colorClass: "bg-lavender"
    },
    {
      title: "Choose how you feel today",
      description: "Calm, tired, motivated, worried…",
      icon: MessageCircle,
      colorClass: "bg-sky"
    },
    {
      title: "Get your tools",
      description: "Breathing games, creative prompts, affirmations, and mindful movement designed just for you.",
      icon: Gift,
      colorClass: "bg-peach"
    }
  ];

  return (
    <section id="how-it-works" className="relative bg-cream">
      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate mb-4">
            How It Works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="card text-center"
            >
              <div className="relative mb-6 flex justify-center">
                <div className={`w-20 h-20 ${step.colorClass} rounded-full flex items-center justify-center`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate mb-4">
                {step.title}
              </h3>
              <p className="text-base text-slate leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary text-lg"
          >
            Start building your toolkit
          </button>
        </motion.div>
      </div>
    </section>
  );
}
