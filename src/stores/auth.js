import { defineStore } from 'pinia'
import api from '../plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user && state.token),
    isAdmin: (state) => state.user?.roles?.some((role) => role.name === 'admin'),
    isClient: (state) => state.user?.roles?.some((role) => role.name === 'client'),
  },

  actions: {
    setAuthHeader(token) {
      if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      else delete api.defaults.headers.common['Authorization']
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.error = null
      localStorage.removeItem('token')
      this.setAuthHeader(null)
    },

    async register(name, email, password) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/api/auth/register', { name, email, password })
        this.token = data.token
        localStorage.setItem('token', data.token)
        this.setAuthHeader(data.token)
        this.user = data.user
        return { ok: true }
      } catch (error) {
        const msg = error?.response?.data?.message || 'Error al registrar'
        this.error = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/api/auth/login', { email, password })
        this.token = data.token
        localStorage.setItem('token', data.token)
        this.setAuthHeader(data.token)
        this.user = data.user
        return { ok: true }
      } catch (error) {
        const msg = error?.response?.data?.message || 'Error al iniciar sesion'
        this.error = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async getUser() {
      if (!this.token || this.user) return
      this.setAuthHeader(this.token)
      this.loading = true
      try {
        const { data } = await api.get('/api/me')
        // El endpoint /me devuelve el usuario autenticado con roles para reconstruir permisos tras refresh
        this.user = data?.data || data || null
      } catch {
        this.clearAuth()
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        if (this.token) await api.post('/api/auth/logout')
      } catch {
        // si falla la revocacion solo limpiamos front
      }
      this.clearAuth()
    },
  },
})
