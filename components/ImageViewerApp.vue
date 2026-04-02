<template>
  <div class="h-full bg-gray-500 overflow-hidden flex items-center justify-center">
    <img :src="src" :alt="alt" class="max-w-full max-h-full object-contain" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// In a real app we'd pass these as props or via a store
// For this quick fix, we use a simple singleton-like approach or just hardcode for demo
const src = ref('https://storage.googleapis.com/gemini-95-icons/%40ammaar%2B%40olacombe.png')
const alt = ref('dontshowthistoanyone.jpg')
</script>
