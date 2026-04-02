<template>
  <div class="flex flex-col h-full">
    <div class="notepad-menu flex items-center gap-2 mb-2">
      <button class="notepad-story-button bg-blue-500 text-white px-2 py-1 rounded text-xs" @click="generateStory">Generate Story</button>
    </div>
    <textarea
      class="notepad-textarea flex-1 w-full p-2 border border-gray-400 rounded resize-none bg-white text-gray-800"
      placeholder="Digite suas notas..."
      v-model="text"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
function generateStory() {
  text.value = 'helloWord(print)'
}
</script>
