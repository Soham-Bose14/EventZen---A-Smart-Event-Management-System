import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Logout from '../components/Logout';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [events, setEvents] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    return (
        <div className="dashboard-container fade-in" style={{ padding: "40px 20px" }}>
            <ToastContainer />
            
            {/* Admin Header with Triple Tabs */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start", 
                marginBottom: "60px" 
            }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Admin Console</h1>
                    <p style={{ color: "#94a3b8", marginTop: "10px" }}>
                        Monitoring all live events across the platform.
                    </p>
                </div>
                
                <div style={{ display: "flex", gap: "15px", alignItems: "center", paddingTop: "10px" }}>
                    <button 
                        style={{ padding: "12px 24px", background: "transparent", border: "1px solid #334155", borderRadius: "12px", color: "#94a3b8", cursor: "pointer", fontWeight: "600" }}
                        onClick={() => navigate("/admin/user-list")}
                    >
                        👥 USERS
                    </button>
                    <button 
                        style={{ padding: "12px 24px", background: "transparent", border: "1px solid #334155", borderRadius: "12px", color: "#94a3b8", cursor: "pointer", fontWeight: "600" }}
                        onClick={() => navigate("/admin/vendor-list")}
                    >
                        🏢 HOSTS
                    </button>
                    {/* Active Tab for Dashboard */}
                    <button 
                        style={{ padding: "12px 24px", background: "#1e293b", border: "1px solid #61dafb", borderRadius: "12px", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "700" }}
                    >
                        <span style={{ background: "linear-gradient(45deg, #22c55e, #eab308, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>⏲️</span>
                        LIVE EVENTS
                    </button>
                    <button
                        style={{
                            padding: "12px 24px",
                            background: "#1e293b",
                            border: "1px solid #22c55e",
                            borderRadius: "12px",
                            color: "#ffffff",
                            cursor: "pointer",
                            fontWeight: "700"
                        }}
                        onClick={() => navigate("/admin/event-approvals")}
                    >
                        ✅ EVENT APPROVALS
                    </button>
                    <div style={{ textAlign: "right" }}>
                        {/* <span style={{ display: "block", fontSize: "0.75rem", color: "#eab308", fontWeight: "bold", letterSpacing: "1px" }}>
                            ROLE
                        </span> */}
                        <span style={{ display: "block", fontSize: "1.1rem", color: "#ffffff", fontWeight: "800", letterSpacing: "0.5px" }}>
                            ADMIN
                        </span>
                    </div>
                    <Logout />
                </div>
            </div>

            {/* Internal Navigation Tabs (All/City/Type) */}
            <div className="tab-group" style={{ maxWidth: '600px', margin: '0 auto 25px' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setEvents([]);
                            setInputValue('');
                            if (tab.id === 'All') fetchEvents('All');
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            {activeTab !== 'All' && (
                <form onSubmit={handleSearch} className="fade-in" style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto 30px' }}>
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'City' ? 'City' : 'Type'}...`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-btn" style={{ marginTop: 0, width: '120px' }}>Search</button>
                </form>
            )}

            {/* Event Grid Rendering */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#61dafb' }}>Fetching live data...</p>
            ) : (
                <div className="event-grid">
                    {events.length > 0 ? events.map((event) => (
                        <div key={event.id} className="event-card fade-in">
                            <img src={event.imagePath || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} className="event-image" alt="event" />
                            <div className="event-details">
                                <span className="status-badge" style={{ background: "#61dafb", color: "#0f172a" }}>{event.eventType}</span>
                                <h3 style={{ color: 'white', margin: '10px 0' }}>{event.title}</h3>
                                <p style={{ color: '#94a3b8' }}>📍 {event.venueDetails?.city || "Online"}</p>
                                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
                                        Tickets: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{event.availableTickets} left</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p style={{ textAlign: 'center', width: '100%', color: '#94a3b8' }}>No live events found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;