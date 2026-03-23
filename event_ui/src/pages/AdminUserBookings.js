import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../App.css';
import Logout from "../components/Logout";

const AdminUserBookings = () => {
    const { userId } = useParams();
    const [bookings, setBookings] = useState([]); // Now stores Registration objects
    const [userName, setUserName] = useState(`User #${userId}`);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch User Bookings (Returns List<Registration>)
        fetch(`http://localhost:8080/events/applied/${userId}`)
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(err => console.error(err));

        // Fetch User details to get the Name
        fetch(`http://localhost:8080/users/`) 
            .then(res => res.json())
            .then(data => {
                const foundUser = data.find(u => u.id === parseInt(userId));
                if (foundUser) setUserName(foundUser.name);
            })
            .catch(err => console.error("Error fetching user name:", err));
    }, [userId]);

    return (
        <div className="dashboard-container fade-in" style={{ padding: "40px" }}>
            <button className="submit-btn" style={{ width: "auto", marginBottom: "20px" }} onClick={() => navigate(-1)}>← Back to User List</button>
            
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "30px",
                width: "100%" 
            }}>
                <div>
                    <h1 style={{ margin: 0 }}>{userName}'s Active Bookings</h1>
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

            {bookings.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <h2 style={{ color: "#94a3b8" }}>No bookings found for {userName}.</h2>
                </div>
            ) : (
                <div className="event-grid">
                {bookings.map(reg => (
                    <div key={reg.id} className="event-card fade-in" style={{ background: "#1e293b", borderRadius: "15px", overflow: "hidden" }}>
                        <div style={{ position: "relative" }}>
                            {/* 1. Image from EventDetails nested in Registration */}
                            <img 
                                src={reg.event?.imagePath || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} 
                                alt={reg.event?.title} 
                                className="event-image" 
                            />
                            <span className="status-badge" style={{ background: "#22c55e", position: "absolute", top: "10px", right: "10px", padding: "5px 10px", borderRadius: "5px", fontSize: "0.7rem", fontWeight: "bold" }}>
                                CONFIRMED
                            </span>
                        </div>
                        
                        <div className="event-details" style={{ padding: "20px" }}>
                            <h3 style={{ color: "white", marginBottom: "5px" }}>{reg.event?.title}</h3>
                            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "15px", height: "40px", overflow: "hidden" }}>
                                {reg.event?.description}
                            </p>
                            
                            {/* Venue Details */}
                            <div style={{ marginBottom: "15px" }}>
                                <p style={{ color: "#61dafb", fontSize: "0.9rem", margin: "2px 0" }}>
                                    📍 <strong>{reg.event?.venueDetails?.venue}</strong>
                                </p>
                                <p style={{ color: "#cbd5e1", fontSize: "0.8rem", margin: "2px 0", marginLeft: "20px" }}>
                                    {reg.event?.venueDetails?.address}, {reg.event?.venueDetails?.city}
                                </p>
                            </div>

                            {/* Ticket and Date Info (Matching AppliedEvents logic) */}
                            <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px", marginBottom: "15px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <div>
                                        <span style={{ display: "block", color: "#64748b", fontSize: "0.65rem" }}>TICKETS</span>
                                        <span style={{ color: "white", fontWeight: "bold", fontSize: "0.9rem" }}>{reg.quantity} Units</span>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ display: "block", color: "#64748b", fontSize: "0.65rem" }}>BOOKED ON</span>
                                        <span style={{ color: "white", fontSize: "0.8rem" }}>{new Date(reg.registrationDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px" }}>
                                    <span style={{ display: "block", color: "#eab308", fontSize: "0.65rem", fontWeight: "bold" }}>EVENT DATE</span>
                                    <span style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: "600" }}>
                                        📅 {new Date(reg.event?.dateTime).toLocaleString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit', hour12: true
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Pass ID Label for Admin Reference */}
                            <div style={{ textAlign: "center", border: "1px dashed #334155", padding: "8px", borderRadius: "8px" }}>
                                <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: 0 }}>
                                    REGISTRATION ID: <span style={{ color: "white", fontWeight: "bold" }}>EZ-{reg.id}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default AdminUserBookings;