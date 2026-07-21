import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';

const destinations = [
  {
    name: 'Manali',
    state: 'Himachal Pradesh',
    description: 'Snow-capped peaks and adventure sports',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80',
    link: '/packages?destination=Manali',
    vehicleType: 'SUV'
  },
  {
    name: 'Goa',
    state: 'Coastal India',
    description: 'Beaches, forts and vibrant nightlife',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80',
    link: '/packages?destination=Goa',
    vehicleType: 'Luxury'
  },
  {
    name: 'Shimla',
    state: 'Himachal Pradesh',
    description: 'Colonial charm and misty mountain views',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=700&q=80',
    link: '/fleet?category=SUV',
    vehicleType: 'SUV'
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    description: 'Royal palaces and vibrant pink culture',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=700&q=80',
    link: '/packages?destination=Jaipur',
    vehicleType: 'Sedan'
  },
  {
    name: 'Kerala',
    state: 'God\'s Own Country',
    description: 'Backwaters, houseboats and tea gardens',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=700&q=80',
    link: '/packages?destination=Kerala',
    vehicleType: 'Tempo Traveller'
  },
  {
    name: 'Ladakh',
    state: 'Union Territory',
    description: 'High-altitude monasteries and stark beauty',
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=700&q=80',
    link: '/fleet?category=SUV',
    vehicleType: 'SUV'
  }
];

const DestinationCard = ({ dest, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={dest.link}
        className="group relative block overflow-hidden rounded-3xl aspect-[4/5] shadow-premium hover:shadow-premium-hover transition-all duration-500"
      >
        {/* Image */}
        <img
          src={dest.image}
          alt={dest.name}
          className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Recommended vehicle badge */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
          {dest.vehicleType}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 inset-x-0 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <MapPin size={12} className="text-velorix-red" />
                <span className="text-gray-300 text-xs font-medium">{dest.state}</span>
              </div>
              <h3 className="font-display text-2xl font-black text-white">{dest.name}</h3>
              <p className="text-gray-400 text-xs mt-1.5 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                {dest.description}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-velorix-red flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0 flex-shrink-0">
              <ArrowUpRight size={16} className="text-white" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const PopularDestinations = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 md:py-32 px-6 md:px-14 bg-velorix-light-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={ref} className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-3"
            >
              Explore India
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black font-display text-velorix-dark leading-tight"
            >
              Popular
              <span className="text-velorix-red"> Destinations</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 text-velorix-dark font-semibold text-sm border border-velorix-dark/20 hover:border-velorix-red hover:text-velorix-red px-5 py-2.5 rounded-full transition-all duration-300"
            >
              View All Packages
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Destination Grid — masonry-like with varying heights */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-auto">
          {/* First row: 3 tall cards */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <DestinationCard dest={destinations[0]} index={0} />
          </div>
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <DestinationCard dest={destinations[1]} index={1} />
          </div>
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <DestinationCard dest={destinations[2]} index={2} />
          </div>

          {/* Second row: remaining 3 cards */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <DestinationCard dest={destinations[3]} index={3} />
          </div>
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <DestinationCard dest={destinations[4]} index={4} />
          </div>
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <DestinationCard dest={destinations[5]} index={5} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
