<template>
  <div class="ascii-container" ref="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let effect: AsciiEffect
let mesh: THREE.Mesh
let controls: OrbitControls
let animationId: number

onMounted(() => {
  if (!container.value) return

  const width = container.value.clientWidth || 400
  const height = container.value.clientHeight || 300

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0, 0, 0)

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 4

  renderer = new THREE.WebGLRenderer()

  // ASCII effect
  effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true })
  effect.setSize(width, height)
  effect.domElement.style.color = '#00ff00'
  effect.domElement.style.backgroundColor = 'black'
  effect.domElement.style.fontFamily = 'monospace'
  effect.domElement.style.fontSize = '8px'

  container.value.appendChild(effect.domElement)

  // Controls
  controls = new OrbitControls(camera, effect.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // geometry
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
  const material = new THREE.MeshNormalMaterial()
  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Light for better effect
  const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0)
  pointLight1.position.set(500, 500, 500)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0)
  pointLight2.position.set(-500, -500, -500)
  scene.add(pointLight2)

  const updateSceneSize = (w: number, h: number) => {
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    effect.setSize(w, h)
    
    // Scale mesh based on window size to keep it prominent
    const scale = Math.min(w, h) / 300
    mesh.scale.set(scale, scale, scale)
  }

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    
    // Auto-rotation (subtle)
    mesh.rotation.x += 0.005
    mesh.rotation.y += 0.005
    
    controls.update()
    effect.render(scene, camera)
  }

  updateSceneSize(width, height)
  animate()

  // Handle Resize
  const resizeObserver = new ResizeObserver(() => {
    if (!container.value) return
    const newWidth = container.value.clientWidth
    const newHeight = container.value.clientHeight
    updateSceneSize(newWidth, newHeight)
  })
  resizeObserver.observe(container.value)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    scene.clear()
  }
})
</script>

<style scoped>
.ascii-container {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  background-color: black;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
