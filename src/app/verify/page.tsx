'use client';
import { useEffect, useState } from 'react';
import { certificateApi } from '../../services/certificateApi';
import { LanguageProvider, useLanguage } from '../../i18n/LanguageContext';

type Verification = { valid: boolean; certificate?: { student_name: string; title: string; level: string; issued_at: number; score: number; total: number } };

function VerificationPage() {
  const { t, dir } = useLanguage();
  const [data, setData] = useState<Verification | null>(null);
  useEffect(() => {
    document.getElementById('boot-splash')?.remove();
    const id = decodeURIComponent(location.pathname.split('/verify/')[1] || '').replace(/\/$/, '') || new URLSearchParams(location.search).get('id');
    if (!id) { setData({ valid: false }); return; }
    certificateApi<Verification>(`verify/${encodeURIComponent(id)}`).then(setData).catch(() => setData({ valid: false }));
  }, []);
  return <main dir={dir} className="min-h-screen p-6 flex items-center justify-center">
    <section className="text-start max-w-lg w-full rounded-3xl border border-white/15 bg-[#171632] p-6 space-y-4">
      <p className="text-xs text-[#ffd166]">HENGLISH ACADEMY</p>
      <h1 className="text-2xl font-black text-white">{t('cv.title')}</h1>
      {!data ? <p className="text-[#b9b6d5]">{t('cv.loading')}</p> : data.valid && data.certificate ? <>
        <p className="text-emerald-300">{t('cv.registered')}</p>
        <h2 dir="auto" className="text-xl font-bold text-white">{data.certificate.student_name}</h2>
        <p dir="auto" className="text-[#41e7ff]">{data.certificate.title}</p>
        <p className="text-sm text-[#b9b6d5]">{t('cv.summary').replace('{level}', data.certificate.level).replace('{score}', String(Math.floor(data.certificate.score / data.certificate.total * 100))).replace('{date}', new Date(data.certificate.issued_at * 1000).toLocaleDateString('en-GB'))}</p>
        <p className="text-xs leading-7 text-[#b9b6d5]">{t('cv.disclaimer')}</p>
      </> : <p role="alert" className="text-rose-200">{t('cv.unverified')}</p>}
      <a className="block text-sm text-[#41e7ff]" href="/">{t('cv.back')}</a>
    </section>
  </main>;
}

export default function Verify() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <LanguageProvider><VerificationPage /></LanguageProvider>;
}
