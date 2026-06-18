import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { MovieContext } from '../Context/DataContext'
import { Link } from 'react-router-dom'
import { FaFilm, FaEye, FaCheckCircle, FaChartPie, FaChartBar, FaTrash, FaBookmark, FaFolderPlus, FaPlus, FaStar } from 'react-icons/fa'

function Profile() {
  const { theme } = useContext(MovieContext)
  const [watchlist, setWatchlist] = useState({})
  const [collections, setCollections] = useState({})
  const [activeTab, setActiveTab] = useState('ALL')
  const [newCollectionName, setNewCollectionName] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    wantToWatch: 0,
    watching: 0,
    watched: 0,
    genres: {},
    monthlyTrend: {}
  })

  // Load watchlist and collections on mount
  useEffect(() => {
    const stored = localStorage.getItem('parkcinema_watchlist')
    if (stored) {
      const list = JSON.parse(stored)
      setWatchlist(list)
      calculateStats(list)
    }

    const storedCollections = localStorage.getItem('parkcinema_collections')
    if (storedCollections) {
      setCollections(JSON.parse(storedCollections))
    }
  }, [])

  const calculateStats = (list) => {
    const movies = Object.values(list)
    const total = movies.length
    const wantToWatch = movies.filter(m => m.status === 'WANT_TO_WATCH').length
    const watching = movies.filter(m => m.status === 'WATCHING').length
    const watched = movies.filter(m => m.status === 'WATCHED').length

    // Genre distribution (from WATCHED movies)
    const genresCount = {}
    movies.filter(m => m.status === 'WATCHED').forEach(movie => {
      movie.genres?.forEach(g => {
        genresCount[g.title] = (genresCount[g.title] || 0) + 1
      })
    })

    // Monthly Trend (from all watchlist updates, grouped by month)
    const monthlyCount = {}
    movies.forEach(movie => {
      if (movie.updatedAt) {
        const date = new Date(movie.updatedAt)
        const monthYear = date.toLocaleDateString('az-AZ', { month: 'short', year: '2-digit' })
        monthlyCount[monthYear] = (monthlyCount[monthYear] || 0) + 1
      }
    })

    setStats({
      total,
      wantToWatch,
      watching,
      watched,
      genres: genresCount,
      monthlyTrend: monthlyCount
    })
  }

  const removeFromWatchlist = (id) => {
    const stored = localStorage.getItem('parkcinema_watchlist')
    let list = stored ? JSON.parse(stored) : {}
    delete list[id]
    localStorage.setItem('parkcinema_watchlist', JSON.stringify(list))
    setWatchlist(list)
    calculateStats(list)
  }

  // Create Collection
  const createNewCollection = (e) => {
    e.preventDefault()
    if (!newCollectionName.trim()) return
    
    const colName = newCollectionName.trim()
    const stored = localStorage.getItem('parkcinema_collections') || '{}'
    let parsed = JSON.parse(stored)
    
    if (!parsed[colName]) {
      parsed[colName] = []
      localStorage.setItem('parkcinema_collections', JSON.stringify(parsed))
      setCollections(parsed)
      setNewCollectionName('')
    } else {
      alert("Bu adda kolleksiya artıq mövcuddur!")
    }
  }

  // Delete Collection
  const deleteCollection = (colName) => {
    if (window.confirm(`"${colName}" kolleksiyasını silmək istədiyinizdən əminsinizmi?`)) {
      const stored = localStorage.getItem('parkcinema_collections') || '{}'
      let parsed = JSON.parse(stored)
      delete parsed[colName]
      localStorage.setItem('parkcinema_collections', JSON.stringify(parsed))
      setCollections(parsed)
    }
  }

  // Remove Movie From Collection
  const removeMovieFromCollection = (colName, movieId) => {
    const stored = localStorage.getItem('parkcinema_collections') || '{}'
    let parsed = JSON.parse(stored)
    if (parsed[colName]) {
      parsed[colName] = parsed[colName].filter(m => m.id !== movieId)
      localStorage.setItem('parkcinema_collections', JSON.stringify(parsed))
      setCollections(parsed)
    }
  }

  const watchlistArray = Object.values(watchlist)
  const filteredList = watchlistArray.filter(movie => {
    if (activeTab === 'ALL') return true
    return movie.status === activeTab
  })

  const tabLabels = [
    { key: 'ALL', label: 'Hamısı', count: stats.total },
    { key: 'WANT_TO_WATCH', label: 'İzləmək istəyirəm', count: stats.wantToWatch },
    { key: 'WATCHING', label: 'İzləyirəm', count: stats.watching },
    { key: 'WATCHED', label: 'İzlədim', count: stats.watched },
    { key: 'COLLECTIONS', label: 'Kolleksiyalarım', count: Object.keys(collections).length }
  ]

  // Render SVG Donut Chart for Genres
  const renderGenreChart = () => {
    const genreData = Object.entries(stats.genres)
    if (genreData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-neutral-500 italic text-sm">
          İzlənilən filmlərə əsasən janr statistikası qurulur.
        </div>
      )
    }

    const totalWatchedGenres = genreData.reduce((acc, [_, count]) => acc + count, 0)
    const colors = ['#e50914', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#06b6d4']
    
    // Donut configuration (r = 50, C = 314.16)
    const radius = 50
    const circumference = 2 * Math.PI * radius
    let accumulatedPercent = 0

    return (
      <div className="flex flex-col sm:flex-row items-center gap-8 justify-around py-4">
        {/* SVG Circle */}
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
            <circle cx="60" cy="60" r={radius} fill="transparent" stroke={theme === 'light' ? '#e5e5e5' : '#262626'} strokeWidth="12" />
            {genreData.map(([genre, count], index) => {
              const share = count / totalWatchedGenres
              const strokeDasharray = `${share * circumference} ${circumference}`
              const strokeDashoffset = -accumulatedPercent * circumference
              accumulatedPercent += share
              const color = colors[index % colors.length]

              return (
                <circle
                  key={genre}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              )
            })}
          </svg>
          {/* Centered Total Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-2xl font-black ${theme === 'light' ? 'text-black' : 'text-white'}`}>{stats.watched}</span>
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">İzlənib</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          {genreData.map(([genre, count], index) => {
            const percent = ((count / totalWatchedGenres) * 100).toFixed(0)
            const color = colors[index % colors.length]
            return (
              <div key={genre} className="flex items-center gap-3 text-sm">
                <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
                <span className={`font-semibold ${theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'}`}>{genre}</span>
                <span className="text-neutral-500 text-xs">({count} film - {percent}%)</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render SVG Bar Chart for Monthly Trend
  const renderMonthlyChart = () => {
    const trendData = Object.entries(stats.monthlyTrend)
    if (trendData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-neutral-500 italic text-sm">
          Aylıq aktivlik statistikası qurulur.
        </div>
      )
    }

    const maxCount = Math.max(...trendData.map(([_, count]) => count), 1)
    const barHeight = 80 // max height of bars in SVG
    const colors = ['#e50914', '#3b82f6', '#22c55e']

    return (
      <div className="flex flex-col items-center py-4 w-full">
        <svg viewBox="0 0 300 120" className="w-full max-w-lg h-48">
          {/* Horizontal lines */}
          <line x1="20" y1="10" x2="280" y2="10" stroke={theme === 'light' ? '#e5e5e5' : '#262626'} strokeDasharray="4" />
          <line x1="20" y1="50" x2="280" y2="50" stroke={theme === 'light' ? '#e5e5e5' : '#262626'} strokeDasharray="4" />
          <line x1="20" y1="90" x2="280" y2="90" stroke={theme === 'light' ? '#e5e5e5' : '#262626'} strokeDasharray="4" />

          {trendData.map(([month, count], index) => {
            const x = 40 + index * 60
            const height = (count / maxCount) * barHeight
            const y = 90 - height

            return (
              <g key={month} className="group">
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width="20"
                  height={height}
                  fill={colors[index % colors.length]}
                  rx="4"
                  className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                />
                {/* Hover count tooltip */}
                <text
                  x={x + 10}
                  y={y - 6}
                  fill={theme === 'light' ? 'black' : 'white'}
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {count}
                </text>
                {/* Month Label */}
                <text
                  x={x + 10}
                  y="105"
                  fill="#737373"
                  fontSize="8"
                  fontWeight="semibold"
                  textAnchor="middle"
                >
                  {month}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    )
  }

  return (
    <div className={`transition-colors duration-300 min-h-screen pb-20 w-full overflow-x-hidden ${
      theme === 'light' ? 'bg-[#f5f5f7] text-neutral-850' : 'bg-[#141414] text-white'
    }`}>
      {/* Navbar Container */}
      <div className={`relative h-20 border-b w-full mb-8 ${theme === 'light' ? 'bg-white/80 border-neutral-200' : 'bg-black/40 border-neutral-900'}`}>
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col gap-12 w-full overflow-hidden">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-wider uppercase ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Şəxsi Profilim</h1>
            <p className={`text-sm mt-1.5 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>İzləmə siyahınız və şəxsi kinoteatr statistikanız</p>
          </div>
        </div>

        {/* 1. STATISTICS DASHBOARD PANEL */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card stats summaries */}
          <div className="flex flex-col gap-6">
            <div className={`p-6 rounded-3xl border flex items-center gap-5 shadow-lg ${
              theme === 'light' ? 'bg-white border-neutral-200 shadow-neutral-200' : 'bg-[#1e1e1e] border-neutral-800'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center text-xl">
                <FaBookmark />
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Cəmi Siyahıda</h3>
                <p className={`text-3xl font-black mt-1 ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{stats.total}</p>
              </div>
            </div>
            
            <div className={`p-6 rounded-3xl border flex items-center gap-5 shadow-lg ${
              theme === 'light' ? 'bg-white border-neutral-200 shadow-neutral-200' : 'bg-[#1e1e1e] border-neutral-800'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center text-xl">
                <FaEye />
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>İzləyirəm</h3>
                <p className={`text-3xl font-black mt-1 ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{stats.watching}</p>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border flex items-center gap-5 shadow-lg ${
              theme === 'light' ? 'bg-white border-neutral-200 shadow-neutral-200' : 'bg-[#1e1e1e] border-neutral-800'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center text-xl">
                <FaCheckCircle />
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>İzləmişəm (Tamamlandı)</h3>
                <p className={`text-3xl font-black mt-1 ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{stats.watched}</p>
              </div>
            </div>
          </div>

          {/* SVG Pie Chart for genres */}
          <div className={`p-6 rounded-3xl border shadow-lg flex flex-col gap-4 ${
            theme === 'light' ? 'bg-white border-neutral-200' : 'bg-[#1e1e1e] border-neutral-800'
          }`}>
            <h3 className={`text-lg font-bold flex items-center gap-2 border-b pb-3 ${
              theme === 'light' ? 'text-neutral-900 border-neutral-200' : 'text-white border-neutral-800'
            }`}>
              <FaChartPie className="text-red-500" /> Ən Çox İzlənən Janrlar
            </h3>
            {renderGenreChart()}
          </div>

          {/* SVG Bar Chart for monthly trend */}
          <div className={`p-6 rounded-3xl border shadow-lg flex flex-col gap-4 ${
            theme === 'light' ? 'bg-white border-neutral-200' : 'bg-[#1e1e1e] border-neutral-800'
          }`}>
            <h3 className={`text-lg font-bold flex items-center gap-2 border-b pb-3 ${
              theme === 'light' ? 'text-neutral-900 border-neutral-200' : 'text-white border-neutral-800'
            }`}>
              <FaChartBar className="text-red-500" /> Aylıq İzləmə Trendi
            </h3>
            {renderMonthlyChart()}
          </div>
        </section>

        {/* 2. WATCHLIST SECTION WITH TABS */}
        <section className="flex flex-col gap-6">
          <div className={`border-b flex flex-wrap gap-2 md:gap-4 pb-1 ${
            theme === 'light' ? 'border-neutral-200' : 'border-neutral-850'
          }`}>
            {tabLabels.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 px-3.5 text-sm md:text-base font-bold transition-all relative cursor-pointer ${
                  activeTab === tab.key 
                    ? 'text-red-500 font-extrabold' 
                    : theme === 'light' 
                      ? 'text-neutral-500 hover:text-neutral-850' 
                      : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab.label} <span className="text-xs text-neutral-500 ml-0.5">({tab.count})</span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab !== 'COLLECTIONS' ? (
            /* Standard Watchlists display */
            filteredList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center w-full">
                {filteredList.map(movie => (
                  <div key={movie.id} className="relative group w-full max-w-[304px]">
                    {/* Delete button from watchlist */}
                    <button
                      onClick={() => removeFromWatchlist(movie.id)}
                      title="Siyahıdan Sil"
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 p-1.5 sm:p-2.5 bg-black/60 hover:bg-red-600 hover:text-white text-neutral-400 rounded-full transition-all backdrop-blur-md shadow-md cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100"
                    >
                      <FaTrash className="text-[10px] sm:text-sm" />
                    </button>

                    <Card {...movie} />

                    {/* Watch status label under card */}
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-wider rounded-full shadow-md bg-neutral-900/90 text-neutral-300 border border-neutral-800 backdrop-blur-sm">
                      {movie.status === 'WANT_TO_WATCH' && (
                        <>
                          <span className="inline sm:hidden">İzləyəcəm</span>
                          <span className="hidden sm:inline">İzləmək istəyirəm</span>
                        </>
                      )}
                      {movie.status === 'WATCHING' && 'İzləyirəm'}
                      {movie.status === 'WATCHED' && 'İzlədim'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl text-center px-4 ${
                theme === 'light' ? 'bg-white border-neutral-300' : 'bg-[#1e1e1e] border-neutral-800'
              }`}>
                <FaFilm className="text-neutral-500 text-5xl mb-4" />
                <p className={`text-lg font-semibold ${theme === 'light' ? 'text-neutral-700' : 'text-neutral-400'}`}>Siyahı boşdur.</p>
                <p className="text-sm text-neutral-500 mt-2">Hər hansı filmin ətraflı məlumat səhifəsinə daxil olaraq onu siyahınıza əlavə edə bilərsiniz.</p>
              </div>
            )
          ) : (
            /* Custom Collections display */
            <div className="flex flex-col gap-8 w-full">
              {/* Create Collection Form */}
              <form onSubmit={createNewCollection} className="flex gap-4 max-w-md w-full">
                <input
                  type="text"
                  placeholder="Kolleksiya adı daxil edin..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className={`flex-1 p-3 border rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm font-semibold ${
                    theme === 'light' ? 'bg-white border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-800 text-white'
                  }`}
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-red-950/20"
                >
                  <FaPlus /> Yarat
                </button>
              </form>

              {/* Collections Grid */}
              {Object.keys(collections).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {Object.entries(collections).map(([colName, colMovies]) => (
                    <div key={colName} className={`p-4 sm:p-6 rounded-3xl border shadow-md flex flex-col gap-4 ${
                      theme === 'light' ? 'bg-white border-neutral-200' : 'bg-[#1e1e1e] border-neutral-800'
                    }`}>
                      <div className="flex justify-between items-center border-b pb-3 border-neutral-800 mb-2">
                        <h4 className={`text-xl font-bold text-red-500`}>{colName}</h4>
                        <button 
                          onClick={() => deleteCollection(colName)}
                          className="text-neutral-500 hover:text-red-500 transition-colors text-sm cursor-pointer flex items-center gap-1 font-semibold"
                        >
                          <FaTrash /> Kolleksiyanı Sil
                        </button>
                      </div>

                      {colMovies.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                          {colMovies.map(movie => (
                            <div key={movie.id} className={`relative group p-2.5 rounded-2xl border flex flex-col gap-2 ${
                              theme === 'light' ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-neutral-850'
                            }`}>
                              <img src={movie.image} className="w-full h-32 object-cover rounded-xl shadow" alt="" />
                              <div className="flex justify-between items-center gap-2 mt-1">
                                <span className={`text-xs font-bold truncate block ${theme === 'light' ? 'text-black' : 'text-white'}`}>{movie.name}</span>
                                <span className="text-[10px] text-yellow-500 flex items-center gap-0.5 flex-shrink-0"><FaStar /> {movie.rating}</span>
                              </div>
                              <button 
                                onClick={() => removeMovieFromCollection(colName, movie.id)}
                                className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-red-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow"
                                title="Kolleksiyadan sil"
                              >
                                <FaTrash className="text-[9px]" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-500 italic">Bu kolleksiya hələ boşdur. Filmləri əlavə etmək üçün film səhifələrindən istifadə edin.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl text-center px-4 ${
                  theme === 'light' ? 'bg-white border-neutral-300' : 'bg-[#1e1e1e] border-neutral-800'
                }`}>
                  <FaFolderPlus className="text-neutral-500 text-5xl mb-4" />
                  <p className={`text-lg font-semibold ${theme === 'light' ? 'text-neutral-700' : 'text-neutral-400'}`}>Kolleksiyanız yoxdur.</p>
                  <p className="text-sm text-neutral-500 mt-2">İlk şəxsi kolleksiyanızı yaratmaq üçün yuxarıdakı formadan istifadə edin.</p>
                </div>
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

export default Profile
