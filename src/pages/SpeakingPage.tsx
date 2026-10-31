import React, { useState } from 'react';
import { DialogueViewer } from '../components/DialogueViewer';
import { PronunciationAssessmentViewer } from '../components/PronunciationAssessmentViewer';
import { Mic, Volume2, MessageSquare, Sparkles } from 'lucide-react';
import { speakEnglish, playSound } from '../utils/audio';

export const SpeakingPage: React.FC = () => {
  const [activeTarget, setActiveTarget] = useState('By next year, I will have achieved all my language learning goals.');
  const [activeTargetAr, setActiveTargetAr] = useState('بحلول العام القادم، سأكون قد حققت جميع أهدافي في تعلم اللغة.');

  const speakingPrompts = [
    {
      q: 'What will you have achieved by next summer?',
      hintAr: 'تكلم عن هدف شخصي أو دراسي هتكون حققته قبل الصيف الجاي.',
      starter: 'By next summer, I will have...',
    },
    {
      q: 'Will you have finished your current project before next Friday?',
      hintAr: 'أجب بنعم أو لا مع توضيح السبب.',
      starter: 'Yes, I will have finished it because...',
    },
    {
      q: 'How many English lessons will you have completed by the end of this month?',
      hintAr: 'تكلم عن استمراريتك في منصة هناوي.',
      starter: 'By the end of this month, I will have completed...',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ff4f9a]/15 text-[#ff4f9a] border border-[#ff4f9a]/30">
          <Mic className="w-3.5 h-3.5" />
          <span>CONVERSATION & SPEAKING LAB</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          مختبر المحادثة والطلاقة الشفوية 🎙️
        </h1>
        <p className="text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
          القواعد ليست حبراً على ورق. استمع للحوارات الإنجليزية بصوت طبيعي وتدرّب على التحدث والتعبير عن خططك المستقبلية بثقة.
        </p>
      </div>

      {/* Main Real Voice Recording & Pronunciation Assessment Station */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ffd166]" />
            <span>استوديو التحليل الصوتي المباشر (Live Voice Recording Studio)</span>
          </h2>
          <span className="text-xs text-[#c4ff55] font-bold">● نظام تقييم الذكاء الاصطناعي نشط</span>
        </div>
        <PronunciationAssessmentViewer
          targetSentence={activeTarget}
          targetSentenceAr={activeTargetAr}
        />
      </section>

      {/* Main Dialogue Viewer */}
      <DialogueViewer />

      {/* Speaking Rehearsal Prompts */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#ffd166]" />
            <span>أسئلة تدريب شفهي (Speak Out Loud) 🗣️</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
            اقرأ السؤال، ثم حاول نطق إجابة كاملة بصوت عالي باستخدام المستقبل التام دون قراءة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {speakingPrompts.map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-[#09091a] border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#ffd166]">تحدي 0{idx + 1}</span>
                  <button
                    onClick={() => {
                      playSound('click');
                      speakEnglish(item.q);
                    }}
                    className="p-1 rounded text-[#41e7ff] hover:text-white"
                    title="استمع للسؤال"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="en text-base font-bold text-white mb-2">
                  {item.q}
                </p>
                <p className="text-xs text-[#b9b6d5]">
                  💡 {item.hintAr}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveTarget(item.starter);
                    setActiveTargetAr(item.hintAr);
                    window.scrollTo({ top: 220, behavior: 'smooth' });
                  }}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-[#ff4f9a]/20 hover:bg-[#ff4f9a]/30 text-[#ff8bb9] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>تطبيق هذا التحدي صوتياً</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
