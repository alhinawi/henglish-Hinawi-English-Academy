import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, RefreshCw, ArrowLeft, UserRound, Sparkles } from 'lucide-react';
import { apiLeaderboard, type LeaderboardResult } from '../services/henglishApi';
import { ANONYMOUS_AVATAR } from '../services/authService';
import { displayLeaderboard } from '../data/leaderboard/display';
import { PageRoute } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export function LeaderboardPage({onNavigate, authenticated}: {onNavigate: (route: PageRoute) => void; authenticated: boolean}) {
  const { t } = useLanguage();
  const [data, setData] = useState<LeaderboardResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = async () => { setLoading(true); setError(false); const next = await apiLeaderboard(); setData(next); setError(!next); setLoading(false); };
  useEffect(() => { void load(); }, []);
  const rows = data ? displayLeaderboard(data) : [];
  const mine = rows.find(r => r.own);
  return <div dir="rtl" className="max-w-4xl mx-auto space-y-7">
    <header className="rounded-3xl overflow-hidden border border-[#ffd166]/25 bg-linear-to-br from-[#292044] via-[#171632] to-[#0c0b20] p-6 sm:p-10 space-y-4 relative">
      <div className="flex items-center justify-between gap-3"><span className="text-[#ffd166] text-xs font-black tracking-widest" dir="ltr">HENGLISH LEADERBOARD</span><Trophy className="w-10 h-10 text-[#ffd166]"/></div>
      <h1 className="text-3xl sm:text-4xl font-black">{t('lb.title')}</h1>
      <p className="text-sm text-[#dedbf4] leading-7 max-w-xl">{t('lb.heroBody')}</p>
      <div className="flex flex-wrap gap-3 text-xs text-[#b9b6d5]"><span className="rounded-full px-3 py-2 bg-white/5">{t('lb.lessonChip')}</span><span className="rounded-full px-3 py-2 bg-white/5">{t('lb.quizChip')}</span></div>
    </header>
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-black flex items-center gap-2"><Medal className="w-5 h-5 text-[#ffd166]"/>{t('lb.top10')}</h2><button onClick={load} disabled={loading} className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 rounded-xl px-4 py-3 disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/>{t('lb.refresh')}</button></div>
    {loading ? <p role="status" className="p-8 text-center text-[#b9b6d5]">{t('lb.loading')}</p> : error ? <div role="alert" className="p-6 rounded-2xl border border-red-400/25 bg-red-400/5 space-y-3"><p>{t('lb.errorBody')}</p><p className="text-xs text-[#b9b6d5]">{t('lb.errorNote')}</p></div> : <>
      <ol className="space-y-3" aria-label={t('lb.listAria')}>{rows.map(r => <li key={`${r.starter ? 'starter' : 'real'}-${r.rank}`} className={`flex items-center gap-3 sm:gap-5 p-4 sm:p-5 rounded-2xl border ${r.pinned ? 'border-[#ffd166]/35 bg-linear-to-l from-[#ffd166]/10 to-[#171632]' : r.own ? 'border-[#41e7ff]/40 bg-[#41e7ff]/5' : 'border-white/10 bg-white/[0.035]'}`}>
        <span className={`w-6 shrink-0 text-center font-black ${r.rank <= 3 ? 'text-[#ffd166]' : 'text-[#b9b6d5]'}`}>{r.rank}</span>
        <img src={r.avatar || ANONYMOUS_AVATAR} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = ANONYMOUS_AVATAR; }} alt="" className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover object-center bg-[#24223e] shrink-0 border border-white/10"/>
        <div className="flex-1 min-w-0 space-y-1"><div className="flex items-center gap-2"><bdi dir="auto" className="font-bold text-sm sm:text-base truncate">{r.name}</bdi>{r.pinned && <Crown aria-label={t('lb.adminAria')} className="w-4 h-4 text-[#ffd166] shrink-0"/>}{r.own && <span className="text-[10px] text-[#41e7ff] shrink-0">{t('lb.you')}</span>}</div><p className="text-[11px] text-[#b9b6d5]">{r.pinned ? t('lb.adminNote') : r.points === 0 ? t('lb.newbie') : r.starter ? t('lb.starter') : t('lb.learning')}</p></div>
        <div className="text-center shrink-0"><span dir="ltr" className={`font-black text-xl ${r.pinned ? 'text-[#ffd166]' : 'text-white'}`}>{r.points}</span><span className="block text-[10px] text-[#b9b6d5]">{t('lb.pointUnit')}</span></div>
      </li>)}</ol>
      {rows.some(r => r.starter) && <p className="text-xs text-[#b9b6d5] leading-6 flex items-start gap-2"><Sparkles className="w-4 h-4 mt-1 shrink-0"/>{t('lb.starterNote')}</p>}
      {authenticated && data?.me && <div className="rounded-2xl border border-[#41e7ff]/25 bg-[#41e7ff]/5 p-5 flex items-center gap-3"><UserRound className="text-[#41e7ff]"/><div><h2 className="font-black text-sm">{t('lb.yourPlace')}</h2><p className="text-sm text-[#dedbf4] mt-1">{mine ? `${t('lb.rankPrefix')} ${mine.rank}` : `${t('lb.rankPrefix')} ${data.me.rank} ${t('lb.amongReal')}`} • {data.me.points} {t('lb.pointUnit')}</p></div></div>}
    </>}
    <button onClick={() => onNavigate(authenticated ? 'courses/grammar' : 'login')} className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#ffd166] text-[#21132c] font-black text-sm">{authenticated ? t('lb.ctaLearn') : t('lb.ctaSignIn')}<ArrowLeft className="w-4 h-4"/></button>
  </div>;
}
