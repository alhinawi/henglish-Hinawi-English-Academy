import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const BASE = '/models/city/';
// CC0 source/licence records are preserved alongside assets and on /credits/.
export function createCityAssets() {
  const gltf = new GLTFLoader();
  const models = new Map<string, Promise<THREE.Object3D>>();
  let disposed = false;
  const load = (name: string) => {
    if (!models.has(name)) models.set(name, gltf.loadAsync(BASE + name + '.glb').then(result => result.scene));
    return models.get(name)!;
  };
  function fit(object: THREE.Object3D, size: number, byHeight = false) {
    const bounds = new THREE.Box3().setFromObject(object);
    const dimensions = bounds.getSize(new THREE.Vector3());
    const scale = byHeight ? size / dimensions.y : Math.min(size / Math.max(dimensions.x, dimensions.z), 10 / dimensions.y);
    object.scale.multiplyScalar(scale);
    bounds.setFromObject(object);
    const center = bounds.getCenter(new THREE.Vector3());
    object.position.set(-center.x, -bounds.min.y, -center.z);
    object.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
  return {
    async model(name: string, parent: THREE.Object3D, size: number, fallback?: THREE.Object3D[]) {
      try {
        const source = await load(name);
        if (disposed) return;
        const object = source.clone(true);
        fit(object, size);
        if (name.startsWith('tree')) object.traverse(child => {
          if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            child.material = materials.map(material => {
              const copy = material.clone();
              if (copy instanceof THREE.MeshStandardMaterial) { copy.metalness = 0; copy.roughness = 0.95; copy.color.multiply(new THREE.Color(0x819a62)); }
              return copy;
            });
          }
        });
        parent.add(object);
        fallback?.forEach(mesh => { mesh.visible = false; });
      } catch { /* Keep the original scene geometry if an asset cannot load. */ }
    },
    async building(parent: THREE.Object3D, floors: number, fallback: THREE.Object3D[]) {
      try {
        const source = await load('urban-real');
        if (disposed) return;
        const structure = new THREE.Group();
        const addPart = (group: THREE.Group, name: string, x: number, y: number) => {
          const template = source.getObjectByName(name);
          if (!template) return;
          const mesh = template.clone(true); mesh.position.set(x, y, 0); group.add(mesh);
        };
        for (let face = 0; face < 4; face++) {
          const side = new THREE.Group(); side.rotation.y = face * Math.PI / 2;
          side.position.set(Math.sin(side.rotation.y) * 3, 0, Math.cos(side.rotation.y) * 3);
          for (let column = 0; column < 2; column++) {
            const x = column * 3;
            for (let floor = 0; floor < floors; floor++) {
              const door = floor === 0 && face === 0 && column === 1;
              addPart(side, door ? 'wall_door_centered_small_01' : 'wall_window_centered_small_01', x, floor * 3);
              addPart(side, door ? 'door_centered_small_01' : 'window_centered_small_01', x, floor * 3);
            }
            addPart(side, 'crown_standard_standard_01', x, floors * 3);
          }
          structure.add(side);
        }
        const roof = new THREE.Mesh(new THREE.BoxGeometry(6, 0.15, 6), new THREE.MeshStandardMaterial({color: 0x45464a, roughness: 0.9}));
        roof.position.set(0, floors * 3, 0); structure.add(roof);
        structure.traverse(child => { if (child instanceof THREE.Mesh) { child.castShadow = true; child.receiveShadow = true; } });
        parent.add(structure); fallback.forEach(object => { object.visible = false; });
      } catch { /* Keep locally bundled fallback if the PBR kit fails to load. */ }
    },
    async person(parent: THREE.Object3D, female: boolean, player: boolean, fallback: THREE.Object3D[]) {
      try {
        const source = await load(female ? 'person-woman' : 'person-man');
        if (disposed) return;
        const object = source.clone(true);
        fit(object, 1.8, true);
        if (player) object.rotation.y = Math.PI;
        parent.add(object);
        fallback.forEach(mesh => { mesh.visible = false; });
      } catch { /* Retain the original fallback when offline. */ }
    },
    dispose() {
      disposed = true;

      models.forEach(promise => { void promise.then(object => object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(material => {
            Object.values(material).forEach(value => { if (value instanceof THREE.Texture) value.dispose(); });
            material.dispose();
          });
        }
      })).catch(() => {}); });
    },
  };
}

/** Locally authored paving map. No third-party image requests or attribution in-world. */
export function pavementTexture() {
  const texture = new THREE.TextureLoader().load('/models/city/paving-Diffuse.webp');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}
