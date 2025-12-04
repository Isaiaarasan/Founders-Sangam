import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Import Shared Components
import FadeIn from "../components/FadeIn";
import Counter from "../components/Counter";

const EventsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      <section className="relative w-full flex flex-col items-center justify-center overflow-hidden pt-28 md:pt-27 pb-12">
        {/* Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-100/40 dark:bg-amber-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"
          />
          <motion.div
            animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-sky-100/40 dark:bg-sky-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"
          />
        </div>

        <FadeIn className="w-full relative flex flex-col items-center justify-center max-w-7xl mx-auto text-center z-10">
          <h1 className="text-6xl md:text-8xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
            UPCOMING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-sky-500">
              EVENTS
            </span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            Connect, Learn, and Grow with fellow founders.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/payment")}
              className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-800 hover:scale-105 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-all flex items-center gap-2 shadow-xl"
            >
              Join Community <ArrowRight size={20} />
            </button>
          </div>
        </FadeIn>
      </section>

      <section className="py-20 w-full px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-4xl font-bold dark:text-white">
              <Counter value={50} suffix="+" />
            </h3>
            <p className="text-slate-500">Founders</p>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-4xl font-bold dark:text-white">
              <Counter value={100} suffix="%" />
            </h3>
            <p className="text-slate-500">Growth</p>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-4xl font-bold dark:text-white">
              <Counter value={1} suffix="" />
            </h3>
            <p className="text-slate-500">Community</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;