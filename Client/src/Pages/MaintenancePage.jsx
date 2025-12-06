import React from "react";
import { motion } from "framer-motion";
import { Hammer, Wrench } from "lucide-react";

const MaintenancePage = () => {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white font-sans">

            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <div className="absolute inset-0 bg-black/60 z-10" /> {/* Overlay for text readability */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/Images/Video/Website under construction.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 flex justify-center gap-4"
                >
                    <Hammer size={48} className="text-amber-500 animate-bounce" />
                    <Wrench size={48} className="text-amber-500 animate-pulse" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700"
                >
                    Under Maintenance
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto"
                >
                    We are currently upgrading our platform to serve you better.
                    <br className="hidden md:block" />
                    We will be back shortly with an improved experience.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mt-12 inline-block px-8 py-3 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md"
                >
                    <p className="text-amber-400 font-mono text-sm tracking-widest uppercase">
                        Startups never stop • Building the future
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default MaintenancePage;
