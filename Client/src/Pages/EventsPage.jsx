import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Import the external components
import EventCard from "../components/EventCard";
import FeaturedEventCard from "../components/FeaturedEventCard";

const EventsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [events, setEvents] = useState([]); // Kept for consistency if needed elsewhere

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("https://founders-sangam.onrender.com/events");
        if (res.data.success) {
          const allEvents = res.data.events;
          const now = new Date();

          // Filter and sort events: Upcoming ascending, Past descending
          const upcoming = allEvents
            .filter(event => new Date(event.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          const past = allEvents
            .filter(event => new Date(event.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          setUpcomingEvents(upcoming);
          setPastEvents(past);
          setEvents(allEvents);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, []);

  const hasUpcoming = upcomingEvents.length > 0;
  const hasPast = pastEvents.length > 0;

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

        {/* No Events State */}
        {!hasUpcoming && !hasPast ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-20">
            <p className="text-xl">No events scheduled at the moment.</p>
            <p className="mt-2">Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Upcoming Events Section */}
            {hasUpcoming && (
              <div className="mb-20">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-l-4 border-amber-500 pl-4">
                  Upcoming Events
                </h2>

                {upcomingEvents.length === 1 ? (
                  // TEMPLATE: Single Featured Event
                  <FeaturedEventCard event={upcomingEvents[0]} />
                ) : (
                  // TEMPLATE: Multiple Events (Grid layout)
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map((event, index) => (
                      <EventCard key={event._id} event={event} index={index} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Past Events Section */}
            {hasPast && (
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-l-4 border-slate-500 pl-4 opacity-80">
                  Past Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastEvents.map((event, index) => (
                    <EventCard key={event._id} event={event} index={index} isPast={true} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;