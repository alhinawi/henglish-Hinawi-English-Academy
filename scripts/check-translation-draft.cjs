const fs=require('fs'),assert=require('assert/strict');
const view=fs.readFileSync('src/components/translation/PracticeModeTab.tsx','utf8');
for(const part of ['drafts[challenge.id]', 'reviews[challenge.id]', 'maxLength={3000}', 'htmlFor="translation-practice-draft"', 'aria-expanded={revealed}', "['meaning','tense','natural']", "setReviews(value => ({ ...value, [challenge.id]: [] }))"])assert(view.includes(part),part);
for(const part of ['localStorage','sessionStorage','fetch(', 'onAwardXp(', 'executeTranslation('])assert(!view.includes(part),part);
for(const lang of ['en','ar','de']){const t=JSON.parse(fs.readFileSync(`src/i18n/locales/${lang}.json`));for(const key of ['draft','draftNote','checkTitle','check.meaning','check.tense','check.natural','checkNote'])assert(t['tpr.'+key]);}
console.log('Translation learner draft, challenge scoping, bounded input, own review only, no storage/network/XP: PASS');
