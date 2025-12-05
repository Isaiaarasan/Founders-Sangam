import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
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
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-12 px-6 md:px-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Upcoming <span className="text-amber-500">Events</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Join us for networking sessions, workshops, and exclusive meetups designed for founders.
          </p>
        </motion.div>

        {events.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-20">
            <p className="text-xl">No upcoming events scheduled at the moment.</p>
            <p className="mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={event.image || "https://via.placeholder.com/600x400"}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold text-slate-900 dark:text-white shadow-lg">
                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-amber-500 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                      <Calendar size={18} className="text-amber-500" />
                      <span>{new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                      <MapPin size={18} className="text-amber-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-8 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:gap-4 transition-all"
                    >
                      Register Now <ArrowRight size={20} className="text-amber-500" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;