import { CEFRLevel } from '../types';

export type QuestionSkill = 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'usage';
export type QuestionType = 'multiple-choice' | 'fill-blank' | 'error-correction' | 'word-order' | 'matching';

export interface AssessmentQuestion {
  id: string;
  skill: QuestionSkill;
  type: QuestionType;
  level: CEFRLevel;
  prompt: string;
  promptAr?: string;
  passage?: string; // For reading or listening transcripts
  audioText?: string; // Text to be spoken for listening questions
  options: string[];
  answerIndex: number;
  explanationAr: string;
  wrongOptionHints?: string[];
  topic: string;
}

export const MASSIVE_QUESTION_BANK: AssessmentQuestion[] = [
  // ==========================================
  // LEVEL A1 & A2 (BEGINNER / ELEMENTARY)
  // ==========================================
  {
    id: 'a1-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'She ______ in a major international hospital in Cairo.',
    promptAr: 'اختر تصريف الفعل المناسب في المضارع البسيط مع الفاعل المفرد الغائب:',
    options: ['works', 'work', 'working', 'is work'],
    answerIndex: 0,
    explanationAr: 'الفاعل She مفرد غائب، والحدث يعبر عن حقيقة ووظيفة دائمة، لذلك نضيف s للفعل: works.',
    topic: 'Present Simple',
  },
  {
    id: 'a1-gram-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'Where ______ you live before moving to Alexandria?',
    promptAr: 'اختر الفعل المساعد المناسب لتكوين السؤال في الماضي البسيط:',
    options: ['did', 'do', 'were', 'have'],
    answerIndex: 0,
    explanationAr: 'في السؤال عن الماضي البسيط مع فعل أساسي (live)، نستخدم الأداة did مع المصدر.',
    topic: 'Past Simple Questions',
  },
  {
    id: 'a1-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'A person who flies an airplane professionally is called a ______.',
    promptAr: 'اختر المسمى الوظيفي الصحيح للشخص الذي يقود الطائرات:',
    options: ['pilot', 'driver', 'sailor', 'engineer'],
    answerIndex: 0,
    explanationAr: 'الطيار بالإنجليزية هو Pilot، بينما Driver يقود السيارات و Sailor يبحر بالسفن.',
    topic: 'Professions',
  },
  {
    id: 'a2-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'Look at those dark storm clouds! It ______ rain very heavily.',
    promptAr: 'اختر الصيغة المستقبلية الصحيحة عند وجود دليل مرئي حالي:',
    options: ['is going to', 'will', 'is', 'rains'],
    answerIndex: 0,
    explanationAr: 'عند وجود دليل مادي مرئي أمامنا (dark clouds) نستخدم صيغة is going to للتنبؤ المؤكد.',
    topic: 'Future: Will vs Going to',
  },
  {
    id: 'a2-gram-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'While my brother was cooking dinner, I ______ my homework.',
    promptAr: 'اختر الزمن المناسب لحدثين كانا يقعان بالتوازي في الماضي:',
    options: ['was doing', 'did', 'do', 'have done'],
    answerIndex: 0,
    explanationAr: 'حدثان مستمران في نفس الوقت في الماضي بالتوازي نستخدم معهما الماضي المستمر was doing.',
    topic: 'Past Continuous',
  },
  {
    id: 'a2-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'To "postpone" a business meeting means to ______ it.',
    promptAr: 'ما المعنى الدقيق لكلمة postpone في بيئة العمل؟',
    options: ['delay', 'cancel', 'start', 'repeat'],
    answerIndex: 0,
    explanationAr: 'كلمة Postpone تعني التأجيل إلى وقت لاحق (delay / put off).',
    topic: 'Business Synonyms',
  },
  {
    id: 'a2-listen-1',
    skill: 'listening',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'Listen to the airport announcement: What is the passenger advised to do?',
    audioText: 'Attention passenger Kareem Nour, please proceed immediately to gate 14 for final boarding call.',
    passage: 'Attention passenger Kareem Nour, please proceed immediately to gate 14 for final boarding call.',
    options: ['Go directly to gate 14', 'Collect lost luggage', 'Wait at passport control', 'Change flight ticket'],
    answerIndex: 0,
    explanationAr: 'الإعلان يطلب التوجه فوراً لبوابة 14: "proceed immediately to gate 14".',
    topic: 'Airport Announcements',
  },

  // ==========================================
  // LEVEL B1 (INTERMEDIATE)
  // ==========================================
  {
    id: 'b1-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'Omar is exhausted because he ______ the tech report all morning.',
    promptAr: 'اختر الزمن الدال على المجهود واستمرارية الفعل في الماضي والممتد للحاضر:',
    options: ['has been writing', 'wrote', 'writes', 'is written'],
    answerIndex: 0,
    explanationAr: 'التركيز على طول المدة (all morning) والأثر الواضح في الحاضر (exhausted) يتطلب المضارع التام المستمر has been writing.',
    topic: 'Present Perfect Continuous',
  },
  {
    id: 'b1-gram-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'If you ______ harder last semester, you would have passed the scholarship exam.',
    promptAr: 'اختر الصيغة الصحيحة لفعل الشرط في الحالة الشرطية الثالثة (الندم على الماضي):',
    options: ['had studied', 'studied', 'would study', 'have studied'],
    answerIndex: 0,
    explanationAr: 'جواب الشرط يحتوي على would have passed (حالة ثالثة)، إذن فعل الشرط ماضٍ تام had studied.',
    topic: 'Third Conditional',
  },
  {
    id: 'b1-gram-3',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'By the time the delivery courier arrives, we ______ the conference room.',
    promptAr: 'اختر زمن المستقبل التام المناسب مع رابط الوقت By the time:',
    options: ['will have arranged', 'will arrange', 'arranged', 'have arranged'],
    answerIndex: 0,
    explanationAr: 'الحدث سيكتمل قبل وصول المندوب في المستقبل، لذلك نستخدم will have arranged.',
    topic: 'Future Perfect',
  },
  {
    id: 'b1-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'The new mobile application received a ______ response from early testers, exceeding expectations.',
    promptAr: 'اختر الكلمة المناسبة لوصف الردود شديدة الإيجابية والحماسية:',
    options: ['phenomenal', 'reluctant', 'mediocre', 'tedious'],
    answerIndex: 0,
    explanationAr: 'كلمة Phenomenal تعني استثنائي وباهر، وهي المناسبة لعبارة exceeding expectations.',
    topic: 'Advanced Adjectives',
  },
  {
    id: 'b1-read-1',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'B1',
    passage: 'Remote work has expanded significantly over the past five years. While employees appreciate the elimination of stressful daily commutes and greater flexibility, managers emphasize the importance of asynchronous documentation and structured weekly check-ins to maintain team alignment.',
    prompt: 'According to the passage, what do managers consider crucial for remote team success?',
    promptAr: 'بناءً على النص، ما الذي يعتبره المديرون ضرورياً لنجاح فرق العمل عن بعد؟',
    options: ['Structured documentation and check-ins', 'Longer daily commutes', 'Eliminating all meetings', 'Returning to the office immediately'],
    answerIndex: 0,
    explanationAr: 'النص يذكر نصاً: "managers emphasize the importance of asynchronous documentation and structured weekly check-ins".',
    topic: 'Reading Comprehension',
  },

  // ==========================================
  // LEVEL B2 (UPPER INTERMEDIATE)
  // ==========================================
  {
    id: 'b2-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'By next November, Dr. Farida ______ as head of clinical trials for a full decade.',
    promptAr: 'اختر الزمن المعبر عن استكمال فترة زمنية كاملة بحلول موعد مستقبلي محدد:',
    options: ['will have been serving', 'will serve', 'is serving', 'has served'],
    answerIndex: 0,
    explanationAr: 'التعبير عن استمرار النشاط حتى نقطة مستقبلية وإتمام عقد كامل (a full decade) يتطلب Future Perfect Continuous: will have been serving.',
    topic: 'Future Perfect Continuous',
  },
  {
    id: 'b2-gram-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'The financial audit ______ by a team of independent external consultants last week.',
    promptAr: 'اختر صيغة المبني للمجهول الصحيحة في الماضي البسيط:',
    options: ['was conducted', 'has conducted', 'is conducted', 'conducted'],
    answerIndex: 0,
    explanationAr: 'المراجعة المالية (The audit) مفعول به غير عاقل، وتمت الأسبوع الماضي (last week)، فتصاغ was conducted.',
    topic: 'Passive Voice',
  },
  {
    id: 'b2-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'To "streamline" a workflow process means to ______.',
    promptAr: 'ما المعنى الدقيق لمصطلح Streamline في إدارة الأعمال والبرمجيات؟',
    options: ['make it more efficient and simpler', 'delay it unnecessarily', 'hire more employees', 'cancel the project'],
    answerIndex: 0,
    explanationAr: 'كلمة Streamline تعني تبسيط الإجراءات وجعلها أكثر سرعة وكفاءة وإزالة التعقيدات.',
    topic: 'Professional Collocations',
  },
  {
    id: 'b2-usage-1',
    skill: 'usage',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'In a formal email negotiation, which phrase is most professional to express polite disagreement?',
    promptAr: 'أي من العبارات الآتية هي الأكثر دبلوماسية واحترافية للتعبير عن الاعتراض في إيميل عمل؟',
    options: [
      'While I see your point, our data suggests an alternative approach.',
      'You are completely wrong about this estimate.',
      'I do not care about your perspective.',
      'This proposal makes no sense at all.'
    ],
    answerIndex: 0,
    explanationAr: 'الأسلوب الدبلوماسي يبدأ بالاعتراف بوجهة نظر الطرف الآخر أولاً: "While I see your point, our data suggests...".',
    topic: 'Business Pragmatics',
  },

  // ==========================================
  // LEVEL C1 & C2 (ADVANCED & MASTERY)
  // ==========================================
  {
    id: 'c1-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Hardly ______ the stage when the entire auditorium erupted in thunderous applause.',
    promptAr: 'اختر الصيغة المعكوسة الصحيحة (Inversion) بعد ظرف النفي Hardly:',
    options: ['had the keynote speaker entered', 'the keynote speaker had entered', 'did the speaker entered', 'was the speaker enter'],
    answerIndex: 0,
    explanationAr: 'بعد ظروف النفي التي تبدأ الجملة مثل Hardly / Scarcely / No sooner نستخدم التقديم والتأخير (Inversion): had + subject + V3.',
    topic: 'Grammatical Inversion',
  },
  {
    id: 'c1-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'The keynote speaker\'s insights were remarkably ______, dissecting macroeconomic trends with razor-sharp precision.',
    promptAr: 'اختر الصفة البليغة المناسبة للتعبير عن العمق الفكري والفطنة الثاقبة:',
    options: ['incisive', 'ambiguous', 'superficial', 'redundant'],
    answerIndex: 0,
    explanationAr: 'كلمة Incisive تعني نافذ وثاقب وبصير (clear, penetrating, acute)، بينما الباقي يعني سطحي أو مبهم.',
    topic: 'C1 Academic Vocabulary',
  },
  {
    id: 'c1-read-1',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'C1',
    passage: 'Cognitive linguists postulate that language acquisition is not merely syntactic computation, but deeply embedded in sensorimotor metaphors. Concepts as abstract as temporal deadlines ("By Friday", "Looking ahead") stem organically from spatial orientation.',
    prompt: 'What core thesis do cognitive linguists advance in the passage?',
    promptAr: 'ما هي الأطروحة الجوهرية التي يقدمها علماء اللغة المعرفيون في النص؟',
    options: [
      'Abstract temporal concepts derive organically from physical spatial metaphors',
      'Grammar consists strictly of mathematical algebraic formulas',
      'Languages have no underlying conceptual metaphors',
      'Time expressions cannot be conceptualized by humans'
    ],
    answerIndex: 0,
    explanationAr: 'النص يوضح أن المفاهيم الزمنية المجردة تنبع عضوياً من التوجه المكاني الحسي: "concepts stem organically from spatial orientation".',
    topic: 'C1 Reading Comprehension',
  },
];

/**
 * Dynamic Adaptive Session Generator:
 * Generates an individualized placement test session combining questions across skills,
 * randomizing selection to prevent repetition, and calculating personalized CEFR rating.
 */
export function generateAdaptivePlacementSession(previousQuestionIds: string[] = []): AssessmentQuestion[] {
  const skills: QuestionSkill[] = ['grammar', 'vocabulary', 'reading', 'listening', 'usage'];
  const session: AssessmentQuestion[] = [];

  // Filter out recently answered questions if pool allows
  const available = MASSIVE_QUESTION_BANK.filter(q => !previousQuestionIds.includes(q.id));
  const pool = available.length >= 10 ? available : MASSIVE_QUESTION_BANK;

  // 1. Pick balanced distribution across CEFR levels
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

  levels.forEach(lvl => {
    const levelQuestions = pool.filter(q => q.level === lvl);
    // Shuffle and pick 2 per level (Total = 10 dynamic balanced questions per placement session)
    const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
    session.push(...shuffled.slice(0, 2));
  });

  // Final session shuffle
  return session.sort(() => Math.random() - 0.5);
}

export interface AssessmentResultBreakdown {
  score: number;
  total: number;
  overallPercentage: number;
  estimatedLevel: CEFRLevel;
  levelTitleAr: string;
  skillBreakdown: Record<QuestionSkill, { score: number; total: number; percentage: number }>;
  strengths: string[];
  weaknesses: string[];
  recommendedPath: {
    startAcademy: string;
    startRoute: string;
    focusTopics: string[];
  };
  disclaimerAr: string;
}

export function evaluateAssessmentSession(
  questions: AssessmentQuestion[],
  answers: Record<number, number>
): AssessmentResultBreakdown {
  let totalCorrect = 0;
  const skillStats: Record<QuestionSkill, { score: number; total: number }> = {
    grammar: { score: 0, total: 0 },
    vocabulary: { score: 0, total: 0 },
    reading: { score: 0, total: 0 },
    listening: { score: 0, total: 0 },
    usage: { score: 0, total: 0 },
  };

  questions.forEach((q, idx) => {
    const isCorrect = answers[idx] === q.answerIndex;
    if (isCorrect) {
      totalCorrect++;
      skillStats[q.skill].score++;
    }
    skillStats[q.skill].total++;
  });

  const overallPercentage = Math.round((totalCorrect / Math.max(1, questions.length)) * 100);

  let estimatedLevel: CEFRLevel = 'A1';
  let levelTitleAr = 'المستوى التأسيسي الأول (Beginner - A1)';

  if (overallPercentage >= 85) {
    estimatedLevel = 'C1';
    levelTitleAr = 'المستوى المتقدم والطلاقة الأكاديمية (Advanced - C1)';
  } else if (overallPercentage >= 70) {
    estimatedLevel = 'B2';
    levelTitleAr = 'المستوى فوق المتوسط المتمكن (Upper Intermediate - B2)';
  } else if (overallPercentage >= 50) {
    estimatedLevel = 'B1';
    levelTitleAr = 'المستوى المتوسط المستقل (Intermediate - B1)';
  } else if (overallPercentage >= 30) {
    estimatedLevel = 'A2';
    levelTitleAr = 'المستوى الأولي العملي (Elementary - A2)';
  }

  // Calculate skill percentages
  const skillBreakdown = {} as Record<QuestionSkill, { score: number; total: number; percentage: number }>;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  (Object.keys(skillStats) as QuestionSkill[]).forEach(skill => {
    const stat = skillStats[skill];
    const pct = stat.total > 0 ? Math.round((stat.score / stat.total) * 100) : 100;
    skillBreakdown[skill] = { score: stat.score, total: stat.total, percentage: pct };

    if (pct >= 70) {
      strengths.push(getSkillNameAr(skill));
    } else if (pct < 50) {
      weaknesses.push(getSkillNameAr(skill));
    }
  });

  // Recommended personalized path
  let recommendedPath = {
    startAcademy: 'أكاديمية الجرامر الشاملة',
    startRoute: 'grammar',
    focusTopics: ['المضارع البسيط والروتين', 'الماضي وسرد الأحداث', 'أدوات الربط'],
  };

  if (estimatedLevel === 'B1' || estimatedLevel === 'B2') {
    recommendedPath = {
      startAcademy: 'كورس المستقبل التام والمواقف الحقيقية',
      startRoute: 'courses/grammar/future-perfect',
      focusTopics: ['المستقبل التام Will have + V3', 'إنجليزي الاجتماعات والمطارات', 'أفعال V3 الشاذة'],
    };
  } else if (estimatedLevel === 'C1') {
    recommendedPath = {
      startAcademy: 'المحادثة المتقدمة وإنجليزي الأعمال',
      startRoute: 'speaking',
      focusTopics: ['المفردات الأكاديمية C1', 'المبني للمجهول في التقارير', 'التفاوض الدبلوماسي'],
    };
  }

  return {
    score: totalCorrect,
    total: questions.length,
    overallPercentage,
    estimatedLevel,
    levelTitleAr,
    skillBreakdown,
    strengths: strengths.length > 0 ? strengths : ['الإلمام بالمفاهيم الأولية'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['مواصلة التوسع في المفردات المركبة'],
    recommendedPath,
    disclaimerAr:
      'تنويه أكاديمي هام: هذا الاختبار هو تقييم تشخيصي استرشادي داخلي مبني على معايير الإطار الأوروبي المرجعي المشترك (CEFR) لتحديد نقطة انطلاقك في الأكاديمية، ولا يمثل شهادة توثيق دولية بديلة لاختبارات IELTS أو TOEFL الرسمية.',
  };
}

function getSkillNameAr(skill: QuestionSkill): string {
  switch (skill) {
    case 'grammar':
      return 'القواعد النحوية (Grammar)';
    case 'vocabulary':
      return 'المفردات وحصيلة الكلمات (Vocabulary)';
    case 'reading':
      return 'القراءة واستيعاب النصوص (Reading)';
    case 'listening':
      return 'الاستماع والفهم الصوتي (Listening)';
    case 'usage':
      return 'التعبير والمواقف الوظيفية (Practical Usage)';
  }
}
