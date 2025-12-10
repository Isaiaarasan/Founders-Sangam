import React, { useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Ticket,
  Calendar
} from "lucide-react";

// --- Theme Utilities ---
const BRAND_GRADIENT = "from-amber-400 via-red-500 to-sky-500";

// --- Utility: FadeIn ---
const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Reusable Input Component ---
const InputField = React.memo(({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  icon: Icon,
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
      {label}
    </label>
    <div className="relative group">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-5 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
      />
      {Icon && (
        <Icon
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors pointer-events-none"
          size={18}
        />
      )}
    </div>
  </div>
));

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // --- 1. Determine Context (Event vs Membership) ---
  const isEvent = location.state?.type === "EVENT";
  const eventData = location.state?.data;

  // Defaults
  const title = isEvent ? eventData.title : "Premium Membership";
  const price = isEvent ? eventData.price : 500;
  const description = isEvent ? "Event Registration" : "Lifetime Access";
  const displayDate = isEvent ? eventData.date : new Date().toLocaleDateString();

  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    email: "",
    contact: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /* REMOVED RAZORPAY SCRIPT LOADER */

  const handlePayment = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.brandName || !formData.email || !formData.contact) {
      alert("Please fill in all details");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Validate User (Backend)
      const validateRes = await axios.post(
        "https://founders-sangam.onrender.com/validate-user",
        { email: formData.email, contact: formData.contact }
      );

      if (validateRes.data.exists) {
        alert(validateRes.data.message);
        setLoading(false);
        return;
      }

      // 2️⃣ Initiate Payment (PhonePe)
      const res = await axios.post(
        "https://founders-sangam.onrender.com/api/phonepe/pay",
        {
          name: formData.name,
          amount: price,
          number: formData.contact,
          mid: "MID" + Date.now(),
          transactionId: "TXN_" + Date.now(),
          type: isEvent ? 'TICKET' : 'MEMBERSHIP',
          brandName: formData.brandName,
          email: formData.email
        }
      );

      if (res.data.success) {
        window.location.href = res.data.url;
      } else {
        alert("Payment Initiation Failed");
        setLoading(false);
      }

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong initializing payment.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden py-24 px-4 transition-colors duration-500">

      {/* --- Background Elements --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-200/20 dark:bg-sky-900/10 rounded-full blur-[80px]" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* --- LEFT COLUMN: Info (Spans 5 cols) --- */}
        <div className="lg:col-span-5 space-y-8">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                {isEvent ? "Registrations Open" : "Open for New Members"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
              {isEvent ? "Reserve your" : "Invest in your"} <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${BRAND_GRADIENT}`}>
                {isEvent ? "Spot Now." : "Growth Journey."}
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
              {isEvent
                ? `You are registering for ${title}. Secure your ticket today.`
                : "Claim your place in the most refined FOUNDER circle. A one-time registration that gives you lasting access to a space built for serious builders."}
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="space-y-4 pt-2">
            {[
              isEvent ? "Guaranteed Seating" : "Lifetime Access to Community",
              isEvent ? "Lunch & Networking" : "Monthly Founder Meetups",
              "Investor Networking Opportunities",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
              </div>
            ))}

            {/* WhatsApp Box */}
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800">
              <div className="mt-1 p-0.5 shrink-0 text-green-600 dark:text-green-400">
                <MessageCircle size={18} />
              </div>
              <div>
                <span className="text-slate-900 dark:text-white font-bold block">WhatsApp Community Link</span>
                <span className="text-slate-600 dark:text-slate-300 text-sm">Join the community to get active updates!</span>
              </div>
            </div>
          </FadeIn>

          {/* Social Proof Avatar Stack */}
          <FadeIn delay={0.4}>
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="Avatar" />
                    </div >
                  ))}
                </div >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">50+ Founders</p>
                  <p className="text-xs text-slate-500">Joined recently</p>
                </div>
              </div >
            </div >
          </FadeIn >
        </div >

        {/* --- RIGHT COLUMN: Payment Form (Spans 7 cols) --- */}
        <div className="lg:col-span-7 w-full">
          <FadeIn delay={0.1}>
            <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 overflow-hidden">

              {/* Top Accent Line */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${BRAND_GRADIENT}`}></div>

              <div className="p-8 md:p-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complete details</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Unlock access instantly.</p>
                    </div>
                    {/* Dynamic Price Badge */}
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">{description}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{price}</p>
                    </div>
                  </div>

                  <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <InputField
                        label="Full Name"
                        name="name"
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Brand Name */}
                    <div className="md:col-span-2">
                      <InputField
                        label="Brand Name"
                        name="brandName"
                        type="text"
                        placeholder="Ex. My Startup Pvt Ltd"
                        value={formData.brandName}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-1">
                      <InputField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Your mail"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Phone */}
                    <div className="md:col-span-1">
                      <InputField
                        label="Phone"
                        name="contact"
                        type="tel"
                        placeholder="9876543210"
                        value={formData.contact}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : `Pay ₹${price} Securely`}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </div>
                  </form>

                  <div className="flex items-center justify-center gap-3 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <ShieldCheck size={12} />
                      <span>Secured by PhonePe</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <div className="flex items-center gap-1">
                      <Ticket size={12} />
                      <span>Instant Ticket</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div >
      </div >
    </div >
  );
};

export default PaymentPage;