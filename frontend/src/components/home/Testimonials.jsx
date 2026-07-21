import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Family Vacation — Manali Trip',
    avatar: 'PS',
    rating: 5,
    text: 'Absolutely incredible experience! The Innova Crysta was immaculate, driver was punctual and professional. Our family\'s Manali trip was made so much better by Velorix. Will definitely book again.',
    location: 'New Delhi'
  },
  {
    name: 'Rahul Mehta',
    role: 'Corporate Transfer — Airport',
    avatar: 'RM',
    rating: 5,
    text: 'Booked a Mercedes S-Class for an airport transfer for an important client visit. The vehicle was pristine and the uniformed driver was exceptional. Left a superb impression. Highly recommend.',
    location: 'Mumbai'
  },
  {
    name: 'Anjali Kapoor',
    role: 'Group Tour — Golden Triangle',
    avatar: 'AK',
    rating: 5,
    text: 'We booked the Tempo Traveller for our group of 10. Comfortable, air-conditioned, and the driver knew all the best local spots. Booking was seamless and pricing was completely transparent.',
    location: 'Bengaluru'
  },
  {
    name: 'Vikram Singh',
    role: 'Wedding Fleet — 5 Vehicles',
    avatar: 'VS',
    rating: 5,
    text: 'Velorix handled our entire wedding transportation — 5 luxury cars for the baraat and reception. Everything was perfectly coordinated, decorated and on-time. Made our special day truly royal.',
    location: 'Jaipur'
  },
  {
    name: 'Sneha Patel',
    role: 'Weekend Getaway — Goa',
    avatar: 'SP',
    rating: 4,
    text: 'Self-drove an Audi A6 to Goa with my partner — pure bliss. The car was in great condition, pickup was smooth and the app made managing the booking very easy. Will be a Velorix regular.',
    location: 'Pune'
  },
  {
    name: 'Dr. Arjun Nair',
    role: 'Pilgrimage — Char Dham',
    avatar: 'AN',
    rating: 5,
    text: 'Velorix arranged an SUV for our entire family\'s Char Dham yatra. The vehicle handled the mountain roads beautifully and the driver\'s knowledge of the routes was excellent. Very dependable service.',
    location: 'Chennai'
  }
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 md:py-32 px-6 md:px-14 bg-velorix-light-bg overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-3"
          >
            Client Voices
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-velorix-dark leading-tight"
          >
            What Our Clients
            <span className="text-velorix-red"> Say</span>
          </motion.h2>
        </div>

        {/* Swiper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="!pb-14"
          >
            {testimonials.map((t, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div className="group bg-white rounded-3xl p-7 shadow-premium hover:shadow-premium-hover transition-all duration-500 h-full flex flex-col border border-gray-50 hover:border-gray-100">
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-velorix-dark text-white flex items-center justify-center font-bold text-sm tracking-tight">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-velorix-dark text-sm">{t.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{t.location}</p>
                      </div>
                    </div>
                    {/* Quote Icon */}
                    <Quote size={28} className="text-velorix-red/20 group-hover:text-velorix-red/40 transition-colors duration-400 flex-shrink-0" />
                  </div>

                  {/* Rating */}
                  <StarRating rating={t.rating} />

                  {/* Review Text */}
                  <p className="text-gray-600 text-sm leading-relaxed mt-4 flex-1 italic">
                    "{t.text}"
                  </p>

                  {/* Role tag */}
                  <div className="mt-5 pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-velorix-red bg-velorix-red/8 px-3 py-1.5 rounded-full">
                      {t.role}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
