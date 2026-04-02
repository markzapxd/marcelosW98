<template>
  <div class="flex flex-col h-full">
    <div class="media-player-url-bar flex items-center gap-2 p-2 bg-gray-200 border-b border-gray-400">
      <input type="text" class="media-player-input flex-1 border border-gray-400 rounded px-2 py-1" placeholder="Enter YouTube Video URL or ID" v-model="input" @keyup.enter="load" />
      <button class="media-player-load-button bg-blue-500 text-white px-2 py-1 rounded text-xs" @click="load">Load</button>
    </div>
    <div class="media-player-video-container flex-1 flex items-center justify-center bg-black">
      <div id="youtube-player-mediaPlayer" class="w-full h-full flex items-center justify-center">
        <iframe v-if="videoId" :src="embedUrl" frameborder="0" allowfullscreen class="w-full h-64"></iframe>
        <p v-else class="media-player-status-message text-white">Loading PLayer...</p>
      </div>
    </div>
    <div class="media-player-controls-panel flex items-center gap-2 p-2 bg-gray-200 border-t border-gray-400">
      <div class="media-player-buttons-group flex gap-1">
        <button class="media-player-control-button bg-green-500 text-white px-2 rounded" title="Play">▶</button>
        <button class="media-player-control-button bg-yellow-500 text-white px-2 rounded" title="Pause">❚❚</button>
        <button class="media-player-control-button bg-red-500 text-white px-2 rounded" title="Stop">■</button>
      </div>
      <div class="media-player-progress-bar-container-placeholder flex-1 mx-2">
        <div class="media-player-progress-bar-placeholder h-2 bg-gray-400 rounded"></div>
      </div>
      <div class="media-player-volume-placeholder flex items-center gap-1">
        <span>🔊</span>
        <div class="media-player-volume-slider-placeholder w-16 h-2 bg-gray-400 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const input = ref('')
const videoId = ref('')
const embedUrl = computed(() => videoId.value ? `https://www.youtube.com/embed/${videoId.value}` : '')
function load() {
  let val = input.value.trim()
  // Extrai ID do YouTube
  const match = val.match(/(?:v=|youtu\.be\/|embed\/)?([\w-]{11})/)
  videoId.value = match ? match[1] : ''
}
</script>
