import React from "react";
import { BookOpen, GraduationCap, Video, Sparkles, Mail } from "lucide-react";
import { motion } from "framer-motion";

// Add a small local FadeIn to avoid missing import errors
const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const Courses = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-2 pb-8 px-4 md:px-8 transition-colors duration-500 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
        <FadeIn>
          {/* <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 mb-6 md:mb-8 shadow-lg shadow-emerald-500/20">
            <BookOpen size={32} className="md:w-10 md:h-10" strokeWidth={1.5} />
          </div> */}

          <h1 className="text-4xl md:text-7xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6 tracking-tight leading-tight">
            Courses
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
              Coming Soon
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-12">
            Learn from curated masterclasses, hands-on projects, and real-world
            examples. Upskill yourself with content crafted for founders,
            creators, and innovators.
          </p>
        </FadeIn>

        {/* Feature Cards */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-3 md:mb-4">
                <GraduationCap size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1">
                Expert-Led
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Learn directly from industry professionals.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-3 md:mb-4">
                <Video size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1">
                Video Lessons
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                High-quality structured learning modules.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-3 md:mb-4">
                <Sparkles size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1">
                Hands-On Projects
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Build real projects step-by-step.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Notify Section */}
        <FadeIn delay={0.4}>
          <div className="mt-12 md:mt-16 bg-white dark:bg-slate-900/50 p-2 md:p-1 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2 shadow-lg">
            <div className="hidden sm:block pl-4 text-slate-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder="Join the waitlist for course updates"
              className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 h-12 px-4 text-center sm:text-left"
            />
            <button className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3 md:py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
              Notify Me
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Be the first to access new courses.
          </p>
        </FadeIn>
      </div>
    </div>
  );
};

export default Courses;
