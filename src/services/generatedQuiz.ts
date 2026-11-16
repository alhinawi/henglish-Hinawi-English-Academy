import type { QuizQuestion } from '../types';

// Reject malformed batches. Never invent a correct answer or partly accept a quiz.
export function parseGeneratedQuiz(data: unknown, fallbackTopic: string, notesLabel: string): QuizQuestion[] {
  const questions = data && typeof data === 'object' ? (data as { questions?: unknown }).questions : null;
  if (!Array.isArray(questions) || !questions.length) throw new Error('Empty question batch');
  return questions.map((raw, idx) => {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid question');
    const q = raw as Record<string, unknown>;
    const text = (value: unknown): value is string => typeof value === 'string' && !!value.trim();
    const options = q.options;
    if (!text(q.prompt) || !text(q.explanationAr) || !Array.isArray(options) ||
        options.length < 2 || options.length > 6 || !options.every(text) ||
        new Set(options.map(o => o.trim().toLowerCase())).size !== options.length ||
        !Number.isInteger(q.correctAnswerIndex) || (q.correctAnswerIndex as number) < 0 ||
        (q.correctAnswerIndex as number) >= options.length ||
        !['easy', 'medium', 'hard'].includes(q.difficulty as string) ||
        (q.distractorNotesAr !== undefined && (!Array.isArray(q.distractorNotesAr) || !q.distractorNotesAr.every(text)))) {
      throw new Error('Invalid question fields');
    }
    const notes = q.distractorNotesAr as string[] | undefined;
    return {
      id: text(q.id) ? q.id : `generated-${idx}`,
      question: q.prompt,
      options: [...options],
      answer: q.correctAnswerIndex as number,
      explanation: q.explanationAr + (notes?.length ? '\n\n' + notesLabel + '\n• ' + notes.join('\n• ') : ''),
      topic: text(q.topic) ? q.topic : fallbackTopic,
      difficulty: q.difficulty === 'easy' ? 'beginner' : q.difficulty === 'hard' ? 'advanced' : 'intermediate',
    };
  });
}
