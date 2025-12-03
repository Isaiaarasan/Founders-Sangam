import React, { useRef, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom"; // Import Router hooks

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Users, Rocket, MapPin, Moon, Sun } from "lucide-react";

// Import your Payment Page Component
import PaymentPage from "./PaymentPage";

// --- Theme Constants (Keep existing) ---
const BRAND_COLORS = {
  yellow: "from-amber-400 to-yellow-500",
  red: "from-red-500 to-rose-600",
  green: "from-emerald-500 to-green-600",
  blue: "from-sky-500 to-blue-600",
};

// --- Utility Components (Keep existing: FadeIn, NavPill, Counter) ---
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

const NavPill = ({ text, active = false }) => (
  <button
    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
      active
        ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
    }`}
  >
    {text}
  </button>
);

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

// --- UPDATED Navbar ---
const Navbar = ({ isDark, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-4 pt-6"
    >
      <motion.div
        layout
        initial={false}
        animate={
          isScrolled
            ? {
                width: "fit-content",
                borderRadius: "9999px",
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                y: 10,
              }
            : {
                width: "100%",
                maxWidth: "80rem",
                borderRadius: "9999px",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                y: 0,
              }
        }
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`flex items-center justify-between py-3 border transition-colors duration-500 ${
          isScrolled
            ? "bg-white/100 border-slate-200 shadow-xl dark:bg-slate-900 dark:border-slate-700"
            : "bg-white/70 border-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-slate-900/70 dark:border-slate-700/50"
        }`}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 bg-amber-400"></div>
              <div className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 bg-red-500"></div>
              <div className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 bg-emerald-500"></div>
              <div className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 bg-sky-500"></div>
            </div>
            <AnimatePresence>
              {!isScrolled && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-bold text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap overflow-hidden"
                >
                  FOUNDERS SANGAM
                </motion.span>
              )}
            </AnimatePresence>
            {isScrolled && (
              <span className="hidden md:block font-bold text-lg tracking-tight text-slate-900 dark:text-white pl-2">
                FS
              </span>
            )}
          </div>
          <div className="h-6 w-[1px] bg-gray-200 dark:bg-slate-700 hidden md:block"></div>
          <motion.div className="hidden md:flex gap-2">
            <NavPill text="Home" active />
            <NavPill text="Events" />
            <NavPill text="About" />
          </motion.div>
        </div>

        <div className="flex items-center gap-3 pl-4">
          <button
            onClick={toggleTheme}
            className="text-gray-400 hover:text-black dark:text-slate-500 dark:hover:text-amber-400 transition-colors"
          >
            {isDark ? (
              <Sun className="w-6 h-6 md:w-8 md:h-8" />
            ) : (
              <Moon className="w-6 h-6 md:w-8 md:h-8" />
            )}
          </button>

          {/* --- CLICK ACTION ADDED HERE --- */}
          <button
            onClick={() => navigate("/payment")}
            className="bg-black hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
          >
            {isScrolled ? "Join" : "Join Community"}
          </button>
        </div>
      </motion.div>
    </motion.nav>
  );
};

// --- UPDATED Hero ---
const Hero = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 pt-28 md:pt-27 pb-12 transition-colors duration-500">
      {/* Background Blobs (Keep your existing blobs here) */}
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
          {/* Logo Animation Rings (Keep existing) */}
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
            {/* --- CLICK ACTION ADDED HERE --- */}
            <button
              onClick={() => navigate("/payment")}
              className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-800 hover:scale-105 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-all flex items-center gap-2 shadow-xl shadow-slate-200 dark:shadow-slate-900/50"
            >
              Apply for Membership <ArrowRight size={20} />
            </button>

            <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800 transition-all">
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

// --- Other Sections (Keep exactly as they were) ---
const ManifestoMarquee = () => {
  // ... Copy your existing ManifestoMarquee code here ...
  const manifestoItems = [
    { text: "NETWORKING", color: "text-amber-500", dot: "bg-amber-400" },
    { text: "COLLABORATION", color: "text-red-500", dot: "bg-red-500" },
    { text: "GROWTH", color: "text-emerald-500", dot: "bg-emerald-500" },
    { text: "CULTURE", color: "text-sky-500", dot: "bg-sky-500" },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden flex flex-col justify-center border-y border-slate-200 dark:border-slate-800 transition-colors duration-500">
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

const StatsSection = () => {
  // ... Copy your existing StatsSection (and StatsCard) code here ...
  // Note: I am not repeating the full code here to save space, but you must keep it!
  const StatsCard = ({ value, label, delay, gradient, icon: Icon }) => (
    <FadeIn
      delay={delay}
      className="flex flex-col gap-6 p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group relative overflow-hidden"
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
        />
        <StatsCard
          value={<Counter value={100} suffix="%" />}
          label="Real Stories"
          delay={0.2}
          gradient={BRAND_COLORS.red}
          icon={Rocket}
        />
        <StatsCard
          value={<Counter value={1} suffix="" />}
          label="Tirupur Base"
          delay={0.3}
          gradient={BRAND_COLORS.blue}
          icon={MapPin}
        />
      </div>
    </section>
  );
};

const ValueSection = () => {
  // ... Copy your existing ValueSection code here ...
  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden w-full relative transition-colors duration-500">
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

const Footer = () => (
  // ... Copy your existing Footer code here ...
  <footer className="bg-white dark:bg-slate-950 pt-24 pb-12 w-full px-6 md:px-12 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter leading-none mb-8">
            Founders Sangam.
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-md mb-6">
            A circle of bold founders shaping what’s next. Networking,
            collaboration, and growth for Tirupur's startup ecosystem.
          </p>
          <div className="text-slate-500 dark:text-slate-400 space-y-2">
            <p>📧 founderssangam@gmail.com</p>
            <p>📞 +91 85258 65979</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-right">
          {["Instagram", "LinkedIn", "Twitter", "Community Guidelines"].map(
            (item) => (
              <a
                key={item}
                href="https://www.instagram.com/founder.sangam/"
                className="text-lg font-medium text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-100 dark:border-slate-800 gap-6">
        <p className="text-slate-400 text-sm">
          © 2025 Founders Sangam. All rights reserved.
        </p>
        <div className="flex gap-2">
          {["bg-amber-400", "bg-red-500", "bg-emerald-500", "bg-sky-500"].map(
            (color, index) => (
              <motion.div
                key={index}
                animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut",
                }}
                className={`w-3 h-3 rounded-full ${color}`}
              />
            )
          )}
        </div>
      </div>
    </div>
  </footer>
);

// --- Component grouping for cleanliness ---
const LandingPage = ({ isDark, toggleTheme }) => (
  <>
    <Navbar isDark={isDark} toggleTheme={toggleTheme} />
    <Hero />
    <ManifestoMarquee />
    <StatsSection />
    <ValueSection />
    <Footer />
  </>
);

// --- MAIN APP (Updated for Routing) ---
function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <Router>
      <div className={`${isDark ? "dark" : ""}`}>
        <div className="font-sans antialiased bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white transition-colors duration-500 selection:bg-amber-400 selection:text-black">
          <Routes>
            {/* Route for the Main Landing Page */}
            <Route
              path="/"
              element={
                <LandingPage isDark={isDark} toggleTheme={toggleTheme} />
              }
            />

            {/* Route for the Payment Page */}
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
