import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieByid } from '../../Services/MovieServices';
import { MovieContext } from '../Context/DataContext';
import Navbar from '../components/Navbar';
import Loader from './Loader';
import { staticTrendingMovies } from '../api/staticMovies';
import { FaStar, FaExternalLinkAlt, FaFilm, FaClock, FaGlobe, FaUserAlt, FaUsers, FaPlus } from 'react-icons/fa';

function Detail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  
  // Watchlist, Review & Collection States
  const [watchlistStatus, setWatchlistStatus] = useState('NONE');
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [movieReviews, setMovieReviews] = useState([]);
  const [collections, setCollections] = useState({});
  const [selectedCollection, setSelectedCollection] = useState('NONE');

  // Get qlobal context
  const { data, theme } = useContext(MovieContext);

  useEffect(() => {
    setMovie(null); // Reset movie on id change to show loader
    
    // Check if it is a static trending movie
    if (id && id.startsWith('static-')) {
      const staticMovie = staticTrendingMovies.find(m => m.id === id);
      if (staticMovie) {
        setMovie(staticMovie);
      }
    } else {
      getMovieByid(id).then(item => {
        if (item) {
          // Enforce same client-side fallback/enrichment logic
          const codeSum = item.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const rating = item.rating || parseFloat((6.5 + (codeSum % 31) / 10).toFixed(1));
          const imdbLink = item.imdbLink || `https://www.imdb.com/find?q=${encodeURIComponent(item.name)}`;
          
          setMovie({
            ...item,
            rating,
            imdbLink
          });
        }
      });
    }

    // Load watchlist status from localStorage
    const storedWatchlist = localStorage.getItem('parkcinema_watchlist');
    if (storedWatchlist) {
      const watchlist = JSON.parse(storedWatchlist);
      if (watchlist[id]) {
        setWatchlistStatus(watchlist[id].status);
      } else {
        setWatchlistStatus('NONE');
      }
    } else {
      setWatchlistStatus('NONE');
    }

    // Load reviews from localStorage
    const storedReviews = localStorage.getItem(`parkcinema_reviews_${id}`);
    if (storedReviews) {
      setMovieReviews(JSON.parse(storedReviews));
    } else {
      setMovieReviews([]);
    }

    // Load custom collections
    const storedCollections = localStorage.getItem('parkcinema_collections');
    if (storedCollections) {
      setCollections(JSON.parse(storedCollections));
    } else {
      setCollections({});
    }
  }, [id]);

  if (!movie) {
    return <Loader />;
  }

  // Filter similar movies: movies in same genre, excluding current movie
  const similarMovies = data.filter(m => 
    m.id !== movie.id && 
    m.genres?.some(genre => movie.genres?.some(g => g.title === genre.title))
  ).slice(0, 4);

  // Watchlist Handler
  const handleWatchlistStatusChange = (status) => {
    setWatchlistStatus(status);
    const stored = localStorage.getItem('parkcinema_watchlist');
    let watchlist = stored ? JSON.parse(stored) : {};
    
    if (status === 'NONE') {
      delete watchlist[id];
    } else {
      watchlist[id] = {
        id: movie.id,
        name: movie.name,
        image: movie.image,
        genres: movie.genres || [],
        year: movie.year,
        duration: movie.duration,
        status: status,
        updatedAt: new Date().toISOString()
      };
    }
    localStorage.setItem('parkcinema_watchlist', JSON.stringify(watchlist));
  };

  // Add Movie to Custom Collection
  const handleAddToCollection = (colName) => {
    if (colName === 'NONE') return;
    
    const stored = localStorage.getItem('parkcinema_collections') || '{}';
    let parsed = JSON.parse(stored);
    
    if (!parsed[colName]) {
      parsed[colName] = [];
    }
    
    // Check if already in collection
    if (!parsed[colName].some(m => m.id === movie.id)) {
      parsed[colName].push({
        id: movie.id,
        name: movie.name,
        image: movie.image,
        year: movie.year,
        duration: movie.duration,
        rating: movie.rating,
        genres: movie.genres || []
      });
      localStorage.setItem('parkcinema_collections', JSON.stringify(parsed));
      setCollections(parsed);
      alert(`Film "${colName}" kolleksiyasına əlavə olundu!`);
    } else {
      alert("Bu film artıq bu kolleksiyaya əlavə edilib!");
    }
    setSelectedCollection('NONE');
  };

  // Create & add collection flow
  const handleCollectionSelect = (value) => {
    if (value === 'NEW') {
      const name = prompt("Yeni kolleksiya adını daxil edin:");
      if (name && name.trim()) {
        const colName = name.trim();
        const stored = localStorage.getItem('parkcinema_collections') || '{}';
        let parsed = JSON.parse(stored);
        if (!parsed[colName]) {
          parsed[colName] = [];
          localStorage.setItem('parkcinema_collections', JSON.stringify(parsed));
          setCollections(parsed);
          handleAddToCollection(colName);
        } else {
          alert("Bu adda kolleksiya artıq mövcuddur!");
        }
      }
      setSelectedCollection('NONE');
    } else {
      handleAddToCollection(value);
    }
  };

  // Review Handler
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (userRating === 0) {
      alert("Lütfən filmə qiymət (ulduz) verin!");
      return;
    }
    if (!reviewText.trim()) {
      alert("Lütfən rəyinizi yazın!");
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      rating: userRating,
      text: reviewText,
      date: new Date().toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const updatedReviews = [newReview, ...movieReviews];
    setMovieReviews(updatedReviews);
    localStorage.setItem(`parkcinema_reviews_${id}`, JSON.stringify(updatedReviews));
    
    // Clear inputs
    setReviewText('');
    setUserRating(0);
  };

  return (
    <div className={`transition-colors duration-300 min-h-screen pb-16 w-full overflow-x-hidden ${
      theme === 'light' ? 'bg-[#f5f5f7] text-neutral-850' : 'bg-[#141414] text-white'
    }`}>
      {/* Navbar Container */}
      <div className={`relative h-20 border-b w-full ${theme === 'light' ? 'bg-white/80 border-neutral-200' : 'bg-black/40 border-neutral-900'}`}>
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-10 flex flex-col gap-12 mt-6 w-full overflow-hidden">
        
        {/* Main Grid Detail */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between w-full">
          
          {/* Poster & Info column */}
          <div className="flex flex-col md:flex-row gap-8 w-full lg:w-3/5">
            {/* Poster */}
            <div className={`w-[280px] h-[420px] rounded-3xl overflow-hidden shadow-2xl border flex-shrink-0 relative mx-auto md:mx-0 ${
              theme === 'light' ? 'border-neutral-250 shadow-neutral-300' : 'border-neutral-800 shadow-black'
            }`}>
              <img
                src={movie.image}
                alt={movie.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-yellow-500 text-black font-extrabold px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow-md">
                <FaStar /> {movie.rating}
              </div>
            </div>

            {/* Info details */}
            <div className="flex flex-col gap-5 w-full">
              <h1 className={`text-3xl md:text-4xl font-extrabold tracking-wide text-center md:text-left ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{movie.name}</h1>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {movie.genres?.map((item, index) => (
                  <span 
                    key={index} 
                    className={`text-xs px-3.5 py-1.5 rounded-full border font-semibold transition-colors ${
                      theme === 'light' 
                        ? 'bg-neutral-200 border-neutral-300 text-neutral-700 hover:bg-neutral-300' 
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {item.title}
                  </span>
                ))}
              </div>

              {/* Grid table info */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-2 border-t border-b py-4 ${
                theme === 'light' ? 'border-neutral-200 text-neutral-600' : 'border-neutral-800 text-neutral-400'
              }`}>
                <div className="flex items-center gap-2">
                  <FaClock className="text-red-500" />
                  <span><strong className={theme === 'light' ? 'text-neutral-900' : 'text-white'}>Müddət:</strong> {movie.duration} dəq</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGlobe className="text-red-500" />
                  <span><strong className={theme === 'light' ? 'text-neutral-900' : 'text-white'}>Ölkə:</strong> {movie.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFilm className="text-red-500" />
                  <span><strong className={theme === 'light' ? 'text-neutral-900' : 'text-white'}>İl:</strong> {movie.year}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-red-500 text-xs border border-red-500 px-1.5 py-0.5 rounded uppercase">Yaş</span>
                  <span>{movie.ageLimit === 'EIGHTEEN' ? '18+' : movie.ageLimit === 'SIXTEEN' ? '16+' : movie.ageLimit === 'SIX' ? '6+' : movie.ageLimit}</span>
                </div>
              </div>

              {/* Language info */}
              <div className="flex flex-col gap-2 text-sm text-center md:text-left">
                <div>
                  <strong className={theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}>Dillər: </strong>
                  <span className={theme === 'light' ? 'text-neutral-900' : 'text-white'}>{movie.languages?.join(', ')}</span>
                </div>
                {movie.subtitles && movie.subtitles.length > 0 && (
                  <div>
                    <strong className={theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}>Altyazılar: </strong>
                    <span className={theme === 'light' ? 'text-neutral-900' : 'text-white'}>{movie.subtitles.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Director & Actors */}
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2 text-sm justify-center md:justify-start">
                  <FaUserAlt className="text-red-500 flex-shrink-0" />
                  <span><strong className={theme === 'light' ? 'text-neutral-900' : 'text-white'}>Rejissor:</strong> {movie.director}</span>
                </div>
                <div className="flex items-start gap-2 text-sm justify-center md:justify-start">
                  <FaUsers className="text-red-500 mt-1 flex-shrink-0" />
                  <span><strong className={theme === 'light' ? 'text-neutral-900' : 'text-white'}>Aktyorlar:</strong> {movie.actors?.join(', ')}</span>
                </div>
              </div>

              {/* IMDb Link, Watchlist and Collections Select */}
              <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                <a
                  href={movie.imdbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold rounded-xl transition-all shadow-md hover:shadow-yellow-950/30 text-sm"
                >
                  <FaExternalLinkAlt /> IMDb Səhifəsi
                </a>

                {/* Watchlist */}
                <select
                  value={watchlistStatus}
                  onChange={(e) => handleWatchlistStatusChange(e.target.value)}
                  className={`p-2.5 border rounded-xl focus:outline-none focus:border-red-500 transition-colors cursor-pointer text-sm font-semibold ${
                    theme === 'light' ? 'bg-white border-neutral-300 text-neutral-850' : 'bg-neutral-800 border-neutral-700 text-white'
                  }`}
                >
                  <option value="NONE">Siyahıya Əlavə Et</option>
                  <option value="WANT_TO_WATCH">İzləmək istəyirəm</option>
                  <option value="WATCHING">İzləyirəm</option>
                  <option value="WATCHED">İzlədim</option>
                </select>

                {/* Collections Dropdown */}
                <select
                  value={selectedCollection}
                  onChange={(e) => handleCollectionSelect(e.target.value)}
                  className={`p-2.5 border rounded-xl focus:outline-none focus:border-red-500 transition-colors cursor-pointer text-sm font-semibold ${
                    theme === 'light' ? 'bg-white border-neutral-300 text-neutral-850' : 'bg-neutral-800 border-neutral-700 text-white'
                  }`}
                >
                  <option value="NONE">Kolleksiyaya Əlavə Et</option>
                  <option value="NEW">+ Yeni Kolleksiya Yarat</option>
                  {Object.keys(collections).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Trailer Iframe column */}
          <div className="w-full lg:w-[460px] xl:w-[500px] flex-shrink-0">
            {movie.youtubeUrl ? (
              <div className={`relative aspect-video rounded-3xl overflow-hidden shadow-2xl border bg-black w-full ${
                theme === 'light' ? 'border-neutral-250 shadow-neutral-300' : 'border-neutral-800 shadow-black/80'
              }`}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={movie.youtubeUrl.replace("watch?v=", "embed/")}
                  title="Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className={`aspect-video rounded-3xl border border-dashed flex items-center justify-center text-neutral-500 w-full ${
                theme === 'light' ? 'border-neutral-300 bg-white' : 'border-neutral-800 bg-black'
              }`}>
                Trailer tapılmadı
              </div>
            )}
          </div>
        </div>

        {/* Film Description */}
        <section className={`p-6 sm:p-8 rounded-3xl border shadow-lg w-full ${
          theme === 'light' ? 'bg-white border-neutral-200 text-neutral-800' : 'bg-[#1e1e1e] border-neutral-800 text-neutral-300'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 border-l-4 border-red-600 pl-3 ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Film Haqqında Xülasə</h2>
          <p className="leading-relaxed text-sm md:text-base">{movie.description}</p>
        </section>

        {/* Rating & Review Section */}
        <section className={`p-6 sm:p-8 rounded-3xl border shadow-lg w-full flex flex-col gap-6 ${
          theme === 'light' ? 'bg-white border-neutral-200' : 'bg-[#1e1e1e] border-neutral-800'
        }`}>
          <h2 className={`text-2xl font-bold border-l-4 border-red-600 pl-3 ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Şəxsi Reytinq və Rəyiniz</h2>
          
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
            {/* Star Rating Select */}
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>Filmi Qiymətləndirin (1 - 10 Ulduz)</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      userRating >= star 
                        ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20' 
                        : theme === 'light' 
                          ? 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 cursor-pointer' 
                          : 'bg-neutral-850 text-neutral-400 hover:bg-neutral-750 cursor-pointer'
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>Şərhiniz (Rəyiniz)</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Bu film haqqında təəssüratlarınızı yazın..."
                className={`w-full p-4 border rounded-2xl focus:outline-none focus:border-red-500 transition-colors h-32 resize-none text-sm ${
                  theme === 'light' ? 'bg-neutral-50 border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-800 text-white'
                }`}
              ></textarea>
            </div>

            <button
              type="submit"
              className="self-start px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-sm shadow-md shadow-red-950 cursor-pointer"
            >
              Rəy Göndər
            </button>
          </form>

          {/* List of reviews */}
          <div className="flex flex-col gap-4 border-t pt-6 mt-4 border-neutral-800">
            <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>İstifadəçi Rəyləri ({movieReviews.length})</h3>
            
            {movieReviews.length > 0 ? (
              <div className="flex flex-col gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-850 pr-2">
                {movieReviews.map((rev) => (
                  <div key={rev.id} className={`p-4 border rounded-2xl flex flex-col gap-2 shadow-inner ${
                    theme === 'light' ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                  }`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-yellow-500 font-extrabold flex items-center gap-1">
                        <FaStar /> {rev.rating} / 10
                      </span>
                      <span className="text-neutral-500">{rev.date}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 italic">Bu filmə hələ heç kim rəy yazmayıb. İlk yazan siz olun!</p>
            )}
          </div>
        </section>

        {/* Similar Movies Section */}
        <section className="flex flex-col gap-6 w-full overflow-hidden">
          <h2 className={`text-2xl font-bold uppercase border-l-4 border-red-600 pl-3 ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Oxşar Filmlər</h2>
          
          {similarMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
              {similarMovies.map(similar => (
                <Link 
                  to={`/movie/${similar.id}`} 
                  key={similar.id} 
                  className={`group flex flex-col gap-3 border p-4 shadow-lg transition-all duration-300 w-full max-w-[304px] rounded-[30px] ${
                    theme === 'light' ? 'bg-white border-neutral-200 hover:shadow-neutral-400' : 'bg-[#1e1e1e] border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800">
                    <img
                      src={similar.image}
                      alt={similar.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-yellow-500/90 text-black font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 text-xs shadow-md">
                      <FaStar className="text-[10px]" /> {similar.rating}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className={`font-bold group-hover:text-red-500 transition-colors truncate ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{similar.name}</h3>
                    <div className="flex justify-between items-center text-xs text-neutral-400">
                      <span>{similar.year}</span>
                      <span>{similar.duration} dəq</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm">Oxşar janrlarda heç bir başqa film tapılmadı.</p>
          )}
        </section>

      </div>
    </div>
  );
}

export default Detail;
