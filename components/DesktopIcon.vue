<template>
  <div
    class="icon absolute flex flex-col items-center cursor-pointer w-20 text-center select-none"
    :class="{ selected: isSelected }"
    :style="{ left: x + 'px', top: y + 'px' }"
    @dblclick="$emit('open')"
    @mousedown.stop="onMouseDown"
  >
    <!-- Hitbox invisível para facilitar o arraste -->
    <div class="icon-hitbox"></div>
    
    <img :src="icon" :alt="label" class="desktop-icon-img" />
    <span class="icon-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ icon: string; label: string; x: number; y: number; isSelected: boolean }>()
const emit = defineEmits(['open', 'move', 'select'])

let isDragging = false
let startX = 0
let startY = 0

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  emit('select')
  isDragging = true
  startX = e.clientX - props.x
  startY = e.clientY - props.y
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging) return
  emit('move', {
    x: e.clientX - startX,
    y: e.clientY - startY
  })
}

function onMouseUp() {
  isDragging = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}
</script>

<style scoped>
.icon {
  user-select: none;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  position: absolute;
}

.icon-hitbox {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  background: transparent;
}

.desktop-icon-img {
  width: 32px;
  height: 32px;
  display: block;
  margin-bottom: 4px;
  object-fit: contain;
  image-rendering: pixelated;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  position: relative;
  z-index: 1;
}

.icon-label {
  color: white;
  font-size: 11px;
  text-shadow: 1px 1px 1px #000;
  padding: 1px 2px;
  max-width: 100%;
  word-wrap: break-word;
  position: relative;
  z-index: 1;
}

.selected .icon-label {
  background-color: #000080;
  text-shadow: none;
}

/* Removido o filtro azul do ícone a pedido do usuário */
.selected .desktop-icon-img {
  filter: none;
}
</style>
