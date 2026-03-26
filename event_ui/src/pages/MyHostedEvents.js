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
                marginBottom: "80px", 
                flexWrap: "wrap",
                gap: "20px"
            }}>
                <div style={{ flex: "1", minWidth: "300px" }}>
                    <h1 style={{ fontSize: "2.8rem", margin: 0, fontWeight: "800" }}>Organizer Portal</h1>
                    <p style={{ color: "#94a3b8", marginTop: "12px", fontSize: "1.1rem" }}>
                        My Events' Status
                    </p>
                </div>

                <div style={{ 
                    display: "flex", 
                    gap: "20px", 
                    alignItems: "center",
                    paddingTop: "10px",
                    paddingLeft: "40px" 
                }}>
                    <button 
                        style={{ 
                            width: "auto", padding: "12px 28px", background: "#1e293b", 
                            border: "1px solid #61dafb", borderRadius: "12px", color: "#ffffff",
                            cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
                            fontSize: "0.95rem", fontWeight: "700"
                        }}
                        onClick={() => navigate("/customer/my-hosted-events")}
                    >
                        <span style={{ fontSize: "1.2rem" }}>🗂️</span> MY EVENTS
                    </button>

                    <button 
                        style={{ 
                            padding: "10px 20px", border: "none", background: "rgba(239, 68, 68, 0.1)", 
                            color: "#ef4444", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700", 
                            display: "flex", alignItems: "center", gap: "10px", borderRadius: "8px", transition: "all 0.3s ease" 
                        }}
                        onClick={() => navigate("/customer/create-event")}
                        onMouseOver={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#ffffff"; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                    >
                        <span style={{ fontSize: "1.5rem", fontWeight: "900" }}>+</span> CREATE EVENT
                    </button>

                    <div style={{ textAlign: "right" }}>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "#ef4444", fontWeight: "bold", letterSpacing: "1px" }}>VENDOR</span>
                        <span style={{ display: "block", fontSize: "1rem", color: "#ffffff", fontWeight: "600" }}>
                            {userSession?.name || "Organizer"}
                        </span>
                    </div>
                    <Logout />
                </div>
            </div>

            {/* Event Grid Rendering */}
            {hostedEvents.length === 0 ? (
                <div className="auth-container" style={{ margin: "0 auto", textAlign: "center", padding: "60px" }}>
                    <h3 style={{ color: "white", fontSize: "1.5rem" }}>No events found in your console.</h3>
                    <button className="submit-btn" onClick={() => navigate("/customer/create-event")}>Create Your First Event</button>
                </div>
            ) : (
                <div className="event-grid">
                    {hostedEvents.map((event) => (
                        <div key={event.id} className="event-card fade-in" style={{ background: "#1e293b", borderRadius: "15px", overflow: "hidden" }}>
                            <div style={{ position: "relative" }}>
                                <img 
                                    src={event.imagePath || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
                                    className="event-image" 
                                    alt="event" 
                                />
                                <span className="status-badge" style={{ background: "#61dafb", position: "absolute", top: "10px", right: "10px", padding: "5px 10px", borderRadius: "5px", color: "#0f172a", fontSize: "0.7rem", fontWeight: "bold" }}>
                                    {event.eventType}
                                </span>
                                {/* NEW STATUS BADGE */}
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        left: "10px",
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        fontSize: "0.7rem",
                                        fontWeight: "bold",
                                        color: "white",
                                        background:
                                            event.status === "Approved"
                                                ? "#22c55e"
                                                : event.status === "Rejected"
                                                ? "#ef4444"
                                                : "#f59e0b"
                                    }}
                                >
                                    {event.status}
                                </span>
                            </div>

                            <div className="event-details" style={{ padding: "20px" }}>
                                <h3 style={{ color: "white", marginBottom: "5px" }}>{event.title}</h3>
                                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "15px", height: "40px", overflow: "hidden" }}>{event.description}</p>
                                
                                <div style={{ marginBottom: "15px" }}>
                                    <p style={{ color: "#61dafb", fontSize: "0.9rem", margin: "2px 0" }}>
                                        📍 <strong>{event.venue?.venue || "TBD"}</strong>
                                    </p>
                                    <p style={{ color: "#cbd5e1", fontSize: "0.8rem", margin: "2px 0", marginLeft: "20px" }}>
                                        {event.venue?.address}, {event.venue?.city}
                                    </p>
                                    <p style={{ color: "#eab308", fontSize: "0.8rem", margin: "5px 0", marginLeft: "20px" }}>
                                        📅 {new Date(event.dateTime).toLocaleString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
                                        })}
                                    </p>
                                </div>
                                
                                {/* --- NEW: ENHANCED REVENUE & SALES ANALYTICS --- */}
                                <div style={{ 
                                    background: "linear-gradient(145deg, #0f172a, #1e293b)", 
                                    padding: "18px", 
                                    borderRadius: "12px",
                                    marginTop: "20px",
                                    border: "1px solid rgba(97, 218, 251, 0.2)"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                        <div style={{ textAlign: "left" }}>
                                            <span style={{ display: "block", color: "#94a3b8", fontSize: "0.65rem", fontWeight: "800", letterSpacing: "1px" }}>TICKETS SOLD</span>
                                            <span style={{ color: "#61dafb", fontWeight: "800", fontSize: "1.2rem" }}>
                                                {event.ticketsSold} / {event.totalTickets}
                                            </span>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <span style={{ display: "block", color: "#94a3b8", fontSize: "0.65rem", fontWeight: "800", letterSpacing: "1px" }}>TOTAL REVENUE</span>
                                            <span style={{ color: "#22c55e", fontWeight: "800", fontSize: "1.2rem" }}>
                                                ₹{event.revenue?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar for Sales */}
                                    <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" }}>
                                        <div style={{ 
                                            width: `${(event.ticketsSold / event.totalTickets) * 100}%`, 
                                            height: "100%", 
                                            background: "#61dafb",
                                            transition: "width 0.5s ease-in-out"
                                        }}></div>
                                    </div>

                                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ color: "#cbd5e1", fontSize: "0.75rem" }}>Inventory Status</span>
                                        <span style={{ color: event.availableTickets < 10 ? "#ef4444" : "#22c55e", fontSize: "0.75rem", fontWeight: "bold" }}>
                                            {event.availableTickets <= 0 ? "SOLD OUT" : `${event.availableTickets} Available`}
                                        </span>
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