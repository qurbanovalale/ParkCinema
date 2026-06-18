const BASE_URL = import.meta.env.VITE_BASE_URL
import axios from "axios"
import movieInstance from "../src/api/axiosInstance"

const getAllMovies = async () =>{
    try {
        const res = await fetch(`${BASE_URL}/movies`)
        if (!res.ok) {
            throw new Error("Error fetch process")
        }
        const movies = await res.json()
        return movies
    } catch (error) {
        console.log(error.message || "ERRORRRR");
        
    }
}
const getMovieByid = async (id) =>{
    try {
        const res = await fetch(`${BASE_URL}/movies/${id}`)
        if (!res.ok) {
            throw new Error("Error fetch process")
        }
        const movies = await res.json()
        return movies
    } catch (error) {
        console.log(error.message || "ERRORRRR");
        
    }
}

const getAllTheatres = async () =>{
    try {
        const res = await movieInstance.get(`/theatre`)
        const data =  res.data
        return data
    } catch (error) {
          console.log(error.message || "ERRORRRR");
    }
}
const createNewMovie = async (NewMovie) => {
    try {
        const res = await movieInstance.post(`/movies`, NewMovie)
        const data =  res.data
        return data
    } catch (error) {
          console.log(error.message || "ERRORRRR");
    }
}
const editNewMovie = async (id, movie) => {
    try {
        const res = await movieInstance.patch(`/movies/${id}`, movie)
        const data =  res.data
        return data
    } catch (error) {
          console.log(error.message || "ERRORRRR");
    }
}
const deleteMovieById = async (id) => {
    try {
        const res = await movieInstance.delete(`/movies/${id}`)
        const data =  res.data
        return data
    } catch (error) {
          console.log(error.message || "ERRORRRR");
    }
}

export{
    getAllMovies,
    getMovieByid,
    getAllTheatres,
    createNewMovie,
    editNewMovie,
    deleteMovieById
}