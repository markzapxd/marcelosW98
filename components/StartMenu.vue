<template>
  <div class="start-menu">
    <div class="start-sidebar">
      <div class="sidebar-text">
        Windows<span>98</span>
      </div>
    </div>
    <div class="start-content">
      <div
        v-for="(item, index) in items"
        :key="item.app"
        class="start-menu-item"
        @click="$emit('openApp', item.app); $emit('close')"
      >
        <div class="item-icon-container">
          <img :src="item.icon" alt="" class="item-icon" />
        </div>
        <span class="item-label">{{ item.label }}</span>
        <div v-if="index === items.length - 1" class="separator-after"></div>
      </div>
      
      <div class="menu-separator"></div>
      
      <div class="start-menu-item" @click="$emit('close')">
        <div class="item-icon-container">
           <img src="https://storage.googleapis.com/gemini-95-icons/shutdown.png" class="item-icon" />
        </div>
        <span class="item-label">Desligar...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = [
  { app: 'myComputer', label: 'Meu Computador', icon: '/public/images/monitor_windows.png' },
  { app: 'chrome', label: 'Internet Explorer', icon: '/public/images/world-2.png' },
  { app: 'notepad', label: 'Bloco de Notas', icon: '/public/images/signature-1.png' },
  { app: 'paint', label: 'Paintbrush', icon: '/public/images/paint.png' },
  { app: 'mediaPlayer', label: 'Media Player', icon: 'https://storage.googleapis.com/gemini-95-icons/ytmediaplayer.png' },
]
</script>

<style scoped>
.start-menu {
  position: absolute;
  bottom: 30px; /* Alinhado com a nova taskbar */
  left: 2px;
  background-color: #c0c0c0;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  display: flex;
  z-index: 1000;
  min-width: 200px;
}

.start-sidebar {
  background: linear-gradient(180deg, #000080 0%, #1084d0 100%);
  width: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 10px;
}

.sidebar-text {
  color: #c0c0c0;
  font-family: 'Trebuchet MS', sans-serif;
  font-weight: bold;
  font-size: 14px;
  transform: rotate(-90deg);
  white-space: nowrap;
  transform-origin: center;
  margin-bottom: 60px;
}

.sidebar-text span {
  color: white;
  margin-left: 4px;
}

.start-content {
  flex: 1;
  padding: 2px;
  display: flex;
  flex-direction: column;
}

.start-menu-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: default;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}

.start-menu-item:hover {
  background-color: #000080;
  color: white;
}

.item-icon-container {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-icon {
  width: 20px;
  height: 20px;
  image-rendering: pixelated;
}

.menu-separator {
  height: 2px;
  background-color: #808080;
  border-bottom: 1px solid #ffffff;
  margin: 4px 2px;
}

.item-label {
  flex: 1;
}
</style>
