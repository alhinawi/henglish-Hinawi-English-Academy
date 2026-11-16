// ==============================================================================
// Henglish Academy - CEFR PLACEMENT SESSION BUILDER
// Builds the 12-question placement test (2 per level A1-C2) from the large
// chunked question bank. Questions come from different skills, are drawn at
// random per attempt, and use the bank's served-history so a learner does not
// see the same question again until the matching pool is exhausted.
// ==============================================================================

import {
  BankQuestion,
  QuestionLevel,
  QuestionSkill,
  drawQuestions,
  loadAllQuestions,
} from './questionBankService';
import type { AssessmentQuestion } from '../data/massiveQuestionBank';

/** Two slots per level. Skill mix: vocab 3, grammar 3, reading 2, listening 3, usage 1. */
export const PLACEMENT_PLAN: ReadonlyArray<{ level: QuestionLevel; skills: [QuestionSkill, QuestionSkill] }> = [
  { level: 'A1', skills: ['vocabulary', 'grammar'] },
  { level: 'A2', skills: ['vocabulary', 'listening'] },
  { level: 'B1', skills: ['vocabulary', 'reading'] },
  { level: 'B2', skills: ['grammar', 'listening'] },
  { level: 'C1', skills: ['reading', 'usage'] },
  { level: 'C2', skills: ['grammar', 'listening'] },
];

const FALLBACK_SKILLS: QuestionSkill[] = ['grammar', 'reading', 'listening', 'usage', 'vocabulary'];

type Draw = typeof drawQuestions;

/** Placement uses multiple-choice only (4 options) so a guess is 25%, not 50%. */
function drawOne(all: BankQuestion[], draw: Draw, level: QuestionLevel, skill: QuestionSkill, taken: Set<string>): BankQuestion | null {
  const candidates = [skill, ...FALLBACK_SKILLS.filter(s => s !== skill)];
  for (const s of candidates) {
    const got = draw(all, { count: 1, skill: s, level, type: 'multiple-choice' });
    const q = got.find(x => !taken.has(x.id));
    if (q) return q;
  }
  return null;
}

export function toAssessmentQuestion(q: BankQuestion): AssessmentQuestion {
  return {
    id: q.id,
    skill: q.skill as AssessmentQuestion['skill'],
    type: q.type as AssessmentQuestion['type'],
    level: q.level,
    prompt: q.prompt,
    promptAr: q.promptAr,
    passage: q.passage,
    audioText: q.audioText,
    options: q.options,
    answerIndex: q.answerIndex,
    explanationAr: q.explanationAr,
    topic: q.topic,
  };
}

/** Pure builder (injectable draw function for tests). Ordered easy to hard. */
export function buildPlacementFromPool(all: BankQuestion[], draw: Draw = drawQuestions): AssessmentQuestion[] {
  const taken = new Set<string>();
  const session: AssessmentQuestion[] = [];
  for (const slot of PLACEMENT_PLAN) {
    for (const skill of slot.skills) {
      const q = drawOne(all, draw, slot.level, skill, taken);
      if (q) {
        taken.add(q.id);
        session.push(toAssessmentQuestion(q));
      }
    }
  }
  return session;
}

export async function generatePlacementSessionFromBank(): Promise<AssessmentQuestion[]> {
  const all = await loadAllQuestions();
  return buildPlacementFromPool(all);
}
