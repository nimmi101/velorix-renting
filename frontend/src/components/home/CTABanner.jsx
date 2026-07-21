import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, PhoneCall } from 'lucide-react';

const CTABanner = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 md:py-32 px-6 md:px-14 bg-velorix-light-bg overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[40px] bg-velorix-dark px-8 md:px-16 py-16 md:py-20 text-center"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-velorix-red/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-velorix-red/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Content */}
          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-4"
            >
              Ready To Travel?
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-6xl font-black font-display text-white leading-tight max-w-3xl mx-auto"
            >
              Your Next Adventure
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-velorix-red to-red-400">
                Starts Here
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-gray-400 text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed"
            >
              Book your premium vehicle today and experience the Velorix difference — verified fleet, professional drivers, and unbeatable transparency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            >
              <Link
                to="/fleet"
                className="inline-flex items-center justify-center gap-2 bg-velorix-red hover:bg-velorix-red-hover text-white font-bold px-10 py-4 rounded-full uppercase tracking-wider text-sm transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-2xl"
              >
                Browse Fleet
                <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+18005558356"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 text-white font-semibold px-10 py-4 rounded-full text-sm transition-all duration-300 hover:bg-white/5"
              >
                <PhoneCall size={16} />
                Call Us Now
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
