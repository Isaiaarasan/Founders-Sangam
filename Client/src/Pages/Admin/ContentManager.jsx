import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Plus, Trash2, Edit3, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ContentManager = () => {
    const [activeTab, setActiveTab] = useState("testimonials");
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchContent("testimonials");
    }, []);

    const fetchContent = async (section) => {
        try {
            const res = await axios.get(`https://founders-sangam.onrender.com/content/${section}`);
            if (res.data.success && res.data.content) {
                if (section === "testimonials") setTestimonials(res.data.content);
            }
        } catch (err) {
            console.error("Failed to fetch content");
        }
    };

    const saveContent = async (section, content) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            await axios.post(
                `https://founders-sangam.onrender.com/content/${section}`,
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Content saved successfully!");
        } catch (err) {
            console.error("Failed to save content");
            alert("Failed to save content");
        } finally {
            setLoading(false);
        }
    };

    const addTestimonial = () => {
        setTestimonials([...testimonials, { name: "", role: "", content: "", color: "border-amber-400" }]);
    };

    const updateTestimonial = (index, field, value) => {
        const newTestimonials = [...testimonials];
        newTestimonials[index][field] = value;
        setTestimonials(newTestimonials);
    };

    const removeTestimonial = (index) => {
        const newTestimonials = testimonials.filter((_, i) => i !== index);
        setTestimonials(newTestimonials);
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-500">
                        <Edit3 size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Content Manager</h2>
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 ml-1">Manage and update your landing page sections in real-time.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                <button
                    onClick={() => setActiveTab("testimonials")}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-t-lg transition-all border-b-2 ${activeTab === "testimonials"
                            ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10"
                            : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900"
                        }`}
                >
                    <MessageSquare size={16} />
                    Testimonials
                </button>
                {/* Add more tabs here later */}
            </div>

            {activeTab === "testimonials" && (
                <div className="space-y-6">
                    <AnimatePresence>
                        {testimonials.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group bg-white dark:bg-[#0A0A0A] p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all relative"
                            >
                                <div className="absolute -left-[1px] top-8 bottom-8 w-1 bg-amber-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                <button
                                    onClick={() => removeTestimonial(index)}
                                    className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove Testimonial"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Name</label>
                                        <input
                                            value={item.name}
                                            onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                            placeholder="Ex. Rajesh Kumar"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Role / Company</label>
                                        <input
                                            value={item.role}
                                            onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                            placeholder="Ex. CEO, TechCorp"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Quote Content</label>
                                    <textarea
                                        value={item.content}
                                        onChange={(e) => updateTestimonial(index, "content", e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all leading-relaxed"
                                        placeholder="Enter the testimonial text..."
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Action Bar */}
                    <div className="sticky bottom-6 z-10 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl flex justify-between items-center mt-8">
                        <button
                            onClick={addTestimonial}
                            className="flex items-center gap-2 px-6 py-3 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl font-bold hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all"
                        >
                            <Plus size={18} />
                            Add New
                        </button>

                        <button
                            onClick={() => saveContent("testimonials", testimonials)}
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {loading ? "Publishing..." : "Publish Changes"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManager;