// ==============================================================================
// Henglish Academy (HENGLISH) - IN-STUDIO SMART TRANSLATION ASSISTANT
// Real-time AI linguistic co-pilot with quick prompt chips and context awareness
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { AssistantChatMessage } from '../../types/translation';
import { askTranslationAssistant } from '../../services/translationService';
import { playSound } from '../../utils/audio';
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  CornerDownLeft,
} from 'lucide-react';

interface SmartAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  mode: string;
}

const QUICK_PROMPTS = [
  'لماذا تم اختيار هذه الترجمة بالتحديد؟',
  'اجعل الجملة تبدو أكثر طبيعية بين المتحدثين الأصليين.',
  'صغ هذه الجملة لتناسب رسالة بريد إلكتروني رسمية (Corporate Email).',
  'أعطني 5 تعبيرات وبدائل لغوية أخرى لنفس المعنى.',
  'اشرح التعبير الاصطلاحي والقواعد في هذه الجملة.',
  'هل الجملة صحيحة قواعدياً بنسبة 100%؟',
  'بسّط هذه الجملة لمستوى مبتدئ A2.',
];

export const SmartAssistantDrawer: React.FC<SmartAssistantDrawerProps> = ({
  isOpen,
  onClose,
  originalText,
  translatedText,
  sourceLang,
  targetLang,
  mode,
}) => {
  const [messages, setMessages] = useState<AssistantChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: `أهلاً بك! أنا مساعد الترجمة اللغوي الذكي في أكاديمية هناوي 🦅. أنا متصل مباشرة بالترجمة الحالية ومستعد للإجابة عن أي استفسار حول الصياغة، النبرة، القواعد، أو تحويل الجملة لإيميل احترافي!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputValue).trim();
    if (!q || isLoading) return;

    playSound('click');
    const userMsg: AssistantChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await askTranslationAssistant(q, {
        originalText,
        translatedText,
        sourceLang,
        targetLang,
        mode,
      });

      const assistantMsg: AssistantChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: AssistantChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: 'عذراً، حدث خطأ مؤقت في الاتصال بمساعد الترجمة الذكي. تفضل بالمحاولة مجدداً.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-[450px] bg-[#0c0a21] border-r border-white/15 shadow-2xl z-50 flex flex-col text-right animate-in slide-in-from-left duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-[#b9b6d5] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex flex-col text-right">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>المساعد اللغوي للترجمة</span>
              <Sparkles className="w-3.5 h-3.5 text-[#ffb84d]" />
            </h3>
            <span className="text-[11px] text-[#41e7ff]">خبير سياقي متفاعل</span>
          </div>
          <div className="p-2 rounded-xl bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30">
            <Bot className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Context Pill Banner */}
      {originalText && (
        <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 text-xs text-[#b9b6d5]">
          <span className="text-white/60 block mb-0.5 text-[10px]">السياق النشط حالياً:</span>
          <p className="text-white font-medium truncate max-w-full">
            "{originalText}"
          </p>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#41e7ff] to-[#7c3aed] text-black font-semibold rounded-br-none shadow-md'
                  : 'bg-white/5 border border-white/10 text-white rounded-bl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <span
                className={`block text-[10px] mt-1.5 ${
                  msg.role === 'user' ? 'text-black/60 text-left' : 'text-[#b9b6d5]/50 text-right'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#41e7ff] p-3 rounded-2xl bg-white/5 border border-white/10 w-fit">
            <Sparkles className="w-4 h-4 animate-spin text-[#ffb84d]" />
            <span>المساعد يفكر في إجابة دقيقة لسؤالك...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 bg-black/30 border-t border-white/5">
        <span className="text-[10px] text-[#b9b6d5]/70 block mb-1.5 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-[#ffb84d]" />
          <span>أسئلة ومطالبات سريعة مقترحة:</span>
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#41e7ff]/20 hover:text-[#41e7ff] border border-white/10 text-slate-300 whitespace-nowrap transition-colors cursor-pointer disabled:opacity-40"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white/5 border-t border-white/10">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="اسأل المساعد عن أي تفصيلة في الترجمة..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#b9b6d5]/40 focus:outline-none focus:border-[#41e7ff]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#41e7ff] text-black font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
