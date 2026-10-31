import React, { useState } from 'react';
import { DOWNLOADABLE_RESOURCES, LearningResource } from '../data/resourcesData';
import { playSound } from '../utils/audio';
import { Download, Printer, Sparkles } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [previewResource, setPreviewResource] = useState<LearningResource | null>(DOWNLOADABLE_RESOURCES[0]);

  const handleDownload = (res: LearningResource) => {
    playSound('correct');
    
    // Create actual downloadable file in memory
    const blob = new Blob([res.contentMarkdown], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = res.downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (!downloadedIds.includes(res.id)) {
      setDownloadedIds([...downloadedIds, res.id]);
    }
  };

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/15 text-[#41e7ff] border border-[#41e7ff]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LEARNING RESOURCES & PRINTABLES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            المذكرات وأوراق العمل القابلة للتحميل 📥
          </h1>
          <p className="text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
            حمل مذكرات المراجعة المركزة، أوراق التدريبات المنزلية، وجداول الأفعال الشاملة بتنسيق نصي نظيف أو اطبعها مباشرة للدراسة الورقية.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer transition-transform hover:-translate-y-0.5 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة المذكرة المفتوحة</span>
        </button>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DOWNLOADABLE_RESOURCES.map(res => {
          const isSelected = previewResource?.id === res.id;
          const isDownloaded = downloadedIds.includes(res.id);

          return (
            <div
              key={res.id}
              onClick={() => {
                playSound('click');
                setPreviewResource(res);
              }}
              className={`glass-panel p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#41e7ff] shadow-[0_0_25px_rgba(65,231,255,0.2)] bg-[#1b1939]'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
                    {res.badge}
                  </span>
                  <span className="text-xs text-[#b9b6d5] font-semibold">
                    {res.pages} صفحات
                  </span>
                </div>

                <h3 className="text-lg font-black text-white leading-snug">
                  {res.title}
                </h3>
                <span className="en block text-xs font-bold text-[#41e7ff]">
                  {res.subtitle}
                </span>

                <p className="text-xs text-[#b9b6d5] leading-relaxed line-clamp-3">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(res);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#c4ff55]/20 text-[#c4ff55] font-black text-xs transition-colors cursor-pointer border border-[#c4ff55]/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloaded ? 'تم التحميل ✓' : 'تحميل الملف'}</span>
                </button>

                <span className="text-xs text-[#b9b6d5] font-semibold">
                  {isSelected ? 'المعاينة نشطة' : 'اضغط للمعاينة'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Preview & Printable Document Area */}
      {previewResource && (
        <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/15 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-[#41e7ff] font-black uppercase tracking-wider block">
                LIVE DOCUMENT PREVIEW
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                {previewResource.title}
              </h3>
            </div>
            <button
              onClick={() => handleDownload(previewResource)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#41e7ff]/20 hover:bg-[#41e7ff]/30 text-[#41e7ff] font-black text-xs border border-[#41e7ff]/40 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>تحميل نسخة ({previewResource.downloadFilename})</span>
            </button>
          </div>

          {/* Clean Markdown Preformatted Sheet */}
          <pre className="en p-6 rounded-2xl bg-[#09091a] border border-white/10 text-xs sm:text-sm text-[#dedbf4] font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto select-text">
            {previewResource.contentMarkdown}
          </pre>
        </section>
      )}

    </div>
  );
};
