import { useState } from 'react';
import { VOCABULARY_ACADEMY_WORDS as WORDS, VocabWord } from '../../../data/vocabularyAcademyData';
import { txText, useAppTextMap } from '../../../services/contentI18nService';
import { ArcadeHud, ArcadeEnd } from '../ArcadeShell';
import { sample, shuffle, uniqueAcademyWords } from '../arcadeContent';
import { ArcadeIcon } from '../ArcadeIcon';
import { useArcadeProgress } from '../../../services/arcadeProgressService';
import { playSound } from '../../../utils/audio';
import { useLanguage } from '../../../i18n/LanguageContext';
export const PUZZLE_GAMES = [
  { id: 'word-search', title: 'pz.game.word-search.title', tagline: 'pz.game.word-search.tagline' },
  { id: 'word-memory', title: 'pz.game.word-memory.title', tagline: 'pz.game.word-memory.tagline' },
  { id: 'category-sort', title: 'pz.game.category-sort.title', tagline: 'pz.game.category-sort.tagline' },
] as const;
export type PuzzleId = typeof PUZZLE_GAMES[number]['id'];
const CATEGORIES: Record<string,string> = { everyday:'pz.cat.everyday', business:'pz.cat.business', tech:'pz.cat.tech', academic:'pz.cat.academic', travel:'pz.cat.travel', workplace:'pz.cat.workplace', medical:'pz.cat.medical', food:'pz.cat.food', hotel:'pz.cat.hotel', phrasal_verbs:'pz.cat.phrasal_verbs', idioms:'pz.cat.idioms', collocations:'pz.cat.collocations' };
interface Card { text: string; pair: number; en: boolean; }
export interface GridWord { word: VocabWord; start: number; end: number; }
export function createWordGrid(pool: VocabWord[]) {
  const picked = sample(pool.filter(w=> /^[a-z]{3,7}$/i.test(w.word)),5);
  const grid = Array.from({length:64},()=>String.fromCharCode(65+Math.floor(Math.random()*26)));
  const rows = sample([0,1,2,3,4,5,6,7],picked.length);
  const hidden: GridWord[] = picked.map((word,i)=>{const reverse=Math.random()<0.5; const col=Math.floor(Math.random()*(9-word.word.length)); const start=rows[i]*8+col; const text=word.word.toUpperCase();for(let j=0;j<text.length;j++)grid[start+j]=text[reverse?text.length-1-j:j];return {word,start,end:start+text.length-1};});
  return {grid,hidden};
}
const btn='rounded-xl border border-white/15 bg-white/5 p-3 text-sm font-bold text-white disabled:opacity-40';
export function PuzzleGame({id,onExit}:{id:PuzzleId;onExit:()=>void}) {
  const { t }=useLanguage();
  const metaRaw=PUZZLE_GAMES.find(g=>g.id===id)!; const meta={...metaRaw,title:t(metaRaw.title),tagline:t(metaRaw.tagline)}; const progress=useArcadeProgress(); const { recordGameResult } = progress;
  const [phase,setPhase]=useState<'intro'|'play'|'end'>('intro'); const [level,setLevel]=useState('all');
  const [grid,setGrid]=useState<string[]>([]); const [hidden,setHidden]=useState<GridWord[]>([]); const [found,setFound]=useState<number[]>([]);const [anchor,setAnchor]=useState<number|null>(null);
  const [cards,setCards]=useState<Card[]>([]);const [opened,setOpened]=useState<number[]>([]);const [matched,setMatched]=useState<number[]>([]);const [moves,setMoves]=useState(0);
  const [rounds,setRounds]=useState<VocabWord[]>([]);const [options,setOptions]=useState<string[][]>([]);const [round,setRound]=useState(0);const [feedback,setFeedback]=useState<boolean|null>(null);const [wrong,setWrong]=useState<VocabWord[]>([]);
  const [score,setScore]=useState(0);const [result,setResult]=useState<{xpEarned:number;newBest:boolean}|null>(null);const [notice,setNotice]=useState('');
  const appText=useAppTextMap('vocabularyAcademyData');
  const start=()=>{const pool=uniqueAcademyWords(WORDS.filter(w=>level==='all'||w.level===level),true);setFound([]);setAnchor(null);setOpened([]);setMatched([]);setMoves(0);setRound(0);setScore(0);setFeedback(null);setWrong([]);setNotice('');
    if(id==='word-search'){const p=createWordGrid(pool);setGrid(p.grid);setHidden(p.hidden);}
    if(id==='word-memory'){const p=sample(pool,5);setCards(shuffle(p.flatMap((w,i)=>[{text:w.word,pair:i,en:true},{text:txText(appText,w.meaningAr),pair:i,en:false}])));}
    if(id==='category-sort'){const p=sample(pool,10);setRounds(p);setOptions(p.map(w=>shuffle([w.category,...sample(Object.keys(CATEGORIES).filter(c=>c!==w.category),3)])));}
    setPhase('play');};
  const finish=(s:number)=>{setScore(s);setResult(recordGameResult(id,s));setPhase('end');};
  const chooseCell=(i:number)=>{if(anchor===null){setAnchor(i);setNotice(t('pz.pickLast'));return;}const wi=hidden.findIndex(w=>(w.start===anchor&&w.end===i)||(w.end===anchor&&w.start===i));setAnchor(null);setMoves(m=>m+1);if(wi<0||found.includes(wi)){setNotice(t('pz.notNew'));playSound('wrong');return;}const nf=[...found,wi];setFound(nf);setNotice(`${t('pz.found')} ${hidden[wi].word.word}!`);playSound('correct');if(nf.length===hidden.length)finish(Math.max(1,hidden.length*4-Math.max(0,moves+1-hidden.length)));};
  const flip=(i:number)=>{if(opened.length>=2||opened.includes(i)||matched.includes(cards[i].pair))return;const no=[...opened,i];setOpened(no);if(no.length===2){setMoves(m=>m+1);if(cards[no[0]].pair===cards[no[1]].pair){const nm=[...matched,cards[i].pair];setMatched(nm);setOpened([]);playSound('correct');if(nm.length===cards.length/2)finish(Math.max(1,20-Math.max(0,moves+1-cards.length/2)));}}};
  if(phase==='intro')return <section className="max-w-lg mx-auto rounded-3xl border border-white/10 bg-[#121124] p-5 text-center space-y-5"><ArcadeIcon id={id} large/><h2 className="text-2xl font-black text-white">{meta.title}</h2><p className="text-sm leading-7 text-[#b9b6d5]">{meta.tagline}</p><label className="block text-sm text-white">{t('wl.levelLabel')}<select aria-label={t('wl.levelLabel')} value={level} onChange={e=>setLevel(e.target.value)} className="mt-2 w-full rounded-xl bg-[#211d38] p-3"><option value="all">{t('wl.allLevels')}</option>{['A1','A2','B1','B2','C1'].map(l=><option key={l}>{l}</option>)}</select></label><p className="text-xs text-[#ffd166]">{t('wl.bestScore')}: {progress.best[id]??0}</p><button onClick={start} className="w-full rounded-2xl bg-[#c4ff55] py-4 font-black text-[#0c0b20]">{t('wl.start')}</button><button onClick={onExit} className={btn}>{t('wl.back')}</button></section>;
  if(phase==='end'&&result)return <ArcadeEnd meta={meta} score={score} {...result} best={progress.best[id]??score} onReplay={start} onBack={onExit} extra={<div className="text-sm text-[#b9b6d5] space-y-3">{id==='category-sort'?<><p>{t('wl.resultCorrect')} {score} {t('wl.resultOf')} {rounds.length}</p>{wrong.map(w=><p key={w.id} dir="auto">{w.word} → {t(CATEGORIES[w.category])}</p>)}</>:<p>{t('pz.endMovesA')} {moves} {t('pz.endMovesB')}</p>}</div>}/>;
  return <section className="max-w-lg mx-auto space-y-4"><ArcadeHud title={meta.title} score={id==='word-search'?found.length:id==='word-memory'?matched.length:score} onQuit={onExit} round={id==='category-sort'?round+1:undefined} totalRounds={rounds.length}/>
    {id==='word-search'&&<><p className="text-sm text-[#b9b6d5] leading-7">{t('pz.wsHint')}</p><div dir="ltr" className="grid grid-cols-8 gap-1">{grid.map((c,i)=>{const done=hidden.some((w,j)=>found.includes(j)&&i>=w.start&&i<=w.end);return <button aria-label={`cell-${i}`} key={i} onClick={()=>chooseCell(i)} className={`aspect-square min-w-0 rounded-lg border text-sm font-bold ${done?'border-[#c4ff55] bg-[#c4ff55]/15 text-[#c4ff55]':anchor===i?'border-[#41e7ff] bg-[#41e7ff]/20 text-white':'border-white/10 bg-[#121124] text-white'}`}>{c}</button>;})}</div><p role="status" className="min-h-6 text-xs text-[#41e7ff]">{notice}</p><div className="space-y-2">{hidden.map((w,i)=><p key={w.word.id} className={`rounded-xl p-3 text-sm ${found.includes(i)?'bg-[#c4ff55]/10 text-[#c4ff55] line-through':'bg-white/5 text-[#b9b6d5]'}`}>{txText(appText,w.word.meaningAr)}{found.includes(i)&&` • ${w.word.word}`}</p>)}</div></>}
    {id==='word-memory'&&<><div className="grid grid-cols-2 gap-2">{cards.map((c,i)=>{const show=opened.includes(i)||matched.includes(c.pair);return <button aria-label={`card-${i}`} key={i} onClick={()=>flip(i)} disabled={matched.includes(c.pair)} dir={c.en?'ltr':'rtl'} className={`min-h-20 rounded-2xl border p-3 text-sm font-bold leading-6 ${matched.includes(c.pair)?'border-[#c4ff55]/40 bg-[#c4ff55]/10 text-[#c4ff55]':show?'border-[#41e7ff]/50 bg-[#41e7ff]/10 text-white':'border-white/10 bg-[#17142b] text-[#9b7bff]'}`}>{show?c.text:'?'}</button>;})}</div><p className="text-xs text-[#b9b6d5]">{moves} {t('pz.moves')} • {matched.length} {t('wl.resultOf')} 5 {t('pz.pairs')}</p>{opened.length===2&&<button onClick={()=>setOpened([])} className={btn+' w-full'}>{t('pz.retryPair')}</button>}</>}
    {id==='category-sort'&&rounds[round]&&<div className="rounded-3xl border border-white/10 bg-[#121124] p-5 text-center space-y-5"><p className="text-xs text-[#9b7bff]">{rounds[round].level}</p><h3 dir="ltr" className="text-2xl font-bold text-white">{rounds[round].word}</h3><p className="text-sm text-[#b9b6d5]">{txText(appText,rounds[round].meaningAr)}</p><p dir="ltr" className="text-sm leading-7 text-[#b9b6d5]">{rounds[round].exampleEn}</p><div className="grid grid-cols-2 gap-2">{options[round].map(c=><button key={c} className={btn+(feedback!==null&&c===rounds[round].category?' !border-[#c4ff55] !text-[#c4ff55]':'')} disabled={feedback!==null} onClick={()=>{const ok=c===rounds[round].category;setFeedback(ok);if(ok)setScore(s=>s+1);else setWrong(a=>[...a,rounds[round]]);playSound(ok?'correct':'wrong');}}>{t(CATEGORIES[c])}</button>)}</div>{feedback!==null&&<div role="status" className="space-y-3"><p className="text-sm text-[#c4ff55]">{feedback?t('pz.correct'):t('pz.catInDict')} {t(CATEGORIES[rounds[round].category])}</p><button className="w-full rounded-xl bg-[#c4ff55] p-3 font-black text-[#0c0b20]" onClick={()=>{if(round+1===rounds.length)finish(score);else{setRound(r=>r+1);setFeedback(null);}}}>{round+1===rounds.length?t('wl.seeResult'):t('wl.nextQuestion')}</button></div>}</div>}
  </section>;
}
