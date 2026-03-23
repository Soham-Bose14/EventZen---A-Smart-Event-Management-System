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

    const handleRegister = async (eventId) => {
        if (!user.id) {
            toast.error("User session expired. Please login again.");
            return;
        }
        const selectedQuantity = quantities[eventId] || 1;
        try {
            const response = await fetch(`http://localhost:8080/events/${eventId}/register?userId=${user.id}&quantity=${selectedQuantity}`, {
                method: 'POST'
            });
            if (response.ok) {
                toast.success(`Successfully registered ${selectedQuantity} ticket(s)!`, { theme: "dark" });
                fetchEvents(activeTab, inputValue); 
            } else {
                const error = await response.text();
                toast.error(`Registration failed: ${error}`, { theme: "dark" });
            }
        } catch (error) {
            toast.error("Error connecting to registration service", { theme: "colored" });
        }
    };

    const updateQuantity = (eventId, delta) => {
        setQuantities(prev => {
            const current = prev[eventId] || 1;
            const next = current + delta;
            if (next >= 1 && next <= 10) return { ...prev, [eventId]: next };
            return prev;
        });
    };

    return (
        <div className="dashboard-container fade-in" style={{ padding: "40px 20px" }}>
            <ToastContainer />
            
            {/* Header Section */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "60px" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Event Dashboard</h1>
                    <p style={{ color: "#94a3b8", marginTop: "10px" }}>Discover and register for upcoming events.</p>
                </div>
                
                <div style={{ display: "flex", gap: "20px", alignItems: "center", paddingTop: "10px" }}>
                    <button className="rectangular-btn" style={{ padding: "10px 20px", background: "rgba(97, 218, 251, 0.1)", border: "1px solid #61dafb", color: "#61dafb", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                        ⏲️ DASHBOARD
                    </button>
                    <button 
                        onClick={() => navigate("/applied-events")}
                        style={{ padding: "10px 20px", border: "none", background: "rgba(97, 218, 251, 0.1)", color: "#61dafb", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", borderRadius: "8px", transition: "all 0.3s ease" }}
                        onMouseOver={(e) => { e.currentTarget.style.background = "#61dafb"; e.currentTarget.style.color = "#0f172a"; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = "rgba(97, 218, 251, 0.1)"; e.currentTarget.style.color = "#61dafb"; }}
                    >
                        🎟️ MY TICKETS
                    </button>
                    <div style={{ textAlign: "right" }}>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "#61dafb", fontWeight: "bold" }}>USER</span>
                        <span style={{ display: "block", fontSize: "1rem", color: "#ffffff", fontWeight: "600" }}>{user.name || "Guest"}</span>
                    </div>
                    <Logout />
                </div>
            </div>

            {/* Navigation Tabs */}
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

            {loading ? (
                <p style={{ textAlign: 'center', color: '#61dafb' }}>Loading events...</p>
            ) : (
                <div className="event-grid">
                    {events.length > 0 ? events.map((event) => (
                        <div key={event.id} className="event-card fade-in" style={{ background: "#1e293b", borderRadius: "15px", overflow: "hidden" }}>
                            <div style={{ position: "relative" }}>
                                <img src={event.imagePath || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} alt={event.title} className="event-image" />
                                <span className="status-badge" style={{ background: "#61dafb", position: "absolute", top: "10px", right: "10px", padding: "5px 10px", borderRadius: "5px", color: "#0f172a", fontSize: "0.7rem", fontWeight: "bold" }}>
                                    {event.eventType}
                                </span>
                            </div>
                            
                            <div className="event-details" style={{ padding: "20px" }}>
                                <h3 style={{ color: "white", marginBottom: "5px" }}>{event.title}</h3>
                                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "15px", height: "40px", overflow: "hidden" }}>{event.description}</p>
                                
                                {/* Venue Details Section */}
                                <div style={{ marginBottom: "15px" }}>
                                    <p style={{ color: "#61dafb", fontSize: "0.9rem", margin: "2px 0" }}>
                                        📍 <strong>{event.venueDetails?.venue || "TBD"}</strong>
                                    </p>
                                    <p style={{ color: "#cbd5e1", fontSize: "0.8rem", margin: "2px 0", marginLeft: "20px" }}>
                                        {event.venueDetails?.address}, {event.venueDetails?.city}
                                    </p>
                                    <p style={{ color: "#eab308", fontSize: "0.8rem", margin: "5px 0", marginLeft: "20px" }}>
                                        📅 {new Date(event.dateTime).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true // Set to false if you prefer 24-hour format
                                        })}
                                    </p>
                                </div>

                                <div style={{ marginTop: '15px', borderTop: '1px solid #334155', paddingTop: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <span style={{ color: '#61dafb', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            Price: ₹{event.price}
                                        </span>
                                        <span style={{ color: event.availableTickets < 20 ? '#ef4444' : '#22c55e', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            {event.availableTickets} Left
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                        {/* Quantity Selector */}
                                        <div style={{ display: 'flex', alignItems: 'center', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', padding: '2px' }}>
                                            <button type="button" onClick={() => updateQuantity(event.id, -1)} style={{ background: 'none', border: 'none', color: '#ef4444', padding: '5px 12px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>-</button>
                                            <span style={{ color: 'white', minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{quantities[event.id] || 1}</span>
                                            <button type="button" onClick={() => updateQuantity(event.id, 1)} style={{ background: 'none', border: 'none', color: '#22c55e', padding: '5px 12px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>+</button>
                                        </div>

                                        <button 
                                            className="book-btn" 
                                            style={{ 
                                                flex: 1, margin: 0, padding: '12px', 
                                                background: event.availableTickets <= 0 ? '#334155' : '#61dafb',
                                                color: '#0f172a', fontWeight: '800', border: 'none', borderRadius: '8px', cursor: 'pointer'
                                            }} 
                                            onClick={() => handleRegister(event.id)}
                                            disabled={event.availableTickets <= 0}
                                        >
                                            {event.availableTickets <= 0 ? "Sold Out" : "Register Now"}
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