<template>
  <AdminLayout>
    <div class="space-y-6">
      <SectionTitle title="Catalogo de cafes" eyebrow="Explora la carta">
        <template #action>
          <div class="px-4 py-2 rounded-full bg-[#e7dba0] text-[#291900] text-sm font-semibold border border-[#deb67e]/50">
            {{ filteredCoffees.length }} cafes
          </div>
        </template>
      </SectionTitle>

      <div class="rounded-2xl border border-[#e2e2e2] bg-[#f9f6ef] shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">Marca</label>
            <select
              v-model="filters.brand"
              class="w-full rounded-xl border border-[#e2e2e2] bg-white px-4 py-2.5 text-[#291900] focus:border-[#deb67e] focus:ring-2 focus:ring-[#deb67e]/60"
            >
              <option value="">Todas</option>
              <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">Orden precio</label>
            <select
              v-model="filters.priceOrder"
              class="w-full rounded-xl border border-[#e2e2e2] bg-white px-4 py-2.5 text-[#291900] focus:border-[#deb67e] focus:ring-2 focus:ring-[#deb67e]/60"
            >
              <option value="">Relevancia</option>
              <option value="asc">Menor a mayor</option>
              <option value="desc">Mayor a menor</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">Buscar</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Filtrar por nombre"
              class="w-full rounded-xl border border-[#e2e2e2] bg-white px-4 py-2.5 text-[#291900] placeholder:text-[#7a7672]/70 focus:border-[#deb67e] focus:ring-2 focus:ring-[#deb67e]/60"
            />
          </div>
        </div>
      </div>

      <div v-if="coffeesStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="n in 6" :key="n" class="rounded-2xl h-64 bg-[#f0ede6] border border-[#e2e2e2] animate-pulse"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CoffeeCard
          v-for="coffee in filteredCoffees"
          :key="coffee.id"
          :coffee="coffee"
          :can-add-to-cart="!auth.isAdmin"
          @add-to-cart="addToCart"
          @view-details="goToDetail"
        />
        <div v-if="!filteredCoffees.length" class="col-span-full text-center text-[#7a7672] py-10">
          No encontramos cafes con esos filtros.
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../components/AdminLayout.vue'
import SectionTitle from '../components/SectionTitle.vue'
import CoffeeCard from '../components/CoffeeCard.vue'
import { useCoffeesStore } from '../stores/coffees'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const coffeesStore = useCoffeesStore()
const cartStore = useCartStore()
const auth = useAuthStore()
const router = useRouter()

const filters = reactive({
  brand: '',
  priceOrder: '',
  search: '',
})

onMounted(() => {
  coffeesStore.fetchCoffees()
})

const brands = computed(() => {
  const list = coffeesStore.coffees.map((c) => c.brand).filter(Boolean)
  return [...new Set(list)]
})

const filteredCoffees = computed(() => {
  let list = [...coffeesStore.coffees]
  if (filters.brand) list = list.filter((c) => c.brand === filters.brand)
  if (filters.search) list = list.filter((c) => c.name?.toLowerCase().includes(filters.search.toLowerCase()))
  if (filters.priceOrder === 'asc') list.sort((a, b) => Number(a.price) - Number(b.price))
  if (filters.priceOrder === 'desc') list.sort((a, b) => Number(b.price) - Number(a.price))
  return list
})

const addToCart = async (coffee) => {
  if (auth.isAdmin) return
  await cartStore.addToCart(coffee.id, 1)
}

const goToDetail = (coffee) => {
  router.push({ name: 'coffees.show', params: { id: coffee.id } })
}
</script>
