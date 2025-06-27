import axios from 'axios'

export const axiosinstance = axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials:true,
})