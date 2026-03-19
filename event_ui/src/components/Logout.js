import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. Clear all session data
        localStorage.clear();
        
        // 2. Redirect to Startup/Login page
        navigate("/");
    };

    return (
        <button 
            onClick={handleLogout}
            style={{
                padding: "8px 20px",
                background: "transparent",
                border: "1px solid #ef4444", // Red border to match the "Quit/Exit" theme
                color: "#ef4444",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "700",
                transition: "all 0.3s ease",
                marginLeft: "20px"
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.background = "#ef4444";
                e.currentTarget.style.color = "#ffffff";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#ef4444";
            }}
        >
            🚪 LOGOUT
        </button>
    );
};

export default Logout;