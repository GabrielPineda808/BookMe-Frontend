import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

const base_url = "http://localhost:8080"

const api = axios.create({
    baseURL: base_url,
    headers: {"Content-Type":"application/json"}
})


api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("accessToken");
        if(token && config.headers){
            config.headers.Authorization = `Bearer ${token}`
        }
    } catch (error) {
        
    }
    return config;
})

// response interceptor: if 401 => remove token and reload to send user to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem("accessToken");
      } catch {}

      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(error);
  }
);

export default api;
