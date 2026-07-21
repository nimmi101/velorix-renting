import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    id: 'rent-car',
    title: 'Rent a Car',
    subtitle: 'Self-drive & chauffeur-driven luxury sedans and SUVs',
    link: '/fleet?category=Luxury,SUV,Sedan',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=80',
    accent: '#D32F2F'
  },
  {
    id: 'group-travel',
    title: 'Group Travel',
    subtitle: 'Tempo travellers, mini buses and luxury coaches for groups',
    link: '/fleet?category=Tempo Traveller,Mini Bus,Luxury Coach,Tourist Bus',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=80',
    accent: '#1A1A1A'
  },
  {
    id: 'tour-packages',
    title: 'Tour Packages',
    subtitle: 'Curated hill station, beach & pilgrimage itineraries',
    link: '/packages',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
    accent: '#D32F2F'
  },
  {
    id: 'airport-transfers',
    title: 'Airport & Events',
    subtitle: 'Premium transfers, wedding rentals and corporate rides',
    link: '/fleet?type=With Driver',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
    accent: '#1A1A1A'
  }
];

const CategoryCard = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={category.link}
        className="group relative block overflow-hidden rounded-3xl aspect-[3/4] md:aspect-auto md:h-[480px] shadow-premium hover:shadow-premium-hover transition-shadow duration-500"
      >
        {/* Image with zoom on hover */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </div>

        {/* Multi-layer Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Red accent line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
          style={{ backgroundColor: category.accent }}
        />

        {/* Text Content */}
        <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Velorix
          </p>
          <h3 className="font-display text-2xl font-bold text-white leading-tight mb-2">
            {category.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-xs">
            {category.subtitle}
          </p>

          {/* Arrow badge */}
          <div className="mt-5 flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
              style={{ backgroundColor: category.accent }}
            >
              <ArrowUpRight size={18} />
            </div>
            <span className="text-white text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
              Explore
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const CategoryCards = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 md:py-32 px-6 md:px-14 bg-velorix-light">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={ref} className="mb-14 max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-3"
          >
            How Can We Help
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-velorix-dark leading-tight"
          >
            Choose Your
            <span className="text-velorix-red"> Experience</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-gray-500 leading-relaxed text-base"
          >
            Every journey is unique. Select the rental type that matches your trip — from solo luxury escapes to large group adventures.
          </motion.p>
        </div>

        {/* 4-column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
