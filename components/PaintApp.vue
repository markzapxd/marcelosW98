<template>
  <div class="flex flex-col h-full bg-gray-200">
    <div class="paint-toolbar flex items-center gap-2 p-2 bg-gray-300 border-b border-gray-400">
      <div class="paint-colors flex gap-1">
        <button v-for="c in colors" :key="c.color" class="paint-color-swatch w-6 h-6 rounded border" :style="{background: c.color}" @click="brushColor = c.color">{{ c.label }}</button>
      </div>
      <div class="paint-brush-sizes flex gap-1 ml-4">
        <button v-for="s in sizes" :key="s.size" class="paint-size-button px-2 border rounded" @click="brushSize = s.size">{{ s.label }}</button>
      </div>
      <button class="paint-clear-button bg-red-500 text-white px-2 py-1 rounded ml-4" @click="clear">Clear</button>
    </div>
    <div class="flex-1">
      <canvas ref="canvas" class="w-full h-full bg-white block" style="min-height:200px;" @mousedown="startDraw" @mousemove="draw" @mouseup="endDraw" @mouseleave="endDraw"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const colors = [
  { color: 'black', label: '' },
  { color: 'red', label: '' },
  { color: 'blue', label: '' },
  { color: 'green', label: '' },
  { color: 'yellow', label: '' },
  { color: 'white', label: 'E' },
]
const sizes = [
  { size: 2, label: 'S' },
  { size: 5, label: 'M' },
  { size: 10, label: 'L' },
]
const brushColor = ref('black')
const brushSize = ref(2)
const drawing = ref(false)
const canvas = ref<HTMLCanvasElement|null>(null)
let ctx: CanvasRenderingContext2D|null = null
let last = { x: 0, y: 0 }

const updateCanvasSize = () => {
  if (canvas.value && ctx) {
    // Save contents if possible, or just reset size
    canvas.value.width = canvas.value.clientWidth
    canvas.value.height = canvas.value.clientHeight
  }
}

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    updateCanvasSize()
    
    // Watch for size changes
    const resizeObserver = new ResizeObserver(() => updateCanvasSize())
    resizeObserver.observe(canvas.value)
  }
})
function getPos(e: MouseEvent) {
  const rect = canvas.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}
function startDraw(e: MouseEvent) {
  drawing.value = true
  last = getPos(e)
}
function draw(e: MouseEvent) {
  if (!drawing.value || !ctx) return
  const pos = getPos(e)
  ctx.strokeStyle = brushColor.value
  ctx.lineWidth = brushSize.value
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(last.x, last.y)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
  last = pos
}
function endDraw() {
  drawing.value = false
}
function clear() {
  if (ctx && canvas.value) ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
}
</script>
