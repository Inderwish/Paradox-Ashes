import * as THREE from 'three';
import { seededRandom } from '../core/utils.js';

const THEMES = {
  megacity: {
    seed: 77,
    frozen: false,
    shellColors: [0x0c1119, 0x121b26, 0x1c2632, 0x222f3c],
    windowColors: [0x86e7ff, 0xffc477],
    ground: 0x070a0e,
    fogParticles: 900,
    particleColor: 0x6ab8c4,
    particleSize: 0.035,
    height: 22
  },
  frozen: {
    seed: 247,
    frozen: true,
    shellColors: [0x18303d, 0x234454, 0x2e5666, 0x476c78],
    windowColors: [0xc9f3ff, 0x88d8ed],
    ground: 0xa8cad5,
    fogParticles: 2100,
    particleColor: 0xd8f7ff,
    particleSize: 0.055,
    height: 17
  }
};

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const unitWindow = new THREE.PlaneGeometry(1, 1);

function staticMesh(parent, geometry, material, scale, position, shadows = false) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(...scale);
  mesh.position.set(...position);
  mesh.castShadow = shadows;
  mesh.receiveShadow = shadows;
  mesh.updateMatrix();
  mesh.matrixAutoUpdate = false;
  parent.add(mesh);
  return mesh;
}

function makeParticles(count, color, size, random) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (random() - 0.5) * 100;
    positions[i * 3 + 1] = (random() - 0.5) * 38;
    positions[i * 3 + 2] = (random() - 0.5) * 105 - 18;
    speed[i] = 0.45 + random() * 1.55;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('speed', new THREE.BufferAttribute(speed, 1));
  return new THREE.Points(geometry, new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity: 0.68,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
}

export function buildCity(name) {
  const theme = THEMES[name];
  const random = seededRandom(theme.seed);
  const group = new THREE.Group();
  group.name = name;

  const shellMaterials = theme.shellColors.map(color => new THREE.MeshStandardMaterial({
    color,
    roughness: theme.frozen ? 0.2 : 0.62,
    metalness: theme.frozen ? 0.08 : 0.42,
    transparent: theme.frozen,
    opacity: theme.frozen ? 0.76 : 1
  }));
  const crownMaterial = new THREE.MeshStandardMaterial({ color: theme.frozen ? 0x5b8490 : 0x283746, roughness: 0.42, metalness: 0.58 });
  const roadMaterial = new THREE.MeshStandardMaterial({ color: theme.ground, roughness: 0.92, metalness: 0.06 });
  const bridgeMaterial = new THREE.MeshStandardMaterial({ color: 0x39434d, roughness: 0.46, metalness: 0.65 });
  const lineMaterial = new THREE.MeshBasicMaterial({ color: theme.frozen ? 0xe8fbff : 0xd8d09c });

  staticMesh(group, unitBox, roadMaterial, [112, 0.4, 108], [0, -4.4, -25]);

  const towers = [];
  const windows = [[], []];
  for (let lane = 0; lane < 6; lane++) {
    for (let index = 0; index < 26; index++) {
      const width = 0.9 + random() * 2.3;
      const depth = 0.9 + random() * 2.4;
      const height = 3 + random() * theme.height;
      const x = -41 + index * 3.3 + random() * 0.7;
      const z = -7 - lane * 9 - random() * 3.2;
      const y = -4 + height / 2;
      const materialIndex = Math.floor(random() * shellMaterials.length);
      towers.push({ x, y, z, width, height, depth, materialIndex });

      const cols = Math.max(1, Math.floor(width / 0.33));
      const rows = Math.max(3, Math.floor(height / 0.48));
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (random() < 0.48) continue;
          const tone = random() < (theme.frozen ? 0.9 : 0.63) ? 0 : 1;
          windows[tone].push({
            x: x - width / 2 + (col + 0.5) * width / cols,
            y: -3.68 + row * 0.46,
            z: z + depth / 2 + 0.012,
            sx: 0.105,
            sy: 0.18
          });
        }
      }

      if (random() > 0.46) {
        staticMesh(group, unitBox, crownMaterial, [width * 0.55, 0.35 + random() * 0.85, depth * 0.58], [x, -3.72 + height, z]);
      }
    }
  }

  shellMaterials.forEach((material, materialIndex) => {
    const list = towers.filter(tower => tower.materialIndex === materialIndex);
    const instances = new THREE.InstancedMesh(unitBox, material, list.length);
    const dummy = new THREE.Object3D();
    list.forEach((tower, index) => {
      dummy.position.set(tower.x, tower.y, tower.z);
      dummy.scale.set(tower.width, tower.height, tower.depth);
      dummy.updateMatrix();
      instances.setMatrixAt(index, dummy.matrix);
    });
    instances.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    instances.frustumCulled = true;
    group.add(instances);
  });

  windows.forEach((list, tone) => {
    const material = new THREE.MeshBasicMaterial({ color: theme.windowColors[tone], side: THREE.DoubleSide });
    const instances = new THREE.InstancedMesh(unitWindow, material, list.length);
    const dummy = new THREE.Object3D();
    list.forEach((window, index) => {
      dummy.position.set(window.x, window.y, window.z);
      dummy.scale.set(window.sx, window.sy, 1);
      dummy.updateMatrix();
      instances.setMatrixAt(index, dummy.matrix);
    });
    instances.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    group.add(instances);
  });

  for (const x of [-11, 11]) {
    staticMesh(group, unitBox, roadMaterial, [8, 0.055, 96], [x, -4.16, -25]);
    for (let z = -68; z < 23; z += 4.2) staticMesh(group, unitBox, lineMaterial, [0.11, 0.062, 1.65], [x, -4.1, z]);
  }
  staticMesh(group, unitBox, bridgeMaterial, [70, 0.38, 1.55], [0, 1, -18]);
  for (let x = -31; x <= 31; x += 6.2) staticMesh(group, unitBox, bridgeMaterial, [0.48, 5.2, 0.68], [x, -1.7, -18]);

  const weather = makeParticles(theme.fogParticles, theme.particleColor, theme.particleSize, random);
  group.add(weather);

  return {
    group,
    update(dt, time, reducedMotion = false) {
      if (reducedMotion) return;
      const positions = weather.geometry.attributes.position;
      const speeds = weather.geometry.attributes.speed;
      if (theme.frozen) {
        for (let i = 0; i < positions.count; i++) {
          let y = positions.getY(i) - dt * speeds.getX(i) * 1.35;
          if (y < -18) y = 19;
          positions.setY(i, y);
        }
        positions.needsUpdate = true;
      } else {
        weather.rotation.y = Math.sin(time * 0.05) * 0.035;
      }
    }
  };
}
