import { mockMovies, mockMovieDetails, mockActors } from './mockData';

const BASE_URL = 'https://api.themoviedb.org/3';

// Helper to get the current API Key or Bearer Token from localStorage or environment
export function getApiKeyConfig() {
  const localKey = localStorage.getItem('tmdb_api_key');
  const envKey = import.meta.env.VITE_TMDB_API_KEY;
  return localKey || envKey || '';
}

export function setApiKeyConfig(key) {
  if (key) {
    localStorage.setItem('tmdb_api_key', key);
  } else {
    localStorage.removeItem('tmdb_api_key');
  }
}

// Track if last request failed / fell back
let usingMock = false;

export function isUsingMockData() {
  return usingMock || !getApiKeyConfig();
}

async function fetchFromApi(endpoint, params = {}) {
  const apiKey = getApiKeyConfig();
  if (!apiKey) {
    usingMock = true;
    throw new Error('No API key provided');
  }

  // Construct URL
  const urlParams = new URLSearchParams({
    api_key: apiKey,
    language: 'vi-VN', // Prefer Vietnamese, fallback to English where not available
    ...params
  });
  
  const response = await fetch(`${BASE_URL}${endpoint}?${urlParams.toString()}`);
  
  if (!response.ok) {
    if (response.status === 401) {
      usingMock = true;
      throw new Error('Unauthorized: Invalid TMDB API Key');
    }
    throw new Error(`API Error: ${response.status}`);
  }
  
  usingMock = false;
  return response.json();
}

export async function getMovies(type, query = '') {
  // If search query is provided, use the search endpoint
  if (query) {
    try {
      const data = await fetchFromApi('/search/movie', { query });
      return data.results || [];
    } catch (e) {
      console.warn('Search API failed, falling back to matching mock data:', e);
      // Filter mock movies by query
      const allMockMovies = [
        ...mockMovies.trending,
        ...mockMovies.popular,
        ...mockMovies.top_rated,
        ...mockMovies.upcoming
      ];
      // Deduplicate mock movies
      const uniqueMockMovies = Array.from(new Map(allMockMovies.map(item => [item.id, item])).values());
      return uniqueMockMovies.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase()) || 
        m.overview.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  // Normal category list
  try {
    let endpoint = '/movie/popular';
    if (type === 'trending') endpoint = '/trending/movie/day';
    else if (type === 'top_rated') endpoint = '/movie/top_rated';
    else if (type === 'upcoming') endpoint = '/movie/upcoming';
    else if (type === 'popular') endpoint = '/movie/popular';

    const data = await fetchFromApi(endpoint);
    return data.results || [];
  } catch (e) {
    console.warn(`Fetch movies for type "${type}" failed, returning mock data:`, e);
    return mockMovies[type] || mockMovies.popular;
  }
}

export async function getMovieDetails(id) {
  try {
    return await fetchFromApi(`/movie/${id}`);
  } catch (e) {
    console.warn(`Fetch movie details for ID ${id} failed, returning mock data:`, e);
    return mockMovieDetails[id] || Object.values(mockMovieDetails)[0];
  }
}

export async function getMovieCredits(id) {
  try {
    const data = await fetchFromApi(`/movie/${id}/credits`);
    return data.cast || [];
  } catch (e) {
    console.warn(`Fetch movie credits for ID ${id} failed, returning mock data:`, e);
    return mockMovieDetails[id]?.credits?.cast || Object.values(mockMovieDetails)[0].credits.cast;
  }
}

export async function getMovieTrailers(id) {
  try {
    // Explicitly query with en-US language because TMDB doesn't return videos for vi-VN in most cases
    const data = await fetchFromApi(`/movie/${id}/videos`, { language: 'en-US' });
    const videos = data.results || [];
    
    // Filter YouTube videos
    const ytVideos = videos.filter(v => v.site === 'YouTube');
    
    // 1. Try to find trailers
    let filtered = ytVideos.filter(v => v.type === 'Trailer');
    
    // 2. Fallback to teasers
    if (filtered.length === 0) {
      filtered = ytVideos.filter(v => v.type === 'Teaser');
    }
    
    // 3. Fallback to any videos
    if (filtered.length === 0) {
      filtered = ytVideos;
    }

    if (filtered.length > 0) {
      return filtered;
    }
    
    throw new Error('No YouTube videos found for this movie');
  } catch (e) {
    console.warn(`Fetch movie trailers for ID ${id} failed, returning mock data:`, e);
    const mockVids = mockMovieDetails[id]?.videos?.results || Object.values(mockMovieDetails)[0].videos.results;
    return mockVids;
  }
}

export async function getActorDetails(id) {
  try {
    return await fetchFromApi(`/person/${id}`);
  } catch (e) {
    console.warn(`Fetch actor details for ID ${id} failed, returning mock data:`, e);
    return mockActors[id] || {
      id,
      name: "Unknown Actor",
      biography: "Biography not available in offline/mock mode.",
      birthday: "N/A",
      place_of_birth: "N/A",
      profile_path: null
    };
  }
}

export async function getActorMovieCredits(id) {
  try {
    const data = await fetchFromApi(`/person/${id}/movie_credits`);
    const cast = data.cast || [];
    // Sort movies by vote_average/popularity from high to low
    return cast.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  } catch (e) {
    console.warn(`Fetch actor movie credits for ID ${id} failed, returning mock data:`, e);
    const actorMock = mockActors[id];
    if (actorMock && actorMock.movie_credits) {
      return actorMock.movie_credits.cast.sort((a, b) => b.vote_average - a.vote_average);
    }
    // Return empty array if not found
    return [];
  }
}
