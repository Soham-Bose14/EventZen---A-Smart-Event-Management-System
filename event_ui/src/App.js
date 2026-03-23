import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Startup from './pages/Startup';
import Dashboard from './pages/Dashboard';
import AppliedEvents from './pages/AppliedEvents';

import CreateEvent from './pages/CreateEvent';
import './App.css';
import MyHostedEvents from './pages/MyHostedEvents';
import UserList from './pages/UserList';
import VendorList from './pages/VendorList';
import AdminUserBookings from './pages/AdminUserBookings';
import AdminVendorEvents from './pages/AdminVendorEvents';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        {/* ToastContainer moved outside header for better layout if needed */}
        <ToastContainer position="top-right" autoClose={3000} />
        
        <header className="App-header">
          <Routes>
            {/* Existing Routes */}
            <Route path="/" element={<Startup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applied-events" element={<AppliedEvents />} />            
            <Route path="/customer/create-event" element={<CreateEvent />} />
            <Route path="/customer/my-hosted-events" element={<MyHostedEvents />} />
            <Route path="/admin/user-list" element={<UserList />} />
            <Route path="/admin/vendor-list" element={<VendorList />} />
            <Route path="/admin/view-user-bookings/:userId" element={<AdminUserBookings />} />
            <Route path="/admin/view-host-events/:vendorId" element={<AdminVendorEvents />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;