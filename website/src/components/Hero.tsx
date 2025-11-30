import { motion } from 'framer-motion';
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between backdrop-blur-sm bg-white/10 rounded-b-2xl mx-4 mt-2 border border-white/20 shadow-sm">
                    <Logo size="medium" />
                    <div className="flex gap-4">
                        <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                            <button className="px-6 py-2.5 rounded-full bg-white/80 hover:bg-white text-lavender-dark font-semibold transition-all shadow-lg hover:shadow-xl border border-white/50 backdrop-blur-md">
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

                {/* Right Content - Floating 3D Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 50, rotate: 5 }}
                    animate={{ opacity: 1, y: 0, rotate: -2 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring" }}
                    className="relative hidden lg:block"
                >
                    {/* Decorative circles behind */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-lavender/30 to-sky/30 rounded-full blur-3xl animate-pulse" />

                    {/* Container for Phone + Floaters */}
                    <div className="relative w-full max-w-md mx-auto aspect-[4/5] transform hover:scale-[1.02] transition-transform duration-500">
                        {/* Glass Card Mockup (Clipped) */}
                        <div className="absolute inset-0 rounded-[2.5rem] bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl p-6 flex flex-col overflow-hidden z-10">
                            {/* Mockup Header */}
                            <div className="flex items-center justify-between mb-8 opacity-80">
                                <div className="w-8 h-8 rounded-full bg-white/40" />
                                <div className="w-24 h-4 rounded-full bg-white/40" />
                                <div className="w-8 h-8 rounded-full bg-white/40" />
                            </div>

                            {/* Mockup Content */}
                            <div className="space-y-6 flex-1">
                                <div className="h-48 rounded-3xl bg-gradient-to-br from-lavender-light to-white/50 w-full animate-pulse" />
                                <div className="space-y-3">
                                    <div className="h-6 w-3/4 bg-white/40 rounded-full" />
                                    <div className="h-4 w-full bg-white/20 rounded-full" />
                                    <div className="h-4 w-5/6 bg-white/20 rounded-full" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="h-32 rounded-2xl bg-mint-light/50 backdrop-blur-sm p-4">
                                        <div className="w-8 h-8 rounded-full bg-mint mb-2" />
                                        <div className="h-3 w-20 bg-mint-dark/20 rounded-full" />
                                    </div>
                                    <div className="h-32 rounded-2xl bg-peach-light/50 backdrop-blur-sm p-4">
                                        <div className="w-8 h-8 rounded-full bg-peach mb-2" />
                                        <div className="h-3 w-20 bg-peach-dark/20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements around mockup (Unclipped) */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-xl z-20"
                        >
                            <span className="text-2xl">🧘‍♀️</span>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -left-8 bottom-32 bg-white p-4 rounded-2xl shadow-xl z-20"
                        >
                            <span className="text-2xl">✨</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
