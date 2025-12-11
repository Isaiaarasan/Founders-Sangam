import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Home,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Clock,
  Zap,
  HelpCircle,
} from "lucide-react";

// --- Theme Utilities ---
const BRAND_GRADIENT = "from-amber-400 via-red-500 to-sky-500";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [retryDisabled, setRetryDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Get failure details from state (if passed from payment gateway)
  const { data } = location.state || {};
  const failureReason = data?.reason || "Payment could not be processed";
  const ticketId = data?.ticketId;
  const eventId = data?.eventId;

  // Retry cooldown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRetry = () => {
    if (ticketId && eventId) {
      // Store failure context in localStorage for retry
      localStorage.setItem(
        "paymentRetryContext",
        JSON.stringify({
          eventId,
          ticketId,
          failedAttempts:
            (JSON.parse(localStorage.getItem("paymentRetryContext"))
              ?.failedAttempts || 0) + 1,
          lastFailureTime: new Date().toISOString(),
          lastFailureReason: failureReason,
          lastErrorCode: data?.errorCode,
        })
      );

      // Set cooldown timer for this retry attempt
      setCountdown(30);
      setRetryDisabled(true);

      // Navigate to event registration with retry flag
      navigate(`/event/${eventId}`, {
        state: {
          isRetry: true,
          previousTicketId: ticketId,
          failureData: data,
        },
      });
    } else {
      navigate("/events");
    }
  };

  const handleContactSupport = () => {
    // Open email client or navigate to support page
    window.location.href =
      "mailto:support@founders-sangam.com?subject=Payment%20Failure%20Support";
  };

  // Common failure reasons
  const failureReasons = [
    {
      icon: <Zap size={20} className="text-yellow-500" />,
      title: "Insufficient Balance",
      description:
        "Your account doesn't have enough funds for this transaction",
    },
    {
      icon: <Clock size={20} className="text-orange-500" />,
      title: "Session Expired",
      description: "Payment session timed out. Please try again",
    },
    {
      icon: <AlertCircle size={20} className="text-red-500" />,
      title: "Network Error",
      description: "Connection lost during payment. Please check your internet",
    },
    {
      icon: <HelpCircle size={20} className="text-blue-500" />,
      title: "Invalid Details",
      description: "Payment details don't match. Verify and try again",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      {/* Left: Error Summary Panel */}
      <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-r border-red-100 dark:border-red-900/30 flex flex-col justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="max-w-md mx-auto w-full space-y-8 relative z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 w-fit">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">
              Payment Failed
            </span>
          </div>

          {/* Main Error Icon & Message */}
          <div className="text-center space-y-4">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 mx-auto"
            >
              <AlertCircle
                size={40}
                className="text-red-600 dark:text-red-400"
              />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Payment Failed
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {failureReason ||
                  "Unfortunately, your payment could not be processed. Please try again or contact support."}
              </p>
            </div>
          </div>

          {/* Error Code (if available) */}
          {data?.errorCode && (
            <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-red-200 dark:border-red-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Error Code:{" "}
                <span className="font-bold text-red-600 dark:text-red-400">
                  {data.errorCode}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Action Panel */}
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-white dark:bg-slate-950 relative overflow-hidden">
        {/* Background Blurs */}
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* What Went Wrong Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle size={24} className="text-amber-500" />
              What might have gone wrong?
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {failureReasons.slice(0, 2).map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                >
                  <div className="mt-0.5">{reason.icon}</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {reason.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {reason.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Retry Button */}
            <motion.button
              onClick={handleRetry}
              disabled={retryDisabled || countdown > 0}
              whileHover={{ scale: retryDisabled ? 1 : 1.02 }}
              whileTap={{ scale: retryDisabled ? 1 : 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-3"
            >
              <RefreshCw
                size={20}
                className={countdown > 0 ? "animate-spin" : ""}
              />
              <span>
                {countdown > 0 ? `Retry in ${countdown}s` : "Try Payment Again"}
              </span>
            </motion.button>

            {/* Contact Support Button */}
            <motion.button
              onClick={handleContactSupport}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700"
            >
              <MessageSquare size={20} />
              Contact Support
            </motion.button>

            {/* Back to Events Button */}
            <motion.button
              onClick={() => navigate("/events")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3"
            >
              <ArrowLeft size={20} />
              Back to Events
            </motion.button>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 text-center leading-relaxed">
              <CheckCircle2 size={16} className="inline mr-2 text-blue-500" />
              Your registration details are saved. You can retry payment
              anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
