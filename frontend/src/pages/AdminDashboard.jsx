import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2,
  Car,
  Users,
  Calendar,
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown,
  Upload,
  X,
  Search,
  Shield,
  TrendingUp,
  Star,
  ImagePlus,
  Link as LinkIcon,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import PageSEO from '../components/PageSEO';

/* ---- Status badge helper ---- */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

const StatusBadge = ({ status }) => {
  const map = {
    Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    Completed: 'bg-green-50 text-green-700 border-green-200',
    Cancelled: 'bg-red-50 text-red-600 border-red-200'
  };
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${map[status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  );
};

/* ---- Analytics stat card ---- */
const MetricCard = ({ label, value, icon: Icon, sub, accent }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-black font-display text-velorix-dark mt-1">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </div>
    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: accent + '18' }}>
      <Icon size={20} style={{ color: accent }} />
    </div>
  </div>
);


/* ============================
   IMAGE MANAGER SECTION
   ============================ */

const ImageManager = ({ images, onImagesChange, token }) => {
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    if (!res.ok || data.status !== 'success') throw new Error(data.message || 'Upload failed');
    return data.data.url;
  };

  const handleFileDrop = async (files) => {
    const fileList = Array.from(files || []);
    if (!fileList.length) return;
    const newImages = [...images];
    for (let i = 0; i < fileList.length; i++) {
      setUploadingIdx(newImages.length);
      try {
        const url = await uploadFileToCloudinary(fileList[i]);
        newImages.push(url);
        onImagesChange([...newImages]);
      } catch (e) {
        console.error(e);
      }
    }
    setUploadingIdx(null);
  };

  const handleAddCloudinaryUrl = () => {
    setUrlError('');
    const trimmed = cloudinaryUrl.trim();
    if (!trimmed) return;
    // Basic URL validation
    try { new URL(trimmed); } catch { setUrlError('Invalid URL'); return; }
    onImagesChange([...images, trimmed]);
    setCloudinaryUrl('');
  };

  const handleRemove = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    onImagesChange(updated);
  };

  const handleSetThumbnail = (idx) => {
    if (idx === 0) return;
    const updated = [...images];
    const [picked] = updated.splice(idx, 1);
    updated.unshift(picked);
    onImagesChange(updated);
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    const updated = [...images];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    onImagesChange(updated);
  };

  const handleMoveDown = (idx) => {
    if (idx >= images.length - 1) return;
    const updated = [...images];
    [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]];
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <ImageIcon size={14} className="text-velorix-red" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Fleet Image Gallery</span>
      </div>

      {/* Thumbnail hero preview */}
      {images.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-velorix-red/30 bg-gray-50" style={{ aspectRatio: '16/7' }}>
          <img src={images[0]} alt="thumbnail" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white text-[11px] font-bold">Thumbnail (shown on fleet cards)</span>
          </div>
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={() => handleRemove(0)}
              className="w-7 h-7 rounded-full bg-black/50 hover:bg-velorix-red flex items-center justify-center transition-colors"
              title="Remove thumbnail"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Existing images strip */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">All Images ({images.length}) — first is thumbnail</p>
          <div className="flex flex-col gap-2">
            {images.map((img, idx) => (
              <div
                key={img + idx}
                className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${idx === 0 ? 'border-velorix-red/40 bg-red-50/30' : 'border-gray-100 bg-gray-50/50'
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={img} alt={`img-${idx}`} className="w-16 h-11 rounded-lg object-cover border border-gray-200" />
                  {idx === 0 && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star size={8} className="text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-velorix-dark truncate">{idx === 0 ? '⭐ Thumbnail' : `Image ${idx + 1}`}</p>
                  <p className="text-[9px] text-gray-400 truncate">{img.length > 45 ? img.slice(0, 42) + '...' : img}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetThumbnail(idx)}
                      title="Set as thumbnail"
                      className="px-2 py-1 text-[9px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors whitespace-nowrap"
                    >
                      Set Thumbnail
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-velorix-dark disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === images.length - 1}
                    className="p-1 text-gray-400 hover:text-velorix-dark disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1 text-gray-400 hover:text-velorix-red transition-colors"
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${dragOver ? 'border-velorix-red bg-red-50/30 scale-[1.01]' : 'border-gray-200 hover:border-velorix-red/40 hover:bg-gray-50'
          }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileDrop(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileDrop(e.target.files)}
        />
        {uploadingIdx !== null ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 size={20} className="animate-spin text-velorix-red" />
            <p className="text-xs text-gray-500">Uploading to Cloudinary...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <div className="w-9 h-9 rounded-xl bg-velorix-red/10 flex items-center justify-center">
              <ImagePlus size={16} className="text-velorix-red" />
            </div>
            <p className="text-xs font-semibold text-velorix-dark">Drop images here or click to browse</p>
            <p className="text-[10px] text-gray-400">Auto-uploads to Cloudinary · Max 5MB each · PNG, JPG, WebP</p>
          </div>
        )}
      </div>

      {/* Cloudinary URL input */}
      <div className="border border-gray-200 rounded-2xl p-3 space-y-2 bg-gray-50/50">
        <div className="flex items-center gap-1.5">
          <LinkIcon size={11} className="text-velorix-red" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Add from Cloudinary URL</span>
        </div>
        <div className="flex gap-2">
          <input
            type="url"
            value={cloudinaryUrl}
            onChange={(e) => { setCloudinaryUrl(e.target.value); setUrlError(''); }}
            placeholder="https://res.cloudinary.com/your-cloud/image/..."
            className="flex-1 bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-velorix-dark transition-all"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCloudinaryUrl())}
          />
          <button
            type="button"
            onClick={handleAddCloudinaryUrl}
            className="px-3 py-2 bg-velorix-dark hover:bg-velorix-red text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
          >
            Add URL
          </button>
        </div>
        {urlError && <p className="text-[10px] text-velorix-red font-semibold">{urlError}</p>}
        <p className="text-[10px] text-gray-400">Paste any Cloudinary image URL — it will be added to the gallery without re-uploading.</p>
      </div>
    </div>
  );
};

/* ============================
   VEHICLE FORM MODAL
   ============================ */
const VehicleFormModal = ({ vehicle, onClose, onSave, token }) => {
  const isEdit = !!vehicle;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(vehicle || {
    brand: '', name: '', category: 'Luxury', type: 'Self Drive',
    seats: 5, luggage: 2, fuel: 'Petrol', transmission: 'Automatic',
    pricePerDay: 100, driverChargesPerDay: 50, securityDeposit: 200,
    minDuration: 1, maxDuration: 30, includedKmPerDay: 300,
    features: [], pickupLocations: [], cancellationPolicy: 'Free cancellation up to 24h',
    documentsRequired: ['Driving License', 'Photo ID'],
    insuranceDetails: 'Comprehensive third-party insurance included.',
    images: [], availability: true
  });

  const fieldClass = "w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-velorix-dark transition-all";
  const labelClass = "block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1";

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit
        ? `${API_BASE}/api/vehicles/${vehicle._id}`
        : `${API_BASE}/api/vehicles`;

      const payload = {
        ...form,
        features: typeof form.features === 'string' ? form.features.split(',').map(s => s.trim()) : form.features,
        pickupLocations: typeof form.pickupLocations === 'string' ? form.pickupLocations.split(',').map(s => s.trim()) : form.pickupLocations,
        documentsRequired: typeof form.documentsRequired === 'string' ? form.documentsRequired.split(',').map(s => s.trim()) : form.documentsRequired,
        images: Array.isArray(form.images) ? form.images : []
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        onSave(data.data);
        onClose();
      } else {
        setError(data.message || 'Failed to save vehicle');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white z-10">
          <h3 className="font-display font-black text-lg text-velorix-dark">{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-velorix-dark transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-grow" style={{ scrollbarWidth: 'thin' }}>
          {error && <p className="text-xs font-semibold text-velorix-red bg-red-50 border border-red-200 p-3 rounded-xl">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Brand</label><input required className={fieldClass} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Mercedes-Benz" /></div>
            <div><label className={labelClass}>Model Name</label><input required className={fieldClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="S-Class" /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select className={fieldClass} value={form.category} onChange={e => set('category', e.target.value)}>
                {['Luxury', 'SUV', 'Sedan', 'Hatchback', 'Tempo Traveller', 'Mini Bus', 'Luxury Coach', 'Tourist Bus'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Rental Type</label>
              <select className={fieldClass} value={form.type} onChange={e => set('type', e.target.value)}>
                {['Self Drive', 'With Driver', 'Both'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelClass}>Seats</label><input type="number" className={fieldClass} value={form.seats} onChange={e => set('seats', +e.target.value)} /></div>
            <div><label className={labelClass}>Luggage</label><input type="number" className={fieldClass} value={form.luggage} onChange={e => set('luggage', +e.target.value)} /></div>
            <div>
              <label className={labelClass}>Fuel</label>
              <select className={fieldClass} value={form.fuel} onChange={e => set('fuel', e.target.value)}>
                {['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Transmission</label>
              <select className={fieldClass} value={form.transmission} onChange={e => set('transmission', e.target.value)}>
                {['Automatic', 'Manual'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Price / Day (₹)</label><input type="number" className={fieldClass} value={form.pricePerDay} onChange={e => set('pricePerDay', +e.target.value)} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Driver Charges / Day (₹)</label><input type="number" className={fieldClass} value={form.driverChargesPerDay} onChange={e => set('driverChargesPerDay', +e.target.value)} /></div>
            <div><label className={labelClass}>Security Deposit (₹)</label><input type="number" className={fieldClass} value={form.securityDeposit} onChange={e => set('securityDeposit', +e.target.value)} /></div>
          </div>

          <div>
            <label className={labelClass}>Features (comma separated)</label>
            <input className={fieldClass} value={Array.isArray(form.features) ? form.features.join(', ') : form.features} onChange={e => set('features', e.target.value)} placeholder="Air Conditioning, GPS, Bluetooth" />
          </div>

          {/* ── IMAGE MANAGER ── */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gradient-to-br from-gray-50/50 to-white">
            <ImageManager
              images={Array.isArray(form.images) ? form.images : []}
              onImagesChange={(imgs) => set('images', imgs)}
              token={token}
            />
          </div>

          <div>
            <label className={labelClass}>Pickup Locations (comma separated)</label>
            <input className={fieldClass} value={Array.isArray(form.pickupLocations) ? form.pickupLocations.join(', ') : form.pickupLocations} onChange={e => set('pickupLocations', e.target.value)} placeholder="Mumbai Airport, Delhi Airport" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="avail" checked={form.availability} onChange={e => set('availability', e.target.checked)} className="accent-velorix-red w-4 h-4" />
            <label htmlFor="avail" className="text-xs font-semibold text-velorix-dark cursor-pointer">Vehicle Available for Booking</label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:text-velorix-dark transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-velorix-dark hover:bg-velorix-red text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors">
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {isEdit ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ============================
   ADMIN DASHBOARD MAIN
   ============================ */
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicleModal, setVehicleModal] = useState(null); // null | 'new' | vehicle obj
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Guard: only admin
  useEffect(() => {
    if (!user) { navigate('/'); return; }
    if (user.role !== 'admin') { navigate('/dashboard'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const [vRes, bRes, uRes] = await Promise.all([
        fetch('http://127.0.0.1:5000/api/vehicles', { headers }),
        fetch('http://127.0.0.1:5000/api/bookings', { headers }),
        fetch('http://127.0.0.1:5000/api/users', { headers })
      ]);
      const [vData, bData, uData] = await Promise.all([vRes.json(), bRes.json(), uRes.json()]);
      if (vData.status === 'success') setVehicles(vData.data);
      if (bData.status === 'success') setBookings(bData.data);
      if (uData.status === 'success') setUsers(uData.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ---- Vehicle CRUD handlers ---- */
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle permanently?')) return;
    try {
      await fetch(`http://127.0.0.1:5000/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setVehicles(prev => prev.filter(v => v._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleVehicleSave = (savedVehicle) => {
    setVehicles(prev => {
      const existing = prev.find(v => v._id === savedVehicle._id);
      if (existing) return prev.map(v => v._id === savedVehicle._id ? savedVehicle : v);
      return [savedVehicle, ...prev];
    });
  };

  /* ---- Booking status update ---- */
  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingStatus(bookingId);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (err) { console.error(err); }
    finally { setUpdatingStatus(null); }
  };

  /* ---- Compute analytics ---- */
  const analytics = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.availability).length,
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => ['Pending', 'Confirmed'].includes(b.status)).length,
    revenue: bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.pricingBreakdown?.totalAmount || 0), 0),
    totalUsers: users.length
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const filteredVehicles = vehicles.filter(v =>
    `${v.brand} ${v.name} ${v.category}`.toLowerCase().includes(vehicleSearch.toLowerCase())
  );
  const filteredBookings = bookings.filter(b =>
    `${b.vehicle?.name} ${b.vehicle?.brand} ${b.pickupLocation} ${b.status}`.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'vehicles', label: 'Fleet', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users }
  ];

  return (
    <div className="bg-velorix-light-bg min-h-screen pb-24">
      <PageSEO
        title="Admin Control Center"
        description="Velorix administrative cockpit. Manage luxury vehicle fleet models, update rental reservation status options and audit user listings."
      />
      {/* Header */}
      <div className="bg-velorix-dark py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-velorix-red" />
              <span className="text-velorix-red text-xs font-bold uppercase tracking-widest">Admin Console</span>
            </div>
            <h1 className="text-3xl font-black font-display text-white">VELORIX Control Center</h1>
          </div>
          <Link to="/dashboard" className="text-xs font-bold uppercase tracking-wider border border-white/20 text-white px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors w-fit">
            My Profile
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm w-fit mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-velorix-dark text-white shadow-sm' : 'text-gray-400 hover:text-velorix-dark'}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-velorix-red" size={36} /></div>
        ) : (
          <>
            {/* ─── ANALYTICS TAB ─── */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <MetricCard label="Total Vehicles" value={analytics.totalVehicles} icon={Car} sub={`${analytics.activeVehicles} available`} accent="#D32F2F" />
                  <MetricCard label="Total Bookings" value={analytics.totalBookings} icon={Calendar} sub={`${analytics.activeBookings} active`} accent="#1A73E8" />
                  <MetricCard label="Gross Revenue" value={`$${analytics.revenue.toLocaleString()}`} icon={TrendingUp} sub="All confirmed trips" accent="#2E7D32" />
                  <MetricCard label="Registered Users" value={analytics.totalUsers} icon={Users} sub="Incl. admins" accent="#7C3AED" />
                  <MetricCard label="Fleet Occupancy" value={`${Math.round((analytics.activeBookings / Math.max(analytics.activeVehicles, 1)) * 100)}%`} icon={BarChart2} sub="Current utilization" accent="#D32F2F" />
                  <MetricCard label="Avg Booking Value" value={`$${analytics.totalBookings ? Math.round(analytics.revenue / analytics.totalBookings) : 0}`} icon={DollarSign} sub="Per confirmed booking" accent="#1A73E8" />
                </div>

                {/* Booking Status Breakdown */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-display font-bold text-velorix-dark text-base mb-6">Booking Status Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(status => {
                      const count = bookings.filter(b => b.status === status).length;
                      const pct = bookings.length ? Math.round((count / bookings.length) * 100) : 0;
                      const colors = { Pending: '#F59E0B', Confirmed: '#3B82F6', Completed: '#10B981', Cancelled: '#EF4444' };
                      return (
                        <div key={status} className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-3">
                            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                              <circle cx="32" cy="32" r="27" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                              <circle cx="32" cy="32" r="27" fill="none" stroke={colors[status]} strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 27 * pct / 100} ${2 * Math.PI * 27}`} strokeLinecap="round" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-velorix-dark">{pct}%</span>
                          </div>
                          <p className="font-bold text-sm text-velorix-dark">{count}</p>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{status}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── FLEET MANAGEMENT TAB ─── */}
            {activeTab === 'vehicles' && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      value={vehicleSearch}
                      onChange={e => setVehicleSearch(e.target.value)}
                      placeholder="Search by brand, model or category..."
                      className="bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs w-64 outline-none focus:border-velorix-dark"
                    />
                  </div>
                  <button
                    onClick={() => setVehicleModal('new')}
                    className="flex items-center gap-2 bg-velorix-dark hover:bg-velorix-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors w-fit"
                  >
                    <Plus size={14} /> Add Vehicle
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                        <tr>
                          <th className="px-5 py-3.5">Vehicle</th>
                          <th className="px-5 py-3.5">Category</th>
                          <th className="px-5 py-3.5">Type</th>
                          <th className="px-5 py-3.5">Price/Day</th>
                          <th className="px-5 py-3.5">Rating</th>
                          <th className="px-5 py-3.5">Status</th>
                          <th className="px-5 py-3.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredVehicles.map(v => (
                          <tr key={v._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => setVehicleModal(v)} title="Click to manage images">
                                  <img
                                    src={v.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=100&q=70'}
                                    alt={v.name}
                                    className="w-16 h-11 rounded-xl object-cover border border-gray-100 transition-all group-hover:brightness-75"
                                  />
                                  {v.images?.length > 0 && (
                                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                                      <Star size={8} className="text-white fill-white" />
                                    </div>
                                  )}
                                  {v.images?.length > 1 && (
                                    <div className="absolute -bottom-1.5 -right-1.5 bg-velorix-dark text-white text-[8px] font-bold px-1 py-0.5 rounded-full leading-none">
                                      +{v.images.length - 1}
                                    </div>
                                  )}
                                  <div className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ImagePlus size={14} className="text-white drop-shadow" />
                                  </div>
                                </div>
                                <div>
                                  <p className="font-bold text-velorix-dark">{v.brand} {v.name}</p>
                                  <p className="text-gray-400 text-[10px]">{v.seats} seats · {v.fuel}</p>
                                  <p className="text-[9px] text-gray-300 mt-0.5">{v.images?.length || 0} photo{v.images?.length !== 1 ? 's' : ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-gray-600">{v.category}</td>
                            <td className="px-5 py-4 text-gray-600">{v.type}</td>
                            <td className="px-5 py-4 font-bold text-velorix-dark">${v.pricePerDay}</td>
                            <td className="px-5 py-4 font-bold text-velorix-dark">{v.ratings} ⭐</td>
                            <td className="px-5 py-4">
                              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${v.availability ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                {v.availability ? 'Available' : 'Unavailable'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => setVehicleModal(v)} className="p-1.5 text-gray-400 hover:text-velorix-dark transition-colors"><Edit3 size={14} /></button>
                                <button onClick={() => handleDeleteVehicle(v._id)} className="p-1.5 text-gray-400 hover:text-velorix-red transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredVehicles.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-12">No vehicles match your search.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─── BOOKINGS MANAGEMENT TAB ─── */}
            {activeTab === 'bookings' && (
              <div className="space-y-5">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    value={bookingSearch}
                    onChange={e => setBookingSearch(e.target.value)}
                    placeholder="Search by vehicle, location or status..."
                    className="bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs w-72 outline-none focus:border-velorix-dark"
                  />
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                        <tr>
                          <th className="px-5 py-3.5">Booking ID</th>
                          <th className="px-5 py-3.5">Vehicle</th>
                          <th className="px-5 py-3.5">Customer</th>
                          <th className="px-5 py-3.5">Dates</th>
                          <th className="px-5 py-3.5">Total</th>
                          <th className="px-5 py-3.5">Status</th>
                          <th className="px-5 py-3.5">Update</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredBookings.map(b => (
                          <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 text-gray-400 font-mono">#{b._id.slice(-6)}</td>
                            <td className="px-5 py-4 font-bold text-velorix-dark">{b.vehicle?.brand} {b.vehicle?.name}</td>
                            <td className="px-5 py-4 text-gray-600">{b.user?.name || '—'}</td>
                            <td className="px-5 py-4 text-gray-500">{formatDate(b.startDate)} → {formatDate(b.endDate)}</td>
                            <td className="px-5 py-4 font-bold text-velorix-dark">${b.pricingBreakdown?.totalAmount || 0}</td>
                            <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                            <td className="px-5 py-4">
                              {updatingStatus === b._id ? (
                                <Loader2 size={14} className="animate-spin text-gray-400" />
                              ) : (
                                <select
                                  value={b.status}
                                  onChange={e => handleStatusUpdate(b._id, e.target.value)}
                                  className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 text-[10px] font-bold outline-none cursor-pointer"
                                >
                                  {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                                    <option key={s}>{s}</option>
                                  ))}
                                </select>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredBookings.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-12">No bookings match your search.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─── USERS TAB ─── */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                      <tr>
                        <th className="px-5 py-3.5">User</th>
                        <th className="px-5 py-3.5">Email</th>
                        <th className="px-5 py-3.5">Role</th>
                        <th className="px-5 py-3.5">Joined</th>
                        <th className="px-5 py-3.5">Bookings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-velorix-dark text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-velorix-dark">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-500">{u.email}</td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-velorix-red/10 text-velorix-red border border-velorix-red/20' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-500">{formatDate(u.createdAt)}</td>
                          <td className="px-5 py-4 font-bold text-velorix-dark">
                            {bookings.filter(b => b.user?._id === u._id || b.user === u._id).length}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-12">No registered users found.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Vehicle Form Modal */}
      <AnimatePresence>
        {vehicleModal && (
          <VehicleFormModal
            vehicle={vehicleModal === 'new' ? null : vehicleModal}
            onClose={() => setVehicleModal(null)}
            onSave={handleVehicleSave}
            token={user.token}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
