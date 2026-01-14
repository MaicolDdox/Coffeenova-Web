<template>
  <div class="min-h-screen bg-white text-[#291900] flex items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute w-80 h-80 bg-[#e7dba0]/60 blur-[140px] -top-16 -left-10"></div>
      <div class="absolute w-96 h-96 bg-[#deb67e]/30 blur-[160px] bottom-0 right-0"></div>
    </div>

    <div class="relative w-full max-w-md p-8 rounded-3xl border border-[#e2e2e2] bg-white shadow-xl shadow-[#deb67e]/20 space-y-6">
      <div class="text-center space-y-1">
        <div class="mx-auto h-12 w-12 rounded-2xl bg-[#deb67e] text-[#291900] flex items-center justify-center text-lg font-bold shadow-lg shadow-[#deb67e]/40">
          CS
        </div>
        <h1 class="text-2xl font-semibold">Crear cuenta</h1>
        <p class="text-sm text-[#7a7672]">Unete y empieza a ordenar tus cafes favoritos</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="space-y-1">
          <label class="text-sm text-[#7a7672]">Nombre</label>
          <input v-model="name" type="text" required :class="inputClass" placeholder="Coffee Lover" />
        </div>
        <div class="space-y-1">
          <label class="text-sm text-[#7a7672]">Correo</label>
          <input v-model="email" type="email" required :class="inputClass" placeholder="demo@coffeestore.com" />
        </div>
        <div class="space-y-1">
          <label class="text-sm text-[#7a7672]">Contrasena</label>
          <input v-model="password" type="password" required :class="inputClass" placeholder="******" />
        </div>

        <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

        <button
          :disabled="loading"
          class="w-full rounded-xl bg-[#deb67e] hover:bg-[#e7dba0] disabled:opacity-60 text-[#291900] font-semibold py-3 transition duration-200 shadow-md shadow-[#deb67e]/40"
        >
          {{ loading ? 'Creando...' : 'Crear cuenta' }}
        </button>
      </form>

      <p class="text-center text-sm text-[#7a7672]">
        Ya tienes cuenta?
        <router-link class="text-[#291900] font-semibold hover:underline" to="/login">Inicia sesion</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const inputClass =
  'w-full rounded-xl border border-[#e2e2e2] bg-white px-4 py-3 text-[#291900] placeholder:text-[#7a7672]/70 focus:border-[#deb67e] focus:ring-2 focus:ring-[#deb67e]/50 outline-none'

const onSubmit = async () => {
  error.value = ''
  loading.value = true
  const { ok, message } = await auth.register(name.value, email.value, password.value)
  loading.value = false

  if (ok) router.push('/')
  else error.value = message || 'No se pudo registrar'
}
</script>
