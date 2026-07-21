import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, Share2, MessageCircle, Globe, Play } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', to: '/#about' },
    { label: 'Our Fleet', to: '/#fleet' },
    { label: 'Tour Packages', to: '/#packages' },
    { label: 'Contact', to: '/#contact' },
  ],
  services: [
    { label: 'Self Drive Cars', to: '/?type=Self Drive#fleet' },
    { label: 'Chauffeur Service', to: '/?type=With Driver#fleet' },
    { label: 'Airport Transfers', to: '/#fleet' },
    { label: 'Wedding Rentals', to: '/?category=Luxury#fleet' },
    { label: 'Corporate Tours', to: '/#packages' },
    { label: 'Group Travel', to: '/?category=Tempo Traveller#fleet' },
  ],
  fleet: [
    { label: 'Luxury Sedans', to: '/?category=Luxury#fleet' },
    { label: 'SUVs', to: '/?category=SUV#fleet' },
    { label: 'Hatchbacks', to: '/?category=Hatchback#fleet' },
    { label: 'Tempo Travellers', to: '/?category=Tempo Traveller#fleet' },
    { label: 'Mini Buses', to: '/?category=Mini Bus#fleet' },
    { label: 'Luxury Coaches', to: '/?category=Luxury Coach#fleet' },
  ]
};

const Footer = () => {
  return (
    <footer className="bg-velorix-dark text-gray-400">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-3xl font-extrabold tracking-wider font-display text-white inline-block mb-5">
              <span className="text-velorix-red">VELO</span>RIX
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-6">
              India's premium vehicle rental platform. From luxury self-drives to group travel coaches — we make every journey extraordinary.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-500">
                <MapPin size={16} className="text-velorix-red flex-shrink-0" />
                <span>123 Prestige Tower, Connaught Place, New Delhi 110001</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <Phone size={16} className="text-velorix-red flex-shrink-0" />
                <a href="tel:+18005558356" className="hover:text-white transition-colors">+1 (800) 555-VELO</a>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <Mail size={16} className="text-velorix-red flex-shrink-0" />
                <a href="mailto:support@velorix.com" className="hover:text-white transition-colors">support@velorix.com</a>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <Clock size={16} className="text-velorix-red flex-shrink-0" />
                <span>24/7 Premium Support Available</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-7">
              {[
                { icon: MessageCircle, href: '#', label: 'Instagram' },
                { icon: Share2, href: '#', label: 'Facebook' },
                { icon: Globe, href: '#', label: 'Twitter' },
                { icon: Play, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-white/10 hover:border-velorix-red hover:text-white flex items-center justify-center transition-all duration-300 text-gray-500 hover:bg-velorix-red/10"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold font-display uppercase tracking-widest text-xs mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-bold font-display uppercase tracking-widest text-xs mb-5">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fleet Links */}
          <div>
            <h4 className="text-white font-bold font-display uppercase tracking-widest text-xs mb-5">Fleet</h4>
            <ul className="space-y-3">
              {footerLinks.fleet.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6 px-6 md:px-14">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} VELORIX Luxury Rentals. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Rental Agreement</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
