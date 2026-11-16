// ==============================================================================
// HENGLISH ACADEMY - ADMIN CLOUD TTS MANAGEMENT & TELEMETRY SECTION
// Real-time Health, Fallback Chain Tracking, Quota & Commercial Licensing Checks
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Database,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';

export interface TtsProviderTelemetry {
  id: 'elevenlabs' | 'deepgram' | 'cartesia' | 'browser';
  name: string;
  role: 'primary' | 'fallback_1' | 'fallback_2' | 'final_fallback';
  status: 'healthy' | 'degraded' | 'disabled' | 'unconfigured';
  hasApiKey: boolean;
  totalRequests: number;
  successCount: number;
  failureCount: number;
  consecutiveFailures: number;
  averageLatencyMs: number;
  commercialLicenseStatus: 'licensed' | 'evaluation_only' | 'unrestricted';
  notes: string;
}

export interface TtsCacheTelemetry {
  size: number;
  hitRate: number;
}

export const AdminTtsManagementSection: React.FC = () => {
  const { t, dir } = useLanguage();
  const [providers, setProviders] = useState<TtsProviderTelemetry[]>([]);
  const [cacheStats, setCacheStats] = useState<TtsCacheTelemetry>({ size: 0, hitRate: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<boolean>(false);

  const fetchTtsHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tts/admin/health');
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
        setCacheStats(data.cache || { size: 0, hitRate: 0 });
        setLoadError(false);
      }
    } catch {
      // No fabricated telemetry: show an honest unavailable state instead.
      setProviders([]);
      setCacheStats({ size: 0, hitRate: 0 });
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTtsHealth();
  }, []);

  const handleClearCache = async () => {
    playSound('click');
    try {
      const res = await fetch('/api/tts/admin/clear-cache', { method: 'POST' });
      if (res.ok) {
        setCacheStats({ size: 0, hitRate: 0 });
        setFeedback(t('tts.clearedAudio'));
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      setCacheStats({ size: 0, hitRate: 0 });
      setFeedback(t('tts.clearedCache'));
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-6 text-right" dir={dir}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-400" />
            <span>{t('tts.title')}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t('tts.chain')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTtsHealth}
            disabled={isLoading}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t('tts.refresh')}</span>
          </button>

          <button
            onClick={handleClearCache}
            className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{t('tts.clearCache')} ({cacheStats.size})</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Licensing Alert Note */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">{t('tts.licensePolicy')}</div>
          <p className="text-slate-300 leading-relaxed">
            {t('tts.licenseBody')} (<code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">CARTESIA_COMMERCIAL_LICENSE=true</code>).
          </p>
        </div>
      </div>

      {/* Provider Status Cards */}
      {loadError && (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="text-slate-300 text-sm">{t('tts.healthUnavailable')}</p>
          <button
            onClick={fetchTtsHealth}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('tts.refresh')}</span>
          </button>
        </div>
      )}
      {!loadError && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map((p) => {
          const successRate = p.totalRequests > 0 ? Math.round((p.successCount / p.totalRequests) * 100) : 100;

          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border backdrop-blur-sm relative transition-all ${
                p.role === 'primary'
                  ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900/80 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Role Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    p.role === 'primary'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : p.role === 'fallback_1'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : p.role === 'fallback_2'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-slate-700/50 text-slate-300'
                  }`}
                >
                  {p.role === 'primary'
                    ? t('tts.rolePrimary')
                    : p.role === 'fallback_1'
                    ? t('tts.roleFallback1')
                    : p.role === 'fallback_2'
                    ? t('tts.roleFallback2')
                    : t('tts.roleBrowser')}
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  {p.status === 'healthy' && (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t('tts.statusHealthy')}
                    </span>
                  )}
                  {p.status === 'degraded' && (
                    <span className="flex items-center gap-1 text-amber-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" /> {t('tts.statusDegraded')}
                    </span>
                  )}
                  {p.status === 'disabled' && (
                    <span className="flex items-center gap-1 text-red-400 font-medium">
                      <XCircle className="w-3.5 h-3.5" /> {t('tts.statusDisabled')}
                    </span>
                  )}
                  {p.status === 'unconfigured' && (
                    <span className="text-slate-500 font-medium text-[11px]">
                      {t('tts.statusUnconfigured')}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-base font-extrabold text-white mb-1">{p.name}</div>
              <p className="text-[11px] text-slate-400 min-h-[32px] line-clamp-2 leading-relaxed mb-4">
                {p.notes}
              </p>

              {/* Metrics */}
              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>{t('tts.totalRequests')}</span>
                  <span className="font-mono font-bold text-white">{p.totalRequests}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>{t('tts.successRate')}</span>
                  <span className={`font-mono font-bold ${successRate >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {successRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>{t('tts.avgLatency')}</span>
                  <span className="font-mono text-cyan-400">{p.averageLatencyMs} ms</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>{t('tts.licenseStatus')}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    p.commercialLicenseStatus === 'licensed'
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : p.commercialLicenseStatus === 'evaluation_only'
                      ? 'bg-amber-500/10 text-amber-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {p.commercialLicenseStatus === 'licensed'
                      ? t('tts.licLicensed')
                      : p.commercialLicenseStatus === 'evaluation_only'
                      ? t('tts.licEval')
                      : t('tts.licOpen')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
