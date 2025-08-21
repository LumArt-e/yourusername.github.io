import * as THREE from 'three';
const canvas = document.getElementById('bg-canvas');
let renderer, scene, camera;
let objects = [];
let mode = 0; // 0: esfera, 1: gotas, 2: líneas, 3: ondas
let modeTime = 0;
const modeDuration = 4000; // ms por modo
const brandingColors = [
  0xE4405F, // magenta
  0xFFB347, // naranja
  0x43E8D8, // azul claro
  0x5FF47B, // verde
  0xFFD700, // amarillo
  0x6A3BFF, // violeta
];
// Interacción mouse
let mouseX = 0, mouseY = 0;
canvas.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});
canvas.addEventListener('touchmove', e => {
  if (e.touches.length) {
    mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
  }
});
function randomColor() {
  return brandingColors[Math.floor(Math.random()*brandingColors.length)];
}
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 3.2;
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  createSphere();
  animate();
}
function createSphere() {
  clearObjects();
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshPhysicalMaterial({
    color: randomColor(),
    roughness: 0.5,
    metalness: 0.6,
    transparent: true,
    opacity: 0.85,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
    sheen: 0.6,
    sheenColor: new THREE.Color(randomColor()),
  });
  const sphere = new THREE.Mesh(geometry, material);
  objects.push(sphere);
  scene.add(sphere);
  brandingColors.forEach((col, i) => {
    const light = new THREE.PointLight(col, 0.7 + Math.random()*0.7, 7);
    light.position.set(Math.cos(i)*2, Math.sin(i)*2, 2 + Math.random()*2);
    scene.add(light);
    objects.push(light);
  });
}
function createDrops() {
  clearObjects();
  for (let i = 0; i < 24; i++) {
    const geometry = new THREE.SphereGeometry(0.19 + Math.random() * 0.07, 24, 24);
    const material = new THREE.MeshStandardMaterial({
      color: randomColor(),
      transparent: true,
      opacity: 0.88,
      roughness: 0.3 + Math.random()*0.4
    });
    const drop = new THREE.Mesh(geometry, material);
    const angle = (i / 24) * Math.PI * 2;
    const radius = 1.2 + Math.random()*0.7;
    drop.position.x = Math.cos(angle) * radius;
    drop.position.y = Math.sin(angle) * radius;
    drop.position.z = Math.random()*1.1-0.55;
    objects.push(drop);
    scene.add(drop);
  }
  const ambient = new THREE.AmbientLight(0xffffff, 1.20);
  scene.add(ambient);
  objects.push(ambient);
}
function createLines() {
  clearObjects();
  for (let i = 0; i < 12; i++) {
    const points = [];
    const color = randomColor();
    const length = 1.5 + Math.random();
    for (let j = 0; j < 15; j++) {
      points.push(new THREE.Vector3(
        Math.cos(i + j*0.1) * (length + Math.sin(j*0.3)*0.5),
        Math.sin(i + j*0.1) * (length + Math.cos(j*0.3)*0.4),
        Math.sin(j*0.2)*0.5
      ));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 2,
      transparent: true,
      opacity: 0.72
    });
    const line = new THREE.Line(geometry, material);
    objects.push(line);
    scene.add(line);
  }
  const ambient = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambient);
  objects.push(ambient);
}
function createWaves() {
  clearObjects();
  for (let w = 0; w < 5; w++) {
    const points = [];
    const color = randomColor();
    for (let j = 0; j < 60; j++) {
      points.push(new THREE.Vector3(
        (j-30)/20,
        Math.sin(j*0.16 + w*1.5) * (0.3 + w*0.14),
        Math.cos(j*0.19 + w*1.5) * 0.15
      ));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 2,
      transparent: true,
      opacity: 0.65 + Math.random()*0.25
    });
    const wave = new THREE.Line(geometry, material);
    objects.push(wave);
    scene.add(wave);
  }
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  objects.push(ambient);
}
function clearObjects() {
  while (objects.length) {
    const obj = objects.pop();
    scene.remove(obj);
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
  }
}
function animate(now) {
  requestAnimationFrame(animate);
  if (!modeTime) modeTime = now;
  if (now - modeTime > modeDuration) {
    mode = (mode + 1) % 4;
    if (mode === 0) createSphere();
    if (mode === 1) createDrops();
    if (mode === 2) createLines();
    if (mode === 3) createWaves();
    modeTime = now;
  }
  if (mode === 0 && objects[0]) {
    objects[0].rotation.y += 0.01 + mouseX*0.03;
    objects[0].rotation.x += 0.008 + mouseY*0.02;
    for (let i = 1; i < objects.length; i++) {
      if (objects[i].position) {
        objects[i].position.x += mouseX*0.02;
        objects[i].position.y += mouseY*0.02;
      }
    }
  }
  if (mode === 1) {
    objects.forEach((d, i) => {
      if (d.position) {
        d.position.x += Math.sin(Date.now()/700 + i + mouseX*2) * 0.002;
        d.position.y += Math.cos(Date.now()/700 + i + mouseY*2) * 0.002;
      }
    });
  }
  if (mode === 2 || mode === 3) {
    objects.forEach((l, i) => {
      if (l.geometry && l.geometry.attributes.position) {
        let arr = l.geometry.attributes.position.array;
        for (let j = 0; j < arr.length; j += 3) {
          arr[j+1] += Math.sin(Date.now() / (150 + i*28) + j*0.11 + i + mouseY*2) * 0.0013;
          arr[j] += Math.cos(Date.now() / (170 + i*28) + j*0.13 + i + mouseX*2) * 0.0009;
        }
        l.geometry.attributes.position.needsUpdate = true;
      }
    });
  }
  renderer.render(scene, camera);
}
window.addEventListener('resize', () => {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
init();