export type PageRoute = 
  | 'dashboard'
  | 'home'
  | 'courses'
  | 'grammar'
  | 'courses/grammar'
  | 'courses/grammar/future-perfect'
  | 'vocabulary'
  | 'speaking'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'pronunciation'
  | 'real-life'
  | 'exams'
  | 'practice'
  | 'my-learning'
  | 'admin'
  | 'lesson'
  | 'quizzes'
  | 'games'
  | 'homework'
  | 'progress'
  | 'resources'
  | 'about'
  | 'grammar-lesson'
  | 'ai-tutor'
  | 'world-3d'
  | 'certificates';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  avatar: string;
  role: UserRole;
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  xp: number;
  streakDays: number;
  joinedDate: string;
  bio?: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  titleAr: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  type: 'lesson' | 'quiz' | 'flashcard' | 'speaking' | 'listening';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'achievement' | 'assignment' | 'reminder' | 'system';
  actionRoute?: PageRoute;
}

export interface PersonalNote {
  id: string;
  lessonId: string;
  lessonTitle: string;
  content: string;
  updatedAt: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  subtitle: string;
  route: PageRoute;
  lessonId?: string;
  category: string;
  savedAt: string;
}

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
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | CEFRLevel;
  cefrLevel?: CEFRLevel;
  academy?: 'grammar' | 'vocabulary' | 'speaking' | 'listening' | 'reading' | 'writing' | 'pronunciation' | 'real-life';
  imageUrl?: string;
  imageAlt?: string;
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
  published?: boolean;
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
  avatarUrl?: string;
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
  sceneImageUrl?: string;
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
  notes?: PersonalNote[];
  bookmarks?: BookmarkItem[];
  dailyGoals?: DailyGoal[];
  xp?: number;
  level?: CEFRLevel;
}

export interface PlacementQuestion {
  id: string;
  level: CEFRLevel;
  skill: 'grammar' | 'vocabulary' | 'reading' | 'usage';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
