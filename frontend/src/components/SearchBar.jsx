import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, X, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const CustomCarSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm text-white/90 outline-none font-medium text-left bg-transparent"
      >
        <span className="truncate">{value || 'Choose Car'}</span>
        <ChevronDown size={14} className={`text-white/40 transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-0 right-0 mb-3 bg-velorix-dark-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${!value ? 'bg-velorix-red text-white font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              Choose Car
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${value === opt ? 'bg-velorix-red text-white font-bold' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomTimePicker = ({ hour, minute, amPm, onChangeHour, onChangeMinute, onChangeAmPm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const displayTime = hour ? `${hour}:${minute} ${amPm}` : 'Choose Time';

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm text-white/90 outline-none font-medium text-left bg-transparent"
      >
        <span>{displayTime}</span>
        <ChevronDown size={14} className={`text-white/40 transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full right-0 mb-3 w-56 bg-velorix-dark-card border border-white/10 rounded-2xl shadow-2xl p-4 text-white"
          >
            <div className="grid grid-cols-3 gap-2">
              {/* Hours Column */}
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-white/45 mb-1.5 text-center font-bold">Hour</span>
                <div className="h-32 overflow-y-auto space-y-1 pr-0.5 scrollbar-thin">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                    const hStr = String(h);
                    const isSel = hour === hStr;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => onChangeHour(hStr)}
                        className={`w-full text-center py-1 rounded-lg text-xs font-semibold transition-all ${isSel ? 'bg-velorix-red text-white' : 'bg-white/5 hover:bg-white/10 text-white/80'}`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minutes Column */}
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-white/45 mb-1.5 text-center font-bold">Min</span>
                <div className="space-y-1">
                  {['00', '15', '30', '45'].map((m) => {
                    const isSel = minute === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => onChangeMinute(m)}
                        className={`w-full text-center py-1 rounded-lg text-xs font-semibold transition-all ${isSel ? 'bg-velorix-red text-white' : 'bg-white/5 hover:bg-white/10 text-white/80'}`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Period Column */}
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-white/45 mb-1.5 text-center font-bold">Period</span>
                <div className="space-y-1">
                  {['AM', 'PM'].map((p) => {
                    const isSel = amPm === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => onChangeAmPm(p)}
                        className={`w-full text-center py-1.5 rounded-lg text-xs font-bold transition-all ${isSel ? 'bg-velorix-red text-white' : 'bg-white/5 hover:bg-white/10 text-white/80'}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full mt-3 bg-white/10 hover:bg-white text-white hover:text-black py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

const SearchBar = () => {
  const { user } = useAuth();

  // Today's date in YYYY-MM-DD for the min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    car: '',
    pickup: '',
    drop: '',
    date: ''
  });

  // 12-hour time picker state
  const [timeHour, setTimeHour] = useState('');
  const [timeMinute, setTimeMinute] = useState('00');
  const [timeAmPm, setTimeAmPm] = useState('AM');

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Derive 24h time string for API (e.g. '14:30')
  const get24hTime = () => {
    if (!timeHour) return '';
    let h = parseInt(timeHour, 10);
    if (timeAmPm === 'AM') {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h += 12;
    }
    return `${String(h).padStart(2, '0')}:${timeMinute}`;
  };

  // Friendly display for modal (e.g. '2:30 PM')
  const getFriendlyTime = () => {
    if (!timeHour) return '';
    return `${timeHour}:${timeMinute} ${timeAmPm}`;
  };

  // Auto pre-populate user information if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const time24 = get24hTime();
    if (!formData.name || !formData.phone || !formData.pickup || !formData.drop || !formData.date || !timeHour) return;

    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const pickupDateTime = new Date(`${formData.date}T${time24}`);
      const dropDateTime = new Date(pickupDateTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours later

      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          car: formData.car || 'Any Premium Vehicle',
          pickupLocation: formData.pickup,
          dropLocation: formData.drop,
          startDate: pickupDateTime,
          endDate: dropDateTime,
          driverOption: true
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setIsSuccessOpen(true);
      } else {
        setErrorMsg(data.message || 'Failed to submit taxi request.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to establish contact with the booking service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccessOpen(false);
    setFormData({ 
      name: user?.name || '', 
      phone: user?.phone || '', 
      car: '', 
      pickup: '', 
      drop: '', 
      date: ''
    });
    setTimeHour('');
    setTimeMinute('00');
    setTimeAmPm('AM');
    setErrorMsg('');
  };

  const carOptions = [
    'Any Premium Vehicle',
    'Toyota Fortuner (SUV)',
    'Mercedes-Benz S-Class (Luxury)',
    'BMW X5 (Premium SUV)',
    'Audi A6 (Luxury Sedan)',
    'Toyota Innova Crysta (MUV)',
    'Hyundai i20 (Hatchback)',
    'Force Traveller (12-Seater)',
    'Volvo Multi-Axle (45-Seater)',
    'Scania Cruiser Coach (36-Seater)',
    'Mercedes-Benz E-Class (Wedding)',
  ];

  return (
    <>
      {/* Booking Strip — velorix-dark background */}
      <div className="w-full bg-velorix-dark text-white">

        {/* Title Row */}
        <div className="text-center py-3.5 border-b border-white/10">
          <h2 className="text-base md:text-lg font-bold tracking-wide text-white/90">
            Need to Rent a <span className="text-velorix-red">Premium Cab?</span>
          </h2>
          {errorMsg && (
            <p className="text-xs text-velorix-red font-semibold mt-1.5 bg-velorix-red/10 py-1 px-3.5 rounded-full inline-block border border-velorix-red/20">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Fields Row */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap lg:flex-nowrap items-stretch overflow-visible">

            {/* NAME */}
            <div className="flex-1 min-w-[110px] flex flex-col px-4 py-3 border-r border-white/10">
              <label className="text-[9px] uppercase tracking-[0.18em] font-bold text-white/40 mb-1">Name</label>
              <input
                required
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-transparent text-sm text-white/90 placeholder-white/30 outline-none font-medium"
              />
            </div>

            {/* PHONE */}
            <div className="flex-1 min-w-[120px] flex flex-col px-4 py-3 border-r border-white/10">
              <label className="text-[9px] uppercase tracking-[0.18em] font-bold text-white/40 mb-1">Phone</label>
              <input
                required
                type="tel"
                placeholder="Phone No"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-transparent text-sm text-white/90 placeholder-white/30 outline-none font-medium"
              />
            </div>

            <div className="flex-1 min-w-[150px] flex flex-col px-4 py-3 border-r border-white/10">
              <label className="text-[9px] uppercase tracking-[0.18em] font-bold text-white/40 mb-1">Car</label>
              <CustomCarSelect
                value={formData.car}
                onChange={(val) => setFormData({ ...formData, car: val })}
                options={carOptions}
              />
            </div>

            <div className="flex-1 min-w-[140px] flex flex-col px-4 py-3 border-r border-white/10">
              <label className="text-[9px] uppercase tracking-[0.18em] font-bold text-white/40 mb-1">Pickup</label>
              <input
                required
                type="text"
                placeholder="Pickup Location"
                value={formData.pickup}
                onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                className="bg-transparent text-sm text-white/90 placeholder-white/30 outline-none font-medium"
              />
            </div>

            {/* DROP */}
            <div className="flex-1 min-w-[140px] flex flex-col px-4 py-3 border-r border-white/10">
              <label className="text-[9px] uppercase tracking-[0.18em] font-bold text-white/40 mb-1">Drop</label>
              <input
                required
                type="text"
                placeholder="Drop Location"
                value={formData.drop}
                onChange={(e) => setFormData({ ...formData, drop: e.target.value })}
                className="bg-transparent text-sm text-white/90 placeholder-white/30 outline-none font-medium"
              />
            </div>

            {/* DATE */}
            <div className="flex-1 min-w-[130px] flex flex-col px-4 py-3 border-r border-white/10">
              <label className="text-[9px] uppercase tracking-[0.18em] font-bold text-white/40 mb-1">Date</label>
              <input
                required
                type="date"
                min={todayStr}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-transparent text-sm text-white/90 outline-none font-medium cursor-pointer [color-scheme:dark]"
              />
            </div>

            {/* TIME */}
            <div className="flex-1 min-w-[140px] flex flex-col px-4 py-3 border-r border-white/10">
              <label className="text-[9px] uppercase tracking-[0.18em] font-bold text-white/40 mb-1">Time</label>
              <CustomTimePicker
                hour={timeHour}
                minute={timeMinute}
                amPm={timeAmPm}
                onChangeHour={setTimeHour}
                onChangeMinute={setTimeMinute}
                onChangeAmPm={setTimeAmPm}
              />
            </div>

            {/* GET TAXI BUTTON */}
            <div className="flex items-center px-5 py-3 flex-shrink-0">
              <button
                type="submit"
                disabled={submitting}
                className="bg-velorix-red hover:bg-velorix-red-hover text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-lg transition-all duration-200 hover:scale-[1.03] shadow-lg whitespace-nowrap flex items-center gap-1.5"
              >
                {submitting ? <Loader2 size={13} className="animate-spin" /> : null}
                Get Taxi
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isSuccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl relative z-10 text-center"
            >
              <button onClick={handleClose} className="absolute top-5 right-5 text-gray-400 hover:text-velorix-dark">
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-velorix-red/10 text-velorix-red rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-display font-black text-2xl text-velorix-dark mb-3">Taxi Request Sent!</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Thank you, <span className="font-bold text-velorix-dark">{formData.name}</span>. Your request for a{' '}
                <span className="font-bold text-velorix-dark">{formData.car || 'premium vehicle'}</span> from{' '}
                <span className="font-semibold text-velorix-dark">{formData.pickup}</span> to{' '}
                <span className="font-semibold text-velorix-dark">{formData.drop}</span> on{' '}
                <span className="font-semibold text-velorix-dark">{formData.date}</span> at{' '}
                <span className="font-semibold text-velorix-dark">{getFriendlyTime()}</span> has been received.
              </p>
              <div className="bg-velorix-red/5 border border-velorix-red/20 rounded-2xl p-4 text-xs font-bold text-velorix-red mb-6 text-left">
                Our dispatch team is reviewing your booking. You will receive a confirmation email once the administrator approves your request.
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-velorix-dark hover:bg-velorix-red text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors duration-300"
              >
                Awesome, Got It!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guest Login/Signup modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default SearchBar;
