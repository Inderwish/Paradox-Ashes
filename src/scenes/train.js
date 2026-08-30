import * as THREE from 'three';
import { seededRandom, particles } from '../core/utils.js';

const unitBox = new THREE.BoxGeometry(1, 1, 1);

export function buildTrain() {
  const group = new THREE.Group();
  group.name = 'train';
  const random = seededRandom(501);
  const layers = [];
  const dummy = new THREE.Object3D();

  for (let layer = 0; layer < 4; layer++) {
    const buildings = [];
    for (let index = 0; index < 25; index++) {
      const height = 3 + random() * 12;
      buildings.push({
        x: -48 + index * 4 + random(),
        y: -4 + height / 2,
        z: -9 - layer * 8,
        width: 1 + random() * 3,
        height,
        depth: 1 + random() * 2
      });
    }
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.57, 0.1, 0.3 + layer * 0.12),
      roughness: 0.5,
      metalness: 0.36
    });
    const mesh = new THREE.InstancedMesh(unitBox, material, buildings.length);
    buildings.forEach((building, index) => {
      dummy.position.set(building.x, building.y, building.z);
      dummy.scale.set(building.width, building.height, building.depth);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.userData.speed = 2 + layer * 3;
    layers.push(mesh);
    group.add(mesh);
  }

  const railMaterial = new THREE.MeshStandardMaterial({ color: 0xb6c1cb, roughness: 0.22, metalness: 0.9 });
  for (const x of [-1.6, 1.6]) {
    const rail = new THREE.Mesh(unitBox, railMaterial);
    rail.scale.set(0.16, 0.12, 140);
    rail.position.set(x, -3.9, -35);
    rail.updateMatrix();
    rail.matrixAutoUpdate = false;
    group.add(rail);
  }

  const streaks = particles(THREE, group, 1000, 0xd9e6ee, 0.035, [90, 28, 80], random);
  streaks.scale.z = 3.5;

  return { group, update(dt, time, reduced) {
    if (reduced) return;
    layers.forEach(layer => {
      layer.position.x -= dt * layer.userData.speed;
      if (layer.position.x < -52) layer.position.x += 104;
    });
    streaks.position.z += dt * 13;
    if (streaks.position.z > 20) streaks.position.z = -20;
    streaks.material.opacity = 0.38 + Math.sin(time * 2.2) * 0.12;
  }};
}
