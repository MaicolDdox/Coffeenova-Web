<template>
  <div class="min-h-screen bg-white text-[#291900]">
    <header class="sticky top-0 z-10 border-b border-[#e2e2e2] bg-white/90 backdrop-blur shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button class="md:hidden text-[#7a7672]" @click="sidebar = !sidebar" aria-label="Abrir menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#deb67e] text-[#291900] font-bold shadow-lg shadow-[#deb67e]/30">
              CS
            </span>
            <div>
              <p class="text-sm uppercase tracking-[0.2em] text-[#7a7672]">CoffeeStore</p>
              <p class="text-lg font-semibold text-[#291900]">Panel</p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 text-sm">
          <div class="text-right">
            <p class="font-semibold text-[#291900]">{{ auth.user?.name || 'Invitado' }}</p>
            <p class="text-[#7a7672]">{{ auth.isAdmin ? 'Administrador' : 'Cliente' }}</p>
          </div>
          <button
            @click="logout"
            class="inline-flex items-center gap-2 rounded-xl bg-[#deb67e] hover:bg-[#e7dba0] text-[#291900] font-semibold px-4 py-2 transition duration-200 shadow-md shadow-[#deb67e]/40"
          >
            <span>Cerrar sesion</span>
          </button>
        </div>
      </div>
    </header>

    <div class="relative z-10 max-w-6xl mx-auto px-6 py-6 grid md:grid-cols-[240px,1fr] gap-6">
      <aside
        class="bg-[#f9f6ef] border border-[#e2e2e2] rounded-2xl shadow-md shadow-[#e2e2e2]/60 p-4 transition-all duration-200"
        :class="sidebar ? 'block' : 'hidden md:block'"
      >
        <nav class="flex flex-col gap-2 text-sm">
          <RouterLink
            v-for="link in filteredLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 px-3 py-3 rounded-xl border border-transparent transition duration-200 hover:-translate-y-[2px]"
            :class="
              route.name === link.name
                ? 'bg-[#deb67e] text-[#291900] shadow-sm shadow-[#deb67e]/50 border-[#deb67e]'
                : 'text-[#291900] hover:bg-[#e7dba0]/50 hover:border-[#e2e2e2]'
            "
            @click="closeSidebar"
          >
            <span class="text-xs font-semibold px-2 py-1 rounded-lg bg-white border border-[#e2e2e2] text-[#7a7672]">{{ link.icon }}</span>
            <span class="font-semibold">{{ link.label }}</span>
          </RouterLink>
        </nav>
      </aside>

      <main class="space-y-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const sidebar = ref(false)

const links = [
  { to: '/', name: 'dashboard', label: 'Dashboard', icon: 'H' },
  { to: '/catalog', name: 'catalog', label: 'Catalogo', icon: 'CT' },
  { to: '/cart', name: 'cart', label: 'Mi carrito', icon: 'CR', client: true },
  { to: '/orders', name: 'orders', label: 'Mis pedidos', icon: 'PD', client: true },
  { to: '/admin/coffees', name: 'admin.coffees', label: 'Cafes (Admin)', icon: 'CA', admin: true },
  { to: '/admin/orders', name: 'admin.orders', label: 'Ordenes (Admin)', icon: 'OA', admin: true },
]

const filteredLinks = computed(() =>
  links.filter((l) => {
    if (l.admin) return auth.isAdmin
    if (l.client) return auth.isClient && !auth.isAdmin
    return true
  })
)

const logout = async () => {
  await auth.logout()
  router.push('/login')
}

const closeSidebar = () => {
  sidebar.value = false
}
</script>
