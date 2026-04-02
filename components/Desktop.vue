<template>
  <div class="desktop min-h-screen w-full relative overflow-hidden select-none" :style="desktopStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ background?: string }>()

const desktopStyle = computed(() => {
  const bg = props.background || '#008080'
  if (bg.startsWith('http') || bg.startsWith('/') || bg.startsWith('data:')) {
    return { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }
  return { backgroundColor: bg }
})
</script>

<style scoped>
.desktop {
  font-family: 'Inter', sans-serif;
  background-color: #008080;
  padding-top: 10px;
  padding-left: 10px;
}
</style>
