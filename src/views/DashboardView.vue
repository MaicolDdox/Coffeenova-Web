<template>
  <AdminLayout>
    <div class="space-y-6">
      <SectionTitle title="Bienvenido" eyebrow="Panel principal">
        <template #action>
          <div class="px-4 py-2 rounded-full bg-[#e7dba0] text-[#291900] text-sm font-semibold border border-[#deb67e]/50">
            {{ greeting }}, {{ auth.user?.name || 'coffee lover' }}
          </div>
        </template>
      </SectionTitle>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="card in cards"
          :key="card.label"
          class="rounded-2xl border border-[#e2e2e2] bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#deb67e]/30 cursor-pointer"
          @click="go(card.to)"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="h-10 w-10 rounded-xl bg-[#e7dba0] text-[#291900] flex items-center justify-center text-sm font-bold">{{ card.icon }}</div>
            <span class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">{{ card.tag }}</span>
          </div>
          <p class="text-lg font-semibold text-[#291900]">{{ card.label }}</p>
          <p class="text-sm text-[#7a7672]">{{ card.description }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-[#e2e2e2] bg-gradient-to-r from-[#f9f6ef] to-white p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md shadow-[#deb67e]/20">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">Recomendacion</p>
          <p class="text-2xl font-semibold text-[#291900]">Descubre nuevos origenes de cafe</p>
          <p class="text-[#7a7672] text-sm">Explora sabores, agrega al carrito y completa tu orden en minutos.</p>
        </div>
        <button
          class="inline-flex items-center gap-2 rounded-xl bg-[#deb67e] hover:bg-[#e7dba0] text-[#291900] font-semibold px-5 py-3 transition duration-200 shadow-md shadow-[#deb67e]/40"
          @click="go('/catalog')"
        >
          Ver catalogo
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 5l7 7-7 7M5 5h8" />
          </svg>
        </button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../components/AdminLayout.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const cards = computed(() => {
  if (auth.isAdmin) {
    return [
      {
        label: 'Cafes (Admin)',
        description: 'Gestiona precios, stock e imagenes del catalogo.',
        to: '/admin/coffees',
        icon: 'CA',
        tag: 'Gestion',
      },
      {
        label: 'Ordenes (Admin)',
        description: 'Supervisa las compras y revisa los detalles de cada orden.',
        to: '/admin/orders',
        icon: 'OA',
        tag: 'Control',
      },
    ]
  }

  return [
    {
      label: 'Explorar cafes',
      description: 'Mira el catalogo, filtra por marca y encuentra tu mezcla ideal.',
      to: '/catalog',
      icon: 'CT',
      tag: 'Catalogo',
    },
    {
      label: 'Mi carrito',
      description: 'Revisa tus selecciones y ajusta cantidades antes de pagar.',
      to: '/cart',
      icon: 'CR',
      tag: 'Carrito',
    },
    {
      label: 'Mis pedidos',
      description: 'Consulta el estado y detalle de tus compras anteriores.',
      to: '/orders',
      icon: 'PD',
      tag: 'Historial',
    },
  ]
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos dias'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const go = (path) => router.push(path)
</script>
