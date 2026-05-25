import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../hooks/useDarkMode';
import { FiZap, FiSun, FiMoon, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useDarkMode();
  const [dropOpen, setDropOpen] = useState(false);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <FiZap className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-base">TaskFlow</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(!dropOpen)}
              className="flex items-center gap-2 h-8 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                {user?.name}
              </span>
              <FiChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                <div className="absolute right-0 top-10 z-20 w-52 card shadow-modal border border-slate-100 dark:border-slate-800 animate-slide-up py-1">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setDropOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
