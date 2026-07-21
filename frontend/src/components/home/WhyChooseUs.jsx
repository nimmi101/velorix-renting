import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, UserCheck, Clock, CreditCard, MapPin, Star, Headphones, Navigation } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Verified Fleet', description: 'Every vehicle undergoes rigorous safety inspection and maintenance before each rental.' },
  { icon: UserCheck, title: 'Professional Drivers', description: 'All drivers are background-verified, licensed and trained in premium client hospitality.' },
  { icon: Headphones, title: '24×7 Support', description: 'Round-the-clock customer assistance via phone, WhatsApp and email — always there for you.' },
  { icon: CreditCard, title: 'Transparent Pricing', description: 'No hidden fees. Our pricing dashboard shows every rupee before you confirm.' },
  { icon: Navigation, title: 'GPS Enabled Fleet', description: 'All vehicles are equipped with real-time GPS tracking for enhanced safety and monitoring.' },
  { icon: Star, title: 'Trusted by 25,000+', description: 'Thousands of families and corporates trust us for their most important journeys every year.' }
];

const stats = [
  { value: 25000, suffix: '+', label: 'Happy Clients' },
  { value: 150, suffix: '+', label: 'Cities Covered' },
  { value: 500, suffix: '+', label: 'Premium Vehicles' },
  { value: 4.9, suffix: '/5', label: 'Average Rating', decimal: true }
];

// Animated Counter Hook
const useCounter = (target, inView, decimal = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(decimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, decimal]);
  return count;
};

const StatCard = ({ stat, inView }) => {
  const count = useCounter(stat.value, inView, stat.decimal);
  return (
    <div className="text-center">
      <p className="font-display text-4xl md:text-5xl font-black text-white">
        {stat.decimal ? count.toFixed(1) : count.toLocaleString()}
        <span className="text-velorix-red">{stat.suffix}</span>
      </p>
      <p className="text-white/60 text-sm mt-1 font-medium">{stat.label}</p>
    </div>
  );
};

const WhyChooseUs = () => {
  const ref = useRef(null);
  const statsRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-50px' });

  return (
    <section className="py-24 md:py-32 px-6 md:px-14 bg-velorix-light">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-3"
          >
            Our Promise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-velorix-dark leading-tight"
          >
            Why Choose
            <span className="text-velorix-red"> Velorix</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-gray-500 max-w-xl mx-auto leading-relaxed"
          >
            We don't just rent vehicles — we deliver premium travel experiences built on trust, safety and unmatched service quality.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group flex gap-5 p-6 rounded-2xl hover:bg-white hover:shadow-premium transition-all duration-400 border border-transparent hover:border-gray-50"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-velorix-red/10 group-hover:bg-velorix-red flex items-center justify-center transition-colors duration-400">
                  <Icon size={22} className="text-velorix-red group-hover:text-white transition-colors duration-400" />
                </div>
                {/* Text */}
                <div>
                  <h3 className="font-display text-base font-bold text-velorix-dark mb-1.5">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Band */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-velorix-dark rounded-3xl px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} inView={statsInView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
