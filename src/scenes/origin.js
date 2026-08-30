import * as THREE from 'three';
import { particles } from '../core/utils.js';

export function buildOrigin() {
  const group = new THREE.Group();
  group.name = 'origin';
  const grid = new THREE.GridHelper(120, 80, 0x1f6c66, 0x102e2c);
  grid.position.y = -4;
  group.add(grid);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.4, 3),
    new THREE.MeshPhysicalMaterial({ color: 0x65e9d5, emissive: 0x0c5f58, emissiveIntensity: 1.5, wireframe: true, transparent: true, opacity: 0.5 })
  );
  core.position.set(7, 1, -7);
  group.add(core);

  const rings = [];
  for (let i = 0; i < 11; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3 + i * 0.72, 0.012, 4, 120),
      new THREE.MeshBasicMaterial({ color: 0x4db9ad, transparent: true, opacity: 0.13 })
    );
    ring.position.copy(core.position);
    ring.rotation.set(Math.PI / 2, i * 0.11, i * 0.17);
    ring.userData.speed = (i % 2 ? 1 : -1) * (0.08 + i * 0.005);
    rings.push(ring);
    group.add(ring);
  }
  const rain = particles(THREE, group, 900, 0x6adccd, 0.045, [52, 35, 45]);

  return { group, update(dt, time, reduced) {
    if (reduced) return;
    core.rotation.y += dt * 0.2;
    core.rotation.x += dt * 0.07;
    rings.forEach(ring => ring.rotation.z += dt * ring.userData.speed);
    const position = rain.geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      let y = position.getY(i) - dt * 3;
      if (y < -17) y = 17;
      position.setY(i, y);
    }
    position.needsUpdate = true;
    rain.rotation.y = Math.sin(time * 0.08) * 0.04;
  }};
}
