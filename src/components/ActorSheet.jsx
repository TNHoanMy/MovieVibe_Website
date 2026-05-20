import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Star, Film, Loader2 } from 'lucide-react';
import { getActorDetails, getActorMovieCredits } from '../services/tmdb';

export default function ActorSheet({ actorId, isOpen, onClose }) {
  const [actorInfo, setActorInfo] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && actorId) {
      const loadActorData = async () => {
        setLoading(true);
        try {
          const [details, credits] = await Promise.all([
            getActorDetails(actorId),
            getActorMovieCredits(actorId)
          ]);
          setActorInfo(details);
          setMovieCredits(credits);
        } catch (e) {
          console.error("Error loading actor details", e);
        } finally {
          setLoading(false);
        }
      };
      loadActorData();
    }
  }, [isOpen, actorId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg md:max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-brand-yellow-dark" />
                Thông tin diễn viên
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            {loading ? (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-brand-yellow-dark" />
                <span>Đang tải thông tin...</span>
              </div>
            ) : actorInfo ? (
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                
                {/* Profile Pic + Meta */}
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                  <div className="w-36 h-48 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 shrink-0">
                    <img
                      src={actorInfo.profile_path 
                        ? (actorInfo.profile_path.startsWith('http') ? actorInfo.profile_path : `https://image.tmdb.org/t/p/w185${actorInfo.profile_path}`)
                        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={actorInfo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                      {actorInfo.name}
                    </h2>
                    
                    {/* Metadata */}
                    <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                      {actorInfo.birthday && (
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Sinh ngày: {actorInfo.birthday}</span>
                        </div>
                      )}
                      {actorInfo.place_of_birth && (
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>Nơi sinh: {actorInfo.place_of_birth}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Biography */}
                {actorInfo.biography && (
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Tiểu sử
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-h-48 overflow-y-auto pr-1">
                      {actorInfo.biography}
                    </p>
                  </div>
                )}

                {/* Filmography (Sorted by rating) */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider flex justify-between items-center">
                    <span>Phim đã tham gia</span>
                    <span className="text-xs font-semibold text-slate-400 normal-case">Sắp xếp theo Điểm số</span>
                  </h3>
                  
                  {movieCredits.length === 0 ? (
                    <div className="text-sm text-slate-400 italic text-center py-4">
                      Chưa có danh sách phim tham gia.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {movieCredits.slice(0, 10).map((movie) => (
                        <Link
                          key={movie.id}
                          to={`/movies/${movie.id}`}
                          onClick={onClose}
                          className="flex gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-blue-light/50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-xl hover:scale-[1.01] transition-all-300"
                        >
                          <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                            <img
                              src={movie.poster_path 
                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=92'}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=92';
                              }}
                            />
                          </div>
                          <div className="flex-grow min-w-0 flex flex-col justify-center">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                              {movie.title}
                            </h4>
                            {movie.character && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                vai {movie.character}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0 self-center px-2 py-1 bg-brand-yellow text-slate-900 text-xs font-black rounded-lg">
                            <Star className="w-3 h-3 fill-slate-900 stroke-slate-900" />
                            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-slate-400">
                <span>Không tìm thấy thông tin diễn viên.</span>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
