import React, { useState } from 'react';
import { PageRoute } from '../types';
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
} from 'lucide-react';

interface WritingAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const WritingAcademyPage: React.FC<WritingAcademyPageProps> = ({ onNavigate }) => {
  const [activeTemplate, setActiveTemplate] = useState<'formal_email' | 'job_application' | 'essay'>('formal_email');
  const [userInput, setUserInput] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const templates = {
    formal_email: {
      title: 'Formal Business Email • إيميل عمل رسمي',
      subject: 'Subject: Project Milestone Delivery & Q4 Roadmap',
      salutation: 'Dear Mr. Henderson,',
      body: 'I am writing to provide you with a comprehensive status update regarding our software migration. By next Friday at 5:00 PM, our engineering team will have deployed all microservices to the production cluster. Furthermore, we will have conducted rigorous performance testing before your scheduled board meeting.',
      signoff: 'Best regards,\nAhmed Elhinawi\nLead Systems Architect',
      keyRules: [
        'ابدأ دائماً بتحية رسمية مثل Dear Mr. / Ms. متبوعة باسم العائلة.',
        'استخدم روابط متقدمة مثل Furthermore, However, Consequently بدلاً من and/but.',
        'استخدم المستقبل التام للتأكيد على التزامك بالمواعيد: will have deployed.',
      ],
    },
    job_application: {
      title: 'Job Application Cover Letter • خطاب تقديم على وظيفة',
      subject: 'Application for Senior Software Engineering Specialist',
      salutation: 'Dear Hiring Committee,',
      body: 'I am writing to express my strong enthusiasm for the Senior Software Engineering position. Throughout my career, I have delivered resilient cloud applications. By the completion of this quarter, I will have led three international software initiatives, demonstrating my ability to deliver results under tight deadlines.',
      signoff: 'Sincerely,\nAhmed Elhinawi',
      keyRules: [
        'حدد اسم الوظيفة بوضوح في السطر الأول.',
        'اربط إنجازاتك السابقة بالأهداف المستقبلية للشركة.',
        'اختم بعبارة احترافية مثل Sincerely أو Respectfully.',
      ],
    },
    essay: {
      title: 'Academic Opinion Essay • مقال رأي أكاديمي',
      subject: 'The Impact of Renewable Energy on Future Cities',
      salutation: 'Thesis & Topic Sentence:',
      body: 'In recent decades, urban centers have increasingly embraced sustainable infrastructure. Environmental economists predict that by 2040, major metropolitan cities will have transitioned to ninety percent clean solar and wind energy. This monumental shift will significantly alleviate climate hazards.',
      signoff: 'Concluding Thought:\nTherefore, strategic green investments today are imperative for long-term ecological stability.',
      keyRules: [
        'ابدأ بجملة افتتاحية قوية تجذب القارئ (Hook + Topic Sentence).',
        'ادعم رأيك بإحصائيات وأدلة واقعية.',
        'تجنب التعبيرات العامية مثل "cool, stuff, a lot of".',
      ],
    },
  };

  const currentTemplate = templates[activeTemplate];

  const handleCopyTemplate = () => {
    playSound('click');
    const fullText = `${currentTemplate.subject}\n\n${currentTemplate.salutation}\n\n${currentTemplate.body}\n\n${currentTemplate.signoff}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyzeWriting = () => {
    playSound('click');
    const wordCount = userInput.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 10) {
      setSubmissionFeedback('⚠️ النص قصير جداً! اكتب جملة كاملة تحتوي على فاعل وفعل ومفعول به.');
      playSound('wrong');
      return;
    }

    const hasFuturePerfect = userInput.toLowerCase().includes('will have');
    const hasConnector = /however|furthermore|therefore|because|although|in addition/i.test(userInput);

    let feedback = `✅ رائع جداً! عدد الكلمات: ${wordCount} كلمة. `;
    if (hasFuturePerfect) {
      feedback += '🎯 استخدام ممتاز ومتقن لقاعدة المستقبل التام (will have + V3)! ';
    }
    if (hasConnector) {
      feedback += '🔗 استخدام رائع للروابط الأكاديمية مما جعل النص متماسكاً. ';
    }

    setSubmissionFeedback(feedback);
    playSound('correct');
    fireCelebration();
  };

  const commonMistakes = [
    {
      title: 'فخ الجمع الخاطئ أو الجمع العشوائي (Run-on Sentences)',
      wrong: 'I finished my homework I went to sleep.',
      correct: 'I finished my homework, and then I went to sleep. / After finishing my homework, I went to sleep.',
      explanation: 'لا تجمع جملتين كاملتين دون رابط زمني أو فاصلة مناسبة.',
    },
    {
      title: 'فخ تطابق الفاعل مع الفعل (Subject-Verb Agreement)',
      wrong: 'Every student in these classes have a book.',
      correct: 'Every student in these classes has a book.',
      explanation: 'كلمة Every تعامل معاملة المفرد دائماً وبالتالي تأخذ has وليس have.',
    },
    {
      title: 'فخ استخدام will بعد الروابط الزمنية',
      wrong: 'By the time you will arrive, we will have eaten.',
      correct: 'By the time you arrive, we will have eaten.',
      explanation: 'بعد By the time نستخدم المضارع البسيط (arrive) للدلالة على المستقبل.',
    },
  ];

  return (
    <div className="space-y-10 pb-16 text-right">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-gradient-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 left-10 w-80 h-80 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm">
            <PenTool className="w-4 h-4" />
            <span>HINAWI WRITING ACADEMY • استوديو الكتابة والمراسلات المهنية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            أكاديمية الكتابة والمراسلات الرسمية ✍️
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            تعلّم كيف تكتب إيميلات واضحة، مؤثرة ومحترمة، وتعرّف على أسرار صياغة خطابات التقديم على الوظائف (Cover Letters) وتجنب الأخطاء الشائعة التي تقع فيها معظم المسودات.
          </p>
        </div>
      </section>

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
          ✉️ إيميل عمل رسمي (Business Email)
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
          📄 خطاب التقديم للوظيفة (Cover Letter)
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
          🎓 مقال أكاديمي (Academic Paragraph)
        </button>
      </div>

      {/* 2. TEMPLATE VIEWER & WRITING WORKSHOP */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Template Showcase */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-xl font-black text-white">{currentTemplate.title}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyTemplate}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#ffd166] border border-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'تم النسخ! ✅' : 'نسخ النموذج'}</span>
              </button>
              <button
                onClick={() => speakEnglish(currentTemplate.body)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#41e7ff] cursor-pointer"
                title="استمع لنطق النموذج"
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
            <span className="text-xs font-bold text-[#ffd166]">💡 قواعد ذهبية لهذا النموذج:</span>
            <ul className="space-y-1.5 text-xs text-[#dedbf4]">
              {currentTemplate.keyRules.map((r, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c4ff55] shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live Writing Workspace */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#1b1939] to-[#121128] border border-white/10 space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مختبر المحرر الذكي</span>
            </div>
            <h3 className="text-lg font-black text-white">اكتب إيميلك أو مسودتك هنا</h3>
            <p className="text-xs text-[#dedbf4]">
              جرّب كتابة رسالة أو فقرة بالإنجليزية، واضغط على زر التحليل لاكتشاف التراكيب النحوية والروابط.
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
            <span>الكلمات: {userInput.trim().split(/\s+/).filter(Boolean).length}</span>
            <button
              onClick={() => setUserInput(currentTemplate.body)}
              className="text-[#41e7ff] hover:underline cursor-pointer"
            >
              استيراد نص النموذج للتعديل عليه
            </button>
          </div>

          <button
            onClick={handleAnalyzeWriting}
            disabled={!userInput.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#ff4f9a] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-50 transition-all"
          >
            فحص وتحليل المسودة الآن 🔍
          </button>

          {submissionFeedback && (
            <div className="p-4 rounded-2xl bg-[#171632] border border-[#ffd166]/40 text-xs text-white leading-relaxed space-y-1">
              <strong className="text-[#ffd166]">تقرير التقييم:</strong>
              <p>{submissionFeedback}</p>
            </div>
          )}
        </div>

      </section>

      {/* 3. COMMON WRITING MISTAKES */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ff4f9a]" />
            أشهر الأخطاء الشائعة في الكتابة (Common Writing Mistakes)
          </h2>
          <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
            تجنب هذه الهفوات الثلاث التي تُقلل من درجة كتابتك في امتحانات الآيلتس والتوأم الوظيفي:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commonMistakes.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#09091a] border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="text-xs font-black text-[#ffd166]">فخ 0{idx + 1}: {m.title}</span>
                <div className="p-2.5 rounded-xl bg-[#ff4f9a]/10 border border-[#ff4f9a]/30 text-xs text-[#ff8bb9] en font-mono">
                  ❌ {m.wrong}
                </div>
                <div className="p-2.5 rounded-xl bg-[#c4ff55]/10 border border-[#c4ff55]/30 text-xs text-[#c4ff55] en font-mono font-bold">
                  ✅ {m.correct}
                </div>
              </div>
              <p className="text-[11px] text-[#b9b6d5] leading-relaxed pt-2 border-t border-white/5">
                {m.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
