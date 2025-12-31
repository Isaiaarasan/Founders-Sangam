import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const EventCard = ({ event, index, isPast }) => {
  const navigate = useNavigate();

  const handleNavigate = (e, route) => {
    e.preventDefault(); // Stop default Link navigation
    navigate(route); // Custom navigate
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-slate-50 dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group ${isPast ? "opacity-70 grayscale hover:grayscale-0 hover:opacity-100" : ""
        }`}
    >

      {/* CHANGED: Compact card design */}
      <div className="h-[450px] overflow-hidden relative">
        <img
          src={
            event.image ||
            /* CHANGED: Placeholder size updated to 400x600 (portrait) */
            "https://via.placeholder.com/400x600?text=Event+Image"
          }
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold text-slate-900 dark:text-white shadow-lg">
          {new Date(event.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </div>
        {isPast && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-4 py-1 bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest rounded-full">
              Completed
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <Link to={`/event/${event._id}`} className="block">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-500 transition-colors">
            {event.title}
          </h3>
        </Link>

        <div className="flex flex-col gap-2 mb-4">
          {event.time && (
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <Clock size={18} className="text-amber-500" />
              <span>
                {event.time.match(/^\d{2}:\d{2}$/) ? (
                  new Date(`1970-01-01T${event.time}:00`).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })
                ) : (
                  event.time
                )}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <MapPin size={18} className="text-amber-500" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 mb-5 line-clamp-2 leading-relaxed text-sm">
          {event.description}
        </p>

        <div className="flex items-center gap-4">
          <Link
            to={`/event/${event._id}`}
            onClick={(e) => handleNavigate(e, `/event/${event._id}`)}
            className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            Read More
          </Link>

          {!isPast && (
            <Link
              to={`/event/${event._id}/register`}
              onClick={(e) => handleNavigate(e, `/event/${event._id}/register`)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
bg-gradient-to-r from-amber-500 to-red-500
text-white font-bold shadow-md shadow-amber-500/30
hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 active:scale-95
transition-all duration-300"
            >
              Register Now <ArrowRight size={20} className="text-amber-500" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;