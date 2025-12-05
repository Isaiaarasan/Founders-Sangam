import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/admin/login", {
                username,
                password,
            });
            if (res.data.success) {
                localStorage.setItem("adminToken", res.data.token);
                navigate("/admin/dashboard");
            }
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900">
                        <Lock size={32} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">Admin Access</h2>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                    >
                        Login
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
