import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Logout from "../components/Logout";

const AppliedEvents = () => {
    const [appliedEvents, setAppliedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userSession = JSON.parse(localStorage.getItem('eventHubUser'));
    const userId = userSession ? userSession.id : null;

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8080/events/applied/${userId}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Could not fetch your tickets");
                    return res.json();
                })
                .then((data) => {
                    setAppliedEvents(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Fetch error:", err);
                    toast.error(err.message, { theme: "dark" });
                    setLoading(false);
                });
        } else {
            toast.error("User session not found. Please login.");
            navigate("/");
        }
    }, [userId, navigate]);

    if (loading) {
        return (
            <div className="App-header">
                <h1 style={{ color: "#61dafb" }}>Verifying your tickets...</h1>
            </div>
        );
    }

    return (
        <div className="dashboard-container fade-in" style={{ padding: "40px 20px" }}>
            <ToastContainer />
            
            {/* Header Section */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start", // Changed to top-aligned for better spacing
                marginBottom: "60px" // Increased margin to separate header from grid
            }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>My Registered Events</h1>
                    <p style={{ color: "#94a3b8" }}>
                        Present these QR codes at the venue entry.
                    </p>
                </div>

                {/* Navigation Group pushed to the right */}
                <div style={{ 
                    display: "flex", 
                    gap: "20px", 
                    alignItems: "center",
                    paddingTop: "10px",
                    marginLeft: "40px" // Minimum distance from the heading
                }}>
                    {/* --- Dashboard Button (Highlighted) --- */}
                    <button 
                        style={{ 
                            width: "auto", 
                            padding: "12px 28px",
                            background: "#1e293b", 
                            border: "1px solid #334155", 
                            borderRadius: "12px", 
                            color: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                            transition: "all 0.2s ease"
                        }}
                        onClick={() => navigate("/dashboard")}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "#334155";
                            e.currentTarget.style.borderColor = "#61dafb";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "#1e293b";
                            e.currentTarget.style.borderColor = "#334155";
                        }}
                    >
                        <span style={{ 
                            fontSize: "1.3rem",
                            background: "linear-gradient(45deg, #22c55e, #eab308, #ef4444)", 
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            display: "inline-block"
                        }}>
                            ⏲️
                        </span>
                        DASHBOARD
                    </button>

                    {/* --- My Tickets Button (Active State) --- */}
                    <button 
                        onClick={() => navigate("/applied-events")}
                        style={{ 
                            width: "auto", 
                            padding: "10px 20px", // Balanced padding for a rectangular look
                            border: "none",
                            background: "rgba(97, 218, 251, 0.1)", // Very subtle cyan background for "Active" state
                            color: "#61dafb", // High-contrast cyan for "Active" text
                            cursor: "pointer",
                            fontSize: "0.85rem", // Slightly smaller for a tighter, pro feel
                            fontWeight: "700", // Bold to stand out
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            borderRadius: "8px", // Clean, modern rounded corners
                            transition: "all 0.3s ease", // Smooth background/color fade
                            letterSpacing: "0.5px" // Professional typography spacing
                        }}
                        // --- RECTANGULAR HIGHLIGHT LOGIC ---
                        onMouseOver={(e) => {
                            // Full, solid background fill on hover
                            e.currentTarget.style.background = "#61dafb"; 
                            // Text changes to a dark color for contrast against the fill
                            e.currentTarget.style.color = "#0f172a"; 
                        }}
                        onMouseOut={(e) => {
                            // Return to subtle background and cyan text
                            e.currentTarget.style.background = "rgba(97, 218, 251, 0.1)";
                            e.currentTarget.style.color = "#61dafb";
                        }}
                    >
                        <span style={{ fontSize: "1.2rem" }}>🎟️</span>
                        <span style={{ letterSpacing: "1px" }}>MY TICKETS</span>
                    </button>
                    <div style={{ textAlign: "right" }}>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "#61dafb", fontWeight: "bold", letterSpacing: "1px" }}>
                            USER
                        </span>
                        <span style={{ display: "block", fontSize: "1rem", color: "#ffffff", fontWeight: "600" }}>
                            {JSON.parse(localStorage.getItem('eventHubUser'))?.name || "Guest"}
                        </span>
                    </div>
                    <Logout />
                </div>
            </div>

            {appliedEvents.length === 0 ? (
                <div className="auth-container" style={{ margin: "0 auto", textAlign: "center" }}>
                    <h3 style={{ color: "white" }}>No events joined yet!</h3>
                    <p style={{ color: "#94a3b8" }}>Discover and register for events on the dashboard.</p>
                    <button className="submit-btn" onClick={() => navigate("/dashboard")}>
                        Find Events
                    </button>
                </div>
            ) : (
                <div className="event-grid">
                    {appliedEvents.map((event) => (
                        <div key={event.id} className="event-card fade-in">
                            <div style={{ position: "relative" }}>
                                <img 
                                    src={event.imagePath || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} 
                                    alt={event.title} 
                                    className="event-image" 
                                />
                                <span className="status-badge" style={{ background: "#22c55e" }}>CONFIRMED</span>
                            </div>
                            
                            <div className="event-details">
                                <h3 style={{ color: "white", margin: "0 0 5px 0" }}>{event.title}</h3>
                                <p style={{ color: "#61dafb", fontSize: "0.9rem", fontWeight: "bold" }}>
                                    📍 {event.venueDetails?.city || "Venue TBD"}
                                </p>
                                
                                <div className="qr-section" style={{ 
                                    textAlign: "center", 
                                    marginTop: "20px", 
                                    padding: "15px", 
                                    background: "white", 
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                                }}>
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=User-${userId}-Event-${event.id}`} 
                                        alt="Ticket QR" 
                                        style={{ width: "120px", height: "120px" }}
                                    />
                                    <div style={{ marginTop: "10px", borderTop: "1px dashed #cbd5e1", paddingTop: "10px" }}>
                                        <p style={{ color: "#0f172a", fontSize: "0.75rem", margin: 0, fontWeight: "800" }}>
                                            PASS ID: EZ-{event.id}{userId}
                                        </p>
                                        <p style={{ color: "#64748b", fontSize: "0.6rem", textTransform: "uppercase" }}>
                                            Scan for Entry
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppliedEvents;