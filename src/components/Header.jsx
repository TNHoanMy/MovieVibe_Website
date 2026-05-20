import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Search, Settings, Radio } from 'lucide-react';
import { isUsingMockData } from '../services/tmdb';

export default function Header({ onOpenSettings, searchVal, onSearchChange }) {
  const navigate = useNavigate();
  const isDemo = isUsingMockData();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate back to home if we are searching (Home handles rendering search)
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 md:px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <Link 
          to="/" 
          onClick={() => { if (onSearchChange) onSearchChange(''); }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="p-2 bg-brand-yellow text-slate-950 rounded-xl shadow-md group-hover:scale-105 transition-all-300">
            <Film className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-white group-hover:text-brand-yellow-dark transition-all-300">
            Movie<span className="text-brand-yellow-dark dark:text-brand-yellow">Vibe</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="relative w-full max-w-md"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchVal}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
                navigate('/');
              }}
              className="w-full pl-11 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800/90 border border-transparent focus:border-brand-yellow dark:focus:border-brand-yellow rounded-full focus:ring-2 focus:ring-brand-yellow/30 outline-none text-slate-800 dark:text-white transition-all-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            {searchVal && (
              <button
                type="button"
                onClick={() => { if (onSearchChange) onSearchChange(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Xóa
              </button>
            )}
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          
          {/* API Status Badge */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-all-300 cursor-pointer ${
              isDemo 
                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-200' 
                : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-200'
            }`}
            title={isDemo ? "Click để cấu hình TMDB API Key" : "Đang kết nối live tới TMDB API"}
          >
            <Radio className={`w-3.5 h-3.5 ${!isDemo ? 'animate-pulse text-emerald-500' : 'text-amber-500'}`} />
            <span>{isDemo ? 'DEMO MODE' : 'LIVE API'}</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-yellow-dark dark:hover:text-brand-yellow bg-slate-100 dark:bg-slate-800 rounded-xl hover:scale-105 transition-all-300 shadow-sm"
            title="API Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}
