import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Logout from "../components/Logout";

const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5062/api/Customer/all")
            .then(res => res.json())
            .then(data => {
                setVendors(data);
                setLoading(false);
            })
            .catch(err => {
                toast.error("Failed to load vendor list");
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
                    <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Registered Vendors</h1>
                    <p style={{ color: "#94a3b8", marginTop: "10px" }}>Admin Console: Manage host profiles and event links.</p>
                </div>

                {/* Triple Navigation Tabs */}
                <div style={{ display: "flex", gap: "15px", alignItems: "center", paddingTop: "10px" }}>
                    <button 
                        style={{ padding: "12px 24px", background: "transparent", border: "1px solid #334155", borderRadius: "12px", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "600" }}
                        onClick={() => navigate("/admin/user-list")}
                    >
                        👥 USERS
                    </button>
                    <button 
                        style={{ padding: "12px 24px", background: "#1e293b", border: "1px solid #61dafb", borderRadius: "12px", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "700" }}
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
                        <tr style={{ borderBottom: "2px solid #334155", color: "#ef4444" }}>
                            <th style={{ padding: "15px" }}>ID</th>
                            <th style={{ padding: "15px" }}>Company Name</th>
                            <th style={{ padding: "15px" }}>Lead Contact</th>
                            <th style={{ padding: "15px" }}>Email Address</th>
                            <th style={{ padding: "15px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map(vendor => (
                            <tr key={vendor.id} style={{ borderBottom: "1px solid #1e293b" }}>
                                <td style={{ padding: "15px" }}>{vendor.id}</td>
                                <td style={{ padding: "15px", fontWeight: "bold", color: "#61dafb" }}>{vendor.companyName || "N/A"}</td>
                                <td style={{ padding: "15px" }}>{vendor.name}</td>
                                <td style={{ padding: "15px", color: "#94a3b8" }}>{vendor.email}</td>
                                <td style={{ padding: "15px" }}>
                                    {/* Glass-Accent Button: Vendor Style */}
                                    <button 
                                        style={{ 
                                            padding: "8px 18px", 
                                            fontSize: "0.8rem", 
                                            background: "rgba(239, 68, 68, 0.05)", 
                                            border: "1px solid rgba(239, 68, 68, 0.3)", 
                                            borderLeft: "4px solid #ef4444", 
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
                                        onClick={() => navigate(`/admin/view-host-events/${vendor.id}`)}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                                            e.currentTarget.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.2)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <span style={{ color: "#ef4444", fontSize: "1.2rem", fontWeight: "900" }}>+</span>
                                        VIEW EVENTS
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

export default VendorList;