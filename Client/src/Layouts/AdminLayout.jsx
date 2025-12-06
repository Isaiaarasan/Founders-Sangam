import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    FileText,
    Settings,
    LogOut,
    Sparkles,
    Sun,
    Moon,
    Ticket
} from "lucide-react";
import clsx from "clsx";

const AdminLayout = ({ isDark, toggleTheme }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: Users, label: "Members", path: "/admin/members" },
        { icon: Ticket, label: "Event Members", path: "/admin/registrations" },
        { icon: Calendar, label: "Events", path: "/admin/events" },
        { icon: CreditCard, label: "Payments", path: "/admin/payments" },
        { icon: FileText, label: "Content", path: "/admin/content" },
        { icon: Settings, label: "Settings", path: "/admin/settings" },
    ];

    return (
        <div className="flex min-h-screen bg-[#FDFDFD] dark:bg-[#050505] text-[#1a1a1a] dark:text-[#ededed] font-sans selection:bg-amber-500/30">

            {/* Sidebar */}
            <aside className="w-72 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-r border-gray-100 dark:border-neutral-800 flex flex-col fixed h-full z-50 transition-all duration-300">

                {/* Logo Area */}
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            FOUNDERS
                        </h1>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold pl-10">
                        Admin Console
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <p className="px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out relative overflow-hidden",
                                    isActive
                                        ? "text-white shadow-md shadow-amber-900/5"
                                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white"
                                )}
                            >
                                {/* Active Background Gradient */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-white dark:to-neutral-200 z-[-1]" />
                                )}

                                {/* Active Indicator Bar (Left) */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-amber-500 rounded-r-full" />
                                )}

                                <item.icon
                                    size={18}
                                    className={clsx(
                                        "transition-colors",
                                        isActive ? "text-amber-400 dark:text-neutral-900" : "group-hover:text-amber-500"
                                    )}
                                />
                                <span className={isActive ? "dark:text-neutral-900" : ""}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-gray-100 dark:border-neutral-800 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="group flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-all duration-200"
                    >
                        <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-900 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
                            {isDark ? <Sun size={16} className="group-hover:text-amber-600 dark:group-hover:text-amber-400" /> : <Moon size={16} className="group-hover:text-amber-600" />}
                        </div>
                        {isDark ? "Light Mode" : "Dark Mode"}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                    >
                        <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-900 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                            <LogOut size={16} />
                        </div>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-72 p-8 lg:p-12 relative">
                {/* Background ambient glow for premium feel */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 dark:bg-amber-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;