import React,{useState} from 'react';
import {PRONUNCIATION_PHOTO_SCENES} from '../data/pronunciationPhotoScenes';
import {SpeakingRecorder} from './SpeakingPracticeStudio';
import {useLanguage} from '../i18n/LanguageContext';
import {stopSpeech} from '../utils/audio';
export function PronunciationPhotoPractice(){
 const {t,dir}=useLanguage();const [index,setIndex]=useState(0);const [model,setModel]=useState(false);const [open,setOpen]=useState(false);const scene=PRONUNCIATION_PHOTO_SCENES[index];
 return <section dir={dir} aria-label={t('pa.photo.title')} className="space-y-5 rounded-3xl border border-pink-200/25 bg-[#151329] p-5 sm:p-8">
 <h2 className="text-xl font-black text-pink-100">{t('pa.photo.title')}</h2><p className="text-sm leading-7 text-slate-300">{t('pa.photo.intro')}</p>
 <label htmlFor="pronunciation-photo-scene" className="block text-sm font-bold text-cyan-100">{t('pa.photo.choose')}</label><select id="pronunciation-photo-scene" value={index} onChange={event=>{stopSpeech();setIndex(Number(event.target.value));setModel(false);setOpen(false);}} className="min-h-12 w-full rounded-xl border border-white/20 bg-[#0c0b20] p-3 text-sm text-white">{PRONUNCIATION_PHOTO_SCENES.map((item,i)=><option key={item.id} value={i}>{t('pa.photo.'+item.id)}</option>)}</select>
 <figure className="overflow-hidden rounded-2xl border border-white/15"><img key={scene.id} src={scene.src} alt={t('pa.photo.'+scene.id)} width={640} height={360} loading="lazy" className="h-48 w-full object-cover sm:h-72"/><figcaption className="p-4 text-xs leading-7 text-slate-400">{t('pa.photo.note')}</figcaption></figure>
 <p dir="ltr" lang="en" className="text-start text-base font-bold text-pink-100">{scene.focus} · {scene.words}</p><p className="text-sm leading-8 text-white">{t('pa.photo.task')}</p>
 <button type="button" aria-expanded={model} onClick={()=>setModel(value=>!value)} className="min-h-11 rounded-xl border border-white/20 px-4 text-sm text-cyan-100">{t(model?'pa.photo.hide':'pa.photo.show')}</button>{model&&<div className="rounded-xl border border-white/15 p-4 space-y-2"><h3 className="text-sm font-bold text-cyan-100">{t('pa.photo.model')}</h3><p dir="ltr" lang="en" className="text-left text-base leading-8 text-white">{scene.sentence}</p></div>}
 <button type="button" aria-expanded={open} onClick={()=>{stopSpeech();setOpen(value=>!value);}} className="block min-h-11 rounded-xl border border-pink-200/30 px-4 text-sm font-bold text-pink-100">{t(open?'pa.photo.close':'pa.photo.open')}</button>{open&&<SpeakingRecorder key={scene.id} prompt={t('pa.photo.record')}/>}
 </section>;
}
