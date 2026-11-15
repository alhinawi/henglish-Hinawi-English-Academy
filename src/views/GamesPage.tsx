import React, { useState } from 'react';
import { ArcadeHub } from '../components/arcade/ArcadeHub';
export const GamesPage: React.FC = () => { const [playing, setPlaying] = useState(false); return <main dir="rtl" className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6 font-['Cairo',sans-serif]">
  {playing ? <h1 className="text-lg font-black text-white">ساحة الألعاب <span className="text-xs text-[#9b7bff]">HENGLISH PLAY</span></h1> : <header className="rounded-3xl border border-[#9b7bff]/30 bg-gradient-to-bl from-[#292047] to-[#121124] p-6 space-y-3">
    <span className="text-xs tracking-widest text-[#c4ff55]" dir="ltr">HENGLISH PLAY</span><h1 className="text-3xl font-black text-white">اتعلمها. العبها. افتكرها.</h1><p className="text-sm leading-7 text-[#c5c0db]">ساحة ألعاب الإنجليزي: كلمات وجمل وأفعال من محتوى الأكاديمية. اختار تحديك واكسر رقمك.</p>
  </header>}<ArcadeHub onPlayingChange={setPlaying}/>
</main>; };
