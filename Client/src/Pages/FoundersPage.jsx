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
                const res = await axios.get("http://localhost:5000/members");
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
                        Associate <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">Members</span>
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
                                <div className="group relative bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-slate-900/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-24 h-24 mb-6 rounded-full p-1 bg-gradient-to-br from-amber-400 to-red-500">
                                            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${founder.name || "Member"}&background=random&color=fff&size=128`}
                                                    alt={founder.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2 tracking-tight">
                                            {founder.name || "Associate Member"}
                                        </h3>

                                        <div className="px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Founding Member
                                        </div>
                                    </div>
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
