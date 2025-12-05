import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchEvents = async () => {
        try {
            const res = await axios.get("https://founders-sangam.onrender.com/events");
            if (res.data.success) {
                setEvents(res.data.events);
            }
        } catch (err) {
            console.error("Failed to fetch events");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const onSubmit = async (data) => {
        const token = localStorage.getItem("adminToken");
        try {
            if (editingEvent) {
                await axios.put(`https://founders-sangam.onrender.com/events/${editingEvent._id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post("https://founders-sangam.onrender.com/events", data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            fetchEvents();
            closeModal();
        } catch (err) {
            console.error("Failed to save event");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        const token = localStorage.getItem("adminToken");
        try {
            await axios.delete(`https://founders-sangam.onrender.com/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEvents();
        } catch (err) {
            console.error("Failed to delete event");
        }
    };

    const openModal = (event = null) => {
        setEditingEvent(event);
        if (event) {
            setValue("title", event.title);
            setValue("date", new Date(event.date).toISOString().split("T")[0]);
            setValue("location", event.location);
            setValue("description", event.description);
            setValue("image", event.image);
            setValue("registrationLink", event.registrationLink);
        } else {
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
        reset();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Events</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage upcoming and past events</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                >
                    <Plus size={20} />
                    Create Event
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <motion.div
                        key={event._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 group"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={event.image || "https://via.placeholder.com/400x200"}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => openModal(event)}
                                    className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg text-slate-900 dark:text-white hover:bg-amber-500 hover:text-white transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{event.title}</h3>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                                <CalendarIcon size={16} />
                                {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-4">
                                <MapPin size={16} />
                                {event.location}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">{event.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {editingEvent ? "Edit Event" : "New Event"}
                                </h3>
                                <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                                    <input
                                        {...register("title", { required: true })}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                                    <input
                                        type="date"
                                        {...register("date", { required: true })}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                                    <input
                                        {...register("location", { required: true })}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                                    <input
                                        {...register("image")}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registration Link</label>
                                    <input
                                        {...register("registrationLink")}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                    <textarea
                                        {...register("description", { required: true })}
                                        rows={4}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all"
                                >
                                    {editingEvent ? "Update Event" : "Create Event"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Events;
