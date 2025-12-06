import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Calendar, MapPin, ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`https://founders-sangam.onrender.com/events/${id}`);
                if (res.data.success) {
                    setEvent(res.data.event);
                } else {
                    setError("Event not found");
                }
            } catch (err) {
                setError("Failed to fetch event details");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-slate-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Event not found</h2>
                <Link to="/events" className="text-amber-500 hover:underline">
                    Back to Events
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-12 px-6 md:px-12 transition-colors duration-500">
            <div className="max-w-4xl mx-auto">
                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-amber-500 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Events
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl"
                >
                    {/* Hero Image */}
                    <div className="h-64 md:h-96 w-full relative">
                        <img
                            src={event.image || "https://via.placeholder.com/800x400"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>
                            <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-amber-500" />
                                    <span>
                                        {new Date(event.date).toLocaleDateString(undefined, {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-amber-500" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Registration Button */}
                        {event.registrationLink && (
                            <div className="mb-10">
                                <a
                                    href={event.registrationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-1"
                                >
                                    Register Now <ExternalLink size={20} />
                                </a>
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-amber-500 hover:prose-a:text-amber-600 prose-img:rounded-xl">
                            <ReactMarkdown>{event.content || event.description}</ReactMarkdown>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EventDetails;
