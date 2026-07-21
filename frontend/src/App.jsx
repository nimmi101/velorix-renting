import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollWrapper from './components/ScrollWrapper';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import VehicleDetails from './pages/VehicleDetails';
import Booking from './pages/Booking';
import TourPackages from './pages/TourPackages';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Helper component to redirect routes like /fleet to /#fleet while preserving search parameters
const RedirectToHash = ({ hash }) => {
  const location = useLocation();
  return <Navigate to={`/${location.search}#${hash}`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollWrapper>
          <div className="flex flex-col min-h-screen bg-velorix-light-bg font-sans selection:bg-velorix-red selection:text-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/fleet" element={<RedirectToHash hash="fleet" />} />
                <Route path="/fleet/:id" element={<VehicleDetails />} />
                <Route path="/packages" element={<TourPackages isSection={false} />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/about" element={<RedirectToHash hash="about" />} />
                <Route path="/contact" element={<RedirectToHash hash="contact" />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ScrollWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
