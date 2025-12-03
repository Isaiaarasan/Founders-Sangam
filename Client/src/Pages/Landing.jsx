import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  ArrowRight,
  ToggleRight,
  Users,
  Rocket,
  Globe,
  Sparkles,
} from "lucide-react";

// --- Theme Constants (Based on Logo) ---
// Yellow: #F4B41A | Red: #E03C31 | Green: #009E60 | Blue: #00A0E3
const BRAND_COLORS = {
  yellow: "from-amber-400 to-yellow-500",
  red: "from-red-500 to-rose-600",
  green: "from-emerald-500 to-green-600",
  blue: "from-sky-500 to-blue-600",
  multi: "bg-gradient-to-r from-amber-400 via-red-500 to-sky-500",
};

// --- Utility Components ---

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} // Custom bezier for smooth 'Apple-like' feel
    className={className}
  >
    {children}
  </motion.div>
);

const NavPill = ({ text, active = false }) => (
  <button
    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
      active
        ? "bg-black text-white shadow-lg"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black"
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

// --- Sections ---

const Navbar = () => (
  <motion.nav
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.8, ease: "circOut" }}
    className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4"
  >
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-full px-4 py-3 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-6xl">
      <div className="flex items-center gap-6 pl-2 md:pl-4">
        {/* Logo Representation */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full border-2 border-white bg-amber-400"></div>
            <div className="w-4 h-4 rounded-full border-2 border-white bg-red-500"></div>
            <div className="w-4 h-4 rounded-full border-2 border-white bg-emerald-500"></div>
            <div className="w-4 h-4 rounded-full border-2 border-white bg-sky-500"></div>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            FOUNDERS SANGAM
          </span>
        </div>

        <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>
        <div className="hidden md:flex gap-2">
          <NavPill text="Home" active />
          <NavPill text="Events" />
          <NavPill text="Membership" />
        </div>
      </div>

      <div className="flex items-center gap-3 pr-2">
        <button className="text-gray-400 hover:text-black transition-colors hidden sm:block">
          <ToggleRight className="w-8 h-8" />
        </button>
        <button className="bg-black hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Join Community
        </button>
      </div>
    </div>
  </motion.nav>
);

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Dynamic Background Blobs representing the 4 colors */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-sky-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-red-50/40 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="w-full px-6 md:px-12 relative z-10 h-full flex flex-col justify-center mt-20">
        <FadeIn className="w-full relative flex flex-col items-center justify-center max-w-7xl mx-auto text-center">
          {/* Abstract Logo Animation (The Rings) */}
          <div className="relative w-64 h-32 mb-12 flex justify-center items-center">
            {[
              { color: "border-amber-400", delay: 0, x: -60 },
              { color: "border-red-500", delay: 0.1, x: -20 },
              { color: "border-emerald-500", delay: 0.2, x: 20 },
              { color: "border-sky-500", delay: 0.3, x: 60 },
            ].map((ring, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0 }}
                animate={{ opacity: 1, scale: 1, x: ring.x }}
                transition={{
                  duration: 1.5,
                  delay: ring.delay,
                  type: "spring",
                }}
                className={`absolute w-32 h-32 rounded-full border-[12px] ${ring.color} mix-blend-multiply opacity-80 bg-white/10 backdrop-blur-sm`}
              />
            ))}
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-slate-900 leading-[0.9]">
            FOUNDERS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-sky-500">
              SANGAM
            </span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-slate-500 max-w-2xl font-medium">
            The exclusive ecosystem where{" "}
            <span className="text-black font-semibold">young visionaries</span>{" "}
            connect, collaborate, and conquer.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <button className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
              Apply for Membership <ArrowRight size={20} />
            </button>
            <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-all">
              Explore Events
            </button>
          </motion.div>
        </FadeIn>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-300"
      >
        <ArrowRight className="rotate-90" />
      </motion.div>
    </section>
  );
};

const ManifestoMarquee = () => {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden flex flex-col justify-center border-y border-slate-200">
      <div className="relative z-10">
        <div className="flex overflow-hidden whitespace-nowrap">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-12 pr-12"
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-12">
                <span className="text-8xl md:text-9xl font-black text-slate-900 tracking-tighter">
                  INNOVATE
                </span>
                <span className="w-8 h-8 rounded-full bg-amber-400"></span>
                <span className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 tracking-tighter">
                  CONNECT
                </span>
                <span className="w-8 h-8 rounded-full bg-emerald-500"></span>
                <span className="text-8xl md:text-9xl font-black text-slate-900 tracking-tighter">
                  SCALE
                </span>
                <span className="w-8 h-8 rounded-full bg-sky-500"></span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const StatsCard = ({ value, label, delay, gradient, icon: Icon }) => (
  <FadeIn
    delay={delay}
    className="flex flex-col gap-6 p-10 bg-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group relative overflow-hidden"
  >
    {/* Decorative background blob */}
    <div
      className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}
    ></div>

    <div className="flex justify-between items-start relative z-10">
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg transform group-hover:-rotate-6 transition-transform`}
      >
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
        <ArrowRight size={18} />
      </div>
    </div>

    <div className="mt-4 relative z-10">
      <h3 className="text-6xl font-bold text-slate-900 tracking-tight">
        {value}
      </h3>
      <p className="text-slate-500 font-semibold uppercase text-xs tracking-widest mt-2">
        {label}
      </p>
    </div>

    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 1.5, delay: delay + 0.2, ease: "circOut" }}
        className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
      />
    </div>
  </FadeIn>
);

const StatsSection = () => {
  return (
    <section className="py-32 bg-white w-full px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto mb-16 text-left">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            Building the future, <br />
            <span className="text-slate-400">one founder at a time.</span>
          </h2>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <StatsCard
          value={<Counter value={500} suffix="+" />}
          label="Active Founders"
          delay={0.1}
          gradient={BRAND_COLORS.yellow}
          icon={Users}
        />
        <StatsCard
          value={<Counter value={85} suffix="%" />}
          label="Success Rate"
          delay={0.2}
          gradient={BRAND_COLORS.red}
          icon={Rocket}
        />
        <StatsCard
          value={<Counter value={20} suffix="+" />}
          label="Cities Reached"
          delay={0.3}
          gradient={BRAND_COLORS.blue}
          icon={Globe}
        />
      </div>
    </section>
  );
};

const ValueSection = () => {
  return (
    <section className="py-32 bg-slate-50 overflow-hidden w-full relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:44px_44px]"></div>

      <div className="px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <FadeIn>
              <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase mb-4 block">
                Our Philosophy
              </span>
              <h2 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight">
                Unity in <br />{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-600">
                  Diversity.
                </span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                The Founders Sangam logo represents the coming together of
                diverse minds. Like our interlocking rings, we believe that when
                distinct perspectives overlap, true innovation happens.
              </p>
              <button className="text-slate-900 font-bold border-b-2 border-slate-900 pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-colors">
                Read our Vision
              </button>
            </FadeIn>
          </div>
          <div className="w-full md:w-1/2 relative h-[500px]">
            {/* Abstract visual composition */}
            <motion.div
              initial={{ rotate: 0 }}
              whileInView={{ rotate: 90 }}
              transition={{ duration: 2, ease: "backOut" }}
              viewport={{ margin: "-100px" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-900 rounded-[3rem]"
            />
            <motion.div
              initial={{ x: 0, y: 0 }}
              whileInView={{ x: 40, y: -40 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-4 border-amber-400 rounded-[3rem] mix-blend-multiply"
            />
            <motion.div
              initial={{ x: 0, y: 0 }}
              whileInView={{ x: -40, y: 40 }}
              transition={{ duration: 1.5, delay: 0.4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-4 border-sky-500 rounded-[3rem] mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-white pt-24 pb-12 w-full px-6 md:px-12 border-t border-slate-100">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-none mb-8">
            Founders Sangam.
          </h2>
          <p className="text-xl text-slate-500 max-w-md">
            An exclusive community for young founders to dream, build, and scale
            together.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-800 transition-all shadow-xl">
              Apply Now
            </button>
            <button className="bg-slate-100 text-slate-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-200 transition-colors">
              Contact Us
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-right">
          {["Instagram", "LinkedIn", "Twitter", "Community Guidelines"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-lg font-medium text-slate-500 hover:text-black transition-colors"
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-100 gap-6">
        <p className="text-slate-400 text-sm">
          © 2024 Founders Sangam. All rights reserved.
        </p>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <div className="w-3 h-3 rounded-full bg-sky-500"></div>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App ---

function App() {
  return (
    <div className="font-sans antialiased bg-white min-h-screen selection:bg-amber-400 selection:text-black text-slate-900">
      <Navbar />
      <Hero />
      <ManifestoMarquee />
      <StatsSection />
      <ValueSection />
      <Footer />
    </div>
  );
}

export default App;
