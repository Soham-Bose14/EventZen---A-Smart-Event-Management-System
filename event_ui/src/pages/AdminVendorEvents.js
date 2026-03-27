import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../App.css';
import Logout from "../components/Logout";

const AdminVendorEvents = () => {
    const { vendorId } = useParams();
    const [events, setEvents] = useState([]);
    const [vendorName, setVendorName] = useState(`Host #${vendorId}`);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch Vendor Events
        fetch(`http://localhost:5062/api/Customer/${vendorId}/events`)
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error(err));

        // Fetch Vendor details to get the Name
        fetch(`http://localhost:5062/api/Customer/all`)
            .then(res => res.json())
            .then(data => {
                const foundVendor = data.find(v => v.id === parseInt(vendorId));
                if (foundVendor) setVendorName(foundVendor.name);
            })
            .catch(err => console.error("Error fetching vendor name:", err));
    }, [vendorId]);

    return (
        <div className="dashboard-container fade-in" style={{ padding: "40px" }}>
            <button className="submit-btn" style={{ width: "auto", marginBottom: "20px" }} onClick={() => navigate(-1)}>← Back to Host List</button>
            
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "30px",
                width: "100%" 
            }}>
                <div>
                    <h1 style={{ margin: 0 }}>{vendorName}'s Events</h1>
                </div>

                <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "25px",
                    marginLeft: "80px"
                }}>
                    <span style={{ 
                        fontSize: "1.1rem", 
                        color: "#ffffff", 
                        fontWeight: "800", 
                        letterSpacing: "0.5px" 
                    }}>
                        ADMIN
                    </span>
                    <Logout />
                </div>
            </div>

            <div className="event-grid">
                {events.map(event => (
                    <div key={event.id} className="event-card fade-in" style={{ background: "#1e293b", borderRadius: "15px", overflow: "hidden" }}>
                        <div style={{ position: "relative" }}>
                            <img src={event.imagePath || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} alt={event.title} className="event-image" />
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
                            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "15px", height: "40px", overflow: "hidden" }}>
                                {event.description}
                            </p>
                            
                            {/* Venue and Date Details */}
                            <div style={{ marginBottom: "15px" }}>
                                <p style={{ color: "#61dafb", fontSize: "0.9rem", margin: "2px 0" }}>
                                    📍 <strong>{event.venue?.venue || "TBD"}</strong>
                                </p>
                                <p style={{ color: "#cbd5e1", fontSize: "0.8rem", margin: "2px 0", marginLeft: "20px" }}>
                                    {event.venue?.address}, {event.venue?.city}
                                </p>
                                <p style={{ color: "#eab308", fontSize: "0.8rem", margin: "5px 0", marginLeft: "20px" }}>
                                    📅 {new Date(event.dateTime).toLocaleString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </p>
                            </div>

                            {/* Admin Stat Block */}
                            <div style={{ 
                                background: "rgba(15, 23, 42, 0.6)", 
                                padding: "15px", 
                                borderRadius: "10px",
                                border: "1px solid rgba(255, 255, 255, 0.05)"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>PRICE</span>
                                    <span style={{ color: "#ef4444", fontWeight: "bold" }}>₹{event.price}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>REMAINING</span>
                                    <span style={{ color: "#22c55e", fontWeight: "bold" }}>{event.availableTickets} Tickets</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminVendorEvents;