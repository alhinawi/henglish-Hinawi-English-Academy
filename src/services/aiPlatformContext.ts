// ==============================================================================
// Henglish Academy (HENGLISH) - PLATFORM CONTEXT & TOOL EXECUTION ENGINE
// Provides verified educational curriculum data & student progress integration
// ==============================================================================

import { ALL_GRAMMAR_RULES, GrammarRuleItem } from '../data/allGrammarRules';
import { VOCABULARY_ACADEMY_WORDS, VocabWord } from '../data/vocabularyAcademyData';
import { MASSIVE_QUESTION_BANK, AssessmentQuestion } from '../data/massiveQuestionBank';
import { REAL_LIFE_SCENARIOS, SimulationScenario } from '../data/realLifeSimulationsData';
import { REAL_LIFE_DIALOGUES } from '../data/dialoguesData';
import { CEFRLevel, UserProfile, UserProgressState } from '../types';

export interface StudentPlatformContext {
  userProfile?: Partial<UserProfile>;
  progress?: Partial<UserProgressState>;
  currentRoute?: string;
  activeGrammarRuleId?: string;
}

export interface PlatformToolDeclaration {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required: string[];
  };
}

export const PLATFORM_TOOLS: PlatformToolDeclaration[] = [
  {
    name: 'searchGrammarLessons',
    description: 'Searches official Henglish Academy grammar syllabus for rules, formulas, and explanations.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword, grammatical tense, or concept (e.g. "future perfect", "past continuous", "since vs for", "conditionals").',
        },
        level: {
          type: 'string',
          description: 'Target CEFR level (A1, A2, B1, B2, C1).',
          enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'getGrammarLessonDetails',
    description: 'Retrieves full educational details, formulas, Egyptian Arabic tips, and common traps for a specific Henglish grammar rule.',
    parameters: {
      type: 'object',
      properties: {
        ruleId: {
          type: 'string',
          description: 'The unique slug of the grammar rule (e.g. "future-perfect", "present-simple", "passive-voice", "conditionals-all").',
        },
      },
      required: ['ruleId'],
    },
  },
  {
    name: 'searchVocabulary',
    description: 'Searches Henglish Academy vocabulary repository for word definitions, Egyptian Arabic meanings, phonetics/IPA, and collocations.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'English word, root, topic, or Arabic meaning.',
        },
        level: {
          type: 'string',
          description: 'CEFR level (A1, A2, B1, B2, C1).',
          enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'getExamQuestions',
    description: 'Fetches verified exam and assessment questions from Henglish question bank for practice or testing.',
    parameters: {
      type: 'object',
      properties: {
        skill: {
          type: 'string',
          description: 'English language skill category.',
          enum: ['grammar', 'vocabulary', 'reading', 'listening', 'usage'],
        },
        level: {
          type: 'string',
          description: 'CEFR level (A1, A2, B1, B2, C1).',
          enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
        },
        count: {
          type: 'number',
          description: 'Number of questions to retrieve (1 to 5).',
        },
      },
      required: ['skill', 'level'],
    },
  },
  {
    name: 'getRealLifeScenarios',
    description: 'Retrieves authentic conversation simulation scenarios (Airport, Restaurant, Clinic, Tech Interview).',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Context category (e.g. "Travel", "Dining", "Medical", "Professional", "Daily").',
        },
      },
      required: [],
    },
  },
  {
    name: 'getStudentLearningSummary',
    description: 'Retrieves the verified learning history, completed lessons, streak, and quiz scores of the currently logged-in student.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

// ==========================================
// Tool Implementations
// ==========================================

export function searchGrammarLessons(query: string, level?: string): {
  id: string;
  titleEn: string;
  titleAr: string;
  level: string;
  goldenFormula: string;
  summaryAr: string;
  route: string;
}[] {
  const q = query.toLowerCase().trim();
  const matched = ALL_GRAMMAR_RULES.filter(rule => {
    const matchesQuery = 
      rule.id.toLowerCase().includes(q) ||
      rule.titleEn.toLowerCase().includes(q) ||
      rule.titleAr.includes(query) ||
      rule.goldenFormula.toLowerCase().includes(q) ||
      rule.summaryAr.includes(query) ||
      rule.egyptianTips.some(tip => tip.includes(query)) ||
      rule.commonTraps.some(trap => trap.includes(query));

    const matchesLevel = !level || rule.level.startsWith(level);
    return matchesQuery && matchesLevel;
  });

  return matched.slice(0, 4).map(rule => ({
    id: rule.id,
    titleEn: rule.titleEn,
    titleAr: rule.titleAr,
    level: rule.level,
    goldenFormula: rule.goldenFormula,
    summaryAr: rule.summaryAr,
    route: rule.id === 'future-perfect' ? '#courses/grammar/future-perfect' : `#grammar/${rule.id}`,
  }));
}

export function getGrammarLessonDetails(ruleId: string): GrammarRuleItem | null {
  const cleanId = ruleId.toLowerCase().trim().replace('#grammar/', '').replace('grammar/', '');
  return ALL_GRAMMAR_RULES.find(rule => rule.id.toLowerCase() === cleanId) || null;
}

export function searchVocabulary(query: string, level?: string): VocabWord[] {
  const q = query.toLowerCase().trim();
  const matched = VOCABULARY_ACADEMY_WORDS.filter(w => {
    const matchesQuery = 
      w.word.toLowerCase().includes(q) ||
      w.meaningAr.includes(query) ||
      w.exampleEn.toLowerCase().includes(q) ||
      (w.collocation ? w.collocation.toLowerCase().includes(q) : false);

    const matchesLevel = !level || w.level === level;
    return matchesQuery && matchesLevel;
  });

  return matched.slice(0, 6);
}

export function getExamQuestions(skill: string, level: string, count: number = 3): Partial<AssessmentQuestion>[] {
  const matched = MASSIVE_QUESTION_BANK.filter(q => 
    q.skill.toLowerCase() === skill.toLowerCase() &&
    q.level.toUpperCase() === level.toUpperCase()
  );

  const safeCount = Math.min(Math.max(1, count), 5);
  return matched.slice(0, safeCount).map(q => ({
    id: q.id,
    skill: q.skill,
    level: q.level,
    prompt: q.prompt,
    promptAr: q.promptAr,
    options: q.options,
    explanationAr: q.explanationAr,
    topic: q.topic,
  }));
}

export function getRealLifeScenarios(category?: string): Partial<SimulationScenario>[] {
  let list = REAL_LIFE_SCENARIOS;
  if (category) {
    const cat = category.toLowerCase().trim();
    list = list.filter(s => s.category.toLowerCase().includes(cat) || s.title.toLowerCase().includes(cat));
  }
  return list.map(s => ({
    id: s.id,
    title: s.title,
    titleAr: s.titleAr,
    category: s.category,
    level: s.level,
    descriptionAr: s.descriptionAr,
    locationName: s.locationName,
  }));
}

export function getStudentLearningSummary(context?: StudentPlatformContext): {
  studentName: string;
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  xp: number;
  streakDays: number;
  completedLessonsCount: number;
  completedLessonIds: string[];
  recentQuizScores: Record<string, { score: number; total: number; date: string }>;
  verifiedWeakAreas: string[];
} {
  const profile = context?.userProfile;
  const progress = context?.progress;

  // Identify weak areas from quiz scores < 70%
  const weakAreas: string[] = [];
  if (progress?.quizScores) {
    for (const [quizId, scoreData] of Object.entries(progress.quizScores)) {
      if (scoreData.total > 0 && (scoreData.score / scoreData.total) < 0.7) {
        weakAreas.push(quizId);
      }
    }
  }

  return {
    studentName: profile?.nameAr || profile?.name || 'طالب أكاديمية هناوي',
    currentLevel: (profile?.currentLevel as CEFRLevel) || 'B1',
    targetLevel: (profile?.targetLevel as CEFRLevel) || 'C1',
    xp: profile?.xp ?? 1450,
    streakDays: profile?.streakDays ?? 4,
    completedLessonsCount: progress?.completedLessons?.length || 0,
    completedLessonIds: progress?.completedLessons || [],
    recentQuizScores: progress?.quizScores || {},
    verifiedWeakAreas: weakAreas,
  };
}

/**
 * Universal Tool Dispatcher
 */
export async function executePlatformTool(
  toolName: string,
  args: Record<string, unknown>,
  context?: StudentPlatformContext
): Promise<unknown> {
  switch (toolName) {
    case 'searchGrammarLessons':
      return searchGrammarLessons(String(args.query || ''), args.level ? String(args.level) : undefined);
    case 'getGrammarLessonDetails':
      return getGrammarLessonDetails(String(args.ruleId || ''));
    case 'searchVocabulary':
      return searchVocabulary(String(args.query || ''), args.level ? String(args.level) : undefined);
    case 'getExamQuestions':
      return getExamQuestions(
        String(args.skill || 'grammar'),
        String(args.level || 'B1'),
        typeof args.count === 'number' ? args.count : 3
      );
    case 'getRealLifeScenarios':
      return getRealLifeScenarios(args.category ? String(args.category) : undefined);
    case 'getStudentLearningSummary':
      return getStudentLearningSummary(context);
    default:
      return { error: `Tool ${toolName} is not recognized on Henglish platform.` };
  }
}
