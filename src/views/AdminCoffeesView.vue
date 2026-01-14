<template>
  <AdminLayout>
    <div class="space-y-6">
      <SectionTitle title="Gestion de cafes" eyebrow="Admin" />

      <div class="grid lg:grid-cols-[1fr,360px] gap-6">
        <div class="rounded-2xl border border-[#e2e2e2] bg-white shadow-md p-4 space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-[#7a7672]">Inventario actual</p>
            <button
              class="text-sm px-3 py-2 rounded-xl border border-[#deb67e] text-[#291900] hover:bg-[#e7dba0]/60 transition"
              @click="coffeesStore.fetchCoffees"
            >
              Refrescar
            </button>
          </div>

          <div v-if="coffeesStore.loading" class="space-y-2">
            <div v-for="n in 4" :key="n" class="h-14 rounded-xl bg-[#f0ede6] animate-pulse"></div>
          </div>

          <div v-else class="overflow-auto">
            <table class="min-w-full text-sm">
              <thead class="text-left text-[#7a7672]">
                <tr>
                  <th class="py-2 pr-3">Nombre</th>
                  <th class="py-2 pr-3">Marca</th>
                  <th class="py-2 pr-3">Precio</th>
                  <th class="py-2 pr-3">Stock</th>
                  <th class="py-2 pr-3">Estado</th>
                  <th class="py-2 pr-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#e2e2e2]">
                <tr v-for="coffee in coffeesStore.coffees" :key="coffee.id" class="text-[#291900]">
                  <td class="py-3 pr-3 font-semibold">{{ coffee.name }}</td>
                  <td class="py-3 pr-3 text-[#7a7672]">{{ coffee.brand }}</td>
                  <td class="py-3 pr-3">{{ formatPrice(coffee.price) }}</td>
                  <td class="py-3 pr-3">{{ coffee.stock }}</td>
                  <td class="py-3 pr-3">
                    <span
                      class="px-2 py-1 rounded-full text-[11px] font-semibold border"
                      :class="coffee.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                    >
                      {{ coffee.is_active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="py-3 pr-3 text-right space-x-2">
                    <button
                      class="px-3 py-1 rounded-lg text-xs bg-[#deb67e] text-[#291900] font-semibold hover:bg-[#e7dba0] transition"
                      @click="startEdit(coffee)"
                    >
                      Editar
                    </button>
                    <button
                      class="px-3 py-1 rounded-lg text-xs border border-[#e2e2e2] text-[#7a7672] hover:bg-[#f9f6ef] transition"
                      @click="coffeesStore.deleteCoffee(coffee.id)"
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="!coffeesStore.coffees.length" class="text-[#7a7672] py-6 text-center">
              No hay cafes registrados.
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-[#e2e2e2] bg-white shadow-md p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672]">Formulario</p>
              <p class="text-xl font-semibold text-[#291900]">{{ editingId ? 'Editar cafe' : 'Nuevo cafe' }}</p>
            </div>
            <button
              v-if="editingId"
              class="text-sm text-[#7a7672] underline"
              @click="resetForm"
            >
              Cancelar
            </button>
          </div>

          <form class="space-y-3" @submit.prevent="submit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="text-sm text-[#7a7672] space-y-1">
                <span>Nombre</span>
                <input v-model="form.name" required :class="inputClass" type="text" />
              </label>
              <label class="text-sm text-[#7a7672] space-y-1">
                <span>Marca</span>
                <input v-model="form.brand" required :class="inputClass" type="text" />
              </label>
              <label class="text-sm text-[#7a7672] space-y-1">
                <span>Precio</span>
                <input v-model.number="form.price" required :class="inputClass" type="number" step="0.01" min="0" />
              </label>
              <label class="text-sm text-[#7a7672] space-y-1">
                <span>Stock</span>
                <input v-model.number="form.stock" required :class="inputClass" type="number" min="0" />
              </label>
              <label class="text-sm text-[#7a7672] space-y-1 sm:col-span-2">
                <span>Imagen (URL remota opcional)</span>
                <input
                  v-model="form.image_url"
                  :class="inputClass"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  @input="onImageUrlInput"
                />
              </label>
              <label class="text-sm text-[#7a7672] space-y-1 sm:col-span-2">
                <span>Subir imagen (png/jpg/jpeg)</span>
                <input type="file" accept="image/png,image/jpeg" class="block w-full text-[#291900]" @change="onFileChange" />
                <p class="text-xs text-[#7a7672]">Si adjuntas un archivo, se usara en lugar de la URL remota.</p>
              </label>
              <label class="text-sm text-[#7a7672] space-y-1 sm:col-span-2">
                <span>Descripcion</span>
                <textarea v-model="form.description" rows="3" :class="inputClass"></textarea>
              </label>
            </div>
            <div v-if="imagePreview" class="rounded-xl border border-[#e2e2e2] bg-[#f9f6ef] p-3 text-center">
              <p class="text-xs uppercase tracking-[0.2em] text-[#7a7672] mb-2">Vista previa</p>
              <img :src="imagePreview" alt="Preview" class="max-h-40 mx-auto rounded-lg object-cover" />
            </div>
            <label class="inline-flex items-center gap-2 text-sm text-[#7a7672]">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 rounded border-[#deb67e] text-[#deb67e] focus:ring-[#deb67e]"
              />
              Activo
            </label>
            <button
              class="w-full rounded-xl bg-[#deb67e] hover:bg-[#e7dba0] text-[#291900] font-semibold py-3 transition duration-200 shadow-md shadow-[#deb67e]/40"
              type="submit"
            >
              {{ editingId ? 'Guardar cambios' : 'Crear cafe' }}
            </button>
            <p v-if="coffeesStore.error" class="text-sm text-rose-600">{{ coffeesStore.error }}</p>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import AdminLayout from '../components/AdminLayout.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { useCoffeesStore } from '../stores/coffees'

const coffeesStore = useCoffeesStore()
const editingId = ref(null)
const inputClass =
  'w-full rounded-xl border border-[#e2e2e2] bg-white px-4 py-2.5 text-[#291900] placeholder:text-[#7a7672]/70 focus:border-[#deb67e] focus:ring-2 focus:ring-[#deb67e]/50'

const form = reactive({
  name: '',
  brand: '',
  description: '',
  price: 0,
  stock: 0,
  image_url: '',
  imageFile: null,
  is_active: true,
})
const imagePreview = ref(null)

onMounted(() => {
  coffeesStore.fetchCoffees()
})

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
    Number(value) || 0
  )

const startEdit = (coffee) => {
  editingId.value = coffee.id
  form.name = coffee.name || ''
  form.brand = coffee.brand || ''
  form.description = coffee.description || ''
  form.price = coffee.price || 0
  form.stock = coffee.stock || 0
  form.image_url = coffee.image_url || ''
  form.imageFile = null
  form.is_active = coffee.is_active !== false
  imagePreview.value = coffee.image_full_url || coffee.image_url || null
}

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.brand = ''
  form.description = ''
  form.price = 0
  form.stock = 0
  form.image_url = ''
  form.imageFile = null
  form.is_active = true
  imagePreview.value = null
}

const onFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  form.imageFile = file
  form.image_url = ''
  imagePreview.value = URL.createObjectURL(file)
}

const onImageUrlInput = () => {
  if (form.image_url) {
    form.imageFile = null
    imagePreview.value = form.image_url
  } else if (!form.imageFile) {
    imagePreview.value = null
  }
}

const buildFormData = () => {
  const payload = new FormData()
  payload.append('name', form.name ?? '')
  payload.append('brand', form.brand ?? '')
  payload.append('description', form.description || '')
  payload.append('price', form.price ?? '')
  payload.append('stock', form.stock ?? '')
  payload.append('is_active', form.is_active ? 1 : 0)

  if (form.image_url) {
    payload.append('image_url', form.image_url)
  }

  if (form.imageFile) {
    payload.append('image', form.imageFile)
  }

  return payload
}

const submit = async () => {
  const payload = buildFormData()

  if (editingId.value) {
    const { ok } = await coffeesStore.updateCoffee(editingId.value, payload)
    if (ok) resetForm()
  } else {
    const { ok } = await coffeesStore.createCoffee(payload)
    if (ok) resetForm()
  }
}
</script>
