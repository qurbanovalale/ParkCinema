import React, { useContext, useState } from 'react'
import { MovieContext } from '../Context/DataContext'
import Loader from './Loader'
import { createNewMovie, deleteMovieById, editNewMovie } from '../../Services/MovieServices'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { FaTrash, FaEdit, FaPlus, FaArrowLeft, FaMoon, FaSun, FaStar } from 'react-icons/fa'

function Admin() {
  const { data, loader, setdata, theme, toggleTheme } = useContext(MovieContext)
  const [popUp, SetpopUp] = useState({
    status: false,
    method: 'post'
  })
  const [newMovie, setNewMovie] = useState({
    name: '',
    description: '',
    image: '',
    year: '',
    languages: '',
    rating: '',
    imdbLink: ''
  })

  if (loader) {
    return <Loader />
  }

  function HandleValues(e) {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value })
  }

  function HandlePost() {
    if (!newMovie.name || !newMovie.description || !newMovie.image || !newMovie.year || !newMovie.languages) {
      toast.error("Zəhmət olmasa bütün tələb olunan xanaları doldurun!")
      return
    }

    const langsArray = typeof newMovie.languages === 'string'
      ? newMovie.languages.split(',').map(l => l.trim()).filter(Boolean)
      : newMovie.languages;

    const movieToSave = {
      ...newMovie,
      languages: langsArray,
      rating: newMovie.rating ? parseFloat(newMovie.rating) : null,
      imdbLink: newMovie.imdbLink || null
    }

    if (popUp.method == 'post') {
      createNewMovie(movieToSave)
        .then(item => {
          const enrichedItem = {
            ...item,
            rating: item.rating || parseFloat(movieToSave.rating) || 7.5,
            imdbLink: item.imdbLink || movieToSave.imdbLink || `https://www.imdb.com/find?q=${encodeURIComponent(item.name)}`
          };
          toast.success('Film uğurla yaradıldı!')
          SetpopUp({ ...popUp, status: false })
          setNewMovie({
            name: '',
            description: '',
            image: '',
            year: '',
            languages: '',
            rating: '',
            imdbLink: ''
          })
          setdata([...data, enrichedItem])
        });
    } else if (popUp.method == 'edit') {
      editNewMovie(newMovie.id, movieToSave)
        .then(item => {
          const enrichedItem = {
            ...item,
            rating: item.rating || parseFloat(movieToSave.rating) || 7.5,
            imdbLink: item.imdbLink || movieToSave.imdbLink || `https://www.imdb.com/find?q=${encodeURIComponent(item.name)}`
          };
          toast.success('Film uğurla dəyişdirildi!')
          SetpopUp({ ...popUp, status: false })
          setNewMovie({
            name: '',
            description: '',
            image: '',
            year: '',
            languages: '',
            rating: '',
            imdbLink: ''
          })
          setdata(data.map(m => m.id === newMovie.id ? enrichedItem : m))
        });
    }
  }

  function handleInps(id) {
    SetpopUp({ ...popUp, status: true, method: 'edit' })
    const findedMovie = data.find(item => item.id == id)
    setNewMovie({
      ...findedMovie,
      languages: findedMovie.languages ? findedMovie.languages.join(', ') : '',
      rating: findedMovie.rating || '',
      imdbLink: findedMovie.imdbLink || ''
    })
  }

  async function handleDelete(id) {
    if (window.confirm("Bu filmi silmək istədiyinizdən əminsinizmi?")) {
      const deletedData = data.filter(item => item.id != id)
      await deleteMovieById(id)
        .then(() => {
          toast.success("Film uğurla silindi!")
        })
      setdata(deletedData)
    }
  }

  return (
    <div className={`transition-colors duration-300 min-h-screen pb-20 w-full ${
      theme === 'light' ? 'bg-[#f5f5f7] text-neutral-850' : 'bg-[#141414] text-white'
    }`}>
      
      {/* ADMIN HEADER */}
      <div className={`border-b w-full px-6 md:px-12 py-5 flex justify-between items-center ${
        theme === 'light' ? 'bg-white border-neutral-200 shadow-sm' : 'bg-black/40 border-neutral-900 shadow'
      }`}>
        <div className="flex items-center gap-4">
          <Link to="/" className={`p-2.5 rounded-xl border flex items-center gap-2 text-sm font-semibold transition-all ${
            theme === 'light' ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-white'
          }`}>
            <FaArrowLeft /> Ana Səhifə
          </Link>
          <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase">Admin Paneli</h1>
        </div>
        
        <button 
          onClick={toggleTheme}
          className={`p-2.5 rounded-full flex items-center justify-center cursor-pointer transition-all ${
            theme === 'light' 
              ? 'bg-neutral-200 hover:bg-neutral-300 text-black shadow' 
              : 'bg-neutral-800 hover:bg-neutral-700 text-yellow-400'
          }`}
          title={theme === 'light' ? "Kino Qaranlıq Rejim" : "Aydınlıq Rejim"}
        >
          {theme === 'light' ? <FaMoon size={16} /> : <FaSun size={16} />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-8 flex flex-col gap-6 w-full overflow-hidden">
        
        {/* ADD POPUP MODAL */}
        <div className={`inset-0 p-3 bg-black/60 fixed ${popUp.status ? 'flex' : 'hidden'} justify-center items-center z-50 backdrop-blur-sm`}>
          <div className={`flex flex-col p-6 rounded-3xl gap-4 border w-full max-w-[600px] shadow-2xl relative transition-all duration-300 ${
            theme === 'light' ? 'bg-white border-neutral-200 text-neutral-800' : 'bg-[#1e1e1e] border-neutral-800 text-white'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-neutral-800">
              <h2 className="text-xl font-bold">
                {popUp.method == 'post' ? "Yeni Film Əlavə Et" : "Filmi Redaktə Et"}
              </h2>
              <button 
                onClick={() => SetpopUp({ ...popUp, status: false })} 
                type="button" 
                className="px-4 py-2 font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors text-xs"
              >
                Bağla
              </button>
            </div>
            
            <input value={newMovie.name} onChange={HandleValues} name='name' type="text" placeholder='Film Adı' className={`p-3 border rounded-xl w-full text-sm ${
              theme === 'light' ? 'bg-neutral-55 border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-800 text-white'
            }`} />
            <input value={newMovie.image} onChange={HandleValues} name='image' type="text" placeholder='Şəkil URL (Poster)' className={`p-3 border rounded-xl w-full text-sm ${
              theme === 'light' ? 'bg-neutral-55 border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-800 text-white'
            }`} />
            <input value={newMovie.languages} onChange={HandleValues} name='languages' type="text" placeholder='Dillər (Məs: AZ, EN, RU)' className={`p-3 border rounded-xl w-full text-sm ${
              theme === 'light' ? 'bg-neutral-55 border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-800 text-white'
            }`} />
            <input value={newMovie.description} onChange={HandleValues} name='description' type="text" placeholder='Açıqlama (Description)' className={`p-3 border rounded-xl w-full text-sm ${
              theme === 'light' ? 'bg-neutral-55 border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-800 text-white'
            }`} />
            <input value={newMovie.year} onChange={HandleValues} name='year' type="text" placeholder='Nümayiş İli' className={`p-3 border rounded-xl w-full text-sm ${
              theme === 'light' ? 'bg-neutral-55 border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-800 text-white'
            }`} />
            <input value={newMovie.rating} onChange={HandleValues} name='rating' type="text" placeholder='IMDb Reytinqi (Məs: 8.5)' className={`p-3 border rounded-xl w-full text-sm ${
              theme === 'light' ? 'bg-neutral-55 border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-800 text-white'
            }`} />
            <input value={newMovie.imdbLink} onChange={HandleValues} name='imdbLink' type="text" placeholder='IMDb Səhifə Linki' className={`p-3 border rounded-xl w-full text-sm ${
              theme === 'light' ? 'bg-neutral-55 border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-800 text-white'
            }`} />
            
            <button type="button" onClick={HandlePost} className="px-6 py-3 font-extrabold cursor-pointer rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors text-sm shadow-md shadow-red-950/20">
              {popUp.method == 'post' ? "Yarat" : "Dəyişiklikləri Yadda Saxla"}
            </button>
          </div>
        </div>

        {/* ADMIN CONTENT TABLE */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-lg flex flex-col gap-6 w-full ${
          theme === 'light' ? 'bg-white border-neutral-200' : 'bg-[#1e1e1e] border-neutral-800'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-xl font-bold uppercase border-l-4 border-red-600 pl-3">Filmlərin Siyahısı ({data.length})</h2>
            <button 
              onClick={() => SetpopUp({ ...popUp, status: true, method: 'post' })} 
              type="button" 
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md text-sm"
            >
              <FaPlus /> Yeni Film Əlavə Et
            </button>
          </div>

          <div className="overflow-x-auto w-full rounded-2xl border border-neutral-850">
            <table className="min-w-full text-sm text-left">
              <thead className={`text-xs uppercase tracking-wider font-extrabold ${
                theme === 'light' ? 'bg-neutral-100 text-neutral-700 border-b border-neutral-200' : 'bg-neutral-900 text-neutral-400 border-b border-neutral-800'
              }`}>
                <tr>
                  <th className="p-4">Poster</th>
                  <th className="p-4">Film Adı</th>
                  <th className="p-4">Dillər</th>
                  <th className="p-4">İl</th>
                  <th className="p-4">IMDb</th>
                  <th className="p-4 text-center">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {data.map(item => (
                  <tr key={item?.id} className={`transition-colors ${
                    theme === 'light' ? 'hover:bg-neutral-50/50 text-neutral-850' : 'hover:bg-neutral-900/50 text-neutral-300'
                  }`}>
                    <td className="p-4">
                      <img width={70} src={item?.image} className="rounded-xl shadow-md" alt="" />
                    </td>
                    <td className="p-4">
                      <p className="font-extrabold">{item?.name}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {item?.languages?.map((lang, index) => (
                          <span key={index} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold border border-neutral-700">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{item?.year}</td>
                    <td className="p-4">
                      <span className="text-yellow-500 font-black flex items-center gap-0.5"><FaStar /> {item?.rating}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => handleInps(item.id)} 
                          className={`p-2 rounded-xl transition-all cursor-pointer text-xs font-bold flex items-center gap-1 ${
                            theme === 'light' ? 'bg-neutral-100 hover:bg-neutral-200 text-blue-600' : 'bg-neutral-850 hover:bg-neutral-750 text-yellow-500'
                          }`}
                          title="Redaktə et"
                        >
                          <FaEdit /> Redaktə
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-2 rounded-xl bg-red-600/10 hover:bg-red-650 text-red-500 hover:text-white transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
                          title="Sil"
                        >
                          <FaTrash /> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Admin
