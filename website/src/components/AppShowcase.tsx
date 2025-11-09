import { motion } from 'framer-motion';
import { Mic, MessageCircle } from 'lucide-react';
import { APP_URL } from '../utils/constants';

export default function AppShowcase() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-lavender-light to-cream">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Mobile Mockup */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating decoration bubbles */}
            <motion.div
              className="absolute -top-8 -left-8 w-20 h-20 rounded-full bg-mint opacity-20 blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-peach opacity-20 blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />

            {/* Phone Mockup */}
            <div className="relative z-10">
              {/* Phone Frame */}
              <div className="relative w-[300px] h-[600px] bg-slate rounded-[3rem] p-3 shadow-2xl">
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-lavender-light to-transparent z-10" />

                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate rounded-full z-20" />

                  {/* App Content */}
                  <div className="w-full h-full flex flex-col bg-cream pt-10">
                    {/* Header */}
                    <div className="px-6 py-4 text-center">
                      <h3 className="text-lg font-bold text-slate mb-1">Voice Chat</h3>
                      <p className="text-xs text-mint-dark font-semibold">Connected - You can talk now!</p>
                    </div>

                    {/* Voice Animation Container */}
                    <div className="flex-1 flex items-center justify-center px-6">
                      <div className="relative">
                        {/* Pulsing background */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-mint opacity-20 blur-xl"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />

                        {/* Voice Waves */}
                        <div className="relative flex items-center justify-center gap-1.5 h-24">
                          {[
                            { color: '#C4A7E7', delay: 0 },
                            { color: '#A4CAFE', delay: 0.1 },
                            { color: '#FFB3D1', delay: 0.2 },
                            { color: '#FFB4A2', delay: 0.3 },
                            { color: '#A8E6CF', delay: 0.4 },
                          ].map((wave, i) => (
                            <motion.div
                              key={i}
                              className="w-2 rounded-full"
                              style={{ backgroundColor: wave.color }}
                              animate={{
                                height: ['30%', '100%', '30%'],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: wave.delay,
                              }}
                            />
                          ))}
                        </div>

                        {/* Microphone Icon */}
                        <motion.div
                          className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-mint flex items-center justify-center shadow-lg"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Mic className="w-6 h-6 text-white" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Transcript Preview */}
                    <div className="px-4 pb-4">
                      <div className="bg-lavender-light rounded-2xl p-3 text-xs">
                        <p className="font-semibold text-lavender-dark mb-1">Regulation Buddy:</p>
                        <p className="text-slate leading-relaxed">
                          Hi there! I heard you're feeling happy today. That's wonderful! Want to tell me more about it?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Shadow */}
                <div className="absolute inset-0 rounded-[3rem] shadow-inner pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Promotional Text */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block px-4 py-2 bg-mint-light rounded-full">
              <p className="text-sm font-semibold text-mint-dark">Introducing Voice Chat</p>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate leading-tight">
              Talk to your{' '}
              <span className="bg-gradient-to-r from-lavender-dark via-mint-dark to-sky-dark bg-clip-text text-transparent">
                Regulation Buddy
              </span>
            </h2>

            <p className="text-lg text-slate leading-relaxed">
              Our AI-powered voice companion creates a safe space for children to express their feelings.
              With warm, patient responses and age-appropriate guidance, kids can talk through their emotions
              whenever they need support.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lavender-light flex items-center justify-center">
                  <Mic className="w-6 h-6 text-lavender-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-slate mb-1">Natural Voice Conversations</h3>
                  <p className="text-slate-light leading-relaxed">
                    Just like talking to a friend. No typing needed—perfect for younger children or when words are hard to find.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sky-light flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-sky-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-slate mb-1">Always Understanding</h3>
                  <p className="text-slate-light leading-relaxed">
                    Regulation Buddy listens without judgment, validates feelings, and gently guides children toward helpful coping strategies.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                <button className="btn-primary text-lg">
                  Launch App
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
