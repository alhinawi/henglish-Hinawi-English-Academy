const fs=require('fs'),assert=require('assert/strict');const s=fs.readFileSync('src/components/MinimalPairRehearsal.tsx','utf8'),page=fs.readFileSync('src/views/PronunciationAcademyPage.tsx','utf8');
assert(page.includes('<MinimalPairRehearsal key={pair.id} pair={pair} onToggle={resetAudio}/>'));
for(const part of ['<SpeakingRecorder key=', 'pair.wordA', 'pair.wordB', 'aria-expanded={open}', 'onToggle(); setOpen', 'useEffect(() => () => stopSpeech(), [])'])assert(s.includes(part));
for(const part of ['localStorage', 'fetch(', 'awardXp','score:'])assert(!s.includes(part));
for(const lang of ['en','ar','de']){const t=JSON.parse(fs.readFileSync(`src/i18n/locales/${lang}.json`));for(const key of ['title','intro','open','close','compare','repeat','note'])assert(t['pa.pairRecord.'+key]);}
console.log('All existing minimal pairs gain optional keyed local recorder/self-review, close/reset and no automatic scoring: PASS');
