import React, { useState, useRef, useEffect } from 'react';
import { Bell, UserCircle, Menu, LogOut, Settings, User, X, Mail, Phone, MapPin, Shield, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ onMenuClick }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user in Navbar initial state:', e);
        return null;
      }
    }
    return null;
  });
  const userRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        } catch (e) {
          console.error('Error parsing user in Navbar storage change:', e);
        }
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <header className="h-16 border-b px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors bg-slate-950 border-slate-800">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-lg lg:hidden transition-colors hover:bg-slate-800"
        >
          <Menu className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <button 
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className={`flex items-center gap-2 md:gap-3 pl-2 pr-1 py-1 rounded-full transition-colors group ${
              showUserDropdown ? 'bg-slate-800' : 'hover:bg-slate-800'
            }`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold leading-none text-slate-100">{currentUser?.fullName || 'Guest User'}</p>
              <p className="text-[10px] mt-1 font-black uppercase tracking-widest text-slate-500">{currentUser?.role || 'User'}</p>
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center font-black text-xs md:text-sm border-2 border-blue-500/20 group-hover:border-blue-500/50 transition-all">
              {getInitials(currentUser?.fullName)}
            </div>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 border rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 bg-slate-900 border-slate-800 shadow-black/50">
              <div className="p-3 mb-2 rounded-xl bg-slate-800/50">
                <p className="text-xs font-bold text-slate-100">{currentUser?.fullName || 'Guest User'}</p>
                <p className="text-[10px] mt-0.5 text-slate-500">{currentUser?.email || 'guest@kavyamargin.com'}</p>
              </div>
              <div className="space-y-1">
                <button 
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserDropdown(false);
                  }} 
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors group font-bold text-left text-slate-400 hover:bg-slate-800 hover:text-blue-400"
                >
                  <User className="w-4 h-4 group-hover:text-blue-500 text-slate-500" />
                  My Profile
                </button>
                <div className="h-[1px] my-1 mx-2 bg-slate-800" />
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors w-full group font-bold"
                >
                  <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute -bottom-12 left-8 w-24 h-24 bg-slate-900 rounded-2xl p-1 shadow-xl">
                <div className="w-full h-full bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center font-black text-3xl border-2 border-blue-500/20">
                  {getInitials(currentUser?.fullName)}
                </div>
              </div>
            </div>
            
            <div className="pt-16 pb-8 px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-white tracking-tight">{currentUser?.fullName}</h2>
                <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mt-1">{currentUser?.role}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email Address
                  </p>
                  <p className="text-sm text-slate-200 font-bold">{currentUser?.email || 'Not Provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Contact Number
                  </p>
                  <p className="text-sm text-slate-200 font-bold">{currentUser?.contactNo || 'Not Provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3" /> User Role
                  </p>
                  <p className="text-sm text-slate-200 font-bold">{currentUser?.role || 'Not Provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Office Location
                  </p>
                  <p className="text-sm text-slate-200 font-bold">{currentUser?.address || 'Not Provided'}</p>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-800">
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
