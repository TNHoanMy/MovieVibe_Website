import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function MovieCard({ movie, index }) {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=500';

  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-md hover:shadow-xl transition-all-300"
    >
      <Link to={`/movies/${movie.id}`} className="relative block aspect-[2/3] overflow-hidden">
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-brand-yellow/90 backdrop-blur-sm text-slate-900 text-xs font-black rounded-lg shadow-md">
          <Star className="w-3.5 h-3.5 fill-slate-900 stroke-slate-900" />
          <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
        </div>

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Movie Poster Image */}
        <img
          src={imageUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=500';
          }}
        />

        {/* Quick View Text */}
        <div className="absolute inset-x-0 bottom-4 z-10 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-4 py-2 bg-brand-yellow text-slate-900 text-xs font-bold rounded-full shadow-md uppercase tracking-wider">
            Chi tiết
          </span>
        </div>
      </Link>

      {/* Info Info */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          {releaseYear}
        </span>
        <Link 
          to={`/movies/${movie.id}`}
          className="text-base font-bold text-slate-800 dark:text-white line-clamp-2 hover:text-brand-yellow-dark dark:hover:text-brand-yellow transition-colors-300"
          title={movie.title}
        >
          {movie.title}
        </Link>
      </div>
    </motion.div>
  );
}
