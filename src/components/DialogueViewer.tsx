import React, { useState } from 'react';
import { REAL_LIFE_DIALOGUES } from '../data/dialoguesData';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import { Volume2, Play, CheckCircle2, XCircle, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const DialogueViewer: React.FC = () => {
  const [selectedDialogueIndex, setSelectedDialogueIndex] = useState(0);
  const currentScenario = REAL_LIFE_DIALOGUES[selectedDialogueIndex];

  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const handlePlayAll = async () => {
    if (isPlayingAll) return;
    setIsPlayingAll(true);
    playSound('click');

    for (let i = 0; i < currentScenario.lines.length; i++) {
      speakEnglish(currentScenario.lines[i].en);
      // Wait for spoken line duration roughly
      await new Promise(res => setTimeout(res, 3200));
    }
    setIsPlayingAll(false);
  };

  const handleAnswerQuestion = (qIndex: number, optionIndex: number) => {
    if (quizAnswers[qIndex] !== undefined) return;
    const isCorrect = optionIndex === currentScenario.comprehensionQuestions[qIndex].answer;
    setQuizAnswers({ ...quizAnswers, [qIndex]: optionIndex });

    if (isCorrect) {
      playSound('correct');
      fireCelebration();
    } else {
      playSound('wrong');
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/15 text-[#41e7ff] border border-[#41e7ff]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REAL-LIFE CONVERSATION LAB</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            محادثات واقعية ونطق صوتي حي 💬
          </h3>
          <p className="text-sm text-[#b9b6d5] mt-1">
            اقرأ واستمع لمحادثات يومية ومهنية توظف المستقبل التام في سياقاته الطبيعية.
          </p>
        </div>

        {/* Listen All Button */}
        <button
          onClick={handlePlayAll}
          disabled={isPlayingAll}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm hover:brightness-110 shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isPlayingAll ? 'جاري الاستماع...' : 'استمع للمحادثة كاملة'}</span>
        </button>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {REAL_LIFE_DIALOGUES.map((dia, idx) => (
          <button
            key={dia.id}
            onClick={() => {
              playSound('click');
              setSelectedDialogueIndex(idx);
              setQuizAnswers({});
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
              selectedDialogueIndex === idx
                ? 'bg-gradient-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black shadow-md'
                : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
            }`}
          >
            {dia.title}
          </button>
        ))}
      </div>

      {/* Active Dialogue Meta */}
      <div className="p-4 rounded-2xl bg-[#09091a]/80 border border-white/10 mb-6 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white text-base">
            {currentScenario.title}
          </h4>
          <p className="text-xs text-[#b9b6d5] mt-0.5">
            {currentScenario.description}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
          {currentScenario.category}
        </span>
      </div>

      {/* Chat Dialogue Stream */}
      <div className="space-y-4 mb-8">
        {currentScenario.lines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3 sm:gap-4 p-4 rounded-2xl bg-[#171632]/80 border border-white/10 hover:border-white/20 transition-colors"
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#9b7bff]/30 to-[#41e7ff]/30 border border-white/20 flex items-center justify-center text-xl shrink-0 shadow-md">
              {line.avatar}
            </div>

            {/* Bubble Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-xs sm:text-sm text-[#41e7ff]">
                  {line.speaker}
                </span>

                <button
                  onClick={() => {
                    playSound('click');
                    speakEnglish(line.en);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#41e7ff] hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                  title="استمع لنطق الجملة"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">نطق</span>
                </button>
              </div>

              {/* English Line */}
              <p className="en text-base sm:text-lg font-bold text-white leading-relaxed">
                {line.en}
              </p>

              {/* Arabic Translation */}
              <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1.5 border-t border-white/5 pt-1.5">
                {line.ar}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comprehension Check */}
      {currentScenario.comprehensionQuestions.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#09091a] border border-white/10">
          <div className="flex items-center gap-2 mb-4 text-[#ffd166] font-bold text-sm">
            <MessageSquare className="w-4 h-4" />
            <span>سؤال استيعاب سريع على المحادثة:</span>
          </div>

          {currentScenario.comprehensionQuestions.map((q, qIdx) => {
            const answered = quizAnswers[qIdx] !== undefined;
            const chosen = quizAnswers[qIdx];
            const isCorrect = chosen === q.answer;

            return (
              <div key={qIdx} className="space-y-3">
                <p className="en text-sm sm:text-base font-bold text-white">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-[#171632] hover:bg-[#201d43] border-white/10 text-white';
                    if (answered) {
                      if (optIdx === q.answer) {
                        btnStyle = 'bg-[#c4ff55]/20 border-[#c4ff55] text-[#c4ff55] font-black';
                      } else if (chosen === optIdx) {
                        btnStyle = 'bg-[#ff4f9a]/20 border-[#ff4f9a] text-[#ff4f9a]';
                      } else {
                        btnStyle = 'opacity-40 bg-[#171632] border-white/5 text-[#b9b6d5]';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerQuestion(qIdx, optIdx)}
                        disabled={answered}
                        className={`en p-3 rounded-xl border text-sm text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {answered && optIdx === q.answer && (
                          <CheckCircle2 className="w-4 h-4 text-[#c4ff55]" />
                        )}
                        {answered && chosen === optIdx && optIdx !== q.answer && (
                          <XCircle className="w-4 h-4 text-[#ff4f9a]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <p className="text-xs text-[#b9b6d5] pt-2">
                    {isCorrect ? '✅ رائع! ' : '❌ حاول مراجعة المحادثة مرة أخرى. '}
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
