import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const NavPill = ({ text, route, active }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(route)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${active
                    ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                }`}
        >
            {text}
        </button>
    );
};

const Navbar = ({ isDark, toggleTheme }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
                className={`pointer-events-auto flex items-center justify-between py-3 border transition-colors duration-500 ${isScrolled
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
                    <div className="h-6 w-[1px] bg-gray-200 dark:bg-slate-700 hidden md:block"></div>
                    <motion.div className="hidden md:flex gap-2">
                        <NavPill text="Home" route="/" active={location.pathname === "/"} />
                        <NavPill text="Events" route="/events" active={location.pathname === "/events"} />
                        {/* Add more NavPills here as needed */}
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

export default Navbar;
