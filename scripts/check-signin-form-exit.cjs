const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
async function test(name,operation,afterExit,success){
 const s=fs.readFileSync('src/views/auth/'+name+'.tsx','utf8');let valid=true,resolve;const effects=[];
 const c={exports:{},identifier:'audit@example.invalid',password:'Example123',fullName:'Audit User',email:'audit@example.invalid',username:'',phone:'',confirmPassword:'Example123',isPasswordValid:true,agreeTerms:true,t:k=>k,setErrorMessage:v=>effects.push(['error',v]),setFeedback:v=>effects.push(['feedback',v]),setIsSubmitting:v=>effects.push(['submitting',v]),setIsSubmitted:v=>effects.push(['submitted',v]),playSound:v=>effects.push(['sound',v]),fireCelebration:()=>effects.push(['celebrate']),onNavigate:v=>effects.push(['navigate',v]),beginRequest:()=>()=>valid};c[operation]=()=>new Promise(r=>resolve=r);
 vm.runInNewContext(ts.transpileModule(s.slice(s.indexOf('  const handleSubmit ='),s.indexOf('\n  return ('))+'exports.submit=handleSubmit;',{}).outputText,c);
 const pending=c.exports.submit({preventDefault(){}});const before=effects.length;if(afterExit)valid=false;resolve({success,error:'controlled error'});await pending;
 if(afterExit)assert.equal(effects.length,before,name+' must not emit late UI feedback/navigation');else assert(effects.length>before,name+' retains active response');
}
(async()=>{for(const [name,operation]of [['LoginPage','login'],['RegisterPage','register'],['ForgotPasswordPage','forgotPassword']])for(const success of [true,false])for(const exit of [true,false])await test(name,operation,exit,success);console.log('Actual login/register/recovery submit handlers ignore late success/error after exit and retain active responses: PASS')})().catch(e=>{console.error(e);process.exitCode=1});
