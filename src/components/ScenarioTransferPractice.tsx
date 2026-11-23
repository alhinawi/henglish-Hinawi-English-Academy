import {SCENARIO_TRANSFER_VARIATIONS} from '../data/scenarioTransferVariations';
import {ScenarioTransferReview} from './ScenarioTransferReview';
import React,{useState} from 'react';
import type {SimulationScenario} from '../data/realLifeSimulationsData';
import {SpeakingRecorder} from './SpeakingPracticeStudio';
import {useLanguage} from '../i18n/LanguageContext';
import {stopSpeech} from '../utils/audio';

export function ScenarioTransferPractice({scenario}:{scenario:SimulationScenario}) {
 const {t,dir}=useLanguage();const [open,setOpen]=useState(false);const [plan,setPlan]=useState('');
 return <section dir={dir} aria-label={t('rle.transfer.title')} className="rounded-3xl border border-pink-200/25 bg-[#17152b] p-4 space-y-4 sm:p-6">
  <h3 className="text-xl font-black text-pink-100">{t('rle.transfer.title')}</h3><p className="text-sm leading-7 text-slate-300">{t('rle.transfer.intro')}</p>
  <button type="button" aria-expanded={open} onClick={()=>{stopSpeech();setOpen(value=>!value);setPlan('');}} className="min-h-11 rounded-xl border border-pink-200/30 px-4 text-sm font-bold text-pink-100">{t(open?'rle.transfer.close':'rle.transfer.open')}</button>
  {open&&<div className="space-y-4"><p className="text-base leading-8 text-white">{t(`rle.transfer.task.${scenario.id}`)}</p><details key={`transfer-variations:${scenario.id}`} className="rounded-2xl border border-cyan-200/25 p-4 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('rle.variation.title')}</summary><p className="mt-3 text-xs leading-7 text-slate-300">{t('rle.variation.note')}</p><ol className="mt-4 space-y-3">{SCENARIO_TRANSFER_VARIATIONS[scenario.id]?.map((variation,index)=><li key={variation} className="rounded-xl border border-white/15 p-3"><h4 className="text-xs font-bold text-cyan-100">{t('rle.variation.number').replace('{number}',String(index+1))}</h4><p lang="en" dir="ltr" className="mt-2 text-left text-base leading-8 text-white">{variation}</p></li>)}</ol></details><label htmlFor="scenario-transfer-plan" className="block text-sm font-bold text-cyan-100">{t('rle.transfer.plan')}</label><textarea id="scenario-transfer-plan" aria-describedby="scenario-transfer-note" dir="auto" rows={3} maxLength={1500} value={plan} onChange={event=>setPlan(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#0c0b20] p-4 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-pink-200"/><p id="scenario-transfer-note" className="text-xs leading-7 text-slate-400">{t('rle.transfer.note')}</p><SpeakingRecorder prompt={t('rle.transfer.record')}/><ScenarioTransferReview key={scenario.id} scenarioId={scenario.id}/></div>}
 </section>;
}
