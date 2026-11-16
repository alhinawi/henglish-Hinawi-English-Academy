// ==============================================================================
// Henglish Academy - أهم المصادر (Resources)
// Curated directory of real, verified external learning resources.
// Rules: official URLs only (verified live before shipping), own wording,
// no copied marketing text or logos, honest free/paid tags, no rankings
// claimed as official, no affiliate links.
// ==============================================================================

export type SourceCategoryId =
  | 'youtube'
  | 'apps'
  | 'websites'
  | 'native'
  | 'podcasts'
  | 'dictionaries'
  | 'exams'
  | 'books'
  | 'readers'
  | 'arabic';

export type SourceCost = 'free' | 'freemium' | 'paid';

export interface LearningSource {
  id: string;
  name: string;
  url: string;
  category: SourceCategoryId;
  cost: SourceCost;
  levels: string[]; // ['ALL'] or subset of A1..C2
  descriptionAr: string;
  subcategory?: string;
}

export interface SourceCategoryInfo {
  id: SourceCategoryId;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  imageUrl: string;
  imageAlt: string;
}

export const SOURCE_CATEGORIES: SourceCategoryInfo[] = [
  {
    id: 'youtube',
    labelAr: 'قنوات يوتيوب',
    labelEn: 'YouTube Channels',
    descriptionAr: 'قنوات بتنزل دروس جديدة كل أسبوع، من الشرح بالعربي للنطق الأمريكي والبريطاني.',
    imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'YouTube logo on a screen',
  },
  {
    id: 'apps',
    labelAr: 'تطبيقات التعلم',
    labelEn: 'Learning Apps',
    descriptionAr: 'تطبيقات موبايل تخلي المذاكرة عادة يومية، من الكلمات للنطق والمحادثة.',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Hand holding a smartphone',
  },
  {
    id: 'websites',
    labelAr: 'مواقع التعلم',
    labelEn: 'Learning Websites',
    descriptionAr: 'مواقع كاملة فيها دروس وتمارين تفاعلية لكل المستويات، أغلبها مجاني.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Laptop with code on screen',
  },
  {
    id: 'native',
    labelAr: 'الممارسة مع النيتيف',
    labelEn: 'Native Speaker Practice',
    descriptionAr: 'اتكلم مع ناس لغتها الأم إنجليزي: تبادل لغات مجاني أو مدرسين بالساعة.',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Two people shaking hands',
  },
  {
    id: 'podcasts',
    labelAr: 'بودكاست',
    labelEn: 'Podcasts',
    descriptionAr: 'اسمع وأنت في المواصلات أو المشي، حلقات على كل المستويات من 6 دقايق لساعة.',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Studio microphone',
  },
  {
    id: 'dictionaries',
    labelAr: 'قواميس وأدوات',
    labelEn: 'Dictionaries & Tools',
    descriptionAr: 'قاموسك اليومي وأدوات النطق والكتابة والترجمة اللي محدش يستغنى عنها.',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Old dictionary book',
  },
  {
    id: 'exams',
    labelAr: 'IELTS و TOEFL',
    labelEn: 'Exam Preparation',
    descriptionAr: 'كل اللي محتاجه لامتحانات IELTS و TOEFL وكشف مستواك الرسمي.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Student writing an exam',
  },
  {
    id: 'books',
    labelAr: 'كتب لكل مستوى',
    labelEn: 'Books by Level',
    descriptionAr: 'أشهر الكتب العالمية في الجرامر والكلمات والمناهج، مرتبة حسب مستواك.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Library bookshelves',
  },
  {
    id: 'readers',
    labelAr: 'قراءة واستماع متدرج',
    labelEn: 'Graded Readers & Listening',
    descriptionAr: 'قصص ومقالات مكتوبة بمستويات من A1 لحد C1 عشان تقرأ كتير من غير ما تزهق.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Open book with lights',
  },
  {
    id: 'arabic',
    labelAr: 'للمتعلم المصري والعربي',
    labelEn: 'For Egyptian & Arabic Learners',
    descriptionAr: 'مصادر بتشرح بالعربي ومنصات عربية فيها كورسات إنجليزي قوية.',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Students learning together',
  },
];

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

const ALL = ['ALL'];

export const LEARNING_SOURCES: LearningSource[] = [
  // ============ قنوات يوتيوب ============
  { id: 'yt-001', name: 'BBC Learning English', url: 'https://www.youtube.com/@bbclearningenglish', category: 'youtube', cost: 'free', levels: ALL, descriptionAr: 'أشهر قناة رسمية لتعلم الإنجليزي، دروس قصيرة جديدة كل يوم وبكل المستويات.' },
  { id: 'yt-002', name: 'English with Lucy', url: 'https://www.youtube.com/@EnglishwithLucy', category: 'youtube', cost: 'free', levels: ['A2','B1','B2','C1'], descriptionAr: 'لهجة بريطانية واضحة وشرح مرتب للكلمات والنطق والثقافة البريطانية.' },
  { id: 'yt-003', name: 'engVid', url: 'https://www.youtube.com/@engvid', category: 'youtube', cost: 'free', levels: ALL, descriptionAr: 'أكتر من 10 مدرسين محترفين شرحوا تقريبا كل درس إنجليزي ممكن يخطر على بالك.' },
  { id: 'yt-004', name: 'Oxford Online English', url: 'https://www.youtube.com/@Oxfordonlineenglish1', category: 'youtube', cost: 'free', levels: ['B1','B2','C1','C2'], descriptionAr: 'دروس محادثة واستماع من مدرسين بريطانيين محترفين، جودة عالية جدا.' },
  { id: 'yt-005', name: "Rachel's English", url: 'https://www.youtube.com/@rachelsenglish', category: 'youtube', cost: 'free', levels: ['B1','B2','C1','C2'], descriptionAr: 'أحسن قناة للنطق الأمريكي الصح، حركة اللسان والشفايف بالتفصيل الممل.' },
  { id: 'yt-006', name: 'Speak English With Vanessa', url: 'https://www.youtube.com/@SpeakEnglishWithVanessa', category: 'youtube', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'إنجليزي أمريكي يومي طبيعي، بتحس إنك قاعد بتتكلم مع صاحبتك.' },
  { id: 'yt-007', name: 'mmmEnglish', url: 'https://www.youtube.com/channel/UCrRiVfHqBIIvSgKmgnSY66g', category: 'youtube', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'Emma بتشرح القواعد والتعبيرات الشائعة بهدوء وتنظيم يخليك تحب المذاكرة.' },
  { id: 'yt-008', name: 'EnglishClass101', url: 'https://www.youtube.com/@EnglishClass101', category: 'youtube', cost: 'freemium', levels: ALL, descriptionAr: 'آلاف الدروس القصيرة في كل المواضيع، مناسبة لو عايز تتعلم بسرعة وبالقطارة.' },
  { id: 'yt-009', name: 'Learn English with TV Series', url: 'https://www.youtube.com/@LearnEnglishWithTVSeries', category: 'youtube', cost: 'free', levels: ['A2','B1','B2','C1'], descriptionAr: 'اتعلم من أشهر المسلسلات والأفلام مشهد بمشهد، ممتع ومفيد جدا.' },
  { id: 'yt-010', name: 'VOA Learning English', url: 'https://www.youtube.com/@VOALearningEnglish', category: 'youtube', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'أخبار وتقارير بإنجليزي بطيء وواضح، مثالية للمبتدئين اللي بيبنوا أذنهم.' },
  { id: 'yt-011', name: 'Easy English', url: 'https://www.youtube.com/@EasyEnglishVideos', category: 'youtube', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'مقابلات في الشارع مع ناس حقيقية وترجمة على الشاشة، إنجليزي الشارع الحقيقي.' },
  { id: 'yt-012', name: 'TED', url: 'https://www.youtube.com/@TED', category: 'youtube', cost: 'free', levels: ['B2','C1','C2'], descriptionAr: 'محاضرات ملهمة من عقول العالم، اتفرج واتعلم أفكار ومصطلحات راقية.' },
  { id: 'yt-013', name: 'TED-Ed', url: 'https://www.youtube.com/@TEDEd', category: 'youtube', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'فيديوهات رسوم متحركة قصيرة بتشرح كل حاجة، إنجليزي علمي بشكل ممتع.' },
  { id: 'yt-014', name: "Luke's English Podcast", url: 'https://www.youtube.com/@LukesEnglishPodcast', category: 'youtube', cost: 'free', levels: ['B1','B2','C1','C2'], descriptionAr: 'مدرس بريطاني كوميدي بيتكلم في كل حاجة، حلقات طويلة ممتعة للمستوى المتوسط وفوق.' },
  { id: 'yt-015', name: 'Learn English with Bob the Canadian', url: 'https://www.youtube.com/@LearnEnglishwithBobtheCanadian', category: 'youtube', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'مدرس كندي بيتكلم ببطء ووضوح عن الحياة اليومية، مثالي لبناء الأساس.' },
  { id: 'yt-016', name: 'English Like a Native', url: 'https://www.youtube.com/@EnglishLikeaNative', category: 'youtube', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'Anna بتعلمك الإنجليزي البريطاني اليومي والتعبيرات اللي بيستخدموها فعلا.' },
  { id: 'yt-017', name: 'English with Jennifer', url: 'https://www.youtube.com/@EnglishwithJennifer', category: 'youtube', cost: 'free', levels: ['A1','A2','B1','B2'], descriptionAr: 'مدرسة أمريكية قديمة في المجال، شرح واضح ومنظم للجرامر والمحادثة.' },
  { id: 'yt-018', name: 'Go Natural English', url: 'https://www.youtube.com/user/GoNaturalEnglish', category: 'youtube', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'تركيز على المحادثة الطبيعية والطلاقة من غير حفظ قواعد معقدة.' },
  { id: 'yt-019', name: 'English with Greg', url: 'https://www.youtube.com/@EnglishwithGreg', category: 'youtube', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'مدرس بريطاني شاب بيشرح النطق والتعبيرات البريطانية بشكل خفيف وسريع.' },
  { id: 'yt-020', name: "Arnel's Everyday English", url: 'https://www.youtube.com/@ArnelsEverydayEnglish', category: 'youtube', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'جرامر وتعبيرات متقدمة بشرح منظم جدا، ممتازة للي عايز يتقن التفاصيل.' },
  { id: 'yt-021', name: 'Accurate English', url: 'https://www.youtube.com/@AccurateEnglish', category: 'youtube', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'Lisa Mojsin متخصصة في النطق الأمريكي الدقيق والتخلص من اللكنة الأجنبية.' },
  { id: 'yt-023', name: 'ZAmericanEnglish', url: 'https://www.youtube.com/@ZAmericanEnglish', category: 'youtube', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'شرح مصري شعبي للإنجليزي الأمريكي من الصفر، كلمات وقواعد ومحادثة.' },
  { id: 'yt-024', name: 'Learn English with Harry', url: 'https://www.youtube.com/@learnenglishwithharry', category: 'youtube', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'مدرس بريطاني متخصص في الكلمات المتقدمة والتعبيرات الاصطلاحية اليومية.' },

  // ============ تطبيقات التعلم ============
  { id: 'app-001', name: 'Duolingo', url: 'https://www.duolingo.com', category: 'apps', cost: 'freemium', levels: ['A1','A2','B1'], descriptionAr: 'أشهر تطبيق تعلم لغات في العالم، بيخليك تذاكر كل يوم من غير ما تحس.' },
  { id: 'app-002', name: 'Memrise', url: 'https://www.memrise.com', category: 'apps', cost: 'freemium', levels: ['A1','A2','B1'], descriptionAr: 'كلمات وجمل حقيقية بفيديوهات من نيتيف، قوي جدا في تثبيت المفردات.' },
  { id: 'app-003', name: 'Busuu', url: 'https://www.busuu.com', category: 'apps', cost: 'freemium', levels: ['A1','A2','B1','B2'], descriptionAr: 'منهج كامل من A1 لـ B2 ومجتمع بيصحح تدريباتك من نيتيف حقيقيين.' },
  { id: 'app-004', name: 'Babbel', url: 'https://www.babbel.com', category: 'apps', cost: 'paid', levels: ['A1','A2','B1','B2'], descriptionAr: 'دروس عملية مركزة على المحادثة اليومية، مدفوع لكن محتواه منظم ومفيد.' },
  { id: 'app-005', name: 'ELSA Speak', url: 'https://elsaspeak.com', category: 'apps', cost: 'freemium', levels: ['A2','B1','B2','C1'], descriptionAr: 'مدرب نطق بالذكاء الاصطناعي بيسمعك ويقولك غلطتك فين بالحرف.' },
  { id: 'app-006', name: 'Cake', url: 'https://mycake.me', category: 'apps', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'مقاطع قصيرة من فيديوهات حقيقية مع ترجمة، اتعلم تعبيرات اليوم بسرعة.' },
  { id: 'app-007', name: 'Anki', url: 'https://apps.ankiweb.net', category: 'apps', cost: 'free', levels: ALL, descriptionAr: 'أقوى نظام فلاش كاردز في العالم، بيحفظك أي كلمة على المدى الطويل.' },
  { id: 'app-008', name: 'Quizlet', url: 'https://quizlet.com', category: 'apps', cost: 'freemium', levels: ALL, descriptionAr: 'فلاش كاردز سهلة وسريعة، اعمل مجموعاتك أو استخدم مجموعات ناس جاهزة.' },
  { id: 'app-009', name: 'LingQ', url: 'https://www.lingq.com', category: 'apps', cost: 'freemium', levels: ['B1','B2','C1','C2'], descriptionAr: 'اقرأ واسمع محتوى حقيقي والتطبيق بيسجل الكلمات الجديدة اللي بتتعلمها.' },
  { id: 'app-010', name: 'Drops', url: 'https://languagedrops.com', category: 'apps', cost: 'freemium', levels: ['A1','A2'], descriptionAr: 'كلمات بصور وألعاب سريعة، 5 دقايق يوميا تبني حصيلة كويسة.' },
  { id: 'app-011', name: 'Beelinguapp', url: 'https://beelinguapp.com', category: 'apps', cost: 'freemium', levels: ['A2','B1','B2'], descriptionAr: 'قصص بصوت نيتيف والترجمة العربية جنب النص، اقرأ واسمع في نفس الوقت.' },
  { id: 'app-012', name: 'Lingvist', url: 'https://lingvist.com', category: 'apps', cost: 'paid', levels: ['A2','B1','B2'], descriptionAr: 'أهم 5000 كلمة بترتيب ذكي حسب استخدامها الحقيقي، تقدم سريع وملموس.' },
  { id: 'app-013', name: 'Falou', url: 'https://www.falou.com', category: 'apps', cost: 'freemium', levels: ['A1','A2','B1'], descriptionAr: 'محادثات واقعية من الحياة اليومية بتتدرب عليها بصوتك من أول درس.' },
  { id: 'app-014', name: 'Speak', url: 'https://www.speak.com', category: 'apps', cost: 'paid', levels: ['A2','B1','B2'], descriptionAr: 'تدريب كلام مكثف مع مدرس ذكاء اصطناعي، مركز جدا على الطلاقة الشفوية.' },
  { id: 'app-015', name: 'LingoDeer', url: 'https://www.lingodeer.com', category: 'apps', cost: 'freemium', levels: ['A1','A2','B1'], descriptionAr: 'دروس منظمة بجودة عالية وتمارين متنوعة، منافس قوي لدولينجو.' },
  { id: 'app-016', name: 'WordUp', url: 'https://www.wordupapp.co', category: 'apps', cost: 'freemium', levels: ['A2','B1','B2','C1'], descriptionAr: 'خريطة معرفة بأهم 25000 كلمة إنجليزي بأمثلة من أفلام ومسلسلات حقيقية.' },
  { id: 'app-017', name: 'EWA', url: 'https://appewa.com', category: 'apps', cost: 'freemium', levels: ['A2','B1','B2'], descriptionAr: 'كلمات وكتب صوتية وكورسات في تطبيق واحد، واجهته سهلة وخفيفة.' },
  { id: 'app-018', name: 'LearnEnglish Apps (British Council)', url: 'https://learnenglish.britishcouncil.org/apps', category: 'apps', cost: 'free', levels: ALL, descriptionAr: 'مجموعة تطبيقات مجانية من المجلس الثقافي البريطاني لكل المهارات والأعمار.' },
  { id: 'app-019', name: 'Pimsleur', url: 'https://www.pimsleur.com', category: 'apps', cost: 'paid', levels: ['A1','A2','B1'], descriptionAr: 'طريقة صوتية شهيرة تخليك تتكلم من أول 30 دقيقة، ممتازة للمشوار والجيم.' },
  { id: 'app-020', name: 'Rosetta Stone', url: 'https://www.rosettastone.com', category: 'apps', cost: 'paid', levels: ['A1','A2','B1'], descriptionAr: 'البرنامج الأقدم في المجال، تعلم بالانغماس الكامل من غير ترجمة.' },
  { id: 'app-021', name: 'Mango Languages', url: 'https://mangolanguages.com', category: 'apps', cost: 'freemium', levels: ['A1','A2','B1'], descriptionAr: 'محادثات عملية مبنية على مواقف حقيقية، ومجاني كامل من مكتبات كتير.' },

  // ============ مواقع التعلم ============
  { id: 'web-001', name: 'British Council LearnEnglish', url: 'https://learnenglish.britishcouncil.org', category: 'websites', cost: 'free', levels: ALL, descriptionAr: 'الموقع الرسمي الأشمل: قواعد وكلمات واستماع وقراءة بتمارين تفاعلية لكل المستويات.' },
  { id: 'web-002', name: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish', category: 'websites', cost: 'free', levels: ALL, descriptionAr: 'دروس يومية وفيديوهات وسلاسل كاملة من BBC، المحتوى بيتجدد باستمرار.' },
  { id: 'web-003', name: 'VOA Learning English', url: 'https://learningenglish.voanews.com', category: 'websites', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'أخبار العالم بإنجليزي مبسط وبصوت بطيء، مع قواميس للكلمات الصعبة.' },
  { id: 'web-004', name: 'engVid', url: 'https://www.engvid.com', category: 'websites', cost: 'free', levels: ALL, descriptionAr: 'أكتر من 2000 درس فيديو مجاني مرتبين بالمستوى والمدرس، مع كويز بعد كل درس.' },
  { id: 'web-005', name: "Randall's ESL Cyber Listening Lab", url: 'https://www.esl-lab.com', category: 'websites', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'أقدم وأشهر موقع تدريب استماع، محادثات واقعية بأسئلة وسكريبت كامل.' },
  { id: 'web-006', name: 'elllo', url: 'https://www.elllo.org', category: 'websites', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'أكتر من 3000 مقطع استماع بلكنات من كل دول العالم، مع نص وتمارين.' },
  { id: 'web-007', name: 'Perfect English Grammar', url: 'https://www.perfect-english-grammar.com', category: 'websites', cost: 'free', levels: ['A2','B1','B2','C1'], descriptionAr: 'شرح قواعد واضح جدا مع تمارين تفاعلية وتصحيح فوري، مرجع ممتاز للجرامر.' },
  { id: 'web-008', name: 'English Page', url: 'https://www.englishpage.com', category: 'websites', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'شرح الأزمنة بالتفصيل مع أمثلة وتمارين، من أفضل مراجع الـ tenses المجانية.' },
  { id: 'web-009', name: 'Grammar Bytes!', url: 'https://chompchomp.com', category: 'websites', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'قواعد الكتابة الأكاديمية بشكل ممتع، تمارين تفاعلية على الأخطاء الشائعة.' },
  { id: 'web-010', name: 'Purdue OWL', url: 'https://owl.purdue.edu', category: 'websites', cost: 'free', levels: ['B2','C1','C2'], descriptionAr: 'مرجع الكتابة الأكاديمية الأول عالميا، من المقال الأكاديمي للـ CV والإيميلات الرسمية.' },
  { id: 'web-011', name: 'UsingEnglish', url: 'https://www.usingenglish.com', category: 'websites', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'مكتبة ضخمة: جرامر، phrasal verbs، تعبيرات اصطلاحية، واختبارات مستوى.' },
  { id: 'web-012', name: 'EnglishClub', url: 'https://www.englishclub.com', category: 'websites', cost: 'free', levels: ALL, descriptionAr: 'موقع شامل للمتعلم والمدرس: قواعد وكلمات وألعاب ونطق، منذ التسعينات وشغال.' },
  { id: 'web-013', name: 'TalkEnglish', url: 'https://www.talkenglish.com', category: 'websites', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'آلاف الجمل الصوتية مرتبة بمواقف الحياة، ممتاز لبناء المحادثة من الصفر.' },
  { id: 'web-014', name: 'Espresso English', url: 'https://www.espressoenglish.net', category: 'websites', cost: 'freemium', levels: ['B1','B2','C1'], descriptionAr: 'دروس قصيرة مركزة بتصحح أشهر الأخطاء اللي بيقع فيها المتعلمين.' },
  { id: 'web-015', name: 'Vocabulary.com', url: 'https://www.vocabulary.com', category: 'websites', cost: 'freemium', levels: ['B1','B2','C1','C2'], descriptionAr: 'أذكى موقع كلمات: بيعلمك الكلمة بأسئلة متكيفة مع مستواك، إدمان مفيد.' },
  { id: 'web-016', name: 'FreeRice', url: 'https://freerice.com', category: 'websites', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'لعبة كلمات كل إجابة صح فيها بتتبرع أرز للجوعى، اتعلم واعمل خير.' },
  { id: 'web-017', name: 'LyricsTraining', url: 'https://lyricstraining.com', category: 'websites', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'اسمع أغانيك المفضلة واملأ الكلمات الناقصة، أحلى تدريب استماع على الإطلاق.' },
  { id: 'web-018', name: 'FluentU', url: 'https://www.fluentu.com', category: 'websites', cost: 'paid', levels: ['A2','B1','B2','C1'], descriptionAr: 'فيديوهات حقيقية (إعلانات وأفلام وأخبار) بترجمة تفاعلية، مدفوع لكنه ممتاز.' },
  { id: 'web-019', name: 'English Central', url: 'https://www.englishcentral.com', category: 'websites', cost: 'freemium', levels: ['A2','B1','B2'], descriptionAr: 'اتفرج على فيديوهات وقلدها بصوتك، والموقع بيقيم نطقك بالتفصيل.' },
  { id: 'web-020', name: 'USA Learns', url: 'https://www.usalearns.org', category: 'websites', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'كورسات إنجليزي مجانية كاملة مدعومة من الحكومة الأمريكية، من الصفر للمتوسط.' },
  { id: 'web-021', name: 'iSLCollective', url: 'https://en.islcollective.com', category: 'websites', cost: 'free', levels: ALL, descriptionAr: 'ملايين أوراق العمل المجانية اللي بيعملها مدرسين من كل العالم، كنز للتمارين.' },
  { id: 'web-022', name: 'Wordwall', url: 'https://wordwall.net', category: 'websites', cost: 'freemium', levels: ['A1','A2','B1'], descriptionAr: 'أنشطة تفاعلية وألعاب تعليمية جاهزة، مطابقة وكويزات وعجلة حظ.' },
  { id: 'web-023', name: 'Baamboozle', url: 'https://www.baamboozle.com', category: 'websites', cost: 'freemium', levels: ['A1','A2','B1'], descriptionAr: 'ألعاب مراجعة جماعية ممتعة، مثالية للمذاكرة مع صحابك أو في السنتر.' },
  { id: 'web-024', name: 'ESL Games Plus', url: 'https://www.eslgamesplus.com', category: 'websites', cost: 'free', levels: ['A1','A2'], descriptionAr: 'ألعاب مجانية للمبتدئين والأطفال: كلمات وجمل ونطق في شكل لعب.' },
  { id: 'web-025', name: 'Agenda Web', url: 'https://www.agendaweb.org', category: 'websites', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'مئات التمارين المجانية على القواعد والكلمات، بسيط ومباشر من غير تسجيل.' },
  { id: 'web-026', name: "Dave's ESL Cafe", url: 'https://www.eslcafe.com', category: 'websites', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'من أقدم مواقع الإنجليزي: تعبيرات اصطلاحية ومنتديات وأسئلة للمدرس Dave.' },
  { id: 'web-027', name: 'Test-English', url: 'https://test-english.com', category: 'websites', cost: 'free', levels: ['A2','B1','B2','C1'], descriptionAr: 'اختبارات مستوى وتمارين قواعد واستماع بتصحيح فوري وشرح للإجابات.' },
  { id: 'web-028', name: 'Exam English', url: 'https://www.examenglish.com', category: 'websites', cost: 'free', levels: ['B1','B2','C1','C2'], descriptionAr: 'اختبارات مجانية لكل مستويات CEFR وامتحانات IELTS و TOEFL والكامبريدج.' },
  { id: 'web-029', name: 'English Grammar Online', url: 'https://www.ego4u.com', category: 'websites', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'شرح قواعد مرجعي مع تمارين، قوي في تفاصيل الأزمنة والقواعد الشائكة.' },
  { id: 'web-030', name: 'Flo-Joe', url: 'https://www.flo-joe.co.uk', category: 'websites', cost: 'free', levels: ['B2','C1','C2'], descriptionAr: 'تدريبات يومية لامتحانات كامبريدج (B2 First و C1 Advanced) من سنة 2000.' },
  { id: 'web-031', name: 'Breaking News English', url: 'https://breakingnewsenglish.com', category: 'websites', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'دروس جاهزة على أحدث الأخبار بـ 7 مستويات صعوبة، بتنزل كل يومين.' },
  { id: 'web-032', name: 'British Council LearnEnglish Teens', url: 'https://learnenglishteens.britishcouncil.org', category: 'websites', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'نسخة المراهقين من موقع المجلس الثقافي، محتوى أخف وأسهل للمبتدئين.' },

  // ============ الممارسة مع النيتيف ============
  { id: 'nat-001', name: 'italki', url: 'https://www.italki.com', category: 'native', cost: 'paid', levels: ALL, descriptionAr: 'مدرسين نيتيف بالساعة بأسعار تبدأ من كام دولار، أحسن استثمار في المحادثة.' },
  { id: 'nat-002', name: 'Preply', url: 'https://preply.com', category: 'native', cost: 'paid', levels: ALL, descriptionAr: 'منصة مدرسين ضخمة، اختار مدرسك حسب السعر والتقييم واحجز حصة تجريبية.' },
  { id: 'nat-003', name: 'Cambly', url: 'https://www.cambly.com', category: 'native', cost: 'paid', levels: ['A2','B1','B2','C1'], descriptionAr: 'اتكلم مع نيتيف فورا بضغطة زرار من غير حجز، مناسب للتدريب اليومي العشوائي.' },
  { id: 'nat-004', name: 'Tandem', url: 'https://www.tandem.net', category: 'native', cost: 'freemium', levels: ['A2','B1','B2','C1'], descriptionAr: 'تبادل لغات: تعلم واحد إنجليزي عربي وهو يعلمك إنجليزي، مجانا.' },
  { id: 'nat-005', name: 'HelloTalk', url: 'https://www.hellotalk.com', category: 'native', cost: 'freemium', levels: ['A1','A2','B1','B2'], descriptionAr: 'شات مع نيتيف من كل العالم مع تصحيح جمل مدمج، أشهر تطبيق تبادل لغات.' },
  { id: 'nat-006', name: 'Speaky', url: 'https://www.speaky.com', category: 'native', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'تبادل لغات مجاني بسيط وسريع، ادخل وابدأ كلم ناس على طول.' },
  { id: 'nat-007', name: 'Conversation Exchange', url: 'https://www.conversationexchange.com', category: 'native', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'أقدم موقع تبادل محادثة، بيجمعك بشركاء للكلام المباشر أو المراسلة.' },
  { id: 'nat-008', name: 'MyLanguageExchange', url: 'https://www.mylanguageexchange.com', category: 'native', cost: 'freemium', levels: ['B1','B2','C1'], descriptionAr: 'مجتمع تبادل لغات من 2000، طريقته منظمة ومبنية على خطط جلسات واضحة.' },
  { id: 'nat-009', name: 'Lingoda', url: 'https://www.lingoda.com', category: 'native', cost: 'paid', levels: ['A2','B1','B2','C1'], descriptionAr: 'حصص جروبات صغيرة لايف مع مدرسين معتمدين، بنظام اشتراك شهري.' },
  { id: 'nat-010', name: 'Free4Talk', url: 'https://www.free4talk.com', category: 'native', cost: 'free', levels: ['A2','B1','B2','C1'], descriptionAr: 'غرف صوتية جماعية مجانية للتدريب على الكلام، ادخل أي غرفة واتكلم.' },
  { id: 'nat-011', name: 'Episoden', url: 'https://www.episoden.com', category: 'native', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'مكالمات فيديو عشوائية مجانية 7 دقايق مع متعلمين ونيتيف من كل العالم.' },
  { id: 'nat-012', name: 'Verbling', url: 'https://www.verbling.com', category: 'native', cost: 'paid', levels: ['B1','B2','C1'], descriptionAr: 'حصص لايف احترافية مع مدرسين معتمدين، جودة عالية للجادين.' },
  { id: 'nat-013', name: 'AmazingTalker', url: 'https://amazingtalker.com', category: 'native', cost: 'paid', levels: ALL, descriptionAr: 'سوق مدرسين بأسعار متنوعة، اختار اللي يناسب ميزانيتك وجرب أول حصة.' },
  { id: 'nat-014', name: 'Meetup', url: 'https://www.meetup.com', category: 'native', cost: 'freemium', levels: ['B1','B2','C1'], descriptionAr: 'ابحث عن English Conversation وادخل جروبات بتتقابل أونلاين أو في بلدك.' },
  { id: 'nat-015', name: 'Discord - English Server', url: 'https://discord.com/invite/english', category: 'native', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'أكبر سيرفر ديسكورد لتعلم الإنجليزي، غرف صوتية شغالة 24 ساعة.' },

  // ============ بودكاست ============
  { id: 'pod-001', name: '6 Minute English (BBC)', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', category: 'podcasts', cost: 'free', levels: ['A2','B1'], descriptionAr: 'حلقة 6 دقايق في موضوع شيق مع كلمات جديدة متشرحة، أشهر بودكاست للمتعلمين.' },
  { id: 'pod-002', name: 'The English We Speak (BBC)', url: 'https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak', category: 'podcasts', cost: 'free', levels: ['B1','B2'], descriptionAr: '3 دقايق بتعلمك تعبير بريطاني واحد شائع، مثالي يوميا في أي مشوار.' },
  { id: 'pod-003', name: "Luke's English Podcast", url: 'https://teacherluke.co.uk', category: 'podcasts', cost: 'free', levels: ['B1','B2','C1','C2'], descriptionAr: 'أكتر من 900 حلقة كوميدية تعليمية من مدرس بريطاني، رفيقك في أي مشوار طويل.' },
  { id: 'pod-004', name: 'All Ears English', url: 'https://www.allearsenglish.com', category: 'podcasts', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'بودكاست أمريكي يومي عن المحادثة الطبيعية والثقافة، حلقات خفيفة وسريعة.' },
  { id: 'pod-005', name: 'ESL Pod', url: 'https://www.eslpod.com', category: 'podcasts', cost: 'freemium', levels: ['A2','B1','B2'], descriptionAr: 'حوارات بطيئة متشرحة كلمة كلمة، من أشهر بودكاستات تعلم الإنجليزي قديما.' },
  { id: 'pod-006', name: 'Business English Pod', url: 'https://www.businessenglishpod.com', category: 'podcasts', cost: 'freemium', levels: ['B2','C1','C2'], descriptionAr: 'إنجليزي الشغل والمقابلات والاجتماعات والتفاوض، أساسي لأي حد بيشتغل.' },
  { id: 'pod-007', name: 'Culips', url: 'https://www.culips.com', category: 'podcasts', cost: 'freemium', levels: ['B2','C1','C2'], descriptionAr: 'محادثات طبيعية بين كنديين مع شرح للتعبيرات، بتدربك على الإنجليزي الحقيقي.' },
  { id: 'pod-008', name: 'Coffee Break English', url: 'https://coffeebreaklanguages.com/coffeebreakenglish/', category: 'podcasts', cost: 'free', levels: ['A2','B1'], descriptionAr: 'حلقات قصيرة هادية بتبني الأساس بالترتيب، مناسبة للمبتدئين تماما.' },
  { id: 'pod-009', name: 'Easy Stories in English', url: 'https://easystoriesinenglish.com', category: 'podcasts', cost: 'free', levels: ['A2','B1'], descriptionAr: 'قصص محكية بإنجليزي بطيء وواضح، اسمع قبل النوم واتعلم من غير مجهود.' },
  { id: 'pod-010', name: 'Plain English', url: 'https://www.plainenglish.com', category: 'podcasts', cost: 'freemium', levels: ['A2','B1','B2'], descriptionAr: 'أخبار ومواضيع شيقة بإنجليزي بطيء بسيط، مع ترانسكريبت كامل لكل حلقة.' },
  { id: 'pod-011', name: 'Leonardo English', url: 'https://www.leonardoenglish.com', category: 'podcasts', cost: 'freemium', levels: ['B1','B2','C1'], descriptionAr: 'بودكاست الفضوليين: مواضيع تاريخ وعلوم مشوقة بإنجليزي واضح ومقصود للمتعلم.' },
  { id: 'pod-012', name: 'Thinking in English', url: 'https://thinkinginenglish.blog', category: 'podcasts', cost: 'freemium', levels: ['B1','B2','C1'], descriptionAr: 'حلقات بتعلمك تفكر بالإنجليزي مش تترجم، مع ترانسكريبت لكل حلقة.' },
  { id: 'pod-013', name: 'RealLife English', url: 'https://reallifeglobal.com', category: 'podcasts', cost: 'freemium', levels: ['B1','B2','C1'], descriptionAr: 'اتعلم الإنجليزي الحقيقي من الأفلام والمسلسلات والأغاني، فلسفة تعلم مختلفة.' },
  { id: 'pod-014', name: 'Down to Business English', url: 'https://downtobusinessenglish.com', category: 'podcasts', cost: 'free', levels: ['B2','C1'], descriptionAr: 'أخبار بيزنس متشرحة ببساطة، ممتاز لو شغال أو بتجهز لشغل إنجليزي.' },
  { id: 'pod-015', name: 'Podcasts in English', url: 'https://www.podcastsinenglish.com', category: 'podcasts', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'حلقات قصيرة جدا مرتبة بالمستوى مع ترانسكريبت، مثالية للمبتدئين.' },
  { id: 'pod-016', name: 'TED Talks Daily', url: 'https://www.ted.com/podcasts', category: 'podcasts', cost: 'free', levels: ['B2','C1','C2'], descriptionAr: 'حلقة كل يوم من أحسن محاضرات TED، للمستويات المتقدمة اللي عايزة تحدى.' },

  // ============ قواميس وأدوات ============
  { id: 'dic-001', name: 'Cambridge Dictionary', url: 'https://dictionary.cambridge.org', category: 'dictionaries', cost: 'free', levels: ALL, descriptionAr: 'أشهر قاموس للمتعلمين: شرح بسيط، نطق بريطاني وأمريكي، وترجمة عربية.' },
  { id: 'dic-002', name: "Oxford Learner's Dictionaries", url: 'https://www.oxfordlearnersdictionaries.com', category: 'dictionaries', cost: 'free', levels: ALL, descriptionAr: 'قاموس أكسفورد للمتعلمين، ممتاز في توضيح استخدام الكلمة مع أمثلة كتير.' },
  { id: 'dic-003', name: 'Longman Dictionary', url: 'https://www.ldoceonline.com', category: 'dictionaries', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'أبسط شرح ممكن بكلمات أساسية بس، مثالي للمستوى المبتدئ والمتوسط.' },
  { id: 'dic-004', name: 'Merriam-Webster', url: 'https://www.merriam-webster.com', category: 'dictionaries', cost: 'free', levels: ['B2','C1','C2'], descriptionAr: 'القاموس الأمريكي الأشهر، مرجع النطق والمعنى الأمريكي الدقيق.' },
  { id: 'dic-005', name: 'Collins Dictionary', url: 'https://www.collinsdictionary.com', category: 'dictionaries', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'بشرح الكلمة في جملة كاملة فتفهم استخدامها، ومعاه ترجمة لكل اللغات.' },
  { id: 'dic-006', name: 'Britannica Dictionary', url: 'https://www.britannica.com/dictionary', category: 'dictionaries', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'قاموس بريتانيكا للمتعلمين، بيوضح الفروق بين الكلمات المتشابهة بشكل ممتاز.' },
  { id: 'dic-007', name: 'WordReference', url: 'https://www.wordreference.com', category: 'dictionaries', cost: 'free', levels: ALL, descriptionAr: 'أحسن قاموس ترجمة عربي-إنجليزي، ومنتديات بتجاوب على أي سؤال لغة.' },
  { id: 'dic-008', name: 'Forvo', url: 'https://forvo.com', category: 'dictionaries', cost: 'free', levels: ALL, descriptionAr: 'اسمع أي كلمة منطوقة من ناس حقيقية بلكنات مختلفة من كل العالم.' },
  { id: 'dic-009', name: 'YouGlish', url: 'https://youglish.com', category: 'dictionaries', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'اكتب الكلمة واسمعها جوه ملايين الفيديوهات الحقيقية في سياقها الطبيعي.' },
  { id: 'dic-010', name: 'Ludwig', url: 'https://ludwig.guru', category: 'dictionaries', cost: 'freemium', levels: ['B1','B2','C1','C2'], descriptionAr: 'اكتب جملتك وهو يجيبلك أمثلة مشابهة من مصادر موثوقة، بيأكد صحة أسلوبك.' },
  { id: 'dic-011', name: 'Reverso Context', url: 'https://www.reverso.net/text-translation', category: 'dictionaries', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'ترجمة الكلمة جوه جمل حقيقية مترجمة عربي-إنجليزي، بيفهمك الاستخدام الصح.' },
  { id: 'dic-012', name: 'Grammarly', url: 'https://www.grammarly.com', category: 'dictionaries', cost: 'freemium', levels: ['B1','B2','C1'], descriptionAr: 'مصحح أخطاء الكتابة الأشهر، بيلقط أخطاء الجرامر والتنسيب في أي مكان بتكتب فيه.' },
  { id: 'dic-013', name: 'ProWritingAid', url: 'https://prowritingaid.com', category: 'dictionaries', cost: 'freemium', levels: ['B2','C1','C2'], descriptionAr: 'محرر كتابة متقدم بيحلل أسلوبك ويقترح تحسينات، قوي للمقالات الطويلة.' },
  { id: 'dic-14', name: 'Hemingway Editor', url: 'https://hemingwayapp.com', category: 'dictionaries', cost: 'free', levels: ['B2','C1','C2'], descriptionAr: 'بيخلي كتابتك أبسط وأقوى: بيكشف الجمل المعقدة والمبني للمجهول.' },
  { id: 'dic-015', name: 'DeepL', url: 'https://www.deepl.com', category: 'dictionaries', cost: 'freemium', levels: ALL, descriptionAr: 'أدق مترجم آلي في العالم، ترجمات طبيعية مش حرفية زي باقي المواقع.' },
  { id: 'dic-016', name: 'Tatoeba', url: 'https://tatoeba.org', category: 'dictionaries', cost: 'free', levels: ALL, descriptionAr: 'ملايين الجمل المترجمة عربي-إنجليزي من متطوعين، اكتب أي كلمة وشوفها في جمل.' },
  { id: 'dic-017', name: 'SkELL', url: 'https://skell.sketchengine.eu', category: 'dictionaries', cost: 'free', levels: ['B2','C1','C2'], descriptionAr: 'أمثلة حقيقية لأي كلمة من النصوص الإنجليزية، مرجع الباحثين والمتقدمين.' },
  { id: 'dic-018', name: 'Thesaurus.com', url: 'https://www.thesaurus.com', category: 'dictionaries', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'أشهر قاموس مرادفات وأضداد، هيساعدك تنوع كلماتك في الكتابة.' },
  { id: 'dic-019', name: 'Etymonline', url: 'https://www.etymonline.com', category: 'dictionaries', cost: 'free', levels: ['B2','C1','C2'], descriptionAr: 'أصل كل كلمة إنجليزية وجاية منين، حفظ الكلمة أسهل لما تعرف جذرها.' },
  { id: 'dic-020', name: 'English Profile', url: 'https://www.englishprofile.org', category: 'dictionaries', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'من كامبريدج: اعرف أي كلمة مستواها إيه بالظبط من A1 لـ C2.' },
  { id: 'dic-021', name: 'Write & Improve', url: 'https://writeandimprove.com', category: 'dictionaries', cost: 'free', levels: ['A2','B1','B2','C1'], descriptionAr: 'أداة كامبريدج المجانية: اكتب أي نص وهي تصححه وتقيمه بمستوى CEFR فورا.' },
  { id: 'dic-022', name: 'Speak & Improve', url: 'https://speakandimprove.com', category: 'dictionaries', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'روبوت كامبريدج بيسمعك تتكلم ويقيم مستواك في المحادثة، مجاني بالكامل.' },

  // ============ IELTS و TOEFL ============
  { id: 'exm-001', name: 'IELTS.org (الموقع الرسمي)', url: 'https://ielts.org', category: 'exams', cost: 'free', levels: ['B1','B2','C1','C2'], subcategory: 'IELTS', descriptionAr: 'الموقع الرسمي للامتحان: شكل الامتحان، نماذج مجانية، وحجز الامتحان نفسه.' },
  { id: 'exm-002', name: 'British Council - IELTS', url: 'https://takeielts.britishcouncil.org/prepare', category: 'exams', cost: 'freemium', levels: ['B1','B2','C1'], subcategory: 'IELTS', descriptionAr: 'حجز الامتحان في مصر وكورسات تحضير ونماذج مجانية من المجلس الثقافي البريطاني.' },
  { id: 'exm-003', name: 'IDP IELTS', url: 'https://ielts.idp.com/', category: 'exams', cost: 'freemium', levels: ['B1','B2','C1'], subcategory: 'IELTS', descriptionAr: 'الشريك الرسمي التاني للامتحان: مواد تحضير مجانية و Masterclass مجاني.' },
  { id: 'exm-004', name: 'IELTS Liz', url: 'https://ieltsliz.com', category: 'exams', cost: 'free', levels: ['B1','B2','C1'], subcategory: 'IELTS', descriptionAr: 'أشهر موقع نصايح IELTS في العالم، دروس مجانية لكل قسم من الامتحان.' },
  { id: 'exm-005', name: 'IELTS Advantage', url: 'https://www.ieltsadvantage.com', category: 'exams', cost: 'freemium', levels: ['B2','C1','C2'], subcategory: 'IELTS', descriptionAr: 'متخصص في رفع سكور الكتابة والسبيكينج، خدمة تصحيح المقالات قوية جدا.' },
  { id: 'exm-006', name: 'IELTS Buddy', url: 'https://www.ieltsbuddy.com', category: 'exams', cost: 'free', levels: ['A2','B1','B2'], subcategory: 'IELTS', descriptionAr: 'نماذج امتحانات وأسئلة حقيقية سابقة مع إجابات نموذجية، كنز مجاني.' },
  { id: 'exm-007', name: 'IELTS Material', url: 'https://ieltsmaterial.com', category: 'exams', cost: 'freemium', levels: ['B1','B2','C1'], subcategory: 'IELTS', descriptionAr: 'مكتبة ضخمة من نماذج الاختبارات والكلمات والإجابات النموذجية.' },
  { id: 'exm-008', name: 'IELTS Online Tests', url: 'https://ieltsonlinetests.com', category: 'exams', cost: 'freemium', levels: ['B1','B2','C1'], subcategory: 'IELTS', descriptionAr: 'نماذج اختبارات محاكية للامتحان الحقيقي بتتصحح أونلاين فورا.' },
  { id: 'exm-009', name: 'E2 IELTS', url: 'https://www.e2language.com', category: 'exams', cost: 'freemium', levels: ['B1','B2','C1'], subcategory: 'IELTS', descriptionAr: 'منصة تحضير كاملة بفيديوهات ولايف كلاسات وتصحيح كتابة، عندها باقة مجانية.' },
  { id: 'exm-010', name: 'Magoosh IELTS', url: 'https://magoosh.com/ielts/', category: 'exams', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'IELTS', descriptionAr: 'كورس تحضير منظم بالفيديو مع بنك أسئلة، من أشهر منصات التحضير المدفوعة.' },
  { id: 'exm-011', name: 'English Speaking Success (Keith)', url: 'https://www.youtube.com/@EnglishSpeakingSuccess', category: 'exams', cost: 'free', levels: ['B1','B2','C1'], subcategory: 'IELTS', descriptionAr: 'قناة متخصصة في سبيكينج IELTS، Keith بيحاكي الامتحان ويعلمك تجاوب صح.' },
  { id: 'exm-012', name: 'Kaplan IELTS', url: 'https://www.kaptest.com/ielts', category: 'exams', cost: 'paid', levels: ['B2','C1'], subcategory: 'IELTS', descriptionAr: 'كورسات تحضير من شركة Kaplan العالمية، اختبارات محاكية ودراسة ذاتية.' },
  { id: 'exm-013', name: 'EnglishScore (British Council)', url: 'https://www.englishscore.com', category: 'exams', cost: 'freemium', levels: ALL, subcategory: 'اختبارات مستوى', descriptionAr: 'اختبار إنجليزي معتمد على الموبايل من المجلس الثقافي، اعرف مستواك في نص ساعة.' },
  { id: 'exm-014', name: 'EF SET', url: 'https://www.efset.org', category: 'exams', cost: 'free', levels: ALL, subcategory: 'اختبارات مستوى', descriptionAr: 'اختبار مستوى معياري مجاني 100% بشهادة، قريب في تصميمه من TOEFL و IELTS.' },
  { id: 'exm-015', name: 'TrackTest', url: 'https://tracktest.eu', category: 'exams', cost: 'freemium', levels: ALL, subcategory: 'اختبارات مستوى', descriptionAr: 'اختبار مستوى أونلاين بشهادة CEFR، نسخة مجانية كويسة تقيس مستواك.' },
  { id: 'exm-016', name: 'ETS TOEFL (الموقع الرسمي)', url: 'https://www.ets.org/toefl', category: 'exams', cost: 'free', levels: ['B1','B2','C1','C2'], subcategory: 'TOEFL', descriptionAr: 'الموقع الرسمي لامتحان TOEFL: التسجيل، شكل الامتحان، ومواد التحضير الرسمية.' },
  { id: 'exm-017', name: 'Magoosh TOEFL', url: 'https://magoosh.com/toefl/', category: 'exams', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'TOEFL', descriptionAr: 'كورس TOEFL منظم بالفيديو مع نماذج محاكية، من أشهر منصات التحضير.' },
  { id: 'exm-018', name: 'BestMyTest TOEFL', url: 'https://www.bestmytest.com/toefl', category: 'exams', cost: 'freemium', levels: ['B1','B2','C1'], subcategory: 'TOEFL', descriptionAr: 'آلاف أسئلة التدريب ونماذج محاكية مع تقييم للسبيكينج والرايتينج.' },
  { id: 'exm-019', name: 'TST Prep', url: 'https://tstprep.com', category: 'exams', cost: 'freemium', levels: ['B2','C1','C2'], subcategory: 'TOEFL', descriptionAr: 'قوالب إجابات جاهزة للسبيكينج والرايتينج في TOEFL، أسلوبهم عملي جدا.' },
  { id: 'exm-020', name: 'NoteFull TOEFL', url: 'https://www.notefull.com', category: 'exams', cost: 'freemium', levels: ['B2','C1'], subcategory: 'TOEFL', descriptionAr: 'استراتيجيات واضحة للوصول لسكور 100+، كورس مجاني تمهيدي قوي.' },
  { id: 'exm-021', name: 'Duolingo English Test', url: 'https://englishtest.duolingo.com', category: 'exams', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'اختبارات بديلة', descriptionAr: 'اختبار إنجليزي رسمي من البيت بسعر رخيص، معتمد في آلاف الجامعات.' },
  { id: 'exm-022', name: 'PTE Academic (Pearson)', url: 'https://www.pearsonpte.com', category: 'exams', cost: 'paid', levels: ['B1','B2','C1','C2'], subcategory: 'اختبارات بديلة', descriptionAr: 'امتحان بيرسون الرسمي بالكمبيوتر، بديل معتمد عالميا لـ IELTS و TOEFL.' },
  { id: 'exm-023', name: 'Cambridge English', url: 'https://www.cambridgeenglish.org', category: 'exams', cost: 'free', levels: ALL, subcategory: 'كامبريدج', descriptionAr: 'امتحانات كامبريدج الرسمية (KET و PET و FCE و CAE) وأنشطة مجانية لكل مستوى.' },
  { id: 'exm-024', name: 'IELTS Simon', url: 'https://www.ielts-simon.com', category: 'exams', cost: 'free', levels: ['B2','C1'], subcategory: 'IELTS', descriptionAr: 'نصايح يومية من مدرس IELTS بريطاني سابق، ممتاز للكتابة تحديدا.' },

  // ============ كتب لكل مستوى ============
  // جرامر
  { id: 'bok-001', name: 'English Grammar in Use - Raymond Murphy', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-grammar-use-5th-edition', category: 'books', cost: 'paid', levels: ['B1','B2'], subcategory: 'جرامر', descriptionAr: 'أشهر كتاب جرامر في التاريخ، الوحدة الزرقا، مناسب للمستوى المتوسط.' },
  { id: 'bok-002', name: 'Essential Grammar in Use (الكتاب الأحمر)', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/essential-grammar-use-4th-edition', category: 'books', cost: 'paid', levels: ['A1','A2'], subcategory: 'جرامر', descriptionAr: 'نفس أسلوب Murphy لكن للمبتدئين تماما، أول كتاب جرامر تبدأ بيه.' },
  { id: 'bok-003', name: 'Advanced Grammar in Use', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/advanced-grammar-use-3rd-edition/product-details/books', category: 'books', cost: 'paid', levels: ['C1','C2'], subcategory: 'جرامر', descriptionAr: 'الجزء المتقدم من السلسلة، للي عايز يتقن التفاصيل الدقيقة للقواعد.' },
  { id: 'bok-004', name: 'Oxford Practice Grammar', url: 'https://elt.oup.com/student/practicegrammar/', category: 'books', cost: 'freemium', levels: ['A2','B1','B2'], subcategory: 'جرامر', descriptionAr: 'منافس Murphy القوي، وموقعه الرسمي فيه تدريبات جرامر مجانية أونلاين بـ 3 مستويات.' },
  { id: 'bok-005', name: 'Practical English Usage - Michael Swan', url: 'https://india.oup.com/product/practical-english-usage-fourth-international-edition-9780194202466/', category: 'books', cost: 'paid', levels: ['B2','C1','C2'], subcategory: 'جرامر', descriptionAr: 'المرجع الشامل لأي سؤال جرامر غامض، بيجاوب على الحاجات اللي الكتب بتتجاهلها.' },
  { id: 'bok-006', name: 'Understanding and Using English Grammar - Azar', url: 'https://www.pearson.com/languages/en-us/campaigns/azar-hagen-uueg.html', category: 'books', cost: 'paid', levels: ['B1','B2'], subcategory: 'جرامر', descriptionAr: 'شرح أكاديمي مفصل للقواعد، الكتاب المعتمد في جامعات ومعاهد كتير.' },
  // كلمات
  { id: 'bok-007', name: 'English Vocabulary in Use', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-vocabulary-use-elementary-3rd-edition', category: 'books', cost: 'paid', levels: ['A2','B1','B2','C1'], subcategory: 'كلمات', descriptionAr: 'سلسلة كلمات كامبريدج الشهيرة بـ 4 مستويات، تعلم الكلمة في سياقها مع تدريبات.' },
  { id: 'bok-008', name: 'Oxford Word Skills', url: 'https://elt.oup.com/catalogue/items/global/grammar_vocabulary/oxford_word_skills/', category: 'books', cost: 'paid', levels: ['A1','A2','B1'], subcategory: 'كلمات', descriptionAr: 'كلمات مرتبة بمواضيع الحياة مع رسوم وتدريبات، سلسلة بـ 3 مستويات.' },
  { id: 'bok-009', name: '4000 Essential English Words', url: 'https://www.compasspub.com/4000EEW2e', category: 'books', cost: 'paid', levels: ['A2','B1','B2'], subcategory: 'كلمات', descriptionAr: 'أشهر سلسلة كلمات للمتعلمين، 6 مستويات، كل وحدة كلمات وقصة قصيرة.' },
  { id: 'bok-010', name: 'Word Power Made Easy - Norman Lewis', url: 'https://www.simonandschuster.co.uk/books/Word-Power-Made-Easy/Norman-Lewis/9780671741907', category: 'books', cost: 'paid', levels: ['C1','C2'], subcategory: 'كلمات', descriptionAr: 'كلاسيكية بناء الكلمات من الجذور اللاتينية، هتفهم آلاف الكلمات من أصلها.' },
  { id: 'bok-011', name: 'English Collocations in Use', url: 'https://www.cambridge.org/gb/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-collocations-use-intermediate', category: 'books', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'كلمات', descriptionAr: 'اتعلم الكلمات اللي بتيجي مع بعضها (make a decision مش do)، سر الإنجليزي الطبيعي.' },
  { id: 'bok-012', name: 'English Phrasal Verbs in Use', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-phrasal-verbs-use-intermediate-2nd-edition', category: 'books', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'كلمات', descriptionAr: 'الـ phrasal verbs اللي بتحير كل حد، متجمعة ومتشرحة بالمواضيع مع تدريبات.' },
  { id: 'bok-013', name: 'English Idioms in Use', url: 'https://shop.cambridge.org/english/family/2100045353', category: 'books', cost: 'paid', levels: ['B2','C1'], subcategory: 'كلمات', descriptionAr: 'التعبيرات الاصطلاحية اللي بيسمعها كل نيتيف يوميا، بالسياق والتدريب.' },
  // مناهج عامة
  { id: 'bok-014', name: 'American English File', url: 'https://elt.oup.com/catalogue/items/global/adult_courses/american-english-file/', category: 'books', cost: 'paid', levels: ['A1','A2','B1','B2'], subcategory: 'مناهج عامة', descriptionAr: 'من أشهر المناهج العالمية، متوازن بين المهارات الأربعة وبيلهب حماس الطالب.' },
  { id: 'bok-015', name: 'Headway', url: 'https://elt.oup.com/catalogue/items/global/adult_courses/headway/', category: 'books', cost: 'paid', levels: ALL, subcategory: 'مناهج عامة', descriptionAr: 'المنهج البريطاني الكلاسيكي، بياخدك من المبتدئ للمتقدم بسلسلة واحدة.' },
  { id: 'bok-016', name: 'Interchange', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/adult-courses/interchange-5th-edition', category: 'books', cost: 'paid', levels: ['A1','A2','B1'], subcategory: 'مناهج عامة', descriptionAr: 'منهج كامبريدج للمبتدئين والمتوسط، مركز على المحادثة اليومية.' },
  { id: 'bok-017', name: 'Speakout', url: 'https://www.pearson.com/languages/en-us/educators/connected-english-learning-program/adult/speakout.html', category: 'books', cost: 'paid', levels: ['A1','A2','B1','B2','C1'], subcategory: 'مناهج عامة', descriptionAr: 'منهج بيرسون المبني على محتوى BBC الحقيقي، ممتاز للمحادثة والاستماع.' },
  { id: 'bok-018', name: 'Cutting Edge', url: 'https://www.pearson.com/languages/educators/connected-english-learning-program/adult/cutting-edge.html', category: 'books', cost: 'paid', levels: ['A2','B1','B2','C1'], subcategory: 'مناهج عامة', descriptionAr: 'منهج عملي بيخليك تستخدم اللغة في مهام حقيقية، مش مجرد حفظ قواعد.' },
  { id: 'bok-019', name: 'Cambridge Empower', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/adult-courses/empower-2nd-edition', category: 'books', cost: 'paid', levels: ['A2','B1','B2','C1'], subcategory: 'مناهج عامة', descriptionAr: 'منهج كامبريدج الحديث، بيقيس تقدمك بمعايير CEFR بشكل مستمر.' },
  { id: 'bok-020', name: 'Unlock', url: 'https://shop.cambridge.org/english/family/2100038711', category: 'books', cost: 'paid', levels: ['A2','B1','B2','C1'], subcategory: 'مناهج عامة', descriptionAr: 'منهج أكاديمي من كامبريدج مبني على فيديوهات Discovery، ممتاز للجامعة.' },
  { id: 'bok-021', name: 'Life (National Geographic)', url: 'https://www.eltngl.com/series/PRO0000009209', category: 'books', cost: 'paid', levels: ['A1','A2','B1','B2','C1'], subcategory: 'مناهج عامة', descriptionAr: 'منهج ناشيونال جيوجرافيك بصور ومحتوى مذهل، بيخلي المذاكرة متعة بصرية.' },
  { id: 'bok-022', name: 'Keynote (National Geographic)', url: 'https://www.eltngl.com/series/PRO0000009213', category: 'books', cost: 'paid', levels: ['B1','B2','C1','C2'], subcategory: 'مناهج عامة', descriptionAr: 'منهج مبني على محاضرات TED الحقيقية، للي عايز إنجليزي حقيقي مش مدرسي.' },
  { id: 'bok-023', name: 'Touchstone', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/adult-courses/touchstone', category: 'books', cost: 'paid', levels: ['A1','A2','B1','B2'], subcategory: 'مناهج عامة', descriptionAr: 'مبني على أبحاث الكلام الطبيعي، بيعلمك الإنجليزي زي ما بيتقال فعلا.' },
  { id: 'bok-024', name: 'Four Corners', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/adult-courses/four-corners-2nd-edition', category: 'books', cost: 'paid', levels: ['A1','A2','B1'], subcategory: 'مناهج عامة', descriptionAr: 'منهج سهل وواضح للمبتدئين، كل وحدة بتخلص بنشاط محادثة ممتع.' },
  { id: 'bok-025', name: 'Face2face', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/adult-courses/face2face-2nd-edition', category: 'books', cost: 'paid', levels: ['A1','A2','B1','B2','C1'], subcategory: 'مناهج عامة', descriptionAr: 'منهج كامبريدج للكلام اليومي، معروف في المعاهد ومنتشر جدا.' },
  { id: 'bok-026', name: 'Navigate', url: 'https://www.oup.com.au/elt/navigate', category: 'books', cost: 'paid', levels: ['A2','B1','B2','C1'], subcategory: 'مناهج عامة', descriptionAr: 'منهج أكسفورد للكبار بمحتوى عصري وأنشطة تواصل واقعية.' },
  { id: 'bok-027', name: 'Outcomes', url: 'https://www.eltngl.com/series/PRO0000009195', category: 'books', cost: 'paid', levels: ['A2','B1','B2','C1'], subcategory: 'مناهج عامة', descriptionAr: 'منهج ناشيونال جيوجرافيك مركز على المحادثة الطبيعية والتعبيرات الحقيقية.' },
  // مهارات
  { id: 'bok-028', name: 'Reading Explorer', url: 'https://www.eltngl.com/series/PRO0000009087', category: 'books', cost: 'paid', levels: ['A2','B1','B2','C1'], subcategory: 'مهارات', descriptionAr: 'أحسن سلسلة قراءة: نصوص ناشيونال جيوجرافيك حقيقية بتبني السرعة والفهم.' },
  { id: 'bok-029', name: 'Q: Skills for Success', url: 'https://elt.oup.com/catalogue/items/global/skills/q_skills_for_success_third_edition/', category: 'books', cost: 'paid', levels: ['A2','B1','B2','C1'], subcategory: 'مهارات', descriptionAr: 'سلسلة أكسفورد الأكاديمية، كل مستوى بين قراءة وكتابة أو استماع ومحادثة.' },
  { id: 'bok-030', name: 'Pathways', url: 'https://www.eltngl.com/series/PRO0000009196', category: 'books', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'مهارات', descriptionAr: 'سلسلة أكاديمية شاملة من ناشيونال جيوجرافيك بمحتوى بصري رائع.' },
  { id: 'bok-031', name: 'NorthStar', url: 'https://www.pearson.com/languages/en-us/educators/connected-english-learning-program/adult/northstar.html', category: 'books', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'مهارات', descriptionAr: 'سلسلة بيرسون الأكاديمية العريقة، مثالية للتحضير للدراسة الجامعية بالإنجليزي.' },
  { id: 'bok-032', name: 'Great Writing', url: 'https://www.eltngl.com/series/PRO0000009081', category: 'books', cost: 'paid', levels: ['A2','B1','B2','C1'], subcategory: 'مهارات', descriptionAr: 'سلسلة تعلم الكتابة من الجملة للمقال الكامل، بتاخدك خطوة خطوة.' },
  { id: 'bok-033', name: 'Longman Academic Writing Series', url: 'https://www.pearson.com/languages/educators/connected-english-learning-program/adult/longman-academic-writing.html', category: 'books', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'مهارات', descriptionAr: 'السلسلة المعتمدة في الجامعات لتعليم المقال الأكاديمي من الصفر.' },
  { id: 'bok-035', name: 'Skillful', url: 'https://www.macmillanenglish.com/us/catalogue/courses/adults-and-young-adults/skillful3e/course-information', category: 'books', cost: 'paid', levels: ['A2','B1','B2','C1'], subcategory: 'مهارات', descriptionAr: 'سلسلة ماكميلان الحديثة، بتجمع المهارات الأكاديمية مع التفكير النقدي.' },
  // IELTS و TOEFL books
  { id: 'bok-036', name: 'The Official Cambridge Guide to IELTS', url: 'https://www.cambridge.org/gb/cambridgeenglish/catalog/cambridge-english-exams-ielts/product/official-cambridge-guide-ielts', category: 'books', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'تحضير IELTS', descriptionAr: 'الكتاب الرسمي الوحيد من كامبريدج لامتحان IELTS، شرح ونماذج حقيقية.' },
  { id: 'bok-037', name: 'IELTS Trainer 2', url: 'https://www.cambridge.org/gb/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts/ielts-trainer-2', category: 'books', cost: 'paid', levels: ['B1','B2'], subcategory: 'تحضير IELTS', descriptionAr: '6 امتحانات محاكية كاملة مع شرح الإجابات، أحسن تدريب قبل الامتحان.' },
  { id: 'bok-038', name: 'Complete IELTS', url: 'https://www.cambridge.org/ae/cambridgeenglish/catalog/cambridge-english-exams-ielts/complete-ielts', category: 'books', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'تحضير IELTS', descriptionAr: 'كورس كامل للتحضير من كامبريدج حسب السكور المستهدف (4-5 و 5-6.5 و 6.5-7.5).' },
  { id: 'bok-039', name: 'Barron’s IELTS', url: 'https://www.simonandschuster.co.uk/books/IELTS/Lin-Lougheed/Barrons-Test-Prep/9781438011790', category: 'books', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'تحضير IELTS', descriptionAr: 'كتاب التحضير الأمريكي الشهير مع نماذج وأوديو، إضافة قوية جنب كامبريدج.' },
  { id: 'bok-040', name: 'Target Band 7 - Simone Braverman', url: 'https://www.ielts-blog.com', category: 'books', cost: 'paid', levels: ['B1','B2'], subcategory: 'تحضير IELTS', descriptionAr: 'كتاب عملي مشهور بيوصلك لسكور 7 بأسلوب بسيط وخطة واضحة.' },
  { id: 'bok-042', name: 'The Official Guide to the TOEFL Test', url: 'https://www.ets.org/toefl/test-takers/ibt/prepare/tests.html', category: 'books', cost: 'paid', levels: ['B1','B2','C1'], subcategory: 'تحضير TOEFL', descriptionAr: 'الدليل الرسمي الكامل للامتحان: شرح كل قسم ونماذج بإجابات نموذجية.' },
  // قواميس مطبوعة
  { id: 'bok-043', name: "Oxford Advanced Learner's Dictionary", url: 'https://india.oup.com/product/oxford-advanced-learners-dictionary-11th-edition-9780194286206/', category: 'books', cost: 'paid', levels: ['B1','B2','C1','C2'], subcategory: 'قواميس', descriptionAr: 'أشهر قاموس مطبوع للمتعلمين، مرجعك الأساسي طول رحلتك.' },
  { id: 'bok-044', name: 'Oxford Collocations Dictionary', url: 'https://india.oup.com/product/oxford-collocation-dictionary-2e-st-english-pack-9780194840767/', category: 'books', cost: 'paid', levels: ['B2','C1','C2'], subcategory: 'قواميس', descriptionAr: 'قاموس الكلمات المتقارنة: أي كلمة بتيجي مع إيه، سر الكتابة الطبيعية المتقنة.' },

  // ============ قراءة واستماع متدرج ============
  { id: 'rdr-001', name: 'Oxford Bookworms Library', url: 'https://elt.oup.com/catalogue/items/global/graded_readers/oxford_bookworms_library/', category: 'readers', cost: 'paid', levels: ALL, descriptionAr: 'أشهر سلسلة قصص متدرجة في العالم، 7 مستويات من A1 لـ C1، قصص عالمية مبسطة.' },
  { id: 'rdr-002', name: 'Pearson English Readers', url: 'https://www.pearson.com/languages/en-us/educators/connected-english-learning-program/pearson-english-readers.html', category: 'readers', cost: 'paid', levels: ALL, descriptionAr: 'سلسلة قصص بيرسون المتدرجة، قصص أفلام وروايات شهيرة بمستويات سهلة.' },
  { id: 'rdr-003', name: 'Cambridge English Readers', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/secondary/cambridge-english-readers', category: 'readers', cost: 'paid', levels: ALL, descriptionAr: 'قصص أصلية مكتوبة خصيصا للمتعلمين من كامبريدج، 7 مستويات بجودة أدبية عالية.' },
  { id: 'rdr-004', name: 'Macmillan Readers', url: 'https://www.macmillanenglish.com/us/macmillanreaders', category: 'readers', cost: 'paid', levels: ALL, descriptionAr: 'مكتبة ماكميلان المتدرجة، قصص كلاسيكية وحديثة مع تسجيلات صوتية.' },
  { id: 'rdr-005', name: 'News in Levels', url: 'https://www.newsinlevels.com', category: 'readers', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'نفس الخبر مكتوب بـ 3 مستويات صعوبة مع فيديو، اقرأ كل يوم وارتقى بنفسك.' },
  { id: 'rdr-006', name: 'ReadTheory', url: 'https://readtheory.org', category: 'readers', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'نصوص قراءة بأسئلة فهم، الموقع بيرفع مستوى الصعوبة تلقائيا حسب أدائك.' },
  { id: 'rdr-007', name: 'ESL Fast', url: 'https://www.eslfast.com', category: 'readers', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'مئات القصص القصيرة جدا مع صوت وأسئلة، مثالية للمبتدئين تماما.' },
  { id: 'rdr-008', name: 'StoryWeaver', url: 'https://storyweaver.org.in', category: 'readers', cost: 'free', levels: ['A1','A2'], descriptionAr: 'آلاف القصص المصورة المجانية للمبتدئين والأطفال، بمستويات قراءة متدرجة.' },
  { id: 'rdr-009', name: 'LibriVox', url: 'https://librivox.org', category: 'readers', cost: 'free', levels: ['C1','C2'], descriptionAr: 'آلاف الكتب الصوتية المجانية من الكلاسيكيات، للمتقدمين اللي بيحبوا الأدب.' },
  { id: 'rdr-010', name: 'Lit2Go', url: 'https://etc.usf.edu/lit2go/', category: 'readers', cost: 'free', levels: ['B2','C1','C2'], descriptionAr: 'قصص وقصائد كلاسيكية بنص وصوت، من جامعة فلوريدا الجنوبية.' },
  { id: 'rdr-011', name: 'Project Gutenberg', url: 'https://www.gutenberg.org', category: 'readers', cost: 'free', levels: ['C1','C2'], descriptionAr: 'أكتر من 70 ألف كتاب إلكتروني مجاني، مكتبة الأدب الإنجليزي الكلاسيكي كاملة.' },
  { id: 'rdr-012', name: 'ManyBooks', url: 'https://manybooks.net', category: 'readers', cost: 'free', levels: ['B2','C1','C2'], descriptionAr: 'آلاف الكتب الإلكترونية المجانية بتنسيقات لكل الأجهزة، مكتبة ضخمة.' },
  { id: 'rdr-013', name: 'ESL Bits', url: 'https://esl-bits.net', category: 'readers', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'قصص قصيرة وروايات صوتية بسرعات مختلفة مع النص، تدريب استماع ممتاز.' },
  { id: 'rdr-014', name: 'English e-Reader', url: 'https://english-e-reader.net', category: 'readers', cost: 'free', levels: ['A1','A2','B1','B2'], descriptionAr: 'قصص متدرجة مجانية بالصوت والنص، مكتبة كبيرة لكل المستويات.' },
  { id: 'rdr-015', name: 'ReadWorks', url: 'https://www.readworks.org', category: 'readers', cost: 'free', levels: ['A2','B1','B2'], descriptionAr: 'آلاف النصوص القرائية مع أسئلة، مصممة للمدارس ومجانية بالكامل.' },
  { id: 'rdr-016', name: 'CommonLit', url: 'https://www.commonlit.org', category: 'readers', cost: 'free', levels: ['B1','B2','C1'], descriptionAr: 'مكتبة نصوص أدبية ومقالات مع أسئلة فهم، مجانية وتستخدمها مدارس أمريكا.' },
  { id: 'rdr-017', name: 'Newsela', url: 'https://newsela.com', category: 'readers', cost: 'freemium', levels: ['A2','B1','B2','C1'], descriptionAr: 'أخبار حقيقية معاد كتابتها بمستويات صعوبة مختلفة، تقرأ الخبر على قد مستواك.' },
  { id: 'rdr-018', name: 'Storyline Online', url: 'https://storylineonline.net', category: 'readers', cost: 'free', levels: ['A1','A2'], descriptionAr: 'ممثلين مشهورين بيحكوا قصص أطفال مصورة، ممتعة ومفيدة للمبتدئين.' },

  // ============ للمتعلم المصري والعربي ============
  { id: 'arb-001', name: 'إدراك (Edraak)', url: 'https://www.edraak.org', category: 'arabic', cost: 'free', levels: ['A1','A2','B1'], descriptionAr: 'منصة عربية مجانية فيها كورسات إنجليزي متكاملة من الصفر، بالشرح العربي.' },
  { id: 'arb-002', name: 'نفهم (Nafham)', url: 'https://www.nafham.com', category: 'arabic', cost: 'free', levels: ['A1','A2'], descriptionAr: 'منصة مصرية مجانية فيها شرح مناهج الإنجليزي لكل المراحل الدراسية المصرية.' },
  { id: 'arb-003', name: 'رواق (Rwaq)', url: 'https://www.rwaq.org', category: 'arabic', cost: 'free', levels: ['A2','B1'], descriptionAr: 'منصة عربية مجانية فيها كورسات لغة إنجليزية بمدرسين عرب أكفاء.' },
  { id: 'arb-004', name: 'ZAmericanEnglish', url: 'https://zamericanenglish.net/', category: 'arabic', cost: 'freemium', levels: ['A1','A2','B1'], descriptionAr: 'منصة مصرية مشهورة لتعليم الإنجليزي بالعربي، كورسات من الصفر للاحتراف.' },
  { id: 'arb-005', name: 'Coursera (بترجمة عربية)', url: 'https://www.coursera.org', category: 'arabic', cost: 'freemium', levels: ['B1','B2','C1'], descriptionAr: 'كورسات إنجليزي من جامعات عالمية، كتير منها بترجمة عربية ومجاني للمشاهدة.' },
  { id: 'arb-006', name: 'British Council Egypt', url: 'https://www.britishcouncil.org.eg', category: 'arabic', cost: 'paid', levels: ALL, descriptionAr: 'المجلس الثقافي البريطاني في مصر: كورسات إنجليزي في القاهرة وأونلاين.' },
  { id: 'arb-007', name: 'Amideast Egypt', url: 'https://www.amideast.org/egypt', category: 'arabic', cost: 'paid', levels: ALL, descriptionAr: 'أقدم مؤسسة أمريكية في مصر لتعليم الإنجليزي وامتحانات TOEFL.' },
  { id: 'arb-008', name: 'محارة تك (MaharaTech)', url: 'https://maharatech.gov.eg', category: 'arabic', cost: 'free', levels: ['A2','B1'], descriptionAr: 'منصة تدريب مصرية مجانية من معهد تكنولوجيا المعلومات، فيها كورسات إنجليزي.' },
  { id: 'arb-009', name: 'Khan Academy', url: 'https://www.khanacademy.org', category: 'arabic', cost: 'free', levels: ['A2','B1'], descriptionAr: 'منصة تعليمية مجانية بالكامل، قسم الجرامر الإنجليزي فيها ممتاز للمبتدئين.' },

];

// نصايح عملية للمتعلم المصري (من غير لينكات، خبرة مجمعة)
export interface EgyptianTip {
  id: string;
  title: string;
  body: string;
}

export const EGYPTIAN_TIPS: EgyptianTip[] = [
  { id: 'tip-01', title: 'ابدأ بالأهم مش بالأسهل', body: 'أهم 1000 كلمة بتغطي حوالي 85% من الكلام اليومي. متضيعش وقتك في كلمات نادرة في الأول.' },
  { id: 'tip-02', title: 'الاستمرارية أهم من الكم', body: '15 دقيقة كل يوم أحسن من 3 ساعات مرة في الأسبوع. المخ بيحتاج التكرار اليومي عشان يثبت اللغة.' },
  { id: 'tip-03', title: 'متخافش من الغلط', body: 'أكبر عائق للمصريين هو الخوف من الإحراج. النيتيف نفسه مش بيهتم بغلطك، اتكلم واتعلم.' },
  { id: 'tip-04', title: 'اسمع أكتر ما تقرأ', body: 'أغلبنا خبرته في القراءة أقوى من السمع. خصص وقت يومي للاستماع ولو في المواصلات.' },
  { id: 'tip-05', title: 'اتعلم العامية الأمريكية زي ما هي', body: 'متترجمش من العامية المصرية حرفيا. "عامل إيه" مش How are you doing literally، خد التعبير كقطعة واحدة.' },
  { id: 'tip-06', title: 'غير لغة الموبايل للإنجليزي', body: 'خطوة بسيطة بتخليك تتعامل مع مئات الكلمات يوميا من غير ما تحس، جربها أسبوعين.' },
  { id: 'tip-07', title: 'اكتب يومياتك بالإنجليزي', body: '3 جمل كل ليلة عن يومك. الكتابة بتكشف الكلمات اللي ناقصاك فعلا مش اللي فاكر إنك محتاجها.' },
  { id: 'tip-08', title: 'لقن نفسك القاعدة 80/20', body: '20% من المجهود الصح بيجيب 80% من النتيجة: كلمات شائعة، استماع يومي، وكلام حتى لو غلط. الباقي تفاصيل.' },
];

export const SOURCES_STATS = {
  totalSources: LEARNING_SOURCES.length,
  totalCategories: SOURCE_CATEGORIES.length,
};
