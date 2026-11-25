const fs=require('fs'),a=require('node:assert/strict'),s=fs.readFileSync('src/views/AiTutorPage.tsx','utf8');
a(s.includes('flex-1 min-w-0 px-2 py-3 sm:px-4 rounded-2xl bg-[#151430] border border-white/15 text-white text-base sm:text-sm'));
for(const v of ['maxLength={1200}','dir="auto"','value={inputMessage}','onChange={e => setInputMessage(e.target.value)}'])a(s.includes(v));
console.log('Tutor composer mobile16pxfont/horizontal8px;desktop14pxfont/16pxpadding,1200limit/autodir/state unchanged PASS');
