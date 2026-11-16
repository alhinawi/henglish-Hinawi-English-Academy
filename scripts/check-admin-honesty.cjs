const fs=require('fs'),assert=require('assert/strict');
const s=fs.readFileSync('src/views/AdminDashboardPage.tsx','utf8');
assert.equal((s.match(/onSubmit=\{\(e\) => e.preventDefault\(\)\}/g)||[]).length,3);
assert.equal((s.match(/type="submit" disabled/g)||[]).length,3);
assert.equal((s.match(/<p role="status"[^\n]+ad.unavailable/g)||[]).length,3);
for(const invented of ['rating: 5.0','studentsCount: 1','lessonsCount: 6','setFormSaved(true)','setLessonSaved(true)','setVidSaved(true)','handleDeleteCourse','handleDeleteVideo'])assert(!s.includes(invented),invented);
for(const l of ['ar','en','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+l+'.json'));assert(d['ad.unavailable']);assert(d['ad.idValid']);}
console.log('Admin demo-only add/delete/publish paths disabled; no invented course metrics or false success: PASS');
