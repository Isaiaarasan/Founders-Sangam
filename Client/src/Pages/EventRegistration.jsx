import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getEventById, registerForEvent } from "../api/eventService";
import TicketForm from "../components/TicketForm";
import {
  Calendar,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Star,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

// --- Theme Utilities ---
const BRAND_GRADIENT = "from-amber-400 via-red-500 to-sky-500";

// Helper component for staggered fade-in effect
const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [savedFormData, setSavedFormData] = useState(null);
  const [isRetry, setIsRetry] = useState(false);
  const [previousFailure, setPreviousFailure] = useState(null);

  // --- EXISTING LOGIC REMAINS UNCHANGED ---
  useEffect(() => {
    let shouldLoadSavedData = false;

    // Check for payment retry context in localStorage
    const retryContext = localStorage.getItem("paymentRetryContext");
    if (retryContext) {
      try {
        const context = JSON.parse(retryContext);
        if (context.isRetry && context.eventId === id) {
          setIsRetry(true);
          setPreviousFailure({
            reason: context.lastFailureReason,
            errorCode: context.lastErrorCode,
          });
          shouldLoadSavedData = true;
        } else if (context.eventId !== id) {
          // Clear stale retry context for different event
          localStorage.removeItem("paymentRetryContext");
        }
      } catch (err) {
        console.log("Could not parse retry context");
      }
    }

    // Check if coming from payment failure retry (via navigation state)
    if (location.state?.isRetry) {
      setIsRetry(true);
      setPreviousFailure(location.state?.failureData);
      shouldLoadSavedData = true;
    }

    // ONLY load saved form data when it's a retry scenario
    if (shouldLoadSavedData) {
      const savedData = localStorage.getItem(`formData_${id}`);
      if (savedData) {
        try {
          setSavedFormData(JSON.parse(savedData));
        } catch (err) {
          console.log("Could not load saved form data");
        }
      }
    }

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
  }, [id, location.state]);

  const handleRegistration = async (formData) => {
    setSubmitting(true);
    setError(null);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address");
        setSubmitting(false);
        return;
      }

      // SAVE FORM DATA TO LOCALSTORAGE (for retry on failure)
      const paymentContext = {
        eventId: id,
        formData: formData,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(`formData_${id}`, JSON.stringify(formData));
      localStorage.setItem("lastPaymentContext", JSON.stringify(paymentContext));

      const result = await registerForEvent(id, formData);

      if (result.success) {
        const res = await axios.post(
          "https://founders-sangam.onrender.com/api/phonepe/pay",
          {
            name: formData.name,
            amount: formData.amount,
            number: formData.contact,
            mid: "MID" + Date.now(),
            transactionId: "TXN_" + Date.now(),
            type: "TICKET",
            ticketId: result.ticketId,
            brandName: "Founders Sangam",
            email: formData.email,
          }
        );

        if (res.data.success) {
          const redirectUrl = res.data.url;
          if (redirectUrl) {
            // REDIRECT TO PAYMENT - form data saved in localStorage for retry
            window.location.href = redirectUrl;
          } else {
            // Payment URL not found - redirect to failure page
            navigate("/payment-failure", {
              state: {
                data: {
                  reason: "Payment gateway initialization failed",
                  errorCode: "GATEWAY_ERROR",
                  ticketId: result.ticketId,
                  eventId: id,
                  formData: formData, // Pass form data for retry
                },
              },
            });
          }
        } else {
          // Payment initiation failed
          navigate("/payment-failure", {
            state: {
              data: {
                reason:
                  res.data.message ||
                  "Payment initiation failed. Please try again.",
                errorCode: res.data.errorCode || "PAYMENT_INIT_ERROR",
                ticketId: result.ticketId,
                eventId: id,
                formData: formData, // Pass form data for retry
              },
            },
          });
        }
      } else {
        throw new Error("Registration failed initially.");
      }
    } catch (err) {
      console.error(err);
      let errorMessage = "Registration failed";
      if (typeof err === "string") {
        errorMessage = err;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Navigate to failure page with error details
      navigate("/payment-failure", {
        state: {
          data: {
            reason: errorMessage,
            errorCode: "REGISTRATION_ERROR",
            eventId: id,
          },
        },
      });
    }
  };
  // --- END OF EXISTING LOGIC ---

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );

  if (error || !event)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">{error || "Event not found"}</h2>
      </div>
    );

  const isFull = event.currentRegistrations >= event.maxRegistrations;
  const isEventEnded = new Date(event.date) < new Date();

  // Content for Acknowledgement section
  const acknowledgementItems = [
    "Registration is non-refundable and open only to confirmed participants.",
    "Event Duration: 2 hours (1 hr Chief guest Session + 1 hr Networking).",
    "Visitors or plus-ones are not allowed inside the venue.",
    "Event videos and photos will be recorded for marketing purposes.",
    "Snacks and refreshments will be provided during the event.",
    "Please take care of your belongings; organizers are not responsible for loss or damage.",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-12 px-4 md:px-12 transition-colors duration-500">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* 1. Left: Event Info and Acknowledgement (FIRST on Mobile, Left on Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 lg:order-1" // Stays on the left on desktop
        >
          {/* Important Acknowledgement (FIRST on mobile) */}
          <FadeIn delay={0.0}>
            <div className="bg-green-50 dark:bg-green-900/30 p-5 rounded-2xl border border-green-200 dark:border-green-800 shadow-xl ring-2 ring-green-500/50">
              <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white mb-3 flex items-center">
                <ShieldCheck
                  size={20}
                  className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0"
                />
                Claim your place in the most refined FOUNDER circle
              </h3>
              <div className="space-y-3">
                {acknowledgementItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start text-sm text-slate-700 dark:text-slate-300"
                  >
                    <Clock
                      size={16}
                      className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="leading-relaxed font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Event Banner/Header (Now SECOND on mobile - REDUCED SIZE) */}
          <FadeIn
            delay={0.1}
            // *** HEIGHT REDUCED HERE: h-48 md:h-80 -> h-32 md:h-64 ***
            className="relative h-32 md:h-64 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <img
              src={event.image || "https://via.placeholder.com/800x400"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

            {/* Star Rating Badge (Shrunk) */}
            <div className="absolute top-3 left-3 md:top-6 md:left-6 text-white text-xs font-extrabold flex items-center bg-amber-500/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Star
                size={12}
                className="text-yellow-300 fill-yellow-300 mr-1"
              />
              <span>4.85 Star Rated</span>
            </div>

            <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 text-white">
              {/* Title size reduced: text-xl md:text-3xl -> text-base md:text-2xl */}
              <h1 className="text-base md:text-2xl font-bold mb-1 leading-tight">
                {event.title}
              </h1>
              {/* Info size reduced: text-xs md:text-sm -> text-xs font-light */}
              <div className="flex flex-wrap gap-2 md:gap-4 text-xs font-light opacity-90">
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="md:w-3 md:h-3" />{" "}
                  {new Date(event.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="md:w-3 md:h-3" />{" "}
                  {event.location}
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Event Description (Now THIRD on mobile) */}
          <FadeIn
            delay={0.2}
            className="bg-slate-50 dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800"
          >
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
              Description
            </h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
              {event.description}
            </p>
          </FadeIn>
        </motion.div>

        {/* 2. Right: Registration Form (SECOND Column on Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:order-2"
        >
          <div className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 lg:sticky lg:top-8">
            {/* Top Accent Line */}
            <div
              className={`h-1.5 w-full bg-gradient-to-r ${BRAND_GRADIENT} absolute top-0 left-0 rounded-t-2xl md:rounded-t-[2rem]`}
            ></div>

            <div className="mt-4 mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                Register Now
              </h2>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 md:mt-2">
                Secure your spot for this exclusive event.
              </p>

              {/* Retry Alert - Show if coming from payment failure */}
              {isRetry && previousFailure && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex gap-3"
                >
                  <AlertTriangle
                    size={20}
                    className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                      Payment Retry
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                      Your details are pre-filled. Adjust if needed and try
                      payment again.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {isEventEnded ? (
              <div className="p-6 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-center font-bold text-lg">
                🔒 Registration Closed: Event has ended
              </div>
            ) : isFull ? (
              <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center font-bold text-lg">
                🚫 Registration Full
              </div>
            ) : (
              <>
                <TicketForm
                  event={event}
                  onSubmit={handleRegistration}
                  loading={submitting}
                  savedData={savedFormData}
                  isRetry={isRetry}
                />
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>Secure Payment via PhonePe</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventRegistration;
