import React, { useRef, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes, // <--- IMPORTANT: This must wrap all Route components
  Route,
  useNavigate,
  useLocation
} from "react-router-dom"; 

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  ArrowRight,
  Moon,
  Sun,
  Users,
  Rocket,
  MapPin
} from "lucide-react";

// --- IMPORT YOUR PAGES ---
import PaymentPage from "./PaymentPage"; 
import EventsPage from "./EventsPage"; 

// --- UTILITY COMPONENTS ---
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

const NavPill = ({ text, route, active }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
        active
          ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
      }`}
    >
      {text}
    </button>
  );
};

const Counter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const springValue = useSpring(0, { stiffness: 60, damping: 20 });
  const displayValue = useTransform(springValue, (latest) => `${Math.round(latest)}${suffix}`);
  useEffect(() => { if (isInView) springValue.set(value); }, [isInView, value, springValue]);
  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

// --- SECTIONS (Re-added here so the Landing Page works) ---

const Navbar = ({ isDark, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-4 pt-6 pointer-events-none"
    >
      <motion.div
        layout
        initial={false}
        animate={
          isScrolled
            ? { width: "fit-content", borderRadius: "9999px", paddingLeft: "1.5rem", paddingRight: "1.5rem", y: 10 }
            : { width: "100%", maxWidth: "80rem", borderRadius: "9999px", paddingLeft: "1rem", paddingRight: "1rem", y: 0 }
        }
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`pointer-events-auto flex items-center justify-between py-3 border transition-colors duration-500 ${
          isScrolled
            ? "bg-white/100 border-slate-200 shadow-xl dark:bg-slate-900 dark:border-slate-700"
            : "bg-white/70 border-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-slate-900/70 dark:border-slate-700/50"
        }`}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 bg-amber-400"></div>
              <div className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 bg-red-500"></div>
              <div className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 bg-emerald-500"></div>
              <div className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 bg-sky-500"></div>
            </div>
            <span className={`font-bold text-lg tracking-tight text-slate-900 dark:text-white pl-2 ${!isScrolled ? "block" : "hidden md:block"}`}>
               {isScrolled ? "FS" : "FOUNDERS SANGAM"}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-gray-200 dark:bg-slate-700 hidden md:block"></div>

          <motion.div className="hidden md:flex gap-2">
            <NavPill text="Home" route="/" active={location.pathname === "/"} />
            <NavPill text="Events" route="/events" active={location.pathname === "/events"} />
          </motion.div>
        </div>

        <div className="flex items-center gap-3 pl-4">
          <button onClick={toggleTheme} className="text-gray-400 hover:text-black dark:text-slate-500 dark:hover:text-amber-400 transition-colors">
            {isDark ? <Sun className="w-6 h-6 md:w-8 md:h-8" /> : <Moon className="w-6 h-6 md:w-8 md:h-8" />}
          </button>
          <button 
            onClick={() => navigate('/payment')} 
            className="bg-black hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
          >
            {isScrolled ? "Join" : "Join Community"}
          </button>
        </div>
      </motion.div>
    </motion.nav>
  );
};

const Hero = () => {
    const navigate = useNavigate();
    return (
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 pt-28 md:pt-27 pb-12 transition-colors duration-500">
        {/* Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div animate={{ x: [0, 100, 0], y: [0, -50, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-100/40 dark:bg-amber-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <motion.div animate={{ x: [0, -100, 0], y: [0, 50, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-sky-100/40 dark:bg-sky-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <FadeIn className="w-full relative flex flex-col items-center justify-center max-w-7xl mx-auto text-center z-10">
             <h1 className="text-6xl md:text-8xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
                FOUNDERS <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-sky-500">SANGAM</span>
             </h1>
             <p className="mt-8 text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
                A circle of bold founders shaping what’s next.
             </p>
             <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/payment')}
                  className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-800 hover:scale-105 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-all flex items-center gap-2 shadow-xl"
                >
                  Apply for Membership <ArrowRight size={20} />
                </button>

                <button 
                   onClick={() => navigate('/events')}
                   className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800 transition-all"
                >
                  Explore Events
                </button>
             </div>
        </FadeIn>
      </section>
    );
};

const StatsSection = () => {
    // Basic Stats section simplified for brevity but functional
    const BRAND_COLORS = { yellow: "from-amber-400 to-yellow-500", red: "from-red-500 to-rose-600", blue: "from-sky-500 to-blue-600" };
    return (
        <section className="py-20 bg-white dark:bg-slate-950 w-full px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl"><h3 className="text-4xl font-bold dark:text-white">50+</h3><p className="text-slate-500">Founders</p></div>
                 <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl"><h3 className="text-4xl font-bold dark:text-white">100%</h3><p className="text-slate-500">Growth</p></div>
                 <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl"><h3 className="text-4xl font-bold dark:text-white">1</h3><p className="text-slate-500">Community</p></div>
            </div>
        </section>
    )
}

const Footer = () => (
    <footer className="bg-white dark:bg-slate-950 py-12 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500 text-center">
        <p className="text-slate-500 dark:text-slate-400">© 2025 Founders Sangam.</p>
    </footer>
);


// --- LAYOUT HELPER ---
// This wraps every page to ensure the Navbar and Theme toggle are always present
const Layout = ({ children, isDark, toggleTheme }) => (
  <>
    <Navbar isDark={isDark} toggleTheme={toggleTheme} />
    {children}
  </>
);

// --- MAIN APP ---
function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  return (
    <Router>
      <div className={`${isDark ? "dark" : ""}`}>
        <div className="font-sans antialiased bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white transition-colors duration-500 selection:bg-amber-400 selection:text-black">
          
          {/* === THE FIX IS HERE === */}
          {/* All Route components MUST be children of Routes */}
          <Routes>
            
            {/* Route 1: Home */}
            <Route path="/" element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                   <Hero />
                   <StatsSection />
                   <Footer />
                </Layout>
              } 
            />
            
            {/* Route 2: Events */}
            <Route path="/events" element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <EventsPage />
                </Layout>
              } 
            />
            
            {/* Route 3: Payment */}
            <Route path="/payment" element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <PaymentPage />
                </Layout>
              } 
            />
            
          </Routes>
          {/* === END OF FIX === */}

        </div>
      </div>
    </Router>
  );
}

export default App;