import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar as CalendarIcon,
  MapPin,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 9 });
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false); // NEW
  const [searchQuery, setSearchQuery] = useState("");

  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const WatchContent = () => {
    const content = watch("content");
    return <ReactMarkdown>{content || "*No content yet...*"}</ReactMarkdown>;
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://founders-sangam.onrender.com/events",
        {
          params: {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: searchQuery,
          },
        }
      );

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

  // 🔥 UPDATED SUBMIT FUNCTION
  const onSubmit = async (data) => {
    if (submitLoading) return; // Prevent multiple submissions

    setSubmitLoading(true);
    const token = localStorage.getItem("adminToken");

    try {
      if (editingEvent) {
        await axios.put(
          `https://founders-sangam.onrender.com/events/${editingEvent._id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("https://founders-sangam.onrender.com/events", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchEvents();
      closeModal();
    } catch (err) {
      console.error("Failed to save event", err);
    } finally {
      setSubmitLoading(false);
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
      setValue("ticketTypes", event.ticketTypes);
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
          { name: "Diamond Pass", price: 2000 },
        ],
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    reset();
    setSubmitLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Events
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Manage upcoming and past events.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
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
              <p className="text-neutral-500 dark:text-neutral-400">
                Loading events...
              </p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-neutral-500 dark:text-neutral-400">
              No events found
            </p>
          </div>
        ) : (
          events.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white dark:bg-[#0A0A0A] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={event.image || "https://via.placeholder.com/400x200"}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(event)}
                    className="p-2 bg-white/90 dark:bg-black/90 rounded-lg text-neutral-900 dark:text-white hover:bg-amber-500 hover:text-white shadow-lg"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-2 bg-white/90 dark:bg-black/90 rounded-lg text-red-500 hover:bg-red-500 hover:text-white shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">
                  <CalendarIcon size={14} />
                  {new Date(event.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  {event.title}
                </h3>

                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm mb-4">
                  <MapPin size={16} />
                  {event.location}
                </div>

                <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3 flex-1">
                  {event.description}
                </p>

                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white mt-4 hover:underline"
                    target="_blank"
                  >
                    <LinkIcon size={14} /> Registration Link
                  </a>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.max(0, prev.pageIndex - 1),
              }))
            }
            disabled={pagination.pageIndex === 0 || loading}
            className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Page {pagination.pageIndex + 1} of {pageCount}
          </span>

          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.min(pageCount - 1, prev.pageIndex + 1),
              }))
            }
            disabled={pagination.pageIndex >= pageCount - 1 || loading}
            className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#0A0A0A] rounded-2xl w-full max-w-4xl border max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h3>

                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Event Title
                    </label>
                    <input
                      {...register("title", { required: true })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border"
                      placeholder="Ex. Annual Founders Meetup"
                    />
                  </div>

                  {/* Date + Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        {...register("date", { required: true })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">
                        Location
                      </label>
                      <input
                        {...register("location", { required: true })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border"
                        placeholder="City, Venue"
                      />
                    </div>
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Image URL
                    </label>
                    <input
                      {...register("image")}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Registration Link */}
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Registration Link
                    </label>
                    <input
                      {...register("registrationLink")}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border"
                      placeholder="Optional external URL"
                    />
                  </div>

                  {/* Max Registrations */}
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Max Registrations
                    </label>
                    <input
                      type="number"
                      {...register("maxRegistrations", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border"
                    />
                  </div>

                  {/* Ticket Types */}
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Ticket Types
                    </label>

                    <div className="grid grid-cols-3 gap-4">
                      {/* Gold
                      <div>
                        <label className="text-xs">Gold Pass</label>
                        <input
                          type="hidden"
                          {...register("ticketTypes.0.name")}
                          value="Gold Pass"
                        />
                        <input
                          type="number"
                          {...register("ticketTypes.0.price", {
                            valueAsNumber: true,
                          })}
                          className="w-full p-2 rounded-lg border bg-white dark:bg-black mt-1"
                          placeholder="Price"
                        />
                      </div> */}

                      {/* Platinum
                      <div>
                        <label className="text-xs">Platinum Pass</label>
                        <input
                          type="hidden"
                          {...register("ticketTypes.1.name")}
                          value="Platinum Pass"
                        />
                        <input
                          type="number"
                          {...register("ticketTypes.1.price", {
                            valueAsNumber: true,
                          })}
                          className="w-full p-2 rounded-lg border bg-white dark:bg-black mt-1"
                          placeholder="Price"
                        />
                      </div> */}

                      {/* Diamond */}
                      <div>
                        <label className="text-xs">Entry Pass</label>
                        <input
                          type="hidden"
                          {...register("ticketTypes.2.name")}
                          value="Entry Pass"
                        />
                        <input
                          type="number"
                          {...register("ticketTypes.2.price", {
                            valueAsNumber: true,
                          })}
                          className="w-full p-2 rounded-lg border bg-white dark:bg-black mt-1"
                          placeholder="Price"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Short Description
                    </label>
                    <textarea
                      {...register("description", { required: true })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border"
                      placeholder="Brief event summary..."
                    />
                  </div>

                  {/* Markdown Editor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        Full Content (Markdown)
                      </label>
                      <textarea
                        {...register("content")}
                        rows={15}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border font-mono text-sm"
                        placeholder="# Event Details..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">
                        Live Preview
                      </label>
                      <div className="w-full h-[370px] px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111] border overflow-y-auto prose dark:prose-invert prose-sm">
                        <WatchContent />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button with Loading */}
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Saving...
                      </span>
                    ) : editingEvent ? (
                      "Save Changes"
                    ) : (
                      "Publish Event"
                    )}
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
