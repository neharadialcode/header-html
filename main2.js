import * as THREE from "https://cdn.skypack.dev/three@0.150.1";
import { OrbitControls } from "https://cdn.skypack.dev/three-controls@1.0.1";
const canvas = document.getElementById("canvas");

// Basic setup

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  200
);
camera.position.set(0, 20, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas,
});

renderer.setPixelRatio(window.devicePixelRatio);

// Responsive

const onResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

onResize();

// Controls

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;
controls.maxDistance = 200;
controls.enableDamping = true;

window.addEventListener("resize", onResize);

// Render loop

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});

// LOD

const lod = new THREE.LOD();

const v8 = new Float32Array([
  -4, 0, -3, -3, 0, -4, 3, 0, -4, 4, 0, -3, 4, 0, 3, 3, 0, 4, -3, 0, 4, -4, 0,
  3,
]);
const v24 = new Float32Array([
  -4, 0, -3, -3.960000000000001, 0, -3.3600000000000008, -3.84, 0, -3.64, -3.64,
  0, -3.84, -3.3600000000000003, 0, -3.96, -3, 0, -4, 3, 0, -4,
  3.3600000000000003, 0, -3.96, 3.64, 0, -3.84, 3.84, 0, -3.64,
  3.960000000000001, 0, -3.3600000000000008, 4, 0, -3, 4, 0, 3,
  3.960000000000001, 0, 3.3600000000000008, 3.84, 0, 3.64, 3.64, 0, 3.84,
  3.3600000000000003, 0, 3.96, 3, 0, 4, -3, 0, 4, -3.3600000000000003, 0, 3.96,
  -3.64, 0, 3.84, -3.84, 0, 3.64, -3.960000000000001, 0, 3.3600000000000008, -4,
  0, 3,
]);

lod.addLevel(createLineLoop(v8, 0x505050), 100); // 8 vertices ( low quality )
lod.addLevel(createLineLoop(v24, 0xffffff), 20); // 24 vertices ( high quality )

scene.add(lod);

function createLineLoop(data, color) {
  const geometry = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.BufferAttribute(data, 3)
  );
  const material = new THREE.LineBasicMaterial({ color });

  return new THREE.LineLoop(geometry, material);
}
