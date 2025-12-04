import React, { useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  MessageCircle, // Added for WhatsApp icon
} from "lucide-react";
import emailjs from "@emailjs/browser";
import FadeIn from "../components/FadeIn";

// --- Theme Utilities ---
const BRAND_GRADIENT = "from-amber-400 via-red-500 to-sky-500";

// --- REUSABLE INPUT COMPONENT ---
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
  const [loading, setLoading] = useState(false);
  // Updated State to include Brand Name
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    email: "",
    contact: "",
  });

  // Handle Input Change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

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
    // Updated Validation
    if (!formData.name || !formData.brandName || !formData.email || !formData.contact) {
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
      const res = await axios.post(
        "https://founders-sangam.onrender.com/create-order",
        { amount: 500 }
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
              { ...response, ...formData }
            );

            if (verifyRes.data.success) {
              // EmailJS Logic
              const SERVICE_ID = "service_48327po";
              const TEMPLATE_ID = "template_yjf6oog";
              const PUBLIC_KEY = "1t-jFqpOx_L8ufGlN";

              const templateParams = {
                user_name: formData.name,
                brand_name: formData.brandName, // Sending brand name to email
                user_email: formData.email,
                to_email: formData.email,
                message: "Welcome to Founders Sangam! Your membership is confirmed.",
              };

              emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
                .then(() => {
                  alert("Welcome to Founders Sangam! Payment Verified & Email Sent.");
                })
                .catch((err) => {
                  console.error("Email failed...", err);
                  alert("Payment Verified, but email failed.");
                });
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
      alert("Something went wrong initializing payment.");
    } finally {
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

        {/* --- LEFT COLUMN: Value Proposition (Spans 5 cols) --- */}
        <div className="lg:col-span-5 space-y-8">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Open for New Members</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
              Invest in your <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${BRAND_GRADIENT}`}>
                Growth Journey.
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Join Tirupur's premier startup ecosystem. A one-time investment for a lifetime of connections.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="space-y-4 pt-2">
            {[
              "Lifetime Access to Community",
              "Monthly Founder Meetups",
              "Investor Networking Opportunities",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
              </div>
            ))}

            {/* Added Specific WhatsApp Message */}
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

          <FadeIn delay={0.4}>
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">50+ Founders</p>
                  <p className="text-xs text-slate-500">Joined recently</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* --- RIGHT COLUMN: Payment Card (Spans 7 cols) --- */}
        <div className="lg:col-span-7 w-full">
          <FadeIn delay={0.1}>
            <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 overflow-hidden">

              {/* Top Accent Line */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${BRAND_GRADIENT}`}></div>

              <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-1 gap-8">

                {/* FORM SECTION */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complete your profile</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Unlock full access instantly.</p>
                  </div>

                  <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <InputField
                        label="Full Name"
                        name="name"
                        type="text"
                        placeholder="Ex. John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Brand Name - NEW FIELD */}
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
                        placeholder="john@example.com"
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
                        placeholder="98765 43210"
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
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Pay ₹500 Securely"}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </div>
                  </form>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                    <ShieldCheck size={12} />
                    <span>Secured by Razorpay</span>
                  </div>
                </div>

              </div>

              {/* Bottom strip */}
              <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
                <span>Lifetime Membership</span>
                <span className="font-bold text-slate-900 dark:text-white text-lg">₹500</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;