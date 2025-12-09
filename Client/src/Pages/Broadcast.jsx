import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Mic, BellRing, Mail } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const Broadcast = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-1 pb-4 px-4 md:px-12 transition-colors duration-500 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-amber-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-red-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
            </div>

            <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
                <FadeIn>
                    {/* <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 mb-6 md:mb-8 shadow-lg shadow-amber-500/20">
                        <Radio size={32} className="md:w-10 md:h-10" strokeWidth={1.5} />
                    </div> */}

                    <h1 className="text-4xl md:text-7xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6 tracking-tight leading-tight">
                        Broadcasts <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600">
                            Coming Soon
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-12">
                        We're building a dedicated space for founder stories, expert interviews, and live sessions.
                        Stay tuned for a new way to connect and learn.
                    </p>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
                        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col items-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-3 md:mb-4">
                                <Mic size={20} className="md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 md:mb-2">Podcasts</h3>
                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Deep dives with industry leaders.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col items-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-3 md:mb-4">
                                <Radio size={20} className="md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 md:mb-2">Live Sessions</h3>
                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Real-time Q&A and workshops.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col items-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-3 md:mb-4">
                                <BellRing size={20} className="md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 md:mb-2">Updates</h3>
                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Latest community news.</p>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.4}>
                    <div className="mt-12 md:mt-16 bg-white dark:bg-slate-900/50 p-2 md:p-1 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2 shadow-lg">
                        <div className="hidden sm:block pl-4 text-slate-400">
                            <Mail size={20} />
                        </div>
                        <input
                            type="email"
                            placeholder="Enter your email for updates"
                            className="w-full sm:flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 h-12 px-4 text-center sm:text-left"
                        />
                        <button className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3 md:py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                            Notify Me
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">No spam. Only announcements.</p>
                </FadeIn>
            </div>
        </div>
    );
};

export default Broadcast;
