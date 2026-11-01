// ==============================================================================
// HENGLISH ACADEMY - DYNAMIC GAME GENERATION ENGINE
// Generates unlimited, adaptive educational challenges from 55,000+ vocabulary,
// 10,000+ expressions, 5,500 sentences, verbs toolkit & massive question bank.
// ==============================================================================

import { loadVocabularyCore, loadExpressions, LexicalEntry, ExpressionEntry } from './vocabularyService';
import { loadSentences, SentenceItem } from './sentencesService';
import { VERB_TOOLKIT } from '../data/verbsData';
import { MASSIVE_QUESTION_BANK, AssessmentQuestion } from '../data/massiveQuestionBank';
import { CEFRLevel } from '../types';

export interface GameQuestion {
  id: string;
  type: 'multiple-choice' | 'tiles' | 'spelling' | 'error-hunter' | 'clue-reveal';
  prompt: string;
  promptAr?: string;
  contextSentence?: string;
  audioText?: string;
  audioUrl?: string;
  ipa?: string;
  options?: string[];
  correctAnswer: string;
  correctAnswerIndex?: number;
  explanationAr: string;
  clues?: string[]; // For clue reveal games
  scrambledTiles?: string[]; // For sentence builder
  hasError?: boolean; // For error hunter
  errorTarget?: string;
  correction?: string;
  category: string;
  cefr: string;
}

// Fallback vocabulary entries if offline
const FALLBACK_VOCAB: Partial<LexicalEntry>[] = [
  { headword: 'achieve', meaningAr: 'يحقق / ينجز', pos: 'verb', cefr: 'B1', ipaUs: '/əˈtʃiːv/', definitionEn: 'To successfully bring about a desired result by effort.', exampleEn: 'She worked hard to achieve her goals.' },
  { headword: 'resilient', meaningAr: 'مرن / قادر على التعافي', pos: 'adjective', cefr: 'B2', ipaUs: '/rɪˈzɪl.jənt/', definitionEn: 'Able to withstand or recover quickly from difficult conditions.', exampleEn: 'The team remained resilient despite setbacks.' },
  { headword: 'collaborate', meaningAr: 'يتعاون', pos: 'verb', cefr: 'B2', ipaUs: '/kəˈlæb.ə.reɪt/', definitionEn: 'Work jointly on an activity or project.', exampleEn: 'We collaborated with international researchers.' },
  { headword: 'fluency', meaningAr: 'طلاقة لغوية', pos: 'noun', cefr: 'B1', ipaUs: '/ˈfluː.ən.si/', definitionEn: 'The ability to speak or write a foreign language easily and accurately.', exampleEn: 'Daily practice leads to natural fluency.' },
  { headword: 'comprehend', meaningAr: 'يستوعب / يفهم بعمق', pos: 'verb', cefr: 'B2', ipaUs: '/ˌkɑːm.prəˈhend/', definitionEn: 'To understand or grasp mentally.', exampleEn: 'He could not comprehend the magnitude of the discovery.' },
  { headword: 'pivotal', meaningAr: 'محوري / حاسم', pos: 'adjective', cefr: 'C1', ipaUs: '/ˈpɪv.ə.t̬əl/', definitionEn: 'Of crucial importance in relation to the development of something.', exampleEn: 'This represents a pivotal moment in English education.' },
  { headword: 'eloquent', meaningAr: 'بليغ / فصيح', pos: 'adjective', cefr: 'C1', ipaUs: '/ˈel.ə.kwənt/', definitionEn: 'Fluent or persuasive in speaking or writing.', exampleEn: 'His speech was remarkably eloquent and moving.' },
  { headword: 'endeavor', meaningAr: 'مسعى / جهد حثيث', pos: 'noun', cefr: 'C1', ipaUs: '/enˈdev.ɚ/', definitionEn: 'An attempt to achieve a goal.', exampleEn: 'Language mastery is a lifelong endeavor.' }
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * 1. VOCABULARY RUSH GENERATOR
 * Fast-paced multiple choice testing instant recall with high-fidelity Arabic distractors
 */
export async function generateVocabularyRushRound(cefrFilter?: string, count: number = 10): Promise<GameQuestion[]> {
  let vocabList: LexicalEntry[] = [];
  try {
    vocabList = await loadVocabularyCore();
  } catch {
    vocabList = [];
  }

  const pool = vocabList.length >= 20 ? vocabList : (FALLBACK_VOCAB as LexicalEntry[]);
  const filtered = cefrFilter && cefrFilter !== 'all' 
    ? pool.filter(v => v.cefr === cefrFilter || v.cefr?.startsWith(cefrFilter[0]))
    : pool;
  
  const selectedPool = filtered.length >= count ? filtered : pool;
  const picked = shuffleArray(selectedPool).slice(0, count);

  return picked.map((item, index) => {
    // Pick 3 distractors from same pool
    const distractors = pool
      .filter(w => w.headword !== item.headword && w.meaningAr && w.meaningAr !== item.meaningAr)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaningAr);

    // If distractors fall short, provide fallback Arabic meanings
    while (distractors.length < 3) {
      distractors.push('معنى بديل ' + (distractors.length + 1));
    }

    const options = shuffleArray([item.meaningAr, ...distractors]);
    const correctIndex = options.indexOf(item.meaningAr);

    return {
      id: `vr-${index}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.headword,
      promptAr: 'اختر المعنى العربي الدقيق للكلمة الإنجليزية:',
      audioText: item.headword,
      audioUrl: item.audioUsUrl || item.audioUkUrl,
      ipa: item.ipaUs || item.ipaUk,
      contextSentence: item.exampleEn,
      options,
      correctAnswer: item.meaningAr,
      correctAnswerIndex: correctIndex,
      explanationAr: `الكلمة: "${item.headword}" تعني (${item.meaningAr}). سياق الاستخدام: "${item.exampleEn || ''}"`,
      category: 'vocabulary',
      cefr: item.cefr || 'B1',
    };
  });
}

/**
 * 2. WORD DETECTIVE GENERATOR
 * Uncover a mystery English word using 3 progressive clues
 */
export async function generateWordDetectiveRound(count: number = 5): Promise<GameQuestion[]> {
  let vocabList: LexicalEntry[] = [];
  try {
    vocabList = await loadVocabularyCore();
  } catch {
    vocabList = [];
  }

  const pool = (vocabList.length >= 20 ? vocabList : (FALLBACK_VOCAB as LexicalEntry[]))
    .filter(w => w.headword.length >= 4 && w.definitionEn && w.meaningAr);

  const picked = shuffleArray(pool).slice(0, count);

  return picked.map((target, index) => {
    const word = target.headword;
    const masked = word[0] + ' ' + '_ '.repeat(word.length - 2) + word[word.length - 1];

    const clue1 = `نوع الكلمة (${target.pos}) ومستوى الكلمة (${target.cefr || 'B1'}). التعريف بالإنجليزية: "${target.definitionEn.slice(0, 120)}..."`;
    const clue2 = target.exampleEn 
      ? `مثال مع إخفاء الكلمة: "${target.exampleEn.replace(new RegExp(word, 'gi'), '[ ________ ]')}" • المعنى: (${target.meaningAr})`
      : `المعنى بالعربية: (${target.meaningAr})`;
    const clue3 = `الحروف الأولى والأخيرة: "${masked}" (طول الكلمة ${word.length} حروف)`;

    const distractors = pool
      .filter(w => w.headword !== word && Math.abs(w.headword.length - word.length) <= 2)
      .slice(0, 3)
      .map(w => w.headword);

    const options = shuffleArray([word, ...distractors]);

    return {
      id: `wd-${index}-${Date.now()}`,
      type: 'clue-reveal',
      prompt: 'حل لغز الكلمة السرية 🕵️',
      promptAr: 'استخدم التلميحات الذكية بالترتيب للوصول إلى الكلمة الصحيحة بأقل عدد ممكن من التلميحات!',
      clues: [clue1, clue2, clue3],
      audioText: word,
      audioUrl: target.audioUsUrl || target.audioUkUrl,
      ipa: target.ipaUs || target.ipaUk,
      options,
      correctAnswer: word,
      correctAnswerIndex: options.indexOf(word),
      explanationAr: `الكلمة السرية هي: "${word}" (${target.meaningAr}). التعريف: ${target.definitionEn}`,
      category: 'vocabulary',
      cefr: target.cefr || 'B2',
    };
  });
}

/**
 * 3. SENTENCE BUILDER GENERATOR
 * Unscramble authentic English sentences drawn from the 5,500 sentence database
 */
export async function generateSentenceBuilderRound(cefrFilter?: string, count: number = 5): Promise<GameQuestion[]> {
  let sentences: SentenceItem[] = [];
  try {
    sentences = await loadSentences();
  } catch {
    sentences = [];
  }

  const pool = sentences.length >= 20 ? sentences : [
    {
      id: 'fallback-s1',
      english: 'She will have finished the comprehensive report by tomorrow morning.',
      arabicEg: 'هي هتكون خلصت التقرير الشامل بحلول بكرة الصبح.',
      arabicFusha: 'ستكون قد أنهت التقرير الشامل بحلول صباح الغد.',
      cefr: 'B2',
      grammar: 'Future Perfect',
    } as SentenceItem,
    {
      id: 'fallback-s2',
      english: 'Mastering English vocabulary requires regular deliberate practice every day.',
      arabicEg: 'إتقان مفردات الإنجليزي بيتطلب ممارسة منتظمة ومتعمدة كل يوم.',
      arabicFusha: 'يتطلب إتقان المفردات الإنجليزية ممارسة منتظمة ومتعمدة كل يوم.',
      cefr: 'B1',
      grammar: 'Present Simple Gerund',
    } as SentenceItem,
    {
      id: 'fallback-s3',
      english: 'If you had arrived earlier, we could have watched the match together.',
      arabicEg: 'لو كنت جيت بدري شوية، كنا نقدر نتفرج على الماتش سوا.',
      arabicFusha: 'لو كنت وصلت مبكراً، لكان بإمكاننا مشاهدة المباراة معاً.',
      cefr: 'B2',
      grammar: 'Third Conditional',
    } as SentenceItem,
  ];

  const filtered = cefrFilter && cefrFilter !== 'all'
    ? pool.filter(s => s.cefr === cefrFilter)
    : pool;

  const validPool = (filtered.length >= count ? filtered : pool)
    .filter(s => s.english.split(' ').length >= 5 && s.english.split(' ').length <= 11);

  const picked = shuffleArray(validPool.length >= count ? validPool : pool).slice(0, count);

  return picked.map((item, index) => {
    // Strip trailing period for tiles, retain words
    const cleanSentence = item.english.replace(/[.!?]+$/, '').trim();
    const words = cleanSentence.split(/\s+/);
    const scrambled = shuffleArray([...words]);

    // Ensure scrambled is not identical to original
    if (scrambled.join(' ') === cleanSentence && words.length > 2) {
      const temp = scrambled[0];
      scrambled[0] = scrambled[1];
      scrambled[1] = temp;
    }

    return {
      id: `sb-${index}-${Date.now()}`,
      type: 'tiles',
      prompt: item.arabicFusha || item.arabicEg,
      promptAr: 'رتّب الكلمات الإنجليزية بالترتيب النحوي والسياقي الصحيح:',
      contextSentence: item.english,
      audioText: item.english,
      scrambledTiles: scrambled,
      correctAnswer: cleanSentence,
      explanationAr: `الترتيب الصحيح: "${cleanSentence}." (${item.arabicFusha || item.arabicEg}) • القاعدة: ${item.grammar || 'تكوين الجملة القياسي'}`,
      category: 'grammar',
      cefr: item.cefr || 'B1',
    };
  });
}

/**
 * 4. ERROR HUNTER GENERATOR
 * Detect grammatical errors or verify 100% correct constructions
 */
export async function generateErrorHunterRound(count: number = 6): Promise<GameQuestion[]> {
  // Use curated cases from MASSIVE_QUESTION_BANK + grammar test cases
  const errorCases: GameQuestion[] = [
    {
      id: 'eh-1',
      type: 'error-hunter',
      prompt: 'She will has completed her residency by 2028.',
      promptAr: 'هل تحتوي هذه الجملة على خطأ قواعدي؟',
      hasError: true,
      errorTarget: 'will has',
      correction: 'She will have completed her residency by 2028.',
      explanationAr: 'خطأ: لا نستخدم has بعد will أبداً؛ في زمن المستقبل التام القاعدة الثابتة هي will have + V3.',
      category: 'grammar',
      cefr: 'B1',
      correctAnswer: 'error',
    },
    {
      id: 'eh-2',
      type: 'error-hunter',
      prompt: 'By the time the manager arrives, we will have prepared the presentations.',
      promptAr: 'هل تحتوي هذه الجملة على خطأ قواعدي؟',
      hasError: false,
      correction: 'الجملة صحيحة قواعدياً وسياقياً بنسبة ١٠٠٪! ✅',
      explanationAr: 'صحيحة تماماً: By the time + مضارع بسيط (arrives)، والجملة الرئيسية مستقبل تام (will have prepared).',
      category: 'grammar',
      cefr: 'B2',
      correctAnswer: 'correct',
    },
    {
      id: 'eh-3',
      type: 'error-hunter',
      prompt: 'He told me that he didn\'t went to the meeting yesterday.',
      promptAr: 'هل تحتوي هذه الجملة على خطأ قواعدي؟',
      hasError: true,
      errorTarget: 'didn\'t went',
      correction: 'He told me that he didn\'t go to the meeting yesterday.',
      explanationAr: 'خطأ: بعد didn\'t يأتي دائماً الفعل في المصدر (go) وليس التصريف الثاني (went).',
      category: 'grammar',
      cefr: 'A2',
      correctAnswer: 'error',
    },
    {
      id: 'eh-4',
      type: 'error-hunter',
      prompt: 'If I had known about the workshop, I would have attended it.',
      promptAr: 'هل تحتوي هذه الجملة على خطأ قواعدي؟',
      hasError: false,
      correction: 'جملة شرطية ثالثة (Third Conditional) سليمة تماماً! ✅',
      explanationAr: 'تركيب صحيح: If + ماضي تام (had known)، وجواب الشرط would have + V3 (would have attended).',
      category: 'grammar',
      cefr: 'B2',
      correctAnswer: 'correct',
    },
    {
      id: 'eh-5',
      type: 'error-hunter',
      prompt: 'The new scientific results were published on last week.',
      promptAr: 'هل تحتوي هذه الجملة على خطأ قواعدي؟',
      hasError: true,
      errorTarget: 'on last week',
      correction: 'The new scientific results were published last week.',
      explanationAr: 'خطأ: لا نستخدم حرف الجر on قبل التعبيرات الزمنية المسبوقة بـ last أو next أو this.',
      category: 'grammar',
      cefr: 'B1',
      correctAnswer: 'error',
    },
    {
      id: 'eh-6',
      type: 'error-hunter',
      prompt: 'Despite she was exhausted, she finished the entire assignment.',
      promptAr: 'هل تحتوي هذه الجملة على خطأ قواعدي؟',
      hasError: true,
      errorTarget: 'Despite she was',
      correction: 'Although she was exhausted, she finished the entire assignment. / Despite being exhausted...',
      explanationAr: 'خطأ: Despite يأتي بعدها اسم أو gerund (V-ing)، أما الجملة الكاملة (فاعل وفعل) فتسبق بـ Although أو Even though.',
      category: 'grammar',
      cefr: 'B2',
      correctAnswer: 'error',
    },
    {
      id: 'eh-7',
      type: 'error-hunter',
      prompt: 'Neither the teacher nor the students were aware of the schedule change.',
      promptAr: 'هل تحتوي هذه الجملة على خطأ قواعدي؟',
      hasError: false,
      correction: 'الجملة صحيحة تماماً! ✅',
      explanationAr: 'صحيحة: مع Neither... nor يتبع الفعل الفاعل الأقرب له (the students جمع، لذا الفعل were).',
      category: 'grammar',
      cefr: 'C1',
      correctAnswer: 'correct',
    },
    {
      id: 'eh-8',
      type: 'error-hunter',
      prompt: 'I look forward to hear from you soon regarding this proposal.',
      promptAr: 'هل تحتوي هذه الجملة على خطأ قواعدي؟',
      hasError: true,
      errorTarget: 'to hear',
      correction: 'I look forward to hearing from you soon regarding this proposal.',
      explanationAr: 'خطأ: التعبير الاصطلاحي look forward to تتبعه to كحرف جر ويأتي بعدها V-ing (hearing).',
      category: 'grammar',
      cefr: 'B1',
      correctAnswer: 'error',
    }
  ];

  return shuffleArray(errorCases).slice(0, count);
}

/**
 * 5. SPELLING BEE GENERATOR
 * Authentic pronunciation-driven spelling challenge with phonetic support
 */
export async function generateSpellingBeeRound(count: number = 5): Promise<GameQuestion[]> {
  let vocabList: LexicalEntry[] = [];
  try {
    vocabList = await loadVocabularyCore();
  } catch {
    vocabList = [];
  }

  const pool = (vocabList.length >= 20 ? vocabList : (FALLBACK_VOCAB as LexicalEntry[]))
    .filter(w => w.headword && w.headword.length >= 4 && w.headword.length <= 10 && !w.headword.includes(' '));

  const picked = shuffleArray(pool).slice(0, count);

  return picked.map((item, index) => {
    return {
      id: `sb-${index}-${Date.now()}`,
      type: 'spelling',
      prompt: item.meaningAr,
      promptAr: 'استمع للنطق واكتب الكلمة الإنجليزية بالتهجئة الصحيحة تماماً:',
      audioText: item.headword,
      audioUrl: item.audioUsUrl || item.audioUkUrl,
      ipa: item.ipaUs || item.ipaUk,
      contextSentence: item.exampleEn,
      correctAnswer: item.headword.toLowerCase().trim(),
      explanationAr: `الكلمة: "${item.headword}" (${item.meaningAr}). النطق الصوتي: ${item.ipaUs || item.ipaUk || ''}. مثال: "${item.exampleEn || ''}"`,
      category: 'vocabulary',
      cefr: item.cefr || 'B1',
    };
  });
}

/**
 * 6. IDIOM & PHRASAL VERB QUEST
 * Real-world idioms and multi-word verbs from the 10,000 expressions collection
 */
export async function generateIdiomQuestRound(count: number = 6): Promise<GameQuestion[]> {
  let expressions: ExpressionEntry[] = [];
  try {
    expressions = await loadExpressions();
  } catch {
    expressions = [];
  }

  const fallbackExpressions: ExpressionEntry[] = [
    {
      id: 'f-exp-1',
      expression: 'break the ice',
      category: 'idiom',
      meaningAr: 'يكسر حاجز الصمت والجمود',
      definitionEn: 'To make people who have not met before feel more relaxed with each other.',
      exampleEn: 'He told a joke to break the ice at the start of the meeting.',
      exampleAr: 'قال مزحة ليكسر الجليد في بداية الاجتماع.',
      cefr: 'B2',
      formality: 'Neutral',
      domain: 'social'
    },
    {
      id: 'f-exp-2',
      expression: 'call it a day',
      category: 'idiom',
      meaningAr: 'ينهي العمل لهذا اليوم',
      definitionEn: 'To stop what you are doing because you do not want to do any more or think you have done enough.',
      exampleEn: 'We have made good progress, let’s call it a day.',
      exampleAr: 'حققنا تقدماً جيداً، دعنا ننهي العمل لهذا اليوم.',
      cefr: 'B1',
      formality: 'Conversational',
      domain: 'work'
    },
    {
      id: 'f-exp-3',
      expression: 'hit the nail on the head',
      category: 'idiom',
      meaningAr: 'يصيب كبد الحقيقة تماماً',
      definitionEn: 'To describe exactly what is causing a situation or problem.',
      exampleEn: 'Her analysis hit the nail on the head.',
      exampleAr: 'تحليلها أصاب كبد الحقيقة تماماً.',
      cefr: 'B2',
      formality: 'Conversational',
      domain: 'everyday'
    },
    {
      id: 'f-exp-4',
      expression: 'figure out',
      category: 'phrasal_verb',
      meaningAr: 'يكتشف / يجد حلاً لـ',
      definitionEn: 'To finally understand something or find the solution to a problem.',
      exampleEn: 'I need to figure out how this formula works.',
      exampleAr: 'أحتاج أن أفهم كيف تعمل هذه المعادلة.',
      cefr: 'B1',
      formality: 'Neutral',
      domain: 'academic'
    }
  ];

  const pool = expressions.length >= 10 ? expressions : fallbackExpressions;
  const picked = shuffleArray(pool).slice(0, count);

  return picked.map((item, index) => {
    const distractors = pool
      .filter(e => e.expression !== item.expression && e.meaningAr !== item.meaningAr)
      .slice(0, 3)
      .map(e => e.meaningAr);

    while (distractors.length < 3) {
      distractors.push('تعبير غير دقيق ' + (distractors.length + 1));
    }

    const options = shuffleArray([item.meaningAr, ...distractors]);

    return {
      id: `iq-${index}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.expression,
      promptAr: `ما المعنى الصحيح لهذا التعبير (${item.category === 'phrasal_verb' ? 'فعل مركب' : 'مصطلح اصطلاحي'}):`,
      contextSentence: item.exampleEn,
      audioText: item.expression,
      options,
      correctAnswer: item.meaningAr,
      correctAnswerIndex: options.indexOf(item.meaningAr),
      explanationAr: `التعبير: "${item.expression}" يعني (${item.meaningAr}). مثال: "${item.exampleEn || ''}" (${item.exampleAr || ''})`,
      category: 'vocabulary',
      cefr: item.cefr || 'B2',
    };
  });
}

/**
 * 7. AI DUEL & COMPETITIVE ARENA GENERATOR
 * Balanced mix of grammar, vocabulary, and usage for real-time 1v1 battles
 */
export async function generateDuelQuestions(count: number = 8): Promise<GameQuestion[]> {
  const grammarSample = shuffleArray(MASSIVE_QUESTION_BANK).slice(0, Math.ceil(count / 2));
  const vocabSample = await generateVocabularyRushRound('all', Math.floor(count / 2));

  const duelList: GameQuestion[] = [];

  grammarSample.forEach((q, idx) => {
    duelList.push({
      id: `duel-g-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: q.prompt,
      promptAr: q.promptAr || 'اختر الإجابة القواعدية الصحيحة:',
      options: q.options,
      correctAnswer: q.options[q.answerIndex],
      correctAnswerIndex: q.answerIndex,
      explanationAr: q.explanationAr,
      category: 'grammar',
      cefr: q.level,
    });
  });

  vocabSample.forEach(v => duelList.push(v));

  return shuffleArray(duelList).slice(0, count);
}
