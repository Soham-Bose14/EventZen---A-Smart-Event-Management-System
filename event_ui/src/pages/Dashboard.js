import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Logout from '../components/Logout';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [events, setEvents] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    
    // --- NEW STATE: Track quantities for each event ID ---
    const [quantities, setQuantities] = useState({}); 

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('eventHubUser')) || {};

    const tabs = [
        { id: 'All', label: 'See All Events' },
        { id: 'City', label: 'See Events By City' },
        { id: 'Type', label: 'See Events By Event Type' }
    ];

    const fetchEvents = async (type, value = '') => {
        setLoading(true);
        let url = "http://localhost:8080/events";

        if (type === 'City' && value) url = `http://localhost:8080/events/city?name=${value}`;
        if (type === 'Type' && value) url = `http://localhost:8080/events/type?type=${value}`;

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
                
                // Initialize quantities to 1 for all fetched events if not set
                const initialQuants = {};
                data.forEach(ev => initialQuants[ev.id] = 1);
                setQuantities(initialQuants);
            } else {
                toast.error("Failed to fetch events", { theme: "dark" });
            }
        } catch (error) {
            toast.error("Backend server is offline", { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'All') fetchEvents('All');
    }, [activeTab]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEvents(activeTab, inputValue);
    };

    // --- UPDATED HANDLER: Includes quantity in the API call ---
    const handleRegister = async (eventId) => {
        if (!user.id) {
            toast.error("User session expired. Please login again.");
            return;
        }

        const selectedQuantity = quantities[eventId] || 1;

        try {
            // Appending &quantity to match your Spring Boot @RequestParam
            const response = await fetch(`http://localhost:8080/events/${eventId}/register?userId=${user.id}&quantity=${selectedQuantity}`, {
                method: 'POST'
            });

            if (response.ok) {
                toast.success(`Successfully registered ${selectedQuantity} ticket(s)!`, { theme: "dark" });
                // Refresh events to update the available count in the UI
                fetchEvents(activeTab, inputValue); 
            } else {
                const error = await response.text();
                toast.error(`Registration failed: ${error}`, { theme: "dark" });
            }
        } catch (error) {
            toast.error("Error connecting to registration service", { theme: "colored" });
        }
    };

    // --- NEW HELPER: Updates quantity for a specific event card ---
    const updateQuantity = (eventId, delta) => {
        setQuantities(prev => {
            const current = prev[eventId] || 1;
            const next = current + delta;
            if (next >= 1 && next <= 10) {
                return { ...prev, [eventId]: next };
            }
            return prev;
        });
    };

    return (
        <div className="dashboard-container fade-in" style={{ padding: "40px 20px" }}>
            <ToastContainer />
            
            {/* Header Section remains same ... */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "60px" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Event Dashboard</h1>
                    <p style={{ color: "#94a3b8", marginTop: "10px" }}>Discover and register for upcoming events.</p>
                </div>
                
                <div style={{ display: "flex", gap: "20px", alignItems: "center", paddingTop: "10px", marginLeft: "40px" }}>
                    <button onClick={() => navigate("/dashboard")} className="tab-btn active" style={{ width: "auto", padding: "12px 28px", background: "#1e293b", border: "1px solid #61dafb", borderRadius: "12px", color: "#ffffff", display: "flex", alignItems: "center", gap: "12px", fontSize: "0.9rem", fontWeight: "700" }}>
                        <span style={{ fontSize: "1.3rem", background: "linear-gradient(45deg, #22c55e, #eab308, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>⏲️</span>
                        DASHBOARD
                    </button>
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

            {/* Navigation Tabs and Search Input remain same ... */}
            <div className="tab-group" style={{ maxWidth: '600px', margin: '0 auto 25px' }}>
                {tabs.map((tab) => (
                    <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => { setActiveTab(tab.id); setEvents([]); setInputValue(''); if (tab.id === 'All') fetchEvents('All'); }}>{tab.label}</button>
                ))}
            </div>

            {activeTab !== 'All' && (
                <form onSubmit={handleSearch} className="fade-in" style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto 30px' }}>
                    <input type="text" placeholder={`Enter ${activeTab === 'City' ? 'City Name' : 'Event Type'}`} value={inputValue} onChange={(e) => setInputValue(e.target.value)} required />
                    <button type="submit" className="submit-btn" style={{ marginTop: 0, width: '120px' }}>Search</button>
                </form>
            )}

            {/* Event Grid Rendering */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#61dafb' }}>Loading events...</p>
            ) : (
                <div className="event-grid">
                    {events.length > 0 ? events.map((event) => (
                        <div key={event.id} className="event-card fade-in">
                            <img src={event.imagePath || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} alt={event.title} className="event-image" />
                            <div className="event-details">
                                <span className="status-badge">{event.eventType}</span>
                                <h3 style={{ color: 'white', margin: '10px 0' }}>{event.title}</h3>
                                <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{event.description}</p>
                                <p style={{ color: '#94a3b8' }}>📍 {event.venueDetails?.city || "Online"}</p>
                                
                                <div style={{ marginTop: '15px', borderTop: '1px solid #334155', paddingTop: '15px' }}>
                                    <p style={{ color: '#61dafb', fontSize: '0.85rem', marginBottom: '10px' }}>Tickets Left: {event.availableTickets}</p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                        {/* --- NEW: QUANTITY SELECTOR --- */}
                                        <div style={{ display: 'flex', alignItems: 'center', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155', padding: '2px' }}>
                                            <button type="button" onClick={() => updateQuantity(event.id, -1)} style={{ background: 'none', border: 'none', color: '#ef4444', padding: '5px 12px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>-</button>
                                            <span style={{ color: 'white', minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{quantities[event.id] || 1}</span>
                                            <button type="button" onClick={() => updateQuantity(event.id, 1)} style={{ background: 'none', border: 'none', color: '#22c55e', padding: '5px 12px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>+</button>
                                        </div>

                                        <button 
                                            className="book-btn" 
                                            style={{ flex: 1, margin: 0 }} 
                                            onClick={() => handleRegister(event.id)}
                                            disabled={event.availableTickets <= 0}
                                        >
                                            {event.availableTickets <= 0 ? "Sold Out" : "Register"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p style={{ textAlign: 'center', width: '100%', color: '#94a3b8' }}>No events found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;