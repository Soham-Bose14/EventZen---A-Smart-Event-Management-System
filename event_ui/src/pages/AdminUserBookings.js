import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../App.css';
import Logout from "../components/Logout";

const AdminUserBookings = () => {
    const { userId } = useParams();
    const [bookings, setBookings] = useState([]);
    const [userName, setUserName] = useState(`User #${userId}`); // Default while loading
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch User Bookings
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
            
            {/* Header Flex Container for Top Right Alignment */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", // This pushes the two child divs to opposite sides
                alignItems: "center", 
                marginBottom: "30px",
                width: "100%" // Ensures the container spans the full width
            }}>
                
                {/* LEFT CHILD: Just the Heading */}
                <div>
                    <h1 style={{ margin: 0 }}>{userName} - Booked Events</h1>
                </div>

                {/* RIGHT CHILD: Grouped ADMIN label and Logout button */}
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
                {bookings.map(event => (
                    <div key={event.id} className="event-card">
                        <img src={event.imagePath} alt="" className="event-image" />
                        <div className="event-details">
                            <h3>{event.title}</h3>
                            <p>📍 {event.venueDetails?.city}</p>
                            <span className="status-badge" style={{ background: "#22c55e" }}>CONFIRMED</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUserBookings;