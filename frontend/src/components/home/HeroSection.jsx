import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';
import SearchBar from '../SearchBar';

const HeroSection = () => {
  const heroRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  // Parallax transforms
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const textContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const textItem = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section ref={heroRef} className="relative w-full h-screen min-h-[700px] overflow-hidden flex flex-col justify-end">

      {/* Parallax Background Video */}
      <motion.div
        style={{ y: imgY }}
        className="absolute inset-0 scale-110 will-change-transform"
      >
        {!isVideoReady && (
          <div className="absolute inset-0 bg-[#0b0b0b]" />
        )}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="https://res.cloudinary.com/cyyulamp/video/upload/v1783690730/herocar_bjzgye.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Multi-layer Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </motion.div>



      {/* Main Hero Text Block */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 px-6 md:px-14 pb-10 max-w-7xl w-full mx-auto"
      >
        <motion.div
          variants={textContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div variants={textItem}>
            <span className="inline-block text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-4">
              Premium Vehicle Rentals
            </span>
          </motion.div>

          <motion.h1
            variants={textItem}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display text-white leading-[1.05] tracking-tight"
          >
            Drive in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              Pure Luxury
            </span>
          </motion.h1>

          <motion.p
            variants={textItem}
            className="mt-5 text-base md:text-lg text-gray-300 leading-relaxed max-w-xl"
          >
            Rent premium sedans, SUVs, luxury coaches & more. From airport transfers to group pilgrimages — curated vehicles, transparent pricing.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={textItem} className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/fleet"
              className="bg-velorix-red hover:bg-velorix-red-hover text-white font-bold px-8 py-4 rounded-full uppercase tracking-wider text-sm transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-2xl"
            >
              Explore Fleet
            </Link>
            <Link
              to="/packages"
              className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full uppercase tracking-wider text-sm transition-all duration-300"
            >
              Tour Packages
            </Link>
          </motion.div>


        </motion.div>
      </motion.div>

      {/* Booking Strip — flush bottom of hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20"
      >
        <SearchBar />
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 right-8 md:right-14 flex flex-col items-center gap-1.5 text-white/50"
      >
        <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
