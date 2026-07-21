import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PageSEO from '../components/PageSEO';

const Contact = ({ isSection = false }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Client Relations',
      sub: 'Toll-free 24/7 hotline',
      value: '+1 (800) 555-VELO',
      href: 'tel:+18005558356'
    },
    {
      icon: Mail,
      title: 'Email Support',
      sub: 'Replies within 2 hours',
      value: 'support@velorix.com',
      href: 'mailto:support@velorix.com'
    },
    {
      icon: MapPin,
      title: 'Corporate Headquarters',
      sub: 'Connaught Place, New Delhi',
      value: 'Prestige Tower, CP, ND 110001',
      href: '#'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API dispatch
    setTimeout(() => {
      setMsg('Thank you for contacting us! Our client relations executive will reach out to you shortly.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={isSection ? 'py-12' : 'bg-velorix-light-bg min-h-screen pb-24'}>
      {!isSection && (
        <PageSEO 
          title="Contact Concierge Support" 
          description="Get in touch with the Velorix luxury vehicle booking concierge. Request customized quotes for weddings, pilgrimages, event tours or team packages." 
        />
      )}
      {/* Banner Header */}
      {isSection ? (
        <div className="text-center max-w-3xl mx-auto pt-12 pb-8 px-6">
          <span className="text-velorix-red text-xs font-bold uppercase tracking-[0.2em] mb-2 inline-block">Support Desk</span>
          <h2 className="text-4xl md:text-5xl font-black font-display text-velorix-dark">We'd Love to Hear From You</h2>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-2xl mx-auto">
            Planning a wedding, corporate retreat, or luxury weekend yatra? Contact our dedicated concierge team to customize your fleet arrangements.
          </p>
        </div>
      ) : (
        <div className="bg-velorix-dark py-16 px-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-velorix-red/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-velorix-red/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-velorix-red text-xs font-bold uppercase tracking-[0.2em] mb-2 inline-block">Support Desk</span>
            <h1 className="text-4xl md:text-5xl font-black font-display text-white">We'd Love to Hear From You</h1>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Planning a wedding, corporate retreat, or luxury weekend yatra? Contact our dedicated concierge team to customize your fleet arrangements.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 mt-16">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-400 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-velorix-red/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-velorix-red" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{m.sub}</p>
                  <h4 className="font-display font-bold text-sm text-velorix-dark mt-0.5">{m.title}</h4>
                  <a href={m.href} className="text-base font-black text-velorix-red mt-2 block hover:underline">
                    {m.value}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-gray-100 shadow-premium">
            <h3 className="font-display font-black text-xl text-velorix-dark border-b border-gray-100 pb-4 mb-6">Send Us a Message</h3>

            {msg && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider">
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Your Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 px-4 text-xs outline-none focus:border-velorix-dark transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter email"
                    className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 px-4 text-xs outline-none focus:border-velorix-dark transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 px-4 text-xs outline-none focus:border-velorix-dark transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Subject</label>
                  <input
                    required
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="Fleet booking, Package query..."
                    className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl py-3 px-4 text-xs outline-none focus:border-velorix-dark transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Message</label>
                <textarea
                  required
                  rows="5"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your trip dates, locations or special preferences..."
                  className="w-full bg-velorix-light-bg border border-gray-200 rounded-xl p-4 text-xs outline-none focus:border-velorix-dark transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-velorix-dark hover:bg-velorix-red text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
              >
                {loading ? <Clock className="animate-spin" size={14} /> : <Send size={14} />}
                Send Enquiry
              </button>
            </form>
          </div>

          {/* Map Location Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-display font-bold text-velorix-dark text-base border-b border-gray-100 pb-3">Operational Headquarters</h4>
              
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center text-center p-4">
                {/* Mock Map graphics styling */}
                <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80')" }} />
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-gray-100 max-w-[200px]">
                  <MapPin size={24} className="text-velorix-red mx-auto mb-2" />
                  <p className="font-bold text-xs text-velorix-dark">VELORIX tower</p>
                  <p className="text-[10px] text-gray-400 mt-1">Connaught Place, New Delhi</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider justify-center pt-2">
                <ShieldCheck size={14} className="text-green-600" />
                <span>Verified Location</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
