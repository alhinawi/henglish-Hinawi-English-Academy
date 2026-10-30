import React, { useState } from 'react';
import { LessonVideoResource } from '../data/videoResourcesData';
import { Play, ExternalLink, Video, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

interface YouTubeVideoPlayerProps {
  resources: LessonVideoResource[];
  lessonTitle: string;
}

export const YouTubeVideoPlayer: React.FC<YouTubeVideoPlayerProps> = ({ resources, lessonTitle }) => {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!resources || resources.length === 0) {
    return null;
  }

  const currentVideo = resources[activeVideoIdx] || resources[0];

  const handleSelectVideo = (idx: number) => {
    playSound('click');
    setActiveVideoIdx(idx);
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <section className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6 text-right">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-500/30">
            <Video className="w-3.5 h-3.5 text-red-400" />
            <span>VIDEO RESOURCES • المكتبة المرئية للدرس</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>شروحات فيديو عالمية معتمدة 🎥</span>
          </h3>
          <p className="text-xs text-[#b9b6d5]">
            فيديوهات تعليمية منتقاة بعناية من كبرى القنوات العالمية لشرح: {lessonTitle}
          </p>
        </div>

        {/* Video switcher badges */}
        {resources.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap">
            {resources.map((res, idx) => (
              <button
                key={res.id}
                onClick={() => handleSelectVideo(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeVideoIdx === idx
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                    : 'bg-white/5 text-[#b9b6d5] hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>فيديو {idx + 1} ({res.channelName})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Responsive Video Embed Player */}
      <div className="space-y-4">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/15 shadow-2xl">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0b20] z-10 space-y-3">
              <div className="w-10 h-10 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
              <span className="text-xs font-bold text-[#dedbf4]">جاري تحميل الفيديو التعليمي...</span>
            </div>
          )}

          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#171632] space-y-4">
              <AlertCircle className="w-12 h-12 text-red-400" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">تعذر تضمين الفيديو داخل الصفحة حالياً</p>
                <p className="text-xs text-[#b9b6d5]">يمكنك مشاهدة الفيديو مباشرة على منصة يوتيوب الرسمية</p>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${currentVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>فتح الفيديو على YouTube</span>
              </a>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              className="w-full h-full border-0"
            />
          )}
        </div>

        {/* Video Metadata & Description Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ffd166]">
              <span className="px-2 py-0.5 rounded bg-[#ffd166]/15 text-[#ffd166]">{currentVideo.channelName}</span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1 text-[#b9b6d5]">
                <Clock className="w-3 h-3" />
                {currentVideo.duration}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white">{currentVideo.titleAr}</h4>
            <div className="text-xs font-mono text-[#b9b6d5]">{currentVideo.title}</div>
            <p className="text-xs text-[#dedbf4] leading-relaxed pt-1">{currentVideo.descriptionAr}</p>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${currentVideo.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white hover:text-red-400 border border-white/10 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span>مشاهدة على YouTube</span>
          </a>
        </div>

        {/* Timestamps if available */}
        {currentVideo.keyTimestamps && currentVideo.keyTimestamps.length > 0 && (
          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-[#ffd166] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              أهم محطات الفيديو التعليمية:
            </span>
            <div className="flex flex-wrap gap-2">
              {currentVideo.keyTimestamps.map((ts, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs"
                >
                  <span className="text-red-400 font-mono font-bold">{ts.time}</span>
                  <span className="text-[#dedbf4]">{ts.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
