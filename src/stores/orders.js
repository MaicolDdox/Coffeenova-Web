import { defineStore } from 'pinia'
import api from '../plugins/axios'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMyOrders() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/api/orders')
        this.orders = data?.data || data || []
      } catch (error) {
        this.error = error?.response?.data?.message || 'No se pudieron cargar tus ordenes'
      } finally {
        this.loading = false
      }
    },

    async fetchMyOrder(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get(`/api/orders/${id}`)
        this.currentOrder = data?.data || data || null
      } catch (error) {
        this.error = error?.response?.data?.message || 'No se pudo cargar la orden'
      } finally {
        this.loading = false
      }
    },

    async fetchAllOrders(params = {}) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/api/admin/orders', { params })
        this.orders = data?.data || data || []
      } catch (error) {
        this.error = error?.response?.data?.message || 'No se pudieron cargar las ordenes'
      } finally {
        this.loading = false
      }
    },

    async fetchAdminOrder(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get(`/api/admin/orders/${id}`)
        // Los endpoints de admin devuelven el recurso en data.data
        this.currentOrder = data?.data || data || null
      } catch (error) {
        this.error = error?.response?.data?.message || 'No se pudo cargar el detalle'
      } finally {
        this.loading = false
      }
    },
  },
})
