import { defineStore } from 'pinia'
import api from '../plugins/axios'

export const useCoffeesStore = defineStore('coffees', {
  state: () => ({
    coffees: [],
    loading: false,
    error: null,
    filters: {
      brand: '',
      priceOrder: '',
    },
  }),

  actions: {
    async fetchCoffees(params = {}) {
      this.loading = true
      this.error = null
      try {
        const query = {
          brand: this.filters.brand || undefined,
          price_order: this.filters.priceOrder || undefined,
          ...params,
        }
        const { data } = await api.get('/api/coffees', { params: query })
        this.coffees = data?.data || data || []
      } catch (error) {
        this.error = error?.response?.data?.message || 'No se pudo cargar el catalogo'
      } finally {
        this.loading = false
      }
    },

    async createCoffee(payload) {
      this.loading = true
      this.error = null
      try {
        const isFormData = payload instanceof FormData
        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
        const { data } = await api.post('/api/coffees', payload, config)
        const coffee = data?.data || data
        if (coffee) this.coffees.unshift(coffee)
        return { ok: true }
      } catch (error) {
        const msg = error?.response?.data?.message || 'No se pudo crear el cafe'
        this.error = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async updateCoffee(id, payload) {
      this.loading = true
      this.error = null
      try {
        const isFormData = payload instanceof FormData
        if (isFormData && !payload.has('_method')) {
          payload.append('_method', 'PUT')
        }

        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
        const request = isFormData
          ? api.post(`/api/coffees/${id}`, payload, config)
          : api.put(`/api/coffees/${id}`, payload, config)

        const { data } = await request
        const coffee = data?.data || data
        this.coffees = this.coffees.map((c) => (c.id === id ? coffee : c))
        return { ok: true }
      } catch (error) {
        const msg = error?.response?.data?.message || 'No se pudo actualizar el cafe'
        this.error = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async deleteCoffee(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/api/coffees/${id}`)
        this.coffees = this.coffees.map((c) => (c.id === id ? { ...c, is_active: false } : c))
        return { ok: true }
      } catch (error) {
        const msg = error?.response?.data?.message || 'No se pudo desactivar el cafe'
        this.error = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async fetchCoffee(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get(`/api/coffees/${id}`)
        const coffee = data?.data || data
        if (coffee) {
          const idx = this.coffees.findIndex((c) => c.id === coffee.id)
          if (idx >= 0) this.coffees[idx] = coffee
          else this.coffees.push(coffee)
        }
        return coffee
      } catch (error) {
        this.error = error?.response?.data?.message || 'No se pudo cargar el cafe'
        return null
      } finally {
        this.loading = false
      }
    },
  },
})
