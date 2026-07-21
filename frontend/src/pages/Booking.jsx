import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { 
  Car, 
  Calendar, 
  MapPin, 
  UserCheck, 
  CreditCard, 
  CheckCircle, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Clock,
  HelpCircle,
  FileCheck2,
  Lock
} from 'lucide-react';

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [bookingParams, setBookingParams] = useState(null);
  
  // Input fields state
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [driverOption, setDriverOption] = useState(false);
  const [extraServices, setExtraServices] = useState([]);
  
  // Payment card inputs
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Process states
  const [loading, setLoading] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Load params from localStorage on mount
  useEffect(() => {
    const params = localStorage.getItem('velorix_booking_params');
    if (params) {
      const parsed = JSON.parse(params);
      setBookingParams(parsed);
      setPickupLocation(parsed.pickupLocation || '');
      setDropLocation(parsed.dropLocation || '');
      // startDate may be a full ISO datetime string — extract YYYY-MM-DD for the date input
      const rawStart = parsed.startDate || '';
      setStartDate(rawStart ? rawStart.split('T')[0] : '');
      setEndDate(parsed.endDate || '');
      setPickupTime(parsed.pickupTime || '');
      setDriverOption(parsed.driverOption || false);
      setExtraServices(parsed.extraServices || []);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-velorix-light-bg flex flex-col items-center justify-center p-6 text-center">
        <Lock size={48} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold font-display text-velorix-dark">Authentication Required</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-sm">Please sign in or create an account to view and book luxury vehicles.</p>
        <button 
          onClick={() => setIsAuthOpen(true)}
          className="bg-velorix-red text-white text-xs font-semibold px-6 py-3.5 rounded-full uppercase tracking-wider mt-6 hover:bg-velorix-red-hover transition-colors"
        >
          Sign In Now
        </button>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    );
  }

  if (!bookingParams) {
    return (
      <div className="min-h-screen bg-velorix-light-bg flex flex-col items-center justify-center p-6 text-center">
        <Car size={48} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold font-display text-velorix-dark">No Active Booking Session</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-sm">Please visit our luxury fleet or tour package pages and select a vehicle to begin your booking process.</p>
        <Link to="/fleet" className="bg-velorix-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full mt-6">
          View Fleet
        </Link>
      </div>
    );
  }

  // Calculate pricing values
  const totalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const days = totalDays();
  const basePrice = bookingParams.pricePerDay * days;
  const driverCost = driverOption ? (bookingParams.driverChargesPerDay * days) : 0;
  const extrasCost = extraServices.reduce((sum, s) => sum + s.price, 0);
  const tax = Math.round((basePrice + driverCost + extrasCost) * 0.18);
  const totalAmount = basePrice + driverCost + extrasCost + bookingParams.securityDeposit + tax;

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (!pickupLocation || !dropLocation || !startDate || !endDate) {
        setErrorMsg('Please specify locations and dates');
        return;
      }
      setErrorMsg('');
    }
    setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setActiveStep(prev => prev - 1);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const transactionId = `TXN-${Date.now()}`;
    const payload = {
      vehicleId: bookingParams.vehicleId,
      pickupLocation,
      dropLocation,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      driverOption,
      extraServices,
      paymentMethod: 'Credit Card',
      transactionId
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setBookingResponse(data.data);
        localStorage.removeItem('velorix_booking_params'); // clear session
        setActiveStep(5); // goto success step
      } else {
        setErrorMsg(data.message || 'Booking submission failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to establish contact with backend booking APIs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-velorix-light-bg min-h-screen pb-24">
      {/* Wizard Step Indicator Headers */}
      <div className="bg-velorix-dark py-12 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center relative">
          {/* horizontal progress connector */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0" />
          <div 
            className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-velorix-red z-0 transition-all duration-300"
            style={{ width: `${((activeStep - 1) / 4) * 100}%` }}
          />

          {[
            { step: 1, label: 'Details' },
            { step: 2, label: 'Add-ons' },
            { step: 3, label: 'Review' },
            { step: 4, label: 'Payment' },
            { step: 5, label: 'Success' }
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${activeStep >= item.step ? 'bg-velorix-red border-velorix-red text-white' : 'bg-velorix-dark border-gray-600 text-gray-500'}`}
              >
                {item.step}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider mt-2 ${activeStep >= item.step ? 'text-white' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-velorix-red-light border border-red-200 text-velorix-red text-xs font-bold uppercase tracking-wider">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT: STEP CONTENT PANEL */}
          <div className="md:col-span-2 space-y-6">
            
            {/* STEP 1: SETUP DETAILS */}
            {activeStep === 1 && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-display font-black text-xl text-velorix-dark">Setup Rental Specifications</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Pickup Terminal</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text"
                        required
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Airport terminal, office or hotel pickup"
                        className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 pl-10 pr-3 text-xs outline-none focus:border-velorix-dark"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Drop Terminal</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text"
                        required
                        value={dropLocation}
                        onChange={(e) => setDropLocation(e.target.value)}
                        placeholder="Drop off location"
                        className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 pl-10 pr-3 text-xs outline-none focus:border-velorix-dark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Pickup Date</label>
                      <input 
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 px-3 text-xs outline-none focus:border-velorix-dark cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Return Date</label>
                      <input 
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 px-3 text-xs outline-none focus:border-velorix-dark cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Pickup Time Display */}
                  {pickupTime && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Pickup Time</label>
                      <div className="flex items-center gap-2 bg-velorix-light-bg border border-gray-200 rounded-xl py-3 px-3">
                        <Clock size={14} className="text-gray-400 shrink-0" />
                        <span className="text-xs font-semibold text-velorix-dark">{pickupTime}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={handleNextStep}
                    className="bg-velorix-dark hover:bg-velorix-red text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ADD-ONS OPTIONS */}
            {activeStep === 2 && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-display font-black text-xl text-velorix-dark">Upgrade Travel Options</h3>
                
                {/* Chauffeur checkbox */}
                {bookingParams.driverChargesPerDay > 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-velorix-dark">Include Chauffeur Service</p>
                      <p className="text-xs text-gray-400 mt-0.5">₹{bookingParams.driverChargesPerDay}/day professional driver</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={driverOption}
                      onChange={(e) => setDriverOption(e.target.checked)}
                      className="accent-velorix-red w-4 h-4 cursor-pointer"
                    />
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">Extras Upgrades</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'GPS Navigation System', price: 15 },
                      { name: 'Child Safety Infant Seat', price: 20 },
                      { name: 'Excess Collision Waiver (CDW)', price: 30 }
                    ].map((service) => {
                      const isChecked = extraServices.some(s => s.name === service.name);
                      return (
                        <label key={service.name} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100/50 rounded-2xl border border-gray-100 cursor-pointer transition-colors">
                          <div>
                            <span className="font-bold text-xs text-velorix-dark block">{service.name}</span>
                            <span className="text-[10px] text-gray-400 mt-0.5 block">+₹{service.price} Flat Charge</span>
                          </div>
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setExtraServices(extraServices.filter(s => s.name !== service.name));
                              } else {
                                setExtraServices([...extraServices, service]);
                              }
                            }}
                            className="accent-velorix-red w-4 h-4"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-between">
                  <button 
                    onClick={handlePrevStep}
                    className="border border-gray-200 text-gray-500 hover:text-velorix-dark text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button 
                    onClick={handleNextStep}
                    className="bg-velorix-dark hover:bg-velorix-red text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW INVOICE */}
            {activeStep === 3 && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-display font-black text-xl text-velorix-dark">Review Rental Agreement</h3>
                
                <div className="space-y-4 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-2xl p-6">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-velorix-dark">Specifications</span>
                    <span className="font-bold text-velorix-dark">{bookingParams.vehicleName} ({bookingParams.vehicleCategory})</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Pickup Location</span>
                    <span className="font-bold text-velorix-dark">{pickupLocation}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Drop Location</span>
                    <span className="font-bold text-velorix-dark">{dropLocation}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Duration Range</span>
                    <span className="font-bold text-velorix-dark">{startDate} to {endDate} ({days} days)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Driver Option</span>
                    <span className="font-bold text-velorix-dark">{driverOption ? 'Professional Driver included' : 'Self-Drive option'}</span>
                  </div>
                </div>

                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] text-velorix-red font-semibold leading-relaxed">
                  IMPORTANT: Please ensure the primary driver holds a valid physical Driving License. 
                  Minors are not authorized to drive. The refundable security deposit will be held during vehicle check-in.
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-between">
                  <button 
                    onClick={handlePrevStep}
                    className="border border-gray-200 text-gray-500 hover:text-velorix-dark text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button 
                    onClick={handleNextStep}
                    className="bg-velorix-dark hover:bg-velorix-red text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    Proceed to Payment
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SIMULATED PAYMENT */}
            {activeStep === 4 && (
              <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-display font-black text-xl text-velorix-dark">Secure Card Checkout</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Cardholder Name</label>
                    <input 
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 px-4 text-xs outline-none focus:border-velorix-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text"
                        required
                        maxLength="19"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        placeholder="4000 1234 5678 9010"
                        className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-velorix-dark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Expiry Date</label>
                      <input 
                        type="text"
                        required
                        maxLength="5"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 px-3 text-xs outline-none focus:border-velorix-dark text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">CVV Security</label>
                      <input 
                        type="password"
                        required
                        maxLength="3"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 px-3 text-xs outline-none focus:border-velorix-dark text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-between">
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-gray-200 text-gray-500 hover:text-velorix-dark text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-velorix-red hover:bg-velorix-red-hover text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                  >
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <ShieldCheck size={14} />}
                    Authorize & Pay ₹{totalAmount}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 5: BOOKING SUCCESS CONFIRMED */}
            {activeStep === 5 && bookingResponse && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle size={36} />
                </div>

                <div>
                  <h3 className="font-display font-black text-2xl text-velorix-dark">Reservation Confirmed!</h3>
                  <p className="text-gray-400 text-xs mt-2 max-w-sm mx-auto">
                    Your luxury ride has been reserved successfully. A receipt invoice has been sent to your email.
                  </p>
                </div>

                {/* Booking receipt details summary */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left text-xs text-gray-500 space-y-2.5 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-velorix-dark font-display">Booking ID</span>
                    <span className="font-bold text-velorix-dark">{bookingResponse._id}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Vehicle Reserved</span>
                    <span className="font-bold text-velorix-dark">{bookingParams.vehicleName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Transaction status</span>
                    <span className="text-green-600 font-bold">Paid (Simulated Authorization)</span>
                  </div>
                  <div className="flex justify-between text-sm text-velorix-dark font-black pt-1">
                    <span>Total Amount Charged</span>
                    <span className="text-velorix-red">₹{bookingResponse.pricingBreakdown?.totalAmount}</span>
                  </div>
                </div>

                <div className="pt-6 flex gap-3 justify-center">
                  <Link 
                    to="/dashboard"
                    className="bg-velorix-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
                  >
                    Go to My Trips
                  </Link>
                  <Link 
                    to="/fleet"
                    className="border border-gray-200 text-gray-500 hover:text-velorix-dark text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
                  >
                    Browse Fleet
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: BILLING BREAKDOWN CARD */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-28 space-y-6">
              <h4 className="font-display font-bold text-velorix-dark text-base border-b border-gray-100 pb-3">Booking Summary</h4>
              
              {/* Vehicle Thumbnail */}
              <div className="flex gap-3 items-center">
                <img 
                  src={bookingParams.vehicleImage || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80'} 
                  alt={bookingParams.vehicleName}
                  className="w-16 h-12 rounded-xl object-cover border border-gray-100"
                />
                <div>
                  <span className="text-[10px] text-velorix-red font-bold uppercase tracking-wider">{bookingParams.vehicleCategory}</span>
                  <p className="font-bold text-xs text-velorix-dark leading-tight mt-0.5">{bookingParams.vehicleName}</p>
                </div>
              </div>

              {/* Pricing Math Details */}
              {days > 0 && (
                <div className="space-y-2.5 text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Rent cost ({days} days)</span>
                    <span className="font-bold text-velorix-dark">₹{basePrice}</span>
                  </div>
                  {driverOption && (
                    <div className="flex justify-between">
                      <span>Driver cost</span>
                      <span className="font-bold text-velorix-dark">₹{driverCost}</span>
                    </div>
                  )}
                  {extrasCost > 0 && (
                    <div className="flex justify-between">
                      <span>Add-ons</span>
                      <span className="font-bold text-velorix-dark">₹{extrasCost}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Security Deposit</span>
                    <span className="font-bold text-velorix-dark">₹{bookingParams.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18% tax)</span>
                    <span className="font-bold text-velorix-dark">₹{tax}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 text-sm text-velorix-dark font-black">
                    <span>Total Bill</span>
                    <span className="text-velorix-red">₹{totalAmount}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
