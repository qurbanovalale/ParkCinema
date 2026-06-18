import axios from "axios";

const movieInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers :{
        "Content-Type" : 'application/json'
    },
    timeout : 2000
})
export default movieInstance
