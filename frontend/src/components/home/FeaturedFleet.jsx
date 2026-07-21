import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Star, Users, Fuel, Zap, ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 border border-gray-50 h-full flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.images[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=700&q=80'}
          alt={`${vehicle.brand} ${vehicle.name}`}
          className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-velorix-dark text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
          {vehicle.category}
        </div>

        {/* Rating badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-velorix-dark text-xs font-bold px-2.5 py-1.5 rounded-full shadow-sm">
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          {vehicle.ratings}
        </div>

        {/* Driver option badge */}
        <div className="absolute bottom-4 left-4 bg-velorix-red text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
          {vehicle.type === 'Self Drive' ? 'Self Drive' : vehicle.type === 'With Driver' ? 'With Driver' : 'Self Drive / Driver'}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex-1">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{vehicle.brand}</p>
          <h3 className="font-display text-xl font-bold text-velorix-dark mt-1">{vehicle.name}</h3>

          {/* Specs Row */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
              <Users size={14} className="text-gray-400" />
              {vehicle.seats} Seats
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
              <Fuel size={14} className="text-gray-400" />
              {vehicle.fuel}
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
              <Zap size={14} className="text-gray-400" />
              {vehicle.transmission}
            </div>
          </div>

          {/* Features tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {vehicle.features?.slice(0, 3).map((f, i) => (
              <span key={i} className="bg-gray-50 border border-gray-100 text-gray-500 text-[10px] font-medium px-2.5 py-1 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-50">
          <div>
            <p className="text-gray-400 text-xs">Starting from</p>
            <p className="text-velorix-dark font-black text-xl font-display">
              ₹{vehicle.pricePerDay}<span className="text-gray-400 text-sm font-medium">/day</span>
            </p>
          </div>
          <Link
            to={`/fleet/${vehicle._id}`}
            className="bg-velorix-dark hover:bg-velorix-red text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 group"
          >
            View
            <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeaturedFleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/vehicles?availability=true&sort=ratingDesc');
        const data = await res.json();
        if (data.status === 'success') {
          setVehicles(data.data.slice(0, 8)); // Top 8 vehicles
        }
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-velorix-light overflow-hidden">
      <div className="px-6 md:px-14 max-w-7xl mx-auto">

        {/* Header */}
        <div ref={ref} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-3"
            >
              Our Fleet
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black font-display text-velorix-dark leading-tight"
            >
              Featured
              <span className="text-velorix-red"> Vehicles</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 text-gray-500 leading-relaxed"
            >
              Handpicked luxury vehicles rated highest by our clients.
            </motion.p>
          </div>

          {/* Custom Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <button ref={prevRef} className="w-11 h-11 rounded-full border border-gray-200 hover:border-velorix-dark flex items-center justify-center text-gray-500 hover:text-velorix-dark transition-all duration-300 hover:bg-gray-50">
              <ArrowLeft size={18} />
            </button>
            <button ref={nextRef} className="w-11 h-11 rounded-full border border-gray-200 hover:border-velorix-dark flex items-center justify-center text-gray-500 hover:text-velorix-dark transition-all duration-300 hover:bg-gray-50">
              <ArrowRight size={18} />
            </button>
            <Link
              to="/fleet"
              className="ml-2 inline-flex items-center gap-2 text-velorix-dark font-semibold text-sm border border-velorix-dark/20 hover:border-velorix-red hover:text-velorix-red px-5 py-2.5 rounded-full transition-all duration-300"
            >
              Browse All
            </Link>
          </motion.div>
        </div>

        {/* Swiper Carousel */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-3xl aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onSwiper={(swiper) => {
              setTimeout(() => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
              });
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 3 }
            }}
            className="!pb-4"
          >
            {vehicles.map((vehicle) => (
              <SwiperSlide key={vehicle._id} className="h-auto">
                <VehicleCard vehicle={vehicle} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-gray-400 text-center py-20">No vehicles found</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedFleet;
