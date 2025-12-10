import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Loader2,
    ArrowRight,
    ShieldCheck,
    Ticket,
    Calendar,
    MapPin,
    User,
    Mail,
    Phone
} from "lucide-react";

// --- Theme Utilities ---
const BRAND_GRADIENT = "from-amber-400 via-red-500 to-sky-500";

const EventPaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Initial State from Registration
    // We expect state: { type: "TICKET", data: { eventId, dbTicketId, title, price, date, name, email, contact, ticketType, quantity } }
    const { data } = location.state || {};
    const [loading, setLoading] = useState(false);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
                <p>Invalid Session. Please register again.</p>
            </div>
        );
    }

    const { dbTicketId, title, price, name, email, contact, ticketType, quantity } = data;

    const handlePayment = async () => {
        setLoading(true);

        try {
            // 1️⃣ Initiate Payment (PhonePe)
            const res = await axios.post(
                "http://localhost:5000/api/phonepe/pay",
                {
                    name: name,
                    amount: price,
                    number: contact,
                    mid: "MID" + Date.now(),
                    transactionId: "TXN_" + Date.now(),
                    type: "TICKET", // Explicitly Ticket
                    ticketId: dbTicketId, // Important: Existing PENDING ticket
                    brandName: "Founders Sangam",
                    email: email
                }
            );

            if (res.data.success) {
                // 2️⃣ Redirect
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
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row">
            {/* Left: Summary Panel */}
            <div className="md:w-1/2 p-8 md:p-12 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
                        <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                            Payment Step
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                        Complete your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-500">Registration</span>
                    </h1>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 space-y-4">
                        <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-500">
                                <Ticket size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{ticketType} License x {quantity}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                <User size={16} className="text-slate-400" />
                                <span>{name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                <Mail size={16} className="text-slate-400" />
                                <span>{email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                <Phone size={16} className="text-slate-400" />
                                <span>{contact}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">Total Payable</span>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{price}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Action Panel */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-white dark:bg-slate-950 relative overflow-hidden">

                {/* Background Blurs */}
                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-md w-full space-y-8 relative z-10">
                    <div className="text-center">
                        <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Secure Payment</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Transactions are encrypted and secured by PhonePe.
                        </p>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Pay Now"}
                        {!loading && <ArrowRight size={20} />}
                    </button>

                    <p className="text-center text-xs text-slate-400">
                        By proceeding, you agree to our Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventPaymentPage;
