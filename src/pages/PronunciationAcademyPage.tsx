import React, { useState } from 'react';
import { PageRoute } from '../types';
import { MINIMAL_PAIRS_DATA, MinimalPair } from '../data/skillsAcademyData';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import {
  Volume2,
  Sparkles,
  Repeat,
  CheckCircle2,
  Ear,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface PronunciationAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PronunciationAcademyPage: React.FC<PronunciationAcademyPageProps> = ({ onNavigate }) => {
  const [activePairIdx, setActivePairIdx] = useState(0);
  const [testedSound, setTestedSound] = useState<'A' | 'B' | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const pair = MINIMAL_PAIRS_DATA[activePairIdx] || MINIMAL_PAIRS_DATA[0];

  const handleTestEar = () => {
    playSound('click');
    const pick = Math.random() > 0.5 ? 'A' : 'B';
    setTestedSound(pick);
    setQuizScore(null);
    speakEnglish(pick === 'A' ? pair.wordA : pair.wordB);
  };

  const handleGuess = (choice: 'A' | 'B') => {
    if (!testedSound) return;
    if (choice === testedSound) {
      playSound('correct');
      setQuizScore(1);
      fireCelebration();
    } else {
      playSound('wrong');
      setQuizScore(0);
    }
  };

  const ipaVowels = [
    { symbol: '/iː/', ex: 'see, sheep', ar: 'ياء ممدودة واضحة' },
    { symbol: '/ɪ/', ex: 'sit, ship', ar: 'كسرة خفيفة سريعة' },
    { symbol: '/e/', ex: 'bed, men', ar: 'فتحة مرققة قصيرة' },
    { symbol: '/æ/', ex: 'cat, black', ar: 'ألف مفتوحة ومفخمة' },
    { symbol: '/ɑː/', ex: 'car, dark', ar: 'ألف ممدودة من الحلق' },
    { symbol: '/uː/', ex: 'blue, moon', ar: 'واو ممدودة مضمومة' },
    { symbol: '/ʊ/', ex: 'put, book', ar: 'ضمة خفيفة وسريعة' },
    { symbol: '/ə/', ex: 'about, banana', ar: 'صوت الشوا (Schwa) المحايد' },
  ];

  return (
    <div className="space-y-10 pb-16 text-right">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-gradient-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#c4ff55]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#c4ff55]/20 text-[#c4ff55] border border-[#c4ff55]/40 shadow-sm">
            <Volume2 className="w-4 h-4" />
            <span>HINAWI PRONUNCIATION ACADEMY • استوديو الفونيتكس ومخارج الحروف</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            أكاديمية النطق والفونيتكس (IPA) 🗣️
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            تخلص من اللهجة العربية الثقيلة، وافهم الفرق الدقيق بين الأصوات المتقاربة مثل (ship vs sheep) أو (p vs b)، وتعرف على أبجدية الصوتيات الدولية (IPA) والنبر الصوتي للكلمات.
          </p>
        </div>
      </section>

      {/* 1. MINIMAL PAIRS TRAINER */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Ear className="w-6 h-6 text-[#ffd166]" />
              الأزواج الصوتية الصغرى (Minimal Pairs Trainer)
            </h2>
            <p className="text-xs text-[#b9b6d5]">
              كلمتان متطابقتان تماماً باستثناء صوت واحد فقط يغير المعنى بنسبة 180 درجة!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {MINIMAL_PAIRS_DATA.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  playSound('click');
                  setActivePairIdx(idx);
                  setTestedSound(null);
                  setQuizScore(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePairIdx === idx
                    ? 'bg-[#c4ff55] text-[#0c0b20] font-black'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                تحدي 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Pair Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sound A */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#171632] to-[#0c0b20] border border-white/15 text-center space-y-4 shadow-xl">
            <span className="text-xs font-bold text-[#ffd166] en">{pair.soundA}</span>
            <div className="en text-4xl sm:text-5xl font-black text-white">{pair.wordA}</div>
            <div className="en text-sm font-mono text-[#41e7ff]">{pair.ipaA}</div>
            <p className="text-sm font-bold text-[#c4ff55]">{pair.meaningArA}</p>
            
            <button
              onClick={() => speakEnglish(pair.wordA)}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Volume2 className="w-4 h-4 text-[#ffd166]" />
              <span>استمع لصوت (A)</span>
            </button>
          </div>

          {/* Sound B */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#171632] to-[#0c0b20] border border-white/15 text-center space-y-4 shadow-xl">
            <span className="text-xs font-bold text-[#ff8bb9] en">{pair.soundB}</span>
            <div className="en text-4xl sm:text-5xl font-black text-white">{pair.wordB}</div>
            <div className="en text-sm font-mono text-[#ff8bb9]">{pair.ipaB}</div>
            <p className="text-sm font-bold text-[#c4ff55]">{pair.meaningArB}</p>
            
            <button
              onClick={() => speakEnglish(pair.wordB)}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Volume2 className="w-4 h-4 text-[#ff4f9a]" />
              <span>استمع لصوت (B)</span>
            </button>
          </div>

        </div>

        {/* Pronunciation Tip */}
        <div className="p-4 rounded-2xl bg-[#ffd166]/10 border border-[#ffd166]/30 text-xs sm:text-sm text-white space-y-1">
          <strong className="text-[#ffd166]">💡 نصيحة الخبير لنطق هذا الزوج: </strong>
          <span>{pair.tipAr}</span>
        </div>

        {/* Ear Training Game */}
        <div className="p-6 rounded-2xl bg-[#09091a] border border-white/10 text-center space-y-4">
          <h3 className="text-base font-black text-white">🎮 لعبة التمييز السمعي: أي الكلمتين نطقنا؟</h3>
          <p className="text-xs text-[#b9b6d5]">
            اضغط على الزر للاستماع لكلمة عشوائية من الاثنين، ثم خمّن هل كانت (A) أم (B):
          </p>

          <button
            onClick={handleTestEar}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer"
          >
            🔊 شغّل صوتاً عشوائياً للاختبار
          </button>

          {testedSound && (
            <div className="pt-2 flex items-center justify-center gap-4">
              <button
                onClick={() => handleGuess('A')}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm cursor-pointer"
              >
                كانت: {pair.wordA} (A)
              </button>
              <button
                onClick={() => handleGuess('B')}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm cursor-pointer"
              >
                كانت: {pair.wordB} (B)
              </button>
            </div>
          )}

          {quizScore !== null && (
            <div className={`p-3 rounded-xl text-xs font-bold ${
              quizScore === 1 ? 'text-[#c4ff55] bg-[#c4ff55]/10' : 'text-[#ff8bb9] bg-[#ff4f9a]/10'
            }`}>
              {quizScore === 1 ? '🎉 إجابة صحيحة مذهلة! أذنك تميز الفروق الدقيقة.' : '❌ إجابة خاطئة! استمع مجدداً وقارن بين الصوتين.'}
            </div>
          )}
        </div>

      </section>

      {/* 2. IPA VOWELS CHART */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#41e7ff]" />
            جدول رموز الأصوات المتحركة (IPA Vowels Chart)
          </h2>
          <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
            الأصوات الأساسية التي تجعل قراءة أي قاموس إنجليزي سهلة وبديهية:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ipaVowels.map((v, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#09091a] border border-white/10 text-center space-y-2 hover:border-[#41e7ff]/40 transition-colors"
            >
              <div className="en text-2xl font-black text-[#ffd166]">{v.symbol}</div>
              <div className="en text-xs font-mono text-white">{v.ex}</div>
              <div className="text-[11px] text-[#b9b6d5]">{v.ar}</div>
              <button
                onClick={() => speakEnglish(v.ex)}
                className="p-1 rounded text-[#41e7ff] hover:text-white"
                title="استمع للكلمات"
              >
                <Volume2 className="w-3.5 h-3.5 mx-auto" />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
