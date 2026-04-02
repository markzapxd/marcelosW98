<template>
  <div class="retro-container">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <!-- Overlay de Scanlines (sutil) -->
    <div class="scanlines"></div>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: black;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  font-smooth: never;
  -webkit-font-smoothing: none;
}

.retro-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: black;
}

.scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.05) 50%
  );
  background-size: 100% 2px;
}
</style>
