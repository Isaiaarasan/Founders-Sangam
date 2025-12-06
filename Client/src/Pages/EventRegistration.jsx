import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, registerForEvent } from "../api/eventService";
import TicketForm from "../components/TicketForm";
import { Calendar, MapPin, AlertCircle } from "lucide-react";
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

    const handleRegistration = async (formData) => {
        setSubmitting(true);
        try {
            const result = await registerForEvent(id, formData);
            if (result.success) {
                // Redirect to Payment with Ticket Context
                // We pass ticketId, eventId, and amount to the Payment Page
                navigate("/payment", {
                    state: {
                        type: "TICKET",
                        data: {
                            eventId: id,
                            dbTicketId: result.ticketId, // Critical: Backend Ticket ID
                            title: event.title,
                            price: formData.amount,
                            date: event.date,
                            ...formData
                        }
                    }
                });
            }
        } catch (err) {
            alert(err || "Registration failed");
        } finally {
            setSubmitting(false);
        }
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
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-12 px-6 md:px-12 transition-colors duration-500">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Event Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="relative h-64 md:h-80 rounded-[2rem] overflow-hidden shadow-2xl">
                        <img
                            src={event.image || "https://via.placeholder.com/800x400"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                            <div className="flex gap-4 text-sm font-medium opacity-90">
                                <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(event.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><MapPin size={16} /> {event.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Event Description</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-6">
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
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Register Now</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Secure your spot for this exclusive event.</p>
                        </div>

                        {isFull ? (
                            <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center font-bold text-lg">
                                🚫 Registration Full
                            </div>
                        ) : (
                            <TicketForm event={event} onSubmit={handleRegistration} loading={submitting} />
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EventRegistration;
