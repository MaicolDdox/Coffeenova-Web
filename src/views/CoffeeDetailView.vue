<template>
  <AdminLayout>
    <div class="space-y-6">
      <SectionTitle title="Detalle del cafe" eyebrow="Ficha completa">
        <template #action>
          <button
            class="inline-flex items-center gap-2 rounded-xl border border-[#deb67e] px-4 py-2 text-sm font-semibold text-[#291900] hover:bg-[#e7dba0]/60 transition"
            @click="goBack"
          >
            ← Volver al catalogo
          </button>
        </template>
      </SectionTitle>

      <div v-if="loading" class="grid md:grid-cols-[1.1fr,1fr] gap-6">
        <div class="h-72 rounded-2xl bg-[#f0ede6] border border-[#e2e2e2] animate-pulse"></div>
        <div class="h-72 rounded-2xl bg-[#f5f2eb] border border-[#e2e2e2] animate-pulse"></div>
      </div>

      <div v-else-if="!coffee" class="rounded-2xl border border-[#e2e2e2] bg-white p-8 text-center space-y-3 shadow-sm">
        <p class="text-lg font-semibold text-[#291900]">No encontramos este cafe.</p>
        <p class="text-sm text-[#7a7672]">{{ errorMessage }}</p>
        <button
          class="inline-flex justify-center rounded-xl bg-[#deb67e] hover:bg-[#e7dba0] text-[#291900] font-semibold px-5 py-3 transition"
          @click="goBack"
        >
          Volver al catalogo
        </button>
      </div>

      <div v-else class="grid md:grid-cols-[1.1fr,1fr] gap-6 items-start">
        <div class="rounded-2xl border border-[#e2e2e2] bg-white shadow-md overflow-hidden">
          <img
            :src="coffee.image_full_url || coffee.image_url || 'https://via.placeholder.com/800x500.png?text=Coffee'"
            :alt="coffee.name"
            class="w-full h-full object-cover max-h-[460px]"
            loading="lazy"
          />
        </div>

        <div class="rounded-2xl border border-[#e2e2e2] bg-[#f9f6ef] p-6 shadow-sm space-y-4">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-[#7a7672]">{{ coffee.brand }}</p>
              <h1 class="text-2xl font-semibold text-[#291900] leading-tight">{{ coffee.name }}</h1>
            </div>
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold border"
              :class="coffee.stock > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
            >
              {{ coffee.stock > 0 ? 'Disponible' : 'Agotado' }}
            </span>
          </div>

          <p class="text-sm text-[#7a7672] leading-relaxed">
            {{ coffee.description || 'Cafe seleccionado con notas suaves y aroma tostado.' }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="rounded-xl bg-white border border-[#e2e2e2] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672] mb-1">Precio</p>
              <p class="text-2xl font-bold text-[#291900]">{{ formatPrice(coffee.price) }}</p>
            </div>
            <div class="rounded-xl bg-white border border-[#e2e2e2] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672] mb-1">Stock</p>
              <p class="text-xl font-semibold text-[#291900]">{{ coffee.stock }}</p>
            </div>
            <div class="rounded-xl bg-white border border-[#e2e2e2] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672] mb-1">Estado</p>
              <p class="text-lg font-semibold text-[#291900]">{{ coffee.is_active ? 'Activo' : 'Inactivo' }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              v-if="!auth.isAdmin"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#deb67e] hover:bg-[#e7dba0] text-[#291900] font-semibold px-5 py-3 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#deb67e]/50"
              :disabled="coffee.stock <= 0"
              @click="addToCart"
            >
              Agregar al carrito
            </button>
            <button
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-[#deb67e] px-5 py-3 text-[#291900] font-semibold hover:bg-[#e7dba0]/60 transition"
              @click="goBack"
            >
              Volver al catalogo
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../components/AdminLayout.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { useCoffeesStore } from '../stores/coffees'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const coffeesStore = useCoffeesStore()
const cartStore = useCartStore()
const auth = useAuthStore()

const coffee = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
    Number(value) || 0
  )

const loadCoffee = async () => {
  loading.value = true
  errorMessage.value = ''
  const id = route.params.id

  const cached = coffeesStore.coffees.find((c) => String(c.id) === String(id))
  if (cached) {
    coffee.value = cached
    loading.value = false
    return
  }

  const result = await coffeesStore.fetchCoffee(id)
  coffee.value = result
  if (!result) errorMessage.value = coffeesStore.error || 'Intenta refrescar el catalogo.'
  loading.value = false
}

onMounted(loadCoffee)
watch(
  () => route.params.id,
  () => loadCoffee()
)

const addToCart = async () => {
  if (auth.isAdmin) return
  if (!coffee.value) return
  await cartStore.addToCart(coffee.value.id, 1)
}

const goBack = () => router.push({ name: 'catalog' })
</script>
