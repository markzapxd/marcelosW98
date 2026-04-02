<template>
  <Desktop :background="desktopBackground" @mousedown="selectedIconId = null">
    <DesktopIcon
      v-for="icon in icons"
      :key="icon.label"
      :icon="icon.icon"
      :label="icon.label"
      :x="icon.x"
      :y="icon.y"
      :is-selected="selectedIconId === icon.app"
      @open="openApp(icon.app)"
      @move="moveIcon(icon, $event)"
      @select="selectedIconId = icon.app"
    />
    <AppWindow
      v-for="win in windows"
      :key="win.id"
      :title="win.title"
      :visible="win.visible"
      :x="win.x"
      :y="win.y"
      :width="win.w"
      :height="win.h"
      :z="win.z"
      :active="win.id === activeWindowId"
      :transparent="win.transparent"
      @close="closeApp(win.id)"
      @minimize="minimizeApp(win.id)"
      @mousedown="setActiveWindow(win.id)"
    >
      <component :is="win.component" />
    </AppWindow>
    <Taskbar :windows="windows" :active-window-id="activeWindowId" @openApp="openApp" @restoreApp="restoreApp" />
  </Desktop>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeWindowId = ref<string | null>(null)
import Desktop from '~/components/Desktop.vue'
import DesktopIcon from '~/components/DesktopIcon.vue'
import AppWindow from '~/components/AppWindow.vue'
import Taskbar from '~/components/Taskbar.vue'
import MyComputerApp from '~/components/MyComputerApp.vue'
import ChromeApp from '~/components/ChromeApp.vue'
import NotepadApp from '~/components/NotepadApp.vue'
import PaintApp from '~/components/PaintApp.vue'
import MediaPlayerApp from '~/components/MediaPlayerApp.vue'
import BadAppleApp from '~/components/BadAppleApp.vue'
import TerminalApp from '~/components/TerminalApp.vue'

const icons = ref([
  { app: 'myComputer', label: 'My Desktop', icon: '/images/monitor_windows.png', x: 20, y: 20 },
  { app: 'chrome', label: 'Internet', icon: '/images/world-2.png', x: 20, y: 110 },
  { app: 'notepad', label: 'Notes', icon: '/images/signature-1.png', x: 20, y: 200 },
  { app: 'paint', label: 'Paint', icon: '/images/paint.png', x: 20, y: 290 },
  { app: 'mediaPlayer', label: 'Media Player', icon: 'https://storage.googleapis.com/gemini-95-icons/ytmediaplayer.png', x: 20, y: 380 },
  { app: 'badapple', label: 'Secreto', icon: '/images/video.png', x: 20, y: 470 },
  { app: 'terminal', label: 'MS-DOS Prompt', icon: '/images/console.png', x: 120, y: 20 },
])

const appComponents = {
  myComputer: MyComputerApp,
  chrome: ChromeApp,
  notepad: NotepadApp,
  paint: PaintApp,
  mediaPlayer: MediaPlayerApp,
  badapple: BadAppleApp,
  terminal: TerminalApp,
}

const desktopBackground = ref('#008080')
const selectedIconId = ref<string | null>(null)
let globalZ = 100
const windows = ref<any[]>([])


function openApp(app: string) {
  const existing = windows.value.find(w => w.id === app)
  if (existing) {
    existing.visible = true
    bringToFront(existing)
    setActiveWindow(existing.id)
    return
  }
  const isBadApple = app === 'badapple'
  
  // Configurações de tamanho
  let initialWidth = 420
  let initialHeight = 320
  
  if (isBadApple) {
    initialWidth = 800
    initialHeight = 600
  } else if (app === 'mediaPlayer') {
    initialWidth = 470
    initialHeight = 373
  }

  // Centralizar a janela
  let initialX = Math.max(0, Math.floor((window.innerWidth - initialWidth) / 2))
  let initialY = Math.max(0, Math.floor((window.innerHeight - initialHeight - 40) / 2))

  globalZ++
  const id = app
  windows.value.push({
    id,
    title: icons.value.find(i => i.app === app)?.label || app,
    visible: true,
    component: (appComponents as Record<string, any>)[app],
    transparent: isBadApple,
    x: initialX,
    y: initialY,
    w: initialWidth,
    h: initialHeight,
    z: globalZ,
  })
  setActiveWindow(id)
}
function closeApp(id: string) {
  windows.value = windows.value.filter(w => w.id !== id)
  if (activeWindowId.value === id) {
    activeWindowId.value = windows.value.length > 0 ? windows.value[windows.value.length - 1].id : null
  }
}
function minimizeApp(id: string) {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.visible = false
    // Se era a janela ativa, passa o foco para a próxima
    if (activeWindowId.value === id) {
       const visibleOnes = windows.value.filter(w => w.visible)
       activeWindowId.value = visibleOnes.length > 0 ? visibleOnes[visibleOnes.length - 1].id : null
    }
  }
}
function restoreApp(id: string) {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.visible = true
    bringToFront(win)
  }
}

function bringToFront(win: any) {
  globalZ++
  win.z = globalZ
  setActiveWindow(win.id)
}

function setActiveWindow(id: string) {
  activeWindowId.value = id
}

function moveIcon(icon: any, pos: { x: number, y: number }) {
  // Impedir que o ícone saia da tela durante o arraste
  icon.x = Math.max(10, Math.min(pos.x, window.innerWidth - 80))
  icon.y = Math.max(10, Math.min(pos.y, window.innerHeight - 80 - 40))
}

const adjustIconsToScreen = () => {
  icons.value.forEach(icon => {
    icon.x = Math.max(10, Math.min(icon.x, window.innerWidth - 80))
    icon.y = Math.max(10, Math.min(icon.y, window.innerHeight - 80 - 40))
  })
}

import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  adjustIconsToScreen()
  window.addEventListener('resize', adjustIconsToScreen)
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustIconsToScreen)
})
</script>
