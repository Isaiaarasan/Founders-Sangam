import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";

const NavPill = ({ text, route, active }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(route);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleNavigate}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
        active
          ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
          : "bg-gray-100/50 text-gray-600 hover:bg-gray-200 hover:text-black dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
      }`}
    >
      {text}
    </button>
  );
};

const Navbar = ({ isDark, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMobileNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            ? {
                width: "fit-content",
                borderRadius: "9999px",
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                y: 0,
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
        className={`pointer-events-auto flex items-center justify-between py-3 border transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-slate-200 shadow-lg dark:bg-slate-900/90 dark:border-slate-700"
            : "bg-transparent border-transparent shadow-none"
        }`}
      >
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogoClick}
          >
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
                  className="font-bold text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap overflow-hidden pl-2"
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
          <div
            className={`h-6 w-[1px] hidden md:block transition-colors ${
              isScrolled ? "bg-gray-200 dark:bg-slate-700" : "bg-transparent"
            }`}
          ></div>
          <motion.div className="hidden md:flex gap-2">
            <NavPill text="Home" route="/" active={location.pathname === "/"} />
            <NavPill
              text="Events"
              route="/events"
              active={location.pathname === "/events"}
            />
            <NavPill
              text="Broadcast"
              route="/broadcast"
              active={location.pathname === "/broadcast"}
            />
          </motion.div>
        </div>

        {/* Mobile Menu Toggle & Actions */}
        <div className="flex items-center gap-3 pl-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button
            onClick={toggleTheme}
            className="text-gray-500 hover:text-black dark:text-slate-400 dark:hover:text-amber-400 transition-colors"
          >
            {isDark ? (
              <Sun className="w-6 h-6 md:w-8 md:h-8" />
            ) : (
              <Moon className="w-6 h-6 md:w-8 md:h-8" />
            )}
          </button>

          {/* <button
            onClick={() => navigate("/payment")}
            className="bg-black hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
          >
            {isScrolled ? "Join" : "Join Community"}
          </button> */}
        </div>
      </motion.div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-24 left-4 right-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 pointer-events-auto flex flex-col gap-4 md:hidden"
          >
            <button
              onClick={() => handleMobileNavigate("/")}
              className={`text-lg font-bold p-4 rounded-xl text-left transition-colors ${
                location.pathname === "/"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleMobileNavigate("/events")}
              className={`text-lg font-bold p-4 rounded-xl text-left transition-colors ${
                location.pathname === "/events"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => handleMobileNavigate("/broadcast")}
              className={`text-lg font-bold p-4 rounded-xl text-left transition-colors ${
                location.pathname === "/broadcast"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              Broadcast
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default React.memo(Navbar);
