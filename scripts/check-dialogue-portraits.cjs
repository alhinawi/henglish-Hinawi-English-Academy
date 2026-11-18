const fs=require('fs'),assert=require('assert/strict');
const sources=JSON.parse(fs.readFileSync('docs/dialogue-portrait-sources.json','utf8'));
assert.equal(sources.images.length,10);assert.equal(new Set(sources.images.map(x=>x.name)).size,10);
for(const x of sources.images){assert(x.source.startsWith('https://www.pexels.com/photo/'));assert(x.download.startsWith('https://images.pexels.com/photos/'));assert.equal(x.licenseUrl,'https://www.pexels.com/license/');assert(x.src===`/images/pool/av-${x.name}.webp`);const image=fs.readFileSync('public'+x.src);assert.equal(image.toString('ascii',0,4),'RIFF');assert.equal(image.toString('ascii',8,12),'WEBP');assert(image.length<100000);assert(fs.readFileSync('public/credits/index.html','utf8').includes(x.source));}
const view=fs.readFileSync('src/components/SpeakingLegacyPractice.tsx','utf8');assert(view.includes('src={line.avatarUrl} alt=""'));assert(!view.includes('<span>{line.avatar}</span>'));assert(sources.policy.includes('fictional'));
console.log('Ten real-photo dialogue portraits are local lightweight WebP,unique,licensed/credited,and decorate fictional speaker labels without model identity claims: PASS');
