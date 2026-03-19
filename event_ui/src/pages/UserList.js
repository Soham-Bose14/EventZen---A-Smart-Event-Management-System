import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Logout from "../components/Logout";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/users/") 
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                toast.error("Failed to load user list");
                setLoading(false);
            });
    }, []);

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
                    <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Enrolled Users</h1>
                    <p style={{ color: "#94a3b8", marginTop: "10px" }}>Admin Console: Manage registered attendees.</p>
                </div>

                {/* Triple Navigation Tabs */}
                <div style={{ display: "flex", gap: "15px", alignItems: "center", paddingTop: "10px" }}>
                    <button 
                        style={{ padding: "12px 24px", background: "#1e293b", border: "1px solid #61dafb", borderRadius: "12px", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "700" }}
                        onClick={() => navigate("/admin/user-list")}
                    >
                        👥 USERS
                    </button>
                    <button 
                        style={{ padding: "12px 24px", background: "transparent", border: "1px solid #334155", borderRadius: "12px", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "600" }}
                        onClick={() => navigate("/admin/vendor-list")}
                    >
                        🏢 HOSTS
                    </button>
                    <button 
                        style={{ padding: "12px 24px", background: "transparent", border: "1px solid #334155", borderRadius: "12px", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "600" }}
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        <span style={{ background: "linear-gradient(45deg, #22c55e, #eab308, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>⏲️</span>
                        LIVE EVENTS
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

            {/* Table Container */}
            <div className="auth-container" style={{ maxWidth: "100%", padding: "20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", color: "white", textAlign: "left" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #334155", color: "#61dafb" }}>
                            <th style={{ padding: "15px" }}>ID</th>
                            <th style={{ padding: "15px" }}>Full Name</th>
                            <th style={{ padding: "15px" }}>Email Address</th>
                            <th style={{ padding: "15px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: "1px solid #1e293b" }}>
                                <td style={{ padding: "15px" }}>{user.id}</td>
                                <td style={{ padding: "15px", fontWeight: "bold" }}>{user.name}</td>
                                <td style={{ padding: "15px", color: "#94a3b8" }}>{user.email}</td>
                                <td style={{ padding: "15px" }}>
                                    {/* Glass-Accent Button: User Style */}
                                    <button 
                                        style={{ 
                                            padding: "8px 18px", 
                                            fontSize: "0.8rem", 
                                            background: "rgba(97, 218, 251, 0.05)", 
                                            border: "1px solid rgba(97, 218, 251, 0.3)", 
                                            borderLeft: "4px solid #61dafb", 
                                            borderRadius: "6px", 
                                            color: "#ffffff",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            letterSpacing: "0.5px",
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}
                                        onClick={() => navigate(`/admin/view-user-bookings/${user.id}`)}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = "rgba(97, 218, 251, 0.2)";
                                            e.currentTarget.style.boxShadow = "0 0 10px rgba(97, 218, 251, 0.2)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = "rgba(97, 218, 251, 0.05)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <span style={{ fontSize: "1rem" }}>🎟️</span> 
                                        VIEW BOOKINGS
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;