import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Calendar as CalendarIcon, MapPin, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 9 });
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { register, handleSubmit, reset, setValue, watch } = useForm();

    const WatchContent = ({ register }) => {
        const content = watch("content");
        return <ReactMarkdown>{content || "*No content yet...*"}</ReactMarkdown>;
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://founders-sangam.onrender.com/events", {
                params: {
                    page: pagination.pageIndex + 1,
                    limit: pagination.pageSize,
                    search: searchQuery
                }
            });
            if (res.data.success) {
                setEvents(res.data.events);
                setPageCount(res.data.pagination.pages);
            }
        } catch (err) {
            console.error("Failed to fetch events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [pagination.pageIndex, pagination.pageSize, searchQuery]);

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
            setValue("content", event.content);
            setValue("maxRegistrations", event.maxRegistrations);
            setValue("ticketTypes", event.ticketTypes); // Expecting array of {name, price}
        } else {
            reset({
                title: "",
                date: "",
                location: "",
                image: "",
                registrationLink: "",
                description: "",
                content: "",
                maxRegistrations: 100,
                ticketTypes: [
                    { name: "Gold Pass", price: 500 },
                    { name: "Platinum Pass", price: 1000 },
                    { name: "Diamond Pass", price: 2000 }
                ]
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
        reset();
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Events</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage upcoming and past events.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-neutral-200 dark:shadow-none"
                >
                    <Plus size={18} />
                    Create Event
                </button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-neutral-500 dark:text-neutral-400">Loading events...</p>
                        </div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                        <p className="text-neutral-500 dark:text-neutral-400">No events found</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group bg-white dark:bg-[#0A0A0A] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={event.image || "https://via.placeholder.com/400x200"}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                    <button
                                        onClick={() => openModal(event)}
                                        className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-lg text-neutral-900 dark:text-white hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 transition-colors shadow-lg"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-3">
                                    <CalendarIcon size={14} />
                                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>

                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                    {event.title}
                                </h3>

                                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm mb-4">
                                    <MapPin size={16} />
                                    {event.location}
                                </div>

                                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                    {event.description}
                                </p>

                                {event.registrationLink && (
                                    <a
                                        href={event.registrationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:underline decoration-amber-500 underline-offset-4"
                                    >
                                        <LinkIcon size={14} /> Registration Link
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {pageCount > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                    <button
                        onClick={() => setPagination(prev => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
                        disabled={pagination.pageIndex === 0 || loading}
                        className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        Page {pagination.pageIndex + 1} of {pageCount}
                    </span>
                    <button
                        onClick={() => setPagination(prev => ({ ...prev, pageIndex: Math.min(pageCount - 1, prev.pageIndex + 1) }))}
                        disabled={pagination.pageIndex >= pageCount - 1 || loading}
                        className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-[#0A0A0A] rounded-2xl w-full max-w-4xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                                    {editingEvent ? "Edit Event" : "Create New Event"}
                                </h3>
                                <button onClick={closeModal} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Event Title</label>
                                        <input
                                            {...register("title", { required: true })}
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                            placeholder="Ex. Annual Founders Meetup"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Date</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    {...register("date", { required: true })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                                />
                                                <CalendarIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Location</label>
                                            <div className="relative">
                                                <input
                                                    {...register("location", { required: true })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                                    placeholder="City, Venue"
                                                />
                                                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Image URL</label>
                                        <div className="relative">
                                            <input
                                                {...register("image")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                                placeholder="https://..."
                                            />
                                            <ImageIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Registration Link (External)</label>
                                        <div className="relative">
                                            <input
                                                {...register("registrationLink")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                                placeholder="Optional: External URL"
                                            />
                                            <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Max Registrations</label>
                                        <input
                                            type="number"
                                            {...register("maxRegistrations", { required: true, valueAsNumber: true })}
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                        />
                                    </div>

                                    {/* Ticket Types Management */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Ticket Types (Name & Price)</label>
                                        <div className="space-y-3 bg-neutral-50 dark:bg-[#111] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs text-neutral-400">Gold Pass</label>
                                                    <input type="hidden" {...register("ticketTypes.0.name")} value="Gold Pass" />
                                                    <input
                                                        type="number"
                                                        {...register("ticketTypes.0.price", { valueAsNumber: true })}
                                                        placeholder="Price"
                                                        className="w-full p-2 rounded-lg border dark:border-neutral-700 bg-white dark:bg-black"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-neutral-400">Platinum Pass</label>
                                                    <input type="hidden" {...register("ticketTypes.1.name")} value="Platinum Pass" />
                                                    <input
                                                        type="number"
                                                        {...register("ticketTypes.1.price", { valueAsNumber: true })}
                                                        placeholder="Price"
                                                        className="w-full p-2 rounded-lg border dark:border-neutral-700 bg-white dark:bg-black"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-neutral-400">Diamond Pass</label>
                                                    <input type="hidden" {...register("ticketTypes.2.name")} value="Diamond Pass" />
                                                    <input
                                                        type="number"
                                                        {...register("ticketTypes.2.price", { valueAsNumber: true })}
                                                        placeholder="Price"
                                                        className="w-full p-2 rounded-lg border dark:border-neutral-700 bg-white dark:bg-black"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Short Description (Card)</label>
                                        <textarea
                                            {...register("description", { required: true })}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all leading-relaxed resize-none"
                                            placeholder="Brief summary for the event card..."
                                        />
                                    </div>

                                    {/* Markdown Editor */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Full Content (Markdown)</label>
                                            <textarea
                                                {...register("content")}
                                                rows={15}
                                                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all leading-relaxed font-mono text-sm"
                                                placeholder="# Event Details&#10;&#10;Write your content in markdown..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Live Preview</label>
                                            <div className="w-full h-[370px] px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 overflow-y-auto prose dark:prose-invert prose-sm max-w-none">
                                                <WatchContent register={register} />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 mt-2"
                                    >
                                        {editingEvent ? "Save Changes" : "Publish Event"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Events;