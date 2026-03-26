import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Logout from '../components/Logout';

const CreateEvent = () => {
    const navigate = useNavigate();
    
    const userSession = JSON.parse(localStorage.getItem('eventHubUser'));
    const organizerId = userSession?.id;
    const userRole = userSession?.role;

    useEffect(() => {
        if (!organizerId || userRole !== 'Vendor') {
            toast.warn("Access Denied. Please login as an Organizer.");
            navigate('/');
        }
    }, [organizerId, userRole, navigate]);

    const initialState = {
        title: '',
        description: '',
        eventType: 'Conference',
        dateTime: '',
        price: 0,
        imagePath: '',
        availableTickets: 0,
        totalTickets: 0, // NEW: Added to state
        city: '',
        venueName: '',
        address: ''
    };

    const [eventData, setEventData] = useState(initialState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5062/api/Customer/${organizerId}/create-event`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData) // Now includes totalTickets
            });

            if (response.ok) {
                toast.success("🚀 Event Published Successfully!", {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "dark",
                });
                setEventData(initialState);
                e.target.reset();
            } else {
                const result = await response.json();
                toast.error(result.message || "Failed to create event.", { theme: "dark" });
            }
        } catch (err) {
            toast.error("Network Error: Could not connect to the service.", { theme: "colored" });
        }
    };

    if (!organizerId) return null;

    return (
        <div className="dashboard-container fade-in" style={{ padding: "40px 20px" }}>
            <ToastContainer />

            {/* Header Section */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start", 
                marginBottom: "60px" 
            }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Vendor Portal</h1>
                    <p style={{ color: "#94a3b8", marginTop: "10px" }}>Deploy new experiences to the community.</p>
                </div>
                
                <div style={{ display: "flex", gap: "15px", alignItems: "center", paddingTop: "10px" }}>
                    <button 
                        style={{ 
                            width: "auto", padding: "12px 24px", border: "1px solid #334155",
                            background: "transparent", color: "#94a3b8", cursor: "pointer",
                            fontSize: "0.9rem", fontWeight: "600", display: "flex",
                            alignItems: "center", gap: "10px", borderRadius: "12px", transition: "all 0.2s"
                        }}
                        onClick={() => navigate("/customer/my-hosted-events")}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = "#ffffff";
                            e.currentTarget.style.borderColor = "#61dafb";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = "#94a3b8";
                            e.currentTarget.style.borderColor = "#334155";
                        }}
                    >
                        <span style={{ fontSize: "1.2rem" }}>🗂️</span> MY EVENTS
                    </button>

                    <button 
                        style={{ 
                            width: "auto", padding: "12px 24px", background: "#1e293b", 
                            border: "1px solid #61dafb", borderRadius: "12px", color: "#ffffff",
                            cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
                            fontSize: "0.9rem", fontWeight: "700", transition: "all 0.2s ease"
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
                            {userSession?.name || "Organizer"}
                        </span>
                    </div>
                    <Logout />
                </div>
            </div>

            {/* Form Container */}
            <div className="auth-container" style={{ maxWidth: "1100px", margin: "0 auto", padding: "50px" }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px" }}>
                        
                        {/* Left Column */}
                        <div className="fade-in" style={{ width: "100%" }}>
                            <h3 style={{ color: "#61dafb", marginBottom: "25px", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
                                1. Event Details
                            </h3>
                            
                            <div className="form-group">
                                <label>Event Title</label>
                                <input type="text" value={eventData.title} placeholder="e.g. Tech Conference 2026" required 
                                    onChange={e => setEventData({...eventData, title: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    style={{ height: "220px", width: "100%", boxSizing: "border-box", resize: "vertical", overflowY: "auto" }} 
                                    placeholder="Write a detailed description..." 
                                    value={eventData.description}
                                    required 
                                    onChange={e => setEventData({...eventData, description: e.target.value})} 
                                />
                            </div>

                            <div className="form-group">
                                <label>Event Type</label>
                                <select className="input-select" value={eventData.eventType} style={{ background: "rgba(0,0,0,0.2)", color: "white", padding: "12px", width: "100%", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}
                                    onChange={e => setEventData({...eventData, eventType: e.target.value})}>
                                    <option value="Conference" style={{background: "#1e293b"}}>Conference</option>
                                    <option value="Music" style={{background: "#1e293b"}}>Music</option>
                                    <option value="Workshop" style={{background: "#1e293b"}}>Workshop</option>
                                    <option value="Tech" style={{background: "#1e293b"}}>Tech</option>
                                    <option value="Performing Arts" style={{background: "#1e293b"}}>Performing Arts</option>
                                </select>
                            </div>

                            <div style={{ display: "flex", gap: "20px" }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Price (₹)</label>
                                    <input type="number" value={eventData.price} required onChange={e => setEventData({...eventData, price: parseFloat(e.target.value)})} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Total Tickets</label>
                                    {/* UPDATED: Sets both availableTickets and totalTickets simultaneously */}
                                    <input 
                                        type="number" 
                                        value={eventData.availableTickets} 
                                        required 
                                        onChange={e => {
                                            const val = parseInt(e.target.value) || 0;
                                            setEventData({
                                                ...eventData, 
                                                availableTickets: val, 
                                                totalTickets: val 
                                            });
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="fade-in" style={{ width: "100%" }}>
                            <h3 style={{ color: "#61dafb", marginBottom: "25px", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
                                2. Venue & Logistics
                            </h3>

                            <div className="form-group">
                                <label>Event Date & Time</label>
                                <input type="datetime-local" value={eventData.dateTime} required onChange={e => setEventData({...eventData, dateTime: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>City</label>
                                <input type="text" value={eventData.city} placeholder="e.g. Mumbai" required 
                                    onChange={e => setEventData({...eventData, city: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Venue Name</label>
                                <input type="text" value={eventData.venueName} placeholder="Venue Name" required 
                                    onChange={e => setEventData({...eventData, venueName: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Full Address</label>
                                <textarea 
                                    style={{ height: "150px", width: "100%", boxSizing: "border-box", resize: "vertical", overflowY: "auto" }} 
                                    placeholder="Complete Address..." 
                                    value={eventData.address}
                                    required 
                                    onChange={e => setEventData({...eventData, address: e.target.value})} 
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URL</label>
                                <input type="text" value={eventData.imagePath} placeholder="https://..." 
                                    onChange={e => setEventData({...eventData, imagePath: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: "50px", display: "flex", gap: "20px" }}>
                        <button type="submit" className="submit-btn" style={{ flex: 2 }}>Publish Event Live</button>
                        <button type="button" className="submit-btn" 
                            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid #334155" }} 
                            onClick={() => navigate('/dashboard')}>
                            Back to Dashboard
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;