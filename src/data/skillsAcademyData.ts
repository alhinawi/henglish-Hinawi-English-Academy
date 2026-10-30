import { CEFRLevel, QuizQuestion } from '../types';

// ==========================================
// 1. LISTENING ACADEMY DATA
// ==========================================
export interface ListeningTrack {
  id: string;
  title: string;
  titleAr: string;
  level: CEFRLevel;
  accent: 'American' | 'British' | 'Australian';
  duration: string;
  category: string;
  transcript: string;
  transcriptAr: string;
  dictationSentence: string;
  comprehensionQuiz: QuizQuestion[];
}

export const LISTENING_TRACKS: ListeningTrack[] = [
  {
    id: 'list-1',
    title: 'Airport Flight Announcement & Boarding Gate',
    titleAr: 'إعلان رحلة المطار وبوابة الصعود للطائرة',
    level: 'A2',
    accent: 'British',
    duration: '1:15',
    category: 'Travel & Transport',
    transcript:
      'Good afternoon, passengers. This is the final boarding call for British Airways flight BA 249 to London Heathrow. All ticketed passengers should proceed immediately to gate B12. Please have your boarding pass and passport open and ready for inspection. The aircraft doors will close in approximately ten minutes. Thank you.',
    transcriptAr:
      'مساء الخير لجميع المسافرين. هذا هو النداء الأخير لصعود ركاب الخطوط الجوية البريطانية رحلة BA 249 المتجهة إلى لندن هيثرو. يرجى من جميع المسافرين التوجه فوراً إلى البوابة B12 مع تجهيز بطاقة الصعود وجواز السفر للمعاينة. ستُغلق أبواب الطائرة خلال عشر دقائق تقريباً. شكراً لكم.',
    dictationSentence: 'All ticketed passengers should proceed immediately to gate B12.',
    comprehensionQuiz: [
      {
        id: 'lq1',
        question: 'What is the flight number mentioned in the announcement?',
        options: ['BA 249', 'BA 124', 'BA 942', 'BA 12'],
        answer: 0,
        explanation: 'The announcer clearly states: flight BA 249 to London Heathrow.',
        topic: 'Details Listening',
        difficulty: 'beginner',
      },
      {
        id: 'lq2',
        question: 'How much time remains before the aircraft doors close?',
        options: ['Five minutes', 'Approximately ten minutes', 'Twenty minutes', 'One hour'],
        answer: 1,
        explanation: 'The announcement says: The aircraft doors will close in approximately ten minutes.',
        topic: 'Time Comprehension',
        difficulty: 'beginner',
      },
    ],
  },
  {
    id: 'list-2',
    title: 'Tech Startup Sprint Planning Meeting',
    titleAr: 'اجتماع تخطيط سبرنت التطوير البرمجي',
    level: 'B2',
    accent: 'American',
    duration: '1:45',
    category: 'Tech & Business',
    transcript:
      'Welcome everyone to sprint 14 planning. By next Tuesday morning, our engineering squad will have deployed the new database indexing layer to the staging cluster. Kareem, will you have finished the automated unit test suite before the code freeze on Thursday night? If so, we will have verified all critical user journeys before our CEO presents to the board.',
    transcriptAr:
      'مرحباً بالجميع في اجتماع تخطيط السبرنت 14. بحلول صباح الثلاثاء القادم، سيكون فريق الهندسة قد نشر طبقة فهارس قواعد البيانات الجديدة على بيئة الاختبار. كريم، هل ستكون قد أنهيت حزمة الاختبارات الآلية قبل تجميد الكود ليلة الخميس؟ إذا حدث ذلك، سنكون قد تحققنا من جميع مسارات المستخدم الحرجة قبل عرض الرئيس التنفيذي على مجلس الإدارة.',
    dictationSentence: 'By next Tuesday morning, our engineering squad will have deployed the new database indexing layer.',
    comprehensionQuiz: [
      {
        id: 'lq3',
        question: 'What tense is repeatedly used to coordinate sprint deadlines?',
        options: ['Past Continuous', 'Future Perfect', 'Present Simple', 'Past Perfect'],
        answer: 1,
        explanation: 'Phrases like "will have deployed" and "will have verified" showcase Future Perfect for deadlines.',
        topic: 'Grammar in Listening',
        difficulty: 'intermediate',
      },
    ],
  },
];

// ==========================================
// 2. READING ACADEMY DATA
// ==========================================
export interface ReadingPassage {
  id: string;
  title: string;
  titleAr: string;
  level: CEFRLevel;
  wordCount: number;
  estimatedTime: string;
  category: string;
  content: string;
  contentAr: string;
  comprehensionQuestions: QuizQuestion[];
}

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'read-1',
    title: 'The Great AI Revolution in Modern Education',
    titleAr: 'ثورة الذكاء الاصطناعي في التعليم الحديث',
    level: 'B1',
    wordCount: 165,
    estimatedTime: '3 دقائق',
    category: 'Technology & EdTech',
    content:
      'Education is undergoing its most profound transformation since the invention of the printing press. Modern language platforms now utilize artificial intelligence to deliver bespoke learning pathways tailored to each student’s unique pace. By the end of this decade, educational researchers predict that over eighty percent of adult language learners will have adopted personalized interactive tutors. Instead of passive memorization, students actively converse with dynamic systems, receiving instantaneous phonetic feedback and tailored grammar corrections. This democratization of high-quality education means that mastery of global languages like English is no longer restricted by geographic location or prohibitive tuition fees.',
    contentAr:
      'يشهد التعليم أعمق تحول له منذ اختراع المطبعة. تستخدم منصات اللغات الحديثة الآن الذكاء الاصطناعي لتقديم مسارات تعليمية مخصصة تناسب وتيرة كل طالب. بحلول نهاية هذا العقد، يتوقع باحثو التعليم أن أكثر من ثمانين بالمائة من متعلمي اللغات البالغين سيكونون قد تبنوا معلمين تفاعليين مخصصين. وبدلاً من الحفظ السلبي، يتحاور الطلاب بنشاط مع أنظمة ذكية، متلقين تقييماً صوتياً فورياً وتصحيحات نحوية مخصصة.',
    comprehensionQuestions: [
      {
        id: 'rq1',
        question: 'What percentage of adult language learners is predicted to adopt interactive tutors by 2030?',
        options: ['Fifty percent', 'Over eighty percent', 'Twenty-five percent', 'One hundred percent'],
        answer: 1,
        explanation: 'The text states: "over eighty percent of adult language learners will have adopted personalized interactive tutors."',
        topic: 'Fact Retrieval',
        difficulty: 'intermediate',
      },
      {
        id: 'rq2',
        question: 'What replaces passive memorization in modern AI learning?',
        options: ['Written examinations only', 'Active conversation with instant feedback', 'Listening to old tapes', 'Reading grammar books silently'],
        answer: 1,
        explanation: 'The passage highlights active conversation with instantaneous phonetic feedback and grammar corrections.',
        topic: 'Core Idea Comprehension',
        difficulty: 'intermediate',
      },
    ],
  },
];

// ==========================================
// 3. PRONUNCIATION & PHONETICS DATA
// ==========================================
export interface MinimalPair {
  id: string;
  soundA: string;
  soundB: string;
  wordA: string;
  wordB: string;
  ipaA: string;
  ipaB: string;
  meaningArA: string;
  meaningArB: string;
  tipAr: string;
}

export const MINIMAL_PAIRS_DATA: MinimalPair[] = [
  {
    id: 'mp-1',
    soundA: '/iː/ (Long E)',
    soundB: '/ɪ/ (Short I)',
    wordA: 'sheep',
    wordB: 'ship',
    ipaA: '/ʃiːp/',
    ipaB: '/ʃɪp/',
    meaningArA: 'خروف (صوت ممدود كابتسامة)',
    meaningArB: 'سفينة (صوت خفيف قصير ومسترخٍ)',
    tipAr: 'في sheep ابتسم واجعل شفتيك مشدودتين ممدودتين، بينما في ship افتح فكك قليلاً واجعل الصوت سريعاً ومسترخياً.',
  },
  {
    id: 'mp-2',
    soundA: '/iː/ (Long E)',
    soundB: '/ɪ/ (Short I)',
    wordA: 'leave',
    wordB: 'live',
    ipaA: '/liːv/',
    ipaB: '/lɪv/',
    meaningArA: 'يغادر / يترك',
    meaningArB: 'يعيش / يقيم',
    tipAr: 'I leave at five (أغادر عند الخامسة)، بينما I live in Cairo (أعيش في القاهرة).',
  },
  {
    id: 'mp-3',
    soundA: '/p/ (Voiceless)',
    soundB: '/b/ (Voiced)',
    wordA: 'pen',
    wordB: 'ben',
    ipaA: '/pen/',
    ipaB: '/ben/',
    meaningArA: 'قلم جاف (مع خروج دفعة هواء قوية)',
    meaningArB: 'اسم شخص أو صندوق (صوت حنجري خفيف)',
    tipAr: 'صوت P يخرج معه انفجار هواء خفيف (ضع يدك أمام فمك لتشعر بالهواء)، بينما B صوت ناعم بدون هواء من الشفتين.',
  },
];

// ==========================================
// 4. REAL-LIFE ENGLISH MODULES
// ==========================================
export interface RealLifeModule {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  category: string;
  level: CEFRLevel;
  keyPhrases: { en: string; ar: string }[];
  scenarioSummaryAr: string;
  dialoguePreview: { speaker: string; textEn: string; textAr: string }[];
}

export const REAL_LIFE_MODULES: RealLifeModule[] = [
  {
    id: 'rl-airport',
    title: 'At the Airport & Security Check',
    titleAr: 'في المطار وإجراءات التفتيش والبوابة',
    icon: '✈️',
    category: 'Travel',
    level: 'A2',
    scenarioSummaryAr: 'كيف تطلب مقعد بجوار النافذة، تتجاوز تفتيش الأمتعة، وتستفسر عن بوابة إقلاع الطائرة.',
    keyPhrases: [
      { en: 'Could I please have a window seat?', ar: 'هل يمكنني الحصول على مقعد بجوار النافذة من فضلك؟' },
      { en: 'Is this bag suitable for carry-on luggage?', ar: 'هل هذه الحقيبة مناسبة كحقيبة يد داخل الطائرة؟' },
      { en: 'Which gate is flight MS 777 departing from?', ar: 'من أي بوابة ستقلع رحلة مصر للطيران 777؟' },
      { en: 'I will have boarded the plane by 4 PM.', ar: 'سأكون قد صعدت للطائرة قبل الساعة 4 مساءً.' },
    ],
    dialoguePreview: [
      { speaker: 'Agent', textEn: 'Where are you flying to today, sir?', textAr: 'إلى أين تسافر اليوم يا سيدي؟' },
      { speaker: 'You', textEn: 'Good morning, I am flying to Dubai on Emirates flight EK 924.', textAr: 'صباح الخير، أنا مسافر إلى دبي على متن رحلة طيران الإمارات EK 924.' },
    ],
  },
  {
    id: 'rl-hotel',
    title: 'At the Hotel Check-in & Concierge',
    titleAr: 'في الفندق: تسجيل الدخول وطلب الخدمات',
    icon: '🏨',
    category: 'Hospitality',
    level: 'A2',
    scenarioSummaryAr: 'تأكيد الحجز، طلب الإفطار، السؤال عن كلمة سر الواي فاي، وتأخير تسجيل الخروج.',
    keyPhrases: [
      { en: 'I have a reservation under the name Ahmed.', ar: 'لدي حجز مسبق باسم أحمد.' },
      { en: 'Is complimentary breakfast included in my room rate?', ar: 'هل الإفطار المجاني مشمول في سعر الغرفة؟' },
      { en: 'Could we request a late check-out at 1 PM?', ar: 'هل يمكننا طلب تسجيل خروج متأخر عند الواحدة ظهراً؟' },
    ],
    dialoguePreview: [
      { speaker: 'Receptionist', textEn: 'Welcome to the Grand Palace Hotel. May I have your passport?', textAr: 'مرحباً بك في فندق القصر الكبير. هل يمكنني الحصول على جواز سفرك؟' },
      { speaker: 'You', textEn: 'Here you go. I booked a king-size room with a city view.', textAr: 'تفضل. لقد حجزت غرفة بسرير كبير وإطلالة على المدينة.' },
    ],
  },
  {
    id: 'rl-interview',
    title: 'Job Interview & Career Fluency',
    titleAr: 'مقابلة العمل والتقديم المهني للوظائف',
    icon: '💼',
    category: 'Workplace',
    level: 'B2',
    scenarioSummaryAr: 'الإجابة عن نقاط القوة والضعف، التحدث عن إنجازاتك السابقة، وطرح أسئلة ذكية على مسؤول التوظيف.',
    keyPhrases: [
      { en: 'I have over five years of experience in full-stack development.', ar: 'لدي خبرة تزيد عن خمس سنوات في تطوير الويب الشامل.' },
      { en: 'By the third quarter, I will have led the cloud infrastructure migration.', ar: 'بحلول الربع الثالث، سأكون قد قُدت نقل البنية التحتية السحابية.' },
      { en: 'What are the main milestones for this role in the first six months?', ar: 'ما هي الأهداف الرئيسية لهذه الوظيفة خلال الأشهر الستة الأولى؟' },
    ],
    dialoguePreview: [
      { speaker: 'Interviewer', textEn: 'Why do you believe you are the best fit for our engineering team?', textAr: 'لماذا تعتقد أنك الشخص الأنسب لفريقنا الهندسي؟' },
      { speaker: 'You', textEn: 'Because my technical background aligns seamlessly with your tech stack, and I excel in fast-paced collaborative environments.', textAr: 'لأن خلفيتي التقنية تتوافق بسلاسة مع تقنياتكم، وأتميز في بيئات العمل السريعة والمتعاونة.' },
    ],
  },
];

// ==========================================
// 5. CEFR PLACEMENT TEST (20 DIAGNOSTIC QUESTIONS)
// ==========================================
export const CEFR_PLACEMENT_QUESTIONS: {
  id: string;
  level: CEFRLevel;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}[] = [
  {
    id: 'pq-1',
    level: 'A1',
    question: 'Where ______ you live?',
    options: ['do', 'does', 'is', 'are'],
    answer: 0,
    explanation: 'مع الضمير you في صيغة السؤال في المضارع البسيط نستخدم do.',
  },
  {
    id: 'pq-2',
    level: 'A1',
    question: 'She ______ three languages fluently.',
    options: ['speak', 'speaks', 'is speak', 'speaking'],
    answer: 1,
    explanation: 'مع المفرد الغائب She في المضارع البسيط نضيف s إلى الفعل: speaks.',
  },
  {
    id: 'pq-3',
    level: 'A2',
    question: 'Yesterday, we ______ to the new shopping mall downtown.',
    options: ['go', 'went', 'gone', 'going'],
    answer: 1,
    explanation: 'Yesterday تدل على الماضي البسيط، والتصريف الثاني للفعل go هو went.',
  },
  {
    id: 'pq-4',
    level: 'A2',
    question: 'This smartphone is ______ than the older model.',
    options: ['more fast', 'faster', 'fastest', 'as fast'],
    answer: 1,
    explanation: 'الصفات القصيرة مثل fast نضيف إليها er في المقارنة مع than فتصبح faster.',
  },
  {
    id: 'pq-5',
    level: 'B1',
    question: 'I haven’t seen Mona ______ we graduated from university.',
    options: ['for', 'since', 'during', 'while'],
    answer: 1,
    explanation: 'نستخدم since عندما نحدد نقطة بداية زمنية محددة في الماضي (graduation).',
  },
  {
    id: 'pq-6',
    level: 'B1',
    question: 'If it rains tomorrow, we ______ the picnic.',
    options: ['cancel', 'will cancel', 'would cancel', 'cancelled'],
    answer: 1,
    explanation: 'الحالة الشرطية الأولى (First Conditional): If + مضارع بسيط (rains) -> will + المصدر (will cancel).',
  },
  {
    id: 'pq-7',
    level: 'B2',
    question: 'By 2030, our engineering team ______ the electric car prototype.',
    options: ['will complete', 'will have completed', 'completed', 'has completed'],
    answer: 1,
    explanation: 'By + موعد مستقبلي محدد مع إتمام الفعل يتطلب صيغة المستقبل التام: will have completed.',
  },
  {
    id: 'pq-8',
    level: 'B2',
    question: 'If I had studied harder for the exam, I ______ with distinction.',
    options: ['would pass', 'will pass', 'would have passed', 'had passed'],
    answer: 2,
    explanation: 'الحالة الشرطية الثالثة (Third Conditional): If + had V3 -> would have + V3.',
  },
  {
    id: 'pq-9',
    level: 'C1',
    question: 'Seldom ______ such extraordinary architectural beauty.',
    options: ['I have seen', 'have I seen', 'I saw', 'did I saw'],
    answer: 1,
    explanation: 'ظاهرة التقديم والتأخير (Inversion): بعد الظروف السلبية مثل Seldom نضع الفعل المساعد قبل الفاعل (have I seen).',
  },
  {
    id: 'pq-10',
    level: 'C1',
    question: 'Had it not been for your prompt intervention, the contract ______ lost.',
    options: ['would be', 'would have been', 'will be', 'had been'],
    answer: 1,
    explanation: 'صيغة شرطية متقدمة راقية تعادل If it hadn’t been for... وتأخذ would have been.',
  },
];
