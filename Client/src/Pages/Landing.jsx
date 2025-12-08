import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import axios from "axios";
import {
  ArrowRight,
  Users,
  Rocket,
  MapPin,
  Quote,
  Zap,
  Globe,
  BookOpen,
  Plus,
  Minus
} from "lucide-react";

// --- Theme Constants (Not directly used in Hero, but good practice) ---
const BRAND_COLORS = {
  yellow: "from-amber-400 to-yellow-500",
  red: "from-red-500 to-rose-600",
  green: "from-emerald-500 to-green-600",
  blue: "from-sky-500 to-blue-600",
};

// --- Utility Components ---

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "10px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Counter utility is defined for completeness but not strictly needed for Hero
const Counter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const springValue = useSpring(0, { stiffness: 60, damping: 20 });
  const displayValue = useTransform(
    springValue,
    (latest) => `${Math.round(latest)}${suffix}`
  );

  useEffect(() => {
    if (isInView) springValue.set(value);
  }, [isInView, value, springValue]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

// --- 3D Background Component ---
const DepthElements = () => (
  <div className="absolute inset-0 w-full h-full perspective-[1000px] pointer-events-none">
    {/* Cube 1: Top Left - Rotates slowly */}
    <motion.div
      animate={{ rotateX: 360, rotateY: 360, opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute top-[10%] left-[10%] w-24 h-24 bg-sky-500/10 border border-sky-300/20 rounded-lg"
      style={{
        transformStyle: "preserve-3d",
        transform: "translateZ(-200px) rotateX(45deg) rotateY(-30deg)",
      }}
    />

    {/* Small Detail: Center Left */}
    <motion.div
      animate={{ rotate: 360, scale: [1, 1.1, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-[5%] w-10 h-10 bg-red-500/10 rounded-full border border-red-300/20"
      style={{ transform: "translateZ(-50px)" }}
    />
  </div>
);

// --- Cursor Trail Component ---
const CursorTrail = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Check if the device is a mouse (not a touch device simulation)
      if (e.pointerType === "mouse" || e.pointerType === undefined) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("pointermove", handleMouseMove);
    return () => window.removeEventListener("pointermove", handleMouseMove);
  }, []);

  const springConfig = {
    type: "spring",
    stiffness: 150,
    damping: 18,
    mass: 0.5,
  };

  // Primary element style (follows slightly slower)
  const primaryStyle = {
    x: mousePosition.x,
    y: mousePosition.y,
    translateX: "-50%",
    translateY: "-50%",
    transition: springConfig,
  };

  // Secondary element style (lags slightly behind primary)
  const secondaryStyle = {
    x: mousePosition.x,
    y: mousePosition.y,
    translateX: "-50%",
    translateY: "-50%",
    transition: { ...springConfig, stiffness: 100, damping: 25, mass: 0.8 },
  };

  return (
    <motion.div
      style={{ pointerEvents: "none" }} // Ensures it doesn't block clicks
      className="fixed inset-0 z-50"
    >
      <motion.div
        animate={primaryStyle}
        className="w-10 h-10 border-2 border-amber-400 dark:border-sky-300 rounded-full opacity-60 mix-blend-difference absolute top-0 left-0"
      />

      <motion.div
        animate={secondaryStyle}
        className="w-4 h-4 bg-red-500/70 dark:bg-emerald-500/70 rounded-full opacity-70 absolute top-0 left-0 blur-sm"
      />
    </motion.div>
  );
};

// 1. Hero Section
const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 pt-25 pb-12 transition-colors duration-500">
      {/* NEW: Cursor Trail component for interaction */}
      <CursorTrail />

      {/* Existing Background Blobs (z-0) */}
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

      {/* 3D Depth Elements Layer (z-10, behind the content) */}
      <DepthElements />

      <div className="w-full px-6 md:px-12 relative z-20 h-full flex flex-col justify-center">
        <FadeIn className="w-full relative flex flex-col items-center justify-center max-w-7xl mx-auto text-center">

          {/* Logo Animation Rings - UPDATED WITH OUTWARD MOVEMENT */}
          <div className="relative w-64 h-32 mb-12 flex justify-center items-center">
            {[
              { color: "border-amber-400", delay: 0, x: -70 },
              { color: "border-red-500", delay: 0.1, x: -25 },
              { color: "border-emerald-500", delay: 0.2, x: 25 },
              { color: "border-sky-500", delay: 0.3, x: 70 },
            ].map((ring, i) => {
              // Calculate the final off-screen X position
              const finalX = ring.x < 0 ? -200 : 200;
              const initialX = ring.x;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5, x: initialX }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0, 0], // Opacity drops to 0 at step 5
                    scale: [0.5, 1, 1, 1, 0.5, 0.5], // Scale decreases with the fade-out
                    x: [initialX, initialX, initialX, initialX, finalX, initialX], // MOVED OUT & BACK
                  }}
                  transition={{
                    duration: 8,
                    // Times align with the 6 steps in the animate arrays
                    times: [0, 0.1, 0.7, 0.8, 0.9, 1],
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: ring.delay,
                  }}
                  className={`absolute w-32 h-32 rounded-full border-[12px] ${ring.color} mix-blend-multiply dark:mix-blend-screen opacity-80 bg-white/10 dark:bg-black/10`}
                />
              );
            })}
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
              onClick={() => navigate("/events")}
              className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-800 hover:scale-105 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-all flex items-center gap-2 shadow-xl shadow-slate-200 dark:shadow-slate-900/50"
            >
              Explore Events <ArrowRight size={20} />
            </button>

            <button
              onClick={() => navigate("/broadcast")}
              className="bg-white flex items-center gap-2 text-slate-900 border shrink-0 border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800 transition-all"
            >
              Explore Broadcast <ArrowRight size={20} />
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

// 2. Manifesto Marquee
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

// 2.5 Video Section
const VideoSection = () => {
  const videos = [
    "/videos/reel.mp4",
    "/videos/reel2.mp4",
    "/videos/reel3.mp4"
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 w-full flex flex-col items-center justify-center relative z-20 transition-colors duration-500 border-b border-slate-200 dark:border-slate-800">
      <FadeIn className="w-full max-w-7xl px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 dark:text-white mb-12">
          Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Vibe</span>
        </h2>

        {/* Container: Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-8 md:pb-0 hide-scrollbar justify-start md:justify-center">
          {videos.map((src, index) => (
            <div
              key={index}
              className="min-w-[280px] w-[80%] md:w-full max-w-[320px] aspect-[9/16] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white dark:border-slate-800 flex-shrink-0 snap-center transform hover:scale-[1.02] transition-transform duration-500 bg-black mx-auto"
            >
              <video
                className="w-full h-full object-cover"
                src={src}
                autoPlay
                loop
                muted
                playsInline
                controls
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
};

// 3. Stats Section
const StatsSection = () => {
  const navigate = useNavigate();
  const StatsCard = ({ value, label, delay, gradient, icon: Icon, onClick, href }) => {
    const CardContent = (
      <FadeIn
        delay={delay}
        className="flex flex-col gap-6 p-6 md:p-10 bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group relative overflow-hidden cursor-pointer h-full"
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
          <h3 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
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
          value={<Counter value={2000} suffix="+" />}
          label="Bold Founders"
          delay={0.1}
          gradient={BRAND_COLORS.yellow}
          icon={Users}
          onClick={() => navigate("/events")}
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
          value={<Counter value={1} suffix="+" />}
          label="Tirupur Base and other Cities"
          delay={0.3}
          gradient={BRAND_COLORS.blue}
          icon={MapPin}
          href="https://maps.app.goo.gl/n85Qmnk7xSRXTjrVA"
        />
      </div>
    </section>
  );
};

// 4. Benefits Section (New)
const BenefitsSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 w-full px-6 md:px-12 relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="mb-16 text-center md:text-left">
            <span className="text-amber-500 font-bold tracking-widest text-sm uppercase mb-4 block">
              Membership Perks
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              The <span className="italic font-serif">Unfair Advantage</span> <br />
              for Founders.
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large */}
          <FadeIn delay={0.1} className="md:col-span-2 relative group overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/50 dark:bg-amber-900/20 rounded-full blur-[80px] -mr-16 -mt-16 transition-all group-hover:bg-amber-200/50 dark:group-hover:bg-amber-800/20"></div>
            <div className="relative z-10">
              {/*<div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                <Users size={24} />
              </div>*/}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Curated Founder Gatherings</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                Every event is curated. Every member is intentional. We bring niche-driven businesses into one room to create an environment where honest conversations lead to real progress.
              </p>
            </div>
          </FadeIn>

          {/* Card 2: Tall - MODIFIED: LIGHT BACKGROUND, DARK TEXT */}
          <FadeIn delay={0.2}
            // Background kept light (bg-slate-50) for contrast with dark text.
            // Added dark:bg-slate-900 and border for dark theme adaptability.
            className="md:row-span-2 relative group overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between border border-slate-200 dark:border-slate-700"
          >
            <div
              // Gradient removed or adjusted for light mode/dark theme
              className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent dark:from-slate-900/50"
            ></div>
            <div>
              {/*<div
              // Icon: Set to be dark text on light background in light mode, and amber on dark in dark mode.
              className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-900 dark:text-amber-400 mb-6"
              >
                <Globe size={24} />
              </div>*/}
              <h3
                // Text: Changed to dark slate for light mode, fixed to white for dark mode.
                className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
              >Focused Mentorship</h3>
              <p
                // Text: Changed to gray for light mode, light gray for dark mode.
                className="text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                mentorship sessions with experienced operators who help you clarify your direction and network with intent.
              </p>
            </div>
            {/* <button
              // Button: Set to dark text on light background in light mode, and reversed in dark mode.
              className="mt-8 w-full py-4 rounded-xl bg-slate-200 dark:bg-white/10 backdrop-blur-md text-slate-900 dark:text-white font-bold border border-slate-300 dark:border-white/10 hover:bg-slate-300 dark:hover:bg-white dark:hover:text-black transition-all"
            >
              Join the Circle
            </button> */}
          </FadeIn>
          {/* Card 3: Standard */}
          <FadeIn delay={0.3} className="relative group overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100/50 dark:bg-sky-900/20 rounded-full blur-[80px] -mr-16 -mt-16"></div>
            <div className="relative z-10">
              {/*<div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-sky-600 mb-6">
                <Zap size={24} />
              </div>*/}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Member-Exclusive Resources</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Unlock insights, advantages, and tools specifically designed for serious builders.
              </p>
            </div>
          </FadeIn>

          {/* Card 4: Standard */}
          <FadeIn delay={0.4} className="relative group overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-[80px] -mr-16 -mt-16"></div>
            <div className="relative z-10">
              {/*<div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <BookOpen size={24} />
              </div>*/}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Private Community</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Access our digital community where real opportunities and collaboration happen.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// 5. Founders Section
const FoundersSection = () => {
  // Note: The FadeIn component (which uses animation for the entire card wrapper) is retained
  // as it handles the initial reveal/load animation, but the specific rotation/scale animations are removed.
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 w-full px-6 md:px-12 relative overflow-hidden transition-colors duration-500 border-t border-slate-200 dark:border-slate-800">

      {/* Background Design - Retaining only the subtle Blob for focus */}
      <div className="absolute inset-0 z-0 pointer-events-none">

        {/* Highlight Blob behind Title (Static) */}
        {/* Note: Removed motion.div, keeping static classes */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-24 bg-red-400/20 dark:bg-red-900/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-12 text-center">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">Visionaries</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Founder 1 */}
          <FadeIn delay={0.1} className="relative group">
            {/* Main Card (Removed motion.div and animation properties) */}
            <div
              className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all relative z-10"
            >
              <div className="w-40 h-40 rounded-full bg-slate-200 dark:bg-slate-700 mb-4 overflow-hidden border-4 border-amber-400/50 dark:border-amber-400/50 group-hover:border-8 transition-all">
                <img src="Images/Founder.png" alt="Founder" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Kaviya Maruthasalam</h3>
              <p className="text-amber-500 font-semibold text-sm mb-3">Founder Founders Sangam</p>
              <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed">
                "Top 1% Personal Branding Expert & an Intrapreneur"
              </p>
            </div>

            {/* Overlapping Decorative Element 1 (Static positioning, ADDED SHADOW) */}
            <div
              className="absolute inset-0 w-full h-full border-4 border-amber-400 rounded-3xl mix-blend-multiply dark:mix-blend-color-dodge opacity-50 z-0"
              style={{
                transform: 'translate(-10px, 15px)', // Static position from the last animation
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', // Extra Design: Subtle Shadow
              }}
            />
          </FadeIn>

          {/* Founder 2 */}
          <FadeIn delay={0.2} className="relative group">
            {/* Main Card (Removed motion.div and animation properties) */}
            <div
              className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all relative z-10"
            >
              <div className="w-40 h-40 rounded-full bg-slate-200 dark:bg-slate-700 mb-4 overflow-hidden border-4 border-red-500/50 dark:border-red-500/50 group-hover:border-8 transition-all">
                <img src="Images/Co-founder.png" alt="Co-Founder" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Naveen Kumar</h3>
              <p className="text-red-500 font-semibold text-sm mb-3">Founder Founders Sangam Community</p>
              <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed">
                "Tiurpur's Leading Textilepreneur"
              </p>
            </div>

            {/* Overlapping Decorative Element 2 (Static positioning, ADDED SHADOW) */}
            <div
              className="absolute inset-0 w-full h-full border-4 border-sky-500 rounded-3xl mix-blend-multiply dark:mix-blend-color-dodge opacity-50 z-0"
              style={{
                transform: 'translate(10px, 15px)', // Static position from the last animation
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', // Extra Design: Subtle Shadow
              }}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
// 6. Value Section
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
                We’re building a founder-first community in the heart of India’s tier 2 cities — because ambition isn’t limited to metros.
                <br /><br />
                Our focus is simple: bring niche-driven businesses into one room where honest conversations lead to real progress.
                <br /><br />
                No noise, no filler, just builders who want to move forward. We exist to make the startup community a strong, evolving hub for founders who want clarity, support, and the right network, right where they are.
              </p>
              <button className="text-slate-900 dark:text-white font-bold border-b-2 border-slate-900 dark:border-white pb-1 hover:text-emerald-600 hover:border-emerald-600 dark:hover:text-emerald-400 dark:hover:border-emerald-400 transition-colors">
                Read our Vision
              </button>
            </FadeIn>
          </div>
          <div className="w-full md:w-1/2 relative h-[500px] flex items-center justify-center">
            <motion.div
              initial={{ rotate: 0 }}
              whileInView={{ rotate: 5 }}
              transition={{ duration: 2, ease: "backOut" }}
              viewport={{ margin: "-100px" }}
              className="relative z-10 w-80 h-80 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img
                src="/Images/Logo.jpeg"
                alt="Collaboration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/20 mix-blend-overlay"></div>
            </motion.div>
            <motion.div
              initial={{ x: 0, y: 0 }}
              whileInView={{ x: 15, y: -15 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="absolute w-80 h-80 border-4 border-amber-400 rounded-[3rem] mix-blend-multiply dark:mix-blend-color-dodge opacity-60"
            />
            <motion.div
              initial={{ x: 0, y: 0 }}
              whileInView={{ x: -15, y: 15 }}
              transition={{ duration: 1.5, delay: 0.4 }}
              className="absolute w-80 h-80 border-4 border-sky-500 rounded-[3rem] mix-blend-multiply dark:mix-blend-color-dodge opacity-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
// 7. Testimonials Section (New)
const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([
    {
      name: "Rajesh Kumar",
      role: "CEO, TexValley Tech",
      content: "I found my technical co-founder at the last Sangam meetup. The quality of crowd here is unlike any other event in the city.",
      color: "border-amber-400"
    },
    {
      name: "Sneha Reddy",
      role: "Founder, GreenLoom",
      content: "Founders Sangam gave me the mentorship I needed to pivot my D2C brand. The ecosystem they are building is vital for Tirupur.",
      color: "border-emerald-500"
    },
    {
      name: "Arun Karthik",
      role: "Director, AK Exports",
      content: "Bridging the gap between traditional textile business and modern SaaS tools. This community is opening new doors for us.",
      color: "border-sky-500"
    }
  ]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get("https://founders-sangam.onrender.com/content/testimonials");
        if (res.data.success && res.data.content && Array.isArray(res.data.content) && res.data.content.length > 0) {
          setTestimonials(res.data.content);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials, using fallback.");
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 w-full px-6 md:px-12 relative overflow-hidden transition-colors duration-500">

      {/* NEW: Dynamic Radial Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{
            background: [
              'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 90% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
          className="absolute inset-0 dark:opacity-10 opacity-30"
          style={{
            backgroundColor: 'transparent',
            mixBlendMode: 'soft-light' // Makes the gradient blend nicely with the dark background
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 dark:text-white mb-16">
            Voices of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">Sangam</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1} className={`bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] shadow-sm border-t-4 ${item.color} relative`}>
              <Quote className="text-slate-200 dark:text-slate-700 absolute top-8 right-8" size={40} />
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 relative z-10">
                "{item.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{item.role}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
// 8. Collaboration Section
const CollaborationSection = () => {
  const [companies, setCompanies] = useState([
    "Company A",
    "Company B",
    "Company C",
    "Company D",
    "Company E",
    "Company F",
  ]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("https://founders-sangam.onrender.com/content/collaboration");
        if (res.data.success && res.data.content && res.data.content.companies && res.data.content.companies.length > 0) {
          setCompanies(res.data.content.companies);
        }
      } catch (err) {
        console.error("Failed to fetch collaboration companies");
      }
    };
    fetchCompanies();
  }, []);

  return (
    <section
      className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-500 relative"
      // NEW BACKGROUND DESIGN: Subtle diagonal stripes applied via inline style
      style={{
        backgroundImage: `repeating-linear-gradient(45deg, 
                var(--tw-color-slate-100) 0, var(--tw-color-slate-100) 1px, 
                transparent 1px, transparent 15px)`,
        backgroundSize: '30px 30px',
      }}
    >
      {/* Dark Mode Overlay for Diagonal Stripes */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, 
                    var(--tw-color-white) 0, var(--tw-color-white) 1px, 
                    transparent 1px, transparent 15px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* MODIFIED: Replacing border-t with a decorative divider (Z-10) */}
      <div className="absolute top-0 w-full h-[2px] opacity-30 z-10">
        <div
          className="w-full h-full"
          style={{
            // Creates a dashed, gradient line
            background: 'repeating-linear-gradient(to right, #f59e0b 0, #f59e0b 2px, transparent 2px, transparent 10px, #ef4444 10px, #ef4444 12px, transparent 12px, transparent 20px)',
            backgroundSize: '100% 2px',
            filter: 'opacity(0.6) saturate(1.5)'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-20">
        <FadeIn>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-10">
            Trusted by Innovative Companies
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {companies.map((company, i) => (
              <div
                key={i}
                className="text-2xl font-bold text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {company}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
// 9. FAQ Section (New)
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "Is this membership only for Tech Founders?", answer: "Not at all. We welcome founders from Textile, D2C, Manufacturing, and Service sectors. Innovation happens at the intersection of industries." },
    { question: "How often do meetups happen?", answer: "We host an official Founders Meetup once a month, with smaller casual mixers happening bi-weekly at partner cafes." },
    { question: "Is the ₹500 fee a monthly subscription?", answer: "No! It is a one-time lifetime membership fee for the Early Adopter batch. Prices will move to a subscription model soon." },
    { question: "Can I bring my co-founder?", answer: "Yes, but memberships are individual. We highly recommend your co-founder registers separately to access the digital community benefits." },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 w-full px-6 md:px-12 transition-colors duration-500 relative overflow-hidden">

      {/* NEW: Background Design Elements (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* 1. Subtle Radial Glow (Top Left) */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-800/10 rounded-full blur-[100px] -ml-20 -mt-20"></div>

        {/* 2. Subtle Radial Glow (Bottom Right) */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/10 dark:bg-sky-800/10 rounded-full blur-[100px] -mr-20 -mb-20"></div>

        {/* 3. Fixed Line Pattern (Similar to Value Section) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:44px_44px] dark:opacity-[0.05]"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Common Queries
          </h2>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="cursor-pointer bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{faq.question}</h3>
                  <div className={`p-2 rounded-full bg-white dark:bg-slate-800 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                    {openIndex === index ? <Minus size={20} className="text-amber-500" /> : <Plus size={20} className="text-slate-400" />}
                  </div>
                </div>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
// --- Landing Page Component (Main Export) ---
const LandingPage = () => (
  <>
    <Hero />
    <ManifestoMarquee />
    <VideoSection />
    <StatsSection />
    <BenefitsSection />
    <FoundersSection />
    <ValueSection />
    <TestimonialsSection />
    <CollaborationSection />
    <FAQSection />

    <div className="h-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900"></div>
  </>
);

export default LandingPage;