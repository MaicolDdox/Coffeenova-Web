<template>
  <div class="flex items-center justify-between gap-3">
    <div>
      <p class="text-xs uppercase tracking-[0.3em] text-[#7a7672]">{{ eyebrow }}</p>
      <h2 class="text-2xl font-semibold text-[#291900]">{{ title }}</h2>
    </div>
    <slot name="action" />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  eyebrow: { type: String, default: 'Overview' },
})
</script>
