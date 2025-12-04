import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, User } from "lucide-react";

// Import Shared Components
import FadeIn from "../components/FadeIn";

const FoundersPage = () => {
    const [founders, setFounders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFounders = async () => {
            try {
                // Ensure this URL matches your backend
                const res = await axios.get("https://founders-sangam.onrender.com/members");
                if (res.data.success) {
                    setFounders(res.data.members);
                } else {
                    setError("Failed to load members.");
                }
            } catch (err) {
                console.error(err);
                setError("Error fetching members.");
            } finally {
                setLoading(false);
            }
        };

        fetchFounders();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 pt-28 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <FadeIn>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white text-center mb-4 tracking-tight">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">Founders</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-16">
                        Meet the bold individuals shaping the future of Tirupur's startup ecosystem.
                    </p>
                </FadeIn>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-slate-400" size={48} />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 text-lg">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {founders.map((founder, index) => (
                            <FadeIn key={founder._id || index} delay={index * 0.05}>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden">
                                        {/* Placeholder for user image if not available */}
                                        <User size={40} className="text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-1">
                                        {founder.name || "Founder Name"}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                                        {founder.email || "Member"}
                                    </p>
                                    {/* Add more details if available in your Payment model */}
                                </div>
                            </FadeIn>
                        ))}
                        {founders.length === 0 && (
                            <div className="col-span-full text-center text-slate-500">
                                No founders found yet. Be the first to join!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoundersPage;
