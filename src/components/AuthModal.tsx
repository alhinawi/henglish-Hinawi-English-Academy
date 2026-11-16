import React, { useState, useEffect } from 'react';
import {
  AuthSessionState,
  signInUser,
  signUpUser,
} from '../services/authService';
import { GoogleSignInBlock } from './GoogleSignInBlock';
import { useLanguage } from '../i18n/LanguageContext';
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
  initialTab?: 'login' | 'register' | 'migrate';
}

export const AuthModal: React.FC<AuthModalProps> = (props) => {
  const { t, dir } = useLanguage();
  const {
    isOpen,
    onClose,
    onSessionChange,
    initialTab = 'login',
  } = props;
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
  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFeedbackMsg({ type: 'error', text: t('am.errCreds') });
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
        setFeedbackMsg({ type: 'error', text: res.error || t('am.errLogin') });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: t('am.errLogin') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim() || password.length < 8) {
      setFeedbackMsg({ type: 'error', text: t('am.errSignup') });
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
        setFeedbackMsg({ type: 'error', text: res.error || t('am.errCreate') });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: t('am.errCreate') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setFeedbackMsg({ type: 'error', text: t('am.errResetEmail') });
      return;
    }
    setFeedbackMsg({ type: 'success', text: t('am.okReset') });
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
          dir={dir}
          className="relative w-full max-w-md rounded-3xl bg-[#171632] border border-white/20 p-6 sm:p-8 shadow-2xl text-start z-10 space-y-6"
        >
          {/* Header */}
          <div className="relative pb-5 border-b border-white/10">
            <button
              onClick={onClose}
              className="absolute top-0 left-0 p-2 rounded-xl text-[#b9b6d5] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label={t('am.closeAria')}
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
                <h3 className="text-lg font-black text-white">{t('am.gateTitle')}</h3>
                <p className="text-xs text-[#b9b6d5] mt-1">{t('am.gateSub')}</p>
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
              {t('am.tabLogin')}
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
              {t('am.tabSignup')}
            </button>
          </div>

          {/* Google sign-in: only rendered once the worker confirms OAuth is configured */}
          <GoogleSignInBlock />

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
                <label className="text-xs font-bold text-[#dedbf4]">{t('am.emailLabel')}</label>
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
                  <label className="font-bold text-[#dedbf4]">{t('am.passwordLabel')}</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[#41e7ff] hover:underline cursor-pointer"
                  >
                    {t('am.forgot')}
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
                {isSubmitting ? t('am.checking') : t('am.loginNow')}
              </button>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#dedbf4]">{t('am.nameLabel')}</label>
                <div className="relative">
                  <input
                    type="text"
                    dir="auto"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder={t('am.namePlaceholder')}
                    required
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffd166]"
                  />
                  <User className="w-4 h-4 text-[#b9b6d5] absolute right-3 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#dedbf4]">{t('am.emailLabel')}</label>
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
                <label className="text-xs font-bold text-[#dedbf4]">{t('am.passwordHintLabel')}</label>
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
                {isSubmitting ? t('am.creating') : t('am.createFree')}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-[#b9b6d5]">
                {t('am.resetBody')}
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#dedbf4]">{t('am.emailLabel')}</label>
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
                {t('am.sendReset')}
              </button>
            </form>
          )}

          {/* 4. DEMO ACCOUNTS SWITCHER */}
          </motion.div>
      </div>
    </AnimatePresence>
  );
};
