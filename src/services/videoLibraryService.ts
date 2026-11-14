// ==============================================================================
// Henglish Academy (HENGLISH) - UNLIMITED DYNAMIC VIDEO & MOVIE LIBRARY SERVICE
// Dynamic discovery, 20 video categories, multi-filter search, and Supabase sync
// ==============================================================================

import { CEFRLevel } from '../types';
import { TimedSubtitle, SceneVocabulary, SceneQuiz, MovieSceneItem } from '../data/movieScenesData';
import { verifyYouTubeVideo, VideoVerificationStatus, extractYouTubeId } from './videoVerificationService';
import { supabase } from './authService';

export type VideoCategoryType =
  | 'movie_scenes'
  | 'tv_series'
  | 'sitcoms'
  | 'interviews'
  | 'daily_conversations'
  | 'street_interviews'
  | 'podcasts'
  | 'ted_talks'
  | 'documentaries'
  | 'business_english'
  | 'travel_english'
  | 'academic_english'
  | 'job_interviews'
  | 'american_english'
  | 'british_english'
  | 'pronunciation_practice'
  | 'slang_and_expressions'
  | 'english_for_beginners'
  | 'advanced_english'
  | 'listening_comprehension';

export interface VideoCategoryDef {
  id: VideoCategoryType;
  nameEn: string;
  nameAr: string;
  descriptionAr: string;
  iconName: string;
}

export const VIDEO_20_CATEGORIES: VideoCategoryDef[] = [
  { id: 'movie_scenes', nameEn: 'Movie Scenes', nameAr: 'مشاهد سينمائية شهيرة', descriptionAr: 'أقوى الحوارات السينمائية من هوليوود مع النطق واللهجات الواقعية', iconName: 'Film' },
  { id: 'tv_series', nameEn: 'TV Series', nameAr: 'مسلسلات درامية وتلفزيونية', descriptionAr: 'مشاهد من أشهر المسلسلات العالمية لتطوير الحصيلة اليومية', iconName: 'Tv' },
  { id: 'sitcoms', nameEn: 'Sitcoms & Comedy', nameAr: 'مسلسلات كوميدية (Sitcoms)', descriptionAr: 'الكوميديا والمفارقات الحوارية (Friends, The Office, Modern Family)', iconName: 'Smile' },
  { id: 'interviews', nameEn: 'Interviews & Talks', nameAr: 'مقابلات وحوارات حصرية', descriptionAr: 'لقاءات المشاهير والخبراء وأصحاب الإنجازات', iconName: 'Mic' },
  { id: 'daily_conversations', nameEn: 'Daily Conversations', nameAr: 'حوارات ومحادثات يومية', descriptionAr: 'مواقف الحياة اليومية في السوق، المطعم، والمواصلات', iconName: 'MessageCircle' },
  { id: 'street_interviews', nameEn: 'Street Interviews', nameAr: 'لقاءات الشارع الحقيقية', descriptionAr: 'حوارات عفوية مع متحدثين أصليين في شوارع لندن ونيويورك', iconName: 'Users' },
  { id: 'podcasts', nameEn: 'Podcasts', nameAr: 'بودكاست بالإنجليزية', descriptionAr: 'مقاطع صوتية وبصرية غنية بالأفكار والمفردات الدقيقة', iconName: 'Headphones' },
  { id: 'ted_talks', nameEn: 'TED Talks', nameAr: 'أحاديث تيد الملهمة (TED Talks)', descriptionAr: 'خطابات ملهمة وأفكار تغير العالم بلغة بليغة وواضحة', iconName: 'Sparkles' },
  { id: 'documentaries', nameEn: 'Documentaries', nameAr: 'أفلام وثائقية واستكشافية', descriptionAr: 'علوم، طبيعة، وتاريخ بلغة فصحى ونطق مدروس', iconName: 'Globe' },
  { id: 'business_english', nameEn: 'Business English', nameAr: 'الإنجليزية المهنية والشركات', descriptionAr: 'بيئة العمل، الاجتماعات، العروض التقديمية، والتفاوض', iconName: 'Briefcase' },
  { id: 'travel_english', nameEn: 'Travel English', nameAr: 'إنجليزية السفر والمطارات', descriptionAr: 'حجوزات الطيران، الفنادق، طلب المساعدة، والتجوال', iconName: 'Plane' },
  { id: 'academic_english', nameEn: 'Academic English', nameAr: 'الإنجليزية الأكاديمية والجامعية', descriptionAr: 'محاضرات ومصطلحات بحثية للجامعات واختبارات الآيلتس والترجمة', iconName: 'GraduationCap' },
  { id: 'job_interviews', nameEn: 'Job Interviews', nameAr: 'مقابلات التوظيف (Job Interviews)', descriptionAr: 'كيف تجيب بثقة وذكاء على أسئلة المقابلات الشخصية بالإنجليزية', iconName: 'Award' },
  { id: 'american_english', nameEn: 'American English', nameAr: 'الإنجليزية واللكنة الأمريكية 🇺🇸', descriptionAr: 'النطق الأمريكي الأصيل، الربط الصوتي، والتعابير المنتشرة', iconName: 'Compass' },
  { id: 'british_english', nameEn: 'British English', nameAr: 'الإنجليزية واللكنة البريطانية 🇬🇧', descriptionAr: 'النطق البريطاني القياسي، نغمات الصوت، ومفردات المملكة المتحدة', iconName: 'Compass' },
  { id: 'pronunciation_practice', nameEn: 'Pronunciation Practice', nameAr: 'تدريبات النطق الصوتي (Phonetics)', descriptionAr: 'مخارج الحروف الصعبة، الربط الصوتي، والرموز الصوتية IPA', iconName: 'Volume2' },
  { id: 'slang_and_expressions', nameEn: 'Slang and Expressions', nameAr: 'المصطلحات الشعبية والعامية', descriptionAr: 'الإيديومات الشائعة وما يتحدث به الشباب في الشارع', iconName: 'Flame' },
  { id: 'english_for_beginners', nameEn: 'English for Beginners', nameAr: 'إنجليزية المبتدئين (A1 - A2)', descriptionAr: 'مقاطع بطيئة وواضحة بجمل بسيطة لبناء الثقة والأساس', iconName: 'BookOpen' },
  { id: 'advanced_english', nameEn: 'Advanced English', nameAr: 'المستوى المتقدم والطلاقة (C1 - C2)', descriptionAr: 'تراكيب بلاغية معقدة، فكاهة ذكية، وسرعة نطق عالية', iconName: 'Zap' },
  { id: 'listening_comprehension', nameEn: 'Listening Comprehension', nameAr: 'اختبارات وفهم الاستماع', descriptionAr: 'تمارين وتحديات فك شفرة الكلام السريع وأسئلة الفهم', iconName: 'Ear' },
];

export interface EducationalVideoItem extends MovieSceneItem {
  category: VideoCategoryType;
  accent: 'American' | 'British' | 'International';
  verificationStatus: VideoVerificationStatus;
  lastVerifiedAt: string;
  isEmbeddable: boolean;
  contentSource: string;
  tags?: string[];
  viewCount?: number;
  savedCount?: number;
}

export interface VideoFilterOptions {
  query?: string;
  category?: VideoCategoryType | 'all';
  cefr?: CEFRLevel | 'all';
  accent?: 'all' | 'American' | 'British' | 'International';
  status?: 'verified_only' | 'all';
  page?: number;
  pageSize?: number;
}

const STORAGE_CATALOG_KEY = 'henglish_dynamic_videos_catalog_v2';
const STORAGE_SEARCH_HISTORY_KEY = 'henglish_video_search_history';
const STORAGE_SAVED_VIDEOS_KEY = 'henglish_saved_videos';
const STORAGE_RECENTLY_WATCHED_KEY = 'henglish_recently_watched_videos';

// 1. Initial Verified Seeds Catalog (Addressing the 7 audited scenes + extra category seeds)
const VERIFIED_SEEDS: EducationalVideoItem[] = [
  // 1. The Godfather
  {
    id: 'scene-godfather-offer',
    movieTitle: 'The Godfather',
    releaseYear: 1972,
    director: 'Francis Ford Coppola',
    genre: 'Crime / Drama',
    cefrLevel: 'B2',
    sceneTitle: "An Offer He Can't Refuse",
    sceneDescription: 'Don Vito Corleone comforts his godson Johnny Fontane and guarantees his breakthrough in Hollywood.',
    youtubeId: 'D6me2-OurCw', // Paramount Movies Official (100% verified playable)
    startTime: 10,
    endTime: 95,
    clipDuration: '1:25',
    videoSource: 'Paramount Movies (Official)',
    dialogueQuote: "I'm going to make him an offer he can't refuse.",
    actorName: 'Marlon Brando',
    characterName: 'Don Vito Corleone',
    thumbnailUrl: 'https://img.youtube.com/vi/D6me2-OurCw/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    contentSource: 'Paramount Pictures Official',
    subtitles: [
      {
        id: 'sub-1',
        start: 12,
        end: 18,
        en: "You spend time with your family? Good. Because a man who doesn't spend time with his family can never be a real man.",
        arEg: 'بتقضي وقت مع عيلتك؟ كويس. عشان الراجل اللي مبيقضيش وقت مع عيلته عمره ما هيبقى راجل بجد.',
        arFusha: 'هل تقضي وقتاً مع عائلتك؟ هذا جيد، فالرجل الذي لا يقضي وقتاً مع عائلته لا يمكن أن يكون رجلاً حقيقياً.',
        speaker: 'Don Corleone',
        keyWords: [
          { word: 'spend time', ipa: '/spɛnd taɪm/', meaningAr: 'يقضي وقتاً', meaningEn: 'dedicate time with someone' },
          { word: 'real man', ipa: '/rɪəl mæn/', meaningAr: 'راجل حقيقي وبجد', meaningEn: 'genuine honourable man' },
        ],
      },
      {
        id: 'sub-2',
        start: 22,
        end: 32,
        en: "Now, tell me about this movie producer. Why won't he give you the part in the film?",
        arEg: 'قولي بقى، إيه حكاية منتج الفيلم ده؟ مش راضي يديك الدور في الفيلم ليه؟',
        arFusha: 'والآن، أخبرني عن منتج هذا الفيلم. لماذا يرفض إعطاءك هذا الدور؟',
        speaker: 'Don Corleone',
        keyWords: [
          { word: 'producer', ipa: '/prəˈdjuːsər/', meaningAr: 'منتج سينمائي', meaningEn: 'person financing film' },
          { word: 'give the part', ipa: '/ɡɪv ðə pɑːrt/', meaningAr: 'يديله الدور', meaningEn: 'cast in a role' },
        ],
      },
      {
        id: 'sub-3',
        start: 35,
        end: 45,
        en: "He says I'm too old, and he wants to teach me a lesson for leaving the band.",
        arEg: 'بيقول إني كبرت في السن، وعايز يديني درس ويعلم عليا عشان سبت الفرقة.',
        arFusha: 'يقول إنني كبرت في السن، ويريد أن يلقنني درساً لمغادرتي الفرقة الموسيقية.',
        speaker: 'Johnny Fontane',
        keyWords: [
          { word: 'teach a lesson', ipa: '/tiːtʃ ə ˈlɛsən/', meaningAr: 'يديله درس / يعلمه الأدب', meaningEn: 'punish to reform' },
        ],
      },
      {
        id: 'sub-4',
        start: 50,
        end: 65,
        en: "You look like a Hollywood star. Now, you listen to me. You will get the part. I'm going to make him an offer he can't refuse.",
        arEg: 'أنت شكلك نجم هوليوود يملى العين. اسمعني كويس، أنت هتاخد الدور ده. أنا هقدمله عرض ميعرفش يرفضه أبداً.',
        arFusha: 'أنت تبدو كنجم هوليوود حقيقي. استمع إلي جيداً: ستحصل على هذا الدور. سأقدم له عرضاً لن يستطيع رفضه.',
        speaker: 'Don Corleone',
        keyWords: [
          { word: "offer he can't refuse", ipa: '/ˈɔːfər hiː kænt rɪˈfjuːz/', meaningAr: 'عرض ميترفضش (وفيه تهديد مبطن)', meaningEn: 'an offer backed by irresistible force' },
        ],
      },
    ],
    vocabulary: [
      {
        term: "make an offer one can't refuse",
        type: 'idiom',
        meaningAr: 'عرض إجباري لا يقبل الرفض بسبب نفوذ وقوة مقدمه',
        meaningEn: 'To present an ultimatum where refusal is perilous or impossible',
        egyptianEquivalent: 'هعمله عرض ميقدرش يقول عليه لأ.. وغصب عنه هيوافق',
        exampleInScene: "I'm going to make him an offer he can't refuse.",
      },
      {
        term: 'teach someone a lesson',
        type: 'idiom',
        meaningAr: 'يلقن شخصاً درساً قاسياً',
        meaningEn: 'To punish someone so they learn from an error',
        egyptianEquivalent: 'يعلّم عليه / يربّيه على اللي عمله',
        exampleInScene: 'He wants to teach me a lesson for leaving.',
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        type: 'comprehension',
        questionEn: 'What does Don Corleone believe defines a "real man"?',
        questionAr: 'ما هو المقياس الذي يحدده دون كورليوني للرجل الحقيقي في بداية المشهد؟',
        options: [
          'Earning millions of dollars in Hollywood',
          'Spending quality time with his family',
          'Never losing a fight',
          'Refusing all movie offers',
        ],
        correctIndex: 1,
        explanationAr: 'كورليوني يوضح: "A man who doesn\'t spend time with his family can never be a real man".',
      },
      {
        id: 'quiz-2',
        type: 'missing-word',
        questionEn: 'Complete the iconic quote: "I\'m going to make him an offer he can\'t _______."',
        questionAr: 'أكمل الاقتباس العالمي الشهير من المشهد:',
        options: ['accept', 'refuse', 'ignore', 'understand'],
        correctIndex: 1,
        explanationAr: 'الجملة الأيقونية هي "refuse" (يرفض).',
      },
    ],
    speakingLines: [
      { en: "I'm going to make him an offer he can't refuse.", arEg: 'أنا هقدمله عرض ميعرفش يرفضه.' },
      { en: "A man who doesn't spend time with his family can never be a real man.", arEg: 'الراجل اللي مبيقضيش وقت مع عيلته عمره ما هيبقى راجل بجد.' },
    ],
  },

  // 2. Forrest Gump
  {
    id: 'scene-forrest-gump-chocolates',
    movieTitle: 'Forrest Gump',
    releaseYear: 1994,
    director: 'Robert Zemeckis',
    genre: 'Drama / Romance',
    cefrLevel: 'A2',
    sceneTitle: 'Life is Like a Box of Chocolates',
    sceneDescription: 'Sitting at the bus stop bench in Savannah, Forrest shares wisdom his mother gave him.',
    youtubeId: 'vdtqSaJO-iM', // Paramount Movies Official (100% verified playable)
    startTime: 5,
    endTime: 80,
    clipDuration: '1:15',
    videoSource: 'Paramount Movies (Official)',
    dialogueQuote: "My mama always said life was like a box of chocolates. You never know what you're gonna get.",
    actorName: 'Tom Hanks',
    characterName: 'Forrest Gump',
    thumbnailUrl: 'https://img.youtube.com/vi/vdtqSaJO-iM/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    contentSource: 'Paramount Pictures Official',
    subtitles: [
      {
        id: 'sub-1',
        start: 6,
        end: 15,
        en: "Hello. My name's Forrest, Forrest Gump. Do you want a chocolate?",
        arEg: 'أهلاً بحضرتك. أنا اسمي فورست، فورست جامب. تحبي حتة شوكولاتة؟',
        arFusha: 'مرحباً، اسمي فورست، فورست غامب. هل ترغبين بقطعة شوكولاتة؟',
        speaker: 'Forrest Gump',
        keyWords: [
          { word: 'chocolate', ipa: '/ˈtʃɒklɪt/', meaningAr: 'شوكولاتة', meaningEn: 'sweet confectionery' },
        ],
      },
      {
        id: 'sub-2',
        start: 18,
        end: 32,
        en: "I could eat about a million and a half of these. My mama always said life was like a box of chocolates.",
        arEg: 'أنا ممكن آكل منها ييجي مليون ونص واحدة. أمي الله يرحمها كانت دايماً تقولي: الحياة عاملة زي علبة شوكولاتة.',
        arFusha: 'يمكنني تناول مليون ونصف من هذه القطع. كانت أمي تخبرني دوماً أن الحياة تشبه علبة شوكولاتة.',
        speaker: 'Forrest Gump',
        keyWords: [
          { word: 'box of chocolates', ipa: '/bɒks əv ˈtʃɒklɪts/', meaningAr: 'علبة شوكولاتة (رمز للمفاجآت)', meaningEn: 'metaphor for unpredictable life' },
        ],
      },
      {
        id: 'sub-3',
        start: 35,
        end: 48,
        en: "You never know what you're gonna get.",
        arEg: 'عمرك ما بتعرف حظك هيطلع في إيه ولا هتاخد إيه.',
        arFusha: 'أنت لا تعلم أبداً ما الذي ستناله منها.',
        speaker: 'Forrest Gump',
        keyWords: [
          { word: "gonna get", ipa: '/ˈɡənə ɡɛt/', meaningAr: 'هتاخد / هيصيبك', meaningEn: 'informal going to receive' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'life is like a box of chocolates',
        type: 'idiom',
        meaningAr: 'الحياة مليئة بالمفاجآت والتقلبات غير المتوقعة',
        meaningEn: 'Life is full of unpredictable surprises',
        egyptianEquivalent: 'الدنيا حظوظ ومفاجآت، متعرفش بكره مخبي إيه',
        exampleInScene: "Life was like a box of chocolates.",
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        type: 'comprehension',
        questionEn: 'Why does Forrest compare life to a box of chocolates?',
        questionAr: 'لماذا يشبه فورست جامب الحياة بعلبة الشوكولاتة؟',
        options: [
          'Because it is always sweet and easy',
          'Because you cannot predict what you will get',
          'Because it is very expensive to buy',
          'Because chocolate melts quickly in the sun',
        ],
        correctIndex: 1,
        explanationAr: 'المعنى أنك لا تتوقع النكهة أو المفاجأة القادمة: "You never know what you\'re gonna get".',
      },
    ],
    speakingLines: [
      { en: "My mama always said life was like a box of chocolates.", arEg: 'أمي كانت دايماً تقولي الحياة عاملة زي علبة شوكولاتة.' },
      { en: "You never know what you're gonna get.", arEg: 'عمرك ما بتعرف حظك هيطلع في إيه.' },
    ],
  },

  // 3. Batman Begins
  {
    id: 'scene-dark-knight-defines',
    movieTitle: 'Batman Begins',
    releaseYear: 2005,
    director: 'Christopher Nolan',
    genre: 'Action / Thriller',
    cefrLevel: 'B2',
    sceneTitle: "It's Not Who I Am Underneath",
    sceneDescription: 'Bruce Wayne reveals his true identity through his philosophy on action versus intention.',
    youtubeId: 'H19vDg1iLRs', // Verified Playable
    startTime: 5,
    endTime: 70,
    clipDuration: '1:05',
    videoSource: 'Warner Bros. Pictures (Official)',
    dialogueQuote: "It's not who I am underneath, but what I do that defines me.",
    actorName: 'Christian Bale',
    characterName: 'Bruce Wayne / Batman',
    thumbnailUrl: 'https://img.youtube.com/vi/H19vDg1iLRs/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    contentSource: 'Warner Bros. Official',
    subtitles: [
      {
        id: 'sub-1',
        start: 8,
        end: 22,
        en: 'Bruce, deep down you may still be that same great guy you used to be...',
        arEg: 'بروس، جواك وفي أعماقك أنت لسه نفس الشخص العظيم اللي كنت عليه زمان...',
        arFusha: 'يا بروس، في أعماقك قد تزال ذلك الشخص الرائع ذاته الذي عهدتك عليه...',
        speaker: 'Rachel Dawes',
        keyWords: [
          { word: 'deep down', ipa: '/diːp daʊn/', meaningAr: 'في الأعماق / في الحقيقة', meaningEn: 'fundamentally, secretly' },
        ],
      },
      {
        id: 'sub-2',
        start: 24,
        end: 42,
        en: "It's not who I am underneath, but what I do that defines me.",
        arEg: 'مش مهم أنا مين في الأعماق والنيات.. اللي بيحدد قيمتي بجد هو أفعالي اللي بعملها على الأرض.',
        arFusha: 'ليست حقيقتي الكامنة في الداخل هي ما يعبر عني، بل إن أفعالي وما أقوم به هو ما يحدد من أنا حقاً.',
        speaker: 'Bruce Wayne',
        keyWords: [
          { word: 'defines me', ipa: '/dɪˈfaɪnz miː/', meaningAr: 'يحدد هويتي وقيمتي', meaningEn: 'establishes my identity' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'what I do defines me',
        type: 'collocation',
        meaningAr: 'أفعال الإنسان العملية هي المقياس الحقيقي لقيمته وليس مظهره أو نواياه',
        meaningEn: 'Character is proved through concrete deeds rather than secret thoughts',
        egyptianEquivalent: 'قيمتك بأفعالك اللي بتبان للناس مش بالكلام والنوايا',
        exampleInScene: "It's what I do that defines me.",
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        type: 'comprehension',
        questionEn: 'According to Bruce Wayne, what truly defines a person?',
        questionAr: 'وفقاً لفلسفة بروس واين، ما الذي يحدد هوية وقيمة الإنسان الحقيقية؟',
        options: [
          'His family name and inheritance',
          'His secret inner thoughts and intentions',
          'His concrete actions and deeds',
          'The opinion of society',
        ],
        correctIndex: 2,
        explanationAr: 'يؤكد بروس: "what I do that defines me" (أفعالي هي التي تحدد قيمتي).',
      },
    ],
    speakingLines: [
      { en: "It's not who I am underneath, but what I do that defines me.", arEg: 'مش مهم أنا مين في الأعماق، أفعالي هي اللي بتحدد أنا مين.' },
    ],
  },

  // 4. Dead Poets Society
  {
    id: 'scene-dead-poets-seize',
    movieTitle: 'Dead Poets Society',
    releaseYear: 1989,
    director: 'Peter Weir',
    genre: 'Drama / Comedy',
    cefrLevel: 'C1',
    sceneTitle: 'Carpe Diem — Seize the Day',
    sceneDescription: 'Mr. Keating takes his students into the hallway to view old photographs of former pupils.',
    youtubeId: 'vi0Lbjs5ECI', // 100% verified playable
    startTime: 15,
    endTime: 95,
    clipDuration: '1:20',
    videoSource: 'Touchstone Pictures (Official)',
    dialogueQuote: "Carpe diem. Seize the day, boys. Make your lives extraordinary.",
    actorName: 'Robin Williams',
    characterName: 'John Keating',
    thumbnailUrl: 'https://img.youtube.com/vi/vi0Lbjs5ECI/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    contentSource: 'Touchstone Pictures Official',
    subtitles: [
      {
        id: 'sub-1',
        start: 18,
        end: 32,
        en: "They're not that different from you, are they? Same haircuts. Full of hormones, just like you.",
        arEg: 'هما مش مختلفين عنكم أوي، صح؟ نفس قصات الشعر، ونفس فوران الشباب وطاقتهم، زيكم بالظبط.',
        arFusha: 'إنهم لا يختلفون عنكم كثيراً، أليس كذلك؟ لديهم تسريحات الشعر ذاتها، ومفعمون بالشباب مثلكم تماماً.',
        speaker: 'John Keating',
        keyWords: [
          { word: 'haircut', ipa: '/ˈhɛəkʌt/', meaningAr: 'قصة شعر', meaningEn: 'style of hair' },
        ],
      },
      {
        id: 'sub-2',
        start: 40,
        end: 60,
        en: "Carpe diem. Seize the day, boys. Make your lives extraordinary.",
        arEg: 'اغتنموا الفرصة وانتهزوا شبابكم يا شباب.. خلوا حياتكم استثنائية وعظيمة.',
        arFusha: 'اغتنموا اليوم وعيشوا اللحظة يا فتية. اجعلوا حيواتكم فريدة واستثنائية.',
        speaker: 'John Keating',
        keyWords: [
          { word: 'carpe diem', ipa: '/ˌkɑːrpeɪ ˈdiːɛm/', meaningAr: 'اغتنم اليوم ولا تؤجل', meaningEn: 'seize the day, pluck the present' },
          { word: 'extraordinary', ipa: '/ɪkˈstrɔːdɪnri/', meaningAr: 'استثنائي وفائق العظمة', meaningEn: 'remarkable, far beyond ordinary' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'seize the day',
        type: 'idiom',
        meaningAr: 'اغتنام اللحظة الحاضرة واستثمار الفرص المتاحة فوراً',
        meaningEn: 'Make the most of present opportunities without delay',
        egyptianEquivalent: 'امسك في الفرصة دلوقتي ومضيعش وقتك',
        exampleInScene: 'Carpe diem. Seize the day, boys.',
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        type: 'comprehension',
        questionEn: 'What is the literal and philosophical meaning of "Carpe Diem"?',
        questionAr: 'ما هو المعنى الحرفي والفلسفي لعبارة "Carpe Diem"؟',
        options: [
          'Wait patiently for destiny',
          'Seize the day and make the most of the present',
          'Follow the strict traditional rules',
          'Earn as much wealth as possible',
        ],
        correctIndex: 1,
        explanationAr: 'العبارة تعني اغتنام اللحظة واستثمار الحاضر وعدم تفويت الفرص.',
      },
    ],
    speakingLines: [
      { en: "Carpe diem. Seize the day, boys. Make your lives extraordinary.", arEg: 'اغتنموا اليوم وانتهزوا شبابكم.. خلوا حياتكم استثنائية.' },
    ],
  },

  // 5. The Terminator
  {
    id: 'scene-terminator-back',
    movieTitle: 'The Terminator',
    releaseYear: 1984,
    director: 'James Cameron',
    genre: 'Sci-Fi / Action',
    cefrLevel: 'A1',
    sceneTitle: "I'll Be Back",
    sceneDescription: "The T-800 enters the police precinct looking for Sarah Connor and delivers cinema history's most quoted one-liner.",
    youtubeId: 'tYc2jQaM8gM', // Flashback FM Remastered (100% verified playable)
    startTime: 10,
    endTime: 60,
    clipDuration: '0:50',
    videoSource: 'Metro-Goldwyn-Mayer / Orion Pictures',
    dialogueQuote: "I'll be back.",
    actorName: 'Arnold Schwarzenegger',
    characterName: 'The Terminator (T-800)',
    thumbnailUrl: 'https://img.youtube.com/vi/tYc2jQaM8gM/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    contentSource: 'MGM Official Archive',
    subtitles: [
      {
        id: 'sub-1',
        start: 12,
        end: 22,
        en: "I'm a friend of Sarah Connor. I was told that she was here. Could I see her, please?",
        arEg: 'أنا صاحب سارة كونور. قالولي إنها هنا، ممكن أشوفها بعد إذنك؟',
        arFusha: 'أنا صديق لسارة كونور. قيل لي إنها موجودة هنا، هل يمكنني مقابلتها لو سمحت؟',
        speaker: 'The Terminator',
        keyWords: [
          { word: 'friend', ipa: '/frɛnd/', meaningAr: 'صديق', meaningEn: 'companion' },
        ],
      },
      {
        id: 'sub-2',
        start: 24,
        end: 35,
        en: "No, you can't see her right now. She's making a statement. You'll have to wait.",
        arEg: 'لأ، مش هينفع تشوفها دلوقتي خالص.. هي بتدلي بأقوالها، اتفضل استنى هناك.',
        arFusha: 'كلا، لا يمكنك رؤيتها الآن، إنها تدلي بإفادتها. عليك الانتظار هناك.',
        speaker: 'Desk Sergeant',
        keyWords: [
          { word: 'statement', ipa: '/ˈsteɪtmənt/', meaningAr: 'أقوال / إفادة رسمية', meaningEn: 'formal police testimony' },
        ],
      },
      {
        id: 'sub-3',
        start: 40,
        end: 48,
        en: "I'll be back.",
        arEg: 'هرجعلكم تاني.. (راجعلك تاني ومعايا الرد).',
        arFusha: 'سأعود ثانية.',
        speaker: 'The Terminator',
        keyWords: [
          { word: "I'll be back", ipa: '/aɪl biː bæk/', meaningAr: 'هرجع تاني', meaningEn: 'future promise to return' },
        ],
      },
    ],
    vocabulary: [
      {
        term: "I'll be back",
        type: 'collocation',
        meaningAr: 'وعد أو تحذير بالعودة القريبة الحاسمة',
        meaningEn: 'Iconic future tense promise / threat to return',
        egyptianEquivalent: 'راجعلك تاني.. ومش هسيبك',
        exampleInScene: "I'll be back.",
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        type: 'comprehension',
        questionEn: 'What is the grammatical tense used in "I\'ll be back"?',
        questionAr: 'ما هو الزمن النحوي المستخدم في الجملة الشهيرة "I\'ll be back"؟',
        options: ['Present Continuous', 'Future Simple (Will)', 'Past Perfect', 'Zero Conditional'],
        correctIndex: 1,
        explanationAr: 'الجملة في زمن المستقبل البسيط (Future Simple with will): I will be back.',
      },
    ],
    speakingLines: [
      { en: "I'll be back.", arEg: 'راجعلك تاني.' },
    ],
  },

  // 6. The Pursuit of Happyness
  {
    id: 'scene-pursuit-of-happyness-dream',
    movieTitle: 'The Pursuit of Happyness',
    releaseYear: 2006,
    director: 'Gabriele Muccino',
    genre: 'Biography / Drama',
    cefrLevel: 'B1',
    sceneTitle: 'Protect Your Dream',
    sceneDescription: 'Chris Gardner gives unforgettable advice to his young son Christopher on a basketball court.',
    youtubeId: 'UZb2NOHPA2A', // 100% verified playable
    startTime: 15,
    endTime: 85,
    clipDuration: '1:10',
    videoSource: 'Sony Pictures Entertainment (Official)',
    dialogueQuote: "Don't ever let somebody tell you you can't do something. Not even me.",
    actorName: 'Will Smith',
    characterName: 'Chris Gardner',
    thumbnailUrl: 'https://img.youtube.com/vi/UZb2NOHPA2A/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    contentSource: 'Sony Pictures Entertainment Official',
    subtitles: [
      {
        id: 'sub-1',
        start: 18,
        end: 32,
        en: "Don't ever let somebody tell you you can't do something. Not even me. All right?",
        arEg: 'إياك في يوم تخلي حد يقولك إنك متعرفش تعمل حاجة، حتى لو كنت أنا.. اتفقنا؟',
        arFusha: 'إياك أن تدع أحداً يخبرك بأنك عاجز عن تحقيق شيء ما، حتى لو كان ذلك الشخص أنا.. مفهوم؟',
        speaker: 'Chris Gardner',
        keyWords: [
          { word: "don't ever let", ipa: '/doʊnt ˈɛvər lɛt/', meaningAr: 'إياك تسمح أبداً', meaningEn: 'never allow under any circumstance' },
        ],
      },
      {
        id: 'sub-2',
        start: 35,
        end: 55,
        en: 'You got a dream... You gotta protect it. People can\'t do somethin\' themselves, they wanna tell you you can\'t do it.',
        arEg: 'عندك حلم.. لازم تحميه وتدافع عنه. الناس اللي مبيعرفوش يعملوا حاجة بنفسهم، بيبقوا عايزين يقولولك إنك مش هتعرف تعملها.',
        arFusha: 'لديك حلم.. عليك أن تحميه. الناس الذين يعجزون عن فعل شيء بأنفسهم، يريدون إخبارك بأنك عاجز عن فعله أيضاً.',
        speaker: 'Chris Gardner',
        keyWords: [
          { word: 'protect a dream', ipa: '/prəˈtɛkt ə driːm/', meaningAr: 'يحمي حلمه ويدافع عنه', meaningEn: 'defend one aspirations' },
        ],
      },
      {
        id: 'sub-3',
        start: 58,
        end: 70,
        en: 'If you want somethin\', go get it. Period.',
        arEg: 'لو عايز حاجة بجد، انزل وهاتها.. ونقطة ومن أول السطر.',
        arFusha: 'إذا أردت شيئاً، فاذهب وحققه. نقطة على السطر.',
        speaker: 'Chris Gardner',
        keyWords: [
          { word: 'period', ipa: '/ˈpɪəriəd/', meaningAr: 'نقطة ومن أول السطر (مفيش نقاش)', meaningEn: 'final statement, no argument' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'protect your dream',
        type: 'collocation',
        meaningAr: 'التمسك بالطموح وعدم السماح للمثبطين بإضعاف عزيمتك',
        meaningEn: 'Safeguard your aspirations against negative discouragement',
        egyptianEquivalent: 'حارب عشان حلمك ومترجعش خطوة لورا عشان كلام الناس',
        exampleInScene: 'You got a dream... You gotta protect it.',
      },
      {
        term: 'period',
        type: 'slang',
        meaningAr: 'انتهى الكلام نهائياً ولا مجال للجدال أو التراجع',
        meaningEn: 'Used to declare that a matter is settled definitively',
        egyptianEquivalent: 'نقطة ومن أول السطر.. ومفيش نقاش تاني',
        exampleInScene: 'If you want somethin\', go get it. Period.',
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        type: 'comprehension',
        questionEn: 'Why does Chris Gardner say people discourage others from pursuing big dreams?',
        questionAr: 'لماذا يرى كريس غاردنر أن بعض الناس يحبطون الآخرين عن تحقيق أحلامهم؟',
        options: [
          'Because they are caring and realistic',
          'Because they failed to accomplish it themselves',
          'Because dreams cost too much money',
          'Because basketball is too competitive',
        ],
        correctIndex: 1,
        explanationAr: 'يوضح كريس: "People can\'t do somethin\' themselves, they wanna tell you you can\'t do it" (الناس الذين يعجزون عن فعل شيء، يريدون إخبارك بأنك عاجز عنه أيضاً).',
      },
    ],
    speakingLines: [
      { en: "You got a dream... You gotta protect it.", arEg: 'عندك حلم.. لازم تحميه وتدافع عنه.' },
      { en: "If you want somethin', go get it. Period.", arEg: 'لو عايز حاجة، انزل وهاتها.. نقطة ومن أول السطر.' },
    ],
  },

  // 7. Jerry Maguire
  {
    id: 'scene-jerry-maguire-hello',
    movieTitle: 'Jerry Maguire',
    releaseYear: 1996,
    director: 'Cameron Crowe',
    genre: 'Comedy / Drama / Romance',
    cefrLevel: 'B2',
    sceneTitle: 'You Had Me at Hello',
    sceneDescription: 'Jerry Maguire arrives at Dorothy\'s house and delivers a heartfelt confession in front of her friends.',
    youtubeId: 'AyrP-pwDayE', // Movieclips Official (100% verified playable)
    startTime: 10,
    endTime: 90,
    clipDuration: '1:20',
    videoSource: 'Sony Pictures Home Entertainment (Official)',
    dialogueQuote: "You had me at hello.",
    actorName: 'Renée Zellweger & Tom Cruise',
    characterName: 'Dorothy Boyd & Jerry Maguire',
    thumbnailUrl: 'https://img.youtube.com/vi/AyrP-pwDayE/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    contentSource: 'Movieclips Official',
    subtitles: [
      {
        id: 'sub-1',
        start: 12,
        end: 28,
        en: 'I love you. You complete me. And I just... couldn\'t stop thinking about you.',
        arEg: 'أنا بحبك. أنتي بتكمليني.. ومكنتش قادر أبطل تفكير فيكي أبداً.',
        arFusha: 'أنا أحبك، أنتِ تكملين حياتي.. ولم أستطع التوقف عن التفكير فيكِ لحظة.',
        speaker: 'Jerry Maguire',
        keyWords: [
          { word: 'complete me', ipa: '/kəmˈpliːt miː/', meaningAr: 'تكمل نقصي وروحي', meaningEn: 'make whole and fulfilled' },
        ],
      },
      {
        id: 'sub-2',
        start: 32,
        end: 45,
        en: 'Shut up. Just shut up.',
        arEg: 'اسكت.. بس اسكت ومتقولش حاجة تانية خالص.',
        arFusha: 'اصمت.. فقط اصمت ولا تزد على ذلك شيئاً.',
        speaker: 'Dorothy Boyd',
        keyWords: [
          { word: 'shut up', ipa: '/ʃʌt ʌp/', meaningAr: 'اصمت بحب / كفاية كلام', meaningEn: 'stop speaking' },
        ],
      },
      {
        id: 'sub-3',
        start: 48,
        end: 65,
        en: 'You had me at hello. You had me at hello.',
        arEg: 'أنت أسرت قلبي من أول ما قولت "أهلاً".. قلبي كان معاك من أول لحظة دخلت فيها.',
        arFusha: 'لقد ملكت قلبي منذ لحظة تحيتك الأولى.. أسرتني من أول كلمة "مرحباً".',
        speaker: 'Dorothy Boyd',
        keyWords: [
          { word: 'had me at hello', ipa: '/hæd miː æt həˈloʊ/', meaningAr: 'أسرت قلبي من أول كلمة ترحيب', meaningEn: 'captivated from the very first greeting' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'you had me at hello',
        type: 'idiom',
        meaningAr: 'الوقوع في الحب أو الانجذاب الفوري من اللحظة الأولى والكلمة الأولى',
        meaningEn: 'Fell in love or was completely persuaded from the very first greeting',
        egyptianEquivalent: 'خطفت قلبي من أول ما قولتلي إزيك وعينك جت في عيني',
        exampleInScene: 'You had me at hello.',
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        type: 'comprehension',
        questionEn: 'What does Dorothy mean when she tells Jerry "You had me at hello"?',
        questionAr: 'ماذا تقصد دوروثي عندما تقول لجيري "You had me at hello"؟',
        options: [
          'She wanted him to apologize immediately',
          'She was already in love and convinced from the first moment he walked in',
          'She wanted him to leave her house',
          'She did not hear his speech',
        ],
        correctIndex: 1,
        explanationAr: 'المعنى الرومانسي الشهير هو أنها كانت متيمة ومقتنعة به منذ أول كلمة قالها.',
      },
    ],
    speakingLines: [
      { en: "You complete me.", arEg: 'أنتي بتكمليني.' },
      { en: "You had me at hello.", arEg: 'أسرت قلبي من أول ما قولتلي أهلاً.' },
    ],
  },

  // 8. The Office (Sitcoms Category)
  {
    id: 'scene-the-office-first-aid',
    movieTitle: 'The Office (US)',
    releaseYear: 2009,
    director: 'Greg Daniels',
    genre: 'Sitcom / Comedy',
    cefrLevel: 'B1',
    sceneTitle: 'First Aid CPR Fail',
    sceneDescription: 'The Dunder Mifflin branch takes a CPR first aid class with hilarious misunderstandings.',
    youtubeId: 'Vmb1tqYqyII', // The Office Official Channel (100% verified playable)
    startTime: 10,
    endTime: 90,
    clipDuration: '1:20',
    videoSource: 'The Office (Official)',
    dialogueQuote: "At first I was afraid, I was petrified...",
    actorName: 'Steve Carell & Rainn Wilson',
    characterName: 'Michael Scott & Dwight Schrute',
    thumbnailUrl: 'https://img.youtube.com/vi/Vmb1tqYqyII/hqdefault.jpg',
    category: 'sitcoms',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    contentSource: 'NBC / The Office Official',
    subtitles: [
      {
        id: 'sub-1',
        start: 12,
        end: 25,
        en: 'Assess the situation! Do they have an open airway? Are they breathing?',
        arEg: 'قيّم الموقف فوراً! هل مجرى التنفس مفتوح؟ هل الشخص بيتنفس؟',
        arFusha: 'قيم الموقف أولاً! هل مجرى الهواء مفتوح؟ هل يتنفس المصاب؟',
        speaker: 'CPR Instructor',
        keyWords: [
          { word: 'assess', ipa: '/əˈsɛs/', meaningAr: 'يقيم ويفحص', meaningEn: 'evaluate carefully' },
          { word: 'airway', ipa: '/ˈɛərweɪ/', meaningAr: 'مجرى التنفس', meaningEn: 'respiratory passage' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'assess the situation',
        type: 'collocation',
        meaningAr: 'تقييم الموقف بعناية قبل التصرف',
        meaningEn: 'evaluate circumstances before acting',
        egyptianEquivalent: 'شوف الوضع إيه وقيس الموقف كويس',
        exampleInScene: 'Assess the situation!',
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        type: 'comprehension',
        questionEn: 'What is the first step in CPR training?',
        questionAr: 'ما هي الخطوة الأولى الموضحة في تدريب الإنعاش القلبي؟',
        options: ['Start singing', 'Assess the situation and breathing', 'Call a taxi', 'Run away'],
        correctIndex: 1,
        explanationAr: 'الخطوة الأولى هي تقييم الموقف وفحص التنفس (Assess the situation).',
      },
    ],
    speakingLines: [
      { en: 'Assess the situation before you act.', arEg: 'قيّم الموقف كويس قبل ما تتصرف.' },
    ],
  },

  // 9. Steve Jobs Stanford Address (TED / Talks / Academic)
  {
    id: 'scene-steve-jobs-stanford',
    movieTitle: 'Stanford Commencement Address',
    releaseYear: 2005,
    director: 'Stanford University',
    genre: 'Inspirational / Speech',
    cefrLevel: 'B2',
    sceneTitle: 'Stay Hungry, Stay Foolish',
    sceneDescription: 'Steve Jobs shares three stories from his life about connecting the dots, love and loss, and death.',
    youtubeId: 'UF8uR6Z6KLc', // Stanford Official (100% verified playable)
    startTime: 20,
    endTime: 95,
    clipDuration: '1:15',
    videoSource: 'Stanford University (Official)',
    dialogueQuote: "Stay hungry. Stay foolish. Never settle.",
    actorName: 'Steve Jobs',
    characterName: 'Steve Jobs',
    thumbnailUrl: 'https://img.youtube.com/vi/UF8uR6Z6KLc/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    contentSource: 'Stanford University Channel',
    subtitles: [
      {
        id: 'sub-1',
        start: 22,
        end: 35,
        en: 'You can\'t connect the dots looking forward; you can only connect them looking backwards.',
        arEg: 'متقدرش تربط خيوط وتفاصيل حياتك وأنت باصص لقدام.. مش هتعرف تربطها إلا لما تبص لورا وتفهم اللي حصل.',
        arFusha: 'لا يمكنك الربط بين النقاط وأنت تنظر للأمام، بل يمكنك فقط أن تجمعها وتفهمها وأنت تنظر إلى الوراء.',
        speaker: 'Steve Jobs',
        keyWords: [
          { word: 'connect the dots', ipa: '/kəˈnɛkt ðə dɒts/', meaningAr: 'يربط خيوط الأمور ببعضها', meaningEn: 'understand relationships between events' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'connect the dots',
        type: 'idiom',
        meaningAr: 'فهم العلاقة السببية بين الأحداث والتجارب السابقة',
        meaningEn: 'Realize how different past experiences lead to future success',
        egyptianEquivalent: 'تفهم حكمة اللي فات وتربط الأحداث ببعضها',
        exampleInScene: "You can only connect them looking backwards.",
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        type: 'comprehension',
        questionEn: 'How did Steve Jobs say one can connect the dots in life?',
        questionAr: 'كيف يرى ستيف جوبز إمكانية فهم وترابط خيوط وتجارب الحياة؟',
        options: [
          'Looking forward into future plans',
          'Looking backwards to understand past experiences',
          'By reading fortune cards',
          'By avoiding all risks',
        ],
        correctIndex: 1,
        explanationAr: 'جوبز يؤكد: "You can only connect them looking backwards" (لا يمكنك ربطها إلا بالنظر إلى الوراء).',
      },
    ],
    speakingLines: [
      { en: "Stay hungry. Stay foolish.", arEg: 'خليك شغوف دايماً ومتوقفش تعلم.' },
    ],
  },
  {
    id: 'talk-matt-cutts-30days',
    movieTitle: 'TED: Try something new for 30 days',
    releaseYear: 2011,
    director: 'TED Conferences',
    genre: 'Talk / Self-development',
    cefrLevel: 'B1',
    sceneTitle: 'Try Something New for 30 Days',
    sceneDescription: 'Matt Cutts explains how 30-day challenges make time more memorable and build self-confidence.',
    youtubeId: 'JnfBXjWm7hc',
    startTime: 0,
    endTime: 210,
    clipDuration: '3:30',
    videoSource: 'TED (Official)',
    dialogueQuote: 'Try something new for 30 days.',
    actorName: 'Matt Cutts',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/JnfBXjWm7hc/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'TED Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'A few years ago, I felt like I was stuck in a rut, so I decided to try something new for 30 days.', arEg: 'من كام سنة حاسيت إني واقف مكاني، فقررت أجرب حاجة جديدة لمدة 30 يوم.', arFusha: 'منذ سنوات قليلة، شعرت أنني عالق في روتين، فقررت أن أجرب شيئاً جديداً لمدة ثلاثين يوماً.', speaker: 'Matt Cutts', keyWords: [{ word: 'stuck in a rut', ipa: '', meaningAr: 'واقف مكاني / متوقف عن التطور', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'When you make small, sustainable changes, things you can keep doing, they are more likely to stick.', arEg: 'لما تعمل تغييرات صغيرة ومستدامة تقدر تكمل عليها، الأغلب إنها هتثبت معاك.', arFusha: 'عندما تقوم بتغييرات صغيرة ومستدامة يمكنك الاستمرار عليها، فمن الأرجح أن تترسخ.', speaker: 'Matt Cutts', keyWords: [{ word: 'sustainable', ipa: '', meaningAr: 'مستدام / قابل للاستمرار', meaningEn: '' }, { word: 'stick', ipa: '', meaningAr: 'يثبت / يستمر', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'stuck in a rut', type: 'idiom', meaningAr: 'عالق في روتين ممل بلا تقدم', meaningEn: '', egyptianEquivalent: 'محبوس في نفس الروتين ومش عارف أتحرك', exampleInScene: 'I felt like I was stuck in a rut.' },      { term: 'give it a shot', type: 'idiom', meaningAr: 'يجرب / يخوض التجربة', meaningEn: '', egyptianEquivalent: 'جربها وشوف', exampleInScene: 'Why not give it a shot for 30 days?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the main idea of the talk?', questionAr: 'إيه الفكرة الأساسية للمحاضرة؟', options: ['Working harder every day', 'Trying something new for 30 days', 'Sleeping less to save time', 'Reading more books'], correctIndex: 1, explanationAr: 'الفكرة: جرب حاجة جديدة لمدة 30 يوم.' }
    ],
    speakingLines: [{ en: 'Try something new for 30 days.', arEg: 'جرب حاجة جديدة لمدة 30 يوم.' }],
  },
  {
    id: 'talk-susan-cain-introverts',
    movieTitle: 'TED: The power of introverts',
    releaseYear: 2012,
    director: 'TED Conferences',
    genre: 'Talk / Psychology',
    cefrLevel: 'B2',
    sceneTitle: 'The Power of Introverts',
    sceneDescription: 'Susan Cain argues that introverts bring extraordinary talents to the world and should be encouraged.',
    youtubeId: 'c0KYU2j0TM4',
    startTime: 0,
    endTime: 240,
    clipDuration: '4:00',
    videoSource: 'TED (Official)',
    dialogueQuote: 'Solitude matters, and for some people it is the air that they breathe.',
    actorName: 'Susan Cain',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/c0KYU2j0TM4/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'TED Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'When it comes to creativity and leadership, we need introverts doing what they do best.', arEg: 'لما نيجي للإبداع والقيادة، إحنا محتاجين الانطوائيين يعملوا اللي بيبرعوا فيه.', arFusha: 'عندما يتعلق الأمر بالإبداع والقيادة، نحتاج إلى الانطوائيين ليقوموا بما يتقنونه.', speaker: 'Susan Cain', keyWords: [{ word: 'introvert', ipa: '', meaningAr: 'شخص انطوائي', meaningEn: '' }, { word: 'leadership', ipa: '', meaningAr: 'قيادة', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'Solitude matters, and for some people it is the air that they breathe.', arEg: 'العزلة حاجة مهمة، ولبعض الناس هي زي الهوا اللي بيتنفسوه.', arFusha: 'العزلة مهمة، ولبعض الناس هي كالهواء الذي يتنفسونه.', speaker: 'Susan Cain', keyWords: [{ word: 'solitude', ipa: '', meaningAr: 'عزلة / خلوة', meaningEn: '' }, { word: 'breathe', ipa: '', meaningAr: 'يتنفس', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'introvert', type: 'cultural', meaningAr: 'شخص انطوائي يستمد طاقته من الهدوء والداخل', meaningEn: '', egyptianEquivalent: 'اللي بيرتاح في قعدته لوحده', exampleInScene: 'Introverts need quiet time to recharge.' },      { term: 'solitude', type: 'cultural', meaningAr: 'العزلة الاختيارية المريحة', meaningEn: '', egyptianEquivalent: 'الخلوة الهادية', exampleInScene: 'Solitude matters for creative work.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'According to Susan Cain, what do introverts need?', questionAr: 'حسب سوزان كين، الانطوائيين محتاجين إيه؟', options: ['More parties', 'Solitude and quiet', 'Louder offices', 'Constant teamwork'], correctIndex: 1, explanationAr: 'تؤكد أن العزلة والهدوء ضروريان للانطوائيين.' }
    ],
    speakingLines: [{ en: 'Solitude matters.', arEg: 'العزلة حاجة مهمة.' }],
  },
  {
    id: 'sitcom-friends-howyoudoin',
    movieTitle: 'Friends',
    releaseYear: 1994,
    director: 'Various',
    genre: 'Sitcom / Comedy',
    cefrLevel: 'A2',
    sceneTitle: 'Joey\'s Best How You Doin Moments',
    sceneDescription: 'A Warner Bros. TV official compilation of Joey Tribbiani\'s iconic pick-up line across the series.',
    youtubeId: 'CLvXFVbb82Q',
    startTime: 0,
    endTime: 120,
    clipDuration: '2:00',
    videoSource: 'Warner Bros. TV (Official)',
    dialogueQuote: 'How you doin\'?',
    actorName: 'Matt LeBlanc',
    characterName: 'Joey Tribbiani',
    thumbnailUrl: 'https://img.youtube.com/vi/CLvXFVbb82Q/hqdefault.jpg',
    category: 'sitcoms',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Warner Bros. TV Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'How you doin\'?', arEg: 'عامل إيه؟ / إزيك؟ (بنبرة غزل مضحكة)', arFusha: 'كيف حالك؟', speaker: 'Joey', keyWords: [{ word: 'How you doin\'', ipa: '', meaningAr: 'عامل إيه؟ (صيغة عامية من How are you doing)', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'I know, right? It\'s a good line.', arEg: 'عارف، صح؟ دي جملة خطيرة.', arFusha: 'أعلم، أليس كذلك؟ إنها جملة ناجحة.', speaker: 'Joey', keyWords: [{ word: 'line', ipa: '', meaningAr: 'جملة معسولة / تكتيك كلام', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'How you doin\'?', type: 'slang', meaningAr: 'صيغة عامية قصيرة من How are you doing وتستخدم كنبرة إعجاب مضحكة', meaningEn: '', egyptianEquivalent: 'إزيك يا قمر (بنبرة جوي)', exampleInScene: 'How you doin\'?' },      { term: 'pick-up line', type: 'cultural', meaningAr: 'جملة تعارف ومعاكسة', meaningEn: '', egyptianEquivalent: 'جملة معاكسة', exampleInScene: 'That is his famous pick-up line.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How you doin\'? is a short, casual form of which question?', questionAr: 'How you doin\'? هي صيغة عامية مختصرة لأي سؤال؟', options: ['How old are you?', 'How are you doing?', 'Where are you going?', 'What are you doing?'], correctIndex: 1, explanationAr: 'الصيغة الكاملة: How are you doing?' }
    ],
    speakingLines: [{ en: 'How you doin\'?', arEg: 'عامل إيه؟' }],
  },
  {
    id: 'podcast-bbc-6min-housework',
    movieTitle: '6 Minute English',
    releaseYear: 2008,
    director: 'BBC Learning English',
    genre: 'Educational Podcast',
    cefrLevel: 'B1',
    sceneTitle: 'Who does the housework?',
    sceneDescription: 'BBC Learning English hosts discuss who really does the housework and teach useful everyday vocabulary in six minutes.',
    youtubeId: 'D9jZMLm72a8',
    startTime: 0,
    endTime: 360,
    clipDuration: '6:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Who does the housework in your house?',
    actorName: 'BBC Presenters',
    characterName: 'Hosts',
    thumbnailUrl: 'https://img.youtube.com/vi/D9jZMLm72a8/hqdefault.jpg',
    category: 'british_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'Who does the housework in your house? Is it shared equally?', arEg: 'مين بيعمل شغل البيت في بيتكم؟ هل متقسم بالعدل؟', arFusha: 'من يقوم بالأعمال المنزلية في منزلكم؟ هل هي موزعة بالتساوي؟', speaker: 'Host', keyWords: [{ word: 'housework', ipa: '', meaningAr: 'شغل البيت', meaningEn: '' }, { word: 'shared equally', ipa: '', meaningAr: 'متقسم بالعدل', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'In this programme, we will be learning some useful vocabulary as well.', arEg: 'في الحلقة دي هنتعلم كمان كلمات مفيدة جديدة.', arFusha: 'في هذا البرنامج، سنتعلم أيضاً بعض المفردات المفيدة.', speaker: 'Host', keyWords: [{ word: 'programme', ipa: '', meaningAr: 'برنامج / حلقة', meaningEn: '' }, { word: 'useful', ipa: '', meaningAr: 'مفيد', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'housework', type: 'cultural', meaningAr: 'الأعمال المنزلية (نظافة، غسيل، طبخ)', meaningEn: '', egyptianEquivalent: 'شغل البيت', exampleInScene: 'Who does the housework?' },      { term: 'chores', type: 'cultural', meaningAr: 'المهام المنزلية اليومية', meaningEn: '', egyptianEquivalent: 'مشاوير ومهام البيت', exampleInScene: 'I hate doing chores.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is this BBC programme about?', questionAr: 'الحلقة دي بتتكلم عن إيه؟', options: ['Cooking recipes', 'Who does the housework', 'Buying a new house', 'Gardening tips'], correctIndex: 1, explanationAr: 'العنوان والموضوع: مين بيعمل شغل البيت.' }
    ],
    speakingLines: [{ en: 'Who does the housework in your house?', arEg: 'مين بيعمل شغل البيت في بيتكم؟' }],
  },
  {
    id: 'scene-toystory-infinity',
    movieTitle: 'Toy Story',
    releaseYear: 1995,
    director: 'John Lasseter',
    genre: 'Animation / Family',
    cefrLevel: 'A1',
    sceneTitle: 'To Infinity and Beyond',
    sceneDescription: 'Buzz Lightyear shouts his legendary catchphrase as he proves he can fly around Andy\'s room.',
    youtubeId: 'LdMb9D9WF5k',
    startTime: 0,
    endTime: 60,
    clipDuration: '1:00',
    videoSource: 'LoveMovieQuotes',
    dialogueQuote: 'To infinity and beyond!',
    actorName: 'Tim Allen',
    characterName: 'Buzz Lightyear',
    thumbnailUrl: 'https://img.youtube.com/vi/LdMb9D9WF5k/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Pixar / Disney',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'To infinity and beyond!', arEg: 'للمالانهاية وأبعد منها كمان!', arFusha: 'إلى اللانهاية وما بعدها!', speaker: 'Buzz Lightyear', keyWords: [{ word: 'infinity', ipa: '', meaningAr: 'مالانهاية', meaningEn: '' }, { word: 'beyond', ipa: '', meaningAr: 'أبعد من', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'I can fly!', arEg: 'أنا أقدر أطير!', arFusha: 'أستطيع الطيران!', speaker: 'Buzz Lightyear', keyWords: [{ word: 'fly', ipa: '', meaningAr: 'يطير', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'infinity', type: 'cultural', meaningAr: 'المالانهاية، ما لا نهاية له', meaningEn: '', egyptianEquivalent: 'حاجة مش ليها آخر', exampleInScene: 'To infinity and beyond!' },      { term: 'beyond', type: 'cultural', meaningAr: 'أبعد من / ورا حد معين', meaningEn: '', egyptianEquivalent: 'بعد ما توصل للآخر كمان', exampleInScene: 'Beyond the stars.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Complete the quote: To infinity and _______!', questionAr: 'أكمل الجملة الشهيرة: To infinity and _______!', options: ['the moon', 'beyond', 'the stars', 'forever'], correctIndex: 1, explanationAr: 'الجملة الصحيحة: beyond.' }
    ],
    speakingLines: [{ en: 'To infinity and beyond!', arEg: 'للمالانهاية وأبعد!' }],
  },
  {
    id: 'scene-titanic-king',
    movieTitle: 'Titanic',
    releaseYear: 1997,
    director: 'James Cameron',
    genre: 'Romance / Drama',
    cefrLevel: 'A2',
    sceneTitle: 'I\'m the King of the World',
    sceneDescription: 'Jack stands at the ship\'s bow with open arms and shouts the most famous line in Titanic.',
    youtubeId: 'ItjXTieWKyI',
    startTime: 0,
    endTime: 70,
    clipDuration: '1:10',
    videoSource: '20th Century Studios UK (Official)',
    dialogueQuote: 'I\'m the king of the world!',
    actorName: 'Leonardo DiCaprio',
    characterName: 'Jack Dawson',
    thumbnailUrl: 'https://img.youtube.com/vi/ItjXTieWKyI/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: '20th Century Studios Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'I\'m the king of the world!', arEg: 'أنا ملك الدنيا!', arFusha: 'أنا ملك العالم!', speaker: 'Jack', keyWords: [{ word: 'king', ipa: '', meaningAr: 'ملك', meaningEn: '' }, { word: 'world', ipa: '', meaningAr: 'العالم / الدنيا', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'This is amazing! I can feel the wind!', arEg: 'ده حاجة خرافية! حاسس بالهوا!', arFusha: 'هذا مذهل! أستطيع أن أشعر بالرياح!', speaker: 'Jack', keyWords: [{ word: 'amazing', ipa: '', meaningAr: 'مذهل / خرافي', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'bow of the ship', type: 'cultural', meaningAr: 'مقدمة السفينة', meaningEn: '', egyptianEquivalent: 'قدام المركب', exampleInScene: 'Jack stands at the bow.' },      { term: 'king of the world', type: 'cultural', meaningAr: 'إحساس النصر والحرية المطلقة', meaningEn: '', egyptianEquivalent: 'إحساس إنك كسبت الدنيا', exampleInScene: 'I\'m the king of the world!' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Where is Jack standing in this scene?', questionAr: 'جاك واقف فين في المشهد ده؟', options: ['Inside the cabin', 'At the ship\'s bow', 'In the engine room', 'On the dock'], correctIndex: 1, explanationAr: 'واقف في مقدمة السفينة (the bow).' }
    ],
    speakingLines: [{ en: 'I\'m the king of the world!', arEg: 'أنا ملك الدنيا!' }],
  },
  {
    id: 'lesson-friends-monica-sick',
    movieTitle: 'Learn English with Friends',
    releaseYear: 1994,
    director: 'Learn English with Fun & Ease',
    genre: 'TV Lesson / Sitcom Learning',
    cefrLevel: 'B1',
    sceneTitle: 'Monica is Sick But Cannot Admit It',
    sceneDescription: 'A guided lesson on a Friends scene where Monica refuses to admit she is sick, with vocabulary breakdown.',
    youtubeId: '21_5JLwqLso',
    startTime: 0,
    endTime: 300,
    clipDuration: '5:00',
    videoSource: 'Learn English with Fun & Ease',
    dialogueQuote: 'Monica is sick but cannot admit it.',
    actorName: 'Courteney Cox',
    characterName: 'Monica Geller',
    thumbnailUrl: 'https://img.youtube.com/vi/21_5JLwqLso/hqdefault.jpg',
    category: 'tv_series',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Fun & Ease',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'I am not sick. I am totally fine.', arEg: 'أنا مش تعبانة. أنا تمام خالص.', arFusha: 'لست مريضة. أنا بخير تماماً.', speaker: 'Monica', keyWords: [{ word: 'sick', ipa: '', meaningAr: 'تعبان / مريض', meaningEn: '' }, { word: 'totally fine', ipa: '', meaningAr: 'تمام خالص', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'Why can\'t you just admit that you are sick?', arEg: 'ليه مش قادرة تعترفي إنك تعبانة؟', arFusha: 'لماذا لا تعترفين فقط بأنك مريضة؟', speaker: 'Chandler', keyWords: [{ word: 'admit', ipa: '', meaningAr: 'يعترف / يقر', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'admit', type: 'cultural', meaningAr: 'يعترف أو يقر بشيء لا يريد قوله', meaningEn: '', egyptianEquivalent: 'يعترف على مضض', exampleInScene: 'Admit that you are sick.' },      { term: 'sick', type: 'cultural', meaningAr: 'مريض / تعبان', meaningEn: '', egyptianEquivalent: 'عيان', exampleInScene: 'I feel sick today.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does admit mean in this lesson?', questionAr: 'كلمة admit معناها إيه في الدرس؟', options: ['To deny', 'To admit / confess', 'To forget', 'To repeat'], correctIndex: 1, explanationAr: 'admit = يعترف / يقر.' }
    ],
    speakingLines: [{ en: 'Just admit that you are sick.', arEg: 'اعترف بس إنك تعبان.' }],
  },
  {
    id: 'interview-taylor-ellen',
    movieTitle: 'The Ellen DeGeneres Show',
    releaseYear: 2003,
    director: 'Telepictures',
    genre: 'Talk Show / Interview',
    cefrLevel: 'B1',
    sceneTitle: 'Taylor Swift Full Interview with Ellen',
    sceneDescription: 'Taylor Swift\'s full sit-down with Ellen: career, life, and funny moments in natural conversational English.',
    youtubeId: 'on4bHNdUm-I',
    startTime: 0,
    endTime: 300,
    clipDuration: '5:00',
    videoSource: 'TheEllenShow (Official)',
    dialogueQuote: 'Taylor Swift\'s Full Interview with Ellen',
    actorName: 'Ellen DeGeneres',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/on4bHNdUm-I/hqdefault.jpg',
    category: 'interviews',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'TheEllenShow Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'Thank you so much for being here.', arEg: 'شكراً جداً إنك موجودة معانا النهاردة.', arFusha: 'شكراً جزيلاً على تواجدك معنا.', speaker: 'Ellen', keyWords: [{ word: 'thanks for being here', ipa: '', meaningAr: 'شكراً على حضورك', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'It is so good to be back.', arEg: 'حاجة تجنن إني رجعت هنا تاني.', arFusha: 'من الرائع أن أعود من جديد.', speaker: 'Taylor', keyWords: [{ word: 'good to be back', ipa: '', meaningAr: 'سعيدة إني رجعت', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'interview', type: 'cultural', meaningAr: 'مقابلة / لقاء تلفزيوني', meaningEn: '', egyptianEquivalent: 'مقابلة', exampleInScene: 'Watch the full interview.' },      { term: 'small talk', type: 'cultural', meaningAr: 'كلام خفيف افتتاحي في المواقف الاجتماعية', meaningEn: '', egyptianEquivalent: 'هزار وكلام مجاملات', exampleInScene: 'The show starts with small talk.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What type of English can you practice with interviews?', questionAr: 'نوع الإنجليزي اللي بتتمرن عليه من المقابلات؟', options: ['Only grammar rules', 'Natural conversational English', 'Only academic writing', 'Silent reading'], correctIndex: 1, explanationAr: 'المقابلات بتديك إنجليزي محادثة طبيعي.' }
    ],
    speakingLines: [{ en: 'It is so good to be here.', arEg: 'حاجة جميلة إني موجود هنا.' }],
  },
  {
    id: 'scene-harrypotter-wizard',
    movieTitle: 'Harry Potter and the Philosopher\'s Stone',
    releaseYear: 2001,
    director: 'Chris Columbus',
    genre: 'Fantasy / Adventure',
    cefrLevel: 'A2',
    sceneTitle: 'Yer a Wizard, Harry',
    sceneDescription: 'Hagrid finally tells Harry the truth about who he is, in the official clip from the Harry Potter channel.',
    youtubeId: 'nnD8FKXzIGs',
    startTime: 0,
    endTime: 90,
    clipDuration: '1:30',
    videoSource: 'Harry Potter (Official)',
    dialogueQuote: 'You\'re a wizard, Harry.',
    actorName: 'Robbie Coltrane',
    characterName: 'Rubeus Hagrid',
    thumbnailUrl: 'https://img.youtube.com/vi/nnD8FKXzIGs/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Wizarding World Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'You\'re a wizard, Harry.', arEg: 'أنت ساحر يا هاري.', arFusha: 'أنت ساحر يا هاري.', speaker: 'Hagrid', keyWords: [{ word: 'wizard', ipa: '', meaningAr: 'ساحر', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'I\'m a what?', arEg: 'أنا إيه؟!', arFusha: 'أنا ماذا؟', speaker: 'Harry', keyWords: [{ word: 'I\'m a what?', ipa: '', meaningAr: 'أنا إيه؟ (دهشة)', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'wizard', type: 'cultural', meaningAr: 'ساحر (شخصية خيالية عندها قوى سحرية)', meaningEn: '', egyptianEquivalent: 'ساحر', exampleInScene: 'You are a wizard, Harry.' },      { term: 'truth', type: 'cultural', meaningAr: 'الحقيقة', meaningEn: '', egyptianEquivalent: 'الحقيقة', exampleInScene: 'Hagrid tells Harry the truth.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Who tells Harry that he is a wizard?', questionAr: 'مين اللي قال لهاري إنه ساحر؟', options: ['Dumbledore', 'Hagrid', 'Hermione', 'Ron'], correctIndex: 1, explanationAr: 'هاجريد هو اللي أخبر هاري بالحقيقة.' }
    ],
    speakingLines: [{ en: 'You\'re a wizard, Harry.', arEg: 'أنت ساحر يا هاري.' }],
  },
  {
    id: 'scene-lionking-hakuna',
    movieTitle: 'The Lion King',
    releaseYear: 2019,
    director: 'Jon Favreau',
    genre: 'Musical / Family',
    cefrLevel: 'A1',
    sceneTitle: 'Hakuna Matata',
    sceneDescription: 'Timon and Pumbaa teach Simba their carefree philosophy in the official Disney clip.',
    youtubeId: '0MxulhivCvI',
    startTime: 0,
    endTime: 120,
    clipDuration: '2:00',
    videoSource: 'DisneyMusicVEVO (Official)',
    dialogueQuote: 'Hakuna Matata! It means no worries.',
    actorName: 'Billy Eichner & Seth Rogen',
    characterName: 'Timon & Pumbaa',
    thumbnailUrl: 'https://img.youtube.com/vi/0MxulhivCvI/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Disney Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'Hakuna Matata! What a wonderful phrase.', arEg: 'هاكونا ماتاتا! يا لها من عبارة جميلة.', arFusha: 'هاكونا ماتاتا! يا لها من عبارة رائعة.', speaker: 'Timon', keyWords: [{ word: 'phrase', ipa: '', meaningAr: 'عبارة / جملة', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'It means no worries for the rest of your days.', arEg: 'معناها: بلاش هموم بقية أيامك.', arFusha: 'تعني بلا هموم لبقية أيامك.', speaker: 'Pumbaa', keyWords: [{ word: 'no worries', ipa: '', meaningAr: 'بلاش هم / من غير قلق', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'Hakuna Matata', type: 'cultural', meaningAr: 'عبارة سواحيلية معناها: مفيش مشاكل / بلاش هم', meaningEn: '', egyptianEquivalent: 'عيشها وبلاش هموم', exampleInScene: 'Hakuna Matata!' },      { term: 'no worries', type: 'cultural', meaningAr: 'لا تقلق / مفيش مشكلة', meaningEn: '', egyptianEquivalent: 'متقلقش', exampleInScene: 'It means no worries.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does Hakuna Matata mean?', questionAr: 'كلمة Hakuna Matata معناها إيه؟', options: ['Good morning', 'No worries', 'Be careful', 'Work hard'], correctIndex: 1, explanationAr: 'المعنى: no worries (بلاش هم).' }
    ],
    speakingLines: [{ en: 'Hakuna Matata!', arEg: 'هاكونا ماتاتا!' }],
  },
  {
    id: 'doc-bbcearth-iguana',
    movieTitle: 'Planet Earth II',
    releaseYear: 2016,
    director: 'BBC Studios',
    genre: 'Documentary / Nature',
    cefrLevel: 'B1',
    sceneTitle: 'Iguana vs Snakes',
    sceneDescription: 'A newly hatched marine iguana must escape dozens of racer snakes in the most famous BBC Earth chase ever filmed.',
    youtubeId: 'el4CQj-TCbA',
    startTime: 0,
    endTime: 240,
    clipDuration: '4:00',
    videoSource: 'BBC Earth (Official)',
    dialogueQuote: 'A hatchling marine iguana must run a deadly gauntlet of racer snakes.',
    actorName: 'David Attenborough',
    characterName: 'Narrator',
    thumbnailUrl: 'https://img.youtube.com/vi/el4CQj-TCbA/hqdefault.jpg',
    category: 'documentaries',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Earth Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'The iguana\'s only chance is to outrun them.', arEg: 'فرصة الإجوانا الوحيدة هي إنها تجرى أسرع منهم.', arFusha: 'الفرصة الوحيدة للإغوانا هي أن تسبقهم جرياً.', speaker: 'Narrator', keyWords: [{ word: 'outrun', ipa: '', meaningAr: 'يجري أسرع من', meaningEn: '' }, { word: 'chance', ipa: '', meaningAr: 'فرصة', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'Snakes hunt by detecting movement.', arEg: 'الثعابين بتصطاد عن طريق الإحساس بالحركة.', arFusha: 'تصطاد الثعابين عن طريق استشعار الحركة.', speaker: 'Narrator', keyWords: [{ word: 'hunt', ipa: '', meaningAr: 'يصطاد', meaningEn: '' }, { word: 'detect', ipa: '', meaningAr: 'يكتشف / يستشعر', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'hatchling', type: 'cultural', meaningAr: 'صغير حيوان خرج للتو من البيضة', meaningEn: '', egyptianEquivalent: 'صغير لسه فقس', exampleInScene: 'A hatchling iguana.' },      { term: 'outrun', type: 'cultural', meaningAr: 'يسبق بالجري / يجري أسرع من', meaningEn: '', egyptianEquivalent: 'يعدي منه بالعافية', exampleInScene: 'Outrun the snakes.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do the snakes hunt the iguana?', questionAr: 'الثعابين بتصطاد الإجوانا إزاي؟', options: ['By smell', 'By detecting movement', 'By sound', 'By color'], correctIndex: 1, explanationAr: 'الثعابين بتستشعر الحركة (detecting movement).' }
    ],
    speakingLines: [{ en: 'Its only chance is to outrun them.', arEg: 'فرصتها الوحيدة إنها تسبقهم بالجري.' }],
  },
  {
    id: 'doc-bbcearth-survival',
    movieTitle: 'BBC Earth: Animals Battling for Survival',
    releaseYear: 2020,
    director: 'BBC Studios',
    genre: 'Documentary / Nature',
    cefrLevel: 'B2',
    sceneTitle: 'Animals Battling for Survival',
    sceneDescription: 'David Attenborough narrates dramatic moments of animals fighting to survive in the wild.',
    youtubeId: 'Wf_zwkZXMiw',
    startTime: 0,
    endTime: 240,
    clipDuration: '4:00',
    videoSource: 'BBC Earth (Official)',
    dialogueQuote: 'Animals battling for survival, narrated by David Attenborough.',
    actorName: 'David Attenborough',
    characterName: 'Narrator',
    thumbnailUrl: 'https://img.youtube.com/vi/Wf_zwkZXMiw/hqdefault.jpg',
    category: 'documentaries',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Earth Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'Every day is a battle for survival in the wild.', arEg: 'كل يوم في البرية معركة من أجل البقاء.', arFusha: 'كل يوم في البرية معركة من أجل البقاء.', speaker: 'Narrator', keyWords: [{ word: 'survival', ipa: '', meaningAr: 'البقاء', meaningEn: '' }, { word: 'the wild', ipa: '', meaningAr: 'البرية', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'Only the most determined will make it through.', arEg: 'الأكثر إصراراً بس هم اللي هيعيشوا.', arFusha: 'فقط الأكثر إصراراً سينجون.', speaker: 'Narrator', keyWords: [{ word: 'determined', ipa: '', meaningAr: 'مصمم / عنيد', meaningEn: '' }, { word: 'make it through', ipa: '', meaningAr: 'ينجو / يعدي بسلام', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'survival', type: 'cultural', meaningAr: 'البقاء على قيد الحياة', meaningEn: '', egyptianEquivalent: 'البقاء', exampleInScene: 'The battle for survival.' },      { term: 'predator', type: 'cultural', meaningAr: 'حيوان مفترس يصطاد غيره', meaningEn: '', egyptianEquivalent: 'مفترس', exampleInScene: 'The predator waits silently.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does survival mean?', questionAr: 'كلمة survival معناها إيه؟', options: ['Hunting', 'Staying alive', 'Sleeping', 'Traveling'], correctIndex: 1, explanationAr: 'survival = البقاء على قيد الحياة.' }
    ],
    speakingLines: [{ en: 'Every day is a battle for survival.', arEg: 'كل يوم معركة من أجل البقاء.' }],
  },
  {
    id: 'daily-oxford-talk-job',
    movieTitle: 'Oxford Online English: Talking About Your Job',
    releaseYear: 2017,
    director: 'Oxford Online English',
    genre: 'Spoken English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Talking About Your Job',
    sceneDescription: 'A spoken-English lesson on how to answer What do you do? naturally and talk about your work.',
    youtubeId: '235MNImhIko',
    startTime: 0,
    endTime: 300,
    clipDuration: '5:00',
    videoSource: 'Oxford Online English (Official)',
    dialogueQuote: 'What do you do for a living?',
    actorName: 'Oxford Online English',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/235MNImhIko/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Oxford Online English Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'What do you do for a living?', arEg: 'بتشتغل إيه؟ / إيه شغلانتك؟', arFusha: 'ماذا تعمل لتكسب قوتك؟', speaker: 'Teacher', keyWords: [{ word: 'for a living', ipa: '', meaningAr: 'كمورد رزق / كشغل', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'I work as a software engineer for a big company.', arEg: 'أنا شغال مهندس سوفتوير في شركة كبيرة.', arFusha: 'أعمل مهندس برمجيات في شركة كبيرة.', speaker: 'Student', keyWords: [{ word: 'work as', ipa: '', meaningAr: 'اشتغل كـ', meaningEn: '' }, { word: 'engineer', ipa: '', meaningAr: 'مهندس', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'What do you do for a living?', type: 'cultural', meaningAr: 'السؤال الطبيعي عن المهنة', meaningEn: '', egyptianEquivalent: 'بتشتغل إيه؟', exampleInScene: 'What do you do for a living?' },      { term: 'work as', type: 'collocation', meaningAr: 'يعمل في وظيفة (بعدها اسم المهنة)', meaningEn: '', egyptianEquivalent: 'شغال كـ', exampleInScene: 'I work as a teacher.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you ask about someone\'s job naturally?', questionAr: 'تسأل عن شغل حد بشكل طبيعي إزاي؟', options: ['What is your job exactly?', 'What do you do for a living?', 'Where is your work?', 'How is your salary?'], correctIndex: 1, explanationAr: 'الصيغة الطبيعية: What do you do for a living?' }
    ],
    speakingLines: [{ en: 'What do you do for a living?', arEg: 'بتشتغل إيه؟' }],
  },
  {
    id: 'travel-easyenglish-airport',
    movieTitle: 'Easy English: At the Airport',
    releaseYear: 2019,
    director: 'Easy Languages',
    genre: 'Travel Dialogue',
    cefrLevel: 'A2',
    sceneTitle: 'At the Airport Conversation',
    sceneDescription: 'A clear, slow conversation covering check-in, passports and boarding for beginner travelers.',
    youtubeId: 'jy88ejZrPWw',
    startTime: 0,
    endTime: 240,
    clipDuration: '4:00',
    videoSource: 'Easy English (Official)',
    dialogueQuote: 'Can I see your passport, please?',
    actorName: 'Easy English',
    characterName: 'Traveler & Officer',
    thumbnailUrl: 'https://img.youtube.com/vi/jy88ejZrPWw/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Easy English Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'Can I see your passport, please?', arEg: 'ممكن أشوف الباسبور بتاعك لو سمحت؟', arFusha: 'هل يمكنني رؤية جواز سفرك من فضلك؟', speaker: 'Officer', keyWords: [{ word: 'passport', ipa: '', meaningAr: 'جواز السفر', meaningEn: '' }, { word: 'Can I see', ipa: '', meaningAr: 'ممكن أشوف', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'Here you are. My flight leaves at nine.', arEg: 'اتفضل. الطيارة بتاعتي هتقلع الساعة تسعة.', arFusha: 'تفضل. رحلتي تغادر في التاسعة.', speaker: 'Traveler', keyWords: [{ word: 'Here you are', ipa: '', meaningAr: 'اتفضل', meaningEn: '' }, { word: 'leaves', ipa: '', meaningAr: 'تغادر / تقلع', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'boarding pass', type: 'cultural', meaningAr: 'كارت صعود الطائرة', meaningEn: '', egyptianEquivalent: 'تذكرة الركوب', exampleInScene: 'Show your boarding pass.' },      { term: 'check in', type: 'phrasal-verb', meaningAr: 'يسجل وصوله في المطار أو الفندق', meaningEn: '', egyptianEquivalent: 'يعمل تشيك إن', exampleInScene: 'We check in online first.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does the officer ask for first?', questionAr: 'الموظف بيطلب إيه أول حاجة؟', options: ['Your ticket', 'Your passport', 'Your bag', 'Your phone'], correctIndex: 1, explanationAr: 'يطلب الباسبور: Can I see your passport?' }
    ],
    speakingLines: [{ en: 'Can I see your passport, please?', arEg: 'ممكن أشوف الباسبور لو سمحت؟' }],
  },
  {
    id: 'job-begin-interview-conv',
    movieTitle: 'Job Interview English Conversation',
    releaseYear: 2021,
    director: 'Begin With English Stories',
    genre: 'Job Interview Practice',
    cefrLevel: 'A2',
    sceneTitle: 'Job Interview Conversation for Beginners',
    sceneDescription: 'A simple model job interview dialogue: introductions, experience and strengths in easy English.',
    youtubeId: 'Tb4OllD9D1A',
    startTime: 0,
    endTime: 300,
    clipDuration: '5:00',
    videoSource: 'Begin With English Stories (Official)',
    dialogueQuote: 'Tell me about yourself.',
    actorName: 'Begin With English Stories',
    characterName: 'Interviewer & Candidate',
    thumbnailUrl: 'https://img.youtube.com/vi/Tb4OllD9D1A/hqdefault.jpg',
    category: 'job_interviews',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Begin With English Stories Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'Tell me about yourself.', arEg: 'احكيلي عن نفسك.', arFusha: 'حدثني عن نفسك.', speaker: 'Interviewer', keyWords: [{ word: 'Tell me about yourself', ipa: '', meaningAr: 'احكيلي عن نفسك', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'I have three years of experience in sales.', arEg: 'عندي تلات سنين خبرة في المبيعات.', arFusha: 'لدي ثلاث سنوات من الخبرة في المبيعات.', speaker: 'Candidate', keyWords: [{ word: 'experience', ipa: '', meaningAr: 'خبرة', meaningEn: '' }, { word: 'sales', ipa: '', meaningAr: 'مبيعات', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'Tell me about yourself', type: 'cultural', meaningAr: 'السؤال الافتتاحي الأشهر في أي مقابلة عمل', meaningEn: '', egyptianEquivalent: 'عرفني بنفسك', exampleInScene: 'Tell me about yourself.' },      { term: 'strengths', type: 'cultural', meaningAr: 'نقاط القوة', meaningEn: '', egyptianEquivalent: 'نقط قوتك', exampleInScene: 'What are your strengths?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the most common first interview question?', questionAr: 'إيه أشهر سؤال افتتاحي في المقابلات؟', options: ['What is your age?', 'Tell me about yourself.', 'Where do you live?', 'Do you like coffee?'], correctIndex: 1, explanationAr: 'Tell me about yourself هو البداية الكلاسيكية.' }
    ],
    speakingLines: [{ en: 'I have three years of experience.', arEg: 'عندي تلات سنين خبرة.' }],
  },
  {
    id: 'pron-rachels-any-word',
    movieTitle: 'Rachel\'s English',
    releaseYear: 2016,
    director: 'Rachel\'s English',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'How to Pronounce Any Word in American English',
    sceneDescription: 'Rachel teaches a practical method to work out the American pronunciation of any new word.',
    youtubeId: 'Ci4lp_vf9WA',
    startTime: 0,
    endTime: 300,
    clipDuration: '5:00',
    videoSource: 'Rachel\'s English (Official)',
    dialogueQuote: 'How to pronounce any word in American English.',
    actorName: 'Rachel',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/Ci4lp_vf9WA/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Rachel\'s English Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'In this video, we will learn how to pronounce any word.', arEg: 'في الفيديو ده هنتعلم ننطق أي كلمة صح.', arFusha: 'في هذا الفيديو سنتعلم كيف ننطق أي كلمة.', speaker: 'Rachel', keyWords: [{ word: 'pronounce', ipa: '', meaningAr: 'ينطق', meaningEn: '' }, { word: 'any word', ipa: '', meaningAr: 'أي كلمة', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'Pay attention to the stressed syllable.', arEg: 'ركز على المقطع اللي عليه الضغط (النَّبْر).', arFusha: 'انتبه إلى المقطع المشدد.', speaker: 'Rachel', keyWords: [{ word: 'stressed syllable', ipa: '', meaningAr: 'المقطع المنبور', meaningEn: '' }, { word: 'pay attention', ipa: '', meaningAr: 'ركز', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'stressed syllable', type: 'cultural', meaningAr: 'المقطع اللي بيتقال بضغط ووضوح أكبر', meaningEn: '', egyptianEquivalent: 'مقطع النَّبْر', exampleInScene: 'Find the stressed syllable first.' },      { term: 'pronunciation', type: 'cultural', meaningAr: 'النطق السليم للكلمات', meaningEn: '', egyptianEquivalent: 'النطق', exampleInScene: 'Practice your pronunciation daily.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What should you find first in a new word?', questionAr: 'أول حاجة تدور عليها في كلمة جديدة؟', options: ['Its translation', 'The stressed syllable', 'Its plural', 'Its opposite'], correctIndex: 1, explanationAr: 'نبدأ بالمقطع المنبور (stressed syllable).' }
    ],
    speakingLines: [{ en: 'Pay attention to the stressed syllable.', arEg: 'ركز على مقطع النبر.' }],
  },
  {
    id: 'biz-derek-meetings',
    movieTitle: 'English for Business Meetings',
    releaseYear: 2019,
    director: 'Derek Callan',
    genre: 'Business English Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'English for Business Meetings',
    sceneDescription: 'An interactive lesson on the phrases professionals use to open, run and close business meetings.',
    youtubeId: '18nwywmeCH0',
    startTime: 0,
    endTime: 300,
    clipDuration: '5:00',
    videoSource: 'Derek Callan - English for Professionals (Official)',
    dialogueQuote: 'Let\'s get started, shall we?',
    actorName: 'Derek Callan',
    characterName: 'Coach',
    thumbnailUrl: 'https://img.youtube.com/vi/18nwywmeCH0/hqdefault.jpg',
    category: 'business_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Derek Callan Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'Let\'s get started, shall we?', arEg: 'يلا نبدأ، تمام؟', arFusha: 'لنبدأ، أليس كذلك؟', speaker: 'Manager', keyWords: [{ word: 'Let\'s get started', ipa: '', meaningAr: 'يلا نبدأ', meaningEn: '' }, { word: 'shall we?', ipa: '', meaningAr: 'تمام؟ / موافقين؟', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'Does everyone agree with this plan?', arEg: 'كلنا متفقين على الخطة دي؟', arFusha: 'هل يوافق الجميع على هذه الخطة؟', speaker: 'Manager', keyWords: [{ word: 'agree with', ipa: '', meaningAr: 'يتفق مع', meaningEn: '' }, { word: 'plan', ipa: '', meaningAr: 'خطة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'Let\'s get started', type: 'collocation', meaningAr: 'افتتاحية الاجتماعات الاحترافية', meaningEn: '', egyptianEquivalent: 'يلا نبدأ', exampleInScene: 'Let\'s get started, shall we?' },      { term: 'agree on', type: 'phrasal-verb', meaningAr: 'يتفقون على نقطة معينة', meaningEn: '', egyptianEquivalent: 'نتفق على', exampleInScene: 'We agree on the next step.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you professionally open a meeting?', questionAr: 'تفتتح اجتماع بشكل احترافي إزاي؟', options: ['Everybody listen now!', 'Let\'s get started, shall we?', 'Meeting now!', 'Talk fast please.'], correctIndex: 1, explanationAr: 'الافتتاحية الاحترافية: Let\'s get started, shall we?' }
    ],
    speakingLines: [{ en: 'Let\'s get started, shall we?', arEg: 'يلا نبدأ، تمام؟' }],
  },
  {
    id: 'sitcom-seinfeld-opposite',
    movieTitle: 'Seinfeld',
    releaseYear: 1994,
    director: 'Tom Cherones',
    genre: 'Sitcom / Comedy',
    cefrLevel: 'B1',
    sceneTitle: 'George Does The Opposite',
    sceneDescription: 'George Costanza decides every instinct he has is wrong, so he does the exact opposite and his life changes.',
    youtubeId: 'CizwH_T7pjg',
    startTime: 0,
    endTime: 180,
    clipDuration: '3:00',
    videoSource: 'Seinfeld (Official)',
    dialogueQuote: 'If every instinct you have is wrong, then the opposite would have to be right.',
    actorName: 'Jason Alexander',
    characterName: 'George Costanza',
    thumbnailUrl: 'https://img.youtube.com/vi/CizwH_T7pjg/hqdefault.jpg',
    category: 'sitcoms',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Seinfeld Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'If every instinct you have is wrong, then the opposite would have to be right.', arEg: 'لو كل غريزة عندك غلط، يبقى العكس المفروض يكون صح.', arFusha: 'إذا كانت كل غريزة لديك خاطئة، فالعكس يجب أن يكون صحيحاً.', speaker: 'Jerry', keyWords: [{ word: 'instinct', ipa: '', meaningAr: 'غريزة', meaningEn: '' }, { word: 'opposite', ipa: '', meaningAr: 'عكس', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'I will do the opposite of everything I normally do.', arEg: 'هعمل عكس كل اللي بعمله عادة.', arFusha: 'سأفعل عكس كل ما أفعله عادة.', speaker: 'George', keyWords: [{ word: 'normally', ipa: '', meaningAr: 'عادة / في الحالة الطبيعية', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'instinct', type: 'cultural', meaningAr: 'الغريزة أو الحس الداخلي', meaningEn: '', egyptianEquivalent: 'إحساسك الداخلي', exampleInScene: 'Trust your instinct.' },      { term: 'do the opposite', type: 'collocation', meaningAr: 'يفعل العكس تماماً', meaningEn: '', egyptianEquivalent: 'اعمل العكس', exampleInScene: 'I will do the opposite.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does George decide to do?', questionAr: 'جورج قرر يعمل إيه؟', options: ['Move to another city', 'Do the opposite of everything', 'Quit comedy', 'Sleep all day'], correctIndex: 1, explanationAr: 'قرر يعمل عكس كل قراراته المعتادة.' }
    ],
    speakingLines: [{ en: 'I will do the opposite.', arEg: 'هعمل العكس.' }],
  },
  {
    id: 'daily-easyenglish-personalinfo',
    movieTitle: 'Easy English: Personal Information',
    releaseYear: 2020,
    director: 'Easy Languages',
    genre: 'Beginner Dialogue',
    cefrLevel: 'A1',
    sceneTitle: 'Asking for and Giving Personal Information',
    sceneDescription: 'Beginner dialogues for names, countries and phone numbers with clear slow speech.',
    youtubeId: 'MYFSBowiN8k',
    startTime: 0,
    endTime: 240,
    clipDuration: '4:00',
    videoSource: 'Easy English Channel (Official)',
    dialogueQuote: 'What\'s your name? Where are you from?',
    actorName: 'Easy English',
    characterName: 'Speakers',
    thumbnailUrl: 'https://img.youtube.com/vi/MYFSBowiN8k/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Easy English Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'What\'s your name? My name is Adam.', arEg: 'اسمك إيه؟ اسمي آدم.', arFusha: 'ما اسمك؟ اسمي آدم.', speaker: 'Speaker', keyWords: [{ word: 'What\'s your name?', ipa: '', meaningAr: 'اسمك إيه؟', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'Where are you from? I am from Egypt.', arEg: 'أنت منين؟ أنا من مصر.', arFusha: 'من أين أنت؟ أنا من مصر.', speaker: 'Speaker', keyWords: [{ word: 'Where are you from?', ipa: '', meaningAr: 'أنت منين؟', meaningEn: '' }, { word: 'I am from', ipa: '', meaningAr: 'أنا من', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'Where are you from?', type: 'cultural', meaningAr: 'سؤال عن البلد أو المدينة الأصلية', meaningEn: '', egyptianEquivalent: 'أنت منين؟', exampleInScene: 'Where are you from?' },      { term: 'phone number', type: 'cultural', meaningAr: 'رقم التليفون', meaningEn: '', egyptianEquivalent: 'رقم الموبايل', exampleInScene: 'Can I have your phone number?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you answer Where are you from?', questionAr: 'ترد على سؤال Where are you from? إزاي؟', options: ['I am fine', 'I am from Egypt', 'I am twenty', 'I am a doctor'], correctIndex: 1, explanationAr: 'الرد الصحيح: I am from + اسم البلد.' }
    ],
    speakingLines: [{ en: 'Where are you from?', arEg: 'أنت منين؟' }],
  },
  {
    id: 'job-c1-interview-advanced',
    movieTitle: 'Business English: A Job Interview',
    releaseYear: 2021,
    director: 'English Audio Stories',
    genre: 'Advanced Listening',
    cefrLevel: 'C1',
    sceneTitle: 'Advanced Job Interview Listening',
    sceneDescription: 'A C1-level job interview with natural speed and advanced vocabulary for listening practice.',
    youtubeId: 'Xa2Cxw6CsUA',
    startTime: 0,
    endTime: 300,
    clipDuration: '5:00',
    videoSource: 'English Audio Stories (Official)',
    dialogueQuote: 'Tell me about a time you solved a difficult problem.',
    actorName: 'English Audio Stories',
    characterName: 'Interviewer & Candidate',
    thumbnailUrl: 'https://img.youtube.com/vi/Xa2Cxw6CsUA/hqdefault.jpg',
    category: 'job_interviews',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Audio Stories Official',
    subtitles: [
      { id: 'sub-1', start: 5, end: 20, en: 'Tell me about a time you solved a difficult problem.', arEg: 'احكيلي عن موقف حليت فيه مشكلة صعبة.', arFusha: 'حدثني عن موقف حللت فيه مشكلة صعبة.', speaker: 'Interviewer', keyWords: [{ word: 'solved', ipa: '', meaningAr: 'حلّ', meaningEn: '' }, { word: 'difficult', ipa: '', meaningAr: 'صعبة', meaningEn: '' }] },      { id: 'sub-2', start: 30, end: 45, en: 'I identified the bottleneck and redesigned the workflow.', arEg: 'حددت عنق الزجاجة وأعدت تصميم سير العمل.', arFusha: 'حددت نقطة الاختناق وأعدت تصميم سير العمل.', speaker: 'Candidate', keyWords: [{ word: 'bottleneck', ipa: '', meaningAr: 'عنق الزجاجة / نقطة الاختناق', meaningEn: '' }, { word: 'workflow', ipa: '', meaningAr: 'سير العمل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'bottleneck', type: 'cultural', meaningAr: 'نقطة الاختناق التي تعطل سير العمل', meaningEn: '', egyptianEquivalent: 'الحتة اللي واقفة الشغل', exampleInScene: 'We found the bottleneck.' },      { term: 'redesign', type: 'cultural', meaningAr: 'يعيد تصميم', meaningEn: '', egyptianEquivalent: 'يظبط من تاني', exampleInScene: 'Redesign the workflow.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What kind of answer does the interviewer want?', questionAr: 'المُحاوِر عايز نوع إجابة إيه؟', options: ['A joke', 'A real problem-solving example', 'Your hobbies', 'Your favorite food'], correctIndex: 1, explanationAr: 'مطلوب مثال حقيقي لحل مشكلة (problem-solving).' }
    ],
    speakingLines: [{ en: 'I solved a difficult problem at work.', arEg: 'حليت مشكلة صعبة في الشغل.' }],
  },
  {
    id: 'daily-bbc-introduce-yourself',
    movieTitle: 'Easy English Conversations: How to Introduce Yourself',
    releaseYear: 2023,
    director: 'BBC Learning English',
    genre: 'Beginner Dialogue',
    cefrLevel: 'A1',
    sceneTitle: 'Introducing Yourself',
    sceneDescription: 'درس قصير من BBC بيعلّمك تعرّف عن نفسك بجمل بسيطة وواضحة: الاسم، البلد، والشغل.',
    youtubeId: 'I_tRSrPru94',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Hello, I\'m Sam. Nice to meet you.',
    actorName: 'BBC Presenters',
    characterName: 'Learners',
    thumbnailUrl: 'https://img.youtube.com/vi/I_tRSrPru94/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Hello, I\'m Sam. Nice to meet you.', arEg: 'أهلاً، أنا سام. سعيد بلقائك.', arFusha: 'مرحباً، أنا سام. سعيد بلقائك.', speaker: 'Sam', keyWords: [{ word: 'nice to meet you', ipa: '', meaningAr: 'سعيد بلقائك', meaningEn: '' }, { word: 'hello', ipa: '', meaningAr: 'أهلاً', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I\'m from London, and I\'m a teacher.', arEg: 'أنا من لندن، وأنا مدرّسة.', arFusha: 'أنا من لندن، وأعمل مدرّسة.', speaker: 'Sam', keyWords: [{ word: 'from', ipa: '', meaningAr: 'من (بلد)', meaningEn: '' }, { word: 'teacher', ipa: '', meaningAr: 'مدرّس', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'introduce', type: 'cultural', meaningAr: 'يقدّم / يعرّف', meaningEn: '', egyptianEquivalent: 'يعرّف بنفسه', exampleInScene: 'Let me introduce myself.' },      { term: 'nice to meet you', type: 'cultural', meaningAr: 'سعيد بلقائك', meaningEn: '', egyptianEquivalent: 'تشرفنا', exampleInScene: 'Nice to meet you, Ahmed.' },      { term: 'hometown', type: 'cultural', meaningAr: 'البلدة الأصلية', meaningEn: '', egyptianEquivalent: 'بلدك الأصلية', exampleInScene: 'My hometown is Mansoura.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does Sam say when she meets someone new?', questionAr: 'سام بتقول إيه لما بتقابل حد جديد؟', options: ['Nice to meet you', 'See you later', 'Good night', 'How old are you'], correctIndex: 0, explanationAr: 'لما بنقابل حد أول مرة بنقول Nice to meet you يعني سعيد بلقائك.' }
    ],
    speakingLines: [{ en: 'Hello, I\'m Sam. Nice to meet you.', arEg: 'أهلاً، أنا سام. سعيد بلقائك.' }, { en: 'I\'m from London, and I\'m a teacher.', arEg: 'أنا من لندن، وأنا مدرّسة.' }],
  },
  {
    id: 'daily-bbc-where-from',
    movieTitle: 'Easy English Conversations: Saying Where You\'re From',
    releaseYear: 2023,
    director: 'BBC Learning English',
    genre: 'Beginner Dialogue',
    cefrLevel: 'A1',
    sceneTitle: 'Saying Where You\'re From',
    sceneDescription: 'الحلقة التانية من سلسلة BBC: تسأل وتجاوب على سؤال انت منين بطريقة طبيعية.',
    youtubeId: '31y2Bq1RYQA',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Where are you from? I\'m from Egypt.',
    actorName: 'BBC Presenters',
    characterName: 'Learners',
    thumbnailUrl: 'https://img.youtube.com/vi/31y2Bq1RYQA/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Where are you from?', arEg: 'انت منين؟', arFusha: 'من أين أنت؟', speaker: 'Presenter', keyWords: [{ word: 'where', ipa: '', meaningAr: 'أين / منين', meaningEn: '' }, { word: 'from', ipa: '', meaningAr: 'من', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I\'m from Cairo, the capital of Egypt.', arEg: 'أنا من القاهرة، عاصمة مصر.', arFusha: 'أنا من القاهرة، عاصمة مصر.', speaker: 'Learner', keyWords: [{ word: 'capital', ipa: '', meaningAr: 'عاصمة', meaningEn: '' }, { word: 'Egypt', ipa: '', meaningAr: 'مصر', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'where are you from', type: 'cultural', meaningAr: 'انت منين؟', meaningEn: '', egyptianEquivalent: 'انت منين؟', exampleInScene: 'Where are you from? - I\'m from Giza.' },      { term: 'capital', type: 'cultural', meaningAr: 'عاصمة', meaningEn: '', egyptianEquivalent: 'عاصمة', exampleInScene: 'Cairo is the capital of Egypt.' },      { term: 'be from', type: 'phrasal-verb', meaningAr: 'يكون من (مكان)', meaningEn: '', egyptianEquivalent: 'من بلد كذا', exampleInScene: 'She is from Alexandria.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you ask someone about their country or city?', questionAr: 'بتسأل حد عن بلده أو مدينته إزاي؟', options: ['Where are you from?', 'What time is it?', 'How much is this?', 'Where is the bathroom?'], correctIndex: 0, explanationAr: 'Where are you from? هي الطريقة المباشرة والمهذبة للسؤال عن بلد أو مدينة الشخص.' }
    ],
    speakingLines: [{ en: 'Where are you from?', arEg: 'انت منين؟' }, { en: 'I\'m from Cairo, the capital of Egypt.', arEg: 'أنا من القاهرة، عاصمة مصر.' }],
  },
  {
    id: 'interviews-easyenglish-newyork',
    movieTitle: 'An Englishman in New York - Easy English',
    releaseYear: 2019,
    director: 'Easy English',
    genre: 'Educational / Real Life',
    cefrLevel: 'B1',
    sceneTitle: 'Street Interviews in New York',
    sceneDescription: 'مقابلات شارع حقيقية في نيويورك مع ناس عادية بتتكلم عن حياتها - تدريب ممتاز على اللهجة الأمريكية الطبيعية.',
    youtubeId: 'M380ySm1vOk',
    startTime: 15,
    endTime: 135,
    clipDuration: '2:00',
    videoSource: 'Easy English (Official)',
    dialogueQuote: 'What do you like most about New York?',
    actorName: 'Easy English Team',
    characterName: 'Interviewees',
    thumbnailUrl: 'https://img.youtube.com/vi/M380ySm1vOk/hqdefault.jpg',
    category: 'interviews',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Easy English Official',
    subtitles: [
      { id: 'sub-1', start: 20, end: 35, en: 'What do you like most about New York?', arEg: 'إيه أكتر حاجة بتحبها في نيويورك؟', arFusha: 'ما أكثر شيء يعجبك في نيويورك؟', speaker: 'Interviewer', keyWords: [{ word: 'most', ipa: '', meaningAr: 'الأكثر', meaningEn: '' }, { word: 'like', ipa: '', meaningAr: 'يحب', meaningEn: '' }] },      { id: 'sub-2', start: 45, end: 60, en: 'I love the energy and the people here.', arEg: 'بحب الطاقة والناس هنا.', arFusha: 'أحب حيوية المدينة والناس هنا.', speaker: 'Interviewee', keyWords: [{ word: 'energy', ipa: '', meaningAr: 'طاقة / حيوية', meaningEn: '' }, { word: 'people', ipa: '', meaningAr: 'ناس', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'energy', type: 'cultural', meaningAr: 'طاقة / حيوية', meaningEn: '', egyptianEquivalent: 'حيوية', exampleInScene: 'The city is full of energy.' },      { term: 'like most', type: 'cultural', meaningAr: 'أكتر حاجة بيحبها', meaningEn: '', egyptianEquivalent: 'أكتر حاجة', exampleInScene: 'What do you like most about your job?' },      { term: 'diverse', type: 'cultural', meaningAr: 'متنوع', meaningEn: '', egyptianEquivalent: 'متنوع', exampleInScene: 'New York is a very diverse city.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does the interviewee love about New York?', questionAr: 'المتكلم بيحب إيه في نيويورك؟', options: ['The energy and the people', 'The weather', 'The traffic', 'The prices'], correctIndex: 0, explanationAr: 'قال I love the energy and the people here يعني بيحب حيوية المدينة وناسها.' }
    ],
    speakingLines: [{ en: 'What do you like most about New York?', arEg: 'إيه أكتر حاجة بتحبها في نيويورك؟' }, { en: 'I love the energy and the people here.', arEg: 'بحب الطاقة والناس هنا.' }],
  },
  {
    id: 'travel-train-station',
    movieTitle: 'At the Train Station - Easy English Conversation',
    releaseYear: 2023,
    director: 'EasyTalk English',
    genre: 'Travel Dialogue',
    cefrLevel: 'A2',
    sceneTitle: 'Buying a Train Ticket',
    sceneDescription: 'حوار عملي في محطة القطر: شراء تذكرة، السؤال عن المواعيد والرصيف - كل الجمل اللي محتاجها في السفر.',
    youtubeId: 'PDv7Q8eiDUQ',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'EasyTalk English (Official)',
    dialogueQuote: 'A one-way ticket to Alexandria, please.',
    actorName: 'EasyTalk English',
    characterName: 'Traveller & Clerk',
    thumbnailUrl: 'https://img.youtube.com/vi/PDv7Q8eiDUQ/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'EasyTalk English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'A one-way ticket to Alexandria, please.', arEg: 'تذكرة ذهاب بس لإسكندرية، من فضلك.', arFusha: 'تذكرة ذهاب فقط إلى الإسكندرية، من فضلك.', speaker: 'Traveller', keyWords: [{ word: 'one-way ticket', ipa: '', meaningAr: 'تذكرة ذهاب فقط', meaningEn: '' }, { word: 'please', ipa: '', meaningAr: 'من فضلك', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'The train leaves from platform three at ten thirty.', arEg: 'القطر بيتحرك من رصيف تلاتة الساعة عشرة ونص.', arFusha: 'يغادر القطار من الرصيف رقم ثلاثة في العاشرة والنصف.', speaker: 'Clerk', keyWords: [{ word: 'platform', ipa: '', meaningAr: 'رصيف', meaningEn: '' }, { word: 'leaves', ipa: '', meaningAr: 'يتحرك / يغادر', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'one-way ticket', type: 'collocation', meaningAr: 'تذكرة ذهاب فقط', meaningEn: '', egyptianEquivalent: 'تذكرة رايح بس', exampleInScene: 'A one-way ticket to Cairo, please.' },      { term: 'platform', type: 'cultural', meaningAr: 'رصيف (محطة)', meaningEn: '', egyptianEquivalent: 'رصيف', exampleInScene: 'The train is at platform two.' },      { term: 'depart', type: 'cultural', meaningAr: 'يغادر / يتحرك', meaningEn: '', egyptianEquivalent: 'يتحرك', exampleInScene: 'The train departs at nine.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Where does the train leave from?', questionAr: 'القطر بيتحرك منين؟', options: ['Platform three', 'Platform thirteen', 'The airport', 'Gate five'], correctIndex: 0, explanationAr: 'الموظف قال platform three يعني رصيف رقم تلاتة.' }
    ],
    speakingLines: [{ en: 'A one-way ticket to Alexandria, please.', arEg: 'تذكرة ذهاب بس لإسكندرية، من فضلك.' }, { en: 'The train leaves from platform three at ten thirty.', arEg: 'القطر بيتحرك من رصيف تلاتة الساعة عشرة ونص.' }],
  },
  {
    id: 'job-bbc-english-at-work-interview',
    movieTitle: 'BBC English at Work: How to Prepare for an Interview',
    releaseYear: 2016,
    director: 'BBC Learning English',
    genre: 'Business English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Interview Preparation',
    sceneDescription: 'من سلسلة BBC English at Work: نصايح عملية للتحضير لمقابلة شغل بالإنجليزي والرد على الأسئلة الشائعة.',
    youtubeId: 'KN2jyw6D1ak',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Research the company before your interview.',
    actorName: 'BBC Learning English',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/KN2jyw6D1ak/hqdefault.jpg',
    category: 'job_interviews',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Research the company before your interview.', arEg: 'اعمل بحث عن الشركة قبل المقابلة.', arFusha: 'ابحث عن الشركة قبل المقابلة.', speaker: 'Presenter', keyWords: [{ word: 'research', ipa: '', meaningAr: 'يبحث عن', meaningEn: '' }, { word: 'company', ipa: '', meaningAr: 'شركة', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Prepare examples of your achievements and skills.', arEg: 'جهّز أمثلة على إنجازاتك ومهاراتك.', arFusha: 'جهّز أمثلة على إنجازاتك ومهاراتك.', speaker: 'Presenter', keyWords: [{ word: 'achievements', ipa: '', meaningAr: 'إنجازات', meaningEn: '' }, { word: 'skills', ipa: '', meaningAr: 'مهارات', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'research', type: 'cultural', meaningAr: 'يبحث عن / يدرس', meaningEn: '', egyptianEquivalent: 'يدور على معلومات عن', exampleInScene: 'Research the company online.' },      { term: 'achievement', type: 'cultural', meaningAr: 'إنجاز', meaningEn: '', egyptianEquivalent: 'إنجاز', exampleInScene: 'Tell me about your achievements.' },      { term: 'prepare', type: 'cultural', meaningAr: 'يحضّر / يجهّز', meaningEn: '', egyptianEquivalent: 'يجهّز', exampleInScene: 'Prepare your answers before the interview.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What should you do before a job interview?', questionAr: 'المفروض تعمل إيه قبل مقابلة الشغل؟', options: ['Research the company', 'Sleep late', 'Wear pajamas', 'Skip breakfast'], correctIndex: 0, explanationAr: 'النصيحة الأساسية: اعمل research عن الشركة قبل ما تروح المقابلة.' }
    ],
    speakingLines: [{ en: 'Research the company before your interview.', arEg: 'اعمل بحث عن الشركة قبل المقابلة.' }, { en: 'Prepare examples of your achievements and skills.', arEg: 'جهّز أمثلة على إنجازاتك ومهاراتك.' }],
  },
  {
    id: 'listening-bbc-art-of-conversation',
    movieTitle: '6 Minute English: The Art of Conversation',
    releaseYear: 2022,
    director: 'BBC Learning English',
    genre: 'Educational Podcast',
    cefrLevel: 'B2',
    sceneTitle: 'What Makes a Good Conversation?',
    sceneDescription: 'حلقة 6 Minute English عن فن المحادثة: إزاي تسأل أسئلة مفتوحة وتسمع كويس - مفردات غنية ونطق بريطاني واضح.',
    youtubeId: 'xGhbhWUqL-w',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'A good conversation is like a game of tennis.',
    actorName: 'BBC Presenters',
    characterName: 'Hosts',
    thumbnailUrl: 'https://img.youtube.com/vi/xGhbhWUqL-w/hqdefault.jpg',
    category: 'british_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'A good conversation is like a game of tennis.', arEg: 'المحادثة الكويسة زي لعبة تنس.', arFusha: 'المحادثة الجيدة تشبه مباراة تنس.', speaker: 'Host', keyWords: [{ word: 'conversation', ipa: '', meaningAr: 'محادثة', meaningEn: '' }, { word: 'like', ipa: '', meaningAr: 'زي / مثل', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'You listen, then you respond.', arEg: 'بتسمع، وبعدين بترد.', arFusha: 'تستمع، ثم ترد.', speaker: 'Host', keyWords: [{ word: 'listen', ipa: '', meaningAr: 'يسمع', meaningEn: '' }, { word: 'respond', ipa: '', meaningAr: 'يرد', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'conversation', type: 'cultural', meaningAr: 'محادثة', meaningEn: '', egyptianEquivalent: 'كلام / دردشة', exampleInScene: 'We had a nice conversation.' },      { term: 'respond', type: 'cultural', meaningAr: 'يرد / يستجيب', meaningEn: '', egyptianEquivalent: 'يرد', exampleInScene: 'She responded quickly.' },      { term: 'open question', type: 'collocation', meaningAr: 'سؤال مفتوح', meaningEn: '', egyptianEquivalent: 'سؤال مفتوح', exampleInScene: 'Ask open questions to keep talking.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is a good conversation compared to?', questionAr: 'المحادثة الكويسة اتشبهت بإيه؟', options: ['A game of tennis', 'A long movie', 'A busy street', 'A hard exam'], correctIndex: 0, explanationAr: 'اتشبهت بلعبة التنس: واحد يسمع والتاني يرد، بالتبادل.' }
    ],
    speakingLines: [{ en: 'A good conversation is like a game of tennis.', arEg: 'المحادثة الكويسة زي لعبة تنس.' }, { en: 'You listen, then you respond.', arEg: 'بتسمع، وبعدين بترد.' }],
  },
  {
    id: 'speech-steve-jobs-stanford',
    movieTitle: 'Steve Jobs: Stanford Commencement Speech (with Subtitles)',
    releaseYear: 2005,
    director: 'Stanford University',
    genre: 'Inspirational / Speech',
    cefrLevel: 'C1',
    sceneTitle: 'Connecting the Dots',
    sceneDescription: 'أشهر خطاب لستيف جوبز في جامعة ستانفورد: حكاية النقاط اللي بتتوصل بعدين - إنجليزي أمريكي راقي وواضح.',
    youtubeId: '1i9kcBHX2Nw',
    startTime: 60,
    endTime: 180,
    clipDuration: '2:00',
    videoSource: 'English Speeches (Official)',
    dialogueQuote: 'You can\'t connect the dots looking forward.',
    actorName: 'Steve Jobs',
    characterName: 'Steve Jobs',
    thumbnailUrl: 'https://img.youtube.com/vi/1i9kcBHX2Nw/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Speeches Official',
    subtitles: [
      { id: 'sub-1', start: 65, end: 80, en: 'You can\'t connect the dots looking forward.', arEg: 'مش هتقدر تربط النقاط وانت باصص قدام.', arFusha: 'لا يمكنك ربط النقاط وأنت تنظر إلى الأمام.', speaker: 'Steve Jobs', keyWords: [{ word: 'connect', ipa: '', meaningAr: 'يربط', meaningEn: '' }, { word: 'dots', ipa: '', meaningAr: 'نقاط', meaningEn: '' }] },      { id: 'sub-2', start: 90, end: 105, en: 'You can only connect them looking backwards.', arEg: 'تقدر تربطها بس وانت باصص ورا.', arFusha: 'يمكنك ربطها فقط وأنت تنظر إلى الخلف.', speaker: 'Steve Jobs', keyWords: [{ word: 'backwards', ipa: '', meaningAr: 'للخلف / ورا', meaningEn: '' }, { word: 'only', ipa: '', meaningAr: 'فقط', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'connect the dots', type: 'idiom', meaningAr: 'يربط الأحداث ببعضها / يفهم الصورة كاملة', meaningEn: '', egyptianEquivalent: 'يلم الخيوط على بعضها', exampleInScene: 'Only later did I connect the dots.' },      { term: 'look forward', type: 'phrasal-verb', meaningAr: 'يبص قدام / يتطلع للمستقبل', meaningEn: '', egyptianEquivalent: 'يبص قدام', exampleInScene: 'Looking forward, anything is possible.' },      { term: 'trust', type: 'cultural', meaningAr: 'يثق', meaningEn: '', egyptianEquivalent: 'يثق', exampleInScene: 'You have to trust in something.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'According to Steve Jobs, when can you connect the dots?', questionAr: 'حسب ستيف جوبز، امتى تقدر تربط النقاط؟', options: ['Looking backwards', 'Looking forward', 'While sleeping', 'Before they happen'], correctIndex: 0, explanationAr: 'قال You can only connect them looking backwards يعني المعنى بيبان لما تبص ورا.' }
    ],
    speakingLines: [{ en: 'You can\'t connect the dots looking forward.', arEg: 'مش هتقدر تربط النقاط وانت باصص قدام.' }, { en: 'You can only connect them looking backwards.', arEg: 'تقدر تربطها بس وانت باصص ورا.' }],
  },
  {
    id: 'speech-emma-watson-equality',
    movieTitle: 'Emma Watson: Gender Equality Speech (with Subtitles)',
    releaseYear: 2014,
    director: 'UN Women',
    genre: 'Inspirational / Speech',
    cefrLevel: 'B2',
    sceneTitle: 'HeForShe at the UN',
    sceneDescription: 'خطاب إيما واتسون في الأمم المتحدة عن المساواة - نطق بريطاني فصيح ومفردات رسمية مفيدة للمستوى المتقدم.',
    youtubeId: 'nIwU-9ZTTJc',
    startTime: 45,
    endTime: 165,
    clipDuration: '2:00',
    videoSource: 'English Speeches (Official)',
    dialogueQuote: 'Both men and women should feel free to be sensitive.',
    actorName: 'Emma Watson',
    characterName: 'Emma Watson',
    thumbnailUrl: 'https://img.youtube.com/vi/nIwU-9ZTTJc/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Speeches Official',
    subtitles: [
      { id: 'sub-1', start: 50, end: 65, en: 'Both men and women should feel free to be sensitive.', arEg: 'الرجالة والستات الاتنين المفروض يحسوا إنهم أحرار إنهم يكونوا حساسين.', arFusha: 'يجب أن يشعر الرجال والنساء معاً بالحرية في أن يكونوا حساسين.', speaker: 'Emma Watson', keyWords: [{ word: 'both', ipa: '', meaningAr: 'الاتنين', meaningEn: '' }, { word: 'sensitive', ipa: '', meaningAr: 'حساس', meaningEn: '' }] },      { id: 'sub-2', start: 75, end: 90, en: 'Gender equality is your issue too.', arEg: 'المساواة بين الجنسين قضيتك انت كمان.', arFusha: 'المساواة بين الجنسين قضيتك أنت أيضاً.', speaker: 'Emma Watson', keyWords: [{ word: 'equality', ipa: '', meaningAr: 'مساواة', meaningEn: '' }, { word: 'issue', ipa: '', meaningAr: 'قضية', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'gender equality', type: 'collocation', meaningAr: 'المساواة بين الجنسين', meaningEn: '', egyptianEquivalent: 'المساواة', exampleInScene: 'Gender equality matters everywhere.' },      { term: 'sensitive', type: 'cultural', meaningAr: 'حساس', meaningEn: '', egyptianEquivalent: 'حساس', exampleInScene: 'It\'s okay to be sensitive.' },      { term: 'issue', type: 'cultural', meaningAr: 'قضية / مشكلة', meaningEn: '', egyptianEquivalent: 'قضية', exampleInScene: 'This is your issue too.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is Emma Watson\'s main message?', questionAr: 'إيه الرسالة الأساسية لإيما واتسون؟', options: ['Gender equality concerns everyone', 'Only women should change', 'Men should stay silent', 'Equality is impossible'], correctIndex: 0, explanationAr: 'قالت Gender equality is your issue too يعني المساواة قضية تخص الكل.' }
    ],
    speakingLines: [{ en: 'Both men and women should feel free to be sensitive.', arEg: 'الرجالة والستات الاتنين المفروض يحسوا إنهم أحرار إنهم يكونوا حساسين.' }, { en: 'Gender equality is your issue too.', arEg: 'المساواة بين الجنسين قضيتك انت كمان.' }],
  },
  {
    id: 'speech-tom-hanks-human',
    movieTitle: 'Tom Hanks: We Are All But Human (with Subtitles)',
    releaseYear: 2019,
    director: 'English Speeches',
    genre: 'Inspirational / Speech',
    cefrLevel: 'B2',
    sceneTitle: 'On Being Human',
    sceneDescription: 'توم هانكس بيتكلم عن الإنسانية واللطف - ممثل بيوضح كلامه، مثالي للتدريب على الإنجليزي الأمريكي المعبّر.',
    youtubeId: '71c6FmZwCW4',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English Speeches (Official)',
    dialogueQuote: 'We are all but human, and we all make mistakes.',
    actorName: 'Tom Hanks',
    characterName: 'Tom Hanks',
    thumbnailUrl: 'https://img.youtube.com/vi/71c6FmZwCW4/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Speeches Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'We are all but human, and we all make mistakes.', arEg: 'كلنا في الآخر بشر، وكلنا بنغلط.', arFusha: 'جميعنا بشر في النهاية، وجميعنا نخطئ.', speaker: 'Tom Hanks', keyWords: [{ word: 'human', ipa: '', meaningAr: 'بشر / إنسان', meaningEn: '' }, { word: 'make mistakes', ipa: '', meaningAr: 'يغلط', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Kindness is the language everyone understands.', arEg: 'اللطف هو اللغة اللي الكل بيفهمها.', arFusha: 'اللطف هو اللغة التي يفهمها الجميع.', speaker: 'Tom Hanks', keyWords: [{ word: 'kindness', ipa: '', meaningAr: 'لطف', meaningEn: '' }, { word: 'understand', ipa: '', meaningAr: 'يفهم', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'kindness', type: 'cultural', meaningAr: 'لطف / طيبة', meaningEn: '', egyptianEquivalent: 'جدعنة', exampleInScene: 'Kindness costs nothing.' },      { term: 'make a mistake', type: 'collocation', meaningAr: 'يغلط', meaningEn: '', egyptianEquivalent: 'يغلط', exampleInScene: 'Everyone makes mistakes.' },      { term: 'understand', type: 'cultural', meaningAr: 'يفهم', meaningEn: '', egyptianEquivalent: 'يفهم', exampleInScene: 'I understand you perfectly.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does Tom Hanks say everyone understands?', questionAr: 'توم هانكس قال إن إيه اللي الكل بيفهمه؟', options: ['Kindness', 'Money', 'Fear', 'Anger'], correctIndex: 0, explanationAr: 'قال Kindness is the language everyone understands يعني اللطف لغة الكل.' }
    ],
    speakingLines: [{ en: 'We are all but human, and we all make mistakes.', arEg: 'كلنا في الآخر بشر، وكلنا بنغلط.' }, { en: 'Kindness is the language everyone understands.', arEg: 'اللطف هو اللغة اللي الكل بيفهمها.' }],
  },
  {
    id: 'pron-bbc-fast-speech',
    movieTitle: 'BBC Live Class: Understand Native Speakers When They Talk Quickly',
    releaseYear: 2021,
    director: 'BBC Learning English',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Connected Speech Secrets',
    sceneDescription: 'كلاس مباشر من BBC بيشرح إزاي الناطقين الأصليين بيربطوا الكلمات - سر فهم الكلام السريع.',
    youtubeId: '3zN7TjX7h18',
    startTime: 60,
    endTime: 180,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Native speakers link words together.',
    actorName: 'BBC Presenters',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/3zN7TjX7h18/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 65, end: 80, en: 'Native speakers link words together.', arEg: 'الناطقين الأصليين بيربطوا الكلمات ببعضها.', arFusha: 'يربط الناطقون الأصليون الكلمات ببعضها.', speaker: 'Teacher', keyWords: [{ word: 'link', ipa: '', meaningAr: 'يربط', meaningEn: '' }, { word: 'together', ipa: '', meaningAr: 'مع بعض', meaningEn: '' }] },      { id: 'sub-2', start: 90, end: 105, en: 'What do you becomes whaddaya in fast speech.', arEg: 'What do you بتتحول لـ whaddaya في الكلام السريع.', arFusha: 'تتحول What do you إلى whaddaya في الكلام السريع.', speaker: 'Teacher', keyWords: [{ word: 'fast speech', ipa: '', meaningAr: 'الكلام السريع', meaningEn: '' }, { word: 'become', ipa: '', meaningAr: 'يصبح', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'link', type: 'cultural', meaningAr: 'يربط (في النطق)', meaningEn: '', egyptianEquivalent: 'يلزق الكلمات في بعض', exampleInScene: 'Link the words when you speak.' },      { term: 'connected speech', type: 'collocation', meaningAr: 'الكلام المتواصل / المربوط', meaningEn: '', egyptianEquivalent: 'الكلام الملزوق في بعض', exampleInScene: 'Connected speech is hard for learners.' },      { term: 'native speaker', type: 'cultural', meaningAr: 'ناطق أصلي', meaningEn: '', egyptianEquivalent: 'واحد لغته الأم', exampleInScene: 'Listen to native speakers daily.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What happens to \'What do you\' in fast speech?', questionAr: 'بيحصل إيه لـ What do you في الكلام السريع؟', options: ['It becomes whaddaya', 'It disappears', 'It gets louder', 'It stays the same'], correctIndex: 0, explanationAr: 'في الكلام السريع بتنطق whaddaya - دي ظاهرة الربط في النطق.' }
    ],
    speakingLines: [{ en: 'Native speakers link words together.', arEg: 'الناطقين الأصليين بيربطوا الكلمات ببعضها.' }, { en: 'What do you becomes whaddaya in fast speech.', arEg: 'What do you بتتحول لـ whaddaya في الكلام السريع.' }],
  },
  {
    id: 'sitcom-friends-learn-english',
    movieTitle: 'Learn English with Friends - TV Series Lesson',
    releaseYear: 2019,
    director: 'Learn English With TV Series',
    genre: 'TV Lesson / Sitcom Learning',
    cefrLevel: 'A2',
    sceneTitle: 'Friends: Everyday Humor',
    sceneDescription: 'درس مبني على مشاهد من فريندز: كلام يومي، نكتة أمريكية، وتعبيرات بتتقال في كل بيت.',
    youtubeId: 'L5RgaKQLChw',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Learn English With TV Series (Official)',
    dialogueQuote: 'How you doin\'?',
    actorName: 'Cast of Friends',
    characterName: 'Joey',
    thumbnailUrl: 'https://img.youtube.com/vi/L5RgaKQLChw/hqdefault.jpg',
    category: 'sitcoms',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English With TV Series',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'How you doin\'?', arEg: 'عامل إيه؟ / إزيك؟', arFusha: 'كيف حالك؟', speaker: 'Joey', keyWords: [{ word: 'how', ipa: '', meaningAr: 'إزاي', meaningEn: '' }, { word: 'doing', ipa: '', meaningAr: 'عامل (من do)', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Could this be any more boring?', arEg: 'ممكن يكون أمل من كده؟', arFusha: 'هل يمكن أن يكون هذا أكثر مللاً؟', speaker: 'Chandler', keyWords: [{ word: 'boring', ipa: '', meaningAr: 'ممل', meaningEn: '' }, { word: 'any more', ipa: '', meaningAr: 'أكتر من كده', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'how you doin\'', type: 'cultural', meaningAr: 'إزيك؟ (تحية غير رسمية)', meaningEn: '', egyptianEquivalent: 'عامل إيه؟', exampleInScene: 'How you doin\', man?' },      { term: 'boring', type: 'cultural', meaningAr: 'ممل', meaningEn: '', egyptianEquivalent: 'ممل', exampleInScene: 'The movie was boring.' },      { term: 'hang out', type: 'phrasal-verb', meaningAr: 'يقضي وقت مع أصحابه', meaningEn: '', egyptianEquivalent: 'يقعد مع صحابه', exampleInScene: 'Let\'s hang out this weekend.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'How you doin\'?\' mean?', questionAr: 'معنى How you doin\'؟', options: ['إزيك؟', 'فينك؟', 'مع السلامة', 'إيه الأخبار الجديدة؟'], correctIndex: 0, explanationAr: 'تحية غير رسمية مشهورة معناها إزيك أو عامل إيه، اشتهر بيها جوي من فريندز.' }
    ],
    speakingLines: [{ en: 'How you doin\'?', arEg: 'عامل إيه؟' }, { en: 'Could this be any more boring?', arEg: 'ممكن يكون أمل من كده؟' }],
  },
  {
    id: 'movie-incredibles-lesson',
    movieTitle: 'Learn English with Movies: The Incredibles',
    releaseYear: 2018,
    director: 'Exciting English',
    genre: 'Animation / Family',
    cefrLevel: 'A2',
    sceneTitle: 'The Incredibles Lesson',
    sceneDescription: 'درس مبني على فيلم The Incredibles: مفردات عائلية وحركة بجمل بسيطة وواضحة للمبتدئين.',
    youtubeId: 'Rnwwo9Zol6w',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Exciting English (Official)',
    dialogueQuote: 'We are a normal family now.',
    actorName: 'Exciting English',
    characterName: 'The Parr Family',
    thumbnailUrl: 'https://img.youtube.com/vi/Rnwwo9Zol6w/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Exciting English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'We are a normal family now.', arEg: 'احنا دلوقتي عيلة عادية.', arFusha: 'احنا دلوقتي عيلة عادية.', speaker: 'Helen', keyWords: [{ word: 'normal', ipa: '', meaningAr: 'عادي', meaningEn: '' }, { word: 'family', ipa: '', meaningAr: 'عيلة', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'You have to eat your vegetables first.', arEg: 'لازم تاكل الخضار الأول.', arFusha: 'لازم تاكل الخضار الأول.', speaker: 'Helen', keyWords: [{ word: 'vegetables', ipa: '', meaningAr: 'خضار', meaningEn: '' }, { word: 'first', ipa: '', meaningAr: 'الأول', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'normal', type: 'cultural', meaningAr: 'عادي / طبيعي', meaningEn: '', egyptianEquivalent: 'عادي', exampleInScene: 'We live a normal life.' },      { term: 'have to', type: 'cultural', meaningAr: 'لازم / مضطر', meaningEn: '', egyptianEquivalent: 'لازم', exampleInScene: 'You have to study first.' },      { term: 'vegetables', type: 'cultural', meaningAr: 'خضار', meaningEn: '', egyptianEquivalent: 'خضار', exampleInScene: 'Eat your vegetables.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What must the kids eat first?', questionAr: 'الأطفال لازم ياكلوا إيه الأول؟', options: ['Their vegetables', 'Dessert', 'Candy', 'Rice'], correctIndex: 0, explanationAr: 'الأم قالت You have to eat your vegetables first يعني لازم الخضار الأول.' }
    ],
    speakingLines: [{ en: 'We are a normal family now.', arEg: 'احنا دلوقتي عيلة عادية.' }, { en: 'You have to eat your vegetables first.', arEg: 'لازم تاكل الخضار الأول.' }],
  },
  {
    id: 'movie-pursuit-happyness-lesson',
    movieTitle: 'Learn English with The Pursuit of Happyness - Will Smith',
    releaseYear: 2019,
    director: 'Learn English With TV Series',
    genre: 'Biography / Drama',
    cefrLevel: 'B1',
    sceneTitle: 'Don\'t Let Anyone Tell You No',
    sceneDescription: 'أشهر مشهد في The Pursuit of Happyness: نصيحة الأب لابنه عن الحلم - جمل تحفيزية قوية وواضحة.',
    youtubeId: 'pKoH9GkEKxQ',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Learn English With TV Series (Official)',
    dialogueQuote: 'Don\'t ever let somebody tell you you can\'t do something.',
    actorName: 'Will Smith',
    characterName: 'Chris Gardner',
    thumbnailUrl: 'https://img.youtube.com/vi/pKoH9GkEKxQ/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English With TV Series',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Don\'t ever let somebody tell you you can\'t do something.', arEg: 'متسيبش حد أبداً يقولك إنك مش هتقدر تعمل حاجة.', arFusha: 'متسيبش حد أبداً يقولك إنك مش هتقدر تعمل حاجة.', speaker: 'Chris', keyWords: [{ word: 'ever', ipa: '', meaningAr: 'أبداً', meaningEn: '' }, { word: 'let', ipa: '', meaningAr: 'يسيب / يسمح', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'If you have a dream, you have to protect it.', arEg: 'لو عندك حلم، لازم تحميه.', arFusha: 'لو عندك حلم، لازم تحميه.', speaker: 'Chris', keyWords: [{ word: 'dream', ipa: '', meaningAr: 'حلم', meaningEn: '' }, { word: 'protect', ipa: '', meaningAr: 'يحمي', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'dream', type: 'cultural', meaningAr: 'حلم', meaningEn: '', egyptianEquivalent: 'حلم', exampleInScene: 'Never give up your dream.' },      { term: 'protect', type: 'cultural', meaningAr: 'يحمي', meaningEn: '', egyptianEquivalent: 'يحمي', exampleInScene: 'Protect your family.' },      { term: 'give up', type: 'phrasal-verb', meaningAr: 'يستسلم', meaningEn: '', egyptianEquivalent: 'يبطّل', exampleInScene: 'Don\'t give up now.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does Chris tell his son about dreams?', questionAr: 'كريس قال لابنه إيه عن الأحلام؟', options: ['Protect your dream', 'Dreams are for kids', 'Forget your dream', 'Dreams come true alone'], correctIndex: 0, explanationAr: 'قال If you have a dream, you have to protect it يعني لازم تحمي حلمك.' }
    ],
    speakingLines: [{ en: 'Don\'t ever let somebody tell you you can\'t do something.', arEg: 'متسيبش حد أبداً يقولك إنك مش هتقدر تعمل حاجة.' }, { en: 'If you have a dream, you have to protect it.', arEg: 'لو عندك حلم، لازم تحميه.' }],
  },
  {
    id: 'movie-pirates-lesson',
    movieTitle: 'Learn English with Pirates of the Caribbean',
    releaseYear: 2019,
    director: 'Learn English With TV Series',
    genre: 'Action / Adventure',
    cefrLevel: 'B1',
    sceneTitle: 'Captain Jack Sparrow',
    sceneDescription: 'مشاهد من قراصنة الكاريبي مع شرح للتعبيرات - لغة مغامرات ونبرة كابتن جاك المميزة.',
    youtubeId: 'UUAENx1NANg',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Learn English With TV Series (Official)',
    dialogueQuote: 'This is the day you will always remember.',
    actorName: 'Johnny Depp',
    characterName: 'Captain Jack Sparrow',
    thumbnailUrl: 'https://img.youtube.com/vi/UUAENx1NANg/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English With TV Series',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'This is the day you will always remember.', arEg: 'ده اليوم اللي هتفتكره دايماً.', arFusha: 'ده اليوم اللي هتفتكره دايماً.', speaker: 'Jack', keyWords: [{ word: 'always', ipa: '', meaningAr: 'دايماً', meaningEn: '' }, { word: 'remember', ipa: '', meaningAr: 'يفتكر', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Why is the rum gone?', arEg: 'ليه الرم خلص؟', arFusha: 'ليه الرم خلص؟', speaker: 'Jack', keyWords: [{ word: 'why', ipa: '', meaningAr: 'ليه', meaningEn: '' }, { word: 'gone', ipa: '', meaningAr: 'راح / خلص', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'remember', type: 'cultural', meaningAr: 'يفتكر / يتذكر', meaningEn: '', egyptianEquivalent: 'يفتكر', exampleInScene: 'I will always remember this day.' },      { term: 'gone', type: 'cultural', meaningAr: 'راح / خلص', meaningEn: '', egyptianEquivalent: 'خلص', exampleInScene: 'The food is gone.' },      { term: 'captain', type: 'cultural', meaningAr: 'قبطان / كابتن', meaningEn: '', egyptianEquivalent: 'كابتن', exampleInScene: 'He is the captain of the ship.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does Jack say you will always remember?', questionAr: 'جاك قال إنك هتفتكر إيه دايماً؟', options: ['This day', 'His name', 'The ship', 'The treasure'], correctIndex: 0, explanationAr: 'قال This is the day you will always remember يعني ده اليوم اللي هتفتكره دايماً.' }
    ],
    speakingLines: [{ en: 'This is the day you will always remember.', arEg: 'ده اليوم اللي هتفتكره دايماً.' }, { en: 'Why is the rum gone?', arEg: 'ليه الرم خلص؟' }],
  },
  {
    id: 'movie-tangled-lesson',
    movieTitle: 'Learn English with Tangled - Rapunzel\'s Birthday Wish',
    releaseYear: 2020,
    director: 'Learn English With TV Series',
    genre: 'Animation / Family',
    cefrLevel: 'A2',
    sceneTitle: 'Rapunzel\'s Wish',
    sceneDescription: 'مشهد من ربانزل: أمنية عيد الميلاد والفوانيس - جمل سهلة وعبارات عن الأمنيات والأحلام.',
    youtubeId: 'oZXiFpqxTuw',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Learn English With TV Series (Official)',
    dialogueQuote: 'I want to see the floating lights.',
    actorName: 'Mandy Moore',
    characterName: 'Rapunzel',
    thumbnailUrl: 'https://img.youtube.com/vi/oZXiFpqxTuw/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English With TV Series',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'I want to see the floating lights.', arEg: 'عايزة أشوف الأنوار الطايرة.', arFusha: 'عايزة أشوف الأنوار الطايرة.', speaker: 'Rapunzel', keyWords: [{ word: 'want', ipa: '', meaningAr: 'عايز', meaningEn: '' }, { word: 'floating', ipa: '', meaningAr: 'طاير / عايم', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'It is my birthday wish.', arEg: 'دي أمنية عيد ميلادي.', arFusha: 'دي أمنية عيد ميلادي.', speaker: 'Rapunzel', keyWords: [{ word: 'birthday', ipa: '', meaningAr: 'عيد ميلاد', meaningEn: '' }, { word: 'wish', ipa: '', meaningAr: 'أمنية', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'wish', type: 'cultural', meaningAr: 'أمنية', meaningEn: '', egyptianEquivalent: 'أمنية', exampleInScene: 'Make a wish.' },      { term: 'floating', type: 'cultural', meaningAr: 'طاير / عايم', meaningEn: '', egyptianEquivalent: 'طاير', exampleInScene: 'Look at the floating lights.' },      { term: 'want to', type: 'cultural', meaningAr: 'عايز', meaningEn: '', egyptianEquivalent: 'عايز', exampleInScene: 'I want to travel.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does Rapunzel want to see?', questionAr: 'ربانزل عايزة تشوف إيه؟', options: ['The floating lights', 'The sea', 'The castle', 'Her friends'], correctIndex: 0, explanationAr: 'قالت I want to see the floating lights يعني عايزة تشوف الأنوار الطايرة.' }
    ],
    speakingLines: [{ en: 'I want to see the floating lights.', arEg: 'عايزة أشوف الأنوار الطايرة.' }, { en: 'It is my birthday wish.', arEg: 'دي أمنية عيد ميلادي.' }],
  },
  {
    id: 'daily-voa-lesson1-welcome',
    movieTitle: 'VOA Let\'s Learn English - Lesson 1: Welcome!',
    releaseYear: 2017,
    director: 'VOA Learning English',
    genre: 'Beginner Dialogue',
    cefrLevel: 'A1',
    sceneTitle: 'Meeting New Neighbors',
    sceneDescription: 'أول درس من كورس VOA الكامل: آنا بتقابل جيرانها الجدد - تحيات وتعارف بإنجليزي أمريكي بطيء وواضح.',
    youtubeId: 'WR9_nsLyaEY',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'VOA Learning English (Official)',
    dialogueQuote: 'Hi! I am Anna. I am your new neighbor.',
    actorName: 'Anna Matteo',
    characterName: 'Anna',
    thumbnailUrl: 'https://img.youtube.com/vi/WR9_nsLyaEY/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'VOA Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Hi! I am Anna. I am your new neighbor.', arEg: 'أهلاً! أنا آنا. أنا جارتكم الجديدة.', arFusha: 'أهلاً! أنا آنا. أنا جارتكم الجديدة.', speaker: 'Anna', keyWords: [{ word: 'neighbor', ipa: '', meaningAr: 'جار', meaningEn: '' }, { word: 'new', ipa: '', meaningAr: 'جديد', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Welcome to the building!', arEg: 'أهلاً بيكي في العمارة!', arFusha: 'أهلاً بيكي في العمارة!', speaker: 'Neighbor', keyWords: [{ word: 'welcome', ipa: '', meaningAr: 'أهلاً بيك', meaningEn: '' }, { word: 'building', ipa: '', meaningAr: 'عمارة / مبنى', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'neighbor', type: 'cultural', meaningAr: 'جار', meaningEn: '', egyptianEquivalent: 'جار', exampleInScene: 'My neighbor is very kind.' },      { term: 'welcome', type: 'cultural', meaningAr: 'أهلاً بيك', meaningEn: '', egyptianEquivalent: 'اتفضل', exampleInScene: 'Welcome to Egypt!' },      { term: 'building', type: 'cultural', meaningAr: 'عمارة / مبنى', meaningEn: '', egyptianEquivalent: 'عمارة', exampleInScene: 'I live in this building.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Who is Anna?', questionAr: 'مين آنا؟', options: ['The new neighbor', 'The teacher', 'The doctor', 'The manager'], correctIndex: 0, explanationAr: 'آنا قالت I am your new neighbor يعني هي الجارة الجديدة.' }
    ],
    speakingLines: [{ en: 'Hi! I am Anna. I am your new neighbor.', arEg: 'أهلاً! أنا آنا. أنا جارتكم الجديدة.' }, { en: 'Welcome to the building!', arEg: 'أهلاً بيكي في العمارة!' }],
  },
  {
    id: 'daily-voa-lesson8-busy',
    movieTitle: 'VOA Let\'s Learn English - Lesson 8: Are You Busy?',
    releaseYear: 2017,
    director: 'VOA Learning English',
    genre: 'Beginner Dialogue',
    cefrLevel: 'A2',
    sceneTitle: 'Talking About Your Day',
    sceneDescription: 'آنا بتتكلم عن يومها ومواعيدها - المضارع المستمر والكلام عن الشغل والانشغال بشكل يومي.',
    youtubeId: 'sp0cwcd1fGE',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'VOA Learning English (Official)',
    dialogueQuote: 'Are you busy? I am working on something important.',
    actorName: 'Anna Matteo',
    characterName: 'Anna',
    thumbnailUrl: 'https://img.youtube.com/vi/sp0cwcd1fGE/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'VOA Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Are you busy right now?', arEg: 'انت مشغول دلوقتي؟', arFusha: 'انت مشغول دلوقتي؟', speaker: 'Friend', keyWords: [{ word: 'busy', ipa: '', meaningAr: 'مشغول', meaningEn: '' }, { word: 'right now', ipa: '', meaningAr: 'دلوقتي', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'I am working on something important.', arEg: 'باشتغل على حاجة مهمة.', arFusha: 'باشتغل على حاجة مهمة.', speaker: 'Anna', keyWords: [{ word: 'working on', ipa: '', meaningAr: 'شغال على', meaningEn: '' }, { word: 'important', ipa: '', meaningAr: 'مهم', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'busy', type: 'cultural', meaningAr: 'مشغول', meaningEn: '', egyptianEquivalent: 'مشغول', exampleInScene: 'I am busy today.' },      { term: 'right now', type: 'cultural', meaningAr: 'دلوقتي', meaningEn: '', egyptianEquivalent: 'دلوقتي حالاً', exampleInScene: 'I am working right now.' },      { term: 'important', type: 'cultural', meaningAr: 'مهم', meaningEn: '', egyptianEquivalent: 'مهم', exampleInScene: 'This meeting is important.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is Anna doing?', questionAr: 'آنا بتعمل إيه؟', options: ['Working on something important', 'Watching TV', 'Sleeping', 'Shopping'], correctIndex: 0, explanationAr: 'آنا قالت I am working on something important يعني شغالة على حاجة مهمة.' }
    ],
    speakingLines: [{ en: 'Are you busy right now?', arEg: 'انت مشغول دلوقتي؟' }, { en: 'I am working on something important.', arEg: 'باشتغل على حاجة مهمة.' }],
  },
  {
    id: 'listening-voa-podcast',
    movieTitle: 'VOA Learning English Podcast: Science & World News',
    releaseYear: 2024,
    director: 'VOA Learning English',
    genre: 'Educational Podcast',
    cefrLevel: 'B2',
    sceneTitle: 'Slow English News',
    sceneDescription: 'بودكاست VOA: أخبار علمية وعالمية بإنجليزي مبسّط وبطيء مع مفردات مفسرة - تدريب استماع يومي مثالي.',
    youtubeId: '2mZqR9qlneY',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'VOA Learning English (Official)',
    dialogueQuote: 'Researchers say the study could change how we learn.',
    actorName: 'VOA Presenters',
    characterName: 'Newsreader',
    thumbnailUrl: 'https://img.youtube.com/vi/2mZqR9qlneY/hqdefault.jpg',
    category: 'documentaries',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'VOA Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Researchers say the study could change how we learn.', arEg: 'الباحثين بيقولوا إن الدراسة ممكن تغير طريقة تعلمنا.', arFusha: 'الباحثين بيقولوا إن الدراسة ممكن تغير طريقة تعلمنا.', speaker: 'Newsreader', keyWords: [{ word: 'researchers', ipa: '', meaningAr: 'باحثين', meaningEn: '' }, { word: 'study', ipa: '', meaningAr: 'دراسة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'The results surprised many scientists.', arEg: 'النتائج فاجأت علماء كتير.', arFusha: 'النتائج فاجأت علماء كتير.', speaker: 'Newsreader', keyWords: [{ word: 'results', ipa: '', meaningAr: 'نتائج', meaningEn: '' }, { word: 'surprised', ipa: '', meaningAr: 'فاجأت', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'researcher', type: 'cultural', meaningAr: 'باحث', meaningEn: '', egyptianEquivalent: 'باحث', exampleInScene: 'Researchers found a new method.' },      { term: 'study', type: 'cultural', meaningAr: 'دراسة', meaningEn: '', egyptianEquivalent: 'دراسة', exampleInScene: 'The study shows good results.' },      { term: 'surprising', type: 'cultural', meaningAr: 'مفاجئ', meaningEn: '', egyptianEquivalent: 'مفاجئ', exampleInScene: 'The news was surprising.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What did the study\'s results do to scientists?', questionAr: 'نتايج الدراسة عملت إيه للعلماء؟', options: ['Surprised them', 'Bored them', 'Made them rich', 'Nothing'], correctIndex: 0, explanationAr: 'قال المذيع The results surprised many scientists يعني فاجأت علماء كتير.' }
    ],
    speakingLines: [{ en: 'Researchers say the study could change how we learn.', arEg: 'الباحثين بيقولوا إن الدراسة ممكن تغير طريقة تعلمنا.' }, { en: 'The results surprised many scientists.', arEg: 'النتائج فاجأت علماء كتير.' }],
  },
  {
    id: 'pron-vanessa-all-sounds',
    movieTitle: 'How to Pronounce ALL English Sounds - American English',
    releaseYear: 2020,
    director: 'Speak English With Vanessa',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Every Sound in American English',
    sceneDescription: 'فانيسا بتوضح كل أصوات الإنجليزي الأمريكي صوت صوت مع أمثلة - مرجع شامل للنطق الصحيح.',
    youtubeId: 'tpN9CPwZ-oE',
    startTime: 40,
    endTime: 160,
    clipDuration: '2:00',
    videoSource: 'Speak English With Vanessa (Official)',
    dialogueQuote: 'Let\'s practice every sound slowly and clearly.',
    actorName: 'Vanessa',
    characterName: 'Vanessa',
    thumbnailUrl: 'https://img.youtube.com/vi/tpN9CPwZ-oE/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak English With Vanessa Official',
    subtitles: [
      { id: 'sub-1', start: 45, end: 60, en: 'Let\'s practice every sound slowly and clearly.', arEg: 'هنتدرب على كل صوت ببطء وبوضوح.', arFusha: 'هنتدرب على كل صوت ببطء وبوضوح.', speaker: 'Vanessa', keyWords: [{ word: 'practice', ipa: '', meaningAr: 'يتدرب', meaningEn: '' }, { word: 'sound', ipa: '', meaningAr: 'صوت', meaningEn: '' }] },      { id: 'sub-2', start: 70, end: 85, en: 'Repeat after me: ship and sheep.', arEg: 'كرر ورايا: ship و sheep.', arFusha: 'كرر ورايا: ship و sheep.', speaker: 'Vanessa', keyWords: [{ word: 'repeat', ipa: '', meaningAr: 'يكرر', meaningEn: '' }, { word: 'after me', ipa: '', meaningAr: 'ورايا', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'practice', type: 'cultural', meaningAr: 'يتدرب', meaningEn: '', egyptianEquivalent: 'يتمرن', exampleInScene: 'Practice every day.' },      { term: 'repeat after me', type: 'cultural', meaningAr: 'كرر ورايا', meaningEn: '', egyptianEquivalent: 'قلدني', exampleInScene: 'Repeat after me: hello.' },      { term: 'clearly', type: 'cultural', meaningAr: 'بوضوح', meaningEn: '', egyptianEquivalent: 'بوضوح', exampleInScene: 'Speak clearly, please.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does Vanessa ask you to do?', questionAr: 'فانيسا طالبة منك تعمل إيه؟', options: ['Repeat after her', 'Write an essay', 'Close the video', 'Read a book'], correctIndex: 0, explanationAr: 'قالت Repeat after me يعني كرر ورايا عشان تتدرب على النطق.' }
    ],
    speakingLines: [{ en: 'Let\'s practice every sound slowly and clearly.', arEg: 'هنتدرب على كل صوت ببطء وبوضوح.' }, { en: 'Repeat after me: ship and sheep.', arEg: 'كرر ورايا: ship و sheep.' }],
  },
  {
    id: 'pron-american-flap-t',
    movieTitle: 'Native English Pronunciation: The T Americans Swallow',
    releaseYear: 2021,
    director: 'Dillon\'s English',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'The Disappearing T',
    sceneDescription: 'ليه الأمريكان بياكلوا حرف الـ T في كلمات زي water و better - درس قصير يفرق معاك جداً في الفهم والنطق.',
    youtubeId: '8bm-YzF5yVE',
    startTime: 15,
    endTime: 135,
    clipDuration: '2:00',
    videoSource: 'Dillon\'s English (Official)',
    dialogueQuote: 'Americans often say wadder instead of water.',
    actorName: 'Dillon',
    characterName: 'Dillon',
    thumbnailUrl: 'https://img.youtube.com/vi/8bm-YzF5yVE/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Dillon\'s English Official',
    subtitles: [
      { id: 'sub-1', start: 20, end: 35, en: 'Americans often say wadder instead of water.', arEg: 'الأمريكان غالباً بيقولوا wadder بدل water.', arFusha: 'الأمريكان غالباً بيقولوا wadder بدل water.', speaker: 'Dillon', keyWords: [{ word: 'often', ipa: '', meaningAr: 'غالباً', meaningEn: '' }, { word: 'instead of', ipa: '', meaningAr: 'بدل', meaningEn: '' }] },      { id: 'sub-2', start: 45, end: 60, en: 'The T becomes a soft D sound.', arEg: 'حرف الـ T بيتحول لصوت D خفيف.', arFusha: 'حرف الـ T بيتحول لصوت D خفيف.', speaker: 'Dillon', keyWords: [{ word: 'becomes', ipa: '', meaningAr: 'بيتحول لـ', meaningEn: '' }, { word: 'soft', ipa: '', meaningAr: 'خفيف / ناعم', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'instead of', type: 'cultural', meaningAr: 'بدل من', meaningEn: '', egyptianEquivalent: 'بدل', exampleInScene: 'Use milk instead of cream.' },      { term: 'soft', type: 'cultural', meaningAr: 'ناعم / خفيف', meaningEn: '', egyptianEquivalent: 'خفيف', exampleInScene: 'A soft sound.' },      { term: 'swallow', type: 'cultural', meaningAr: 'يبلع', meaningEn: '', egyptianEquivalent: 'ياكل (الحرف)', exampleInScene: 'Americans swallow the T.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do Americans often pronounce \'water\'?', questionAr: 'الأمريكان بيلفظوا water إزاي غالباً؟', options: ['Wadder', 'Wah-tah', 'Vater', 'Waterrr'], correctIndex: 0, explanationAr: 'الـ T في نص الكلمة بتتحول لصوت D خفيف: wadder.' }
    ],
    speakingLines: [{ en: 'Americans often say wadder instead of water.', arEg: 'الأمريكان غالباً بيقولوا wadder بدل water.' }, { en: 'The T becomes a soft D sound.', arEg: 'حرف الـ T بيتحول لصوت D خفيف.' }],
  },
  {
    id: 'story-empty-park',
    movieTitle: 'The Empty Park - Easy English Story (A1-A2)',
    releaseYear: 2023,
    director: 'ListenUpEnglish',
    genre: 'Educational / Story',
    cefrLevel: 'A1',
    sceneTitle: 'A Walk in the Park',
    sceneDescription: 'قصة قصيرة جداً عن الحديقة الفاضية بجمل المستوى الأول - بداية مثالية للتدريب على الاستماع.',
    youtubeId: 'cYOMDUV6aTg',
    startTime: 15,
    endTime: 135,
    clipDuration: '2:00',
    videoSource: 'ListenUpEnglish (Official)',
    dialogueQuote: 'The park is empty today. Where is everyone?',
    actorName: 'ListenUpEnglish',
    characterName: 'Narrator',
    thumbnailUrl: 'https://img.youtube.com/vi/cYOMDUV6aTg/hqdefault.jpg',
    category: 'documentaries',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'ListenUpEnglish Official',
    subtitles: [
      { id: 'sub-1', start: 20, end: 35, en: 'The park is empty today.', arEg: 'الحديقة فاضية النهارده.', arFusha: 'الحديقة فاضية النهارده.', speaker: 'Narrator', keyWords: [{ word: 'park', ipa: '', meaningAr: 'حديقة', meaningEn: '' }, { word: 'empty', ipa: '', meaningAr: 'فاضي', meaningEn: '' }] },      { id: 'sub-2', start: 45, end: 60, en: 'Where is everyone?', arEg: 'فين الناس كلها؟', arFusha: 'فين الناس كلها؟', speaker: 'Narrator', keyWords: [{ word: 'everyone', ipa: '', meaningAr: 'الكل / الناس كلها', meaningEn: '' }, { word: 'where', ipa: '', meaningAr: 'فين', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'park', type: 'cultural', meaningAr: 'حديقة', meaningEn: '', egyptianEquivalent: 'جينينة', exampleInScene: 'Let\'s go to the park.' },      { term: 'empty', type: 'cultural', meaningAr: 'فاضي', meaningEn: '', egyptianEquivalent: 'فاضي', exampleInScene: 'The room is empty.' },      { term: 'everyone', type: 'cultural', meaningAr: 'الكل', meaningEn: '', egyptianEquivalent: 'الناس كلها', exampleInScene: 'Everyone is here.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How is the park today?', questionAr: 'الحديقة عاملة إزاي النهارده؟', options: ['Empty', 'Crowded', 'Closed', 'Big'], correctIndex: 0, explanationAr: 'الراوي قال The park is empty today يعني الحديقة فاضية النهارده.' }
    ],
    speakingLines: [{ en: 'The park is empty today.', arEg: 'الحديقة فاضية النهارده.' }, { en: 'Where is everyone?', arEg: 'فين الناس كلها؟' }],
  },
];

// Helper to get all videos
export function getStoredVideos(): EducationalVideoItem[] {
  if (typeof window === 'undefined') return VERIFIED_SEEDS;
  try {
    const raw = localStorage.getItem(STORAGE_CATALOG_KEY);
    if (raw) {
      const parsed: EducationalVideoItem[] = JSON.parse(raw);
      // Merge verified seeds with user added videos
      const mergedMap = new Map<string, EducationalVideoItem>();
      VERIFIED_SEEDS.forEach(v => mergedMap.set(v.youtubeId, v));
      parsed.forEach(v => mergedMap.set(v.youtubeId, v));
      return Array.from(mergedMap.values());
    }
  } catch {
    // fallback
  }
  return VERIFIED_SEEDS;
}

export function saveStoredVideos(videos: EducationalVideoItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(videos));
  } catch {
    // quiet fallback
  }
}

/**
 * Search and Filter across the dynamic video catalog
 */
export function queryVideoCatalog(options: VideoFilterOptions = {}): {
  videos: EducationalVideoItem[];
  totalMatches: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const {
    query = '',
    category = 'all',
    cefr = 'all',
    accent = 'all',
    status = 'all',
    page = 1,
    pageSize = 12,
  } = options;

  const allVideos = getStoredVideos();
  const cleanQ = query.trim().toLowerCase();

  let filtered = allVideos.filter(item => {
    // 1. Text Query
    if (cleanQ) {
      const matchTitle = item.movieTitle.toLowerCase().includes(cleanQ) || item.sceneTitle.toLowerCase().includes(cleanQ);
      const matchActor = item.actorName.toLowerCase().includes(cleanQ) || item.characterName.toLowerCase().includes(cleanQ);
      const matchQuote = item.dialogueQuote.toLowerCase().includes(cleanQ);
      const matchGenre = item.genre.toLowerCase().includes(cleanQ);
      const matchSubtitles = item.subtitles.some(
        s => s.en.toLowerCase().includes(cleanQ) || s.arEg.toLowerCase().includes(cleanQ)
      );
      const matchVocab = item.vocabulary.some(
        v => v.term.toLowerCase().includes(cleanQ) || v.meaningAr.toLowerCase().includes(cleanQ)
      );

      if (!matchTitle && !matchActor && !matchQuote && !matchGenre && !matchSubtitles && !matchVocab) {
        return false;
      }
    }

    // 2. Category
    if (category !== 'all' && item.category !== category) {
      return false;
    }

    // 3. CEFR
    if (cefr !== 'all' && item.cefrLevel !== cefr) {
      return false;
    }

    // 4. Accent
    if (accent !== 'all' && item.accent !== accent) {
      return false;
    }

    // 5. Verification Status
    if (status === 'verified_only' && item.verificationStatus !== 'verified_playable') {
      return false;
    }

    return true;
  });

  const totalMatches = filtered.length;
  const totalPages = Math.ceil(totalMatches / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const offset = (currentPage - 1) * pageSize;
  const pagedVideos = filtered.slice(offset, offset + pageSize);

  return {
    videos: pagedVideos,
    totalMatches,
    page: currentPage,
    pageSize,
    totalPages,
  };
}

/**
 * Smart Educational Video Importer
 */
export async function importEducationalVideo(params: {
  youtubeUrlOrId: string;
  category: VideoCategoryType;
  cefrLevel: CEFRLevel;
  accent?: 'American' | 'British' | 'International';
  customTitle?: string;
  sceneDescription?: string;
  subtitles?: TimedSubtitle[];
}): Promise<{ ok: boolean; video?: EducationalVideoItem; error?: string }> {
  const ytid = extractYouTubeId(params.youtubeUrlOrId);
  if (!ytid) {
    return { ok: false, error: 'رابط يوتيوب غير صالح أو غير معتمد (Invalid YouTube URL)' };
  }

  // 1. Verify availability
  const check = await verifyYouTubeVideo(ytid, true);
  if (check.status === 'private_or_deleted') {
    return { ok: false, error: 'الفيديو محذوف أو خاص على يوتيوب ولا يمكن استيراده' };
  }
  if (check.status === 'embed_disabled') {
    return { ok: false, error: 'صاحب الفيديو عطل التضمين الخارجي (Embedding Disabled by Owner)' };
  }

  const existingVideos = getStoredVideos();
  const existing = existingVideos.find(v => v.youtubeId === ytid);
  if (existing) {
    return { ok: true, video: existing };
  }

  const title = params.customTitle?.trim() || check.title || `Video Clip ${ytid}`;
  const subs = params.subtitles || [];
  const isVideoOnly = subs.length === 0;

  // Extract vocabulary from actual subtitles if provided
  const vocab: SceneVocabulary[] = [];
  if (subs.length > 0) {
    subs.forEach(s => {
      s.keyWords.forEach(kw => {
        vocab.push({
          term: kw.word,
          type: 'collocation',
          meaningAr: kw.meaningAr,
          meaningEn: kw.meaningEn,
          egyptianEquivalent: kw.meaningAr,
          exampleInScene: s.en,
        });
      });
    });
  }

  // Generate quizzes from actual subtitles if provided
  const quizzes: SceneQuiz[] = [];
  if (subs.length > 0) {
    quizzes.push({
      id: `quiz-${ytid}-1`,
      type: 'comprehension',
      questionEn: `What is the main idea of this clip?`,
      questionAr: `ما الفكرة والرسالة الأساسية في هذا المقطع التعليمي؟`,
      options: [
        `Expressing real spoken conversation`,
        `Discussing formal topics`,
        `Asking for assistance`,
        `Sharing general experiences`,
      ],
      correctIndex: 0,
      explanationAr: `المقطع يوضح استخدام اللغة الحية في السياق الواقعي.`,
    });
  }

  const newVideo: EducationalVideoItem = {
    id: `edu-${Date.now()}-${ytid}`,
    movieTitle: title,
    releaseYear: new Date().getFullYear(),
    director: check.channelName || 'YouTube Content Creator',
    genre: 'Educational / Real Life',
    cefrLevel: params.cefrLevel,
    sceneTitle: title,
    sceneDescription: params.sceneDescription || `Educational language video from ${check.channelName || 'YouTube'}.`,
    youtubeId: ytid,
    startTime: 0,
    endTime: 90,
    clipDuration: '1:30',
    videoSource: check.channelName || 'YouTube Certified Source',
    dialogueQuote: subs.length > 0 ? subs[0].en : title,
    actorName: check.channelName || 'Speaker',
    characterName: 'Speaker',
    thumbnailUrl: check.thumbnailUrl || `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`,
    category: params.category,
    accent: params.accent || 'American',
    verificationStatus: isVideoOnly ? 'video_only' : 'verified_playable',
    lastVerifiedAt: new Date().toISOString(),
    isEmbeddable: check.isEmbeddable,
    contentSource: 'User / Educator Imported',
    subtitles: subs,
    vocabulary: vocab,
    quizzes: quizzes,
    speakingLines: subs.map(s => ({ en: s.en, arEg: s.arEg })),
  };

  existingVideos.unshift(newVideo);
  saveStoredVideos(existingVideos);

  // Sync to Supabase if connected
  syncVideoToSupabase(newVideo);

  return { ok: true, video: newVideo };
}

async function syncVideoToSupabase(v: EducationalVideoItem) {
  if (!supabase) return;
  try {
    await supabase.from('educational_videos').upsert(
      {
        youtube_id: v.youtubeId,
        canonical_url: `https://www.youtube.com/watch?v=${v.youtubeId}`,
        title: v.sceneTitle,
        channel_name: v.director,
        thumbnail_url: v.thumbnailUrl,
        category_id: v.category,
        cefr_level: v.cefrLevel,
        accent: v.accent,
        dialogue_quote: v.dialogueQuote,
        verification_status: v.verificationStatus,
        is_embeddable: v.isEmbeddable,
        has_subtitles: v.subtitles.length > 0,
        has_vocabulary: v.vocabulary.length > 0,
        has_quizzes: v.quizzes.length > 0,
      },
      { onConflict: 'youtube_id' }
    );
  } catch {
    // quiet fallback
  }
}

/**
 * User Video Features: Search History, Recently Watched, Bookmarks
 */
export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(query: string): string[] {
  if (!query.trim()) return getSearchHistory();
  let list = getSearchHistory();
  list = [query.trim(), ...list.filter(q => q.toLowerCase() !== query.trim().toLowerCase())].slice(0, 10);
  try {
    localStorage.setItem(STORAGE_SEARCH_HISTORY_KEY, JSON.stringify(list));
  } catch {
    // quiet fallback
  }
  return list;
}

export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_SEARCH_HISTORY_KEY);
}

export function getRecentlyWatched(): EducationalVideoItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_RECENTLY_WATCHED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentlyWatched(video: EducationalVideoItem): void {
  let list = getRecentlyWatched();
  list = [video, ...list.filter(v => v.youtubeId !== video.youtubeId)].slice(0, 12);
  try {
    localStorage.setItem(STORAGE_RECENTLY_WATCHED_KEY, JSON.stringify(list));
  } catch {
    // quiet fallback
  }
}

export function getSavedVideos(): EducationalVideoItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_VIDEOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleSaveVideo(video: EducationalVideoItem): { isSaved: boolean; list: EducationalVideoItem[] } {
  let list = getSavedVideos();
  const exists = list.some(v => v.youtubeId === video.youtubeId);
  if (exists) {
    list = list.filter(v => v.youtubeId !== video.youtubeId);
  } else {
    list.unshift(video);
  }
  try {
    localStorage.setItem(STORAGE_SAVED_VIDEOS_KEY, JSON.stringify(list));
  } catch {
    // quiet fallback
  }
  return { isSaved: !exists, list };
}

export function isVideoSaved(youtubeId: string): boolean {
  return getSavedVideos().some(v => v.youtubeId === youtubeId);
}

/**
 * Admin Video Management Operations
 */
export function adminUpdateVideo(id: string, patch: Partial<EducationalVideoItem>): EducationalVideoItem[] {
  const videos = getStoredVideos();
  const idx = videos.findIndex(v => v.id === id || v.youtubeId === id);
  if (idx >= 0) {
    videos[idx] = { ...videos[idx], ...patch, lastVerifiedAt: new Date().toISOString() };
    saveStoredVideos(videos);
  }
  return [...videos];
}

export function adminMarkUnavailable(id: string, reason: string): EducationalVideoItem[] {
  return adminUpdateVideo(id, {
    verificationStatus: 'unavailable',
    sceneDescription: `(غير متاح مؤقتاً: ${reason})`,
  });
}

export async function adminReplaceVideoId(id: string, newYoutubeId: string): Promise<{ ok: boolean; video?: EducationalVideoItem; error?: string }> {
  const cleanId = extractYouTubeId(newYoutubeId);
  if (!cleanId) return { ok: false, error: 'معرف يوتيوب غير صالح' };

  const check = await verifyYouTubeVideo(cleanId, true);
  if (!check.isEmbeddable) {
    return { ok: false, error: `الفيديو الجديد غير متاح للتضمين: ${check.details}` };
  }

  const videos = adminUpdateVideo(id, {
    youtubeId: cleanId,
    thumbnailUrl: check.thumbnailUrl || `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`,
    verificationStatus: 'verified_playable',
    isEmbeddable: true,
  });

  const updated = videos.find(v => v.id === id || v.youtubeId === cleanId);
  return { ok: true, video: updated };
}

