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

        // if (accountType === 'Admin') {
        //     toast.warn("Admin logic is under maintenance!");
        //     return;
        // }
        // Just for now
        if(accountType == 'Admin'){
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
        } else if (accountType === 'Vendor') {
            url = activeAction === 'Login' 
                ? "http://localhost:5062/api/Customer/login" 
                : "http://localhost:5062/api/Customer/register";
        }

        // Construct Payload with converted types and matching keys
        const payload = {
            email,
            password,
            ...(activeAction === 'Sign Up' && { name }),
            ...(activeAction === 'Sign Up' && accountType === 'User' && { 
                contact_number: contact ? Number(contact) : 0 
            }),
            ...(activeAction === 'Sign Up' && accountType === 'Vendor' && { companyName })
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                const userSession = {
                    ...data,
                    role: accountType,
                    isLoggedIn: true,
                    loginTime: new Date().toLocaleString()
                };
                
                localStorage.setItem('eventHubUser', JSON.stringify(userSession));
                
                toast.success(`${activeAction} successful! Welcome, ${data.name || accountType}`, {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
                if(accountType === "User"){
                    navigate("/dashboard")
                }
                else if(accountType === "Admin"){
                    navigate("/admin/user-list")
                }
                else{
                    navigate("/customer/create-event")
                }
            } else {
                const errorMsg = await response.text();
                toast.error(`Auth Failed: ${errorMsg}`, { theme: "dark" });
            }
        } catch (error) {
            console.error("Connection Error:", error);
            toast.error("Server is offline. Check backends on 8080/5062.", { theme: "colored" });
        }
    };

    return (
        <div className="App-header">
            <ToastContainer />
            <div className="auth-container fade-in">
                <h1>EventZen</h1>

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

                    <button type="submit" className="submit-btn">
                        {activeAction} as {accountType}
                    </button>
                </form>
            </div>
            <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#64748b' }}>© 2026 EventZen Management System</p>
        </div>
    );
};

export default Startup;