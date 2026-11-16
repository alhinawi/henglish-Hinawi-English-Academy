const fs=require('fs'),assert=require('assert/strict');
const world=fs.readFileSync('src/components/Interactive3DWorld.tsx','utf8'),admin=fs.readFileSync('src/components/video/AdminVideoManagementModal.tsx','utf8');
assert.ok(world.includes('{t(selectedLocation.nameAr)}'));assert.ok(!world.includes('{selectedLocation.nameAr}'));
assert.ok(admin.includes("useAppTextMap('videoLibraryService')"));assert.ok(admin.includes('txText(videoText, c.nameAr)'));assert.ok(admin.includes('value={c.id}'));
console.log('World modal resolves its locale key; admin categories use existing content map with stable IDs: PASS');
