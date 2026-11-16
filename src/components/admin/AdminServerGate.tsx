import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  LogOut,
  Users,
  Activity,
  Database,
  Globe,
  KeyRound,
  UserPlus,
  RefreshCw,
} from 'lucide-react';
import {
  apiAdminOverview,
  apiGetMe,
  apiLogout,
  getHenglishApiToken,
  clearHenglishApiToken,
  googleLoginUrl,
  AdminOverview,
} from '../../services/henglishApi';

type GateState = 'loading' | 'anon' | 'denied' | 'admin' | 'error';

const day = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'short' });
};

/**
 * Server-side admin gate for /admin. The API decides: no token -> anon sign-in view,
 * wrong account -> denied view, 3asfuur@gmail.com -> overview dashboard + admin tools.
 * No client-side role or email check is trusted.
 */
export const AdminServerGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gate, setGate] = useState<GateState>('loading');
  const [email, setEmail] = useState('');
  const [data, setData] = useState<AdminOverview | null>(null);

  const load = async () => {
    setGate('loading');
    const token = getHenglishApiToken();
    if (!token) {
      setGate('anon');
      return;
    }
    const { status, body } = await apiAdminOverview(token);
    if (status === 200 && body) {
      setData(body);
      setGate('admin');
      return;
    }
    if (status === 428) { setGate('anon'); return; }
    if (status === 403) {
      const me = await apiGetMe(token);
      setEmail(me?.user?.email || '');
      setGate('denied');
      return;
    }
    if (status === 401) { clearHenglishApiToken(); setGate('anon'); return; }
    setGate('error');
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // best effort
    }
    clearHenglishApiToken();
    window.location.hash = 'home';
    window.location.reload();
  };

  if (gate === 'loading') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center" dir="rtl">
        <RefreshCw className="w-6 h-6 text-white/40 animate-spin" />
      </div>
    );
  }

  if (gate === 'error') return <div role="alert" className="p-8 text-center space-y-4" dir="rtl"><p>مش قادرين نحمّل لوحة التحكم دلوقتي. جلستك لسه محفوظة.</p><button onClick={load} className="px-5 py-3 rounded-xl bg-white/10">حاول تاني</button></div>;

  if (gate === 'anon') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-[#ffd166]/10 border border-[#ffd166]/20 text-[#ffd166] flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">لوحة التحكم</h2>
        <p className="text-xs text-white/50 max-w-md mb-6 leading-relaxed">
          الصفحة دي للأدمن بس. ادخل بحساب Google المخصص للإدارة. لو عندك جلسة قديمة، سجّل دخولك من جديد لتأكيد الحساب.
        </p>
        <a
          href={googleLoginUrl()}
          className="px-6 py-3 rounded-2xl bg-white text-[#0c0b20] font-black text-sm flex items-center gap-2.5 hover:bg-white/90 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24z"/>
            <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1z"/>
            <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.87 8.87 4.76 12 4.76z"/>
          </svg>
          الدخول بحساب Google
        </a>
      </div>
    );
  }

  if (gate === 'denied') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">مش متاح للحساب ده</h2>
        <p className="text-xs text-white/50 max-w-md mb-6 leading-relaxed">
          الصفحة دي للأدمن بس. إنت داخل بحساب <span dir="ltr" className="text-white/70">{email}</span>.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4"><div className="space-y-2"><p className="text-[#ffd166] text-xs font-bold">HENGLISH ADMIN</p><h1 className="text-2xl sm:text-3xl font-black">لوحة تحكم الأدمن</h1><p className="text-xs text-[#b9b6d5]">بيانات مباشرة من الحسابات وسجلات التعلّم، مش أرقام تجريبية.</p></div><button onClick={load} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs"><RefreshCw className="w-4 h-4"/>تحديث</button></header>
      {/* Overview - same shape as the egypti admin dashboard */}
      {data && (
        <section className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-[#41e7ff]">
                <Users className="w-4 h-4" />
                <span className="text-[11px] font-bold text-white/50">حسابات</span>
              </div>
              <div className="text-3xl font-black text-white">{data.counts.users}</div>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-emerald-300">
                <UserPlus className="w-4 h-4" />
                <span className="text-[11px] font-bold text-white/50">جداد الأسبوع ده</span>
              </div>
              <div className="text-3xl font-black text-white">{data.counts.newUsers}</div>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-[#ffd166]">
                <Activity className="w-4 h-4" />
                <span className="text-[11px] font-bold text-white/50">جلسات نشطة</span>
              </div>
              <div className="text-3xl font-black text-white">{data.counts.sessions}</div>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-[#ff4f9a]">
                <Database className="w-4 h-4" />
                <span className="text-[11px] font-bold text-white/50">سجلات تقدم</span>
              </div>
              <div className="text-3xl font-black text-white">{data.counts.progress}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#41e7ff]" />
                آخر المسجّلين
              </h3>
              {data.recentUsers.length ? (
                <ul className="space-y-2">
                  {data.recentUsers.map((u, i) => (
                    <li key={i} className="flex items-center justify-between text-xs border-b border-white/5 pb-2 last:border-0">
                      <b className="text-white font-bold">{u.name}</b>
                      <span dir="ltr" className="text-white/40 font-mono text-[11px]">{u.email}</span>
                      <small className="text-white/30">{day(u.createdAt)}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-white/40">مفيش حسابات لسه.</p>
              )}
              <p className="text-[10px] text-white/30">الإيميلات مخفية جزئيًا.</p>
            </div>

            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-300" />
                صحة النظام
              </h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between">
                  <span className="text-white/60 flex items-center gap-2"><Database className="w-3.5 h-3.5" /> قاعدة البيانات (D1)</span>
                  <span className={data.health.database ? 'text-emerald-300 font-bold' : 'text-red-400 font-bold'}>{data.health.database ? 'شغالة' : 'في مشكلة'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-white/60 flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> تسجيل الدخول بجوجل</span>
                  <span className={data.health.google ? 'text-emerald-300 font-bold' : 'text-red-400 font-bold'}>{data.health.google ? 'متضبط' : 'ناقص إعداد'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-white/60 flex items-center gap-2"><KeyRound className="w-3.5 h-3.5" /> حسابات الأدمن</span>
                  <span className="text-white/80 font-bold">{data.health.adminCount} حساب</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-white/60 flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> عنوان الموقع</span>
                  <span dir="ltr" className="text-white/40 font-mono text-[11px]">{data.health.origin}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      <details className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 space-y-5"><summary className="cursor-pointer font-bold text-sm text-[#ffd166]">معاينة أدوات المحتوى المحلية</summary><p className="text-xs text-[#b9b6d5] leading-7">الأدوات القديمة دي مساحة معاينة. أرقام الطلاب وأسماء الطلاب داخلها تجريبية، والتعديلات فيها محلية ومش نشر للموقع ولا تغيير لحسابات الطلاب. البيانات الحقيقية موجودة فوق.</p>{children}</details>
    </div>
  );
};
