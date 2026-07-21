import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'What documents do I need to rent a vehicle?',
    a: 'For self-drive rentals, you need a valid Driving License, any government-issued photo ID (Aadhaar/Passport), and a refundable security deposit authorization. For chauffeur-driven vehicles, only your photo ID is required.'
  },
  {
    q: 'Can I book a vehicle for outstation or multi-city trips?',
    a: 'Absolutely! Our vehicles are available for outstation, multi-city, and round-trip tours across India. Our booking wizard lets you specify pickup and drop locations — even different cities. Pricing is calculated transparently based on distance and duration.'
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Cancellations made more than 24 hours before pickup are completely free. If cancelled within 24 hours, a 50% cancellation fee applies. No-shows are non-refundable. For specific vehicle policies, refer to the vehicle details page.'
  },
  {
    q: 'Are drivers provided with all vehicles?',
    a: 'Our fleet includes both self-drive and chauffeur-driven options. All vehicles marked "With Driver" include a professional, background-verified, uniformed driver. You can also upgrade to a driver option on self-drive vehicles for an additional per-day charge.'
  },
  {
    q: 'Is there a minimum rental duration?',
    a: 'Most cars have a minimum rental duration of 1 day. Tempo Travellers and buses typically have a minimum booking of 2 to 3 days for outstation trips. The minimum duration for each vehicle is displayed on its details page.'
  },
  {
    q: 'How is the total rental price calculated?',
    a: 'Your pricing includes: base daily rental × number of days + optional driver allowance + any extra services (GPS, infant seat, etc.) + refundable security deposit + 18% GST. Our checkout shows a full breakdown before you confirm.'
  },
  {
    q: 'What happens if I need the vehicle for longer than booked?',
    a: 'If you need to extend your trip, contact our 24×7 support team as soon as possible. Subject to availability, we can extend your booking at the standard daily rate. Returning the vehicle late without prior notice may attract penalty charges.'
  }
];

const FAQItem = ({ faq, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border-b border-gray-100 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left gap-4 group"
        id={`faq-${index}`}
        aria-expanded={open}
      >
        <span className={`font-semibold text-base transition-colors duration-300 ${open ? 'text-velorix-red' : 'text-velorix-dark group-hover:text-velorix-red'}`}>
          {faq.q}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${open ? 'bg-velorix-red border-velorix-red text-white' : 'border-gray-200 text-gray-400 group-hover:border-velorix-red group-hover:text-velorix-red'}`}>
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-500 text-sm leading-relaxed max-w-3xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 md:py-32 px-6 md:px-14 bg-velorix-light">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-3"
          >
            Got Questions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-velorix-dark leading-tight"
          >
            Frequently Asked
            <span className="text-velorix-red"> Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-gray-500 leading-relaxed"
          >
            Everything you need to know before booking your ride.
          </motion.p>
        </div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-premium border border-gray-50"
        >
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </motion.div>

        {/* Support CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 text-sm mt-8"
        >
          Still have questions?{' '}
          <a href="/contact" className="text-velorix-red font-semibold hover:underline">
            Contact our support team
          </a>
        </motion.p>
      </div>
    </section>
  );
};

export default FAQ;
