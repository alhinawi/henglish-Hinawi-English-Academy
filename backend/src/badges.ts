import { Hono, type MiddlewareHandler } from 'hono'
import catalog from '../../shared/badges.json'
import curriculum from './certificateCurriculum.json'
type Env = {Bindings: Cloudflare.Env; Variables: {userId: number}}
export type BadgeEvidence = {
 account: boolean; avatar: boolean;
 checkpoints: {lesson_id: string; passed_at: number; score: number; total: number}[];
 attempts: {started_at: number; score: number; total: number}[];
 certificates: {definition_id: string; level: string}[];
}
export function evaluateBadges(e: BadgeEvidence, now = Date.now()) {
 const valid = e.attempts.filter(a => a.total > 0 && a.score / a.total >= .7)
 const days = new Set(valid.map(a => new Date(a.started_at * 1000).toISOString().slice(0,10)))
 // Achievement milestones use the best verified historical streak, not a local
 // counter and not a current streak that would erase an earned milestone.
 let streak = 0, run = 0, previousDay = 0
 for (const date of [...days].sort()) {
  const day=Date.parse(date+'T00:00:00Z')
  if(day>now)continue
  run=day-previousDay===86400000?run+1:1
  streak=Math.max(streak,run);previousDay=day
 }
 const metrics: Record<string,number> = {
  account: Number(e.account), avatar: Number(e.avatar), streak,
  lessons: new Set(e.checkpoints.map(p => p.lesson_id)).size,
  perfect: e.attempts.filter(a => a.total>0 && a.score===a.total).length,
  certificates: e.certificates.length,
  early: Number(valid.some(a => {const hour=Number(new Intl.DateTimeFormat('en-US',{timeZone:'Africa/Cairo',hour:'numeric',hourCycle:'h23'}).format(new Date(a.started_at*1000)));return hour>=5&&hour<8}))
 }
 for (const level of ['A1','A2','B1','B2','C1','C2']) {
  // A grammar diploma labelled C1 is not proof of general C1 proficiency.
  if (curriculum.definitions.some(d => d.id === 'cert-level-'+level.toLowerCase())) metrics['level:'+level] = Number(e.certificates.some(c => c.definition_id === 'cert-level-'+level.toLowerCase()))
 }
 metrics['section:grammar'] = e.checkpoints.filter(p => curriculum.lessons.some(l => l.id===p.lesson_id && l.route==='grammar-lesson')).length
 // Extend this map only with server-owned, non-client-writable evidence.
 // Capped/sanitized progress blobs and leaderboard display XP do NOT qualify.
 return catalog.map(b => {
  const available = Object.hasOwn(metrics,b.metric), current = Math.min(b.target,Math.max(0,metrics[b.metric]??0))
  return {id:b.id,current,target:b.target,unlocked:available&&current>=b.target,available}
 })
}
export function mountBadges(app:Hono<Env>, auth:MiddlewareHandler<Env>) {
 app.use('/api/badges',auth)
 app.get('/api/badges',async c=>{
  c.header('Cache-Control','no-store')
  const id=c.get('userId')
  const user=await c.env.DB.prepare('SELECT avatar FROM users WHERE id=?').bind(id).first<{avatar:string|null}>()
  if(!user)return c.json({error:'unauthorized'},401)
  const checkpoints=await c.env.DB.prepare('SELECT lesson_id,passed_at,score,total FROM certificate_checkpoints WHERE user_id=?').bind(id).all<BadgeEvidence['checkpoints'][number]>()
  const attempts=await c.env.DB.prepare('SELECT started_at,score,total FROM certificate_attempts WHERE user_id=? AND consumed=1 AND total>0 AND score IS NOT NULL').bind(id).all<BadgeEvidence['attempts'][number]>()
  const certificates=await c.env.DB.prepare('SELECT definition_id,level FROM certificates WHERE user_id=? AND revoked=0').bind(id).all<BadgeEvidence['certificates'][number]>()
  return c.json({badges:evaluateBadges({account:true,avatar:!!user.avatar,checkpoints:checkpoints.results,attempts:attempts.results,certificates:certificates.results}),evaluatedAt:new Date().toISOString()})
 })
}
