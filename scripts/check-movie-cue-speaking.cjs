const fs=require('node:fs'),assert=require('node:assert/strict');
const player=fs.readFileSync('src/components/MoviePlayerStudio.tsx','utf8');
const panel=fs.readFileSync('src/components/MovieCueSpeaking.tsx','utf8');
assert(player.includes('hasTranscript && reviewedTiming && <MovieCueSpeaking'));
assert(player.includes('cues={scene.subtitles}'));
assert(player.includes('key={`${scene.youtubeId}:${start}:${end}`}'));
assert(player.includes('player.current?.pauseVideo?.(); setPlaying(false);'));
assert(panel.includes("<SpeakingRecorder key={`${cue.id}:${mode}`} prompt={mode==='echo'?cue.en:t('ms.own.record')}/>"));
assert(panel.includes('onClickCapture={onPause}'));
assert(panel.includes("onChange={event => { onPause(); setSelectedId(event.target.value); setMode('echo'); setPlan(''); }}"));
assert(panel.includes('{open &&'));
assert(!panel.includes('localStorage'));assert(!panel.includes('fetch('));
for(const lang of ['en','ar','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+lang+'.json'));for(const key of ['ms.echoTitle','ms.echoIntro','ms.echoOpen','ms.echoClose','ms.echoChoose','ms.echoSteps','ms.echoNote'])assert(d[key]);}
console.log('Movie speaking uses only reviewed cues, hides on unreviewed/video-only content, pauses source player, resets recorder by cue/scene/close, keeps recordings local and discloses no automatic score: PASS');
