import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isProductionEnv } from '../../services/authService';
import { playSound, fireCelebration } from '../../utils/audio';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, continueAsGuest, loginDemoStudent, loginDemoTeacher, loginDemoAdmin, isLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني أو اسم المستخدم.');
      return;
    }
    if (!password) {
      setErrorMessage('يرجى إدخال كلمة المرور.');
      return;
    }

    const res = await login(identifier, password);
    if (res.success) {
      playSound('correct');
      onNavigate('dashboard');
    } else {
      setErrorMessage(res.error || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.');
      playSound('wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100 relative overflow-hidden" dir="rtl">
      {/* Background decorative glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/20 mb-4">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          أكاديمية <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">هناوي</span> للغة الإنجليزية
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          منصة تعليمية متكاملة مدعومة بالذكاء الاصطناعي والمحاكاة التفاعلية
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <LogIn className="w-5 h-5 text-indigo-400" /> تسجيل الدخول
            </h2>
            <p className="text-xs text-slate-400 mt-1">أدخل بيانات حسابك للمتابعة والوصول لمسارك التعليمي</p>
          </div>
          <button
            onClick={() => onNavigate('register')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            إنشاء حساب جديد
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              البريد الإلكتروني أو اسم المستخدم
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com أو username"
                className="w-full pr-11 pl-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                كلمة المرور
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-11 pl-11 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                dir="ltr"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs text-slate-400">تذكرني على هذا الجهاز</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* Guest Mode & Demo Accounts Section */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            أو جرب الأكاديمية بدون تسجيل
          </p>

          <button
            type="button"
            onClick={continueAsGuest}
            className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>المتابعة كزائر (Guest Mode)</span>
          </button>

          {!isProductionEnv() && (
            <div className="pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-semibold text-amber-400">وضع التطوير المحلي (Dev Only)</span>
                <span className="text-[10px] text-slate-500">معزول بدون صلاحيات إنتاجية</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={loginDemoStudent}
                  className="py-2.5 px-3 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 rounded-xl text-xs font-medium text-indigo-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>طالب تجريبي</span>
                </button>

                <button
                  type="button"
                  onClick={loginDemoTeacher}
                  className="py-2.5 px-3 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 rounded-xl text-xs font-medium text-purple-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>معلّم تجريبي</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-8 text-center text-xs text-slate-500">
        جميع الحقوق محفوظة © {new Date().getFullYear()} أكاديمية هناوي للغة الإنجليزية
      </div>
    </div>
  );
};

