import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShieldAlert, AlertTriangle, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get("https://founders-sangam.onrender.com/settings/status");
                if (res.data.success) {
                    setIsMaintenance(res.data.isMaintenanceMode);
                }
            } catch (error) {
                console.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            await axios.post(
                "https://founders-sangam.onrender.com/admin/settings/maintenance",
                { isMaintenanceMode: isMaintenance },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Settings updated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-amber-500" /></div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">System Settings</h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage global application configurations</p>
            </div>

            {/* Maintenance Mode Card */}
            <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isMaintenance
                ? 'bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30'
                : 'bg-white border-neutral-200 dark:bg-[#0A0A0A] dark:border-neutral-800'}`}>

                <div className="p-8">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${isMaintenance ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400'}`}>
                            {isMaintenance ? <AlertTriangle size={24} /> : <ShieldAlert size={24} />}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Maintenance Mode</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-xl">
                                When enabled, the public website will be inaccessible to all users except admins.
                                A generic "Under Maintenance" page will be displayed. Use this only during critical updates.
                            </p>

                            <div className="flex items-center gap-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isMaintenance}
                                        onChange={() => setIsMaintenance(!isMaintenance)}
                                    />
                                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                                    <span className="ml-3 text-sm font-medium text-neutral-900 dark:text-white">
                                        {isMaintenance ? "Enabled (Site Down)" : "Disabled (Site Live)"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-50/50 dark:bg-neutral-900/30 px-8 py-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <span className={`text-xs font-semibold ${message.includes("Failed") ? "text-red-500" : "text-emerald-500"}`}>
                        {message}
                    </span>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;