const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const source=fs.readFileSync('src/context/AuthContext.tsx','utf8');
const start=source.indexOf('  useEffect(() => {'),end=source.indexOf('\n  const login =',start);
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return{promise,resolve}};
const user=id=>({id,email:id+'@example.invalid',email_confirmed_at:'confirmed'});
const session=id=>({user:user(id),access_token:id+'-token'});
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve()};
function fixture(){
 const initial=deferred(),profile=deferred(),writes=[],loads=[];let callback,cleanup,unsubscribed=0,profileReads=0;
 const c={exports:{},useEffect:fn=>{cleanup=fn()},setSession:s=>writes.push(['state',s]),saveAuthSession:s=>writes.push(['save',s]),clearAuthSession:()=>writes.push(['clear']),switchGuestMode:()=>({type:'guest'}),setIsLoading:v=>loads.push(v),mapSupabaseUserToProfile:u=>u,supabase:{auth:{getSession:()=>initial.promise,onAuthStateChange:fn=>{callback=fn;return{data:{subscription:{unsubscribe(){unsubscribed++}}}}}},from:()=>{profileReads++;return{select:()=>({eq:()=>({single:()=>profile.promise})})}}}};
 vm.runInNewContext(ts.transpileModule(source.slice(start,end),{}).outputText,c);
 return{initial,profile,writes,loads,event:(...args)=>callback(...args),exit:()=>cleanup(),get unsubscribed(){return unsubscribed},get profileReads(){return profileReads}};
}
(async()=>{
 // The real effect is extracted and run. No live provider/account operations.
 for(const event of ['SIGNED_IN','SIGNED_OUT']){
  const f=fixture();f.initial.resolve({data:{session:session('old')}});await flush();assert.equal(f.profileReads,1);
  f.event(event,event==='SIGNED_IN'?session('new'):null);const before=JSON.stringify(f.writes);f.profile.resolve({data:{display_name:'old'}});await flush();
  assert.equal(JSON.stringify(f.writes),before,'late initial profile must not replace '+event);assert.equal(f.loads.at(-1),false);
 }
 for(const stage of ['session','profile']){
  const f=fixture();if(stage==='profile'){f.initial.resolve({data:{session:session('old')}});await flush()}
  f.exit();assert.equal(f.unsubscribed,1);f.initial.resolve({data:{session:session('old')}});f.profile.resolve({data:{}});await flush();
  assert.equal(f.writes.length,0);assert.equal(f.loads.length,0);f.event('SIGNED_IN',session('late'));assert.equal(f.writes.length,0);
 }
 const early=fixture();early.event('SIGNED_OUT',null);const before=JSON.stringify(early.writes);early.initial.resolve({data:{session:session('old')}});await flush();assert.equal(early.profileReads,0);assert.equal(JSON.stringify(early.writes),before);
 const valid=fixture();valid.initial.resolve({data:{session:session('valid')}});await flush();valid.profile.resolve({data:{}});await flush();assert.equal(valid.writes.length,2);assert.equal(valid.writes[0][1].user.id,'valid');assert.equal(valid.writes[1][0],'save');assert.equal(valid.loads.at(-1),false);
 console.log('Actual auth initialization effect: late getSession/profile cannot overwrite newer sign-in/sign-out or save after unmount; valid startup and loading completion retained: PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
