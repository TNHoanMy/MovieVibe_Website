import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-slate-300/40 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md text-slate-700 dark:text-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Branding & Copyright */}
        <div className="flex items-center gap-2">
          <span className="font-black text-slate-900 dark:text-white text-base">MovieVibe</span>
          <span className="text-slate-400 dark:text-slate-600">|</span>
          <span>&copy; {new Date().getFullYear()} Bản quyền thuộc về TNHoanMy</span>
        </div>

        {/* Links: Home & Github */}
        <div className="flex items-center gap-6 font-bold">
          <Link 
            to="/" 
            className="flex items-center gap-1.5 hover:text-brand-yellow-dark dark:hover:text-brand-yellow transition-all-300 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
          <a 
            href="https://github.com/TNHoanMy/MovieVibe_Website" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1.5 hover:text-brand-yellow-dark dark:hover:text-brand-yellow transition-all-300 cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <span>Github</span>
          </a>
        </div>

        {/* Credit */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>using React &amp; Tailwind</span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">&bull;</span>
          <span>Powered by TMDB API</span>
        </div>

      </div>
    </footer>
  );
}
