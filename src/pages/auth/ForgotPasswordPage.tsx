import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audio';
import {
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft
} from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (route: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setFeedback({ type: 'error', text: 'يرجى إدخال عنوان بريد إلكتروني صالح.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const res = await forgotPassword(email);
    setIsSubmitting(false);

    if (res.success) {
      playSound('correct');
      setIsSubmitted(true);
    } else {
      setFeedback({ type: 'error', text: res.error || 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100 relative overflow-hidden" dir="rtl">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-5">
          <KeyRound className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">استعادة كلمة المرور</h2>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          أدخل عنوان بريدك الإلكتروني المسجل وسنرسل لك رابطاً مشفراً لإعادة ضبط كلمة المرور بأمان.
        </p>

        {isSubmitted ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <span>تم إرسال رابط استعادة كلمة المرور إلى <strong>{email}</strong>. يرجى تفقد صندوق الوارد أو البريد غير المرغوب فيه (Spam).</span>
            </div>

            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>العودة لصفحة تسجيل الدخول</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            {feedback && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feedback.text}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                البريد الإلكتروني المسجل
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pr-11 pl-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>إرسال رابط الاستعادة</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                تذكرت كلمة المرور؟ تسجيل الدخول
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

