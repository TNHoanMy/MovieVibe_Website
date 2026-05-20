import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Flame, Award, Calendar, AlertCircle } from 'lucide-react';
import { getMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'popular', label: 'Phổ biến', icon: Flame },
  { id: 'trending', label: 'Xu hướng', icon: TrendingUp },
  { id: 'top_rated', label: 'Đánh giá cao', icon: Award },
  { id: 'upcoming', label: 'Sắp ra mắt', icon: Calendar }
];

export default function Home({ searchQuery }) {
  const [activeCategory, setActiveCategory] = useState('popular');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [heroMovie, setHeroMovie] = useState(null);

  // Fetch movies when category or search changes
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await getMovies(activeCategory, searchQuery);
        setMovies(data);
        
        // Pick the first movie from popular/trending to show as a hero banner
        if (data.length > 0 && !searchQuery && !heroMovie) {
          setHeroMovie(data[0]);
        }
      } catch (err) {
        console.error("Error loading movies:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [activeCategory, searchQuery]);

  return (
    <div className="w-full space-y-8 pb-12">
      
      {/* Hero Banner (Only shown when not searching and a movie exists) */}
      {!searchQuery && heroMovie && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full aspect-[21/9] min-h-[350px] sm:min-h-[450px] md:min-h-[500px] overflow-hidden rounded-3xl shadow-xl border border-slate-200/20"
        >
          {/* Backdrop Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={`https://image.tmdb.org/t/p/w1280${heroMovie.backdrop_path}`}
              alt={heroMovie.title}
              className="w-full h-full object-cover scale-[1.01]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1280';
              }}
            />
            {/* Soft gradient covers */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#ADD8E6] via-slate-950/40 to-slate-950/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent hidden md:block" />
          </div>

          {/* Banner Info */}
          <div className="absolute bottom-0 inset-x-0 z-10 p-6 md:p-12 flex flex-col justify-end max-w-4xl space-y-4 text-white">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-brand-yellow text-slate-950 text-xs font-black rounded-lg shadow-md uppercase tracking-wider">
                Nổi bật
              </span>
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-black/40 backdrop-blur-md text-brand-yellow text-sm font-bold rounded-lg border border-brand-yellow/30">
                <Star className="w-4 h-4 fill-brand-yellow stroke-brand-yellow" />
                <span>{heroMovie.vote_average ? heroMovie.vote_average.toFixed(1) : 'N/A'}</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white line-clamp-2 drop-shadow-md">
              {heroMovie.title}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-200 line-clamp-3 md:line-clamp-4 max-w-2xl drop-shadow-sm font-medium">
              {heroMovie.overview}
            </p>

            <div className="pt-2">
              <Link
                to={`/movies/${heroMovie.id}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all-300"
              >
                Xem chi tiết phim
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Grid / Tabs Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-300/40 pb-4">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {searchQuery ? `Kết quả tìm kiếm cho: "${searchQuery}"` : 'Khám phá phim'}
          </h2>

          {/* Category Tabs (Only if not searching) */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200/20">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all-300 cursor-pointer ${
                      isActive 
                        ? 'bg-brand-yellow text-slate-900 shadow-md scale-[1.02]' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-slate-300/40 dark:bg-slate-800/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2">
            <AlertCircle className="w-12 h-12 text-slate-400" />
            <span className="font-bold text-lg text-slate-700 dark:text-slate-300">Không tìm thấy phim nào</span>
            <span className="text-sm">Hãy thử từ khóa khác hoặc kiểm tra kết nối API.</span>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {movies.map((movie, index) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  index={index} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}
