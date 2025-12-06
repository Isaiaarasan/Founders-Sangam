import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Rocket, MapPin, Quote, Zap, Globe, BookOpen, Plus, Minus, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom"; // Assuming these imports are in your main file
// Import other dependencies (FadeIn, Counter, etc.) as needed from your previous code

const MAX_PARTICLES = 35; // Maximum number of trail elements
const PARTICLE_LIFESPAN = 300; // REDUCED: Time (ms) before a particle is removed (was 500)

const CursorTrail = () => {
    // State to hold the array of particle objects
    const [particles, setParticles] = useState([]);

    // Ref to hold the ID of the requestAnimationFrame loop
    const rafRef = useRef(null);

    // Ref to store the latest mouse position
    const mousePosRef = useRef({ x: 0, y: 0 });

    // Ref to store the last time a particle was added
    const lastEmitTimeRef = useRef(0);

    // Function to handle the emission and cleanup loop
    const updateParticles = useCallback(() => {
        const now = Date.now();
        const { x, y } = mousePosRef.current;

        // 1. Particle Emission (Now emitting faster, every ~10ms)
        if (now - lastEmitTimeRef.current > 10 && particles.length < MAX_PARTICLES) {
            const newParticle = {
                id: now,
                x: x + Math.random() * 6 - 3, // Reduced jitter
                y: y + Math.random() * 6 - 3,
                birthTime: now,
                size: Math.random() * 6 + 1, // Smaller size range (1px to 7px)
                color: Math.random() > 0.5 ? "amber" : "red"
            };

            // Limit the total number of particles
            setParticles(prev =>
                [newParticle, ...prev].slice(0, MAX_PARTICLES)
            );

            lastEmitTimeRef.current = now;
        }

        // 2. Particle Cleanup (Particles fade out much faster due to lower LIFESPAN)
        setParticles(prev =>
            prev.filter(p => now - p.birthTime < PARTICLE_LIFESPAN)
        );

        rafRef.current = requestAnimationFrame(updateParticles);
    }, [particles.length]);


    // Effect to start and stop the animation loop
    useEffect(() => {
        rafRef.current = requestAnimationFrame(updateParticles);
        return () => cancelAnimationFrame(rafRef.current);
    }, [updateParticles]);


    // Effect to track mouse position
    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("pointermove", handleMouseMove);
        return () => window.removeEventListener("pointermove", handleMouseMove);
    }, []);


    return (
        <motion.div
            style={{ pointerEvents: 'none' }}
            className="fixed inset-0 z-50"
        >
            {particles.map(p => {
                const age = Date.now() - p.birthTime;
                const progress = age / PARTICLE_LIFESPAN;
                const opacity = 1 - progress * 1.5; // Make opacity drop faster
                const scale = 1 - progress * 0.7; // Shrink as they fade

                // Use a very stiff spring for particle movement to reduce visual lag
                const superFastSpring = {
                    type: "spring",
                    stiffness: 400, // Significantly increased (was 150)
                    damping: 10,   // Significantly decreased (was 18)
                    mass: 0.1      // Reduced (was 0.5)
                };

                return (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{
                            x: p.x,
                            y: p.y,
                            opacity: opacity > 0 ? opacity : 0, // Ensure opacity is never negative
                            scale: scale,
                        }}
                        transition={superFastSpring} // Apply the super fast spring
                        className={`absolute rounded-full ${p.color === 'amber' ? 'bg-amber-400 dark:bg-amber-300' : 'bg-red-500 dark:bg-red-300'} mix-blend-difference`}
                        style={{
                            width: p.size,
                            height: p.size,
                            top: 0,
                            left: 0,
                            translateX: "-50%",
                            translateY: "-50%",
                        }}
                    />
                );
            })}
        </motion.div>
    );
};

// --- Rest of the Hero Component (No Changes Needed Here) ---

// ... Your existing imports ...

// Define DepthElements and other utility components if they are in this file

const DepthElements = () => (
    <div className="absolute inset-0 w-full h-full perspective-[1000px] pointer-events-none">
        {/* ... existing 3D elements ... */}
    </div>
);

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

// ... other utilities ...

// 1. Hero Section
const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 pt-25 pb-12 transition-colors duration-500">

            {/* UPDATED: Cursor Trail component for fast interaction */}
            <CursorTrail />

            {/* Existing Background Blobs (z-0) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* ... existing background blobs ... */}
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
                                    x: [ring.x, ring.x, ring.x, ring.x, ring.x, ring.x],
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

export default Hero;