

<template>
  <div
    :class="[$style.window, $style.resizable, active ? $style.active : '', transparent ? $style.transparent : '']"
    v-show="visible"
    :style="windowStyle"
    ref="windowRef"
    @mousedown="$emit('mousedown')"
  >
    <div
      :class="$style['window-titlebar']"
      @mousedown="startDrag"
      ref="titlebarRef"
    >
      <span :class="$style['window-title']">{{ title }}</span>
      <div :class="$style['window-controls']">
        <div :class="$style['window-control-button'] + ' ' + $style['window-minimize']" @click="$emit('minimize')">−</div>
        <div :class="$style['window-control-button'] + ' ' + $style['window-close']" @click="$emit('close')">✕</div>
      </div>
    </div>
    <div :class="$style['window-content']">
      <slot />
    </div>
    <!-- overlay removido, não usado -->
    <div
      :class="$style['resize-handle']"
      @mousedown="startResize"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { CSSProperties } from 'vue'
import $style from '../styles/AppWindowWin95.module.css'
const props = defineProps<{ title: string; visible: boolean; x?: number; y?: number; z?: number; active?: boolean; transparent?: boolean; width?: number; height?: number }>()
const active = computed(() => props.active)

const windowRef = ref<HTMLElement | null>(null)
const titlebarRef = ref<HTMLElement | null>(null)
const position = reactive({ x: props.x ?? 120, y: props.y ?? 80 })
const size = reactive({ w: props.width ?? 400, h: props.height ?? 280 })
const zIndex = ref(props.z ?? 100)
let dragging = false
let dragOffset = { x: 0, y: 0 }
let resizing = ref(false)
let resizeStart = { x: 0, y: 0, w: 0, h: 0 }

watch(() => props.x, v => { if (typeof v === 'number') position.x = v })
watch(() => props.y, v => { if (typeof v === 'number') position.y = v })
watch(() => props.z, v => { if (typeof v === 'number') zIndex.value = v })

const windowStyle = computed<CSSProperties>(() => ({
  left: position.x + 'px',
  top: position.y + 'px',
  width: size.w + 'px',
  height: size.h + 'px',
  zIndex: zIndex.value,
  position: 'absolute',
}))

function onBringToFront() {
  // Emitir evento para parent trazer para frente
  windowRef.value?.dispatchEvent(new CustomEvent('bringtofront', { bubbles: true }))
}

function startDrag(e: MouseEvent) {
  if (e.button !== 0) return
  dragging = true
  dragOffset.x = e.clientX - position.x
  dragOffset.y = e.clientY - position.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag, { once: true })
}
function onDrag(e: MouseEvent) {
  if (!dragging) return
  position.x = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - size.w))
  position.y = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - size.h - 40))
}
function stopDrag() {
  dragging = false
  document.removeEventListener('mousemove', onDrag)
}

function startResize(e: MouseEvent) {
  if (e.button !== 0) return
  resizing.value = true
  resizeStart.x = e.clientX
  resizeStart.y = e.clientY
  resizeStart.w = size.w
  resizeStart.h = size.h
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', stopResize, { once: true })
}
function onResizeMove(e: MouseEvent) {
  if (!resizing.value) return
  size.w = Math.max(200, resizeStart.w + (e.clientX - resizeStart.x))
  size.h = Math.max(150, resizeStart.h + (e.clientY - resizeStart.y))
}
function stopResize() {
  resizing.value = false
  document.removeEventListener('mousemove', onResizeMove)
}
</script>

<style module>
.resize-handle {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 16px;
  height: 16px;
  background: url('data:image/svg+xml;utf8,<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="13" width="3" height="2" fill="gray"/><rect x="13" y="10" width="2" height="3" fill="gray"/></svg>') no-repeat center center;
  cursor: nwse-resize;
  z-index: 10;
}
</style>
