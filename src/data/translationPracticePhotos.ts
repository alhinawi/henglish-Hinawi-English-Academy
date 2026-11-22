export const TRANSLATION_PRACTICE_PHOTOS = {
  study: { src: '/images/listening/study.webp', caption: 'tpr.photo.study' },
  travel: { src: '/images/pool/scene-travel.webp', caption: 'tpr.photo.travel' },
  work: { src: '/images/listening/meeting.webp', caption: 'tpr.photo.work' },
  discussion: { src: '/images/pool/scene-interview.webp', caption: 'tpr.photo.discussion' },
};
export const TRANSLATION_PRACTICE_THEMES: Record<string, keyof typeof TRANSLATION_PRACTICE_PHOTOS> = {
  'prac-a1-1':'study', 'prac-a1-2':'travel', 'prac-a1-3':'study', 'prac-a1-4':'study',
  'prac-a2-1':'travel', 'prac-a2-2':'travel', 'prac-a2-3':'travel',
  'prac-b1-1':'work', 'prac-b1-2':'work', 'prac-b1-3':'work', 'prac-b1-4':'work',
  'prac-b2-1':'work', 'prac-b2-2':'work', 'prac-b2-3':'work',
  'prac-c1-1':'discussion', 'prac-c1-2':'discussion', 'prac-c1-3':'discussion',
  'prac-c2-1':'discussion', 'prac-c2-2':'discussion', 'prac-c2-3':'discussion',
};
