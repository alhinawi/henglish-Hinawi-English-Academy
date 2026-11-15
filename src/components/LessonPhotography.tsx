import React from 'react';
import { LESSON_PHOTOGRAPHY, type LessonPhotograph } from '../data/lessonPhotography';

/** Same-origin assets, with reserved dimensions and no decorative animation. */
export const LessonPhoto: React.FC<{ photo: LessonPhotograph; priority?: boolean; className?: string }> = ({ photo, priority = false, className = '' }) => (
  <img src={photo.src} alt={photo.alt} width={1100} height={733}
    loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}
    decoding="async" className={`block w-full object-cover ${className}`} />
);

export const LessonPhotoGallery: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const photos = LESSON_PHOTOGRAPHY[lessonId];
  if (!photos) return null;
  return (
    <section aria-label="صور الدرس" className="space-y-5 rounded-3xl border border-[#ffd166]/20 bg-[#131328] p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#ffd166]" dir="ltr">THE VISUAL NOTEBOOK</p>
          <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">شوف اللغة في الحياة</h2>
        </div>
        <span className="text-xs text-[#b9b6d5]">مشاهد بصرية مساعدة للدرس</span>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {photos.slice(1).map((photo, index) => (
          <figure key={photo.src} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0b20]">
            <LessonPhoto photo={photo} className="aspect-[16/10]" />
            <figcaption className="flex items-start gap-3 p-4 text-sm leading-relaxed text-[#dedbf4]" dir="ltr">
              <span className="shrink-0 font-mono text-xs text-[#ffd166]">0{index + 1}</span>
              <span>{photo.alt}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export const LessonPhotoSources: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const photos = LESSON_PHOTOGRAPHY[lessonId];
  if (!photos) return null;
  return (
    <details className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs text-[#b9b6d5] print:break-inside-avoid">
      <summary className="cursor-pointer font-bold text-[#dedbf4]">مصادر صور الدرس وحقوق الاستخدام</summary>
      <p className="mt-3 leading-relaxed">صور حقيقية مستخدمة بترخيص Unsplash المجاني. الصور للتوضيح، والأشخاص الظاهرون فيها لا يمثلون الأكاديمية.</p>
      <ol className="mt-4 space-y-3" dir="ltr">
        {photos.map((photo, index) => (
          <li key={photo.src} className="leading-relaxed">
            {index + 1}. <a href={photo.source} target="_blank" rel="noreferrer" className="text-[#41e7ff] underline underline-offset-4">{photo.alt}</a>
            <span className="block">Unsplash · <a href={photo.licenseUrl} target="_blank" rel="noreferrer" className="underline">{photo.license}</a> · Photographer credit at source</span>
          </li>
        ))}
      </ol>
    </details>
  );
};
