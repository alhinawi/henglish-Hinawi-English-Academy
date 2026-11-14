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
  {
    id: 'list-3',
    title: 'Job Interview Self-Introduction',
    titleAr: 'التعريف بالنفس في مقابلة عمل بالإنجليزية',
    level: 'B1',
    accent: 'American',
    duration: '1:30',
    category: 'Career & Work',
    transcript:
      'Good morning, and thank you for this opportunity. My name is Omar, and I have over four years of experience in digital marketing. In my previous role, I managed social media campaigns for three major brands, and I increased online engagement by forty percent in just one year. I am a fast learner, and I work very well under pressure. I believe my communication skills and my passion for creative content make me a strong fit for this position.',
    transcriptAr:
      'صباح الخير، وشكراً على هذه الفرصة. اسمي عمر، وعندي خبرة أكتر من 4 سنين في التسويق الرقمي. في وظيفتي السابقة، كنت بيدير حملات السوشيال ميديا لـ 3 علامات تجارية كبيرة، وزودت التفاعل الإلكتروني بنسبة 40% في سنة واحدة بس. أنا سريع التعلم، وبشتغل كويس جداً تحت الضغط. أعتقد إن مهاراتي في التواصل وشغفي بالمحتوى الإبداعي بيخلوا مني مرشح قوي لهذه الوظيفة.',
    dictationSentence: 'I increased online engagement by forty percent in just one year.',
    comprehensionQuiz: [
      {
        id: 'lq3-1',
        question: 'How much experience does Omar have in digital marketing?',
        options: ['Two years', 'Over four years', 'Ten years', 'One year'],
        answer: 1,
        explanation: 'He says: I have over four years of experience in digital marketing.',
        topic: 'Details Listening',
        difficulty: 'intermediate',
      },
      {
        id: 'lq3-2',
        question: 'By how much did he increase online engagement?',
        options: ['Fourteen percent', 'Four percent', 'Forty percent', 'Thirty percent'],
        answer: 2,
        explanation: 'He clearly states: increased online engagement by forty percent in just one year.',
        topic: 'Numbers Comprehension',
        difficulty: 'intermediate',
      },
    ],
  },
  {
    id: 'list-4',
    title: 'Doctor Visit: Describing Symptoms',
    titleAr: 'عند الدكتور: وصف الأعراض بالإنجليزية',
    level: 'A2',
    accent: 'British',
    duration: '1:10',
    category: 'Health & Medical',
    transcript:
      'Doctor: Good morning, what seems to be the problem? Patient: I have had a terrible headache since yesterday, and I feel dizzy when I stand up. Doctor: I see. Have you taken any medicine? Patient: Yes, I took two painkillers last night, but they did not help at all. Doctor: Alright. I will check your blood pressure first, and then I will give you something stronger. Make sure you drink plenty of water and get enough rest.',
    transcriptAr:
      'الدكتور: صباح الخير، ما المشكلة؟ المريض: عندي صداع مروع من إمبارح، وبحس بدوخة لما بقف. الدكتور: فاهم. هل أخذت أي دواء؟ المريض: أيوه، خدت حبتين مسكن مبارح بالليل، بس ماساعدوش خالص. الدكتور: حسناً. هقيس ضغط دمك الأول، وبعدها هديك حاجة أقوى. احرص إنك تشرب مية كتير وتاخد راحة كفاية.',
    dictationSentence: 'I have had a terrible headache since yesterday.',
    comprehensionQuiz: [
      {
        id: 'lq4-1',
        question: 'Since when has the patient had a headache?',
        options: ['Since last week', 'Since yesterday', 'Since this morning', 'For a month'],
        answer: 1,
        explanation: 'The patient says: I have had a terrible headache since yesterday.',
        topic: 'Time Details',
        difficulty: 'beginner',
      },
      {
        id: 'lq4-2',
        question: 'What will the doctor do first?',
        options: ['Give stronger medicine', 'Order an X-ray', 'Check the blood pressure', 'Call another doctor'],
        answer: 2,
        explanation: 'The doctor says: I will check your blood pressure first.',
        topic: 'Sequence Comprehension',
        difficulty: 'beginner',
      },
    ],
  },
  {
    id: 'list-5',
    title: 'Hotel Reception: Solving a Room Problem',
    titleAr: 'في استقبال الفندق: حل مشكلة في الغرفة',
    level: 'B1',
    accent: 'American',
    duration: '1:20',
    category: 'Travel & Hospitality',
    transcript:
      'Guest: Excuse me, I am afraid there is a problem with my room. The air conditioning is not working, and the room next door is very noisy. Receptionist: I am terribly sorry about that, sir. Let me see what I can do. We have a deluxe room available on the fifth floor with a sea view. I will upgrade you at no extra charge, and I will send someone to help with your luggage right away. Guest: That is very kind of you. Thank you so much.',
    transcriptAr:
      'النزيل: لو سمحت، للأسف فيه مشكلة في غرفتي. التكييف مش شغال، والأوضة اللي جنبي دوشة جداً. موظف الاستقبال: أنا آسف جداً على كده يا فندم. خليني أشوف أقدر أعمل إيه. عندنا أوضة ديلوكس متاحة في الدور الخامس بإطلالة على البحر. هعملك ترقية من غير أي تكلفة إضافية، وهبعت حد يساعدك في شنطك حالاً. النزيل: ده لطف منك جداً. شكراً جزيلاً.',
    dictationSentence: 'I will upgrade you at no extra charge.',
    comprehensionQuiz: [
      {
        id: 'lq5-1',
        question: 'What are the two problems with the room?',
        options: ['No water and no TV', 'Broken air conditioning and noise', 'Dirty bathroom and small bed', 'No wifi and no view'],
        answer: 1,
        explanation: 'The guest mentions: The air conditioning is not working, and the room next door is very noisy.',
        topic: 'Multiple Details',
        difficulty: 'intermediate',
      },
      {
        id: 'lq5-2',
        question: 'How will the hotel compensate the guest?',
        options: ['Free dinner', 'A full refund', 'A free upgrade to a deluxe room', 'A discount voucher'],
        answer: 2,
        explanation: 'The receptionist offers a deluxe room upgrade at no extra charge.',
        topic: 'Solution Comprehension',
        difficulty: 'intermediate',
      },
    ],
  },
  {
    id: 'list-6',
    title: 'University Lecture on Climate Change',
    titleAr: 'محاضرة جامعية عن التغير المناخي',
    level: 'B2',
    accent: 'British',
    duration: '1:40',
    category: 'Education & Science',
    transcript:
      'Good morning, everyone. Today we turn to one of the most pressing questions of our century: how quickly will our cities have adapted to rising temperatures? Current models suggest that by 2050, most coastal cities will have redesigned their drainage systems, and many will have invested billions in flood defenses. However, adaptation is not only about engineering. By the same year, schools will have integrated climate literacy into every science curriculum, ensuring that the next generation understands both the risks and the solutions. Remember, the decisions we make this decade will shape the world your grandchildren inherit.',
    transcriptAr:
      'صباح الخير جميعاً. اليوم نتناول واحداً من أكثر أسئلة القرن إلحاحاً: ما مدى سرعة تكيف مدننا مع ارتفاع درجات الحرارة؟ تشير النماذج الحالية إلى أنه بحلول عام 2050، ستكون معظم المدن الساحلية قد أعادت تصميم أنظمة الصرف الخاصة بها، وستكون العديد منها قد استثمرت مليارات في الدفاعات ضد الفيضانات. وبحلول العام نفسه، ستكون المدارس قد دمجت الثقافة المناخية في كل مناهج العلوم.',
    dictationSentence: 'By 2050, most coastal cities will have redesigned their drainage systems.',
    comprehensionQuiz: [
      {
        id: 'lq11',
        question: 'What will most coastal cities have redesigned by 2050?',
        options: ['Their airports', 'Their drainage systems', 'Their universities', 'Their shopping malls'],
        answer: 1,
        explanation: 'The lecturer states: by 2050, most coastal cities will have redesigned their drainage systems.',
        topic: 'Detail Listening',
        difficulty: 'intermediate',
      },
      {
        id: 'lq12',
        question: 'What will schools have integrated into science curricula?',
        options: ['Space exploration', 'Climate literacy', 'Ancient history', 'Computer programming'],
        answer: 1,
        explanation: 'The lecture says schools will have integrated climate literacy into every science curriculum.',
        topic: 'Detail Listening',
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
  {
    id: 'read-2',
    title: 'The Egyptian Freelancer Who Conquered the Global Market',
    titleAr: 'المستقل المصري الذي غزا السوق العالمية',
    level: 'B1',
    wordCount: 150,
    estimatedTime: '3 دقائق',
    category: 'Success Stories',
    content:
      'Three years ago, Karim was a fresh graduate struggling to find a job in his hometown. Today, he works with clients from twelve different countries without leaving his small apartment in Mansoura. His secret was simple but not easy: he dedicated two hours every single day to improving his English and learning digital skills online. By the end of his first year as a freelancer, he had earned more than his friends who worked in traditional offices. Karim believes that English was the real key that opened the global market for him. "When you speak English well," he says, "the whole world becomes your local market." His story proves that talent is everywhere, but opportunity needs a common language.',
    contentAr:
      'من 3 سنين، كان كريم خريج جديد بيكافح عشان يلاقي شغل في مدينته. النهاردة، بيشتغل مع عملاء من 12 دولة مختلفة من غير ما يسيب شقته الصغيرة في المنصورة. سره كان بسيط بس مش سهل: خصص ساعتين كل يوم لتحسين إنجليزيته وتعلم مهارات رقمية أونلاين. بحلول نهاية سنته الأولى كمستقل، كان كسب أكتر من أصحابه اللي بيشتغلوا في مكاتب تقليدية. كريم مقتنع إن الإنجليزي كان المفتاح الحقيقي اللي فتح له السوق العالمية. بيقول: "لما بتتكلم إنجليزي كويس، العالم كله بيبقى سوقك المحلية." حكايته بتثبت إن الموهبة موجودة في كل حتة، بس الفرصة محتاجة لغة مشتركة.',
    comprehensionQuestions: [
      {
        id: 'rq2-1',
        question: 'How many hours did Karim dedicate daily to improving himself?',
        options: ['One hour', 'Two hours', 'Four hours', 'Thirty minutes'],
        answer: 1,
        explanation: 'The passage says: he dedicated two hours every single day.',
        topic: 'Fact Retrieval',
        difficulty: 'intermediate',
      },
      {
        id: 'rq2-2',
        question: 'What does Karim consider the real key to the global market?',
        options: ['His university degree', 'His English skills', 'His small apartment', 'His foreign clients'],
        answer: 1,
        explanation: 'Karim believes English was the real key that opened the global market for him.',
        topic: 'Core Idea Comprehension',
        difficulty: 'intermediate',
      },
    ],
  },
  {
    id: 'read-3',
    title: 'Why Your Brain Loves Spaced Repetition',
    titleAr: 'لماذا يعشق عقلك التكرار المتباعد',
    level: 'B2',
    wordCount: 160,
    estimatedTime: '3 دقائق',
    category: 'Learning Science',
    content:
      'Forgetting is not a bug in your brain; it is a feature. German psychologist Hermann Ebbinghaus discovered over a century ago that we lose nearly seventy percent of new information within twenty-four hours if we do not review it. However, his research also revealed a powerful solution: spacing out reviews at increasing intervals. When you revisit a word after one day, then three days, then a week, your brain receives a signal that this information matters and moves it into long-term memory. Modern applications have automated this technique, which is known as spaced repetition. Students who use it can memorize thousands of vocabulary items with only twenty minutes of daily practice. The lesson is clear: studying harder is not the answer; studying at the right time is.',
    contentAr:
      'النسيان مش عيب في عقلك؛ ده نظام حماية. عالم النفس الألماني هيرمان إيبنجهاوس اكتشف من أكتر من قرن إننا بنفقد حوالي 70% من المعلومات الجديدة خلال 24 ساعة لو منراجعهاش. بس أبحاثه كشفت كمان حل قوي: توزيع المراجعات على فترات متزايدة. لما بتراجع كلمة بعد يوم، وبعدين 3 أيام، وبعدين أسبوع، عقلك بيستقبل إشارة إن المعلومة دي مهمة وبينقلها للذاكرة طويلة المدى. التطبيقات الحديثة عملت أتمتة للتقنية دي، واسمها التكرار المتباعد. الطلاب اللي بيستخدموها يقدروا يحفظوا آلاف الكلمات بعشرين دقيقة تمرين يومي بس. الدرس واضح: المذاكرة الأصعب مش هي الحل؛ المذاكرة في الوقت الصح هي الحل.',
    comprehensionQuestions: [
      {
        id: 'rq3-1',
        question: 'How much new information do we lose within 24 hours without review?',
        options: ['Twenty percent', 'Fifty percent', 'Nearly seventy percent', 'Ninety percent'],
        answer: 2,
        explanation: 'The text states: we lose nearly seventy percent of new information within twenty-four hours.',
        topic: 'Fact Retrieval',
        difficulty: 'advanced',
      },
      {
        id: 'rq3-2',
        question: 'What is the main idea of the passage?',
        options: ['Study harder every day', 'Timing reviews correctly beats longer study sessions', 'Forget everything and restart', 'Only use mobile apps to learn'],
        answer: 1,
        explanation: 'The conclusion: studying harder is not the answer; studying at the right time is.',
        topic: 'Main Idea',
        difficulty: 'advanced',
      },
    ],
  },
  {
    id: 'read-4',
    title: 'The Hidden Power of Daily Reading Habits',
    titleAr: 'القوة الخفية لعادة القراءة اليومية',
    level: 'B2',
    wordCount: 175,
    estimatedTime: '4 دقائق',
    category: 'Self Development',
    content:
      'Neuroscientists have long suspected that reading is a full-brain workout, but recent imaging studies have confirmed just how transformative the habit can be. A person who reads for thirty minutes every day will have processed over one million words by the end of a single year. This massive exposure quietly rebuilds the reader\'s vocabulary, sharpening comprehension and accelerating language acquisition far beyond what formal classes alone can achieve. Moreover, consistent readers report lower stress levels and stronger focus in professional settings. By the time a decade has passed, the daily reader will have explored hundreds of fictional worlds and absorbed thousands of new ideas, compounding an intellectual advantage that no shortcut can replicate. The lesson is simple: the pages you finish today become the mind you carry tomorrow.',
    contentAr:
      'اشتبه علماء الأعصاب منذ فترة طويلة في أن القراءة تمرين شامل للدماغ، لكن دراسات التصوير الحديثة أكدت مدى تأثير هذه العادة. الشخص الذي يقرأ ٣٠ دقيقة يومياً سيكون قد عالج أكثر من مليون كلمة بحلول نهاية عام واحد. هذا التعرض الهائل يعيد بناء مفردات القارئ بهدوء ويسرع اكتساب اللغة. وبحلول مرور عقد كامل، يكون القارئ اليومي قد استكشف مئات العوالم الخيالية واستوعب آلاف الأفكار الجديدة.',
    comprehensionQuestions: [
      {
        id: 'rq7',
        question: 'How many words will a daily 30-minute reader have processed in one year?',
        options: ['One hundred thousand', 'Over one million', 'Ten thousand', 'Five million'],
        answer: 1,
        explanation: 'The passage states: will have processed over one million words by the end of a single year.',
        topic: 'Fact Retrieval',
        difficulty: 'intermediate',
      },
      {
        id: 'rq8',
        question: 'Besides vocabulary growth, what benefits do consistent readers report?',
        options: ['Higher salaries and bigger houses', 'Lower stress levels and stronger focus', 'Better eyesight and memory loss', 'Faster typing and speaking speed'],
        answer: 1,
        explanation: 'The text says: consistent readers report lower stress levels and stronger focus in professional settings.',
        topic: 'Detail Comprehension',
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
  {
    id: 'mp-4',
    soundA: '/æ/ (Short A)',
    soundB: '/e/ (Short E)',
    wordA: 'bad',
    wordB: 'bed',
    ipaA: '/bæd/',
    ipaB: '/bed/',
    meaningArA: 'سيئ (افتح فمك على الآخر)',
    meaningArB: 'سرير (فم مفتوح أقل)',
    tipAr: 'في bad افتح فمك بشكل كامل زي ما تكون بتعطس، بينما في bed الافتتاحة أصغر وأهدى.',
  },
  {
    id: 'mp-5',
    soundA: '/θ/ (TH Voiceless)',
    soundB: '/s/ (S)',
    wordA: 'think',
    wordB: 'sink',
    ipaA: '/θɪŋk/',
    ipaB: '/sɪŋk/',
    meaningArA: 'يفكر (السان بين الأسنان)',
    meaningArB: 'يغرق / حوض (السان ورا الأسنان)',
    tipAr: 'في think أخرج طرف لسانك بين أسنانك وانفخ هواء، وفي sink السان مكانه الطبيعي ورا الأسنان.',
  },
  {
    id: 'mp-6',
    soundA: '/ð/ (TH Voiced)',
    soundB: '/z/ (Z)',
    wordA: 'breathe',
    wordB: 'breeze',
    ipaA: '/briːð/',
    ipaB: '/briːz/',
    meaningArA: 'يتنفس (صوت مهتز مع السان خارج)',
    meaningArB: 'نسيم عليل (صفير مستمر)',
    tipAr: 'حط إيدك على رقبتك: في breathe هتحس باهتزاز مع السان خارج بين الأسنان، وفي breeze الاهتزاز من غير ما السان يخرج.',
  },
  {
    id: 'mp-7',
    soundA: '/ʃ/ (SH)',
    soundB: '/tʃ/ (CH)',
    wordA: 'share',
    wordB: 'chair',
    ipaA: '/ʃer/',
    ipaB: '/tʃer/',
    meaningArA: 'يشارك (همسة طويلة)',
    meaningArB: 'كرسي (تبدأ بوقفة T سريعة)',
    tipAr: 'في share الصوت همسة مستمرة زي ما تكون بتسكت حد، وفي chair الصوت بيبدأ بضربة سريعة T+SH مع بعض.',
  },
  {
    id: 'mp-8',
    soundA: '/ɑː/ (Long A)',
    soundB: '/ʌ/ (Short U)',
    wordA: 'cart',
    wordB: 'cut',
    ipaA: '/kɑːrt/',
    ipaB: '/kʌt/',
    meaningArA: 'عربية تسوق (صوت ممدود من الحلق)',
    meaningArB: 'يقطع (صوت قصير مركزي)',
    tipAr: 'في cart مد الصوت زي ما تكون عند دكتور الأسنان: آآآه، وفي cut الصوت قصير وسريع من نص الفم.',
  },
  {
    id: 'mp-9',
    soundA: '/l/ (Light L)',
    soundB: '/r/ (American R)',
    wordA: 'light',
    wordB: 'right',
    ipaA: '/laɪt/',
    ipaB: '/raɪt/',
    meaningArA: 'نور (السان يلمس سقف الفم)',
    meaningArB: 'صح / يمين (السان مكور للخلف)',
    tipAr: 'في light طرف لسانك يلمس اللثة فوق الأسنان الأمامية، وفي right السان بيتكور للورا من غير ما يلمس أي حاجة.',
  },

  // Expansion Pack 2 - 6 additional minimal pairs
  {
    id: 'mp-10',
    soundA: '/b/ (B)',
    soundB: '/p/ (P)',
    wordA: 'bat',
    wordB: 'pat',
    ipaA: '/bæt/',
    ipaB: '/pæt/',
    meaningArA: 'مضرب / خفاش',
    meaningArB: 'ربتة خفيفة',
    tipAr: 'في bat اجعل شفتيك تنفجران بصوت مرخّي مصحوب باهتزاز الحبال الصوتية، بينما pat تخرج بنفخة هوائية بدون اهتزاز.',
  },
  {
    id: 'mp-11',
    soundA: '/s/ (S)',
    soundB: '/ʃ/ (SH)',
    wordA: 'sip',
    wordB: 'ship',
    ipaA: '/sɪp/',
    ipaB: '/ʃɪp/',
    meaningArA: 'رشفة صغيرة',
    meaningArB: 'سفينة',
    tipAr: 'في sip اللسان قريب من الأسنان بصوت صفير حاد، وفي ship ضمّ شفتيك للأمام قليلاً مع صوت أعمق.',
  },
  {
    id: 'mp-12',
    soundA: '/tʃ/ (CH)',
    soundB: '/ʃ/ (SH)',
    wordA: 'chair',
    wordB: 'share',
    ipaA: '/tʃeər/',
    ipaB: '/ʃeər/',
    meaningArA: 'كرسي',
    meaningArB: 'يشارك',
    tipAr: 'chair تبدأ بانفجار سريع t + sh، بينما share تبدأ بصوت sh انسيابي فقط بدون انفجار.',
  },
  {
    id: 'mp-13',
    soundA: '/v/ (V)',
    soundB: '/f/ (F)',
    wordA: 'very',
    wordB: 'ferry',
    ipaA: '/ˈveri/',
    ipaB: '/ˈferi/',
    meaningArA: 'جداً',
    meaningArB: 'عبّارة نهرية',
    tipAr: 'في very الأسنان العلوية تلامس الشفة السفلى مع اهتزاز الحبال الصوتية، وفي ferry نفس الوضع بدون اهتزاز.',
  },
  {
    id: 'mp-14',
    soundA: '/æ/ (A)',
    soundB: '/e/ (E)',
    wordA: 'bad',
    wordB: 'bed',
    ipaA: '/bæd/',
    ipaB: '/bed/',
    meaningArA: 'سيئ',
    meaningArB: 'سرير',
    tipAr: 'في bad افتح فكك للأسفل بعرض مثل نطق (اي) مصرية مفتوحة، وفي bed الصوت أقصر وأقرب لـ (إيه).',
  },
  {
    id: 'mp-15',
    soundA: '/ɑː/ (Long A)',
    soundB: '/ʌ/ (Short U)',
    wordA: 'cart',
    wordB: 'cut',
    ipaA: '/kɑːrt/',
    ipaB: '/kʌt/',
    meaningArA: 'عربة / كارت',
    meaningArB: 'يقطع',
    tipAr: 'cart صوت ألف ممدود من عمق الفم، بينما cut صوت قصير مركز من منتصف الفم مثل (آ) سريعة.',
  },];

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
    icon: '',
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
    icon: '',
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
    icon: '',
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
  }
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

