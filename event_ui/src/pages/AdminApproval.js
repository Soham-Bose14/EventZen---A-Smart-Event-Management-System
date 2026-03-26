import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";

const AdminApproval = () => {

    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const fetchPendingEvents = async () => {
        try {
            const res = await fetch("http://localhost:5062/api/Customer/admin/pending-events");
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch pending events");
        }
    };

    useEffect(() => {
        fetchPendingEvents();
    }, []);

    const approveEvent = async (id) => {
        await fetch(`http://localhost:5062/api/Customer/admin/approve/${id}`, {
            method: "PUT"
        });

        fetchPendingEvents();
    };

    const rejectEvent = async (id) => {
        await fetch(`http://localhost:5062/api/Customer/admin/reject/${id}`, {
            method: "PUT"
        });

        fetchPendingEvents();
    };

    return (
        <div className="dashboard-container fade-in" style={{ padding: "40px 20px" }}>

            {/* ADMIN HEADER (Same as AdminDashboard) */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "60px"
            }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Admin Console</h1>
                    <p style={{ color: "#94a3b8", marginTop: "10px" }}>
                        Review and approve new events submitted by hosts.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "15px", alignItems: "center", paddingTop: "10px" }}>

                    <button
                        style={{
                            padding: "12px 24px",
                            background: "transparent",
                            border: "1px solid #334155",
                            borderRadius: "12px",
                            color: "#94a3b8",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                        onClick={() => navigate("/admin/user-list")}
                    >
                        👥 USERS
                    </button>

                    <button
                        style={{
                            padding: "12px 24px",
                            background: "transparent",
                            border: "1px solid #334155",
                            borderRadius: "12px",
                            color: "#94a3b8",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                        onClick={() => navigate("/admin/vendor-list")}
                    >
                        🏢 HOSTS
                    </button>

                    <button
                        style={{
                            padding: "12px 24px",
                            background: "#1e293b",
                            border: "1px solid #61dafb",
                            borderRadius: "12px",
                            color: "#ffffff",
                            cursor: "pointer",
                            fontWeight: "700"
                        }}
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ⏲️ LIVE EVENTS
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
                        <span style={{
                            display: "block",
                            fontSize: "1.1rem",
                            color: "#ffffff",
                            fontWeight: "800",
                            letterSpacing: "0.5px"
                        }}>
                            ADMIN
                        </span>
                    </div>

                    <Logout />
                </div>
            </div>


            {/* PENDING EVENTS LIST */}

            {events.length === 0 ? (
                <p style={{ color: "#94a3b8" }}>No pending events.</p>
            ) : (
                events.map(ev => (
                    <div key={ev.id} style={{
                        border: "1px solid #334155",
                        marginBottom: "20px",
                        padding: "20px",
                        borderRadius: "12px",
                        background: "#0f172a"
                    }}>
                        <h3 style={{ color: "white" }}>{ev.title}</h3>

                        <p style={{ color: "#cbd5e1" }}>{ev.description}</p>

                        <p style={{ color: "#94a3b8" }}>
                            <b>City:</b> {ev.venue?.city}
                        </p>

                        <p style={{ color: "#94a3b8" }}>
                            <b>Price:</b> ₹{ev.price}
                        </p>

                        <button
                            onClick={() => approveEvent(ev.id)}
                            style={{
                                background: "#22c55e",
                                border: "none",
                                padding: "10px 18px",
                                borderRadius: "8px",
                                color: "white",
                                cursor: "pointer"
                            }}
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => rejectEvent(ev.id)}
                            style={{
                                marginLeft: "10px",
                                background: "#ef4444",
                                border: "none",
                                padding: "10px 18px",
                                borderRadius: "8px",
                                color: "white",
                                cursor: "pointer"
                            }}
                        >
                            Reject
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminApproval;