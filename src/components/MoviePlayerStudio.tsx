import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ChevronRight, ExternalLink, Languages, Pause, Play, RotateCcw } from 'lucide-react';
import type { MovieSceneItem } from '../data/movieScenesData';
import { applyMovieTranscriptCorrections } from '../data/movieTranscriptCorrections';
import { movieSourceSummaries } from '../data/movieSourceSummaries';
import { activeSubtitleAt } from '../utils/movieTimeline';
import './movieStudio.css';

declare global { interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void; } }
let apiPromise: Promise<any> | null = null;
function loadYouTubeApi(): Promise<any> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT); };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => { apiPromise = null; reject(new Error('Player could not load')); };
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
  const scene = useMemo(() => applyMovieTranscriptCorrections(originalScene), [originalScene]);
  const unavailable = scene.transcriptTimingStatus === 'quarantined';
  const start = scene.startTime;
  const end = scene.endTime;
  const [currentTime, setCurrentTime] = useState(start);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState(false);
  const [following, setFollowing] = useState(true);
  const [fusha, setFusha] = useState(false);
  const [speed, setSpeed] = useState(1);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<any>(null);
  const list = useRef<HTMLDivElement>(null);
  const pending = useRef(start);
  const seekingUntil = useRef(0);
  const active = activeSubtitleAt(scene.subtitles, currentTime);

  // Object loading preserves a decimal endSeconds on every app-controlled seek/replay.
  // Calling seekTo would clear YouTube's endSeconds, so it is deliberately not used.
  const loadClip = (at: number) => {
    const target = Math.max(start, Math.min(at, end - 0.01));
    pending.current = target;
    setCurrentTime(target); setEnded(false);
    if (player.current && ready) {
      seekingUntil.current = Date.now() + 4000;
      player.current.loadVideoById({ videoId: scene.youtubeId, startSeconds: target, endSeconds: end });
      player.current.setPlaybackRate?.(speed);
    }
  };

  useEffect(() => {
    if (unavailable) return;
    let cancelled = false;
    setReady(false); setError(false); setPlaying(false); setEnded(false); setFollowing(true);
    setCurrentTime(start); pending.current = start;
    const enforceBounds = () => {
      const p = player.current;
      if (!p || typeof p.getCurrentTime !== 'function') return;
      const t = p.getCurrentTime();
      if (!Number.isFinite(t)) return;
      if (seekingUntil.current && Math.abs(t - pending.current) > 1 && Date.now() < seekingUntil.current) return;
      seekingUntil.current = 0;
      if (t >= end) {
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
      player.current = new YT.Player(host.current, {
        host: 'https://www.youtube-nocookie.com', width: '100%', height: '100%', videoId: scene.youtubeId,
        playerVars: { start: Math.floor(start), end: Math.ceil(end), autoplay: 0, controls: 1, rel: 0, playsinline: 1, enablejsapi: 1, cc_load_policy: 1, cc_lang_pref: 'en', origin: window.location.origin },
        events: {
          onReady: (event: any) => {
            if (cancelled) return;
            setReady(true); seekingUntil.current = Date.now() + 4000;
            event.target.loadVideoById({ videoId: scene.youtubeId, startSeconds: pending.current, endSeconds: end });
          },
          onStateChange: (event: any) => {
            if (cancelled) return;
            setPlaying(event.data === 1);
            if (event.data === 0) { setEnded(true); setCurrentTime(end); }
            enforceBounds();
          },
          onError: () => { if (!cancelled) { setError(true); setPlaying(false); } },
        },
      });
    }).catch(() => { if (!cancelled) setError(true); });
    const timer = window.setInterval(enforceBounds, 50);
    return () => { cancelled = true; clearInterval(timer); player.current?.destroy?.(); player.current = null; };
  }, [scene.youtubeId, start, end, unavailable]);

  useEffect(() => {
    if (!following || active < 0 || !list.current) return;
    const row = list.current.querySelector<HTMLElement>(`[data-sub-idx="${active}"]`);
    if (!row) return;
    // Scroll only this list, never the page or the pinned video.
    const top = row.offsetTop - (list.current.clientHeight - row.clientHeight) / 2;
    list.current.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [active, following]);

  if (unavailable) return <section dir="rtl" className="rounded-3xl border border-amber-300/25 bg-[#151329] p-5 text-white space-y-4">
    <h2 className="flex items-center gap-2 text-xl font-black"><AlertCircle/>المقطع تحت المراجعة</h2>
    <p dir="ltr" className="font-bold">{scene.movieTitle} - {scene.sceneTitle}</p>
    <p className="text-sm leading-8 text-white/70">بنختار مشهدا قصيرا له نص كامل وتوقيت مؤكد. التدريب متوقف مؤقتا بدل عرض فيديو طويل بنص ناقص.</p>
    {onBackToSearch && <button onClick={onBackToSearch} className="min-h-12 rounded-xl bg-amber-200 px-5 font-bold text-slate-950">العودة لنتائج البحث</button>}
  </section>;

  return <section dir="rtl" className="movie-studio text-right text-white">
    <header className="flex flex-wrap items-center justify-between gap-3 pb-3">
      <div><p className="text-[11px] font-bold text-purple-300">مشهد قصير للتعلم</p><h2 className="text-lg font-black">{scene.movieTitle}</h2></div>
      {onBackToSearch && <button onClick={onBackToSearch} className="flex min-h-11 items-center gap-1 rounded-xl bg-white/10 px-3 text-xs font-bold"><ChevronRight size={16}/>العودة للبحث</button>}
    </header>
    <div className="movie-studio-workspace">
      <div className="movie-studio-player" data-testid="pinned-player">
        <div className="movie-studio-frame"><div ref={host} className="h-full w-full" title={scene.movieTitle}/></div>
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 rounded-b-2xl bg-[#151329] px-3 py-2">
          <div className="flex items-center gap-2">
            <button aria-label={playing ? 'إيقاف مؤقت' : 'تشغيل المشهد'} disabled={!ready || error} onClick={() => {
              if (playing) player.current?.pauseVideo?.();
              else if (ended || currentTime >= end || currentTime < start) loadClip(start);
              else player.current?.playVideo?.();
            }} className="rounded-xl bg-purple-600 p-2 disabled:opacity-40">{playing ? <Pause size={18}/> : <Play size={18}/>}</button>
            <button aria-label="إعادة المشهد من بدايته" onClick={() => loadClip(start)} className="rounded-xl bg-white/10 p-2"><RotateCcw size={18}/></button>
            <span dir="ltr" className="text-[11px] tabular-nums text-white/70">{timeLabel(currentTime - start)} / {timeLabel(end - start)}</span>
          </div>
          <select aria-label="سرعة المشهد" value={speed} onChange={event => { const value = Number(event.target.value); setSpeed(value); player.current?.setPlaybackRate?.(value); }} className="rounded-lg bg-[#27233e] px-2 py-1 text-xs">{[0.5, 0.75, 1].map(s => <option key={s} value={s}>{s}x</option>)}</select>
        </div>
        {error && <p role="alert" className="bg-[#151329] p-3 text-xs leading-6 text-amber-200">تعذر تشغيل المصدر هنا. تقدر تفتحه من رابط المصدر تحت.</p>}
        {ended && <p role="status" className="bg-[#151329] p-2 text-center text-xs text-purple-200">انتهى المشهد القصير. اضغط إعادة عشان تراجعه.</p>}
      </div>
      <div className="movie-studio-script">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-black"><Languages size={17}/>نص المشهد القصير</h3>
          <button aria-pressed={following} onClick={() => setFollowing(!following)} className={`min-h-10 rounded-xl px-3 text-xs font-bold ${following ? 'bg-purple-500/20 text-purple-200' : 'bg-amber-300 text-slate-950'}`}>{following ? 'متابعة تلقائية' : 'متابعة الجملة'}</button>
        </div>
        <div ref={list} className="movie-studio-cues" data-testid="cue-list" onWheel={() => setFollowing(false)} onTouchMove={() => setFollowing(false)} onPointerDown={event => { if (event.target === event.currentTarget) setFollowing(false); }} onKeyDown={event => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) setFollowing(false); }} tabIndex={0} aria-label="جمل المشهد المتزامنة">
          {scene.subtitles.map((sub, index) => <button key={sub.id} data-sub-idx={index} aria-current={active === index ? 'true' : undefined} onClick={() => { setFollowing(true); loadClip(sub.start); }} className={`movie-studio-cue ${active === index ? 'is-active' : ''}`}>
            <span className="mb-2 flex justify-between text-[11px] text-purple-200"><span>{sub.speaker || 'نص المصدر'}</span><span dir="ltr">{timeLabel(sub.start - start)} - {timeLabel(sub.end - start)}</span></span>
            <span dir="ltr" lang="en" className="block text-left text-base font-bold leading-8">{sub.en}</span>
            <span lang="ar-EG" className="mt-2 block text-sm leading-8 text-white/85">{sub.arEg}</span>
            {fusha && <span className="mt-2 block text-xs leading-7 text-white/60">{sub.arFusha}</span>}
          </button>)}
          <button onClick={() => setFusha(!fusha)} className="min-h-11 px-2 text-xs text-purple-200 underline">{fusha ? 'إخفاء الفصحى' : 'عرض الفصحى'}</button>
          {movieSourceSummaries[scene.youtubeId] && <p className="rounded-xl bg-white/5 p-3 text-xs leading-7 text-white/65"><strong>فكرة المشهد: </strong>{movieSourceSummaries[scene.youtubeId]}</p>}
          <p className="text-[11px] leading-7 text-white/50">النص للمشهد القصير المعروض بس، مش للفيديو الأصلي كله. اضغط على الجملة لإعادتها. لمس القائمة أو تحريكها بيوقف المتابعة التلقائية.</p>
        </div>
        <footer className="border-t border-white/10 px-4 py-3 text-[11px] leading-6 text-white/55">
          <p>من توقيت المصدر {timeLabel(start)} إلى {timeLabel(end)}. {scene.transcriptTimingStatus === 'caption-reviewed' ? 'الحدود من ترجمة المصدر، مش مراجعة صوتية كلمة بكلمة.' : 'الافتتاحية دي مراجعة على صوت المصدر.'}</p>
          <a href={`https://www.youtube.com/watch?v=${scene.youtubeId}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 text-purple-200 underline"><ExternalLink size={12}/>المصدر على YouTube</a>
          <span className="mr-3">ترجمة YouTube من زر CC لو متاحة.</span>
        </footer>
      </div>
    </div>
  </section>;
};
