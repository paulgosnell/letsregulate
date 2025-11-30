import { motion } from 'framer-motion';
import { Wind, Users, Sparkles } from 'lucide-react';
import WaveBackground from './WaveBackground';
import Logo from './Logo';
import { APP_URL } from '../utils/constants';

export default function Hero() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-lavender-light to-sky-light">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <WaveBackground color="#9B7EBD" className="opacity-30 animate-pulse" />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-light rounded-full blur-3xl opacity-40 animate-blob" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-sky-light rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000" />
                <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-mint-light rounded-full blur-3xl opacity-40 animate-blob animation-delay-4000" />
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
                    <Logo size="medium" />
                    <div className="flex gap-4">
                        <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                            <button className="px-6 py-2.5 rounded-full bg-white hover:bg-lavender-light text-lavender-dark font-semibold transition-all shadow-md hover:shadow-lg">
                                Launch App
                            </button>
                        </a>
                    </div>
                </div>
            </div>

            <div className="section-container relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-20">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-white/50 border border-white/60 backdrop-blur-md text-slate-600 font-medium text-sm mb-6 shadow-sm"
                    >
                        ✨ The #1 Wellbeing Toolkit for Kids
                    </motion.div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate mb-6 leading-[1.1] tracking-tight">
                        Emotional balance, <br />
                        <span className="bg-gradient-to-r from-lavender-dark via-rose-dark to-sky-dark bg-clip-text text-transparent animate-gradient-x">
                            made magical.
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                        Let's Regulate transforms emotional learning into a playful adventure.
                        Helping children feel safe, strong, and seen through science-backed mindfulness.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                            <button className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-lavender to-lavender-dark border-none">
                                Get Started Free
                            </button>
                        </a>
                        <button
                            onClick={() => scrollToSection('what-it-is')}
                            className="px-8 py-4 rounded-full bg-white/40 hover:bg-white/60 text-slate-700 font-semibold transition-all border border-white/60 backdrop-blur-md flex items-center gap-2 group"
                        >
                            How it Works
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>

                    <div className="mt-12 flex items-center gap-4 text-sm text-slate-500 font-medium">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white flex items-center justify-center text-xs">
                                    User
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 1,000+ families & schools</p>
                    </div>
                </motion.div>

                {/* Right Content - Magical Toolkit Visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden lg:flex items-center justify-center h-[600px]"
                >
                    {/* Central Glowing Core */}
                    <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-lavender/40 to-sky/40 rounded-full blur-3xl animate-pulse" />

                    {/* Orbiting System Container */}
                    <div className="relative w-[400px] h-[400px]">
                        {/* Center Hub */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 m-auto w-48 h-48 bg-white/30 backdrop-blur-md rounded-full border border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.5)] flex items-center justify-center z-20 overflow-hidden"
                        >
                            <div className="relative w-full h-full">
                                <video
                                    className="w-full h-full object-cover opacity-90"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source
                                        src="https://wgrqgcwabpebxtkwmnkb.supabase.co/storage/v1/object/public/video/lumna.mov"
                                        type="video/quicktime"
                                    />
                                    <source
                                        src="https://wgrqgcwabpebxtkwmnkb.supabase.co/storage/v1/object/public/video/lumna.mov"
                                        type="video/mp4"
                                    />
                                </video>
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <span className="font-bold text-slate-700 text-lg tracking-wide bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">Luma</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Orbiting Card 1: Breathe (Top Left) */}
                        <motion.div
                            animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                            className="absolute top-0 left-0 w-32 h-32 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl flex flex-col items-center justify-center gap-2 z-30 transform hover:scale-110 transition-transform cursor-pointer group"
                        >
                            <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center group-hover:bg-mint/30 transition-colors">
                                <Wind className="w-6 h-6 text-mint-dark" />
                            </div>
                            <span className="font-semibold text-slate-600 text-sm">Breathe</span>
                        </motion.div>

                        {/* Orbiting Card 2: Move (Right) */}
                        <motion.div
                            animate={{ y: [10, -10, 10], x: [10, -10, 10] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute top-1/3 -right-8 w-32 h-32 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl flex flex-col items-center justify-center gap-2 z-10 transform hover:scale-110 transition-transform cursor-pointer group"
                        >
                            <div className="w-12 h-12 rounded-full bg-peach/20 flex items-center justify-center group-hover:bg-peach/30 transition-colors">
                                <Users className="w-6 h-6 text-peach-dark" />
                            </div>
                            <span className="font-semibold text-slate-600 text-sm">Move</span>
                        </motion.div>

                        {/* Orbiting Card 3: Feel (Bottom Left) */}
                        <motion.div
                            animate={{ y: [-5, 5, -5], x: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute bottom-0 left-8 w-32 h-32 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl flex flex-col items-center justify-center gap-2 z-30 transform hover:scale-110 transition-transform cursor-pointer group"
                        >
                            <div className="w-12 h-12 rounded-full bg-lavender/20 flex items-center justify-center group-hover:bg-lavender/30 transition-colors">
                                <Sparkles className="w-6 h-6 text-lavender-dark" />
                            </div>
                            <span className="font-semibold text-slate-600 text-sm">Feel</span>
                        </motion.div>

                        {/* Connecting Lines (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0">
                            <motion.path
                                d="M 100 100 L 200 200"
                                stroke="#9B7EBD"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                animate={{ strokeDashoffset: [0, 10] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.path
                                d="M 300 150 L 200 200"
                                stroke="#9B7EBD"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                animate={{ strokeDashoffset: [0, -10] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.path
                                d="M 120 300 L 200 200"
                                stroke="#9B7EBD"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                animate={{ strokeDashoffset: [0, 10] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </svg>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
