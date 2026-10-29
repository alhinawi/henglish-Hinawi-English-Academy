import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

export const TimelineVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1); // 0 = Now, 1 = Completed, 2 = Deadline

  const steps = [
    {
      id: 0,
      title: 'دلوقتي (Present / Now)',
      subtitle: 'نقطة الانطلاق والتخطيط',
      icon: Clock,
      color: 'border-[#ff4f9a] text-[#ff4f9a] bg-[#ff4f9a]/10',
      glow: 'shadow-[0_0_20px_rgba(255,79,154,0.3)]',
      dotColor: 'bg-[#ff4f9a]',
      timeLabel: 'Right Now',
      sentence: 'I am starting my homework or planning the project.',
      translation: 'إنت لسه بتبدأ في المذاكرة أو التخطيط للشغل.',
      explanation: 'في اللحظة دي، الحدث لسه مخلصش أو بيبدأ، لكن عينك على نقطة في المستقبل.',
    },
    {
      id: 1,
      title: 'الحدث يكتمل (Action Completed)',
      subtitle: 'will have + V3',
      icon: CheckCircle2,
      color: 'border-[#c4ff55] text-[#c4ff55] bg-[#c4ff55]/10',
      glow: 'shadow-[0_0_25px_rgba(196,255,85,0.35)]',
      dotColor: 'bg-[#c4ff55]',
      timeLabel: 'Before the Deadline',
      sentence: 'I will have finished my homework.',
      translation: 'هكون خلصت كل واجبي وقفلت دفاتري خلاص.',
      explanation: 'ده جوهر المستقبل التام: الفعل بيتم إنجازه تماماً قبل وصول النقطة المستقبلية.',
    },
    {
      id: 2,
      title: 'الموعد المستقبلي (Future Deadline)',
      subtitle: 'By 8 p.m. / By Friday',
      icon: Calendar,
      color: 'border-[#41e7ff] text-[#41e7ff] bg-[#41e7ff]/10',
      glow: 'shadow-[0_0_20px_rgba(65,231,255,0.3)]',
      dotColor: 'bg-[#41e7ff]',
      timeLabel: 'Target Deadline (By 8 PM)',
      sentence: 'By 8 p.m. / By the time dad arrives.',
      translation: 'الوقت المستقبلي المحدد اللي بننظر منه للحدث المكتمل.',
      explanation: 'الوقت ده هو الموعد النهائي، والحدث كان اكتمل قبله أو عنده بالظبط.',
    },
  ];

  const current = steps[activeStep];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/15 text-[#41e7ff] border border-[#41e7ff]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE TIMELINE EXPLORER</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            تخيّل الخط الزمني للمستقبل التام 🕒
          </h3>
          <p className="text-sm text-[#b9b6d5] mt-1">
            اضغط على أي مرحلة من المراحل الثلاثة لفهم موضع الحدث واكتماله قبل الموعد.
          </p>
        </div>

        {/* Step Selector Buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                playSound('click');
                setActiveStep(idx);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStep === idx
                  ? `${s.color} border shadow-lg font-black`
                  : 'text-[#dedbf4] hover:bg-white/5'
              }`}
            >
              <span>0{idx + 1}</span>
              <span className="hidden md:inline">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline Track */}
      <div className="relative py-8 my-4">
        {/* Track Line */}
        <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gradient-to-r from-[#ff4f9a]/50 via-[#c4ff55] to-[#41e7ff] -translate-y-1/2 rounded-full z-0 opacity-60" />

        {/* Timeline Stops */}
        <div className="relative z-10 grid grid-cols-3 gap-2">
          {steps.map((s, idx) => {
            const isSelected = activeStep === idx;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => {
                  playSound('click');
                  setActiveStep(idx);
                }}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                {/* Node Orb */}
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                    isSelected
                      ? `${s.color} ${s.glow} scale-110`
                      : 'bg-[#171632] border-white/20 text-[#b9b6d5] group-hover:border-white/50 group-hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Node Labels */}
                <span className={`mt-3 text-xs sm:text-sm font-black transition-colors ${
                  isSelected ? 'text-white' : 'text-[#b9b6d5]'
                }`}>
                  {s.title}
                </span>
                <span className="text-[11px] text-[#b9b6d5]/70 hidden sm:block">
                  {s.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Details Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="mt-6 p-6 rounded-2xl bg-[#09091a]/80 border border-white/10 relative"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-[#b9b6d5] uppercase tracking-wider">
                موقع المرحلة: {current.timeLabel}
              </span>
              <h4 className="text-lg font-black text-white mt-0.5">
                {current.title} — {current.subtitle}
              </h4>
            </div>
            <div className={`px-3 py-1 rounded-xl text-xs font-bold border ${current.color}`}>
              المرحلة 0{activeStep + 1} من 03
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-[#171632] p-4 rounded-xl border border-white/10">
              <span className="text-xs text-[#ffd166] font-bold block mb-1">
                المثال الإنجليزي (English Context):
              </span>
              <p className="en text-base sm:text-lg font-bold text-white">
                {current.sentence}
              </p>
              <p className="text-sm text-[#b9b6d5] mt-2">
                {current.translation}
              </p>
            </div>

            <div className="bg-[#171632] p-4 rounded-xl border border-white/10 flex flex-col justify-center">
              <span className="text-xs text-[#41e7ff] font-bold block mb-1">
                الشرح والمنطق اللغوي:
              </span>
              <p className="text-sm text-[#dedbf4] leading-relaxed">
                {current.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
