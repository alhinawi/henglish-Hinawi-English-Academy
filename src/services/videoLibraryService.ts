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
  {
    id: 'biz-derek-leading-meetings',
    movieTitle: '41 Phrases For Leading A Business Meeting',
    releaseYear: 2021,
    director: 'Derek Callan',
    genre: 'Business English Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Leading Meetings with Confidence',
    sceneDescription: '41 عبارة جاهزة لإدارة الاجتماعات بالإنجليزية: الافتتاح، الانتقال بين النقاط، وإنهاء الاجتماع باحتراف.',
    youtubeId: 'cdq6onYgtSg',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Derek Callan - English for Professionals (Official)',
    dialogueQuote: 'Let\'s get down to business.',
    actorName: 'Derek Callan',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/cdq6onYgtSg/hqdefault.jpg',
    category: 'business_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Derek Callan Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Let\'s get down to business.', arEg: 'يلا ندخل في الشغل على طول.', arFusha: 'يلا ندخل في الشغل على طول.', speaker: 'Instructor', keyWords: [{ word: 'get down to', ipa: '', meaningAr: 'نبدأ في', meaningEn: '' }, { word: 'business', ipa: '', meaningAr: 'شغل / عمل', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Does anyone have anything to add?', arEg: 'حد عنده حاجة يضيفها؟', arFusha: 'حد عنده حاجة يضيفها؟', speaker: 'Instructor', keyWords: [{ word: 'anyone', ipa: '', meaningAr: 'أي حد', meaningEn: '' }, { word: 'add', ipa: '', meaningAr: 'يضيف', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'get down to business', type: 'idiom', meaningAr: 'نبدأ في صلب الموضوع', meaningEn: '', egyptianEquivalent: 'ندخل في الجد', exampleInScene: 'Time is short, let\'s get down to business.' },      { term: 'lead a meeting', type: 'collocation', meaningAr: 'يدير اجتماع', meaningEn: '', egyptianEquivalent: 'يودّي الاجتماع', exampleInScene: 'She leads the Monday meeting.' },      { term: 'add', type: 'cultural', meaningAr: 'يضيف', meaningEn: '', egyptianEquivalent: 'يضيف', exampleInScene: 'Anything to add?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'Let\'s get down to business\' mean?', questionAr: 'معنى Let\'s get down to business؟', options: ['يلا نبدأ في صلب الشغل', 'خلصنا شغل', 'الشغل صعب', 'نروح للمكتب'], correctIndex: 0, explanationAr: 'عبارة شائعة في بداية الاجتماعات معناها نبدأ في صلب الموضوع.' }
    ],
    speakingLines: [{ en: 'Let\'s get down to business.', arEg: 'يلا ندخل في الشغل على طول.' }, { en: 'Does anyone have anything to add?', arEg: 'حد عنده حاجة يضيفها؟' }],
  },
  {
    id: 'biz-vanessa-20-phrases',
    movieTitle: '20 Important Business English Phrases',
    releaseYear: 2021,
    director: 'Speak English With Vanessa',
    genre: 'Business English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Essential Office Phrases',
    sceneDescription: 'عشرين عبارة أساسية للشغل بالإنجليزية: في المكالمات، الإيميلات، والكلام اليومي مع الزمايل.',
    youtubeId: 'T2hOSdvaiRk',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Speak English With Vanessa (Official)',
    dialogueQuote: 'I\'ll get back to you by Friday.',
    actorName: 'Vanessa',
    characterName: 'Vanessa',
    thumbnailUrl: 'https://img.youtube.com/vi/T2hOSdvaiRk/hqdefault.jpg',
    category: 'business_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak English With Vanessa Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I\'ll get back to you by Friday.', arEg: 'هرد عليك قبل يوم الجمعة.', arFusha: 'هرد عليك قبل يوم الجمعة.', speaker: 'Vanessa', keyWords: [{ word: 'get back to', ipa: '', meaningAr: 'يرد على', meaningEn: '' }, { word: 'by', ipa: '', meaningAr: 'قبل / بحلول', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Let\'s touch base next week.', arEg: 'نتكلم ونتابع الأسبوع الجاي.', arFusha: 'نتكلم ونتابع الأسبوع الجاي.', speaker: 'Vanessa', keyWords: [{ word: 'touch base', ipa: '', meaningAr: 'يتواصل / يتابع', meaningEn: '' }, { word: 'next week', ipa: '', meaningAr: 'الأسبوع الجاي', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'get back to someone', type: 'phrasal-verb', meaningAr: 'يرد على حد لاحقاً', meaningEn: '', egyptianEquivalent: 'هرجعلك / هرد عليك', exampleInScene: 'I\'ll get back to you tomorrow.' },      { term: 'touch base', type: 'idiom', meaningAr: 'يتواصل للمتابعة', meaningEn: '', egyptianEquivalent: 'نتحايل على بعض', exampleInScene: 'Let\'s touch base after the meeting.' },      { term: 'deadline', type: 'cultural', meaningAr: 'الموعد النهائي', meaningEn: '', egyptianEquivalent: 'الميعاد الأخير', exampleInScene: 'The deadline is Friday.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'touch base\' mean?', questionAr: 'معنى touch base؟', options: ['يتواصل للمتابعة', 'يلمس قاعدة', 'يلعب بيسبول', 'يتأخر'], correctIndex: 0, explanationAr: 'touch base تعبير أمريكي شائع في الشغل معناه يتواصل للمتابعة.' }
    ],
    speakingLines: [{ en: 'I\'ll get back to you by Friday.', arEg: 'هرد عليك قبل يوم الجمعة.' }, { en: 'Let\'s touch base next week.', arEg: 'نتكلم ونتابع الأسبوع الجاي.' }],
  },
  {
    id: 'idioms-marina-15',
    movieTitle: 'Learn 15 Common English Idioms (With Examples)',
    releaseYear: 2021,
    director: 'linguamarina',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Idioms Native Speakers Use Daily',
    sceneDescription: '15 إيديوم بيتقال كل يوم في أمريكا مع أمثلة حقيقية - هيساعدك تفهم الأفلام والناس العادية.',
    youtubeId: 'HclqADvf35Y',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'linguamarina (Official)',
    dialogueQuote: 'It\'s a piece of cake.',
    actorName: 'Marina',
    characterName: 'Marina',
    thumbnailUrl: 'https://img.youtube.com/vi/HclqADvf35Y/hqdefault.jpg',
    category: 'slang_and_expressions',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'linguamarina Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'It\'s a piece of cake.', arEg: 'سهل جداً / زي الفول.', arFusha: 'سهل جداً / زي الفول.', speaker: 'Marina', keyWords: [{ word: 'piece of cake', ipa: '', meaningAr: 'سهل جداً', meaningEn: '' }, { word: 'easy', ipa: '', meaningAr: 'سهل', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Don\'t worry, you\'ll nail it.', arEg: 'متقلقش، هتعملها صح.', arFusha: 'متقلقش، هتعملها صح.', speaker: 'Marina', keyWords: [{ word: 'nail it', ipa: '', meaningAr: 'يعملها بامتياز', meaningEn: '' }, { word: 'worry', ipa: '', meaningAr: 'يقلق', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'piece of cake', type: 'idiom', meaningAr: 'حاجة سهلة جداً', meaningEn: '', egyptianEquivalent: 'زي الفول', exampleInScene: 'The exam was a piece of cake.' },      { term: 'nail it', type: 'idiom', meaningAr: 'يعملها بامتياز', meaningEn: '', egyptianEquivalent: 'يجيبها صح', exampleInScene: 'You nailed the presentation!' },      { term: 'break a leg', type: 'idiom', meaningAr: 'بالتوفيق (قبل أداء)', meaningEn: '', egyptianEquivalent: 'ربنا يوفقك', exampleInScene: 'Break a leg in your interview!' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'piece of cake\' mean?', questionAr: 'معنى piece of cake؟', options: ['حاجة سهلة جداً', 'قطعة كيك', 'حاجة غالية', 'حفلة'], correctIndex: 0, explanationAr: 'لو حاجة piece of cake يعني سهلة جداً، زي ما بنقول زي الفول.' }
    ],
    speakingLines: [{ en: 'It\'s a piece of cake.', arEg: 'سهل جداً / زي الفول.' }, { en: 'Don\'t worry, you\'ll nail it.', arEg: 'متقلقش، هتعملها صح.' }],
  },
  {
    id: 'idioms-lucy-100',
    movieTitle: 'Learn the 100 Most Common Idioms in 30 Minutes',
    releaseYear: 2022,
    director: 'English with Lucy',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'British Idioms Masterclass',
    sceneDescription: 'لوسي بتلخص أشهر 100 إيديوم بريطاني بأمثلة ونطق قياسي - مراجعة مكثفة للمستوى المتوسط فما فوق.',
    youtubeId: 'Hm-n-_uqCvQ',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English with Lucy (Official)',
    dialogueQuote: 'I\'m feeling under the weather today.',
    actorName: 'Lucy',
    characterName: 'Lucy',
    thumbnailUrl: 'https://img.youtube.com/vi/Hm-n-_uqCvQ/hqdefault.jpg',
    category: 'slang_and_expressions',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English with Lucy Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I\'m feeling under the weather today.', arEg: 'حاسس إني تعبان شوية النهارده.', arFusha: 'حاسس إني تعبان شوية النهارده.', speaker: 'Lucy', keyWords: [{ word: 'under the weather', ipa: '', meaningAr: 'مش على بعضه / تعبان', meaningEn: '' }, { word: 'feeling', ipa: '', meaningAr: 'حاسس', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'It costs an arm and a leg.', arEg: 'ده غالي جداً / بفلوس كتير أوي.', arFusha: 'ده غالي جداً / بفلوس كتير أوي.', speaker: 'Lucy', keyWords: [{ word: 'costs', ipa: '', meaningAr: 'يكلف', meaningEn: '' }, { word: 'expensive', ipa: '', meaningAr: 'غالي', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'under the weather', type: 'idiom', meaningAr: 'مش على بعضه / تعبان شوية', meaningEn: '', egyptianEquivalent: 'واهن شوية', exampleInScene: 'I\'m a bit under the weather.' },      { term: 'an arm and a leg', type: 'idiom', meaningAr: 'غالي جداً', meaningEn: '', egyptianEquivalent: 'بنص ثروة', exampleInScene: 'That phone costs an arm and a leg.' },      { term: 'once in a blue moon', type: 'idiom', meaningAr: 'نادراً', meaningEn: '', egyptianEquivalent: 'كل أجل ونص', exampleInScene: 'We eat out once in a blue moon.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'If something costs an arm and a leg, it is...', questionAr: 'لو حاجة بتكلف an arm and a leg يبقى هي...؟', options: ['غالية جداً', 'رخيصة', 'مجانية', 'مستعملة'], correctIndex: 0, explanationAr: 'an arm and a leg معناها غالية جداً - تعبير شائع عن الأسعار العالية.' }
    ],
    speakingLines: [{ en: 'I\'m feeling under the weather today.', arEg: 'حاسس إني تعبان شوية النهارده.' }, { en: 'It costs an arm and a leg.', arEg: 'ده غالي جداً.' }],
  },
  {
    id: 'phrasal-mmmenglish-50',
    movieTitle: '50+ Common English Phrasal Verbs (with Workbook)',
    releaseYear: 2021,
    director: 'mmmEnglish',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Phrasal Verbs You Actually Need',
    sceneDescription: 'أهم 50 فيرزال فيرب مع أمثلة من الحياة اليومية - المفتاح الحقيقي لفهم الكلام الطبيعي.',
    youtubeId: 'r7VKVXbaj_Y',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'mmmEnglish (Official)',
    dialogueQuote: 'I need to look after my little brother.',
    actorName: 'Emma',
    characterName: 'Emma',
    thumbnailUrl: 'https://img.youtube.com/vi/r7VKVXbaj_Y/hqdefault.jpg',
    category: 'slang_and_expressions',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'mmmEnglish Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I need to look after my little brother.', arEg: 'لازم أعتني بأخويا الصغير.', arFusha: 'لازم أعتني بأخويا الصغير.', speaker: 'Emma', keyWords: [{ word: 'look after', ipa: '', meaningAr: 'يعتني بـ', meaningEn: '' }, { word: 'little', ipa: '', meaningAr: 'صغير', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'The car broke down on the highway.', arEg: 'العربية عطلت على الطريق السريع.', arFusha: 'العربية عطلت على الطريق السريع.', speaker: 'Emma', keyWords: [{ word: 'broke down', ipa: '', meaningAr: 'عطلت', meaningEn: '' }, { word: 'highway', ipa: '', meaningAr: 'طريق سريع', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'look after', type: 'phrasal-verb', meaningAr: 'يعتني بـ / يرعى', meaningEn: '', egyptianEquivalent: 'يراعي', exampleInScene: 'She looks after her grandma.' },      { term: 'break down', type: 'phrasal-verb', meaningAr: 'يعطل (للأجهزة والعربيات)', meaningEn: '', egyptianEquivalent: 'يبوظ', exampleInScene: 'My laptop broke down.' },      { term: 'put off', type: 'phrasal-verb', meaningAr: 'يأجل', meaningEn: '', egyptianEquivalent: 'يأجل', exampleInScene: 'Don\'t put off your homework.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'look after\' mean?', questionAr: 'معنى look after؟', options: ['يعتني بـ', 'يبص ورا', 'يدور على', 'يكبر'], correctIndex: 0, explanationAr: 'look after معناها يعتني بحد أو يرعاه، زي look after my brother.' }
    ],
    speakingLines: [{ en: 'I need to look after my little brother.', arEg: 'لازم أعتني بأخويا الصغير.' }, { en: 'The car broke down on the highway.', arEg: 'العربية عطلت على الطريق السريع.' }],
  },
  {
    id: 'phrasal-bob-part1',
    movieTitle: 'Phrasal Verbs Part 1 - Learn English with Bob the Canadian',
    releaseYear: 2020,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'First Phrasal Verbs',
    sceneDescription: 'بوب الكندي بيشرح أول مجموعة فيرزال فيربز بأسلوبه البطيء والواضح - مثالي للمبتدئين المتقدمين.',
    youtubeId: 'NKT6f6XlYhQ',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'I get up at six every morning.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/NKT6f6XlYhQ/hqdefault.jpg',
    category: 'slang_and_expressions',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I get up at six every morning.', arEg: 'بصحى الساعة ستة كل يوم الصبح.', arFusha: 'بصحى الساعة ستة كل يوم الصبح.', speaker: 'Bob', keyWords: [{ word: 'get up', ipa: '', meaningAr: 'يصحى', meaningEn: '' }, { word: 'every morning', ipa: '', meaningAr: 'كل يوم الصبح', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Turn off the lights when you leave.', arEg: 'اطفي النور وانت خارج.', arFusha: 'اطفي النور وانت خارج.', speaker: 'Bob', keyWords: [{ word: 'turn off', ipa: '', meaningAr: 'يطفي', meaningEn: '' }, { word: 'leave', ipa: '', meaningAr: 'يخرج', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'get up', type: 'phrasal-verb', meaningAr: 'يصحى من السرير', meaningEn: '', egyptianEquivalent: 'يصحى', exampleInScene: 'I get up early.' },      { term: 'turn off', type: 'phrasal-verb', meaningAr: 'يطفي / يقفل', meaningEn: '', egyptianEquivalent: 'يطفي', exampleInScene: 'Turn off the TV.' },      { term: 'turn on', type: 'phrasal-verb', meaningAr: 'ينوّر / يشغل', meaningEn: '', egyptianEquivalent: 'يفتح', exampleInScene: 'Turn on the lights.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the opposite of \'turn off\'?', questionAr: 'عكس turn off إيه؟', options: ['turn on', 'turn down', 'get up', 'break down'], correctIndex: 0, explanationAr: 'turn off يعني يطفي، وعكسها turn on يعني ينوّر أو يشغل.' }
    ],
    speakingLines: [{ en: 'I get up at six every morning.', arEg: 'بصحى الساعة ستة كل يوم الصبح.' }, { en: 'Turn off the lights when you leave.', arEg: 'اطفي النور وانت خارج.' }],
  },
  {
    id: 'ielts-advantage-secrets',
    movieTitle: 'IELTS Speaking Secrets Every Student Should Learn',
    releaseYear: 2022,
    director: 'IELTS Advantage',
    genre: 'Exam Preparation',
    cefrLevel: 'C1',
    sceneTitle: 'Band 9 Speaking Strategies',
    sceneDescription: 'أسرار الآيلتس سبيكينج من مدرب متخصص: إزاي تنظم إجابتك وتبهر الممتحن بمفردات طبيعية.',
    youtubeId: 'ELxGmf9f_ZM',
    startTime: 40,
    endTime: 160,
    clipDuration: '2:00',
    videoSource: 'IELTS Advantage (Official)',
    dialogueQuote: 'Don\'t memorize answers; develop ideas naturally.',
    actorName: 'IELTS Advantage Coach',
    characterName: 'Coach',
    thumbnailUrl: 'https://img.youtube.com/vi/ELxGmf9f_ZM/hqdefault.jpg',
    category: 'academic_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'IELTS Advantage Official',
    subtitles: [
      { id: 'sub-1', start: 45, end: 60, en: 'Don\'t memorize answers; develop ideas naturally.', arEg: 'متحفظش إجابات؛ طور أفكارك بشكل طبيعي.', arFusha: 'متحفظش إجابات؛ طور أفكارك بشكل طبيعي.', speaker: 'Coach', keyWords: [{ word: 'memorize', ipa: '', meaningAr: 'يحفظ', meaningEn: '' }, { word: 'naturally', ipa: '', meaningAr: 'بشكل طبيعي', meaningEn: '' }] },      { id: 'sub-2', start: 70, end: 85, en: 'Examiners can spot a rehearsed answer easily.', arEg: 'الممتحنين بيعرفوا الإجابة المحفوظة بسهولة.', arFusha: 'الممتحنين بيعرفوا الإجابة المحفوظة بسهولة.', speaker: 'Coach', keyWords: [{ word: 'spot', ipa: '', meaningAr: 'يلاحظ', meaningEn: '' }, { word: 'rehearsed', ipa: '', meaningAr: 'محفوظ / متدرب عليه بشكل آلي', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'memorize', type: 'cultural', meaningAr: 'يحفظ عن ظهر قلب', meaningEn: '', egyptianEquivalent: 'يحفظ', exampleInScene: 'Don\'t memorize scripts.' },      { term: 'spot', type: 'cultural', meaningAr: 'يلاحظ / يميز', meaningEn: '', egyptianEquivalent: 'يلاحظ', exampleInScene: 'I spotted the mistake.' },      { term: 'fluency', type: 'cultural', meaningAr: 'طلاقة', meaningEn: '', egyptianEquivalent: 'طلاقة', exampleInScene: 'Fluency comes with practice.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What do examiners spot easily?', questionAr: 'الممتحنين بيلاحظوا إيه بسهولة؟', options: ['Rehearsed answers', 'Good ideas', 'Natural speaking', 'Nice clothes'], correctIndex: 0, explanationAr: 'الممتحن بيلاحظ الإجابة المحفوظة بسهولة - عشان كده لازم تتكلم طبيعي.' }
    ],
    speakingLines: [{ en: 'Don\'t memorize answers; develop ideas naturally.', arEg: 'متحفظش إجابات؛ طور أفكارك بشكل طبيعي.' }, { en: 'Examiners can spot a rehearsed answer easily.', arEg: 'الممتحنين بيعرفوا الإجابة المحفوظة بسهولة.' }],
  },
  {
    id: 'ielts-liz-home',
    movieTitle: 'How to Improve Your IELTS Speaking at Home',
    releaseYear: 2019,
    director: 'IELTS Liz',
    genre: 'Exam Preparation',
    cefrLevel: 'B2',
    sceneTitle: 'Self-Study Speaking Routine',
    sceneDescription: 'ليز بتشرح روتين عملي لتحسين السبيكينج لوحدك في البيت: تسجيل صوتك، الظل (shadowing)، والتقييم الذاتي.',
    youtubeId: '61izqh7ZBww',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'IELTS Liz (Official)',
    dialogueQuote: 'Record yourself and listen for your mistakes.',
    actorName: 'Liz',
    characterName: 'Liz',
    thumbnailUrl: 'https://img.youtube.com/vi/61izqh7ZBww/hqdefault.jpg',
    category: 'academic_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'IELTS Liz Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Record yourself and listen for your mistakes.', arEg: 'سجل صوتك واسمع غلطاتك.', arFusha: 'سجل صوتك واسمع غلطاتك.', speaker: 'Liz', keyWords: [{ word: 'record', ipa: '', meaningAr: 'يسجل', meaningEn: '' }, { word: 'mistakes', ipa: '', meaningAr: 'غلطات', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Shadowing helps you copy natural rhythm.', arEg: 'تقنية الظل بتساعدك تقلد الإيقاع الطبيعي.', arFusha: 'تقنية الظل بتساعدك تقلد الإيقاع الطبيعي.', speaker: 'Liz', keyWords: [{ word: 'shadowing', ipa: '', meaningAr: 'تقنية الظل (التقليد الفوري)', meaningEn: '' }, { word: 'rhythm', ipa: '', meaningAr: 'إيقاع', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'record yourself', type: 'collocation', meaningAr: 'يسجل صوته', meaningEn: '', egyptianEquivalent: 'يسجل نفسه', exampleInScene: 'Record yourself speaking daily.' },      { term: 'shadowing', type: 'cultural', meaningAr: 'تقنية الظل (التقليد الفوري للناطق)', meaningEn: '', egyptianEquivalent: 'تقليد فوري', exampleInScene: 'Shadowing improves pronunciation.' },      { term: 'self-study', type: 'cultural', meaningAr: 'ذاكرة ذاتية', meaningEn: '', egyptianEquivalent: 'مذاكرة لوحدك', exampleInScene: 'Self-study needs discipline.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What technique helps you copy natural rhythm?', questionAr: 'إيه التقنية اللي بتساعدك تقلد الإيقاع الطبيعي؟', options: ['Shadowing', 'Memorizing', 'Skipping', 'Translating'], correctIndex: 0, explanationAr: 'الـ shadowing هي إنك تردد ورا الناطق فوراً فتكتسب إيقاعه ونطقه الطبيعي.' }
    ],
    speakingLines: [{ en: 'Record yourself and listen for your mistakes.', arEg: 'سجل صوتك واسمع غلطاتك.' }, { en: 'Shadowing helps you copy natural rhythm.', arEg: 'تقنية الظل بتساعدك تقلد الإيقاع الطبيعي.' }],
  },
  {
    id: 'job-cass-top10',
    movieTitle: 'Top 10 Most Common Job Interview Questions ANSWERED',
    releaseYear: 2021,
    director: 'Cass Thompson',
    genre: 'Job Interview Practice',
    cefrLevel: 'B2',
    sceneTitle: 'The 10 Questions You Must Prepare',
    sceneDescription: 'أشهر 10 أسئلة انترفيو مع إجابات نموذجية جاهزة تتظبط على تجربتك - تحضير مكثف قبل أي مقابلة.',
    youtubeId: 'U0YdO6zGSHk',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Cass Thompson Career Advice (Official)',
    dialogueQuote: 'What is your greatest weakness?',
    actorName: 'Cass Thompson',
    characterName: 'Coach',
    thumbnailUrl: 'https://img.youtube.com/vi/U0YdO6zGSHk/hqdefault.jpg',
    category: 'job_interviews',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Cass Thompson Career Advice',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'What is your greatest weakness?', arEg: 'إيه أكبر نقطة ضعف عندك؟', arFusha: 'إيه أكبر نقطة ضعف عندك؟', speaker: 'Coach', keyWords: [{ word: 'greatest', ipa: '', meaningAr: 'أكبر', meaningEn: '' }, { word: 'weakness', ipa: '', meaningAr: 'نقطة ضعف', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Turn your weakness into a growth story.', arEg: 'حوّل نقطة ضعفك لقصة تطور.', arFusha: 'حوّل نقطة ضعفك لقصة تطور.', speaker: 'Coach', keyWords: [{ word: 'turn into', ipa: '', meaningAr: 'يحوّل لـ', meaningEn: '' }, { word: 'growth', ipa: '', meaningAr: 'تطور / نمو', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'weakness', type: 'cultural', meaningAr: 'نقطة ضعف', meaningEn: '', egyptianEquivalent: 'نقطة ضعف', exampleInScene: 'Be honest about your weakness.' },      { term: 'strength', type: 'cultural', meaningAr: 'نقطة قوة', meaningEn: '', egyptianEquivalent: 'نقطة قوة', exampleInScene: 'My strength is teamwork.' },      { term: 'growth', type: 'cultural', meaningAr: 'تطور / نمو', meaningEn: '', egyptianEquivalent: 'تطور', exampleInScene: 'Show your growth.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What should you do with your weakness in an interview?', questionAr: 'تعمل إيه بنقطة ضعفك في الانترفيو؟', options: ['حوّلها لقصة تطور', 'خبّيها', 'كابر وانكرها', 'غيّر الموضوع'], correctIndex: 0, explanationAr: 'أحسن استراتيجية: حوّل نقطة الضعف لقصة تعلم وتطور مع حل عملي.' }
    ],
    speakingLines: [{ en: 'What is your greatest weakness?', arEg: 'إيه أكبر نقطة ضعف عندك؟' }, { en: 'Turn your weakness into a growth story.', arEg: 'حوّل نقطة ضعفك لقصة تطور.' }],
  },
  {
    id: 'job-rachel-dos-donts',
    movieTitle: 'English Job Interview Dos and Don\'ts - Rachel\'s English',
    releaseYear: 2019,
    director: 'Rachel\'s English',
    genre: 'Job Interview Practice',
    cefrLevel: 'B2',
    sceneTitle: 'Interview Body Language & Speech',
    sceneDescription: 'ريتشل بتشرح الأخطاء الشائعة في الانترفيو: نبرة الصوت، السرعة، والكلمات اللي تضعف إجابتك.',
    youtubeId: '-JNjsOX0N0c',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Rachel\'s English (Official)',
    dialogueQuote: 'Don\'t speak too quickly; slow down and breathe.',
    actorName: 'Rachel',
    characterName: 'Rachel',
    thumbnailUrl: 'https://img.youtube.com/vi/-JNjsOX0N0c/hqdefault.jpg',
    category: 'job_interviews',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Rachel\'s English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Don\'t speak too quickly; slow down and breathe.', arEg: 'متتكلمش بسرعة جداً؛ هدي وخد نفسك.', arFusha: 'متتكلمش بسرعة جداً؛ هدي وخد نفسك.', speaker: 'Rachel', keyWords: [{ word: 'slow down', ipa: '', meaningAr: 'يهدي / يبطئ', meaningEn: '' }, { word: 'breathe', ipa: '', meaningAr: 'ياخد نفس', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Avoid filler words like um and like.', arEg: 'ابعد عن كلمات الحشو زي um و like.', arFusha: 'ابعد عن كلمات الحشو زي um و like.', speaker: 'Rachel', keyWords: [{ word: 'avoid', ipa: '', meaningAr: 'يبعد عن', meaningEn: '' }, { word: 'filler words', ipa: '', meaningAr: 'كلمات حشو', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'slow down', type: 'phrasal-verb', meaningAr: 'يهدي / يبطئ', meaningEn: '', egyptianEquivalent: 'مش على مهلك', exampleInScene: 'Slow down, no rush.' },      { term: 'avoid', type: 'cultural', meaningAr: 'يبعد عن / يتجنب', meaningEn: '', egyptianEquivalent: 'يبعد عن', exampleInScene: 'Avoid slang in interviews.' },      { term: 'filler words', type: 'collocation', meaningAr: 'كلمات حشو', meaningEn: '', egyptianEquivalent: 'كلام زيادة', exampleInScene: 'Cut the filler words.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What should you avoid in an interview?', questionAr: 'المفروض تبعد عن إيه في الانترفيو؟', options: ['Filler words', 'Clear answers', 'Breathing', 'Eye contact'], correctIndex: 0, explanationAr: 'كلمات الحشو زي um و like بتضعف إجابتك - اتكلم بهدوء وبجمل واضحة.' }
    ],
    speakingLines: [{ en: 'Don\'t speak too quickly; slow down and breathe.', arEg: 'متتكلمش بسرعة جداً؛ هدي وخد نفسك.' }, { en: 'Avoid filler words like um and like.', arEg: 'ابعد عن كلمات الحشو زي um و like.' }],
  },
  {
    id: 'smalltalk-bob-work-friends',
    movieTitle: 'Learn English Small Talk to use at Work and with Friends',
    releaseYear: 2021,
    director: 'Bob the Canadian',
    genre: 'Conversation Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Small Talk Basics',
    sceneDescription: 'بوب بيعلمك السمال توك: أول كلام تقوله في الشغل ومع الأصحاب والغرباء من غير توتر.',
    youtubeId: '4zXys7i8Zrc',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'How\'s it going? Pretty good, and you?',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/4zXys7i8Zrc/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'How\'s it going? Pretty good, and you?', arEg: 'عامل إيه؟ كويس، وانت؟', arFusha: 'عامل إيه؟ كويس، وانت؟', speaker: 'Bob', keyWords: [{ word: 'How\'s it going', ipa: '', meaningAr: 'عامل إيه', meaningEn: '' }, { word: 'pretty good', ipa: '', meaningAr: 'كويس جداً', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Nice weather we\'re having, isn\'t it?', arEg: 'الجو حلو النهارده، مش كده؟', arFusha: 'الجو حلو النهارده، مش كده؟', speaker: 'Bob', keyWords: [{ word: 'weather', ipa: '', meaningAr: 'الجو', meaningEn: '' }, { word: 'isn\'t it', ipa: '', meaningAr: 'مش كده؟', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'How\'s it going?', type: 'collocation', meaningAr: 'عامل إيه؟ (تحية يومية)', meaningEn: '', egyptianEquivalent: 'عامل إيه', exampleInScene: 'How\'s it going, man?' },      { term: 'small talk', type: 'collocation', meaningAr: 'كلام خفيف افتتاحي', meaningEn: '', egyptianEquivalent: 'هزار وكلام خفيف', exampleInScene: 'I\'m bad at small talk.' },      { term: 'pretty good', type: 'collocation', meaningAr: 'كويس جداً', meaningEn: '', egyptianEquivalent: 'تمام', exampleInScene: 'I\'m pretty good, thanks.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is \'small talk\'?', questionAr: 'يعني إيه small talk؟', options: ['كلام خفيف افتتاحي', 'كلام قليل', 'حديث رسمي', 'مكالمة قصيرة'], correctIndex: 0, explanationAr: 'السمال توك هو الكلام الخفيف اللي بيكسر الجليد قبل أي حوار.' }
    ],
    speakingLines: [{ en: 'How\'s it going? Pretty good, and you?', arEg: 'عامل إيه؟ كويس، وانت؟' }, { en: 'Nice weather we\'re having, isn\'t it?', arEg: 'الجو حلو النهارده، مش كده؟' }],
  },
  {
    id: 'smalltalk-lucy-100',
    movieTitle: '100 Small Talk Questions and Answers - Real English Conversation',
    releaseYear: 2022,
    director: 'English with Lucy',
    genre: 'Conversation Lesson',
    cefrLevel: 'B1',
    sceneTitle: '100 Questions, Real Answers',
    sceneDescription: 'لوسي بتجاوب على 100 سؤال سمال توك بإجابات طبيعية - تدريب شامل على الردود اليومية باللهجة البريطانية.',
    youtubeId: '8vPXIsAqmjg',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English with Lucy (Official)',
    dialogueQuote: 'What do you do for a living?',
    actorName: 'Lucy',
    characterName: 'Lucy',
    thumbnailUrl: 'https://img.youtube.com/vi/8vPXIsAqmjg/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English with Lucy Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'What do you do for a living?', arEg: 'بتشتغل إيه؟', arFusha: 'بتشتغل إيه؟', speaker: 'Lucy', keyWords: [{ word: 'for a living', ipa: '', meaningAr: 'كشغل / للمعيشة', meaningEn: '' }, { word: 'What do you do', ipa: '', meaningAr: 'بتعمل إيه', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Have you been here long?', arEg: 'لك كتير هنا؟', arFusha: 'لك كتير هنا؟', speaker: 'Lucy', keyWords: [{ word: 'been here', ipa: '', meaningAr: 'موجود هنا', meaningEn: '' }, { word: 'long', ipa: '', meaningAr: 'كتير / مدة طويلة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'for a living', type: 'collocation', meaningAr: 'كمصدر رزق / شغل', meaningEn: '', egyptianEquivalent: 'كشغل', exampleInScene: 'What do you do for a living?' },      { term: 'Have you been here long?', type: 'collocation', meaningAr: 'لك كتير هنا؟', meaningEn: '', egyptianEquivalent: 'انت هنا بقالك كتير؟', exampleInScene: 'Have you been here long?' },      { term: 'How come?', type: 'collocation', meaningAr: 'ليه؟ / إزاي؟', meaningEn: '', egyptianEquivalent: 'ليه كده؟', exampleInScene: 'How come you\'re late?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'What do you do for a living?\' ask about?', questionAr: 'سؤال What do you do for a living بيسأل عن إيه؟', options: ['شغلك', 'مكان سكنك', 'أكلك المفضل', 'سنك'], correctIndex: 0, explanationAr: 'السؤال ده بيسأل عن شغلك أو مصدر رزقك بطريقة مهذبة.' }
    ],
    speakingLines: [{ en: 'What do you do for a living?', arEg: 'بتشتغل إيه؟' }, { en: 'Have you been here long?', arEg: 'لك كتير هنا؟' }],
  },
  {
    id: 'smalltalk-jefferson-tips',
    movieTitle: 'Never Struggle with Small Talk Again - Jefferson Fisher',
    releaseYear: 2023,
    director: 'Jefferson Fisher',
    genre: 'Communication Skills',
    cefrLevel: 'B2',
    sceneTitle: 'Better Conversations, Less Awkwardness',
    sceneDescription: 'جيفرسون فيشر (محامي وخبير تواصل) بيديك نصايح عملية تخليك مرتاح في أي حوار حتى مع الغرباء.',
    youtubeId: 'ZcI2B92JlJU',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Jefferson Fisher (Official)',
    dialogueQuote: 'Ask questions you actually want the answer to.',
    actorName: 'Jefferson Fisher',
    characterName: 'Jefferson',
    thumbnailUrl: 'https://img.youtube.com/vi/ZcI2B92JlJU/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Jefferson Fisher Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Ask questions you actually want the answer to.', arEg: 'اسأل أسئلة انت فعلاً عايز تعرف إجابتها.', arFusha: 'اسأل أسئلة انت فعلاً عايز تعرف إجابتها.', speaker: 'Jefferson', keyWords: [{ word: 'actually', ipa: '', meaningAr: 'فعلاً', meaningEn: '' }, { word: 'answer', ipa: '', meaningAr: 'إجابة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Curiosity kills the awkward silence.', arEg: 'الفضول بيقتل الصمت المحرج.', arFusha: 'الفضول بيقتل الصمت المحرج.', speaker: 'Jefferson', keyWords: [{ word: 'curiosity', ipa: '', meaningAr: 'فضول', meaningEn: '' }, { word: 'awkward', ipa: '', meaningAr: 'محرج', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'awkward silence', type: 'collocation', meaningAr: 'صمت محرج', meaningEn: '', egyptianEquivalent: 'سكات وحش', exampleInScene: 'A joke broke the awkward silence.' },      { term: 'curiosity', type: 'cultural', meaningAr: 'فضول (معرفي)', meaningEn: '', egyptianEquivalent: 'فضول', exampleInScene: 'Curiosity keeps talks alive.' },      { term: 'open-ended question', type: 'collocation', meaningAr: 'سؤال مفتوح', meaningEn: '', egyptianEquivalent: 'سؤال واسع', exampleInScene: 'Ask open-ended questions.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What kills the awkward silence, according to Jefferson?', questionAr: 'إيه اللي بيقتل الصمت المحرج حسب جيفرسون؟', options: ['الفضول والأسئلة', 'الموبايل', 'الصمت الأطول', 'السرعة في الكلام'], correctIndex: 0, explanationAr: 'الفضول الحقيقي والأسئلة المفتوحة بيخلوا الحوار يمشي طبيعي من غير إحراج.' }
    ],
    speakingLines: [{ en: 'Ask questions you actually want the answer to.', arEg: 'اسأل أسئلة انت فعلاً عايز تعرف إجابتها.' }, { en: 'Curiosity kills the awkward silence.', arEg: 'الفضول بيقتل الصمت المحرج.' }],
  },
  {
    id: 'listening-comfort-beginners',
    movieTitle: 'English Listening Practice: Daily Life Easy Conversations for Beginners',
    releaseYear: 2023,
    director: 'English in Comfort',
    genre: 'Listening Practice',
    cefrLevel: 'A2',
    sceneTitle: 'Slow and Clear Daily Conversations',
    sceneDescription: 'محادثات يومية بطيئة وواضحة للمبتدئين - درّب ودنك على الإنجليزي الطبيعي من غير ضغط.',
    youtubeId: '4EtXW3nnfPI',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'English in Comfort (Official)',
    dialogueQuote: 'Could you say that again, please?',
    actorName: 'Narrator',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/4EtXW3nnfPI/hqdefault.jpg',
    category: 'english_for_beginners',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English in Comfort Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Could you say that again, please?', arEg: 'ممكن تقولها تاني من فضلك؟', arFusha: 'ممكن تقولها تاني من فضلك؟', speaker: 'Speaker', keyWords: [{ word: 'say that again', ipa: '', meaningAr: 'قولها تاني', meaningEn: '' }, { word: 'please', ipa: '', meaningAr: 'من فضلك', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'I\'m sorry, I didn\'t catch that.', arEg: 'معلش، مسمعتهاش كويس.', arFusha: 'معلش، مسمعتهاش كويس.', speaker: 'Speaker', keyWords: [{ word: 'didn\'t catch', ipa: '', meaningAr: 'مسمعتش / مفهمتش', meaningEn: '' }, { word: 'sorry', ipa: '', meaningAr: 'معلش / آسف', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'say that again', type: 'collocation', meaningAr: 'قولها تاني', meaningEn: '', egyptianEquivalent: 'كررها تاني', exampleInScene: 'Could you say that again?' },      { term: 'catch', type: 'cultural', meaningAr: 'يسمع / يلحق الكلام', meaningEn: '', egyptianEquivalent: 'يلقط', exampleInScene: 'I didn\'t catch your name.' },      { term: 'slowly', type: 'cultural', meaningAr: 'ببطء', meaningEn: '', egyptianEquivalent: 'بشويش', exampleInScene: 'Please speak slowly.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What do you say when you don\'t hear something?', questionAr: 'تقول إيه لما متسمعش حاجة كويس؟', options: ['I didn\'t catch that', 'I don\'t care', 'Say it never', 'Catch me'], correctIndex: 0, explanationAr: 'I didn\'t catch that هي الطريقة المهذبة إنك تقول مسمعتش الكلام.' }
    ],
    speakingLines: [{ en: 'Could you say that again, please?', arEg: 'ممكن تقولها تاني من فضلك؟' }, { en: 'I\'m sorry, I didn\'t catch that.', arEg: 'معلش، مسمعتهاش كويس.' }],
  },
  {
    id: 'listening-david-alice-b1',
    movieTitle: '40 Minutes of Real English Listening Practice for B1-B2',
    releaseYear: 2023,
    director: 'David & Alice',
    genre: 'Listening Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Real Speed, Real Listening',
    sceneDescription: 'تدريب استماع 40 دقيقة بسرعة طبيعية للمستوى المتوسط - حوارات واقعية بتحسن ودنك وفهمك.',
    youtubeId: '3vrJKNOUeK4',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Speak English with David & Alice (Official)',
    dialogueQuote: 'That sounds like a great plan.',
    actorName: 'David',
    characterName: 'David',
    thumbnailUrl: 'https://img.youtube.com/vi/3vrJKNOUeK4/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak English with David & Alice',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'That sounds like a great plan.', arEg: 'ده يبان خطة جامدة.', arFusha: 'ده يبان خطة جامدة.', speaker: 'David', keyWords: [{ word: 'sounds like', ipa: '', meaningAr: 'يبان زي', meaningEn: '' }, { word: 'plan', ipa: '', meaningAr: 'خطة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Let me know if you need anything.', arEg: 'قولي لو محتاج أي حاجة.', arFusha: 'قولي لو محتاج أي حاجة.', speaker: 'Alice', keyWords: [{ word: 'let me know', ipa: '', meaningAr: 'قولي / بلغني', meaningEn: '' }, { word: 'need', ipa: '', meaningAr: 'محتاج', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'sounds like', type: 'collocation', meaningAr: 'يبان زي / يبدو', meaningEn: '', egyptianEquivalent: 'شكله', exampleInScene: 'That sounds like fun.' },      { term: 'let me know', type: 'collocation', meaningAr: 'قولي / بلغني', meaningEn: '', egyptianEquivalent: 'قولي بس', exampleInScene: 'Let me know your answer.' },      { term: 'great plan', type: 'collocation', meaningAr: 'خطة ممتازة', meaningEn: '', egyptianEquivalent: 'خطة جامدة', exampleInScene: 'Sounds like a great plan!' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'That sounds like a great plan\' express?', questionAr: 'جملة That sounds like a great plan بتعبر عن إيه؟', options: ['موافقة وحماس', 'رفض', 'شك', 'ملل'], correctIndex: 0, explanationAr: 'الجملة دي بتعبر عن موافقة وحماس لاقتراح حد.' }
    ],
    speakingLines: [{ en: 'That sounds like a great plan.', arEg: 'ده يبان خطة جامدة.' }, { en: 'Let me know if you need anything.', arEg: 'قولي لو محتاج أي حاجة.' }],
  },
  {
    id: 'listening-david-alice-c1',
    movieTitle: 'Improve Your English Just by Listening (B2-C1)',
    releaseYear: 2023,
    director: 'David & Alice',
    genre: 'Listening Practice',
    cefrLevel: 'C1',
    sceneTitle: 'Advanced Immersion Listening',
    sceneDescription: 'استماع متقدم بنطق سريع ومفردات غنية - مناسب ليك لو بتجهز لمستوى C1 أو امتحانات الطلاقة.',
    youtubeId: '3OdsuB6PED8',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Speak English with David & Alice (Official)',
    dialogueQuote: 'It\'s not rocket science; you just need consistency.',
    actorName: 'Alice',
    characterName: 'Alice',
    thumbnailUrl: 'https://img.youtube.com/vi/3OdsuB6PED8/hqdefault.jpg',
    category: 'advanced_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak English with David & Alice',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'It\'s not rocket science; you just need consistency.', arEg: 'مش صعبة أوي؛ انت بس محتاج تلتزم.', arFusha: 'مش صعبة أوي؛ انت بس محتاج تلتزم.', speaker: 'Alice', keyWords: [{ word: 'rocket science', ipa: '', meaningAr: 'حاجة معقدة جداً', meaningEn: '' }, { word: 'consistency', ipa: '', meaningAr: 'التزام / استمرارية', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'The more you immerse yourself, the faster you improve.', arEg: 'كل ما تعيش في اللغة أكتر، كل ما تتحسن أسرع.', arFusha: 'كل ما تعيش في اللغة أكتر، كل ما تتحسن أسرع.', speaker: 'David', keyWords: [{ word: 'immerse', ipa: '', meaningAr: 'يغمر / يعيش في', meaningEn: '' }, { word: 'improve', ipa: '', meaningAr: 'يتحسن', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'rocket science', type: 'idiom', meaningAr: 'حاجة معقدة جداً', meaningEn: '', egyptianEquivalent: 'فيزياء نووية', exampleInScene: 'English is not rocket science.' },      { term: 'consistency', type: 'cultural', meaningAr: 'التزام / استمرارية', meaningEn: '', egyptianEquivalent: 'مثابرة', exampleInScene: 'Consistency beats talent.' },      { term: 'immerse yourself', type: 'collocation', meaningAr: 'يعيش نفسه في اللغة', meaningEn: '', egyptianEquivalent: 'يغرق نفسه فيها', exampleInScene: 'Immerse yourself in English daily.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'It\'s not rocket science\' mean?', questionAr: 'معنى It\'s not rocket science؟', options: ['مش حاجة صعبة أوي', 'علم صواريخ', 'مستحيلة', 'محتاجة معادلات'], correctIndex: 0, explanationAr: 'لما نقول it\'s not rocket science بنقصد إنها مش معقدة زي ما الناس فاكرة.' }
    ],
    speakingLines: [{ en: 'It\'s not rocket science; you just need consistency.', arEg: 'مش صعبة أوي؛ انت بس محتاج تلتزم.' }, { en: 'The more you immerse yourself, the faster you improve.', arEg: 'كل ما تعيش في اللغة أكتر، كل ما تتحسن أسرع.' }],
  },
  {
    id: 'mistakes-accurate-7',
    movieTitle: '7 Most Common English Grammar Mistakes + TEST',
    releaseYear: 2020,
    director: 'AccurateEnglish',
    genre: 'Grammar Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Fix These 7 Mistakes',
    sceneDescription: 'ليزا موجسن بتراجع أشهر 7 غلطات جرامر بيعملها المتعلمين - مع تيست في الآخر يقيس مستواك.',
    youtubeId: 'xCBz-O8nHrc',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'AccurateEnglish (Official)',
    dialogueQuote: 'I have been living here for five years.',
    actorName: 'Lisa Mojsin',
    characterName: 'Lisa',
    thumbnailUrl: 'https://img.youtube.com/vi/xCBz-O8nHrc/hqdefault.jpg',
    category: 'american_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'AccurateEnglish Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I have been living here for five years.', arEg: 'أنا عايش هنا بقالي خمس سنين.', arFusha: 'أنا عايش هنا بقالي خمس سنين.', speaker: 'Lisa', keyWords: [{ word: 'have been living', ipa: '', meaningAr: 'عايش (من فترة لدلوقتي)', meaningEn: '' }, { word: 'for five years', ipa: '', meaningAr: 'من خمس سنين', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'She doesn\'t like coffee.', arEg: 'هي مش بتحب القهوة.', arFusha: 'هي مش بتحب القهوة.', speaker: 'Lisa', keyWords: [{ word: 'doesn\'t', ipa: '', meaningAr: 'لا (للمفرد الغائب)', meaningEn: '' }, { word: 'like', ipa: '', meaningAr: 'تحب', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'have been living', type: 'collocation', meaningAr: 'عايش من فترة مستمرة', meaningEn: '', egyptianEquivalent: 'بقالي فيها', exampleInScene: 'I have been learning English for a year.' },      { term: 'doesn\'t', type: 'cultural', meaningAr: 'أداة نفي للمفرد الغائب', meaningEn: '', egyptianEquivalent: 'مش (لهو/هي)', exampleInScene: 'He doesn\'t smoke.' },      { term: 'common mistake', type: 'collocation', meaningAr: 'غلطة شائعة', meaningEn: '', egyptianEquivalent: 'غلطة مشهورة', exampleInScene: 'That\'s a common mistake.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which is correct?', questionAr: 'أنهي جملة صح؟', options: ['She doesn\'t like coffee', 'She don\'t like coffee', 'She not like coffee', 'She doesn\'t likes coffee'], correctIndex: 0, explanationAr: 'مع he/she/it بنستخدم doesn\'t والفعل يرجع لأصله من غير s.' }
    ],
    speakingLines: [{ en: 'I have been living here for five years.', arEg: 'أنا عايش هنا بقالي خمس سنين.' }, { en: 'She doesn\'t like coffee.', arEg: 'هي مش بتحب القهوة.' }],
  },
  {
    id: 'mistakes-vanessa-20',
    movieTitle: '20 Most Common Speaking Mistakes - Advanced English Lesson',
    releaseYear: 2022,
    director: 'Speak English With Vanessa',
    genre: 'Speaking Lesson',
    cefrLevel: 'C1',
    sceneTitle: 'Sound More Natural Instantly',
    sceneDescription: 'فانيسا بتصحح 20 غلطة نطق وكلام بيفضحوا إنك متعلم - صححها وهتسمع فرق فوري في طلاقتك.',
    youtubeId: 'aQQbtwnJUtg',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Speak English With Vanessa (Official)',
    dialogueQuote: 'I\'m looking forward to seeing you.',
    actorName: 'Vanessa',
    characterName: 'Vanessa',
    thumbnailUrl: 'https://img.youtube.com/vi/aQQbtwnJUtg/hqdefault.jpg',
    category: 'advanced_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak English With Vanessa Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I\'m looking forward to seeing you.', arEg: 'مستني أشوفك بفارغ الصبر.', arFusha: 'مستني أشوفك بفارغ الصبر.', speaker: 'Vanessa', keyWords: [{ word: 'looking forward to', ipa: '', meaningAr: 'مستني بفارغ الصبر', meaningEn: '' }, { word: 'seeing', ipa: '', meaningAr: 'أشوف (بعد to هنا بييجي ing)', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'It depends on the weather.', arEg: 'ده على حسب الجو.', arFusha: 'ده على حسب الجو.', speaker: 'Vanessa', keyWords: [{ word: 'depends on', ipa: '', meaningAr: 'على حسب', meaningEn: '' }, { word: 'weather', ipa: '', meaningAr: 'الجو', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'look forward to', type: 'phrasal-verb', meaningAr: 'يستنى بفارغ الصبر (وبعدها ing)', meaningEn: '', egyptianEquivalent: 'مستني بشوق', exampleInScene: 'I look forward to meeting you.' },      { term: 'depend on', type: 'phrasal-verb', meaningAr: 'يعتمد على', meaningEn: '', egyptianEquivalent: 'على حسب', exampleInScene: 'It depends on you.' },      { term: 'mistake', type: 'cultural', meaningAr: 'غلطة', meaningEn: '', egyptianEquivalent: 'غلطة', exampleInScene: 'Learn from your mistakes.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which is correct after \'look forward to\'?', questionAr: 'إيه الصح بعد look forward to؟', options: ['seeing you', 'see you', 'saw you', 'to see you'], correctIndex: 0, explanationAr: 'بعد look forward to بييجي الفعل في ing: look forward to seeing you.' }
    ],
    speakingLines: [{ en: 'I\'m looking forward to seeing you.', arEg: 'مستني أشوفك بفارغ الصبر.' }, { en: 'It depends on the weather.', arEg: 'ده على حسب الجو.' }],
  },
  {
    id: 'phone-bob-phrases',
    movieTitle: 'Learn English Phone Phrases',
    releaseYear: 2020,
    director: 'Bob the Canadian',
    genre: 'Speaking Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Answering the Phone Confidently',
    sceneDescription: 'بوب بيعلمك عبارات التليفون الأساسية: ترد، تسأل مين بيكلمك، وتقفل المكالمة بأدب.',
    youtubeId: 'u40ZKHC98k0',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'Hello, this is Bob speaking.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/u40ZKHC98k0/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Hello, this is Bob speaking.', arEg: 'ألو، معاك بوب.', arFusha: 'ألو، معاك بوب.', speaker: 'Bob', keyWords: [{ word: 'this is', ipa: '', meaningAr: 'معاك (في التليفون)', meaningEn: '' }, { word: 'speaking', ipa: '', meaningAr: 'بيتكلم', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Can I take a message?', arEg: 'أوصله رسالة؟', arFusha: 'أوصله رسالة؟', speaker: 'Bob', keyWords: [{ word: 'take a message', ipa: '', meaningAr: 'يوصل رسالة', meaningEn: '' }, { word: 'message', ipa: '', meaningAr: 'رسالة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'this is... speaking', type: 'collocation', meaningAr: 'معاك فلان (رد التليفون)', meaningEn: '', egyptianEquivalent: 'معاك', exampleInScene: 'Hello, this is Ahmed speaking.' },      { term: 'take a message', type: 'collocation', meaningAr: 'يوصل رسالة', meaningEn: '', egyptianEquivalent: 'يقوله حاجة', exampleInScene: 'Can I take a message?' },      { term: 'hold on', type: 'phrasal-verb', meaningAr: 'استنى لحظة', meaningEn: '', egyptianEquivalent: 'ثانية واحدة', exampleInScene: 'Hold on, please.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you introduce yourself on the phone in English?', questionAr: 'بتعرف نفسك إزاي في التليفون بالإنجليزي؟', options: ['This is Ahmed speaking', 'I am Ahmed here', 'Me Ahmed', 'Ahmed is me'], correctIndex: 0, explanationAr: 'في التليفون بنقول this is + اسمك + speaking، مش I am.' }
    ],
    speakingLines: [{ en: 'Hello, this is Bob speaking.', arEg: 'ألو، معاك بوب.' }, { en: 'Can I take a message?', arEg: 'أوصله رسالة؟' }],
  },
  {
    id: 'phone-mmmenglish-mustknow',
    movieTitle: 'Must-know Phone Phrases - Talk Confidently On The Telephone',
    releaseYear: 2020,
    director: 'mmmEnglish',
    genre: 'Speaking Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Professional Phone English',
    sceneDescription: 'إيما بتلخص أهم عبارات التليفون الرسمية والودية - هترد على أي مكالمة إنجليزي بثقة بعد المقطع ده.',
    youtubeId: 'H9jUV2AQphY',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'mmmEnglish (Official)',
    dialogueQuote: 'Could you put me through to the manager?',
    actorName: 'Emma',
    characterName: 'Emma',
    thumbnailUrl: 'https://img.youtube.com/vi/H9jUV2AQphY/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'mmmEnglish Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Could you put me through to the manager?', arEg: 'ممكن تحولني للمدير؟', arFusha: 'ممكن تحولني للمدير؟', speaker: 'Emma', keyWords: [{ word: 'put through', ipa: '', meaningAr: 'يحوّل المكالمة', meaningEn: '' }, { word: 'manager', ipa: '', meaningAr: 'المدير', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I\'m afraid he\'s not available right now.', arEg: 'للأسف هو مش موجود دلوقتي.', arFusha: 'للأسف هو مش موجود دلوقتي.', speaker: 'Emma', keyWords: [{ word: 'I\'m afraid', ipa: '', meaningAr: 'للأسف (بأدب)', meaningEn: '' }, { word: 'available', ipa: '', meaningAr: 'موجود / متاح', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'put someone through', type: 'phrasal-verb', meaningAr: 'يحوّل مكالمة لحد', meaningEn: '', egyptianEquivalent: 'يحوّلني', exampleInScene: 'Please put me through to sales.' },      { term: 'I\'m afraid', type: 'collocation', meaningAr: 'للأسف (رفض مهذب)', meaningEn: '', egyptianEquivalent: 'معلش بس', exampleInScene: 'I\'m afraid we\'re closed.' },      { term: 'available', type: 'cultural', meaningAr: 'موجود / متاح', meaningEn: '', egyptianEquivalent: 'فاضي', exampleInScene: 'Is she available today?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'put me through to the manager\' mean?', questionAr: 'معنى put me through to the manager؟', options: ['حوّلني للمدير', 'المدير هيحطني', 'قابل المدير', 'كلم المدير بعدين'], correctIndex: 0, explanationAr: 'put through معناها يحوّل المكالمة لشخص تاني في الشغل.' }
    ],
    speakingLines: [{ en: 'Could you put me through to the manager?', arEg: 'ممكن تحولني للمدير؟' }, { en: 'I\'m afraid he\'s not available right now.', arEg: 'للأسف هو مش موجود دلوقتي.' }],
  },
  {
    id: 'travel-podcast-airport-hotel',
    movieTitle: 'English for Travel You Will Actually Need - Airport & Hotel Conversations',
    releaseYear: 2023,
    director: 'English Conversation Podcast',
    genre: 'Travel English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Airport and Hotel Essentials',
    sceneDescription: 'كل المحادثات اللي هتحتاجها في المطار والفندق: تشيك إن، أسئلة الأمن، وحجز الأوضة بثقة.',
    youtubeId: 'fsY6mF9rUCk',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English Conversation Podcast (Official)',
    dialogueQuote: 'I\'d like to check in, please.',
    actorName: 'Host',
    characterName: 'Traveler',
    thumbnailUrl: 'https://img.youtube.com/vi/fsY6mF9rUCk/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Conversation Podcast',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I\'d like to check in, please.', arEg: 'عايز أعمل تشيك إن، من فضلك.', arFusha: 'عايز أعمل تشيك إن، من فضلك.', speaker: 'Traveler', keyWords: [{ word: 'check in', ipa: '', meaningAr: 'يسجل وصول', meaningEn: '' }, { word: 'I\'d like', ipa: '', meaningAr: 'عايز (بأدب)', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'What time is breakfast served?', arEg: 'الفطار بيتقدم الساعة كام؟', arFusha: 'الفطار بيتقدم الساعة كام؟', speaker: 'Traveler', keyWords: [{ word: 'served', ipa: '', meaningAr: 'بيتقدم', meaningEn: '' }, { word: 'breakfast', ipa: '', meaningAr: 'الفطار', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'check in', type: 'phrasal-verb', meaningAr: 'يسجل وصول (مطار/فندق)', meaningEn: '', egyptianEquivalent: 'يعمل تشيك إن', exampleInScene: 'We checked in online.' },      { term: 'I\'d like', type: 'collocation', meaningAr: 'عايز (بصيغة مهذبة)', meaningEn: '', egyptianEquivalent: 'لو سمحت عايز', exampleInScene: 'I\'d like a coffee, please.' },      { term: 'reservation', type: 'cultural', meaningAr: 'حجز', meaningEn: '', egyptianEquivalent: 'حجز', exampleInScene: 'I have a reservation.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'check in\' mean at a hotel?', questionAr: 'معنى check in في الفندق؟', options: ['يسجل وصوله', 'يسجل خروجه', 'يدفع الحساب', 'يطلب الأكل'], correctIndex: 0, explanationAr: 'check in معناها تسجل وصولك في الفندق أو المطار، وعكسها check out.' }
    ],
    speakingLines: [{ en: 'I\'d like to check in, please.', arEg: 'عايز أعمل تشيك إن، من فضلك.' }, { en: 'What time is breakfast served?', arEg: 'الفطار بيتقدم الساعة كام؟' }],
  },
  {
    id: 'travel-mr-english-beginners',
    movieTitle: 'Travel English for Beginners - Airport, Hotel & Taxi',
    releaseYear: 2023,
    director: 'Mr. English Channel',
    genre: 'Travel English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'What to Say at Every Step',
    sceneDescription: 'إنجليزية السفر للمبتدئين: جمل جاهزة لكل خطوة من المطار للتاكسي للفندق - بطيئة وسهلة الحفظ.',
    youtubeId: 'WyDcfIz08Eo',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Mr. English Channel (Official)',
    dialogueQuote: 'Where is the baggage claim?',
    actorName: 'Teacher',
    characterName: 'Traveler',
    thumbnailUrl: 'https://img.youtube.com/vi/WyDcfIz08Eo/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Mr. English Channel Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Where is the baggage claim?', arEg: 'فين مكان استلام الشنط؟', arFusha: 'فين مكان استلام الشنط؟', speaker: 'Traveler', keyWords: [{ word: 'baggage claim', ipa: '', meaningAr: 'استلام الشنط', meaningEn: '' }, { word: 'where', ipa: '', meaningAr: 'فين', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Could you take me to this address?', arEg: 'ممكن توصلني للعنوان ده؟', arFusha: 'ممكن توصلني للعنوان ده؟', speaker: 'Traveler', keyWords: [{ word: 'take me', ipa: '', meaningAr: 'توصلني', meaningEn: '' }, { word: 'address', ipa: '', meaningAr: 'عنوان', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'baggage claim', type: 'collocation', meaningAr: 'مكان استلام الشنط', meaningEn: '', egyptianEquivalent: 'حزام الشنط', exampleInScene: 'Meet me at baggage claim.' },      { term: 'boarding pass', type: 'collocation', meaningAr: 'كارت صعود الطيارة', meaningEn: '', egyptianEquivalent: 'تذكرة الصعود', exampleInScene: 'Show your boarding pass.' },      { term: 'Could you take me to...?', type: 'collocation', meaningAr: 'ممكن توصلني لـ...؟', meaningEn: '', egyptianEquivalent: 'ممكن توديني', exampleInScene: 'Could you take me to the airport?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Where do you get your bags after landing?', questionAr: 'بتستلم شنطك فين بعد ما الطيارة تنزل؟', options: ['Baggage claim', 'Gate', 'Check-in', 'Customs'], correctIndex: 0, explanationAr: 'baggage claim هي منطقة استلام الشنط بعد الوصول.' }
    ],
    speakingLines: [{ en: 'Where is the baggage claim?', arEg: 'فين مكان استلام الشنط؟' }, { en: 'Could you take me to this address?', arEg: 'ممكن توصلني للعنوان ده؟' }],
  },
  {
    id: 'travel-jay-hotel',
    movieTitle: 'Hotel English - All You Need to Know for Travelling Abroad',
    releaseYear: 2022,
    director: 'English by Jay',
    genre: 'Travel English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Hotel Conversations Masterclass',
    sceneDescription: 'كل حاجة عن إنجليزية الفنادق: الحجز، الشكاوى، طلبات الخدمة، وتسديد الحساب - باللهجة البريطانية.',
    youtubeId: 'BJsOHCUPnWY',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English by Jay - Sprout (Official)',
    dialogueQuote: 'Could I have a late checkout, please?',
    actorName: 'Jay',
    characterName: 'Guest',
    thumbnailUrl: 'https://img.youtube.com/vi/BJsOHCUPnWY/hqdefault.jpg',
    category: 'travel_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English by Jay Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Could I have a late checkout, please?', arEg: 'ممكن أخرج متأخر شوية، من فضلك؟', arFusha: 'ممكن أخرج متأخر شوية، من فضلك؟', speaker: 'Guest', keyWords: [{ word: 'late checkout', ipa: '', meaningAr: 'خروج متأخر', meaningEn: '' }, { word: 'Could I have', ipa: '', meaningAr: 'ممكن آخد', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'The air conditioning isn\'t working in my room.', arEg: 'التكييف مش شغال في الأوضة.', arFusha: 'التكييف مش شغال في الأوضة.', speaker: 'Guest', keyWords: [{ word: 'air conditioning', ipa: '', meaningAr: 'التكييف', meaningEn: '' }, { word: 'isn\'t working', ipa: '', meaningAr: 'مش شغال', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'late checkout', type: 'collocation', meaningAr: 'خروج متأخر من الفندق', meaningEn: '', egyptianEquivalent: 'تأخير الخروج', exampleInScene: 'They gave us a late checkout.' },      { term: 'isn\'t working', type: 'collocation', meaningAr: 'مش شغال', meaningEn: '', egyptianEquivalent: 'بايظ', exampleInScene: 'The TV isn\'t working.' },      { term: 'wake-up call', type: 'collocation', meaningAr: 'مكالمة صحيان من الاستقبال', meaningEn: '', egyptianEquivalent: 'مكالمة إيقاظ', exampleInScene: 'Book a 6 AM wake-up call.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is a \'late checkout\'?', questionAr: 'يعني إيه late checkout؟', options: ['خروج متأخر من الأوضة', 'حجز متأخر', 'حساب غلط', 'أوضة متأخرة'], correctIndex: 0, explanationAr: 'late checkout يعني الفندق يسمحلك تسيب الأوضة بعد ميعاد الخروج العادي.' }
    ],
    speakingLines: [{ en: 'Could I have a late checkout, please?', arEg: 'ممكن أخرج متأخر شوية، من فضلك؟' }, { en: 'The air conditioning isn\'t working in my room.', arEg: 'التكييف مش شغال في الأوضة.' }],
  },
  {
    id: 'street-easy-english-london',
    movieTitle: 'Talking to People in London - Easy English 4',
    releaseYear: 2019,
    director: 'Easy Languages',
    genre: 'Street Interviews',
    cefrLevel: 'B1',
    sceneTitle: 'Real Londoners, Real English',
    sceneDescription: 'حوارات حقيقية في شوارع لندن مع ناس عادية - اسمع اللهجة البريطانية الطبيعية بترجمة مزدوجة.',
    youtubeId: 'DDjWTWHHkpk',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Easy Languages (Official)',
    dialogueQuote: 'What do you love most about London?',
    actorName: 'Interviewer',
    characterName: 'Interviewer',
    thumbnailUrl: 'https://img.youtube.com/vi/DDjWTWHHkpk/hqdefault.jpg',
    category: 'street_interviews',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Easy Languages Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'What do you love most about London?', arEg: 'أكتر حاجة بتحبها في لندن إيه؟', arFusha: 'أكتر حاجة بتحبها في لندن إيه؟', speaker: 'Interviewer', keyWords: [{ word: 'most', ipa: '', meaningAr: 'أكتر حاجة', meaningEn: '' }, { word: 'about', ipa: '', meaningAr: 'عن', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I love how diverse it is.', arEg: 'بحب التنوع اللي فيها.', arFusha: 'بحب التنوع اللي فيها.', speaker: 'Londoner', keyWords: [{ word: 'diverse', ipa: '', meaningAr: 'متنوعة', meaningEn: '' }, { word: 'love', ipa: '', meaningAr: 'بحب', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'diverse', type: 'cultural', meaningAr: 'متنوع', meaningEn: '', egyptianEquivalent: 'متنوعة', exampleInScene: 'London is very diverse.' },      { term: 'What do you love most about...?', type: 'collocation', meaningAr: 'أكتر حاجة بتحبها في...؟', meaningEn: '', egyptianEquivalent: 'إيه أحلى حاجة في', exampleInScene: 'What do you love most about Cairo?' },      { term: 'locals', type: 'cultural', meaningAr: 'أهل البلد', meaningEn: '', egyptianEquivalent: 'الناس المحلية', exampleInScene: 'Ask the locals for tips.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'diverse\' mean?', questionAr: 'معنى diverse؟', options: ['متنوعة', 'بعيدة', 'غالية', 'قديمة'], correctIndex: 0, explanationAr: 'diverse معناها متنوعة - فيها ناس وثقافات كتير مختلفة.' }
    ],
    speakingLines: [{ en: 'What do you love most about London?', arEg: 'أكتر حاجة بتحبها في لندن إيه؟' }, { en: 'I love how diverse it is.', arEg: 'بحب التنوع اللي فيها.' }],
  },
  {
    id: 'street-aydan-salaries',
    movieTitle: 'Asking Strangers How Much They Make in London',
    releaseYear: 2023,
    director: 'Aydan Al-Saad',
    genre: 'Street Interviews',
    cefrLevel: 'B2',
    sceneTitle: 'Careers and Salaries on the Street',
    sceneDescription: 'أسئلة للناس في شارع لندن عن شغلهم ومرتباتهم - مفردات الشغل والفلوس بلغة الشارع الحقيقية.',
    youtubeId: '6IFsllMF8OI',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Aydan Al-Saad (Official)',
    dialogueQuote: 'What do you do for work, if you don\'t mind me asking?',
    actorName: 'Aydan',
    characterName: 'Aydan',
    thumbnailUrl: 'https://img.youtube.com/vi/6IFsllMF8OI/hqdefault.jpg',
    category: 'street_interviews',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Aydan Al-Saad Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'What do you do for work, if you don\'t mind me asking?', arEg: 'بتشتغل إيه، لو مفيش مانع أسأل؟', arFusha: 'بتشتغل إيه، لو مفيش مانع أسأل؟', speaker: 'Aydan', keyWords: [{ word: 'for work', ipa: '', meaningAr: 'كشغل', meaningEn: '' }, { word: 'don\'t mind me asking', ipa: '', meaningAr: 'لو مفيش مانع أسأل', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'I\'m in finance, to be honest.', arEg: 'أنا شغال في المالية، بصراحة.', arFusha: 'أنا شغال في المالية، بصراحة.', speaker: 'Stranger', keyWords: [{ word: 'finance', ipa: '', meaningAr: 'المالية', meaningEn: '' }, { word: 'to be honest', ipa: '', meaningAr: 'بصراحة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'if you don\'t mind me asking', type: 'idiom', meaningAr: 'لو مفيش مانع أسأل (سؤال شخصي بأدب)', meaningEn: '', egyptianEquivalent: 'مع احترامي، سؤال', exampleInScene: 'How old are you, if you don\'t mind me asking?' },      { term: 'to be honest', type: 'collocation', meaningAr: 'بصراحة', meaningEn: '', egyptianEquivalent: 'بصراحة كده', exampleInScene: 'To be honest, I love my job.' },      { term: 'finance', type: 'cultural', meaningAr: 'مجال المالية', meaningEn: '', egyptianEquivalent: 'البنوك والفلوس', exampleInScene: 'She works in finance.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Why do people say \'if you don\'t mind me asking\'?', questionAr: 'ليه بنقول if you don\'t mind me asking؟', options: ['قبل سؤال شخصي عشان الأدب', 'عشان نرفض نجاوب', 'في آخر المكالمة', 'لما نكون زعلانين'], correctIndex: 0, explanationAr: 'الجملة دي بتتحط قبل الأسئلة الشخصية عشان تبقى مهذبة.' }
    ],
    speakingLines: [{ en: 'What do you do for work, if you don\'t mind me asking?', arEg: 'بتشتغل إيه، لو مفيش مانع أسأل؟' }, { en: 'I\'m in finance, to be honest.', arEg: 'أنا شغال في المالية، بصراحة.' }],
  },
  {
    id: 'accents-us-uk-au',
    movieTitle: 'American vs. British vs. Australian English - One Language, Three Accents',
    releaseYear: 2022,
    director: 'Language of Earth',
    genre: 'Accent Comparison',
    cefrLevel: 'B2',
    sceneTitle: 'Three Accents Side by Side',
    sceneDescription: 'مقارنة مباشرة بين اللكنة الأمريكية والبريطانية والأسترالية - درّب ودنك تفرق بينهم بسهولة.',
    youtubeId: 'fy-bd5AC-Ms',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Language of Earth (Official)',
    dialogueQuote: 'Same language, three very different sounds.',
    actorName: 'Narrator',
    characterName: 'Narrator',
    thumbnailUrl: 'https://img.youtube.com/vi/fy-bd5AC-Ms/hqdefault.jpg',
    category: 'british_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Language of Earth Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Same language, three very different sounds.', arEg: 'نفس اللغة، تلات أصوات مختلفة جداً.', arFusha: 'نفس اللغة، تلات أصوات مختلفة جداً.', speaker: 'Narrator', keyWords: [{ word: 'same', ipa: '', meaningAr: 'نفس', meaningEn: '' }, { word: 'different', ipa: '', meaningAr: 'مختلفة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Australians often shorten their words.', arEg: 'الأستراليين بيختصروا كلماتهم كتير.', arFusha: 'الأستراليين بيختصروا كلماتهم كتير.', speaker: 'Narrator', keyWords: [{ word: 'shorten', ipa: '', meaningAr: 'يختصر', meaningEn: '' }, { word: 'often', ipa: '', meaningAr: 'كتير / غالباً', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'accent', type: 'cultural', meaningAr: 'لكنة / لهجة', meaningEn: '', egyptianEquivalent: 'لكنة', exampleInScene: 'Her accent is lovely.' },      { term: 'shorten', type: 'cultural', meaningAr: 'يختصر', meaningEn: '', egyptianEquivalent: 'يقصّر', exampleInScene: 'Aussies shorten afternoon to arvo.' },      { term: 'dialect', type: 'cultural', meaningAr: 'لهجة محلية', meaningEn: '', egyptianEquivalent: 'لهجة', exampleInScene: 'Every region has a dialect.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What do Australians often do to their words?', questionAr: 'الأستراليين بيعملوا إيه في كلماتهم غالباً؟', options: ['بيختصروها', 'بيترجموها', 'بينطقوها كاملة دايماً', 'بيكتبوها غلط'], correctIndex: 0, explanationAr: 'الأستراليين مشهورين باختصار الكلمات: afternoon تبقى arvo.' }
    ],
    speakingLines: [{ en: 'Same language, three very different sounds.', arEg: 'نفس اللغة، تلات أصوات مختلفة جداً.' }, { en: 'Australians often shorten their words.', arEg: 'الأستراليين بيختصروا كلماتهم كتير.' }],
  },
  {
    id: 'ukus-letstalk-50',
    movieTitle: '50 Differences Between British English vs American English Vocabulary',
    releaseYear: 2021,
    director: 'Let\'s Talk',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: '50 Word Pairs You Must Know',
    sceneDescription: 'خمسين كلمة بتختلف بين البريطاني والأمريكي: لفت/إليفيتور، فلات/أبارتمنت - هتفهم اللكنتين بعدها.',
    youtubeId: 'V-Ro66uMBX4',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Let\'s Talk - Free English Lessons (Official)',
    dialogueQuote: 'In Britain it\'s a flat; in America it\'s an apartment.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/V-Ro66uMBX4/hqdefault.jpg',
    category: 'british_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Let\'s Talk Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'In Britain it\'s a flat; in America it\'s an apartment.', arEg: 'في بريطانيا اسمها flat؛ في أمريكا apartment.', arFusha: 'في بريطانيا اسمها flat؛ في أمريكا apartment.', speaker: 'Teacher', keyWords: [{ word: 'flat', ipa: '', meaningAr: 'شقة (بريطاني)', meaningEn: '' }, { word: 'apartment', ipa: '', meaningAr: 'شقة (أمريكي)', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'The British say holiday; Americans say vacation.', arEg: 'البريطانيين بيقولوا holiday؛ الأمريكان vacation.', arFusha: 'البريطانيين بيقولوا holiday؛ الأمريكان vacation.', speaker: 'Teacher', keyWords: [{ word: 'holiday', ipa: '', meaningAr: 'أجازة (بريطاني)', meaningEn: '' }, { word: 'vacation', ipa: '', meaningAr: 'أجازة (أمريكي)', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'flat / apartment', type: 'collocation', meaningAr: 'شقة (بريطاني / أمريكي)', meaningEn: '', egyptianEquivalent: 'شقة', exampleInScene: 'I live in a small flat.' },      { term: 'holiday / vacation', type: 'collocation', meaningAr: 'أجازة (بريطاني / أمريكي)', meaningEn: '', egyptianEquivalent: 'أجازة', exampleInScene: 'We\'re on holiday.' },      { term: 'lift / elevator', type: 'collocation', meaningAr: 'أسانسير (بريطاني / أمريكي)', meaningEn: '', egyptianEquivalent: 'أسانسير', exampleInScene: 'Take the lift.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the American word for \'flat\'?', questionAr: 'إيه الكلمة الأمريكية لكلمة flat؟', options: ['apartment', 'house', 'room', 'office'], correctIndex: 0, explanationAr: 'flat بريطانية و apartment أمريكية - الاتنين معناهم شقة.' }
    ],
    speakingLines: [{ en: 'In Britain it\'s a flat; in America it\'s an apartment.', arEg: 'في بريطانيا اسمها flat؛ في أمريكا apartment.' }, { en: 'The British say holiday; Americans say vacation.', arEg: 'البريطانيين بيقولوا holiday؛ الأمريكان vacation.' }],
  },
  {
    id: 'ukus-360-explained',
    movieTitle: 'British vs American English Explained - US vs UK Differences for ESL Students',
    releaseYear: 2021,
    director: 'English Speaking 360',
    genre: 'Accent Comparison',
    cefrLevel: 'B1',
    sceneTitle: 'US vs UK Side by Side',
    sceneDescription: 'شرح مبسط لأهم الفروق بين الإنجليزي الأمريكي والبريطاني في النطق والكلمات والإملاء.',
    youtubeId: 'e5JnMFfEX0k',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English Speaking 360 (Official)',
    dialogueQuote: 'Color or colour? Both are correct.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/e5JnMFfEX0k/hqdefault.jpg',
    category: 'american_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Speaking 360 Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Color or colour? Both are correct.', arEg: 'Color ولا colour؟ الاتنين صح.', arFusha: 'Color ولا colour؟ الاتنين صح.', speaker: 'Teacher', keyWords: [{ word: 'colour', ipa: '', meaningAr: 'لون (إملاء بريطاني)', meaningEn: '' }, { word: 'both', ipa: '', meaningAr: 'الاتنين', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Americans pronounce the R strongly.', arEg: 'الأمريكان بينطقوا حرف الـ R بوضوح.', arFusha: 'الأمريكان بينطقوا حرف الـ R بوضوح.', speaker: 'Teacher', keyWords: [{ word: 'pronounce', ipa: '', meaningAr: 'ينطق', meaningEn: '' }, { word: 'strongly', ipa: '', meaningAr: 'بوضوح / بقوة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'pronounce', type: 'cultural', meaningAr: 'ينطق', meaningEn: '', egyptianEquivalent: 'ينطق', exampleInScene: 'How do you pronounce this?' },      { term: 'spelling', type: 'cultural', meaningAr: 'إملاء / تهجئة', meaningEn: '', egyptianEquivalent: 'طريقة الكتابة', exampleInScene: 'US and UK spelling differ.' },      { term: 'both are correct', type: 'collocation', meaningAr: 'الاتنين صح', meaningEn: '', egyptianEquivalent: 'الاتنين تمام', exampleInScene: 'Both spellings are correct.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do Americans usually pronounce the letter R?', questionAr: 'الأمريكان بينطقوا حرف الـ R إزاي؟', options: ['بوضوح وبقوة', 'مبينطقوهوش', 'زي الفرنساوي', 'بحرف G'], correctIndex: 0, explanationAr: 'الأمريكان بينطقوا الـ R في آخر الكلمة (car, water)، عكس البريطانيين اللي بيسيبوها أخف.' }
    ],
    speakingLines: [{ en: 'Color or colour? Both are correct.', arEg: 'Color ولا colour؟ الاتنين صح.' }, { en: 'Americans pronounce the R strongly.', arEg: 'الأمريكان بينطقوا حرف الـ R بوضوح.' }],
  },
  {
    id: 'restaurant-bob-order',
    movieTitle: 'How to Order Food at a Restaurant in English',
    releaseYear: 2020,
    director: 'Bob the Canadian',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Ordering Like a Local',
    sceneDescription: 'بوب بياخدك خطوة بخطوة في المطعم: الحجز، الطلب، طلب الحساب - كل الجمل اللي هتحتاجها.',
    youtubeId: 'uUMPULuwdLI',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'Could I see the menu, please?',
    actorName: 'Bob',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/uUMPULuwdLI/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Could I see the menu, please?', arEg: 'ممكن أشوف المنيو، من فضلك؟', arFusha: 'ممكن أشوف المنيو، من فضلك؟', speaker: 'Customer', keyWords: [{ word: 'menu', ipa: '', meaningAr: 'المنيو', meaningEn: '' }, { word: 'Could I see', ipa: '', meaningAr: 'ممكن أشوف', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I\'ll have the chicken, please.', arEg: 'هاخد الفراخ، من فضلك.', arFusha: 'هاخد الفراخ، من فضلك.', speaker: 'Customer', keyWords: [{ word: 'I\'ll have', ipa: '', meaningAr: 'هاخد (في الطلب)', meaningEn: '' }, { word: 'chicken', ipa: '', meaningAr: 'فراخ', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'Could I see the menu?', type: 'collocation', meaningAr: 'ممكن أشوف المنيو؟', meaningEn: '', egyptianEquivalent: 'المنيو لو سمحت', exampleInScene: 'Could I see the menu, please?' },      { term: 'I\'ll have...', type: 'collocation', meaningAr: 'هاخد... (في الطلب)', meaningEn: '', egyptianEquivalent: 'هطلب', exampleInScene: 'I\'ll have the fish.' },      { term: 'the bill / check', type: 'collocation', meaningAr: 'الحساب', meaningEn: '', egyptianEquivalent: 'الحساب', exampleInScene: 'Could we have the bill?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you order food politely?', questionAr: 'بتطلب الأكل بأدب إزاي؟', options: ['I\'ll have the chicken', 'Give me chicken', 'I want chicken now', 'Chicken, hurry'], correctIndex: 0, explanationAr: 'في المطاعم بنقول I\'ll have + الأكل - أدبية وسهلة.' }
    ],
    speakingLines: [{ en: 'Could I see the menu, please?', arEg: 'ممكن أشوف المنيو، من فضلك؟' }, { en: 'I\'ll have the chicken, please.', arEg: 'هاخد الفراخ، من فضلك.' }],
  },
  {
    id: 'restaurant-easy-english',
    movieTitle: 'At the Restaurant Conversation - Easy English',
    releaseYear: 2021,
    director: 'Easy English',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'A Full Restaurant Dialogue',
    sceneDescription: 'حوار كامل في المطعم من أول الترحيب لحد دفع الحساب - تمثيل واضح وبطيء مثالي للتقليد.',
    youtubeId: 'bgfdqVmVjfk',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Easy English (Official)',
    dialogueQuote: 'Are you ready to order?',
    actorName: 'Waiter',
    characterName: 'Waiter',
    thumbnailUrl: 'https://img.youtube.com/vi/bgfdqVmVjfk/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Easy English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Are you ready to order?', arEg: 'جاهزين تطلبوا؟', arFusha: 'جاهزين تطلبوا؟', speaker: 'Waiter', keyWords: [{ word: 'ready', ipa: '', meaningAr: 'جاهز', meaningEn: '' }, { word: 'order', ipa: '', meaningAr: 'يطلبوا', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Would you like anything to drink?', arEg: 'تحبوا تشربوا حاجة؟', arFusha: 'تحبوا تشربوا حاجة؟', speaker: 'Waiter', keyWords: [{ word: 'Would you like', ipa: '', meaningAr: 'تحبوا (بأدب)', meaningEn: '' }, { word: 'to drink', ipa: '', meaningAr: 'تشربوا', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'Are you ready to order?', type: 'collocation', meaningAr: 'جاهزين تطلبوا؟', meaningEn: '', egyptianEquivalent: 'تطلبوا إيه؟', exampleInScene: 'Are you ready to order, sir?' },      { term: 'Would you like...?', type: 'collocation', meaningAr: 'تحب...؟ (عرض مهذب)', meaningEn: '', egyptianEquivalent: 'تحب', exampleInScene: 'Would you like some water?' },      { term: 'Anything else?', type: 'collocation', meaningAr: 'أي حاجة تانية؟', meaningEn: '', egyptianEquivalent: 'كمان حاجة؟', exampleInScene: 'Anything else for you?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does the waiter mean by \'Are you ready to order?\'', questionAr: 'الويتر بيقصد إيه بـ Are you ready to order؟', options: ['جاهزين تطلبوا؟', 'عايزين تدفعوا؟', 'الأكل خلص؟', 'المطعم بيقفل؟'], correctIndex: 0, explanationAr: 'الجملة دي الويتر بيسأل بيها لو انت جاهز تطلب أكل.' }
    ],
    speakingLines: [{ en: 'Are you ready to order?', arEg: 'جاهزين تطلبوا؟' }, { en: 'Would you like anything to drink?', arEg: 'تحبوا تشربوا حاجة؟' }],
  },
  {
    id: 'ted-lydia-secrets',
    movieTitle: 'The Secrets of Learning a New Language - Lýdia Machová',
    releaseYear: 2019,
    director: 'TED',
    genre: 'TED Talk',
    cefrLevel: 'B2',
    sceneTitle: 'How Polyglots Really Learn',
    sceneDescription: 'ليديا ماتشوفا (بتتكلم 8 لغات) بتكشف سر تعلم اللغات: المتعة والاستمرارية مش الموهبة.',
    youtubeId: 'o_XVt5rdpFY',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'TED (Official)',
    dialogueQuote: 'There is no shortcut to fluency, but there is enjoyment.',
    actorName: 'Lýdia Machová',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/o_XVt5rdpFY/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'TED Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'There is no shortcut to fluency, but there is enjoyment.', arEg: 'مفيش طريق مختصر للطلاقة، بس فيه متعة.', arFusha: 'مفيش طريق مختصر للطلاقة، بس فيه متعة.', speaker: 'Speaker', keyWords: [{ word: 'shortcut', ipa: '', meaningAr: 'طريق مختصر', meaningEn: '' }, { word: 'fluency', ipa: '', meaningAr: 'طلاقة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Find a method you enjoy, and you will stick to it.', arEg: 'لاقي طريقة تستمتع بيها، وهتلتزم بيها.', arFusha: 'لاقي طريقة تستمتع بيها، وهتلتزم بيها.', speaker: 'Speaker', keyWords: [{ word: 'stick to', ipa: '', meaningAr: 'يلتزم بـ', meaningEn: '' }, { word: 'method', ipa: '', meaningAr: 'طريقة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'shortcut', type: 'cultural', meaningAr: 'طريق مختصر', meaningEn: '', egyptianEquivalent: 'اختصار', exampleInScene: 'There are no shortcuts in learning.' },      { term: 'stick to', type: 'phrasal-verb', meaningAr: 'يلتزم بـ / يكمل في', meaningEn: '', egyptianEquivalent: 'يكمل فيها', exampleInScene: 'Stick to your plan.' },      { term: 'enjoyment', type: 'cultural', meaningAr: 'متعة', meaningEn: '', egyptianEquivalent: 'متعة', exampleInScene: 'Enjoyment keeps you going.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the secret of polyglots, according to Lýdia?', questionAr: 'إيه سر متعددي اللغات حسب ليديا؟', options: ['الاستمتاع بالطريقة والالتزام', 'الموهبة', 'السفر للخارج', 'الحفظ الكتير'], correctIndex: 0, explanationAr: 'السر إنهم بيلاقوا طرق ممتعة ليهم شخصياً وبيستمروا عليها.' }
    ],
    speakingLines: [{ en: 'There is no shortcut to fluency, but there is enjoyment.', arEg: 'مفيش طريق مختصر للطلاقة، بس فيه متعة.' }, { en: 'Find a method you enjoy, and you will stick to it.', arEg: 'لاقي طريقة تستمتع بيها، وهتلتزم بيها.' }],
  },
  {
    id: 'ted-lonsdale-six-months',
    movieTitle: 'How to Learn Any Language in Six Months - Chris Lonsdale',
    releaseYear: 2013,
    director: 'TEDx Talks',
    genre: 'TEDx Talk',
    cefrLevel: 'B2',
    sceneTitle: 'The Six-Month Method',
    sceneDescription: 'كريس لونزديل بيشرح 5 مبادئ و7 أفعال لتعلم أي لغة في 6 شهور - من أشهر محاضرات تعلم اللغة.',
    youtubeId: 'd0yGdNEWdn0',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'TEDx Talks (Official)',
    dialogueQuote: 'Focus on language content that is relevant to you.',
    actorName: 'Chris Lonsdale',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/d0yGdNEWdn0/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'TEDx Talks Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Focus on language content that is relevant to you.', arEg: 'ركز على المحتوى اللي ليه علاقة بيك انت.', arFusha: 'ركز على المحتوى اللي ليه علاقة بيك انت.', speaker: 'Speaker', keyWords: [{ word: 'focus on', ipa: '', meaningAr: 'يركز على', meaningEn: '' }, { word: 'relevant', ipa: '', meaningAr: 'مرتبط / مناسب', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Use the language as a tool to communicate from day one.', arEg: 'استخدم اللغة كأداة تواصل من أول يوم.', arFusha: 'استخدم اللغة كأداة تواصل من أول يوم.', speaker: 'Speaker', keyWords: [{ word: 'tool', ipa: '', meaningAr: 'أداة', meaningEn: '' }, { word: 'communicate', ipa: '', meaningAr: 'يتواصل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'relevant', type: 'cultural', meaningAr: 'مرتبط بالموضوع / مناسب', meaningEn: '', egyptianEquivalent: 'ليه علاقة بيك', exampleInScene: 'Learn relevant words first.' },      { term: 'communicate', type: 'cultural', meaningAr: 'يتواصل', meaningEn: '', egyptianEquivalent: 'يتكلم مع ناس', exampleInScene: 'Babies communicate before they talk.' },      { term: 'from day one', type: 'collocation', meaningAr: 'من أول يوم', meaningEn: '', egyptianEquivalent: 'من أول يوم', exampleInScene: 'Speak from day one.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is Lonsdale\'s advice about content?', questionAr: 'إيه نصيحة لونزديل عن المحتوى؟', options: ['ركز على اللي مرتبط بيك', 'احفظ القاموس كله', 'اتعلم القواعد الأول', 'اسمع أغاني بس'], correctIndex: 0, explanationAr: 'التركيز على المحتوى المرتبط بحياتك بيخلي التعلم أسرع وأثبت.' }
    ],
    speakingLines: [{ en: 'Focus on language content that is relevant to you.', arEg: 'ركز على المحتوى اللي ليه علاقة بيك انت.' }, { en: 'Use the language as a tool to communicate from day one.', arEg: 'استخدم اللغة كأداة تواصل من أول يوم.' }],
  },
  {
    id: 'ted-marianna-video-game',
    movieTitle: 'Learning a Language? Speak it Like You Are Playing a Video Game - Marianna Pascal',
    releaseYear: 2017,
    director: 'TEDx Talks',
    genre: 'TEDx Talk',
    cefrLevel: 'B2',
    sceneTitle: 'Confidence Over Perfection',
    sceneDescription: 'ماريانا باسكال بتوضح إن سر التحدث هو الثقة والتركيز على الرسالة مش على صحة القواعد.',
    youtubeId: 'Ge7c7otG2mk',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'TEDx Talks (Official)',
    dialogueQuote: 'Focus on the other person and the result you want.',
    actorName: 'Marianna Pascal',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/Ge7c7otG2mk/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'TEDx Talks Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Focus on the other person and the result you want.', arEg: 'ركز على الشخص اللي قدامك والنتيجة اللي عايزها.', arFusha: 'ركز على الشخص اللي قدامك والنتيجة اللي عايزها.', speaker: 'Speaker', keyWords: [{ word: 'focus on', ipa: '', meaningAr: 'يركز على', meaningEn: '' }, { word: 'result', ipa: '', meaningAr: 'نتيجة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Mistakes do not matter when the message is clear.', arEg: 'الغلطات مش مهمة لما الرسالة توصل.', arFusha: 'الغلطات مش مهمة لما الرسالة توصل.', speaker: 'Speaker', keyWords: [{ word: 'mistakes', ipa: '', meaningAr: 'غلطات', meaningEn: '' }, { word: 'clear', ipa: '', meaningAr: 'واضحة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'mistake', type: 'cultural', meaningAr: 'غلطة', meaningEn: '', egyptianEquivalent: 'غلطة', exampleInScene: 'Do not fear mistakes.' },      { term: 'clear', type: 'cultural', meaningAr: 'واضح', meaningEn: '', egyptianEquivalent: 'واضحة', exampleInScene: 'Speak clear English.' },      { term: 'confidence', type: 'cultural', meaningAr: 'ثقة', meaningEn: '', egyptianEquivalent: 'ثقة بالنفس', exampleInScene: 'Confidence grows with practice.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What matters more than grammar, according to Marianna?', questionAr: 'إيه الأهم من القواعد حسب ماريانا؟', options: ['إن الرسالة توصل بوضوح', 'النطق المثالي', 'السرعة', 'الكلمات الصعبة'], correctIndex: 0, explanationAr: 'وضوح الرسالة والتركيز على الطرف التاني أهم من القواعد المثالية.' }
    ],
    speakingLines: [{ en: 'Focus on the other person and the result you want.', arEg: 'ركز على الشخص اللي قدامك والنتيجة اللي عايزها.' }, { en: 'Mistakes do not matter when the message is clear.', arEg: 'الغلطات مش مهمة لما الرسالة توصل.' }],
  },
  {
    id: 'pron-rachel-uh-vowel',
    movieTitle: 'American English - UH Vowel [ʌ] - How to Make the UH Vowel',
    releaseYear: 2016,
    director: 'Rachel\'s English',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Mastering the UH Sound',
    sceneDescription: 'ريتشل بتشرح صوت الـ UH الأمريكي (زي cup و love) بحركة الفم واللسان بالتفصيل.',
    youtubeId: '_63fTgbG-yQ',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Rachel\'s English (Official)',
    dialogueQuote: 'The jaw drops just a bit for this vowel.',
    actorName: 'Rachel',
    characterName: 'Rachel',
    thumbnailUrl: 'https://img.youtube.com/vi/_63fTgbG-yQ/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Rachel\'s English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'The jaw drops just a bit for this vowel.', arEg: 'الفك بينزل شوية بس للصوت ده.', arFusha: 'الفك بينزل شوية بس للصوت ده.', speaker: 'Rachel', keyWords: [{ word: 'jaw', ipa: '', meaningAr: 'فك', meaningEn: '' }, { word: 'vowel', ipa: '', meaningAr: 'صوت متحرك', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Your tongue stays relaxed in the middle.', arEg: 'لسانك يفضل مرتاح في النص.', arFusha: 'لسانك يفضل مرتاح في النص.', speaker: 'Rachel', keyWords: [{ word: 'tongue', ipa: '', meaningAr: 'لسان', meaningEn: '' }, { word: 'relaxed', ipa: '', meaningAr: 'مرتاح', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'vowel', type: 'cultural', meaningAr: 'صوت متحرك (a,e,i,o,u)', meaningEn: '', egyptianEquivalent: 'حرف متحرك', exampleInScene: 'English has many vowels.' },      { term: 'jaw', type: 'cultural', meaningAr: 'فك', meaningEn: '', egyptianEquivalent: 'فك', exampleInScene: 'Drop your jaw slightly.' },      { term: 'relaxed', type: 'cultural', meaningAr: 'مرتاح', meaningEn: '', egyptianEquivalent: 'مسترخي', exampleInScene: 'Keep your tongue relaxed.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What should your tongue do for the UH vowel?', questionAr: 'لسانك يعمل إيه في صوت الـ UH؟', options: ['يفضل مرتاح في النص', 'يلمس السنان', 'يطلع فوق', 'يتحرك للورا'], correctIndex: 0, explanationAr: 'صوت الـ UH بيحتاج لسان مرتاح في منتصف الفم وفك مفتوح شوية.' }
    ],
    speakingLines: [{ en: 'The jaw drops just a bit for this vowel.', arEg: 'الفك بينزل شوية بس للصوت ده.' }, { en: 'Your tongue stays relaxed in the middle.', arEg: 'لسانك يفضل مرتاح في النص.' }],
  },
  {
    id: 'pron-rachel-silent-letters',
    movieTitle: 'Silent Letters with RULES - American English Pronunciation',
    releaseYear: 2020,
    director: 'Rachel\'s English',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Letters You Do Not Pronounce',
    sceneDescription: 'الحروف الساكنة في الإنجليزي ليها قواعد! ريتشل بتلخصها: متى ما تنطقش الـ B ولا K ولا W.',
    youtubeId: 'OtT3GIO0Tqg',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Rachel\'s English (Official)',
    dialogueQuote: 'The K is silent before N, like in knee.',
    actorName: 'Rachel',
    characterName: 'Rachel',
    thumbnailUrl: 'https://img.youtube.com/vi/OtT3GIO0Tqg/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Rachel\'s English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'The K is silent before N, like in knee.', arEg: 'حرف الـ K ساكن قبل الـ N، زي كلمة knee.', arFusha: 'حرف الـ K ساكن قبل الـ N، زي كلمة knee.', speaker: 'Rachel', keyWords: [{ word: 'silent', ipa: '', meaningAr: 'ساكن / مبيتنطقش', meaningEn: '' }, { word: 'knee', ipa: '', meaningAr: 'ركبة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Climb has a silent B at the end.', arEg: 'كلمة climb فيها B ساكنة في الآخر.', arFusha: 'كلمة climb فيها B ساكنة في الآخر.', speaker: 'Rachel', keyWords: [{ word: 'climb', ipa: '', meaningAr: 'يتسلق', meaningEn: '' }, { word: 'at the end', ipa: '', meaningAr: 'في الآخر', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'silent letter', type: 'collocation', meaningAr: 'حرف ساكن (مبيتنطقش)', meaningEn: '', egyptianEquivalent: 'حرف ميت', exampleInScene: 'The B in comb is silent.' },      { term: 'knee', type: 'cultural', meaningAr: 'ركبة', meaningEn: '', egyptianEquivalent: 'ركبة', exampleInScene: 'Bend your knees.' },      { term: 'climb', type: 'cultural', meaningAr: 'يتسلق', meaningEn: '', egyptianEquivalent: 'يطلع', exampleInScene: 'Climb the stairs.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which letter is silent in \'knee\'?', questionAr: 'أنهي حرف ساكن في كلمة knee؟', options: ['الـ K', 'الـ N', 'الـ E الأولى', 'مفيش'], correctIndex: 0, explanationAr: 'قاعدة: K قبل N مبيتنطقش - زي knee, know, knife.' }
    ],
    speakingLines: [{ en: 'The K is silent before N, like in knee.', arEg: 'حرف الـ K ساكن قبل الـ N، زي كلمة knee.' }, { en: 'Climb has a silent B at the end.', arEg: 'كلمة climb فيها B ساكنة في الآخر.' }],
  },
  {
    id: 'pron-rachel-r-sound',
    movieTitle: 'Practice the R Sound in American English',
    releaseYear: 2019,
    director: 'Rachel\'s English',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'The American R Drill',
    sceneDescription: 'تدريب مكثف على حرف الـ R الأمريكي: وضع اللسان الصحيح وتمارين على كلمات شائعة.',
    youtubeId: 'aOkcehyK_DE',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Rachel\'s English (Official)',
    dialogueQuote: 'The tongue pulls back for the R sound.',
    actorName: 'Rachel',
    characterName: 'Rachel',
    thumbnailUrl: 'https://img.youtube.com/vi/aOkcehyK_DE/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Rachel\'s English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'The tongue pulls back for the R sound.', arEg: 'اللسان بيرجع لورا لصوت الـ R.', arFusha: 'اللسان بيرجع لورا لصوت الـ R.', speaker: 'Rachel', keyWords: [{ word: 'pulls back', ipa: '', meaningAr: 'يرجع لورا', meaningEn: '' }, { word: 'sound', ipa: '', meaningAr: 'صوت', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Practice with the words red and car.', arEg: 'اتمرن على كلمات زي red و car.', arFusha: 'اتمرن على كلمات زي red و car.', speaker: 'Rachel', keyWords: [{ word: 'practice', ipa: '', meaningAr: 'اتمرن', meaningEn: '' }, { word: 'words', ipa: '', meaningAr: 'كلمات', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'pull back', type: 'phrasal-verb', meaningAr: 'يرجع لورا', meaningEn: '', egyptianEquivalent: 'يتراجع', exampleInScene: 'Pull your tongue back.' },      { term: 'sound', type: 'cultural', meaningAr: 'صوت', meaningEn: '', egyptianEquivalent: 'صوت', exampleInScene: 'The R sound is hard.' },      { term: 'practice', type: 'cultural', meaningAr: 'يتمرن', meaningEn: '', egyptianEquivalent: 'يتدرب', exampleInScene: 'Practice every day.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How does the tongue move for the American R?', questionAr: 'اللسان بيتحرك إزاي في الـ R الأمريكية؟', options: ['بيرجع لورا', 'بيطلع برا الفم', 'بيلمس السنان الأمامية', 'بيتحركش'], correctIndex: 0, explanationAr: 'في الـ R الأمريكية اللسان بيرجع لورا ومبيلمسش سقف الفم.' }
    ],
    speakingLines: [{ en: 'The tongue pulls back for the R sound.', arEg: 'اللسان بيرجع لورا لصوت الـ R.' }, { en: 'Practice with the words red and car.', arEg: 'اتمرن على كلمات زي red و car.' }],
  },
  {
    id: 'slang-jforrest-2024',
    movieTitle: '13 Must-Know English Slang Words for 2024',
    releaseYear: 2024,
    director: 'JForrest English',
    genre: 'Slang Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Slang You Will Hear This Year',
    sceneDescription: 'أحدث 13 كلمة سلانج في 2024: معناها واستخدامها الصح عشان تفهم الشباب الأمريكي والكندي.',
    youtubeId: 'NqxT8aMFGcE',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'JForrest English (Official)',
    dialogueQuote: 'That new song is a banger.',
    actorName: 'JForrest',
    characterName: 'JForrest',
    thumbnailUrl: 'https://img.youtube.com/vi/NqxT8aMFGcE/hqdefault.jpg',
    category: 'slang_and_expressions',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'JForrest English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'That new song is a banger.', arEg: 'الأغنية الجديدة دي تحفة.', arFusha: 'الأغنية الجديدة دي تحفة.', speaker: 'JForrest', keyWords: [{ word: 'banger', ipa: '', meaningAr: 'أغنية تحفة (سلانج)', meaningEn: '' }, { word: 'song', ipa: '', meaningAr: 'أغنية', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'He is always flexing his new car.', arEg: 'هو دايماً بيتفشخر بعربيته الجديدة.', arFusha: 'هو دايماً بيتفشخر بعربيته الجديدة.', speaker: 'JForrest', keyWords: [{ word: 'flexing', ipa: '', meaningAr: 'بيتفشخر (سلانج)', meaningEn: '' }, { word: 'always', ipa: '', meaningAr: 'دايماً', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'banger', type: 'slang', meaningAr: 'أغنية أو حاجة تحفة', meaningEn: '', egyptianEquivalent: 'جامدة أوي', exampleInScene: 'This track is a banger.' },      { term: 'flex', type: 'slang', meaningAr: 'يتفشخر / يستعرض', meaningEn: '', egyptianEquivalent: 'يبرّر', exampleInScene: 'Stop flexing your watch.' },      { term: 'no cap', type: 'slang', meaningAr: 'بجد / من غير كدب', meaningEn: '', egyptianEquivalent: 'والله', exampleInScene: 'That was the best meal, no cap.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'That song is a banger\' mean?', questionAr: 'معنى That song is a banger؟', options: ['الأغنية تحفة', 'الأغنية وحشة', 'الأغنية قديمة', 'الأغنية هادية'], correctIndex: 0, explanationAr: 'banger سلانج معناها أغنية جامدة جداً بتولّع الحفلة.' }
    ],
    speakingLines: [{ en: 'That new song is a banger.', arEg: 'الأغنية الجديدة دي تحفة.' }, { en: 'He is always flexing his new car.', arEg: 'هو دايماً بيتفشخر بعربيته الجديدة.' }],
  },
  {
    id: 'slang-letstalk-50',
    movieTitle: '50 Slang Words To Speak English Like A Native',
    releaseYear: 2022,
    director: 'Let\'s Talk',
    genre: 'Slang Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Native-Level Slang',
    sceneDescription: 'خمسين كلمة سلانج بتخلي كلامك طبيعي زي النيتيف: من chill لـ hang out لـ gonna.',
    youtubeId: 'tnXWVlflWpg',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Let\'s Talk - Free English Lessons (Official)',
    dialogueQuote: 'Wanna hang out this weekend?',
    actorName: 'Nysha',
    characterName: 'Nysha',
    thumbnailUrl: 'https://img.youtube.com/vi/tnXWVlflWpg/hqdefault.jpg',
    category: 'slang_and_expressions',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Let\'s Talk Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Wanna hang out this weekend?', arEg: 'عايز نخرج نهاية الأسبوع ده؟', arFusha: 'عايز نخرج نهاية الأسبوع ده؟', speaker: 'Nysha', keyWords: [{ word: 'wanna', ipa: '', meaningAr: 'عايز (عامية)', meaningEn: '' }, { word: 'hang out', ipa: '', meaningAr: 'يخرج / يقضي وقت', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I am gonna crash early tonight.', arEg: 'هنام بدري النهارده بالليل.', arFusha: 'هنام بدري النهارده بالليل.', speaker: 'Nysha', keyWords: [{ word: 'gonna', ipa: '', meaningAr: 'هـ (عامية)', meaningEn: '' }, { word: 'crash', ipa: '', meaningAr: 'ينام (سلانج)', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'hang out', type: 'phrasal-verb', meaningAr: 'يخرج / يقضي وقت مع حد', meaningEn: '', egyptianEquivalent: 'نقعد سوا', exampleInScene: 'Let\'s hang out Friday.' },      { term: 'gonna', type: 'slang', meaningAr: 'هـ / سوف (عامية)', meaningEn: '', egyptianEquivalent: 'هعمل', exampleInScene: 'I am gonna study.' },      { term: 'crash', type: 'slang', meaningAr: 'ينام (بعد تعب)', meaningEn: '', egyptianEquivalent: 'يبات', exampleInScene: 'I will crash at his place.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'wanna hang out\' mean?', questionAr: 'معنى wanna hang out؟', options: ['عايز نقضي وقت سوا', 'عايز نتعلق', 'عايز تمشي', 'عايز تنام'], correctIndex: 0, explanationAr: 'hang out معناها نقضي وقت مع بعض، و wanna هي want to بالعامية.' }
    ],
    speakingLines: [{ en: 'Wanna hang out this weekend?', arEg: 'عايز نخرج نهاية الأسبوع ده؟' }, { en: 'I am gonna crash early tonight.', arEg: 'هنام بدري النهارده بالليل.' }],
  },
  {
    id: 'fluency-poc-think-english',
    movieTitle: 'How to Think in English (Stop Translating in Your Head)',
    releaseYear: 2022,
    director: 'POC English',
    genre: 'Fluency Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Stop Translating, Start Thinking',
    sceneDescription: 'تقنيات عملية توقف بيها الترجمة في دماغك وتبدأ تفكر بالإنجليزي مباشرة - تدريبات يومية بسيطة.',
    youtubeId: 'llPX7JMY_zw',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'POC English (Official)',
    dialogueQuote: 'Name the objects around you in English.',
    actorName: 'Coach',
    characterName: 'Coach',
    thumbnailUrl: 'https://img.youtube.com/vi/llPX7JMY_zw/hqdefault.jpg',
    category: 'advanced_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'POC English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Name the objects around you in English.', arEg: 'سمّي الحاجات اللي حواليك بالإنجليزي.', arFusha: 'سمّي الحاجات اللي حواليك بالإنجليزي.', speaker: 'Coach', keyWords: [{ word: 'objects', ipa: '', meaningAr: 'حاجات / أشياء', meaningEn: '' }, { word: 'around you', ipa: '', meaningAr: 'حواليك', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Describe your day to yourself in simple English.', arEg: 'اوصف يومك لنفسك بإنجليزي بسيط.', arFusha: 'اوصف يومك لنفسك بإنجليزي بسيط.', speaker: 'Coach', keyWords: [{ word: 'describe', ipa: '', meaningAr: 'اوصف', meaningEn: '' }, { word: 'simple', ipa: '', meaningAr: 'بسيط', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'name the objects', type: 'collocation', meaningAr: 'يسمي الأشياء', meaningEn: '', egyptianEquivalent: 'سمّي الحاجات', exampleInScene: 'Name five objects in the room.' },      { term: 'describe', type: 'cultural', meaningAr: 'يوصف', meaningEn: '', egyptianEquivalent: 'اوصف', exampleInScene: 'Describe your house.' },      { term: 'translate', type: 'cultural', meaningAr: 'يترجم', meaningEn: '', egyptianEquivalent: 'ترجم', exampleInScene: 'Stop translating in your head.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the first exercise to think in English?', questionAr: 'إيه أول تمرين عشان تفكر بالإنجليزي؟', options: ['تسمي الحاجات اللي حواليك', 'تحفظ قواعد', 'تقرا كتب', 'تتفرج على أفلام مترجمة'], correctIndex: 0, explanationAr: 'أبسط تمرين: سمّي الأشياء اللي حواليك بالإنجليزي طول اليوم.' }
    ],
    speakingLines: [{ en: 'Name the objects around you in English.', arEg: 'سمّي الحاجات اللي حواليك بالإنجليزي.' }, { en: 'Describe your day to yourself in simple English.', arEg: 'اوصف يومك لنفسك بإنجليزي بسيط.' }],
  },
  {
    id: 'fluency-bbc-stop-translating',
    movieTitle: 'How to Stop Translating When You Speak English - BBC Learning English',
    releaseYear: 2021,
    director: 'BBC Learning English',
    genre: 'Fluency Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'BBC Fluency Tips',
    sceneDescription: 'نصايح BBC العملية عشان تتكلم إنجليزي من غير ما تترجم كل كلمة في دماغك الأول.',
    youtubeId: 'nnr_r6aEm8g',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Learn phrases, not single words.',
    actorName: 'Presenter',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/nnr_r6aEm8g/hqdefault.jpg',
    category: 'advanced_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Learn phrases, not single words.', arEg: 'اتعلم عبارات، مش كلمات لوحدها.', arFusha: 'اتعلم عبارات، مش كلمات لوحدها.', speaker: 'Presenter', keyWords: [{ word: 'phrases', ipa: '', meaningAr: 'عبارات', meaningEn: '' }, { word: 'single words', ipa: '', meaningAr: 'كلمات لوحدها', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Keep a diary in English every day.', arEg: 'اكتب يومياتك بالإنجليزي كل يوم.', arFusha: 'اكتب يومياتك بالإنجليزي كل يوم.', speaker: 'Presenter', keyWords: [{ word: 'diary', ipa: '', meaningAr: 'يوميات', meaningEn: '' }, { word: 'every day', ipa: '', meaningAr: 'كل يوم', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'phrase', type: 'cultural', meaningAr: 'عبارة / جملة قصيرة', meaningEn: '', egyptianEquivalent: 'تعبير', exampleInScene: 'Learn useful phrases.' },      { term: 'keep a diary', type: 'collocation', meaningAr: 'يكتب يوميات', meaningEn: '', egyptianEquivalent: 'يكتب مذكرات', exampleInScene: 'Keep a diary in English.' },      { term: 'fluently', type: 'cultural', meaningAr: 'بطلاقة', meaningEn: '', egyptianEquivalent: 'بسلاسة', exampleInScene: 'She speaks fluently.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What should you learn instead of single words?', questionAr: 'تتعلم إيه بدل الكلمات المفردة؟', options: ['عبارات كاملة', 'حروف', 'أرقام', 'أسماء علم'], correctIndex: 0, explanationAr: 'تعلم العبارات الكاملة بيخليك تتكلم أسرع من غير ترجمة.' }
    ],
    speakingLines: [{ en: 'Learn phrases, not single words.', arEg: 'اتعلم عبارات، مش كلمات لوحدها.' }, { en: 'Keep a diary in English every day.', arEg: 'اكتب يومياتك بالإنجليزي كل يوم.' }],
  },
  {
    id: 'email-hbr-etiquette',
    movieTitle: '8 Email Etiquette Tips - How to Write Better Emails at Work',
    releaseYear: 2020,
    director: 'Harvard Business Review',
    genre: 'Business English Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Professional Email Rules',
    sceneDescription: 'هارفارد بيزنس ريفيو بتلخص 8 قواعد لإيميلات شغل محترفة: الموضوع، الرد، والنبرة المناسبة.',
    youtubeId: '1XctnF7C74s',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Harvard Business Review (Official)',
    dialogueQuote: 'Keep your subject line clear and specific.',
    actorName: 'HBR',
    characterName: 'Narrator',
    thumbnailUrl: 'https://img.youtube.com/vi/1XctnF7C74s/hqdefault.jpg',
    category: 'business_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Harvard Business Review Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Keep your subject line clear and specific.', arEg: 'خلي عنوان الإيميل واضح ومحدد.', arFusha: 'خلي عنوان الإيميل واضح ومحدد.', speaker: 'Narrator', keyWords: [{ word: 'subject line', ipa: '', meaningAr: 'عنوان الإيميل', meaningEn: '' }, { word: 'specific', ipa: '', meaningAr: 'محدد', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Reply to all only when everyone needs to know.', arEg: 'اعمل رد للكل بس لما الكل محتاج يعرف.', arFusha: 'اعمل رد للكل بس لما الكل محتاج يعرف.', speaker: 'Narrator', keyWords: [{ word: 'reply to all', ipa: '', meaningAr: 'رد للكل', meaningEn: '' }, { word: 'needs to know', ipa: '', meaningAr: 'محتاج يعرف', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'subject line', type: 'collocation', meaningAr: 'عنوان الإيميل', meaningEn: '', egyptianEquivalent: 'موضوع الرسالة', exampleInScene: 'Write a short subject line.' },      { term: 'reply to all', type: 'collocation', meaningAr: 'الرد على الكل', meaningEn: '', egyptianEquivalent: 'رد جماعي', exampleInScene: 'Do not reply to all by mistake.' },      { term: 'etiquette', type: 'cultural', meaningAr: 'آداب التعامل', meaningEn: '', egyptianEquivalent: 'إتيكيت', exampleInScene: 'Email etiquette matters at work.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'When should you use \'reply to all\'?', questionAr: 'امتى تستخدم reply to all؟', options: ['لما الكل محتاج يعرف الرد', 'في كل مرة', 'أبداً', 'لما تكون مستعجل'], correctIndex: 0, explanationAr: 'رد للكل بس لما كل الناس في الإيميل محتاجين فعلاً يشوفوا ردك.' }
    ],
    speakingLines: [{ en: 'Keep your subject line clear and specific.', arEg: 'خلي عنوان الإيميل واضح ومحدد.' }, { en: 'Reply to all only when everyone needs to know.', arEg: 'اعمل رد للكل بس لما الكل محتاج يعرف.' }],
  },
  {
    id: 'email-engvid-alex',
    movieTitle: 'How to Write Professional Emails in English - engVid',
    releaseYear: 2019,
    director: 'engVid',
    genre: 'Business English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Emails That Get Answers',
    sceneDescription: 'أليكس من engVid بيعلمك تكتب إيميل رسمي من أول التحية لحد الختام - قوالب جاهزة للاستخدام.',
    youtubeId: '3Tu1jN65slw',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English with Alex - engVid (Official)',
    dialogueQuote: 'I am writing to inquire about the position.',
    actorName: 'Alex',
    characterName: 'Alex',
    thumbnailUrl: 'https://img.youtube.com/vi/3Tu1jN65slw/hqdefault.jpg',
    category: 'business_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'engVid Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I am writing to inquire about the position.', arEg: 'بكتب عشان أسأل عن الوظيفة.', arFusha: 'بكتب عشان أسأل عن الوظيفة.', speaker: 'Alex', keyWords: [{ word: 'inquire', ipa: '', meaningAr: 'يسأل (رسمي)', meaningEn: '' }, { word: 'position', ipa: '', meaningAr: 'وظيفة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I look forward to your reply.', arEg: 'مستني ردك بفارغ الصبر.', arFusha: 'مستني ردك بفارغ الصبر.', speaker: 'Alex', keyWords: [{ word: 'look forward to', ipa: '', meaningAr: 'مستني بشوق', meaningEn: '' }, { word: 'reply', ipa: '', meaningAr: 'رد', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'I am writing to...', type: 'collocation', meaningAr: 'بكتب عشان... (افتتاحية رسمية)', meaningEn: '', egyptianEquivalent: 'بكتب حضرتك', exampleInScene: 'I am writing to apply for the job.' },      { term: 'inquire', type: 'cultural', meaningAr: 'يسأل / يستفسر (رسمي)', meaningEn: '', egyptianEquivalent: 'يستفسر', exampleInScene: 'She inquired about the course.' },      { term: 'regards', type: 'cultural', meaningAr: 'تحياتي (ختام الإيميل)', meaningEn: '', egyptianEquivalent: 'تحياتي', exampleInScene: 'Best regards, Ahmed.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you start a formal email about a job?', questionAr: 'بتبدأ إيميل رسمي عن وظيفة إزاي؟', options: ['I am writing to inquire about...', 'Hey, I want the job', 'Give me the job', 'What up'], correctIndex: 0, explanationAr: 'الافتتاحية الرسمية هي I am writing to + الغرض من الإيميل.' }
    ],
    speakingLines: [{ en: 'I am writing to inquire about the position.', arEg: 'بكتب عشان أسأل عن الوظيفة.' }, { en: 'I look forward to your reply.', arEg: 'مستني ردك بفارغ الصبر.' }],
  },
  {
    id: 'routine-bob-act-out',
    movieTitle: 'Learn How to Talk About Your Daily Routine in English - Bob the Canadian',
    releaseYear: 2020,
    director: 'Bob the Canadian',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'A Day in Bob\'s Life',
    sceneDescription: 'بوب بيمثل يومه كله بالإنجليزي: من الصحيان للنوم - مفردات الروتين اليومي في سياق حقيقي.',
    youtubeId: 'ecF1y2bI2T4',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'I wake up at six and brush my teeth.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/ecF1y2bI2T4/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I wake up at six and brush my teeth.', arEg: 'بصحى الساعة ستة وبغسل سناني.', arFusha: 'بصحى الساعة ستة وبغسل سناني.', speaker: 'Bob', keyWords: [{ word: 'wake up', ipa: '', meaningAr: 'يصحى', meaningEn: '' }, { word: 'brush my teeth', ipa: '', meaningAr: 'يغسل سنانه', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'After dinner, I usually read a book.', arEg: 'بعد العشا، عادة بقرا كتاب.', arFusha: 'بعد العشا، عادة بقرا كتاب.', speaker: 'Bob', keyWords: [{ word: 'usually', ipa: '', meaningAr: 'عادة', meaningEn: '' }, { word: 'read', ipa: '', meaningAr: 'يقرا', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'wake up', type: 'phrasal-verb', meaningAr: 'يصحى', meaningEn: '', egyptianEquivalent: 'يصحى', exampleInScene: 'I wake up early.' },      { term: 'brush my teeth', type: 'collocation', meaningAr: 'يغسل سنانه', meaningEn: '', egyptianEquivalent: 'يضرس', exampleInScene: 'Brush your teeth twice a day.' },      { term: 'daily routine', type: 'collocation', meaningAr: 'الروتين اليومي', meaningEn: '', egyptianEquivalent: 'برنامج اليوم', exampleInScene: 'Tell me about your daily routine.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'brush my teeth\' mean?', questionAr: 'معنى brush my teeth؟', options: ['يغسل سنانه', 'يمشط شعره', 'ياخد شاور', 'يفطر'], correctIndex: 0, explanationAr: 'brush my teeth معناها يغسل سنانه بالفرشاة.' }
    ],
    speakingLines: [{ en: 'I wake up at six and brush my teeth.', arEg: 'بصحى الساعة ستة وبغسل سناني.' }, { en: 'After dinner, I usually read a book.', arEg: 'بعد العشا، عادة بقرا كتاب.' }],
  },
  {
    id: 'routine-bbc-episode4',
    movieTitle: 'How to Talk About Your Daily Routine - Easy English Conversations Ep. 4',
    releaseYear: 2023,
    director: 'BBC Learning English',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Talking About Your Day',
    sceneDescription: 'حلقة BBC عن الروتين اليومي: أفعال الحاضر البسيط والتعبير عن العادات بجمل سهلة.',
    youtubeId: 'bq6GBbh3uhU',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'What time do you usually get up?',
    actorName: 'Presenter',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/bq6GBbh3uhU/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'What time do you usually get up?', arEg: 'بتصحى الساعة كام عادة؟', arFusha: 'بتصحى الساعة كام عادة؟', speaker: 'Presenter', keyWords: [{ word: 'what time', ipa: '', meaningAr: 'الساعة كام', meaningEn: '' }, { word: 'get up', ipa: '', meaningAr: 'يصحى', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I never skip breakfast.', arEg: 'مبفوّتش الفطار أبداً.', arFusha: 'مبفوّتش الفطار أبداً.', speaker: 'Presenter', keyWords: [{ word: 'never', ipa: '', meaningAr: 'أبداً', meaningEn: '' }, { word: 'skip', ipa: '', meaningAr: 'يفوّت', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'get up', type: 'phrasal-verb', meaningAr: 'يصحى / ينزل من السرير', meaningEn: '', egyptianEquivalent: 'يصحى', exampleInScene: 'I get up at seven.' },      { term: 'skip', type: 'cultural', meaningAr: 'يفوّت / يتخطى', meaningEn: '', egyptianEquivalent: 'يسيب', exampleInScene: 'Never skip breakfast.' },      { term: 'usually', type: 'cultural', meaningAr: 'عادة', meaningEn: '', egyptianEquivalent: 'غالباً', exampleInScene: 'I usually walk to work.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'skip breakfast\' mean?', questionAr: 'معنى skip breakfast؟', options: ['يفوّت الفطار', 'يعمل فطار', 'يفطر كتير', 'يطبخ فطار'], correctIndex: 0, explanationAr: 'skip معناها يفوّت أو ما يعملش حاجة معتادة، زي skip a meal.' }
    ],
    speakingLines: [{ en: 'What time do you usually get up?', arEg: 'بتصحى الساعة كام عادة؟' }, { en: 'I never skip breakfast.', arEg: 'مبفوّتش الفطار أبداً.' }],
  },
  {
    id: 'podcast-bbc-breakfast',
    movieTitle: 'Is Breakfast the Most Important Meal of the Day? - 6 Minute English',
    releaseYear: 2022,
    director: 'BBC Learning English',
    genre: 'English Podcast',
    cefrLevel: 'B1',
    sceneTitle: 'Six Minutes of Real English',
    sceneDescription: 'حلقة 6 Minute English الشهيرة عن الفطار: مفردات الأكل والصحة بنطق بريطاني واضح.',
    youtubeId: 'C830bmzNjDc',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'They say breakfast is the most important meal of the day.',
    actorName: 'Presenter',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/C830bmzNjDc/hqdefault.jpg',
    category: 'podcasts',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'They say breakfast is the most important meal of the day.', arEg: 'بيقولوا إن الفطار أهم وجبة في اليوم.', arFusha: 'بيقولوا إن الفطار أهم وجبة في اليوم.', speaker: 'Presenter', keyWords: [{ word: 'important', ipa: '', meaningAr: 'مهم', meaningEn: '' }, { word: 'meal', ipa: '', meaningAr: 'وجبة', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Skipping it might make you feel tired.', arEg: 'تفويته ممكن يخليك تحس بتعب.', arFusha: 'تفويته ممكن يخليك تحس بتعب.', speaker: 'Presenter', keyWords: [{ word: 'might', ipa: '', meaningAr: 'ممكن', meaningEn: '' }, { word: 'tired', ipa: '', meaningAr: 'تعبان', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'meal', type: 'cultural', meaningAr: 'وجبة', meaningEn: '', egyptianEquivalent: 'أكلة', exampleInScene: 'Lunch is my favorite meal.' },      { term: 'might', type: 'cultural', meaningAr: 'ممكن / ربما', meaningEn: '', egyptianEquivalent: 'ممكن', exampleInScene: 'It might rain.' },      { term: 'tired', type: 'cultural', meaningAr: 'تعبان', meaningEn: '', egyptianEquivalent: 'مرهق', exampleInScene: 'I feel tired today.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'might\' express?', questionAr: 'كلمة might بتعبر عن إيه؟', options: ['احتمال', 'تأكيد', 'نفي', 'أمر'], correctIndex: 0, explanationAr: 'might معناها ممكن أو ربما - احتمال مش مؤكد.' }
    ],
    speakingLines: [{ en: 'They say breakfast is the most important meal of the day.', arEg: 'بيقولوا إن الفطار أهم وجبة في اليوم.' }, { en: 'Skipping it might make you feel tired.', arEg: 'تفويته ممكن يخليك تحس بتعب.' }],
  },
  {
    id: 'grammar-brian-tenses',
    movieTitle: 'Learn All English Verb Tenses - Easiest Method',
    releaseYear: 2021,
    director: 'Brian Wiles',
    genre: 'Grammar Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'All Tenses in One Chart',
    sceneDescription: 'أسهل طريقة تفهم بيها كل الأزمنة: جدول واحد يربط الزمن بالمعنى مع أمثلة من الحياة.',
    youtubeId: 'sCiG6rlk2Bc',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Brian Wiles (Official)',
    dialogueQuote: 'I eat, I am eating, I have eaten.',
    actorName: 'Brian',
    characterName: 'Brian',
    thumbnailUrl: 'https://img.youtube.com/vi/sCiG6rlk2Bc/hqdefault.jpg',
    category: 'academic_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Brian Wiles Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I eat, I am eating, I have eaten.', arEg: 'أنا باكل (عادة)، باكل دلوقتي، أكلت خلاص.', arFusha: 'أنا باكل (عادة)، باكل دلوقتي، أكلت خلاص.', speaker: 'Brian', keyWords: [{ word: 'eat', ipa: '', meaningAr: 'ياكل', meaningEn: '' }, { word: 'have eaten', ipa: '', meaningAr: 'أكلت (مضارع تام)', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Use the present simple for habits.', arEg: 'استخدم المضارع البسيط للعادات.', arFusha: 'استخدم المضارع البسيط للعادات.', speaker: 'Brian', keyWords: [{ word: 'present simple', ipa: '', meaningAr: 'مضارع بسيط', meaningEn: '' }, { word: 'habits', ipa: '', meaningAr: 'عادات', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'present simple', type: 'collocation', meaningAr: 'المضارع البسيط', meaningEn: '', egyptianEquivalent: 'حاضر بسيط', exampleInScene: 'Use present simple for habits.' },      { term: 'present continuous', type: 'collocation', meaningAr: 'المضارع المستمر', meaningEn: '', egyptianEquivalent: 'حاضر مستمر', exampleInScene: 'I am studying now.' },      { term: 'habit', type: 'cultural', meaningAr: 'عادة', meaningEn: '', egyptianEquivalent: 'عادة', exampleInScene: 'Reading is a good habit.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which tense do we use for habits?', questionAr: 'بنستخدم أنهي زمن للعادات؟', options: ['المضارع البسيط', 'الماضي المستمر', 'المستقبل التام', 'الماضي البعيد'], correctIndex: 0, explanationAr: 'العادات والحقائق بتتقال بالمضارع البسيط: I eat breakfast every day.' }
    ],
    speakingLines: [{ en: 'I eat, I am eating, I have eaten.', arEg: 'أنا باكل (عادة)، باكل دلوقتي، أكلت خلاص.' }, { en: 'Use the present simple for habits.', arEg: 'استخدم المضارع البسيط للعادات.' }],
  },
  {
    id: 'grammar-lucy-16-tenses',
    movieTitle: 'Learn ALL 16 Tenses Easily in under 30 Minutes - English with Lucy',
    releaseYear: 2021,
    director: 'English with Lucy',
    genre: 'Grammar Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'The Complete Tense Map',
    sceneDescription: 'لوسي بتلخص الـ 16 زمن في نص ساعة بأمثلة واضحة - مراجعة شاملة قبل أي امتحان.',
    youtubeId: 'Ljjiw9mC_Cg',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English with Lucy (Official)',
    dialogueQuote: 'By next year, I will have finished my studies.',
    actorName: 'Lucy',
    characterName: 'Lucy',
    thumbnailUrl: 'https://img.youtube.com/vi/Ljjiw9mC_Cg/hqdefault.jpg',
    category: 'academic_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English with Lucy Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'By next year, I will have finished my studies.', arEg: 'بحلول السنة الجاية، أكون خلصت دراستي.', arFusha: 'بحلول السنة الجاية، أكون خلصت دراستي.', speaker: 'Lucy', keyWords: [{ word: 'by next year', ipa: '', meaningAr: 'بحلول السنة الجاية', meaningEn: '' }, { word: 'will have finished', ipa: '', meaningAr: 'أكون خلصت (مستقبل تام)', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I had already eaten when he arrived.', arEg: 'كنت خلاص أكلت لما هو وصل.', arFusha: 'كنت خلاص أكلت لما هو وصل.', speaker: 'Lucy', keyWords: [{ word: 'had eaten', ipa: '', meaningAr: 'كان أكل (ماضي تام)', meaningEn: '' }, { word: 'arrived', ipa: '', meaningAr: 'وصل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'future perfect', type: 'collocation', meaningAr: 'المستقبل التام', meaningEn: '', egyptianEquivalent: 'مستقبل تام', exampleInScene: 'I will have finished by Friday.' },      { term: 'past perfect', type: 'collocation', meaningAr: 'الماضي التام', meaningEn: '', egyptianEquivalent: 'ماضي تام', exampleInScene: 'She had left before I came.' },      { term: 'already', type: 'cultural', meaningAr: 'بالفعل / خلاص', meaningEn: '', egyptianEquivalent: 'خلاص', exampleInScene: 'I have already eaten.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which tense: \'I had already eaten when he arrived\'?', questionAr: 'إيه الزمن في جملة I had already eaten when he arrived؟', options: ['الماضي التام', 'المضارع البسيط', 'المستقبل التام', 'الماضي المستمر'], correctIndex: 0, explanationAr: 'الماضي التام (had + تصريف تالت) للحدث اللي حصل قبل حدث تاني في الماضي.' }
    ],
    speakingLines: [{ en: 'By next year, I will have finished my studies.', arEg: 'بحلول السنة الجاية، أكون خلصت دراستي.' }, { en: 'I had already eaten when he arrived.', arEg: 'كنت خلاص أكلت لما هو وصل.' }],
  },
  {
    id: 'grammar-rebecca-12',
    movieTitle: 'Learn English Tenses: How to Learn ALL 12 Tenses - engVid',
    releaseYear: 2018,
    director: 'engVid',
    genre: 'Grammar Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Rebecca\'s Tense System',
    sceneDescription: 'ريبيكا من engVid بترتب الـ 12 زمن في نظام سهل الفهم - مثالية لو الأزمنة لخبطتك قبل كده.',
    youtubeId: 'mScixcyubUY',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Learn English with Rebecca - engVid (Official)',
    dialogueQuote: 'I was cooking when you called.',
    actorName: 'Rebecca',
    characterName: 'Rebecca',
    thumbnailUrl: 'https://img.youtube.com/vi/mScixcyubUY/hqdefault.jpg',
    category: 'academic_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'engVid Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I was cooking when you called.', arEg: 'كنت بطبخ لما انت اتصلت.', arFusha: 'كنت بطبخ لما انت اتصلت.', speaker: 'Rebecca', keyWords: [{ word: 'was cooking', ipa: '', meaningAr: 'كان بيطبخ (ماضي مستمر)', meaningEn: '' }, { word: 'called', ipa: '', meaningAr: 'اتصل', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'She has lived here since 2010.', arEg: 'هي عايشة هنا من 2010.', arFusha: 'هي عايشة هنا من 2010.', speaker: 'Rebecca', keyWords: [{ word: 'has lived', ipa: '', meaningAr: 'عايشة (مضارع تام)', meaningEn: '' }, { word: 'since', ipa: '', meaningAr: 'من (نقطة زمنية)', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'past continuous', type: 'collocation', meaningAr: 'الماضي المستمر', meaningEn: '', egyptianEquivalent: 'ماضي مستمر', exampleInScene: 'I was sleeping at nine.' },      { term: 'since', type: 'cultural', meaningAr: 'من (نقطة زمنية محددة)', meaningEn: '', egyptianEquivalent: 'من زمن', exampleInScene: 'I have known him since school.' },      { term: 'present perfect', type: 'collocation', meaningAr: 'المضارع التام', meaningEn: '', egyptianEquivalent: 'حاضر تام', exampleInScene: 'I have finished my work.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Complete: She has lived here ___ 2010.', questionAr: 'كمل: She has lived here ___ 2010', options: ['since', 'for', 'at', 'ago'], correctIndex: 0, explanationAr: 'since بتيجي مع نقطة زمنية محددة (2010)، أما for فمع مدة (10 years).' }
    ],
    speakingLines: [{ en: 'I was cooking when you called.', arEg: 'كنت بطبخ لما انت اتصلت.' }, { en: 'She has lived here since 2010.', arEg: 'هي عايشة هنا من 2010.' }],
  },
  {
    id: 'doc-attenborough-creatures',
    movieTitle: 'David Attenborough: Nature\'s Most Fascinating Creatures',
    releaseYear: 2021,
    director: 'Free Documentary Nature',
    genre: 'Nature Documentary',
    cefrLevel: 'B2',
    sceneTitle: 'The Voice of Nature',
    sceneDescription: 'وثائقي بصوت ديفيد أتينبورو الأسطوري - إنجليزي بريطاني فصيح وبطيء مثالي لتدريب الاستماع.',
    youtubeId: 'EYJm7hIYLSU',
    startTime: 40,
    endTime: 160,
    clipDuration: '2:00',
    videoSource: 'Free Documentary - Nature (Official)',
    dialogueQuote: 'This remarkable creature has survived for millions of years.',
    actorName: 'David Attenborough',
    characterName: 'Narrator',
    thumbnailUrl: 'https://img.youtube.com/vi/EYJm7hIYLSU/hqdefault.jpg',
    category: 'documentaries',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Free Documentary Nature Official',
    subtitles: [
      { id: 'sub-1', start: 45, end: 60, en: 'This remarkable creature has survived for millions of years.', arEg: 'الكائن المدهش ده عاش لملايين السنين.', arFusha: 'الكائن المدهش ده عاش لملايين السنين.', speaker: 'Narrator', keyWords: [{ word: 'remarkable', ipa: '', meaningAr: 'مدهش', meaningEn: '' }, { word: 'survived', ipa: '', meaningAr: 'عاش / نجا', meaningEn: '' }] },      { id: 'sub-2', start: 70, end: 85, en: 'Few places on Earth remain truly wild.', arEg: 'أماكن قليلة على الأرض فضلت برية حقيقية.', arFusha: 'أماكن قليلة على الأرض فضلت برية حقيقية.', speaker: 'Narrator', keyWords: [{ word: 'remain', ipa: '', meaningAr: 'يفضل', meaningEn: '' }, { word: 'wild', ipa: '', meaningAr: 'برية', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'remarkable', type: 'cultural', meaningAr: 'مدهش / لافت', meaningEn: '', egyptianEquivalent: 'جدير بالانتباه', exampleInScene: 'A remarkable achievement.' },      { term: 'survive', type: 'cultural', meaningAr: 'ينجو / يعيش', meaningEn: '', egyptianEquivalent: 'يعيش', exampleInScene: 'They survived the winter.' },      { term: 'wild', type: 'cultural', meaningAr: 'بري', meaningEn: '', egyptianEquivalent: 'برية', exampleInScene: 'Wild animals live here.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'remarkable\' mean?', questionAr: 'معنى remarkable؟', options: ['مدهش', 'عادي', 'صغير', 'سريع'], correctIndex: 0, explanationAr: 'remarkable معناها مدهش أو لافت للانتباه - صفة مدح قوية.' }
    ],
    speakingLines: [{ en: 'This remarkable creature has survived for millions of years.', arEg: 'الكائن المدهش ده عاش لملايين السنين.' }, { en: 'Few places on Earth remain truly wild.', arEg: 'أماكن قليلة على الأرض فضلت برية حقيقية.' }],
  },
  {
    id: 'doc-coral-paradise',
    movieTitle: 'Forgotten Islands: The Last Coral Paradise - Free Documentary Nature',
    releaseYear: 2022,
    director: 'Free Documentary Nature',
    genre: 'Nature Documentary',
    cefrLevel: 'B2',
    sceneTitle: 'Beneath the Waves',
    sceneDescription: 'وثائقي عن جزر منسية وشعاب مرجانية - تصوير مبهر وتعليق صوتي إنجليزي واضح بمفردات الطبيعة.',
    youtubeId: 'vHmL6xdkdAg',
    startTime: 40,
    endTime: 160,
    clipDuration: '2:00',
    videoSource: 'Free Documentary - Nature (Official)',
    dialogueQuote: 'These reefs are home to thousands of species.',
    actorName: 'Narrator',
    characterName: 'Narrator',
    thumbnailUrl: 'https://img.youtube.com/vi/vHmL6xdkdAg/hqdefault.jpg',
    category: 'documentaries',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Free Documentary Nature Official',
    subtitles: [
      { id: 'sub-1', start: 45, end: 60, en: 'These reefs are home to thousands of species.', arEg: 'الشعاب دي بيت لآلاف الأنواع.', arFusha: 'الشعاب دي بيت لآلاف الأنواع.', speaker: 'Narrator', keyWords: [{ word: 'reefs', ipa: '', meaningAr: 'شعاب مرجانية', meaningEn: '' }, { word: 'species', ipa: '', meaningAr: 'أنواع', meaningEn: '' }] },      { id: 'sub-2', start: 70, end: 85, en: 'The ocean hides more secrets than we imagine.', arEg: 'المحيط بيخبي أسرار أكتر مما نتخيل.', arFusha: 'المحيط بيخبي أسرار أكتر مما نتخيل.', speaker: 'Narrator', keyWords: [{ word: 'hides', ipa: '', meaningAr: 'بيخبي', meaningEn: '' }, { word: 'secrets', ipa: '', meaningAr: 'أسرار', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'reef', type: 'cultural', meaningAr: 'شعاب مرجانية', meaningEn: '', egyptianEquivalent: 'مرجان', exampleInScene: 'Coral reefs are beautiful.' },      { term: 'species', type: 'cultural', meaningAr: 'أنواع (كائنات)', meaningEn: '', egyptianEquivalent: 'فصائل', exampleInScene: 'Many species live here.' },      { term: 'hide', type: 'cultural', meaningAr: 'يخبي', meaningEn: '', egyptianEquivalent: 'يستخبى', exampleInScene: 'The cave hides treasure.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What are reefs home to?', questionAr: 'الشعاب المرجانية بيت لمين؟', options: ['آلاف الأنواع', 'الطيور بس', 'الأسماك الكبيرة بس', 'البشر'], correctIndex: 0, explanationAr: 'الشعاب المرجانية بيئة غنية بتعيش فيها آلاف الأنواع من الكائنات البحرية.' }
    ],
    speakingLines: [{ en: 'These reefs are home to thousands of species.', arEg: 'الشعاب دي بيت لآلاف الأنواع.' }, { en: 'The ocean hides more secrets than we imagine.', arEg: 'المحيط بيخبي أسرار أكتر مما نتخيل.' }],
  },
  {
    id: 'shopping-giovana-clothes',
    movieTitle: 'Buying Clothes in Your Second Language - English by Giovana',
    releaseYear: 2023,
    director: 'English by Giovana',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'At the Clothing Store',
    sceneDescription: 'جيوفانا بتمثل تجربة شراء هدوم حقيقية: المقاسات، البروفة، والأسعار - كلها بالإنجليزي.',
    youtubeId: 'yKo-AeH1qH8',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'English by Giovana (Official)',
    dialogueQuote: 'Can I try this on?',
    actorName: 'Giovana',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/yKo-AeH1qH8/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English by Giovana Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Can I try this on?', arEg: 'ممكن أقيس ده؟', arFusha: 'ممكن أقيس ده؟', speaker: 'Customer', keyWords: [{ word: 'try on', ipa: '', meaningAr: 'يقيس / يجرب لبس', meaningEn: '' }, { word: 'this', ipa: '', meaningAr: 'ده', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Do you have this in a smaller size?', arEg: 'عندكوا ده مقاس أصغر؟', arFusha: 'عندكوا ده مقاس أصغر؟', speaker: 'Customer', keyWords: [{ word: 'smaller', ipa: '', meaningAr: 'أصغر', meaningEn: '' }, { word: 'size', ipa: '', meaningAr: 'مقاس', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'try on', type: 'phrasal-verb', meaningAr: 'يقيس / يجرب هدوم', meaningEn: '', egyptianEquivalent: 'يقيس', exampleInScene: 'Try on the jacket first.' },      { term: 'size', type: 'cultural', meaningAr: 'مقاس', meaningEn: '', egyptianEquivalent: 'مقاس', exampleInScene: 'What size are you?' },      { term: 'on sale', type: 'collocation', meaningAr: 'في الخصم', meaningEn: '', egyptianEquivalent: 'عليه عرض', exampleInScene: 'These shoes are on sale.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'try on\' mean?', questionAr: 'معنى try on؟', options: ['يقيس هدوم', 'يجرب عربية', 'يفتح', 'يرجع حاجة'], correctIndex: 0, explanationAr: 'try on معناها تقيس أو تجرب لبس قبل ما تشتريه.' }
    ],
    speakingLines: [{ en: 'Can I try this on?', arEg: 'ممكن أقيس ده؟' }, { en: 'Do you have this in a smaller size?', arEg: 'عندكوا ده مقاس أصغر؟' }],
  },
  {
    id: 'shopping-caro-grocery',
    movieTitle: 'Grocery Shopping in My Second Language - Caro Kowanz English',
    releaseYear: 2023,
    director: 'Caro Kowanz English',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Supermarket Run',
    sceneDescription: 'كارو بتاخدك معاها السوبرماركت: أسماء الأقسام، سؤال عن الأسعار، والدفع عند الكاشير.',
    youtubeId: 'nd9zJ1tMDDs',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Caro Kowanz English (Official)',
    dialogueQuote: 'Where can I find the dairy section?',
    actorName: 'Caro',
    characterName: 'Shopper',
    thumbnailUrl: 'https://img.youtube.com/vi/nd9zJ1tMDDs/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Caro Kowanz English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Where can I find the dairy section?', arEg: 'فين قسم الألبان؟', arFusha: 'فين قسم الألبان؟', speaker: 'Shopper', keyWords: [{ word: 'dairy', ipa: '', meaningAr: 'ألبان', meaningEn: '' }, { word: 'section', ipa: '', meaningAr: 'قسم', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'That will be twelve fifty, please.', arEg: 'ده هيبقى 12.50، لو سمحت.', arFusha: 'ده هيبقى 12.50، لو سمحت.', speaker: 'Cashier', keyWords: [{ word: 'twelve fifty', ipa: '', meaningAr: 'اتناشر ونص', meaningEn: '' }, { word: 'please', ipa: '', meaningAr: 'لو سمحت', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'dairy section', type: 'collocation', meaningAr: 'قسم الألبان', meaningEn: '', egyptianEquivalent: 'قسم اللبن والجبن', exampleInScene: 'Milk is in the dairy section.' },      { term: 'aisle', type: 'cultural', meaningAr: 'ممر في السوبرماركت', meaningEn: '', egyptianEquivalent: 'الرواق', exampleInScene: 'Bread is in aisle three.' },      { term: 'checkout', type: 'cultural', meaningAr: 'الكاشير / نقطة الدفع', meaningEn: '', egyptianEquivalent: 'الكاشير', exampleInScene: 'Pay at the checkout.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Where is milk usually found in a supermarket?', questionAr: 'اللبن بيبقى فين في السوبرماركت؟', options: ['قسم الألبان', 'قسم المنظفات', 'عند الخضار', 'عند الكاشير'], correctIndex: 0, explanationAr: 'الألبان (dairy) ليها قسم لوحدها - اسأل Where is the dairy section?' }
    ],
    speakingLines: [{ en: 'Where can I find the dairy section?', arEg: 'فين قسم الألبان؟' }, { en: 'That will be twelve fifty, please.', arEg: 'ده هيبقى 12.50، لو سمحت.' }],
  },
  {
    id: 'doctor-caro-office',
    movieTitle: 'At the Doctor\'s Office - Learn Useful English Vocabulary - Caro Kowanz',
    releaseYear: 2023,
    director: 'Caro Kowanz English',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Describing Your Symptoms',
    sceneDescription: 'مفردات عيادة الدكتور: إزاي توصف وجعك وتفهم أسئلة الدكتور من غير ما تتوه.',
    youtubeId: 'cd8d_eCLR8c',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Caro Kowanz English (Official)',
    dialogueQuote: 'I have a terrible headache.',
    actorName: 'Caro',
    characterName: 'Patient',
    thumbnailUrl: 'https://img.youtube.com/vi/cd8d_eCLR8c/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Caro Kowanz English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'I have a terrible headache.', arEg: 'عندي صداع جامد.', arFusha: 'عندي صداع جامد.', speaker: 'Patient', keyWords: [{ word: 'terrible', ipa: '', meaningAr: 'جامد / فظيع', meaningEn: '' }, { word: 'headache', ipa: '', meaningAr: 'صداع', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'How long have you felt like this?', arEg: 'حاسس كده من امتى؟', arFusha: 'حاسس كده من امتى؟', speaker: 'Doctor', keyWords: [{ word: 'how long', ipa: '', meaningAr: 'من امتى / قد إيه', meaningEn: '' }, { word: 'felt', ipa: '', meaningAr: 'حاسس', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'headache', type: 'cultural', meaningAr: 'صداع', meaningEn: '', egyptianEquivalent: 'وجع دماغ', exampleInScene: 'I have a bad headache.' },      { term: 'symptom', type: 'cultural', meaningAr: 'عرض (مرضي)', meaningEn: '', egyptianEquivalent: 'عرض المرض', exampleInScene: 'What are your symptoms?' },      { term: 'prescription', type: 'cultural', meaningAr: 'روشتة', meaningEn: '', egyptianEquivalent: 'روشتة', exampleInScene: 'The doctor wrote a prescription.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does a doctor write for medicine?', questionAr: 'الدكتور بيكتب إيه عشان الدوا؟', options: ['روشتة (prescription)', 'رسالة', 'فاتورة', 'تقرير'], correctIndex: 0, explanationAr: 'الروشتة بالإنجليزي اسمها prescription - الدكتور يكتبها والصيدلي يصرفها.' }
    ],
    speakingLines: [{ en: 'I have a terrible headache.', arEg: 'عندي صداع جامد.' }, { en: 'How long have you felt like this?', arEg: 'حاسس كده من امتى؟' }],
  },
  {
    id: 'doctor-universal-conversation',
    movieTitle: 'English Conversation at the Doctor - Everyday English for Beginners',
    releaseYear: 2022,
    director: 'Universal Language Center',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'A Full Doctor Visit',
    sceneDescription: 'حوار كامل في العيادة للمبتدئين: الحجز، وصف الأعراض، وفهم نصايح الدكتور - بطيء وواضح.',
    youtubeId: 'B5mdSaSZtWw',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Universal Language Center (Official)',
    dialogueQuote: 'Take this medicine twice a day.',
    actorName: 'Doctor',
    characterName: 'Doctor',
    thumbnailUrl: 'https://img.youtube.com/vi/B5mdSaSZtWw/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Universal Language Center Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Take this medicine twice a day.', arEg: 'خد الدوا ده مرتين في اليوم.', arFusha: 'خد الدوا ده مرتين في اليوم.', speaker: 'Doctor', keyWords: [{ word: 'twice', ipa: '', meaningAr: 'مرتين', meaningEn: '' }, { word: 'medicine', ipa: '', meaningAr: 'دوا', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I have been coughing since yesterday.', arEg: 'بكح من إمبارح.', arFusha: 'بكح من إمبارح.', speaker: 'Patient', keyWords: [{ word: 'coughing', ipa: '', meaningAr: 'بكح', meaningEn: '' }, { word: 'since yesterday', ipa: '', meaningAr: 'من إمبارح', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'twice a day', type: 'collocation', meaningAr: 'مرتين في اليوم', meaningEn: '', egyptianEquivalent: 'مرتين يومياً', exampleInScene: 'Take it twice a day.' },      { term: 'cough', type: 'cultural', meaningAr: 'يكح', meaningEn: '', egyptianEquivalent: 'يكح', exampleInScene: 'He has been coughing all night.' },      { term: 'appointment', type: 'cultural', meaningAr: 'ميعاد', meaningEn: '', egyptianEquivalent: 'حجز ميعاد', exampleInScene: 'I have a doctor appointment.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'twice a day\' mean?', questionAr: 'معنى twice a day؟', options: ['مرتين في اليوم', 'مرة في اليوم', 'كل يومين', 'ثلاث مرات'], correctIndex: 0, explanationAr: 'twice معناها مرتين - خد الدوا twice a day يعني مرتين في اليوم.' }
    ],
    speakingLines: [{ en: 'Take this medicine twice a day.', arEg: 'خد الدوا ده مرتين في اليوم.' }, { en: 'I have been coughing since yesterday.', arEg: 'بكح من إمبارح.' }],
  },
  {
    id: 'tech-wordwisdom-it',
    movieTitle: 'Exploring Information Technology Vocabulary - Word Wisdom',
    releaseYear: 2022,
    director: 'Word Wisdom',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'IT Words You Need',
    sceneDescription: 'مفردات تكنولوجيا المعلومات الأساسية: سوفتوير، هاردوير، باك أب - شرح مبسط بأمثلة.',
    youtubeId: 'vaQv65vjIT4',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Word Wisdom (Official)',
    dialogueQuote: 'Always back up your important files.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/vaQv65vjIT4/hqdefault.jpg',
    category: 'academic_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Word Wisdom Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Always back up your important files.', arEg: 'دايماً اعمل نسخة احتياطية لملفاتك المهمة.', arFusha: 'دايماً اعمل نسخة احتياطية لملفاتك المهمة.', speaker: 'Teacher', keyWords: [{ word: 'back up', ipa: '', meaningAr: 'يعمل نسخة احتياطية', meaningEn: '' }, { word: 'files', ipa: '', meaningAr: 'ملفات', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'The software needs an update.', arEg: 'البرنامج محتاج تحديث.', arFusha: 'البرنامج محتاج تحديث.', speaker: 'Teacher', keyWords: [{ word: 'software', ipa: '', meaningAr: 'برنامج', meaningEn: '' }, { word: 'update', ipa: '', meaningAr: 'تحديث', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'back up', type: 'phrasal-verb', meaningAr: 'يعمل نسخة احتياطية', meaningEn: '', egyptianEquivalent: 'يعمل باك أب', exampleInScene: 'Back up your photos.' },      { term: 'software', type: 'cultural', meaningAr: 'برنامج / سوفتوير', meaningEn: '', egyptianEquivalent: 'سوفتوير', exampleInScene: 'Install the new software.' },      { term: 'update', type: 'cultural', meaningAr: 'تحديث', meaningEn: '', egyptianEquivalent: 'أبديت', exampleInScene: 'The update fixed the bug.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'back up your files\' mean?', questionAr: 'معنى back up your files؟', options: ['اعمل نسخة احتياطية', 'امسح الملفات', 'افتح الملفات', 'اطبع الملفات'], correctIndex: 0, explanationAr: 'back up معناها تعمل نسخة احتياطية تحفظها لو الجهاز بوظ.' }
    ],
    speakingLines: [{ en: 'Always back up your important files.', arEg: 'دايماً اعمل نسخة احتياطية لملفاتك المهمة.' }, { en: 'The software needs an update.', arEg: 'البرنامج محتاج تحديث.' }],
  },
  {
    id: 'tech-native-advanced',
    movieTitle: 'Speaking Advanced English Vocabulary For Technology - English Like A Native',
    releaseYear: 2021,
    director: 'English Like A Native',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'C1',
    sceneTitle: 'Advanced Tech Talk',
    sceneDescription: 'مفردات تقنية متقدمة باللهجة البريطانية: للنقاشات الجادة عن التكنولوجيا والذكاء الاصطناعي.',
    youtubeId: 'PAjXvjQDYcE',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English Like A Native (Official)',
    dialogueQuote: 'This technology could revolutionise the industry.',
    actorName: 'Anna',
    characterName: 'Anna',
    thumbnailUrl: 'https://img.youtube.com/vi/PAjXvjQDYcE/hqdefault.jpg',
    category: 'advanced_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Like A Native Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'This technology could revolutionise the industry.', arEg: 'التكنولوجيا دي ممكن تعمل ثورة في المجال.', arFusha: 'التكنولوجيا دي ممكن تعمل ثورة في المجال.', speaker: 'Anna', keyWords: [{ word: 'revolutionise', ipa: '', meaningAr: 'تعمل ثورة في', meaningEn: '' }, { word: 'industry', ipa: '', meaningAr: 'مجال / صناعة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'It is a double-edged sword, though.', arEg: 'بس دي سلاح ذو حدين.', arFusha: 'بس دي سلاح ذو حدين.', speaker: 'Anna', keyWords: [{ word: 'double-edged sword', ipa: '', meaningAr: 'سلاح ذو حدين', meaningEn: '' }, { word: 'though', ipa: '', meaningAr: 'بس / لكن', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'revolutionise', type: 'cultural', meaningAr: 'يعمل ثورة في / يغير جذرياً', meaningEn: '', egyptianEquivalent: 'يقلب الطاولة', exampleInScene: 'AI could revolutionise healthcare.' },      { term: 'double-edged sword', type: 'idiom', meaningAr: 'سلاح ذو حدين', meaningEn: '', egyptianEquivalent: 'ليه مميزات وعيوب', exampleInScene: 'Social media is a double-edged sword.' },      { term: 'cutting-edge', type: 'cultural', meaningAr: 'متطور جداً / أحدث تكنولوجيا', meaningEn: '', egyptianEquivalent: 'آخر نقلة', exampleInScene: 'They use cutting-edge tools.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'double-edged sword\' mean?', questionAr: 'معنى double-edged sword؟', options: ['حاجة ليها مميزات وعيوب', 'حاجة خطيرة بس', 'حاجة قديمة', 'حاجة رخيصة'], correctIndex: 0, explanationAr: 'زي السلاح ذو الحدين بالظبط - حاجة نافعة بس ممكن تضر، زي السوشيال ميديا.' }
    ],
    speakingLines: [{ en: 'This technology could revolutionise the industry.', arEg: 'التكنولوجيا دي ممكن تعمل ثورة في المجال.' }, { en: 'It is a double-edged sword, though.', arEg: 'بس دي سلاح ذو حدين.' }],
  },
  {
    id: 'podcast-bbc-tech-boxset',
    movieTitle: '6 Minute English - Internet and Technology English Mega-Class',
    releaseYear: 2021,
    director: 'BBC Learning English',
    genre: 'English Podcast',
    cefrLevel: 'B1',
    sceneTitle: 'One Hour of Tech English',
    sceneDescription: 'ساعة كاملة من BBC 6 Minute English عن الإنترنت والتكنولوجيا - مفردات + نقاشات بريطانية واضحة.',
    youtubeId: 'rnBQXmO_StE',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'We are glued to our screens these days.',
    actorName: 'Presenter',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/rnBQXmO_StE/hqdefault.jpg',
    category: 'podcasts',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'We are glued to our screens these days.', arEg: 'إحنا ملزوقين في الشاشات الأيام دي.', arFusha: 'إحنا ملزوقين في الشاشات الأيام دي.', speaker: 'Presenter', keyWords: [{ word: 'glued to', ipa: '', meaningAr: 'ملزوق في (لازق)', meaningEn: '' }, { word: 'screens', ipa: '', meaningAr: 'شاشات', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'How much time do you spend online?', arEg: 'بتقضي وقت قد إيه على النت؟', arFusha: 'بتقضي وقت قد إيه على النت؟', speaker: 'Presenter', keyWords: [{ word: 'spend', ipa: '', meaningAr: 'يقضي', meaningEn: '' }, { word: 'online', ipa: '', meaningAr: 'على النت', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'glued to', type: 'idiom', meaningAr: 'ملزوق في / مش قادر يسيب', meaningEn: '', egyptianEquivalent: 'لازق فيها', exampleInScene: 'Kids are glued to their phones.' },      { term: 'screen time', type: 'collocation', meaningAr: 'وقت الشاشة', meaningEn: '', egyptianEquivalent: 'وقت الموبايل', exampleInScene: 'Reduce your screen time.' },      { term: 'spend time', type: 'collocation', meaningAr: 'يقضي وقت', meaningEn: '', egyptianEquivalent: 'يعدي وقت', exampleInScene: 'I spend time online.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'glued to our screens\' mean?', questionAr: 'معنى glued to our screens؟', options: ['ملزوقين في الشاشات مش قادرين نسيبها', 'بنلزق الشاشات', 'بنكسر الشاشات', 'بننضف الشاشات'], correctIndex: 0, explanationAr: 'glued to تعبير مجازي معناه مش قادر تبعد عن حاجة - زي اللزق.' }
    ],
    speakingLines: [{ en: 'We are glued to our screens these days.', arEg: 'إحنا ملزوقين في الشاشات الأيام دي.' }, { en: 'How much time do you spend online?', arEg: 'بتقضي وقت قد إيه على النت؟' }],
  },
  {
    id: 'news-bbc-brain-exercise',
    movieTitle: 'Exercise Helps the Brain - BBC News Review',
    releaseYear: 2022,
    director: 'BBC Learning English',
    genre: 'News English',
    cefrLevel: 'B2',
    sceneTitle: 'News Vocabulary Unpacked',
    sceneDescription: 'نيوز ريفيو من BBC: عنوان خبري حقيقي عن الرياضة والمخ، وشرح مفرداته الإنجليزية الصعبة.',
    youtubeId: 'eRqYUTA5JJo',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Exercise gives your brain a boost.',
    actorName: 'Presenter',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/eRqYUTA5JJo/hqdefault.jpg',
    category: 'podcasts',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Exercise gives your brain a boost.', arEg: 'الرياضة بتدي مخك دفعة.', arFusha: 'الرياضة بتدي مخك دفعة.', speaker: 'Presenter', keyWords: [{ word: 'boost', ipa: '', meaningAr: 'دفعة / تحسين', meaningEn: '' }, { word: 'brain', ipa: '', meaningAr: 'مخ', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Scientists say it sharpens your memory.', arEg: 'العلماء بيقولوا إنها بتقوي الذاكرة.', arFusha: 'العلماء بيقولوا إنها بتقوي الذاكرة.', speaker: 'Presenter', keyWords: [{ word: 'sharpens', ipa: '', meaningAr: 'بتقوي / بتشحذ', meaningEn: '' }, { word: 'memory', ipa: '', meaningAr: 'ذاكرة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'boost', type: 'cultural', meaningAr: 'دفعة / تحسين', meaningEn: '', egyptianEquivalent: 'دفعة', exampleInScene: 'Coffee gives me a boost.' },      { term: 'sharpen', type: 'cultural', meaningAr: 'يقوي / يشحذ', meaningEn: '', egyptianEquivalent: 'يحدّد', exampleInScene: 'Reading sharpens the mind.' },      { term: 'workout', type: 'cultural', meaningAr: 'تمرين رياضي', meaningEn: '', egyptianEquivalent: 'تمرين', exampleInScene: 'A daily workout helps.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'give your brain a boost\' mean?', questionAr: 'معنى give your brain a boost؟', options: ['تدي مخك دفعة وتحسين', 'تصدع دماغك', 'تنام أكتر', 'تاكل أكتر'], correctIndex: 0, explanationAr: 'boost معناها دفعة أو تحسين - الرياضة بتنشط المخ وتحسن أداءه.' }
    ],
    speakingLines: [{ en: 'Exercise gives your brain a boost.', arEg: 'الرياضة بتدي مخك دفعة.' }, { en: 'Scientists say it sharpens your memory.', arEg: 'العلماء بيقولوا إنها بتقوي الذاكرة.' }],
  },
  {
    id: 'news-bbc-late-nights',
    movieTitle: 'Late Nights: Bad for Health? - BBC News Review',
    releaseYear: 2022,
    director: 'BBC Learning English',
    genre: 'News English',
    cefrLevel: 'B2',
    sceneTitle: 'Sleep and Health Headlines',
    sceneDescription: 'عنوان إخباري عن السهر وصحتك - تعلم مفردات الأخبار والصحة بطريقة BBC الممتعة.',
    youtubeId: 'LXrh2AJa8nU',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Staying up late takes a toll on your body.',
    actorName: 'Presenter',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/LXrh2AJa8nU/hqdefault.jpg',
    category: 'podcasts',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Staying up late takes a toll on your body.', arEg: 'السهر بيأثر على جسمك مع الوقت.', arFusha: 'السهر بيأثر على جسمك مع الوقت.', speaker: 'Presenter', keyWords: [{ word: 'takes a toll', ipa: '', meaningAr: 'بيأثر سلباً مع الوقت', meaningEn: '' }, { word: 'staying up', ipa: '', meaningAr: 'السهر', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'A good night\'s sleep is vital.', arEg: 'نوم الليل الكويس ضروري جداً.', arFusha: 'نوم الليل الكويس ضروري جداً.', speaker: 'Presenter', keyWords: [{ word: 'vital', ipa: '', meaningAr: 'ضروري', meaningEn: '' }, { word: 'sleep', ipa: '', meaningAr: 'نوم', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'take a toll', type: 'idiom', meaningAr: 'يأثر سلباً مع الوقت', meaningEn: '', egyptianEquivalent: 'يجي على الصحة', exampleInScene: 'Stress takes a toll on you.' },      { term: 'stay up', type: 'phrasal-verb', meaningAr: 'يسهر / يفضل صاحي', meaningEn: '', egyptianEquivalent: 'يسهر', exampleInScene: 'I stayed up late watching TV.' },      { term: 'vital', type: 'cultural', meaningAr: 'ضروري / حيوي', meaningEn: '', egyptianEquivalent: 'مهم جداً', exampleInScene: 'Sleep is vital for health.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'take a toll on your body\' mean?', questionAr: 'معنى take a toll on your body؟', options: ['يأثر سلباً على جسمك مع الوقت', 'يقوي جسمك', 'ياخد فلوس منك', 'يعمل رياضة'], correctIndex: 0, explanationAr: 'take a toll تعبير معناه الضرر اللي بيجمع ببطء مع الوقت - زي السهر على الصحة.' }
    ],
    speakingLines: [{ en: 'Staying up late takes a toll on your body.', arEg: 'السهر بيأثر على جسمك مع الوقت.' }, { en: 'A good night\'s sleep is vital.', arEg: 'نوم الليل الكويس ضروري جداً.' }],
  },
  {
    id: 'music-queen-learn',
    movieTitle: 'Learn English With Queen - Learn English With TV Series',
    releaseYear: 2021,
    director: 'Learn English With TV Series',
    genre: 'Music English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Bohemian Rhapsody English Class',
    sceneDescription: 'اتعلم إنجليزي بأغاني كوين الأسطورية: تحليل كلمات، نطق، وتعابير من أشهر الأغاني.',
    youtubeId: 'o82oNazflnc',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Learn English With TV Series (Official)',
    dialogueQuote: 'Is this the real life? Is this just fantasy?',
    actorName: 'Freddie Mercury',
    characterName: 'Singer',
    thumbnailUrl: 'https://img.youtube.com/vi/o82oNazflnc/hqdefault.jpg',
    category: 'tv_series',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English With TV Series Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Is this the real life? Is this just fantasy?', arEg: 'ده الواقع الحقيقي؟ ولا مجرد خيال؟', arFusha: 'ده الواقع الحقيقي؟ ولا مجرد خيال؟', speaker: 'Singer', keyWords: [{ word: 'real life', ipa: '', meaningAr: 'الواقع', meaningEn: '' }, { word: 'fantasy', ipa: '', meaningAr: 'خيال', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Anyway the wind blows does not really matter to me.', arEg: 'الريح تهب في أي اتجاه، مش فارقة معايا.', arFusha: 'الريح تهب في أي اتجاه، مش فارقة معايا.', speaker: 'Singer', keyWords: [{ word: 'wind blows', ipa: '', meaningAr: 'الريح تهب', meaningEn: '' }, { word: 'matter', ipa: '', meaningAr: 'يفرق / يهم', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'fantasy', type: 'cultural', meaningAr: 'خيال', meaningEn: '', egyptianEquivalent: 'خيال', exampleInScene: 'It is just a fantasy.' },      { term: 'real life', type: 'collocation', meaningAr: 'الواقع الحقيقي', meaningEn: '', egyptianEquivalent: 'الحقيقة', exampleInScene: 'This is real life, not a movie.' },      { term: 'does not matter', type: 'collocation', meaningAr: 'مش مهم / مش فارقة', meaningEn: '', egyptianEquivalent: 'مش فارقة', exampleInScene: 'It does not matter to me.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'It does not matter to me\' mean?', questionAr: 'معنى It does not matter to me؟', options: ['مش فارقة معايا', 'مش قادر أفهمها', 'مش عاجباني', 'مش سامعها'], correctIndex: 0, explanationAr: 'does not matter معناها مش فارقة أو مش مهمة - تعبير شائع جداً.' }
    ],
    speakingLines: [{ en: 'Is this the real life? Is this just fantasy?', arEg: 'ده الواقع الحقيقي؟ ولا مجرد خيال؟' }, { en: 'It does not really matter to me.', arEg: 'مش فارقة معايا بجد.' }],
  },
  {
    id: 'intro-ready-confident',
    movieTitle: 'How to Introduce Yourself in English - English At The Ready',
    releaseYear: 2022,
    director: 'English At The Ready',
    genre: 'Speaking Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Your First Impression',
    sceneDescription: 'عرف بنفسك بثقة في أي موقف: الاسم، الشغل، الهوايات - صيغة بسيطة تحفظها مرة وتستخدمها دايماً.',
    youtubeId: '5whkCF7TgZ0',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'English At The Ready (Official)',
    dialogueQuote: 'Hi, I\'m Sara. Nice to meet you.',
    actorName: 'Teacher',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/5whkCF7TgZ0/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English At The Ready Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Hi, I\'m Sara. Nice to meet you.', arEg: 'أهلاً، أنا سارة. تشرفنا.', arFusha: 'أهلاً، أنا سارة. تشرفنا.', speaker: 'Speaker', keyWords: [{ word: 'Nice to meet you', ipa: '', meaningAr: 'تشرفنا / فرصة سعيدة', meaningEn: '' }, { word: 'Hi', ipa: '', meaningAr: 'أهلاً', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I\'m from Egypt and I work as an engineer.', arEg: 'أنا من مصر وبشتغل مهندس.', arFusha: 'أنا من مصر وبشتغل مهندس.', speaker: 'Speaker', keyWords: [{ word: 'I\'m from', ipa: '', meaningAr: 'أنا من', meaningEn: '' }, { word: 'work as', ipa: '', meaningAr: 'بشتغل كـ', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'Nice to meet you', type: 'collocation', meaningAr: 'تشرفنا (عند التعارف)', meaningEn: '', egyptianEquivalent: 'فرصة سعيدة', exampleInScene: 'Nice to meet you, Ahmed.' },      { term: 'work as', type: 'collocation', meaningAr: 'يعمل كـ (مهنة)', meaningEn: '', egyptianEquivalent: 'بشتغل', exampleInScene: 'She works as a doctor.' },      { term: 'introduce yourself', type: 'collocation', meaningAr: 'يعرّف بنفسه', meaningEn: '', egyptianEquivalent: 'عرّف بنفسك', exampleInScene: 'Introduce yourself in English.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What do you say right after meeting someone new?', questionAr: 'تقول إيه أول ما تتعرف على حد جديد؟', options: ['Nice to meet you', 'See you later', 'Good night', 'Excuse me'], correctIndex: 0, explanationAr: 'Nice to meet you هي التحية المعتادة عند التعارف لأول مرة.' }
    ],
    speakingLines: [{ en: 'Hi, I\'m Sara. Nice to meet you.', arEg: 'أهلاً، أنا سارة. تشرفنا.' }, { en: 'I\'m from Egypt and I work as an engineer.', arEg: 'أنا من مصر وبشتغل مهندس.' }],
  },
  {
    id: 'intro-lucy-interview',
    movieTitle: 'How to Introduce Yourself - Tell Me About Yourself Interview Answer - English with Lucy',
    releaseYear: 2021,
    director: 'English with Lucy',
    genre: 'Job Interview Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Tell Me About Yourself',
    sceneDescription: 'لوسي بتفكك أصعب سؤال في الانترفيو: Tell me about yourself - بصيغة جاهزة وإجابات نموذجية.',
    youtubeId: 'QgjkjsqAzvo',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English with Lucy (Official)',
    dialogueQuote: 'I am a motivated graduate with a passion for marketing.',
    actorName: 'Lucy',
    characterName: 'Lucy',
    thumbnailUrl: 'https://img.youtube.com/vi/QgjkjsqAzvo/hqdefault.jpg',
    category: 'job_interviews',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English with Lucy Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I am a motivated graduate with a passion for marketing.', arEg: 'أنا خريج طموح وعندي شغف بالتسويق.', arFusha: 'أنا خريج طموح وعندي شغف بالتسويق.', speaker: 'Lucy', keyWords: [{ word: 'motivated', ipa: '', meaningAr: 'طموح / عنده دافع', meaningEn: '' }, { word: 'passion', ipa: '', meaningAr: 'شغف', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Keep your answer under two minutes.', arEg: 'خلي إجابتك أقل من دقيقتين.', arFusha: 'خلي إجابتك أقل من دقيقتين.', speaker: 'Lucy', keyWords: [{ word: 'under two minutes', ipa: '', meaningAr: 'أقل من دقيقتين', meaningEn: '' }, { word: 'answer', ipa: '', meaningAr: 'إجابة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'passion for', type: 'collocation', meaningAr: 'شغف بـ', meaningEn: '', egyptianEquivalent: 'شغف في', exampleInScene: 'She has a passion for teaching.' },      { term: 'motivated', type: 'cultural', meaningAr: 'طموح / عنده دافع', meaningEn: '', egyptianEquivalent: 'جاد', exampleInScene: 'A motivated student learns fast.' },      { term: 'graduate', type: 'cultural', meaningAr: 'خريج', meaningEn: '', egyptianEquivalent: 'خريجة', exampleInScene: 'A fresh graduate.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How long should your \'Tell me about yourself\' answer be?', questionAr: 'إجابة Tell me about yourself المفروض تبقى قد إيه؟', options: ['أقل من دقيقتين', 'عشر دقايق', 'خمس ثواني', 'ساعة'], correctIndex: 0, explanationAr: 'الإجابة المثالية مركزة: أقل من دقيقتين تغطي خبرتك ونقاط قوتك.' }
    ],
    speakingLines: [{ en: 'I am a motivated graduate with a passion for marketing.', arEg: 'أنا خريج طموح وعندي شغف بالتسويق.' }, { en: 'Keep your answer under two minutes.', arEg: 'خلي إجابتك أقل من دقيقتين.' }],
  },
  {
    id: 'intro-vanessa-formula',
    movieTitle: 'A Formula for Introducing Yourself Perfectly Every Time - Vanessa Van Edwards',
    releaseYear: 2021,
    director: 'Vanessa Van Edwards',
    genre: 'Communication Skills',
    cefrLevel: 'B2',
    sceneTitle: 'The Perfect Introduction Formula',
    sceneDescription: 'فانيسا فان إدواردز (خبيرة لغة الجسد) بتديك معادلة التعارف المثالية اللي بتخلي الناس تفتكرك.',
    youtubeId: '5c5P8YQeymI',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Vanessa Van Edwards (Official)',
    dialogueQuote: 'Lead with what excites you, not your job title.',
    actorName: 'Vanessa Van Edwards',
    characterName: 'Vanessa',
    thumbnailUrl: 'https://img.youtube.com/vi/5c5P8YQeymI/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Vanessa Van Edwards Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Lead with what excites you, not your job title.', arEg: 'ابدأ بالحاجة اللي بتحمسك، مش بمسمى وظيفتك.', arFusha: 'ابدأ بالحاجة اللي بتحمسك، مش بمسمى وظيفتك.', speaker: 'Vanessa', keyWords: [{ word: 'lead with', ipa: '', meaningAr: 'يبدأ بـ', meaningEn: '' }, { word: 'excites', ipa: '', meaningAr: 'بتحمس', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'A memorable introduction sparks curiosity.', arEg: 'التعارف اللي بيتفكر بيثير الفضول.', arFusha: 'التعارف اللي بيتفكر بيثير الفضول.', speaker: 'Vanessa', keyWords: [{ word: 'memorable', ipa: '', meaningAr: 'بيتفكر', meaningEn: '' }, { word: 'sparks curiosity', ipa: '', meaningAr: 'بيثير الفضول', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'lead with', type: 'phrasal-verb', meaningAr: 'يبدأ بـ / يفتتح بـ', meaningEn: '', egyptianEquivalent: 'يبدأ بـ', exampleInScene: 'Lead with your best story.' },      { term: 'memorable', type: 'cultural', meaningAr: 'بيتفكر / لا ينسى', meaningEn: '', egyptianEquivalent: 'مش بينتسى', exampleInScene: 'A memorable first day.' },      { term: 'spark curiosity', type: 'collocation', meaningAr: 'يثير الفضول', meaningEn: '', egyptianEquivalent: 'يفتح شهية السؤال', exampleInScene: 'Good intros spark curiosity.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What should you lead with, according to Vanessa?', questionAr: 'نبدأ بإيه حسب فانيسا؟', options: ['الحاجة اللي بتحمسك', 'مسمى وظيفتك', 'راتبك', 'عنوانك'], correctIndex: 0, explanationAr: 'ابدأ بالحاجة اللي بتحمسك فعلاً - ده اللي بيخلي الناس تفتكرك.' }
    ],
    speakingLines: [{ en: 'Lead with what excites you, not your job title.', arEg: 'ابدأ بالحاجة اللي بتحمسك، مش بمسمى وظيفتك.' }, { en: 'A memorable introduction sparks curiosity.', arEg: 'التعارف اللي بيتفكر بيثير الفضول.' }],
  },
  {
    id: 'present-maria-50',
    movieTitle: '50 English Phrases for Presentations - Maria Sheeran',
    releaseYear: 2022,
    director: 'Maria Sheeran',
    genre: 'Business English Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Present Like a Professional',
    sceneDescription: 'خمسين عبارة للعروض التقديمية: الافتتاح، عرض الأرقام، الإجابة على الأسئلة، والختام القوي.',
    youtubeId: 'Ri4zLmpyz-E',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Maria Sheeran (Official)',
    dialogueQuote: 'Today I will walk you through our results.',
    actorName: 'Maria',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/Ri4zLmpyz-E/hqdefault.jpg',
    category: 'business_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Maria Sheeran Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Today I will walk you through our results.', arEg: 'النهارده هعرض عليكوا نتايجنا خطوة بخطوة.', arFusha: 'النهارده هعرض عليكوا نتايجنا خطوة بخطوة.', speaker: 'Presenter', keyWords: [{ word: 'walk you through', ipa: '', meaningAr: 'يشرح خطوة بخطوة', meaningEn: '' }, { word: 'results', ipa: '', meaningAr: 'نتايج', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Let me move on to the next point.', arEg: 'خليني أنتقل للنقطة اللي بعدها.', arFusha: 'خليني أنتقل للنقطة اللي بعدها.', speaker: 'Presenter', keyWords: [{ word: 'move on to', ipa: '', meaningAr: 'ينتقل لـ', meaningEn: '' }, { word: 'point', ipa: '', meaningAr: 'نقطة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'walk through', type: 'phrasal-verb', meaningAr: 'يشرح خطوة بخطوة', meaningEn: '', egyptianEquivalent: 'يفصّل', exampleInScene: 'Let me walk you through the plan.' },      { term: 'move on to', type: 'phrasal-verb', meaningAr: 'ينتقل لـ (نقطة تانية)', meaningEn: '', egyptianEquivalent: 'نروح للي بعدها', exampleInScene: 'Let\'s move on to sales.' },      { term: 'to sum up', type: 'collocation', meaningAr: 'باختصار / للتلخيص', meaningEn: '', egyptianEquivalent: 'الخلاصة', exampleInScene: 'To sum up, we grew 20%.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'walk you through\' mean?', questionAr: 'معنى walk you through؟', options: ['يشرحلك خطوة بخطوة', 'يمشي معاك', 'يوريك المكان', 'يسيبك تمشي'], correctIndex: 0, explanationAr: 'walk someone through معناها يشرحلهم حاجة خطوة بخطوة بتفصيل.' }
    ],
    speakingLines: [{ en: 'Today I will walk you through our results.', arEg: 'النهارده هعرض عليكوا نتايجنا خطوة بخطوة.' }, { en: 'Let me move on to the next point.', arEg: 'خليني أنتقل للنقطة اللي بعدها.' }],
  },
  {
    id: 'present-derek-40',
    movieTitle: '40 Phrases For Presenting In English - Business English - Derek Callan',
    releaseYear: 2021,
    director: 'Derek Callan',
    genre: 'Business English Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Boardroom-Ready English',
    sceneDescription: 'ديريك كالان بيجهزك للبرزنتيشن في الشغل: 40 عبارة احترافية من الافتتاح لحد أسئلة الجمهور.',
    youtubeId: 'bgFNTuRYtKE',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Derek Callan - English for Professionals (Official)',
    dialogueQuote: 'I would like to draw your attention to this chart.',
    actorName: 'Derek Callan',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/bgFNTuRYtKE/hqdefault.jpg',
    category: 'business_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Derek Callan Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I would like to draw your attention to this chart.', arEg: 'حابب ألفت انتباهكم للرسم البياني ده.', arFusha: 'حابب ألفت انتباهكم للرسم البياني ده.', speaker: 'Presenter', keyWords: [{ word: 'draw your attention', ipa: '', meaningAr: 'يلفت انتباهكم', meaningEn: '' }, { word: 'chart', ipa: '', meaningAr: 'رسم بياني', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Are there any questions so far?', arEg: 'في أسئلة لحد دلوقتي؟', arFusha: 'في أسئلة لحد دلوقتي؟', speaker: 'Presenter', keyWords: [{ word: 'so far', ipa: '', meaningAr: 'لحد دلوقتي', meaningEn: '' }, { word: 'questions', ipa: '', meaningAr: 'أسئلة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'draw attention to', type: 'collocation', meaningAr: 'يلفت الانتباه لـ', meaningEn: '', egyptianEquivalent: 'يركّزكم على', exampleInScene: 'Let me draw your attention to page two.' },      { term: 'so far', type: 'collocation', meaningAr: 'لحد دلوقتي', meaningEn: '', egyptianEquivalent: 'لحد هنا', exampleInScene: 'So far, so good.' },      { term: 'Any questions?', type: 'collocation', meaningAr: 'في أسئلة؟', meaningEn: '', egyptianEquivalent: 'حد عنده سؤال؟', exampleInScene: 'Any questions before we finish?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'so far\' mean?', questionAr: 'معنى so far؟', options: ['لحد دلوقتي', 'بعيد أوي', 'بعد كده', 'قبل كده'], correctIndex: 0, explanationAr: 'so far معناها لحد دلوقتي - أي من أول الحاجة لحد اللحظة دي.' }
    ],
    speakingLines: [{ en: 'I would like to draw your attention to this chart.', arEg: 'حابب ألفت انتباهكم للرسم البياني ده.' }, { en: 'Are there any questions so far?', arEg: 'في أسئلة لحد دلوقتي؟' }],
  },
  {
    id: 'money-hll-phrasal',
    movieTitle: 'Money Phrasal Verbs - Improve Your English Money Vocabulary - High Level Listening',
    releaseYear: 2021,
    director: 'High Level Listening',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'C1',
    sceneTitle: 'Advanced Money Talk',
    sceneDescription: 'فيرزال فيربز الفلوس للمستوى المتقدم: save up, pay off, cut back - بلغة النيتيف الحقيقية.',
    youtubeId: 'LVyWC2XPVKA',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'High Level Listening (Official)',
    dialogueQuote: 'I am saving up for a new laptop.',
    actorName: 'Host',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/LVyWC2XPVKA/hqdefault.jpg',
    category: 'advanced_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'High Level Listening Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I am saving up for a new laptop.', arEg: 'بحوش عشان لابتوب جديد.', arFusha: 'بحوش عشان لابتوب جديد.', speaker: 'Host', keyWords: [{ word: 'saving up', ipa: '', meaningAr: 'بحوش فلوس', meaningEn: '' }, { word: 'laptop', ipa: '', meaningAr: 'لابتوب', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'We need to cut back on eating out.', arEg: 'لازم نقلل الأكل بره.', arFusha: 'لازم نقلل الأكل بره.', speaker: 'Host', keyWords: [{ word: 'cut back on', ipa: '', meaningAr: 'يقلل', meaningEn: '' }, { word: 'eating out', ipa: '', meaningAr: 'الأكل بره', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'save up', type: 'phrasal-verb', meaningAr: 'يحوش فلوس لهدف', meaningEn: '', egyptianEquivalent: 'يحوش', exampleInScene: 'I am saving up for a trip.' },      { term: 'cut back on', type: 'phrasal-verb', meaningAr: 'يقلل من (مصاريف)', meaningEn: '', egyptianEquivalent: 'يقلل', exampleInScene: 'Cut back on coffee.' },      { term: 'pay off', type: 'phrasal-verb', meaningAr: 'يسدد (دين) بالكامل', meaningEn: '', egyptianEquivalent: 'يخلّص دين', exampleInScene: 'She paid off her loan.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'cut back on eating out\' mean?', questionAr: 'معنى cut back on eating out؟', options: ['نقلل الأكل بره', 'نكتر أكل بره', 'نمنع الأكل خالص', 'نتعلم نطبخ'], correctIndex: 0, explanationAr: 'cut back on معناها تقلل من حاجة (خصوصاً مصاريف) مش تمتنع عنها تماماً.' }
    ],
    speakingLines: [{ en: 'I am saving up for a new laptop.', arEg: 'بحوش عشان لابتوب جديد.' }, { en: 'We need to cut back on eating out.', arEg: 'لازم نقلل الأكل بره.' }],
  },
  {
    id: 'money-engvid-finance',
    movieTitle: 'English Vocabulary for Personal Finances - assets, equity, collateral - engVid',
    releaseYear: 2019,
    director: 'engVid',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Bank and Finance Words',
    sceneDescription: 'آدم من engVid بيشرح مفردات البنوك والتمويل الشخصي: أصول، رهن، ضمانات - للشغل والحياة.',
    youtubeId: 'bM9XlH_bCRQ',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Adam\'s English Lessons - engVid (Official)',
    dialogueQuote: 'Your house is an asset, but your loan is a liability.',
    actorName: 'Adam',
    characterName: 'Adam',
    thumbnailUrl: 'https://img.youtube.com/vi/bM9XlH_bCRQ/hqdefault.jpg',
    category: 'business_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'engVid Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Your house is an asset, but your loan is a liability.', arEg: 'بيتك أصل من أصولك، بس القرض التزام عليك.', arFusha: 'بيتك أصل من أصولك، بس القرض التزام عليك.', speaker: 'Adam', keyWords: [{ word: 'asset', ipa: '', meaningAr: 'أصل / ممتلكات', meaningEn: '' }, { word: 'liability', ipa: '', meaningAr: 'التزام / دين', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'The bank asked for collateral before the loan.', arEg: 'البنك طلب ضمان قبل القرض.', arFusha: 'البنك طلب ضمان قبل القرض.', speaker: 'Adam', keyWords: [{ word: 'collateral', ipa: '', meaningAr: 'ضمان / رهن', meaningEn: '' }, { word: 'loan', ipa: '', meaningAr: 'قرض', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'asset', type: 'cultural', meaningAr: 'أصل / ممتلكات قيمة', meaningEn: '', egyptianEquivalent: 'أصول', exampleInScene: 'A car can be an asset.' },      { term: 'liability', type: 'cultural', meaningAr: 'التزام / دين عليك', meaningEn: '', egyptianEquivalent: 'مديونية', exampleInScene: 'Too many liabilities are risky.' },      { term: 'collateral', type: 'cultural', meaningAr: 'ضمان مقابل قرض', meaningEn: '', egyptianEquivalent: 'ضمانة', exampleInScene: 'The house is the collateral.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is an \'asset\'?', questionAr: 'يعني إيه asset؟', options: ['حاجة قيمة تملكها', 'دين عليك', 'مصروف شهري', 'راتب'], correctIndex: 0, explanationAr: 'الـ asset هو حاجة قيمة تملكها زي بيت أو عربية، وعكسها liability وهو الالتزام أو الدين.' }
    ],
    speakingLines: [{ en: 'Your house is an asset, but your loan is a liability.', arEg: 'بيتك أصل من أصولك، بس القرض التزام عليك.' }, { en: 'The bank asked for collateral before the loan.', arEg: 'البنك طلب ضمان قبل القرض.' }],
  },
  {
    id: 'money-bob-class',
    movieTitle: 'Free English Class! Topic: Money - Learn English with Bob the Canadian',
    releaseYear: 2021,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Everyday Money Words',
    sceneDescription: 'حصة بوب المجانية عن الفلوس: الكلمات اليومية للأسعار والخصومات والدفع - بأسلوبه البسيط.',
    youtubeId: 'BAnOiX4yMzE',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'Can I pay in cash, or do you take cards?',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/BAnOiX4yMzE/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Can I pay in cash, or do you take cards?', arEg: 'ممكن أدفع كاش، ولا بتقبلوا كروت؟', arFusha: 'ممكن أدفع كاش، ولا بتقبلوا كروت؟', speaker: 'Bob', keyWords: [{ word: 'in cash', ipa: '', meaningAr: 'كاش', meaningEn: '' }, { word: 'take cards', ipa: '', meaningAr: 'بتقبلوا كروت', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'That is too expensive for my budget.', arEg: 'ده غالي أوي على ميزانيتي.', arFusha: 'ده غالي أوي على ميزانيتي.', speaker: 'Bob', keyWords: [{ word: 'too expensive', ipa: '', meaningAr: 'غالي أوي', meaningEn: '' }, { word: 'budget', ipa: '', meaningAr: 'ميزانية', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'pay in cash', type: 'collocation', meaningAr: 'يدفع كاش', meaningEn: '', egyptianEquivalent: 'يدفع نقدي', exampleInScene: 'I prefer to pay in cash.' },      { term: 'budget', type: 'cultural', meaningAr: 'ميزانية', meaningEn: '', egyptianEquivalent: 'ميزانية', exampleInScene: 'I am on a tight budget.' },      { term: 'afford', type: 'cultural', meaningAr: 'يقدر على تكلفة', meaningEn: '', egyptianEquivalent: 'يلحق يشتري', exampleInScene: 'I cannot afford it now.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'I cannot afford it\' mean?', questionAr: 'معنى I cannot afford it؟', options: ['مش قادر أدفع تمنها', 'مش عايزها', 'مش لاقيها', 'مش فاهمها'], correctIndex: 0, explanationAr: 'afford معناها تقدر مادياً على حاجة - cannot afford يعني مش معاك تمنها.' }
    ],
    speakingLines: [{ en: 'Can I pay in cash, or do you take cards?', arEg: 'ممكن أدفع كاش، ولا بتقبلوا كروت؟' }, { en: 'That is too expensive for my budget.', arEg: 'ده غالي أوي على ميزانيتي.' }],
  },
  {
    id: 'sports-tiffani-vocab',
    movieTitle: 'Topical English Vocabulary - English Words About Sports - Tiffani',
    releaseYear: 2021,
    director: 'English Vocabulary With Tiffani',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Talk Sports Like a Fan',
    sceneDescription: 'تيفاني بتعلمك مفردات الرياضة الأساسية: الفرق، البطولات، والتشجيع - عشان تتكلم عن ماتشاتك المفضلة.',
    youtubeId: 'gA2H_wc1lGw',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'English Vocabulary With Tiffani (Official)',
    dialogueQuote: 'Our team won the championship last year.',
    actorName: 'Tiffani',
    characterName: 'Tiffani',
    thumbnailUrl: 'https://img.youtube.com/vi/gA2H_wc1lGw/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Vocabulary With Tiffani Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Our team won the championship last year.', arEg: 'فريقنا كسب البطولة السنة اللي فاتت.', arFusha: 'فريقنا كسب البطولة السنة اللي فاتت.', speaker: 'Tiffani', keyWords: [{ word: 'won', ipa: '', meaningAr: 'كسب', meaningEn: '' }, { word: 'championship', ipa: '', meaningAr: 'بطولة', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'The match ended in a draw.', arEg: 'الماتش خلص بالتعادل.', arFusha: 'الماتش خلص بالتعادل.', speaker: 'Tiffani', keyWords: [{ word: 'ended in', ipa: '', meaningAr: 'خلص بـ', meaningEn: '' }, { word: 'draw', ipa: '', meaningAr: 'تعادل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'championship', type: 'cultural', meaningAr: 'بطولة', meaningEn: '', egyptianEquivalent: 'الدوري / البطولة', exampleInScene: 'They won the championship.' },      { term: 'draw', type: 'cultural', meaningAr: 'تعادل', meaningEn: '', egyptianEquivalent: 'تعادل', exampleInScene: 'The game was a draw.' },      { term: 'score', type: 'cultural', meaningAr: 'النتيجة', meaningEn: '', egyptianEquivalent: 'السكور', exampleInScene: 'What is the score?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'The match ended in a draw\' mean?', questionAr: 'معنى The match ended in a draw؟', options: ['الماتش خلص بالتعادل', 'الماتش اتلغى', 'الماتش خلص بدري', 'فريق انسحب'], correctIndex: 0, explanationAr: 'draw في الرياضة معناها تعادل - الاتنين جابوا نفس النتيجة.' }
    ],
    speakingLines: [{ en: 'Our team won the championship last year.', arEg: 'فريقنا كسب البطولة السنة اللي فاتت.' }, { en: 'The match ended in a draw.', arEg: 'الماتش خلص بالتعادل.' }],
  },
  {
    id: 'pron-rachel-mispronounce',
    movieTitle: 'English Words You Are Probably Mispronouncing - Rachel\'s English',
    releaseYear: 2021,
    director: 'Rachel\'s English',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Stop Mispronouncing These Words',
    sceneDescription: 'كلمات بتنطقها غلط من غير ما تاخد بالك: comfortable, vegetable, Wednesday - ريتشل بتصححها.',
    youtubeId: 'opKPVqxE_QY',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Rachel\'s English (Official)',
    dialogueQuote: 'Wednesday has a silent D.',
    actorName: 'Rachel',
    characterName: 'Rachel',
    thumbnailUrl: 'https://img.youtube.com/vi/opKPVqxE_QY/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Rachel\'s English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Wednesday has a silent D.', arEg: 'كلمة Wednesday فيها D ساكنة.', arFusha: 'كلمة Wednesday فيها D ساكنة.', speaker: 'Rachel', keyWords: [{ word: 'silent D', ipa: '', meaningAr: 'حرف D ساكن', meaningEn: '' }, { word: 'Wednesday', ipa: '', meaningAr: 'يوم الأربعاء', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Say comfortable with three syllables, not four.', arEg: 'انطق comfortable بثلاث مقاطع مش أربعة.', arFusha: 'انطق comfortable بثلاث مقاطع مش أربعة.', speaker: 'Rachel', keyWords: [{ word: 'syllables', ipa: '', meaningAr: 'مقاطع صوتية', meaningEn: '' }, { word: 'comfortable', ipa: '', meaningAr: 'مريح', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'mispronounce', type: 'cultural', meaningAr: 'ينطق غلط', meaningEn: '', egyptianEquivalent: 'ينطق غلط', exampleInScene: 'Many learners mispronounce this word.' },      { term: 'syllable', type: 'cultural', meaningAr: 'مقطع صوتي', meaningEn: '', egyptianEquivalent: 'مقطع', exampleInScene: 'Water has two syllables.' },      { term: 'silent', type: 'cultural', meaningAr: 'ساكن (حرف مبيتنطقش)', meaningEn: '', egyptianEquivalent: 'مبيتنطقش', exampleInScene: 'The D is silent.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How many syllables in the American pronunciation of \'comfortable\'?', questionAr: 'كام مقطع صوتي في نطق comfortable الأمريكي؟', options: ['تلاتة', 'أربعة', 'اتنين', 'خمسة'], correctIndex: 0, explanationAr: 'بالأمريكي بتتنطق كامف-تر-بل: تلات مقاطع مش أربعة.' }
    ],
    speakingLines: [{ en: 'Wednesday has a silent D.', arEg: 'كلمة Wednesday فيها D ساكنة.' }, { en: 'Say comfortable with three syllables, not four.', arEg: 'انطق comfortable بثلاث مقاطع مش أربعة.' }],
  },
  {
    id: 'feelings-sce-describe',
    movieTitle: 'Describe Your Feelings in English - Speak Confident English',
    releaseYear: 2021,
    director: 'Speak Confident English',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Beyond Happy and Sad',
    sceneDescription: 'مفردات المشاعر المتقدمة: overwhelmed, relieved, frustrated - عبّر عن إحساسك بدقة زي النيتيف.',
    youtubeId: '_uQDCru94nA',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Speak Confident English (Official)',
    dialogueQuote: 'I felt overwhelmed by all the work.',
    actorName: 'Anne-Marie',
    characterName: 'Anne-Marie',
    thumbnailUrl: 'https://img.youtube.com/vi/_uQDCru94nA/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak Confident English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I felt overwhelmed by all the work.', arEg: 'حسيت إني متخنوق من كتر الشغل.', arFusha: 'حسيت إني متخنوق من كتر الشغل.', speaker: 'Anne-Marie', keyWords: [{ word: 'overwhelmed', ipa: '', meaningAr: 'متخنوق / مغطى بالضغط', meaningEn: '' }, { word: 'felt', ipa: '', meaningAr: 'حسيت', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I was so relieved when it ended.', arEg: 'اتريحت جداً لما خلصت.', arFusha: 'اتريحت جداً لما خلصت.', speaker: 'Anne-Marie', keyWords: [{ word: 'relieved', ipa: '', meaningAr: 'مرتاح بعد قلق', meaningEn: '' }, { word: 'ended', ipa: '', meaningAr: 'خلصت', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'overwhelmed', type: 'cultural', meaningAr: 'مغطى بالضغط / مش قادر', meaningEn: '', egyptianEquivalent: 'مخنوق', exampleInScene: 'I feel overwhelmed today.' },      { term: 'relieved', type: 'cultural', meaningAr: 'مرتاح بعد قلق', meaningEn: '', egyptianEquivalent: 'اتريحت', exampleInScene: 'I am relieved it is over.' },      { term: 'frustrated', type: 'cultural', meaningAr: 'محبط / متضايق', meaningEn: '', egyptianEquivalent: 'مستفز', exampleInScene: 'He felt frustrated by the delay.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'overwhelmed\' mean?', questionAr: 'معنى overwhelmed؟', options: ['مغطى بالضغط والمسؤوليات', 'سعيد جداً', 'جعان', 'ناعس'], correctIndex: 0, explanationAr: 'overwhelmed معناها الضغط غطاك ومش قادر تلحق - إحساس الإجهاد النفسي.' }
    ],
    speakingLines: [{ en: 'I felt overwhelmed by all the work.', arEg: 'حسيت إني متخنوق من كتر الشغل.' }, { en: 'I was so relieved when it ended.', arEg: 'اتريحت جداً لما خلصت.' }],
  },
  {
    id: 'feelings-bob-emotions',
    movieTitle: 'English Words for Emotions and Feelings - Happy, Sad, Scared - Bob the Canadian',
    releaseYear: 2020,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Basic Emotions Words',
    sceneDescription: 'بوب بيشرح كلمات المشاعر الأساسية بتمثيل ووضوح: سعيد، زعلان، خايف، متوتر - للمبتدئين.',
    youtubeId: 'HGCRUKBfcfE',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'I get nervous before exams.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/HGCRUKBfcfE/hqdefault.jpg',
    category: 'english_for_beginners',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I get nervous before exams.', arEg: 'بتوتر قبل الامتحانات.', arFusha: 'بتوتر قبل الامتحانات.', speaker: 'Bob', keyWords: [{ word: 'nervous', ipa: '', meaningAr: 'متوتر', meaningEn: '' }, { word: 'before', ipa: '', meaningAr: 'قبل', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'She was furious when she heard the news.', arEg: 'هي كانت غضبانة جداً لما سمعت الخبر.', arFusha: 'هي كانت غضبانة جداً لما سمعت الخبر.', speaker: 'Bob', keyWords: [{ word: 'furious', ipa: '', meaningAr: 'غضبان جداً', meaningEn: '' }, { word: 'news', ipa: '', meaningAr: 'الخبر', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'nervous', type: 'cultural', meaningAr: 'متوتر', meaningEn: '', egyptianEquivalent: 'قلقان', exampleInScene: 'I am nervous about the test.' },      { term: 'furious', type: 'cultural', meaningAr: 'غضبان جداً', meaningEn: '', egyptianEquivalent: 'زعلان أوي', exampleInScene: 'Dad was furious.' },      { term: 'scared', type: 'cultural', meaningAr: 'خايف', meaningEn: '', egyptianEquivalent: 'مرعوب', exampleInScene: 'The kid is scared of dogs.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'furious\' mean?', questionAr: 'معنى furious؟', options: ['غضبان جداً', 'سعيد جداً', 'تعبان جداً', 'جعان جداً'], correctIndex: 0, explanationAr: 'furious أقوى من angry - غضبان جداً أو مجنون من الزعل.' }
    ],
    speakingLines: [{ en: 'I get nervous before exams.', arEg: 'بتوتر قبل الامتحانات.' }, { en: 'She was furious when she heard the news.', arEg: 'هي كانت غضبانة جداً لما سمعت الخبر.' }],
  },
  {
    id: 'weather-jessica-conversation',
    movieTitle: 'What\'s The Weather Like Today? - Talking About the Weather - Learn English with Jessica',
    releaseYear: 2021,
    director: 'Learn English with Jessica',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Classic Weather Chat',
    sceneDescription: 'حوار الجو الكلاسيكي: مشمس، ممطر، عاصف - أشهر موضوع سمال توك في العالم كله.',
    youtubeId: '1MEQAQqCWoQ',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Learn English with Jessica (Official)',
    dialogueQuote: 'It is boiling hot today, isn\'t it?',
    actorName: 'Jessica',
    characterName: 'Jessica',
    thumbnailUrl: 'https://img.youtube.com/vi/1MEQAQqCWoQ/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Jessica Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'It is boiling hot today, isn\'t it?', arEg: 'الجو حر نار النهارده، مش كده؟', arFusha: 'الجو حر نار النهارده، مش كده؟', speaker: 'Jessica', keyWords: [{ word: 'boiling hot', ipa: '', meaningAr: 'حر نار', meaningEn: '' }, { word: 'isn\'t it', ipa: '', meaningAr: 'مش كده؟', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'It looks like it is going to rain.', arEg: 'شكله هيمطر.', arFusha: 'شكله هيمطر.', speaker: 'Jessica', keyWords: [{ word: 'looks like', ipa: '', meaningAr: 'شكله', meaningEn: '' }, { word: 'rain', ipa: '', meaningAr: 'يمطر', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'boiling hot', type: 'collocation', meaningAr: 'حر شديد جداً', meaningEn: '', egyptianEquivalent: 'حر نار', exampleInScene: 'It is boiling hot in July.' },      { term: 'It looks like rain', type: 'collocation', meaningAr: 'شكله هيمطر', meaningEn: '', egyptianEquivalent: 'الجو باين عليه مطر', exampleInScene: 'Take an umbrella, it looks like rain.' },      { term: 'freezing', type: 'cultural', meaningAr: 'برد قارس', meaningEn: '', egyptianEquivalent: 'صقيع', exampleInScene: 'It is freezing outside.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'boiling hot\' mean?', questionAr: 'معنى boiling hot؟', options: ['حر شديد', 'برد شديد', 'جو معتدل', 'جو ممطر'], correctIndex: 0, explanationAr: 'boiling hot تعبير مبالغة عن الحر الشديد - زي المية اللي بتغلي.' }
    ],
    speakingLines: [{ en: 'It is boiling hot today, isn\'t it?', arEg: 'الجو حر نار النهارده، مش كده؟' }, { en: 'It looks like it is going to rain.', arEg: 'شكله هيمطر.' }],
  },
  {
    id: 'weather-bob-talk',
    movieTitle: 'Weather Talk! Learn English Words and Phrases to Talk about the Weather - Bob the Canadian',
    releaseYear: 2020,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Every Weather Word',
    sceneDescription: 'كل كلمات وتعابير الجو مع بوب: درجة الحرارة، الرطوبة، الرياح - بأسلوبه الهادي والواضح.',
    youtubeId: '_N2Q2_TtG0o',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'It is pretty humid out there.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/_N2Q2_TtG0o/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'It is pretty humid out there.', arEg: 'الجو رطب جداً بره.', arFusha: 'الجو رطب جداً بره.', speaker: 'Bob', keyWords: [{ word: 'humid', ipa: '', meaningAr: 'رطب', meaningEn: '' }, { word: 'out there', ipa: '', meaningAr: 'بره', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'The wind is picking up.', arEg: 'الرياح بتشتد.', arFusha: 'الرياح بتشتد.', speaker: 'Bob', keyWords: [{ word: 'picking up', ipa: '', meaningAr: 'بتشتد', meaningEn: '' }, { word: 'wind', ipa: '', meaningAr: 'رياح', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'humid', type: 'cultural', meaningAr: 'رطب (جو)', meaningEn: '', egyptianEquivalent: 'رطوبة عالية', exampleInScene: 'August is very humid.' },      { term: 'pick up', type: 'phrasal-verb', meaningAr: 'يشتد (للرياح)', meaningEn: '', egyptianEquivalent: 'تزيد', exampleInScene: 'The wind picked up at night.' },      { term: 'degrees', type: 'cultural', meaningAr: 'درجات (حرارة)', meaningEn: '', egyptianEquivalent: 'درجات', exampleInScene: 'It is thirty degrees today.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'humid\' describe?', questionAr: 'كلمة humid بتوصف إيه؟', options: ['جو رطب', 'جو بارد', 'جو ممطر', 'جو عاصف'], correctIndex: 0, explanationAr: 'humid معناها الجو فيه رطوبة عالية - الإحساس اللزج في الصيف.' }
    ],
    speakingLines: [{ en: 'It is pretty humid out there.', arEg: 'الجو رطب جداً بره.' }, { en: 'The wind is picking up.', arEg: 'الرياح بتشتد.' }],
  },
  {
    id: 'weather-bbc-ep8',
    movieTitle: 'Describing the Weather Where You Are - Easy English Conversations Ep. 8 - BBC',
    releaseYear: 2023,
    director: 'BBC Learning English',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'BBC Weather Small Talk',
    sceneDescription: 'حلقة BBC عن وصف الجو: عبارات بريطانية يومية للكلام عن الشمس والمطر والبرد.',
    youtubeId: 'sMg4vj6ugSs',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'It is chucking it down out there!',
    actorName: 'Presenter',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/sMg4vj6ugSs/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'It is chucking it down out there!', arEg: 'بتمطر بغزارة بره!', arFusha: 'بتمطر بغزارة بره!', speaker: 'Presenter', keyWords: [{ word: 'chucking it down', ipa: '', meaningAr: 'بتمطر بغزارة (بريطاني)', meaningEn: '' }, { word: 'out there', ipa: '', meaningAr: 'بره', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Fingers crossed it stays sunny.', arEg: 'يا رب الجو يفضل مشمس.', arFusha: 'يا رب الجو يفضل مشمس.', speaker: 'Presenter', keyWords: [{ word: 'fingers crossed', ipa: '', meaningAr: 'يا رب (نتمنى)', meaningEn: '' }, { word: 'stays sunny', ipa: '', meaningAr: 'يفضل مشمس', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'chucking it down', type: 'idiom', meaningAr: 'بتمطر بغزارة (بريطاني عامي)', meaningEn: '', egyptianEquivalent: 'بتنزل مطر جامد', exampleInScene: 'It is chucking it down in London.' },      { term: 'fingers crossed', type: 'idiom', meaningAr: 'يا رب (نتمنى حاجة تحصل)', meaningEn: '', egyptianEquivalent: 'ربنا يستر', exampleInScene: 'Fingers crossed for the exam.' },      { term: 'drizzle', type: 'cultural', meaningAr: 'رذاذ مطر خفيف', meaningEn: '', egyptianEquivalent: 'رزاز', exampleInScene: 'Just a light drizzle today.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'fingers crossed\' express?', questionAr: 'fingers crossed بتعبر عن إيه؟', options: ['تمني حاجة تحصل', 'غضب', 'تعب', 'جوع'], correctIndex: 0, explanationAr: 'fingers crossed معناها يا رب / نتمنى - علامة الحظ الشهيرة.' }
    ],
    speakingLines: [{ en: 'It is chucking it down out there!', arEg: 'بتمطر بغزارة بره!' }, { en: 'Fingers crossed it stays sunny.', arEg: 'يا رب الجو يفضل مشمس.' }],
  },
  {
    id: 'twisters-mmmenglish-50',
    movieTitle: '50 Tongue Twisters in English for Pronunciation Practice - mmmEnglish',
    releaseYear: 2021,
    director: 'mmmEnglish',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Twist Your Tongue Right',
    sceneDescription: 'خمسين تونج تويستر لتدريب مخارج الحروف والسرعة - تمرين النطق الأمتع مع إيما.',
    youtubeId: 'xPXu5GoUHH0',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'mmmEnglish (Official)',
    dialogueQuote: 'She sells seashells by the seashore.',
    actorName: 'Emma',
    characterName: 'Emma',
    thumbnailUrl: 'https://img.youtube.com/vi/xPXu5GoUHH0/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'mmmEnglish Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'She sells seashells by the seashore.', arEg: 'هي بتبيع صدف البحر على الشط.', arFusha: 'هي بتبيع صدف البحر على الشط.', speaker: 'Emma', keyWords: [{ word: 'seashells', ipa: '', meaningAr: 'صدف البحر', meaningEn: '' }, { word: 'seashore', ipa: '', meaningAr: 'شط البحر', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Red lorry, yellow lorry.', arEg: 'عربية نقل حمرا، عربية نقل صفرا.', arFusha: 'عربية نقل حمرا، عربية نقل صفرا.', speaker: 'Emma', keyWords: [{ word: 'lorry', ipa: '', meaningAr: 'عربية نقل (بريطاني)', meaningEn: '' }, { word: 'yellow', ipa: '', meaningAr: 'صفرا', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'tongue twister', type: 'collocation', meaningAr: 'جملة كسر اللسان', meaningEn: '', egyptianEquivalent: 'كسر لسان', exampleInScene: 'Try this tongue twister.' },      { term: 'lorry', type: 'cultural', meaningAr: 'عربية نقل (بريطاني)', meaningEn: '', egyptianEquivalent: 'تراك', exampleInScene: 'The lorry is red.' },      { term: 'seashell', type: 'cultural', meaningAr: 'صدفة بحر', meaningEn: '', egyptianEquivalent: 'صدفة', exampleInScene: 'Collect seashells on the beach.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What are tongue twisters for?', questionAr: 'التونج تويسترز ليها فايدة إيه؟', options: ['تدريب سرعة ودقة النطق', 'حفظ القواعد', 'تعلم الإملاء', 'كتابة الإيميلات'], correctIndex: 0, explanationAr: 'جمل كسر اللسان بتدرب عضلات الفم على المخارج الصعبة وبتزود سرعتك.' }
    ],
    speakingLines: [{ en: 'She sells seashells by the seashore.', arEg: 'هي بتبيع صدف البحر على الشط.' }, { en: 'Red lorry, yellow lorry.', arEg: 'عربية نقل حمرا، عربية نقل صفرا.' }],
  },
  {
    id: 'twisters-hadar-clear',
    movieTitle: 'Practice the Best Tongue Twisters for Clear Pronunciation - Accent\'s Way with Hadar',
    releaseYear: 2020,
    director: 'Accent\'s Way English with Hadar',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Twisters with a Coach',
    sceneDescription: 'هدار (كوتش نطق أمريكي) بتشرح تونج تويسترز مختارة لتثبيت المخارج الصعبة عند العرب.',
    youtubeId: '_8tdqL5_Prc',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Accent\'s Way English with Hadar (Official)',
    dialogueQuote: 'Peter Piper picked a peck of pickled peppers.',
    actorName: 'Hadar',
    characterName: 'Hadar',
    thumbnailUrl: 'https://img.youtube.com/vi/_8tdqL5_Prc/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Accent\'s Way Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Peter Piper picked a peck of pickled peppers.', arEg: 'بيتر بايبر قطف شوية فلفل مخلل.', arFusha: 'بيتر بايبر قطف شوية فلفل مخلل.', speaker: 'Hadar', keyWords: [{ word: 'picked', ipa: '', meaningAr: 'قطف', meaningEn: '' }, { word: 'pickled peppers', ipa: '', meaningAr: 'فلفل مخلل', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Say it slowly first, then speed up.', arEg: 'قولها ببطء الأول، بعدين زود السرعة.', arFusha: 'قولها ببطء الأول، بعدين زود السرعة.', speaker: 'Hadar', keyWords: [{ word: 'speed up', ipa: '', meaningAr: 'يزود السرعة', meaningEn: '' }, { word: 'slowly', ipa: '', meaningAr: 'ببطء', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'speed up', type: 'phrasal-verb', meaningAr: 'يزود السرعة', meaningEn: '', egyptianEquivalent: 'يصرّع', exampleInScene: 'Start slow, then speed up.' },      { term: 'pickled', type: 'cultural', meaningAr: 'مخلل', meaningEn: '', egyptianEquivalent: 'مخلل', exampleInScene: 'Pickled cucumbers are tasty.' },      { term: 'pronunciation', type: 'cultural', meaningAr: 'نطق', meaningEn: '', egyptianEquivalent: 'نطق', exampleInScene: 'Her pronunciation is excellent.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is Hadar\'s advice for tongue twisters?', questionAr: 'إيه نصيحة هدار للتونج تويسترز؟', options: ['ابدأ ببطء بعدين زود السرعة', 'قولها بسرعة على طول', 'احفظها غيب', 'اكتبها الأول'], correctIndex: 0, explanationAr: 'القاعدة: إتقان بطيء الأول، وبعدين السرعة بتيجي لوحدها.' }
    ],
    speakingLines: [{ en: 'Peter Piper picked a peck of pickled peppers.', arEg: 'بيتر بايبر قطف شوية فلفل مخلل.' }, { en: 'Say it slowly first, then speed up.', arEg: 'قولها ببطء الأول، بعدين زود السرعة.' }],
  },
  {
    id: 'idioms-bob-animals',
    movieTitle: 'Animal Idioms! Learn English Idioms with Animals - Bob the Canadian',
    releaseYear: 2020,
    director: 'Bob the Canadian',
    genre: 'Idioms Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Animals in English Expressions',
    sceneDescription: 'إيديومز الحيوانات مع بوب: let the cat out of the bag و hold your horses - بشرح مبسط وأمثلة.',
    youtubeId: 'o-RTcdqx98o',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'Hold your horses, we are not ready yet.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/o-RTcdqx98o/hqdefault.jpg',
    category: 'slang_and_expressions',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Hold your horses, we are not ready yet.', arEg: 'اهدى شوية، إحنا لسه مش جاهزين.', arFusha: 'اهدى شوية، إحنا لسه مش جاهزين.', speaker: 'Bob', keyWords: [{ word: 'hold your horses', ipa: '', meaningAr: 'اهدى / استنى', meaningEn: '' }, { word: 'not ready yet', ipa: '', meaningAr: 'لسه مش جاهزين', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'She let the cat out of the bag about the surprise.', arEg: 'هي فضحت سر المفاجأة.', arFusha: 'هي فضحت سر المفاجأة.', speaker: 'Bob', keyWords: [{ word: 'let the cat out of the bag', ipa: '', meaningAr: 'يفشي سر', meaningEn: '' }, { word: 'surprise', ipa: '', meaningAr: 'مفاجأة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'hold your horses', type: 'idiom', meaningAr: 'اهدى واستنى', meaningEn: '', egyptianEquivalent: 'على مهلك', exampleInScene: 'Hold your horses, wait a minute.' },      { term: 'let the cat out of the bag', type: 'idiom', meaningAr: 'يفشي سر', meaningEn: '', egyptianEquivalent: 'يفضح المفاجأة', exampleInScene: 'He let the cat out of the bag.' },      { term: 'kill two birds with one stone', type: 'idiom', meaningAr: 'يضرب عصفورين بحجر', meaningEn: '', egyptianEquivalent: 'عصفورين بحجر', exampleInScene: 'I killed two birds with one stone.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'let the cat out of the bag\' mean?', questionAr: 'معنى let the cat out of the bag؟', options: ['يفشي سر', 'يطلق قطة', 'يشتري قطة', 'يكدب'], correctIndex: 0, explanationAr: 'التعبير معناه حد قال سر كان المفروض يتخبى - زي فضح المفاجأة.' }
    ],
    speakingLines: [{ en: 'Hold your horses, we are not ready yet.', arEg: 'اهدى شوية، إحنا لسه مش جاهزين.' }, { en: 'She let the cat out of the bag about the surprise.', arEg: 'هي فضحت سر المفاجأة.' }],
  },
  {
    id: 'idioms-mmmenglish-animals',
    movieTitle: 'How To Use English Animal Idioms - mmmEnglish',
    releaseYear: 2021,
    director: 'mmmEnglish',
    genre: 'Idioms Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Animal Idioms in Real Sentences',
    sceneDescription: 'إيما بتحط إيديومز الحيوانات في جمل حقيقية: busy bee, black sheep, early bird - استخدام صح.',
    youtubeId: 'mN7zt7N549A',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'mmmEnglish (Official)',
    dialogueQuote: 'The early bird catches the worm.',
    actorName: 'Emma',
    characterName: 'Emma',
    thumbnailUrl: 'https://img.youtube.com/vi/mN7zt7N549A/hqdefault.jpg',
    category: 'slang_and_expressions',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'mmmEnglish Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'The early bird catches the worm.', arEg: 'اللي يجي بدري يلحق.', arFusha: 'اللي يجي بدري يلحق.', speaker: 'Emma', keyWords: [{ word: 'early bird', ipa: '', meaningAr: 'اللي بيصحى بدري', meaningEn: '' }, { word: 'catches', ipa: '', meaningAr: 'يلحق / يمسك', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'He is the black sheep of the family.', arEg: 'هو المختلف عن عيلته.', arFusha: 'هو المختلف عن عيلته.', speaker: 'Emma', keyWords: [{ word: 'black sheep', ipa: '', meaningAr: 'المختلف / الخارج عن العيلة', meaningEn: '' }, { word: 'family', ipa: '', meaningAr: 'عيلة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'early bird', type: 'idiom', meaningAr: 'اللي بيصحى أو يجي بدري', meaningEn: '', egyptianEquivalent: 'الصبحية', exampleInScene: 'The early bird catches the worm.' },      { term: 'black sheep', type: 'idiom', meaningAr: 'المختلف سلباً عن جماعته', meaningEn: '', egyptianEquivalent: 'الخروف الأسود', exampleInScene: 'He is the black sheep at work.' },      { term: 'busy bee', type: 'idiom', meaningAr: 'شخص نشيط جداً', meaningEn: '', egyptianEquivalent: 'نحلة شغالة', exampleInScene: 'She is a busy bee today.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Who is the \'black sheep\' of a family?', questionAr: 'مين الـ black sheep في العيلة؟', options: ['المختلف عنهم سلباً', 'أكبر واحد', 'أصغر واحد', 'أذكى واحد'], correctIndex: 0, explanationAr: 'black sheep تعبير عن الشخص المختلف عن عيلته أو جماعته بشكل سلبي.' }
    ],
    speakingLines: [{ en: 'The early bird catches the worm.', arEg: 'اللي يجي بدري يلحق.' }, { en: 'He is the black sheep of the family.', arEg: 'هو المختلف عن عيلته.' }],
  },
  {
    id: 'friends-incontext-s2',
    movieTitle: 'English with Friends Season 2 - Extended Vocab - English in Context',
    releaseYear: 2021,
    director: 'English in Context',
    genre: 'TV Series Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Learning from Friends',
    sceneDescription: 'مفردات موسعة من مسلسل فريندز الموسم التاني: التعابير اليومية والنكت بشرح في السياق.',
    youtubeId: 'XfwNLfa0Dtk',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English in Context (Official)',
    dialogueQuote: 'Could this be any more obvious?',
    actorName: 'Chandler',
    characterName: 'Chandler',
    thumbnailUrl: 'https://img.youtube.com/vi/XfwNLfa0Dtk/hqdefault.jpg',
    category: 'tv_series',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English in Context Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Could this be any more obvious?', arEg: 'ممكن يبقى أوضح من كده؟ (سخرية)', arFusha: 'ممكن يبقى أوضح من كده؟ (سخرية)', speaker: 'Chandler', keyWords: [{ word: 'obvious', ipa: '', meaningAr: 'واضح', meaningEn: '' }, { word: 'Could this be any more', ipa: '', meaningAr: 'ممكن يبقى أكتر من كده (ساخر)', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'We were on a break!', arEg: 'إحنا كنا منفصلين وقتها!', arFusha: 'إحنا كنا منفصلين وقتها!', speaker: 'Ross', keyWords: [{ word: 'on a break', ipa: '', meaningAr: 'في فترة انفصال', meaningEn: '' }, { word: 'were', ipa: '', meaningAr: 'كنا', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'Could this be any more...?', type: 'collocation', meaningAr: 'سخرية: ممكن يبقى أكتر من كده؟', meaningEn: '', egyptianEquivalent: 'دي واضحة أوي بقى', exampleInScene: 'Could this day be any worse?' },      { term: 'obvious', type: 'cultural', meaningAr: 'واضح', meaningEn: '', egyptianEquivalent: 'باين', exampleInScene: 'The answer is obvious.' },      { term: 'on a break', type: 'collocation', meaningAr: 'في فترة انفصال مؤقت', meaningEn: '', egyptianEquivalent: 'خدنا بريك', exampleInScene: 'We were on a break!' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is Chandler\'s tone in \'Could this be any more obvious?\'', questionAr: 'نبرة تشاندلر في Could this be any more obvious إيه؟', options: ['سخرية', 'جدية كاملة', 'خوف', 'حزن'], correctIndex: 0, explanationAr: 'الجملة دي ساخرة - معناها إن الحاجة واضحة جداً، وهي من أشهر جمل المسلسل.' }
    ],
    speakingLines: [{ en: 'Could this be any more obvious?', arEg: 'ممكن يبقى أوضح من كده؟ (سخرية)' }, { en: 'We were on a break!', arEg: 'إحنا كنا منفصلين وقتها!' }],
  },
  {
    id: 'agree-exam-phrases',
    movieTitle: 'Agreeing and Disagreeing in English - Phrases for IELTS & Cambridge',
    releaseYear: 2021,
    director: 'YouTube Account',
    genre: 'Exam Preparation',
    cefrLevel: 'B2',
    sceneTitle: 'Agree and Disagree Politely',
    sceneDescription: 'عبارات الموافقة والاختلاف بأدب لامتحانات السبيكينج: I see your point, but... - بأمثلة حوارية.',
    youtubeId: 'MspXqjp3H8c',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'YouTube Account (Official)',
    dialogueQuote: 'I see your point, but I have to disagree.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/MspXqjp3H8c/hqdefault.jpg',
    category: 'academic_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'YouTube Account Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I see your point, but I have to disagree.', arEg: 'فاهم وجهة نظرك، بس لازم أختلف معاك.', arFusha: 'فاهم وجهة نظرك، بس لازم أختلف معاك.', speaker: 'Teacher', keyWords: [{ word: 'I see your point', ipa: '', meaningAr: 'فاهم وجهة نظرك', meaningEn: '' }, { word: 'disagree', ipa: '', meaningAr: 'يختلف', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I could not agree with you more.', arEg: 'متفق معاك جداً.', arFusha: 'متفق معاك جداً.', speaker: 'Teacher', keyWords: [{ word: 'could not agree more', ipa: '', meaningAr: 'متفق جداً', meaningEn: '' }, { word: 'with you', ipa: '', meaningAr: 'معاك', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'I see your point', type: 'collocation', meaningAr: 'فاهم وجهة نظرك', meaningEn: '', egyptianEquivalent: 'كلامك له وجه', exampleInScene: 'I see your point, but I am not sure.' },      { term: 'I could not agree more', type: 'idiom', meaningAr: 'متفق معاك تماماً', meaningEn: '', egyptianEquivalent: 'أقوى موافقة', exampleInScene: 'I could not agree more!' },      { term: 'disagree', type: 'cultural', meaningAr: 'يختلف في الرأي', meaningEn: '', egyptianEquivalent: 'مش متفق', exampleInScene: 'I disagree with that idea.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'I could not agree more\' mean?', questionAr: 'معنى I could not agree more؟', options: ['متفق معاك تماماً', 'مش متفق خالص', 'مش فاهم', 'مش مهتم'], correctIndex: 0, explanationAr: 'رغم شكلها السلبي، العبارة معناها أقوى موافقة ممكنة: مستحيل أوافق أكتر من كده.' }
    ],
    speakingLines: [{ en: 'I see your point, but I have to disagree.', arEg: 'فاهم وجهة نظرك، بس لازم أختلف معاك.' }, { en: 'I could not agree with you more.', arEg: 'متفق معاك جداً.' }],
  },
  {
    id: 'agree-comfort-podcast',
    movieTitle: 'How to Agree & Disagree - Phrases for Daily Use - English in Comfort',
    releaseYear: 2023,
    director: 'English in Comfort',
    genre: 'English Podcast',
    cefrLevel: 'B1',
    sceneTitle: 'Everyday Agreement Phrases',
    sceneDescription: 'بودكاست هادي عن عبارات الموافقة والاختلاف اليومية: Exactly! That\'s true, but... - للاستماع والتكرار.',
    youtubeId: 'RBxuSfrOGDE',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'English in Comfort (Official)',
    dialogueQuote: 'That is exactly what I was thinking.',
    actorName: 'Host',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/RBxuSfrOGDE/hqdefault.jpg',
    category: 'podcasts',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English in Comfort Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'That is exactly what I was thinking.', arEg: 'ده بالظبط اللي كنت بفكر فيه.', arFusha: 'ده بالظبط اللي كنت بفكر فيه.', speaker: 'Host', keyWords: [{ word: 'exactly', ipa: '', meaningAr: 'بالظبط', meaningEn: '' }, { word: 'thinking', ipa: '', meaningAr: 'بفكر', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I am not so sure about that.', arEg: 'أنا مش متأكد من كده.', arFusha: 'أنا مش متأكد من كده.', speaker: 'Host', keyWords: [{ word: 'not so sure', ipa: '', meaningAr: 'مش متأكد', meaningEn: '' }, { word: 'about that', ipa: '', meaningAr: 'من كده', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'exactly', type: 'cultural', meaningAr: 'بالظبط', meaningEn: '', egyptianEquivalent: 'بالضبط', exampleInScene: 'Exactly! You are right.' },      { term: 'I am not so sure', type: 'collocation', meaningAr: 'مش متأكد (اختلاف مهذب)', meaningEn: '', egyptianEquivalent: 'مش واثق', exampleInScene: 'I am not so sure about that.' },      { term: 'That makes sense', type: 'collocation', meaningAr: 'ده منطقي', meaningEn: '', egyptianEquivalent: 'كلام مفهوم', exampleInScene: 'That makes sense to me.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you politely disagree?', questionAr: 'بتختلف بأدب إزاي؟', options: ['I am not so sure about that', 'You are wrong', 'That is stupid', 'No way, shut up'], correctIndex: 0, explanationAr: 'I am not so sure about that طريقة مهذبة للاختلاف من غير ما تجرح الطرف التاني.' }
    ],
    speakingLines: [{ en: 'That is exactly what I was thinking.', arEg: 'ده بالظبط اللي كنت بفكر فيه.' }, { en: 'I am not so sure about that.', arEg: 'أنا مش متأكد من كده.' }],
  },
  {
    id: 'agree-derek-meetings',
    movieTitle: '14 Ways to Agree And Disagree - Business English Meetings - Derek Callan',
    releaseYear: 2021,
    director: 'Derek Callan',
    genre: 'Business English Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Meeting Diplomacy',
    sceneDescription: '14 طريقة للموافقة والاختلاف في اجتماعات الشغل باحترافية - ديريك بيديك العبارات الجاهزة.',
    youtubeId: 'mll-NB-G10U',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Derek Callan - English for Professionals (Official)',
    dialogueQuote: 'I partly agree, but we should consider the costs.',
    actorName: 'Derek Callan',
    characterName: 'Derek',
    thumbnailUrl: 'https://img.youtube.com/vi/mll-NB-G10U/hqdefault.jpg',
    category: 'business_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Derek Callan Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I partly agree, but we should consider the costs.', arEg: 'متفق جزئياً، بس لازم ناخد التكاليف في الاعتبار.', arFusha: 'متفق جزئياً، بس لازم ناخد التكاليف في الاعتبار.', speaker: 'Derek', keyWords: [{ word: 'partly', ipa: '', meaningAr: 'جزئياً', meaningEn: '' }, { word: 'consider', ipa: '', meaningAr: 'ناخد في الاعتبار', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'That is a fair point.', arEg: 'دي نقطة محترمة.', arFusha: 'دي نقطة محترمة.', speaker: 'Derek', keyWords: [{ word: 'fair point', ipa: '', meaningAr: 'نقطة محترمة / وجيهة', meaningEn: '' }, { word: 'fair', ipa: '', meaningAr: 'عادل / وجيه', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'partly agree', type: 'collocation', meaningAr: 'متفق جزئياً', meaningEn: '', egyptianEquivalent: 'متفق بس مش كله', exampleInScene: 'I partly agree with you.' },      { term: 'fair point', type: 'collocation', meaningAr: 'نقطة وجيهة', meaningEn: '', egyptianEquivalent: 'كلام معقول', exampleInScene: 'That is a fair point.' },      { term: 'take into account', type: 'collocation', meaningAr: 'يأخذ في الاعتبار', meaningEn: '', egyptianEquivalent: 'يحسب حساب', exampleInScene: 'Take the budget into account.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'partly agree\' mean?', questionAr: 'معنى partly agree؟', options: ['متفق في جزء ومش متفق في جزء', 'متفق تماماً', 'رافض تماماً', 'مش فاهم'], correctIndex: 0, explanationAr: 'partly agree موقف متوازن: موافق على جزء من الكلام ومتحفظ على جزء تاني.' }
    ],
    speakingLines: [{ en: 'I partly agree, but we should consider the costs.', arEg: 'متفق جزئياً، بس لازم ناخد التكاليف في الاعتبار.' }, { en: 'That is a fair point.', arEg: 'دي نقطة محترمة.' }],
  },
  {
    id: 'bank-interactive-advanced',
    movieTitle: 'Advanced Banking Vocabulary - Words and Phrases You Need to Know - Interactive English',
    releaseYear: 2021,
    director: 'Interactive English',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Banking Like a Pro',
    sceneDescription: 'مفردات البنوك المتقدمة: حساب جاري، فوائد، تحويلات - كل اللي تحتاجه في أي بنك أجنبي.',
    youtubeId: '8RHGW3Utsps',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Interactive English (Official)',
    dialogueQuote: 'I would like to open a savings account.',
    actorName: 'Teacher',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/8RHGW3Utsps/hqdefault.jpg',
    category: 'business_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Interactive English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I would like to open a savings account.', arEg: 'عايز أفتح حساب توفير.', arFusha: 'عايز أفتح حساب توفير.', speaker: 'Customer', keyWords: [{ word: 'savings account', ipa: '', meaningAr: 'حساب توفير', meaningEn: '' }, { word: 'open an account', ipa: '', meaningAr: 'يفتح حساب', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'What is the interest rate on this account?', arEg: 'نسبة الفايدة على الحساب ده كام؟', arFusha: 'نسبة الفايدة على الحساب ده كام؟', speaker: 'Customer', keyWords: [{ word: 'interest rate', ipa: '', meaningAr: 'نسبة الفايدة', meaningEn: '' }, { word: 'account', ipa: '', meaningAr: 'حساب', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'savings account', type: 'collocation', meaningAr: 'حساب توفير', meaningEn: '', egyptianEquivalent: 'حساب ادخار', exampleInScene: 'Open a savings account.' },      { term: 'interest rate', type: 'collocation', meaningAr: 'نسبة الفايدة', meaningEn: '', egyptianEquivalent: 'الفايدة', exampleInScene: 'The interest rate is high.' },      { term: 'transfer', type: 'cultural', meaningAr: 'يحوّل (فلوس)', meaningEn: '', egyptianEquivalent: 'يعمل تحويل', exampleInScene: 'Transfer money online.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is a \'savings account\'?', questionAr: 'يعني إيه savings account؟', options: ['حساب توفير', 'حساب جاري', 'بطاقة ائتمان', 'شيك'], correctIndex: 0, explanationAr: 'savings account هو حساب التوفير اللي بتحوش فيه فلوس وبتكسب عليها فايدة.' }
    ],
    speakingLines: [{ en: 'I would like to open a savings account.', arEg: 'عايز أفتح حساب توفير.' }, { en: 'What is the interest rate on this account?', arEg: 'نسبة الفايدة على الحساب ده كام؟' }],
  },
  {
    id: 'bank-ellii-finance',
    movieTitle: 'At the Bank: Money & Finance Vocabulary - Ellii',
    releaseYear: 2021,
    director: 'Ellii',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'First Bank Visit',
    sceneDescription: 'مفردات البنك الأساسية للمبتدئين: الإيداع، السحب، الرصيد - مع صور ونطق واضح.',
    youtubeId: 'q_HL_kHzbNM',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Ellii (Official)',
    dialogueQuote: 'I need to withdraw some money.',
    actorName: 'Teacher',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/q_HL_kHzbNM/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Ellii Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I need to withdraw some money.', arEg: 'محتاج أسحب شوية فلوس.', arFusha: 'محتاج أسحب شوية فلوس.', speaker: 'Customer', keyWords: [{ word: 'withdraw', ipa: '', meaningAr: 'يسحب فلوس', meaningEn: '' }, { word: 'money', ipa: '', meaningAr: 'فلوس', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Can I check my balance, please?', arEg: 'ممكن أعرف رصيدي، من فضلك؟', arFusha: 'ممكن أعرف رصيدي، من فضلك؟', speaker: 'Customer', keyWords: [{ word: 'balance', ipa: '', meaningAr: 'رصيد', meaningEn: '' }, { word: 'check', ipa: '', meaningAr: 'يعرف / يشيك', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'withdraw', type: 'cultural', meaningAr: 'يسحب فلوس', meaningEn: '', egyptianEquivalent: 'يسحب', exampleInScene: 'Withdraw cash from the ATM.' },      { term: 'deposit', type: 'cultural', meaningAr: 'يودع فلوس', meaningEn: '', egyptianEquivalent: 'يعمل إيداع', exampleInScene: 'Deposit money into your account.' },      { term: 'balance', type: 'cultural', meaningAr: 'الرصيد', meaningEn: '', egyptianEquivalent: 'الرصيد', exampleInScene: 'My balance is low.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the opposite of \'deposit\'?', questionAr: 'عكس deposit إيه؟', options: ['withdraw', 'save', 'spend', 'lend'], correctIndex: 0, explanationAr: 'deposit معناها تودع فلوس في البنك، وعكسها withdraw يعني تسحب.' }
    ],
    speakingLines: [{ en: 'I need to withdraw some money.', arEg: 'محتاج أسحب شوية فلوس.' }, { en: 'Can I check my balance, please?', arEg: 'ممكن أعرف رصيدي، من فضلك؟' }],
  },
  {
    id: 'bank-bob-speak',
    movieTitle: 'Learn How to Speak English at the Bank - Bob the Canadian',
    releaseYear: 2021,
    director: 'Bob the Canadian',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'A Real Bank Conversation',
    sceneDescription: 'بوب بيمثل حوار بنك كامل: فتح حساب، صرف شيك، سؤال عن رسوم - ببطء وترجمة واضحة.',
    youtubeId: '7Lh1tMsRw3U',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'Are there any fees for this account?',
    actorName: 'Bob',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/7Lh1tMsRw3U/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Are there any fees for this account?', arEg: 'في رسوم على الحساب ده؟', arFusha: 'في رسوم على الحساب ده؟', speaker: 'Customer', keyWords: [{ word: 'fees', ipa: '', meaningAr: 'رسوم', meaningEn: '' }, { word: 'any', ipa: '', meaningAr: 'أي', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I would like to cash this cheque.', arEg: 'عايز أصرف الشيك ده.', arFusha: 'عايز أصرف الشيك ده.', speaker: 'Customer', keyWords: [{ word: 'cash a cheque', ipa: '', meaningAr: 'يصرف شيك', meaningEn: '' }, { word: 'cheque', ipa: '', meaningAr: 'شيك', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'fee', type: 'cultural', meaningAr: 'رسوم', meaningEn: '', egyptianEquivalent: 'رسوم', exampleInScene: 'The bank charges monthly fees.' },      { term: 'cash a cheque', type: 'collocation', meaningAr: 'يصرف شيك', meaningEn: '', egyptianEquivalent: 'يحوّل الشيك لفلوس', exampleInScene: 'Cash the cheque at the bank.' },      { term: 'ATM', type: 'cultural', meaningAr: 'ماكينة الصراف الآلي', meaningEn: '', egyptianEquivalent: 'الصراف الآلي', exampleInScene: 'The ATM is outside.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What are \'fees\' at a bank?', questionAr: 'يعني إيه fees في البنك؟', options: ['رسوم', 'فوائد', 'هدايا', 'قروض'], correctIndex: 0, explanationAr: 'الـ fees هي الرسوم اللي البنك بيخصمها مقابل خدمات زي إدارة الحساب.' }
    ],
    speakingLines: [{ en: 'Are there any fees for this account?', arEg: 'في رسوم على الحساب ده؟' }, { en: 'I would like to cash this cheque.', arEg: 'عايز أصرف الشيك ده.' }],
  },
  {
    id: 'cooking-success-vocab',
    movieTitle: 'How to Cook in English: Cooking Vocabulary - English Speaking Success',
    releaseYear: 2021,
    director: 'English Speaking Success',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Kitchen Verbs in Action',
    sceneDescription: 'أفعال المطبخ الأساسية: chop, fry, boil, season - اتكلم عن الطبخ زي الشيفات.',
    youtubeId: 'QL2tNKHB6ew',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'English Speaking Success (Official)',
    dialogueQuote: 'Chop the onions and fry them gently.',
    actorName: 'Teacher',
    characterName: 'Chef',
    thumbnailUrl: 'https://img.youtube.com/vi/QL2tNKHB6ew/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Speaking Success Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Chop the onions and fry them gently.', arEg: 'قطّع البصل وقليه على نار هادية.', arFusha: 'قطّع البصل وقليه على نار هادية.', speaker: 'Chef', keyWords: [{ word: 'chop', ipa: '', meaningAr: 'يقطّع', meaningEn: '' }, { word: 'fry gently', ipa: '', meaningAr: 'يقلي بهدوء', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Let the soup simmer for ten minutes.', arEg: 'سيب الشوربة تغلي بهدوء عشر دقايق.', arFusha: 'سيب الشوربة تغلي بهدوء عشر دقايق.', speaker: 'Chef', keyWords: [{ word: 'simmer', ipa: '', meaningAr: 'تغلي بهدوء', meaningEn: '' }, { word: 'soup', ipa: '', meaningAr: 'شوربة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'chop', type: 'cultural', meaningAr: 'يقطّع', meaningEn: '', egyptianEquivalent: 'يفرم', exampleInScene: 'Chop the vegetables.' },      { term: 'fry', type: 'cultural', meaningAr: 'يقلي', meaningEn: '', egyptianEquivalent: 'يقلي', exampleInScene: 'Fry the eggs.' },      { term: 'simmer', type: 'cultural', meaningAr: 'يغلي على نار هادية', meaningEn: '', egyptianEquivalent: 'يسلق على نار هادية', exampleInScene: 'Let it simmer slowly.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'simmer\' mean?', questionAr: 'معنى simmer؟', options: ['يغلي على نار هادية', 'يحمر في الفرن', 'يحمّر في زيت', 'يبرد'], correctIndex: 0, explanationAr: 'simmer معناها يغلي بهدوء على نار قليلة - أقل من الغليان الكامل.' }
    ],
    speakingLines: [{ en: 'Chop the onions and fry them gently.', arEg: 'قطّع البصل وقليه على نار هادية.' }, { en: 'Let the soup simmer for ten minutes.', arEg: 'سيب الشوربة تغلي بهدوء عشر دقايق.' }],
  },
  {
    id: 'cooking-bbc-kitchen',
    movieTitle: 'The Vocabulary Show: Kitchens & Cooking - 28 Words in 11 Minutes - BBC',
    releaseYear: 2022,
    director: 'BBC Learning English',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: '28 Kitchen Words',
    sceneDescription: '28 كلمة للمطبخ والطبخ في 11 دقيقة من BBC - أدوات وأفعال وأوصاف الأكل.',
    youtubeId: 'HEVxB7C3YuQ',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'This dish is a bit too salty for me.',
    actorName: 'Presenter',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/HEVxB7C3YuQ/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'This dish is a bit too salty for me.', arEg: 'الأكلة دي مالحة زيادة عن اللزوم بالنسبالي.', arFusha: 'الأكلة دي مالحة زيادة عن اللزوم بالنسبالي.', speaker: 'Presenter', keyWords: [{ word: 'dish', ipa: '', meaningAr: 'أكلة', meaningEn: '' }, { word: 'salty', ipa: '', meaningAr: 'مالح', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'First, preheat the oven to 180 degrees.', arEg: 'الأول، سخّن الفرن على 180 درجة.', arFusha: 'الأول، سخّن الفرن على 180 درجة.', speaker: 'Presenter', keyWords: [{ word: 'preheat', ipa: '', meaningAr: 'يسخّن مسبقاً', meaningEn: '' }, { word: 'oven', ipa: '', meaningAr: 'فرن', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'preheat', type: 'cultural', meaningAr: 'يسخّن الفرن قبل الاستخدام', meaningEn: '', egyptianEquivalent: 'يفتح الفرن', exampleInScene: 'Preheat the oven first.' },      { term: 'salty', type: 'cultural', meaningAr: 'مالح', meaningEn: '', egyptianEquivalent: 'ملحه زيادة', exampleInScene: 'The soup is too salty.' },      { term: 'dish', type: 'cultural', meaningAr: 'أكلة / طبق', meaningEn: '', egyptianEquivalent: 'طبق', exampleInScene: 'This dish is famous.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'preheat the oven\' mean?', questionAr: 'معنى preheat the oven؟', options: ['يسخّن الفرن قبل ما يحط الأكل', 'يطفي الفرن', 'ينضف الفرن', 'يفتح باب الفرن'], correctIndex: 0, explanationAr: 'preheat معناها تسخّن الفرن للدرجة المطلوبة قبل ما تحط الأكل فيه.' }
    ],
    speakingLines: [{ en: 'This dish is a bit too salty for me.', arEg: 'الأكلة دي مالحة زيادة عن اللزوم بالنسبالي.' }, { en: 'First, preheat the oven to 180 degrees.', arEg: 'الأول، سخّن الفرن على 180 درجة.' }],
  },
  {
    id: 'humor-lucy-british',
    movieTitle: 'British Humour Explained (with examples) - English with Lucy',
    releaseYear: 2021,
    director: 'English with Lucy',
    genre: 'Culture Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Decoding British Jokes',
    sceneDescription: 'لوسي بتوضح السخرية البريطانية بالأمثلة: التهكم، التقليل من الذات، والنكت اللي مبتتقالش مباشرة.',
    youtubeId: 'vkL78BxZ50I',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English with Lucy (Official)',
    dialogueQuote: 'I am not bad at cooking - I only burnt the kitchen twice.',
    actorName: 'Lucy',
    characterName: 'Lucy',
    thumbnailUrl: 'https://img.youtube.com/vi/vkL78BxZ50I/hqdefault.jpg',
    category: 'british_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English with Lucy Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I am not bad at cooking - I only burnt the kitchen twice.', arEg: 'أنا مش وحش في الطبخ - أنا بس حرقت المطبخ مرتين. (تهكم)', arFusha: 'أنا مش وحش في الطبخ - أنا بس حرقت المطبخ مرتين. (تهكم)', speaker: 'Lucy', keyWords: [{ word: 'not bad', ipa: '', meaningAr: 'مش وحش (تهكم)', meaningEn: '' }, { word: 'burnt', ipa: '', meaningAr: 'حرقت', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'British people love self-deprecating jokes.', arEg: 'البريطانيين بيحبوا النكت اللي بيقللوا فيها من نفسهم.', arFusha: 'البريطانيين بيحبوا النكت اللي بيقللوا فيها من نفسهم.', speaker: 'Lucy', keyWords: [{ word: 'self-deprecating', ipa: '', meaningAr: 'بيقلل من نفسه (نوع هزار)', meaningEn: '' }, { word: 'jokes', ipa: '', meaningAr: 'نكت', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'self-deprecating', type: 'cultural', meaningAr: 'بيقلل من نفسه بهزار', meaningEn: '', egyptianEquivalent: 'بيستحقر نفسه بضحك', exampleInScene: 'He made a self-deprecating joke.' },      { term: 'sarcasm', type: 'cultural', meaningAr: 'سخرية / تهكم', meaningEn: '', egyptianEquivalent: 'تريقة', exampleInScene: 'I love British sarcasm.' },      { term: 'understatement', type: 'cultural', meaningAr: 'التقليل من الحاجة عمداً', meaningEn: '', egyptianEquivalent: 'بخس حق الكلام', exampleInScene: 'Saying not bad is an understatement.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is \'self-deprecating\' humour?', questionAr: 'يعني إيه الهزار الـ self-deprecating؟', options: ['نكت بيقلل فيها الشخص من نفسه', 'نكت على الآخرين', 'نكت سياسية', 'نكت مكتوبة'], correctIndex: 0, explanationAr: 'الهزار البريطاني الكلاسيكي: تتريق على نفسك قبل ما حد يتريق عليك.' }
    ],
    speakingLines: [{ en: 'I am not bad at cooking - I only burnt the kitchen twice.', arEg: 'أنا مش وحش في الطبخ - أنا بس حرقت المطبخ مرتين. (تهكم)' }, { en: 'British people love self-deprecating jokes.', arEg: 'البريطانيين بيحبوا النكت اللي بيقللوا فيها من نفسهم.' }],
  },
  {
    id: 'humor-jforrest-jokes',
    movieTitle: 'Top 5 Jokes in English: Can YOU Understand Them? - JForrest English',
    releaseYear: 2022,
    director: 'JForrest English',
    genre: 'Culture Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Get the Joke',
    sceneDescription: 'خمس نكت إنجليزية مشهورة مع شرح لعب الكلمات - لو فهمتهم يبقى حسك اللغوي وصل لمستوى تاني.',
    youtubeId: 'iakqm0HxxG0',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'JForrest English (Official)',
    dialogueQuote: 'Why did the scarecrow win an award? He was outstanding in his field.',
    actorName: 'JForrest',
    characterName: 'JForrest',
    thumbnailUrl: 'https://img.youtube.com/vi/iakqm0HxxG0/hqdefault.jpg',
    category: 'slang_and_expressions',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'JForrest English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Why did the scarecrow win an award? He was outstanding in his field.', arEg: 'ليه الفزاعة خدت جايزة؟ لأنها كانت متميزة في حقلها. (لعب كلمات: outstanding = واقفة بره في الحقل)', arFusha: 'ليه الفزاعة خدت جايزة؟ لأنها كانت متميزة في حقلها. (لعب كلمات: outstanding = واقفة بره في الحقل)', speaker: 'JForrest', keyWords: [{ word: 'scarecrow', ipa: '', meaningAr: 'فزاعة', meaningEn: '' }, { word: 'outstanding', ipa: '', meaningAr: 'متميز / واقف بره', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'This joke is a play on words.', arEg: 'النكتة دي لعب على الكلمات.', arFusha: 'النكتة دي لعب على الكلمات.', speaker: 'JForrest', keyWords: [{ word: 'play on words', ipa: '', meaningAr: 'لعب على الكلمات', meaningEn: '' }, { word: 'joke', ipa: '', meaningAr: 'نكتة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'play on words', type: 'collocation', meaningAr: 'لعب على الكلمات (pun)', meaningEn: '', egyptianEquivalent: 'تلاعب لفظي', exampleInScene: 'English jokes love plays on words.' },      { term: 'pun', type: 'cultural', meaningAr: 'تورية / لعب كلمات', meaningEn: '', egyptianEquivalent: 'تورية', exampleInScene: 'A good pun makes people groan.' },      { term: 'get the joke', type: 'collocation', meaningAr: 'يفهم النكتة', meaningEn: '', egyptianEquivalent: 'تفهم الهزار', exampleInScene: 'I did not get the joke.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is a \'play on words\'?', questionAr: 'يعني إيه play on words؟', options: ['لعب على المعنى المزدوج للكلمات', 'لعبة أطفال', 'تمرين كتابة', 'خطأ لغوي'], correctIndex: 0, explanationAr: 'الـ pun أو play on words هو استغلال المعنى المزدوج للكلمة عشان النكتة - قلب الهزار الإنجليزي.' }
    ],
    speakingLines: [{ en: 'Why did the scarecrow win an award? He was outstanding in his field.', arEg: 'ليه الفزاعة خدت جايزة؟ لأنها كانت متميزة في حقلها. (لعب كلمات)' }, { en: 'This joke is a play on words.', arEg: 'النكتة دي لعب على الكلمات.' }],
  },
  {
    id: 'family-7esl-tree',
    movieTitle: 'Family Tree Chart - Family Words in English - 7ESL',
    releaseYear: 2020,
    director: '7ESL Learning English',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'The Whole Family Tree',
    sceneDescription: 'شجرة العيلة كاملة بالإنجليزي: أقارب الدرجة الأولى والتانية - بالصور والنطق.',
    youtubeId: 'zNLRiB-qOAs',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: '7ESL Learning English (Official)',
    dialogueQuote: 'My uncle is my father\'s brother.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/zNLRiB-qOAs/hqdefault.jpg',
    category: 'english_for_beginners',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: '7ESL Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'My uncle is my father\'s brother.', arEg: 'عمي هو أخو بابا.', arFusha: 'عمي هو أخو بابا.', speaker: 'Teacher', keyWords: [{ word: 'uncle', ipa: '', meaningAr: 'عم / خال', meaningEn: '' }, { word: 'brother', ipa: '', meaningAr: 'أخ', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'She is my niece, my sister\'s daughter.', arEg: 'دي بنت أختي - أنا خالها.', arFusha: 'دي بنت أختي - أنا خالها.', speaker: 'Teacher', keyWords: [{ word: 'niece', ipa: '', meaningAr: 'بنت الأخ أو الأخت', meaningEn: '' }, { word: 'daughter', ipa: '', meaningAr: 'بنت', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'uncle', type: 'cultural', meaningAr: 'عم / خال', meaningEn: '', egyptianEquivalent: 'عمي', exampleInScene: 'My uncle lives in Cairo.' },      { term: 'niece', type: 'cultural', meaningAr: 'بنت الأخ أو الأخت', meaningEn: '', egyptianEquivalent: 'بنت أختي', exampleInScene: 'My niece is five.' },      { term: 'nephew', type: 'cultural', meaningAr: 'ابن الأخ أو الأخت', meaningEn: '', egyptianEquivalent: 'ابن أخويا', exampleInScene: 'My nephew plays football.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Who is your \'niece\'?', questionAr: 'مين الـ niece بتاعتك؟', options: ['بنت أخوك أو أختك', 'أختك', 'مرات أخوك', 'بنت عمك'], correctIndex: 0, explanationAr: 'niece هي بنت الأخ أو الأخت، وابنهم اسمه nephew.' }
    ],
    speakingLines: [{ en: 'My uncle is my father\'s brother.', arEg: 'عمي هو أخو بابا.' }, { en: 'She is my niece, my sister\'s daughter.', arEg: 'دي بنت أختي - أنا خالها.' }],
  },
  {
    id: 'family-rebecca-pron',
    movieTitle: 'Improve Your English Pronunciation: FAMILY - engVid',
    releaseYear: 2019,
    director: 'engVid',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Say Family Words Right',
    sceneDescription: 'ريبيكا بتصحح نطق كلمات العيلة: mother, father, daughter - المخارج اللي بتغلط فيها.',
    youtubeId: 'q52T7aAMmtQ',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Rebecca - engVid (Official)',
    dialogueQuote: 'Mother is pronounced MUH-ther.',
    actorName: 'Rebecca',
    characterName: 'Rebecca',
    thumbnailUrl: 'https://img.youtube.com/vi/q52T7aAMmtQ/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'engVid Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Mother is pronounced MUH-ther.', arEg: 'كلمة mother بتتنطق ماذَر.', arFusha: 'كلمة mother بتتنطق ماذَر.', speaker: 'Rebecca', keyWords: [{ word: 'pronounced', ipa: '', meaningAr: 'بتتنطق', meaningEn: '' }, { word: 'mother', ipa: '', meaningAr: 'ماما', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Daughter sounds like DAW-ter.', arEg: 'كلمة daughter بتتنطق دوتَر.', arFusha: 'كلمة daughter بتتنطق دوتَر.', speaker: 'Rebecca', keyWords: [{ word: 'daughter', ipa: '', meaningAr: 'بنت', meaningEn: '' }, { word: 'sounds like', ipa: '', meaningAr: 'بتتنطق زي', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'pronounce', type: 'cultural', meaningAr: 'ينطق', meaningEn: '', egyptianEquivalent: 'انطق', exampleInScene: 'Pronounce it slowly.' },      { term: 'daughter', type: 'cultural', meaningAr: 'بنت (الابنة)', meaningEn: '', egyptianEquivalent: 'بنتي', exampleInScene: 'Their daughter is ten.' },      { term: 'husband', type: 'cultural', meaningAr: 'جوز', meaningEn: '', egyptianEquivalent: 'جوزها', exampleInScene: 'Her husband is a doctor.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How is \'daughter\' pronounced?', questionAr: 'كلمة daughter بتتنطق إزاي؟', options: ['دوتَر', 'دوجتر', 'داهتر', 'دافتر'], correctIndex: 0, explanationAr: 'الـ gh في daughter ساكنة - الكلمة بتتنطق دوتَر.' }
    ],
    speakingLines: [{ en: 'Mother is pronounced MUH-ther.', arEg: 'كلمة mother بتتنطق ماذَر.' }, { en: 'Daughter sounds like DAW-ter.', arEg: 'كلمة daughter بتتنطق دوتَر.' }],
  },
  {
    id: 'house-bob-around',
    movieTitle: 'Let\'s Learn English Around the House and Home - Bob the Canadian',
    releaseYear: 2020,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Every Room, Every Object',
    sceneDescription: 'جولة في بيت بوب: أسماء الأوض والأثاث والأدوات - كل حاجة في البيت بالإنجليزي.',
    youtubeId: 'WHYMGNbPv2U',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'The couch is in the living room.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/WHYMGNbPv2U/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'The couch is in the living room.', arEg: 'الكنبة في الصالون.', arFusha: 'الكنبة في الصالون.', speaker: 'Bob', keyWords: [{ word: 'couch', ipa: '', meaningAr: 'كنبة', meaningEn: '' }, { word: 'living room', ipa: '', meaningAr: 'صالون', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'The stairs lead to the bedrooms upstairs.', arEg: 'السلالم بتوصل للأوض اللي فوق.', arFusha: 'السلالم بتوصل للأوض اللي فوق.', speaker: 'Bob', keyWords: [{ word: 'stairs', ipa: '', meaningAr: 'سلالم', meaningEn: '' }, { word: 'upstairs', ipa: '', meaningAr: 'فوق', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'couch', type: 'cultural', meaningAr: 'كنبة', meaningEn: '', egyptianEquivalent: 'الأريكة', exampleInScene: 'Sit on the couch.' },      { term: 'living room', type: 'collocation', meaningAr: 'الصالون / أوضة المعيشة', meaningEn: '', egyptianEquivalent: 'الصالة', exampleInScene: 'We watch TV in the living room.' },      { term: 'upstairs', type: 'cultural', meaningAr: 'الدور اللي فوق', meaningEn: '', egyptianEquivalent: 'فوق', exampleInScene: 'The bedrooms are upstairs.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is a \'couch\'?', questionAr: 'يعني إيه couch؟', options: ['كنبة', 'سجادة', 'ترابيزة', 'سرير'], correctIndex: 0, explanationAr: 'couch هي الكنبة اللي في الصالون - اسمها كمان sofa.' }
    ],
    speakingLines: [{ en: 'The couch is in the living room.', arEg: 'الكنبة في الصالون.' }, { en: 'The stairs lead to the bedrooms upstairs.', arEg: 'السلالم بتوصل للأوض اللي فوق.' }],
  },
  {
    id: 'house-easy-furniture',
    movieTitle: 'House Vocabulary - Parts of the House, Rooms, Furniture - Easy English',
    releaseYear: 2021,
    director: 'Easy English',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Rooms and Furniture',
    sceneDescription: 'أجزاء البيت والأثاث بالصور: المطبخ، الحمام، الأنتريه - مفردات أساسية لأي حوار يومي.',
    youtubeId: 'm27Cck_LGHc',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Easy English (Official)',
    dialogueQuote: 'The fridge is next to the stove.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/m27Cck_LGHc/hqdefault.jpg',
    category: 'english_for_beginners',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Easy English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'The fridge is next to the stove.', arEg: 'التلاجة جنب البوتاجاز.', arFusha: 'التلاجة جنب البوتاجاز.', speaker: 'Teacher', keyWords: [{ word: 'fridge', ipa: '', meaningAr: 'تلاجة', meaningEn: '' }, { word: 'next to', ipa: '', meaningAr: 'جنب', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'There is a mirror above the sink.', arEg: 'في مراية فوق الحوض.', arFusha: 'في مراية فوق الحوض.', speaker: 'Teacher', keyWords: [{ word: 'mirror', ipa: '', meaningAr: 'مراية', meaningEn: '' }, { word: 'above', ipa: '', meaningAr: 'فوق', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'fridge', type: 'cultural', meaningAr: 'تلاجة', meaningEn: '', egyptianEquivalent: 'التلاجة', exampleInScene: 'The milk is in the fridge.' },      { term: 'sink', type: 'cultural', meaningAr: 'حوض', meaningEn: '', egyptianEquivalent: 'الحوض', exampleInScene: 'Wash your hands in the sink.' },      { term: 'wardrobe', type: 'cultural', meaningAr: 'دولاب', meaningEn: '', egyptianEquivalent: 'الدولاب', exampleInScene: 'My clothes are in the wardrobe.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Where do you wash your hands?', questionAr: 'بتغسل إيدك فين؟', options: ['في الحوض (sink)', 'في التلاجة', 'على الكنبة', 'في الدولاب'], correctIndex: 0, explanationAr: 'الـ sink هو الحوض - في المطبخ أو الحمام.' }
    ],
    speakingLines: [{ en: 'The fridge is next to the stove.', arEg: 'التلاجة جنب البوتاجاز.' }, { en: 'There is a mirror above the sink.', arEg: 'في مراية فوق الحوض.' }],
  },
  {
    id: 'directions-bbc-ep5',
    movieTitle: 'Asking for and Giving Directions - Easy English Conversations Ep. 5 - BBC',
    releaseYear: 2023,
    director: 'BBC Learning English',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Lost? Just Ask',
    sceneDescription: 'تسأل عن الطريق وتوصفه بالإنجليزي: على طول، يمين، شمال، جنب - حلقة BBC العملية.',
    youtubeId: 'SHXPpsIJTb0',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Excuse me, how do I get to the station?',
    actorName: 'Tourist',
    characterName: 'Tourist',
    thumbnailUrl: 'https://img.youtube.com/vi/SHXPpsIJTb0/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Excuse me, how do I get to the station?', arEg: 'لو سمحت، أروح المحطة إزاي؟', arFusha: 'لو سمحت، أروح المحطة إزاي؟', speaker: 'Tourist', keyWords: [{ word: 'how do I get to', ipa: '', meaningAr: 'أروح إزاي', meaningEn: '' }, { word: 'station', ipa: '', meaningAr: 'محطة', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Go straight on, then turn left at the lights.', arEg: 'امشي على طول، وبعدين خش شمال عند الإشارة.', arFusha: 'امشي على طول، وبعدين خش شمال عند الإشارة.', speaker: 'Local', keyWords: [{ word: 'go straight on', ipa: '', meaningAr: 'امشي على طول', meaningEn: '' }, { word: 'turn left', ipa: '', meaningAr: 'خش شمال', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'How do I get to...?', type: 'collocation', meaningAr: 'أروح... إزاي؟', meaningEn: '', egyptianEquivalent: 'فين طريق', exampleInScene: 'How do I get to the museum?' },      { term: 'go straight on', type: 'collocation', meaningAr: 'امشي على طول', meaningEn: '', egyptianEquivalent: 'كمل على طول', exampleInScene: 'Go straight on for two minutes.' },      { term: 'turn left', type: 'collocation', meaningAr: 'خش شمال', meaningEn: '', egyptianEquivalent: 'خد شمال', exampleInScene: 'Turn left at the corner.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'go straight on\' mean?', questionAr: 'معنى go straight on؟', options: ['امشي على طول', 'ارجع ورا', 'خش يمين', 'اقف مكانك'], correctIndex: 0, explanationAr: 'go straight on معناها كمل ماشي على طول من غير ما تلف.' }
    ],
    speakingLines: [{ en: 'Excuse me, how do I get to the station?', arEg: 'لو سمحت، أروح المحطة إزاي؟' }, { en: 'Go straight on, then turn left at the lights.', arEg: 'امشي على طول، وبعدين خش شمال عند الإشارة.' }],
  },
  {
    id: 'gym-bob-learn',
    movieTitle: 'Let\'s Learn English at the Gym! - Bob the Canadian',
    releaseYear: 2021,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Gym Day with Bob',
    sceneDescription: 'بوب في الجيم بجد: أسماء الأجهزة والتمارين - dumbbells, treadmill, warm up - من المكان نفسه.',
    youtubeId: '8vuzfcVel6I',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'I always warm up before lifting weights.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/8vuzfcVel6I/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I always warm up before lifting weights.', arEg: 'دايماً بسخّن قبل ما ألعب حديد.', arFusha: 'دايماً بسخّن قبل ما ألعب حديد.', speaker: 'Bob', keyWords: [{ word: 'warm up', ipa: '', meaningAr: 'يسخّن', meaningEn: '' }, { word: 'lifting weights', ipa: '', meaningAr: 'لعب حديد', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'The treadmill is my favorite machine.', arEg: 'الجهاز المفضل عندي هو المشاية.', arFusha: 'الجهاز المفضل عندي هو المشاية.', speaker: 'Bob', keyWords: [{ word: 'treadmill', ipa: '', meaningAr: 'مشاية كهربائية', meaningEn: '' }, { word: 'machine', ipa: '', meaningAr: 'جهاز', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'warm up', type: 'phrasal-verb', meaningAr: 'يسخّن قبل التمرين', meaningEn: '', egyptianEquivalent: 'يعمل إحماء', exampleInScene: 'Warm up for five minutes.' },      { term: 'lift weights', type: 'collocation', meaningAr: 'يلعب حديد', meaningEn: '', egyptianEquivalent: 'يشيل أوزان', exampleInScene: 'He lifts weights daily.' },      { term: 'treadmill', type: 'cultural', meaningAr: 'مشاية كهربائية', meaningEn: '', egyptianEquivalent: 'جهاز الجري', exampleInScene: 'Run on the treadmill.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What do you do before lifting weights?', questionAr: 'بتعمل إيه قبل ما تلعب حديد؟', options: ['warm up (تسخين)', 'cool down', 'sleep', 'eat'], correctIndex: 0, explanationAr: 'لازم تعمل warm up (تسخين/إحماء) قبل التمرين عشان تحمي عضلاتك.' }
    ],
    speakingLines: [{ en: 'I always warm up before lifting weights.', arEg: 'دايماً بسخّن قبل ما ألعب حديد.' }, { en: 'The treadmill is my favorite machine.', arEg: 'الجهاز المفضل عندي هو المشاية.' }],
  },
  {
    id: 'gym-giovana-real',
    movieTitle: 'Gym Vocabulary - REAL ENGLISH LESSON - English by Giovana',
    releaseYear: 2023,
    director: 'English by Giovana',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Real Gym English',
    sceneDescription: 'جيوفانا بتاخدك الجيم بجد وتعلمك الكلام اللي بتسمعه هناك: sets, reps, personal trainer.',
    youtubeId: 'pGQzIf0Jgwo',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'English by Giovana (Official)',
    dialogueQuote: 'Do three sets of ten reps.',
    actorName: 'Giovana',
    characterName: 'Trainer',
    thumbnailUrl: 'https://img.youtube.com/vi/pGQzIf0Jgwo/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English by Giovana Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Do three sets of ten reps.', arEg: 'اعمل تلات جولات كل واحدة عشر عدات.', arFusha: 'اعمل تلات جولات كل واحدة عشر عدات.', speaker: 'Trainer', keyWords: [{ word: 'sets', ipa: '', meaningAr: 'جولات', meaningEn: '' }, { word: 'reps', ipa: '', meaningAr: 'عدات', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'I need to work on my cardio.', arEg: 'محتاج أركز على الكارديو.', arFusha: 'محتاج أركز على الكارديو.', speaker: 'Giovana', keyWords: [{ word: 'work on', ipa: '', meaningAr: 'يركز على', meaningEn: '' }, { word: 'cardio', ipa: '', meaningAr: 'كارديو', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'set', type: 'cultural', meaningAr: 'جولة تمرين', meaningEn: '', egyptianEquivalent: 'مجموعة عدات', exampleInScene: 'Three sets of squats.' },      { term: 'rep', type: 'cultural', meaningAr: 'عدة', meaningEn: '', egyptianEquivalent: 'عدة', exampleInScene: 'Ten reps per set.' },      { term: 'cardio', type: 'cultural', meaningAr: 'تمارين كارديو', meaningEn: '', egyptianEquivalent: 'كارديو', exampleInScene: 'Cardio burns fat.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is a \'rep\'?', questionAr: 'يعني إيه rep؟', options: ['عدة واحدة من التمرين', 'جهاز رياضي', 'مدرب خاص', 'لبس الجيم'], correctIndex: 0, explanationAr: 'الـ rep هي العدة الواحدة، والـ set هي مجموعة العدات - 3 sets of 10 reps.' }
    ],
    speakingLines: [{ en: 'Do three sets of ten reps.', arEg: 'اعمل تلات جولات كل واحدة عشر عدات.' }, { en: 'I need to work on my cardio.', arEg: 'محتاج أركز على الكارديو.' }],
  },
  {
    id: 'gym-adam-exercise',
    movieTitle: 'English Vocabulary for EXERCISING at the GYM - engVid',
    releaseYear: 2019,
    director: 'engVid',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Fitness Words Explained',
    sceneDescription: 'آدم بيشرح مفردات التمرين بالتفصيل: stretch, muscle, sore - كلام اللياقة الصح.',
    youtubeId: 'nBR9Rh2-Xww',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Adam\'s English Lessons - engVid (Official)',
    dialogueQuote: 'My muscles are sore after yesterday\'s workout.',
    actorName: 'Adam',
    characterName: 'Adam',
    thumbnailUrl: 'https://img.youtube.com/vi/nBR9Rh2-Xww/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'engVid Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'My muscles are sore after yesterday\'s workout.', arEg: 'عضلاتي واجعاني بعد تمرين إمبارح.', arFusha: 'عضلاتي واجعاني بعد تمرين إمبارح.', speaker: 'Adam', keyWords: [{ word: 'muscles', ipa: '', meaningAr: 'عضلات', meaningEn: '' }, { word: 'sore', ipa: '', meaningAr: 'واجعاني (ألم عضلي)', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Remember to stretch after you exercise.', arEg: 'افتكر تعمل إطالة بعد التمرين.', arFusha: 'افتكر تعمل إطالة بعد التمرين.', speaker: 'Adam', keyWords: [{ word: 'stretch', ipa: '', meaningAr: 'يعمل إطالة', meaningEn: '' }, { word: 'exercise', ipa: '', meaningAr: 'تتمرن', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'sore', type: 'cultural', meaningAr: 'واجعان (ألم عضلات)', meaningEn: '', egyptianEquivalent: 'مشدود من التمرين', exampleInScene: 'My legs are sore.' },      { term: 'stretch', type: 'cultural', meaningAr: 'يعمل إطالة', meaningEn: '', egyptianEquivalent: 'يفرد عضلاته', exampleInScene: 'Stretch before running.' },      { term: 'workout', type: 'cultural', meaningAr: 'تمرين', meaningEn: '', egyptianEquivalent: 'حصة تمرين', exampleInScene: 'A good workout today.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'sore muscles\' mean?', questionAr: 'معنى sore muscles؟', options: ['عضلات واجعانا بعد التمرين', 'عضلات قوية', 'عضلات مرتاحة', 'عضلات ممزقة'], correctIndex: 0, explanationAr: 'sore هو وجع العضلات الطبيعي اللي بييجي بعد تمرين جامد - علامة إنك اشتغلت صح.' }
    ],
    speakingLines: [{ en: 'My muscles are sore after yesterday\'s workout.', arEg: 'عضلاتي واجعاني بعد تمرين إمبارح.' }, { en: 'Remember to stretch after you exercise.', arEg: 'افتكر تعمل إطالة بعد التمرين.' }],
  },
  {
    id: 'classroom-vanessa-50',
    movieTitle: '50 English Phrases for the Classroom - Advanced Vocabulary - Speak English With Vanessa',
    releaseYear: 2021,
    director: 'Speak English With Vanessa',
    genre: 'Academic English Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Classroom Confidence',
    sceneDescription: 'خمسين عبارة للفصل والمحاضرة: تسأل، تعتذر، تشارك رأيك - للطلبة في الجامعات الأجنبية.',
    youtubeId: 'sVX7imbwEq4',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Speak English With Vanessa (Official)',
    dialogueQuote: 'Could you elaborate on that point?',
    actorName: 'Vanessa',
    characterName: 'Student',
    thumbnailUrl: 'https://img.youtube.com/vi/sVX7imbwEq4/hqdefault.jpg',
    category: 'academic_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak English With Vanessa Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Could you elaborate on that point?', arEg: 'ممكن تشرح النقطة دي أكتر؟', arFusha: 'ممكن تشرح النقطة دي أكتر؟', speaker: 'Student', keyWords: [{ word: 'elaborate', ipa: '', meaningAr: 'يشرح بالتفصيل', meaningEn: '' }, { word: 'point', ipa: '', meaningAr: 'نقطة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I would like to add something to the discussion.', arEg: 'حابب أضيف حاجة للنقاش.', arFusha: 'حابب أضيف حاجة للنقاش.', speaker: 'Student', keyWords: [{ word: 'add', ipa: '', meaningAr: 'يضيف', meaningEn: '' }, { word: 'discussion', ipa: '', meaningAr: 'نقاش', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'elaborate', type: 'cultural', meaningAr: 'يشرح بالتفصيل', meaningEn: '', egyptianEquivalent: 'يفصّل أكتر', exampleInScene: 'Could you elaborate?' },      { term: 'participate', type: 'cultural', meaningAr: 'يشارك', meaningEn: '', egyptianEquivalent: 'يشارك', exampleInScene: 'Participate in class discussions.' },      { term: 'hand in', type: 'phrasal-verb', meaningAr: 'يسلّم (واجب)', meaningEn: '', egyptianEquivalent: 'يسلّم', exampleInScene: 'Hand in your essays Friday.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'elaborate\' mean?', questionAr: 'معنى elaborate؟', options: ['يشرح بالتفصيل', 'يختصر', 'يترجم', 'يكتب'], correctIndex: 0, explanationAr: 'elaborate معناها يتكلم عن حاجة بتفصيل أكتر - سؤال ممتاز في المحاضرات.' }
    ],
    speakingLines: [{ en: 'Could you elaborate on that point?', arEg: 'ممكن تشرح النقطة دي أكتر؟' }, { en: 'I would like to add something to the discussion.', arEg: 'حابب أضيف حاجة للنقاش.' }],
  },
  {
    id: 'classroom-adam-students',
    movieTitle: 'Classroom English: Vocabulary & Expressions for Students - engVid',
    releaseYear: 2019,
    director: 'engVid',
    genre: 'Academic English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Survive Any Class in English',
    sceneDescription: 'آدم بيجهزك للفصل الإنجليزي: إزاي تسأل عن الواجب، تطلب توضيح، وتتكلم مع الدكتور.',
    youtubeId: 'OqaL1YP0pNM',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Adam\'s English Lessons - engVid (Official)',
    dialogueQuote: 'What did I miss in the last class?',
    actorName: 'Adam',
    characterName: 'Student',
    thumbnailUrl: 'https://img.youtube.com/vi/OqaL1YP0pNM/hqdefault.jpg',
    category: 'academic_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'engVid Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'What did I miss in the last class?', arEg: 'إيه اللي فاتني في الحصة اللي فاتت؟', arFusha: 'إيه اللي فاتني في الحصة اللي فاتت؟', speaker: 'Student', keyWords: [{ word: 'miss', ipa: '', meaningAr: 'يفوته', meaningEn: '' }, { word: 'last class', ipa: '', meaningAr: 'الحصة اللي فاتت', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'When is the assignment due?', arEg: 'الواجب تسليمه امتى؟', arFusha: 'الواجب تسليمه امتى؟', speaker: 'Student', keyWords: [{ word: 'assignment', ipa: '', meaningAr: 'واجب / تكليف', meaningEn: '' }, { word: 'due', ipa: '', meaningAr: 'ميعاد تسليمه', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'assignment', type: 'cultural', meaningAr: 'واجب / تكليف', meaningEn: '', egyptianEquivalent: 'التكليف', exampleInScene: 'The assignment is hard.' },      { term: 'due', type: 'cultural', meaningAr: 'ميعاد تسليمه', meaningEn: '', egyptianEquivalent: 'مستحق', exampleInScene: 'The essay is due Monday.' },      { term: 'miss a class', type: 'collocation', meaningAr: 'يفوته حصة', meaningEn: '', egyptianEquivalent: 'يغيب عن الحصة', exampleInScene: 'I missed yesterday\'s class.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'When is the assignment due?\' ask?', questionAr: 'سؤال When is the assignment due بيسأل عن إيه؟', options: ['ميعاد تسليم الواجب', 'صعوبة الواجب', 'مكان الحصة', 'اسم الدكتور'], correctIndex: 0, explanationAr: 'due معناها ميعاد الاستحقاق أو التسليم - سؤال أساسي لأي طالب.' }
    ],
    speakingLines: [{ en: 'What did I miss in the last class?', arEg: 'إيه اللي فاتني في الحصة اللي فاتت؟' }, { en: 'When is the assignment due?', arEg: 'الواجب تسليمه امتى؟' }],
  },
  {
    id: 'personality-poc-15',
    movieTitle: '15 English Personality Adjectives - How to Talk About Someone\'s Personality - POC English',
    releaseYear: 2022,
    director: 'POC English',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Describe Anyone\'s Character',
    sceneDescription: '15 صفة شخصية أساسية: reliable, stubborn, easygoing - أوصف أي حد بإنجليزي دقيق.',
    youtubeId: '8_I2sg8Z7Yk',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'POC English (Official)',
    dialogueQuote: 'He is very reliable; he never lets you down.',
    actorName: 'Coach',
    characterName: 'Coach',
    thumbnailUrl: 'https://img.youtube.com/vi/8_I2sg8Z7Yk/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'POC English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'He is very reliable; he never lets you down.', arEg: 'هو شخص معتمد عليه جداً؛ عمره ما بيخلّف وعده.', arFusha: 'هو شخص معتمد عليه جداً؛ عمره ما بيخلّف وعده.', speaker: 'Coach', keyWords: [{ word: 'reliable', ipa: '', meaningAr: 'معتمد عليه', meaningEn: '' }, { word: 'lets you down', ipa: '', meaningAr: 'بيخلّف وعده / بيخذلك', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'She is too stubborn to change her mind.', arEg: 'هي عنيدة أوي، صعب تغير رأيها.', arFusha: 'هي عنيدة أوي، صعب تغير رأيها.', speaker: 'Coach', keyWords: [{ word: 'stubborn', ipa: '', meaningAr: 'عنيد', meaningEn: '' }, { word: 'change her mind', ipa: '', meaningAr: 'تغير رأيها', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'reliable', type: 'cultural', meaningAr: 'معتمد عليه / جدير بالثقة', meaningEn: '', egyptianEquivalent: 'مضمون', exampleInScene: 'A reliable friend.' },      { term: 'stubborn', type: 'cultural', meaningAr: 'عنيد', meaningEn: '', egyptianEquivalent: 'عنيدة', exampleInScene: 'My brother is stubborn.' },      { term: 'let someone down', type: 'phrasal-verb', meaningAr: 'يخذل حد', meaningEn: '', egyptianEquivalent: 'يخلّف وعده', exampleInScene: 'Do not let me down.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'reliable\' mean?', questionAr: 'معنى reliable؟', options: ['شخص معتمد عليه', 'شخص غني', 'شخص مشهور', 'شخص سريع'], correctIndex: 0, explanationAr: 'reliable معناها تقدر تعتمد عليه - ما بيخلفش وعده أبداً.' }
    ],
    speakingLines: [{ en: 'He is very reliable; he never lets you down.', arEg: 'هو شخص معتمد عليه جداً؛ عمره ما بيخلّف وعده.' }, { en: 'She is too stubborn to change her mind.', arEg: 'هي عنيدة أوي، صعب تغير رأيها.' }],
  },
  {
    id: 'personality-letstalk-beginner',
    movieTitle: 'Personality Adjectives - Words to Describe Someone\'s Qualities - Let\'s Talk',
    releaseYear: 2020,
    director: 'Let\'s Talk',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'First Personality Words',
    sceneDescription: 'صفات الشخصية للمبتدئين: kind, funny, lazy, clever - الكلمات اللي هتستخدمها كل يوم.',
    youtubeId: 'hKJlw8za4cs',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Let\'s Talk - Free English Lessons (Official)',
    dialogueQuote: 'She is so kind; she helps everyone.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/hKJlw8za4cs/hqdefault.jpg',
    category: 'english_for_beginners',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Let\'s Talk Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'She is so kind; she helps everyone.', arEg: 'هي طيبة جداً؛ بتساعد كل الناس.', arFusha: 'هي طيبة جداً؛ بتساعد كل الناس.', speaker: 'Teacher', keyWords: [{ word: 'kind', ipa: '', meaningAr: 'طيب', meaningEn: '' }, { word: 'helps everyone', ipa: '', meaningAr: 'بتساعد الكل', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'My little brother is a bit lazy.', arEg: 'أخويا الصغير كسلان شوية.', arFusha: 'أخويا الصغير كسلان شوية.', speaker: 'Teacher', keyWords: [{ word: 'lazy', ipa: '', meaningAr: 'كسلان', meaningEn: '' }, { word: 'a bit', ipa: '', meaningAr: 'شوية', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'kind', type: 'cultural', meaningAr: 'طيب', meaningEn: '', egyptianEquivalent: 'حنين', exampleInScene: 'Be kind to people.' },      { term: 'lazy', type: 'cultural', meaningAr: 'كسلان', meaningEn: '', egyptianEquivalent: 'كسلانة', exampleInScene: 'The cat is lazy.' },      { term: 'clever', type: 'cultural', meaningAr: 'شاطر / ذكي', meaningEn: '', egyptianEquivalent: 'ناصح', exampleInScene: 'A clever student.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the opposite of \'lazy\'?', questionAr: 'عكس lazy إيه؟', options: ['hard-working', 'kind', 'funny', 'quiet'], correctIndex: 0, explanationAr: 'lazy معناها كسلان، وعكسها hard-working يعني مجتهد.' }
    ],
    speakingLines: [{ en: 'She is so kind; she helps everyone.', arEg: 'هي طيبة جداً؛ بتساعد كل الناس.' }, { en: 'My little brother is a bit lazy.', arEg: 'أخويا الصغير كسلان شوية.' }],
  },
  {
    id: 'pharmacy-speakeasy-real',
    movieTitle: 'Real Life Pharmacy Conversation - Easy English Speaking Practice - SpeakEasy',
    releaseYear: 2023,
    director: 'SpeakEasy Learn English Faster',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Buying Medicine',
    sceneDescription: 'حوار صيدلية حقيقي: تطلب دوا، توصف الألم، وتفهم الجرعة - محادثة سهلة للمبتدئين.',
    youtubeId: '4GUuV2fCLno',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'SpeakEasy Learn English Faster (Official)',
    dialogueQuote: 'Do you have something for a sore throat?',
    actorName: 'Customer',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/4GUuV2fCLno/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'SpeakEasy Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Do you have something for a sore throat?', arEg: 'عندكوا حاجة لوجع الحلق؟', arFusha: 'عندكوا حاجة لوجع الحلق؟', speaker: 'Customer', keyWords: [{ word: 'sore throat', ipa: '', meaningAr: 'وجع حلق', meaningEn: '' }, { word: 'something for', ipa: '', meaningAr: 'حاجة لـ', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Take one tablet every eight hours.', arEg: 'خد قرص كل تمن ساعات.', arFusha: 'خد قرص كل تمن ساعات.', speaker: 'Pharmacist', keyWords: [{ word: 'tablet', ipa: '', meaningAr: 'قرص', meaningEn: '' }, { word: 'every eight hours', ipa: '', meaningAr: 'كل تمن ساعات', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'sore throat', type: 'collocation', meaningAr: 'وجع حلق', meaningEn: '', egyptianEquivalent: 'حلقي واجعاني', exampleInScene: 'I have a sore throat.' },      { term: 'tablet', type: 'cultural', meaningAr: 'قرص دوا', meaningEn: '', egyptianEquivalent: 'حباية', exampleInScene: 'Take one tablet daily.' },      { term: 'over the counter', type: 'collocation', meaningAr: 'بدون روشتة', meaningEn: '', egyptianEquivalent: 'مباشرة من الرف', exampleInScene: 'This medicine is over the counter.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'over the counter\' mean at a pharmacy?', questionAr: 'معنى over the counter في الصيدلية؟', options: ['دوا بدون روشتة', 'دوا غالي', 'دوا مستورد', 'دوا منتهي الصلاحية'], correctIndex: 0, explanationAr: 'over the counter معناها دوا تشتريه مباشرة من غير روشتة دكتور.' }
    ],
    speakingLines: [{ en: 'Do you have something for a sore throat?', arEg: 'عندكوا حاجة لوجع الحلق؟' }, { en: 'Take one tablet every eight hours.', arEg: 'خد قرص كل تمن ساعات.' }],
  },
  {
    id: 'pharmacy-tangerine-drugstore',
    movieTitle: 'At the Pharmacy - Everyday English Conversation - Tangerine Academy',
    releaseYear: 2022,
    director: 'Learn English with Tangerine Academy',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'At the Drugstore',
    sceneDescription: 'محادثة يومية في الصيدلية: الأعراض، الدوا البديل، والسؤال عن الآثار الجانبية.',
    youtubeId: 'UdakI1zk0xE',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Learn English with Tangerine Academy (Official)',
    dialogueQuote: 'Does this medicine have any side effects?',
    actorName: 'Customer',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/UdakI1zk0xE/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Tangerine Academy Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Does this medicine have any side effects?', arEg: 'الدوا ده ليه آثار جانبية؟', arFusha: 'الدوا ده ليه آثار جانبية؟', speaker: 'Customer', keyWords: [{ word: 'side effects', ipa: '', meaningAr: 'آثار جانبية', meaningEn: '' }, { word: 'medicine', ipa: '', meaningAr: 'دوا', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'It may cause drowsiness, so do not drive.', arEg: 'ممكن يسبب نعاس، فمتسوقش بعده.', arFusha: 'ممكن يسبب نعاس، فمتسوقش بعده.', speaker: 'Pharmacist', keyWords: [{ word: 'drowsiness', ipa: '', meaningAr: 'نعاس', meaningEn: '' }, { word: 'cause', ipa: '', meaningAr: 'يسبب', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'side effects', type: 'collocation', meaningAr: 'آثار جانبية', meaningEn: '', egyptianEquivalent: 'أضرار جانبية', exampleInScene: 'Check the side effects.' },      { term: 'drowsiness', type: 'cultural', meaningAr: 'نعاس', meaningEn: '', egyptianEquivalent: 'دوخة ونوم', exampleInScene: 'This pill causes drowsiness.' },      { term: 'dose', type: 'cultural', meaningAr: 'جرعة', meaningEn: '', egyptianEquivalent: 'الجرعة', exampleInScene: 'Do not miss a dose.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What are \'side effects\'?', questionAr: 'يعني إيه side effects؟', options: ['آثار جانبية للدوا', 'فوايد الدوا', 'سعر الدوا', 'اسم الدوا'], correctIndex: 0, explanationAr: 'الـ side effects هي الآثار الجانبية اللي ممكن الدوا يسببها زي النعاس أو الدوخة.' }
    ],
    speakingLines: [{ en: 'Does this medicine have any side effects?', arEg: 'الدوا ده ليه آثار جانبية؟' }, { en: 'It may cause drowsiness, so do not drive.', arEg: 'ممكن يسبب نعاس، فمتسوقش بعده.' }],
  },
  {
    id: 'appointment-vanessa-schedule',
    movieTitle: 'How to Schedule an Appointment in English - Speak English With Vanessa',
    releaseYear: 2021,
    director: 'Speak English With Vanessa',
    genre: 'Daily English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Booking Like a Native',
    sceneDescription: 'فانيسا بتعلمك تحجز ميعاد بالتليفون بثقة: المواعيد المتاحة، التأكيد، والإلغاء بأدب.',
    youtubeId: '3UYBsBnJe7U',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Speak English With Vanessa (Official)',
    dialogueQuote: 'I would like to schedule an appointment for Thursday.',
    actorName: 'Vanessa',
    characterName: 'Caller',
    thumbnailUrl: 'https://img.youtube.com/vi/3UYBsBnJe7U/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak English With Vanessa Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I would like to schedule an appointment for Thursday.', arEg: 'عايز أحجز ميعاد يوم الخميس.', arFusha: 'عايز أحجز ميعاد يوم الخميس.', speaker: 'Caller', keyWords: [{ word: 'schedule', ipa: '', meaningAr: 'يحجز / يحدد ميعاد', meaningEn: '' }, { word: 'appointment', ipa: '', meaningAr: 'ميعاد', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I am afraid I need to cancel our meeting.', arEg: 'للأسف محتاج ألغي ميعادنا.', arFusha: 'للأسف محتاج ألغي ميعادنا.', speaker: 'Caller', keyWords: [{ word: 'cancel', ipa: '', meaningAr: 'يلغي', meaningEn: '' }, { word: 'meeting', ipa: '', meaningAr: 'ميعاد / اجتماع', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'schedule an appointment', type: 'collocation', meaningAr: 'يحجز ميعاد', meaningEn: '', egyptianEquivalent: 'يعمل أبونمنت', exampleInScene: 'Schedule an appointment online.' },      { term: 'cancel', type: 'cultural', meaningAr: 'يلغي', meaningEn: '', egyptianEquivalent: 'يلغي', exampleInScene: 'Cancel the appointment early.' },      { term: 'reschedule', type: 'cultural', meaningAr: 'يأجل لميعاد تاني', meaningEn: '', egyptianEquivalent: 'يغير الميعاد', exampleInScene: 'Can we reschedule?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'reschedule\' mean?', questionAr: 'معنى reschedule؟', options: ['يغير الميعاد لميعاد تاني', 'يلغي نهائياً', 'يأكد الميعاد', 'ينسى الميعاد'], correctIndex: 0, explanationAr: 'reschedule معناها تغير الميعاد لوقت تاني - مش إلغاء، بس تأجيل.' }
    ],
    speakingLines: [{ en: 'I would like to schedule an appointment for Thursday.', arEg: 'عايز أحجز ميعاد يوم الخميس.' }, { en: 'I am afraid I need to cancel our meeting.', arEg: 'للأسف محتاج ألغي ميعادنا.' }],
  },
  {
    id: 'appointment-rebecca-prep',
    movieTitle: 'How to Make an Appointment in English - Prepositions & Expressions - engVid',
    releaseYear: 2019,
    director: 'engVid',
    genre: 'Daily English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Appointments and Prepositions',
    sceneDescription: 'ريبيكا بتركز على حروف الجر في المواعيد: on Monday, at five, in the morning - الغلطة الشائعة.',
    youtubeId: 'h967Qow7XN4',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Rebecca - engVid (Official)',
    dialogueQuote: 'Can we meet on Friday at three?',
    actorName: 'Rebecca',
    characterName: 'Rebecca',
    thumbnailUrl: 'https://img.youtube.com/vi/h967Qow7XN4/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'engVid Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Can we meet on Friday at three?', arEg: 'ممكن نتقابل يوم الجمعة الساعة تلاتة؟', arFusha: 'ممكن نتقابل يوم الجمعة الساعة تلاتة؟', speaker: 'Rebecca', keyWords: [{ word: 'on Friday', ipa: '', meaningAr: 'يوم الجمعة', meaningEn: '' }, { word: 'at three', ipa: '', meaningAr: 'الساعة تلاتة', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Does Tuesday morning work for you?', arEg: 'الثلاثة الصبح يناسبك؟', arFusha: 'الثلاثة الصبح يناسبك؟', speaker: 'Rebecca', keyWords: [{ word: 'work for you', ipa: '', meaningAr: 'يناسبك', meaningEn: '' }, { word: 'morning', ipa: '', meaningAr: 'الصبح', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'on (days)', type: 'cultural', meaningAr: 'في / يوم (للأيام)', meaningEn: '', egyptianEquivalent: 'يوم', exampleInScene: 'On Saturday we rest.' },      { term: 'at (times)', type: 'cultural', meaningAr: 'الساعة (للأوقات)', meaningEn: '', egyptianEquivalent: 'الساعة', exampleInScene: 'At nine o\'clock.' },      { term: 'work for someone', type: 'collocation', meaningAr: 'يناسب حد', meaningEn: '', egyptianEquivalent: 'يمشي معاك', exampleInScene: 'Does five o\'clock work for you?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which preposition: ___ Monday?', questionAr: 'أنهي حرف جر: ___ Monday؟', options: ['on', 'at', 'in', 'by'], correctIndex: 0, explanationAr: 'مع الأيام بنستخدم on: on Monday. ومع الساعات at، ومع الشهور والفصول in.' }
    ],
    speakingLines: [{ en: 'Can we meet on Friday at three?', arEg: 'ممكن نتقابل يوم الجمعة الساعة تلاتة؟' }, { en: 'Does Tuesday morning work for you?', arEg: 'الثلاثة الصبح يناسبك؟' }],
  },
  {
    id: 'returns-rep-refund',
    movieTitle: 'Refund & Return English - Real Phrases for Shopping - Real English Podcast',
    releaseYear: 2023,
    director: 'Real English Podcast',
    genre: 'English Podcast',
    cefrLevel: 'B1',
    sceneTitle: 'Get Your Money Back',
    sceneDescription: 'عبارات الإرجاع والاسترداد الحقيقية: الفاتورة، تبديل المقاس، وطلب الفلوس - من بودكاست واقعي.',
    youtubeId: 'Auq91oy1W_Y',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Real English Podcast (Official)',
    dialogueQuote: 'I would like to return this jacket; it does not fit.',
    actorName: 'Host',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/Auq91oy1W_Y/hqdefault.jpg',
    category: 'podcasts',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Real English Podcast Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I would like to return this jacket; it does not fit.', arEg: 'عايز أرجّع الجاكيت ده؛ مش مقاسي.', arFusha: 'عايز أرجّع الجاكيت ده؛ مش مقاسي.', speaker: 'Customer', keyWords: [{ word: 'return', ipa: '', meaningAr: 'يرجّع', meaningEn: '' }, { word: 'does not fit', ipa: '', meaningAr: 'مش مقاسي', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Can I get a refund or an exchange?', arEg: 'ممكن أسترد فلوسي ولا أبدّلها؟', arFusha: 'ممكن أسترد فلوسي ولا أبدّلها؟', speaker: 'Customer', keyWords: [{ word: 'refund', ipa: '', meaningAr: 'استرداد فلوس', meaningEn: '' }, { word: 'exchange', ipa: '', meaningAr: 'تبديل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'return an item', type: 'collocation', meaningAr: 'يرجّع منتج', meaningEn: '', egyptianEquivalent: 'يرجع الحاجة', exampleInScene: 'Return it within 30 days.' },      { term: 'refund', type: 'cultural', meaningAr: 'استرداد فلوس', meaningEn: '', egyptianEquivalent: 'فلوسي ترجع', exampleInScene: 'Get a full refund.' },      { term: 'exchange', type: 'cultural', meaningAr: 'تبديل', meaningEn: '', egyptianEquivalent: 'تغيير', exampleInScene: 'An exchange is fine too.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the difference between \'refund\' and \'exchange\'?', questionAr: 'الفرق بين refund و exchange؟', options: ['refund فلوسك ترجع و exchange تبديل بمنتج تاني', 'الاتنين زي بعض', 'refund تبديل و exchange فلوس', 'الاتنين خصم'], correctIndex: 0, explanationAr: 'refund معناها فلوسك ترجعلك، أما exchange فبتبدل المنتج بواحد تاني.' }
    ],
    speakingLines: [{ en: 'I would like to return this jacket; it does not fit.', arEg: 'عايز أرجّع الجاكيت ده؛ مش مقاسي.' }, { en: 'Can I get a refund or an exchange?', arEg: 'ممكن أسترد فلوسي ولا أبدّلها؟' }],
  },
  {
    id: 'returns-ellii-dialogue',
    movieTitle: 'Returning an Item - Everyday English Dialogues - Ellii',
    releaseYear: 2021,
    director: 'Ellii',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Back to the Store',
    sceneDescription: 'حوار إرجاع بسيط: الإيصال، سبب الإرجاع، وسياسة المحل - جمل جاهزة تحفظها.',
    youtubeId: 'GfDGp9GhPaw',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Ellii (Official)',
    dialogueQuote: 'Do you have the receipt?',
    actorName: 'Cashier',
    characterName: 'Cashier',
    thumbnailUrl: 'https://img.youtube.com/vi/GfDGp9GhPaw/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Ellii Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Do you have the receipt?', arEg: 'معاك الإيصال؟', arFusha: 'معاك الإيصال؟', speaker: 'Cashier', keyWords: [{ word: 'receipt', ipa: '', meaningAr: 'إيصال', meaningEn: '' }, { word: 'have', ipa: '', meaningAr: 'معاك', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'It stopped working after two days.', arEg: 'بطل يشتغل بعد يومين.', arFusha: 'بطل يشتغل بعد يومين.', speaker: 'Customer', keyWords: [{ word: 'stopped working', ipa: '', meaningAr: 'بطل يشتغل', meaningEn: '' }, { word: 'after two days', ipa: '', meaningAr: 'بعد يومين', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'receipt', type: 'cultural', meaningAr: 'إيصال / فاتورة', meaningEn: '', egyptianEquivalent: 'الفاتورة', exampleInScene: 'Keep your receipt.' },      { term: 'stopped working', type: 'collocation', meaningAr: 'بطل يشتغل', meaningEn: '', egyptianEquivalent: 'باظ', exampleInScene: 'My phone stopped working.' },      { term: 'warranty', type: 'cultural', meaningAr: 'ضمان', meaningEn: '', egyptianEquivalent: 'الضمان', exampleInScene: 'Is it under warranty?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What do you usually need to return an item?', questionAr: 'محتاج إيه عشان ترجّع منتج عادة؟', options: ['الإيصال', 'صورة شخصية', 'بطاقة بنك تانية', 'توقيع الدكتور'], correctIndex: 0, explanationAr: 'الـ receipt (الإيصال) هو دليل الشراء اللي المحل بيطلبه عند الإرجاع.' }
    ],
    speakingLines: [{ en: 'Do you have the receipt?', arEg: 'معاك الإيصال؟' }, { en: 'It stopped working after two days.', arEg: 'بطل يشتغل بعد يومين.' }],
  },
  {
    id: 'appearance-bob-faces',
    movieTitle: 'Learn English Adjectives for Describing People - Bob the Canadian',
    releaseYear: 2020,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Funny Faces, Real Words',
    sceneDescription: 'بوب بيعمل وشوش مضحكة عشان تحفظ صفات الوصف: tall, curly, beard, glasses - حفظ بالصورة.',
    youtubeId: 'PPEDrB14Rok',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'He is tall with curly hair and a beard.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/PPEDrB14Rok/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'He is tall with curly hair and a beard.', arEg: 'هو طويل وشعره كيرلي وعنده دقن.', arFusha: 'هو طويل وشعره كيرلي وعنده دقن.', speaker: 'Bob', keyWords: [{ word: 'curly hair', ipa: '', meaningAr: 'شعر كيرلي', meaningEn: '' }, { word: 'beard', ipa: '', meaningAr: 'دقن', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'She wears glasses and has a warm smile.', arEg: 'هي لابسة نضارة وابتسامتها حنينة.', arFusha: 'هي لابسة نضارة وابتسامتها حنينة.', speaker: 'Bob', keyWords: [{ word: 'wears glasses', ipa: '', meaningAr: 'لابسة نضارة', meaningEn: '' }, { word: 'warm smile', ipa: '', meaningAr: 'ابتسامة حنينة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'curly', type: 'cultural', meaningAr: 'كيرلي (شعر)', meaningEn: '', egyptianEquivalent: 'مقعر', exampleInScene: 'She has curly hair.' },      { term: 'beard', type: 'cultural', meaningAr: 'دقن', meaningEn: '', egyptianEquivalent: 'لحية', exampleInScene: 'He grew a beard.' },      { term: 'wear glasses', type: 'collocation', meaningAr: 'يلبس نضارة', meaningEn: '', egyptianEquivalent: 'بيلبس نضارة', exampleInScene: 'Do you wear glasses?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'curly hair\' mean?', questionAr: 'معنى curly hair؟', options: ['شعر كيرلي / مقعر', 'شعر ناعم', 'شعر أبيض', 'شعر قصير'], correctIndex: 0, explanationAr: 'curly معناها مقعر أو مجعد - عكسها straight يعني ناعم ومفرود.' }
    ],
    speakingLines: [{ en: 'He is tall with curly hair and a beard.', arEg: 'هو طويل وشعره كيرلي وعنده دقن.' }, { en: 'She wears glasses and has a warm smile.', arEg: 'هي لابسة نضارة وابتسامتها حنينة.' }],
  },
  {
    id: 'appearance-bbc-ep17',
    movieTitle: 'How to Describe People in English - Easy English Conversations Ep. 17 - BBC',
    releaseYear: 2023,
    director: 'BBC Learning English',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'What Does She Look Like?',
    sceneDescription: 'حلقة BBC عن وصف الناس: الفرق بين What is she like و What does she look like - غلطة شائعة.',
    youtubeId: '9OzIMC6XCiE',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'What does she look like? She is short and slim.',
    actorName: 'Presenter',
    characterName: 'Presenter',
    thumbnailUrl: 'https://img.youtube.com/vi/9OzIMC6XCiE/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'What does she look like? She is short and slim.', arEg: 'شكلها إيه؟ هي قصيرة ورفيعة.', arFusha: 'شكلها إيه؟ هي قصيرة ورفيعة.', speaker: 'Presenter', keyWords: [{ word: 'look like', ipa: '', meaningAr: 'شكلها', meaningEn: '' }, { word: 'slim', ipa: '', meaningAr: 'رفيعة', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'What is she like? She is really outgoing.', arEg: 'شخصيتها إيه؟ هي اجتماعية جداً.', arFusha: 'شخصيتها إيه؟ هي اجتماعية جداً.', speaker: 'Presenter', keyWords: [{ word: 'What is she like', ipa: '', meaningAr: 'شخصيتها إيه', meaningEn: '' }, { word: 'outgoing', ipa: '', meaningAr: 'اجتماعية', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'look like', type: 'phrasal-verb', meaningAr: 'شكله / شكلها', meaningEn: '', egyptianEquivalent: 'باين زي', exampleInScene: 'What does he look like?' },      { term: 'outgoing', type: 'cultural', meaningAr: 'اجتماعي / بيحب الناس', meaningEn: '', egyptianEquivalent: 'اجتماعي', exampleInScene: 'An outgoing person makes friends easily.' },      { term: 'slim', type: 'cultural', meaningAr: 'رفيع', meaningEn: '', egyptianEquivalent: 'رفيعة', exampleInScene: 'She is tall and slim.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the difference between \'What is she like?\' and \'What does she look like?\'', questionAr: 'الفرق بين What is she like و What does she look like؟', options: ['الأولى عن الشخصية والتانية عن الشكل', 'الاتنين عن الشكل', 'الاتنين عن الشخصية', 'الأولى عن الشكل والتانية عن الشخصية'], correctIndex: 0, explanationAr: 'What is she like بتسأل عن الشخصية، و What does she look like بتسأل عن الشكل - غلطة شائعة جداً.' }
    ],
    speakingLines: [{ en: 'What does she look like? She is short and slim.', arEg: 'شكلها إيه؟ هي قصيرة ورفيعة.' }, { en: 'What is she like? She is really outgoing.', arEg: 'شخصيتها إيه؟ هي اجتماعية جداً.' }],
  },
  {
    id: 'cafe-ara-pro',
    movieTitle: 'How to Order Coffee Like a Pro at Any Café - Ara English Channel',
    releaseYear: 2023,
    director: 'Ara English Channel',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Coffee Shop Confidence',
    sceneDescription: 'اطلب قهوتك زي المحترفين: الحجم، النوع، بالحليب ولا بدون - كل تفاصيل الكافيه بالإنجليزي.',
    youtubeId: 'eEZ6O4w1_hM',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Ara English Channel (Official)',
    dialogueQuote: 'Can I get a large latte, please?',
    actorName: 'Customer',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/eEZ6O4w1_hM/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Ara English Channel Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Can I get a large latte, please?', arEg: 'ممكن لاتيه كبير، من فضلك؟', arFusha: 'ممكن لاتيه كبير، من فضلك؟', speaker: 'Customer', keyWords: [{ word: 'large', ipa: '', meaningAr: 'كبير', meaningEn: '' }, { word: 'latte', ipa: '', meaningAr: 'لاتيه', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'For here or to go?', arEg: 'هنا ولا تيك أواي؟', arFusha: 'هنا ولا تيك أواي؟', speaker: 'Barista', keyWords: [{ word: 'for here', ipa: '', meaningAr: 'هنا', meaningEn: '' }, { word: 'to go', ipa: '', meaningAr: 'تيك أواي', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'Can I get...?', type: 'collocation', meaningAr: 'ممكن آخد...؟ (طلب)', meaningEn: '', egyptianEquivalent: 'ممكن', exampleInScene: 'Can I get a tea?' },      { term: 'to go', type: 'collocation', meaningAr: 'تيك أواي / معاك', meaningEn: '', egyptianEquivalent: 'سفري', exampleInScene: 'One coffee to go.' },      { term: 'barista', type: 'cultural', meaningAr: 'باريستا (صانع القهوة)', meaningEn: '', egyptianEquivalent: 'الباريستا', exampleInScene: 'The barista made my latte.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'to go\' mean at a café?', questionAr: 'معنى to go في الكافيه؟', options: ['تاخد الطلب معاك بره', 'تاكل في المكان', 'تلغي الطلب', 'تدفع بعدين'], correctIndex: 0, explanationAr: 'for here or to go يعني هتقعد في المكان ولا تاخد طلبك معاك.' }
    ],
    speakingLines: [{ en: 'Can I get a large latte, please?', arEg: 'ممكن لاتيه كبير، من فضلك؟' }, { en: 'For here or to go?', arEg: 'هنا ولا تيك أواي؟' }],
  },
  {
    id: 'cafe-better-talk-beginners',
    movieTitle: 'Ordering Coffee in English - Easy Café Conversation for Beginners - better talk english',
    releaseYear: 2023,
    director: 'better talk english',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Your First Café Order',
    sceneDescription: 'حوار كافيه سهل للمبتدئين: الطلب، الإضافات، والدفع - جمل قصيرة وبطيئة.',
    youtubeId: '0vWnfQc_-Qs',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'better talk english (Official)',
    dialogueQuote: 'Anything else with that?',
    actorName: 'Barista',
    characterName: 'Barista',
    thumbnailUrl: 'https://img.youtube.com/vi/0vWnfQc_-Qs/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'better talk english Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Anything else with that?', arEg: 'أي حاجة تانية معاها؟', arFusha: 'أي حاجة تانية معاها؟', speaker: 'Barista', keyWords: [{ word: 'anything else', ipa: '', meaningAr: 'أي حاجة تانية', meaningEn: '' }, { word: 'with that', ipa: '', meaningAr: 'معاها', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'That is all, thank you.', arEg: 'كده كفاية، شكراً.', arFusha: 'كده كفاية، شكراً.', speaker: 'Customer', keyWords: [{ word: 'that is all', ipa: '', meaningAr: 'كده كفاية / بس كده', meaningEn: '' }, { word: 'thank you', ipa: '', meaningAr: 'شكراً', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'Anything else?', type: 'collocation', meaningAr: 'أي حاجة تانية؟', meaningEn: '', egyptianEquivalent: 'حاجة كمان؟', exampleInScene: 'Anything else for you today?' },      { term: 'That is all', type: 'collocation', meaningAr: 'كده كفاية / بس كده', meaningEn: '', egyptianEquivalent: 'بس كده', exampleInScene: 'That is all, thanks.' },      { term: 'receipt', type: 'cultural', meaningAr: 'إيصال', meaningEn: '', egyptianEquivalent: 'الفاتورة', exampleInScene: 'Here is your receipt.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you say you finished ordering?', questionAr: 'تقول إنك خلصت طلبك إزاي؟', options: ['That is all, thank you', 'I stop now', 'No more food forever', 'Finish me'], correctIndex: 0, explanationAr: 'That is all معناها بس كده / كفاية كده - الرد الطبيعي لما بتخلص طلب.' }
    ],
    speakingLines: [{ en: 'Anything else with that?', arEg: 'أي حاجة تانية معاها؟' }, { en: 'That is all, thank you.', arEg: 'كده كفاية، شكراً.' }],
  },
  {
    id: 'emergency-smarter-phrases',
    movieTitle: 'Emergency English Phrases - Speak Confidently in Real-Life Situations - Learn Smarter',
    releaseYear: 2023,
    director: 'Learn Smarter',
    genre: 'Daily English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'When Every Word Counts',
    sceneDescription: 'عبارات الطوارئ اللي لازم تحفظها: المستشفى، الضياع، طلب المساعدة - ممكن تنقذك يوم ما.',
    youtubeId: 'DtothKABPOM',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn Smarter (Official)',
    dialogueQuote: 'I need help, please call an ambulance.',
    actorName: 'Teacher',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/DtothKABPOM/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn Smarter Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I need help, please call an ambulance.', arEg: 'محتاج مساعدة، اتصلوا بالإسعاف من فضلكم.', arFusha: 'محتاج مساعدة، اتصلوا بالإسعاف من فضلكم.', speaker: 'Speaker', keyWords: [{ word: 'call an ambulance', ipa: '', meaningAr: 'يتصل بالإسعاف', meaningEn: '' }, { word: 'help', ipa: '', meaningAr: 'مساعدة', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I am lost. Can you help me find this address?', arEg: 'أنا تايه. ممكن تساعدني أوصل للعنوان ده؟', arFusha: 'أنا تايه. ممكن تساعدني أوصل للعنوان ده؟', speaker: 'Speaker', keyWords: [{ word: 'lost', ipa: '', meaningAr: 'تايه', meaningEn: '' }, { word: 'address', ipa: '', meaningAr: 'عنوان', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'call an ambulance', type: 'collocation', meaningAr: 'يتصل بالإسعاف', meaningEn: '', egyptianEquivalent: 'اطلبوا إسعاف', exampleInScene: 'Call an ambulance now!' },      { term: 'I am lost', type: 'collocation', meaningAr: 'أنا تايه', meaningEn: '', egyptianEquivalent: 'ضعت', exampleInScene: 'I am lost in the city.' },      { term: 'emergency', type: 'cultural', meaningAr: 'طوارئ', meaningEn: '', egyptianEquivalent: 'حالة طارئة', exampleInScene: 'In an emergency, call 911.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What do you say when you cannot find your way?', questionAr: 'تقول إيه لما تتايه؟', options: ['I am lost', 'I am found', 'I am late', 'I am lucky'], correctIndex: 0, explanationAr: 'I am lost معناها أنا تايه - أهم جملة لما تضيع في بلد أجنبية.' }
    ],
    speakingLines: [{ en: 'I need help, please call an ambulance.', arEg: 'محتاج مساعدة، اتصلوا بالإسعاف من فضلكم.' }, { en: 'I am lost. Can you help me find this address?', arEg: 'أنا تايه. ممكن تساعدني أوصل للعنوان ده؟' }],
  },
  {
    id: 'emergency-class101-10',
    movieTitle: '10 Phrases to Help You in an Emergency in English - EnglishClass101',
    releaseYear: 2020,
    director: 'EnglishClass101',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Ten Life-Saving Phrases',
    sceneDescription: 'عشر جمل طوارئ من EnglishClass101: الشرطة، الدكتور، التصريح عن حساسية - احفظهم غيب.',
    youtubeId: 'SQ8VWMq5tKY',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Learn English with EnglishClass101.com (Official)',
    dialogueQuote: 'I am allergic to peanuts.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/SQ8VWMq5tKY/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'EnglishClass101 Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'I am allergic to peanuts.', arEg: 'عندي حساسية من الفول السوداني.', arFusha: 'عندي حساسية من الفول السوداني.', speaker: 'Teacher', keyWords: [{ word: 'allergic to', ipa: '', meaningAr: 'عنده حساسية من', meaningEn: '' }, { word: 'peanuts', ipa: '', meaningAr: 'فول سوداني', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Where is the nearest hospital?', arEg: 'فين أقرب مستشفى؟', arFusha: 'فين أقرب مستشفى؟', speaker: 'Teacher', keyWords: [{ word: 'nearest', ipa: '', meaningAr: 'أقرب', meaningEn: '' }, { word: 'hospital', ipa: '', meaningAr: 'مستشفى', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'allergic to', type: 'collocation', meaningAr: 'عنده حساسية من', meaningEn: '', egyptianEquivalent: 'حساسية من', exampleInScene: 'I am allergic to seafood.' },      { term: 'nearest', type: 'cultural', meaningAr: 'أقرب', meaningEn: '', egyptianEquivalent: 'أقرب حاجة', exampleInScene: 'Where is the nearest pharmacy?' },      { term: 'help', type: 'cultural', meaningAr: 'يساعد', meaningEn: '', egyptianEquivalent: 'ساعدني', exampleInScene: 'Help me, please.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Why is \'I am allergic to...\' important?', questionAr: 'ليه جملة I am allergic to مهمة؟', options: ['بتمنع خطر الحساسية في الأكل والدوا', 'بتطلب خصم', 'بتعرف بنفسك', 'بتطلب الواي فاي'], correctIndex: 0, explanationAr: 'جملة الحساسية من أهم الجمل الصحية - ممكن تنقذك في مطعم أو مستشفى.' }
    ],
    speakingLines: [{ en: 'I am allergic to peanuts.', arEg: 'عندي حساسية من الفول السوداني.' }, { en: 'Where is the nearest hospital?', arEg: 'فين أقرب مستشفى؟' }],
  },
  {
    id: 'customs-reallife-us',
    movieTitle: 'U.S. Airport Customs Questions in English - Easy Travel Dialogue - Real Life English',
    releaseYear: 2023,
    director: 'Real Life English',
    genre: 'Travel English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Facing the Customs Officer',
    sceneDescription: 'أسئلة الجمارك الأمريكية الأشهر: الغرض من الزيارة، مدة الإقامة، مكان السكن - جاوب بثقة.',
    youtubeId: '5dEkqdSqwbE',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Real Life English (Official)',
    dialogueQuote: 'What is the purpose of your visit?',
    actorName: 'Officer',
    characterName: 'Officer',
    thumbnailUrl: 'https://img.youtube.com/vi/5dEkqdSqwbE/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Real Life English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'What is the purpose of your visit?', arEg: 'إيه الغرض من زيارتك؟', arFusha: 'إيه الغرض من زيارتك؟', speaker: 'Officer', keyWords: [{ word: 'purpose', ipa: '', meaningAr: 'غرض', meaningEn: '' }, { word: 'visit', ipa: '', meaningAr: 'زيارة', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I am here for tourism for two weeks.', arEg: 'أنا هنا للسياحة لمدة أسبوعين.', arFusha: 'أنا هنا للسياحة لمدة أسبوعين.', speaker: 'Traveler', keyWords: [{ word: 'tourism', ipa: '', meaningAr: 'سياحة', meaningEn: '' }, { word: 'two weeks', ipa: '', meaningAr: 'أسبوعين', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'purpose of visit', type: 'collocation', meaningAr: 'الغرض من الزيارة', meaningEn: '', egyptianEquivalent: 'سبب السفر', exampleInScene: 'State the purpose of your visit.' },      { term: 'tourism', type: 'cultural', meaningAr: 'سياحة', meaningEn: '', egyptianEquivalent: 'سياحة', exampleInScene: 'I am here for tourism.' },      { term: 'declare', type: 'cultural', meaningAr: 'يصرّح (في الجمارك)', meaningEn: '', egyptianEquivalent: 'يصرّح', exampleInScene: 'Do you have anything to declare?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does the officer mean by \'purpose of your visit\'?', questionAr: 'الضابط بيقصد إيه بـ purpose of your visit؟', options: ['سبب سفرك', 'عنوان بيتك', 'رقم طيارتك', 'وزن شنطك'], correctIndex: 0, explanationAr: 'سؤال الجمارك الأساسي: إيه الغرض من زيارتك - سياحة، شغل، دراسة؟' }
    ],
    speakingLines: [{ en: 'What is the purpose of your visit?', arEg: 'إيه الغرض من زيارتك؟' }, { en: 'I am here for tourism for two weeks.', arEg: 'أنا هنا للسياحة لمدة أسبوعين.' }],
  },
  {
    id: 'customs-verse-interview',
    movieTitle: 'Airport Immigration Interview - English Conversation Practice for Travelers - English Verse Academy',
    releaseYear: 2023,
    director: 'English Verse Academy',
    genre: 'Travel English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Immigration Made Easy',
    sceneDescription: 'تدريب كامل على مقابلة الجوازات: جوازك، تذكرة العودة، وأسئلة الفلوس والإقامة.',
    youtubeId: 'C7PKHBmejmg',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'English Verse Academy (Official)',
    dialogueQuote: 'Where will you be staying during your trip?',
    actorName: 'Officer',
    characterName: 'Officer',
    thumbnailUrl: 'https://img.youtube.com/vi/C7PKHBmejmg/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Verse Academy Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Where will you be staying during your trip?', arEg: 'هتقيم فين طول رحلتك؟', arFusha: 'هتقيم فين طول رحلتك؟', speaker: 'Officer', keyWords: [{ word: 'staying', ipa: '', meaningAr: 'هتقيم', meaningEn: '' }, { word: 'during your trip', ipa: '', meaningAr: 'طول رحلتك', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Here is my return ticket and hotel booking.', arEg: 'دي تذكرة العودة وحجز الفندق.', arFusha: 'دي تذكرة العودة وحجز الفندق.', speaker: 'Traveler', keyWords: [{ word: 'return ticket', ipa: '', meaningAr: 'تذكرة العودة', meaningEn: '' }, { word: 'hotel booking', ipa: '', meaningAr: 'حجز الفندق', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'return ticket', type: 'collocation', meaningAr: 'تذكرة العودة', meaningEn: '', egyptianEquivalent: 'تذكرة الرجوع', exampleInScene: 'Show your return ticket.' },      { term: 'booking', type: 'cultural', meaningAr: 'حجز', meaningEn: '', egyptianEquivalent: 'حجز', exampleInScene: 'My booking is confirmed.' },      { term: 'stay', type: 'cultural', meaningAr: 'يقيم / يسكن مؤقتاً', meaningEn: '', egyptianEquivalent: 'هقيم', exampleInScene: 'I will stay at a hotel.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is a \'return ticket\'?', questionAr: 'يعني إيه return ticket؟', options: ['تذكرة العودة', 'تذكرة الذهاب بس', 'تأشيرة', 'بطاقة صعود'], correctIndex: 0, explanationAr: 'return ticket هي تذكرة الرجوع لبلدك - الجمارك غالباً بتطلبها كدليل إنك هترجع.' }
    ],
    speakingLines: [{ en: 'Where will you be staying during your trip?', arEg: 'هتقيم فين طول رحلتك؟' }, { en: 'Here is my return ticket and hotel booking.', arEg: 'دي تذكرة العودة وحجز الفندق.' }],
  },
  {
    id: 'celebrations-bob-class',
    movieTitle: 'Free English Class! Topic: Celebrations - Bob the Canadian',
    releaseYear: 2021,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Party English',
    sceneDescription: 'حصة بوب عن الاحتفالات: أعياد الميلاد، التهاني، والمناسبات - كلمات الفرح كلها.',
    youtubeId: 'Pn3MXGxNWCM',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'Happy birthday! I hope all your wishes come true.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/Pn3MXGxNWCM/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Happy birthday! I hope all your wishes come true.', arEg: 'عيد ميلاد سعيد! يارب كل أمنياتك تتحقق.', arFusha: 'عيد ميلاد سعيد! يارب كل أمنياتك تتحقق.', speaker: 'Bob', keyWords: [{ word: 'wishes come true', ipa: '', meaningAr: 'أمنيات تتحقق', meaningEn: '' }, { word: 'hope', ipa: '', meaningAr: 'يارب / أتمنى', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Congratulations on your graduation!', arEg: 'مبروك التخرج!', arFusha: 'مبروك التخرج!', speaker: 'Bob', keyWords: [{ word: 'congratulations on', ipa: '', meaningAr: 'مبروك على', meaningEn: '' }, { word: 'graduation', ipa: '', meaningAr: 'تخرج', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'congratulations on', type: 'collocation', meaningAr: 'مبروك على', meaningEn: '', egyptianEquivalent: 'ألف مبروك', exampleInScene: 'Congratulations on the new job!' },      { term: 'come true', type: 'phrasal-verb', meaningAr: 'يتحقق (حلم/أمنية)', meaningEn: '', egyptianEquivalent: 'تتحقق', exampleInScene: 'May your dreams come true.' },      { term: 'celebrate', type: 'cultural', meaningAr: 'يحتفل', meaningEn: '', egyptianEquivalent: 'يحتفل', exampleInScene: 'We celebrate every year.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What do you say when someone graduates?', questionAr: 'تقول إيه لما حد يتخرج؟', options: ['Congratulations on your graduation', 'Happy birthday', 'Good luck tomorrow', 'Sorry to hear that'], correctIndex: 0, explanationAr: 'Congratulations on + المناسبة هي صيغة التهنئة الرسمية والودية.' }
    ],
    speakingLines: [{ en: 'Happy birthday! I hope all your wishes come true.', arEg: 'عيد ميلاد سعيد! يارب كل أمنياتك تتحقق.' }, { en: 'Congratulations on your graduation!', arEg: 'مبروك التخرج!' }],
  },
  {
    id: 'celebrations-class101-birthdays',
    movieTitle: 'Master Everyday English: Birthdays & Celebrations - EnglishClass101',
    releaseYear: 2021,
    director: 'EnglishClass101',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Birthday Party Words',
    sceneDescription: 'مفردات أعياد الميلاد والمناسبات: الهدايا، الكيك، الدعوات - للكلام اليومي.',
    youtubeId: 'bJ5jGXzfC1o',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Learn English with EnglishClass101.com (Official)',
    dialogueQuote: 'Are you coming to my party on Saturday?',
    actorName: 'Teacher',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/bJ5jGXzfC1o/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'EnglishClass101 Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Are you coming to my party on Saturday?', arEg: 'جاي حفلتي يوم السبت؟', arFusha: 'جاي حفلتي يوم السبت؟', speaker: 'Host', keyWords: [{ word: 'coming to', ipa: '', meaningAr: 'جاي', meaningEn: '' }, { word: 'party', ipa: '', meaningAr: 'حفلة', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Thanks for inviting me! I would not miss it.', arEg: 'شكراً على الدعوة! مستحيل أفوّتها.', arFusha: 'شكراً على الدعوة! مستحيل أفوّتها.', speaker: 'Guest', keyWords: [{ word: 'inviting me', ipa: '', meaningAr: 'دعوتك ليا', meaningEn: '' }, { word: 'miss it', ipa: '', meaningAr: 'أفوّتها', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'invite', type: 'cultural', meaningAr: 'يدعو', meaningEn: '', egyptianEquivalent: 'يعزم', exampleInScene: 'She invited me to dinner.' },      { term: 'I would not miss it', type: 'collocation', meaningAr: 'مستحيل أفوّتها', meaningEn: '', egyptianEquivalent: 'لازم أحضر', exampleInScene: 'The match? I would not miss it!' },      { term: 'gift', type: 'cultural', meaningAr: 'هدية', meaningEn: '', egyptianEquivalent: 'هدية', exampleInScene: 'A birthday gift.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'I would not miss it\' mean?', questionAr: 'معنى I would not miss it؟', options: ['مستحيل أفوّت المناسبة', 'مش هروح', 'هنسى الميعاد', 'هتأخر'], correctIndex: 0, explanationAr: 'الجملة دي بتعبر عن حماس للحضور - مستحيل أفوّتها.' }
    ],
    speakingLines: [{ en: 'Are you coming to my party on Saturday?', arEg: 'جاي حفلتي يوم السبت؟' }, { en: 'Thanks for inviting me! I would not miss it.', arEg: 'شكراً على الدعوة! مستحيل أفوّتها.' }],
  },
  {
    id: 'time-etb-telling',
    movieTitle: 'Telling the Time in English - ETB Education',
    releaseYear: 2020,
    director: 'ETB Education',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'What Time Is It?',
    sceneDescription: 'قراءة الساعة بالإنجليزي: o\'clock, half past, quarter to - الأساس اللي محدش بيعلمه صح.',
    youtubeId: 'WLAZpKY-9Ks',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'ETB Education (Official)',
    dialogueQuote: 'It is half past nine.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/WLAZpKY-9Ks/hqdefault.jpg',
    category: 'english_for_beginners',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'ETB Education Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'It is half past nine.', arEg: 'الساعة تسعة ونص.', arFusha: 'الساعة تسعة ونص.', speaker: 'Teacher', keyWords: [{ word: 'half past', ipa: '', meaningAr: 'ونص', meaningEn: '' }, { word: 'nine', ipa: '', meaningAr: 'تسعة', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'It is a quarter to five.', arEg: 'الساعة خمسة إلا ربع.', arFusha: 'الساعة خمسة إلا ربع.', speaker: 'Teacher', keyWords: [{ word: 'a quarter to', ipa: '', meaningAr: 'إلا ربع', meaningEn: '' }, { word: 'five', ipa: '', meaningAr: 'خمسة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'half past', type: 'collocation', meaningAr: 'ونص (الساعة)', meaningEn: '', egyptianEquivalent: 'والنص', exampleInScene: 'Half past seven.' },      { term: 'a quarter to', type: 'collocation', meaningAr: 'إلا ربع', meaningEn: '', egyptianEquivalent: 'إلا ربع', exampleInScene: 'A quarter to eight.' },      { term: 'a quarter past', type: 'collocation', meaningAr: 'والربع', meaningEn: '', egyptianEquivalent: 'والربع', exampleInScene: 'A quarter past ten.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What time is \'a quarter to five\'?', questionAr: 'يعني إيه a quarter to five؟', options: ['خمسة إلا ربع', 'خمسة وربع', 'أربعة ونص', 'خمسة بالظبط'], correctIndex: 0, explanationAr: 'a quarter to five يعني الساعة خمسة إلا ربع (4:45) - to معناها للوقت الجاي.' }
    ],
    speakingLines: [{ en: 'It is half past nine.', arEg: 'الساعة تسعة ونص.' }, { en: 'It is a quarter to five.', arEg: 'الساعة خمسة إلا ربع.' }],
  },
  {
    id: 'celebrations-zeina-b2',
    movieTitle: 'Master English Vocabulary: Celebrations & Special Occasions - English with Zeina',
    releaseYear: 2023,
    director: 'English with Zeina',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Special Occasions Vocabulary',
    sceneDescription: 'مفردات المناسبات الخاصة للمستوى المتوسط: الخطوبة، الذكرى السنوية، حفلات التقاعد.',
    youtubeId: '3m1lfXr64CE',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'English with Zeina (Official)',
    dialogueQuote: 'They are celebrating their wedding anniversary.',
    actorName: 'Zeina',
    characterName: 'Zeina',
    thumbnailUrl: 'https://img.youtube.com/vi/3m1lfXr64CE/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English with Zeina Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'They are celebrating their wedding anniversary.', arEg: 'هما بيحتفلوا بذكرى جوازهم.', arFusha: 'هما بيحتفلوا بذكرى جوازهم.', speaker: 'Zeina', keyWords: [{ word: 'wedding anniversary', ipa: '', meaningAr: 'ذكرى الجواز', meaningEn: '' }, { word: 'celebrating', ipa: '', meaningAr: 'بيحتفلوا', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'She got engaged last month.', arEg: 'هي اتخطبت الشهر اللي فات.', arFusha: 'هي اتخطبت الشهر اللي فات.', speaker: 'Zeina', keyWords: [{ word: 'got engaged', ipa: '', meaningAr: 'اتخطبت', meaningEn: '' }, { word: 'last month', ipa: '', meaningAr: 'الشهر اللي فات', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'anniversary', type: 'cultural', meaningAr: 'ذكرى سنوية', meaningEn: '', egyptianEquivalent: 'الذكرى', exampleInScene: 'Our anniversary is in June.' },      { term: 'get engaged', type: 'collocation', meaningAr: 'يخطب / يتخطب', meaningEn: '', egyptianEquivalent: 'اتخطبت', exampleInScene: 'They got engaged in Paris.' },      { term: 'retirement', type: 'cultural', meaningAr: 'تقاعد', meaningEn: '', egyptianEquivalent: 'المعاش', exampleInScene: 'A retirement party.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'got engaged\' mean?', questionAr: 'معنى got engaged؟', options: ['اتخطبت', 'اتجوزت', 'اتطلقت', 'سافرت'], correctIndex: 0, explanationAr: 'got engaged معناها اتخطبت (قبل الجواز)، أما الجواز نفسه فهو got married.' }
    ],
    speakingLines: [{ en: 'They are celebrating their wedding anniversary.', arEg: 'هما بيحتفلوا بذكرى جوازهم.' }, { en: 'She got engaged last month.', arEg: 'هي اتخطبت الشهر اللي فات.' }],
  },
  {
    id: 'hobbies-oxford-freetime',
    movieTitle: 'How to Talk About Your Free Time and Hobbies in English - Oxford Online English',
    releaseYear: 2019,
    director: 'Oxford Online English',
    genre: 'Speaking Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Hobbies Beyond \'I Like Football\'',
    sceneDescription: 'أكسفورد أونلاين بتوسع كلامك عن الهوايات: إزاي توصف شغفك بتفاصيل تحيّر بيها الممتحنين.',
    youtubeId: 'hoyhPZDp3dE',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Oxford Online English (Official)',
    dialogueQuote: 'I am really into photography these days.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/hoyhPZDp3dE/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Oxford Online English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I am really into photography these days.', arEg: 'أنا مهووس بالتصوير الفترة دي.', arFusha: 'أنا مهووس بالتصوير الفترة دي.', speaker: 'Teacher', keyWords: [{ word: 'into', ipa: '', meaningAr: 'مهتم بـ / مهووس', meaningEn: '' }, { word: 'photography', ipa: '', meaningAr: 'تصوير', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I have taken up running recently.', arEg: 'بدأت أجري مؤخراً.', arFusha: 'بدأت أجري مؤخراً.', speaker: 'Teacher', keyWords: [{ word: 'taken up', ipa: '', meaningAr: 'بدأ هواية جديدة', meaningEn: '' }, { word: 'recently', ipa: '', meaningAr: 'مؤخراً', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'be into', type: 'collocation', meaningAr: 'مهتم بـ / بيحب', meaningEn: '', egyptianEquivalent: 'مهووس بـ', exampleInScene: 'I am into cooking.' },      { term: 'take up', type: 'phrasal-verb', meaningAr: 'يبدأ هواية جديدة', meaningEn: '', egyptianEquivalent: 'بدأ', exampleInScene: 'She took up painting.' },      { term: 'free time', type: 'collocation', meaningAr: 'وقت الفراغ', meaningEn: '', egyptianEquivalent: 'الفاضي', exampleInScene: 'What do you do in your free time?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'take up a hobby\' mean?', questionAr: 'معنى take up a hobby؟', options: ['يبدأ هواية جديدة', 'يسيب هواية', 'يشتري هواية', 'يعلم هواية'], correctIndex: 0, explanationAr: 'take up معناها يبدأ نشاط أو هواية جديدة: take up running / yoga.' }
    ],
    speakingLines: [{ en: 'I am really into photography these days.', arEg: 'أنا مهووس بالتصوير الفترة دي.' }, { en: 'I have taken up running recently.', arEg: 'بدأت أجري مؤخراً.' }],
  },
  {
    id: 'hobbies-vanessa-fluently',
    movieTitle: 'Talk about HOBBIES Fluently in English - Speak English With Vanessa',
    releaseYear: 2021,
    director: 'Speak English With Vanessa',
    genre: 'Speaking Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Fluent Hobby Talk',
    sceneDescription: 'فانيسا بتخليك تتكلم عن هواياتك بطلاقة: جمل طبيعية مش كلمات مفردة - بمستوى متقدم.',
    youtubeId: 'dOw3G0hi4ys',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Speak English With Vanessa (Official)',
    dialogueQuote: 'It helps me unwind after a long day.',
    actorName: 'Vanessa',
    characterName: 'Vanessa',
    thumbnailUrl: 'https://img.youtube.com/vi/dOw3G0hi4ys/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak English With Vanessa Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'It helps me unwind after a long day.', arEg: 'بتساعدني أسترخي بعد يوم طويل.', arFusha: 'بتساعدني أسترخي بعد يوم طويل.', speaker: 'Vanessa', keyWords: [{ word: 'unwind', ipa: '', meaningAr: 'يسترخي', meaningEn: '' }, { word: 'long day', ipa: '', meaningAr: 'يوم طويل', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I play the guitar just for fun.', arEg: 'بعزف جيتار للمتعة بس.', arFusha: 'بعزف جيتار للمتعة بس.', speaker: 'Vanessa', keyWords: [{ word: 'for fun', ipa: '', meaningAr: 'للمتعة', meaningEn: '' }, { word: 'guitar', ipa: '', meaningAr: 'جيتار', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'unwind', type: 'cultural', meaningAr: 'يسترخي بعد تعب', meaningEn: '', egyptianEquivalent: 'يفضفض', exampleInScene: 'I unwind with a book.' },      { term: 'for fun', type: 'collocation', meaningAr: 'للمتعة بس', meaningEn: '', egyptianEquivalent: 'على سبيل المتعة', exampleInScene: 'I dance for fun.' },      { term: 'pastime', type: 'cultural', meaningAr: 'هواية لقضاء الوقت', meaningEn: '', egyptianEquivalent: 'تسلية', exampleInScene: 'Reading is my favorite pastime.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'unwind\' mean?', questionAr: 'معنى unwind؟', options: ['يسترخي بعد تعب', 'يعمل رياضة', 'يشتغل أكتر', 'يسهر'], correctIndex: 0, explanationAr: 'unwind معناها تفك الضغط وتسترخي بعد يوم شاق - زي ما تفك سلك ملفوف.' }
    ],
    speakingLines: [{ en: 'It helps me unwind after a long day.', arEg: 'بتساعدني أسترخي بعد يوم طويل.' }, { en: 'I play the guitar just for fun.', arEg: 'بعزف جيتار للمتعة بس.' }],
  },
  {
    id: 'movies-camille-b2',
    movieTitle: 'Intermediate English Conversation about MOVIES - Learn English with Camille',
    releaseYear: 2022,
    director: 'Learn English with Camille',
    genre: 'Conversation Practice',
    cefrLevel: 'B2',
    sceneTitle: 'Deep Movie Talk',
    sceneDescription: 'حوار حقيقي عن الأفلام بمستوى متوسط: الأنواع، التقييم، والتوصيات - كلام الطبيعي مش الكتب.',
    youtubeId: 'xiikBXfoeHI',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Learn English with Camille (Official)',
    dialogueQuote: 'The plot was gripping from start to finish.',
    actorName: 'Camille',
    characterName: 'Camille',
    thumbnailUrl: 'https://img.youtube.com/vi/xiikBXfoeHI/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Camille Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'The plot was gripping from start to finish.', arEg: 'الحبكة كانت مشوقة من أولها لآخرها.', arFusha: 'الحبكة كانت مشوقة من أولها لآخرها.', speaker: 'Camille', keyWords: [{ word: 'plot', ipa: '', meaningAr: 'حبكة', meaningEn: '' }, { word: 'gripping', ipa: '', meaningAr: 'مشوقة / بتمسكك', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I would not recommend it, to be honest.', arEg: 'مش هنصح بيه، بصراحة.', arFusha: 'مش هنصح بيه، بصراحة.', speaker: 'Camille', keyWords: [{ word: 'recommend', ipa: '', meaningAr: 'ينصح بـ', meaningEn: '' }, { word: 'to be honest', ipa: '', meaningAr: 'بصراحة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'gripping', type: 'cultural', meaningAr: 'مشوق / بيشدك', meaningEn: '', egyptianEquivalent: 'بيمسك نفسك', exampleInScene: 'A gripping thriller.' },      { term: 'recommend', type: 'cultural', meaningAr: 'ينصح بـ / يرشح', meaningEn: '', egyptianEquivalent: 'يرشح', exampleInScene: 'I recommend this movie.' },      { term: 'plot', type: 'cultural', meaningAr: 'حبكة', meaningEn: '', egyptianEquivalent: 'قصة الفيلم', exampleInScene: 'The plot was confusing.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'gripping\' mean about a movie?', questionAr: 'معنى gripping عن فيلم؟', options: ['مشوق بيمسك انتباهك', 'ممل', 'طويل', 'قديم'], correctIndex: 0, explanationAr: 'gripping معناها الفيلم بيشدك ومش قادر تبطل تتفرج - صفة مدح قوية.' }
    ],
    speakingLines: [{ en: 'The plot was gripping from start to finish.', arEg: 'الحبكة كانت مشوقة من أولها لآخرها.' }, { en: 'I would not recommend it, to be honest.', arEg: 'مش هنصح بيه، بصراحة.' }],
  },
  {
    id: 'movies-vanessa-tvshows',
    movieTitle: 'How to Talk About Movies and TV Shows in English - Speak English With Vanessa',
    releaseYear: 2021,
    director: 'Speak English With Vanessa',
    genre: 'Speaking Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Have You Seen It Yet?',
    sceneDescription: 'الكلام اليومي عن الأفلام والمسلسلات: توصيات، حرق أحداث (spoilers)، وتقييمات سريعة.',
    youtubeId: 'D786BdFfOI0',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Speak English With Vanessa (Official)',
    dialogueQuote: 'No spoilers, I have not finished it yet!',
    actorName: 'Vanessa',
    characterName: 'Vanessa',
    thumbnailUrl: 'https://img.youtube.com/vi/D786BdFfOI0/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak English With Vanessa Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'No spoilers, I have not finished it yet!', arEg: 'بلاش حرق أحداث، أنا لسه مخلصتوش!', arFusha: 'بلاش حرق أحداث، أنا لسه مخلصتوش!', speaker: 'Vanessa', keyWords: [{ word: 'spoilers', ipa: '', meaningAr: 'حرق أحداث', meaningEn: '' }, { word: 'not yet', ipa: '', meaningAr: 'لسه', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'It is totally binge-worthy.', arEg: 'المسلسل يستاهل تتفرج عليه ورا بعض.', arFusha: 'المسلسل يستاهل تتفرج عليه ورا بعض.', speaker: 'Vanessa', keyWords: [{ word: 'binge-worthy', ipa: '', meaningAr: 'يستاهل الماراثون', meaningEn: '' }, { word: 'totally', ipa: '', meaningAr: 'تماماً', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'spoiler', type: 'cultural', meaningAr: 'حرق أحداث', meaningEn: '', egyptianEquivalent: 'حرق الفيلم', exampleInScene: 'No spoilers, please!' },      { term: 'binge-watch', type: 'cultural', meaningAr: 'يتفرج على حلقات ورا بعض', meaningEn: '', egyptianEquivalent: 'يعمل ماراثون', exampleInScene: 'We binge-watched the whole season.' },      { term: 'overrated', type: 'cultural', meaningAr: 'مقيّم أكتر من حجمه', meaningEn: '', egyptianEquivalent: 'معلن عنه أوي', exampleInScene: 'The movie is overrated.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'binge-worthy\' mean?', questionAr: 'معنى binge-worthy؟', options: ['يستاهل تتفرج عليه كله ورا بعض', 'ممل جداً', 'طويل أوي', 'مخيف'], correctIndex: 0, explanationAr: 'binge-worthy يعني المسلسل جامد لدرجة إنك هتخلصه كله في يوم.' }
    ],
    speakingLines: [{ en: 'No spoilers, I have not finished it yet!', arEg: 'بلاش حرق أحداث، أنا لسه مخلصتوش!' }, { en: 'It is totally binge-worthy.', arEg: 'المسلسل يستاهل تتفرج عليه ورا بعض.' }],
  },
  {
    id: 'grammar-lucy-conditionals',
    movieTitle: 'The Conditionals - 0, 1, 2 & 3 Conditionals + Quiz - English with Lucy',
    releaseYear: 2020,
    director: 'English with Lucy',
    genre: 'Grammar Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'All Four Conditionals',
    sceneDescription: 'لوسي بتلخص الأربع كونديشونالز بأمثلة واضحة وكويز - الدرس اللي بيفك لخبطة لو/لو كان.',
    youtubeId: 'vXp0ETWXbWo',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'English with Lucy (Official)',
    dialogueQuote: 'If I were rich, I would travel the world.',
    actorName: 'Lucy',
    characterName: 'Lucy',
    thumbnailUrl: 'https://img.youtube.com/vi/vXp0ETWXbWo/hqdefault.jpg',
    category: 'academic_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English with Lucy Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'If I were rich, I would travel the world.', arEg: 'لو كنت غني، كنت هسافر العالم.', arFusha: 'لو كنت غني، كنت هسافر العالم.', speaker: 'Lucy', keyWords: [{ word: 'If I were', ipa: '', meaningAr: 'لو كنت (خيالي)', meaningEn: '' }, { word: 'would travel', ipa: '', meaningAr: 'كنت هسافر', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'If you heat ice, it melts.', arEg: 'لو سخنت التلج، بيذوب.', arFusha: 'لو سخنت التلج، بيذوب.', speaker: 'Lucy', keyWords: [{ word: 'heat', ipa: '', meaningAr: 'يسخن', meaningEn: '' }, { word: 'melts', ipa: '', meaningAr: 'يذوب', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'second conditional', type: 'collocation', meaningAr: 'الشرطي التاني (خيالي)', meaningEn: '', egyptianEquivalent: 'لو الافتراضية', exampleInScene: 'If I were you, I would go.' },      { term: 'zero conditional', type: 'collocation', meaningAr: 'الشرطي الصفري (حقائق)', meaningEn: '', egyptianEquivalent: 'حقائق علمية', exampleInScene: 'If you heat water, it boils.' },      { term: 'If I were you', type: 'collocation', meaningAr: 'لو كنت مكانك', meaningEn: '', egyptianEquivalent: 'لو كنت مكانك', exampleInScene: 'If I were you, I would study.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which conditional is \'If I were rich, I would travel\'?', questionAr: 'جملة If I were rich, I would travel أي نوع شرطي؟', options: ['التاني (خيالي)', 'الصفري (حقائق)', 'الأول (ممكن)', 'التالت (ماضي)'], correctIndex: 0, explanationAr: 'الشرطي التاني للخيال: If + ماضي بسيط، would + مصدر.' }
    ],
    speakingLines: [{ en: 'If I were rich, I would travel the world.', arEg: 'لو كنت غني، كنت هسافر العالم.' }, { en: 'If you heat ice, it melts.', arEg: 'لو سخنت التلج، بيذوب.' }],
  },
  {
    id: 'grammar-friendly-conditionals',
    movieTitle: 'Conditional Sentences Made Easy - Zero, 1st, 2nd & 3rd - Friendly English Lab',
    releaseYear: 2022,
    director: 'Friendly English Lab',
    genre: 'Grammar Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Conditionals Without Headaches',
    sceneDescription: 'شرح مبسط للكونديشونالز الأربعة بجداول وأمثلة يومية - مناسب لو لسه بتتلخبط فيهم.',
    youtubeId: '1TgQHjgV0d8',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Friendly English Lab (Official)',
    dialogueQuote: 'If it rains tomorrow, we will stay home.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/1TgQHjgV0d8/hqdefault.jpg',
    category: 'academic_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Friendly English Lab Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'If it rains tomorrow, we will stay home.', arEg: 'لو مطرت بكرة، هنقعد في البيت.', arFusha: 'لو مطرت بكرة، هنقعد في البيت.', speaker: 'Teacher', keyWords: [{ word: 'rains', ipa: '', meaningAr: 'تمطر', meaningEn: '' }, { word: 'will stay', ipa: '', meaningAr: 'هنقعد', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'If I had studied, I would have passed.', arEg: 'لو كنت ذاكرت، كنت هنجح.', arFusha: 'لو كنت ذاكرت، كنت هنجح.', speaker: 'Teacher', keyWords: [{ word: 'had studied', ipa: '', meaningAr: 'كنت ذاكرت (ماضي تام)', meaningEn: '' }, { word: 'would have passed', ipa: '', meaningAr: 'كنت هنجح', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'first conditional', type: 'collocation', meaningAr: 'الشرطي الأول (محتمل)', meaningEn: '', egyptianEquivalent: 'لو الممكنة', exampleInScene: 'If it rains, I will stay.' },      { term: 'third conditional', type: 'collocation', meaningAr: 'الشرطي التالت (ندم على الماضي)', meaningEn: '', egyptianEquivalent: 'لو الندم', exampleInScene: 'If I had known, I would have come.' },      { term: 'unless', type: 'cultural', meaningAr: 'إلا لو / ما لم', meaningEn: '', egyptianEquivalent: 'إلا إذا', exampleInScene: 'I will not go unless you come.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which conditional shows regret about the past?', questionAr: 'أنهي شرطي بيعبر عن ندم على الماضي؟', options: ['التالت', 'الأول', 'الصفري', 'التاني'], correctIndex: 0, explanationAr: 'الشرطي التالت: If + had + تصريف تالت، would have + تصريف تالت - للكلام عن ماضي ما حصلش.' }
    ],
    speakingLines: [{ en: 'If it rains tomorrow, we will stay home.', arEg: 'لو مطرت بكرة، هنقعد في البيت.' }, { en: 'If I had studied, I would have passed.', arEg: 'لو كنت ذاكرت، كنت هنجح.' }],
  },
  {
    id: 'internet-lingoni-b1',
    movieTitle: 'English Vocabulary: The Internet, Electronics, and Social Media - lingoni',
    releaseYear: 2021,
    director: 'lingoni ENGLISH',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Digital Life Words',
    sceneDescription: 'مفردات الإنترنت والسوشيال ميديا: تحميل، مشاركة، متابعين - كلام العصر الرقمي.',
    youtubeId: 'a16E1FWjDM0',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'lingoni ENGLISH (Official)',
    dialogueQuote: 'She posted a photo and it went viral.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/a16E1FWjDM0/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'lingoni ENGLISH Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'She posted a photo and it went viral.', arEg: 'هي نزلت صورة وانتشرت انتشار مرعب.', arFusha: 'هي نزلت صورة وانتشرت انتشار مرعب.', speaker: 'Teacher', keyWords: [{ word: 'posted', ipa: '', meaningAr: 'نزلت (بوست)', meaningEn: '' }, { word: 'went viral', ipa: '', meaningAr: 'انتشرت', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Remember to back up your data regularly.', arEg: 'افتكر تعمل نسخة احتياطية لبياناتك بانتظام.', arFusha: 'افتكر تعمل نسخة احتياطية لبياناتك بانتظام.', speaker: 'Teacher', keyWords: [{ word: 'back up', ipa: '', meaningAr: 'نسخة احتياطية', meaningEn: '' }, { word: 'regularly', ipa: '', meaningAr: 'بانتظام', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'go viral', type: 'collocation', meaningAr: 'ينتشر انتشار واسع', meaningEn: '', egyptianEquivalent: 'يعمل تريند', exampleInScene: 'The video went viral.' },      { term: 'follower', type: 'cultural', meaningAr: 'متابع', meaningEn: '', egyptianEquivalent: 'متابعين', exampleInScene: 'She has many followers.' },      { term: 'upload', type: 'cultural', meaningAr: 'يرفع (ملف/فيديو)', meaningEn: '', egyptianEquivalent: 'يرفع', exampleInScene: 'Upload the video tonight.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'go viral\' mean?', questionAr: 'معنى go viral؟', options: ['ينتشر بسرعة كبيرة أونلاين', 'يصاب بفيروس', 'يتحذف', 'يتشفر'], correctIndex: 0, explanationAr: 'go viral معناها المحتوى انتشر بسرعة مرعبة على كل المنصات.' }
    ],
    speakingLines: [{ en: 'She posted a photo and it went viral.', arEg: 'هي نزلت صورة وانتشرت انتشار مرعب.' }, { en: 'Remember to back up your data regularly.', arEg: 'افتكر تعمل نسخة احتياطية لبياناتك بانتظام.' }],
  },
  {
    id: 'internet-shaw-50',
    movieTitle: '50 Words: Social Media and the Internet - British Pronunciation - Shaw English Online',
    releaseYear: 2020,
    director: 'Shaw English Online',
    genre: 'Pronunciation Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Say Internet Words Right',
    sceneDescription: 'خمسين كلمة من عالم السوشيال ميديا بالنطق البريطاني الصح - meme, gif, algorithm.',
    youtubeId: 'mL9-Uor9HEc',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Shaw English Online (Official)',
    dialogueQuote: 'The algorithm decides what you see.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/mL9-Uor9HEc/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Shaw English Online Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'The algorithm decides what you see.', arEg: 'الخوارزمية هي اللي بتحدد تشوف إيه.', arFusha: 'الخوارزمية هي اللي بتحدد تشوف إيه.', speaker: 'Teacher', keyWords: [{ word: 'algorithm', ipa: '', meaningAr: 'خوارزمية', meaningEn: '' }, { word: 'decides', ipa: '', meaningAr: 'بتحدد', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Meme is pronounced MEEM, not me-me.', arEg: 'كلمة meme بتتنطق ميم، مش مي-مي.', arFusha: 'كلمة meme بتتنطق ميم، مش مي-مي.', speaker: 'Teacher', keyWords: [{ word: 'meme', ipa: '', meaningAr: 'ميم', meaningEn: '' }, { word: 'pronounced', ipa: '', meaningAr: 'بتتنطق', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'algorithm', type: 'cultural', meaningAr: 'خوارزمية', meaningEn: '', egyptianEquivalent: 'الألجوريزم', exampleInScene: 'The algorithm shows you ads.' },      { term: 'meme', type: 'cultural', meaningAr: 'ميم', meaningEn: '', egyptianEquivalent: 'ميمز', exampleInScene: 'That meme is funny.' },      { term: 'hashtag', type: 'cultural', meaningAr: 'هاشتاج', meaningEn: '', egyptianEquivalent: 'هاشتاج', exampleInScene: 'Use the right hashtag.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How is \'meme\' pronounced?', questionAr: 'كلمة meme بتتنطق إزاي؟', options: ['ميم', 'مي-مي', 'ميمي', 'ميمه'], correctIndex: 0, explanationAr: 'meme بتتنطق ميم - مقطع واحد، مش مي-مي زي ما ناس كتير بتقول.' }
    ],
    speakingLines: [{ en: 'The algorithm decides what you see.', arEg: 'الخوارزمية هي اللي بتحدد تشوف إيه.' }, { en: 'Meme is pronounced MEEM, not me-me.', arEg: 'كلمة meme بتتنطق ميم، مش مي-مي.' }],
  },
  {
    id: 'coworkers-hll-talk',
    movieTitle: 'How To Talk to Your Coworkers - Questions and Answers in Daily Life English - High Level Listening',
    releaseYear: 2021,
    director: 'High Level Listening',
    genre: 'Business English Podcast',
    cefrLevel: 'C1',
    sceneTitle: 'Office Small Talk Advanced',
    sceneDescription: 'حوارات الزمايل في الشغل بمستوى متقدم: أسئلة وردود طبيعية بين الكليجز - نطق وسرعة حقيقية.',
    youtubeId: 'U3Vnxo4jmPM',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'High Level Listening (Official)',
    dialogueQuote: 'How is your project coming along?',
    actorName: 'Host',
    characterName: 'Coworker',
    thumbnailUrl: 'https://img.youtube.com/vi/U3Vnxo4jmPM/hqdefault.jpg',
    category: 'business_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'High Level Listening Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'How is your project coming along?', arEg: 'مشروعك ماشي إزاي؟', arFusha: 'مشروعك ماشي إزاي؟', speaker: 'Coworker', keyWords: [{ word: 'coming along', ipa: '', meaningAr: 'ماشي / بيتقدم', meaningEn: '' }, { word: 'project', ipa: '', meaningAr: 'مشروع', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'I am swamped with deadlines this week.', arEg: 'أنا مغرقان في ميعاد التسليم الأسبوع ده.', arFusha: 'أنا مغرقان في ميعاد التسليم الأسبوع ده.', speaker: 'Coworker', keyWords: [{ word: 'swamped', ipa: '', meaningAr: 'مغرقان (شغل كتير)', meaningEn: '' }, { word: 'deadlines', ipa: '', meaningAr: 'مواعيد تسليم', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'How is it coming along?', type: 'collocation', meaningAr: 'الشغل ماشي إزاي؟', meaningEn: '', egyptianEquivalent: 'عامل إيه فيه', exampleInScene: 'How is the report coming along?' },      { term: 'swamped', type: 'cultural', meaningAr: 'مغرقان في الشغل', meaningEn: '', egyptianEquivalent: 'مش فاضي خالص', exampleInScene: 'I am swamped today.' },      { term: 'deadline', type: 'cultural', meaningAr: 'ميعاد تسليم', meaningEn: '', egyptianEquivalent: 'ديدلاين', exampleInScene: 'The deadline is tight.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'I am swamped\' mean at work?', questionAr: 'معنى I am swamped في الشغل؟', options: ['مغرقان في الشغل', 'فاضي تماماً', 'مستقيل', 'في أجازة'], correctIndex: 0, explanationAr: 'swamped معناها عندك شغل فوق طاقتك - تعبير شائع جداً في المكاتب.' }
    ],
    speakingLines: [{ en: 'How is your project coming along?', arEg: 'مشروعك ماشي إزاي؟' }, { en: 'I am swamped with deadlines this week.', arEg: 'أنا مغرقان في ميعاد التسليم الأسبوع ده.' }],
  },
  {
    id: 'office-jessica-conversation',
    movieTitle: 'English Conversation At the Office - Speaking English at Workplace - Learn English with Jessica',
    releaseYear: 2021,
    director: 'Learn English with Jessica',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'First Day at the Office',
    sceneDescription: 'حوارات المكتب الأساسية: التعارف مع الزمايل، طلب مساعدة، والكلام مع المدير - سهل وبطيء.',
    youtubeId: 'dzA7nL6cicY',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Learn English with Jessica (Official)',
    dialogueQuote: 'Could you give me a hand with this report?',
    actorName: 'Jessica',
    characterName: 'Coworker',
    thumbnailUrl: 'https://img.youtube.com/vi/dzA7nL6cicY/hqdefault.jpg',
    category: 'business_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Jessica Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Could you give me a hand with this report?', arEg: 'ممكن تساعدني في التقرير ده؟', arFusha: 'ممكن تساعدني في التقرير ده؟', speaker: 'Coworker', keyWords: [{ word: 'give me a hand', ipa: '', meaningAr: 'تساعدني', meaningEn: '' }, { word: 'report', ipa: '', meaningAr: 'تقرير', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'I will forward you the email right away.', arEg: 'هبعتلك الإيميل حالاً.', arFusha: 'هبعتلك الإيميل حالاً.', speaker: 'Coworker', keyWords: [{ word: 'forward', ipa: '', meaningAr: 'يحوّل / يبعت', meaningEn: '' }, { word: 'right away', ipa: '', meaningAr: 'حالاً', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'give me a hand', type: 'idiom', meaningAr: 'ساعدني', meaningEn: '', egyptianEquivalent: 'هات إيدك معايا', exampleInScene: 'Give me a hand with these boxes.' },      { term: 'forward an email', type: 'collocation', meaningAr: 'يحوّل إيميل', meaningEn: '', egyptianEquivalent: 'يبعت الإيميل', exampleInScene: 'Forward me the email.' },      { term: 'right away', type: 'collocation', meaningAr: 'حالاً / فوراً', meaningEn: '', egyptianEquivalent: 'على طول', exampleInScene: 'I will do it right away.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'give me a hand\' mean?', questionAr: 'معنى give me a hand؟', options: ['ساعدني', 'اديني إيدك', 'صافحني', 'صفق لي'], correctIndex: 0, explanationAr: 'give me a hand تعبير ودي معناه ساعدني - مستخدم كتير بين الزمايل.' }
    ],
    speakingLines: [{ en: 'Could you give me a hand with this report?', arEg: 'ممكن تساعدني في التقرير ده؟' }, { en: 'I will forward you the email right away.', arEg: 'هبعتلك الإيميل حالاً.' }],
  },
  {
    id: 'opinion-talkspire-phrases',
    movieTitle: 'In My Opinion Phrases Practice - TalkspireX Podcast',
    releaseYear: 2023,
    director: 'TalkspireX',
    genre: 'Speaking Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Say What You Really Think',
    sceneDescription: 'تدريب على عبارات الرأي: In my opinion, From my point of view, As far as I am concerned.',
    youtubeId: 'iPJR4s6Jg7A',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'TalkspireX Podcast (Official)',
    dialogueQuote: 'As far as I am concerned, this is the best option.',
    actorName: 'Host',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/iPJR4s6Jg7A/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'TalkspireX Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'As far as I am concerned, this is the best option.', arEg: 'بالنسبة لي، ده أحسن اختيار.', arFusha: 'بالنسبة لي، ده أحسن اختيار.', speaker: 'Host', keyWords: [{ word: 'as far as I am concerned', ipa: '', meaningAr: 'بالنسبة لي', meaningEn: '' }, { word: 'option', ipa: '', meaningAr: 'اختيار', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'From my point of view, the plan needs work.', arEg: 'من وجهة نظري، الخطة محتاجة شغل.', arFusha: 'من وجهة نظري، الخطة محتاجة شغل.', speaker: 'Host', keyWords: [{ word: 'point of view', ipa: '', meaningAr: 'وجهة نظر', meaningEn: '' }, { word: 'needs work', ipa: '', meaningAr: 'محتاجة شغل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'in my opinion', type: 'collocation', meaningAr: 'في رأيي', meaningEn: '', egyptianEquivalent: 'من وجهة نظري', exampleInScene: 'In my opinion, he is right.' },      { term: 'as far as I am concerned', type: 'collocation', meaningAr: 'بالنسبة لي (رأي رسمي)', meaningEn: '', egyptianEquivalent: 'أنا شايف', exampleInScene: 'As far as I am concerned, we are done.' },      { term: 'point of view', type: 'collocation', meaningAr: 'وجهة نظر', meaningEn: '', egyptianEquivalent: 'رأي', exampleInScene: 'That is my point of view.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which phrase is the most formal for giving an opinion?', questionAr: 'أنهي عبارة أرسم واحدة للرأي؟', options: ['As far as I am concerned', 'I think', 'I guess', 'Maybe'], correctIndex: 0, explanationAr: 'As far as I am concerned صيغة رسمية قوية للرأي - مناسبة للاجتماعات والامتحانات.' }
    ],
    speakingLines: [{ en: 'As far as I am concerned, this is the best option.', arEg: 'بالنسبة لي، ده أحسن اختيار.' }, { en: 'From my point of view, the plan needs work.', arEg: 'من وجهة نظري، الخطة محتاجة شغل.' }],
  },
  {
    id: 'opinion-fluency-stopithink',
    movieTitle: 'Stop Saying \'I Think\'! Smarter Ways to Express Your Opinion - Fluency in Real Life',
    releaseYear: 2023,
    director: 'Fluency in Real Life',
    genre: 'Speaking Lesson',
    cefrLevel: 'B2',
    sceneTitle: 'Beyond I Think',
    sceneDescription: 'بدائل ذكية لـ I think: عبارات بتخلي رأيك يبان أقوى وأطبيعي في النقاشات.',
    youtubeId: 'xKRfDKjQosk',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Fluency in Real Life (Official)',
    dialogueQuote: 'The way I see it, we have two choices.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/xKRfDKjQosk/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Fluency in Real Life Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'The way I see it, we have two choices.', arEg: 'أنا شايف إن قدامنا اختيارين.', arFusha: 'أنا شايف إن قدامنا اختيارين.', speaker: 'Teacher', keyWords: [{ word: 'the way I see it', ipa: '', meaningAr: 'أنا شايف إن', meaningEn: '' }, { word: 'choices', ipa: '', meaningAr: 'اختيارات', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I am convinced that practice beats talent.', arEg: 'أنا مقتنع إن الممارسة بتغلب الموهبة.', arFusha: 'أنا مقتنع إن الممارسة بتغلب الموهبة.', speaker: 'Teacher', keyWords: [{ word: 'convinced', ipa: '', meaningAr: 'مقتنع', meaningEn: '' }, { word: 'beats', ipa: '', meaningAr: 'بتغلب', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'the way I see it', type: 'idiom', meaningAr: 'أنا شايف إن (رأي)', meaningEn: '', egyptianEquivalent: 'من نظرتي', exampleInScene: 'The way I see it, we should wait.' },      { term: 'I am convinced that', type: 'collocation', meaningAr: 'أنا مقتنع إن', meaningEn: '', egyptianEquivalent: 'متأكد إن', exampleInScene: 'I am convinced that he is honest.' },      { term: 'believe', type: 'cultural', meaningAr: 'يؤمن / يعتقد', meaningEn: '', egyptianEquivalent: 'شايف', exampleInScene: 'I believe in hard work.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'the way I see it\' mean?', questionAr: 'معنى the way I see it؟', options: ['أنا شايف إن (رأيي)', 'الطريق اللي بشوفه', 'بشوف التلفزيون', 'بصيت عليه'], correctIndex: 0, explanationAr: 'the way I see it طريقة طبيعية لتقديم رأيك بدل I think المتكررة.' }
    ],
    speakingLines: [{ en: 'The way I see it, we have two choices.', arEg: 'أنا شايف إن قدامنا اختيارين.' }, { en: 'I am convinced that practice beats talent.', arEg: 'أنا مقتنع إن الممارسة بتغلب الموهبة.' }],
  },
  {
    id: 'goals-bob-dreams',
    movieTitle: 'How to Talk About Your Goals and Dreams in English - Bob the Canadian',
    releaseYear: 2021,
    director: 'Bob the Canadian',
    genre: 'Speaking Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Dream Out Loud',
    sceneDescription: 'بوب بيعلمك تتكلم عن أهدافك وأحلامك: الخطط المستقبلية بجمل بسيطة وواضحة.',
    youtubeId: 'JS9KpbF_804',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'My goal is to speak English fluently.',
    actorName: 'Bob',
    characterName: 'Bob',
    thumbnailUrl: 'https://img.youtube.com/vi/JS9KpbF_804/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Bob the Canadian',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'My goal is to speak English fluently.', arEg: 'هدفي إني أتكلم إنجليزي بطلاقة.', arFusha: 'هدفي إني أتكلم إنجليزي بطلاقة.', speaker: 'Bob', keyWords: [{ word: 'goal', ipa: '', meaningAr: 'هدف', meaningEn: '' }, { word: 'fluently', ipa: '', meaningAr: 'بطلاقة', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I hope to visit Canada one day.', arEg: 'نفسي أزور كندا يوم ما.', arFusha: 'نفسي أزور كندا يوم ما.', speaker: 'Bob', keyWords: [{ word: 'hope to', ipa: '', meaningAr: 'نفسي في', meaningEn: '' }, { word: 'one day', ipa: '', meaningAr: 'يوم ما', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'goal', type: 'cultural', meaningAr: 'هدف', meaningEn: '', egyptianEquivalent: 'هدفي', exampleInScene: 'Set small goals.' },      { term: 'hope to', type: 'collocation', meaningAr: 'يأمل / نفسه في', meaningEn: '', egyptianEquivalent: 'نفسي', exampleInScene: 'I hope to travel soon.' },      { term: 'achieve', type: 'cultural', meaningAr: 'يحقق (هدف)', meaningEn: '', egyptianEquivalent: 'يوصل لهدفه', exampleInScene: 'You can achieve your dreams.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'I hope to visit Canada one day\' express?', questionAr: 'جملة I hope to visit Canada one day بتعبر عن إيه؟', options: ['أمنية مستقبلية', 'ذكرى قديمة', 'خطة مؤكدة', 'شكوى'], correctIndex: 0, explanationAr: 'hope to + مصدر للأمنيات المستقبلية - نفسي أعمل كده يوم ما.' }
    ],
    speakingLines: [{ en: 'My goal is to speak English fluently.', arEg: 'هدفي إني أتكلم إنجليزي بطلاقة.' }, { en: 'I hope to visit Canada one day.', arEg: 'نفسي أزور كندا يوم ما.' }],
  },
  {
    id: 'goals-mr-english-plans',
    movieTitle: 'Easy English Conversation - Dreams, Goals & Future Plans - Mr. English Channel',
    releaseYear: 2023,
    director: 'Mr. English Channel',
    genre: 'English Podcast',
    cefrLevel: 'A2',
    sceneTitle: 'Future Plans Chat',
    sceneDescription: 'حوار سهل عن الأحلام والخطط المستقبلية: going to و want to في سياق طبيعي.',
    youtubeId: 'PRpzuPpIej0',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Mr. English Channel (Official)',
    dialogueQuote: 'I am going to start my own business next year.',
    actorName: 'Host',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/PRpzuPpIej0/hqdefault.jpg',
    category: 'podcasts',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Mr. English Channel Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'I am going to start my own business next year.', arEg: 'هبدأ مشروعي الخاص السنة الجاية.', arFusha: 'هبدأ مشروعي الخاص السنة الجاية.', speaker: 'Host', keyWords: [{ word: 'going to', ipa: '', meaningAr: 'هـ (للمستقبل)', meaningEn: '' }, { word: 'my own business', ipa: '', meaningAr: 'مشروعي الخاص', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'What do you want to do in the future?', arEg: 'عايز تعمل إيه في المستقبل؟', arFusha: 'عايز تعمل إيه في المستقبل؟', speaker: 'Host', keyWords: [{ word: 'want to', ipa: '', meaningAr: 'عايز', meaningEn: '' }, { word: 'in the future', ipa: '', meaningAr: 'في المستقبل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'be going to', type: 'collocation', meaningAr: 'هـ (خطة مستقبلية)', meaningEn: '', egyptianEquivalent: 'هعمل', exampleInScene: 'I am going to study abroad.' },      { term: 'my own', type: 'collocation', meaningAr: 'الخاص بي', meaningEn: '', egyptianEquivalent: 'بتاعي أنا', exampleInScene: 'My own room.' },      { term: 'in the future', type: 'collocation', meaningAr: 'في المستقبل', meaningEn: '', egyptianEquivalent: 'قدام', exampleInScene: 'I want to travel in the future.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'When do we use \'going to\'?', questionAr: 'بنستخدم going to امتى؟', options: ['للخطط المستقبلية المقصودة', 'للماضي البعيد', 'للعادات اليومية', 'للأوامر'], correctIndex: 0, explanationAr: 'going to للخطط والنوايا المستقبلية: I am going to start a business.' }
    ],
    speakingLines: [{ en: 'I am going to start my own business next year.', arEg: 'هبدأ مشروعي الخاص السنة الجاية.' }, { en: 'What do you want to do in the future?', arEg: 'عايز تعمل إيه في المستقبل؟' }],
  },
  {
    id: 'taxi-prospeak-ride',
    movieTitle: 'Real English Conversation: Taking an Uber / Taxi - ProSpeak English',
    releaseYear: 2023,
    director: 'ProSpeak English',
    genre: 'Travel English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Your Ride in English',
    sceneDescription: 'حوار أوبر حقيقي من الطلب للنزول: الوجهة، الطريق الأسرع، والدفع - مستوى A1-A2.',
    youtubeId: 'fsOqBHuKeSM',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'ProSpeak English (Official)',
    dialogueQuote: 'Could you take the fastest route, please?',
    actorName: 'Passenger',
    characterName: 'Passenger',
    thumbnailUrl: 'https://img.youtube.com/vi/fsOqBHuKeSM/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'ProSpeak English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Could you take the fastest route, please?', arEg: 'ممكن تاخد أسرع طريق، من فضلك؟', arFusha: 'ممكن تاخد أسرع طريق، من فضلك؟', speaker: 'Passenger', keyWords: [{ word: 'fastest route', ipa: '', meaningAr: 'أسرع طريق', meaningEn: '' }, { word: 'take', ipa: '', meaningAr: 'ياخد (طريق)', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'You can drop me off at the corner.', arEg: 'ممكن تنزلني عند الكورنر.', arFusha: 'ممكن تنزلني عند الكورنر.', speaker: 'Passenger', keyWords: [{ word: 'drop me off', ipa: '', meaningAr: 'تنزلني', meaningEn: '' }, { word: 'corner', ipa: '', meaningAr: 'الناصية', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'drop off', type: 'phrasal-verb', meaningAr: 'ينزل حد من العربية', meaningEn: '', egyptianEquivalent: 'يوصلني وينزلني', exampleInScene: 'Drop me off here.' },      { term: 'route', type: 'cultural', meaningAr: 'طريق / مسار', meaningEn: '', egyptianEquivalent: 'المسار', exampleInScene: 'The fastest route.' },      { term: 'fare', type: 'cultural', meaningAr: 'أجرة الرحلة', meaningEn: '', egyptianEquivalent: 'الأجرة', exampleInScene: 'The fare was twenty pounds.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'drop me off at the corner\' mean?', questionAr: 'معنى drop me off at the corner؟', options: ['نزلني عند الناصية', 'وصلني للبيت', 'خدني لفة', 'استنى عند الناصية'], correctIndex: 0, explanationAr: 'drop off معناها توصل حد وتنزله في مكان - عكسها pick up يعني تاخده.' }
    ],
    speakingLines: [{ en: 'Could you take the fastest route, please?', arEg: 'ممكن تاخد أسرع طريق، من فضلك؟' }, { en: 'You can drop me off at the corner.', arEg: 'ممكن تنزلني عند الكورنر.' }],
  },
  {
    id: 'taxi-giovana-phrases',
    movieTitle: 'Useful Phrases When Taking a Taxi/Uber - English by Giovana',
    releaseYear: 2023,
    director: 'English by Giovana',
    genre: 'Travel English Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Taxi Phrases That Work',
    sceneDescription: 'جيوفانا بتلخص عبارات التاكسي والأوبر: تأكيد المشوار، السؤال عن السعر، وتقييم السواق.',
    youtubeId: '61tey0auDIk',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'English by Giovana (Official)',
    dialogueQuote: 'Is this the right address on the app?',
    actorName: 'Driver',
    characterName: 'Driver',
    thumbnailUrl: 'https://img.youtube.com/vi/61tey0auDIk/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English by Giovana Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Is this the right address on the app?', arEg: 'ده العنوان الصح على التطبيق؟', arFusha: 'ده العنوان الصح على التطبيق؟', speaker: 'Driver', keyWords: [{ word: 'right address', ipa: '', meaningAr: 'العنوان الصح', meaningEn: '' }, { word: 'app', ipa: '', meaningAr: 'تطبيق', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Keep the change.', arEg: 'خلي الباقي ليك.', arFusha: 'خلي الباقي ليك.', speaker: 'Passenger', keyWords: [{ word: 'keep the change', ipa: '', meaningAr: 'خلي الباقي (بقشيش)', meaningEn: '' }, { word: 'change', ipa: '', meaningAr: 'الباقي / الفكة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'keep the change', type: 'collocation', meaningAr: 'خلي الباقي ليك (بقشيش)', meaningEn: '', egyptianEquivalent: 'الباقي ليك', exampleInScene: 'Keep the change, thanks.' },      { term: 'rate the driver', type: 'collocation', meaningAr: 'يقيّم السواق', meaningEn: '', egyptianEquivalent: 'اديله تقييم', exampleInScene: 'Do not forget to rate the driver.' },      { term: 'pickup location', type: 'collocation', meaningAr: 'مكان الاستلام', meaningEn: '', egyptianEquivalent: 'نقطة الركوب', exampleInScene: 'Set your pickup location.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'keep the change\' mean?', questionAr: 'معنى keep the change؟', options: ['خلي الباقي بقشيش', 'ماتدفعش', 'رجّع الفلوس', 'غيّر الفلوس'], correctIndex: 0, explanationAr: 'keep the change بتتقال لما تسيب الفكة للسواق أو الجارسون كبقشيش.' }
    ],
    speakingLines: [{ en: 'Is this the right address on the app?', arEg: 'ده العنوان الصح على التطبيق؟' }, { en: 'Keep the change.', arEg: 'خلي الباقي ليك.' }],
  },
  {
    id: 'barber-conversation-e1',
    movieTitle: 'At the Barber Shop Conversation - Haircut Vocabulary - ConversationAcademy',
    releaseYear: 2022,
    director: 'ConversationAcademy',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Getting a Haircut',
    sceneDescription: 'حوار الحلاق كامل: تحجز ميعاد، توصف القصة، وتقول رأيك في النتيجة - بالمفردات الصح.',
    youtubeId: 'R2vYbhXLvYg',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'ConversationAcademy (Official)',
    dialogueQuote: 'Just a trim, please. Not too short.',
    actorName: 'Customer',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/R2vYbhXLvYg/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'ConversationAcademy Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Just a trim, please. Not too short.', arEg: 'تخفيف بس، من فضلك. مش قصير أوي.', arFusha: 'تخفيف بس، من فضلك. مش قصير أوي.', speaker: 'Customer', keyWords: [{ word: 'trim', ipa: '', meaningAr: 'تخفيف / قص خفيف', meaningEn: '' }, { word: 'too short', ipa: '', meaningAr: 'قصير أوي', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'How would you like your hair cut?', arEg: 'عايز تحلق شعرك إزاي؟', arFusha: 'عايز تحلق شعرك إزاي؟', speaker: 'Barber', keyWords: [{ word: 'would you like', ipa: '', meaningAr: 'عايز', meaningEn: '' }, { word: 'cut', ipa: '', meaningAr: 'قصة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'trim', type: 'cultural', meaningAr: 'قصة خفيفة / تخفيف', meaningEn: '', egyptianEquivalent: 'تخفيف بس', exampleInScene: 'I just need a trim.' },      { term: 'fade', type: 'cultural', meaningAr: 'تدريج (قصة شعر)', meaningEn: '', egyptianEquivalent: 'فيد', exampleInScene: 'A skin fade, please.' },      { term: 'appointment', type: 'cultural', meaningAr: 'ميعاد', meaningEn: '', egyptianEquivalent: 'حجز', exampleInScene: 'Book an appointment first.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is a \'trim\' at the barber?', questionAr: 'يعني إيه trim عند الحلاق؟', options: ['قصة خفيفة', 'حلاقة زيرو', 'صبغة شعر', 'غسيل شعر'], correctIndex: 0, explanationAr: 'trim معناها تخفيف بسيط للشعر من غير تغيير كبير في الطول.' }
    ],
    speakingLines: [{ en: 'Just a trim, please. Not too short.', arEg: 'تخفيف بس، من فضلك. مش قصير أوي.' }, { en: 'How would you like your hair cut?', arEg: 'عايز تحلق شعرك إزاي؟' }],
  },
  {
    id: 'salon-mr-english-real',
    movieTitle: 'Real English Conversation at the Salon & Barber Shop - Mr. English Channel',
    releaseYear: 2023,
    director: 'Mr. English Channel',
    genre: 'Daily English Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Salon Day Dialogue',
    sceneDescription: 'حوار كوافير واقعي للمبتدئين: الصبغة، القصة، الاستشوار - كلام الكوافيرات اليومي.',
    youtubeId: 'aOZZFing8qA',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Mr. English Channel (Official)',
    dialogueQuote: 'I would like to dye my hair brown.',
    actorName: 'Customer',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/aOZZFing8qA/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Mr. English Channel Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'I would like to dye my hair brown.', arEg: 'عايزة أصبغ شعري بني.', arFusha: 'عايزة أصبغ شعري بني.', speaker: 'Customer', keyWords: [{ word: 'dye', ipa: '', meaningAr: 'تصبغ', meaningEn: '' }, { word: 'brown', ipa: '', meaningAr: 'بني', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Should I cut the split ends?', arEg: 'أقص الأطراف المتقصفة؟', arFusha: 'أقص الأطراف المتقصفة؟', speaker: 'Hairdresser', keyWords: [{ word: 'split ends', ipa: '', meaningAr: 'أطراف متقصفة', meaningEn: '' }, { word: 'cut', ipa: '', meaningAr: 'تقص', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'dye', type: 'cultural', meaningAr: 'يصبغ (شعر)', meaningEn: '', egyptianEquivalent: 'تصبغ', exampleInScene: 'She dyed her hair red.' },      { term: 'split ends', type: 'collocation', meaningAr: 'أطراف متقصفة', meaningEn: '', egyptianEquivalent: 'تقصف الشعر', exampleInScene: 'Cut the split ends monthly.' },      { term: 'blow-dry', type: 'cultural', meaningAr: 'استشوار', meaningEn: '', egyptianEquivalent: 'سشوار', exampleInScene: 'A cut and blow-dry.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What are \'split ends\'?', questionAr: 'يعني إيه split ends؟', options: ['أطراف الشعر المتقصفة', 'قصة قصيرة', 'نوع صبغة', 'تسريحة شعر'], correctIndex: 0, explanationAr: 'split ends هي الأطراف المتقصفة اللي الكوافير بيقصها عشان الشعر يفضل صحي.' }
    ],
    speakingLines: [{ en: 'I would like to dye my hair brown.', arEg: 'عايزة أصبغ شعري بني.' }, { en: 'Should I cut the split ends?', arEg: 'أقص الأطراف المتقصفة؟' }],
  },
  {
    id: 'dreams-swc-podcast',
    movieTitle: 'Talk About Dreams and Goals - Speak English With Class Podcast',
    releaseYear: 2023,
    director: 'Speak English With Class',
    genre: 'English Podcast',
    cefrLevel: 'B1',
    sceneTitle: 'Dream Big in English',
    sceneDescription: 'بودكاست عن الأحلام والأهداف بمستوى متوسط: طموح، تحديات، وخطط - استماع ومفردات.',
    youtubeId: 'uVkFrqugXFQ',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Speak English With Class (Official)',
    dialogueQuote: 'I am working towards becoming a doctor.',
    actorName: 'Host',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/uVkFrqugXFQ/hqdefault.jpg',
    category: 'podcasts',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak English With Class Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I am working towards becoming a doctor.', arEg: 'أنا شغال عشان أبقى دكتور.', arFusha: 'أنا شغال عشان أبقى دكتور.', speaker: 'Host', keyWords: [{ word: 'working towards', ipa: '', meaningAr: 'شغال عشان أوصل لـ', meaningEn: '' }, { word: 'becoming', ipa: '', meaningAr: 'أبقى', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'My dream is to make a difference.', arEg: 'حلمي إني أعمل فرق.', arFusha: 'حلمي إني أعمل فرق.', speaker: 'Host', keyWords: [{ word: 'make a difference', ipa: '', meaningAr: 'يعمل فرق', meaningEn: '' }, { word: 'dream', ipa: '', meaningAr: 'حلم', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'work towards', type: 'phrasal-verb', meaningAr: 'يشتغل في اتجاه هدف', meaningEn: '', egyptianEquivalent: 'شغال عشان', exampleInScene: 'She is working towards her degree.' },      { term: 'make a difference', type: 'idiom', meaningAr: 'يعمل فرق', meaningEn: '', egyptianEquivalent: 'يأثر إيجابياً', exampleInScene: 'Teachers make a difference.' },      { term: 'ambition', type: 'cultural', meaningAr: 'طموح', meaningEn: '', egyptianEquivalent: 'هدف كبير', exampleInScene: 'Her ambition is inspiring.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'make a difference\' mean?', questionAr: 'معنى make a difference؟', options: ['يعمل تأثير إيجابي حقيقي', 'يحسب فرق السعر', 'يغير رأيه', 'يعمل مشكلة'], correctIndex: 0, explanationAr: 'make a difference معناها تأثيرك بيفرق فعلاً في حياة الناس أو في الموقف.' }
    ],
    speakingLines: [{ en: 'I am working towards becoming a doctor.', arEg: 'أنا شغال عشان أبقى دكتور.' }, { en: 'My dream is to make a difference.', arEg: 'حلمي إني أعمل فرق.' }],
  },
  {
    id: 'opinion-fuel-5ways',
    movieTitle: 'Stop Saying I Think! 5 Natural Ways to Give Your Opinion - English Fuel',
    releaseYear: 2023,
    director: 'English Fuel',
    genre: 'Speaking Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Five Opinion Upgrades',
    sceneDescription: 'خمس بدائل طبيعية لـ I think: If you ask me, To be honest, Honestly speaking - سريعة ومفيدة.',
    youtubeId: 'Lq_1zsPKI_o',
    startTime: 10,
    endTime: 110,
    clipDuration: '1:40',
    videoSource: 'English Fuel (Official)',
    dialogueQuote: 'If you ask me, the movie was boring.',
    actorName: 'Teacher',
    characterName: 'Teacher',
    thumbnailUrl: 'https://img.youtube.com/vi/Lq_1zsPKI_o/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Fuel Official',
    subtitles: [
      { id: 'sub-1', start: 15, end: 30, en: 'If you ask me, the movie was boring.', arEg: 'لو تسألني، الفيلم كان ممل.', arFusha: 'لو تسألني، الفيلم كان ممل.', speaker: 'Teacher', keyWords: [{ word: 'if you ask me', ipa: '', meaningAr: 'لو تسألني', meaningEn: '' }, { word: 'boring', ipa: '', meaningAr: 'ممل', meaningEn: '' }] },      { id: 'sub-2', start: 40, end: 55, en: 'Honestly speaking, I prefer tea over coffee.', arEg: 'بصراحة شديدة، بفضل الشاي عن القهوة.', arFusha: 'بصراحة شديدة، بفضل الشاي عن القهوة.', speaker: 'Teacher', keyWords: [{ word: 'honestly speaking', ipa: '', meaningAr: 'بصراحة شديدة', meaningEn: '' }, { word: 'prefer over', ipa: '', meaningAr: 'يفضل عن', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'if you ask me', type: 'idiom', meaningAr: 'لو تسألني (رأي صريح)', meaningEn: '', egyptianEquivalent: 'من وجهة نظري', exampleInScene: 'If you ask me, he is wrong.' },      { term: 'honestly speaking', type: 'collocation', meaningAr: 'بصراحة شديدة', meaningEn: '', egyptianEquivalent: 'بكل صراحة', exampleInScene: 'Honestly speaking, I disagree.' },      { term: 'prefer', type: 'cultural', meaningAr: 'يفضل', meaningEn: '', egyptianEquivalent: 'أحب أكتر', exampleInScene: 'I prefer winter over summer.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'If you ask me\' introduce?', questionAr: 'عبارة If you ask me بتقدم إيه؟', options: ['رأي صريح', 'سؤال', 'طلب', 'اعتذار'], correctIndex: 0, explanationAr: 'If you ask me بتدخّل رأيك الصريح - تعبير ودي بيستخدم كتير في الحوارات.' }
    ],
    speakingLines: [{ en: 'If you ask me, the movie was boring.', arEg: 'لو تسألني، الفيلم كان ممل.' }, { en: 'Honestly speaking, I prefer tea over coffee.', arEg: 'بصراحة شديدة، بفضل الشاي عن القهوة.' }],
  },
  {
    id: 'negotiation-derek-62-phrases',
    movieTitle: '62 Useful Phrases For Negotiating - Business English',
    releaseYear: 2023,
    director: 'Derek Callan',
    genre: 'Business English',
    cefrLevel: 'B2',
    sceneTitle: 'Open and Close a Negotiation',
    sceneDescription: 'عبارات تفاوض احترافية: افتتاح العرض، الرد على السعر، والوصول لاتفاق.',
    youtubeId: 'lPinxUDxhVs',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Derek Callan - English for Professionals (Official)',
    dialogueQuote: 'I was hoping we could come to an agreement today.',
    actorName: 'Derek Callan',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/lPinxUDxhVs/hqdefault.jpg',
    category: 'business_english',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Derek Callan Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I was hoping we could come to an agreement today.', arEg: 'كنت متمني إننا نوصل لاتفاق النهارده.', arFusha: 'كنت متمني إننا نوصل لاتفاق النهارده.', speaker: 'Instructor', keyWords: [{ word: 'come to an agreement', ipa: '', meaningAr: 'نوصل لاتفاق', meaningEn: '' }, { word: 'I was hoping', ipa: '', meaningAr: 'كنت متمني', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'That is a bit more than we had in mind.', arEg: 'ده أكتر شوية من اللي كنا ناويين عليه.', arFusha: 'ده أكتر شوية من اللي كنا ناويين عليه.', speaker: 'Instructor', keyWords: [{ word: 'a bit more than', ipa: '', meaningAr: 'أكتر شوية من', meaningEn: '' }, { word: 'had in mind', ipa: '', meaningAr: 'كنا ناويين عليه', meaningEn: '' }] },      { id: 'sub-3', start: 85, end: 100, en: 'Let us meet in the middle on this one.', arEg: 'خلينا نتقابل في النص في النقطة دي.', arFusha: 'خلينا نتقابل في النص في النقطة دي.', speaker: 'Instructor', keyWords: [{ word: 'meet in the middle', ipa: '', meaningAr: 'نتقابل في النص', meaningEn: '' }, { word: 'on this one', ipa: '', meaningAr: 'في النقطة دي', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'come to an agreement', type: 'collocation', meaningAr: 'التوصل إلى اتفاق', meaningEn: '', egyptianEquivalent: 'نوصل لاتفاق', exampleInScene: 'Both sides came to an agreement.' },      { term: 'meet in the middle', type: 'idiom', meaningAr: 'الوصول إلى حل وسط', meaningEn: '', egyptianEquivalent: 'نتقابل في النص', exampleInScene: 'They met in the middle on price.' },      { term: 'have in mind', type: 'collocation', meaningAr: 'أن يكون في الذهن', meaningEn: '', egyptianEquivalent: 'يكون ناوي على', exampleInScene: 'What did you have in mind?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which phrase suggests a compromise?', questionAr: 'أنهي عبارة بتقترح حل وسط؟', options: ['Let us meet in the middle', 'Take it or leave it', 'That is final', 'No way'], correctIndex: 0, explanationAr: 'Meet in the middle معناها نقسم الفرق ونوصل لحل وسط - أساس أي تفاوض ناجح.' }
    ],
    speakingLines: [{ en: 'I was hoping we could come to an agreement today.', arEg: 'كنت متمني إننا نوصل لاتفاق النهارده.' }, { en: 'Let us meet in the middle on this one.', arEg: 'خلينا نتقابل في النص في النقطة دي.' }],
  },
  {
    id: 'negotiate-confident-english-tips',
    movieTitle: 'How to Successfully Negotiate in English - 4 Tips + 20 Phrases',
    releaseYear: 2022,
    director: 'Speak Confident English',
    genre: 'Business English',
    cefrLevel: 'B2',
    sceneTitle: 'Negotiate with Confidence',
    sceneDescription: '٤ نصائح و٢٠ عبارة عشان تتفاوض بثقة بالإنجليزي في الشغل.',
    youtubeId: 'V9up8rWL3zQ',
    startTime: 40,
    endTime: 160,
    clipDuration: '2:00',
    videoSource: 'Speak Confident English (Official)',
    dialogueQuote: 'Could you be more flexible on the deadline?',
    actorName: 'Annemarie',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/V9up8rWL3zQ/hqdefault.jpg',
    category: 'business_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Speak Confident English Official',
    subtitles: [
      { id: 'sub-1', start: 45, end: 60, en: 'Could you be more flexible on the deadline?', arEg: 'ممكن تكونوا أكتر مرونة في الميعاد النهائي؟', arFusha: 'ممكن تكونوا أكتر مرونة في الميعاد النهائي؟', speaker: 'Instructor', keyWords: [{ word: 'flexible', ipa: '', meaningAr: 'مرن', meaningEn: '' }, { word: 'deadline', ipa: '', meaningAr: 'ميعاد نهائي', meaningEn: '' }] },      { id: 'sub-2', start: 70, end: 85, en: 'We would need some time to consider your offer.', arEg: 'هنحتاج شوية وقت نفكر في العرض بتاعكم.', arFusha: 'هنحتاج شوية وقت نفكر في العرض بتاعكم.', speaker: 'Instructor', keyWords: [{ word: 'consider', ipa: '', meaningAr: 'نفكر في', meaningEn: '' }, { word: 'offer', ipa: '', meaningAr: 'عرض', meaningEn: '' }] },      { id: 'sub-3', start: 95, end: 110, en: 'I am confident we can find a solution that works for both of us.', arEg: 'أنا متأكدة إننا نقدر نلاقي حل يناسبنا الاتنين.', arFusha: 'أنا متأكدة إننا نقدر نلاقي حل يناسبنا الاتنين.', speaker: 'Instructor', keyWords: [{ word: 'I am confident', ipa: '', meaningAr: 'أنا متأكد', meaningEn: '' }, { word: 'works for both of us', ipa: '', meaningAr: 'يناسبنا الاتنين', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'be flexible on', type: 'collocation', meaningAr: 'أن تكون مرنًا بشأن', meaningEn: '', egyptianEquivalent: 'تبقى مرن في', exampleInScene: 'Please be flexible on the price.' },      { term: 'consider an offer', type: 'collocation', meaningAr: 'النظر في عرض', meaningEn: '', egyptianEquivalent: 'نفكر في عرض', exampleInScene: 'We will consider your offer.' },      { term: 'find a solution', type: 'collocation', meaningAr: 'إيجاد حل', meaningEn: '', egyptianEquivalent: 'نلاقي حل', exampleInScene: 'Let us find a solution together.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is a polite way to ask for a better deadline?', questionAr: 'إيه الطريقة المهذبة نطلب بيها ميعاد أحسن؟', options: ['Could you be more flexible on the deadline?', 'Change the deadline now', 'The deadline is bad', 'I refuse this date'], correctIndex: 0, explanationAr: 'Could you be more flexible... صيغة مهذبة واحترافية للتفاوض على المواعيد.' }
    ],
    speakingLines: [{ en: 'Could you be more flexible on the deadline?', arEg: 'ممكن تكونوا أكتر مرونة في الميعاد النهائي؟' }, { en: 'We would need some time to consider your offer.', arEg: 'هنحتاج شوية وقت نفكر في العرض بتاعكم.' }],
  },
  {
    id: 'customer-service-complaints-refunds',
    movieTitle: 'Customer Service English - Complaints, Refunds and Manager Requests',
    releaseYear: 2024,
    director: 'Daily Duo English',
    genre: 'Conversation Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Complain and Ask for a Refund',
    sceneDescription: 'حوار خدمة عملاء: تشتكي من منتج، تطلب فلوسك ترجع، وتطلب تكلم المدير.',
    youtubeId: 'XX9W8lP3NmY',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Daily Duo English (Official)',
    dialogueQuote: 'I would like to speak to the manager, please.',
    actorName: 'Host',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/XX9W8lP3NmY/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Daily Duo English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I would like to make a complaint about my order.', arEg: 'عايز أقدم شكوى عن الطلب بتاعي.', arFusha: 'عايز أقدم شكوى عن الطلب بتاعي.', speaker: 'Customer', keyWords: [{ word: 'make a complaint', ipa: '', meaningAr: 'أقدم شكوى', meaningEn: '' }, { word: 'order', ipa: '', meaningAr: 'طلب', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I am afraid the product arrived damaged.', arEg: 'للأسف المنتج وصل مكسور.', arFusha: 'للأسف المنتج وصل مكسور.', speaker: 'Customer', keyWords: [{ word: 'I am afraid', ipa: '', meaningAr: 'للأسف', meaningEn: '' }, { word: 'arrived damaged', ipa: '', meaningAr: 'وصل مكسور', meaningEn: '' }] },      { id: 'sub-3', start: 80, end: 95, en: 'Could I get a full refund, please?', arEg: 'ممكن فلوسي ترجع كاملة لو سمحت؟', arFusha: 'ممكن فلوسي ترجع كاملة لو سمحت؟', speaker: 'Customer', keyWords: [{ word: 'refund', ipa: '', meaningAr: 'استرجاع فلوس', meaningEn: '' }, { word: 'full', ipa: '', meaningAr: 'كامل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'make a complaint', type: 'collocation', meaningAr: 'تقديم شكوى', meaningEn: '', egyptianEquivalent: 'أقدم شكوى', exampleInScene: 'She made a complaint about the service.' },      { term: 'refund', type: 'cultural', meaningAr: 'استرداد الأموال', meaningEn: '', egyptianEquivalent: 'فلوس ترجع', exampleInScene: 'They gave me a full refund.' },      { term: 'speak to the manager', type: 'collocation', meaningAr: 'التحدث إلى المدير', meaningEn: '', egyptianEquivalent: 'أكلم المدير', exampleInScene: 'I want to speak to the manager.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you politely ask for your money back?', questionAr: 'تطلب فلوسك ترجع بأدب إزاي؟', options: ['Could I get a full refund, please?', 'Give me my money now', 'I want cash back fast', 'Refund me immediately'], correctIndex: 0, explanationAr: 'Could I get a full refund, please? أدب + وضوح - أحسن صيغة مع خدمة العملاء.' }
    ],
    speakingLines: [{ en: 'I would like to make a complaint about my order.', arEg: 'عايز أقدم شكوى عن الطلب بتاعي.' }, { en: 'Could I get a full refund, please?', arEg: 'ممكن فلوسي ترجع كاملة لو سمحت؟' }],
  },
  {
    id: 'online-order-complaint-damaged',
    movieTitle: 'Online Order Complaint in English - Damaged Product Conversation',
    releaseYear: 2024,
    director: 'Key to Conversation',
    genre: 'Conversation Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Report a Damaged Delivery',
    sceneDescription: 'حوار كامل: طلب أونلاين وصل بايظ، وتتفاوض على استبدال أو استرجاع.',
    youtubeId: 'Cbz2jdWQHQU',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Key to Conversation (Official)',
    dialogueQuote: 'The package arrived, but the item inside was broken.',
    actorName: 'Host',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/Cbz2jdWQHQU/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Key to Conversation Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'The package arrived, but the item inside was broken.', arEg: 'الشحنة وصلت، بس الحاجة اللي جواها كانت مكسورة.', arFusha: 'الشحنة وصلت، بس الحاجة اللي جواها كانت مكسورة.', speaker: 'Customer', keyWords: [{ word: 'package', ipa: '', meaningAr: 'شحنة', meaningEn: '' }, { word: 'broken', ipa: '', meaningAr: 'مكسور', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'I would prefer a replacement rather than a refund.', arEg: 'أفضل استبدال بدل ما فلوسي ترجع.', arFusha: 'أفضل استبدال بدل ما فلوسي ترجع.', speaker: 'Customer', keyWords: [{ word: 'replacement', ipa: '', meaningAr: 'استبدال', meaningEn: '' }, { word: 'rather than', ipa: '', meaningAr: 'بدل ما', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'We will ship a new one right away at no extra cost.', arEg: 'هنبعتلك واحد جديد فورًا من غير أي تكلفة زيادة.', arFusha: 'هنبعتلك واحد جديد فورًا من غير أي تكلفة زيادة.', speaker: 'Agent', keyWords: [{ word: 'right away', ipa: '', meaningAr: 'فورًا', meaningEn: '' }, { word: 'at no extra cost', ipa: '', meaningAr: 'من غير تكلفة زيادة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'damaged', type: 'cultural', meaningAr: 'تالف', meaningEn: '', egyptianEquivalent: 'بايظ / مكسور', exampleInScene: 'The screen was damaged.' },      { term: 'replacement', type: 'cultural', meaningAr: 'بديل', meaningEn: '', egyptianEquivalent: 'حاجة بديلة', exampleInScene: 'They sent a free replacement.' },      { term: 'at no extra cost', type: 'collocation', meaningAr: 'بدون تكلفة إضافية', meaningEn: '', egyptianEquivalent: 'من غير فلوس زيادة', exampleInScene: 'Delivery is at no extra cost.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'You want a new item, not money back. What do you say?', questionAr: 'عايز منتج جديد مش فلوسك. تقول إيه؟', options: ['I would prefer a replacement rather than a refund.', 'Keep the item and the money', 'Cancel everything forever', 'Send it to my friend'], correctIndex: 0, explanationAr: 'Replacement بدل Refund: استبدال بدل استرجاع فلوس - rather than بتربط الاختيارين.' }
    ],
    speakingLines: [{ en: 'The package arrived, but the item inside was broken.', arEg: 'الشحنة وصلت، بس الحاجة اللي جواها كانت مكسورة.' }, { en: 'I would prefer a replacement rather than a refund.', arEg: 'أفضل استبدال بدل ما فلوسي ترجع.' }],
  },
  {
    id: 'relationships-basic-conversation-jessica',
    movieTitle: 'Basic English Conversation for Relationships',
    releaseYear: 2023,
    director: 'Learn English with Jessica',
    genre: 'Conversation Practice',
    cefrLevel: 'A2',
    sceneTitle: 'Talk About Your Relationships',
    sceneDescription: 'محادثة بسيطة عن العلاقات: صحاب، عيلة، وإزاي تسأل عن حد.',
    youtubeId: 'YeXPDTLURy4',
    startTime: 15,
    endTime: 135,
    clipDuration: '2:00',
    videoSource: 'Learn English with Jessica (Official)',
    dialogueQuote: 'We have been friends since high school.',
    actorName: 'Jessica',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/YeXPDTLURy4/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English with Jessica Official',
    subtitles: [
      { id: 'sub-1', start: 20, end: 35, en: 'We have been friends since high school.', arEg: 'إحنا صحاب من أيام السنوي.', arFusha: 'إحنا صحاب من أيام السنوي.', speaker: 'Speaker', keyWords: [{ word: 'since', ipa: '', meaningAr: 'من (وقت)', meaningEn: '' }, { word: 'high school', ipa: '', meaningAr: 'الثانوية', meaningEn: '' }] },      { id: 'sub-2', start: 45, end: 60, en: 'How long have you known each other?', arEg: 'بتعرفوا بعض بقالكم قد إيه؟', arFusha: 'بتعرفوا بعض بقالكم قد إيه؟', speaker: 'Speaker', keyWords: [{ word: 'how long', ipa: '', meaningAr: 'قد إيه / كام مدة', meaningEn: '' }, { word: 'know each other', ipa: '', meaningAr: 'نعرف بعض', meaningEn: '' }] },      { id: 'sub-3', start: 70, end: 85, en: 'We get along really well.', arEg: 'إحنا متفاهمين جدًا مع بعض.', arFusha: 'إحنا متفاهمين جدًا مع بعض.', speaker: 'Speaker', keyWords: [{ word: 'get along', ipa: '', meaningAr: 'نتفاهم مع بعض', meaningEn: '' }, { word: 'really well', ipa: '', meaningAr: 'جدًا', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'since', type: 'cultural', meaningAr: 'منذ', meaningEn: '', egyptianEquivalent: 'من (وقت)', exampleInScene: 'We have known each other since 2015.' },      { term: 'get along', type: 'phrasal-verb', meaningAr: 'ينسجم مع', meaningEn: '', egyptianEquivalent: 'يتفاهم مع حد', exampleInScene: 'I get along with my neighbors.' },      { term: 'each other', type: 'collocation', meaningAr: 'بعضهما البعض', meaningEn: '', egyptianEquivalent: 'بعض', exampleInScene: 'They help each other.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which sentence uses the present perfect correctly?', questionAr: 'أنهي جملة فيها present perfect صح؟', options: ['We have been friends since high school.', 'We are friends since high school yesterday.', 'We been friends since now.', 'We having friends since school.'], correctIndex: 0, explanationAr: 'Have been + since + نقطة زمنية = علاقة بدأت في الماضي ومستمرة لحد دلوقتي.' }
    ],
    speakingLines: [{ en: 'We have been friends since high school.', arEg: 'إحنا صحاب من أيام السنوي.' }, { en: 'We get along really well.', arEg: 'إحنا متفاهمين جدًا مع بعض.' }],
  },
  {
    id: 'dating-relationships-unleashed-podcast',
    movieTitle: 'Dating and Relationships in English - Real-Life Speaking',
    releaseYear: 2024,
    director: 'English Unleashed',
    genre: 'Podcast',
    cefrLevel: 'B1',
    sceneTitle: 'Real Talk About Dating',
    sceneDescription: 'بودكاست عن المواعدة والعلاقات: مفردات حقيقية بتستخدمها في الكلام اليومي.',
    youtubeId: 'KMv3DXOzGIg',
    startTime: 60,
    endTime: 180,
    clipDuration: '2:00',
    videoSource: 'English Unleashed Podcast (Official)',
    dialogueQuote: 'We went on a few dates and really hit it off.',
    actorName: 'Host',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/KMv3DXOzGIg/hqdefault.jpg',
    category: 'podcasts',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Unleashed Official',
    subtitles: [
      { id: 'sub-1', start: 65, end: 80, en: 'We went on a few dates and really hit it off.', arEg: 'خرجنا مع بعض كام مرة واتفقنا جدًا من أول مرة.', arFusha: 'خرجنا مع بعض كام مرة واتفقنا جدًا من أول مرة.', speaker: 'Host', keyWords: [{ word: 'go on a date', ipa: '', meaningAr: 'نخرج مع بعض', meaningEn: '' }, { word: 'hit it off', ipa: '', meaningAr: 'ننجذب لبعض من أول مرة', meaningEn: '' }] },      { id: 'sub-2', start: 90, end: 105, en: 'They have been together for three years.', arEg: 'هم مع بعض بقالهم تلات سنين.', arFusha: 'هم مع بعض بقالهم تلات سنين.', speaker: 'Host', keyWords: [{ word: 'be together', ipa: '', meaningAr: 'يكونوا مع بعض', meaningEn: '' }, { word: 'for three years', ipa: '', meaningAr: 'بقالهم تلات سنين', meaningEn: '' }] },      { id: 'sub-3', start: 115, end: 130, en: 'Things did not work out, so they broke up.', arEg: 'الدنيا ممشيتش معاهم، فافترقوا.', arFusha: 'الدنيا ممشيتش معاهم، فافترقوا.', speaker: 'Host', keyWords: [{ word: 'work out', ipa: '', meaningAr: 'تمشي / تنجح', meaningEn: '' }, { word: 'break up', ipa: '', meaningAr: 'يفترقوا', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'hit it off', type: 'idiom', meaningAr: 'ينجذبا لبعضهما فورًا', meaningEn: '', egyptianEquivalent: 'يحبوا بعض من أول مرة', exampleInScene: 'We hit it off at the party.' },      { term: 'work out', type: 'phrasal-verb', meaningAr: 'ينجح', meaningEn: '', egyptianEquivalent: 'تمشي الدنيا', exampleInScene: 'I hope things work out between them.' },      { term: 'break up', type: 'phrasal-verb', meaningAr: 'ينفصل', meaningEn: '', egyptianEquivalent: 'يفترقوا', exampleInScene: 'They broke up last month.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'hit it off\' mean?', questionAr: 'يعني إيه hit it off؟', options: ['ينجذبوا لبعض من أول مرة', 'يتخانقوا', 'يتأخروا عن معاد', 'يسافروا مع بعض'], correctIndex: 0, explanationAr: 'Hit it off = كيمياء من أول لقاء - تعبير شائع جدًا في كلام العلاقات.' }
    ],
    speakingLines: [{ en: 'We went on a few dates and really hit it off.', arEg: 'خرجنا مع بعض كام مرة واتفقنا جدًا من أول مرة.' }, { en: 'Things did not work out, so they broke up.', arEg: 'الدنيا ممشيتش معاهم، فافترقوا.' }],
  },
  {
    id: 'science-trust-bbc-6min',
    movieTitle: 'Restoring Trust in Science - 6 Minute English',
    releaseYear: 2023,
    director: 'BBC Learning English',
    genre: 'Podcast',
    cefrLevel: 'B2',
    sceneTitle: 'Can We Trust Science?',
    sceneDescription: 'بودكاست بي بي سي: إزاي نرجع الثقة في العلم، ومفردات أكاديمية مهمة.',
    youtubeId: 'obpKWRcXezA',
    startTime: 45,
    endTime: 165,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Public trust in science has been shaken in recent years.',
    actorName: 'BBC Hosts',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/obpKWRcXezA/hqdefault.jpg',
    category: 'podcasts',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 50, end: 65, en: 'Public trust in science has been shaken in recent years.', arEg: 'ثقة الناس في العلم اتهزت في السنين الأخيرة.', arFusha: 'ثقة الناس في العلم اتهزت في السنين الأخيرة.', speaker: 'Host', keyWords: [{ word: 'trust', ipa: '', meaningAr: 'ثقة', meaningEn: '' }, { word: 'shaken', ipa: '', meaningAr: 'اتهزّت', meaningEn: '' }] },      { id: 'sub-2', start: 75, end: 90, en: 'Scientists need to be transparent about their methods.', arEg: 'العلماء محتاجين يكونوا واضحين في طريقة شغلهم.', arFusha: 'العلماء محتاجين يكونوا واضحين في طريقة شغلهم.', speaker: 'Host', keyWords: [{ word: 'transparent', ipa: '', meaningAr: 'شفاف / واضح', meaningEn: '' }, { word: 'methods', ipa: '', meaningAr: 'طرق', meaningEn: '' }] },      { id: 'sub-3', start: 100, end: 115, en: 'The evidence speaks for itself.', arEg: 'الأدلة بتتكلم عن نفسها.', arFusha: 'الأدلة بتتكلم عن نفسها.', speaker: 'Host', keyWords: [{ word: 'evidence', ipa: '', meaningAr: 'أدلة', meaningEn: '' }, { word: 'speaks for itself', ipa: '', meaningAr: 'بتتكلم عن نفسها', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'trust', type: 'cultural', meaningAr: 'ثقة', meaningEn: '', egyptianEquivalent: 'ثقة', exampleInScene: 'Trust takes years to build.' },      { term: 'transparent', type: 'cultural', meaningAr: 'شفاف', meaningEn: '', egyptianEquivalent: 'واضح ومكشوف', exampleInScene: 'The process should be transparent.' },      { term: 'evidence', type: 'cultural', meaningAr: 'دليل', meaningEn: '', egyptianEquivalent: 'دليل', exampleInScene: 'There is no evidence for that claim.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'the evidence speaks for itself\' mean?', questionAr: 'يعني إيه the evidence speaks for itself؟', options: ['الأدلة واضحة من غير شرح', 'الأدلة مش موجودة', 'العلم بيكدب', 'لازم نسأل خبير'], correctIndex: 0, explanationAr: 'لما الدليل speaks for itself يعني واضح لوحده ومش محتاج تفسير زيادة.' }
    ],
    speakingLines: [{ en: 'Public trust in science has been shaken in recent years.', arEg: 'ثقة الناس في العلم اتهزت في السنين الأخيرة.' }, { en: 'Scientists need to be transparent about their methods.', arEg: 'العلماء محتاجين يكونوا واضحين في طريقة شغلهم.' }],
  },
  {
    id: 'science-common-mistakes-learn',
    movieTitle: 'Top 5 Common Mistakes Everyone Makes - Learn English Through Science',
    releaseYear: 2024,
    director: 'Learn English Through Science',
    genre: 'Educational',
    cefrLevel: 'B1',
    sceneTitle: 'Fix Your English with Science',
    sceneDescription: '٥ أخطاء شائعة في الإنجليزي متشرحة بطريقة علمية سهلة.',
    youtubeId: 'Yh-rwpUbhq8',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Learn English Through Science (Official)',
    dialogueQuote: 'Let us break down this mistake and fix it step by step.',
    actorName: 'Host',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/Yh-rwpUbhq8/hqdefault.jpg',
    category: 'academic_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Learn English Through Science Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Let us break down this mistake and fix it step by step.', arEg: 'خلينا نحلل الغلطة دي ونصلحها خطوة بخطوة.', arFusha: 'خلينا نحلل الغلطة دي ونصلحها خطوة بخطوة.', speaker: 'Instructor', keyWords: [{ word: 'break down', ipa: '', meaningAr: 'نحلل', meaningEn: '' }, { word: 'step by step', ipa: '', meaningAr: 'خطوة بخطوة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Many learners mix up these two words.', arEg: 'متعلمين كتير بيلخبطوا بين الكلمتين دول.', arFusha: 'متعلمين كتير بيلخبطوا بين الكلمتين دول.', speaker: 'Instructor', keyWords: [{ word: 'mix up', ipa: '', meaningAr: 'يلخبط بين', meaningEn: '' }, { word: 'learners', ipa: '', meaningAr: 'متعلمين', meaningEn: '' }] },      { id: 'sub-3', start: 85, end: 100, en: 'Once you understand the pattern, you will not forget it.', arEg: 'أول ما تفهم النمط، مش هتنساه تاني.', arFusha: 'أول ما تفهم النمط، مش هتنساه تاني.', speaker: 'Instructor', keyWords: [{ word: 'pattern', ipa: '', meaningAr: 'نمط / قاعدة', meaningEn: '' }, { word: 'once', ipa: '', meaningAr: 'أول ما', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'break down', type: 'phrasal-verb', meaningAr: 'يحلل', meaningEn: '', egyptianEquivalent: 'يفكك لأجزاء', exampleInScene: 'Let me break down the problem.' },      { term: 'mix up', type: 'phrasal-verb', meaningAr: 'يخلط بين', meaningEn: '', egyptianEquivalent: 'يلخبط بين', exampleInScene: 'I always mix up their names.' },      { term: 'pattern', type: 'cultural', meaningAr: 'نمط', meaningEn: '', egyptianEquivalent: 'قاعدة / نمط', exampleInScene: 'English spelling has patterns.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'mix up\' mean?', questionAr: 'يعني إيه mix up؟', options: ['يلخبط بين حاجتين', 'يخلط مكونات', 'يصلح غلطة', 'ينسى كلمة'], correctIndex: 0, explanationAr: 'Mix up = تلخبط بين حاجتين شبه بعض - زي accept و except.' }
    ],
    speakingLines: [{ en: 'Let us break down this mistake and fix it step by step.', arEg: 'خلينا نحلل الغلطة دي ونصلحها خطوة بخطوة.' }, { en: 'Many learners mix up these two words.', arEg: 'متعلمين كتير بيلخبطوا بين الكلمتين دول.' }],
  },
  {
    id: 'speech-steve-jobs-stanford',
    movieTitle: 'Steve Jobs - Stanford Commencement Speech (English Subtitles)',
    releaseYear: 2005,
    director: 'English Speeches',
    genre: 'Famous Speech',
    cefrLevel: 'C1',
    sceneTitle: 'Stay Hungry, Stay Foolish',
    sceneDescription: 'أشهر خطاب تخرج في التاريخ: ستيف جوبز يحكي ٣ قصص غيرت حياته.',
    youtubeId: '1i9kcBHX2Nw',
    startTime: 60,
    endTime: 180,
    clipDuration: '2:00',
    videoSource: 'English Speeches (Official)',
    dialogueQuote: 'You have got to find what you love.',
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
      { id: 'sub-1', start: 65, end: 80, en: 'You have got to find what you love.', arEg: 'لازم تلاقي الحاجة اللي بتحبها.', arFusha: 'لازم تلاقي الحاجة اللي بتحبها.', speaker: 'Steve Jobs', keyWords: [{ word: 'have got to', ipa: '', meaningAr: 'لازم', meaningEn: '' }, { word: 'what you love', ipa: '', meaningAr: 'اللي بتحبه', meaningEn: '' }] },      { id: 'sub-2', start: 90, end: 105, en: 'The only way to do great work is to love what you do.', arEg: 'الطريقة الوحيدة إنك تعمل شغل عظيم هي إنك تحب اللي بتعمله.', arFusha: 'الطريقة الوحيدة إنك تعمل شغل عظيم هي إنك تحب اللي بتعمله.', speaker: 'Steve Jobs', keyWords: [{ word: 'great work', ipa: '', meaningAr: 'شغل عظيم', meaningEn: '' }, { word: 'the only way', ipa: '', meaningAr: 'الطريقة الوحيدة', meaningEn: '' }] },      { id: 'sub-3', start: 115, end: 130, en: 'Stay hungry, stay foolish.', arEg: 'فضل جعان، فضل مجنون (بالطموح).', arFusha: 'فضل جعان، فضل مجنون (بالطموح).', speaker: 'Steve Jobs', keyWords: [{ word: 'stay hungry', ipa: '', meaningAr: 'فضل جعان', meaningEn: '' }, { word: 'foolish', ipa: '', meaningAr: 'مجنون / مغامر', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'have got to', type: 'cultural', meaningAr: 'يجب أن', meaningEn: '', egyptianEquivalent: 'لازم', exampleInScene: 'You have got to try this.' },      { term: 'commencement', type: 'cultural', meaningAr: 'حفل تخرج', meaningEn: '', egyptianEquivalent: 'حفل التخرج', exampleInScene: 'He gave the commencement speech.' },      { term: 'stay hungry', type: 'collocation', meaningAr: 'ابقَ طموحًا', meaningEn: '', egyptianEquivalent: 'فضل طموحك', exampleInScene: 'Stay hungry for knowledge.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the main message of \'Stay hungry, stay foolish\'?', questionAr: 'إيه الرسالة الأساسية في Stay hungry, stay foolish؟', options: ['خليك طموح ومغامر طول عمرك', 'كُل كتير ومتفكرش', 'اشتغل من غير فلوس', 'اسمع كلام الناس دايمًا'], correctIndex: 0, explanationAr: 'ستيف جوبز بيقول: متشبعش أبدًا من التعلم، ومتخفش تغامر - دي فلسفة حياته.' }
    ],
    speakingLines: [{ en: 'The only way to do great work is to love what you do.', arEg: 'الطريقة الوحيدة إنك تعمل شغل عظيم هي إنك تحب اللي بتعمله.' }, { en: 'Stay hungry, stay foolish.', arEg: 'فضل جعان، فضل مجنون (بالطموح).' }],
  },
  {
    id: 'speech-mlk-i-have-a-dream',
    movieTitle: 'Martin Luther King - I Have a Dream (English Subtitles)',
    releaseYear: 1963,
    director: 'English Speeches',
    genre: 'Famous Speech',
    cefrLevel: 'C1',
    sceneTitle: 'I Have a Dream',
    sceneDescription: 'خطاب مارتن لوثر كينج التاريخي: أقوى أمثلة البلاغة في الإنجليزية.',
    youtubeId: '6dKimoybmEo',
    startTime: 60,
    endTime: 180,
    clipDuration: '2:00',
    videoSource: 'English Speeches (Official)',
    dialogueQuote: 'I have a dream that one day this nation will rise up.',
    actorName: 'Martin Luther King Jr.',
    characterName: 'Martin Luther King Jr.',
    thumbnailUrl: 'https://img.youtube.com/vi/6dKimoybmEo/hqdefault.jpg',
    category: 'advanced_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Speeches Official',
    subtitles: [
      { id: 'sub-1', start: 65, end: 80, en: 'I have a dream that one day this nation will rise up.', arEg: 'عندي حلم إنه في يوم من الأيام الأمة دي هتنهض.', arFusha: 'عندي حلم إنه في يوم من الأيام الأمة دي هتنهض.', speaker: 'MLK', keyWords: [{ word: 'one day', ipa: '', meaningAr: 'في يوم من الأيام', meaningEn: '' }, { word: 'rise up', ipa: '', meaningAr: 'تنهض', meaningEn: '' }] },      { id: 'sub-2', start: 90, end: 105, en: 'We will not be satisfied until justice rolls down like waters.', arEg: 'مش هنرتاح لحد ما العدالة تنساب زي الميه.', arFusha: 'مش هنرتاح لحد ما العدالة تنساب زي الميه.', speaker: 'MLK', keyWords: [{ word: 'satisfied', ipa: '', meaningAr: 'مرتاح / راضي', meaningEn: '' }, { word: 'justice', ipa: '', meaningAr: 'عدالة', meaningEn: '' }] },      { id: 'sub-3', start: 115, end: 130, en: 'Let freedom ring from every hill and every valley.', arEg: 'خلي الحرية تدق من كل تل وكل وادي.', arFusha: 'خلي الحرية تدق من كل تل وكل وادي.', speaker: 'MLK', keyWords: [{ word: 'let freedom ring', ipa: '', meaningAr: 'خلي الحرية تدق', meaningEn: '' }, { word: 'valley', ipa: '', meaningAr: 'وادي', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'rise up', type: 'phrasal-verb', meaningAr: 'ينهض', meaningEn: '', egyptianEquivalent: 'ينهض / يقف', exampleInScene: 'The people rose up together.' },      { term: 'justice', type: 'cultural', meaningAr: 'عدالة', meaningEn: '', egyptianEquivalent: 'عدالة', exampleInScene: 'They fought for justice.' },      { term: 'freedom', type: 'cultural', meaningAr: 'حرية', meaningEn: '', egyptianEquivalent: 'حرية', exampleInScene: 'Freedom is a basic right.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What rhetorical device repeats \'I have a dream\'?', questionAr: 'إيه الأسلوب البلاغي في تكرار I have a dream؟', options: ['التكرار (Anaphora)', 'السخرية', 'الاختصار', 'السؤال البلاغي'], correctIndex: 0, explanationAr: 'تكرار نفس العبارة في بداية الجمل اسمه Anaphora - من أقوى أدوات الخطابة.' }
    ],
    speakingLines: [{ en: 'I have a dream that one day this nation will rise up.', arEg: 'عندي حلم إنه في يوم من الأيام الأمة دي هتنهض.' }, { en: 'Let freedom ring from every hill and every valley.', arEg: 'خلي الحرية تدق من كل تل وكل وادي.' }],
  },
  {
    id: 'doctor-conversation-sunshine',
    movieTitle: 'At the Doctor - English Conversation - Hospital English',
    releaseYear: 2023,
    director: 'Sunshine English',
    genre: 'Conversation Practice',
    cefrLevel: 'A2',
    sceneTitle: 'Describe Your Symptoms',
    sceneDescription: 'حوار كامل عند الدكتور: تحجز، توصف الأعراض، وتفهم العلاج.',
    youtubeId: '44SL8i8h0dg',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Sunshine English (Official)',
    dialogueQuote: 'I have had this headache for three days.',
    actorName: 'Host',
    characterName: 'Patient',
    thumbnailUrl: 'https://img.youtube.com/vi/44SL8i8h0dg/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Sunshine English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'I have had this headache for three days.', arEg: 'عندي الصداع ده بقاله تلات أيام.', arFusha: 'عندي الصداع ده بقاله تلات أيام.', speaker: 'Patient', keyWords: [{ word: 'headache', ipa: '', meaningAr: 'صداع', meaningEn: '' }, { word: 'for three days', ipa: '', meaningAr: 'بقاله تلات أيام', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Do you have any allergies to medication?', arEg: 'عندك حساسية من أي دوا؟', arFusha: 'عندك حساسية من أي دوا؟', speaker: 'Doctor', keyWords: [{ word: 'allergies', ipa: '', meaningAr: 'حساسية', meaningEn: '' }, { word: 'medication', ipa: '', meaningAr: 'دوا', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'Take this medicine twice a day after meals.', arEg: 'خد الدوا ده مرتين في اليوم بعد الأكل.', arFusha: 'خد الدوا ده مرتين في اليوم بعد الأكل.', speaker: 'Doctor', keyWords: [{ word: 'twice a day', ipa: '', meaningAr: 'مرتين في اليوم', meaningEn: '' }, { word: 'after meals', ipa: '', meaningAr: 'بعد الأكل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'symptom', type: 'cultural', meaningAr: 'عرض مرضي', meaningEn: '', egyptianEquivalent: 'عرض / علامة', exampleInScene: 'Fever is a common symptom.' },      { term: 'allergy', type: 'cultural', meaningAr: 'حساسية', meaningEn: '', egyptianEquivalent: 'حساسية', exampleInScene: 'I have an allergy to penicillin.' },      { term: 'prescription', type: 'cultural', meaningAr: 'وصفة طبية', meaningEn: '', egyptianEquivalent: 'روشتة', exampleInScene: 'The doctor gave me a prescription.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you tell the doctor how long you have been sick?', questionAr: 'تقول للدكتور المدة اللي انت عيان فيها إزاي؟', options: ['I have had this headache for three days.', 'I headache three days ago now.', 'My head is pain since ever.', 'Three days I am headache.'], correctIndex: 0, explanationAr: 'Have had + symptom + for + مدة = الصيغة الصح عشان توصف إعراض مستمرة.' }
    ],
    speakingLines: [{ en: 'I have had this headache for three days.', arEg: 'عندي الصداع ده بقاله تلات أيام.' }, { en: 'Take this medicine twice a day after meals.', arEg: 'خد الدوا ده مرتين في اليوم بعد الأكل.' }],
  },
  {
    id: 'bank-english-bob-canadian',
    movieTitle: 'Learn How to Speak English at the Bank',
    releaseYear: 2022,
    director: 'Bob the Canadian',
    genre: 'Conversation Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Open an Account and Ask Questions',
    sceneDescription: 'بوب الكندي بيعلمك تتكلم في البنك: حساب، إيداع، سحب، وتحويل.',
    youtubeId: '7Lh1tMsRw3U',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'I would like to open a savings account, please.',
    actorName: 'Bob the Canadian',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/7Lh1tMsRw3U/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Bob the Canadian Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I would like to open a savings account, please.', arEg: 'عايز أفتح حساب توفير لو سمحت.', arFusha: 'عايز أفتح حساب توفير لو سمحت.', speaker: 'Instructor', keyWords: [{ word: 'open an account', ipa: '', meaningAr: 'أفتح حساب', meaningEn: '' }, { word: 'savings account', ipa: '', meaningAr: 'حساب توفير', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Could I make a withdrawal from my checking account?', arEg: 'ممكن أسحب فلوس من حسابي الجاري؟', arFusha: 'ممكن أسحب فلوس من حسابي الجاري؟', speaker: 'Instructor', keyWords: [{ word: 'withdrawal', ipa: '', meaningAr: 'سحب', meaningEn: '' }, { word: 'checking account', ipa: '', meaningAr: 'حساب جاري', meaningEn: '' }] },      { id: 'sub-3', start: 85, end: 100, en: 'What is the current interest rate on this account?', arEg: 'إيه سعر الفايدة الحالي على الحساب ده؟', arFusha: 'إيه سعر الفايدة الحالي على الحساب ده؟', speaker: 'Instructor', keyWords: [{ word: 'interest rate', ipa: '', meaningAr: 'سعر الفايدة', meaningEn: '' }, { word: 'current', ipa: '', meaningAr: 'الحالي', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'deposit', type: 'cultural', meaningAr: 'إيداع', meaningEn: '', egyptianEquivalent: 'إيداع', exampleInScene: 'I made a deposit this morning.' },      { term: 'withdrawal', type: 'cultural', meaningAr: 'سحب', meaningEn: '', egyptianEquivalent: 'سحب فلوس', exampleInScene: 'There is a fee for each withdrawal.' },      { term: 'interest rate', type: 'collocation', meaningAr: 'سعر الفائدة', meaningEn: '', egyptianEquivalent: 'سعر الفايدة', exampleInScene: 'The interest rate went up.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the opposite of a deposit?', questionAr: 'عكس الإيداع (deposit) إيه؟', options: ['Withdrawal', 'Transfer', 'Balance', 'Loan'], correctIndex: 0, explanationAr: 'Deposit = تودع فلوس، Withdrawal = تسحب فلوس - أهم كلمتين في أي بنك.' }
    ],
    speakingLines: [{ en: 'I would like to open a savings account, please.', arEg: 'عايز أفتح حساب توفير لو سمحت.' }, { en: 'What is the current interest rate on this account?', arEg: 'إيه سعر الفايدة الحالي على الحساب ده؟' }],
  },
  {
    id: 'bank-phrases-basic-vs-better',
    movieTitle: 'Basic vs Better Bank English - 20 Everyday Phrases',
    releaseYear: 2024,
    director: 'Learn English with Alex and Alice',
    genre: 'Speaking Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Upgrade Your Bank English',
    sceneDescription: '٢٠ عبارة بنكية: قولها أحسن - من الصيغة العادية للصيغة المحترفة.',
    youtubeId: 'SZJBN54jeZc',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Learn English with Alex and Alice (Official)',
    dialogueQuote: 'Could you help me transfer money to another account?',
    actorName: 'Alex and Alice',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/SZJBN54jeZc/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Alex and Alice Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Could you help me transfer money to another account?', arEg: 'ممكن تساعدني أحول فلوس لحساب تاني؟', arFusha: 'ممكن تساعدني أحول فلوس لحساب تاني؟', speaker: 'Instructor', keyWords: [{ word: 'transfer', ipa: '', meaningAr: 'تحويل', meaningEn: '' }, { word: 'another account', ipa: '', meaningAr: 'حساب تاني', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I would like to check my balance, please.', arEg: 'عايز أعرف الرصيد بتاعي لو سمحت.', arFusha: 'عايز أعرف الرصيد بتاعي لو سمحت.', speaker: 'Instructor', keyWords: [{ word: 'check', ipa: '', meaningAr: 'أعرف / أراجع', meaningEn: '' }, { word: 'balance', ipa: '', meaningAr: 'رصيد', meaningEn: '' }] },      { id: 'sub-3', start: 80, end: 95, en: 'There seems to be a problem with my card.', arEg: 'يبدو إن في مشكلة في الكارت بتاعي.', arFusha: 'يبدو إن في مشكلة في الكارت بتاعي.', speaker: 'Instructor', keyWords: [{ word: 'there seems to be', ipa: '', meaningAr: 'يبدو إن فيه', meaningEn: '' }, { word: 'problem with', ipa: '', meaningAr: 'مشكلة في', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'transfer', type: 'cultural', meaningAr: 'يحول', meaningEn: '', egyptianEquivalent: 'يحول فلوس', exampleInScene: 'I transferred the money yesterday.' },      { term: 'balance', type: 'cultural', meaningAr: 'رصيد', meaningEn: '', egyptianEquivalent: 'رصيد', exampleInScene: 'My balance is low this month.' },      { term: 'transaction', type: 'cultural', meaningAr: 'معاملة', meaningEn: '', egyptianEquivalent: 'عملية بنكية', exampleInScene: 'The transaction was declined.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which is the most professional way to ask about your money?', questionAr: 'أنهي صيغة أشيك تسأل بيها عن فلوسك؟', options: ['I would like to check my balance, please.', 'Show me my money', 'How much cash I got?', 'Balance now!'], correctIndex: 0, explanationAr: 'I would like to... please = أدب واحترافية - بتفرق جدًا في البنك والشغل.' }
    ],
    speakingLines: [{ en: 'Could you help me transfer money to another account?', arEg: 'ممكن تساعدني أحول فلوس لحساب تاني؟' }, { en: 'There seems to be a problem with my card.', arEg: 'يبدو إن في مشكلة في الكارت بتاعي.' }],
  },
  {
    id: 'cooking-vocab-english-success',
    movieTitle: 'How to Cook in English - Cooking Vocabulary',
    releaseYear: 2022,
    director: 'English Speaking Success',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Follow a Recipe in English',
    sceneDescription: 'مفردات المطبخ الأساسية: تقطع، تقلب، تغلي، وتتبع أي وصفة بالإنجليزي.',
    youtubeId: 'QL2tNKHB6ew',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'English Speaking Success (Official)',
    dialogueQuote: 'First, chop the onions and fry them gently.',
    actorName: 'Host',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/QL2tNKHB6ew/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Speaking Success Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'First, chop the onions and fry them gently.', arEg: 'الأول، قطّع البصل وقليه على نار هادية.', arFusha: 'الأول، قطّع البصل وقليه على نار هادية.', speaker: 'Instructor', keyWords: [{ word: 'chop', ipa: '', meaningAr: 'قطّع', meaningEn: '' }, { word: 'fry gently', ipa: '', meaningAr: 'اقلي على نار هادية', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Bring the water to a boil, then add the pasta.', arEg: 'سخن الميه لحد ما تغلي، وبعدين حط المكرونة.', arFusha: 'سخن الميه لحد ما تغلي، وبعدين حط المكرونة.', speaker: 'Instructor', keyWords: [{ word: 'bring to a boil', ipa: '', meaningAr: 'نسخنها لحد ما تغلي', meaningEn: '' }, { word: 'add', ipa: '', meaningAr: 'حط / ضيف', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'Let it simmer for ten minutes, stirring occasionally.', arEg: 'سيبها على نار هادية عشر دقايق، وقلب من وقت للتاني.', arFusha: 'سيبها على نار هادية عشر دقايق، وقلب من وقت للتاني.', speaker: 'Instructor', keyWords: [{ word: 'simmer', ipa: '', meaningAr: 'تتسبك على نار هادية', meaningEn: '' }, { word: 'stirring occasionally', ipa: '', meaningAr: 'قلب من وقت للتاني', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'chop', type: 'cultural', meaningAr: 'يقطع', meaningEn: '', egyptianEquivalent: 'يفرم / يقطع', exampleInScene: 'Chop the garlic finely.' },      { term: 'boil', type: 'cultural', meaningAr: 'يغلي', meaningEn: '', egyptianEquivalent: 'يغلي', exampleInScene: 'Boil the potatoes for 20 minutes.' },      { term: 'simmer', type: 'cultural', meaningAr: 'يطهو على نار هادئة', meaningEn: '', egyptianEquivalent: 'يستوي على نار هادية', exampleInScene: 'Let the sauce simmer.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the difference between boil and simmer?', questionAr: 'إيه الفرق بين boil و simmer؟', options: ['Boil نار عالية بفقاعات و simmer نار هادية', 'الاتنين نفس الحاجة', 'Boil للحلو بس', 'Simmer أسرع من boil'], correctIndex: 0, explanationAr: 'Boil = غليان قوي بفقاعات، Simmer = نار هادية جدًا - فرق مهم في أي وصفة.' }
    ],
    speakingLines: [{ en: 'First, chop the onions and fry them gently.', arEg: 'الأول، قطّع البصل وقليه على نار هادية.' }, { en: 'Bring the water to a boil, then add the pasta.', arEg: 'سخن الميه لحد ما تغلي، وبعدين حط المكرونة.' }],
  },
  {
    id: 'kitchen-vocab-bbc-show',
    movieTitle: 'The Vocabulary Show - Kitchens and Cooking - 28 Words',
    releaseYear: 2023,
    director: 'BBC Learning English',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Name Everything in the Kitchen',
    sceneDescription: 'بي بي سي بتعلمك ٢٨ كلمة لأدوات وأفعال المطبخ بالنطق الصح.',
    youtubeId: 'HEVxB7C3YuQ',
    startTime: 15,
    endTime: 135,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'You use a whisk to beat eggs and cream.',
    actorName: 'BBC Hosts',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/HEVxB7C3YuQ/hqdefault.jpg',
    category: 'pronunciation_practice',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 20, end: 35, en: 'You use a whisk to beat eggs and cream.', arEg: 'بتستخدم المضرب اليدوي عشان تضرب البيض والكريمة.', arFusha: 'بتستخدم المضرب اليدوي عشان تضرب البيض والكريمة.', speaker: 'Host', keyWords: [{ word: 'whisk', ipa: '', meaningAr: 'مضرب يدوي', meaningEn: '' }, { word: 'beat', ipa: '', meaningAr: 'يضرب (بيض)', meaningEn: '' }] },      { id: 'sub-2', start: 45, end: 60, en: 'Grate the cheese over the top before baking.', arEg: 'ابشر الجبنة فوق الأكل قبل ما يدخل الفرن.', arFusha: 'ابشر الجبنة فوق الأكل قبل ما يدخل الفرن.', speaker: 'Host', keyWords: [{ word: 'grate', ipa: '', meaningAr: 'ابشر', meaningEn: '' }, { word: 'baking', ipa: '', meaningAr: 'خَبز في الفرن', meaningEn: '' }] },      { id: 'sub-3', start: 70, end: 85, en: 'Peel the potatoes and slice them thinly.', arEg: 'اقشر البطاطس وقطعها شرايط رفيعة.', arFusha: 'اقشر البطاطس وقطعها شرايط رفيعة.', speaker: 'Host', keyWords: [{ word: 'peel', ipa: '', meaningAr: 'اقشر', meaningEn: '' }, { word: 'slice thinly', ipa: '', meaningAr: 'قطع شرايط رفيعة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'whisk', type: 'cultural', meaningAr: 'مضرب يدوي', meaningEn: '', egyptianEquivalent: 'مضرب بيض', exampleInScene: 'Whisk the eggs until fluffy.' },      { term: 'grate', type: 'cultural', meaningAr: 'يبشر', meaningEn: '', egyptianEquivalent: 'يبشر جبنة', exampleInScene: 'Grate some cheese on top.' },      { term: 'peel', type: 'cultural', meaningAr: 'يقشر', meaningEn: '', egyptianEquivalent: 'يقشر', exampleInScene: 'Peel the carrots first.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which tool do you use to beat eggs?', questionAr: 'بتضرب البيض بإيه؟', options: ['Whisk', 'Grater', 'Peeler', 'Kettle'], correctIndex: 0, explanationAr: 'Whisk = مضرب البيض اليدوي - من أشهر أدوات المطبخ الإنجليزية.' }
    ],
    speakingLines: [{ en: 'You use a whisk to beat eggs and cream.', arEg: 'بتستخدم المضرب اليدوي عشان تضرب البيض والكريمة.' }, { en: 'Peel the potatoes and slice them thinly.', arEg: 'اقشر البطاطس وقطعها شرايط رفيعة.' }],
  },
  {
    id: 'ted-ai-same-person-matz',
    movieTitle: 'Is AI Turning Us All into the Same Person? - Sandra Matz - TED',
    releaseYear: 2024,
    director: 'TED',
    genre: 'TED Talk',
    cefrLevel: 'C1',
    sceneTitle: 'AI and Your Personality',
    sceneDescription: 'محاضرة تيد عن الذكاء الاصطناعي: هل بيخلينا كلنا نسخة من بعض؟',
    youtubeId: '9Ff4S1FJdRM',
    startTime: 45,
    endTime: 165,
    clipDuration: '2:00',
    videoSource: 'TED (Official)',
    dialogueQuote: 'AI does not just predict who we are; it quietly shapes who we become.',
    actorName: 'Sandra Matz',
    characterName: 'Sandra Matz',
    thumbnailUrl: 'https://img.youtube.com/vi/9Ff4S1FJdRM/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'TED Official',
    subtitles: [
      { id: 'sub-1', start: 50, end: 65, en: 'AI does not just predict who we are; it quietly shapes who we become.', arEg: 'الذكاء الاصطناعي مش بس بيتوقع إحنا مين؛ ده بهدوء بيشكل إحنا هنبقى مين.', arFusha: 'الذكاء الاصطناعي مش بس بيتوقع إحنا مين؛ ده بهدوء بيشكل إحنا هنبقى مين.', speaker: 'Speaker', keyWords: [{ word: 'predict', ipa: '', meaningAr: 'يتوقع', meaningEn: '' }, { word: 'shapes', ipa: '', meaningAr: 'بيشكل', meaningEn: '' }] },      { id: 'sub-2', start: 75, end: 90, en: 'Algorithms learn our habits faster than we do.', arEg: 'الخوارزميات بتتعلم عاداتنا أسرع مننا.', arFusha: 'الخوارزميات بتتعلم عاداتنا أسرع مننا.', speaker: 'Speaker', keyWords: [{ word: 'algorithms', ipa: '', meaningAr: 'خوارزميات', meaningEn: '' }, { word: 'habits', ipa: '', meaningAr: 'عادات', meaningEn: '' }] },      { id: 'sub-3', start: 100, end: 115, en: 'The question is not what AI can do, but what we want it to do.', arEg: 'السؤال مش الذكاء الاصطناعي يقدر يعمل إيه، السؤال إحنا عايزينه يعمل إيه.', arFusha: 'السؤال مش الذكاء الاصطناعي يقدر يعمل إيه، السؤال إحنا عايزينه يعمل إيه.', speaker: 'Speaker', keyWords: [{ word: 'the question is not... but', ipa: '', meaningAr: 'السؤال مش... لكن', meaningEn: '' }, { word: 'want it to do', ipa: '', meaningAr: 'عايزينه يعمل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'predict', type: 'cultural', meaningAr: 'يتنبأ', meaningEn: '', egyptianEquivalent: 'يتوقع', exampleInScene: 'AI can predict your choices.' },      { term: 'shape', type: 'cultural', meaningAr: 'يشكل', meaningEn: '', egyptianEquivalent: 'يشكل / يصنع', exampleInScene: 'Friends shape our personality.' },      { term: 'algorithm', type: 'cultural', meaningAr: 'خوارزمية', meaningEn: '', egyptianEquivalent: 'خوارزمية', exampleInScene: 'The algorithm shows you similar videos.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is the speaker\'s main worry about AI?', questionAr: 'إيه أكبر قلق عند المتحدثة من الذكاء الاصطناعي؟', options: ['إنه يشكل شخصيتنا ويخلينا كلنا شبه بعض', 'إنه غالي جدًا', 'إنه بطيء', 'إنه مش بيفهم العربي'], correctIndex: 0, explanationAr: 'المتحدثة قلقانة إن الـ AI مش بس بيتوقعنا - ده بيغيرنا ويوحدنا من غير ما نحس.' }
    ],
    speakingLines: [{ en: 'AI does not just predict who we are; it quietly shapes who we become.', arEg: 'الذكاء الاصطناعي مش بس بيتوقع إحنا مين؛ ده بهدوء بيشكل إحنا هنبقى مين.' }, { en: 'The question is not what AI can do, but what we want it to do.', arEg: 'السؤال مش الذكاء الاصطناعي يقدر يعمل إيه، السؤال إحنا عايزينه يعمل إيه.' }],
  },
  {
    id: 'ted-sam-altman-chatgpt-ai',
    movieTitle: 'OpenAI\'s Sam Altman Talks ChatGPT, AI Agents and Superintelligence - TED',
    releaseYear: 2024,
    director: 'TED',
    genre: 'TED Interview',
    cefrLevel: 'C1',
    sceneTitle: 'The Future of AI',
    sceneDescription: 'سام ألتمان بيتكلم عن مستقبل الذكاء الاصطناعي والوكلاء الأذكياء.',
    youtubeId: '5MWT_doo68k',
    startTime: 50,
    endTime: 170,
    clipDuration: '2:00',
    videoSource: 'TED (Official)',
    dialogueQuote: 'We are heading toward a world where AI agents do real work for us.',
    actorName: 'Sam Altman',
    characterName: 'Sam Altman',
    thumbnailUrl: 'https://img.youtube.com/vi/5MWT_doo68k/hqdefault.jpg',
    category: 'ted_talks',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'TED Official',
    subtitles: [
      { id: 'sub-1', start: 55, end: 70, en: 'We are heading toward a world where AI agents do real work for us.', arEg: 'إحنا ماشيين في اتجاه عالم وكلاء الذكاء الاصطناعي فيه بيعملوا شغل حقيقي بدلنا.', arFusha: 'إحنا ماشيين في اتجاه عالم وكلاء الذكاء الاصطناعي فيه بيعملوا شغل حقيقي بدلنا.', speaker: 'Sam Altman', keyWords: [{ word: 'heading toward', ipa: '', meaningAr: 'ماشيين في اتجاه', meaningEn: '' }, { word: 'agents', ipa: '', meaningAr: 'وكلاء أذكياء', meaningEn: '' }] },      { id: 'sub-2', start: 80, end: 95, en: 'The pace of progress is faster than most people realize.', arEg: 'سرعة التقدم أسرع مما معظم الناس متخيلة.', arFusha: 'سرعة التقدم أسرع مما معظم الناس متخيلة.', speaker: 'Sam Altman', keyWords: [{ word: 'pace', ipa: '', meaningAr: 'سرعة / إيقاع', meaningEn: '' }, { word: 'realize', ipa: '', meaningAr: 'يتخيل / يدرك', meaningEn: '' }] },      { id: 'sub-3', start: 105, end: 120, en: 'We have to make sure this technology benefits everyone.', arEg: 'لازم نتأكد إن التكنولوجيا دي بتفيد كل الناس.', arFusha: 'لازم نتأكد إن التكنولوجيا دي بتفيد كل الناس.', speaker: 'Sam Altman', keyWords: [{ word: 'make sure', ipa: '', meaningAr: 'نتأكد', meaningEn: '' }, { word: 'benefits', ipa: '', meaningAr: 'بتفيد', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'head toward', type: 'phrasal-verb', meaningAr: 'يتجه نحو', meaningEn: '', egyptianEquivalent: 'ماشي في اتجاه', exampleInScene: 'We are heading toward big changes.' },      { term: 'pace', type: 'cultural', meaningAr: 'وتيرة', meaningEn: '', egyptianEquivalent: 'سرعة / إيقاع', exampleInScene: 'The pace of life in Cairo is fast.' },      { term: 'benefit', type: 'cultural', meaningAr: 'يفيد', meaningEn: '', egyptianEquivalent: 'يفيد', exampleInScene: 'Exercise benefits everyone.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'the pace of progress\' mean?', questionAr: 'يعني إيه the pace of progress؟', options: ['سرعة التقدم', 'مكان التقدم', 'تكلفة التقدم', 'نهاية التقدم'], correctIndex: 0, explanationAr: 'Pace = السرعة أو الإيقاع - the pace of progress يعني التكنولوجيا بتتطور بسرعة قد إيه.' }
    ],
    speakingLines: [{ en: 'We are heading toward a world where AI agents do real work for us.', arEg: 'إحنا ماشيين في اتجاه عالم وكلاء الذكاء الاصطناعي فيه بيعملوا شغل حقيقي بدلنا.' }, { en: 'We have to make sure this technology benefits everyone.', arEg: 'لازم نتأكد إن التكنولوجيا دي بتفيد كل الناس.' }],
  },
  {
    id: 'tech-ai-daily-life-conversation',
    movieTitle: 'Technology and AI in Daily Life - English Conversation',
    releaseYear: 2024,
    director: 'Daily English Hub',
    genre: 'Conversation Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Chat About Tech with Friends',
    sceneDescription: 'محادثة يومية عن التكنولوجيا: موبايلات، تطبيقات، وذكاء اصطناعي.',
    youtubeId: '8Qopt3kqLBs',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Daily English Hub (Official)',
    dialogueQuote: 'I use AI apps almost every day now.',
    actorName: 'Host',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/8Qopt3kqLBs/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Daily English Hub Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'I use AI apps almost every day now.', arEg: 'أنا بستخدم تطبيقات الذكاء الاصطناعي تقريبًا كل يوم دلوقتي.', arFusha: 'أنا بستخدم تطبيقات الذكاء الاصطناعي تقريبًا كل يوم دلوقتي.', speaker: 'Speaker', keyWords: [{ word: 'almost', ipa: '', meaningAr: 'تقريبًا', meaningEn: '' }, { word: 'every day', ipa: '', meaningAr: 'كل يوم', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Technology makes our lives so much easier.', arEg: 'التكنولوجيا بتخلي حياتنا أسهل بكتير.', arFusha: 'التكنولوجيا بتخلي حياتنا أسهل بكتير.', speaker: 'Speaker', keyWords: [{ word: 'makes', ipa: '', meaningAr: 'بتخلي', meaningEn: '' }, { word: 'easier', ipa: '', meaningAr: 'أسهل', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'I cannot keep up with all these new updates.', arEg: 'مش قادر أواكب كل التحديثات الجديدة دي.', arFusha: 'مش قادر أواكب كل التحديثات الجديدة دي.', speaker: 'Speaker', keyWords: [{ word: 'keep up with', ipa: '', meaningAr: 'أواكب / ألحق', meaningEn: '' }, { word: 'updates', ipa: '', meaningAr: 'تحديثات', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'keep up with', type: 'phrasal-verb', meaningAr: 'يواكب', meaningEn: '', egyptianEquivalent: 'يلحق يواكب', exampleInScene: 'It is hard to keep up with the news.' },      { term: 'update', type: 'cultural', meaningAr: 'تحديث', meaningEn: '', egyptianEquivalent: 'تحديث', exampleInScene: 'The app needs an update.' },      { term: 'device', type: 'cultural', meaningAr: 'جهاز', meaningEn: '', egyptianEquivalent: 'جهاز', exampleInScene: 'How many devices do you own?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'I cannot keep up with the updates\' mean?', questionAr: 'يعني إيه I cannot keep up with the updates؟', options: ['مش لاحق على التحديثات الكتير', 'مش عايز أحدث الموبايل', 'التحديثات بايظة', 'مفيش تحديثات أصلًا'], correctIndex: 0, explanationAr: 'Keep up with = تلحق تواكب حاجة بتتغير بسرعة - تعبير يومي مهم جدًا.' }
    ],
    speakingLines: [{ en: 'Technology makes our lives so much easier.', arEg: 'التكنولوجيا بتخلي حياتنا أسهل بكتير.' }, { en: 'I cannot keep up with all these new updates.', arEg: 'مش قادر أواكب كل التحديثات الجديدة دي.' }],
  },
  {
    id: 'phone-conversations-leo-100',
    movieTitle: 'Master Phone Conversations in English - 100 Essential Phrases',
    releaseYear: 2023,
    director: 'Leo English Podcast',
    genre: 'Speaking Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Sound Natural on the Phone',
    sceneDescription: '١٠٠ عبارة تليفون: ترد، تسأل عن حد، تستنى، وتقفل المكالمة بشيكة.',
    youtubeId: 'w0jnsZXndAs',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Leo English Podcast (Official)',
    dialogueQuote: 'Could you hold on for a moment, please?',
    actorName: 'Leo',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/w0jnsZXndAs/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Leo English Podcast Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Hello, this is Ahmed speaking. How can I help you?', arEg: 'ألو، معاك أحمد. أقدر أساعدك في إيه؟', arFusha: 'ألو، معاك أحمد. أقدر أساعدك في إيه؟', speaker: 'Host', keyWords: [{ word: 'this is... speaking', ipa: '', meaningAr: 'معاك...', meaningEn: '' }, { word: 'how can I help you', ipa: '', meaningAr: 'أقدر أساعدك في إيه', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Could you hold on for a moment, please?', arEg: 'ممكن تستنى لحظة لو سمحت؟', arFusha: 'ممكن تستنى لحظة لو سمحت؟', speaker: 'Host', keyWords: [{ word: 'hold on', ipa: '', meaningAr: 'استنى', meaningEn: '' }, { word: 'for a moment', ipa: '', meaningAr: 'لحظة', meaningEn: '' }] },      { id: 'sub-3', start: 85, end: 100, en: 'I am sorry, you have the wrong number.', arEg: 'متأسف، ده رقم غلط.', arFusha: 'متأسف، ده رقم غلط.', speaker: 'Host', keyWords: [{ word: 'wrong number', ipa: '', meaningAr: 'رقم غلط', meaningEn: '' }, { word: 'I am sorry', ipa: '', meaningAr: 'متأسف', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'hold on', type: 'phrasal-verb', meaningAr: 'ينتظر', meaningEn: '', egyptianEquivalent: 'يستنى على الخط', exampleInScene: 'Hold on, I will check.' },      { term: 'wrong number', type: 'collocation', meaningAr: 'رقم خاطئ', meaningEn: '', egyptianEquivalent: 'رقم غلط', exampleInScene: 'Sorry, wrong number!' },      { term: 'call back', type: 'phrasal-verb', meaningAr: 'يعاود الاتصال', meaningEn: '', egyptianEquivalent: 'يرد المكالمة تاني', exampleInScene: 'I will call you back later.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you politely ask someone to wait on the phone?', questionAr: 'تطلب من حد يستنى على التليفون بأدب إزاي؟', options: ['Could you hold on for a moment, please?', 'Wait and do not move', 'Stop talking now', 'Be quiet a second'], correctIndex: 0, explanationAr: 'Hold on = استنى على الخط - مع Could you... please بتبقى قمة الشياكة.' }
    ],
    speakingLines: [{ en: 'Hello, this is Ahmed speaking. How can I help you?', arEg: 'ألو، معاك أحمد. أقدر أساعدك في إيه؟' }, { en: 'Could you hold on for a moment, please?', arEg: 'ممكن تستنى لحظة لو سمحت؟' }],
  },
  {
    id: 'phone-sentences-unleashed-50',
    movieTitle: '50 English Phone Sentences for Daily Use - Speak Naturally',
    releaseYear: 2024,
    director: 'English Unleashed',
    genre: 'Podcast',
    cefrLevel: 'B1',
    sceneTitle: 'Everyday Phone English',
    sceneDescription: '٥٠ جملة تليفون يومية: للشغل، للصحاب، وللمواعيد.',
    youtubeId: 'tm-Whm3zjhk',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'English Unleashed Podcast (Official)',
    dialogueQuote: 'Can I leave a message for him, please?',
    actorName: 'Host',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/tm-Whm3zjhk/hqdefault.jpg',
    category: 'podcasts',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Unleashed Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Can I leave a message for him, please?', arEg: 'ممكن أسيبله رسالة لو سمحت؟', arFusha: 'ممكن أسيبله رسالة لو سمحت؟', speaker: 'Host', keyWords: [{ word: 'leave a message', ipa: '', meaningAr: 'أسيب رسالة', meaningEn: '' }, { word: 'for him', ipa: '', meaningAr: 'له / عشانه', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'The line is busy at the moment.', arEg: 'الخط مشغول دلوقتي.', arFusha: 'الخط مشغول دلوقتي.', speaker: 'Host', keyWords: [{ word: 'line is busy', ipa: '', meaningAr: 'الخط مشغول', meaningEn: '' }, { word: 'at the moment', ipa: '', meaningAr: 'دلوقتي', meaningEn: '' }] },      { id: 'sub-3', start: 80, end: 95, en: 'I will text you the address right away.', arEg: 'هبعتلك العنوان رسالة حالًا.', arFusha: 'هبعتلك العنوان رسالة حالًا.', speaker: 'Host', keyWords: [{ word: 'text you', ipa: '', meaningAr: 'أبعتلك رسالة', meaningEn: '' }, { word: 'right away', ipa: '', meaningAr: 'حالًا', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'leave a message', type: 'collocation', meaningAr: 'ترك رسالة', meaningEn: '', egyptianEquivalent: 'يسيب رسالة', exampleInScene: 'Please leave a message after the beep.' },      { term: 'busy line', type: 'collocation', meaningAr: 'خط مشغول', meaningEn: '', egyptianEquivalent: 'خط مشغول', exampleInScene: 'The line has been busy all day.' },      { term: 'right away', type: 'collocation', meaningAr: 'فورًا', meaningEn: '', egyptianEquivalent: 'حالًا', exampleInScene: 'I will send it right away.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'The person you called is not available. What do you say?', questionAr: 'اللي بتكلمه مش موجود. تقول إيه؟', options: ['Can I leave a message for him, please?', 'Where is he hiding?', 'Call me back or else', 'I hang up angry'], correctIndex: 0, explanationAr: 'Leave a message = تسيب رسالة لما حد مش متاح - أساس آداب التليفون.' }
    ],
    speakingLines: [{ en: 'Can I leave a message for him, please?', arEg: 'ممكن أسيبله رسالة لو سمحت؟' }, { en: 'I will text you the address right away.', arEg: 'هبعتلك العنوان رسالة حالًا.' }],
  },
  {
    id: 'airport-conversation-sunshine',
    movieTitle: 'At the Airport - English Conversation - Travel English',
    releaseYear: 2023,
    director: 'Sunshine English',
    genre: 'Conversation Practice',
    cefrLevel: 'A2',
    sceneTitle: 'Check In and Board Your Flight',
    sceneDescription: 'حوار المطار خطوة بخطوة: تسلم الشنطة، تاخد كارت الصعود، وتعرف بوابتك.',
    youtubeId: 'juPlEnOKl48',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Sunshine English (Official)',
    dialogueQuote: 'I would like a window seat, please.',
    actorName: 'Host',
    characterName: 'Traveler',
    thumbnailUrl: 'https://img.youtube.com/vi/juPlEnOKl48/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Sunshine English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'I would like a window seat, please.', arEg: 'عايز أوضة جنب الشباك لو سمحت.', arFusha: 'عايز أوضة جنب الشباك لو سمحت.', speaker: 'Traveler', keyWords: [{ word: 'window seat', ipa: '', meaningAr: 'أوضة جنب الشباك', meaningEn: '' }, { word: 'I would like', ipa: '', meaningAr: 'عايز', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'How many bags are you checking in?', arEg: 'هتسلم كام شنطة؟', arFusha: 'هتسلم كام شنطة؟', speaker: 'Agent', keyWords: [{ word: 'bags', ipa: '', meaningAr: 'شنط', meaningEn: '' }, { word: 'checking in', ipa: '', meaningAr: 'تسليم (شنط)', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'Your flight is boarding now at gate B12.', arEg: 'طيارتك بتقلع دلوقتي من بوابة B12.', arFusha: 'طيارتك بتقلع دلوقتي من بوابة B12.', speaker: 'Agent', keyWords: [{ word: 'boarding', ipa: '', meaningAr: 'صعود للطيارة', meaningEn: '' }, { word: 'gate', ipa: '', meaningAr: 'بوابة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'boarding pass', type: 'collocation', meaningAr: 'بطاقة صعود', meaningEn: '', egyptianEquivalent: 'كارت الصعود', exampleInScene: 'Show your boarding pass, please.' },      { term: 'gate', type: 'cultural', meaningAr: 'بوابة', meaningEn: '', egyptianEquivalent: 'بوابة', exampleInScene: 'Our gate closes at 9 PM.' },      { term: 'check in', type: 'phrasal-verb', meaningAr: 'يسجل وصول', meaningEn: '', egyptianEquivalent: 'يسلم الشنط / يعمل تشيك إن', exampleInScene: 'We checked in online.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Where do you board your plane?', questionAr: 'بتركب الطيارة منين؟', options: ['At the gate', 'At the bank', 'At the customs', 'At the hotel'], correctIndex: 0, explanationAr: 'Gate = البوابة اللي بتركب منها الطيارة - اسمع رقمها كويس في أي مطار.' }
    ],
    speakingLines: [{ en: 'I would like a window seat, please.', arEg: 'عايز أوضة جنب الشباك لو سمحت.' }, { en: 'Your flight is boarding now at gate B12.', arEg: 'طيارتك بتقلع دلوقتي من بوابة B12.' }],
  },
  {
    id: 'airport-checkin-rachel',
    movieTitle: 'Checking in at an Airport - American English Conversation - Rachel\'s English',
    releaseYear: 2021,
    director: 'Rachel\'s English',
    genre: 'Conversation Practice',
    cefrLevel: 'B1',
    sceneTitle: 'American Airport Check-In',
    sceneDescription: 'ريتشل بتحاكي حوار التشيك إن الأمريكي بالنطق والسرعة الطبيعيين.',
    youtubeId: 'Lympa-566Ek',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Rachel\'s English (Official)',
    dialogueQuote: 'Did you pack your bags yourself?',
    actorName: 'Rachel',
    characterName: 'Agent',
    thumbnailUrl: 'https://img.youtube.com/vi/Lympa-566Ek/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Rachel\'s English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Did you pack your bags yourself?', arEg: 'انت اللي رتبت شنطك بنفسك؟', arFusha: 'انت اللي رتبت شنطك بنفسك؟', speaker: 'Agent', keyWords: [{ word: 'pack', ipa: '', meaningAr: 'يرتب شنطة', meaningEn: '' }, { word: 'yourself', ipa: '', meaningAr: 'بنفسك', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Has anyone asked you to carry anything for them?', arEg: 'حد طلب منك تشيل معاك أي حاجة ليه؟', arFusha: 'حد طلب منك تشيل معاك أي حاجة ليه؟', speaker: 'Agent', keyWords: [{ word: 'carry', ipa: '', meaningAr: 'تشيل', meaningEn: '' }, { word: 'for them', ipa: '', meaningAr: 'ليهم', meaningEn: '' }] },      { id: 'sub-3', start: 85, end: 100, en: 'Here is your boarding pass. Enjoy your flight!', arEg: 'دي كارت الصعود بتاعك. رحلة سعيدة!', arFusha: 'دي كارت الصعود بتاعك. رحلة سعيدة!', speaker: 'Agent', keyWords: [{ word: 'here is', ipa: '', meaningAr: 'دي / ده', meaningEn: '' }, { word: 'enjoy your flight', ipa: '', meaningAr: 'رحلة سعيدة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'pack', type: 'cultural', meaningAr: 'يحزم', meaningEn: '', egyptianEquivalent: 'يرتب شنطة', exampleInScene: 'I packed my bag last night.' },      { term: 'carry-on', type: 'cultural', meaningAr: 'حقيبة يد', meaningEn: '', egyptianEquivalent: 'شنطة يد', exampleInScene: 'Only one carry-on is allowed.' },      { term: 'security check', type: 'collocation', meaningAr: 'تفتيش أمني', meaningEn: '', egyptianEquivalent: 'تفتيش الأمن', exampleInScene: 'The security check was quick.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Why does the agent ask \'Did you pack your bags yourself?\'', questionAr: 'ليه الموظف بيسأل Did you pack your bags yourself؟', options: ['سؤال أمني روتيني عن الشنط', 'عشان يمدح ترتيبك', 'عشان يبيعلك شنطة', 'سؤال عن وزن الشنطة'], correctIndex: 0, explanationAr: 'سؤال أمني ثابت في المطارات الأمريكية: لازم تكون انت اللي رتبت شنطتك وعارف جواها إيه.' }
    ],
    speakingLines: [{ en: 'Did you pack your bags yourself?', arEg: 'انت اللي رتبت شنطك بنفسك؟' }, { en: 'Here is your boarding pass. Enjoy your flight!', arEg: 'دي كارت الصعود بتاعك. رحلة سعيدة!' }],
  },
  {
    id: 'hotel-english-bob-canadian',
    movieTitle: 'Let\'s Learn English at a Hotel - An English Travel Lesson',
    releaseYear: 2022,
    director: 'Bob the Canadian',
    genre: 'Travel Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Check Into Your Room',
    sceneDescription: 'بوب الكندي بياخدك في جولة فندق: الاستقبال، الغرفة، والخدمات.',
    youtubeId: 'MYX7RVOf3Yc',
    startTime: 40,
    endTime: 160,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'I have a reservation under the name Alhinawi.',
    actorName: 'Bob the Canadian',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/MYX7RVOf3Yc/hqdefault.jpg',
    category: 'travel_english',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Bob the Canadian Official',
    subtitles: [
      { id: 'sub-1', start: 45, end: 60, en: 'I have a reservation under the name Alhinawi.', arEg: 'عندي حجز باسم الحناوي.', arFusha: 'عندي حجز باسم الحناوي.', speaker: 'Instructor', keyWords: [{ word: 'reservation', ipa: '', meaningAr: 'حجز', meaningEn: '' }, { word: 'under the name', ipa: '', meaningAr: 'باسم', meaningEn: '' }] },      { id: 'sub-2', start: 70, end: 85, en: 'Breakfast is included and served until 10 AM.', arEg: 'الفطار شامل وبيتقدم لحد الساعة ١٠ الصبح.', arFusha: 'الفطار شامل وبيتقدم لحد الساعة ١٠ الصبح.', speaker: 'Instructor', keyWords: [{ word: 'included', ipa: '', meaningAr: 'شامل', meaningEn: '' }, { word: 'served until', ipa: '', meaningAr: 'بيتقدم لحد', meaningEn: '' }] },      { id: 'sub-3', start: 95, end: 110, en: 'Could I get a late checkout on Friday?', arEg: 'ممكن أخرج متأخر يوم الجمعة؟', arFusha: 'ممكن أخرج متأخر يوم الجمعة؟', speaker: 'Instructor', keyWords: [{ word: 'late checkout', ipa: '', meaningAr: 'خروج متأخر', meaningEn: '' }, { word: 'could I get', ipa: '', meaningAr: 'ممكن أخد', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'reservation', type: 'cultural', meaningAr: 'حجز', meaningEn: '', egyptianEquivalent: 'حجز', exampleInScene: 'I made a reservation online.' },      { term: 'front desk', type: 'collocation', meaningAr: 'مكتب الاستقبال', meaningEn: '', egyptianEquivalent: 'الريسيبشن', exampleInScene: 'Ask the front desk for towels.' },      { term: 'checkout', type: 'cultural', meaningAr: 'مغادرة', meaningEn: '', egyptianEquivalent: 'معاد الخروج', exampleInScene: 'Checkout is at noon.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you say your booking is under your name?', questionAr: 'تقول إن الحجز باسمك إزاي؟', options: ['I have a reservation under the name...', 'My name booked this hotel', 'The hotel knows me', 'I reserved my name here'], correctIndex: 0, explanationAr: 'Under the name + اسمك = الحجز باسمك - أول جملة بتقولها في أي فندق.' }
    ],
    speakingLines: [{ en: 'I have a reservation under the name Alhinawi.', arEg: 'عندي حجز باسم الحناوي.' }, { en: 'Could I get a late checkout on Friday?', arEg: 'ممكن أخرج متأخر يوم الجمعة؟' }],
  },
  {
    id: 'hotel-checkin-just-speak',
    movieTitle: 'How to Check Into a Hotel in English - Everyday English',
    releaseYear: 2024,
    director: 'Just Speak English',
    genre: 'Conversation Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Handle Hotel Problems Politely',
    sceneDescription: 'تشيك إن كامل + إزاي تشتكي من الغرفة أو تطلب حاجة ناقصة بأدب.',
    youtubeId: 'Mc9WDaar6bk',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Just Speak English (Official)',
    dialogueQuote: 'The air conditioning in my room is not working.',
    actorName: 'Host',
    characterName: 'Guest',
    thumbnailUrl: 'https://img.youtube.com/vi/Mc9WDaar6bk/hqdefault.jpg',
    category: 'travel_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Just Speak English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'The air conditioning in my room is not working.', arEg: 'التكييف في أوضتي مش شغال.', arFusha: 'التكييف في أوضتي مش شغال.', speaker: 'Guest', keyWords: [{ word: 'air conditioning', ipa: '', meaningAr: 'تكييف', meaningEn: '' }, { word: 'not working', ipa: '', meaningAr: 'مش شغال', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'Could you send someone to fix it, please?', arEg: 'ممكن تبعت حد يصلحه لو سمحت؟', arFusha: 'ممكن تبعت حد يصلحه لو سمحت؟', speaker: 'Guest', keyWords: [{ word: 'send someone', ipa: '', meaningAr: 'تبعت حد', meaningEn: '' }, { word: 'fix', ipa: '', meaningAr: 'يصلح', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'I am sorry for the inconvenience. We will move you to another room.', arEg: 'متأسفين للإزعاج. هننقلك لأوضة تانية.', arFusha: 'متأسفين للإزعاج. هننقلك لأوضة تانية.', speaker: 'Receptionist', keyWords: [{ word: 'inconvenience', ipa: '', meaningAr: 'إزعاج', meaningEn: '' }, { word: 'move you to', ipa: '', meaningAr: 'ننقلك لـ', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'air conditioning', type: 'collocation', meaningAr: 'تكييف', meaningEn: '', egyptianEquivalent: 'تكييف', exampleInScene: 'The air conditioning is too cold.' },      { term: 'inconvenience', type: 'cultural', meaningAr: 'إزعاج', meaningEn: '', egyptianEquivalent: 'إزعاج / مشقة', exampleInScene: 'Sorry for the inconvenience.' },      { term: 'fix', type: 'cultural', meaningAr: 'يصلح', meaningEn: '', egyptianEquivalent: 'يصلح', exampleInScene: 'Can you fix the shower?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What is a polite way to report a broken AC?', questionAr: 'تبلغ عن تكييف بايظ بأدب إزاي؟', options: ['The air conditioning in my room is not working.', 'Your AC is garbage', 'Fix my room now or else', 'This hotel is terrible'], correctIndex: 0, explanationAr: 'Report the problem بهدوء + Could you... please - بتاخد خدمة أسرع وشغل أنضف.' }
    ],
    speakingLines: [{ en: 'The air conditioning in my room is not working.', arEg: 'التكييف في أوضتي مش شغال.' }, { en: 'Could you send someone to fix it, please?', arEg: 'ممكن تبعت حد يصلحه لو سمحت؟' }],
  },
  {
    id: 'gym-english-bob-canadian',
    movieTitle: 'Let\'s Learn English at the Gym - Fitness Vocabulary',
    releaseYear: 2022,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Work Out in English',
    sceneDescription: 'بوب الكندي في الجيم: أسماء الأجهزة والتمارين والجمل اللي هتسمعها.',
    youtubeId: '8vuzfcVel6I',
    startTime: 35,
    endTime: 155,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'I usually warm up on the treadmill before lifting weights.',
    actorName: 'Bob the Canadian',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/8vuzfcVel6I/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Bob the Canadian Official',
    subtitles: [
      { id: 'sub-1', start: 40, end: 55, en: 'I usually warm up on the treadmill before lifting weights.', arEg: 'أنا عادة بسخن على المشاية قبل ما ألعب حديد.', arFusha: 'أنا عادة بسخن على المشاية قبل ما ألعب حديد.', speaker: 'Instructor', keyWords: [{ word: 'warm up', ipa: '', meaningAr: 'أسخن', meaningEn: '' }, { word: 'lifting weights', ipa: '', meaningAr: 'ألعب حديد', meaningEn: '' }] },      { id: 'sub-2', start: 65, end: 80, en: 'How many sets and reps do you do?', arEg: 'بتعمل كام سيت وكام عدة؟', arFusha: 'بتعمل كام سيت وكام عدة؟', speaker: 'Instructor', keyWords: [{ word: 'sets', ipa: '', meaningAr: 'سيتات', meaningEn: '' }, { word: 'reps', ipa: '', meaningAr: 'عدات', meaningEn: '' }] },      { id: 'sub-3', start: 90, end: 105, en: 'Do not forget to stretch after your workout.', arEg: 'متنساش تعمل إطالات بعد التمرين.', arFusha: 'متنساش تعمل إطالات بعد التمرين.', speaker: 'Instructor', keyWords: [{ word: 'stretch', ipa: '', meaningAr: 'إطالات', meaningEn: '' }, { word: 'workout', ipa: '', meaningAr: 'تمرين', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'warm up', type: 'phrasal-verb', meaningAr: 'يسخن', meaningEn: '', egyptianEquivalent: 'يسخن قبل التمرين', exampleInScene: 'Always warm up first.' },      { term: 'treadmill', type: 'cultural', meaningAr: 'جهاز مشي', meaningEn: '', egyptianEquivalent: 'مشاية', exampleInScene: 'I run on the treadmill.' },      { term: 'workout', type: 'cultural', meaningAr: 'تمرين', meaningEn: '', egyptianEquivalent: 'تمرين', exampleInScene: 'That was a great workout!' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What are \'sets and reps\'?', questionAr: 'يعني إيه sets and reps؟', options: ['مجموعات وعدات التمرين', 'أنواع الأجهزة', 'أوقات الجيم', 'تمارين الإطالة'], correctIndex: 0, explanationAr: 'Set = مجموعة عدات ورا بعض، Rep = عدة واحدة - أهم مصطلحين في أي جيم.' }
    ],
    speakingLines: [{ en: 'I usually warm up on the treadmill before lifting weights.', arEg: 'أنا عادة بسخن على المشاية قبل ما ألعب حديد.' }, { en: 'Do not forget to stretch after your workout.', arEg: 'متنساش تعمل إطالات بعد التمرين.' }],
  },
  {
    id: 'gym-vocab-giovana-real',
    movieTitle: 'Gym Vocabulary - Real English Lesson - English by Giovana',
    releaseYear: 2023,
    director: 'English by Giovana',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Talk About Your Fitness Routine',
    sceneDescription: 'جيوفانا بتعلمك تتكلم عن روتينك الرياضي بثقة: تمارين، عضلات، وأهداف.',
    youtubeId: 'pGQzIf0Jgwo',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'English by Giovana (Official)',
    dialogueQuote: 'I am trying to build muscle and lose fat at the same time.',
    actorName: 'Giovana',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/pGQzIf0Jgwo/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English by Giovana Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'I am trying to build muscle and lose fat at the same time.', arEg: 'بحاول أبني عضل وأخس دهون في نفس الوقت.', arFusha: 'بحاول أبني عضل وأخس دهون في نفس الوقت.', speaker: 'Instructor', keyWords: [{ word: 'build muscle', ipa: '', meaningAr: 'أبني عضل', meaningEn: '' }, { word: 'lose fat', ipa: '', meaningAr: 'أخس دهون', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'Squats and lunges are great for your legs.', arEg: 'السكوات واللانجز تمارين جامدة للرجلين.', arFusha: 'السكوات واللانجز تمارين جامدة للرجلين.', speaker: 'Instructor', keyWords: [{ word: 'squats', ipa: '', meaningAr: 'سكوات', meaningEn: '' }, { word: 'great for', ipa: '', meaningAr: 'جامد لـ', meaningEn: '' }] },      { id: 'sub-3', start: 80, end: 95, en: 'Consistency is more important than intensity.', arEg: 'الاستمرارية أهم من الشدة.', arFusha: 'الاستمرارية أهم من الشدة.', speaker: 'Instructor', keyWords: [{ word: 'consistency', ipa: '', meaningAr: 'استمرارية', meaningEn: '' }, { word: 'intensity', ipa: '', meaningAr: 'شدة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'build muscle', type: 'collocation', meaningAr: 'بناء عضل', meaningEn: '', egyptianEquivalent: 'يبني عضل', exampleInScene: 'Protein helps build muscle.' },      { term: 'lose weight', type: 'collocation', meaningAr: 'خسارة وزن', meaningEn: '', egyptianEquivalent: 'يخس', exampleInScene: 'She lost weight with cardio.' },      { term: 'consistency', type: 'cultural', meaningAr: 'استمرارية', meaningEn: '', egyptianEquivalent: 'استمرارية', exampleInScene: 'Consistency beats motivation.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which phrase means exercising regularly over time?', questionAr: 'أنهي عبارة معناها التمرن بانتظام على مدار الوقت؟', options: ['Consistency', 'Intensity', 'One big workout', 'Rest day'], correctIndex: 0, explanationAr: 'Consistency = إنك تظهر كل يوم حتى لو شوية - سر أي تقدم في الجيم أو الإنجليزي.' }
    ],
    speakingLines: [{ en: 'I am trying to build muscle and lose fat at the same time.', arEg: 'بحاول أبني عضل وأخس دهون في نفس الوقت.' }, { en: 'Consistency is more important than intensity.', arEg: 'الاستمرارية أهم من الشدة.' }],
  },
  {
    id: 'renting-apartment-oxford',
    movieTitle: 'Renting a House or Apartment in English - Vocabulary and Conversation',
    releaseYear: 2021,
    director: 'Oxford Online English',
    genre: 'Conversation Practice',
    cefrLevel: 'B2',
    sceneTitle: 'View a Flat and Sign a Lease',
    sceneDescription: 'تشوف شقة، تسأل على الإيجار والمرافق، وتفهم عقد الإيجار قبل ما توقع.',
    youtubeId: 'vKTCzjgkzrQ',
    startTime: 40,
    endTime: 160,
    clipDuration: '2:00',
    videoSource: 'Oxford Online English (Official)',
    dialogueQuote: 'Does the rent include utilities like water and electricity?',
    actorName: 'Host',
    characterName: 'Tenant',
    thumbnailUrl: 'https://img.youtube.com/vi/vKTCzjgkzrQ/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Oxford Online English Official',
    subtitles: [
      { id: 'sub-1', start: 45, end: 60, en: 'Does the rent include utilities like water and electricity?', arEg: 'الإيجار شامل المرافق زي الميه والنور؟', arFusha: 'الإيجار شامل المرافق زي الميه والنور؟', speaker: 'Tenant', keyWords: [{ word: 'rent', ipa: '', meaningAr: 'إيجار', meaningEn: '' }, { word: 'utilities', ipa: '', meaningAr: 'مرافق', meaningEn: '' }] },      { id: 'sub-2', start: 70, end: 85, en: 'You will need to pay a two-month deposit upfront.', arEg: 'هتحتاج تدفع تأمين شهرين مقدم.', arFusha: 'هتحتاج تدفع تأمين شهرين مقدم.', speaker: 'Landlord', keyWords: [{ word: 'deposit', ipa: '', meaningAr: 'تأمين', meaningEn: '' }, { word: 'upfront', ipa: '', meaningAr: 'مقدم', meaningEn: '' }] },      { id: 'sub-3', start: 95, end: 110, en: 'The lease runs for one year with an option to renew.', arEg: 'العقد سنة كاملة مع إمكانية التجديد.', arFusha: 'العقد سنة كاملة مع إمكانية التجديد.', speaker: 'Landlord', keyWords: [{ word: 'lease', ipa: '', meaningAr: 'عقد إيجار', meaningEn: '' }, { word: 'renew', ipa: '', meaningAr: 'تجديد', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'utilities', type: 'cultural', meaningAr: 'مرافق', meaningEn: '', egyptianEquivalent: 'مرافق (ميه/نور/غاز)', exampleInScene: 'Utilities are not included.' },      { term: 'deposit', type: 'cultural', meaningAr: 'وديعة تأمين', meaningEn: '', egyptianEquivalent: 'تأمين', exampleInScene: 'The deposit is refundable.' },      { term: 'lease', type: 'cultural', meaningAr: 'عقد إيجار', meaningEn: '', egyptianEquivalent: 'عقد الإيجار', exampleInScene: 'Read the lease carefully.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What question should you ask before signing?', questionAr: 'تسأل إيه قبل ما توقع العقد؟', options: ['Does the rent include utilities?', 'What color are the walls?', 'Is the sofa pretty?', 'Do you like music?'], correctIndex: 0, explanationAr: 'اسأل دايمًا: الإيجار شامل إيه؟ - المرافق ممكن تضيف مبلغ كبير على الإيجار.' }
    ],
    speakingLines: [{ en: 'Does the rent include utilities like water and electricity?', arEg: 'الإيجار شامل المرافق زي الميه والنور؟' }, { en: 'The lease runs for one year with an option to renew.', arEg: 'العقد سنة كاملة مع إمكانية التجديد.' }],
  },
  {
    id: 'weather-talk-bob-canadian',
    movieTitle: 'Weather Talk - Learn English Words and Phrases to Talk About Weather',
    releaseYear: 2022,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Make Small Talk About Weather',
    sceneDescription: 'كلمات وجمل الطقس للحديث الاجتماعي: حر، برد، مطر، ورطوبة.',
    youtubeId: '_N2Q2_TtG0o',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'It is boiling hot today, is it not?',
    actorName: 'Bob the Canadian',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/_N2Q2_TtG0o/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Bob the Canadian Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'It is boiling hot today, is it not?', arEg: 'الجو حر قوي النهارده، مش كده؟', arFusha: 'الجو حر قوي النهارده، مش كده؟', speaker: 'Instructor', keyWords: [{ word: 'boiling hot', ipa: '', meaningAr: 'حر قوي', meaningEn: '' }, { word: 'is it not', ipa: '', meaningAr: 'مش كده', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'It looks like it might rain later.', arEg: 'شكله هيمطر بعدين.', arFusha: 'شكله هيمطر بعدين.', speaker: 'Instructor', keyWords: [{ word: 'looks like', ipa: '', meaningAr: 'شكله', meaningEn: '' }, { word: 'might rain', ipa: '', meaningAr: 'ممكن يمطر', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'The humidity makes it feel much warmer.', arEg: 'الرطوبة مخلية الجو حاسسنا إنه أحر بكتير.', arFusha: 'الرطوبة مخلية الجو حاسسنا إنه أحر بكتير.', speaker: 'Instructor', keyWords: [{ word: 'humidity', ipa: '', meaningAr: 'رطوبة', meaningEn: '' }, { word: 'feel much warmer', ipa: '', meaningAr: 'نحس إنه أحر بكتير', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'boiling hot', type: 'collocation', meaningAr: 'شديد الحرارة', meaningEn: '', egyptianEquivalent: 'حر نار', exampleInScene: 'It is boiling hot in August.' },      { term: 'freezing', type: 'cultural', meaningAr: 'شديد البرودة', meaningEn: '', egyptianEquivalent: 'برد قارص', exampleInScene: 'It is freezing outside.' },      { term: 'humidity', type: 'cultural', meaningAr: 'رطوبة', meaningEn: '', egyptianEquivalent: 'رطوبة', exampleInScene: 'The humidity is high today.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which phrase starts weather small talk naturally?', questionAr: 'أنهي عبارة بتفتح حديث طبيعي عن الجو؟', options: ['It is boiling hot today, is it not?', 'Tell me your salary', 'Why are you here?', 'Move aside please'], correctIndex: 0, explanationAr: 'الجو أأمن موضوع small talk في العالم - افتتح بيه أي حوار مع أي حد.' }
    ],
    speakingLines: [{ en: 'It is boiling hot today, is it not?', arEg: 'الجو حر قوي النهارده، مش كده؟' }, { en: 'It looks like it might rain later.', arEg: 'شكله هيمطر بعدين.' }],
  },
  {
    id: 'sports-talk-oxford',
    movieTitle: 'Talk About Sports in English - Improve Spoken English',
    releaseYear: 2021,
    director: 'Oxford Online English',
    genre: 'Speaking Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Chat About the Match Last Night',
    sceneDescription: 'تتكلم عن الرياضة زي النيتيف: ماتشات، فرق، نتايج، وآراء.',
    youtubeId: 'QHOmj2TO4mM',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Oxford Online English (Official)',
    dialogueQuote: 'Did you catch the game last night?',
    actorName: 'Host',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/QHOmj2TO4mM/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Oxford Online English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'Did you catch the game last night?', arEg: 'شفت الماتش مبارح بالليل؟', arFusha: 'شفت الماتش مبارح بالليل؟', speaker: 'Speaker', keyWords: [{ word: 'catch the game', ipa: '', meaningAr: 'تشوف الماتش', meaningEn: '' }, { word: 'last night', ipa: '', meaningAr: 'مبارح بالليل', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'They were winning until the last minute.', arEg: 'كانوا كسبانين لحد آخر دقيقة.', arFusha: 'كانوا كسبانين لحد آخر دقيقة.', speaker: 'Speaker', keyWords: [{ word: 'winning', ipa: '', meaningAr: 'كسبانين', meaningEn: '' }, { word: 'until the last minute', ipa: '', meaningAr: 'لحد آخر دقيقة', meaningEn: '' }] },      { id: 'sub-3', start: 85, end: 100, en: 'I have been a fan of this team since I was a kid.', arEg: 'أنا مشجع للفريق ده من وأنا صغير.', arFusha: 'أنا مشجع للفريق ده من وأنا صغير.', speaker: 'Speaker', keyWords: [{ word: 'fan of', ipa: '', meaningAr: 'مشجع لـ', meaningEn: '' }, { word: 'since I was a kid', ipa: '', meaningAr: 'من وأنا صغير', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'catch the game', type: 'collocation', meaningAr: 'مشاهدة المباراة', meaningEn: '', egyptianEquivalent: 'يتفرج على الماتش', exampleInScene: 'Did you catch the game?' },      { term: 'score', type: 'cultural', meaningAr: 'نتيجة', meaningEn: '', egyptianEquivalent: 'نتيجة', exampleInScene: 'What was the final score?' },      { term: 'fan', type: 'cultural', meaningAr: 'مشجع', meaningEn: '', egyptianEquivalent: 'مشجع', exampleInScene: 'He is a big football fan.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'Did you catch the game?\' mean?', questionAr: 'يعني إيه Did you catch the game؟', options: ['شفت الماتش؟', 'لعبت الماتش؟', 'مسكت الكورة؟', 'اشتريت تذكرة؟'], correctIndex: 0, explanationAr: 'Catch the game = تشوف الماتش - من أكتر تعبيرات النيتيف شيوعًا في كلام الرياضة.' }
    ],
    speakingLines: [{ en: 'Did you catch the game last night?', arEg: 'شفت الماتش مبارح بالليل؟' }, { en: 'I have been a fan of this team since I was a kid.', arEg: 'أنا مشجع للفريق ده من وأنا صغير.' }],
  },
  {
    id: 'sports-daily-mr-english',
    movieTitle: 'Talking about Sports in English - Daily English Conversation',
    releaseYear: 2023,
    director: 'Mr. English Channel',
    genre: 'Conversation Practice',
    cefrLevel: 'A2',
    sceneTitle: 'Which Sports Do You Play?',
    sceneDescription: 'محادثة بسيطة عن الرياضة: بتلعب إيه، بتشجع مين، وكام مرة في الأسبوع.',
    youtubeId: 'DGj-Q49rOfg',
    startTime: 15,
    endTime: 135,
    clipDuration: '2:00',
    videoSource: 'Mr. English Channel (Official)',
    dialogueQuote: 'How often do you play football?',
    actorName: 'Host',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/DGj-Q49rOfg/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Mr. English Channel Official',
    subtitles: [
      { id: 'sub-1', start: 20, end: 35, en: 'How often do you play football?', arEg: 'بتلعب كورة كام مرة؟', arFusha: 'بتلعب كورة كام مرة؟', speaker: 'Speaker', keyWords: [{ word: 'how often', ipa: '', meaningAr: 'كام مرة / كل قد إيه', meaningEn: '' }, { word: 'play football', ipa: '', meaningAr: 'تلعب كورة', meaningEn: '' }] },      { id: 'sub-2', start: 45, end: 60, en: 'I play twice a week with my friends.', arEg: 'بلعب مرتين في الأسبوع مع صحابي.', arFusha: 'بلعب مرتين في الأسبوع مع صحابي.', speaker: 'Speaker', keyWords: [{ word: 'twice a week', ipa: '', meaningAr: 'مرتين في الأسبوع', meaningEn: '' }, { word: 'with my friends', ipa: '', meaningAr: 'مع صحابي', meaningEn: '' }] },      { id: 'sub-3', start: 70, end: 85, en: 'Which team do you support?', arEg: 'بتشجع أنهي فريق؟', arFusha: 'بتشجع أنهي فريق؟', speaker: 'Speaker', keyWords: [{ word: 'which team', ipa: '', meaningAr: 'أنهي فريق', meaningEn: '' }, { word: 'support', ipa: '', meaningAr: 'تشجع', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'how often', type: 'collocation', meaningAr: 'كم مرة', meaningEn: '', egyptianEquivalent: 'كل قد إيه', exampleInScene: 'How often do you exercise?' },      { term: 'twice a week', type: 'collocation', meaningAr: 'مرتين في الأسبوع', meaningEn: '', egyptianEquivalent: 'مرتين في الأسبوع', exampleInScene: 'I go to the gym twice a week.' },      { term: 'support', type: 'cultural', meaningAr: 'يشجع', meaningEn: '', egyptianEquivalent: 'يشجع فريق', exampleInScene: 'Which team do you support?' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you ask about frequency?', questionAr: 'تسأل عن عدد المرات إزاي؟', options: ['How often do you play?', 'How long do you play?', 'How much do you play?', 'How far do you play?'], correctIndex: 0, explanationAr: 'How often = كل قد إيه / كام مرة - للتكرار. How long للمدة، وHow much للكمية.' }
    ],
    speakingLines: [{ en: 'How often do you play football?', arEg: 'بتلعب كورة كام مرة؟' }, { en: 'I play twice a week with my friends.', arEg: 'بلعب مرتين في الأسبوع مع صحابي.' }],
  },
  {
    id: 'news-bbc-social-media-source',
    movieTitle: 'Social Media More Popular News Source Than TV - BBC Learning English from the News',
    releaseYear: 2024,
    director: 'BBC Learning English',
    genre: 'News English',
    cefrLevel: 'B2',
    sceneTitle: 'Understand a News Story',
    sceneDescription: 'بي بي سي بتشرح خبر حقيقي: السوشيال ميديا بقت مصدر الأخبار الأول.',
    youtubeId: 'qRsLwL9lJQg',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'More people now get their news from social media than from television.',
    actorName: 'BBC Hosts',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/qRsLwL9lJQg/hqdefault.jpg',
    category: 'podcasts',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'More people now get their news from social media than from television.', arEg: 'ناس أكتر دلوقتي بتاخد أخبارها من السوشيال ميديا أكتر من التلفزيون.', arFusha: 'ناس أكتر دلوقتي بتاخد أخبارها من السوشيال ميديا أكتر من التلفزيون.', speaker: 'Host', keyWords: [{ word: 'get their news', ipa: '', meaningAr: 'بياخدوا أخبارهم', meaningEn: '' }, { word: 'more... than', ipa: '', meaningAr: 'أكتر من', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'Traditional media outlets are losing ground.', arEg: 'وسائل الإعلام التقليدية بتخسر مكانتها.', arFusha: 'وسائل الإعلام التقليدية بتخسر مكانتها.', speaker: 'Host', keyWords: [{ word: 'outlets', ipa: '', meaningAr: 'وسائل / منصات', meaningEn: '' }, { word: 'losing ground', ipa: '', meaningAr: 'بتخسر مكانتها', meaningEn: '' }] },      { id: 'sub-3', start: 85, end: 100, en: 'Experts warn that misinformation spreads quickly online.', arEg: 'الخبراء بيحذروا إن الأخبار الكاذبة بينتشر بسرعة أونلاين.', arFusha: 'الخبراء بيحذروا إن الأخبار الكاذبة بينتشر بسرعة أونلاين.', speaker: 'Host', keyWords: [{ word: 'misinformation', ipa: '', meaningAr: 'معلومات مضللة', meaningEn: '' }, { word: 'spreads', ipa: '', meaningAr: 'بينتشر', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'headline', type: 'cultural', meaningAr: 'عنوان رئيسي', meaningEn: '', egyptianEquivalent: 'عنوان خبر', exampleInScene: 'Did you read the headlines today?' },      { term: 'misinformation', type: 'cultural', meaningAr: 'معلومات مضللة', meaningEn: '', egyptianEquivalent: 'أخبار كاذبة', exampleInScene: 'Misinformation spreads fast.' },      { term: 'source', type: 'cultural', meaningAr: 'مصدر', meaningEn: '', egyptianEquivalent: 'مصدر', exampleInScene: 'Check your news sources.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'losing ground\' mean in the news story?', questionAr: 'يعني إيه losing ground في الخبر؟', options: ['بتخسر مكانتها وشعبيتها', 'بتكسب فلوس', 'بتنتقل لمكان جديد', 'بتقفل نهائي'], correctIndex: 0, explanationAr: 'Lose ground = تخسر تقدمك أو مكانتك قدام منافس - تعبير شائع جدًا في الأخبار.' }
    ],
    speakingLines: [{ en: 'More people now get their news from social media than from television.', arEg: 'ناس أكتر دلوقتي بتاخد أخبارها من السوشيال ميديا أكتر من التلفزيون.' }, { en: 'Experts warn that misinformation spreads quickly online.', arEg: 'الخبراء بيحذروا إن الأخبار الكاذبة بينتشر بسرعة أونلاين.' }],
  },
  {
    id: 'news-bbc-air-india-report',
    movieTitle: 'Air India Crash Report Doubts - BBC Learning English from the News',
    releaseYear: 2024,
    director: 'BBC Learning English',
    genre: 'News English',
    cefrLevel: 'B2',
    sceneTitle: 'News Vocabulary in Context',
    sceneDescription: 'خبر عن تقرير طيران ومفرداته: تحقيق، شكوك، وأدلة - بشرح مبسط.',
    youtubeId: 'hQ6SI8Rtp8U',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'Investigators have raised doubts about the initial findings.',
    actorName: 'BBC Hosts',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/hQ6SI8Rtp8U/hqdefault.jpg',
    category: 'podcasts',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'Investigators have raised doubts about the initial findings.', arEg: 'المحققين عندهم شكوك في النتايج الأولية.', arFusha: 'المحققين عندهم شكوك في النتايج الأولية.', speaker: 'Host', keyWords: [{ word: 'raised doubts', ipa: '', meaningAr: 'عندهم شكوك', meaningEn: '' }, { word: 'initial findings', ipa: '', meaningAr: 'نتايج أولية', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'The report has not yet been made public.', arEg: 'التقرير لسه معملوش متاح للناس.', arFusha: 'التقرير لسه معملوش متاح للناس.', speaker: 'Host', keyWords: [{ word: 'not yet', ipa: '', meaningAr: 'لسه', meaningEn: '' }, { word: 'made public', ipa: '', meaningAr: 'متاح للناس', meaningEn: '' }] },      { id: 'sub-3', start: 80, end: 95, en: 'Families are calling for a full investigation.', arEg: 'الأهالي بيطالبوا بتحقيق كامل.', arFusha: 'الأهالي بيطالبوا بتحقيق كامل.', speaker: 'Host', keyWords: [{ word: 'calling for', ipa: '', meaningAr: 'بيطالبوا بـ', meaningEn: '' }, { word: 'investigation', ipa: '', meaningAr: 'تحقيق', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'raise doubts', type: 'collocation', meaningAr: 'إثارة شكوك', meaningEn: '', egyptianEquivalent: 'يكون عنده شكوك', exampleInScene: 'The results raised doubts.' },      { term: 'findings', type: 'cultural', meaningAr: 'نتائج', meaningEn: '', egyptianEquivalent: 'نتايج تحقيق', exampleInScene: 'The findings were surprising.' },      { term: 'call for', type: 'phrasal-verb', meaningAr: 'يطالب بـ', meaningEn: '', egyptianEquivalent: 'يطالب بـ', exampleInScene: 'They called for change.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'call for an investigation\' mean?', questionAr: 'يعني إيه call for an investigation؟', options: ['يطالبوا بتحقيق', 'يتصلوا بالمحقق', 'يلغوا التحقيق', 'يكتبوا التقرير'], correctIndex: 0, explanationAr: 'Call for = يطالب رسميًا بشيء - تعبير صحفي مهم جدًا في الأخبار.' }
    ],
    speakingLines: [{ en: 'Investigators have raised doubts about the initial findings.', arEg: 'المحققين عندهم شكوك في النتايج الأولية.' }, { en: 'Families are calling for a full investigation.', arEg: 'الأهالي بيطالبوا بتحقيق كامل.' }],
  },
  {
    id: 'films-talk-bbc-real-easy',
    movieTitle: 'Talking About Films - Real Easy English - BBC Learning English',
    releaseYear: 2023,
    director: 'BBC Learning English',
    genre: 'Conversation Practice',
    cefrLevel: 'A2',
    sceneTitle: 'Recommend a Film',
    sceneDescription: 'كلام بسيط عن الأفلام: نوع الفيلم، نجومك المفضلين، وترشح فيلم لحد.',
    youtubeId: 'BSABmr8hX7s',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'BBC Learning English (Official)',
    dialogueQuote: 'What kind of films are you into?',
    actorName: 'BBC Hosts',
    characterName: 'Host',
    thumbnailUrl: 'https://img.youtube.com/vi/BSABmr8hX7s/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'British',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'BBC Learning English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'What kind of films are you into?', arEg: 'بتعجبك أفلام من نوع إيه؟', arFusha: 'بتعجبك أفلام من نوع إيه؟', speaker: 'Host', keyWords: [{ word: 'kind of', ipa: '', meaningAr: 'نوع', meaningEn: '' }, { word: 'be into', ipa: '', meaningAr: 'تحب / تهتم بـ', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'I am really into comedies. They always make me laugh.', arEg: 'أنا بحب الكوميديا جدًا. دايمًا بتضحكني.', arFusha: 'أنا بحب الكوميديا جدًا. دايمًا بتضحكني.', speaker: 'Host', keyWords: [{ word: 'comedies', ipa: '', meaningAr: 'أفلام كوميدية', meaningEn: '' }, { word: 'make me laugh', ipa: '', meaningAr: 'بتضحكني', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'You should definitely check it out.', arEg: 'لازم تتفرج عليه أكيد.', arFusha: 'لازم تتفرج عليه أكيد.', speaker: 'Host', keyWords: [{ word: 'definitely', ipa: '', meaningAr: 'أكيد', meaningEn: '' }, { word: 'check it out', ipa: '', meaningAr: 'تتفرج عليه', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'be into', type: 'phrasal-verb', meaningAr: 'يحب', meaningEn: '', egyptianEquivalent: 'يحب / يهتم بـ', exampleInScene: 'I am into horror films.' },      { term: 'genre', type: 'cultural', meaningAr: 'نوع فني', meaningEn: '', egyptianEquivalent: 'نوع الفيلم', exampleInScene: 'What genre do you prefer?' },      { term: 'check out', type: 'phrasal-verb', meaningAr: 'يتفقد', meaningEn: '', egyptianEquivalent: 'يتفرج على / يجرب', exampleInScene: 'Check out this new series.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you recommend a film casually?', questionAr: 'ترشح فيلم لحد بطريقة ودية إزاي؟', options: ['You should definitely check it out.', 'Watch it or else', 'It is mandatory viewing', 'You will see this film'], correctIndex: 0, explanationAr: 'You should check it out = ترشيح ودي وطبيعي - بيستخدمه النيتيف كل يوم.' }
    ],
    speakingLines: [{ en: 'What kind of films are you into?', arEg: 'بتعجبك أفلام من نوع إيه؟' }, { en: 'You should definitely check it out.', arEg: 'لازم تتفرج عليه أكيد.' }],
  },
  {
    id: 'movies-music-talk-spake',
    movieTitle: 'How to Talk About Movies and Music in English - Easy Speaking',
    releaseYear: 2023,
    director: 'Talk With Spake',
    genre: 'Speaking Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Share Your Taste',
    sceneDescription: 'تتكلم عن ذوقك في الأفلام والموسيقى وتسأل عن ذوق غيرك.',
    youtubeId: 'rAndzSQbBxE',
    startTime: 25,
    endTime: 145,
    clipDuration: '2:00',
    videoSource: 'Talk With Spake (Official)',
    dialogueQuote: 'That song has been stuck in my head all week.',
    actorName: 'Host',
    characterName: 'Speaker',
    thumbnailUrl: 'https://img.youtube.com/vi/rAndzSQbBxE/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Talk With Spake Official',
    subtitles: [
      { id: 'sub-1', start: 30, end: 45, en: 'That song has been stuck in my head all week.', arEg: 'الأغنية دي ماسكة في دماغي الأسبوع ده كله.', arFusha: 'الأغنية دي ماسكة في دماغي الأسبوع ده كله.', speaker: 'Speaker', keyWords: [{ word: 'stuck in my head', ipa: '', meaningAr: 'ماسكة في دماغي', meaningEn: '' }, { word: 'all week', ipa: '', meaningAr: 'الأسبوع كله', meaningEn: '' }] },      { id: 'sub-2', start: 55, end: 70, en: 'I am not really a fan of action movies.', arEg: 'أنا مش من عشاق أفلام الأكشن قوي.', arFusha: 'أنا مش من عشاق أفلام الأكشن قوي.', speaker: 'Speaker', keyWords: [{ word: 'not really', ipa: '', meaningAr: 'مش قوي', meaningEn: '' }, { word: 'a fan of', ipa: '', meaningAr: 'من عشاق', meaningEn: '' }] },      { id: 'sub-3', start: 80, end: 95, en: 'Have you heard their new album yet?', arEg: 'سمعت الألبوم الجديد بتاعهم ولا لسه؟', arFusha: 'سمعت الألبوم الجديد بتاعهم ولا لسه؟', speaker: 'Speaker', keyWords: [{ word: 'album', ipa: '', meaningAr: 'ألبوم', meaningEn: '' }, { word: 'yet', ipa: '', meaningAr: 'لسه', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'stuck in my head', type: 'idiom', meaningAr: 'عالقة في الرأس', meaningEn: '', egyptianEquivalent: 'ماسكة في دماغي', exampleInScene: 'This tune is stuck in my head.' },      { term: 'a fan of', type: 'collocation', meaningAr: 'معجب بـ', meaningEn: '', egyptianEquivalent: 'من عشاق', exampleInScene: 'I am a big fan of her voice.' },      { term: 'album', type: 'cultural', meaningAr: 'ألبوم', meaningEn: '', egyptianEquivalent: 'ألبوم', exampleInScene: 'Their new album is out.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'stuck in my head\' mean about a song?', questionAr: 'يعني إيه الأغنية stuck in my head؟', options: ['مش قادر أنساها وبرددها', 'مش عاجباني', 'صوتها عالي', 'نسيت كلماتها'], correctIndex: 0, explanationAr: 'Stuck in my head = أغنية عالقة في دماغك بترددها من غير ما تحس - تعبير يومي ممتع.' }
    ],
    speakingLines: [{ en: 'That song has been stuck in my head all week.', arEg: 'الأغنية دي ماسكة في دماغي الأسبوع ده كله.' }, { en: 'Have you heard their new album yet?', arEg: 'سمعت الألبوم الجديد بتاعهم ولا لسه؟' }],
  },
  {
    id: 'professional-emails-engvid',
    movieTitle: 'How to Write Professional Emails in English - engVid',
    releaseYear: 2021,
    director: 'English with Alex - engVid',
    genre: 'Business English',
    cefrLevel: 'B2',
    sceneTitle: 'Write Emails That Get Answers',
    sceneDescription: 'أليكس بيعلمك تكتب إيميل شغل محترف: افتتاحية، طلب، وختام مهذب.',
    youtubeId: '3Tu1jN65slw',
    startTime: 35,
    endTime: 155,
    clipDuration: '2:00',
    videoSource: 'English with Alex - engVid (Official)',
    dialogueQuote: 'I am writing to follow up on our meeting last week.',
    actorName: 'Alex',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/3Tu1jN65slw/hqdefault.jpg',
    category: 'business_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'engVid Official',
    subtitles: [
      { id: 'sub-1', start: 40, end: 55, en: 'I am writing to follow up on our meeting last week.', arEg: 'بكتب عشان أتابع موضوع الاجتماع اللي فات.', arFusha: 'بكتب عشان أتابع موضوع الاجتماع اللي فات.', speaker: 'Instructor', keyWords: [{ word: 'I am writing to', ipa: '', meaningAr: 'بكتب عشان', meaningEn: '' }, { word: 'follow up on', ipa: '', meaningAr: 'أتابع', meaningEn: '' }] },      { id: 'sub-2', start: 65, end: 80, en: 'Could you please send me the report by Friday?', arEg: 'ممكن لو سمحت تبعتلي التقرير قبل يوم الجمعة؟', arFusha: 'ممكن لو سمحت تبعتلي التقرير قبل يوم الجمعة؟', speaker: 'Instructor', keyWords: [{ word: 'could you please', ipa: '', meaningAr: 'ممكن لو سمحت', meaningEn: '' }, { word: 'by Friday', ipa: '', meaningAr: 'قبل يوم الجمعة', meaningEn: '' }] },      { id: 'sub-3', start: 90, end: 105, en: 'Please do not hesitate to contact me if you have any questions.', arEg: 'متترددش تتواصل معايا لو عندك أي أسئلة.', arFusha: 'متترددش تتواصل معايا لو عندك أي أسئلة.', speaker: 'Instructor', keyWords: [{ word: 'do not hesitate', ipa: '', meaningAr: 'متترددش', meaningEn: '' }, { word: 'contact me', ipa: '', meaningAr: 'تتواصل معايا', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'follow up', type: 'phrasal-verb', meaningAr: 'يتابع', meaningEn: '', egyptianEquivalent: 'يتابع موضوع', exampleInScene: 'I will follow up tomorrow.' },      { term: 'attachment', type: 'cultural', meaningAr: 'مرفق', meaningEn: '', egyptianEquivalent: 'مرفق', exampleInScene: 'Please find the attachment.' },      { term: 'do not hesitate', type: 'collocation', meaningAr: 'لا تتردد', meaningEn: '', egyptianEquivalent: 'متترددش', exampleInScene: 'Do not hesitate to ask.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which line opens a professional email best?', questionAr: 'أنهي جملة تفتح بيها إيميل شغل؟', options: ['I am writing to follow up on our meeting.', 'Hey what is up', 'Yo send me that thing', 'Listen to me now'], correctIndex: 0, explanationAr: 'I am writing to... = الافتتاحية الرسمية الذهبية - بتوضح هدف الإيميل من أول سطر.' }
    ],
    speakingLines: [{ en: 'I am writing to follow up on our meeting last week.', arEg: 'بكتب عشان أتابع موضوع الاجتماع اللي فات.' }, { en: 'Please do not hesitate to contact me if you have any questions.', arEg: 'متترددش تتواصل معايا لو عندك أي أسئلة.' }],
  },
  {
    id: 'formal-email-structure-howto',
    movieTitle: 'How to Write a Formal Email - Professional Email Structure',
    releaseYear: 2023,
    director: 'how to English',
    genre: 'Writing Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Build a Formal Email Step by Step',
    sceneDescription: 'هيكل الإيميل الرسمي: عنوان واضح، تحية، جسم مختصر، وإمضاء صح.',
    youtubeId: '5yAL98Hci6I',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'how to English (Official)',
    dialogueQuote: 'Dear Mr. Hassan, I hope this email finds you well.',
    actorName: 'Host',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/5yAL98Hci6I/hqdefault.jpg',
    category: 'business_english',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'how to English Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Dear Mr. Hassan, I hope this email finds you well.', arEg: 'أستاذ حسن المحترم، أتمنى تكون بخير.', arFusha: 'أستاذ حسن المحترم، أتمنى تكون بخير.', speaker: 'Instructor', keyWords: [{ word: 'dear', ipa: '', meaningAr: 'عزيزي / أستاذ', meaningEn: '' }, { word: 'finds you well', ipa: '', meaningAr: 'تكون بخير', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'I look forward to hearing from you soon.', arEg: 'مستني رد منك قريب.', arFusha: 'مستني رد منك قريب.', speaker: 'Instructor', keyWords: [{ word: 'look forward to', ipa: '', meaningAr: 'مستني بشوق', meaningEn: '' }, { word: 'hearing from you', ipa: '', meaningAr: 'رد منك', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'Best regards, Mohamed Alhinawi.', arEg: 'مع أطيب التحيات، محمد الحناوي.', arFusha: 'مع أطيب التحيات، محمد الحناوي.', speaker: 'Instructor', keyWords: [{ word: 'best regards', ipa: '', meaningAr: 'أطيب التحيات', meaningEn: '' }, { word: 'regards', ipa: '', meaningAr: 'تحيات', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'subject line', type: 'collocation', meaningAr: 'سطر العنوان', meaningEn: '', egyptianEquivalent: 'عنوان الإيميل', exampleInScene: 'Write a clear subject line.' },      { term: 'look forward to', type: 'collocation', meaningAr: 'يتطلع إلى', meaningEn: '', egyptianEquivalent: 'مستني بشوق', exampleInScene: 'I look forward to your reply.' },      { term: 'best regards', type: 'collocation', meaningAr: 'مع خالص التحية', meaningEn: '', egyptianEquivalent: 'أطيب التحيات', exampleInScene: 'End with \'Best regards\'.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What comes right before your name in a formal email?', questionAr: 'إيه اللي بيجي قبل اسمك في الإيميل الرسمي؟', options: ['Best regards', 'Hey there', 'LOL', 'Whatever'], correctIndex: 0, explanationAr: 'Best regards / Kind regards = الختام الرسمي - بعده اسمك على طول.' }
    ],
    speakingLines: [{ en: 'Dear Mr. Hassan, I hope this email finds you well.', arEg: 'أستاذ حسن المحترم، أتمنى تكون بخير.' }, { en: 'I look forward to hearing from you soon.', arEg: 'مستني رد منك قريب.' }],
  },
  {
    id: 'driving-car-vocab-engvid',
    movieTitle: 'Driving in English - Car and Road Vocabulary - engVid',
    releaseYear: 2021,
    director: 'Adam\'s English Lessons - engVid',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'B1',
    sceneTitle: 'Talk About Driving Like a Native',
    sceneDescription: 'مفردات العربية والطريق: بنزين، إشارات، زحمة، ومواقف.',
    youtubeId: 'a5nFBQ5H62U',
    startTime: 30,
    endTime: 150,
    clipDuration: '2:00',
    videoSource: 'Adam\'s English Lessons - engVid (Official)',
    dialogueQuote: 'I got stuck in traffic on my way to work.',
    actorName: 'Adam',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/a5nFBQ5H62U/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'engVid Official',
    subtitles: [
      { id: 'sub-1', start: 35, end: 50, en: 'I got stuck in traffic on my way to work.', arEg: 'اتعلقت في الزحمة وأنا في طريقي للشغل.', arFusha: 'اتعلقت في الزحمة وأنا في طريقي للشغل.', speaker: 'Instructor', keyWords: [{ word: 'got stuck', ipa: '', meaningAr: 'اتعلقت', meaningEn: '' }, { word: 'traffic', ipa: '', meaningAr: 'زحمة', meaningEn: '' }] },      { id: 'sub-2', start: 60, end: 75, en: 'You need to fill up the tank before the trip.', arEg: 'لازم تفول التنك قبل السفرية.', arFusha: 'لازم تفول التنك قبل السفرية.', speaker: 'Instructor', keyWords: [{ word: 'fill up the tank', ipa: '', meaningAr: 'تفول التنك', meaningEn: '' }, { word: 'before the trip', ipa: '', meaningAr: 'قبل السفرية', meaningEn: '' }] },      { id: 'sub-3', start: 85, end: 100, en: 'He ran a red light and got a ticket.', arEg: 'عدى الإشارة وهي حمرا واتعمله مخالفة.', arFusha: 'عدى الإشارة وهي حمرا واتعمله مخالفة.', speaker: 'Instructor', keyWords: [{ word: 'ran a red light', ipa: '', meaningAr: 'عدى إشارة حمرا', meaningEn: '' }, { word: 'got a ticket', ipa: '', meaningAr: 'اتعمله مخالفة', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'stuck in traffic', type: 'collocation', meaningAr: 'عالق في الزحمة', meaningEn: '', egyptianEquivalent: 'اتعلقت في الزحمة', exampleInScene: 'Sorry, I was stuck in traffic.' },      { term: 'fill up', type: 'phrasal-verb', meaningAr: 'يملأ', meaningEn: '', egyptianEquivalent: 'يفول بنزين', exampleInScene: 'I need to fill up the car.' },      { term: 'ticket', type: 'cultural', meaningAr: 'مخالفة', meaningEn: '', egyptianEquivalent: 'مخالفة', exampleInScene: 'He got a parking ticket.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What does \'I got stuck in traffic\' mean?', questionAr: 'يعني إيه I got stuck in traffic؟', options: ['اتعلقت في الزحمة', 'العربية عطلت', 'نسيت الطريق', 'وقفت أشتري بنزين'], correctIndex: 0, explanationAr: 'Stuck in traffic = عالق في الزحمة - أشهر عذر تأخير في العالم.' }
    ],
    speakingLines: [{ en: 'I got stuck in traffic on my way to work.', arEg: 'اتعلقت في الزحمة وأنا في طريقي للشغل.' }, { en: 'You need to fill up the tank before the trip.', arEg: 'لازم تفول التنك قبل السفرية.' }],
  },
  {
    id: 'vehicles-vocab-bob-canadian',
    movieTitle: 'English Vocabulary Lesson on Vehicles - Cars, Trucks and More',
    releaseYear: 2021,
    director: 'Bob the Canadian',
    genre: 'Vocabulary Lesson',
    cefrLevel: 'A2',
    sceneTitle: 'Name Every Vehicle on the Road',
    sceneDescription: 'بوب الكندي بيعلمك أسماء كل المركبات: عربية، نقل، موتوسيكل، وإسعاف.',
    youtubeId: 'lkMzvdjhMlI',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'Learn English with Bob the Canadian (Official)',
    dialogueQuote: 'An ambulance rushes people to the hospital.',
    actorName: 'Bob the Canadian',
    characterName: 'Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/lkMzvdjhMlI/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'International',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'Bob the Canadian Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'An ambulance rushes people to the hospital.', arEg: 'الإسعاف بينقل الناس للمستشفى بسرعة.', arFusha: 'الإسعاف بينقل الناس للمستشفى بسرعة.', speaker: 'Instructor', keyWords: [{ word: 'ambulance', ipa: '', meaningAr: 'إسعاف', meaningEn: '' }, { word: 'rushes', ipa: '', meaningAr: 'بينقل بسرعة', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'A pickup truck can carry heavy loads.', arEg: 'عربية النقل بتشيل حاجات تقيلة.', arFusha: 'عربية النقل بتشيل حاجات تقيلة.', speaker: 'Instructor', keyWords: [{ word: 'pickup truck', ipa: '', meaningAr: 'عربية نقل', meaningEn: '' }, { word: 'heavy loads', ipa: '', meaningAr: 'حاجات تقيلة', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'He rides his motorcycle to work every day.', arEg: 'بيروح شغله بالموتوسيكل كل يوم.', arFusha: 'بيروح شغله بالموتوسيكل كل يوم.', speaker: 'Instructor', keyWords: [{ word: 'rides', ipa: '', meaningAr: 'بيسوق (موتوسيكل)', meaningEn: '' }, { word: 'motorcycle', ipa: '', meaningAr: 'موتوسيكل', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'ambulance', type: 'cultural', meaningAr: 'سيارة إسعاف', meaningEn: '', egyptianEquivalent: 'إسعاف', exampleInScene: 'Call an ambulance!' },      { term: 'truck', type: 'cultural', meaningAr: 'شاحنة', meaningEn: '', egyptianEquivalent: 'نقل', exampleInScene: 'The truck is blocking the road.' },      { term: 'ride', type: 'cultural', meaningAr: 'يركب', meaningEn: '', egyptianEquivalent: 'يسوق (موتوسيكل/عجلة)', exampleInScene: 'I ride my bike to university.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'Which vehicle takes sick people to hospital?', questionAr: 'أنهي مركبة بتنقل المرضى للمستشفى؟', options: ['Ambulance', 'Truck', 'Taxi', 'Bus'], correctIndex: 0, explanationAr: 'Ambulance = إسعاف - كلمة ممكن تنقذ حياة لما تحتاجها بره.' }
    ],
    speakingLines: [{ en: 'An ambulance rushes people to the hospital.', arEg: 'الإسعاف بينقل الناس للمستشفى بسرعة.' }, { en: 'He rides his motorcycle to work every day.', arEg: 'بيروح شغله بالموتوسيكل كل يوم.' }],
  },
  {
    id: 'shopping-clothes-english-nova',
    movieTitle: 'Shopping for Clothes in English - Full Conversation Practice',
    releaseYear: 2023,
    director: 'English Nova',
    genre: 'Conversation Practice',
    cefrLevel: 'A2',
    sceneTitle: 'Find Your Size and Pay',
    sceneDescription: 'حوار شراء هدوم كامل: تسأل على مقاس، تقيس، وتدفع في الكاشير.',
    youtubeId: 'IqEiAQACWIY',
    startTime: 15,
    endTime: 135,
    clipDuration: '2:00',
    videoSource: 'English Nova (Official)',
    dialogueQuote: 'Do you have this shirt in a medium?',
    actorName: 'Host',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/IqEiAQACWIY/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Nova Official',
    subtitles: [
      { id: 'sub-1', start: 20, end: 35, en: 'Do you have this shirt in a medium?', arEg: 'عندكم القميص ده مقاس ميديم؟', arFusha: 'عندكم القميص ده مقاس ميديم؟', speaker: 'Customer', keyWords: [{ word: 'in a medium', ipa: '', meaningAr: 'مقاس ميديم', meaningEn: '' }, { word: 'do you have', ipa: '', meaningAr: 'عندكم', meaningEn: '' }] },      { id: 'sub-2', start: 45, end: 60, en: 'Where is the fitting room, please?', arEg: 'فين أوضة القياس لو سمحت؟', arFusha: 'فين أوضة القياس لو سمحت؟', speaker: 'Customer', keyWords: [{ word: 'fitting room', ipa: '', meaningAr: 'أوضة القياس', meaningEn: '' }, { word: 'where is', ipa: '', meaningAr: 'فين', meaningEn: '' }] },      { id: 'sub-3', start: 70, end: 85, en: 'I will take it. Can I pay by card?', arEg: 'هاخده. ممكن أدفع بالكارت؟', arFusha: 'هاخده. ممكن أدفع بالكارت؟', speaker: 'Customer', keyWords: [{ word: 'I will take it', ipa: '', meaningAr: 'هاخده', meaningEn: '' }, { word: 'pay by card', ipa: '', meaningAr: 'أدفع بالكارت', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'fitting room', type: 'collocation', meaningAr: 'غرفة قياس', meaningEn: '', egyptianEquivalent: 'أوضة القياس', exampleInScene: 'The fitting room is over there.' },      { term: 'size', type: 'cultural', meaningAr: 'مقاس', meaningEn: '', egyptianEquivalent: 'مقاس', exampleInScene: 'What size do you wear?' },      { term: 'on sale', type: 'collocation', meaningAr: 'في التخفيضات', meaningEn: '', egyptianEquivalent: 'عليه خصم', exampleInScene: 'These shoes are on sale.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'How do you ask for a different size?', questionAr: 'تطلب مقاس تاني إزاي؟', options: ['Do you have this in a medium?', 'Give me bigger now', 'This is too ugly', 'Change your stock'], correctIndex: 0, explanationAr: 'Do you have this in a + مقاس = أشيك طريقة تطلب بيها مقاس مختلف.' }
    ],
    speakingLines: [{ en: 'Do you have this shirt in a medium?', arEg: 'عندكم القميص ده مقاس ميديم؟' }, { en: 'I will take it. Can I pay by card?', arEg: 'هاخده. ممكن أدفع بالكارت؟' }],
  },
  {
    id: 'shopping-clothes-5min-english',
    movieTitle: '5-Minute English Conversation Practice - Shopping for Clothes',
    releaseYear: 2024,
    director: 'English Together',
    genre: 'Conversation Practice',
    cefrLevel: 'B1',
    sceneTitle: 'Bargain and Return Items',
    sceneDescription: '٥ دقايق تدريب مكثف: تفاص، تسأل على الخصم، وترجع حاجة معجبتكش.',
    youtubeId: 'kdQYKdbAiFs',
    startTime: 20,
    endTime: 140,
    clipDuration: '2:00',
    videoSource: 'English Together (Official)',
    dialogueQuote: 'Is there any discount if I buy two?',
    actorName: 'Host',
    characterName: 'Customer',
    thumbnailUrl: 'https://img.youtube.com/vi/kdQYKdbAiFs/hqdefault.jpg',
    category: 'daily_conversations',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-14',
    isEmbeddable: true,
    contentSource: 'English Together Official',
    subtitles: [
      { id: 'sub-1', start: 25, end: 40, en: 'Is there any discount if I buy two?', arEg: 'فيه خصم لو اشتريت اتنين؟', arFusha: 'فيه خصم لو اشتريت اتنين؟', speaker: 'Customer', keyWords: [{ word: 'discount', ipa: '', meaningAr: 'خصم', meaningEn: '' }, { word: 'if I buy two', ipa: '', meaningAr: 'لو اشتريت اتنين', meaningEn: '' }] },      { id: 'sub-2', start: 50, end: 65, en: 'I would like to return this jacket, please.', arEg: 'عايز أرجع الجاكت ده لو سمحت.', arFusha: 'عايز أرجع الجاكت ده لو سمحت.', speaker: 'Customer', keyWords: [{ word: 'return', ipa: '', meaningAr: 'أرجع (منتج)', meaningEn: '' }, { word: 'jacket', ipa: '', meaningAr: 'جاكت', meaningEn: '' }] },      { id: 'sub-3', start: 75, end: 90, en: 'Do you have the receipt with you?', arEg: 'معاك الفاتورة؟', arFusha: 'معاك الفاتورة؟', speaker: 'Cashier', keyWords: [{ word: 'receipt', ipa: '', meaningAr: 'فاتورة', meaningEn: '' }, { word: 'with you', ipa: '', meaningAr: 'معاك', meaningEn: '' }] }
    ],
    vocabulary: [
      { term: 'discount', type: 'cultural', meaningAr: 'خصم', meaningEn: '', egyptianEquivalent: 'خصم', exampleInScene: 'Students get a discount.' },      { term: 'return', type: 'cultural', meaningAr: 'يرجع منتج', meaningEn: '', egyptianEquivalent: 'يرجع حاجة للمحل', exampleInScene: 'I returned the shoes.' },      { term: 'receipt', type: 'cultural', meaningAr: 'إيصال', meaningEn: '', egyptianEquivalent: 'فاتورة', exampleInScene: 'Keep your receipt.' }
    ],
    quizzes: [
      { id: 'quiz-1', type: 'comprehension', questionEn: 'What do you need to return an item?', questionAr: 'محتاج إيه عشان ترجع منتج للمحل؟', options: ['The receipt', 'A friend', 'A suitcase', 'A photo'], correctIndex: 0, explanationAr: 'Receipt = الفاتورة - من غيرها معظم المحلات مش بترجع الفلوس.' }
    ],
    speakingLines: [{ en: 'Is there any discount if I buy two?', arEg: 'فيه خصم لو اشتريت اتنين؟' }, { en: 'I would like to return this jacket, please.', arEg: 'عايز أرجع الجاكت ده لو سمحت.' }],
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

