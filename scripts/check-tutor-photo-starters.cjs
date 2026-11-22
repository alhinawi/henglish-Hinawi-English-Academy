const fs=require('fs'),assert=require('assert/strict');
const view=fs.readFileSync('src/views/AiTutorPage.tsx','utf8');
const modes=['grammar-teacher','conversation-partner','vocabulary-coach','writing-assistant','pronunciation-coach','exam-trainer','interview-coach'];
const photos=JSON.parse(view.match(/const TUTOR_STARTER_PHOTOS: Record<AiTutorMode, string> = (\{[\s\S]*?\});/)[1]);
assert.deepEqual(Object.keys(photos),modes);assert.equal(new Set(Object.values(photos)).size,7);
const ledgers=['docs/academy-photography-sources.json','docs/academy-topic-photography.json'].flatMap(path=>JSON.parse(fs.readFileSync(path)).images);
for(const file of Object.values(photos)){assert(fs.existsSync('public'+file));assert(ledgers.some(row=>row.src===file));}
const panel=view.split("<section aria-label={t('at.photo.title')}")[1].split('</section>')[0];assert(panel.includes('setInputMessage('));assert(panel.includes('Boolean(inputMessage.trim())'));assert(!panel.includes('handleSendMessage('));assert(panel.includes('recognitionRef.current?.abort()'));
for(const lang of ['en','ar','de']){const t=JSON.parse(fs.readFileSync(`src/i18n/locales/${lang}.json`));for(const mode of modes){assert(t['at.photo.'+mode]);assert(t['at.starter.'+mode]?.length<1200);}}
console.log('7 licensed existing tutor scene photographs, captioned editable text-only starters, no auto-send or draft overwrite: PASS');
