import { PronunciationPhotoPractice } from '../components/PronunciationPhotoPractice';
import { MinimalPairRehearsal } from '../components/MinimalPairRehearsal';
import { VOWEL_WORKSHOP } from '../data/vowelWorkshopData';
import { SpeakingRecorder } from '../components/SpeakingPracticeStudio';
import React, { useEffect, useRef, useState } from 'react';
import { PageRoute } from '../types';
import { MINIMAL_PAIRS_DATA, MinimalPair } from '../data/skillsAcademyData';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { playSound, speakEnglish, stopSpeech, fireCelebration, getVoiceSettings, subscribeSpeechState } from '../utils/audio';
import {
  Volume2,
  Square,
  Sparkles,
  Repeat,
  CheckCircle2,
  Ear,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface PronunciationAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PronunciationAcademyPage: React.FC<PronunciationAcademyPageProps> = ({ onNavigate }) => {
  const { t, dir, lang } = useLanguage();
  const [activePairIdx, setActivePairIdx] = useState(0);
  const appText = useAppTextMap('skillsAcademyData');
  const [testedSound, setTestedSound] = useState<'A' | 'B' | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [vowelGroup, setVowelGroup] = useState<'all' | 'pure' | 'glide'>('all');
  const [selectedVowel, setSelectedVowel] = useState<string | null>(null);
  const vowelPanel = useRef<HTMLElement>(null);

  const pair = MINIMAL_PAIRS_DATA[activePairIdx] || MINIMAL_PAIRS_DATA[0];

  const [audioError, setAudioError] = useState(false);
  const audioVersion = useRef(0);
  const [audioActive, setAudioActive] = useState<string | null>(null);
  const ownsAudio = useRef(false);
  const [audioMuted, setAudioMuted] = useState(false);
  useEffect(() => subscribeSpeechState((playing) => { if (!playing && ownsAudio.current) { ownsAudio.current = false; setAudioActive(null); } }), []);
  const resetAudio = () => {
    audioVersion.current += 1;
    stopSpeech();
    setTestedSound(null);
    setQuizScore(null);
    setAudioError(false);
    setAudioMuted(false);
    setAudioActive(null);
    ownsAudio.current = false;
  };
  useEffect(() => () => { audioVersion.current += 1; stopSpeech(); }, []);
  const playWord = (text: string, testSound: 'A' | 'B' | null = null, control = text, accent?: 'UK' | 'US') => {
    const stopping = audioActive === control;
    resetAudio();
    if (stopping) return;
    if (getVoiceSettings().isMuted) { setAudioMuted(true); return; }
    const version = audioVersion.current;
    let settled = false;
    speakEnglish(text, {
      accent,
      onEnd: () => {
        if (version !== audioVersion.current) return;
        settled = true; ownsAudio.current = false; setAudioActive(null); setTestedSound(testSound);
      },
      onError: () => {
        if (version !== audioVersion.current) return;
        settled = true; ownsAudio.current = false; setAudioActive(null);
        setTestedSound(null); setAudioError(true);
      },
    });
    ownsAudio.current = !settled;
    setAudioActive(settled ? null : control);
  };
  const handleTestEar = () => {
    playSound('click');
    const pick = Math.random() > 0.5 ? 'A' : 'B';
    playWord(pick === 'A' ? pair.wordA : pair.wordB, pick, 'quiz');
  };

  const handleGuess = (choice: 'A' | 'B') => {
    if (!testedSound || quizScore !== null) return;
    if (choice === testedSound) {
      playSound('correct');
      setQuizScore(1);
      fireCelebration();
    } else {
      playSound('wrong');
      setQuizScore(0);
    }
  };

  const ipaVowels = VOWEL_WORKSHOP.filter(v => vowelGroup === 'all' || v.type === vowelGroup);
  const activeVowel = VOWEL_WORKSHOP.find(v => v.symbol === selectedVowel);
  const openVowel = (symbol: string) => {
    resetAudio();
    setSelectedVowel(symbol);
    requestAnimationFrame(() => vowelPanel.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  };

  return (
    <div dir={dir} className="space-y-10 pb-16 text-start">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#c4ff55]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#c4ff55]/20 text-[#c4ff55] border border-[#c4ff55]/40 shadow-sm">
            <Volume2 className="w-4 h-4" />
            <span>{t('pa.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            {t('pa.title')}
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            {t('pa.blurb')}
          </p>
        </div>
      </section>

      {audioMuted && <p role="status" className="rounded-xl border border-amber-300/30 p-4 text-sm text-amber-200">{t('w3.voice.muted')}</p>}
      {audioError && <p role="alert" className="rounded-xl border border-amber-300/30 p-4 text-sm text-amber-200">{t('listen.audioError')}</p>}
      {/* 1. MINIMAL PAIRS TRAINER */}
      <section className="glass-panel rounded-3xl px-2 py-6 sm:px-10 sm:py-10 border border-white/10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 min-w-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Ear className="w-6 h-6 text-[#ffd166]" />
              {t('pa.pairsTitle')}
            </h2>
            <p className="text-xs text-[#b9b6d5]">
              {t('pa.pairsBlurb')}
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 [scrollbar-width:thin]">
            {MINIMAL_PAIRS_DATA.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  playSound('click');
                  setActivePairIdx(idx);
                  resetAudio();
                }}
                aria-pressed={activePairIdx === idx}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePairIdx === idx
                    ? 'bg-[#c4ff55] text-[#0c0b20] font-black'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {t('pa.challenge')} 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-cyan-200/20 bg-[#0c0b20] px-2 py-4 sm:px-4">
          <label htmlFor="pronunciation-pair-picker" className="block text-sm font-bold text-cyan-100">{t('pa.navigator.choose')}</label>
          <select id="pronunciation-pair-picker" value={activePairIdx} onChange={event => { resetAudio(); setActivePairIdx(Number(event.target.value)); }} dir="ltr" className="min-h-12 w-full rounded-xl border border-white/20 bg-[#151329] p-3 text-sm text-white">{MINIMAL_PAIRS_DATA.map((item,index) => <option key={item.id} value={index}>{index+1}. {item.wordA} / {item.wordB} · {item.ipaA} / {item.ipaB}</option>)}</select>
          <p role="status" className="text-xs leading-7 text-slate-300">{t('pa.navigator.position').replace('{current}',String(activePairIdx+1)).replace('{total}',String(MINIMAL_PAIRS_DATA.length))}</p>
          <div className="flex flex-wrap gap-3"><button type="button" disabled={activePairIdx === 0} onClick={() => { resetAudio(); setActivePairIdx(value => Math.max(0,value-1)); }} className="min-h-11 rounded-xl border border-cyan-200/30 px-4 text-sm font-bold text-cyan-100 disabled:opacity-40">{t('pa.navigator.previous')}</button><button type="button" disabled={activePairIdx === MINIMAL_PAIRS_DATA.length-1} onClick={() => { resetAudio(); setActivePairIdx(value => Math.min(MINIMAL_PAIRS_DATA.length-1,value+1)); }} className="min-h-11 rounded-xl border border-cyan-200/30 px-4 text-sm font-bold text-cyan-100 disabled:opacity-40">{t('pa.navigator.next')}</button></div>
          <p className="text-xs leading-7 text-slate-400">{t('pa.navigator.note')}</p>
        </div>

        {/* Minimal Pair Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sound A */}
          <div className="px-2 py-6 sm:px-6 rounded-3xl bg-linear-to-br from-[#171632] to-[#0c0b20] border border-white/15 text-center space-y-4 shadow-xl">
            <span className="text-xs font-bold text-[#ffd166] en">{pair.soundA}</span>
            <div className="en text-4xl sm:text-5xl font-black text-white">{pair.wordA}</div>
            <div className="en text-sm font-mono text-[#41e7ff]">{pair.ipaA}</div>
            <p className="text-sm font-bold text-[#c4ff55]">{txText(appText, pair.meaningArA)}</p>
            
            <button
              aria-pressed={audioActive === pair.wordA}
              onClick={() => playWord(pair.wordA)}
              className="min-h-11 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              {audioActive === pair.wordA ? <Square className="w-4 h-4 text-[#ffd166]" aria-hidden="true" /> : <Volume2 className="w-4 h-4 text-[#ffd166]" aria-hidden="true" />}
              <span>{audioActive === pair.wordA ? t('listen.stopAudio') : t('pa.listenA')}</span>
            </button>
          </div>

          {/* Sound B */}
          <div className="px-2 py-6 sm:px-6 rounded-3xl bg-linear-to-br from-[#171632] to-[#0c0b20] border border-white/15 text-center space-y-4 shadow-xl">
            <span className="text-xs font-bold text-[#ff8bb9] en">{pair.soundB}</span>
            <div className="en text-4xl sm:text-5xl font-black text-white">{pair.wordB}</div>
            <div className="en text-sm font-mono text-[#ff8bb9]">{pair.ipaB}</div>
            <p className="text-sm font-bold text-[#c4ff55]">{txText(appText, pair.meaningArB)}</p>
            
            <button
              aria-pressed={audioActive === pair.wordB}
              onClick={() => playWord(pair.wordB)}
              className="min-h-11 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              {audioActive === pair.wordB ? <Square className="w-4 h-4 text-[#ff4f9a]" aria-hidden="true" /> : <Volume2 className="w-4 h-4 text-[#ff4f9a]" aria-hidden="true" />}
              <span>{audioActive === pair.wordB ? t('listen.stopAudio') : t('pa.listenB')}</span>
            </button>
          </div>

        </div>

        {/* Pronunciation Tip */}
        <div className="px-2 py-4 sm:px-4 rounded-2xl bg-[#ffd166]/10 border border-[#ffd166]/30 text-xs sm:text-sm text-white space-y-1">
          <strong className="text-[#ffd166]">{t('pa.tipTitle')} </strong>
          <span>{txText(appText, pair.tipAr)}</span>
        </div>

        {/* Ear Training Game */}
        <div className="px-2 py-6 sm:px-6 rounded-2xl bg-[#09091a] border border-white/10 text-center space-y-4">
          <h3 className="text-base font-black text-white">{t('pa.earGameTitle')}</h3>
          <p className="text-xs text-[#b9b6d5]">
            {t('pa.earGameBlurb')}
          </p>

          <button
            onClick={handleTestEar}
            aria-pressed={audioActive === 'quiz'}
            className="min-h-11 px-6 py-3 rounded-xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer"
          >
           {audioActive === 'quiz' ? t('listen.stopAudio') : t('pa.playRandom')}
          </button>

          {testedSound && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleGuess('A')}
                disabled={quizScore !== null}
                className="min-h-11 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-default"
              >
                {t('pa.wasLabel')} {pair.wordA} (A)
              </button>
              <button
                onClick={() => handleGuess('B')}
                disabled={quizScore !== null}
                className="min-h-11 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-default"
              >
                {t('pa.wasLabel')} {pair.wordB} (B)
              </button>
            </div>
          )}

          {quizScore !== null && (
            <div role="status" className={`p-3 rounded-xl text-xs font-bold ${
              quizScore === 1 ? 'text-[#c4ff55] bg-[#c4ff55]/10' : 'text-[#ff8bb9] bg-[#ff4f9a]/10'
            }`}>
              {quizScore === 1 ? t('pa.correct') : t('pa.wrong')}
            </div>
          )}
        </div>

      </section>

      <MinimalPairRehearsal key={pair.id} pair={pair} onToggle={resetAudio}/>

      {/* 2. IPA VOWELS CHART */}
      <section className="glass-panel rounded-3xl p-2 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#41e7ff]" />
            {t('pa.chartTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
            {t('pa.chartBlurb')}
          </p>
        </div>

        <p className="text-xs leading-7 text-slate-300">{t('pa.vowelScope')}</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('pa.vowelFilter')}>
          {(['all', 'pure', 'glide'] as const).map(group => <button key={group} type="button" aria-pressed={vowelGroup === group} onClick={() => setVowelGroup(group)} className={`min-h-11 rounded-xl border px-4 text-sm font-bold ${vowelGroup === group ? 'border-cyan-200 bg-cyan-200 text-slate-950' : 'border-white/15 bg-white/5 text-slate-200'}`}>{t(`pa.group.${group}`)}</button>)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ipaVowels.map((v, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#09091a] border border-white/10 text-center space-y-2 hover:border-[#41e7ff]/40 transition-colors"
            >
              <div className="en text-2xl font-black text-[#ffd166]">{v.symbol}</div>
              <div className="en text-xs font-mono text-white">{v.ex}</div>
              <div className="text-[11px] text-[#b9b6d5]">{t(v.ar)}</div>
              <button
                onClick={() => playWord(v.ex, null, v.ex, 'UK')}
                className="min-h-11 min-w-11 rounded text-[#41e7ff] hover:text-white"
                aria-pressed={audioActive === v.ex}
                aria-label={audioActive === v.ex ? t('listen.stopAudio') : `${t('pa.listenWords')}: ${v.ex}`}
                title={audioActive === v.ex ? t('listen.stopAudio') : `${t('pa.listenWords')}: ${v.ex}`}
              >
                {audioActive === v.ex ? <Square className="w-3.5 h-3.5 mx-auto" aria-hidden="true" /> : <Volume2 className="w-3.5 h-3.5 mx-auto" aria-hidden="true" />}
              </button>
              <button type="button" aria-pressed={selectedVowel === v.symbol} onClick={() => openVowel(v.symbol)} className="block min-h-11 w-full rounded-xl border border-cyan-200/25 px-2 text-xs font-bold text-cyan-200 hover:bg-cyan-200/10">{t('pa.practiseSound')} {v.symbol}</button>
            </div>
          ))}
        </div>
        <section ref={vowelPanel} className="scroll-mt-24" aria-label={t('pa.workshopTitle')}>
          {activeVowel ? <div className="space-y-5 rounded-3xl border-0 border-cyan-200/25 bg-transparent p-0 sm:border sm:bg-[#11182a] sm:p-7">
            <h3 className="text-xl font-black text-cyan-100">{t('pa.workshopTitle')} <span dir="ltr" className="inline-block">{activeVowel.symbol}</span></h3>
            <p className="text-sm leading-7 text-slate-300">{lang === 'ar' ? activeVowel.tipAr : activeVowel.tipEn}</p>
            <p dir="ltr" lang="en" className="text-left text-lg leading-8 text-white">{activeVowel.sentence}</p>
            <button type="button" aria-pressed={audioActive === `vowel-${activeVowel.symbol}`} onClick={() => playWord(activeVowel.sentence, null, `vowel-${activeVowel.symbol}`, 'UK')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-cyan-200">{audioActive === `vowel-${activeVowel.symbol}` ? <Square size={16} aria-hidden="true"/> : <Volume2 size={16} aria-hidden="true"/>}{audioActive === `vowel-${activeVowel.symbol}` ? t('listen.stopAudio') : t('pa.listenSentence')}</button>
            <p className="text-xs leading-6 text-slate-400">{t('pa.recordGuide')}</p>
            <SpeakingRecorder key={activeVowel.symbol} prompt={activeVowel.sentence}/>
          </div> : <p className="rounded-2xl border border-dashed border-cyan-200/25 p-5 text-sm leading-7 text-slate-300">{t('pa.chooseSound')}</p>}
        </section>
        <p className="text-xs leading-7 text-slate-400">{t('pa.vowelReference')} <a className="underline text-cyan-200" href="https://learnenglish.britishcouncil.org/apps/learnenglish-sounds-right" target="_blank" rel="noreferrer">British Council Sounds Right</a></p>
      </section>

      <PronunciationPhotoPractice/>
    </div>
  );
};
