import React, { useState, useEffect } from 'react';
import {
  AuthSessionState,
  signInUser,
  signUpUser,
} from '../services/authService';
import { apiGetAuthConfig, googleLoginUrl } from '../services/henglishApi';
import { playSound, fireCelebration } from '../utils/audio';
import {
  X,
  User,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Users,
  KeyRound,
  RotateCw,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionChange: (newSession: AuthSessionState) => void;
  initialTab?: 'login' | 'register' | 'demo' | 'migrate';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSessionChange,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(initialTab === 'register' ? 'register' : 'login');

  // Honor the requested tab every time the modal opens (it stays mounted between opens)
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab === 'register' ? 'register' : 'login');
      setFeedbackMsg(null);
    }
  }, [isOpen, initialTab]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Google sign-in appears only when the backend reports it is configured
  // (OAuth secrets set on the worker). Default hidden.
  const [googleEnabled, setGoogleEnabled] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    apiGetAuthConfig().then((cfg) => setGoogleEnabled(cfg.google));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    window.location.href = googleLoginUrl();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFeedbackMsg({ type: 'error', text: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signInUser(email, password);
      if (res.success && res.session) {
        playSound('correct');
        onSessionChange(res.session);
        onClose();
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.' });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'فشل تسجيل الدخول. يرجى التحقق من البيانات.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim() || password.length < 8) {
      setFeedbackMsg({ type: 'error', text: 'يرجى إدخال اسم صحيح وكلمة مرور من 8 خانات على الأقل.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUpUser({ email, password, fullName });
      if (res.success && res.session) {
        playSound('correct');
        fireCelebration();
        onSessionChange(res.session);
        onClose();
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'حدث خطأ أثناء إنشاء الحساب.' });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'حدث خطأ أثناء إنشاء الحساب.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setFeedbackMsg({ type: 'error', text: 'أدخل بريدك الإلكتروني لإرسال رابط الاستعادة.' });
      return;
    }
    setFeedbackMsg({ type: 'success', text: 'تم إرسال تعليمات إعادة ضبط كلمة المرور إلى بريدك بنجاح!' });
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-md rounded-3xl bg-[#171632] border border-white/20 p-6 sm:p-8 shadow-2xl text-right z-10 space-y-6"
        >
          {/* Header */}
          <div className="relative pb-5 border-b border-white/10">
            <button
              onClick={onClose}
              className="absolute top-0 left-0 p-2 rounded-xl text-[#b9b6d5] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffd166] to-[#ff9c66] p-0.5 shadow-lg shadow-[#ffd166]/20">
                <div className="w-full h-full bg-[#171632] rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-[#ffd166]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">بوابة Henglish Academy</h3>
                <p className="text-xs text-[#b9b6d5] mt-1">سجّل دخولك أو أنشئ حسابك المجاني</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-black/40 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('login');
                setFeedbackMsg(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'login' ? 'bg-[#ffd166] text-[#0c0b20] font-black shadow-md' : 'text-[#b9b6d5] hover:text-white'
              }`}
            >
              دخول
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setFeedbackMsg(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'register' ? 'bg-[#ffd166] text-[#0c0b20] font-black shadow-md' : 'text-[#b9b6d5] hover:text-white'
              }`}
            >
              تسجيل
            </button>
          </div>

          {/* Google sign-in: only rendered once the worker confirms OAuth is configured */}
          {googleEnabled && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41.4 35.1 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"/>
                </svg>
                <span>المتابعة بحساب Google</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/15"></div>
                <span className="text-xs font-bold text-[#b9b6d5]">أو بالإيميل</span>
                <div className="flex-1 h-px bg-white/15"></div>
              </div>
            </div>
          )}

          {/* Feedback Alert if any */}
          {feedbackMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
                  : 'bg-red-500/20 border border-red-500/40 text-red-200'
              }`}
            >
              {feedbackMsg.text}
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#dedbf4]">البريد الإلكتروني:</label>
                <div className="relative">
                  <input
                    type="email"
                    dir="ltr"
                    lang="en"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="english-input w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-[#ffd166]"
                  />
                  <Mail className="w-4 h-4 text-[#b9b6d5] absolute right-3 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-[#dedbf4]">كلمة المرور:</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[#41e7ff] hover:underline cursor-pointer"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    dir="ltr"
                    lang="en"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="english-input w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-[#ffd166]"
                  />
                  <Lock className="w-4 h-4 text-[#b9b6d5] absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all"
              >
                {isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول الآن'}
              </button>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#dedbf4]">الاسم الكامل:</label>
                <div className="relative">
                  <input
                    type="text"
                    dir="auto"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="مثال: أحمد عبد الله"
                    required
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffd166]"
                  />
                  <User className="w-4 h-4 text-[#b9b6d5] absolute right-3 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#dedbf4]">البريد الإلكتروني:</label>
                <div className="relative">
                  <input
                    type="email"
                    dir="ltr"
                    lang="en"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    required
                    className="english-input w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-[#ffd166]"
                  />
                  <Mail className="w-4 h-4 text-[#b9b6d5] absolute right-3 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#dedbf4]">كلمة المرور (8 خانات على الأقل):</label>
                <div className="relative">
                  <input
                    type="password"
                    dir="ltr"
                    lang="en"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="english-input w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-[#ffd166]"
                  />
                  <Lock className="w-4 h-4 text-[#b9b6d5] absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all"
              >
                {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد مجاناً'}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-[#b9b6d5]">
                أدخل بريدك الإلكتروني وسنرسل لك رابطاً مشفراً لتعيين كلمة مرور جديدة لحسابك.
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#dedbf4]">البريد الإلكتروني:</label>
                <input
                  type="email"
                  dir="ltr"
                  lang="en"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  className="english-input w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-[#ffd166]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#41e7ff] text-[#0c0b20] font-black text-xs hover:brightness-110 cursor-pointer"
              >
                إرسال رابط الاستعادة
              </button>
            </form>
          )}

          {/* 4. DEMO ACCOUNTS SWITCHER */}
          </motion.div>
      </div>
    </AnimatePresence>
  );
};
