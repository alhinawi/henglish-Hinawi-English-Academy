// ==============================================================================
// HENGLISH ACADEMY - DYNAMIC GAME GENERATION ENGINE
// Generates unlimited, adaptive educational challenges from 55,000+ vocabulary,
// 10,000+ expressions, 5,500 sentences, verbs toolkit & massive question bank.
// ==============================================================================

import { loadVocabularyCore, loadExpressions, LexicalEntry, ExpressionEntry } from './vocabularyService';
import { loadSentences, SentenceItem } from './sentencesService';
import { VERB_TOOLKIT } from '../data/verbsData';
import { MASSIVE_QUESTION_BANK, AssessmentQuestion } from '../data/massiveQuestionBank';

export interface GameQuestion {
  id: string;
  type:
    | 'multiple-choice'
    | 'tiles'
    | 'spelling'
    | 'error-hunter'
    | 'clue-reveal'
    | 'syllable-stress'
    | 'dictation'
    | 'reading-comprehension'
    | 'paragraph-ordering'
    | 'branching-story';
  prompt: string;
  promptAr?: string;
  contextSentence?: string;
  passage?: string; // For reading speedster & story
  audioText?: string;
  audioUrl?: string;
  audioAccent?: 'us' | 'uk';
  ipa?: string;
  options?: string[];
  correctAnswer: string;
  correctAnswerIndex?: number;
  explanationAr: string;
  clues?: string[]; // For clue reveal games
  scrambledTiles?: string[]; // For sentence & clause builder
  orderedItems?: string[]; // For paragraph builder
  hasError?: boolean; // For error hunter
  errorTarget?: string;
  correction?: string;
  syllables?: string[]; // For stress detective
  stressIndex?: number;
  rootWord?: string; // For word formation
  targetPos?: string;
  contrastWord?: string; // For minimal pairs
  category: string;
  cefr: string;
}

// Fallback vocabulary entries if offline
const FALLBACK_VOCAB: Partial<LexicalEntry>[] = [
  { headword: 'achieve', meaningAr: 'يحقق / ينجز', pos: 'verb', cefr: 'B1', ipaUs: '/əˈtʃiːv/', definitionEn: 'To successfully bring about a desired result by effort.', exampleEn: 'She worked hard to achieve her goals.', synonyms: ['accomplish', 'attain', 'reach'], antonyms: ['fail', 'abandon'] },
  { headword: 'resilient', meaningAr: 'مرن / قادر على التعافي', pos: 'adjective', cefr: 'B2', ipaUs: '/rɪˈzɪl.jənt/', definitionEn: 'Able to withstand or recover quickly from difficult conditions.', exampleEn: 'The team remained resilient despite setbacks.', synonyms: ['tough', 'adaptable', 'buoyant'], antonyms: ['fragile', 'vulnerable'] },
  { headword: 'collaborate', meaningAr: 'يتعاون', pos: 'verb', cefr: 'B2', ipaUs: '/kəˈlæb.ə.reɪt/', definitionEn: 'Work jointly on an activity or project.', exampleEn: 'We collaborated with international researchers.', synonyms: ['cooperate', 'team up', 'partner'], antonyms: ['compete', 'oppose'] },
  { headword: 'fluency', meaningAr: 'طلاقة لغوية', pos: 'noun', cefr: 'B1', ipaUs: '/ˈfluː.ən.si/', definitionEn: 'The ability to speak or write a foreign language easily and accurately.', exampleEn: 'Daily practice leads to natural fluency.', synonyms: ['eloquence', 'smoothness', 'command'], antonyms: ['hesitance', 'inarticulacy'] },
  { headword: 'comprehend', meaningAr: 'يستوعب / يفهم بعمق', pos: 'verb', cefr: 'B2', ipaUs: '/ˌkɑːm.prəˈhend/', definitionEn: 'To understand or grasp mentally.', exampleEn: 'He could not comprehend the magnitude of the discovery.', synonyms: ['understand', 'grasp', 'fathom'], antonyms: ['misunderstand', 'ignore'] },
  { headword: 'pivotal', meaningAr: 'محوري / حاسم', pos: 'adjective', cefr: 'C1', ipaUs: '/ˈpɪv.ə.t̬əl/', definitionEn: 'Of crucial importance in relation to the development of something.', exampleEn: 'This represents a pivotal moment in English education.', synonyms: ['crucial', 'vital', 'decisive'], antonyms: ['trivial', 'minor'] },
  { headword: 'eloquent', meaningAr: 'بليغ / فصيح', pos: 'adjective', cefr: 'C1', ipaUs: '/ˈel.ə.kwənt/', definitionEn: 'Fluent or persuasive in speaking or writing.', exampleEn: 'His speech was remarkably eloquent and moving.', synonyms: ['articulate', 'expressive', 'fluent'], antonyms: ['inarticulate', 'hesitant'] },
  { headword: 'endeavor', meaningAr: 'مسعى / جهد حثيث', pos: 'noun', cefr: 'C1', ipaUs: '/enˈdev.ɚ/', definitionEn: 'An attempt to achieve a goal.', exampleEn: 'Language mastery is a lifelong endeavor.', synonyms: ['undertaking', 'venture', 'effort'], antonyms: ['inactivity', 'sloth'] },
  { headword: 'abundant', meaningAr: 'وفير / غزير', pos: 'adjective', cefr: 'B2', ipaUs: '/əˈbʌn.dənt/', definitionEn: 'Existing or available in large quantities.', exampleEn: 'The forest has abundant natural resources.', synonyms: ['plentiful', 'copious', 'ample'], antonyms: ['scarce', 'meager'] },
  { headword: 'reluctant', meaningAr: 'متردد / غير راغب', pos: 'adjective', cefr: 'B2', ipaUs: '/rɪˈlʌk.tənt/', definitionEn: 'Unwilling and hesitant to do something.', exampleEn: 'He was reluctant to commit to the agreement.', synonyms: ['hesitant', 'unwilling', 'loath'], antonyms: ['eager', 'willing'] }
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ==============================================================================
// 1. VOCABULARY GENERATORS
// ==============================================================================

/**
 * 1.1 Vocabulary Rush
 */
export async function generateVocabularyRushRound(cefrFilter?: string, count: number = 8): Promise<GameQuestion[]> {
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
    const distractors = pool
      .filter(w => w.headword !== item.headword && w.meaningAr && w.meaningAr !== item.meaningAr)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaningAr);

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
 * 1.2 Word Detective
 */
export async function generateWordDetectiveRound(count: number = 5): Promise<GameQuestion[]> {
  let vocabList: LexicalEntry[] = [];
  try {
    vocabList = await loadVocabularyCore();
  } catch {
    vocabList = [];
  }

  const pool = (vocabList.length >= 20 ? vocabList : (FALLBACK_VOCAB as LexicalEntry[]))
    .filter(w => w.headword && w.headword.length >= 4 && w.definitionEn && w.meaningAr);

  const picked = shuffleArray(pool).slice(0, count);

  return picked.map((target, index) => {
    const word = target.headword;
    const masked = word[0] + ' ' + '_ '.repeat(word.length - 2) + word[word.length - 1];

    const clue1 = `نوع الكلمة (${target.pos}) والمستوى (${target.cefr || 'B1'}). التعريف: "${target.definitionEn.slice(0, 110)}..."`;
    const clue2 = target.exampleEn 
      ? `مثال مع إخفاء الكلمة: "${target.exampleEn.replace(new RegExp(word, 'gi'), '[ ________ ]')}" • المعنى بالعربية: (${target.meaningAr})`
      : `المعنى بالعربية: (${target.meaningAr})`;
    const clue3 = `الحروف الأولى والأخيرة: "${masked}" (طول الكلمة ${word.length} حروف)`;

    const distractors = pool
      .filter(w => w.headword !== word && Math.abs(w.headword.length - word.length) <= 2)
      .slice(0, 3)
      .map(w => w.headword);

    while (distractors.length < 3) {
      distractors.push('word' + (distractors.length + 1));
    }

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
 * 1.3 Synonym Hunter
 */
export async function generateSynonymHunterRound(count: number = 6): Promise<GameQuestion[]> {
  const curatedSynonyms = [
    { target: 'abundant', correct: 'plentiful', distractors: ['scarce', 'furious', 'shallow'], meaningAr: 'وفير / غزير', cefr: 'B2', example: 'There was an abundant supply of fresh water.' },
    { target: 'reluctant', correct: 'hesitant', distractors: ['eager', 'reckless', 'hasty'], meaningAr: 'متردد / غير راغب', cefr: 'B2', example: 'He was reluctant to sign the agreement.' },
    { target: 'pivotal', correct: 'crucial', distractors: ['minor', 'optional', 'fragile'], meaningAr: 'محوري / حاسم', cefr: 'C1', example: 'The meeting played a pivotal role in the negotiations.' },
    { target: 'eloquent', correct: 'articulate', distractors: ['muffled', 'silent', 'confused'], meaningAr: 'فصيح / بليغ', cefr: 'C1', example: 'She delivered an eloquent defense of human rights.' },
    { target: 'resilient', correct: 'tough', distractors: ['fragile', 'delicate', 'yielding'], meaningAr: 'مرن / قادر على الصمود', cefr: 'B2', example: 'The community remained resilient during the crisis.' },
    { target: 'authentic', correct: 'genuine', distractors: ['counterfeit', 'artificial', 'deceptive'], meaningAr: 'أصيل / حقيقي', cefr: 'B2', example: 'We visited an authentic traditional market.' },
    { target: 'diligent', correct: 'hardworking', distractors: ['slothful', 'careless', 'indifferent'], meaningAr: 'مجتهد / مثابر', cefr: 'B2', example: 'Her diligent efforts yielded great success.' },
    { target: 'ambiguous', correct: 'unclear', distractors: ['explicit', 'obvious', 'transparent'], meaningAr: 'غامض / يحتمل أكثر من معنى', cefr: 'C1', example: 'The contract clauses were surprisingly ambiguous.' },
  ];

  const picked = shuffleArray(curatedSynonyms).slice(0, count);

  return picked.map((item, index) => {
    const options = shuffleArray([item.correct, ...item.distractors]);
    return {
      id: `syn-${index}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.target,
      promptAr: `ما هو المترادف الدقيق (Synonym) للكلمة: "${item.target}"؟`,
      contextSentence: item.example,
      audioText: item.target,
      options,
      correctAnswer: item.correct,
      correctAnswerIndex: options.indexOf(item.correct),
      explanationAr: `المترادف الأدق لـ "${item.target}" هو "${item.correct}" (${item.meaningAr}). سياق: "${item.example}"`,
      category: 'vocabulary',
      cefr: item.cefr,
    };
  });
}

/**
 * 1.4 Antonym Arena
 */
export async function generateAntonymArenaRound(count: number = 6): Promise<GameQuestion[]> {
  const curatedAntonyms = [
    { target: 'scarce', correct: 'abundant', distractors: ['rare', 'empty', 'shallow'], meaningAr: 'شحيح / نادر vs وفير', cefr: 'B2' },
    { target: 'hostile', correct: 'friendly', distractors: ['aggressive', 'distant', 'fierce'], meaningAr: 'عدائي vs ودود', cefr: 'B2' },
    { target: 'lenient', correct: 'strict', distractors: ['gentle', 'tolerant', 'permissive'], meaningAr: 'متساهل vs حازم/صارم', cefr: 'C1' },
    { target: 'vague', correct: 'clear', distractors: ['foggy', 'hidden', 'obscure'], meaningAr: 'غامض vs واضح', cefr: 'B1' },
    { target: 'trivial', correct: 'vital', distractors: ['minor', 'petty', 'insignificant'], meaningAr: 'تافه vs حيوي/جوهري', cefr: 'B2' },
    { target: 'reluctant', correct: 'willing', distractors: ['hesitant', 'doubtful', 'shy'], meaningAr: 'متردد vs راغب/مستعد', cefr: 'B2' },
    { target: 'expand', correct: 'shrink', distractors: ['grow', 'extend', 'spread'], meaningAr: 'يتوسع vs ينكمش', cefr: 'B1' },
    { target: 'praise', correct: 'criticize', distractors: ['compliment', 'applaud', 'cheer'], meaningAr: 'يمدح vs ينتقد', cefr: 'B1' },
  ];

  const picked = shuffleArray(curatedAntonyms).slice(0, count);

  return picked.map((item, index) => {
    const options = shuffleArray([item.correct, ...item.distractors]);
    return {
      id: `ant-${index}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.target,
      promptAr: `ما هو الضد أو المعكوس المباشر (Antonym) للكلمة: "${item.target}"؟`,
      audioText: item.target,
      options,
      correctAnswer: item.correct,
      correctAnswerIndex: options.indexOf(item.correct),
      explanationAr: `عكس كلمة "${item.target}" هو "${item.correct}" (${item.meaningAr}).`,
      category: 'vocabulary',
      cefr: item.cefr,
    };
  });
}

/**
 * 1.5 Word Association
 */
export async function generateWordAssociationRound(count: number = 5): Promise<GameQuestion[]> {
  const associations = [
    {
      groupPrompt: 'طاقم المستشفى والرعاية الطبية 🏥',
      connected: 'physician',
      context: 'Stethoscope, Surgery, Prescription, Patient',
      options: ['physician', 'attorney', 'architect', 'plumber'],
      explanationAr: 'كلمة physician (طبيب) تنتمي لعالم الرعاية الطبية مع السماعة والجراحة والروشتة.',
      cefr: 'B1',
    },
    {
      groupPrompt: 'الملاحة الجوية والطيران ✈️',
      connected: 'cockpit',
      context: 'Runway, Altitude, Turbine, Turbulence',
      options: ['cockpit', 'basement', 'courtyard', 'balcony'],
      explanationAr: 'كلمة cockpit (مقصورة القيادة) تنتمي مباشرة لمجال الطيران والارتفاع والتوربينات.',
      cefr: 'B2',
    },
    {
      groupPrompt: 'العدالة والقانون ⚖️',
      connected: 'verdict',
      context: 'Judge, Jury, Testimony, Courthouse',
      options: ['verdict', 'recipe', 'landscape', 'symphony'],
      explanationAr: 'كلمة verdict (الحكم القضائي) ترتبط بالقاضي وهيئة المحلفين والشهادة.',
      cefr: 'B2',
    },
    {
      groupPrompt: 'البيئة والاستدامة 🌿',
      connected: 'ecosystem',
      context: 'Biodiversity, Habitat, Conservation, Renewable',
      options: ['ecosystem', 'invoice', 'mortgage', 'monopoly'],
      explanationAr: 'كلمة ecosystem (النظام البيئي) مرتبطة بالتنوع البيولوجي والموائل الطبيعية.',
      cefr: 'B2',
    },
    {
      groupPrompt: 'التمويل والاستثمار 💼',
      connected: 'dividend',
      context: 'Shares, Equity, Portfolio, Revenue',
      options: ['dividend', 'fluency', 'sonnet', 'palette'],
      explanationAr: 'كلمة dividend (توزيعات الأرباح) ترتبط بمحفظة الأسهم والإيرادات وحقوق الملكية.',
      cefr: 'C1',
    },
  ];

  return shuffleArray(associations).slice(0, count).map((item, idx) => ({
    id: `assoc-${idx}-${Date.now()}`,
    type: 'multiple-choice',
    prompt: item.context,
    promptAr: `أي من الكلمات التالية ترتبط دلالياً بهذه المجموعة (${item.groupPrompt})؟`,
    options: shuffleArray(item.options),
    correctAnswer: item.connected,
    explanationAr: item.explanationAr,
    category: 'vocabulary',
    cefr: item.cefr,
  }));
}

/**
 * 1.6 Context Master
 */
export async function generateContextMasterRound(count: number = 5): Promise<GameQuestion[]> {
  const contextQuestions = [
    {
      sentence: 'The CEO announced that the new project will ______ the company’s position in the global market.',
      correct: 'solidify',
      distractors: ['dissolve', 'weaken', 'hesitate'],
      explanationAr: 'الفعل solidify (يرسخ/يعزز) هو الأنسب لسياق تثبيت مكانة الشركة في السوق.',
      cefr: 'C1',
    },
    {
      sentence: 'Due to severe weather warnings, the airlines decided to ______ all domestic flights until tomorrow.',
      correct: 'cancel',
      distractors: ['invent', 'celebrate', 'accuse'],
      explanationAr: 'الفعل cancel (يلغي) هو الطبيعي لسياق التحذيرات الجوية الشديدة.',
      cefr: 'A2',
    },
    {
      sentence: 'Her explanations were so clear and concise that even beginners could ______ the concepts immediately.',
      correct: 'grasp',
      distractors: ['spill', 'overlook', 'neglect'],
      explanationAr: 'الفعل grasp (يستوعب/يفهم) هو الكلمة الدقيقة لسياق سهولة استيعاب المبتدئين للمفاهيم.',
      cefr: 'B2',
    },
    {
      sentence: 'Renewable energy investments have increased dramatically to ______ reliance on fossil fuels.',
      correct: 'curtail',
      distractors: ['amplify', 'boost', 'prolong'],
      explanationAr: 'الفعل curtail (يحد من / يقلص) هو الأنسب لسياق تقليل الاعتماد على الوقود الأحفوري.',
      cefr: 'C1',
    },
    {
      sentence: 'The young athlete showed immense ______ by recovering from injury to win the championship.',
      correct: 'perseverance',
      distractors: ['negligence', 'reluctance', 'cowardice'],
      explanationAr: 'كلمة perseverance (المثابرة والعزيمة) تعبر بدقة عن التعافي من الإصابة وتحقيق الفوز.',
      cefr: 'B2',
    },
  ];

  return shuffleArray(contextQuestions).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.correct, ...item.distractors]);
    return {
      id: `ctx-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.sentence.replace('______', '[ ________ ]'),
      promptAr: 'اختر الكلمة الأكثر ملاءمة ودقة لسياق الجملة:',
      options,
      correctAnswer: item.correct,
      correctAnswerIndex: options.indexOf(item.correct),
      explanationAr: item.explanationAr,
      category: 'vocabulary',
      cefr: item.cefr,
    };
  });
}

/**
 * 1.7 Phrasal Verb Quest
 */
export async function generatePhrasalQuestRound(count: number = 6): Promise<GameQuestion[]> {
  const phrasals = [
    { verb: 'look into', meaningAr: 'يتحقق من / يفحص المشكلة', correct: 'into', base: 'look', options: ['into', 'after', 'down', 'up to'], sentence: 'The director promised to look ______ the complaints immediately.', cefr: 'B1' },
    { verb: 'call off', meaningAr: 'يلغي الحدث أو الاجتماع', correct: 'off', base: 'call', options: ['off', 'on', 'up', 'out'], sentence: 'They decided to call ______ the match due to thunderous rain.', cefr: 'B1' },
    { verb: 'put off', meaningAr: 'يؤجل إلى وقت لاحق', correct: 'off', base: 'put', options: ['off', 'up with', 'on', 'down'], sentence: 'Never put ______ until tomorrow what you can do today.', cefr: 'B2' },
    { verb: 'run out of', meaningAr: 'ينفد منه الشيء', correct: 'out of', base: 'run', options: ['out of', 'into', 'over', 'away'], sentence: 'We need to hurry; we have run ______ time and ink.', cefr: 'A2' },
    { verb: 'come up with', meaningAr: 'يبتكر / يقترح فكرة', correct: 'up with', base: 'come', options: ['up with', 'across', 'down with', 'by'], sentence: 'She managed to come ______ an innovative design for the app.', cefr: 'B2' },
    { verb: 'bring about', meaningAr: 'يتسبب في إحداث تغيير', correct: 'about', base: 'bring', options: ['about', 'up', 'down', 'out'], sentence: 'Major reforms brought ______ substantial economic growth.', cefr: 'C1' },
  ];

  return shuffleArray(phrasals).slice(0, count).map((item, idx) => ({
    id: `phr-${idx}-${Date.now()}`,
    type: 'multiple-choice',
    prompt: item.sentence,
    promptAr: `أي حرف جر يكمل الفعل المركب ليعني (${item.meaningAr})؟`,
    audioText: item.verb,
    options: shuffleArray(item.options),
    correctAnswer: item.correct,
    explanationAr: `الفعل المركب "${item.verb}" يعني (${item.meaningAr}). مثال: "${item.sentence.replace('______', item.correct)}"`,
    category: 'vocabulary',
    cefr: item.cefr,
  }));
}

/**
 * 1.8 Idiom Explorer
 */
export async function generateIdiomExplorerRound(count: number = 5): Promise<GameQuestion[]> {
  const idioms = [
    { idiom: 'Bite the bullet', meaningAr: 'يتشجع ويواجه أمراً صعباً ومحتوماً', literalTrap: 'يعض رصاصة حقيقية بأسنانه', options: ['يتشجع ويواجه أمراً صعباً ومحتوماً', 'يعض رصاصة حقيقية بأسنانه', 'يطلق النار في المعركة', 'يرفض التحدث للآخرين'], cefr: 'B2', example: 'I hate dental work, but I will just have to bite the bullet.' },
    { idiom: 'Piece of cake', meaningAr: 'أمر غاية في السهولة والبساطة', literalTrap: 'قطعة كعك حلوة ولذيذة', options: ['أمر غاية في السهولة والبساطة', 'قطعة كعك حلوة ولذيذة', 'مهمة مستحيلة ومعقدة', 'مكافأة بعد عمل طويل'], cefr: 'A2', example: 'The driving exam was a piece of cake for him.' },
    { idiom: 'Spill the beans', meaningAr: 'يكشف سراً أو أمراً مخفياً دون قصد', literalTrap: 'يسكب الفاصوليا على الأرض', options: ['يكشف سراً أو أمراً مخفياً دون قصد', 'يسكب الفاصوليا على الأرض', 'يطبخ وجبة سريعة', 'ينفق أمواله بتهور'], cefr: 'B1', example: 'Don’t tell Mark about the surprise party; he will spill the beans!' },
    { idiom: 'Burn the midnight oil', meaningAr: 'يسهر لوقت متأخر في الدراسة أو العمل الشاق', literalTrap: 'يشعل مصباح الزيت القديم', options: ['يسهر لوقت متأخر في العمل أو الدراسة', 'يشعل مصباح الزيت القديم', 'يهدر الوقود في الرحلات', 'يستيقظ مع شروق الشمس'], cefr: 'B2', example: 'Students often burn the midnight oil before finals.' },
    { idiom: 'Under the weather', meaningAr: 'يشعر بالتعب أو الإعياء الخفيف', literalTrap: 'يقف تحت المطر والرياح', options: ['يشعر بالتعب أو الإعياء الخفيف', 'يقف تحت المطر والرياح', 'يراقب نشرة الأرصاد الجوية', 'يسافر في رحلة بحرية'], cefr: 'B1', example: 'She stayed home today because she felt a bit under the weather.' },
  ];

  return shuffleArray(idioms).slice(0, count).map((item, idx) => ({
    id: `idm-${idx}-${Date.now()}`,
    type: 'multiple-choice',
    prompt: item.idiom,
    promptAr: `ما المعنى الدلالي الحقيقي لهذا التعبير الاصطلاحي (Idiom): "${item.idiom}"؟`,
    contextSentence: item.example,
    audioText: item.idiom,
    options: shuffleArray(item.options),
    correctAnswer: item.meaningAr,
    explanationAr: `المصطلح "${item.idiom}" معناه: (${item.meaningAr}). مثال: "${item.example}"`,
    category: 'vocabulary',
    cefr: item.cefr,
  }));
}

/**
 * 1.9 Word Formation Lab
 */
export async function generateWordFormationRound(count: number = 5): Promise<GameQuestion[]> {
  const formations = [
    { root: 'success', targetPos: 'adjective (صفة)', correct: 'successful', distractors: ['successfully', 'succeed', 'succession'], meaningAr: 'ناجح', cefr: 'B1' },
    { root: 'create', targetPos: 'noun (اسم الشخص أو الشيء)', correct: 'creation', distractors: ['creative', 'creatively', 'creator'], meaningAr: 'ابتكار / إبداع', cefr: 'B1' },
    { root: 'danger', targetPos: 'adjective (صفة)', correct: 'dangerous', distractors: ['dangerously', 'endanger', 'dangerless'], meaningAr: 'خطير', cefr: 'A2' },
    { root: 'compete', targetPos: 'noun (اسم المنافسة)', correct: 'competition', distractors: ['competitive', 'competitor', 'competently'], meaningAr: 'منافسة / مسابقة', cefr: 'B1' },
    { root: 'deep', targetPos: 'noun (العمق)', correct: 'depth', distractors: ['deeply', 'deepen', 'deepness'], meaningAr: 'عمق', cefr: 'B2' },
    { root: 'wide', targetPos: 'noun (العرض / الاتساع)', correct: 'width', distractors: ['widely', 'widen', 'wideness'], meaningAr: 'اتساع / عرض', cefr: 'B2' },
    { root: 'accurate', targetPos: 'adverb (ظرف/حال)', correct: 'accurately', distractors: ['accuracy', 'accurateness', 'inaccurate'], meaningAr: 'بدقة', cefr: 'B2' },
  ];

  return shuffleArray(formations).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.correct, ...item.distractors]);
    return {
      id: `wf-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.root,
      promptAr: `حوّل جذر الكلمة "${item.root}" إلى ${item.targetPos}:`,
      rootWord: item.root,
      targetPos: item.targetPos,
      audioText: item.correct,
      options,
      correctAnswer: item.correct,
      correctAnswerIndex: options.indexOf(item.correct),
      explanationAr: `المشتق الصحيح من "${item.root}" كـ ${item.targetPos} هو "${item.correct}" (${item.meaningAr}).`,
      category: 'vocabulary',
      cefr: item.cefr,
    };
  });
}

/**
 * 1.10 Collocation Challenge
 */
export async function generateCollocationRound(count: number = 6): Promise<GameQuestion[]> {
  const collocations = [
    { prompt: 'She ______ a big mistake by deleting the unbacked database.', correct: 'made', distractors: ['did', 'took', 'created'], collocation: 'make a mistake', meaningAr: 'يرتكب خطأ', cefr: 'A2' },
    { prompt: 'Doctors advised him to ______ a habit of exercising every morning.', correct: 'make', distractors: ['do', 'form', 'catch'], collocation: 'make a habit of', meaningAr: 'يكتسب عادة', cefr: 'B1' },
    { prompt: 'The students are required to ______ research before presenting.', correct: 'do', distractors: ['make', 'compose', 'act'], collocation: 'do research', meaningAr: 'يقوم ببحث', cefr: 'B1' },
    { prompt: 'Please ______ close attention to the safety instructions.', correct: 'pay', distractors: ['give', 'make', 'put'], collocation: 'pay attention', meaningAr: 'ينتبه بشدة', cefr: 'B1' },
    { prompt: 'The lawyer tried to ______ doubt on the witness’s statement.', correct: 'cast', distractors: ['throw', 'make', 'put'], collocation: 'cast doubt', meaningAr: 'يلقي بظلال الشك', cefr: 'C1' },
    { prompt: 'We had to ______ a difficult decision under immense pressure.', correct: 'make', distractors: ['take', 'do', 'pass'], collocation: 'make a decision', meaningAr: 'يتخذ قراراً', cefr: 'B1' },
  ];

  return shuffleArray(collocations).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.correct, ...item.distractors]);
    return {
      id: `col-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.prompt,
      promptAr: 'اختر الفعل المتلازم طبيعياً في الإنجليزية (Natural Collocation):',
      options,
      correctAnswer: item.correct,
      correctAnswerIndex: options.indexOf(item.correct),
      explanationAr: `التلازم الصحيح هو "${item.collocation}" (${item.meaningAr}).`,
      category: 'vocabulary',
      cefr: item.cefr,
    };
  });
}

// ==============================================================================
// 2. GRAMMAR GENERATORS
// ==============================================================================

/**
 * 2.1 Sentence Builder (already exists, imported for completeness)
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
      english: 'If you had arrived earlier we could have watched the match together.',
      arabicEg: 'لو كنت جيت بدري شوية كنا نقدر نتفرج على الماتش سوا.',
      arabicFusha: 'لو كنت وصلت مبكراً لكان بإمكاننا مشاهدة المباراة معاً.',
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
    const cleanSentence = item.english.replace(/[.!?]+$/, '').trim();
    const words = cleanSentence.split(/\s+/);
    const scrambled = shuffleArray([...words]);

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
 * 2.2 Error Hunter (already exists, imported for completeness)
 */
export async function generateErrorHunterRound(count: number = 6): Promise<GameQuestion[]> {
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
      correction: 'Although she was exhausted, she finished the entire assignment.',
      explanationAr: 'خطأ: Despite يأتي بعدها اسم أو gerund، أما الجملة الكاملة فتسبق بـ Although أو Even though.',
      category: 'grammar',
      cefr: 'B2',
      correctAnswer: 'error',
    },
  ];

  return shuffleArray(errorCases).slice(0, count);
}

/**
 * 2.3 Grammar Tower
 */
export async function generateGrammarTowerRound(count: number = 8): Promise<GameQuestion[]> {
  const towerQuestions: GameQuestion[] = [
    {
      id: 'gt-1',
      type: 'multiple-choice',
      prompt: 'She ______ to school by bus every morning.',
      promptAr: 'الطابق ١ (المضارع البسيط A1):',
      options: ['goes', 'go', 'going', 'is go'],
      correctAnswer: 'goes',
      explanationAr: 'مع الضمائر المفردة الغائبة (He, She, It) نضيف s/es للفعل في المضارع البسيط.',
      category: 'grammar',
      cefr: 'A1',
    },
    {
      id: 'gt-2',
      type: 'multiple-choice',
      prompt: 'Yesterday, they ______ dinner at an Italian restaurant.',
      promptAr: 'الطابق ٢ (الماضي البسيط A2):',
      options: ['ate', 'eated', 'eat', 'eating'],
      correctAnswer: 'ate',
      explanationAr: 'الفعل eat شاذ وتصريفه الثاني في الماضي هو ate.',
      category: 'grammar',
      cefr: 'A2',
    },
    {
      id: 'gt-3',
      type: 'multiple-choice',
      prompt: 'I have lived in London ______ three years.',
      promptAr: 'الطابق ٣ (المضارع التام B1):',
      options: ['for', 'since', 'during', 'from'],
      correctAnswer: 'for',
      explanationAr: 'نستخدم for مع المدة الزمنية الإجمالية (three years)، بينما since مع نقطة البداية.',
      category: 'grammar',
      cefr: 'B1',
    },
    {
      id: 'gt-4',
      type: 'multiple-choice',
      prompt: 'By this time next year, she ______ her university degree.',
      promptAr: 'الطابق ٤ (المستقبل التام B2):',
      options: ['will have earned', 'will earn', 'earns', 'has earned'],
      correctAnswer: 'will have earned',
      explanationAr: 'صيغة By + وقت مستقبلي تتطلب المستقبل التام (will have + V3).',
      category: 'grammar',
      cefr: 'B2',
    },
    {
      id: 'gt-5',
      type: 'multiple-choice',
      prompt: 'If she ______ the train, she wouldn\'t have been late for the interview.',
      promptAr: 'الطابق ٥ (الحالة الشرطية الثالثة B2):',
      options: ['hadn\'t missed', 'didn\'t miss', 'hasn\'t missed', 'wouldn\'t miss'],
      correctAnswer: 'hadn\'t missed',
      explanationAr: 'في الحالة الشرطية الثالثة، جملة if تأخذ ماضي تام (had + V3) للتعبير عن ندم في الماضي.',
      category: 'grammar',
      cefr: 'B2',
    },
    {
      id: 'gt-6',
      type: 'multiple-choice',
      prompt: 'Not only ______ the report, but he also presented it brilliantly.',
      promptAr: 'الطابق ٦ (أسلوب التقديم Inversion C1):',
      options: ['did he write', 'he wrote', 'wrote he', 'he had written'],
      correctAnswer: 'did he write',
      explanationAr: 'عند بدء الجملة بـ Not only، نقلب الترتيب إلى صيغة الاستفهام (did + فاعل + مصدر).',
      category: 'grammar',
      cefr: 'C1',
    },
    {
      id: 'gt-7',
      type: 'multiple-choice',
      prompt: 'It is essential that every applicant ______ the medical assessment.',
      promptAr: 'الطابق ٧ (صيغة الطلب الافتراضي Subjunctive C1):',
      options: ['undergo', 'undergoes', 'underwent', 'undergoing'],
      correctAnswer: 'undergo',
      explanationAr: 'في صيغة الـ Subjunctive بعد صفات الإلزام مثل essential that، يأتي الفعل في المصدر المجرد.',
      category: 'grammar',
      cefr: 'C1',
    },
    {
      id: 'gt-8',
      type: 'multiple-choice',
      prompt: 'Hardly ______ the station when the train pulled away.',
      promptAr: 'الطابق ٨ (قمة البرج C2):',
      options: ['had we reached', 'we reached', 'did we reach', 'were we reaching'],
      correctAnswer: 'had we reached',
      explanationAr: 'Hardly... when تتطلب تقديم الفعل المساعد had على الفاعل في الماضي التام.',
      category: 'grammar',
      cefr: 'C2',
    },
  ];

  return towerQuestions.slice(0, count);
}

/**
 * 2.4 Tense Switch
 */
export async function generateTenseSwitchRound(count: number = 5): Promise<GameQuestion[]> {
  const switchCases = [
    {
      original: 'She writes insightful articles about technology.',
      fromTense: 'Present Simple',
      targetTense: 'Present Perfect',
      correct: 'She has written insightful articles about technology.',
      distractors: [
        'She wrote insightful articles about technology.',
        'She had written insightful articles about technology.',
        'She will write insightful articles about technology.'
      ],
      explanationAr: 'المضارع التام مع She يتكون من has + التصريف الثالث (has written).',
      cefr: 'B1',
    },
    {
      original: 'They built a state-of-the-art laboratory.',
      fromTense: 'Past Simple',
      targetTense: 'Future Perfect',
      correct: 'They will have built a state-of-the-art laboratory.',
      distractors: [
        'They will build a state-of-the-art laboratory.',
        'They would have built a state-of-the-art laboratory.',
        'They have built a state-of-the-art laboratory.'
      ],
      explanationAr: 'المستقبل التام يتكون من will have + التصريف الثالث (will have built).',
      cefr: 'B2',
    },
    {
      original: 'He was reading the final contract terms.',
      fromTense: 'Past Continuous',
      targetTense: 'Past Perfect',
      correct: 'He had read the final contract terms.',
      distractors: [
        'He has read the final contract terms.',
        'He had been reading the final contract terms.',
        'He read the final contract terms.'
      ],
      explanationAr: 'الماضي التام يتكون من had + التصريف الثالث للفعل (had read).',
      cefr: 'B1',
    },
    {
      original: 'We are completing the software upgrade.',
      fromTense: 'Present Continuous',
      targetTense: 'Past Continuous',
      correct: 'We were completing the software upgrade.',
      distractors: [
        'We have been completing the software upgrade.',
        'We had completed the software upgrade.',
        'We will be completing the software upgrade.'
      ],
      explanationAr: 'الماضي المستمر مع We يتكون من were + V-ing (were completing).',
      cefr: 'A2',
    },
    {
      original: 'The scientist uncovers an unexpected phenomenon.',
      fromTense: 'Present Simple',
      targetTense: 'Past Simple',
      correct: 'The scientist uncovered an unexpected phenomenon.',
      distractors: [
        'The scientist has uncovered an unexpected phenomenon.',
        'The scientist was uncovering an unexpected phenomenon.',
        'The scientist will uncover an unexpected phenomenon.'
      ],
      explanationAr: 'الماضي البسيط من الفعل المنتظم uncover هو بإضافة ed في آخره (uncovered).',
      cefr: 'A2',
    },
  ];

  return shuffleArray(switchCases).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.correct, ...item.distractors]);
    return {
      id: `ts-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.original,
      promptAr: `حوّل الجملة من (${item.fromTense}) إلى زمن: [ ${item.targetTense} ]`,
      options,
      correctAnswer: item.correct,
      correctAnswerIndex: options.indexOf(item.correct),
      explanationAr: item.explanationAr,
      category: 'grammar',
      cefr: item.cefr,
    };
  });
}

/**
 * 2.5 Passive Voice Converter
 */
export async function generatePassiveVoiceRound(count: number = 5): Promise<GameQuestion[]> {
  const passiveCases = [
    {
      active: 'The committee approved the budget proposal.',
      passive: 'The budget proposal was approved by the committee',
      tiles: ['The', 'budget', 'proposal', 'was', 'approved', 'by', 'the', 'committee'],
      explanationAr: 'في المبني للمجهول في الماضي البسيط: المفعول به + was/were + V3 + by + الفاعل.',
      cefr: 'B1',
    },
    {
      active: 'Engineers are testing the autonomous vehicles.',
      passive: 'The autonomous vehicles are being tested by engineers',
      tiles: ['The', 'autonomous', 'vehicles', 'are', 'being', 'tested', 'by', 'engineers'],
      explanationAr: 'في المضارع المستمر: are + being + التصريف الثالث (are being tested).',
      cefr: 'B2',
    },
    {
      active: 'The author will publish a groundbreaking novel.',
      passive: 'A groundbreaking novel will be published by the author',
      tiles: ['A', 'groundbreaking', 'novel', 'will', 'be', 'published', 'by', 'the', 'author'],
      explanationAr: 'في المستقبل البسيط: will + be + التصريف الثالث (will be published).',
      cefr: 'B1',
    },
    {
      active: 'They have finished the construction work.',
      passive: 'The construction work has been finished',
      tiles: ['The', 'construction', 'work', 'has', 'been', 'finished'],
      explanationAr: 'في المضارع التام: has/have + been + التصريف الثالث (has been finished).',
      cefr: 'B1',
    },
    {
      active: 'Alexander Fleming discovered penicillin in 1928.',
      passive: 'Penicillin was discovered by Alexander Fleming in 1928',
      tiles: ['Penicillin', 'was', 'discovered', 'by', 'Alexander', 'Fleming', 'in', '1928'],
      explanationAr: 'ماضي بسيط مبني للمجهول: was discovered by...',
      cefr: 'B1',
    },
  ];

  return shuffleArray(passiveCases).slice(0, count).map((item, idx) => {
    const scrambled = shuffleArray([...item.tiles]);
    if (scrambled.join(' ') === item.passive) {
      const temp = scrambled[0];
      scrambled[0] = scrambled[1];
      scrambled[1] = temp;
    }
    return {
      id: `pvc-${idx}-${Date.now()}`,
      type: 'tiles',
      prompt: `الجملة في المبني للمعلوم (Active): "${item.active}"`,
      promptAr: 'رتّب الكلمات لتحويل الجملة إلى المبني للمجهول (Passive Voice):',
      scrambledTiles: scrambled,
      correctAnswer: item.passive,
      explanationAr: item.explanationAr,
      category: 'grammar',
      cefr: item.cefr,
    };
  });
}

/**
 * 2.6 Conditional Architect
 */
export async function generateConditionalArchitectRound(count: number = 5): Promise<GameQuestion[]> {
  const conditionals = [
    {
      clauseIf: 'If water reaches 100 degrees Celsius,',
      correctResult: 'it boils.',
      distractors: ['it will boil.', 'it would boil.', 'it would have boiled.'],
      type: 'Zero Conditional (حقائق علمية)',
      explanationAr: 'الشرطية الصفرية تعبر عن حقائق عامة: If + مضارع بسيط -> مضارع بسيط.',
      cefr: 'A2',
    },
    {
      clauseIf: 'If it rains this afternoon,',
      correctResult: 'we will stay indoors.',
      distractors: ['we stayed indoors.', 'we would stay indoors.', 'we had stayed indoors.'],
      type: 'First Conditional (مستقبل محتمل)',
      explanationAr: 'الشرطية الأولى لاحتمالات المستقبل: If + مضارع بسيط -> will + المصدر.',
      cefr: 'B1',
    },
    {
      clauseIf: 'If I had a million dollars,',
      correctResult: 'I would travel the world.',
      distractors: ['I will travel the world.', 'I travelled the world.', 'I would have travelled the world.'],
      type: 'Second Conditional (افتراض خيالي حاضر)',
      explanationAr: 'الشرطية الثانية للمواقف الافتراضية غير الواقعية: If + ماضي بسيط -> would + المصدر.',
      cefr: 'B1',
    },
    {
      clauseIf: 'If we had booked earlier,',
      correctResult: 'we would have saved hundreds of dollars.',
      distractors: ['we will save hundreds of dollars.', 'we would save hundreds of dollars.', 'we had saved hundreds of dollars.'],
      type: 'Third Conditional (ندم على الماضي)',
      explanationAr: 'الشرطية الثالثة لشيء فات في الماضي: If + ماضي تام (had + V3) -> would have + V3.',
      cefr: 'B2',
    },
  ];

  return shuffleArray(conditionals).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.correctResult, ...item.distractors]);
    return {
      id: `ca-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.clauseIf,
      promptAr: `أكمل جملة الشرط [ ${item.type} ] بالجواب النحوي الدقيق:`,
      options,
      correctAnswer: item.correctResult,
      correctAnswerIndex: options.indexOf(item.correctResult),
      explanationAr: `${item.explanationAr} الجملة الكاملة: "${item.clauseIf} ${item.correctResult}"`,
      category: 'grammar',
      cefr: item.cefr,
    };
  });
}

/**
 * 2.7 Grammar Detective
 */
export async function generateGrammarDetectiveRound(count: number = 5): Promise<GameQuestion[]> {
  const detectiveCases = [
    {
      sentence: 'The rapidly evolving market requires swift adaptation.',
      word: 'rapidly',
      correctRole: 'Adverb (ظرف يصف صفة)',
      distractors: ['Adjective (صفة)', 'Noun (اسم)', 'Gerund (اسم فاعل)'],
      explanationAr: 'كلمة rapidly تنتهي بـ ly وتصف الصفة evolving (متطور بسرعة)، إذن هي Adverb.',
      cefr: 'B2',
    },
    {
      sentence: 'Swimming every morning keeps his mind sharp and focused.',
      word: 'Swimming',
      correctRole: 'Gerund (اسم فعل يعمل كفاعل للجملة)',
      distractors: ['Present Continuous Verb (فعل مضارع مستمر)', 'Adjective (صفة)', 'Preposition (حرف جر)'],
      explanationAr: 'Swimming هنا جاءت في موقع فاعل الجملة المفرد، فهي Gerund (اسم مصدر).',
      cefr: 'B1',
    },
    {
      sentence: 'Although tired, the researcher completed the trials.',
      word: 'Although',
      correctRole: 'Subordinating Conjunction (أداة ربط تفيد التناقض)',
      distractors: ['Preposition (حرف جر)', 'Relative Pronoun (ضمير وصل)', 'Modal Verb (فعل ناقص)'],
      explanationAr: 'كلمة Although هي أداة ربط ثانوية تربط الجملة التابعة بالجملة الرئيسية لإظهار التناقض.',
      cefr: 'B2',
    },
    {
      sentence: 'He gave her a valuable leather wallet.',
      word: 'valuable',
      correctRole: 'Adjective (صفة تصف الاسم wallet)',
      distractors: ['Adverb (ظرف)', 'Noun (اسم)', 'Pronoun (ضمير)'],
      explanationAr: 'كلمة valuable تصف الاسم wallet، لذا هي صفة (Adjective).',
      cefr: 'A2',
    },
  ];

  return shuffleArray(detectiveCases).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.correctRole, ...item.distractors]);
    return {
      id: `gd-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: `الجملة: "${item.sentence}" • الكلمة المستهدفة: [ ${item.word} ]`,
      promptAr: `ما هي الوظيفة النحوية الدقيقة للكلمة المستهدفة "${item.word}" في الجملة؟`,
      options,
      correctAnswer: item.correctRole,
      correctAnswerIndex: options.indexOf(item.correctRole),
      explanationAr: item.explanationAr,
      category: 'grammar',
      cefr: item.cefr,
    };
  });
}

// ==============================================================================
// 3. SPELLING & PRONUNCIATION GENERATORS
// ==============================================================================

/**
 * 3.1 Spelling Bee (already exists, imported for completeness)
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

  return picked.map((item, index) => ({
    id: `sb-${index}-${Date.now()}`,
    type: 'spelling',
    prompt: item.meaningAr || 'اكتب الكلمة',
    promptAr: 'استمع للنطق واكتب الكلمة الإنجليزية بالتهجئة الصحيحة تماماً:',
    audioText: item.headword,
    audioUrl: item.audioUsUrl || item.audioUkUrl,
    ipa: item.ipaUs || item.ipaUk,
    contextSentence: item.exampleEn,
    correctAnswer: item.headword.toLowerCase().trim(),
    explanationAr: `الكلمة: "${item.headword}" (${item.meaningAr}). النطق الصوتي: ${item.ipaUs || item.ipaUk || ''}. مثال: "${item.exampleEn || ''}"`,
    category: 'spelling',
    cefr: item.cefr || 'B1',
  }));
}

/**
 * 3.2 Pronunciation Arena (IPA Match)
 */
export async function generatePronunciationArenaRound(count: number = 6): Promise<GameQuestion[]> {
  const ipaCases = [
    { word: 'thought', ipa: '/θɔːt/', meaningAr: 'فكرة / ظن', distractors: ['/θruː/', '/tɔːt/', '/ðəʊ/'], explanationAr: 'كلمة thought تلفظ /θɔːt/ بصوت الثاء المرقق /θ/ والواو الممدودة /ɔː/ مع حرف gh صامت.', cefr: 'B1' },
    { word: 'comfortable', ipa: '/ˈkʌm.fɚ.tə.bəl/', meaningAr: 'مريح', distractors: ['/kəmˈfɔː.tə.bl/', '/ˈkɒm.fɔːt/', '/kəmˈfɜːr.tə.bl/'], explanationAr: 'تلفظ عادة بثلاثة أو أربعة مقاطع مع نبرة على المقطع الأول /ˈkʌm.fɚ.tə.bəl/.', cefr: 'A2' },
    { word: 'colonel', ipa: '/ˈkɜː.nəl/', meaningAr: 'عقيد (رتبة عسكرية)', distractors: ['/ˈkɒl.ə.nəl/', '/kəˈluː.nəl/', '/ˈkoʊl.nəl/'], explanationAr: 'من أشهر المفارقات الصوتية الإنجليزية: تكتب colonel لكنها تلفظ مثل kernel تماماً (/ˈkɜː.nəl/).', cefr: 'C1' },
    { word: 'subtle', ipa: '/ˈsʌt.əl/', meaningAr: 'دقيق / غير ملحوظ', distractors: ['/ˈsʌb.təl/', '/səbˈtaɪl/', '/ˈsuːt.əl/'], explanationAr: 'حرف b صامت تماماً في كلمة subtle ولا يلفظ أبداً (/ˈsʌt.əl/).', cefr: 'B2' },
    { word: 'receipt', ipa: '/rɪˈsiːt/', meaningAr: 'إيصال استلام', distractors: ['/rɪˈsiːpt/', '/ˈriː.sept/', '/rəˈkɪpt/'], explanationAr: 'حرف p صامت في receipt وتلفظ /rɪˈsiːt/.', cefr: 'A2' },
    { word: 'island', ipa: '/ˈaɪ.lənd/', meaningAr: 'جزيرة', distractors: ['/ˈaɪz.lənd/', '/ˈɪs.lənd/', '/ˈeɪ.lənd/'], explanationAr: 'حرف s صامت في island ولا يلفظ إطلاقاً (/ˈaɪ.lənd/).', cefr: 'A1' },
  ];

  return shuffleArray(ipaCases).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.ipa, ...item.distractors]);
    return {
      id: `ipa-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.word,
      promptAr: `ما هو الرمز الصوتي الدقيق (IPA) لنطق الكلمة: "${item.word}"؟`,
      audioText: item.word,
      ipa: item.ipa,
      options,
      correctAnswer: item.ipa,
      correctAnswerIndex: options.indexOf(item.ipa),
      explanationAr: item.explanationAr,
      category: 'spelling',
      cefr: item.cefr,
    };
  });
}

/**
 * 3.3 Minimal Pairs Challenge
 */
export async function generateMinimalPairsRound(count: number = 6): Promise<GameQuestion[]> {
  const pairs = [
    { target: 'ship', contrast: 'sheep', soundTarget: 'صوت /ɪ/ القصير', targetIpa: '/ʃɪp/', contrastIpa: '/ʃiːp/', audioText: 'ship', meaningTarget: 'سفينة', meaningContrast: 'خروف', cefr: 'A1' },
    { target: 'pen', contrast: 'pan', soundTarget: 'صوت /e/ القصير', targetIpa: '/pen/', contrastIpa: '/pæn/', audioText: 'pen', meaningTarget: 'قلم حبر', meaningContrast: 'مقلاة', cefr: 'A1' },
    { target: 'park', contrast: 'bark', soundTarget: 'صوت /p/ المهموس', targetIpa: '/pɑːrk/', contrastIpa: '/bɑːrk/', audioText: 'park', meaningTarget: 'حديقة/متنزه', meaningContrast: 'نباح الكلب', cefr: 'A2' },
    { target: 'reach', contrast: 'rich', soundTarget: 'صوت /iː/ الممدود', targetIpa: '/riːtʃ/', contrastIpa: '/rɪtʃ/', audioText: 'reach', meaningTarget: 'يصل إلى', meaningContrast: 'ثري/غني', cefr: 'A2' },
    { target: 'heart', contrast: 'hurt', soundTarget: 'صوت /ɑː/ المفتوح', targetIpa: '/hɑːrt/', contrastIpa: '/hɜːrt/', audioText: 'heart', meaningTarget: 'قلب', meaningContrast: 'يؤلم / يجرح', cefr: 'B1' },
    { target: 'live', contrast: 'leave', soundTarget: 'صوت /ɪ/ القصير', targetIpa: '/lɪv/', contrastIpa: '/liːv/', audioText: 'live', meaningTarget: 'يعيش', meaningContrast: 'يغادر', cefr: 'A1' },
  ];

  return shuffleArray(pairs).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.target, item.contrast]);
    return {
      id: `mp-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: `استمع للنطق الصوتي جيداً واعرف الكلمة المقروءة:`,
      promptAr: `هل الكلمة المنطوقة هي "${item.target}" (${item.meaningTarget}) أم "${item.contrast}" (${item.meaningContrast})؟`,
      audioText: item.audioText,
      ipa: item.targetIpa,
      options,
      correctAnswer: item.target,
      correctAnswerIndex: options.indexOf(item.target),
      explanationAr: `الكلمة المنطوقة هي "${item.target}" ${item.targetIpa} (${item.meaningTarget})، بينما "${item.contrast}" تلفظ ${item.contrastIpa} (${item.meaningContrast}).`,
      category: 'spelling',
      cefr: item.cefr,
    };
  });
}

/**
 * 3.4 Stress Detective
 */
export async function generateStressDetectiveRound(count: number = 5): Promise<GameQuestion[]> {
  const stressCases = [
    {
      word: 'photograph',
      syllables: ['PHO', 'to', 'graph'],
      stressedIndex: 1,
      options: ['المقطع الأول (PHO-to-graph)', 'المقطع الثاني (pho-TO-graph)', 'المقطع الثالث (pho-to-GRAPH)'],
      correctAnswer: 'المقطع الأول (PHO-to-graph)',
      explanationAr: 'في كلمة photograph النبرة على المقطع الأول /ˈfoʊ.tə.ɡræf/، بينما في photographer تنتقل للمقطع الثاني /fəˈtɑː.ɡrə.fɚ/.',
      cefr: 'B1',
    },
    {
      word: 'record (اسم / سجل)',
      syllables: ['RE', 'cord'],
      stressedIndex: 1,
      options: ['المقطع الأول (RE-cord)', 'المقطع الثاني (re-CORD)'],
      correctAnswer: 'المقطع الأول (RE-cord)',
      explanationAr: 'في الأسماء الإنجليزية الثنائية المقاطع تكون النبرة عادة على المقطع الأول (RE-cord /ˈrek.ɚd/)، بينما كفعل تكون على المقطع الثاني (re-CORD /rɪˈkɔːrd/).',
      cefr: 'B1',
    },
    {
      word: 'economic',
      syllables: ['e', 'co', 'NO', 'mic'],
      stressedIndex: 3,
      options: ['المقطع الأول (E-co-no-mic)', 'المقطع الثاني (e-CO-no-mic)', 'المقطع الثالث (e-co-NO-mic)', 'المقطع الرابع (e-co-no-MIC)'],
      correctAnswer: 'المقطع الثالث (e-co-NO-mic)',
      explanationAr: 'الكلمات التي تنتهي باللاحقة -ic تقع النبرة فيها دائماً على المقطع الذي يسبقها مباشرة (/ˌiː.kəˈnɑː.mɪk/).',
      cefr: 'B2',
    },
    {
      word: 'decision',
      syllables: ['de', 'CI', 'sion'],
      stressedIndex: 2,
      options: ['المقطع الأول (DE-ci-sion)', 'المقطع الثاني (de-CI-sion)', 'المقطع الثالث (de-ci-SION)'],
      correctAnswer: 'المقطع الثاني (de-CI-sion)',
      explanationAr: 'الكلمات التي تنتهي بـ -sion تقع النبرة فيها دائماً على المقطع السابق (/dɪˈsɪʒ.ən/).',
      cefr: 'A2',
    },
  ];

  return shuffleArray(stressCases).slice(0, count).map((item, idx) => ({
    id: `sd-${idx}-${Date.now()}`,
    type: 'syllable-stress',
    prompt: item.word,
    promptAr: `أين يقع المقطع المشدد الرئيسي (Primary Stress) في كلمة: "${item.word}"؟`,
    audioText: item.word.split(' ')[0],
    options: item.options,
    correctAnswer: item.correctAnswer,
    correctAnswerIndex: item.options.indexOf(item.correctAnswer),
    explanationAr: item.explanationAr,
    category: 'spelling',
    cefr: item.cefr,
  }));
}

/**
 * 3.5 Phoneme Match
 */
export async function generatePhonemeMatchRound(count: number = 5): Promise<GameQuestion[]> {
  const phonemes = [
    { symbol: '/θ/', name: 'صوت الثاء المرقق', exampleWord: 'theater', distractors: ['this', 'tree', 'tide'], explanationAr: 'الرمز /θ/ يمثل صوت الثاء كما في theater و think و thought.', cefr: 'A2' },
    { symbol: '/ð/', name: 'صوت الذال الجهور', exampleWord: 'breathe', distractors: ['breath', 'brief', 'bright'], explanationAr: 'الرمز /ð/ يمثل صوت الذال كما في breathe و father و they.', cefr: 'B1' },
    { symbol: '/ʃ/', name: 'صوت الشين', exampleWord: 'machine', distractors: ['match', 'ache', 'chemist'], explanationAr: 'الرمز /ʃ/ يمثل صوت الشين، وفي machine يلفظ الحرفان ch شِيناً ناعماً.', cefr: 'B1' },
    { symbol: '/tʃ/', name: 'صوت تش', exampleWord: 'challenge', distractors: ['character', 'chef', 'chorus'], explanationAr: 'الرمز /tʃ/ يمثل صوت تش الصريح كما في challenge و church.', cefr: 'A2' },
    { symbol: '/ŋ/', name: 'صوت النون الأنفية (الغنة)', exampleWord: 'singing', distractors: ['sin', 'sign', 'sink'], explanationAr: 'الرمز /ŋ/ يمثل صوت النون الأنفية المصاحبة لـ ng في singing.', cefr: 'B1' },
  ];

  return shuffleArray(phonemes).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.exampleWord, ...item.distractors]);
    return {
      id: `phm-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.symbol,
      promptAr: `أي كلمة من الكلمات التالية تحتوي على الصوت الصوتي [ ${item.symbol} ] (${item.name})؟`,
      audioText: item.exampleWord,
      options,
      correctAnswer: item.exampleWord,
      correctAnswerIndex: options.indexOf(item.exampleWord),
      explanationAr: item.explanationAr,
      category: 'spelling',
      cefr: item.cefr,
    };
  });
}

// ==============================================================================
// 4. LISTENING GENERATORS
// ==============================================================================

/**
 * 4.1 Listening Detective
 */
export async function generateListeningDetectiveRound(count: number = 4): Promise<GameQuestion[]> {
  const audioCases = [
    {
      spoken: 'The flight to Chicago has been delayed by two hours due to dense fog.',
      question: 'لماذا تأخرت الرحلة المتجهة إلى شيكاغو؟',
      correct: 'بسبب الضباب الكثيف',
      distractors: ['بسبب عطل في المحرك', 'بسبب إضراب العمال', 'بسبب عاصفة ثلجية'],
      explanationAr: 'النص الصوتي يقول: "...due to dense fog" أي بسبب الضباب الكثيف.',
      cefr: 'A2',
    },
    {
      spoken: 'Please submit your quarterly financial reports by Friday at 5 PM.',
      question: 'ما هو الموعد النهائي لتسليم التقارير المالية؟',
      correct: 'يوم الجمعة في تمام الساعة الخامسة مساءً',
      distractors: ['يوم الخميس ظهراً', 'يوم الجمعة صباحاً', 'يوم الإثنين القادم'],
      explanationAr: 'النص الصوتي: "...by Friday at 5 PM".',
      cefr: 'B1',
    },
    {
      spoken: 'The company decided to open its European headquarters in Amsterdam rather than Berlin.',
      question: 'أين قررت الشركة افتتاح مقرها الأوروبي؟',
      correct: 'في أمستردام بدلاً من برلين',
      distractors: ['في برلين بدلاً من أمستردام', 'في لندن', 'في باريس'],
      explanationAr: 'النص الصوتي: "...in Amsterdam rather than Berlin".',
      cefr: 'B2',
    },
    {
      spoken: 'Although the initial prototype failed the stress test, the second iteration performed exceptionally well.',
      question: 'كيف كان أداء النسخة التجريبية الثانية؟',
      correct: 'أدت بشكل ممتاز وتفوقت على الاختبارات',
      distractors: ['فشلت مثل النسخة الأولى', 'تم إلغاؤها كلياً', 'احتاجت لإعادة تصميم كاملة'],
      explanationAr: 'النص: "...the second iteration performed exceptionally well".',
      cefr: 'B2',
    },
  ];

  return shuffleArray(audioCases).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.correct, ...item.distractors]);
    return {
      id: `ld-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.question,
      promptAr: 'استمع للمقطع الصوتي بعناية وأجب عن السؤال التالي:',
      audioText: item.spoken,
      options,
      correctAnswer: item.correct,
      correctAnswerIndex: options.indexOf(item.correct),
      explanationAr: `${item.explanationAr} النص الكامل: "${item.spoken}"`,
      category: 'listening',
      cefr: item.cefr,
    };
  });
}

/**
 * 4.2 Dictation Challenge
 */
export async function generateDictationRound(count: number = 4): Promise<GameQuestion[]> {
  const dictationCases = [
    { sentence: 'Success comes from consistency and continuous learning.', meaningAr: 'النجاح يأتي من الاستمرارية والتعلم المستمر.', cefr: 'B1' },
    { sentence: 'We need to schedule another meeting for tomorrow morning.', meaningAr: 'نحتاج لجدولة اجتماع آخر لصباح الغد.', cefr: 'A2' },
    { sentence: 'The university library offers digital resources for researchers.', meaningAr: 'توفر مكتبة الجامعة موارد رقمية للباحثين.', cefr: 'B1' },
    { sentence: 'Critical thinking enables professionals to solve intricate problems.', meaningAr: 'التفكير النقدي يمكن المحترفين من حل المشكلات المعقدة.', cefr: 'B2' },
  ];

  return shuffleArray(dictationCases).slice(0, count).map((item, idx) => ({
    id: `dc-${idx}-${Date.now()}`,
    type: 'dictation',
    prompt: item.meaningAr,
    promptAr: 'استمع للجملة المنطوقة كاملة واكتبها في المربع بدقة إملائية عالية:',
    audioText: item.sentence,
    correctAnswer: item.sentence.toLowerCase().replace(/[.!?]+$/, '').trim(),
    explanationAr: `الجملة المنطوقة الصحيحة: "${item.sentence}" (${item.meaningAr})`,
    category: 'listening',
    cefr: item.cefr,
  }));
}

/**
 * 4.3 Listening Gap Fill
 */
export async function generateListeningGapFillRound(count: number = 5): Promise<GameQuestion[]> {
  const gapCases = [
    { sentence: 'The team managed to achieve outstanding results this quarter.', missingWord: 'outstanding', maskedSentence: 'The team managed to achieve [ ________ ] results this quarter.', meaningAr: 'استثنائية / باهرة', cefr: 'B2' },
    { sentence: 'Regular exercise improves both physical and mental health.', missingWord: 'physical', maskedSentence: 'Regular exercise improves both [ ________ ] and mental health.', meaningAr: 'البدنية / الجسدية', cefr: 'A2' },
    { sentence: 'He was reluctant to sign the agreement without his lawyer.', missingWord: 'reluctant', maskedSentence: 'He was [ ________ ] to sign the agreement without his lawyer.', meaningAr: 'متردداً / غير راغب', cefr: 'B2' },
    { sentence: 'The manager gave clear instructions before starting the project.', missingWord: 'instructions', maskedSentence: 'The manager gave clear [ ________ ] before starting the project.', meaningAr: 'تعليمات / إرشادات', cefr: 'B1' },
  ];

  return shuffleArray(gapCases).slice(0, count).map((item, idx) => ({
    id: `lgf-${idx}-${Date.now()}`,
    type: 'spelling',
    prompt: item.maskedSentence,
    promptAr: 'استمع للتسجيل الصوتي واكتب الكلمة المحذوفة من النص بدقة:',
    audioText: item.sentence,
    correctAnswer: item.missingWord.toLowerCase().trim(),
    explanationAr: `الكلمة المحذوفة هي "${item.missingWord}" (${item.meaningAr}). النص الكامل: "${item.sentence}"`,
    category: 'listening',
    cefr: item.cefr,
  }));
}

/**
 * 4.4 Accent Detective
 */
export async function generateAccentDetectiveRound(count: number = 5): Promise<GameQuestion[]> {
  const accentCases = [
    { prompt: 'شقة سكنية (Apartment في أمريكا) ماذا تسمى في بريطانيا؟', correct: 'flat', distractors: ['condo', 'cabin', 'loft'], explanationAr: 'في بريطانيا تسمى flat بينما في أمريكا apartment.', cefr: 'A2' },
    { prompt: 'الرصيف المخصص للمشاة (Sidewalk في أمريكا) ماذا يسمى في بريطانيا؟', correct: 'pavement', distractors: ['highway', 'crosswalk', 'trail'], explanationAr: 'في بريطانيا pavement وفي أمريكا sidewalk.', cefr: 'B1' },
    { prompt: 'فصل الخريف (Fall في أمريكا) ماذا يسمى في بريطانيا؟', correct: 'autumn', distractors: ['harvest', 'winter', 'spring'], explanationAr: 'في الإنجليزية البريطانية autumn وفي الأمريكية fall.', cefr: 'A2' },
    { prompt: 'صندوق السيارة الخلفي (Trunk في أمريكا) ماذا يسمى في بريطانيا؟', correct: 'boot', distractors: ['bonnet', 'hood', 'bumper'], explanationAr: 'في بريطانيا boot بينما في أمريكا trunk.', cefr: 'B1' },
    { prompt: 'أي من الكلمات التالية تمثل التهجئة البريطانية الرسمية؟', correct: 'colour', distractors: ['color', 'colur', 'colore'], explanationAr: 'التهجئة البريطانية تكتب colour مع ou بينما الأمريكية color مع o فقط.', cefr: 'A2' },
  ];

  return shuffleArray(accentCases).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.correct, ...item.distractors]);
    return {
      id: `acc-${idx}-${Date.now()}`,
      type: 'multiple-choice',
      prompt: item.prompt,
      promptAr: 'تحدي الفروق بين اللهجة الأمريكية والبريطانية (US vs UK):',
      options,
      correctAnswer: item.correct,
      correctAnswerIndex: options.indexOf(item.correct),
      explanationAr: item.explanationAr,
      category: 'listening',
      cefr: item.cefr,
    };
  });
}

// ==============================================================================
// 5. READING & WRITING GENERATORS
// ==============================================================================

/**
 * 5.1 Reading Speedster
 */
export async function generateReadingSpeedsterRound(count: number = 3): Promise<GameQuestion[]> {
  const passages = [
    {
      passage: 'Artificial intelligence is rapidly transforming language acquisition. Modern adaptive algorithms analyze learners’ errors in real time, serving customized exercises that address specific grammatical weaknesses. Rather than memorizing static word lists, students engage with conversational context, acquiring vocabulary naturally.',
      question: 'وفقاً للنص، ما الميزة الرئيسية للخوارزميات التكيفية الحديثة؟',
      correct: 'تحليل أخطاء المتعلمين بالوقت الحقيقي وتقديم تمارين مخصصة',
      distractors: ['إجبار الطلاب على حفظ قوائم كلمات جامدة', 'إلغاء الحاجة للمعلمين البشريين نهائياً', 'التركيز على القواعد النظرية دون سياق'],
      explanationAr: 'يذكر النص بوضوح أن الخوارزميات تحلل الأخطاء بالوقت الحقيقي وتقدم تمارين تستهدف نقاط الضعف.',
      cefr: 'B2',
    },
    {
      passage: 'The Great Fire of London in September 1666 destroyed over thirteen thousand houses and eighty-seven parish churches, including the original St Paul’s Cathedral. Despite the vast devastation, the recorded death toll was remarkably low, although thousands were left homeless in makeshift camps.',
      question: 'ما الأمر اللافت المذكور في النص بخصوص حريق لندن الكبير رغم الدمار الهائل؟',
      correct: 'أن عدد الوفيات المسجلة كان منخفضاً بشكل ملحوظ',
      distractors: ['أن كاتدرائية القديس بولس لم تتأثر بالحريق', 'أن الحريق استمر لمدة عامين كاملين', 'أن جميع البيوت تم إعادة بنائها في أسبوع واحد'],
      explanationAr: 'يذكر النص: "Despite the vast devastation, the recorded death toll was remarkably low".',
      cefr: 'B1',
    },
  ];

  return shuffleArray(passages).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.correct, ...item.distractors]);
    return {
      id: `rs-${idx}-${Date.now()}`,
      type: 'reading-comprehension',
      prompt: item.question,
      promptAr: 'اقرأ النص جيداً ثم أجب عن سؤال الاستيعاب:',
      passage: item.passage,
      options,
      correctAnswer: item.correct,
      correctAnswerIndex: options.indexOf(item.correct),
      explanationAr: item.explanationAr,
      category: 'reading',
      cefr: item.cefr,
    };
  });
}

/**
 * 5.2 Paragraph Builder
 */
export async function generateParagraphBuilderRound(count: number = 3): Promise<GameQuestion[]> {
  const paragraphs = [
    {
      topicAr: 'مراحل التكيف مع لغة جديدة 🧠',
      ordered: [
        'First, learners must build a solid foundation of essential vocabulary and core grammatical structures.',
        'Next, consistent listening to native speakers helps train the ear to natural rhythm and connected speech.',
        'Then, speaking practice transforms passive recognition into active, spontaneous expression.',
        'Finally, regular immersion and cultural context enable near-native fluency and intuitive command.'
      ],
      explanationAr: 'الترتيب المنطقي يتبع علامات التسلسل الزمني: First -> Next -> Then -> Finally.',
      cefr: 'B1',
    },
    {
      topicAr: 'تطور الحوسبة السحابية ☁️',
      ordered: [
        'In the early days of computing, organizations maintained massive physical servers on their own premises.',
        'However, maintaining this local hardware was both prohibitively expensive and difficult to scale.',
        'Consequently, centralized data centers emerged, allowing companies to rent computing power on demand.',
        'Today, global cloud architecture powers virtually every modern mobile application and web service.'
      ],
      explanationAr: 'التسلسل المنطقي: البداية التاريخية -> المشكلة والتكلفة -> الحل ونشوء المراكز -> واقع الحوسبة اليوم.',
      cefr: 'B2',
    },
  ];

  return shuffleArray(paragraphs).slice(0, count).map((item, idx) => {
    const scrambled = shuffleArray([...item.ordered]);
    return {
      id: `pb-${idx}-${Date.now()}`,
      type: 'paragraph-ordering',
      prompt: `الموضوع: ${item.topicAr}`,
      promptAr: 'أعد ترتيب الجمل لتكوين فقرة مقالية متماسكة ومنطقية الأفكار:',
      orderedItems: item.ordered,
      scrambledTiles: scrambled,
      correctAnswer: item.ordered.join('\n'),
      explanationAr: item.explanationAr,
      category: 'reading',
      cefr: item.cefr,
    };
  });
}

/**
 * 5.3 Story Completion
 */
export async function generateStoryCompletionRound(count: number = 4): Promise<GameQuestion[]> {
  const stories = [
    {
      passage: 'Detective Harrison arrived at the museum long after midnight. The glass display case was completely intact, yet the priceless ancient sapphire was gone. Looking closer at the perimeter sensors, he noticed something unusual.',
      prompt: 'ما الخطوة المنطقية والنحوية السليمة التالية التي اتخذها المحقق؟',
      correct: 'He realized the alarm had been deactivated from an internal terminal before the theft.',
      distractors: [
        'He decided to buy a ticket and come back during normal visiting hours tomorrow.',
        'He has deactivated the alarm because he liked the shiny sapphire.',
        'The sapphire was eating breakfast in the museum cafe.'
      ],
      explanationAr: 'الخيار الصحيح يكمل التحقيق البوليسي المنطقي مع زمن الماضي التام المبني للمجهول (had been deactivated).',
      cefr: 'B2',
    },
    {
      passage: 'Laila was preparing for her first international tech conference in London. She had spent weeks polishing her presentation slides, but on the morning of the keynote, the conference projector suddenly malfunctioned.',
      prompt: 'كيف تعاملت ليلى مع الموقف باحترافية؟',
      correct: 'She remained calm and delivered her speech seamlessly using interactive demonstrations.',
      distractors: [
        'She cancels the entire trip and flew immediately back home in tears.',
        'The projector was happy to speak instead of Laila.',
        'She complained loudly until the security escorted her outside.'
      ],
      explanationAr: 'السياق الإيجابي الاحترافي: She remained calm and delivered her speech seamlessly...',
      cefr: 'B1',
    },
  ];

  return shuffleArray(stories).slice(0, count).map((item, idx) => {
    const options = shuffleArray([item.correct, ...item.distractors]);
    return {
      id: `sc-${idx}-${Date.now()}`,
      type: 'branching-story',
      prompt: item.prompt,
      promptAr: 'اقرأ بداية القصة واختر التكملة المنطقية والقواعدية الأنسب:',
      passage: item.passage,
      options,
      correctAnswer: item.correct,
      correctAnswerIndex: options.indexOf(item.correct),
      explanationAr: item.explanationAr,
      category: 'reading',
      cefr: item.cefr,
    };
  });
}

// ==============================================================================
// 6. AI DUEL & GENERAL MULTI-CHOICE GENERATOR
// ==============================================================================

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
