import React, { use, useState } from 'react';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';

const Startup = () => {
    const [activeAction, setActiveAction] = useState('Login');
    const [accountType, setAccountType] = useState('User');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contact, setContact] = useState('');
    const [companyName, setCompanyName] = useState('');

    const actions = ['Login', 'Sign Up'];
    const roles = ['User', 'Admin', 'Vendor'];

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();


        // --- ADMIN LOGIN (leave unchanged) ---
        if(accountType == 'Admin'){
            if(password !== "Admin@123" || email !== "admin@gmail.com"){
                toast.error("Invalid Credentials!", { theme: "dark" });
                return;
            }
            navigate("/admin/user-list")
            return;
        }

        if (activeAction === 'Sign Up' && password !== confirmPassword) {
            toast.error("Passwords do not match!", { theme: "dark" });
            return;
        }

        let url = "";

        if (accountType === 'User') {
            url = activeAction === 'Login'
                ? "http://localhost:8080/users/login"
                : "http://localhost:8080/users/register";
        }
        else if (accountType === 'Vendor') {
            url = activeAction === 'Login'
                ? "http://localhost:5062/api/Customer/login"
                : "http://localhost:5062/api/Customer/register";
        }

        // --- Payload ---
        const payload = {
            email: email.trim(),
            password: password.trim(),
            ...(activeAction === 'Sign Up' && { name }),
            ...(activeAction === 'Sign Up' && accountType === 'User' && {
                contact_number: contact ? Number(contact) : 0
            }),
            ...(activeAction === 'Sign Up' && accountType === 'Vendor' && { companyName })
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Authentication failed", { theme: "dark" });
                return;
            }

            // --- LOGIN SUCCESS ---
            if (activeAction === "Login") {

                const userSession = {
                    ...data.user,
                    token: data.token,
                    role: accountType,
                    isLoggedIn: true,
                    loginTime: new Date().toLocaleString()
                };

                localStorage.setItem("token", data.token);
                localStorage.setItem("eventHubUser", JSON.stringify(userSession));

                toast.success(`Login successful! Welcome, ${data.user?.name}`, {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark"
                });

                if(accountType === "User"){
                    navigate("/dashboard");
                }
                else if(accountType === "Vendor"){
                    navigate("/customer/my-hosted-events");
                }

            }
            // --- SIGNUP SUCCESS ---
            else {

                toast.success("Account created successfully! Please login.", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark"
                });

                setActiveAction("Login");
            }

        } catch (error) {
            console.error("Connection Error:", error);
            toast.error("Server connection failed!", { theme: "colored" });
        }
    };


    return (
        <div className="App-header">
            <ToastContainer />
            
            {/* Catchy Hero Section */}
            <div className="hero-section fade-in" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3.5rem', margin: '0', background: 'linear-gradient(45deg, #61dafb, #d4a5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>
                    EventZen
                </h1>
                <h2 style={{ fontSize: '1.5rem', color: '#cbd5e1', marginTop: '10px', fontWeight: '400' }}>
                    Where Experiences Meet Excellence.
                </h2>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '15px auto', lineHeight: '1.6' }}>
                    Join thousands of users discovering the best events, or become a host and share your passion with the world.
                </p>
                <div style={{ width: '60px', height: '4px', background: '#61dafb', margin: '20px auto', borderRadius: '2px' }}></div>
            </div>

            <div className="auth-container fade-in" style={{ marginTop: '0' }}>
                <h2 style={{ marginBottom: '25px', fontSize: '1.8rem', fontWeight: '700' }}>
                    {activeAction === 'Login' ? 'Welcome Back!' : 'Get Started'}
                </h2>

                <div className="tab-group">
                    {actions.map((action) => (
                        <button
                            key={action}
                            className={`tab-btn ${activeAction === action ? 'active' : ''}`}
                            onClick={() => {
                                setActiveAction(action);
                                setPassword('');
                                setConfirmPassword('');
                            }}
                        >
                            {action}
                        </button>
                    ))}
                </div>

                <form className="tab-content" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Account Type</label>
                        <select 
                            value={accountType} 
                            onChange={(e) => setAccountType(e.target.value)}
                            style={{ 
                                width: '100%', padding: '12px', borderRadius: '8px', 
                                background: 'rgba(0, 0, 0, 0.2)', color: 'white', 
                                border: '1px solid rgba(255, 255, 255, 0.1)' 
                            }}
                        >
                            {roles.map(role => (
                                <option key={role} value={role} style={{background: '#1e293b'}}>{role}</option>
                            ))}
                        </select>
                    </div>

                    {activeAction === 'Sign Up' && (
                        <div className="form-group fade-in">
                            <label>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
                    </div>

                    {activeAction === 'Sign Up' && accountType === 'Vendor' && (
                        <div className="form-group fade-in">
                            <label>Company Name</label>
                            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" required />
                        </div>
                    )}

                    {activeAction === 'Sign Up' && accountType === 'User' && (
                        <div className="form-group fade-in">
                            <label>Contact Number</label>
                            <input type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="9876543210" required />
                        </div>
                    )}

                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Password</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••" 
                            required 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', color: '#61dafb', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {activeAction === 'Sign Up' && (
                        <div className="form-group fade-in" style={{ position: 'relative' }}>
                            <label>Confirm Password</label>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                placeholder="••••••••" 
                                required 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', color: '#61dafb', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    )}

                    <button type="submit" className="submit-btn" style={{ fontSize: '1.1rem', padding: '15px' }}>
                        {activeAction === 'Login' ? `Login as ${accountType}` : `Create ${accountType} Account`}
                    </button>
                </form>
            </div>
            <p style={{ marginTop: '30px', fontSize: '0.85rem', color: '#64748b', letterSpacing: '1px' }}>
                POWERED BY EVENTZEN • EST. 2026
            </p>
        </div>
    );
};

export default Startup;