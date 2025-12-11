import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // <-- NEW
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // <-- Prevent multiple clicks

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://founders-sangam.onrender.com/admin/login",
        {
          username,
          password,
        }
      );

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false); // <-- Re-enable after response
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFDFD] dark:bg-[#050505] transition-colors duration-500 relative overflow-hidden font-sans">
      {/* Ambient Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 dark:bg-[#0A0A0A]/90 backdrop-blur-2xl p-10 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-black/80 border border-white/20 dark:border-neutral-800">
          {/* Header Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-white dark:from-neutral-900 dark:to-black rounded-2xl flex items-center justify-center shadow-inner border border-gray-100 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300">
                <Lock size={32} className="text-neutral-900 dark:text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mb-2">
              Admin Portal
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Please authenticate to continue
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-center text-sm font-medium flex items-center justify-center gap-2"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading} // <-- disable input while loading
                className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 disabled:bg-gray-200/50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 font-medium"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 disabled:bg-gray-200/50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 mt-6 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-amber-900/10 dark:hover:shadow-white/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Loging in...
                </span>
              ) : (
                <>
                  Secure Login
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] text-neutral-400 dark:text-neutral-600 font-bold uppercase tracking-widest">
          Secured by Founders Sangam
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
