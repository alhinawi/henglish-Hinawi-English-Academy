// ==============================================================================
// Henglish Academy (HENGLISH) - SMART EDUCATIONAL VIDEO IMPORT MODAL
// Verified YouTube video importer with metadata verification and subtitle editor
// ==============================================================================

import React, { useState } from 'react';
import {
  X,
  Video,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  FileText,
  Volume2,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  importEducationalVideo,
  VIDEO_20_CATEGORIES,
  VideoCategoryType,
  EducationalVideoItem,
} from '../../services/videoLibraryService';
import { verifyYouTubeVideo, VerificationResult, extractYouTubeId } from '../../services/videoVerificationService';
import { CEFRLevel } from '../../types';
import { TimedSubtitle } from '../../data/movieScenesData';
import { playSound } from '../../utils/audio';

interface EducationalVideoImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (video: EducationalVideoItem) => void;
}

export const EducationalVideoImportModal: React.FC<EducationalVideoImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [youtubeInput, setYoutubeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategoryType>('movie_scenes');
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel>('B1');
  const [selectedAccent, setSelectedAccent] = useState<'American' | 'British' | 'International'>('American');
  const [customTitle, setCustomTitle] = useState('');
  const [description, setDescription] = useState('');

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verification, setVerification] = useState<VerificationResult | null>(null);

  // Subtitles / Captions state
  const [hasSubtitles, setHasSubtitles] = useState(false);
  const [subtitles, setSubtitles] = useState<Array<{
    start: number;
    end: number;
    en: string;
    arEg: string;
  }>>([
    { start: 0, end: 10, en: '', arEg: '' },
  ]);

  const [isImporting, setIsImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async () => {
    const ytid = extractYouTubeId(youtubeInput);
    if (!ytid) {
      setErrorMsg('يرجى إدخال رابط يوتيوب صحيح أو معرف فيديو مكون من 11 رمزاً');
      return;
    }
    setErrorMsg(null);
    setIsVerifying(true);
    playSound('click');

    try {
      const res = await verifyYouTubeVideo(ytid, true);
      setVerification(res);
      if (res.title && !customTitle) {
        setCustomTitle(res.title);
      }
      if (res.isEmbeddable) {
        playSound('success');
      } else {
        playSound('wrong');
      }
    } catch (err: any) {
      setErrorMsg(`خطأ في فحص الفيديو: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAddSubtitleLine = () => {
    const last = subtitles[subtitles.length - 1];
    const nextStart = last ? last.end + 1 : 0;
    setSubtitles([...subtitles, { start: nextStart, end: nextStart + 10, en: '', arEg: '' }]);
  };

  const handleRemoveSubtitleLine = (idx: number) => {
    setSubtitles(subtitles.filter((_, i) => i !== idx));
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verification || !verification.isEmbeddable) {
      setErrorMsg('يرجى التحقق من صلاحية الفيديو وقابلية تشغيله أولاً.');
      return;
    }

    setIsImporting(true);
    setErrorMsg(null);

    // Format subtitles
    let timedSubs: TimedSubtitle[] = [];
    if (hasSubtitles) {
      timedSubs = subtitles
        .filter(s => s.en.trim() !== '')
        .map((s, idx) => ({
          id: `sub-${idx + 1}`,
          start: s.start,
          end: s.end,
          en: s.en.trim(),
          arEg: s.arEg.trim() || 'ترجمة سياقية حية',
          arFusha: s.arEg.trim(),
          keyWords: [],
        }));
    }

    const res = await importEducationalVideo({
      youtubeUrlOrId: verification.youtubeId,
      category: selectedCategory,
      cefrLevel: selectedCefr,
      accent: selectedAccent,
      customTitle: customTitle.trim() || verification.title,
      sceneDescription: description.trim(),
      subtitles: timedSubs,
    });

    setIsImporting(false);

    if (res.ok && res.video) {
      playSound('success');
      if (onImportSuccess) onImportSuccess(res.video);
      onClose();
    } else {
      playSound('wrong');
      setErrorMsg(res.error || 'تعذر استيراد الفيديو');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-3xl rounded-3xl border border-white/15 bg-linear-to-b from-[#14132b] via-[#100f24] to-[#0a0918] p-6 sm:p-8 shadow-2xl text-right space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#41e7ff]/15 text-[#41e7ff]">
              <Video className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-white">
              استيراد وتوثيق فيديو تعليمي جديد (Smart Video Import)
            </h3>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleImportSubmit} className="space-y-5">
          {/* 1. YouTube URL & Live Verification */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white">
              رابط فيديو يوتيوب أو معرف الفيديو (YouTube URL / ID) *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={youtubeInput}
                onChange={e => setYoutubeInput(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=D6me2-OurCw"
                className="flex-1 px-4 py-3 rounded-xl bg-[#09091a] border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-[#41e7ff]"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying || !youtubeInput.trim()}
                className="px-5 py-3 rounded-xl bg-[#41e7ff] text-[#09091a] font-black text-xs hover:bg-[#6beeff] transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
              >
                {isVerifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>فحص الصلاحية</span>
              </button>
            </div>
          </div>

          {/* Verification Status Card */}
          {verification && (
            <div
              className={`p-4 rounded-2xl border flex items-center gap-4 ${
                verification.isEmbeddable
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {verification.thumbnailUrl && (
                <img
                  src={verification.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-24 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                />
              )}
              <div className="space-y-1 text-xs flex-1">
                <div className="font-bold text-white text-sm line-clamp-1">
                  {verification.title || verification.youtubeId}
                </div>
                <div className="text-white/60">
                  القناة: {verification.channelName || 'YouTube Creator'}
                </div>
                <div className="font-bold">
                  {verification.isEmbeddable ? (
                    <span className="text-emerald-400">✓ {verification.details}</span>
                  ) : (
                    <span className="text-red-400">✕ {verification.details}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category (20 Categories) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-white">الفئة (Category)</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs font-bold"
              >
                {VIDEO_20_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-[#121124]">
                    {cat.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* CEFR Level */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-white">المستوى (CEFR Level)</label>
              <select
                value={selectedCefr}
                onChange={e => setSelectedCefr(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs font-bold"
              >
                <option value="A1">A1 - مبتدئ</option>
                <option value="A2">A2 - أساسي</option>
                <option value="B1">B1 - متوسط</option>
                <option value="B2">B2 - فوق المتوسط</option>
                <option value="C1">C1 - متقدم</option>
                <option value="C2">C2 - طلاقة تامة</option>
              </select>
            </div>

            {/* Accent */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-white">اللكنة (Accent)</label>
              <select
                value={selectedAccent}
                onChange={e => setSelectedAccent(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs font-bold"
              >
                <option value="American">American 🇺🇸 (أمريكية)</option>
                <option value="British">British 🇬🇧 (بريطانية)</option>
                <option value="International">International 🌐 (دولية)</option>
              </select>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white">عنوان المقطع التعليمي</label>
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                placeholder="عنوان المشهد أو المقابلة التعليمية"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white">وصف المشهد وسياق التعلم</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="ما الذي يتعلمه الطالب من هذا المقطع؟"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs"
              />
            </div>
          </div>

          {/* 3. Subtitles & Educational Transcript Section */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                <input
                  type="checkbox"
                  checked={hasSubtitles}
                  onChange={e => setHasSubtitles(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#c4ff55]"
                />
                <span>إدخال نصوص وترجمة سياقية للمقطع (Interactive Subtitles)</span>
              </label>

              {!hasSubtitles && (
                <span className="text-[10px] text-white/50 bg-white/5 px-2.5 py-1 rounded-lg">
                  سيتم الاستيراد بوضع المشاهدة فقط (Video-Only)
                </span>
              )}
            </div>

            {hasSubtitles && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="text-xs text-white/70">
                  أدخل الأسطر الإنجليزية مع التوقيت بالثواني وترجمتها بالمصرية:
                </div>

                {subtitles.map((line, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#c4ff55]">سطر {idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50">من (ثانية):</span>
                        <input
                          type="number"
                          value={line.start}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            const copy = [...subtitles];
                            copy[idx].start = val;
                            setSubtitles(copy);
                          }}
                          className="w-16 px-2 py-1 rounded bg-[#09091a] border border-white/15 text-white text-center text-xs"
                        />
                        <span className="text-[10px] text-white/50">إلى:</span>
                        <input
                          type="number"
                          value={line.end}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            const copy = [...subtitles];
                            copy[idx].end = val;
                            setSubtitles(copy);
                          }}
                          className="w-16 px-2 py-1 rounded bg-[#09091a] border border-white/15 text-white text-center text-xs"
                        />
                        {subtitles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtitleLine(idx)}
                            className="p-1 rounded text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={line.en}
                      onChange={e => {
                        const copy = [...subtitles];
                        copy[idx].en = e.target.value;
                        setSubtitles(copy);
                      }}
                      placeholder="الجملة الإنجليزية المنطوقة (English sentence)..."
                      className="w-full px-3 py-1.5 rounded-lg bg-[#09091a] border border-white/15 text-white font-sans text-xs"
                      dir="ltr"
                    />

                    <input
                      type="text"
                      value={line.arEg}
                      onChange={e => {
                        const copy = [...subtitles];
                        copy[idx].arEg = e.target.value;
                        setSubtitles(copy);
                      }}
                      placeholder="الترجمة بالمصرية والعمق السياقي..."
                      className="w-full px-3 py-1.5 rounded-lg bg-[#09091a] border border-white/15 text-white text-xs"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddSubtitleLine}
                  className="px-3 py-1.5 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-xs font-bold text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة سطر حواري آخر</span>
                </button>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isImporting || !verification || !verification.isEmbeddable}
            className="w-full py-3.5 rounded-2xl bg-[#c4ff55] text-[#09091a] font-black text-sm hover:bg-[#d5ff78] transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارٍ حفظ وتوثيق الفيديو...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>تأكيد استيراد وحفظ الفيديو في المكتبة</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

