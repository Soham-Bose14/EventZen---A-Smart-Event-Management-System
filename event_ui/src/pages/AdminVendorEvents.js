import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../App.css';
import Logout from "../components/Logout";

const AdminVendorEvents = () => {
    const { vendorId } = useParams();
    const [events, setEvents] = useState([]);
    const [vendorName, setVendorName] = useState(`Host #${vendorId}`); // Default while loading
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
                    <h1 style={{ margin: 0 }}>{vendorName} - Published Events</h1>
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
                {events.map(event => (
                    <div key={event.id} className="event-card">
                        <img src={event.imagePath} alt="" className="event-image" />
                        <div className="event-details">
                            <h3>{event.title}</h3>
                            <p style={{ color: "#ef4444", fontWeight: "bold" }}>₹{event.price}</p>
                            <p>Remaining Tickets: {event.availableTickets}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminVendorEvents;