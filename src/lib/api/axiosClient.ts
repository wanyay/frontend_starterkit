import { useAuthStore } from "@/features/auth/stores/auth-store"
import axios from "axios"

const axiosClient = axios.create({
   baseURL: import.meta.env.VITE_API_URL || "https://api.example.com",
   withCredentials: true,
   headers: {
     "Content-Type": "application/json",
   },
})

axiosClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().auth?.token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

axiosClient.interceptors.response.use(
   (response) => response,
   (error) => {
     return Promise.reject(error)
   }
)

export default axiosClient