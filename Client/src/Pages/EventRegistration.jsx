import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, registerForEvent } from "../api/eventService";
import TicketForm from "../components/TicketForm";
import { Calendar, MapPin, AlertCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const EventRegistration = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEventById(id);
                if (data) {
                    setEvent(data);
                } else {
                    setError("Event not found");
                }
            } catch (err) {
                setError("Failed to load event");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    // --- Razorpay Helper ---
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRegistration = async (formData) => {
        setSubmitting(true);
        setError(null);

        try {
            // 1. Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert("Please enter a valid email address");
                setSubmitting(false);
                return;
            }

            // 2. Load Razorpay SDK first to fail early if offline/blocked
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                alert("Razorpay SDK failed to load. Please check your internet connection.");
                setSubmitting(false);
                return;
            }

            // 3. Register for Event (Create Ticket in DB with PENDING status)
            const result = await registerForEvent(id, formData);

            if (result.success) {
                // 4. Create Order (Backend)
                const res = await axios.post(
                    "https://founders-sangam.onrender.com/create-order",
                    { amount: formData.amount }
                );

                const order = res.data.order;
                const dbTicketId = result.ticketId;

                // 5. Open Razorpay Checkout
                const options = {
                    key: "rzp_test_Rp6GD9RsE0Gej7",
                    amount: order.amount,
                    currency: order.currency,
                    name: "Founders Sangam",
                    description: `Ticket: ${event.title}`,
                    // image: "https://via.placeholder.com/150", 
                    order_id: order.id,
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.contact,
                    },
                    theme: {
                        color: "#f59e0b",
                    },
                    handler: async function (response) {
                        try {
                            // 6. Verify Payment
                            const verifyRes = await axios.post(
                                "https://founders-sangam.onrender.com/verify-payment",
                                {
                                    ...response,
                                    dbTicketId: dbTicketId,
                                    amount: formData.amount
                                }
                            );

                            if (verifyRes.data.success) {
                                // 7. Success -> Redirect to Ticket Page
                                navigate(`/ticket/${dbTicketId}`);
                            } else {
                                alert("Payment Verification Failed!");
                            }
                        } catch (error) {
                            console.error(error);
                            alert("Verification Error");
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setSubmitting(false);
                        }
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();

                paymentObject.on("payment.failed", (res) => {
                    alert(res.error.description);
                    setSubmitting(false);
                });

            } else {
                throw new Error("Registration failed initially.");
            }
        } catch (err) {
            console.error(err);

            // Handle specific error messages
            let errorMessage = "Registration failed";

            if (typeof err === 'string') {
                errorMessage = err;
            } else if (err.message) {
                errorMessage = err.message;
            }

            alert(errorMessage);
            setSubmitting(false);
        }
        // Note: We don't setSubmitting(false) here immediately because the modal might be open.
        // It's handled in modal.ondismiss and payment.failed, or after navigation.
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
    );

    if (error || !event) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold">{error || "Event not found"}</h2>
        </div>
    );

    const isFull = event.currentRegistrations >= event.maxRegistrations;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-12 px-4 md:px-12 transition-colors duration-500">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {/* Left: Event Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="relative h-48 md:h-80 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl">
                        <img
                            src={event.image || "https://via.placeholder.com/800x400"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 leading-tight">{event.title}</h1>
                            <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm font-medium opacity-90">
                                <span className="flex items-center gap-1"><Calendar size={14} className="md:w-4 md:h-4" /> {new Date(event.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} className="md:w-4 md:h-4" /> {event.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">Event Description</h3>
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-6">
                            {event.description}
                        </p>
                    </div>
                </motion.div>

                {/* Right: Registration Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
                        <div className="mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Register Now</h2>
                            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 md:mt-2">Secure your spot for this exclusive event.</p>
                        </div>

                        {new Date(event.date) < new Date() ? (
                            <div className="p-6 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-center font-bold text-lg">
                                🔒 Registration Closed: Event has ended
                            </div>
                        ) : isFull ? (
                            <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center font-bold text-lg">
                                🚫 Registration Full
                            </div>
                        ) : (
                            <>
                                <TicketForm event={event} onSubmit={handleRegistration} loading={submitting} />
                                <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    <span>Secure Payment via Razorpay</span>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EventRegistration;
