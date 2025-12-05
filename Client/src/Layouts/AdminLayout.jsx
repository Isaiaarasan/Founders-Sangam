import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, CreditCard, FileText, Settings, LogOut } from "lucide-react";
import clsx from "clsx";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: Users, label: "Members", path: "/admin/members" },
        { icon: Calendar, label: "Events", path: "/admin/events" },
        { icon: CreditCard, label: "Payments", path: "/admin/payments" },
        { icon: FileText, label: "Content", path: "/admin/content" },
        { icon: Settings, label: "Settings", path: "/admin/settings" },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-500">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h1 className="text-2xl font-bold tracking-tighter">
                        FOUNDERS <span className="text-amber-500">ADMIN</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                                location.pathname === item.path
                                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg"
                                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
