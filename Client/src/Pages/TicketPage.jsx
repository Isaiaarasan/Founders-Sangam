import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import {
  Calendar,
  MapPin,
  Download,
  CheckCircle2,
  Home,
  Star,
  Loader2,
  AlertCircle,
  Ticket,
} from "lucide-react";
import FadeIn from "../components/FadeIn";
import { getTicketById } from "../api/eventService";

// --- PREMIUM GOLD TICKET COMPONENT ---
const TicketStructure = ({ data }) => {
  const { name, ticketId, date, eventId } = data;
  const eventType = data.ticketType || "General";

  // PREMIUM GOLD THEME STYLES (Pure Inline CSS)
  const styles = {
    container: {
      width: "600px",
      height: "300px",
      backgroundColor: "#050505",
      borderRadius: "24px",
      overflow: "hidden",
      display: "flex",
      fontFamily: "Arial, sans-serif",
      position: "relative",
      boxSizing: "border-box",
      border: "1px solid #333333",
    },
    goldBorder: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "6px",
      background:
        "linear-gradient(90deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
      zIndex: 10,
    },
    leftSide: {
      flex: 1,
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "white",
      position: "relative",
      background: "radial-gradient(circle at top right, #1a1a1a, #000000)",
    },
    rightSide: {
      width: "200px",
      backgroundColor: "#ffffff",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      borderLeft: "2px dashed #D4AF37",
      position: "relative",
    },
    h2: {
      margin: 0,
      fontSize: "22px",
      fontWeight: "900",
      textTransform: "uppercase",
      color: "#D4AF37",
      letterSpacing: "1px",
    },
    smallText: {
      margin: 0,
      fontSize: "9px",
      textTransform: "uppercase",
      letterSpacing: "3px",
      color: "#888888",
      marginTop: "4px",
    },
    label: {
      margin: 0,
      fontSize: "9px",
      fontWeight: "bold",
      textTransform: "uppercase",
      color: "#D4AF37",
      marginBottom: "4px",
      opacity: 0.8,
    },
    value: {
      margin: 0,
      fontSize: "20px",
      fontWeight: "bold",
      color: "#ffffff",
    },
    subValue: {
      margin: 0,
      fontSize: "12px",
      color: "#cccccc",
      fontStyle: "italic",
    },
    row: { display: "flex", gap: "40px", marginTop: "20px" },
    footer: {
      marginTop: "auto",
      paddingTop: "16px",
      borderTop: "1px solid #333333",
      fontSize: "11px",
      color: "#666666",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    verified: {
      color: "#D4AF37",
      fontSize: "12px",
      fontWeight: "bold",
      textTransform: "uppercase",
      marginTop: "12px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    ticketIdBox: {
      background: "#151515",
      padding: "6px 12px",
      borderRadius: "4px",
      border: "1px solid #333333",
      fontSize: "12px",
      color: "#D4AF37",
      fontFamily: "monospace",
      display: "inline-block",
      letterSpacing: "1px",
    },
    holeTop: {
      position: "absolute",
      top: "-12px",
      left: "-12px",
      width: "24px",
      height: "24px",
      backgroundColor: "#000000",
      borderRadius: "50%",
      zIndex: 20,
    },
    holeBottom: {
      position: "absolute",
      bottom: "-12px",
      left: "-12px",
      width: "24px",
      height: "24px",
      backgroundColor: "#000000",
      borderRadius: "50%",
      zIndex: 20,
    },
  };

  return (
    <div id="ticket-node" style={styles.container}>
      <div style={styles.goldBorder}></div>

      {/* LEFT SIDE */}
      <div style={styles.leftSide}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "24px",
            }}
          >
            <div>
              <h2 style={styles.h2}>Founders Sangam</h2>
              <p style={styles.smallText}>{eventId?.title || "Event Pass"}</p>
            </div>
            <div>
              <Star size={24} fill="#D4AF37" color="#D4AF37" />
            </div>
          </div>

          <div>
            <p style={styles.label}>Attendee</p>
            <h3 style={styles.value}>{name}</h3>
          </div>

          <div style={styles.row}>
            <div>
              <p style={styles.label}>Event Date</p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#eeeeee",
                  fontSize: "14px",
                }}
              >
                <Calendar size={14} color="#D4AF37" />{" "}
                <span>
                  {eventId?.title
                    ? new Date(eventId.date).toLocaleDateString()
                    : date}
                </span>
              </div>
            </div>
            <div>
              <p style={styles.label}>Tier</p>
              <div
                style={{
                  color: "#eeeeee",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {eventType}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <p style={styles.label}>Ticket ID</p>
            <div style={styles.ticketIdBox}>
              {ticketId ? ticketId.slice(-6).toUpperCase() : "###"}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <MapPin size={12} color="#D4AF37" />
          <span style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
            {eventId?.location || "Tirupur, Tamil Nadu"}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.rightSide}>
        <div style={styles.holeTop}></div>
        <div style={styles.holeBottom}></div>

        <QRCode
          value={JSON.stringify({ ticketId, name, type: eventType })}
          size={110}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          viewBox={`0 0 256 256`}
          fgColor="#000000"
        />

        <div style={styles.verified}>
          <CheckCircle2 size={14} strokeWidth={3} /> Verified
        </div>
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: 0.7,
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#000000",
              fontWeight: "bold",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Ticket size={12} /> Single Entry
          </div>
          <p style={{ fontSize: "8px", color: "#444", marginTop: "2px" }}>
            Valid for one visit only
          </p>
        </div>
      </div>
    </div>
  );
};

const TicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      // Priority 1: Instant Data via State (Membership or Fresh Payment)
      if (location.state?.paymentData) {
        const data = location.state.paymentData;
        // Normalize to Ticket Format
        setTicket({
          _id: data.ticketId,
          name: data.name,
          createdAt: new Date().toISOString(),
          ticketType: data.ticketType || "Membership",
          eventId: {
            title: "Founders Sangam",
            location: "Tirupur, TN",
          },
        });
        setLoading(false);
      }
      // Priority 2: Fetch Event Ticket via ID (URL)
      else if (id && id !== "access-card") {
        try {
          const data = await getTicketById(id);
          if (data) {
            setTicket(data);
          } else {
            setError("Ticket not found");
          }
        } catch (err) {
          setError("Failed to load ticket");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid Ticket Access");
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id, location.state]);

  const handleDownload = async () => {
    setIsDownloading(true);
    // Allow UI to settle
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const element = document.getElementById("ticket-node");
      const dataUrl = await toPng(element, {
        cacheBust: true,
        width: 600,
        height: 300,
        pixelRatio: 3, // High quality
        style: {
          transform: "none",
          margin: "0",
        },
      });

      // Creates a PDF with exactly the dimensions of the ticket image
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [600, 300],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, 600, 300);
      pdf.save(`FS_Ticket_${ticket._id}.pdf`);
    } catch (error) {
      console.error("Download Error:", error);
      alert("Download failed.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );

  if (error || !ticket)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-900 dark:text-white">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">{error || "Ticket not found"}</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-amber-500 rounded-lg text-white font-bold"
        >
          Go Home
        </button>
      </div>
    );

  // Normalize Data Structure
  const ticketData = {
    name: ticket.name,
    ticketId: ticket._id,
    date: ticket.createdAt,
    ticketType: ticket.ticketType || "Membership",
    eventId: ticket.eventId,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-500">
      <FadeIn>
        <div className="text-center mb-4 md:mb-8 mt-4 md:mt-0">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4 shadow-xl">
            <CheckCircle2 size={32} className="text-amber-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            You're In!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
            Registration confirmed. Here is your ticket.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          {/* Display the Premium Ticket */}
          {/* Responsive Scaling: 
                        - Mobile (<640px): scale-[0.55] (Fits 600px into ~330px)
                        - SMB (<768px): scale-75
                        - Desktop (>=768px): scale-100
                    */}
          <div className="transform scale-[0.55] sm:scale-75 md:scale-100 shadow-2xl shadow-slate-300 dark:shadow-black/50 rounded-[24px] overflow-hidden origin-center transition-transform duration-300">
            <TicketStructure data={ticketData} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-12 w-full max-w-[300px] sm:max-w-none items-center justify-center">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all text-sm hover:scale-105 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <Home size={18} />
              Home
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all active:scale-95 text-sm disabled:opacity-70 text-black border-none"
              style={{
                background: "linear-gradient(90deg, #BF953F, #AA771C)",
                boxShadow: "0 0 20px rgba(191, 149, 63, 0.4)",
              }}
            >
              {isDownloading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Download size={18} />
              )}
              {isDownloading ? "Generating..." : "Download Ticket"}
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default TicketPage;
