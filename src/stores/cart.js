import { defineStore } from 'pinia'
import api from '../plugins/axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: { items: [], total_cart: 0 },
    loading: false,
    error: null,
    lastOrder: null,
  }),

  actions: {
    resolveCart(data) {
      return data?.data || data?.cart || data || { items: [], total_cart: 0 }
    },

    async fetchCart() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/api/cart')
        this.cart = this.resolveCart(data)
      } catch (error) {
        this.error = error?.response?.data?.message || 'No se pudo cargar el carrito'
      } finally {
        this.loading = false
      }
    },

    async addToCart(coffeeId, quantity = 1) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/api/cart/items', { coffee_id: coffeeId, quantity })
        this.cart = this.resolveCart(data)
        return { ok: true }
      } catch (error) {
        const msg = error?.response?.data?.message || 'No se pudo agregar al carrito'
        this.error = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async updateItem(itemId, quantity) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.put(`/api/cart/items/${itemId}`, { quantity })
        this.cart = this.resolveCart(data)
        return { ok: true }
      } catch (error) {
        const msg = error?.response?.data?.message || 'No se pudo actualizar el item'
        this.error = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async removeItem(itemId) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.delete(`/api/cart/items/${itemId}`)
        this.cart = this.resolveCart(data)
        return { ok: true }
      } catch (error) {
        const msg = error?.response?.data?.message || 'No se pudo eliminar el item'
        this.error = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async clearCart() {
      this.loading = true
      this.error = null
      try {
        await api.delete('/api/cart')
        this.cart = { items: [], total_cart: 0 }
        return { ok: true }
      } catch (error) {
        const msg = error?.response?.data?.message || 'No se pudo limpiar el carrito'
        this.error = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async checkout() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/api/cart/checkout')
        this.lastOrder = data?.data
          ? {
              order: data.data.order,
              items: data.data.items || [],
              user: data.data.user || null,
              message: data.message || 'Compra simulada exitosa',
            }
          : data
        await this.fetchCart()
        return { ok: true }
      } catch (error) {
        const msg = error?.response?.data?.message || 'No se pudo finalizar la compra'
        this.error = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },
  },
})
