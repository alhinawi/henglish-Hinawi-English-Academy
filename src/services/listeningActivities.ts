import { normalizeListeningAnswer, type ListeningLesson } from '../data/listeningAcademyData';

/** Create one stable round at lesson-open time, never from the lesson ID. */
export function listeningGapActivity(lesson: ListeningLesson, library: ListeningLesson[], random = Math.random) {
  const words = lesson.dictationSentence.split(' ');
  const index = words.map((w, i) => ({ w: normalizeListeningAnswer(w), i }))
    .filter(x => x.w.length > 3).at(-1)?.i ?? words.length - 1;
  const answer = normalizeListeningAnswer(words[index]);
  const shuffle = <T,>(values: T[]): T[] => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const pool = Array.from(new Set(library.flatMap(item => item.dictationSentence.split(' '))
    .map(normalizeListeningAnswer))).filter(word => word && word !== answer && word.length > 3);
  return {
    sentence: words.map((word, i) => i === index ? '______' : word).join(' '),
    answer,
    options: shuffle([answer, ...shuffle(pool).slice(0, 3)]),
  };
}
