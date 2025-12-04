import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  CreditCard,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Import Shared Components
import FadeIn from "../components/FadeIn";

// --- Theme Utilities ---
const BRAND_GRADIENT = "from-amber-400 via-red-500 to-sky-500";

// --- FIXED INPUT FIELD COMPONENT ---
const InputField = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  icon: Icon,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 ml-1">
      {label}
    </label>
    <div className="relative group">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
      />
      {Icon && (
        <Icon
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors"
          size={20}
        />
      )}
    </div>
  </div>
);

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.contact) {
      alert("Please fill in all details");
      return;
    }

    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Create Order (Backend)
      // Ensure your backend is running on port 5000
      const res = await axios.post(
        "https://founders-sangam.onrender.com/create-order",
        {
          amount: 500, // ₹500
        }
      );

      const order = res.data.order;

      // 2️⃣ Open Razorpay Checkout
      const options = {
        key: "rzp_test_RnAgUVl3ntYn9p", // Your Test Key
        amount: order.amount,
        currency: order.currency,
        name: "Founders Sangam",
        description: "Premium Membership",
        image: "https://via.placeholder.com/150",
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "https://founders-sangam.onrender.com/verify-payment",
              response
            );

            if (verifyRes.data.success) {
              alert("Welcome to Founders Sangam! Payment Verified.");
              // Add navigation to success page here if needed
            } else {
              alert("Payment Verification Failed!");
            }
          } catch (error) {
            console.error(error);
            alert("Verification Error");
          }
        },

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
        },
        theme: {
          color: "#f59e0b",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", (res) => {
        alert(res.error.description);
      });
    } catch (error) {
      console.error("Payment Error:", error);
      alert(
        "Something went wrong initializing payment. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500 py-20 px-4">
      {/* --- Background Blobs --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-100/30 dark:bg-amber-900/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-100/30 dark:bg-sky-900/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* --- Left Column: Value Proposition --- */}
        <div className="hidden lg:block space-y-8">
          <FadeIn>
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div className="w-3 h-3 rounded-full bg-sky-500"></div>
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Join the <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${BRAND_GRADIENT}`}
              >
                Inner Circle.
              </span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Secure your spot in Tirupur's most exclusive startup ecosystem.
              Unlock events, mentorship, and a network that matters.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="space-y-4">
            {[
              "Access to monthly Founder Meetups",
              "Exclusive Mentorship Sessions",
              "Digital Community Access",
              "Member-only Resources & Perks",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-medium"
              >
                <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={18} />
                </div>
                {item}
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex items-center gap-3 mt-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl w-fit border border-slate-100 dark:border-slate-800">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700"
                  ></div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900 dark:text-white">
                  50+ Founders
                </p>
                <p className="text-slate-500 text-xs">Joined this month</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* --- Right Column: Payment Form --- */}
        <FadeIn delay={0.1} className="w-full">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 p-8 md:p-10 relative overflow-hidden">
            <div
              className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${BRAND_GRADIENT}`}
            ></div>

            <div className="mb-8">
              <span className="inline-block py-1 px-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                Membership Plan
              </span>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                  ₹500
                </h2>
                <span className="text-slate-400 font-medium">/ lifetime</span>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <InputField
                label="Full Name"
                type="text"
                name="name"
                placeholder="Ex. Aravind Kumar"
                value={formData.name}
                onChange={handleChange}
              />

              <InputField
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
              />

              <InputField
                label="Phone Number"
                type="tel"
                name="contact"
                placeholder="98765 43210"
                value={formData.contact}
                onChange={handleChange}
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-200 dark:shadow-slate-900/50 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Pay Securely <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium mt-4">
                <Lock size={12} />
                <span>Secured by Razorpay</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>UPI, Card, Netbanking</span>
              </div>
            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default PaymentPage;
