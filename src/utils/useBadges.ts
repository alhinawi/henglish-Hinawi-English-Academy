import { useCallback, useEffect, useRef, useState } from 'react';
import catalog from '../../shared/badges.json';
import { getHenglishApiToken } from '../services/henglishApi';
import { useLanguage } from '../i18n/LanguageContext';
import type { AchievementBadge } from '../types';
type Award = {id:string;current:number;target:number;unlocked:boolean;available:boolean};
export function useBadges(identity?: string | null) {
 const {t}=useLanguage();
 const [awards,setAwards]=useState<Award[]>([]);
 const [verifiedToken,setVerifiedToken]=useState<string|null>(null);
 const generation=useRef(0);
 const [status,setStatus]=useState<'loading'|'ready'|'signIn'|'error'>('loading');
 const refresh=useCallback(async()=>{
  const request=++generation.current;
  const token=getHenglishApiToken();setAwards([]);setVerifiedToken(null);
  if(!token){setStatus('signIn');return;}
  setStatus('loading');
  try {
   const res=await fetch('https://henglish-api.hnz.workers.dev/api/badges',{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});
   if(request!==generation.current)return;
   if(res.status===401){setStatus('signIn');return;}
   if(!res.ok)throw new Error('unavailable');
   const data=await res.json() as {badges:Award[]};
   if(!Array.isArray(data.badges))throw new Error('invalid');
   if(request!==generation.current)return;
   setVerifiedToken(token);setAwards(data.badges);setStatus('ready');
  } catch {if(request===generation.current)setStatus('error');}
 },[]);
 useEffect(()=>{
  void refresh();
  const recheck=()=>{void refresh();};
  window.addEventListener('hashchange',recheck);window.addEventListener('focus',recheck);
  return ()=>{generation.current++;window.removeEventListener('hashchange',recheck);window.removeEventListener('focus',recheck);};
 },[refresh,identity]);
 const visibleAwards=verifiedToken===getHenglishApiToken()?awards:[];
 const badges:AchievementBadge[]=catalog.map(b=>{
  const a=visibleAwards.find(a=>a.id===b.id);
  return {id:b.id,title:t(b.titleKey),description:t(b.descriptionKey),icon:'',category:b.category,tier:b.tier as AchievementBadge['tier'],unlocked:a?.unlocked??false,available:a?.available,current:a?.current??0,target:b.target,progressPercentage:a?Math.floor(a.current/b.target*100):0};
 });
 return {badges,status,refresh};
}
