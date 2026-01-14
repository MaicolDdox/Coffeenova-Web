<template>
  <AdminLayout>
    <div class="space-y-6">
      <SectionTitle title="Mi carrito" eyebrow="Listo para disfrutar" />

      <div class="rounded-2xl border border-[#e2e2e2] bg-white shadow-md p-4 space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-[#7a7672]">Revisa tus selecciones y ajusta cantidades.</p>
          <button
            class="text-sm px-4 py-2 rounded-xl border border-[#deb67e] text-[#291900] hover:bg-[#e7dba0]/60 transition"
            @click="clearCart"
            :disabled="!cartStore.cart.items?.length"
          >
            Vaciar carrito
          </button>
        </div>

        <div v-if="cartStore.loading" class="space-y-3">
          <div v-for="n in 3" :key="n" class="h-16 rounded-xl bg-[#f0ede6] animate-pulse"></div>
        </div>

        <div v-else>
          <div v-if="!cartStore.cart.items || !cartStore.cart.items.length" class="text-[#7a7672] py-6">
            No hay productos en tu carrito.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="item in cartStore.cart.items"
              :key="item.id"
              class="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr] items-center gap-3 p-3 rounded-xl border border-[#e2e2e2] bg-[#f9f6ef]"
            >
              <div>
                <p class="text-sm text-[#7a7672]">Cafe</p>
                <p class="text-lg font-semibold text-[#291900]">
                  {{ item.coffee?.name || item.name || 'Cafe' }}
                </p>
                <p class="text-xs text-[#7a7672]">{{ item.coffee?.brand || '' }}</p>
              </div>
              <div>
                <p class="text-sm text-[#7a7672]">Precio unitario</p>
                <p class="text-lg font-semibold text-[#291900]">{{ formatPrice(item.coffee?.price ?? item.price) }}</p>
              </div>
              <div>
                <p class="text-sm text-[#7a7672]">Cantidad</p>
                <input
                  v-model.number="quantities[item.id]"
                  type="number"
                  min="1"
                  class="w-24 rounded-xl border border-[#e2e2e2] bg-white px-3 py-2 text-[#291900] focus:border-[#deb67e] focus:ring-1 focus:ring-[#deb67e]/60"
                />
              </div>
              <div class="flex items-center justify-between md:justify-end gap-3">
                <div class="text-right">
                  <p class="text-sm text-[#7a7672]">Total</p>
                  <p class="text-lg font-bold text-[#291900]">
                    {{ formatPrice((item.coffee?.price ?? item.price) * (quantities[item.id] || 1)) }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    class="px-3 py-2 rounded-lg text-sm bg-[#deb67e] text-[#291900] font-semibold hover:bg-[#e7dba0] transition"
                    @click="updateQuantity(item)"
                  >
                    Actualizar
                  </button>
                  <button
                    class="px-3 py-2 rounded-lg text-sm border border-[#e2e2e2] text-[#7a7672] hover:bg-[#f9f6ef] transition"
                    @click="removeItem(item.id)"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-[#e2e2e2] pt-4">
          <div>
            <p class="text-sm text-[#7a7672]">Total del carrito</p>
            <p class="text-3xl font-bold text-[#291900]">{{ formatPrice(totalCart) }}</p>
          </div>
          <button
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#deb67e] hover:bg-[#e7dba0] text-[#291900] font-semibold px-5 py-3 transition duration-200 shadow-md shadow-[#deb67e]/40 disabled:opacity-60"
            @click="checkout"
            :disabled="!cartStore.cart.items?.length"
          >
            Finalizar compra
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13l-1.3 4H19m-7-4v4m0 0a2 2 0 11-4 0 2 2 0 014 0zm5 0a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div
        v-if="invoice.order"
        class="rounded-2xl border border-[#e2e2e2] bg-[#f9f6ef] text-[#291900] shadow-md p-5 space-y-3"
      >
        <div class="flex items-center gap-2">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#deb67e] text-[#291900] text-sm font-bold">OK</span>
          <div>
            <p class="text-sm uppercase tracking-[0.2em] text-[#7a7672]">Orden generada</p>
            <p class="text-xl font-semibold">Factura simulada</p>
          </div>
        </div>
        <div class="grid md:grid-cols-3 gap-3 text-sm">
          <div>
            <p class="text-[#7a7672]">Orden #{{ invoice.order.id }}</p>
            <p class="font-semibold text-[#291900]">Total: {{ formatPrice(invoice.order.total) }}</p>
            <p class="text-[#7a7672]">Estado: {{ invoice.order.status || 'pagado' }}</p>
          </div>
          <div>
            <p class="text-[#7a7672]">Cliente</p>
            <p class="font-semibold text-[#291900]">{{ invoice.user?.name || 'Cliente' }}</p>
            <p class="text-[#7a7672]">{{ invoice.user?.email }}</p>
          </div>
          <div>
            <p class="text-[#7a7672]">Metodo</p>
            <p class="font-semibold text-[#291900] capitalize">{{ invoice.order.payment_method || 'Simulado' }}</p>
            <p class="text-[#7a7672]">Fecha: {{ formatDate(invoice.order.paid_at || invoice.order.created_at) }}</p>
          </div>
        </div>
        <div class="rounded-xl border border-[#e2e2e2] bg-white p-3 space-y-2">
          <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">Detalle</p>
          <div class="space-y-2">
            <div
              v-for="item in invoice.items"
              :key="item.id"
              class="flex items-center justify-between text-sm"
            >
              <div>
                <p class="font-semibold text-[#291900]">{{ item.coffee?.name || item.name }}</p>
                <p class="text-[#7a7672]">{{ item.coffee?.brand }}</p>
              </div>
              <div class="text-right">
                <p class="text-[#7a7672]">x{{ item.quantity }}</p>
                <p class="font-semibold text-[#291900]">{{ formatPrice(item.subtotal || item.total_price || 0) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AdminLayout from '../components/AdminLayout.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const quantities = ref({})

const syncQuantities = () => {
  const items = cartStore.cart.items || []
  const map = {}
  items.forEach((item) => {
    map[item.id] = item.quantity
  })
  quantities.value = map
}

onMounted(async () => {
  await cartStore.fetchCart()
  syncQuantities()
})

watch(
  () => cartStore.cart.items,
  () => syncQuantities(),
  { deep: true }
)

const totalCart = computed(() => {
  if (cartStore.cart?.total_cart !== undefined) return Number(cartStore.cart.total_cart || 0)
  return (cartStore.cart.items || []).reduce(
    (acc, item) => acc + (item.coffee?.price ?? item.price ?? 0) * (item.quantity || 1),
    0
  )
})

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
    Number(value) || 0
  )
const formatDate = (date) => (date ? new Date(date).toLocaleString() : 'Sin fecha')

const invoice = computed(() => {
  const order = cartStore.lastOrder?.order || cartStore.lastOrder || null
  const items = cartStore.lastOrder?.items || []
  const user = cartStore.lastOrder?.user || order?.user || null
  return { order, items, user }
})

const updateQuantity = async (item) => {
  const qty = quantities.value[item.id] || 1
  await cartStore.updateItem(item.id, qty)
  syncQuantities()
}

const checkout = async () => {
  const { ok } = await cartStore.checkout()
  syncQuantities()
  if (ok) {
    showPurchaseAnimation()
  }
}

const clearCart = async () => {
  await cartStore.clearCart()
  syncQuantities()
}

const removeItem = async (itemId) => {
  await cartStore.removeItem(itemId)
  syncQuantities()
}

const showPurchaseAnimation = () => {
  if (window.Swal) {
    const orderId = invoice.value.order?.id ? `#${invoice.value.order.id}` : ''
    window.Swal.fire({
      title: 'Compra simulada',
      html: `<p>Orden ${orderId} confirmada.</p><p>Total: <strong>${formatPrice(
        invoice.value.order?.total || 0
      )}</strong></p>`,
      icon: 'success',
      confirmButtonColor: '#deb67e',
    })
  } else {
    alert(`Compra confirmada. Total: ${formatPrice(invoice.value.order?.total || 0)}`)
  }
}
</script>
