import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm text-center text-sm text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-700 dark:text-slate-300">MovieVibe</span> &copy; {new Date().getFullYear()}
        </div>
        <div className="flex items-center gap-1.5">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span>using React &amp; Tailwind CSS</span>
        </div>
        <div>
          <span>Powered by TMDB API</span>
        </div>
      </div>
    </footer>
  );
}
