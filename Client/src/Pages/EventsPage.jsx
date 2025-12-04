import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Clock } from "lucide-react";
import axios from "axios";

// Import Shared Components
import FadeIn from "../components/FadeIn";

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("https://founders-sangam.onrender.com/events");
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);
  const pastEvents = events.filter((e) => new Date(e.date) < now);

  const EventCard = ({ event, isPast }) => (
    <FadeIn className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || "https://via.placeholder.com/400x200"}
          alt={event.title}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${isPast ? "grayscale" : ""
            }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <Calendar size={14} className="text-amber-400" />
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-6">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {new Date(event.date).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            {event.location || "Tirupur"}
          </div>
        </div>
        {!isPast && (
          <button
            onClick={() => navigate("/payment")}
            className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            Register Now <ArrowRight size={16} />
          </button>
        )}
        {isPast && (
          <div className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-sm text-center cursor-not-allowed">
            Event Concluded
          </div>
        )}
      </div>
    </FadeIn>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      <section className="relative w-full flex flex-col items-center justify-center overflow-hidden pt-28 md:pt-27 pb-12">
        {/* Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-100/40 dark:bg-amber-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"
          />
          <motion.div
            animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-sky-100/40 dark:bg-sky-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"
          />
        </div>

        <FadeIn className="w-full relative flex flex-col items-center justify-center max-w-7xl mx-auto text-center z-10">
          <h1 className="text-6xl md:text-8xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
            COMMUNITY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-sky-500">
              EVENTS
            </span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            Connect, Learn, and Grow with fellow founders.
          </p>
        </FadeIn>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Upcoming Events */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest">
              Upcoming Events
            </h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500">Loading events...</div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500">No upcoming events scheduled.</p>
            </div>
          )}
        </section>

        {/* Past Events */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <h2 className="text-2xl font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
              Past Events
            </h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500">Loading events...</div>
          ) : pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70 hover:opacity-100 transition-opacity">
              {pastEvents.map((event) => (
                <EventCard key={event._id} event={event} isPast={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400">No past events found.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EventsPage;