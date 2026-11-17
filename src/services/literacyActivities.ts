import type { LiteracyReading } from '../data/literacyAcademyData';

/** Keep the correct meaning unique without teaching a fixed answer position. */
export function readingMeaningOptions(lesson: LiteracyReading, library: LiteracyReading[]): string[] {
  const normalise = (meaning: string) => meaning.trim().normalize('NFKC').toLowerCase();
  const seen = new Set([normalise(lesson.meaning)]);
  const distractors = library.filter(candidate => {
    const key = normalise(candidate.meaning);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(candidate => candidate.meaning);
  const shuffled = <T,>(values: T[]) => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  return shuffled([lesson.meaning, ...shuffled(distractors).slice(0, 2)]);
}
