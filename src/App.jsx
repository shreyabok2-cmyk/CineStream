import React, { useState, useEffect } from 'react';

const STATIC_MOVIES = [
  { id: 1, title: 'Inception', release_date: '2010-07-16', vote_average: 8.8, poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
  { id: 2, title: 'Interstellar', release_date: '2014-11-07', vote_average: 8.6, poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 3, title: 'The Dark Knight', release_date: '2008-07-18', vote_average: 9.0, poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { id: 4, title: 'Avengers: Endgame', release_date: '2019-04-26', vote_average: 8.4, poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg' },
  { id: 5, title: 'Avatar', release_date: '2009-12-18', vote_average: 7.5, poster_path: '/kyeqqih4ZWYyP2nvyILPWZHBZLS.jpg' },
  { id: 6, title: 'Titanic', release_date: '1997-12-19', vote_average: 7.9, poster_path: '/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg' },
  { id: 7, title: 'Joker', release_date: '2019-10-02', vote_average: 8.1, poster_path: '/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
  { id: 8, title: 'Spider-Man: No Way Home', release_date: '2021-12-17', vote_average: 8.2, poster_path: '/1g0dhYtq4hrTY1GPWnizZ9hPjL0.jpg' }
];

export default function App() {
  const [movies, setMovies] = useState(STATIC_MOVIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      if (debouncedQuery.trim() === '') {
        setMovies(STATIC_MOVIES);
      } else {
        const filtered = STATIC_MOVIES.filter((m) =>
          m.title.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setMovies(filtered);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [debouncedQuery]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    if (favorites.some((fav) => fav.id === movie.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#141414', color: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#E50914', margin: 0 }}>Netflix-Lite</h1>
        <input
          type="text"
          placeholder="Search movies (debounced)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px 15px', width: '300px', borderRadius: '4px', border: 'none', backgroundColor: '#333', color: '#fff' }}
        />
      </header>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {movies.map((movie) => {
            const isFav = favorites.some((fav) => fav.id === movie.id);
            return (
              <div key={movie.id} style={{ backgroundColor: '#1f1f1f', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                <img
                  loading="lazy"
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                  alt={movie.title}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <div style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#aaa' }}>
                    <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                    <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(movie)}
                    style={{ marginTop: '10px', width: '100%', padding: '6px', background: isFav ? '#E50914' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {isFav ? '❤️ Remove Favorite' : '🤍 Add Favorite'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}