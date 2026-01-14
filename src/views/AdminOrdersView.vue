<template>
  <AdminLayout>
    <div class="space-y-6">
      <SectionTitle title="Ordenes (Admin)" eyebrow="Panel" />

      <div class="grid lg:grid-cols-[1fr,360px] gap-6">
        <div class="rounded-2xl border border-[#e2e2e2] bg-white shadow-md p-4 space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-[#7a7672]">Ordenes recientes</p>
            <button
              class="text-sm px-3 py-2 rounded-xl border border-[#deb67e] text-[#291900] hover:bg-[#e7dba0]/60 transition"
              @click="ordersStore.fetchAllOrders"
            >
              Refrescar
            </button>
          </div>

          <div v-if="ordersStore.loading" class="space-y-2">
            <div v-for="n in 4" :key="n" class="h-14 rounded-xl bg-[#f0ede6] animate-pulse"></div>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="order in ordersStore.orders"
              :key="order.id"
              class="rounded-xl border border-[#e2e2e2] bg-[#f9f6ef] p-3 cursor-pointer transition hover:border-[#deb67e]"
              :class="order.id === selectedId ? 'border-[#deb67e] shadow-sm shadow-[#deb67e]/40' : ''"
              @click="selectOrder(order.id)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">Orden #{{ order.id }}</p>
                  <p class="text-sm text-[#7a7672]">{{ order.user?.name || 'Cliente' }} - {{ order.user?.email }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-semibold text-[#291900]">{{ formatPrice(order.total) }}</p>
                  <span class="px-2 py-1 rounded-full text-[11px] font-semibold" :class="statusClass(order.status)">
                    {{ order.status || 'procesando' }}
                  </span>
                </div>
              </div>
              <p class="text-xs text-[#7a7672] mt-1">Fecha: {{ formatDate(order.created_at || order.paid_at) }}</p>
            </div>

            <div v-if="!ordersStore.orders.length" class="text-[#7a7672] py-6 text-center">
              No hay ordenes aun.
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-[#e2e2e2] bg-white shadow-md p-4 space-y-3">
          <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">Detalle</p>
          <div v-if="ordersStore.loading && !ordersStore.currentOrder" class="h-48 rounded-xl bg-[#f0ede6] animate-pulse"></div>
          <div v-else-if="!ordersStore.currentOrder" class="text-[#7a7672]">Selecciona una orden para ver el detalle.</div>
          <div v-else class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg font-semibold text-[#291900]">Orden #{{ ordersStore.currentOrder.id }}</p>
                <p class="text-sm text-[#7a7672]">
                  {{ ordersStore.currentOrder.user?.name }} - {{ ordersStore.currentOrder.user?.email }}
                </p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusClass(ordersStore.currentOrder.status)">
                {{ ordersStore.currentOrder.status || 'procesando' }}
              </span>
            </div>
            <div class="text-sm text-[#7a7672]">
              <p>Total: <span class="font-semibold text-[#291900]">{{ formatPrice(ordersStore.currentOrder.total) }}</span></p>
              <p>Fecha: {{ formatDate(ordersStore.currentOrder.created_at || ordersStore.currentOrder.paid_at) }}</p>
            </div>
            <div class="space-y-2">
              <p class="text-sm text-[#7a7672]">Items</p>
              <div
                v-for="item in ordersStore.currentOrder.items || []"
                :key="item.id"
                class="flex items-center justify-between rounded-lg border border-[#e2e2e2] bg-[#f9f6ef] px-3 py-2"
              >
                <div>
                  <p class="font-semibold text-[#291900]">{{ item.coffee?.name || item.name }}</p>
                  <p class="text-xs text-[#7a7672]">Cantidad: {{ item.quantity }}</p>
                </div>
                <p class="font-semibold text-[#291900]">
                  {{ formatPrice(item.subtotal || (item.quantity || 1) * (item.price || 0)) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AdminLayout from '../components/AdminLayout.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { useOrdersStore } from '../stores/orders'

const ordersStore = useOrdersStore()
const selectedId = ref(null)

onMounted(() => {
  ordersStore.fetchAllOrders()
})

const selectOrder = async (id) => {
  selectedId.value = id
  await ordersStore.fetchAdminOrder(id)
}

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
    Number(value) || 0
  )
const formatDate = (date) => (date ? new Date(date).toLocaleString() : 'Sin fecha')

const statusClass = (status) => {
  if (!status) return 'bg-[#e7dba0] text-[#291900] border border-[#deb67e]'
  const normalized = status.toLowerCase()
  if (normalized.includes('complet')) return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (normalized.includes('cancel')) return 'bg-rose-50 text-rose-700 border border-rose-200'
  return 'bg-[#e7dba0] text-[#291900] border border-[#deb67e]'
}
</script>
