import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Plus, Trash2 } from "lucide-react";

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
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Content Manager</h2>
                <p className="text-slate-500 dark:text-slate-400">Update landing page content</p>
            </div>

            <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab("testimonials")}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "testimonials"
                        ? "border-amber-500 text-amber-500"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
                        }`}
                >
                    Testimonials
                </button>
                {/* Add more tabs here later */}
            </div>

            {activeTab === "testimonials" && (
                <div className="space-y-6">
                    {testimonials.map((item, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                            <button
                                onClick={() => removeTestimonial(index)}
                                className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Name</label>
                                    <input
                                        value={item.name}
                                        onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Role</label>
                                    <input
                                        value={item.role}
                                        onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">Content</label>
                                <textarea
                                    value={item.content}
                                    onChange={(e) => updateTestimonial(index, "content", e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white"
                                />
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-4">
                        <button
                            onClick={addTestimonial}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            <Plus size={20} />
                            Add Testimonial
                        </button>
                        <button
                            onClick={() => saveContent("testimonials", testimonials)}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all"
                        >
                            <Save size={20} />
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManager;
