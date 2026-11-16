import { copyText } from '../services/copyText';
import { writingFeedback } from '../services/writingFeedback';
import { LessonCorrection } from '../components/LessonCorrection';
import { LiteracyAcademy } from '../components/LiteracyAcademy';
import React, { useState } from 'react';
import { PageRoute } from '../types';
import { isAiServiceUnavailable, throwForAiResponse } from '../services/aiAvailability';
import { useLanguage } from '../i18n/LanguageContext';
import { playSound, fireCelebration, speakEnglish } from '../utils/audio';
import {
  PenTool,
  Mail,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Copy,
  Volume2,
  RefreshCw,
  Brain,
  Award,
} from 'lucide-react';

interface WritingAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
  onCompleteActivity?: (id: string, score: number, total: number) => void;
}

export const WritingAcademyPage: React.FC<WritingAcademyPageProps> = ({ onNavigate, onCompleteActivity }) => {
  const { t } = useLanguage();
  const [activeTemplate, setActiveTemplate] = useState<'formal_email' | 'job_application' | 'essay' | 'complaint' | 'university'>('formal_email');
  const [userInput, setUserInput] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const templates = {
    formal_email: {
      titleKey: 'wa.tpl.formal_email.title',
      subject: 'Subject: Project Milestone Delivery & Q4 Roadmap',
      salutation: 'Dear Mr. Henderson,',
      body: 'I am writing to provide you with a comprehensive status update regarding our software migration. By next Friday at 5:00 PM, our engineering team will have deployed all microservices to the production cluster. Furthermore, we will have conducted rigorous performance testing before your scheduled board meeting.',
      signoff: 'Best regards,\nSample Applicant\nLead Systems Architect',
      ruleKeys: ['wa.tpl.formal_email.rule1', 'wa.tpl.formal_email.rule2', 'wa.tpl.formal_email.rule3'],
    },
    job_application: {
      titleKey: 'wa.tpl.job_application.title',
      subject: 'Application for Senior Software Engineering Specialist',
      salutation: 'Dear Hiring Committee,',
      body: 'I am writing to express my strong enthusiasm for the Senior Software Engineering position. Throughout my career, I have delivered resilient cloud applications. By the completion of this quarter, I will have led three international software initiatives, demonstrating my ability to deliver results under tight deadlines.',
      signoff: 'Sincerely,\nSample Applicant',
      ruleKeys: ['wa.tpl.job_application.rule1', 'wa.tpl.job_application.rule2', 'wa.tpl.job_application.rule3'],
    },
    essay: {
      titleKey: 'wa.tpl.essay.title',
      subject: 'The Impact of Renewable Energy on Future Cities',
      salutation: 'Thesis & Topic Sentence:',
      body: 'This imagined city is considering a transition to renewable energy. If the plan succeeds, the city will have expanded its use of solar and wind power by the end of the project. However, the proposal must address cost, reliability and access before its benefits can be assessed.',
      signoff: 'Concluding Thought:\nTherefore, strategic green investments today are imperative for long-term ecological stability.',
      ruleKeys: ['wa.tpl.essay.rule1', 'wa.tpl.essay.rule2', 'wa.tpl.essay.rule3'],
    },
    complaint: {
      titleKey: 'wa.tpl.complaint.title',
      subject: 'Subject: Formal Complaint Regarding Delayed Order #4821',
      salutation: 'Dear Customer Service Manager,',
      body: 'I am writing to express my deep dissatisfaction with the handling of my recent order. By the time your team responds, three weeks will have passed since the promised delivery date. I expect that by the end of this business week, you will have investigated the delay and will have provided a full refund to my account.',
      signoff: 'Yours faithfully,\nSample Applicant',
      ruleKeys: ['wa.tpl.complaint.rule1', 'wa.tpl.complaint.rule2', 'wa.tpl.complaint.rule3'],
    },
    university: {
      titleKey: 'wa.tpl.university.title',
      subject: 'Personal Statement: Why I Chose Computer Science',
      salutation: 'Opening Paragraph:',
      body: 'Ever since I wrote my first line of code at fourteen, I have been fascinated by the power of software to solve real human problems. By the time I begin my studies at your faculty, I will have completed three independent programming projects and will have volunteered over two hundred hours teaching coding to younger students in my community.',
      signoff: 'Closing Thought:\nI am confident that your program will refine my passion into genuine expertise.',
      ruleKeys: ['wa.tpl.university.rule1', 'wa.tpl.university.rule2', 'wa.tpl.university.rule3'],
    },
  };

  const currentTemplate = templates[activeTemplate];

  const handleCopyTemplate = async () => {
    playSound('click');
    const fullText = `${currentTemplate.subject}\n\n${currentTemplate.salutation}\n\n${currentTemplate.body}\n\n${currentTemplate.signoff}`;
    setCopied(false);
    setCopyFailed(false);
    if (!(await copyText(fullText))) { setCopyFailed(true); return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyzeWriting = async () => {
    playSound('click');
    const wordCount = userInput.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 10) {
      setSubmissionFeedback(t('wa.feedback.tooShort'));
      playSound('wrong');
      return;
    }

    setIsAnalyzing(true);
    setSubmissionFeedback(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Please act as a Senior English Writing Assessor. Review the following student submission for a ${t(currentTemplate.titleKey)}:\n\n"${userInput}"\n\nProvide structured feedback in Arabic including:\n1) Estimated CEFR level of the writing (A1-C2).\n2) Grammar and spelling corrections with clear before/after examples.\n3) Feedback on tone, structure, and coherence.\n4) A polished, high-scoring native revision.`,
          mode: 'writing-assistant',
          userLevel: 'B2',
        }),
      });

      await throwForAiResponse(response, `AI writing analysis failed with status: ${response.status}`);

      const data = await response.json();
      const feedbackText = writingFeedback(data);
      if (!feedbackText) {
        setSubmissionFeedback(t('wa.feedback.unavailable'));
        return;
      }
      setSubmissionFeedback(feedbackText);
      playSound('correct');
      fireCelebration();
    } catch (err) {
      if (isAiServiceUnavailable(err)) {
        setSubmissionFeedback(t('ai.unavailable'));
      } else {
        console.warn('AI analysis fallback:', err);
        setSubmissionFeedback(t('wa.feedback.error'));
      }

    } finally {
      setIsAnalyzing(false);
    }
  };

  const commonMistakes = [
    {
      titleKey: 'wa.mistake1.title',
      wrong: 'I finished my homework I went to sleep.',
      correct: 'I finished my homework, and then I went to sleep. / After finishing my homework, I went to sleep.',
      explanationKey: 'wa.mistake1.explanation',
    },
    {
      titleKey: 'wa.mistake2.title',
      wrong: 'Every student in these classes have a book.',
      correct: 'Every student in these classes has a book.',
      explanationKey: 'wa.mistake2.explanation',
    },
    {
      titleKey: 'wa.mistake3.title',
      wrong: 'By the time you will arrive, we will have eaten.',
      correct: 'By the time you arrive, we will have eaten.',
      explanationKey: 'wa.mistake3.explanation',
    },
  ];

  return (
    <div className="space-y-10 pb-16 text-right">
      <LiteracyAcademy kind="writing" onCompleteActivity={onCompleteActivity} />
      <details className="rounded-3xl border border-white/10 p-4"><summary className="cursor-pointer font-bold text-slate-200">{t('wa.section.templates')}</summary>
      <div className="mt-6 space-y-8">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 left-10 w-80 h-80 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm">
            <PenTool className="w-4 h-4" />
            <span>{t('wa.hero.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            {t('wa.hero.title')}
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            {t('wa.hero.sub')}
          </p>
        </div>
      </section>

      {copyFailed && <p role="status" className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-lg rounded-xl border border-amber-300/30 bg-[#171320] p-4 text-sm text-amber-100 shadow-xl">{t('copy.failed')}</p>}

      {/* 1. TEMPLATE SELECTOR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => {
            playSound('click');
            setActiveTemplate('formal_email');
            setSubmissionFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
            activeTemplate === 'formal_email'
              ? 'bg-[#ffd166] text-[#0c0b20] font-black shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10 border border-white/10'
          }`}
        >
         {t('wa.tab.formal_email')}
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTemplate('job_application');
            setSubmissionFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
            activeTemplate === 'job_application'
              ? 'bg-[#41e7ff] text-[#0c0b20] font-black shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10 border border-white/10'
          }`}
        >
         {t('wa.tab.job_application')}
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTemplate('essay');
            setSubmissionFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
            activeTemplate === 'essay'
              ? 'bg-[#c4ff55] text-[#0c0b20] font-black shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10 border border-white/10'
          }`}
        >
         {t('wa.tab.essay')}
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTemplate('complaint');
            setSubmissionFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
            activeTemplate === 'complaint'
              ? 'bg-[#ff9a5c] text-[#0c0b20] font-black shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10 border border-white/10'
          }`}
        >
         {t('wa.tab.complaint')}
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTemplate('university');
            setSubmissionFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
            activeTemplate === 'university'
              ? 'bg-[#c9a7ff] text-[#0c0b20] font-black shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10 border border-white/10'
          }`}
        >
         {t('wa.tab.university')}
        </button>
      </div>

      {/* 2. TEMPLATE VIEWER & WRITING WORKSHOP */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Template Showcase */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-xl font-black text-white">{t(currentTemplate.titleKey)}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyTemplate}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#ffd166] border border-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? t('wa.copied') : t('wa.copy')}</span>
              </button>
              <button
                onClick={() => speakEnglish(currentTemplate.body)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#41e7ff] cursor-pointer"
                title={t('wa.listen')}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="en bg-[#09091a] p-6 rounded-2xl border border-white/10 space-y-3 text-left">
            <div className="text-xs font-mono text-[#ffd166] font-bold">{currentTemplate.subject}</div>
            <div className="text-xs text-[#b9b6d5]">{currentTemplate.salutation}</div>
            <p className="text-sm sm:text-base text-white leading-relaxed font-serif">
              {currentTemplate.body}
            </p>
            <div className="text-xs text-[#b9b6d5] whitespace-pre-line pt-2 border-t border-white/5">
              {currentTemplate.signoff}
            </div>
          </div>

          {/* Golden Rules */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-[#ffd166]">{t('wa.goldenRules')}</span>
            <ul className="space-y-1.5 text-xs text-[#dedbf4]">
              {currentTemplate.ruleKeys.map((rk, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c4ff55] shrink-0" />
                  <span>{t(rk)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live Writing Workspace */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-linear-to-b from-[#1b1939] to-[#121128] border border-white/10 space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('wa.lab.badge')}</span>
            </div>
            <h3 className="text-lg font-black text-white">{t('wa.lab.title')}</h3>
            <p className="text-xs text-[#dedbf4]">
              {t('wa.lab.sub')}
            </p>
          </div>

          <textarea
            rows={8}
            dir="ltr"
            lang="en"
            value={userInput}
            onChange={e => {
              setUserInput(e.target.value);
              setSubmissionFeedback(null);
            }}
            placeholder="Dear Mr. Smith, I am writing to inform you that by Friday, we will have finished the assignment..."
            className="english-input en w-full p-4 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-[#b9b6d5]/50 text-sm focus:outline-none focus:border-[#ffd166] leading-relaxed"
          />

          <div className="flex items-center justify-between text-xs text-[#b9b6d5]">
            <span>{t('wa.words')}: {userInput.trim().split(/\s+/).filter(Boolean).length}</span>
            <button
              onClick={() => setUserInput(currentTemplate.body)}
              className="text-[#41e7ff] hover:underline cursor-pointer"
            >
              {t('wa.importTemplate')}
            </button>
          </div>

          <button
            onClick={handleAnalyzeWriting}
            disabled={!userInput.trim() || isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#ffd166] to-[#ff4f9a] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('wa.analyzing')}</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>{t('wa.analyze')}</span>
              </>
            )}
          </button>

          {submissionFeedback && (
            <div className="p-5 rounded-2xl bg-[#171632] border border-[#ffd166]/40 text-xs text-white leading-relaxed space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-[#ffd166] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#ffd166]" />
                  {t('wa.feedback.title')}
                </span>
                <span className="text-[10px] text-[#c4ff55] font-mono">{t('wa.feedback.disclaimer')}</span>
              </div>
              <div className="whitespace-pre-line text-xs text-[#dedbf4] leading-relaxed">
                {submissionFeedback}
              </div>
            </div>
          )}
        </div>

      </section>

      {/* 3. COMMON WRITING MISTAKES */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ff4f9a]" />
            {t('wa.mistakes.title')}
          </h2>
          <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
            {t('wa.mistakes.sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commonMistakes.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#09091a] border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="text-xs font-black text-[#ffd166]">{t('wa.trap')} 0{idx + 1}: {t(m.titleKey)}</span>
                <LessonCorrection wrong={m.wrong} correct={m.correct} />
              </div>
              <p className="text-[11px] text-[#b9b6d5] leading-relaxed pt-2 border-t border-white/5">
                {t(m.explanationKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      </div></details>
    </div>
  );
};
