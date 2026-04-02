import * as THREE from "three";

export function init() {
  const canvas = document.getElementById("canvas");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // fundo transparente

  const scene = new THREE.Scene();

  // Câmera ortográfica para preencher o plano
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const video = document.getElementById("video");
  video.muted = false; // habilitar áudio

  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return { renderer, scene, camera, texture };
}
