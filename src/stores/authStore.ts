import { create } from 'zustand'

import { loginApi, meApi, registerApi } from '../features/auth/api/authApi'
import type { LoginRequest, RegisterRequest, User } from '../types/auth'

type AuthState = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (payload: LoginRequest) => Promise<void>
  register: (payload: RegisterRequest) => Promise<void>
  loadMe: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: Boolean(localStorage.getItem('accessToken')),
  isLoading: false,

  login: async (payload) => {
    set({ isLoading: true })

    try {
      const response = await loginApi(payload)

      localStorage.setItem('accessToken', response.data.access_token)
      localStorage.setItem('refreshToken', response.data.refresh_token)

      set({
        user: response.data.user,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (payload) => {
    set({ isLoading: true })

    try {
      await registerApi(payload)
      set({ isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  loadMe: async () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (!accessToken) {
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      })
      return
    }

    set({ isLoading: true })

    try {
      const response = await meApi()

      set({
        user: response.data,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },
}))