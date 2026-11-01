import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { playSound, fireCelebration } from '../../utils/audio';
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (route: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password Strength Calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const isPasswordValid = hasMinLength && hasNumber && hasLetter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('يرجى إدخال اسمك الكامل بشكل صحيح.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }
    if (!isPasswordValid) {
      setErrorMessage('كلمة المرور يجب ألا تقل عن 8 خانات وتحتوي على أحرف وأرقام.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية.');
      return;
    }

    const res = await register({
      email,
      password,
      fullName,
      username: username.trim() || undefined,
      phone: phone.trim() || undefined,
      role: 'student',
    });

    if (res.success) {
      playSound('correct');
      fireCelebration();
      // Redirect to email verification instruction
      onNavigate(`verify-email?email=${encodeURIComponent(email)}`);
    } else {
      setErrorMessage(res.error || 'حدث خطأ أثناء إنشاء الحساب. قد يكون البريد مسجلاً مسبقاً.');
      playSound('wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100 relative overflow-hidden" dir="rtl">
      {/* Background decorative glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Register Card */}
      <div className="w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> إنشاء حساب جديد
            </h2>
            <p className="text-xs text-slate-400 mt-1">ابدأ رحلتك في احتراف الإنجليزية مع أكاديمية هناوي</p>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            لديك حساب بالفعل؟
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
              الاسم الكامل (بالعربية أو الإنجليزية) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أحمد محمد أو Ahmed Mohamed"
                className="w-full pr-11 pl-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                اسم المستخدم (اختياري)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ahmed99"
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                رقم الهاتف (اختياري)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 100 000 0000"
                  className="w-full pr-10 pl-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              البريد الإلكتروني <span className="text-red-400">*</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                كلمة المرور <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 أحرف وأرقام"
                  className="w-full pr-10 pl-10 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                تأكيد كلمة المرور <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full pr-10 pl-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                  dir="ltr"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password requirements indicators */}
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="text-[11px] font-medium text-slate-400 mb-1">شروط الأمان:</div>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3 h-3" /> 8+ أحرف
              </span>
              <span className={`flex items-center gap-1 ${hasLetter ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3 h-3" /> أحرف إنجليزية
              </span>
              <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3 h-3" /> أرقام
              </span>
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer pt-2 select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4 shrink-0"
              required
            />
            <span className="text-xs text-slate-400 leading-relaxed">
              أوافق على <span className="text-indigo-400 underline">شروط الاستخدام</span> و <span className="text-indigo-400 underline">سياسة الخصوصية</span> وتلقي إشعارات التقدّم التعليمي.
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>إنشاء الحساب والبدء</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

