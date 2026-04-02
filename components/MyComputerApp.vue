<template>
  <div class="p-4 flex gap-4">
    <div class="window-icon flex flex-col items-center w-20 text-center cursor-pointer hover:bg-black/5 rounded p-1">
      <img src="https://storage.googleapis.com/gemini-95-icons/cdrive.png" alt="C Drive" class="w-12 h-12 object-contain" />
      <span class="text-xs">C:</span>
    </div>
    <div 
      class="window-icon flex flex-col items-center w-20 text-center cursor-pointer hover:bg-black/5 rounded p-1"
      @click="$emit('openApp', 'imageViewer')"
    >
      <img src="https://win98icons.alexmeub.com/icons/png/paint_file-0.png" alt="Secret File" class="w-12 h-12 object-contain" />
      <span class="text-xs">dontshowthis<br/>toanyone.jpg</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente para janela "My Computer"
defineEmits(['openApp'])
</script>
