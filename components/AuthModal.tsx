import React, { useState } from 'react';
import { X, Mail, Lock, User, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#60a5fa] to-[#f9a8d4] p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-light tracking-wide font-serif">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button onClick={onClose} className="hover:scale-110 transition">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-white/80 mt-1 font-light">
            {activeTab === 'login' ? 'Enter your credentials to continue' : 'Join Pandora Labs today'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${activeTab === 'login' ? 'bg-white text-[#60a5fa] shadow-sm' : 'text-gray-600'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${activeTab === 'signup' ? 'bg-white text-[#60a5fa] shadow-sm' : 'text-gray-600'}`}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'login' ? (
            /* Login Form */
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Login functionality coming soon!'); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent outline-none transition" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent outline-none transition" required />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#60a5fa] focus:ring-[#60a5fa]" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-[#60a5fa] hover:text-[#3b82f6]">Forgot password?</a>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#60a5fa] to-[#f9a8d4] text-white py-3 rounded-lg font-medium hover:shadow-lg transition">
                Sign In
              </button>
            </form>
          ) : (
            /* Signup Form */
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Signup functionality coming soon!'); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9a8d4] focus:border-transparent outline-none transition" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9a8d4] focus:border-transparent outline-none transition" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9a8d4] focus:border-transparent outline-none transition" required />
                </div>
              </div>
              <label className="flex items-start gap-2 cursor-pointer text-sm">
                <input type="checkbox" className="mt-1 rounded border-gray-300 text-[#f9a8d4] focus:ring-[#f9a8d4]" required />
                <span className="text-gray-600">I agree to the Terms of Service and Privacy Policy</span>
              </label>
              <button type="submit" className="w-full bg-gradient-to-r from-[#f9a8d4] to-[#60a5fa] text-white py-3 rounded-lg font-medium hover:shadow-lg transition">
                Create Account
              </button>
            </form>
          )}

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};