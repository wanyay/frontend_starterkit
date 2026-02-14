import { useMutation } from '@tanstack/react-query'
import axiosClient from '@/lib/api/axiosClient'
import { useAuthStore } from '../stores/auth-store'

// Define proper interfaces
interface LoginPayload {
  username: string
  password: string
}

interface LoginResponse {
  message: string
  success: boolean
  data: {
    id: number
    name: string
    access_token: string
  }
}

export const useLogin = () => {
  const { auth } = useAuthStore()

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload: LoginPayload) => {
      const res = await axiosClient.post<LoginResponse>('/auth/login', payload)
      return res.data
    },

    onSuccess: (res) => {
      // Calculate expiration time 24 hours from now
      const exp = Date.now() + 24 * 60 * 60 * 1000

      // Update auth store
      auth.setUser({
        id: res.data.id,
        name: res.data.name,
        exp: exp,
      })

      auth.setToken(res.data.access_token)
    },
  })
}
