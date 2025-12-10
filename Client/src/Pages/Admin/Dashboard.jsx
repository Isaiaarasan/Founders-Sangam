import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, CreditCard, Activity, ArrowUpRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        communityCount: 0,
        eventRegCount: 0,
        totalRevenue: 0,
        activeEvents: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await axios.get("https://founders-sangam.onrender.com/admin/stats", {
                    headers: { Authorization: `Bearer ${token} ` },
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

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p - 3 rounded - xl ${color} bg - opacity - 10 dark: bg - opacity - 20`}>
                    <Icon size={22} className={`${color.replace("bg-", "text-")} dark: text - white`} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                        <TrendingUp size={12} />
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-1 tracking-tight">
                    {value}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
                    {title}
                </p>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Overview</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Here's what's happening with your community today.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/registrations')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-neutral-200 dark:shadow-none"
                >
                    <ArrowUpRight size={18} />
                    View Reports
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Community Members"
                    value={stats.communityCount}
                    icon={Users}
                    color="bg-amber-500"
                    trend="+12%"
                />
                <StatCard
                    title="Event Registrations"
                    value={stats.eventRegCount}
                    icon={CreditCard}
                    color="bg-purple-500"
                    trend="+5%"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue?.toLocaleString()}`}
                    icon={Activity}
                    color="bg-emerald-500"
                    trend="+8.5%"
                />
                <StatCard
                    title="Active Events"
                    value={stats.activeEvents}
                    icon={Calendar}
                    color="bg-sky-500"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart Area */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] rounded-3xl p-8 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Growth Analytics</h3>
                        <p className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                            +12.5% vs last month
                        </p>
                    </div>
                    <div className="h-80 w-full">
                        {stats.growthData && stats.growthData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.growthData}>
                                    <defs>
                                        <linearGradient id="colorCommunity" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525233" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#737373', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#737373', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="community"
                                        name="Community Members"
                                        stroke="#f59e0b"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorCommunity)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="events"
                                        name="Event Registrations"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorEvents)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                                Not enough data to display chart
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Transactions / Activity Feed */}
                <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl p-8 border border-neutral-100 dark:border-neutral-800 shadow-sm h-fit">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {stats.recentActivity && stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-500 font-bold text-xs">
                                        {(activity.name || "?").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                                            {activity.name || "Unknown User"}
                                        </p>
                                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                                            Joined {activity.brandName || "Founders Sangam"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-neutral-900 dark:text-white">
                                            +₹{activity.amount || 500}
                                        </p>
                                        <p className="text-[10px] text-neutral-400 mt-0.5">
                                            {new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-neutral-500 text-sm py-4">
                                No recent activity
                            </div>
                        )}

                        <button className="w-full py-3 mt-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors border-t border-neutral-100 dark:border-neutral-800">
                            View All Activity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
