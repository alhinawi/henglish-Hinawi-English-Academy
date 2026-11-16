import fs from 'node:fs';
import assert from 'node:assert/strict';
for (const name of ['man', 'woman']) {
  const path = new URL(`../../public/models/city/person-${name}-rigged.glb`, import.meta.url);
  const bytes = fs.readFileSync(path);
  const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
  assert.ok(bytes.length < 2.5 * 1024 * 1024, 'Per-character payload budget');
  assert.ok(json.skins?.length === 1, 'Skeleton missing');
  for (const clip of ['Idle', 'Walk']) {
    const animation = json.animations?.find(item => item.name === clip);
    assert.ok(animation?.channels.length >= 12, `${name}: ${clip} bone channels missing`);
  }
  assert.ok(json.meshes.some(mesh => mesh.primitives.some(p => p.attributes.JOINTS_0 !== undefined && p.attributes.WEIGHTS_0 !== undefined)), 'Skin weights missing');
  console.log(`${name}: weighted skeleton, Idle/Walk clips, ${(bytes.length / 1024).toFixed(0)}KB`);
}
