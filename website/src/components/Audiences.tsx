import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, GraduationCap } from 'lucide-react';

export default function Audiences() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const audiences = [
    {
      title: "For Parents",
      icon: Users,
      description: "Tools for home calm time, emotional check-ins, and positive family moments.",
      colorClass: "bg-mint"
    },
    {
      title: "For Schools",
      icon: GraduationCap,
      description: "Whole-class wellbeing lessons and simple self-regulation tools for the school day.",
      colorClass: "bg-sky"
    }
  ];

  return (
    <section id="audiences" className="relative bg-cream">
      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate mb-4">
            For Everyone Who Cares
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="card hover:scale-105 transition-transform duration-300"
            >
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto ${audience.colorClass} rounded-full flex items-center justify-center mb-6`}>
                  <audience.icon className="w-12 h-12 text-slate" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-slate mb-4">
                  {audience.title}
                </h3>
                <p className="text-base sm:text-lg text-slate leading-relaxed">
                  {audience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
