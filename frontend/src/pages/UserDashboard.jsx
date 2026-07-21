import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  User,
  Car,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Star,
  MapPin,
  TrendingUp,
  Loader2,
  LogOut,
  Edit3,
  Mail,
  Phone,
  Shield
} from 'lucide-react';
import PageSEO from '../components/PageSEO';

const statusConfig = {
  Pending: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
  Confirmed: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle },
  Completed: { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
  Cancelled: { color: 'bg-red-50 text-red-600 border-red-200', icon: XCircle }
};

const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: accent + '15' }}>
      <Icon size={22} style={{ color: accent }} />
    </div>
    <div>
      <p className="text-2xl font-black font-display text-velorix-dark">{value}</p>
      <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trips');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    setProfileForm({ name: user.name || '', phone: user.phone || '' });

    const fetchBookings = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/bookings/my', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') setBookings(data.data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (res.ok) setProfileMsg('Profile updated successfully!');
      else setProfileMsg(data.message || 'Update failed');
    } catch {
      setProfileMsg('Server error. Please try again.');
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(''), 4000);
    }
  };

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => ['Pending', 'Confirmed'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    totalSpent: bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.pricingBreakdown?.totalAmount || 0), 0)
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="bg-velorix-light-bg min-h-screen pb-24">
      <PageSEO 
        title="My Premium Trips" 
        description="Track your luxury bookings, check schedules, download receipts, invoice history and update profile settings." 
      />
      {/* Header */}
      <div className="bg-velorix-dark py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-velorix-red flex items-center justify-center text-white font-black text-xl font-display shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Welcome back</p>
              <h1 className="text-2xl font-black font-display text-white">{user?.name}</h1>
              <p className="text-gray-500 text-xs mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-xs font-bold uppercase tracking-wider bg-velorix-red text-white px-5 py-2.5 rounded-full hover:bg-velorix-red-hover transition-colors">
                Admin Panel
              </Link>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider border border-white/20 text-white px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors">
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Bookings" value={stats.total} icon={Car} accent="#D32F2F" />
          <StatCard label="Active Rentals" value={stats.active} icon={Clock} accent="#1A73E8" />
          <StatCard label="Trips Completed" value={stats.completed} icon={CheckCircle} accent="#2E7D32" />
          <StatCard label="Total Spent" value={`₹${stats.totalSpent}`} icon={TrendingUp} accent="#D32F2F" />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm w-fit mb-8">
          {[
            { id: 'trips', label: 'My Trips', icon: Car },
            { id: 'profile', label: 'Profile', icon: User }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-velorix-dark text-white shadow-sm' : 'text-gray-400 hover:text-velorix-dark'}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TRIPS TAB */}
        {activeTab === 'trips' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-velorix-red" size={36} />
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking, idx) => {
                  const cfg = statusConfig[booking.status] || statusConfig.Pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 flex flex-col md:flex-row gap-4 md:items-center"
                    >
                      {/* Vehicle image */}
                      <div className="w-full md:w-32 aspect-[16/10] md:aspect-auto md:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={booking.vehicle?.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80'}
                          alt="Vehicle"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Main info */}
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                              {booking.vehicle?.brand}
                            </p>
                            <h3 className="font-display font-bold text-velorix-dark text-lg">
                              {booking.vehicle?.name || 'Vehicle'}
                            </h3>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${cfg.color}`}>
                            <StatusIcon size={11} />
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-gray-400" />
                            {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-gray-400" />
                            {booking.pickupLocation}
                          </div>
                        </div>
                      </div>

                      {/* Price & actions */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <p className="font-black font-display text-xl text-velorix-dark">
                          ₹{booking.pricingBreakdown?.totalAmount || 0}
                        </p>
                        <button
                          onClick={() => {
                            const content = `VELORIX INVOICE\n\nBooking ID: ${booking._id}\nVehicle: ${booking.vehicle?.brand} ${booking.vehicle?.name}\nPickup: ${booking.pickupLocation}\nDrop: ${booking.dropLocation}\nDates: ${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}\nStatus: ${booking.status}\n\nTotal Amount: ₹${booking.pricingBreakdown?.totalAmount || 0}\nSecurity Deposit: ₹${booking.pricingBreakdown?.securityDeposit || 0}\nGST Tax: ₹${booking.pricingBreakdown?.tax || 0}\n\nThank you for choosing VELORIX!\nsupport@velorix.com | +1 (800) 555-VELO`;
                            const blob = new Blob([content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `VELORIX-Invoice-${booking._id.slice(-6)}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-velorix-red transition-colors"
                        >
                          <Download size={12} />
                          Invoice
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center shadow-sm">
                <Car size={48} className="text-gray-200 mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-velorix-dark">No Trips Yet</h3>
                <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                  You haven't made any bookings yet. Start by browsing our premium fleet.
                </p>
                <Link to="/fleet" className="inline-block bg-velorix-red text-white text-xs font-semibold px-6 py-3 rounded-full uppercase tracking-wider mt-6 hover:bg-velorix-red-hover transition-colors">
                  Explore Fleet
                </Link>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleProfileSave} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-5">
              <h3 className="font-display font-bold text-lg text-velorix-dark border-b border-gray-100 pb-4">Edit Profile</h3>

              {profileMsg && (
                <div className={`text-xs font-semibold p-3 rounded-xl border ${profileMsg.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-velorix-red border-red-200'}`}>
                  {profileMsg}
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-velorix-dark"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-velorix-dark"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full bg-velorix-dark hover:bg-velorix-red text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {profileSaving ? <Loader2 size={14} className="animate-spin" /> : <Edit3 size={14} />}
                Save Changes
              </button>
            </form>

            {/* Account meta card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-5">
              <h3 className="font-display font-bold text-lg text-velorix-dark border-b border-gray-100 pb-4">Account Info</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <Shield size={18} className="text-velorix-red flex-shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-velorix-dark uppercase tracking-wider">Account Role</p>
                    <p className="text-gray-500 text-xs mt-0.5 capitalize">{user?.role || 'user'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <Star size={18} className="text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-velorix-dark uppercase tracking-wider">Loyalty Tier</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {stats.completed >= 10 ? 'Platinum Member' : stats.completed >= 5 ? 'Gold Member' : stats.completed >= 2 ? 'Silver Member' : 'Standard Member'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <Car size={18} className="text-velorix-red flex-shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-velorix-dark uppercase tracking-wider">Lifetime Rentals</p>
                    <p className="text-gray-500 text-xs mt-0.5">{stats.total} booking{stats.total !== 1 ? 's' : ''} made</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
