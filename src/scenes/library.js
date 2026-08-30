import * as THREE from 'three';
import { seededRandom, particles } from '../core/utils.js';

const unitBox = new THREE.BoxGeometry(1, 1, 1);

export function buildLibrary() {
  const group = new THREE.Group();
  group.name = 'library';
  const random = seededRandom(33);
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x4b2916, roughness: 0.78, metalness: 0.04 });
  const bookMaterials = Array.from({ length: 8 }, (_, index) => new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(index / 8, 0.42, 0.18 + (index % 3) * 0.05),
    roughness: 0.82,
    metalness: 0.02
  }));
  const books = bookMaterials.map(() => []);
  const dummy = new THREE.Object3D();

  for (const side of [-1, 1]) {
    for (let level = 0; level < 8; level++) {
      const y = -4 + level * 2.5;
      const shelf = new THREE.Mesh(unitBox, shelfMaterial);
      shelf.scale.set(22, 0.2, 3);
      shelf.position.set(side * 12, y, -14);
      shelf.updateMatrix();
      shelf.matrixAutoUpdate = false;
      group.add(shelf);

      for (let index = 0; index < 34; index++) {
        const height = 1.2 + random() * 0.9;
        const width = 0.18 + random() * 0.34;
        const materialIndex = Math.floor(random() * bookMaterials.length);
        books[materialIndex].push({
          position: [side * 12 - 10 + index * 0.6, y + height / 2 + 0.14, -13.8],
          scale: [width, height, 1.5],
          rotation: random() > 0.86 ? (random() - 0.5) * 0.18 : 0
        });
      }
    }
  }

  books.forEach((items, materialIndex) => {
    const mesh = new THREE.InstancedMesh(unitBox, bookMaterials[materialIndex], items.length);
    items.forEach((item, index) => {
      dummy.position.set(...item.position);
      dummy.scale.set(...item.scale);
      dummy.rotation.set(0, 0, item.rotation);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    group.add(mesh);
  });

  const shafts = [];
  const shaftGeometry = new THREE.CylinderGeometry(0.3, 3.6, 32, 18, 1, true);
  const shaftMaterial = new THREE.MeshBasicMaterial({ color: 0xffcf8b, transparent: true, opacity: 0.055, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
  for (let index = 0; index < 7; index++) {
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial.clone());
    shaft.position.set(-20 + index * 7, 4, -14 - (index % 2) * 5);
    shaft.rotation.z = (index - 3) * 0.035;
    shafts.push(shaft);
    group.add(shaft);
  }

  const dust = particles(THREE, group, 850, 0xe0ae62, 0.035, [55, 35, 55], random);
  return { group, update(dt, time, reduced) {
    if (reduced) return;
    dust.rotation.z += dt * 0.015;
    shafts.forEach((shaft, index) => {
      shaft.material.opacity = 0.045 + Math.sin(time * 0.35 + index) * 0.018;
    });
  }};
}
