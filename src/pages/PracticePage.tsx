import React, { useState } from 'react';
import { SentenceBuilder } from '../components/SentenceBuilder';
import { MISTAKE_HUNTER_CASES } from '../data/gamesData';
import { playSound, fireCelebration, speakEnglish } from '../utils/audio';
import { Sparkles, AlertTriangle, Eye, EyeOff, Volume2 } from 'lucide-react';

export const PracticePage: React.FC = () => {
  // Homework answers reveal state
  const [showHomeworkAnswers, setShowHomeworkAnswers] = useState(false);

  // Mistake Hunter mini game state
  const [hunterAnswers, setHunterAnswers] = useState<Record<string, boolean>>({});

  const handleHunterAnswer = (id: string, userThinksHasError: boolean, actualHasError: boolean) => {
    if (hunterAnswers[id] !== undefined) return;
    const isCorrect = userThinksHasError === actualHasError;
    setHunterAnswers({ ...hunterAnswers, [id]: isCorrect });

    if (isCorrect) {
      playSound('correct');
      fireCelebration();
    } else {
      playSound('wrong');
    }
  };

  const homeworkPartA = [
    { num: 1, text: 'By 10 p.m. tonight, I ______ (finish) my revision.', ans: 'will have finished' },
    { num: 2, text: 'By next year, my brother ______ (graduate) from college.', ans: 'will have graduated' },
    { num: 3, text: 'They ______ (not / arrive) by noon.', ans: "won't have arrived / will not have arrived" },
    { num: 4, text: '______ you ______ (save) enough money by December?', ans: 'Will / have saved' },
    { num: 5, text: 'By the time she ______ (get) home, we will have eaten.', ans: 'gets' },
    { num: 6, text: 'What ______ you ______ (achieve) by 2030?', ans: 'will / have achieved' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INTERACTIVE PRACTICE CENTER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          مركز التدريبات والتمارين التفاعلية 🎯
        </h1>
        <p className="text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
          التطبيق العملي هو سر ثبات المعلومة. ركّب الجمل، اصطد الأخطاء النحوية، وحل أسئلة الواجب المنزلي مع التحقق الفوري.
        </p>
      </div>

      {/* Activity 1: Sentence Builder */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>01 • معمل تركيب الجملة (Sentence Builder)</span>
        </h2>
        <SentenceBuilder />
      </section>

      {/* Activity 2: Mistake Hunter */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-[#ff4f9a]" />
              <span>02 • تحدي صياد الأخطاء (Mistake Hunter) 🕵️</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
              اقرأ كل جملة وحدد: هل تحتوي على خطأ نحوي أم أنها صحيحة وسليمة؟
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {MISTAKE_HUNTER_CASES.map((item) => {
            const answered = hunterAnswers[item.id] !== undefined;
            const wasCorrect = hunterAnswers[item.id] === true;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#09091a] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between" dir="ltr">
                  <p className="en text-base sm:text-lg font-bold text-white text-left" dir="ltr" lang="en">
                    {item.sentence}
                  </p>
                  <button
                    onClick={() => speakEnglish(item.sentence)}
                    className="p-1 text-[#41e7ff] hover:text-white shrink-0 ml-2"
                    title="استمع للجملة"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {!answered ? (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleHunterAnswer(item.id, true, item.hasError)}
                      className="px-4 py-2 rounded-xl bg-[#ff4f9a]/15 hover:bg-[#ff4f9a]/25 text-[#ff4f9a] border border-[#ff4f9a]/30 font-bold text-xs cursor-pointer transition-colors"
                    >
                      ⚠️ الجملة بها خطأ
                    </button>
                    <button
                      onClick={() => handleHunterAnswer(item.id, false, item.hasError)}
                      className="px-4 py-2 rounded-xl bg-[#c4ff55]/15 hover:bg-[#c4ff55]/25 text-[#c4ff55] border border-[#c4ff55]/30 font-bold text-xs cursor-pointer transition-colors"
                    >
                      ✅ الجملة سليمة
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/5 text-xs sm:text-sm text-[#dedbf4] space-y-1">
                    <div className="font-bold">
                      {wasCorrect ? (
                        <span className="text-[#c4ff55]">🎯 أحسنت! تقييمك صحيح تماماً.</span>
                      ) : (
                        <span className="text-[#ff4f9a]">❌ تقييمك لم يكن دقيقاً.</span>
                      )}
                    </div>
                    {item.hasError ? (
                      <p className="text-[#ffd166]">
                        التصحيح السليم: <span className="en font-bold text-white" dir="ltr" lang="en">{item.correction}</span>
                      </p>
                    ) : (
                      <p className="text-[#c4ff55]">{item.correction}</p>
                    )}
                    <p className="text-[#b9b6d5]">{item.explanationAr}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Activity 3: Homework Lab with Reveal Answers */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>03 • الواجب المنزلي الشامل (Homework Lab) 📝</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
              حل التمارين بنفسك أولاً، ثم اضغط على زر إظهار الإجابات للمراجعة.
            </p>
          </div>

          <button
            onClick={() => {
              playSound('click');
              setShowHomeworkAnswers(!showHomeworkAnswers);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#ffd166] text-xs font-bold border border-white/10 transition-colors cursor-pointer"
          >
            {showHomeworkAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showHomeworkAnswers ? 'إخفاء الإجابات' : 'إظهار مفتاح الإجابات'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {homeworkPartA.map(q => (
            <div 
              key={q.num}
              className="p-4 rounded-xl bg-[#09091a] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
            >
              <span className="en font-bold text-white">
                {q.num}. {q.text}
              </span>
              {showHomeworkAnswers && (
                <span className="en px-3 py-1 rounded-lg bg-[#c4ff55]/15 text-[#c4ff55] font-black border border-[#c4ff55]/30 shrink-0 text-left">
                  {q.ans}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Self Checklist */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 mt-6">
          <h4 className="text-sm font-black text-[#ffd166]">
            قائمة المراجعة الذاتية السريعة قبل التسليم ✅
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#dedbf4]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-[#ffd166]" />
              <span>استخدمت will have في الإثبات</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-[#ffd166]" />
              <span>كتبت V3 وليس V2</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-[#ffd166]" />
              <span>استخدمت won't have في النفي</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-[#ffd166]" />
              <span>بدأت السؤال بـ Will</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-[#ffd166]" />
              <span>استخدمت المضارع البسيط بعد by the time</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-[#ffd166]" />
              <span>حددت نقطة زمنية مستقبلية واضحة</span>
            </label>
          </div>
        </div>
      </section>

    </div>
  );
};
