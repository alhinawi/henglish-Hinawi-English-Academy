import React, { useState } from 'react';
import { 
  AuthSessionState, 
  signInUser, 
  signUpUser, 
  switchDemoAccount, 
  switchGuestMode, 
  migrateGuestProgressToAccount 
} from '../services/authService';
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
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'demo' | 'migrate'>(initialTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFeedbackMsg({ type: 'error', text: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await signInUser(email);
      playSound('correct');
      onSessionChange(session);
      onClose();
    } catch {
      setFeedbackMsg({ type: 'error', text: 'فشل تسجيل الدخول. يرجى التحقق من البيانات.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim() || password.length < 6) {
      setFeedbackMsg({ type: 'error', text: 'يرجى إدخال اسم صحيح وكلمة مرور من 6 خانات على الأقل.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await signUpUser(email, fullName);
      playSound('correct');
      fireCelebration();
      onSessionChange(session);
      onClose();
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
    setFeedbackMsg({ type: 'success', text: 'تم إرسال تعليمات إعادة ضبط كلمة المرور إلى بريدك بنجاح! 📨' });
  };

  const handleSelectDemo = (role: 'student' | 'teacher') => {
    playSound('click');
    const session = switchDemoAccount(role);
    onSessionChange(session);
    onClose();
  };

  const handleMigrateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setFeedbackMsg({ type: 'error', text: 'يرجى إدخال الاسم والبريد لربط التقدم بحسابك الجديد.' });
      return;
    }

    const session = migrateGuestProgressToAccount(fullName, email);
    playSound('correct');
    fireCelebration();
    onSessionChange(session);
    onClose();
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
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#b9b6d5] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ffd166] to-[#ff9c66] flex items-center justify-center font-black text-[#0c0b20] text-lg shadow-md">
                🦅
              </div>
              <div>
                <h3 className="text-lg font-black text-white">بوابة أكاديمية هناوي</h3>
                <p className="text-xs text-[#b9b6d5]">إدارة الحسابات ووضع الزائر والـ Demo</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 rounded-2xl border border-white/10 text-xs font-bold">
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
            <button
              onClick={() => {
                setActiveTab('demo');
                setFeedbackMsg(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'demo' ? 'bg-[#41e7ff] text-[#0c0b20] font-black shadow-md' : 'text-[#b9b6d5] hover:text-white'
              }`}
            >
              Demo
            </button>
            <button
              onClick={() => {
                setActiveTab('migrate');
                setFeedbackMsg(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'migrate' ? 'bg-[#c4ff55] text-[#0c0b20] font-black shadow-md' : 'text-[#b9b6d5] hover:text-white'
              }`}
            >
              حفظ الزائر
            </button>
          </div>

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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all"
              >
                {isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول الآن ⚡'}
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
                <label className="text-xs font-bold text-[#dedbf4]">كلمة المرور (6 خانات على الأقل):</label>
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all"
              >
                {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد مجاناً 🚀'}
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
          {activeTab === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-[#b9b6d5]">
                استكشف المنصة بحسابات تجريبية مهيأة مسبقاً بنقرة واحدة:
              </p>

              <button
                type="button"
                onClick={() => handleSelectDemo('student')}
                className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-right flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="text-sm font-black text-white group-hover:text-[#ffd166]">
                    سارة عبد الرحمن (حساب طالب B1) 🎓
                  </div>
                  <div className="text-xs text-[#b9b6d5]">
                    3,450 XP • استمرارية 14 يوماً • مسار المستقبل التام
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-[#ffd166]" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemo('teacher')}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#ffd166]/10 to-[#41e7ff]/10 hover:brightness-110 border border-[#ffd166]/30 text-right flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="text-sm font-black text-[#ffd166]">
                    أ. هناوي (حساب المعلم واستوديو المحتوى) 👨‍🏫
                  </div>
                  <div className="text-xs text-[#b9b6d5]">
                    صلاحيات كاملة • إدارة الدروس والأسئلة • لوحة المعلم
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-[#ffd166]" />
              </button>
            </div>
          )}

          {/* 5. MIGRATE GUEST PROGRESS */}
          {activeTab === 'migrate' && (
            <form onSubmit={handleMigrateGuest} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#c4ff55]/10 border border-[#c4ff55]/30 text-xs text-[#c4ff55] leading-relaxed">
                هل بدأت كزائر وترغب بحفظ إنجازاتك ونقاطك وشهاداتك دون فقدان أي بيانات؟ أدخل بياناتك لإنشاء حساب ونقل تقدمك فوراً!
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#dedbf4]">الاسم الكامل:</label>
                <input
                  type="text"
                  dir="auto"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="اسمك لحفظ الشهادات"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#c4ff55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#dedbf4]">البريد الإلكتروني:</label>
                <input
                  type="email"
                  dir="ltr"
                  lang="en"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  required
                  className="english-input w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-[#c4ff55]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c4ff55] to-[#41e7ff] text-[#0c0b20] font-black text-xs hover:brightness-110 shadow-lg cursor-pointer"
              >
                حفظ وترحيل تقدم الزائر لحساب دائم 🎉
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
