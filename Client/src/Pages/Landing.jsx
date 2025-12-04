import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Users, Rocket, MapPin } from "lucide-react";

// Import Shared Components
import FadeIn from "../components/FadeIn";
import Counter from "../components/Counter";

// --- Theme Constants ---
const BRAND_COLORS = {
  yellow: "from-amber-400 to-yellow-500",
  red: "from-red-500 to-rose-600",
  green: "from-emerald-500 to-green-600",
  blue: "from-sky-500 to-blue-600",
};

// --- Hero Section ---
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 pt-28 md:pt-27 pb-12 transition-colors duration-500">
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
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-red-50/40 dark:bg-red-900/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="w-full px-6 md:px-12 relative z-10 h-full flex flex-col justify-center">
        <FadeIn className="w-full relative flex flex-col items-center justify-center max-w-7xl mx-auto text-center">
          {/* Logo Animation Rings */}
          <div className="relative w-64 h-32 mb-12 flex justify-center items-center">
            {[
              { color: "border-amber-400", delay: 0, x: -70 },
              { color: "border-red-500", delay: 0.1, x: -25 },
              { color: "border-emerald-500", delay: 0.2, x: 25 },
              { color: "border-sky-500", delay: 0.3, x: 70 },
            ].map((ring, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5, x: ring.x }}
                animate={{
                  opacity: [0, 1, 1, 1, 1, 0],
                  scale: [0.5, 1, 1, 1, 1, 0.5],
                  x: [ring.x, ring.x, ring.x, ring.x * 40, ring.x, ring.x],
                }}
                transition={{
                  duration: 8,
                  times: [0, 0.1, 0.6, 0.75, 0.9, 1],
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: ring.delay,
                }}
                className={`absolute w-32 h-32 rounded-full border-[12px] ${ring.color} mix-blend-multiply dark:mix-blend-screen opacity-80 bg-white/10 dark:bg-black/10`}
              />
            ))}
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white leading-[0.9] transition-colors duration-500">
            FOUNDERS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-sky-500">
              SANGAM
            </span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl font-medium transition-colors duration-500">
            A circle of bold founders shaping what’s next. <br />
            <span className="text-black dark:text-white font-semibold">
              Networking. Collaboration. Growth.
            </span>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => navigate("/payment")}
              className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-800 hover:scale-105 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-all flex items-center gap-2 shadow-xl shadow-slate-200 dark:shadow-slate-900/50"
            >
              Apply for Membership <ArrowRight size={20} />
            </button>

            <button
              onClick={() => navigate("/events")}
              className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800 transition-all"
            >
              Explore Events
            </button>
          </motion.div>
        </FadeIn>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-300 dark:text-slate-600"
      >
        <ArrowRight className="rotate-90" />
      </motion.div>
    </section>
  );
};

// --- Manifesto Marquee ---
const ManifestoMarquee = () => {
  const manifestoItems = [
    { text: "NETWORKING", color: "text-amber-500", dot: "bg-amber-400" },
    { text: "COLLABORATION", color: "text-red-500", dot: "bg-red-500" },
    { text: "GROWTH", color: "text-emerald-500", dot: "bg-emerald-500" },
    { text: "CULTURE", color: "text-sky-500", dot: "bg-sky-500" },
  ];

  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900 relative overflow-hidden flex flex-col justify-center border-y border-slate-200 dark:border-slate-800 transition-colors duration-500">
      <div className="relative z-10">
        <div className="flex overflow-hidden whitespace-nowrap">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-12 pr-12"
          >
            {[...Array(2)].map((_, setIndex) => (
              <React.Fragment key={setIndex}>
                {manifestoItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-12">
                    <span
                      className={`text-5xl md:text-8xl font-black ${item.color} tracking-tighter`}
                    >
                      {item.text}
                    </span>
                    <span
                      className={`w-4 h-4 md:w-8 md:h-8 rounded-full ${item.dot}`}
                    ></span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Stats Section ---
const StatsSection = () => {
  const navigate = useNavigate();
  const StatsCard = ({ value, label, delay, gradient, icon: Icon, onClick, href }) => {
    const CardContent = (
      <FadeIn
        delay={delay}
        className="flex flex-col gap-6 p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group relative overflow-hidden cursor-pointer h-full"
      >
        <div
          className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}
        ></div>
        <div className="flex justify-between items-start relative z-10">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg transform group-hover:-rotate-6 transition-transform`}
          >
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <div className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-600 flex items-center justify-center text-slate-300 dark:text-slate-500 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all">
            <ArrowRight size={18} />
          </div>
        </div>
        <div className="mt-4 relative z-10">
          <h3 className="text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-semibold uppercase text-xs tracking-widest mt-2">
            {label}
          </p>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1.5, delay: delay + 0.2, ease: "circOut" }}
            className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
          />
        </div>
      </FadeIn>
    );

    if (href) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
          {CardContent}
        </a>
      );
    }

    return (
      <div onClick={onClick} className="block h-full">
        {CardContent}
      </div>
    );
  };

  return (
    <section className="py-32 bg-white dark:bg-slate-950 w-full px-6 md:px-12 relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto mb-16 text-left">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            Building a startup culture, <br />
            <span className="text-slate-400 dark:text-slate-600">
              in the heart of Tirupur.
            </span>
          </h2>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <StatsCard
          value={<Counter value={50} suffix="+" />}
          label="Bold Founders"
          delay={0.1}
          gradient={BRAND_COLORS.yellow}
          icon={Users}
          onClick={() => navigate("/founders")}
        />
        <StatsCard
          value={<Counter value={100} suffix="%" />}
          label="Real Stories"
          delay={0.2}
          gradient={BRAND_COLORS.red}
          icon={Rocket}
          href="https://www.instagram.com/reel/DRowdVdktsr/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        />
        <StatsCard
          value={<Counter value={1} suffix="" />}
          label="Tirupur Base"
          delay={0.3}
          gradient={BRAND_COLORS.blue}
          icon={MapPin}
          href="https://maps.app.goo.gl/n85Qmnk7xSRXTjrVA"
        />
      </div>
    </section>
  );
};

// --- Founders Section ---
const FoundersSection = () => {
  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900 w-full px-6 md:px-12 relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-16 text-center">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">Visionaries</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Founder 1 */}
          <FadeIn delay={0.1} className="flex flex-col items-center">
            <div className="w-64 h-64 rounded-full bg-slate-200 dark:bg-slate-800 mb-6 overflow-hidden shadow-xl border-4 border-white dark:border-slate-700">
              {/* Replace with actual image */}
              <img src="https://via.placeholder.com/300" alt="Founder" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Founder Name</h3>
            <p className="text-amber-500 font-semibold mb-4">Founder</p>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
              "Building communities that empower the next generation of entrepreneurs in Tirupur."
            </p>
          </FadeIn>

          {/* Founder 2 */}
          <FadeIn delay={0.2} className="flex flex-col items-center">
            <div className="w-64 h-64 rounded-full bg-slate-200 dark:bg-slate-800 mb-6 overflow-hidden shadow-xl border-4 border-white dark:border-slate-700">
              {/* Replace with actual image */}
              <img src="https://via.placeholder.com/300" alt="Co-Founder" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Co-Founder Name</h3>
            <p className="text-red-500 font-semibold mb-4">Co-Founder</p>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
              "Connecting minds, sharing stories, and fostering growth for every startup journey."
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// --- Value Section ---
const ValueSection = () => {
  return (
    <section className="py-32 bg-white dark:bg-slate-950 overflow-hidden w-full relative transition-colors duration-500">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:44px_44px]"></div>
      <div className="px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <FadeIn>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest text-sm uppercase mb-4 block">
                Our Core Purpose
              </span>
              <h2 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                Shaping <br />{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-600">
                  What's Next.
                </span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                Founders Sangam is a Tirupur-based entrepreneurial networking
                community that brings together startup founders, business
                leaders, and innovators.
              </p>
              <button className="text-slate-900 dark:text-white font-bold border-b-2 border-slate-900 dark:border-white pb-1 hover:text-emerald-600 hover:border-emerald-600 dark:hover:text-emerald-400 dark:hover:border-emerald-400 transition-colors">
                Read our Vision
              </button>
            </FadeIn>
          </div>
          <div className="w-full md:w-1/2 relative h-[500px] flex items-center justify-center">
            <motion.div
              initial={{ rotate: 0 }}
              whileInView={{ rotate: 90 }}
              transition={{ duration: 2, ease: "backOut" }}
              viewport={{ margin: "-100px" }}
              className="relative z-10 w-80 h-80 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img
                src="/Images/Founder_Sangam.png"
                alt="Collaboration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/20 mix-blend-overlay"></div>
            </motion.div>
            <motion.div
              initial={{ x: 0, y: 0 }}
              whileInView={{ x: 40, y: -40 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="absolute w-80 h-80 border-4 border-amber-400 rounded-[3rem] mix-blend-multiply dark:mix-blend-color-dodge opacity-60"
            />
            <motion.div
              initial={{ x: 0, y: 0 }}
              whileInView={{ x: -40, y: 40 }}
              transition={{ duration: 1.5, delay: 0.4 }}
              className="absolute w-80 h-80 border-4 border-sky-500 rounded-[3rem] mix-blend-multiply dark:mix-blend-color-dodge opacity-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Landing Page Component ---
const LandingPage = () => (
  <>
    <Hero />
    <ManifestoMarquee />
    <StatsSection />
    <FoundersSection />
    <ValueSection />
  </>
);

export default LandingPage;
