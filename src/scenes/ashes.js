import * as THREE from 'three';
import { particles } from '../core/utils.js';

export function buildAshes() {
  const group = new THREE.Group();
  group.name = 'ashes';
  const ash = particles(THREE, group, 4200, 0x9a8f84, 0.045, [34, 25, 30]);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.1, 32, 24), new THREE.MeshBasicMaterial({ color: 0xf0c68e }));
  sun.position.set(5, 1, -14);
  group.add(sun);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(5, 0.018, 5, 180), new THREE.MeshBasicMaterial({ color: 0xbaa47f, transparent: true, opacity: 0.3 }));
  halo.position.copy(sun.position);
  group.add(halo);
  return { group, update(dt, time, reduced) {
    if (reduced) return;
    ash.rotation.y += dt * 0.08;
    ash.rotation.z = Math.sin(time * 0.09) * 0.05;
    halo.rotation.z += dt * 0.04;
    halo.material.opacity = 0.22 + Math.sin(time * 0.5) * 0.08;
  }};
}
