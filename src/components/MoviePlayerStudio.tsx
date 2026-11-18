import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ChevronRight, ExternalLink, Languages, Pause, Play, Repeat, RotateCcw, Settings, Gauge } from 'lucide-react';
import type { MovieSceneItem } from '../data/movieScenesData';
import { applyMovieTranscriptCorrections } from '../data/movieTranscriptCorrections';
import { movieSourceSummaries } from '../data/movieSourceSummaries';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { useLanguage } from '../i18n/LanguageContext';
import { activeSubtitleAt } from '../utils/movieTimeline';
import './movieStudio.css';

declare global { interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void; } }
let apiPromise: Promise<any> | null = null;
function loadYouTubeApi(): Promise<any> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const script = document.createElement('script');
    let settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      if (window.onYouTubeIframeAPIReady === onReady) window.onYouTubeIframeAPIReady = previous;
    };
    const fail = () => {
      if (settled) return;
      settled = true; cleanup(); script.remove(); apiPromise = null;
      reject(new Error('Player could not load'));
    };
    const onReady = () => {
      if (settled) return;
      if (!window.YT?.Player) { fail(); return; }
      settled = true; cleanup();
      try { previous?.(); } finally { resolve(window.YT); }
    };
    const timer = window.setTimeout(fail, 15000);
    window.onYouTubeIframeAPIReady = onReady;
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return apiPromise;
}
const timeLabel = (seconds: number) => {
  const t = Math.max(0, seconds);
  return `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
};
interface MoviePlayerStudioProps { scene: MovieSceneItem; onBackToSearch?: () => void; }

export const MoviePlayerStudio: React.FC<MoviePlayerStudioProps> = ({ scene: originalScene, onBackToSearch }) => {
  const { t, lang } = useLanguage();
  const scene = useMemo(() => applyMovieTranscriptCorrections(originalScene), [originalScene]);
  const unavailable = scene.transcriptTimingStatus === 'quarantined';
  const hasTranscript = scene.subtitles.length > 0;
  const hasFusha = scene.subtitles.some(sub => Boolean(sub.arFusha?.trim()));
  const reviewedTiming = scene.transcriptTimingStatus === 'caption-reviewed' || scene.transcriptTimingStatus === 'reviewed-excerpts';
  const start = scene.startTime;
  const end = scene.endTime;
  const appText = useAppTextMap('movieScenesData');
  const summaryText = useAppTextMap('movieSourceSummaries');
  const [currentTime, setCurrentTime] = useState(start);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [speedMenu, setSpeedMenu] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [holdEnabled, setHoldEnabled] = useState(() => {
    try { return localStorage.getItem('henglish_movie_hold_to_slow') !== 'off'; } catch { return true; }
  });
  const [temporaryRate, setTemporaryRate] = useState<number | null>(null);
  const [availableRates, setAvailableRates] = useState<number[]>([1]);
  const [fusha, setFusha] = useState(false);
  const [speed, setSpeed] = useState(1);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<any>(null);
  const list = useRef<HTMLDivElement>(null);
  const pending = useRef(start);
  const seekingUntil = useRef(0);
  const loopBounds = useRef<{ start: number; end: number } | null>(null);
  const holdTimer = useRef<number | null>(null);
  const holding = useRef(false);
  const holdRate = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const baseRate = useRef(1);
  const supportedRates = useRef<number[]>([1]);
  const lastCue = useRef<{ start: number; end: number }>({ start, end });
  const active = activeSubtitleAt(scene.subtitles, currentTime);

  if (active >= 0) lastCue.current = scene.subtitles[active];

  const finishHold = () => {
    if (holdTimer.current !== null) { clearTimeout(holdTimer.current); holdTimer.current = null; }
    if (holding.current) {
      holding.current = false; holdRate.current = null;
      player.current?.setPlaybackRate?.(baseRate.current);
      setTemporaryRate(null);
    }
  };
  const beginHold = () => {
    suppressClick.current = false;
    if (!holdEnabled || !ready || error || holding.current || holdTimer.current !== null) return;
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null;
      const slower = supportedRates.current.filter(rate => rate < baseRate.current);
      if (!slower.length) return;
      const rate = slower.includes(0.5) ? 0.5 : Math.max(...slower);
      holding.current = true; holdRate.current = rate; suppressClick.current = true;
      setSpeedMenu(false); setTemporaryRate(rate); player.current?.setPlaybackRate?.(rate);
    }, 350);
  };
  const chooseSpeed = (rate: number) => {
    finishHold(); baseRate.current = rate; setSpeed(rate); setSpeedMenu(false);
    player.current?.setPlaybackRate?.(rate);
  };
  useEffect(() => {
    const blur = () => finishHold();
    const hidden = () => { if (document.hidden) finishHold(); };
    window.addEventListener('blur', blur); document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('blur', blur); document.removeEventListener('visibilitychange', hidden);
      if (holdTimer.current !== null) clearTimeout(holdTimer.current);
      if (holding.current) player.current?.setPlaybackRate?.(baseRate.current);
      holdTimer.current = null; holding.current = false;
    };
  }, []);

  // Object loading preserves a decimal endSeconds on every app-controlled seek/replay.
  // Calling seekTo would clear YouTube's endSeconds, so it is deliberately not used.
  const loadClip = (at: number) => {
    const target = Math.max(start, Math.min(at, end - 0.01));
    pending.current = target;
    setCurrentTime(target); setEnded(false);
    if (player.current && ready) {
      seekingUntil.current = Date.now() + 4000;
      player.current.loadVideoById({ videoId: scene.youtubeId, startSeconds: target, endSeconds: loopBounds.current?.end ?? end });
      player.current.setPlaybackRate?.(holdRate.current ?? baseRate.current);
    }
  };

  useEffect(() => {
    if (unavailable) return;
    let cancelled = false;
    let readyTimeout: number | undefined;
    setReady(false); setError(false); setPlaying(false); setEnded(false); setRepeat(false); setSpeedMenu(false);
    loopBounds.current = null; finishHold(); lastCue.current = { start, end };
    setCurrentTime(start); pending.current = start;
    const enforceBounds = () => {
      const p = player.current;
      if (!p || typeof p.getCurrentTime !== 'function') return;
      const t = p.getCurrentTime();
      if (!Number.isFinite(t)) return;
      if (seekingUntil.current && Math.abs(t - pending.current) > 1 && Date.now() < seekingUntil.current) return;
      seekingUntil.current = 0;
      const boundary = loopBounds.current?.end ?? end;
      if (t >= boundary) {
        if (loopBounds.current) {
          const bounds = loopBounds.current;
          pending.current = bounds.start; seekingUntil.current = Date.now() + 4000;
          p.loadVideoById({ videoId: scene.youtubeId, startSeconds: bounds.start, endSeconds: bounds.end });
          p.setPlaybackRate?.(holdRate.current ?? baseRate.current); setCurrentTime(bounds.start); setEnded(false); return;
        }
        p.pauseVideo?.(); setCurrentTime(end); setPlaying(false); setEnded(true); return;
      }
      if (t < start - 0.1) {
        // Native timeline drags cannot turn the short scene into the full upload.
        p.pauseVideo?.(); p.cueVideoById?.({ videoId: scene.youtubeId, startSeconds: start, endSeconds: end });
        setCurrentTime(start); setPlaying(false); return;
      }
      setCurrentTime(t);
    };
    loadYouTubeApi().then(YT => {
      if (cancelled || !host.current) return;
      readyTimeout = window.setTimeout(() => {
        if (cancelled) return;
        setError(true); setPlaying(false);
      }, 15000);
      player.current = new YT.Player(host.current, {
        host: 'https://www.youtube-nocookie.com', width: '100%', height: '100%', videoId: scene.youtubeId,
        playerVars: { start: Math.floor(start), end: Math.ceil(end), autoplay: 0, controls: 1, rel: 0, playsinline: 1, enablejsapi: 1, cc_load_policy: 1, cc_lang_pref: 'en', origin: window.location.origin },
        events: {
          onReady: (event: any) => {
            if (cancelled) return;
            clearTimeout(readyTimeout);
            setError(false); setReady(true); seekingUntil.current = Date.now() + 4000;
            const rates = event.target.getAvailablePlaybackRates?.() || [1];
            supportedRates.current = rates; setAvailableRates(rates);
            if (!rates.includes(baseRate.current)) { baseRate.current = 1; setSpeed(1); }
            event.target.loadVideoById({ videoId: scene.youtubeId, startSeconds: pending.current, endSeconds: end });
            event.target.setPlaybackRate?.(baseRate.current);
          },
          onStateChange: (event: any) => {
            if (cancelled) return;
            setPlaying(event.data === 1);
            if (event.data === 0) {
              const bounds = loopBounds.current;
              if (bounds) {
                pending.current = bounds.start; seekingUntil.current = Date.now() + 4000;
                event.target.loadVideoById({ videoId: scene.youtubeId, startSeconds: bounds.start, endSeconds: bounds.end });
                event.target.setPlaybackRate?.(holdRate.current ?? baseRate.current);
                setCurrentTime(bounds.start); setEnded(false); return;
              }
              setEnded(true); setCurrentTime(end);
            }
            enforceBounds();
          },
          onPlaybackRateChange: (event: any) => {
            if (!holding.current && Number.isFinite(event.data)) { baseRate.current = event.data; setSpeed(event.data); }
          },
          onError: () => { if (!cancelled) { clearTimeout(readyTimeout); setError(true); setPlaying(false); } },
        },
      });
    }).catch(() => { clearTimeout(readyTimeout); if (!cancelled) setError(true); });
    const timer = window.setInterval(enforceBounds, 50);
    return () => { cancelled = true; clearTimeout(readyTimeout); clearInterval(timer); player.current?.destroy?.(); player.current = null; };
  }, [scene.youtubeId, start, end, unavailable]);

  useEffect(() => {
    if (active < 0 || !list.current) return;
    const row = list.current.querySelector<HTMLElement>(`[data-sub-idx="${active}"]`);
    if (!row) return;
    // Scroll only this list, never the page or the pinned video.
    const top = row.offsetTop - (list.current.clientHeight - row.clientHeight) / 2;
    list.current.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [active, scene.youtubeId]);

  if (unavailable) return <section dir="rtl" className="rounded-3xl border border-amber-300/25 bg-[#151329] p-5 text-white space-y-4">
    <h2 className="flex items-center gap-2 text-xl font-black"><AlertCircle/>{t('ms.unavailableTitle')}</h2>
    <p dir="ltr" className="font-bold">{scene.movieTitle} - {scene.sceneTitle}</p>
    <p className="text-sm leading-8 text-white/70">{t('ms.unavailableBody')}</p>
    {onBackToSearch && <button onClick={onBackToSearch} className="min-h-12 rounded-xl bg-amber-200 px-5 font-bold text-slate-950">{t('ms.backToResults')}</button>}
  </section>;

  return <section dir="rtl" className="movie-studio text-right text-white">
    <header className="flex flex-wrap items-center justify-between gap-3 pb-3">
      <div><p className="text-[11px] font-bold text-purple-300">{t('ms.sceneBadge')}</p><h2 className="text-lg font-black">{scene.movieTitle}</h2></div>
      {onBackToSearch && <button onClick={onBackToSearch} className="flex min-h-11 items-center gap-1 rounded-xl bg-white/10 px-3 text-xs font-bold"><ChevronRight size={16}/>{t('ms.backToSearch')}</button>}
    </header>
    <div className="movie-studio-workspace">
      <div className="movie-studio-player" data-testid="pinned-player">
        <div className="movie-studio-frame"><div ref={host} className="h-full w-full" title={scene.movieTitle}/></div>
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-1 rounded-b-2xl bg-[#151329] px-2 py-2">
          <div className="flex items-center gap-2">
            <button aria-label={playing ? t('ms.pause') : t('ms.play')} disabled={!ready || error} onClick={() => {
              if (playing) player.current?.pauseVideo?.();
              else if (ended || currentTime >= end || currentTime < start) loadClip(start);
              else player.current?.playVideo?.();
            }} className="rounded-xl bg-purple-600 p-2 disabled:opacity-40">{playing ? <Pause size={18}/> : <Play size={18}/>}</button>
            <button aria-label={t('ms.restartAria')} onClick={() => loadClip(loopBounds.current?.start ?? start)} className="rounded-xl bg-white/10 p-2"><RotateCcw size={18}/></button>
            <span dir="ltr" className="text-[11px] tabular-nums text-white/70">{timeLabel(currentTime - start)} / {timeLabel(end - start)}</span>
          </div>
          <div className="relative flex items-center gap-1.5">
            <button aria-label={t('ms.repeatAria')} aria-pressed={repeat} disabled={!ready || error} onClick={() => {
              const enabled = !repeat; setRepeat(enabled);
              loopBounds.current = enabled ? { ...lastCue.current } : null;
              if (enabled && ended) loadClip(loopBounds.current!.start);
              if (!enabled && playing) loadClip(currentTime);
            }} className={`flex min-h-10 items-center gap-1 rounded-xl px-1.5 text-[11px] font-bold ${repeat ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/75'}`}><Repeat size={15}/>{t('ms.repeat')}</button>
            <button aria-label={t('ms.speedAria')} aria-expanded={speedMenu} disabled={!ready || error} onPointerDown={event => {
              if (event.button !== 0) return;
              event.currentTarget.setPointerCapture(event.pointerId); beginHold();
            }} onPointerUp={finishHold} onPointerCancel={finishHold} onLostPointerCapture={finishHold} onBlur={finishHold}
              onKeyDown={event => { if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) beginHold(); }}
              onKeyUp={event => { if (event.key === ' ' || event.key === 'Enter') finishHold(); }}
              onContextMenu={event => event.preventDefault()}
              onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } setSpeedMenu(!speedMenu); }}
              className={`flex min-h-10 select-none items-center gap-1 rounded-xl px-1.5 text-[11px] font-bold ${temporaryRate !== null ? 'bg-amber-200 text-slate-950' : 'bg-white/10 text-white'}`}><Gauge size={15}/><span dir="ltr">{temporaryRate ?? speed}x</span></button>
            <button aria-label={t('ms.settingsAria')} aria-expanded={settingsOpen} onClick={() => { setSpeedMenu(false); setSettingsOpen(!settingsOpen); }} className="min-h-10 rounded-xl px-1.5 text-white/65"><Settings size={16}/></button>
          </div>
        </div>
        {speedMenu && <div role="group" aria-label={t('ms.speedGroupAria')} className="flex justify-center gap-2 border-t border-white/10 bg-[#211a34] p-2">{[0.5, 0.75, 1, 1.25].filter(rate => availableRates.includes(rate)).map(rate => <button key={rate} onClick={() => chooseSpeed(rate)} className={`min-h-11 rounded-lg px-2 text-xs ${speed === rate ? 'bg-purple-600' : 'bg-white/10'}`} dir="ltr">{rate}x</button>)}</div>}
        {settingsOpen && <label className="flex min-h-12 items-center justify-between gap-3 border-t border-white/10 bg-[#151329] px-3 py-2 text-xs leading-6">
          <span>{t('ms.holdHint')}<br/><small className="text-white/50">{t('ms.holdHintSub')}</small></span>
          <input type="checkbox" checked={holdEnabled} onChange={event => { finishHold(); const enabled = event.target.checked; setHoldEnabled(enabled); try { localStorage.setItem('henglish_movie_hold_to_slow', enabled ? 'on' : 'off'); } catch { /* device storage unavailable */ } }} className="h-5 w-5 accent-purple-500"/>
        </label>}
        {temporaryRate !== null && <p role="status" className="bg-[#151329] p-2 text-center text-[11px] text-amber-200">{t('ms.tempSlow')} <span dir="ltr">{temporaryRate}x</span></p>}
        {error && <p role="alert" className="bg-[#151329] p-3 text-xs leading-6 text-amber-200">{t('ms.playError')}</p>}
        {ended && <p role="status" className="bg-[#151329] p-2 text-center text-xs text-purple-200">{t('ms.ended')}</p>}
      </div>
      <div className="movie-studio-script">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-black"><Languages size={17}/>{t(hasTranscript ? 'ms.scriptTitle' : 'avmm.videoOnly')}</h3>
          {hasTranscript && reviewedTiming && <span className="text-[11px] text-white/45">{t('ms.syncedNote')}</span>}
        </div>
        <div ref={list} className="movie-studio-cues" data-testid="cue-list" tabIndex={0} aria-label={t('ms.cuesAria')}>
          {scene.subtitles.map((sub, index) => <button key={sub.id} data-sub-idx={index} aria-current={active === index ? 'true' : undefined} onClick={() => { if (loopBounds.current) loopBounds.current = { start: sub.start, end: sub.end }; loadClip(sub.start); }} className={`movie-studio-cue ${active === index ? 'is-active' : ''}`}>
            <span className="mb-2 flex justify-between text-[11px] text-purple-200"><span>{sub.speaker || t('ms.sourceText')}</span><span dir="ltr">{timeLabel(sub.start - start)} - {timeLabel(sub.end - start)}</span></span>
            <span dir="ltr" lang="en" className="block text-left text-base font-bold leading-8">{sub.en}</span>
            {lang !== 'en' && <span className="mt-2 block text-sm leading-8 text-white/85">{txText(appText, sub.arEg)}</span>}
            {fusha && lang === 'ar' && <span className="mt-2 block text-xs leading-7 text-white/60">{sub.arFusha}</span>}
          </button>)}
          {hasFusha && lang === 'ar' && <button onClick={() => setFusha(!fusha)} className="min-h-11 px-2 text-xs text-purple-200 underline">{fusha ? t('ms.hideFusha') : t('ms.showFusha')}</button>}
          {movieSourceSummaries[scene.youtubeId] && <p className="rounded-xl bg-white/5 p-3 text-xs leading-7 text-white/65"><strong>{t('ms.sceneIdea')} </strong>{txText(summaryText, movieSourceSummaries[scene.youtubeId])}</p>}
          {hasTranscript && <p className="text-[11px] leading-7 text-white/50">{t('ms.scriptNote')}</p>}
        </div>
        <footer className="border-t border-white/10 px-4 py-3 text-[11px] leading-6 text-white/55">
          <p>{t('ms.timingFrom')} {timeLabel(start)} {t('ms.timingTo')} {timeLabel(end)}. {reviewedTiming && (scene.transcriptTimingStatus === 'caption-reviewed' ? t('ms.timingCaption') : t('ms.timingAudio'))}</p>
          <a href={`https://www.youtube.com/watch?v=${scene.youtubeId}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 text-purple-200 underline"><ExternalLink size={12}/>{t('ms.sourceYoutube')}</a>
          <span className="mr-3">{t('ms.youtubeCc')}</span>
        </footer>
      </div>
    </div>
  </section>;
};
