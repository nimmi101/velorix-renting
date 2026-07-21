import React from 'react';
import { Shield, Users, Award, Star, Compass, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import PageSEO from '../components/PageSEO';

const About = ({ isSection = false }) => {
  const coreValues = [
    {
      icon: Shield,
      title: 'Uncompromised Safety',
      description: 'Every vehicle undergoes a multi-point inspection before keys are handed over, ensuring complete safety for your loved ones.'
    },
    {
      icon: Users,
      title: 'Customer-Centric Hospitality',
      description: 'Our chauffeurs are trained in hospitality, route optimization, and defensive driving to give you a stress-free travel experience.'
    },
    {
      icon: Award,
      title: 'Premium Fleet Only',
      description: 'We don\'t compromise on vehicle age or quality. Our entire fleet consists of top-tier brands and pristine models.'
    }
  ];

  const milestones = [
    { year: '2022', title: 'Velorix Founded', desc: 'Started with 10 luxury cars in New Delhi, setting a new standard for luxury rentals.' },
    { year: '2023', title: 'Fleet Expansion', desc: 'Added SUVs, Tempo Travellers, and luxury coaches to cover family vacations and corporate clients.' },
    { year: '2024', title: 'Nationwide Network', desc: 'Expanded services across 150+ major cities and key tourist getaways across India.' },
    { year: '2026', title: 'Digital Innovation', desc: 'Launched our modern booking portal offering 360-degree simulators and instant checkouts.' }
  ];

  return (
    <div className={isSection ? 'py-12' : 'bg-velorix-light-bg min-h-screen pb-24'}>
      {!isSection && (
        <PageSEO 
          title="About Us" 
          description="Learn about Velorix's mission to redefine premium mobility in India. Read our history, core values and fleet maintenance standards." 
        />
      )}
      
      {/* Header Banner / Section Header */}
      {isSection ? (
        <div className="text-center max-w-3xl mx-auto pt-12 pb-8 px-6">
          <span className="text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-2 inline-block">The Velorix Story</span>
          <h2 className="text-4xl md:text-5xl font-black font-display text-velorix-dark">Redefining Premium Mobility</h2>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-2xl mx-auto">
            We are dedicated to providing the ultimate travel experience, combining premium luxury vehicles, absolute price transparency, and unmatched safety.
          </p>
        </div>
      ) : (
        <div className="bg-velorix-dark py-24 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80')" }} />
          <div className="absolute top-0 left-0 w-64 h-64 bg-velorix-red/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-velorix-red/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-velorix-red text-xs font-bold uppercase tracking-[0.25em] mb-2 inline-block">The Velorix Story</span>
            <h1 className="text-4xl md:text-5xl font-black font-display text-white">Redefining Premium Mobility</h1>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              We are dedicated to providing the ultimate travel experience, combining premium luxury vehicles, absolute price transparency, and unmatched safety.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid Wrapper */}
      <div className="max-w-6xl mx-auto px-6 mt-16 space-y-24">
        
        {/* Brand Mission & Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-velorix-red text-xs font-bold uppercase tracking-wider">Our Mission</span>
            <h2 className="text-3xl font-black font-display text-velorix-dark mt-2 leading-tight">
              Crafting extraordinary journeys with luxury and comfort
            </h2>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">
              Velorix was born out of a simple need: to make premium vehicle rental transparent, trustworthy, and premium. We understood that family vacations, corporate events, and wedding transfers deserve better than standard cab services.
            </p>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              Whether you choose to get behind the wheel of a luxury sedan, take a weekend getaway in a rugged SUV, or drive your entire team in our luxury coaches — we deliver a refined travel experience that starts the moment you book.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-premium">
            <img 
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80" 
              alt="Premium dashboard"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </section>

        {/* Milestones / Timeline */}
        <section className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-premium">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-velorix-red text-xs font-bold uppercase tracking-wider">Our Progress</span>
            <h3 className="text-2xl font-black font-display text-velorix-dark mt-1">Our Milestone Journey</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {milestones.map((m, idx) => (
              <div key={m.year} className="space-y-3 relative group">
                <span className="font-display font-black text-4xl text-velorix-red/20 group-hover:text-velorix-red transition-colors duration-300">
                  {m.year}
                </span>
                <h4 className="font-bold text-base text-velorix-dark">{m.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-velorix-red text-xs font-bold uppercase tracking-wider">Why We Do It</span>
            <h3 className="text-3xl font-black font-display text-velorix-dark mt-1">Our Core Pillars</h3>
            <p className="text-gray-500 text-sm mt-3">We hold ourselves to the highest service standards in the industry.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-400">
                  <div className="w-12 h-12 rounded-2xl bg-velorix-red/10 flex items-center justify-center mb-6">
                    <Icon size={20} className="text-velorix-red" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-velorix-dark mb-2">{val.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{val.description}</p>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
