import { Hono, type MiddlewareHandler } from 'hono'
import curriculum from './certificateCurriculum.json'
import { newToken } from './crypto'
type Env={Bindings:Cloudflare.Env;Variables:{userId:number}}
type Question={prompt:string;options:string[];answer:number}
type Attempt={id:string;user_id:number;target:string;kind:string;started_at:number;expires_at:number;consumed:number;questions:string}
const now=()=>Math.floor(Date.now()/1000)
function shuffle<T>(input:T[]):T[]{const a=[...input];for(let i=a.length-1;i>0;i--){const r=crypto.getRandomValues(new Uint32Array(1))[0];const j=r%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a}
export async function signCertificateId(random:string,secret:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(random)));return `${random}.${Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}`}
export function gradeCertificate(questions:Question[],answers:unknown){if(!Array.isArray(answers)||answers.length!==questions.length||answers.some((a,i)=>!Number.isInteger(a)||a<0||a>=questions[i].options.length))return null;const score=questions.filter((q,i)=>q.answer===answers[i]).length;return{score,total:questions.length,percent:Math.floor(score/questions.length*100)}}
export function mountCertificates(app:Hono<Env>,auth:MiddlewareHandler<Env>){
 app.use('/api/certificates/*',async(c,next)=>{c.header('Cache-Control','no-store');await next()})
 app.use('/api/certificates/*',auth)
 app.get('/api/certificates/status',async c=>{
  const passed=await c.env.DB.prepare('SELECT lesson_id FROM certificate_checkpoints WHERE user_id=?').bind(c.get('userId')).all<{lesson_id:string}>()
  const set=new Set(passed.results.map(r=>r.lesson_id))
  const certs=await c.env.DB.prepare('SELECT id,definition_id,student_name,title,level,issued_at,score,total FROM certificates WHERE user_id=? AND revoked=0').bind(c.get('userId')).all()
  return c.json({definitions:curriculum.definitions.map(d=>({id:d.id,title:d.titleAr,titleEn:d.titleEn,level:d.cefrLevel,passMark:Math.max(70,d.minQuizAverage),required:d.requiredLessonIds.map(id=>{const l=curriculum.lessons.find(x=>x.id===id)!;return{id,title:l.title,route:l.route,target:l.target,passed:set.has(id)}})})),certificates:certs.results,configured:!!c.env.CERTIFICATE_SIGNING_SECRET})
 })
 app.post('/api/certificates/start',async c=>{
  let body:{kind?:string;target?:string};try{body=await c.req.json()}catch{return c.json({error:'invalid_body'},400)}
  if(!body||typeof body!=='object')return c.json({error:'invalid_body'},400)
  const kind=body.kind,target=body.target;if((kind!=='checkpoint'&&kind!=='final')||typeof target!=='string')return c.json({error:'invalid_target'},400)
  const def=curriculum.definitions.find(d=>d.id===target),lesson=curriculum.lessons.find(l=>l.id===target)
  if(kind==='final'&&!c.env.CERTIFICATE_SIGNING_SECRET)return c.json({error:'issuer_not_configured'},503)
  if((kind==='final'&&!def)||(kind==='checkpoint'&&!lesson))return c.json({error:'not_found'},404)
  if(kind==='final'){
   const passed=await c.env.DB.prepare('SELECT lesson_id FROM certificate_checkpoints WHERE user_id=?').bind(c.get('userId')).all<{lesson_id:string}>()
   if(!def!.requiredLessonIds.every(id=>passed.results.some(p=>p.lesson_id===id)))return c.json({error:'lessons_remaining'},403)
  }
  const pool=(kind==='final'?def!.finalQuestions:lesson!.questions) as Question[]
  const questions=shuffle(pool).slice(0,kind==='final'?12:3).map(q=>{const order=shuffle(q.options.map((_,i)=>i));return{prompt:q.prompt,options:order.map(i=>q.options[i]),answer:order.indexOf(q.answer)}})
  if(!questions.length)return c.json({error:'assessment_unavailable'},503)
  const id=newToken(),t=now(),seconds=kind==='final'?1200:600
  const insert=await c.env.DB.prepare('INSERT INTO certificate_attempts(id,user_id,target,kind,started_at,expires_at,questions) SELECT ?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM certificate_attempts WHERE user_id=? AND target=? AND kind=? AND started_at>?) < 3').bind(id,c.get('userId'),target,kind,t,t+seconds,JSON.stringify(questions),c.get('userId'),target,kind,t-86400).run()
  if(!insert.meta.changes)return c.json({error:'attempt_limit',retryAfterSeconds:86400},429)
  return c.json({attemptId:id,expiresAt:t+seconds,minSeconds:kind==='final'?60:10,questions:questions.map(q=>({prompt:q.prompt,options:q.options}))})
 })
 app.post('/api/certificates/submit',async c=>{
  let body:{attemptId?:string;answers?:unknown};try{body=await c.req.json()}catch{return c.json({error:'invalid_body'},400)}
  if(!body||typeof body!=='object'||typeof body.attemptId!=='string')return c.json({error:'invalid_attempt'},400)
  const a=await c.env.DB.prepare('SELECT * FROM certificate_attempts WHERE id=? AND user_id=?').bind(body.attemptId,c.get('userId')).first<Attempt>()
  if(!a||a.consumed)return c.json({error:'attempt_used_or_missing'},409)
  if(now()>a.expires_at)return c.json({error:'attempt_expired'},410)
  if(now()-a.started_at<(a.kind==='final'?60:10))return c.json({error:'too_fast'},422)
  if(a.kind==='final'&&!c.env.CERTIFICATE_SIGNING_SECRET)return c.json({error:'issuer_not_configured'},503)
  const questions=JSON.parse(a.questions) as Question[],grade=gradeCertificate(questions,body.answers)
  if(!grade)return c.json({error:'invalid_answers'},422)
  const consumed=await c.env.DB.prepare('UPDATE certificate_attempts SET consumed=1,score=?,total=? WHERE id=? AND user_id=? AND consumed=0 RETURNING id').bind(grade.score,grade.total,a.id,c.get('userId')).first()
  if(!consumed)return c.json({error:'attempt_used_or_missing'},409)
  const def=curriculum.definitions.find(d=>d.id===a.target),passed=grade.percent>=(a.kind==='final'?Math.max(70,def!.minQuizAverage):70)
  if(passed&&a.kind==='checkpoint')await c.env.DB.prepare('INSERT INTO certificate_checkpoints(user_id,lesson_id,passed_at,score,total) VALUES(?,?,?,?,?) ON CONFLICT(user_id,lesson_id) DO UPDATE SET passed_at=excluded.passed_at,score=excluded.score,total=excluded.total').bind(c.get('userId'),a.target,now(),grade.score,grade.total).run()
  let certificateId:string|null=null
  if(passed&&a.kind==='final'){
   const rows=await c.env.DB.prepare('SELECT lesson_id FROM certificate_checkpoints WHERE user_id=?').bind(c.get('userId')).all<{lesson_id:string}>()
   if(!def!.requiredLessonIds.every(id=>rows.results.some(r=>r.lesson_id===id)))return c.json({error:'lessons_remaining'},403)
   const user=await c.env.DB.prepare('SELECT name FROM users WHERE id=?').bind(c.get('userId')).first<{name:string}>()
   if(!user)return c.json({error:'unauthorized'},401)
   const id=await signCertificateId(`HEN-${newToken()}`,c.env.CERTIFICATE_SIGNING_SECRET!)
   await c.env.DB.prepare('INSERT INTO certificates(id,user_id,definition_id,student_name,title,level,issued_at,score,total,curriculum_version) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,definition_id) DO NOTHING').bind(id,c.get('userId'),def!.id,user.name,def!.titleEn,def!.cefrLevel,now(),grade.score,grade.total,curriculum.version).run()
   const row=await c.env.DB.prepare('SELECT id FROM certificates WHERE user_id=? AND definition_id=? AND revoked=0').bind(c.get('userId'),def!.id).first<{id:string}>();certificateId=row?.id??null
  }
  return c.json({passed,...grade,certificateId})
 })
 app.get('/api/verify/:id',async c=>{
  const id=c.req.param('id');if(id.length>200||!c.env.CERTIFICATE_SIGNING_SECRET)return c.json({valid:false},404)
  const dot=id.lastIndexOf('.');if(dot<0||await signCertificateId(id.slice(0,dot),c.env.CERTIFICATE_SIGNING_SECRET)!==id)return c.json({valid:false},404)
  const row=await c.env.DB.prepare('SELECT id,student_name,title,level,issued_at,score,total,curriculum_version FROM certificates WHERE id=? AND revoked=0').bind(id).first()
  c.header('Cache-Control','no-store');return row?c.json({valid:true,certificate:row}):c.json({valid:false},404)
 })
}
