import * as THREE from "three";
import { init } from "./app";
import { vertexShader, fragmentShader } from "./asciiShader";

export function runPopup() {
  const { renderer, scene, camera, texture } = init();

  const material = new THREE.ShaderMaterial({
    uniforms: {
      tVideo: { value: texture }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  // Controle de redimensionamento
  window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Iniciando
  const video = document.getElementById("video");
  document.body.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      console.log("Bad Apple playing...");
    }
  });

  animate();
}
