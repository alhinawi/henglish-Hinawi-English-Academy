const fs=require('fs'),assert=require('assert/strict');
const source=fs.readFileSync('src/services/aiPrompts.ts','utf8').split('/**')[0];
const modes=[...source.matchAll(/^  '([a-z-]+)': \{/gm)].map(m=>m[1]);assert.equal(modes.length,7);
for(const l of ['ar','en','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+l+'.json'));for(const mode of modes)for(const field of ['name','description'])assert.ok(d[`atm.${mode}.${field}`]);}
const view=fs.readFileSync('src/views/AiTutorPage.tsx','utf8');
assert.ok(view.includes('content: greeting'));
assert.ok(view.includes("`${assistantName} - ${t('at.startSession')}`"));
assert.ok(view.includes("content: `${t('at.welcomePre')} **${assistantName}**! ${t('at.welcomeAsk')}`"));
assert.ok(view.includes('handleSendMessage(sug.promptText)'));
assert.ok(view.includes('{sug.labelAr}'));
console.log('7 tutor display names/descriptions in ar/en/de; persisted welcome/title and learning prompts preserved: PASS');
