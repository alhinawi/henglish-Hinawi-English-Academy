// Run after npm run build:next. Local Pages only, no remote account writes.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const port=8791;
const server=spawn(process.execPath,['backend/node_modules/wrangler/bin/wrangler.js','pages','dev','out','--port',String(port)],{stdio:['ignore','pipe','pipe']});
let logs='';server.stdout.on('data',b=>logs+=b);server.stderr.on('data',b=>logs+=b);
try {
 let response;
 for(let i=0;i<120;i++){
  try{response=await fetch(`http://localhost:${port}/verify/HEN-routing-regression`,{redirect:'manual'});break;}
  catch{await new Promise(r=>setTimeout(r,250));}
 }
 assert(response,logs);
 assert.equal(response.status,200,`Signed URL must serve shell, not canonical redirect: ${response.status}`);
 assert.equal(response.headers.get('location'),null);
 assert((await response.text()).includes('التحقق من شهادة الإتمام'));
 console.log('PASS Pages /verify/<id> returns verification shell directly, without redirect or lost ID');
} finally {server.kill();await once(server,'exit');}
