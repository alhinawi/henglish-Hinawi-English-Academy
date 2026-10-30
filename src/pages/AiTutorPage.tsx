import React, { useState, useRef, useEffect } from 'react';
import { PageRoute, CEFRLevel, UserProfile } from '../types';
import { 
  AiTutorMode, 
  AiChatMessage, 
  sendAiTutorMessage 
} from '../services/aiTutorService';
import { playSound, speakEnglish } from '../utils/audio';
import {
  Sparkles,
  Send,
  Volume2,
  Bot,
  User,
  GraduationCap,
  MessageSquare,
  BookA,
  PenTool,
  Mic,
  FileCheck,
  Briefcase,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiTutorPageProps {
  onNavigate: (route: PageRoute) => void;
  userProfile: UserProfile;
}

const MODES: { id: AiTutorMode; titleAr: string; titleEn: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  {
    id: 'grammar-teacher',
    titleAr: 'معلم القواعد 🦅',
    titleEn: 'Grammar Teacher',
    icon: GraduationCap,
    desc: 'يشرح القواعد المعقدة وأزمنة المستقبل والماضي بأسلوب مبسط بالمصري.',
  },
  {
    id: 'conversation-partner',
    titleAr: 'شريك المحادثة 💬',
    titleEn: 'Conversation Partner',
    icon: MessageSquare,
    desc: 'حوار حر بالإنجليزية الحية لتطوير الطلاقة وثقة التحدث اليومية.',
  },
  {
    id: 'vocabulary-coach',
    titleAr: 'مدرب المفردات 📚',
    titleEn: 'Vocabulary Coach',
    icon: BookA,
    desc: 'شرح معاني الكلمات المتقدمة، تصريفات V1-V3، والمتلازمات اللفظية.',
  },
  {
    id: 'writing-assistant',
    titleAr: 'مساعد الكتابة ✍️',
    titleEn: 'Writing Assistant',
    icon: PenTool,
    desc: 'تدقيق نصوصك وإيميلاتك وتصحيح الأخطاء القواعدية واقتراح صياغات بديلة.',
  },
  {
    id: 'pronunciation-coach',
    titleAr: 'مدرب النطق 🗣️',
    titleEn: 'Pronunciation Coach',
    icon: Mic,
    desc: 'توجيهات صوتية لمخارج الحروف، أصوات IPA، والتشديد الصوتي Stress.',
  },
  {
    id: 'exam-trainer',
    titleAr: 'مدرب الامتحانات 🎯',
    titleEn: 'Exam Trainer',
    icon: FileCheck,
    desc: 'تدريب على أسئلة ونماذج امتحانات CEFR، IELTS، و TOEFL.',
  },
  {
    id: 'interview-coach',
    titleAr: 'مدرب المقابلات 💼',
    titleEn: 'Mock Interviewer',
    icon: Briefcase,
    desc: 'محاكاة حقيقية لمقابلات العمل في كبرى الشركات العالمية بطريقة STAR.',
  },
];

const SUGGESTIONS: Record<AiTutorMode, string[]> = {
  'grammar-teacher': [
    'اشرح لي الفرق بين will و going to بالمصري',
    'إمتى بستخدم المستقبل التام Future Perfect؟',
    'ما هي قاعدة Since و For مع المضارع التام؟',
    'اشرح لي حالات If الشرطية الأربعة',
  ],
  'conversation-partner': [
    'Hello! Let\'s practice speaking about travel plans.',
    'Could we talk about modern AI technologies?',
    'How was your day? Let\'s have a casual chat.',
  ],
  'vocabulary-coach': [
    'ما الفرق بين Look for و Look after و Look forward to؟',
    'أعطني أهم متلازمات لغوية (Collocations) لإنجليزي الأعمال',
    'أشهر الأفعال الشاذة V3 التي يجب حفظها',
  ],
  'writing-assistant': [
    'راجع هذه الجملة: "I am agree with your opinion because it is make sense."',
    'كيف أكتب إيميل اعتذار مهذب لعميل بسبب تأخر التسليم؟',
    'حسّن أسلوب كتابة مقالتي لتبدو أكاديمية ورسمية',
  ],
  'pronunciation-coach': [
    'كيف أنطق صوت TH في Think و This؟',
    'ما الفرق في النطق بين Ship و Sheep؟',
  ],
  'exam-trainer': [
    'أعطني سؤالاً في قواعد B2 واختبرني في الإجابة',
    'كيف أحصل على درجة 7.5 في اختبار المحادثة في الآيلتس؟',
  ],
  'interview-coach': [
    'ابدأ معي مقابلة عمل وسلني: "Tell me about yourself"',
    'كيف أجيب عن سؤال: "What are your greatest weaknesses?"',
  ],
};

export const AiTutorPage: React.FC<AiTutorPageProps> = ({ onNavigate, userProfile }) => {
  const [activeMode, setActiveMode] = useState<AiTutorMode>('grammar-teacher');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: `أهلاً بك يا ${userProfile.nameAr}! 🦅 أنا معلمك الذكي للغة الإنجليزية في أكاديمية هناوي.
أنا مصمم لمساعدتك وفق مستواك الحالي (${userProfile.currentLevel}). اختر الوضع المناسب واكتب استفسارك أو اختر من الاقتراحات السريعة بالأسفل!`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      mode: 'grammar-teacher',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    playSound('click');

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await sendAiTutorMessage({
        message: text.trim(),
        mode: activeMode,
        userLevel: userProfile.currentLevel,
        history: messages,
      });

      const assistantMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
        grammarCorrections: response.corrections,
      };

      setMessages(prev => [...prev, assistantMsg]);
      playSound('fanfare');
    } catch {
      // Graceful error state
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          content: 'عذراً، حدث خطأ مؤقت في الاتصال. يرجى المحاولة مرة أخرى.',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          mode: activeMode,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    playSound('click');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        content: `تم بدء جلسة جديدة بنجاح في وضع: ${MODES.find(m => m.id === activeMode)?.titleAr}. تفضل بطرح سؤالك!`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
      },
    ]);
  };

  return (
    <div className="space-y-8 pb-16 text-right max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-10 bg-gradient-to-br from-[#171632] via-[#0c0b20] to-[#1a1438] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30">
              <Bot className="w-4 h-4" />
              <span>HINAWI AI TUTOR AGENT • المعلم الذكي الشخصي</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">المعلم الإنجليزي الذكي AI 🦅</h1>
            <p className="text-xs sm:text-sm text-[#dedbf4]">
              اسأل في أي قاعدة، صحح كتاباتك، مارس المحادثة الحية، أو تدرب على مقابلات العمل باللغة الإنجليزية في أي وقت.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleClearHistory}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#b9b6d5] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              title="بدء جلسة جديدة ومسح سجل الحوار"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>جلسة جديدة</span>
            </button>
          </div>
        </div>
      </section>

      {/* Mode Selector Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#b9b6d5]">
          <span>اختر تخصص المعلم الذكي:</span>
          <span className="text-[#ffd166]">مستواك: {userProfile.currentLevel}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {MODES.map(mode => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => {
                  playSound('click');
                  setActiveMode(mode.id);
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-b from-[#ffd166]/20 to-[#41e7ff]/20 border-[#ffd166] text-white shadow-lg'
                    : 'glass-panel border-white/10 text-[#b9b6d5] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#ffd166]' : 'text-[#b9b6d5]'}`} />
                <span className="text-xs font-bold leading-tight">{mode.titleAr.split(' ')[0]} {mode.titleAr.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Mode Description Box */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-[#dedbf4]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#41e7ff] shrink-0" />
          <span>{MODES.find(m => m.id === activeMode)?.desc}</span>
        </div>
        <span className="text-[10px] text-[#ffd166] font-mono font-bold uppercase hidden sm:inline">
          {MODES.find(m => m.id === activeMode)?.titleEn}
        </span>
      </div>

      {/* Main Chat Stream Container */}
      <section className="glass-panel rounded-3xl border border-white/15 overflow-hidden flex flex-col h-[560px] shadow-2xl">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              {msg.sender === 'user' ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-9 h-9 rounded-xl object-cover border border-[#41e7ff]/40 shrink-0 mt-1"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ffd166] to-[#ff9c66] flex items-center justify-center font-black text-[#0c0b20] text-sm shrink-0 mt-1 shadow-md">
                  🦅
                </div>
              )}

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 rounded-2xl space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#41e7ff]/20 to-[#ffd166]/10 border border-[#41e7ff]/30 text-white rounded-tr-none'
                    : 'bg-[#171632] border border-white/15 text-white rounded-tl-none shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] text-[#b9b6d5] pb-1 border-b border-white/10">
                  <span className="font-bold">{msg.sender === 'user' ? userProfile.nameAr : 'معلم هناوي الذكي'}</span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => {
                          playSound('click');
                          speakEnglish(msg.content);
                        }}
                        className="p-1 rounded hover:bg-white/10 text-[#ffd166] cursor-pointer"
                        title="استمع للنطق الصوتي"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Grammar Corrections if any */}
                {msg.grammarCorrections && msg.grammarCorrections.length > 0 && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2 mt-2">
                    <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      التصويبات النحوية المقترحة:
                    </span>
                    {msg.grammarCorrections.map((corr, idx) => (
                      <div key={idx} className="text-xs space-y-0.5">
                        <div className="line-through text-red-300 font-mono">❌ {corr.wrong}</div>
                        <div className="text-emerald-300 font-mono font-bold">✅ {corr.correct}</div>
                        <div className="text-[#dedbf4] text-[11px]">{corr.explanationAr}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ffd166] to-[#ff9c66] flex items-center justify-center font-black text-[#0c0b20] text-sm shrink-0">
                🦅
              </div>
              <div className="p-4 rounded-2xl bg-[#171632] border border-white/15 flex items-center gap-2">
                <span className="text-xs text-[#ffd166] font-bold">جاري كتابة الرد الأكاديمي...</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffd166] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#41e7ff] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff4f9a] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 sm:p-3 bg-black/40 border-t border-white/10 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <span className="text-[10px] font-bold text-[#b9b6d5] shrink-0">اقتراحات سريعة:</span>
          {SUGGESTIONS[activeMode]?.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug)}
              className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-[#ffd166] hover:text-white transition-all cursor-pointer shrink-0 truncate max-w-xs"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#0c0b20] border-t border-white/15 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="اكتب سؤالك أو المحادثة هنا بالإنجليزية أو العربي..."
            className="flex-1 px-4 py-3 rounded-2xl bg-[#171632] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ffd166] transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className="p-3 rounded-2xl bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer shrink-0 shadow-lg"
            aria-label="إرسال الرسالة"
          >
            <Send className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </section>

    </div>
  );
};
