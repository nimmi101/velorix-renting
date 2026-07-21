import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Menu, X, User as UserIcon, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      const sections = ['home', 'fleet', 'packages', 'about', 'contact'];
      const scrollPos = window.scrollY + 200; // Offset for navbar

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial run

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (sectionId, e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const yOffset = -72; // navbar height
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'instant' });
      }
      window.history.pushState(null, '', `/#${sectionId}`);
      setActiveSection(sectionId);
    }
  };

  const getLinkClassName = (sectionId) => {
    const isActive = location.pathname === '/' && activeSection === sectionId;
    return `transition-colors duration-300 font-medium text-sm tracking-wide uppercase cursor-pointer ${isActive ? 'text-velorix-red font-semibold' : 'text-velorix-dark hover:text-velorix-red'}`;
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-lg border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-wider font-display text-velorix-dark flex items-center gap-2">
          <span className="text-velorix-red">VELO</span>RIX
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="/#home" onClick={(e) => handleNavClick('home', e)} className={getLinkClassName('home')}>Home</a>
          <a href="/#fleet" onClick={(e) => handleNavClick('fleet', e)} className={getLinkClassName('fleet')}>Fleet</a>
          <a href="/#packages" onClick={(e) => handleNavClick('packages', e)} className={getLinkClassName('packages')}>Tours</a>
          <a href="/#about" onClick={(e) => handleNavClick('about', e)} className={getLinkClassName('about')}>About</a>
          <a href="/#contact" onClick={(e) => handleNavClick('contact', e)} className={getLinkClassName('contact')}>Contact</a>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/fleet" className="bg-velorix-red hover:bg-velorix-red-hover text-white text-xs font-semibold px-5 py-2.5 rounded-full uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-premium">
            Book Now
          </Link>

          {user ? (
            /* User Profile Dropdown */
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-velorix-dark text-white flex items-center justify-center font-bold text-sm tracking-tighter border border-gray-200">
                  {getInitials(user.name)}
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    {/* Backdrop to close click */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-20 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-velorix-dark truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        My Dashboard
                      </Link>

                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium text-velorix-red"
                        >
                          <LayoutDashboard size={16} />
                          Admin Console
                        </Link>
                      )}

                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Sign In Button */
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="text-sm font-semibold text-velorix-dark hover:text-velorix-red transition-colors duration-300 flex items-center gap-1.5"
            >
              <UserIcon size={16} />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-4">
          {!user && (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="text-velorix-dark p-1.5"
            >
              <UserIcon size={20} />
            </button>
          )}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-velorix-dark p-1.5"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white z-40 p-8 flex flex-col shadow-2xl md:hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-bold font-display text-velorix-dark">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500">
                  <X size={20} />
                </button>
              </div>

              {user && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-8">
                  <div className="w-10 h-10 rounded-full bg-velorix-dark text-white flex items-center justify-center font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-velorix-dark truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-6 text-lg">
                <a href="/#home" onClick={(e) => handleNavClick('home', e)} className="font-semibold text-velorix-dark hover:text-velorix-red">Home</a>
                <a href="/#fleet" onClick={(e) => handleNavClick('fleet', e)} className="font-semibold text-velorix-dark hover:text-velorix-red">Our Fleet</a>
                <a href="/#packages" onClick={(e) => handleNavClick('packages', e)} className="font-semibold text-velorix-dark hover:text-velorix-red">Tour Packages</a>
                <a href="/#about" onClick={(e) => handleNavClick('about', e)} className="font-semibold text-velorix-dark hover:text-velorix-red">About Us</a>
                <a href="/#contact" onClick={(e) => handleNavClick('contact', e)} className="font-semibold text-velorix-dark hover:text-velorix-red">Contact</a>
                <Link to="/fleet" onClick={() => setIsMobileMenuOpen(false)} className="bg-velorix-red text-white py-3 text-center rounded-xl font-bold text-sm uppercase tracking-wide mt-4">Book Now</Link>
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-velorix-dark hover:text-velorix-red mt-6">My Dashboard</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-velorix-red">Admin Console</Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600 font-semibold mt-4 text-left"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }}
                    className="flex items-center gap-2 text-velorix-dark font-semibold mt-4 text-left"
                  >
                    <UserIcon size={18} />
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Auth Modal Dialog */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;
