<template>
  <div class="badapple-container">
    <video ref="videoRef" src="/public/videos/bad_apple.mp4" loop playsinline style="display:none"></video>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from '@/src/badapple/asciiShader'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.OrthographicCamera
let texture: THREE.VideoTexture
let animationId: number
let localVideoEl: HTMLVideoElement | null = null

async function startVideo() {
  const video = videoRef.value
  if (video) {
    localVideoEl = video
    try {
      video.muted = false
      await video.play()
      console.log("Bad Apple Autoplay started")
    } catch (e) {
      console.warn("Autoplay was blocked by browser. This usually happens without prior interaction.", e)
      video.muted = true
      video.play()
    }
  }
}

function createCharTexture() {
  const chars = '@#$%&*()!_ '; // Caracteres do mais denso ao menos denso
  const charSize = 32;
  const canvas = document.createElement('canvas');
  canvas.width = charSize * chars.length;
  canvas.height = charSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = `bold ${charSize * 0.8}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], i * charSize + charSize / 2, charSize / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

function init() {
  if (!canvasRef.value || !videoRef.value) return

  const video = videoRef.value
  localVideoEl = video

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })

  const container = canvasRef.value.parentElement
  const width = container?.clientWidth || 800
  const height = container?.clientHeight || 600
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  texture = new THREE.VideoTexture(video)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter

  const charTexture = createCharTexture();

  const material = new THREE.ShaderMaterial({
    uniforms: {
      tVideo: { value: texture },
      uCharMap: { value: charTexture },
      uCharCount: { value: 11.0 }, // 10 chars + space
      uResolution: { value: new THREE.Vector2(width, height) }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })

  const geometry = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  function animate() {
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
}

const handleResize = () => {
  if (!canvasRef.value || !renderer) return
  const container = canvasRef.value.parentElement
  if (!container) return
  
  const width = container.clientWidth
  const height = container.clientHeight
  
  renderer.setSize(width, height, false)
  
  const material = (scene.children[0] as THREE.Mesh).material as THREE.ShaderMaterial
  if (material && material.uniforms.uResolution) {
    material.uniforms.uResolution.value.set(width, height)
  }
}

onMounted(() => {
  init()
  startVideo()
  window.addEventListener('resize', handleResize)
  
  const observer = new ResizeObserver(handleResize)
  if (canvasRef.value?.parentElement) {
    observer.observe(canvasRef.value.parentElement)
  }
})

const stopEverything = () => {
  console.log("Shutting down Bad Apple processes...")
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  
  // Usar a referência local caso o videoRef já esteja limpo
  const video = localVideoEl || videoRef.value
  if (video) {
    video.pause()
    video.muted = true
    video.src = ""
    video.load()
    video.remove() // Tentar remover forçadamente
    console.log("Video playback killed successfully.")
  } else {
    console.warn("Could not find video element to kill playback.")
  }
  
  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    scene.clear()
  }
}

onBeforeUnmount(() => {
  stopEverything()
})

onUnmounted(() => {
  stopEverything() // Safety double-call
})
</script>

<style scoped>
.badapple-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: transparent !important;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

canvas {
  display: block;
}
</style>
