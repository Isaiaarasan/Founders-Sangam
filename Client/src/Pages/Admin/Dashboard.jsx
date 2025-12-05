import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Calendar, CreditCard, Activity } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalRevenue: 0,
        activeEvents: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await axios.get("https://founders-sangam.onrender.com/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (err) {
                console.error("Failed to fetch stats");
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-white`}>
                    <Icon size={24} className={color.replace("bg-", "text-")} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    +2.5%
                </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {value}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {title}
            </p>
        </motion.div>
    );

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
                <p className="text-slate-500 dark:text-slate-400">Welcome back, Admin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Members"
                    value={stats.totalMembers}
                    icon={Users}
                    color="bg-amber-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={CreditCard}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Active Events"
                    value={stats.activeEvents}
                    icon={Calendar}
                    color="bg-sky-500"
                />
                <StatCard
                    title="Pending Approvals"
                    value="0"
                    icon={Activity}
                    color="bg-red-500"
                />
            </div>

            {/* Recent Activity Placeholder */}
            <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="text-slate-500 dark:text-slate-400 text-sm">
                    No recent activity to show.
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
