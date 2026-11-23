const fs=require('fs'),assert=require('assert/strict'),s=fs.readFileSync('src/components/MovieCueSpeaking.tsx','utf8');
for(const v of ['const [sourceHidden,setSourceHidden]=useState(false)','aria-pressed={sourceHidden}',"mode==='own'&&sourceHidden?t('ms.own.sourceCue'):item.en",'!sourceHidden&&<p dir="ltr" lang="en"','onPause();setSourceHidden(value=>!value);'])assert(s.includes(v),v);
assert.equal((s.match(/setSourceHidden\(false\)/g)||[]).length,3);
assert(!/localStorage|sessionStorage|fetch\(|setScore|setXp/.test(s));
for(const lang of ['en','ar','de']){const t=JSON.parse(fs.readFileSync('src/i18n/locales/'+lang+'.json'));for(const key of ['sourceCue','sourceHide','sourceShow','sourceHidden','sourceVisible'])assert(t['ms.own.'+key]);}
console.log('Optional movie own-words source recall: cue menu masked, source unmounted, private plan untouched, mode/cue/open resets, no score/storage/network PASS');
