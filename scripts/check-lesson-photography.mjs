import fs from 'node:fs';
import assert from 'node:assert/strict';
const photos=JSON.parse(fs.readFileSync('docs/lesson-photography-sources.json','utf8'));
const audit=JSON.parse(fs.readFileSync('docs/lesson-photography-topic-audit.json','utf8'));
assert.equal(Object.keys(photos).length,67);
assert.equal(audit.length,67);
assert.equal(new Set(Object.values(photos).map(v=>v[0].source)).size,67);
for(const [id,items] of Object.entries(photos)) {
 assert.equal(items.length,1,id);
 assert.ok(fs.existsSync('public'+items[0].src),id);
 assert.ok(audit.find(a=>a.lesson===id&&a.hero===items[0].src&&a.reason.length>40),id);
}
for(const file of ['src/views/LessonPage.tsx','src/views/GrammarLessonPage.tsx','src/components/LessonPhotography.tsx']) assert.doesNotMatch(fs.readFileSync(file,'utf8'),/LessonPhotoGallery|THE VISUAL NOTEBOOK|شوف اللغة في الحياة/);
console.log('67 topic-reviewed unique heroes; 0 decorative galleries; sources and rationale complete.');
