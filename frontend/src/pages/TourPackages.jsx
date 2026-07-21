import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { 
  MapPin, 
  Calendar, 
  Car, 
  ArrowUpRight, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Clock, 
  DollarSign,
  Loader2,
  Info,
  ArrowRight
} from 'lucide-react';
import PageSEO from '../components/PageSEO';

const TourPackages = ({ isSection = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPackageId, setExpandedPackageId] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('type') || 'All');

  const categories = ['All', 'Hill Station', 'Beach', 'Pilgrimage', 'Adventure', 'Family', 'Corporate', 'Wedding'];

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        let url = 'http://127.0.0.1:5000/api/packages';
        if (!isSection && activeCategory !== 'All') {
          url += `?type=${activeCategory}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok && data.status === 'success') {
          setPackages(data.data);
        }
      } catch (err) {
        console.error('Failed fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [activeCategory, isSection]);

  const toggleItinerary = (id) => {
    setExpandedPackageId(expandedPackageId === id ? null : id);
  };

  const handleBookPackage = (pkg) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    // Save package context so the booking page can show it as a reference
    const packageContext = {
      packageId: pkg._id,
      packageName: pkg.name,
      packageDuration: pkg.duration,
      packagePrice: pkg.basePrice,
      bookingType: 'Tour Package'
    };
    localStorage.setItem('velorix_package_context', JSON.stringify(packageContext));

    // Redirect to Fleet page, pre-filtered by the recommended vehicle category
    const category = pkg.recommendedVehicleCategory || '';
    navigate(`/fleet${category ? `?category=${encodeURIComponent(category)}` : ''}`);
  };

  // Section mode: show 4 packages in a card grid
  if (isSection) {
    const sectionPackages = packages.slice(0, 4);

    return (
      <div className="py-20 bg-velorix-light">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto pb-14 px-6">
          <span className="text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-3 inline-flex items-center gap-3">
            <span className="w-6 h-[1px] bg-velorix-red"></span>
            Tour Packages
            <span className="w-6 h-[1px] bg-velorix-red"></span>
          </span>
          <h2 className="text-4xl md:text-5xl font-black font-display text-velorix-dark leading-tight">
            Curated Journeys, Unforgettable{' '}
            <span className="text-velorix-red">Destinations.</span>
          </h2>
          <p className="text-gray-500 text-sm mt-4 leading-relaxed max-w-2xl mx-auto">
            Handpicked tour packages with expert drivers, comfortable vehicles, and hassle-free itineraries — so you can focus on the experience.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-3xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : sectionPackages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sectionPackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="group relative overflow-hidden rounded-3xl aspect-[3/4] shadow-premium hover:shadow-premium-hover border border-gray-100 transition-all duration-500 flex flex-col justify-end cursor-pointer"
                  onClick={() => handleBookPackage(pkg)}
                >
                  {/* Background Image */}
                  <img
                    src={pkg.images[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80'}
                    alt={pkg.name}
                    className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Clock size={10} />
                      {pkg.duration}
                    </div>
                    <div className="bg-velorix-red text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {pkg.type}
                    </div>
                  </div>

                  {/* Overlaid Info */}
                  <div className="relative z-10 p-5 flex flex-col gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-velorix-red text-[10px] font-semibold uppercase tracking-wide mb-1">
                        <MapPin size={10} />
                        {pkg.destination}
                      </div>
                      <h3 className="font-display text-xl font-black text-white leading-snug">
                        {pkg.name}
                      </h3>
                    </div>

                    {/* Highlights (first 2 features from description) */}
                    <div className="space-y-1.5">
                      {pkg.itinerary?.slice(0, 2).map((day, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-white/90">
                          <span className="w-1.5 h-1.5 rounded-full bg-velorix-red flex-shrink-0 mt-1" />
                          <span className="leading-snug line-clamp-1">{day.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-1 border-t border-white/10 pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Starting From</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBookPackage(pkg); }}
                        className="bg-velorix-red hover:bg-velorix-red-hover text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1"
                      >
                        Book Now
                        <ArrowUpRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Info size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No tour packages available right now.</p>
            </div>
          )}

          {/* View All Button */}
          <div className="flex justify-center mt-12">
            <Link
              to="/packages"
              className="inline-flex items-center gap-3 bg-velorix-dark hover:bg-velorix-red text-white font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-2xl"
            >
              View All Packages
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    );
  }

  // Full page mode: full list with category filters and expanded itinerary
  return (
    <div className="bg-velorix-light-bg min-h-screen pb-24">
      <PageSEO 
        title="Premium Tour Packages" 
        description="Browse our handpicked tour packages. Enjoy complete sightseeing itineraries with recommended luxury rides & certified drivers." 
      />

      {/* Header Banner */}
      <div className="bg-velorix-dark py-16 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-velorix-red/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-velorix-red/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-velorix-red text-xs font-bold uppercase tracking-[0.2em] mb-2 inline-block">Curated Journeys</span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white">Premium Tour Packages</h1>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Unforgettable itineraries combining luxurious transportation, verified professional drivers, and stunning destinations.
          </p>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-velorix-red text-white' : 'bg-white border border-gray-100 text-gray-500 hover:text-velorix-dark hover:border-gray-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Package List Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-64 border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : packages.length > 0 ? (
          <div className="space-y-8">
            {packages.map((pkg) => {
              const isExpanded = expandedPackageId === pkg._id;
              return (
                <div 
                  key={pkg._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden transition-all duration-300"
                >
                  {/* Package Core Card */}
                  <div className="flex flex-col lg:flex-row">
                    {/* Left: Image */}
                    <div className="relative w-full lg:w-[360px] aspect-[16/10] flex-shrink-0 bg-gray-50">
                      <img 
                        src={pkg.images[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'} 
                        alt={pkg.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-velorix-dark text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {pkg.type}
                      </div>
                    </div>

                    {/* Right: Info details */}
                    <div className="p-5 md:p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 text-velorix-red text-xs font-semibold">
                              <MapPin size={12} />
                              <span>{pkg.destination}</span>
                            </div>
                            <h2 className="font-display text-2xl font-black text-velorix-dark mt-1">
                              {pkg.name}
                            </h2>
                          </div>
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Package Price</span>
                            <p className="text-2xl font-black font-display text-velorix-dark mt-0.5">
                              ₹{pkg.basePrice}
                              <span className="text-gray-400 text-xs font-medium">/trip</span>
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-3xl">
                          {pkg.description}
                        </p>

                        {/* Badges/Specs */}
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold text-velorix-dark">
                            <Clock size={14} className="text-velorix-red" />
                            <span>Duration: {pkg.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold text-velorix-dark">
                            <Car size={14} className="text-velorix-red" />
                            <span>Recommended: {pkg.recommendedVehicleCategory}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 pt-4 mt-5">
                        <button
                          onClick={() => toggleItinerary(pkg._id)}
                          className="text-xs font-bold uppercase tracking-wider text-velorix-dark hover:text-velorix-red transition-colors flex items-center gap-1.5"
                        >
                          {isExpanded ? 'Hide Itinerary Details' : 'View Itinerary & Terms'}
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        
                        <button
                          onClick={() => handleBookPackage(pkg)}
                          className="bg-velorix-dark hover:bg-velorix-red text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 group"
                        >
                          Book Tour
                          <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Itinerary & Inclusions Panel */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 md:p-8 bg-gray-50 grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Itinerary */}
                      <div>
                        <h4 className="font-display font-bold text-velorix-dark text-base mb-4 flex items-center gap-2">
                          <Compass size={18} className="text-velorix-red" />
                          Day-by-Day Itinerary
                        </h4>
                        <div className="space-y-6 relative border-l border-gray-200 ml-3 pl-6">
                          {pkg.itinerary?.map((day) => (
                            <div key={day.day} className="relative">
                              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-velorix-red border-4 border-white shadow-sm" />
                              <h5 className="font-bold text-sm text-velorix-dark">
                                Day {day.day}: {day.title}
                              </h5>
                              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                                {day.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Inclusions & Exclusions */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-display font-bold text-velorix-dark text-base mb-4 flex items-center gap-2">
                            <Check size={18} className="text-velorix-red" />
                            Package Inclusions
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                            {pkg.inclusions?.map((inc, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-velorix-red rounded-full flex-shrink-0" />
                                <span>{inc}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                          <h4 className="font-display font-bold text-velorix-dark text-base mb-4 flex items-center gap-2">
                            <X size={18} className="text-velorix-red" />
                            Package Exclusions
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                            {pkg.exclusions?.map((exc, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-velorix-dark rounded-full flex-shrink-0" />
                                <span>{exc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center shadow-sm">
            <Info size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-velorix-dark">No Tour Packages Available</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
              We currently don't have packages listed under this category. Please check again later or look under other options.
            </p>
          </div>
        )}
      </div>

      {/* Global Auth Modal Dialog */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default TourPackages;
