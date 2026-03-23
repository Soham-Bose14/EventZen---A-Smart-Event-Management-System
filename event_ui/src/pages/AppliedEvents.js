import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Logout from "../components/Logout";

const AppliedEvents = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userSession = JSON.parse(localStorage.getItem('eventHubUser'));
    const userId = userSession ? userSession.id : null;

    const fetchAppliedEvents = () => {
        if (userId) {
            fetch(`http://localhost:8080/events/applied/${userId}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Could not fetch your tickets");
                    return res.json();
                })
                .then((data) => {
                    // Data is now a list of Registration objects
                    setRegistrations(data);
                    setLoading(false);
                })
                .catch((err) => {
                    toast.error(err.message, { theme: "dark" });
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        fetchAppliedEvents();
    }, [userId]);

    const handleCancel = async (regId) => {
        if (!window.confirm("Are you sure you want to cancel this booking? The tickets will be returned to inventory.")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/events/registration/${regId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success("Booking cancelled successfully!", { theme: "dark" });
                fetchAppliedEvents(); 
            } else {
                const errorMsg = await response.text();
                toast.error(`Cancellation failed: ${errorMsg}`);
            }
        } catch (error) {
            toast.error("Connection error to server");
        }
    };

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "60px" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>My Registered Events</h1>
                    <p style={{ color: "#94a3b8" }}>Below are your confirmed event tickets.</p>
                </div>

                <div style={{ display: "flex", gap: "20px", alignItems: "center", paddingTop: "10px" }}>
                    <button 
                        className="rectangular-btn"
                        style={{ 
                            padding: "10px 20px", background: "rgba(97, 218, 251, 0.1)", 
                            border: "none", color: "#61dafb", borderRadius: "8px", fontWeight: "700", cursor: "pointer"
                        }}
                        onClick={() => navigate("/dashboard")}
                    >
                        ⏲️ DASHBOARD
                    </button>
                    <button 
                        onClick={() => navigate("/applied-events")}
                        style={{ 
                            width: "auto", 
                            padding: "10px 20px", 
                            border: "none",
                            background: "rgba(97, 218, 251, 0.1)", 
                            color: "#61dafb", 
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: "700", 
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            borderRadius: "8px",
                            transition: "all 0.3s ease", 
                            letterSpacing: "0.5px"
                        }}
                        
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "#61dafb"; 
                            e.currentTarget.style.color = "#0f172a"; 
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "rgba(97, 218, 251, 0.1)";
                            e.currentTarget.style.color = "#61dafb";
                        }}
                    >
                        <span style={{ fontSize: "1.2rem" }}>🎟️</span>
                        <span style={{ letterSpacing: "1px" }}>MY TICKETS</span>
                    </button>
                    <div style={{ textAlign: "right" }}>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "#61dafb", fontWeight: "bold" }}>USER</span>
                        <span style={{ display: "block", fontSize: "1rem", color: "#ffffff", fontWeight: "600" }}>{userSession?.name}</span>
                    </div>
                    <Logout />
                </div>
            </div>

            {registrations.length === 0 ? (
                <div className="auth-container" style={{ margin: "0 auto", textAlign: "center" }}>
                    <h3 style={{ color: "white" }}>No events joined yet!</h3>
                    <button className="submit-btn" onClick={() => navigate("/dashboard")}>Find Events</button>
                </div>
            ) : (
                <div className="event-grid">
                    {registrations.map((reg) => (
                        <div key={reg.id} className="event-card fade-in" style={{ background: "#1e293b", borderRadius: "15px", overflow: "hidden" }}>
                            {/* 1. Image from EventDetails */}
                            <div style={{ position: "relative" }}>
                                <img 
                                    src={reg.event.imagePath || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} 
                                    alt={reg.event.title} 
                                    className="event-image" 
                                />
                                <span className="status-badge" style={{ background: "#22c55e", position: "absolute", top: "10px", right: "10px", padding: "5px 10px", borderRadius: "5px", fontSize: "0.7rem", fontWeight: "bold" }}>
                                    CONFIRMED
                                </span>
                            </div>
                            
                            <div className="event-details" style={{ padding: "20px" }}>
                                {/* 2. Text from EventDetails */}
                                <h3 style={{ color: "white", marginBottom: "5px" }}>{reg.event.title}</h3>
                                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "15px" }}>{reg.event.description?.substring(0, 100)}...</p>
                                
                                {/* 3. Info from VenueDetails */}
                                <div style={{ marginBottom: "15px" }}>
                                    <p style={{ color: "#61dafb", fontSize: "0.9rem", margin: "2px 0" }}>
                                        📍 <strong>{reg.event.venueDetails?.venue}</strong>
                                    </p>
                                    <p style={{ color: "#cbd5e1", fontSize: "0.8rem", margin: "2px 0", marginLeft: "20px" }}>
                                        {reg.event.venueDetails?.address}, {reg.event.venueDetails?.city}
                                    </p>
                                </div>

                                {/* 4. Info from Registration (Quantity and Date) */}
                                <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "8px", marginBottom: "20px" }}>
                                    <div>
                                        <span style={{ display: "block", color: "#64748b", fontSize: "0.7rem" }}>TICKETS</span>
                                        <span style={{ color: "white", fontWeight: "bold" }}>{reg.quantity} Units</span>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ display: "block", color: "#64748b", fontSize: "0.7rem" }}>BOOKED ON</span>
                                        <span style={{ color: "white", fontSize: "0.8rem" }}>{new Date(reg.registrationDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* --- EVENT START DATE & TIME --- */}
                                <div style={{ textAlign: "center", paddingTop: "5px" }}>
                                    <span style={{ display: "block", color: "#eab308", fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "0.5px" }}>EVENT STARTS AT</span>
                                    <span style={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "600" }}>
                                        📅 {new Date(reg.event.dateTime).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </span>
                                </div>
                                
                                {/* QR Code Section */}
                                <div className="qr-section" style={{ 
                                    textAlign: "center", 
                                    padding: "15px", 
                                    background: "white", 
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)" 
                                }}>
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                                            `Reg ID: ${reg.id}\n` +
                                            `Event: ${reg.event.title}\n` +
                                            `Attendee: ${userSession?.name}\n` +
                                            `Venue: ${reg.event.venueDetails?.venue}\n` +
                                            `Tickets: ${reg.quantity}`
                                        )}`} 
                                        alt="Ticket QR" 
                                        style={{ width: "130px", height: "130px" }}
                                    />
                                    <div style={{ marginTop: "10px", borderTop: "1px dashed #cbd5e1", paddingTop: "10px" }}>
                                        <p style={{ color: "#0f172a", fontSize: "0.75rem", margin: 0, fontWeight: "800" }}>
                                            PASS ID: EZ-{reg.id}
                                        </p>
                                        <p style={{ color: "#64748b", fontSize: "0.6rem", textTransform: "uppercase", marginTop: "4px" }}>
                                            Scan for Full Details
                                        </p>
                                    </div>
                                </div>

                                {/* Cancel Button (using reg.id) */}
                                <button 
                                    onClick={() => handleCancel(reg.id)} 
                                    className="cancel-btn"
                                    style={{
                                        width: "100%", marginTop: "15px", padding: "12px", background: "transparent",
                                        border: "1px solid #ef4444", color: "#ef4444", borderRadius: "8px",
                                        fontWeight: "bold", cursor: "pointer", transition: "all 0.3s ease"
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "white"; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ef4444"; }}
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppliedEvents;