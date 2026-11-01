// ==============================================================================
// HENGLISH ACADEMY - ADMIN AI MANAGEMENT & MULTI-PROVIDER MONITOR
// Visual Health Dashboard, Fallback Analysis, Cost Metrics & Priority Router Control
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  RotateCcw,
  RefreshCw,
  Server,
  Cloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Layers,
  Database,
  Lock,
  Clock,
  Sparkles,
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export interface ProviderHealth {
  provider: 'groq' | 'gemini' | 'cloudflare' | 'openai' | 'local';
  isConfigured: boolean;
  isEnabled: boolean;
  isAvailable: boolean;
  inCooldown: boolean;
  cooldownRemainingSeconds: number;
  consecutiveFailures: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatencyMs: number;
  lastError?: string;
  lastUsedAt?: string;
}

export interface RouterConfig {
  providerPriority: ('groq' | 'gemini' | 'cloudflare' | 'openai' | 'local')[];
  enabledProviders: Record<string, boolean>;
  defaultTimeoutMs: number;
  cooldownPeriodMs: number;
  cacheEnabled: boolean;
  cacheTtlMs: number;
}

export interface UsageAnalyticsItem {
  id: string;
  timestamp: string;
  provider: string;
  model: string;
  taskType: string;
  durationMs: number;
  totalTokens: number;
  estimatedCostUsd: number;
  status: 'success' | 'fallback_recovered' | 'failed';
  fallbackChain: string[];
}

export const AdminAiManagementSection: React.FC = () => {
  const [providers, setProviders] = useState<ProviderHealth[]>([]);
  const [config, setConfig] = useState<RouterConfig | null>(null);
  const [analytics, setAnalytics] = useState<UsageAnalyticsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);

  const fetchHealthData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/admin/health');
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
        setConfig(data.config || null);
        setAnalytics(data.recentAnalytics || []);
      }
    } catch (err) {
      console.warn('Could not fetch AI admin health:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleProvider = async (providerName: string) => {
    if (!config) return;
    playSound('click');
    const updatedEnabled = {
      ...config.enabledProviders,
      [providerName]: !config.enabledProviders[providerName],
    };

    setIsSaving(true);
    try {
      const res = await fetch('/api/ai/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabledProviders: updatedEnabled }),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setProviders(data.providers);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleMovePriority = async (index: number, direction: 'up' | 'down') => {
    if (!config) return;
    playSound('click');
    const newPriority = [...config.providerPriority];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPriority.length) return;

    const temp = newPriority[index];
    newPriority[index] = newPriority[targetIndex];
    newPriority[targetIndex] = temp;

    setIsSaving(true);
    try {
      const res = await fetch('/api/ai/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerPriority: newPriority }),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setProviders(data.providers);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCache = async () => {
    playSound('click');
    try {
      const res = await fetch('/api/ai/admin/clear-cache', { method: 'POST' });
      if (res.ok) {
        setCacheMessage('تم تفريغ الذاكرة المؤقتة للـ AI بنجاح! ✅');
        setTimeout(() => setCacheMessage(null), 3000);
      }
    } catch {
      setCacheMessage('فشل تفريغ الذاكرة المؤقتة');
    }
  };

  // Provider display badges & descriptions
  const getProviderInfo = (name: string) => {
    switch (name) {
      case 'groq':
        return {
          title: 'Groq (LPUs)',
          role: 'المزود الأساسي (Primary)',
          desc: 'معالجة فائقة السرعة بنماذج Llama 3.3 70B و 3.1 8B.',
          color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400',
        };
      case 'gemini':
        return {
          title: 'Google Gemini',
          role: 'البديل الأول (First Fallback)',
          desc: 'قدرات استدلال وتحليل استثنائية بنماذج Gemini 2.5 / 1.5 Flash.',
          color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-cyan-400',
        };
      case 'cloudflare':
        return {
          title: 'Cloudflare Workers AI',
          role: 'البديل الثاني (Second Fallback)',
          desc: 'استدلال سحابي موزع على شبكة Cloudflare العالمية بدون خوادم.',
          color: 'from-amber-500/20 to-rose-500/20 border-amber-500/30 text-amber-300',
        };
      case 'openai':
        return {
          title: 'OpenAI (GPT-4o)',
          role: 'مزود إضافي اختياري (Optional)',
          desc: 'نماذج GPT-4o و GPT-4o-mini الموثوقة عالمياً.',
          color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300',
        };
      case 'local':
      default:
        return {
          title: 'Henglish Educational Brain',
          role: 'الاحتياطي التعليمي المضمون (Guaranteed)',
          desc: 'عقل تعليمي مصري متكامل من مناهج وبنوك الأكاديمية لا ينقطع أبداً.',
          color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300',
        };
    }
  };

  // Metric aggregates
  const totalCalls = providers.reduce((acc, p) => acc + p.totalRequests, 0);
  const totalSuccesses = providers.reduce((acc, p) => acc + p.successfulRequests, 0);
  const totalCost = analytics.reduce((acc, a) => acc + (a.estimatedCostUsd || 0), 0);
  const successRate = totalCalls > 0 ? Math.round((totalSuccesses / totalCalls) * 100) : 100;
  const avgLatency =
    totalCalls > 0
      ? Math.round(
          providers.reduce((acc, p) => acc + p.averageLatencyMs * p.totalRequests, 0) /
            totalCalls
        )
      : 0;

  return (
    <div className="space-y-8 text-right animate-in fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-linear-to-r from-[#171632] to-[#121124] border border-white/10 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/15 text-[#41e7ff] border border-[#41e7ff]/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>CENTRAL MULTI-PROVIDER AI ROUTER • معمارية الذكاء الاصطناعي الموحدة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Cairo',sans-serif]">
            إدارة مزودي الذكاء الاصطناعي والمراقبة السحابية 🤖
          </h2>
          <p className="text-xs text-[#b9b6d5] max-w-xl">
            نظام توجيه سحابي فائق الذكاء: Groq (الأساسي) ➔ Gemini (البديل الأول) ➔ Cloudflare (البديل الثاني) ➔ OpenAI ➔ Henglish Local Brain.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchHealthData}
            disabled={isLoading}
            className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>تحديث الحالة</span>
          </button>

          <button
            onClick={handleClearCache}
            className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[#ffd166] hover:text-rose-300 border border-white/10 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>مسح الذاكرة المؤقتة (Cache)</span>
          </button>
        </div>
      </div>

      {cacheMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center animate-in fade-in">
          {cacheMessage}
        </div>
      )}

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3 text-emerald-300 text-xs">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <p className="leading-relaxed">
          <strong>معيار الأمان العالي:</strong> جميع استدعاءات نماذج الـ AI ومفاتيح الـ API مؤمنة بنسبة 100% داخل الطبقة الخادمة (Server-Side). لا يتم كشف أو إرسال أي مفتاح سري للمتصفح.
        </p>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#171632] border border-white/10 space-y-1">
          <span className="text-[11px] text-[#b9b6d5] font-bold block">إجمالي الاستدعاءات</span>
          <span className="text-2xl font-black text-white font-['Outfit',sans-serif]">
            {totalCalls}
          </span>
          <span className="text-[10px] text-white/40 block">طلب معالج بالسيرفر</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#171632] border border-white/10 space-y-1">
          <span className="text-[11px] text-[#b9b6d5] font-bold block">معدل النجاح الإجمالي</span>
          <span className="text-2xl font-black text-[#c4ff55] font-['Outfit',sans-serif]">
            {successRate}%
          </span>
          <span className="text-[10px] text-white/40 block">مع معالجة البدائل التلقائية</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#171632] border border-white/10 space-y-1">
          <span className="text-[11px] text-[#b9b6d5] font-bold block">متوسط سرعة الاستجابة</span>
          <span className="text-2xl font-black text-[#41e7ff] font-['Outfit',sans-serif]">
            {avgLatency} ms
          </span>
          <span className="text-[10px] text-white/40 block">شاملاً كافة المزودين</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#171632] border border-white/10 space-y-1">
          <span className="text-[11px] text-[#b9b6d5] font-bold block">التكلفة التقديرية</span>
          <span className="text-2xl font-black text-[#ffd166] font-['Outfit',sans-serif]">
            ${totalCost.toFixed(5)}
          </span>
          <span className="text-[10px] text-white/40 block">مبنية على استهلاك التوكنات</span>
        </div>
      </div>

      {/* Provider Health & Status Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#41e7ff]" />
          <span>حالة المزودين ونماذج التشغيل (Provider Health & Capabilities)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map(p => {
            const info = getProviderInfo(p.provider);
            const isOperational = p.isConfigured && p.isEnabled && !p.inCooldown;

            return (
              <div
                key={p.provider}
                className="p-5 rounded-3xl bg-[#171632] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white">
                      {info.role}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isOperational ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> متاح وجاهز
                        </span>
                      ) : p.inCooldown ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" /> تهدئة ({p.cooldownRemainingSeconds}s)
                        </span>
                      ) : !p.isConfigured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          بانتظار المفتاح 🔑
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" /> معطل
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-white">{info.title}</h4>
                    <p className="text-xs text-[#b9b6d5] leading-relaxed mt-1">{info.desc}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[10px] text-white/50 block">الطلبات</span>
                      <strong className="text-white font-['Outfit',sans-serif]">{p.totalRequests}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[10px] text-white/50 block">النجاح</span>
                      <strong className="text-emerald-400 font-['Outfit',sans-serif]">
                        {p.successfulRequests}
                      </strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[10px] text-white/50 block">السرعة</span>
                      <strong className="text-[#41e7ff] font-['Outfit',sans-serif]">
                        {p.averageLatencyMs}ms
                      </strong>
                    </div>
                  </div>

                  {p.lastError && (
                    <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300 leading-normal">
                      ⚠️ {p.lastError}
                    </div>
                  )}

                  {p.provider !== 'local' && (
                    <button
                      onClick={() => handleToggleProvider(p.provider)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                        p.isEnabled
                          ? 'bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-300 border-white/10'
                          : 'bg-[#41e7ff]/20 text-[#41e7ff] border-[#41e7ff]/30 hover:bg-[#41e7ff]/30'
                      }`}
                    >
                      {p.isEnabled ? 'تعطيل مؤقت' : 'تفعيل المزود'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Ordering List */}
      {config && (
        <div className="p-6 rounded-3xl bg-[#171632] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ffd166]" />
                <span>أولوية التوجيه التلقائي (Automatic Fallback Priority Queue)</span>
              </h3>
              <p className="text-xs text-[#b9b6d5] mt-0.5">
                في حال تعطل المزود أو تجاوزه للحد الأقصى (Rate Limit)، ينتقل المحرك تلقائياً للمزود التالي في القائمة دون انقطاع الخدمة عن الطالب.
              </p>
            </div>
            {isSaving && <span className="text-xs text-[#41e7ff] animate-pulse">جاري الحفظ...</span>}
          </div>

          <div className="space-y-2 pt-2">
            {config.providerPriority.map((provKey, index) => {
              const info = getProviderInfo(provKey);
              return (
                <div
                  key={provKey}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-black text-[#ffd166]">
                      {index + 1}
                    </span>
                    <div>
                      <strong className="text-white text-sm">{info.title}</strong>
                      <span className="text-[11px] text-[#b9b6d5] mr-2">({info.role})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMovePriority(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="رفع الأولوية"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMovePriority(index, 'down')}
                      disabled={index === config.providerPriority.length - 1}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="خفض الأولوية"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Usage Log Table */}
      <div className="p-6 rounded-3xl bg-[#171632] border border-white/10 space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#c4ff55]" />
          <span>سجل العمليات والاستدعاءات الحديثة (Recent Invocations Audit Log)</span>
        </h3>

        {analytics.length === 0 ? (
          <div className="py-8 text-center text-xs text-white/40">
            لا توجد استدعاءات مسجلة بعد في هذه الجلسة.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-white/10 text-[#b9b6d5]">
                  <th className="py-2.5 px-3">الوقت</th>
                  <th className="py-2.5 px-3">نوع المهمة (Task)</th>
                  <th className="py-2.5 px-3">المزود النهائي</th>
                  <th className="py-2.5 px-3">النموذج</th>
                  <th className="py-2.5 px-3">الزمن</th>
                  <th className="py-2.5 px-3">سلسلة البدائل</th>
                  <th className="py-2.5 px-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {analytics.slice(0, 15).map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 text-white/50 font-['Outfit',sans-serif]">
                      {new Date(item.timestamp).toLocaleTimeString('ar-EG')}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">{item.taskType}</td>
                    <td className="py-2.5 px-3 font-black text-[#ffd166]">{item.provider}</td>
                    <td className="py-2.5 px-3 font-['Outfit',sans-serif] text-xs text-[#b9b6d5]">
                      {item.model}
                    </td>
                    <td className="py-2.5 px-3 font-['Outfit',sans-serif]">{item.durationMs}ms</td>
                    <td className="py-2.5 px-3 text-white/60">
                      {item.fallbackChain.join(' ➔ ')}
                    </td>
                    <td className="py-2.5 px-3">
                      {item.status === 'success' ? (
                        <span className="text-emerald-400 font-bold">ناجح ✅</span>
                      ) : (
                        <span className="text-amber-400 font-bold">بديل تعويضي ⚡</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
