import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Search } from 'lucide-react';

export default function Header({ searchVal, onSearchChange }) {
  const navigate = useNavigate();

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

      </div>
    </header>
  );
}
