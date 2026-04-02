
<template>
  <div :id="'taskbar'" :class="$style.taskbar">
    <button :id="'start-button'" :class="$style.startButton" @click="toggleStartMenu">
      <img src="/public/images/win98.png" alt="Start" :class="$style.startImg" />
    </button>
    <div :id="'taskbar-apps'" :class="$style.taskbarApps">
      <button
        v-for="win in windows"
        :key="win.id"
        :class="[$style.taskbarAppBtn, (win.id === activeWindowId && win.visible) ? $style.active : '']"
        @click="$emit('restoreApp', win.id)"
      >
        <span :class="$style.btnText">{{ win.title }}</span>
      </button>
    </div>
  </div>
  <StartMenu v-if="showStartMenu" @openApp="$emit('openApp', $event)" @close="showStartMenu = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StartMenu from '~/components/StartMenu.vue'
import $style from '../styles/TaskbarWin95.module.css'


const showStartMenu = ref(false)
function toggleStartMenu() {
  showStartMenu.value = !showStartMenu.value
}
const props = defineProps<{
  windows: { id: string, title: string, visible: boolean }[],
  activeWindowId: string | null
}>()
</script>
