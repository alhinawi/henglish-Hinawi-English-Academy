// ==============================================================================
// Henglish Academy (HENGLISH) - ADMIN VIDEO MANAGEMENT MODAL
// Catalog auditing, broken link replacement, metadata editing, and verification logs
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Video,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit3,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  Search,
} from 'lucide-react';
import {
  EducationalVideoItem,
  getStoredVideos,
  adminUpdateVideo,
  adminMarkUnavailable,
  adminReplaceVideoId,
  VIDEO_20_CATEGORIES,
} from '../../services/videoLibraryService';
import { verifyYouTubeVideo, VerificationResult } from '../../services/videoVerificationService';
import { playSound } from '../../utils/audio';

interface AdminVideoManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImportModal: () => void;
  onCatalogChanged?: () => void;
}

export const AdminVideoManagementModal: React.FC<AdminVideoManagementModalProps> = ({
  isOpen,
  onClose,
  onOpenImportModal,
  onCatalogChanged,
}) => {
  const [videos, setVideos] = useState<EducationalVideoItem[]>(() => getStoredVideos());
  const [editingVideo, setEditingVideo] = useState<EducationalVideoItem | null>(null);
  const [replaceIdInput, setReplaceIdInput] = useState('');
  const [isAuditingAll, setIsAuditingAll] = useState(false);
  const [auditProgress, setAuditProgress] = useState<{ current: number; total: number } | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVideos(getStoredVideos());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Run full audit on all videos
  const handleAuditAll = async () => {
    setIsAuditingAll(true);
    playSound('click');
    setAuditProgress({ current: 0, total: videos.length });

    const currentVideos = [...videos];
    let updatedCount = 0;

    for (let i = 0; i < currentVideos.length; i++) {
      const v = currentVideos[i];
      setAuditProgress({ current: i + 1, total: currentVideos.length });
      try {
        const check = await verifyYouTubeVideo(v.youtubeId, true);
        currentVideos[i] = {
          ...v,
          verificationStatus: check.status,
          isEmbeddable: check.isEmbeddable,
          lastVerifiedAt: new Date().toISOString(),
        };
        updatedCount++;
      } catch {
        // continue
      }
    }

    setVideos(currentVideos);
    setIsAuditingAll(false);
    setAuditProgress(null);
    playSound('success');
    setStatusMsg(`اكتمل تدقيق وفحص كافة المقاطع بنجاح (${updatedCount} مقطع).`);
    if (onCatalogChanged) onCatalogChanged();
  };

  const handleStartEdit = (v: EducationalVideoItem) => {
    setEditingVideo({ ...v });
    setReplaceIdInput(v.youtubeId);
  };

  const handleSaveEdit = async () => {
    if (!editingVideo) return;
    playSound('click');

    // If ID changed, replace and verify
    if (replaceIdInput.trim() !== editingVideo.youtubeId) {
      const res = await adminReplaceVideoId(editingVideo.id, replaceIdInput.trim());
      if (!res.ok) {
        setStatusMsg(`خطأ في تحديث معرف الفيديو: ${res.error}`);
        playSound('wrong');
        return;
      }
    }

    const updated = adminUpdateVideo(editingVideo.id, {
      sceneTitle: editingVideo.sceneTitle,
      movieTitle: editingVideo.movieTitle,
      category: editingVideo.category,
      cefrLevel: editingVideo.cefrLevel,
      accent: editingVideo.accent,
      startTime: editingVideo.startTime,
      endTime: editingVideo.endTime,
    });

    setVideos(updated);
    setEditingVideo(null);
    playSound('success');
    setStatusMsg('تم حفظ التعديلات بنجاح.');
    if (onCatalogChanged) onCatalogChanged();
  };

  const handleMarkUnavailable = (v: EducationalVideoItem) => {
    const reason = prompt('أدخل سبب وضع الفيديو كغير متاح (مثال: حظر جغرافي، حقوق طبع، إلخ):', 'Unavailable on YouTube');
    if (reason) {
      const updated = adminMarkUnavailable(v.id, reason);
      setVideos(updated);
      playSound('click');
      if (onCatalogChanged) onCatalogChanged();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-4xl rounded-3xl border border-white/15 bg-linear-to-b from-[#14132b] via-[#100f24] to-[#0a0918] p-6 sm:p-8 shadow-2xl text-right space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#ffd166]/15 text-[#ffd166]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-white">
              لوحة إدارة وتدقيق مكتبة الفيديوهات (Admin Video Console)
            </h3>
          </div>
        </div>

        {statusMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-xs text-white/70">
            إجمالي المقاطع في المكتبة:{' '}
            <strong className="text-white text-sm">{videos.length}</strong> مقطع
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAuditAll}
              disabled={isAuditingAll}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isAuditingAll ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#41e7ff]" />
              ) : (
                <RefreshCw className="w-4 h-4 text-[#41e7ff]" />
              )}
              <span>
                {auditProgress
                  ? `جارٍ الفحص (${auditProgress.current}/${auditProgress.total})...`
                  : 'تدقيق روابط جميع الفيديوهات الآن'}
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenImportModal();
              }}
              className="px-4 py-2 rounded-xl bg-[#c4ff55] text-[#09091a] text-xs font-black hover:bg-[#d5ff78] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>استيراد مقطع جديد</span>
            </button>
          </div>
        </div>

        {/* Video Edit Drawer */}
        {editingVideo && (
          <div className="p-5 rounded-2xl bg-[#ffd166]/10 border border-[#ffd166]/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#ffd166]">تعديل بيانات المقطع: {editingVideo.sceneTitle}</span>
              <button
                onClick={() => setEditingVideo(null)}
                className="text-xs text-white/60 hover:text-white"
              >
                إلغاء التعديل
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white">معرف يوتيوب (YouTube ID)</label>
                <input
                  type="text"
                  value={replaceIdInput}
                  onChange={e => setReplaceIdInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#09091a] border border-white/20 text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white">عنوان المشهد</label>
                <input
                  type="text"
                  value={editingVideo.sceneTitle}
                  onChange={e => setEditingVideo({ ...editingVideo, sceneTitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#09091a] border border-white/20 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white">الفئة (Category)</label>
                <select
                  value={editingVideo.category}
                  onChange={e => setEditingVideo({ ...editingVideo, category: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#09091a] border border-white/20 text-white text-xs"
                >
                  {VIDEO_20_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#121124]">
                      {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white">المستوى الأوروبي (CEFR)</label>
                <select
                  value={editingVideo.cefrLevel}
                  onChange={e => setEditingVideo({ ...editingVideo, cefrLevel: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#09091a] border border-white/20 text-white text-xs"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingVideo(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-[#c4ff55] text-[#09091a] text-xs font-black hover:bg-[#d5ff78]"
              >
                حفظ وتأكيد التغييرات
              </button>
            </div>
          </div>
        )}

        {/* Videos Table / List */}
        <div className="space-y-3">
          {videos.map(v => (
            <div
              key={v.id}
              className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-white/25 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={v.thumbnailUrl || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt={v.sceneTitle}
                  className="w-20 h-14 object-cover rounded-xl border border-white/10 shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{v.sceneTitle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70">
                      {v.movieTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-[#41e7ff] text-[11px]">{v.youtubeId}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">{v.category}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-[#ffd166] font-bold">{v.cefrLevel}</span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {v.verificationStatus === 'verified_playable' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>معتمد ومتاح للتشغيل (Playable)</span>
                      </span>
                    ) : v.verificationStatus === 'video_only' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded-full">
                        <span>مشاهدة فقط (Video-Only)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        <span>{v.verificationStatus}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="فتح في يوتيوب للتأكد"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleStartEdit(v)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#41e7ff] transition-colors"
                  title="تعديل البيانات واستبدال الرابط"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleMarkUnavailable(v)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors"
                  title="تعيين كغير متاح"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
