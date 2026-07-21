import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLoginTab) {
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      const result = await register(name, email, password, phone);
      setLoading(false);
      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    }
  };

  const handleTabSwitch = () => {
    setError('');
    setIsLoginTab(!isLoginTab);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl border border-gray-100"
          >
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute right-6 top-6 text-gray-400 hover:text-velorix-dark transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Heading */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-display text-velorix-dark">
                {isLoginTab ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-gray-500 mt-1.5">
                {isLoginTab ? 'Access your luxury travels' : 'Join the premium rental experience'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 mb-6 text-sm">
              <button 
                onClick={() => !isLoginTab && handleTabSwitch()}
                className={`flex-1 pb-3 text-center transition-colors font-medium ${isLoginTab ? 'text-velorix-red border-b-2 border-velorix-red font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => isLoginTab && handleTabSwitch()}
                className={`flex-1 pb-3 text-center transition-colors font-medium ${!isLoginTab ? 'text-velorix-red border-b-2 border-velorix-red font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-velorix-red-light border border-red-200 text-velorix-red text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginTab && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe" 
                        className="w-full pl-11 pr-4 py-3 bg-velorix-light-bg border border-gray-200 rounded-xl text-sm focus:border-velorix-dark focus:ring-1 focus:ring-velorix-dark outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000" 
                        className="w-full pl-11 pr-4 py-3 bg-velorix-light-bg border border-gray-200 rounded-xl text-sm focus:border-velorix-dark focus:ring-1 focus:ring-velorix-dark outline-none transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    className="w-full pl-11 pr-4 py-3 bg-velorix-light-bg border border-gray-200 rounded-xl text-sm focus:border-velorix-dark focus:ring-1 focus:ring-velorix-dark outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-4 py-3 bg-velorix-light-bg border border-gray-200 rounded-xl text-sm focus:border-velorix-dark focus:ring-1 focus:ring-velorix-dark outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-velorix-dark hover:bg-black text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  isLoginTab ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
