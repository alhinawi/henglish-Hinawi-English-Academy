import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { playSound, fireCelebration } from '../../utils/audio';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

interface VerifyEmailPageProps {
  onNavigate: (route: string) => void;
  defaultEmail?: string;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onNavigate, defaultEmail = '' }) => {
  const { verifyOtp, resendOtp, user } = useAuth();

  const [email, setEmail] = useState(defaultEmail || user?.email || '');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = code.join('');
    if (token.length !== 6) {
      setFeedback({ type: 'error', text: 'يرجى إدخال رمز التحقق المكون من 6 أرقام بالكامل.' });
      return;
    }

    setIsVerifying(true);
    setFeedback(null);

    const res = await verifyOtp(email, token);
    setIsVerifying(false);

    if (res.success) {
      playSound('correct');
      fireCelebration();
      setFeedback({ type: 'success', text: 'تم تأكيد بريدك الإلكتروني بنجاح! جاري تحويلك للأكاديمية...' });
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1500);
    } else {
      playSound('wrong');
      setFeedback({ type: 'error', text: res.error || 'رمز التحقق غير صحيح أو انتهت صلاحيته.' });
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(60);
    const res = await resendOtp(email);
    if (res.success) {
      setFeedback({ type: 'success', text: 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.' });
    } else {
      setFeedback({ type: 'error', text: res.error || 'فشل إعادة الإرسال. حاول لاحقاً.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100 relative overflow-hidden" dir="rtl">
      {/* Decorative Blur */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-5">
          <Mail className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">تأكيد البريد الإلكتروني</h2>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          أرسلنا رمز تحقق مكوناً من 6 أرقام إلى:
          <br />
          <span className="font-semibold text-cyan-300 dir-ltr inline-block mt-1">{email || 'بريدك الإلكتروني'}</span>
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

        <form onSubmit={handleVerify} className="space-y-6">
          {/* 6 Digit Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3" dir="ltr">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-white outline-none transition-all shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying || code.join('').length !== 6}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isVerifying ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>تأكيد الحساب ومتابعة التعلم</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>لم يصلك الرمز؟</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-cyan-400 font-semibold hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> إعادة الإرسال الآن
            </button>
          ) : (
            <span className="text-slate-500 font-mono">
              إعادة الإرسال خلال {countdown} ثانية
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="mt-4 text-xs text-slate-500 hover:text-slate-400 transition-colors inline-flex items-center gap-1"
        >
          <span>العودة لصفحة تسجيل الدخول</span>
        </button>
      </div>
    </div>
  );
};

