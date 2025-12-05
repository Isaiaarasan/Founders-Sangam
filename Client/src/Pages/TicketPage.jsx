import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toPng } from "html-to-image"; // <--- NEW LIBRARY
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import { Calendar, MapPin, Download, CheckCircle2, Home, Star, Loader2 } from "lucide-react";
import FadeIn from "../components/FadeIn";

// --- PREMIUM GOLD TICKET COMPONENT ---
const TicketStructure = ({ data }) => {
    const { name, brandName, ticketId, date, amountPaid, eventType } = data;

    // PREMIUM GOLD THEME STYLES (Pure Inline CSS)
    const styles = {
        container: {
            width: "600px",
            height: "300px",
            backgroundColor: "#050505",
            borderRadius: "24px",
            overflow: "hidden",
            display: "flex",
            fontFamily: "Arial, sans-serif", // Safe font
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
            // html-to-image handles this gradient perfectly
            background: "linear-gradient(90deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
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
        h2: { margin: 0, fontSize: "22px", fontWeight: "900", textTransform: "uppercase", color: "#D4AF37", letterSpacing: "1px" },
        smallText: { margin: 0, fontSize: "9px", textTransform: "uppercase", letterSpacing: "3px", color: "#888888", marginTop: "4px" },
        label: { margin: 0, fontSize: "9px", fontWeight: "bold", textTransform: "uppercase", color: "#D4AF37", marginBottom: "4px", opacity: 0.8 },
        value: { margin: 0, fontSize: "20px", fontWeight: "bold", color: "#ffffff" },
        subValue: { margin: 0, fontSize: "12px", color: "#cccccc", fontStyle: "italic" },
        row: { display: "flex", gap: "40px", marginTop: "20px" },
        footer: { marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #333333", fontSize: "11px", color: "#666666", display: "flex", alignItems: "center", gap: "6px" },
        verified: { color: "#D4AF37", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginTop: "12px", display: "flex", alignItems: "center", gap: "4px" },
        ticketIdBox: {
            background: "#151515",
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1px solid #333333",
            fontSize: "12px",
            color: "#D4AF37",
            fontFamily: "monospace",
            display: "inline-block",
            letterSpacing: "1px"
        },
        holeTop: { position: "absolute", top: "-12px", left: "-12px", width: "24px", height: "24px", backgroundColor: "#000000", borderRadius: "50%", zIndex: 20 },
        holeBottom: { position: "absolute", bottom: "-12px", left: "-12px", width: "24px", height: "24px", backgroundColor: "#000000", borderRadius: "50%", zIndex: 20 }
    };

    return (
        <div id="ticket-node" style={styles.container}>
            <div style={styles.goldBorder}></div>

            {/* LEFT SIDE */}
            <div style={styles.leftSide}>
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                        <div>
                            <h2 style={styles.h2}>Founders Sangam</h2>
                            <p style={styles.smallText}>Premium Access Pass</p>
                        </div>
                        <div>
                            <Star size={24} fill="#D4AF37" color="#D4AF37" />
                        </div>
                    </div>

                    <div>
                        <p style={styles.label}>Attendee</p>
                        <h3 style={styles.value}>{name}</h3>
                        <p style={styles.subValue}>{brandName}</p>
                    </div>

                    <div style={styles.row}>
                        <div>
                            <p style={styles.label}>Event Date</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#eeeeee", fontSize: "14px" }}>
                                <Calendar size={14} color="#D4AF37" /> <span>{date}</span>
                            </div>
                        </div>
                        <div>
                            <p style={styles.label}>Tier</p>
                            <div style={{ color: "#eeeeee", fontSize: "14px", fontWeight: "bold" }}>VIP / GOLD</div>
                        </div>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <p style={styles.label}>Ticket ID</p>
                        <div style={styles.ticketIdBox}>{ticketId}</div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <MapPin size={12} color="#D4AF37" />
                    <span style={{ textTransform: "uppercase", letterSpacing: "1px" }}>Tirupur, Tamil Nadu</span>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div style={styles.rightSide}>
                <div style={styles.holeTop}></div>
                <div style={styles.holeBottom}></div>

                <QRCode
                    value={JSON.stringify({ ticketId, name, type: eventType, tier: "GOLD" })}
                    size={110}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                    fgColor="#000000"
                />

                <div style={styles.verified}>
                    <CheckCircle2 size={14} strokeWidth={3} /> Verified
                </div>
                <div style={{ width: "40px", height: "2px", backgroundColor: "#D4AF37", marginTop: "10px" }}></div>
                <p style={{ fontSize: "10px", color: "#000000", marginTop: "6px", fontWeight: "bold", opacity: 0.6 }}>ADMIT ONE</p>
            </div>
        </div>
    );
};

const TicketPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDownloading, setIsDownloading] = useState(false);

    const data = location.state?.paymentData;

    useEffect(() => {
        if (!data) navigate("/");
    }, [data, navigate]);

    if (!data) return null;

    const handleDownload = async () => {
        setIsDownloading(true);

        // Allow UI to settle
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
            const element = document.getElementById("ticket-node");

            // Using html-to-image (toPng) instead of html2canvas
            // This handles gradients and modern CSS perfectly
            const dataUrl = await toPng(element, {
                cacheBust: true,
                style: {
                    transform: 'scale(1)', // Prevents shifting
                }
            });

            // PDF Generation
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 180;
            // Approximate height based on 2:1 aspect ratio of ticket
            const imgHeight = 90;
            const xOffset = (210 - imgWidth) / 2;

            pdf.addImage(dataUrl, 'PNG', xOffset, 40, imgWidth, imgHeight);
            pdf.save(`FS_Gold_Ticket_${data.ticketId}.pdf`);

        } catch (error) {
            console.error("Download Error:", error);
            alert("Download failed. Please take a screenshot manually.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6">
            <FadeIn>
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#111] border border-[#333] mb-4 shadow-2xl">
                        <CheckCircle2 size={32} color="#D4AF37" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Welcome to the Club
                    </h1>
                    <p className="text-[#888] text-sm max-w-sm mx-auto">
                        Your premium membership is confirmed.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center w-full">
                    {/* Display the Premium Ticket */}
                    <div className="transform scale-90 md:scale-100 shadow-2xl shadow-black/50 rounded-3xl overflow-hidden">
                        <TicketStructure data={data} />
                    </div>

                    <div className="flex gap-4 mt-12">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all text-sm hover:scale-105"
                            style={{ backgroundColor: '#222', color: '#fff', border: '1px solid #444' }}
                        >
                            <Home size={18} />
                            Home
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all active:scale-95 text-sm disabled:opacity-70"
                            style={{
                                background: 'linear-gradient(90deg, #BF953F, #AA771C)',
                                color: '#000000',
                                border: 'none',
                                boxShadow: '0 0 20px rgba(191, 149, 63, 0.4)'
                            }}
                        >
                            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                            {isDownloading ? "Generating..." : "Download Gold Pass"}
                        </button>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

export default TicketPage;