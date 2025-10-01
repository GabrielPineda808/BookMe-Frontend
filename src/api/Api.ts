import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

const base_url = "http://localhost:8080"

const api = axios.create({
    baseURL: base_url,
    headers: {"Content-Type":"application/json"}
})

api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("token");
        if(token && config.headers){
            config.headers.Authorization = `Bearer ${token}`
        }
    } catch (error) {
        
    }
    return config;
})

export default api;
