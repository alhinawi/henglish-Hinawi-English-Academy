import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { playSound, fireCelebration } from '../../utils/audio';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface ResetPasswordPageProps {
  onNavigate: (route: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const isPasswordValid = hasMinLength && hasNumber && hasLetter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!isPasswordValid) {
      setFeedback({ type: 'error', text: 'يجب أن تتكون كلمة المرور من 8 أحرف وأرقام على الأقل.' });
      return;
    }
    if (password !== confirmPassword) {
      setFeedback({ type: 'error', text: 'كلمتا المرور غير متطابقتين.' });
      return;
    }

    setIsSubmitting(true);
    const res = await resetPassword(password);
    setIsSubmitting(false);

    if (res.success) {
      playSound('correct');
      fireCelebration();
      setFeedback({ type: 'success', text: 'تم تحديث كلمة المرور بنجاح! جاري تحويلك لتسجيل الدخول...' });
      setTimeout(() => {
        onNavigate('login');
      }, 1500);
    } else {
      playSound('wrong');
      setFeedback({ type: 'error', text: res.error || 'فشل تحديث كلمة المرور. قد يكون الرابط منتهي الصلاحية.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100 relative overflow-hidden" dir="rtl">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-5">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">تعيين كلمة مرور جديدة</h2>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          أدخل كلمة مرور قوية وجديدة لحسابك في أكاديمية هناوي.
        </p>

        {feedback && (
          <div className={`mb-6 p-3.5 rounded-xl text-xs flex items-center justify-center gap-2 ${
            feedback.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 أحرف وأرقام"
                className="w-full pr-11 pl-11 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                dir="ltr"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                className="w-full pr-11 pl-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                dir="ltr"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>حفظ كلمة المرور الجديدة</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

