<template>
  <div class="group relative rounded-2xl border border-[#e2e2e2] bg-white overflow-hidden shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#deb67e]/30">
    <div class="h-44 w-full overflow-hidden bg-[#e7dba0]/50">
      <img
        v-if="coffee.image_full_url || coffee.image_url"
        :src="coffee.image_full_url || coffee.image_url"
        :alt="coffee.name"
        class="h-full w-full object-cover transition duration-200 group-hover:scale-105"
      />
      <div v-else class="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#e7dba0] to-[#deb67e] text-[#291900]">
        <span class="text-xs font-semibold px-3 py-1 rounded-full border border-[#291900]/20">Cafe</span>
      </div>
    </div>
    <div class="p-4 space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">{{ coffee.brand || 'Origen' }}</p>
        <span
          class="px-2 py-1 rounded-full text-[11px] font-semibold border"
          :class="coffee.stock > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
        >
          {{ coffee.stock > 0 ? 'Disponible' : 'Agotado' }}
        </span>
      </div>
      <h3 class="text-lg font-semibold text-[#291900] leading-tight">{{ coffee.name }}</h3>
      <p class="text-sm text-[#7a7672] min-h-[38px]">
        {{ coffee.description || 'Cafe seleccionado con notas suaves y aroma tostado.' }}
      </p>
      <div class="flex items-center justify-between pt-2">
        <div class="text-xl font-bold text-[#291900]">{{ formatPrice(coffee.price) }}</div>
        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center gap-2 rounded-xl border border-[#deb67e] text-[#291900] font-semibold px-3 py-2 transition duration-200 hover:bg-[#e7dba0]/60"
            @click="onView"
          >
            Ver detalles
          </button>
          <button
            v-if="canAddToCart"
            class="inline-flex items-center gap-2 rounded-xl bg-[#deb67e] hover:bg-[#e7dba0] text-[#291900] font-semibold px-3 py-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#deb67e]/50"
            :disabled="coffee.stock <= 0"
            @click="onAdd"
          >
            <span>Agregar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  coffee: { type: Object, required: true },
  canAddToCart: { type: Boolean, default: true },
})

const emit = defineEmits(['add-to-cart', 'view-details'])

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
    Number(value) || 0
  )

const onAdd = () => emit('add-to-cart', props.coffee)
const onView = () => emit('view-details', props.coffee)
</script>
