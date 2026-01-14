<template>
  <AdminLayout>
    <div class="space-y-6">
      <SectionTitle title="Mis pedidos" eyebrow="Historial" />

      <div class="rounded-2xl border border-[#e2e2e2] bg-white shadow-md p-4 space-y-3">
        <div v-if="ordersStore.loading" class="space-y-3">
          <div v-for="n in 3" :key="n" class="h-16 rounded-xl bg-[#f0ede6] animate-pulse"></div>
        </div>

        <div v-else-if="!ordersStore.orders.length" class="text-[#7a7672] py-6">
          Aun no tienes pedidos registrados.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="order in ordersStore.orders"
            :key="order.id"
            class="rounded-xl border border-[#e2e2e2] bg-[#f9f6ef] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">Orden #{{ order.id }}</p>
              <p class="text-lg font-semibold text-[#291900]">Total: {{ formatPrice(order.total) }}</p>
              <p class="text-sm text-[#7a7672]">Fecha: {{ formatDate(order.created_at || order.paid_at) }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="statusClass(order.status)"
              >
                {{ order.status || 'procesando' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminLayout from '../components/AdminLayout.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { useOrdersStore } from '../stores/orders'

const ordersStore = useOrdersStore()

onMounted(() => {
  ordersStore.fetchMyOrders()
})

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
    Number(value) || 0
  )
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'Sin fecha')

const statusClass = (status) => {
  if (!status) return 'bg-[#e7dba0] text-[#291900] border border-[#deb67e]'
  const normalized = status.toLowerCase()
  if (normalized.includes('complet')) return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (normalized.includes('cancel')) return 'bg-rose-50 text-rose-700 border border-rose-200'
  return 'bg-[#e7dba0] text-[#291900] border border-[#deb67e]'
}
</script>
