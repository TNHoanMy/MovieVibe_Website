import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, Play, ArrowLeft, Loader2, Users } from 'lucide-react';
import { getMovieDetails, getMovieCredits, getMovieTrailers } from '../services/tmdb';

export default function MovieDetails({ onOpenActorSheet }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const [details, credits, videos] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieTrailers(id)
        ]);
        setMovie(details);
        setCast(credits);
        setTrailers(videos);
      } catch (e) {
        console.error("Error fetching movie details:", e);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-500 gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-brand-yellow-dark" />
        <span className="font-bold">Đang tải thông tin phim...</span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-500 gap-4">
        <span className="font-bold text-lg">Không tìm thấy thông tin phim</span>
        <Link to="/" className="px-4 py-2 bg-brand-yellow text-slate-900 rounded-xl font-bold">
          Quay lại Trang chủ
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1280';

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=500';

  const releaseDateFormatted = movie.release_date 
    ? new Date(movie.release_date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Chưa xác định';

  return (
    <div className="w-full space-y-12 pb-16">
      
      {/* Hero Header BackDrop */}
      <div className="relative w-full aspect-[21/9] min-h-[380px] md:min-h-[500px] overflow-hidden rounded-b-3xl shadow-lg">
        <div className="absolute inset-0 z-0">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1280';
            }}
          />
          {/* Overlay layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#e0f2fe] via-slate-950/40 to-slate-950/60" />
        </div>

        {/* Back navigation button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-slate-950/40 hover:bg-slate-950/70 backdrop-blur-md text-white font-bold rounded-xl border border-white/20 transition-all-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </Link>
      </div>

      {/* Main Details Wrapper */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative -mt-32 md:-mt-48 z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Poster Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-48 sm:w-64 aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 dark:border-slate-900/80 shrink-0 mx-auto md:mx-0 bg-slate-200"
          >
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=500';
              }}
            />
          </motion.div>

          {/* Details Panel */}
          <div className="flex-grow space-y-5 text-left bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-slate-800/30 shadow-xl">
            
            {/* Title & Tagline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-white">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-base md:text-lg italic text-slate-500 dark:text-slate-400 font-medium">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-400">
              
              {/* Rating */}
              <div className="flex items-center gap-1 px-2.5 py-1 bg-brand-yellow text-slate-900 rounded-lg shadow-sm">
                <Star className="w-4 h-4 fill-slate-900 stroke-slate-900" />
                <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}</span>
              </div>

              {/* Release Date */}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{releaseDateFormatted}</span>
              </div>

              {/* Runtime */}
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{movie.runtime} phút</span>
                </div>
              )}
            </div>

            {/* Genres Tag */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3.5 py-1 text-xs font-bold bg-brand-blue-light text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-900/50"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                Tóm tắt phim
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {movie.overview || 'Chưa có thông tin tóm tắt phim.'}
              </p>
            </div>
          </div>
        </div>

        {/* Casting Section */}
        <div className="mt-12 space-y-6 text-left">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-yellow-dark" />
            Diễn viên chính
          </h2>
          
          {cast.length === 0 ? (
            <div className="text-slate-400 italic">Chưa có thông tin diễn viên.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {cast.slice(0, 12).map((actor, index) => (
                <motion.button
                  key={`${actor.id}-${index}`}
                  onClick={() => onOpenActorSheet(actor.id)}
                  whileHover={{ scale: 1.03 }}
                  className="flex flex-col items-center p-3 bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all-300 text-center cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 shadow-inner mb-3 border-2 border-brand-yellow/30">
                    <img
                      src={actor.profile_path
                        ? (actor.profile_path.startsWith('http') ? actor.profile_path : `https://image.tmdb.org/t/p/w185${actor.profile_path}`)
                        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white line-clamp-1 w-full">
                    {actor.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 w-full">
                    {actor.character}
                  </p>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Video Trailers Section */}
        <div className="mt-12 space-y-6 text-left">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Play className="w-5 h-5 text-brand-yellow-dark" />
            Trailers &amp; Videos
          </h2>

          {trailers.length === 0 ? (
            <div className="text-slate-400 italic">Chưa có video trailer nào.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {trailers.slice(0, 3).map((video) => (
                <a
                  key={video.key}
                  href={`https://www.youtube.com/watch?v=${video.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col overflow-hidden bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-lg transition-all-300 cursor-pointer"
                >
                  {/* YouTube Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                      alt={video.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Play Icon Backdrop Overlay */}
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/50 transition-colors flex items-center justify-center">
                      <div className="p-3 bg-red-600 group-hover:bg-red-700 text-white rounded-full shadow-lg group-hover:scale-110 transition-all-300">
                        <Play className="w-6 h-6 fill-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Meta */}
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">
                      {video.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                      Youtube &bull; {video.type}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
