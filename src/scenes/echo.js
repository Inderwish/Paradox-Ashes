import * as THREE from 'three';
import { particles, seededRandom } from '../core/utils.js';

export function buildEcho() {
  const group = new THREE.Group();
  group.name = 'echo';
  const random = seededRandom(319);
  const shards = [];
  for (let i = 0; i < 19; i++) {
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.5 + random() * 1.7, 1),
      new THREE.MeshPhysicalMaterial({ color: i % 3 ? 0x0ca99a : 0xe29a43, emissive: i % 3 ? 0x064c47 : 0x713b11, emissiveIntensity: 2, transmission: 0.42, transparent: true, opacity: 0.55, roughness: 0.08 })
    );
    mesh.position.set((random() - 0.5) * 28, (random() - 0.5) * 15, -4 - random() * 25);
    mesh.userData.phase = random() * Math.PI * 2;
    mesh.userData.baseY = mesh.position.y;
    shards.push(mesh);
    group.add(mesh);
  }
  const dust = particles(THREE, group, 750, 0x2dd4bf, 0.04, [42, 26, 50], random);
  return { group, update(dt, time, reduced) {
    if (reduced) return;
    shards.forEach((mesh, index) => {
      mesh.rotation.x += dt * (0.08 + index * 0.003);
      mesh.rotation.y += dt * (0.13 + index * 0.004);
      mesh.position.y = mesh.userData.baseY + Math.sin(time * 0.7 + mesh.userData.phase) * 0.35;
    });
    dust.rotation.y += dt * 0.018;
  }};
}
