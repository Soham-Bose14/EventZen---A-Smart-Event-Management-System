import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Logout from "../components/Logout";

const MyHostedEvents = () => {
    const [hostedEvents, setHostedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userSession = JSON.parse(localStorage.getItem('eventHubUser'));
    const organizerId = userSession?.id;

    useEffect(() => {
        if (organizerId) {
            fetch(`http://localhost:5062/api/Customer/${organizerId}/events`)
                .then((res) => {
                    if (!res.ok) throw new Error("Could not fetch events");
                    return res.json();
                })
                .then((data) => {
                    setHostedEvents(data);
                    setLoading(false);
                })
                .catch((err) => {
                    toast.error("Failed to load your events.", { theme: "dark" });
                    setLoading(false);
                });
        } else {
            navigate("/");
        }
    }, [organizerId, navigate]);

    if (loading) return <div className="App-header"><h1 style={{ color: "#61dafb" }}>Loading Dashboard...</h1></div>;

    return (
        <div className="dashboard-container fade-in" style={{ padding: "40px 20px" }}>
            <ToastContainer />
            
            {/* Header Section */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start", 
                marginBottom: "80px", // Increased spacing from the content below
                flexWrap: "wrap",
                gap: "20px"
            }}>
                <div style={{ flex: "1", minWidth: "300px" }}>
                    <h1 style={{ fontSize: "2.8rem", margin: 0, fontWeight: "800" }}>Organizer Portal</h1>
                    <p style={{ color: "#94a3b8", marginTop: "12px", fontSize: "1.1rem" }}>
                        Managing {hostedEvents.length} active events.
                    </p>
                </div>

                {/* Navigation Tabs with proper spacing from heading */}
                <div style={{ 
                    display: "flex", 
                    gap: "20px", 
                    alignItems: "center",
                    paddingTop: "10px",
                    paddingLeft: "40px" // Explicit horizontal spacing from the text
                }}>
                    {/* --- My Events Button (Active/Highlighted) --- */}
                    <button 
                        style={{ 
                            width: "auto", 
                            padding: "12px 28px",
                            background: "#1e293b", 
                            border: "1px solid #61dafb", 
                            borderRadius: "12px", 
                            color: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "0.95rem",
                            fontWeight: "700",
                            transition: "all 0.2s ease",
                            boxShadow: "0 4px 15px rgba(97, 218, 251, 0.1)"
                        }}
                        onClick={() => navigate("/customer/my-hosted-events")}
                    >
                        <span style={{ fontSize: "1.2rem" }}>🗂️</span>
                        MY EVENTS
                    </button>

                    {/* --- Create Event Button (Secondary) --- */}
                    <button 
                        style={{ 
                            width: "auto", 
                            padding: "12px 28px", 
                            border: "1px solid #334155",
                            background: "transparent",
                            color: "#94a3b8",
                            cursor: "pointer",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            borderRadius: "12px",
                            transition: "all 0.3s ease"
                        }}
                        onClick={() => navigate("/customer/create-event")}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = "#ffffff";
                            e.currentTarget.style.borderColor = "#61dafb";
                            e.currentTarget.style.background = "rgba(97, 218, 251, 0.05)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = "#94a3b8";
                            e.currentTarget.style.borderColor = "#334155";
                            e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <span style={{ color: "#ef4444", fontSize: "1.5rem", fontWeight: "900" }}>+</span>
                        CREATE EVENT
                    </button>
                    <div style={{ textAlign: "right" }}>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "#ef4444", fontWeight: "bold", letterSpacing: "1px" }}>
                            VENDOR
                        </span>
                        <span style={{ display: "block", fontSize: "1rem", color: "#ffffff", fontWeight: "600" }}>
                            {JSON.parse(localStorage.getItem('eventHubUser'))?.name || "Organizer"}
                        </span>
                    </div>
                    <Logout />
                </div>
            </div>

            {/* Event List Rendering */}
            {hostedEvents.length === 0 ? (
                <div className="auth-container" style={{ margin: "0 auto", textAlign: "center", padding: "60px" }}>
                    <h3 style={{ color: "white", fontSize: "1.5rem" }}>No events found in your console.</h3>
                    <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Ready to launch something new?</p>
                    <button className="submit-btn" onClick={() => navigate("/customer/create-event")}>
                        Create Your First Event
                    </button>
                </div>
            ) : (
                <div className="event-grid">
                    {hostedEvents.map((event) => (
                        <div key={event.id} className="event-card fade-in">
                            <div style={{ overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                                <img 
                                    src={event.imagePath || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
                                    className="event-image" 
                                    alt="event" 
                                />
                            </div>
                            <div className="event-details">
                                <span className="status-badge" style={{ background: "#61dafb", color: "#0f172a", fontWeight: "bold" }}>
                                    {event.eventType}
                                </span>
                                <h3 style={{ color: "white", marginTop: "15px", fontSize: "1.4rem" }}>{event.title}</h3>
                                <p style={{ color: "#61dafb", fontSize: "0.9rem", margin: "8px 0" }}>
                                    📍 {event.venue?.city || "Location Pending"}
                                </p>
                                
                                <div style={{ 
                                    background: "rgba(15, 23, 42, 0.6)", 
                                    padding: "15px", 
                                    borderRadius: "10px",
                                    marginTop: "20px",
                                    border: "1px solid rgba(255, 255, 255, 0.05)"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Current Inventory</span>
                                        <span style={{ color: "#22c55e", fontWeight: "800", fontSize: "1.1rem" }}>{event.availableTickets}</span>
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

export default MyHostedEvents;