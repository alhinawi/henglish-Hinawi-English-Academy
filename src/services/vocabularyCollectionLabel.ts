import type { VocabularyCollection } from '../types/translation';

// Display only: keep collection IDs and saved/custom names unchanged.
const builtIns: Record<string, [string, string, string]> = {
  'col-business': ['Business & Career', 'إنجليزي الأعمال والشركات', 'vcl.business'],
  'col-idioms': ['Idioms & Phrasal Verbs', 'تعبيرات واصطلاحات متقدمة', 'vcl.idioms'],
  'col-daily': ['Daily Spoken English', 'محادثات الحياة اليومية', 'vcl.daily'],
};

export function vocabularyCollectionLabel(
  collection: Pick<VocabularyCollection, 'id' | 'name' | 'nameAr'>,
  t: (key: string) => string,
  includeCustomEnglish = false,
): string {
  const builtIn = builtIns[collection.id];
  if (builtIn && collection.name === builtIn[0] && collection.nameAr === builtIn[1]) {
    return t(builtIn[2]);
  }
  if (includeCustomEnglish) return `${collection.nameAr} (${collection.name})`;
  return collection.nameAr || collection.name;
}
