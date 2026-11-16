// Exercise the real recovery/update function bodies with a mocked provider only.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = fs.readFileSync('src/services/authService.ts','utf8');
const ast = ts.createSourceFile('auth.ts',source,ts.ScriptTarget.Latest,true);
const selected=ast.statements.filter(n=>ts.isFunctionDeclaration(n) && ['requestPasswordRecovery','updatePassword'].includes(n.name?.text)).map(n=>n.getText(ast)).join('\n');
const js=ts.transpileModule(selected,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const context={exports:{},supabase:null,normalizeAuthError:()=> 'provider error',getSavedAuthSession:()=>null};
vm.runInNewContext(js,context);
(async()=>{
 const {requestPasswordRecovery:recover,updatePassword:update}=context.exports;
 assert.equal((await recover('test@example.invalid')).success,false);
 assert.equal((await recover('test@example.invalid')).error,'auth.recoveryUnavailable');
 assert.equal((await update('unused-test-password')).success,false);
 assert.equal((await update('unused-test-password')).error,'auth.passwordUpdateUnavailable');
 const calls=[];
 context.supabase={auth:{resetPasswordForEmail:async (...args)=>{calls.push(['recover',...args]);return {error:null}},updateUser:async (...args)=>{calls.push(['update',...args]);return {error:null}}}};
 assert.equal((await recover('  TEST@example.invalid ')).success,true);assert.equal(calls[0][1],'test@example.invalid');
 assert.equal((await update('unused-test-password')).success,true);assert.equal(calls[1][1].password,'unused-test-password');
 context.supabase.auth.resetPasswordForEmail=async()=>({error:new Error('failure')});
 context.supabase.auth.updateUser=async()=>{throw new Error('failure')};
 assert.equal((await recover('test@example.invalid')).success,false);assert.equal((await update('unused-test-password')).error,'provider error');
 for(const lang of ['ar','en','de']){
  const messages=JSON.parse(fs.readFileSync(`src/i18n/locales/${lang}.json`));
  for(const key of ['auth.recoveryUnavailable','auth.passwordUpdateUnavailable'])assert(messages[key]);
 }
 const login=fs.readFileSync('src/views/auth/LoginPage.tsx','utf8');assert(!login.includes('rememberMe'));assert(!login.includes("t('lp.remember')"));
 console.log('Recovery/update absent-provider errors, provider success/error passthrough, normalization and removed no-op checkbox: PASS');
})().catch(e=>{console.error(e);process.exit(1)});
