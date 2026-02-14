import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'token'
const USER = 'user'

interface AuthUser {
  exp: number
  id: number
  name: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    token: string
    setUser: (user: AuthUser | null) => void
    setToken: (token: string) => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''

  const getUserCookie = getCookie(USER)
  const initUser = getUserCookie ? JSON.parse(getUserCookie) : null

  return {
    auth: {
      user: initUser,

      token: initToken,

      setUser: (user) =>
        set((state) => {
          setCookie(USER, JSON.stringify(user))
          return { ...state, auth: { ...state.auth, user } }
        }),

      setToken: (token) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(token))
          return { ...state, auth: { ...state.auth, token } }
        }),

      resetToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, token: '' } }
        }),

      reset: () =>
        set((state) => {
          removeCookie(USER)
          removeCookie(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, token: '' },
          }
        }),
    },
  }
})
