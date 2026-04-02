<template>
  <div>
    <div class="browser-toolbar flex items-center gap-2 mb-2">
      <input
        type="text"
        class="browser-address-bar flex-1 border border-gray-400 rounded px-2 py-1"
        placeholder="Enter a website URL..."
        v-model="inputUrl"
        @keyup.enter="go"
      />
      <button class="browser-go-button bg-blue-500 text-white px-2 py-1 rounded text-xs" @click="go">Go!</button>
    </div>
    <div class="browser-viewport border border-gray-300 rounded bg-white" style="height: 300px;">
      <iframe
        :src="iframeUrl"
        width="100%"
        height="100%"
        class="w-full h-full"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const defaultUrl = 'https://web.archive.org/web/19990428171538/http://google.com/'
const inputUrl = ref(defaultUrl)
const iframeUrl = ref(defaultUrl)
function go() {
  let url = inputUrl.value.trim()
  if (!/^https?:\/\//.test(url)) url = 'https://' + url
  iframeUrl.value = ''
  setTimeout(() => {
    iframeUrl.value = url
  }, 10)
}
</script>
