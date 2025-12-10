import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Save, Building2, Upload } from "lucide-react";

const Collaborations = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // New company form state
    const [newCompany, setNewCompany] = useState("");

    useEffect(() => {
        fetchCollaborations();
    }, []);

    const fetchCollaborations = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await axios.get("http://localhost:5000/content/collaboration", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                // If content exists, use it. Expected format: { companies: ["Name1", "Name2"] }
                // or just an array if we decided to store it that way. 
                // Let's assume the content object is { companies: [] } for extensibility (e.g. adding logos later)
                // If it's just an array or string, handle that.
                // Based on plan, we are storing "companies" list.
                const data = res.data.content || { companies: [] };
                setCompanies(data.companies || []);
            }
        } catch (err) {
            console.error("Failed to fetch collaborations", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCompany = () => {
        if (!newCompany.trim()) return;
        setCompanies([...companies, newCompany.trim()]);
        setNewCompany("");
    };

    const handleRemoveCompany = (index) => {
        const updated = companies.filter((_, i) => i !== index);
        setCompanies(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            const token = localStorage.getItem("adminToken");
            await axios.post("http://localhost:5000/content/collaboration",
                { content: { companies } },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: "success", text: "Changes saved successfully!" });
        } catch (err) {
            setMessage({ type: "error", text: "Failed to save changes." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Collaborations</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage the list of companies displayed in the collaboration section.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">

                {/* Add New */}
                <div className="flex gap-4 mb-8">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Enter Company Name"
                            value={newCompany}
                            onChange={(e) => setNewCompany(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCompany()}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleAddCompany}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-2"
                    >
                        <Plus size={20} /> Add
                    </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {companies.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            No companies added yet.
                        </div>
                    ) : (
                        companies.map((company, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                        <Building2 size={20} />
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">{company}</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveCompany(index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Save Footer */}
                <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : <><Save size={20} /> Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Collaborations;
