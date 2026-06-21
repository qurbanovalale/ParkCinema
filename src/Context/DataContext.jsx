import React, { Children, createContext, useEffect, useState } from 'react'
import { getAllMovies, getAllTheatres } from '../../Services/MovieServices'

export const MovieContext = createContext()

function DataContext({ children }) {

    const [data, setdata] = useState([])
    const [ theatreData, setTheatreData] = useState([])
    const [error, setError] = useState(null)
    const [loader, setLoader] = useState(true)
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('parkcinema_theme') || 'dark';
    })

    const toggleTheme = () => {
        setTheme(prev => {
            const next = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('parkcinema_theme', next);
            return next;
        })
    }

    useEffect(() => {
        getAllMovies()
            .then(item => {
                const enrichedItem = item?.map(movie => {
                    const codeSum = movie.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const rating = movie.rating || parseFloat((6.5 + (codeSum % 31) / 10).toFixed(1));
                    const imdbLink = movie.imdbLink || `https://www.imdb.com/find?q=${encodeURIComponent(movie.name)}`;
                    return {
                        ...movie,
                        rating,
                        imdbLink,
                    };
                }) || [];
                setdata(enrichedItem)
            })
            .catch(err => setError(err))
            .finally(() => setLoader(false))

        getAllTheatres()
            .then(item => {
                const enrichedTheatres = item?.map(t => {
                    if (t.movie) {
                        const codeSum = t.movie.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const rating = t.movie.rating || parseFloat((6.5 + (codeSum % 31) / 10).toFixed(1));
                        const imdbLink = t.movie.imdbLink || `https://www.imdb.com/find?q=${encodeURIComponent(t.movie.name)}`;
                        return {
                            ...t,
                            movie: {
                                ...t.movie,
                                rating,
                                imdbLink,
                            }
                        };
                    }
                    return t;
                }) || [];
                setTheatreData(enrichedTheatres)
            })

    }, [])
    console.log(theatreData)

    const obj = {
        data, theatreData, error, loader , setdata, theme, toggleTheme
    }
    return (
        <>
            <MovieContext.Provider value={obj}>
                {children}
            </MovieContext.Provider>
        </>
    )
}

export default DataContext
