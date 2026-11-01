import React, { useState } from 'react';
import { COMPREHENSIVE_QUIZ_BANK } from '../data/quizzesData';
import { QuizEngine } from '../components/QuizEngine';
import { QuizQuestion } from '../types';
import { playSound, fireCelebration } from '../utils/audio';
import { Sparkles, Filter, Brain, RefreshCw, Zap, BookOpen, Layers } from 'lucide-react';

interface QuizzesPageProps {
  onRecordScore?: (quizId: string, score: number, total: number) => void;
}

const GRAMMAR_TOPICS = [
  { id: 'future-perfect', label: 'المستقبل التام (Future Perfect)' },
  { id: 'present-simple', label: 'المضارع البسيط (Present Simple)' },
  { id: 'present-continuous', label: 'المضارع المستمر (Present Continuous)' },
  { id: 'present-perfect', label: 'المضارع التام (Present Perfect)' },
  { id: 'past-simple', label: 'الماضي البسيط (Past Simple)' },
  { id: 'past-continuous', label: 'الماضي المستمر (Past Continuous)' },
  { id: 'past-perfect', label: 'الماضي التام (Past Perfect)' },
  { id: 'conditionals', label: 'الحالات الشرطية (Conditionals)' },
  { id: 'passive-voice', label: 'المبني للمجهول (Passive Voice)' },
  { id: 'reported-speech', label: 'الكلام المنقول (Reported Speech)' },
  { id: 'modals', label: 'الأفعال الناقصة (Modal Verbs)' },
  { id: 'phrasal-verbs', label: 'الأفعال المركبة (Phrasal Verbs)' },
];

export const QuizzesPage: React.FC<QuizzesPageProps> = ({ onRecordScore }) => {
  const [activeTab, setActiveTab] = useState<'static' | 'ai'>('ai');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  // AI Generator State
  const [aiTopic, setAiTopic] = useState('future-perfect');
  const [aiLevel, setAiLevel] = useState('B2');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiCount, setAiCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<QuizQuestion[] | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const filteredQuestions = filterDifficulty === 'all'
    ? COMPREHENSIVE_QUIZ_BANK
    : COMPREHENSIVE_QUIZ_BANK.filter(q => q.difficulty === filterDifficulty);

  const handleComplete = (score: number, total: number) => {
    onRecordScore?.(`quiz_${activeTab === 'ai' ? 'ai_' + aiTopic : filterDifficulty}`, score, total);
  };

  const handleGenerateAiQuiz = async () => {
    playSound('click');
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/ai/generateQuestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          cefrLevel: aiLevel,
          difficulty: aiDifficulty,
          count: aiCount,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate questions: ${response.status}`);
      }

      const data = await response.json();
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid format returned by AI generator');
      }

      const mapped: QuizQuestion[] = data.questions.map((q: any, idx: number) => ({
        id: q.id || `ai-gen-${Date.now()}-${idx}`,
        question: q.prompt,
        options: q.options,
        answer: q.correctAnswerIndex ?? 0,
        explanation: q.explanationAr + (q.distractorNotesAr && q.distractorNotesAr.length > 0 ? '\n\n💡 تحليل الخيارات الخاطئة:\n• ' + q.distractorNotesAr.join('\n• ') : ''),
        topic: q.topic || aiTopic,
        difficulty: q.difficulty === 'easy' ? 'beginner' : q.difficulty === 'hard' ? 'advanced' : 'intermediate',
      }));

      setAiGeneratedQuestions(mapped);
      playSound('correct');
      fireCelebration();
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setGenerationError('تعذر توليد الكويز عبر الذكاء الاصطناعي حالياً. تم استدعاء بنك الأسئلة الاحتياطي.');
      playSound('wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-right">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>HENGLISH DYNAMIC ASSESSMENT REPOSITORY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cairo',sans-serif]">
          بنك الاختبارات ومولّد الكويزات الذكي 🎮
        </h1>
        <p className="text-base text-[#b9b6d5] leading-relaxed">
          اختبر مهاراتك مع بنك الأسئلة الشامل، أو قم بتوليد كويزات غير محدودة وفورية مخصصة لمستواك في أي قاعدة إنجليزية بواسطة الذكاء الاصطناعي (Gemini Multimodal).
        </p>

        {/* Mode Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('ai');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ai'
                ? 'bg-[#c4ff55] text-[#0c0b20] shadow-lg'
                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>مولّد الكويزات بالذكاء الاصطناعي ✨</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveTab('static');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'static'
                ? 'bg-[#ffd166] text-[#0c0b20] shadow-lg'
                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>بنك الأسئلة المعتمد ({COMPREHENSIVE_QUIZ_BANK.length})</span>
          </button>
        </div>
      </div>

      {/* AI GENERATOR PANEL */}
      {activeTab === 'ai' && (
        <section className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 bg-linear-to-br from-[#121128] to-[#1a1836]">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#c4ff55]" />
                تخصيص الكويز التوليدي الفوري (Dynamic AI Generator)
              </h2>
              <p className="text-xs text-[#b9b6d5]">
                اختر القاعدة والمستوى وسيقوم الذكاء الاصطناعي بصياغة أسئلة فريدة مع تحليل البدائل الخاطئة وتفسيرات بالمصري.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-bold text-[#dedbf4]">القاعدة النحوية المستهدفة:</label>
                <select
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#c4ff55]"
                >
                  {GRAMMAR_TOPICS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#dedbf4]">المستوى المعياري CEFR:</label>
                <select
                  value={aiLevel}
                  onChange={e => setAiLevel(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#c4ff55]"
                >
                  <option value="A1">A1 - مبتدئ</option>
                  <option value="A2">A2 - فوق المبتدئ</option>
                  <option value="B1">B1 - متوسط</option>
                  <option value="B2">B2 - فوق المتوسط</option>
                  <option value="C1">C1 - متقدم</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#dedbf4]">درجة الصعوبة:</label>
                <select
                  value={aiDifficulty}
                  onChange={e => setAiDifficulty(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#c4ff55]"
                >
                  <option value="easy">سهل (Easy)</option>
                  <option value="medium">متوسط (Medium)</option>
                  <option value="hard">تحدي متقدم (Hard)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#dedbf4]">عدد الأسئلة:</span>
                {[3, 5, 8].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setAiCount(cnt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      aiCount === cnt
                        ? 'bg-[#c4ff55] text-[#0c0b20] font-black'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {cnt} أسئلة
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateAiQuiz}
                disabled={isGenerating}
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#c4ff55] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري توليد الأسئلة بالذكاء الاصطناعي...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>توليد كويز جديد فوراً ✨</span>
                  </>
                )}
              </button>
            </div>

            {generationError && (
              <div className="p-3 rounded-xl bg-[#ff4f9a]/15 border border-[#ff4f9a]/40 text-[#ff4f9a] text-xs font-bold">
                ⚠️ {generationError}
              </div>
            )}
          </div>

          {/* AI Rendered Quiz Engine */}
          {aiGeneratedQuestions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#c4ff55]" />
                  كويز الذكاء الاصطناعي الجاهز ({aiGeneratedQuestions.length} أسئلة)
                </h3>
                <span className="text-xs text-[#c4ff55] font-mono">
                  {aiLevel} • {aiDifficulty.toUpperCase()}
                </span>
              </div>

              <QuizEngine
                key={`ai-quiz-${aiGeneratedQuestions.length}-${Date.now()}`}
                questions={aiGeneratedQuestions}
                quizTitle={`كويز تفاعلي مولّد بالذكاء الاصطناعي: ${
                  GRAMMAR_TOPICS.find(t => t.id === aiTopic)?.label || aiTopic
                }`}
                onComplete={handleComplete}
              />
            </div>
          )}
        </section>
      )}

      {/* STATIC QUIZ BANK PANEL */}
      {activeTab === 'static' && (
        <section className="space-y-6">
          {/* Difficulty Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
            <span className="text-xs text-[#b9b6d5] flex items-center gap-1 ml-2 font-bold shrink-0">
              <Filter className="w-3.5 h-3.5" />
              مستوى الصعوبة:
            </span>
            {[
              { id: 'all', label: `جميع الأسئلة (${COMPREHENSIVE_QUIZ_BANK.length})` },
              { id: 'beginner', label: 'مبتدئ (Beginner)' },
              { id: 'intermediate', label: 'متوسط (Intermediate)' },
              { id: 'advanced', label: 'متقدم (Advanced)' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  playSound('click');
                  setFilterDifficulty(item.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  filterDifficulty === item.id
                    ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black shadow-md'
                    : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Main Quiz Engine */}
          <QuizEngine
            key={filterDifficulty}
            questions={filteredQuestions}
            quizTitle={`اختبار المستقبل التام — ${
              filterDifficulty === 'all'
                ? 'بنك الأسئلة الكامل'
                : filterDifficulty === 'beginner'
                ? 'مستوى المبتدئين'
                : filterDifficulty === 'intermediate'
                ? 'المستوى المتوسط'
                : 'المستوى المتقدم'
            }`}
            onComplete={handleComplete}
          />
        </section>
      )}

    </div>
  );
};
