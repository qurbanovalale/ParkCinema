import React, { useContext, useState, useEffect } from 'react'
import Card from './Card'
import { MovieContext } from '../Context/DataContext'
import Loader from '../layout/Loader'
import Datecomponent from './Datecomponent'
import Header from './Header'
import dayjs from 'dayjs'
import { staticTrendingMovies } from '../api/staticMovies'

// Import Swiper for Carousel
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { FaStar, FaFire, FaCalendarAlt, FaSearch, FaTimes } from 'react-icons/fa'

function Main() {
  const { data, theatreData, error, loader, theme } = useContext(MovieContext)

  // Basic Filter States
  const [lang, setLang] = useState('DIL')
  const [selectedTheatre, setTheatre] = useState('Kinoteatr')
  const [selectedDate, setSelectedDate] = useState(null)

  // Advanced Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('JANR')
  const [selectedYear, setSelectedYear] = useState('IL')
  const [selectedRating, setSelectedRating] = useState(0)

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Reset to first page when search/filter criteria change
  useEffect(() => {
    setCurrentPage(1)
  }, [lang, selectedTheatre, selectedDate, debouncedSearch, selectedGenre, selectedYear, selectedRating])

  // Debounce logic for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  if (loader) return <Loader />

  // Extract unique genres and years for search dropdowns
  const genres = [...new Set(data.flatMap(movie => movie.genres?.map(g => g.title) || []))].filter(Boolean)
  const years = [...new Set(data.map(movie => movie.year))].filter(Boolean).sort((a, b) => b - a)
  const languages = ['AZ', 'EN', 'TR', 'RU']
  
  // Extract unique theatres correctly (fix duplicate bug)
  const theatres = [...new Set(theatreData?.map(item => item.theatreTitle))].filter(Boolean)

  // Filter logic incorporating all basic & advanced criteria
  const filteredMovies = data.filter(movie => {
    // Language
    if (lang !== 'DIL' && !movie.languages?.includes(lang)) return false

    // Theatre
    if (selectedTheatre !== 'Kinoteatr') {
      const shownInTheatre = theatreData.some(
        item => item.theatreTitle === selectedTheatre && item.movie.id === movie.id
      )
      if (!shownInTheatre) return false
    }

    // Date
    if (selectedDate) {
      const start = dayjs(movie.firstScreeningDate)
      const end = dayjs(movie.lastScreeningDate)
      const isScreening = selectedDate.isAfter(start.subtract(1, 'day')) && selectedDate.isBefore(end.add(1, 'day'))
      if (!isScreening) return false
    }

    // Name (Advanced Search)
    if (debouncedSearch && !movie.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false

    // Genre (Advanced Search)
    if (selectedGenre !== 'JANR' && !movie.genres?.some(g => g.title === selectedGenre)) return false

    // Year (Advanced Search)
    if (selectedYear !== 'IL' && movie.year !== parseInt(selectedYear)) return false

    // Rating (Advanced Search)
    if (movie.rating < selectedRating) return false

    return true
  })

  // Slicing for Pagination
  const indexOfLastMovie = currentPage * itemsPerPage
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie)
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage)

  // Trending Movies: Static high quality movies
  const trendingMovies = staticTrendingMovies

  // Best of this Week: Top 3 rated movies from database
  const bestOfTheWeek = [...data].sort((a, b) => b.rating - a.rating).slice(0, 3)

  // Categorized genres to show in Netflix style horizontal rows
  const selectedGenresToShow = genres.slice(0, 4)

  const clearAllFilters = () => {
    setLang('DIL')
    setTheatre('Kinoteatr')
    setSelectedDate(null)
    setSearchTerm('')
    setDebouncedSearch('')
    setSelectedGenre('JANR')
    setSelectedYear('IL')
    setSelectedRating(0)
  }

  return (
    <div className={`transition-colors duration-300 min-h-screen w-full overflow-x-hidden ${
      theme === 'light' ? 'bg-[#f5f5f7] text-neutral-850' : 'bg-[#1a1a1a] text-[#D9DADB]'
    }`}>
      {/* Home Header with Banner Slider & Navbar */}
      <Header />

      {/* Main Container */}
      <div className="py-[60px] px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-16 w-full overflow-hidden">
        
        {/* 1. TRENDING CAROUSEL */}
        <section className="flex flex-col gap-6 w-full overflow-hidden">
          <div className="flex items-center gap-3">
            <FaFire className="text-red-500 text-3xl animate-pulse" />
            <h2 className={`text-3xl font-extrabold tracking-wide uppercase ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Trend Filmlər</h2>
          </div>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 }
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            modules={[Navigation, Pagination, Autoplay]}
            className="trending-swiper pb-8 w-full"
          >
            {trendingMovies.map(movie => (
              <SwiperSlide key={movie.id}>
                <div className={`relative group overflow-hidden rounded-2xl transition-all duration-300 border mx-auto w-[280px] sm:w-full ${
                  theme === 'light' 
                    ? 'bg-white border-neutral-250 hover:shadow-2xl hover:shadow-neutral-300' 
                    : 'bg-[#2a2a2a] border-neutral-800 hover:shadow-2xl hover:shadow-red-950'
                }`}>
                  <img
                    src={movie.image}
                    alt={movie.name}
                    loading="lazy"
                    className="w-full h-[320px] sm:h-[380px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-500/90 text-black font-extrabold px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow-md backdrop-blur-sm z-10">
                    <FaStar /> {movie.rating}
                  </div>
                  {/* Title overlay */}
                  <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2 z-10">
                    <h3 className="text-xl font-bold text-white truncate">{movie.name}</h3>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{movie.year} • {movie.duration} dəq</span>
                      <Link to={`/movie/${movie.id}`} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-colors">Ətraflı</Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* 2. ADVANCED SEARCH & FILTER PANEL */}
        <section className={`p-4 sm:p-8 rounded-3xl border shadow-xl flex flex-col gap-6 w-full overflow-hidden transition-colors duration-300 ${
          theme === 'light' ? 'bg-white border-neutral-200 text-neutral-850' : 'bg-[#242424] border-neutral-800 text-[#D9DADB]'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
            theme === 'light' ? 'border-neutral-200' : 'border-neutral-800'
          }`}>
            <div className="flex items-center gap-3">
              <FaSearch className="text-red-500 text-2xl" />
              <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Qabaqcıl Axtarış və Filtrləmə</h2>
            </div>
            <button
              onClick={clearAllFilters}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl cursor-pointer transition-colors shadow-sm self-start sm:self-auto font-bold ${
                theme === 'light' 
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300' 
                  : 'bg-neutral-800 hover:bg-neutral-750 text-white'
              }`}
            >
              <FaTimes /> Təmizlə
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Real-time Name Search input */}
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-500' : 'text-gray-400'}`}>Film Adı ilə Axtar</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Məs: Hozu..."
                  className={`w-full p-3 pl-10 border rounded-xl focus:outline-none focus:border-red-500 transition-colors ${
                    theme === 'light' 
                      ? 'bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400' 
                      : 'bg-[#1e1e1e] border-neutral-700 text-white'
                  }`}
                />
                <FaSearch className="absolute left-3.5 top-4 text-gray-500" />
              </div>
            </div>

            {/* Genre filter */}
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-500' : 'text-gray-400'}`}>Janr Seçin</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:border-red-500 transition-colors cursor-pointer ${
                  theme === 'light' ? 'bg-neutral-50 border-neutral-300 text-black' : 'bg-[#1e1e1e] border-neutral-700 text-white'
                }`}
              >
                <option value="JANR">Bütün Janrlar</option>
                {genres.map((g, index) => (
                  <option key={index} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Year filter */}
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-500' : 'text-gray-400'}`}>Nümayiş İli</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:border-red-500 transition-colors cursor-pointer ${
                  theme === 'light' ? 'bg-neutral-50 border-neutral-300 text-black' : 'bg-[#1e1e1e] border-neutral-700 text-white'
                }`}
              >
                <option value="IL">Bütün İllər</option>
                {years.map((y, index) => (
                  <option key={index} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Language filter */}
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-500' : 'text-gray-400'}`}>Dil Seçin</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:border-red-500 transition-colors cursor-pointer ${
                  theme === 'light' ? 'bg-neutral-50 border-neutral-300 text-black' : 'bg-[#1e1e1e] border-neutral-700 text-white'
                }`}
              >
                <option value="DIL">Bütün Dillər</option>
                {languages.map((l, index) => (
                  <option key={index} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Theatre Selector */}
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-500' : 'text-gray-400'}`}>Kinoteatr</label>
              <select
                value={selectedTheatre}
                onChange={(e) => setTheatre(e.target.value)}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:border-red-500 transition-colors cursor-pointer ${
                  theme === 'light' ? 'bg-neutral-50 border-neutral-300 text-black' : 'bg-[#1e1e1e] border-neutral-700 text-white'
                }`}
              >
                <option value="Kinoteatr">Bütün Kinoteatrlar</option>
                {theatres.map((t, index) => (
                  <option key={index} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-500' : 'text-gray-400'}`}>Tarix seçin</label>
              <div className={`border rounded-xl px-2 py-1 ${
                theme === 'light' ? 'bg-neutral-50 border-neutral-300 text-black font-semibold' : 'bg-[#1e1e1e] border-neutral-700 text-white'
              }`}>
                <Datecomponent onDateChange={setSelectedDate} />
              </div>
            </div>

            {/* Rating range filter */}
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <div className="flex justify-between items-center text-sm">
                <span className={`font-semibold ${theme === 'light' ? 'text-neutral-500' : 'text-gray-400'}`}>Minimum Reytinq (IMDb)</span>
                <span className="text-yellow-500 font-extrabold text-base">{selectedRating.toFixed(1)}+</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={selectedRating}
                onChange={(e) => setSelectedRating(parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>0.0</span>
                <span>5.0</span>
                <span>10.0</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FILTER RESULTS CONTAINER */}
        <section className="flex flex-col gap-6 w-full overflow-hidden">
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold uppercase border-l-4 border-red-600 pl-3 ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Axtarış Nəticələri</h2>
            <p className={`text-sm ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Tapılan filmlərin sayı: <span className={`font-bold ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{filteredMovies.length}</span></p>
          </div>

          {filteredMovies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center">
                {currentMovies.map(movie => (
                  <div key={movie.id} className="w-full max-w-[304px]">
                    <Card {...movie} />
                  </div>
                ))}
              </div>

              {/* Pagination UI Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-8 sm:gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer select-none ${
                      currentPage === 1 
                        ? 'opacity-40 cursor-not-allowed text-neutral-500' 
                        : (theme === 'light' ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800' : 'bg-neutral-800 hover:bg-neutral-700 text-white')
                    }`}
                  >
                    Əvvəlki
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-red-650 text-white shadow-md shadow-red-950/20'
                          : (theme === 'light' 
                              ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800' 
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300')
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer select-none ${
                      currentPage === totalPages 
                        ? 'opacity-40 cursor-not-allowed text-neutral-500' 
                        : (theme === 'light' ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800' : 'bg-neutral-800 hover:bg-neutral-700 text-white')
                    }`}
                  >
                    Növbəti
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#242424] border border-dashed border-neutral-800 rounded-3xl text-center px-4">
              <FaSearch className="text-neutral-600 text-5xl mb-4" />
              <p className="text-lg text-neutral-400 font-semibold">Heç bir uyğun film tapılmadı.</p>
              <p className="text-sm text-neutral-500 mt-2">Daha geniş filtrləmə kriteriyalarından istifadə etməyi yoxlayın.</p>
            </div>
          )}
        </section>

        {/* 4. BEST OF THE WEEK (Bu həftənin ən yaxşıları) */}
        <section className="flex flex-col gap-6 w-full overflow-hidden">
          <div className="flex items-center gap-3">
            <FaStar className="text-yellow-500 text-3xl animate-pulse" />
            <h2 className={`text-3xl font-extrabold tracking-wide uppercase ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Bu Həftənin Ən Yaxşıları</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bestOfTheWeek.map((movie, index) => (
              <div 
                key={movie.id} 
                className={`relative border rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-center shadow-xl transition-all duration-300 w-full ${
                  theme === 'light' 
                    ? 'bg-white border-neutral-200 text-neutral-850 hover:shadow-neutral-350' 
                    : 'bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border-neutral-800 text-[#D9DADB] hover:shadow-yellow-950/20'
                }`}
              >
                {/* Custom Highlight Badge */}
                <div className="absolute top-4 left-4 bg-yellow-500 text-black font-extrabold w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10">
                  #{index + 1}
                </div>
                
                <img 
                  src={movie.image} 
                  alt={movie.name} 
                  loading="lazy"
                  className="w-[120px] h-[180px] object-cover rounded-2xl shadow-md flex-shrink-0"
                />
                
                <div className="flex flex-col gap-3 justify-between h-full w-full">
                  <div className="flex flex-col gap-1.5">
                    <h3 className={`text-xl font-bold mt-4 sm:mt-0 ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{movie.name}</h3>
                    <p className={`text-xs line-clamp-3 leading-relaxed ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>{movie.description}</p>
                  </div>
                  
                  <div className={`flex items-center justify-between border-t pt-3 ${theme === 'light' ? 'border-neutral-200' : 'border-neutral-800'}`}>
                    <span className="text-yellow-500 font-bold text-sm flex items-center gap-1">
                      <FaStar /> {movie.rating} / 10
                    </span>
                    <Link to={`/movie/${movie.id}`} className="text-xs text-red-500 hover:text-red-400 font-bold">İndi İzlə &rarr;</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CATEGORIZED GENRE SECTIONS (Netflix Row Style) */}
        <section className="flex flex-col gap-12 w-full overflow-hidden">
          {selectedGenresToShow.map(genreTitle => {
            const genreMovies = data.filter(m => m.genres?.some(g => g.title === genreTitle))
            if (genreMovies.length === 0) return null

            return (
              <div key={genreTitle} className="flex flex-col gap-6">
                <div className={`flex justify-between items-center border-b pb-2 ${theme === 'light' ? 'border-neutral-200' : 'border-neutral-800'}`}>
                  <h3 className={`text-2xl font-bold tracking-wide ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{genreTitle}</h3>
                  <span className="text-xs text-red-500 font-bold hover:underline cursor-pointer">Hamısına Bax</span>
                </div>
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-transparent">
                  {genreMovies.map(movie => (
                    <div key={movie.id} className="w-[140px] sm:w-[200px] md:w-[240px] flex-shrink-0 hover:scale-[1.02] transition-transform duration-300">
                      <Card {...movie} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </section>

      </div>
    </div>
  )
}

export default Main
