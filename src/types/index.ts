export type PageRoute = 
  | 'home'
  | 'courses'
  | 'courses/grammar'
  | 'courses/grammar/future-perfect'
  | 'lesson'
  | 'practice'
  | 'quizzes'
  | 'games'
  | 'speaking'
  | 'vocabulary'
  | 'homework'
  | 'progress'
  | 'resources'
  | 'about';

export interface TimelinePoint {
  label: string;
  sublabel: string;
  detail: string;
  isCompleted?: boolean;
  isDeadline?: boolean;
}

export interface ExampleSentence {
  en: string;
  ar: string;
  highlight?: string;
  context?: string;
}

export interface LessonContent {
  id: string;
  number: number;
  kicker: string;
  title: string;
  subtitle: string;
  description: string;
  readTime: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  timelinePoints: TimelinePoint[];
  formula?: {
    tokens: { text: string; color: 'subject' | 'will' | 'have' | 'v3' | 'time' | 'default'; label: string }[];
    notes: string;
  };
  keyTakeaway: string;
  egyptianArabicTips: string[];
  examples: ExampleSentence[];
  contrastSection?: {
    title: string;
    description: string;
    comparisons: { tense: string; sentence: string; meaning: string; explanation: string }[];
  };
  commonMistakes: { wrong: string; correct: string; reason: string }[];
  miniQuiz: QuizQuestion[];
  homeworkPrompt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number; // 0-based index
  explanation: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface DialogueLine {
  speaker: string;
  avatar: string;
  en: string;
  ar: string;
  targetStructure?: string;
}

export interface DialogueScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  category: string;
  imageTheme: string;
  lines: DialogueLine[];
  comprehensionQuestions: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
}

export interface FlashcardItem {
  id: string;
  category: string;
  front: string;
  back: string;
  subBack?: string;
  exampleEn: string;
  exampleAr: string;
  formulaHint?: string;
}

export interface VerbEntry {
  v1: string;
  v2: string;
  v3: string;
  meaningAr: string;
  example: string;
  isIrregular: boolean;
  category: 'common' | 'work' | 'study' | 'daily' | 'tech';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progressPercentage?: number;
}

export interface UserProgressState {
  completedLessons: string[];
  quizScores: Record<string, { score: number; total: number; date: string }>;
  knownFlashcards: string[];
  reviewFlashcards: string[];
  studyStreakDays: number;
  lastStudyDate: string;
  dailyChallengeCompleted: boolean;
  totalTimeMinutes: number;
}
