import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Fuel, 
  Zap, 
  SlidersHorizontal, 
  Search, 
  X, 
  ChevronDown, 
  Grid, 
  List, 
  Star, 
  ArrowUpDown, 
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import PageSEO from '../components/PageSEO';

const CustomSelect = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find(opt => typeof opt === 'object' ? opt.value === value : opt === value);
  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-black/40 border border-velorix-dark-border rounded-xl py-2.5 px-3.5 text-xs text-white outline-none cursor-pointer hover:border-white/20 focus:border-velorix-red transition-all duration-200 text-left"
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-40 left-0 right-0 mt-2 bg-velorix-dark-card border border-velorix-dark-border rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors duration-150 ${
                !value 
                  ? 'bg-velorix-red text-white font-bold' 
                  : 'text-gray-400 hover:bg-[#1c1c1c] hover:text-white'
              }`}
            >
              {placeholder}
            </button>

            {options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              const isSelected = val === value;

              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors duration-150 ${
                    isSelected 
                      ? 'bg-velorix-red text-white font-bold' 
                      : 'text-white hover:bg-[#1c1c1c]'
                  }`}
                >
                  {lbl}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Fleet = ({ isSection = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Filters State synced from URL params initially
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? searchParams.get('category').split(',') : []
  );
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedSeats, setSelectedSeats] = useState(searchParams.get('seats') || '');
  const [selectedTransmission, setSelectedTransmission] = useState(searchParams.get('transmission') || '');
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get('fuel') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');

  // Static options
  const categories = ['Luxury', 'SUV', 'Sedan', 'Hatchback', 'Tempo Traveller', 'Mini Bus', 'Luxury Coach', 'Tourist Bus'];
  const transmissions = ['Automatic', 'Manual'];
  const fuels = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];
  const seatsOptions = [
    { label: '4 - 5 Seats', value: '5' },
    { label: '7 Seats', value: '7' },
    { label: '12 - 15 Seats', value: '12+' },
    { label: '35+ Seats', value: '35+' }
  ];
  const rentalTypes = [
    { label: 'Self Drive', value: 'Self Drive' },
    { label: 'Chauffeur Driven', value: 'With Driver' }
  ];

  // Fetch vehicles with active filters
  useEffect(() => {
    const fetchFilteredVehicles = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('availability', 'true');
        if (search) queryParams.append('search', search);
        if (selectedCategories.length > 0) queryParams.append('category', selectedCategories.join(','));
        if (selectedType) queryParams.append('type', selectedType);
        if (selectedSeats) queryParams.append('seats', selectedSeats);
        if (selectedTransmission) queryParams.append('transmission', selectedTransmission);
        if (selectedFuel) queryParams.append('fuel', selectedFuel);
        if (sortBy) queryParams.append('sort', sortBy);

        const res = await fetch(`${API_BASE_URL}/api/vehicles?${queryParams.toString()}`);
        const data = await res.json();
        
        if (data.status === 'success') {
          setVehicles(data.data);
        }
      } catch (err) {
        console.error('Failed to load fleet:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredVehicles();
  }, [
    search, 
    selectedCategories, 
    selectedType, 
    selectedSeats, 
    selectedTransmission, 
    selectedFuel, 
    sortBy, 
    searchParams
  ]);

  // Sync state with URL search params changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategories(searchParams.get('category') ? searchParams.get('category').split(',') : []);
    setSelectedType(searchParams.get('type') || '');
    setSelectedSeats(searchParams.get('seats') || '');
    setSelectedTransmission(searchParams.get('transmission') || '');
    setSelectedFuel(searchParams.get('fuel') || '');
    setSortBy(searchParams.get('sort') || '');
  }, [searchParams]);

  // Handle Category check/uncheck
  const handleCategoryChange = (cat) => {
    let updated;
    if (selectedCategories.includes(cat)) {
      updated = selectedCategories.filter(c => c !== cat);
    } else {
      updated = [...selectedCategories, cat];
    }
    setSelectedCategories(updated);
    updateURL('category', updated.join(','));
  };

  // Generic URL parameter update
  const updateURL = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedType('');
    setSelectedSeats('');
    setSelectedTransmission('');
    setSelectedFuel('');
    setSortBy('');
    setSearchParams({});
  };

  return (
    <div className={isSection ? 'py-16 bg-black text-white' : 'bg-black min-h-screen pb-24 text-white'}>
      {!isSection && (
        <PageSEO 
          title="Luxury Fleet Catalog" 
          description="Filter and book our luxury self-drive cars, chauffered premium sedans, 4x4 SUVs, tempo travellers, and coaches." 
        />
      )}
      
      {/* Centered Heading with Red/White theme */}
      <div className="text-center max-w-3xl mx-auto pt-16 pb-12 px-6">
        <span className="text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-3 inline-flex items-center gap-3">
          <span className="w-6 h-[1px] bg-velorix-red"></span>
          OUR DIVERSE FLEET
          <span className="w-6 h-[1px] bg-velorix-red"></span>
        </span>
        <h1 className="text-4xl md:text-5xl font-black font-display text-white leading-tight">
          Diverse Fleet for Comfort & <span className="text-velorix-red">Performance.</span>
        </h1>
        <p className="text-gray-400 text-sm mt-4 leading-relaxed max-w-2xl mx-auto">
          From sleek self-drive sedans and rugged family SUVs to spacious tempo travellers and luxury tourist coaches for group getaways.
        </p>
      </div>

      {/* Main Content Layout Wrapper (covers laptop width) */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-8 w-full">
          
          {/* HORIZONTAL FILTERS ABOVE CARDS (Desktop Only) */}
          <div className="hidden lg:block bg-velorix-dark-card border border-velorix-dark-border rounded-3xl p-6 shadow-premium w-full text-white">
            <div className="flex flex-col gap-6">
              {/* Main filter fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                {/* Keyword Search */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Search Vehicle</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text"
                      placeholder="e.g. BMW, SUV..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); updateURL('search', e.target.value); }}
                      className="w-full bg-black/40 border border-velorix-dark-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:border-velorix-red outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <CustomSelect
                  label="Category"
                  options={categories}
                  value={selectedCategories.join(',')}
                  onChange={(val) => {
                    const arr = val ? val.split(',') : [];
                    setSelectedCategories(arr);
                    updateURL('category', val);
                  }}
                  placeholder="All Categories"
                />

                {/* Seats Capacity */}
                <CustomSelect
                  label="Seats Capacity"
                  options={seatsOptions}
                  value={selectedSeats}
                  onChange={(val) => {
                    setSelectedSeats(val);
                    updateURL('seats', val);
                  }}
                  placeholder="Any Capacity"
                />

                {/* Fuel Type */}
                <CustomSelect
                  label="Fuel Type"
                  options={fuels}
                  value={selectedFuel}
                  onChange={(val) => {
                    setSelectedFuel(val);
                    updateURL('fuel', val);
                  }}
                  placeholder="Any Fuel"
                />

                {/* Transmission */}
                <CustomSelect
                  label="Transmission"
                  options={transmissions}
                  value={selectedTransmission}
                  onChange={(val) => {
                    setSelectedTransmission(val);
                    updateURL('transmission', val);
                  }}
                  placeholder="Any Transmission"
                />

                {/* Rental Option */}
                <CustomSelect
                  label="Rental Option"
                  options={rentalTypes}
                  value={selectedType}
                  onChange={(val) => {
                    setSelectedType(val);
                    updateURL('type', val);
                  }}
                  placeholder="Any Option"
                />
              </div>

              {/* Slider & Clear filter row */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-velorix-dark-border pt-4">
                <button 
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-velorix-red hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <X size={14} />
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* MAIN FLEET CONTENT SECTION */}
          <main className="flex-1 w-full">
            {/* Top Toolbar */}
            <div className="bg-velorix-dark-card rounded-2xl p-4 border border-velorix-dark-border flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <p className="text-gray-400 text-sm font-medium">
                Showing <span className="text-white font-semibold">{vehicles.length}</span> premium vehicles available
              </p>
              
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 bg-velorix-dark-muted border border-velorix-dark-border text-white px-4 py-2 rounded-xl text-sm font-bold"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>

                {/* Sort Option */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); updateURL('sort', e.target.value); }}
                    className="bg-transparent border-0 text-sm font-semibold text-white outline-none cursor-pointer focus:text-white"
                  >
                    <option className="bg-[#121212]" value="">Sort By: Newest</option>
                    <option className="bg-[#121212]" value="priceAsc">Price: Low to High</option>
                    <option className="bg-[#121212]" value="priceDesc">Price: High to Low</option>
                    <option className="bg-[#121212]" value="ratingDesc">Ratings: Highest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* VEHICLES RESULTS GRID */}
            {loading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-velorix-dark-card rounded-3xl aspect-[3/4] border border-velorix-dark-border animate-pulse p-6 flex flex-col justify-between">
                    <div className="w-full h-40 bg-velorix-dark-muted rounded-2xl" />
                    <div className="w-2/3 h-5 bg-velorix-dark-muted rounded mt-4" />
                    <div className="w-1/2 h-4 bg-velorix-dark-muted rounded mt-2" />
                    <div className="w-full h-10 bg-velorix-dark-muted rounded-xl mt-6" />
                  </div>
                ))}
              </div>
            ) : vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {vehicles.map((vehicle) => (
                  <motion.div
                    key={vehicle._id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="relative group overflow-hidden rounded-[32px] aspect-[3/4] shadow-premium hover:shadow-premium-hover border border-velorix-dark-border transition-all duration-500 h-full flex flex-col justify-end"
                  >
                    {/* Card Background Image */}
                    <img 
                      src={vehicle.images[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=700&q=80'} 
                      alt={`${vehicle.brand} ${vehicle.name}`}
                      className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                        {vehicle.seats} Seats
                      </div>
                      <div className="bg-velorix-red text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                        {vehicle.category}
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm shadow-sm flex items-center gap-1 text-[11px] font-bold text-white px-2.5 py-1.5 rounded-full">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      {vehicle.ratings}
                    </div>

                    {/* Overlaid Card Info Details */}
                    <div className="relative z-10 p-6 flex flex-col justify-end w-full">
                      <div>
                        <p className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">{vehicle.brand}</p>
                        <h3 className="font-display text-2xl font-black text-white mt-0.5">{vehicle.name}</h3>
                        
                        {vehicle.features && vehicle.features.length > 0 && (
                          <p className="text-gray-400 text-[11px] font-medium mt-1 uppercase tracking-wide">
                            {vehicle.features.slice(0, 2).join(' • ')}
                          </p>
                        )}
                      </div>

                      {/* Bullet Features list (red and white) */}
                      <div className="space-y-1.5 my-4">
                        {vehicle.ac && (
                          <div className="flex items-center gap-2 text-xs text-white/95">
                            <span className="w-1.5 h-1.5 rounded-full bg-velorix-red flex-shrink-0" />
                            <span>Air Conditioned</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-white/95">
                          <span className="w-1.5 h-1.5 rounded-full bg-velorix-red flex-shrink-0" />
                          <span>{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/95">
                          <span className="w-1.5 h-1.5 rounded-full bg-velorix-red flex-shrink-0" />
                          <span>{vehicle.fuel} Fuel</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-2">
                        <Link 
                          to={`/fleet/${vehicle._id}`}
                          className="w-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white text-xs font-bold uppercase tracking-wider py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 group-hover:bg-white group-hover:text-black group-hover:border-white"
                        >
                          Book Now &rarr;
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* No Results state */
              <div className="bg-velorix-dark-card rounded-3xl p-12 border border-velorix-dark-border text-center shadow-sm">
                <Search size={48} className="text-gray-500 mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-white">No Vehicles Found</h3>
                <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                  We couldn't find any vehicles matching your criteria. Try adjusting your filters or clearing them to browse all options.
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-velorix-red text-white text-xs font-semibold px-6 py-3 rounded-full uppercase tracking-wider mt-6 hover:bg-velorix-red-hover transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE DRAWER FILTERS PANEL */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/70 z-50 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-velorix-dark-card border-r border-velorix-dark-border z-50 p-6 overflow-y-auto flex flex-col shadow-2xl lg:hidden text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-velorix-dark-border mb-6">
                <span className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  Filters
                </span>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Duplicate Filters for Mobile Scroll */}
              <div className="flex-grow space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Search Vehicle</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text"
                      placeholder="e.g. BMW, SUV..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); updateURL('search', e.target.value); }}
                      className="w-full bg-black/40 border border-velorix-dark-border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none text-white focus:border-velorix-red"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Category</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                          className="accent-velorix-red w-4 h-4"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rental Option */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Rental Option</label>
                  <div className="flex gap-2">
                    {rentalTypes.map(t => (
                      <button
                        key={t.value}
                        onClick={() => {
                          const val = selectedType === t.value ? '' : t.value;
                          setSelectedType(val);
                          updateURL('type', val);
                        }}
                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${selectedType === t.value ? 'bg-velorix-red border-velorix-red text-white' : 'bg-transparent border-velorix-dark-border text-gray-400 hover:text-white'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Seats Capacity</label>
                  <div className="space-y-2">
                    {seatsOptions.map(opt => (
                      <label key={opt.value} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer">
                        <input 
                          type="radio"
                          name="mobile-seats"
                          checked={selectedSeats === opt.value}
                          onChange={() => {
                            setSelectedSeats(opt.value);
                            updateURL('seats', opt.value);
                          }}
                          className="accent-velorix-red w-4 h-4"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Transmission</label>
                  <div className="flex gap-2">
                    {transmissions.map(t => (
                      <button
                        key={t}
                        onClick={() => {
                          const val = selectedTransmission === t ? '' : t;
                          setSelectedTransmission(val);
                          updateURL('transmission', val);
                        }}
                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${selectedTransmission === t ? 'bg-velorix-red border-velorix-red text-white' : 'bg-transparent border-velorix-dark-border text-gray-400 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Fuel Type</label>
                  <select
                    value={selectedFuel}
                    onChange={(e) => { setSelectedFuel(e.target.value); updateURL('fuel', e.target.value); }}
                    className="w-full bg-black/40 border border-velorix-dark-border rounded-xl py-2.5 px-3 text-sm outline-none text-white focus:border-velorix-red"
                  >
                    <option className="bg-[#121212]" value="">Any Fuel Type</option>
                    {fuels.map(f => (
                      <option className="bg-[#121212]" key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 text-sm font-bold uppercase tracking-wider text-velorix-red bg-velorix-red/10 hover:bg-velorix-red/20 rounded-xl transition-all"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 text-sm font-bold uppercase tracking-wider text-white bg-velorix-red hover:bg-velorix-red-hover rounded-xl transition-all"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Fleet;
