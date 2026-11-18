import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';

const root = resolve('out');
const port = Number(process.env.PORT || 5173);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.mp3':'audio/mpeg', '.wav':'audio/wav', '.pdf':'application/pdf', '.woff2':'font/woff2', '.wasm':'application/wasm', '.ico':'image/x-icon' };
if (!existsSync(resolve(root, 'index.html'))) throw new Error('Run npm run build before preview.');
http.createServer((req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {'Allow':'GET, HEAD'}).end(); return; }
  let file;
  try { file = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
  catch { res.writeHead(400).end(); return; }
  if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = resolve(file,'index.html');
  if (!existsSync(file) || !statSync(file).isFile()) { res.writeHead(404).end('Not found'); return; }
  const size=statSync(file).size;
  const headers={'Content-Type':types[extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','Content-Length':size};
  let start=0,end=size-1,status=200;
  if (req.headers.range) {
    const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (!m || (!m[1] && !m[2])) { res.writeHead(416,{'Content-Range':`bytes */${size}`}).end(); return; }
    if (m[1]) { start=Number(m[1]); end=m[2]?Math.min(Number(m[2]),size-1):size-1; }
    else start=Math.max(0,size-Number(m[2]));
    if (start>end || start>=size) { res.writeHead(416,{'Content-Range':`bytes */${size}`}).end(); return; }
    status=206; headers['Content-Length']=end-start+1; headers['Content-Range']=`bytes ${start}-${end}/${size}`;
  }
  res.writeHead(status,headers);
  if(req.method==='HEAD' || size===0) res.end();
  else createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`Next.js static export preview: http://127.0.0.1:${port}`));
