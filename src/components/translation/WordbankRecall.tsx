import React,{useState} from 'react';
import {useLanguage} from '../../i18n/LanguageContext';
import {LessonSpeechButton} from '../LessonSpeechButton';
import {stopSpeech} from '../../utils/audio';

export function WordbankRecall({word}:{word:string}){
 const {t}=useLanguage();const [hidden,setHidden]=useState(false);
 return <><dt lang={hidden?undefined:'en'} dir={hidden?'auto':'ltr'} className="text-left text-sm font-bold leading-7 text-cyan-100">{hidden?t('tpr.wordRecall.hidden'):word}</dt><dd><button type="button" aria-expanded={!hidden} onClick={()=>{stopSpeech();setHidden(value=>!value);}} className="min-h-11 rounded-xl border border-cyan-200/30 px-3 py-2 text-sm font-bold text-cyan-100">{t(hidden?'tpr.wordRecall.show':'tpr.wordRecall.hide')}</button><p className="mt-2 text-xs leading-7 text-slate-400">{t('tpr.wordRecall.note')}</p></dd><dd><LessonSpeechButton key={`${word}:${hidden}`} text={word} label={hidden?t('tpr.wordRecall.listen'):t('tpr.wordAudio.listen').replace('{word}',word)} className="min-h-11 rounded-xl border border-cyan-200/30 px-3 py-2 text-sm font-bold text-cyan-100"/></dd></>;
}
