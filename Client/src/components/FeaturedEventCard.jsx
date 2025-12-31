import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedEventCard = ({ event }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all group lg:flex max-w-5xl mx-auto"
    >
        {/* Image Section */}
        <div className="h-64 lg:h-auto lg:w-5/12 overflow-hidden relative">
            <img
                src={event.image || "https://via.placeholder.com/1200x800?text=Featured+Event"}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-amber-500 px-3 py-1.5 rounded-lg text-sm font-bold text-white shadow-md">
                <Calendar size={14} className="inline mr-1.5" />
                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
        </div>

        {/* Content Section */}
        <div className="p-6 lg:p-8 lg:w-7/12 flex flex-col justify-center">
            <Link to={`/event/${event._id}`} className="block">
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-amber-500 transition-colors">
                    {event.title}
                </h3>
            </Link>

            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-4 leading-relaxed line-clamp-3">
                {event.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                {/* Time */}
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <Clock size={16} className="text-amber-500" />
                    <span>
                        {event.time ? (
                            event.time.match(/^\d{2}:\d{2}$/) ? (
                                new Date(`1970-01-01T${event.time}:00`).toLocaleTimeString(undefined, {
                                    hour: "numeric",
                                    minute: "2-digit",
                                })
                            ) : (
                                event.time
                            )
                        ) : (
                            ""
                        )}
                    </span>
                </div>
                {/* Location */}
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <MapPin size={16} className="text-amber-500" />
                    <span className="truncate max-w-[200px]">{event.location}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                <Link
                    to={`/event/${event._id}/register`}
                    className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
                >
                    Register Now
                </Link>
                <Link
                    to={`/event/${event._id}`}
                    className="inline-flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-sm hover:gap-3 transition-all px-4 py-2"
                >
                    Details <ArrowRight size={16} className="text-amber-500" />
                </Link>
            </div>
        </div>
    </motion.div>
);

export default FeaturedEventCard;