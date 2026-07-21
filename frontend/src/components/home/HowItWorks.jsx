import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Car, Calendar, CheckCircle, MapPin } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Car,
    title: 'Choose Vehicle',
    description: 'Browse our curated fleet of luxury sedans, SUVs, coaches and buses filtered by your travel requirements.',
    color: '#D32F2F'
  },
  {
    number: '02',
    icon: Calendar,
    title: 'Select Dates',
    description: 'Pick your pickup and return dates using our interactive availability calendar. No hidden fees.',
    color: '#FFFFFF'
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Confirm Booking',
    description: 'Securely complete your reservation online. Receive an instant invoice and confirmation email.',
    color: '#D32F2F'
  },
  {
    number: '04',
    icon: MapPin,
    title: 'Enjoy Your Trip',
    description: 'Your vehicle arrives at your door or preferred pickup point. Sit back, relax and travel in style.',
    color: '#FFFFFF'
  }
];

const HowItWorks = () => {
  const ref = useRef(null);
  const lineRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const lineInView = useInView(lineRef, { once: true, margin: '-50px' });

  return (
    <section className="py-24 md:py-32 px-6 md:px-14 bg-velorix-dark overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div ref={ref} className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-3"
          >
            Simple Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-white leading-tight"
          >
            How Renting
            <span className="text-velorix-red"> Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-xl mx-auto leading-relaxed"
          >
            We've made the rental process effortless so you can focus on planning the perfect trip.
          </motion.p>
        </div>

        {/* Animated horizontal connector line */}
        <div ref={lineRef} className="relative hidden md:block mb-0">
          <div className="absolute top-[52px] left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-px bg-white/10 z-0" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={lineInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="absolute top-[52px] left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-px bg-gradient-to-r from-velorix-red via-white/40 to-velorix-red z-0"
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center group"
              >
                {/* Step Icon Circle */}
                <div className="relative mb-7">
                  {/* Outer ring */}
                  <div className="w-[104px] h-[104px] rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/25 transition-colors duration-500">
                    {/* Inner circle */}
                    <div
                      className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-500"
                      style={{ backgroundColor: step.color + '20', border: `1px solid ${step.color}40` }}
                    >
                      <Icon size={28} style={{ color: step.color }} className="group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-velorix-dark border border-white/10 flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">{step.number}</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-velorix-red transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 md:mt-24 text-center"
        >
          <a
            href="/fleet"
            className="inline-flex items-center gap-3 bg-velorix-red hover:bg-velorix-red-hover text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-[1.03] shadow-lg"
          >
            Start Your Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
