import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { 
  Users, 
  Fuel, 
  Zap, 
  Briefcase, 
  ShieldCheck, 
  Calendar, 
  Star, 
  Check, 
  Sparkles, 
  Info,
  Clock,
  Coins,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Shield,
  Send,
  Loader2
} from 'lucide-react';
import PageSEO from '../components/PageSEO';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeExteriorView, setActiveExteriorView] = useState('front');
  const [activeTab, setActiveTab] = useState('overview'); // overview, specifications, insurance, reviews
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Booking Card States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [driverOption, setDriverOption] = useState(false);
  const [extraServices, setExtraServices] = useState([
    { name: 'GPS Navigation System', price: 15, checked: false },
    { name: 'Child Safety Infant Seat', price: 20, checked: false },
    { name: 'Excess Collision Waiver (CDW)', price: 30, checked: false }
  ]);

  // Pickup Time States (12-hour format)
  const [pickupHour, setPickupHour] = useState('10');
  const [pickupMinute, setPickupMinute] = useState('00');
  const [pickupPeriod, setPickupPeriod] = useState('AM');
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const pickupTimeDisplay = `${pickupHour}:${pickupMinute} ${pickupPeriod}`;

  // Converts 12h to 24h for ISO string construction
  const getPickupTime24 = () => {
    let h = parseInt(pickupHour, 10);
    if (pickupPeriod === 'AM' && h === 12) h = 0;
    if (pickupPeriod === 'PM' && h !== 12) h += 12;
    return `${String(h).padStart(2, '0')}:${pickupMinute}`;
  };

  // Date helpers
  const todayStr = new Date().toISOString().split('T')[0];
  const minReturnDate = startDate
    ? (() => { const d = new Date(startDate); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })()
    : todayStr;

  const handleStartDateChange = (val) => {
    setStartDate(val);
    // If existing endDate is on or before the new startDate, clear it
    if (endDate && endDate <= val) setEndDate('');
  };

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitReviewLoading, setSubmitReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Fetch Vehicle and Reviews
  useEffect(() => {
    const fetchVehicleData = async () => {
      setLoading(true);
      try {
        const vehicleRes = await fetch(`http://127.0.0.1:5000/api/vehicles/${id}`);
        const vehicleData = await vehicleRes.json();
        if (vehicleRes.ok && vehicleData.status === 'success') {
          setVehicle(vehicleData.data);
        }

        const reviewsRes = await fetch(`http://127.0.0.1:5000/api/reviews/vehicle/${id}`);
        const reviewsData = await reviewsRes.json();
        if (reviewsRes.ok && reviewsData.status === 'success') {
          setReviews(reviewsData.data);
        }
      } catch (err) {
        console.error('Error fetching vehicle details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-velorix-light-bg flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-velorix-red mb-4" size={40} />
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Loading Premium Specs...</span>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-velorix-light-bg flex flex-col items-center justify-center p-6 text-center">
        <Info size={48} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold font-display text-velorix-dark">Vehicle Not Found</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-sm">The vehicle details page you are trying to view does not exist or has been removed.</p>
        <Link to="/fleet" className="bg-velorix-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full mt-6">
          Back to Fleet
        </Link>
      </div>
    );
  }

  // Calculate pricing breakdown
  const totalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const days = totalDays();
  const basePrice = vehicle.pricePerDay * days;
  const driverCost = driverOption ? (vehicle.driverChargesPerDay * days) : 0;
  const extrasCost = extraServices
    .filter(s => s.checked)
    .reduce((sum, s) => sum + s.price, 0);
  const tax = Math.round((basePrice + driverCost + extrasCost) * 0.18);
  const totalAmount = basePrice + driverCost + extrasCost + vehicle.securityDeposit + tax;

  const getExteriorViewUrl = (view) => {
    const fallback = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80';
    if (!vehicle?.images?.length) return fallback;

    if (view === 'front') return vehicle.images[0] || fallback;
    if (view === 'left') return vehicle.images[1] || vehicle.images[0] || fallback;
    if (view === 'right') return vehicle.images[2] || vehicle.images[0] || fallback;
    return vehicle.images[0] || fallback;
  };

  // Handle service checkbox toggle
  const handleServiceToggle = (index) => {
    const updated = [...extraServices];
    updated[index].checked = !updated[index].checked;
    setExtraServices(updated);
  };

  // Submit booking and navigate to wizard checkout
  const handleBookNow = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (!startDate || !endDate) {
      alert('Please select pickup and return dates.');
      return;
    }

    // Save booking parameters into state/localStorage and forward to the Booking step-by-step wizard
    const selectedExtras = extraServices.filter(s => s.checked).map(s => ({ name: s.name, price: s.price }));
    // Build full datetime ISO string for startDate by combining date + selected time
    const startDateTime = startDate ? `${startDate}T${getPickupTime24()}:00` : startDate;
    const bookingPayload = {
      vehicleId: vehicle._id,
      vehicleName: `${vehicle.brand} ${vehicle.name}`,
      vehicleImage: vehicle.images[0],
      vehicleCategory: vehicle.category,
      pricePerDay: vehicle.pricePerDay,
      driverChargesPerDay: vehicle.driverChargesPerDay,
      securityDeposit: vehicle.securityDeposit,
      startDate: startDateTime,
      endDate,
      pickupTime: pickupTimeDisplay,
      driverOption,
      extraServices: selectedExtras,
      pricing: {
        basePrice,
        driverCost,
        extrasCost,
        securityDeposit: vehicle.securityDeposit,
        tax,
        totalAmount
      }
    };

    localStorage.setItem('velorix_booking_params', JSON.stringify(bookingPayload));
    navigate('/booking');
  };

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setSubmitReviewLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          vehicleId: vehicle._id,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setReviews([data.data, ...reviews]);
        setReviewComment('');
        setReviewRating(5);
        // Refresh rating average
        const refreshedRes = await fetch(`http://127.0.0.1:5000/api/vehicles/${id}`);
        const refreshedData = await refreshedRes.json();
        if (refreshedRes.ok && refreshedData.status === 'success') {
          setVehicle(refreshedData.data);
        }
      } else {
        setReviewError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setReviewError('Failed to contact review API.');
    } finally {
      setSubmitReviewLoading(false);
    }
  };

  return (
    <div className="bg-velorix-light-bg min-h-screen pb-24">
      <PageSEO 
        title={`${vehicle.brand} ${vehicle.name} | Rent Vehicle`} 
        description={`Rent the premium ${vehicle.brand} ${vehicle.name} (${vehicle.category}) for self-drive or with professional driver. Check pricing, availability and features.`} 
      />
      {/* breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6">
        <Link to="/fleet" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-velorix-red text-sm font-semibold">
          <ChevronLeft size={16} />
          Back to Fleet Listing
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-6">
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-velorix-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {vehicle.category}
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-velorix-dark">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                {vehicle.ratings} ({reviews.length} reviews)
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-display text-velorix-dark mt-2">
              {vehicle.brand} <span className="text-gray-400 font-medium">{vehicle.name}</span>
            </h1>
          </div>
          <div className="text-left md:text-right">
            <span className="text-xs text-gray-400 block font-medium uppercase tracking-wider">Rental Price</span>
            <p className="text-3xl font-black font-display text-velorix-dark mt-1">
              ₹{vehicle.pricePerDay}
              <span className="text-gray-400 text-sm font-normal">/day</span>
            </p>
          </div>
        </div>

        {/* Dynamic Image & Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Image Gallery & Tabs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery View */}
            <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-50">
                <img 
                  src={vehicle.images[activeImageIdx] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                {/* Navigation arrows inside main image */}
                {vehicle.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImageIdx(prev => prev === 0 ? vehicle.images.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md text-velorix-dark transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => setActiveImageIdx(prev => prev === vehicle.images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md text-velorix-dark transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {vehicle.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${idx === activeImageIdx ? 'border-velorix-red scale-95 shadow-sm' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* VEHICLE EXTERIOR VIEW SELECTOR */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-velorix-red bg-velorix-red/10 px-2.5 py-1 rounded-full">Exterior View</span>
              <h3 className="font-display font-bold text-lg text-velorix-dark mt-3">Vehicle Exterior</h3>
              <p className="text-gray-400 text-xs mt-1">Choose a front, left, or right view for the vehicle.</p>
              
              <div className="flex gap-2 mt-4 flex-wrap">
                {['left', 'front', 'right'].map(view => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setActiveExteriorView(view)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${activeExteriorView === view ? 'bg-velorix-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {view}
                  </button>
                ))}
              </div>

              <div className="relative aspect-[16/8] max-w-lg mx-auto overflow-hidden flex items-center justify-center my-6 rounded-2xl bg-gray-100">
                <img 
                  src={getExteriorViewUrl(vehicle, activeExteriorView)}
                  alt={`Vehicle exterior ${activeExteriorView} view`} 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Tabs details section */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="flex border-b border-gray-100 bg-gray-50 text-sm overflow-x-auto">
                {['overview', 'specifications', 'insurance', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-6 text-center capitalize transition-colors font-bold ${activeTab === tab ? 'text-velorix-red border-b-2 border-velorix-red bg-white' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-display font-bold text-velorix-dark text-lg mb-3">Vehicle Features</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {vehicle.features?.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center flex-shrink-0">
                              <Check size={12} />
                            </div>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="font-display font-bold text-velorix-dark text-lg mb-3">Pickup & Return Terms</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex gap-2">
                          <MapPin size={18} className="text-velorix-red flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-velorix-dark">Approved Terminals</p>
                            <p className="text-xs text-gray-500 mt-1">{vehicle.pickupLocations?.join(', ')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Clock size={18} className="text-velorix-red flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-velorix-dark">Cancellation Policy</p>
                            <p className="text-xs text-gray-500 mt-1">{vehicle.cancellationPolicy}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="font-display font-bold text-velorix-dark text-lg mb-3">Required Documents</h4>
                      <ul className="space-y-2">
                        {vehicle.documentsRequired?.map((d, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-velorix-red flex-shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* SPECIFICATIONS TAB */}
                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold block">Brand</span>
                      <span className="font-bold text-velorix-dark text-base mt-1 block">{vehicle.brand}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold block">Model</span>
                      <span className="font-bold text-velorix-dark text-base mt-1 block">{vehicle.name}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold block">Seats Count</span>
                      <span className="font-bold text-velorix-dark text-base mt-1 block">{vehicle.seats} Passengers</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold block">Transmission</span>
                      <span className="font-bold text-velorix-dark text-base mt-1 block">{vehicle.transmission}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold block">Fuel Engine</span>
                      <span className="font-bold text-velorix-dark text-base mt-1 block">{vehicle.fuel}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold block">Luggage capacity</span>
                      <span className="font-bold text-velorix-dark text-base mt-1 block">{vehicle.luggage} Suitcases</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold block">Min Rental Window</span>
                      <span className="font-bold text-velorix-dark text-base mt-1 block">{vehicle.minDuration} Day(s)</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold block">Max Rental Window</span>
                      <span className="font-bold text-velorix-dark text-base mt-1 block">{vehicle.maxDuration} Days</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold block">Free Included Travel</span>
                      <span className="font-bold text-velorix-dark text-base mt-1 block">{vehicle.includedKmPerDay} Km/day</span>
                    </div>
                  </div>
                )}

                {/* INSURANCE TAB */}
                {activeTab === 'insurance' && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <ShieldCheck size={28} className="text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-display font-bold text-velorix-dark text-lg">Comprehensive Protection</h4>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{vehicle.insuranceDetails}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4 flex gap-3 mt-4">
                      <Coins size={28} className="text-velorix-red mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-display font-bold text-velorix-dark text-lg">Security Deposit & Refund</h4>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                          A security deposit of <strong className="text-velorix-dark">₹{vehicle.securityDeposit}</strong> is held on checkout block authorize card. 
                          It is automatically released within 48 hours of vehicle return check.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {/* Add Review Panel */}
                    {user ? (
                      <form onSubmit={handleReviewSubmit} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                        <h4 className="font-display font-bold text-velorix-dark text-base mb-4">Write a Review</h4>
                        {reviewError && <p className="text-xs font-semibold text-velorix-red mb-3">{reviewError}</p>}
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm text-gray-600 font-semibold">Your Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="outline-none"
                              >
                                <Star 
                                  size={18} 
                                  className={star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="relative">
                          <textarea
                            required
                            rows="4"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your driving and booking experience..."
                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:border-velorix-dark outline-none transition-all"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitReviewLoading}
                          className="bg-velorix-dark hover:bg-velorix-red text-white text-xs font-semibold px-6 py-3 rounded-xl uppercase tracking-wider mt-4 transition-all duration-300 flex items-center gap-2"
                        >
                          {submitReviewLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                          Submit Review
                        </button>
                      </form>
                    ) : (
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                        <p className="text-sm text-gray-500">You must be logged in to leave reviews.</p>
                        <button 
                          onClick={() => setIsAuthOpen(true)}
                          className="text-xs font-bold uppercase tracking-wider text-velorix-red mt-2 hover:underline"
                        >
                          Sign In Now
                        </button>
                      </div>
                    )}

                    {/* Review List */}
                    <div className="space-y-4">
                      {reviews.length > 0 ? (
                        reviews.map((rev) => (
                          <div key={rev._id} className="border-b border-gray-100 pb-4 last:border-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-velorix-dark">{rev.user?.name || 'Anonymous User'}</span>
                              <span className="text-[10px] text-gray-400 font-semibold">{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-0.5 my-1.5">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={11} 
                                  className={i < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} 
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mt-1.5 italic">"{rev.comment}"</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-400 text-sm py-6">No customer reviews yet. Be the first!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Booking Checkout Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-premium sticky top-28">
              <h3 className="font-display font-bold text-lg text-velorix-dark border-b border-gray-100 pb-4 mb-6">Reservation Setup</h3>
              
              {/* Pickup & Drop Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="date"
                      value={startDate}
                      min={todayStr}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-xs outline-none focus:border-velorix-dark cursor-pointer"
                    />
                  </div>
                </div>

                {/* Pickup Time */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Pickup Time</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setTimePickerOpen(o => !o)}
                      className="w-full flex items-center gap-2 bg-velorix-light-bg border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-xs text-velorix-dark outline-none focus:border-velorix-dark cursor-pointer hover:border-velorix-dark transition-colors text-left"
                    >
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <span className={pickupTimeDisplay ? 'text-velorix-dark' : 'text-gray-400'}>{pickupTimeDisplay}</span>
                    </button>

                    {/* Time Picker Popover */}
                    {timePickerOpen && (
                      <div className="absolute z-50 top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
                        {/* Hour Row */}
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Hour</p>
                        <div className="grid grid-cols-6 gap-1 mb-3">
                          {['1','2','3','4','5','6','7','8','9','10','11','12'].map(h => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => setPickupHour(h)}
                              className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                pickupHour === h
                                  ? 'bg-velorix-dark text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {h}
                            </button>
                          ))}
                        </div>

                        {/* Minute Row */}
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Minute</p>
                        <div className="grid grid-cols-6 gap-1 mb-3">
                          {['00','05','10','15','20','25','30','35','40','45','50','55'].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setPickupMinute(m)}
                              className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                pickupMinute === m
                                  ? 'bg-velorix-dark text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>

                        {/* AM / PM Toggle */}
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Period</p>
                        <div className="flex gap-2 mb-4">
                          {['AM', 'PM'].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPickupPeriod(p)}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-wider transition-colors ${
                                pickupPeriod === p
                                  ? 'bg-velorix-red text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>

                        {/* Confirm */}
                        <button
                          type="button"
                          onClick={() => setTimePickerOpen(false)}
                          className="w-full bg-velorix-dark text-white text-xs font-bold py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                        >
                          Confirm — {pickupTimeDisplay}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="date"
                      value={endDate}
                      min={minReturnDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-xs outline-none focus:border-velorix-dark cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Chauffeur Addon */}
              {vehicle.driverChargesPerDay > 0 && (
                <div className="mb-6 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-velorix-dark">Include Professional Driver</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">₹{vehicle.driverChargesPerDay}/day driver allowance</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={driverOption}
                    onChange={(e) => setDriverOption(e.target.checked)}
                    className="accent-velorix-red w-4 h-4 cursor-pointer"
                  />
                </div>
              )}

              {/* Extras Services */}
              <div className="mb-6">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Extra Services</label>
                <div className="space-y-2">
                  {extraServices.map((service, idx) => (
                    <label key={idx} className="flex items-center justify-between text-xs text-gray-600 hover:text-velorix-dark cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          checked={service.checked}
                          onChange={() => handleServiceToggle(idx)}
                          className="accent-velorix-red w-3.5 h-3.5"
                        />
                        <span>{service.name}</span>
                      </div>
                      <span className="font-semibold text-velorix-dark">+₹{service.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown summary */}
              {days > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-6 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Base Fare ({days} days)</span>
                    <span className="font-bold text-velorix-dark">₹{basePrice}</span>
                  </div>
                  {driverOption && (
                    <div className="flex justify-between">
                      <span>Driver Allowance</span>
                      <span className="font-bold text-velorix-dark">₹{driverCost}</span>
                    </div>
                  )}
                  {extrasCost > 0 && (
                    <div className="flex justify-between">
                      <span>Add-ons Total</span>
                      <span className="font-bold text-velorix-dark">₹{extrasCost}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Refundable Deposit</span>
                    <span className="font-bold text-velorix-dark">₹{vehicle.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Tax (18%)</span>
                    <span className="font-bold text-velorix-dark">₹{tax}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 text-sm text-velorix-dark font-black">
                    <span>Total Amount</span>
                    <span className="text-velorix-red">₹{totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {vehicle.availability === false ? (
                <button 
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-none cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              ) : (
                <button 
                  onClick={handleBookNow}
                  className="w-full bg-velorix-red hover:bg-velorix-red-hover text-white py-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition-all"
                >
                  {startDate && endDate ? `Reserve for ${days} Day(s)` : 'Select Dates to Book'}
                </button>
              )}

              <div className="mt-4 flex gap-2 justify-center items-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                <Shield size={12} className="text-green-600" />
                <span>Velorix Safety Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Auth Modal Dialog */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default VehicleDetails;
