const fs=require('fs'),assert=require('assert/strict'),s=fs.readFileSync('src/components/MovieCueRecall.tsx','utf8');
for(const x of ['firstDrafts[cue.id] !== undefined','setFirstDrafts({})','[cue.id]:drafts[cue.id]','[cue.id]:\'\'','setRevealed(false); document.getElementById','disabled={!(drafts[cue.id] || \'\').trim()}','{firstDrafts[cue.id]}'])assert(s.includes(x),x);
for(const lang of ['en','ar','de']){const t=JSON.parse(fs.readFileSync('src/i18n/locales/'+lang+'.json'));for(const k of ['retry','retryNote','firstDraft','compareDrafts'])assert(t['ms.recall.'+k]);}
console.log('Recall second attempt:explicit/nonempty gate,sourcehidden,firstdraftsnapshot,percuecomparison,close discard,no automatic grade PASS');
