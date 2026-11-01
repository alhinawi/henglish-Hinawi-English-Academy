// ==============================================================================
// Henglish Academy (HENGLISH) - LEARN ENGLISH THROUGH MOVIES DATABASE
// Curated iconic movie clips from official studio channels with timecoded bilingual
// Egyptian Arabic subtitles, extracted vocabulary, comprehension quizzes, and echo lines.
// ==============================================================================

import { CEFRLevel } from '../types';

export interface SubtitleWord {
  word: string;
  ipa: string;
  meaningAr: string;
  meaningEn: string;
}

export interface TimedSubtitle {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  en: string;
  arEg: string;
  arFusha: string;
  speaker?: string;
  keyWords: SubtitleWord[];
}

export interface SceneVocabulary {
  term: string;
  type: 'idiom' | 'phrasal-verb' | 'collocation' | 'slang' | 'cultural';
  meaningAr: string;
  meaningEn: string;
  egyptianEquivalent: string;
  exampleInScene: string;
}

export interface SceneQuiz {
  id: string;
  type: 'comprehension' | 'missing-word' | 'idiom';
  questionEn: string;
  questionAr: string;
  options: string[];
  correctIndex: number; // 0-based
  explanationAr: string;
}

export interface MovieSceneItem {
  id: string;
  movieTitle: string;
  releaseYear: number;
  director: string;
  genre: string;
  cefrLevel: CEFRLevel;
  sceneTitle: string;
  sceneDescription: string;
  youtubeId: string;
  startTime: number;
  endTime: number;
  clipDuration: string;
  videoSource: string;
  dialogueQuote: string;
  actorName: string;
  characterName: string;
  thumbnailUrl?: string;
  category?: string;
  accent?: 'American' | 'British' | 'International';
  verificationStatus?: 'verified_playable' | 'embed_disabled' | 'unavailable' | 'private_or_deleted' | 'needs_review' | 'video_only';
  lastVerifiedAt?: string;
  isEmbeddable?: boolean;
  subtitles: TimedSubtitle[];
  vocabulary: SceneVocabulary[];
  quizzes: SceneQuiz[];
  speakingLines: { en: string; arEg: string; targetSpeed?: number }[];
}

export const MOVIE_SCENES_CATALOG: MovieSceneItem[] = [
  {
    id: 'scene-godfather-offer',
    movieTitle: 'The Godfather',
    releaseYear: 1972,
    director: 'Francis Ford Coppola',
    genre: 'Crime / Drama',
    cefrLevel: 'B2',
    sceneTitle: 'An Offer He Can\'t Refuse',
    sceneDescription: 'Don Vito Corleone comforts his godson Johnny Fontane and guarantees his breakthrough in Hollywood.',
    youtubeId: 'D6me2-OurCw',
    startTime: 10,
    endTime: 95,
    clipDuration: '1:25',
    videoSource: 'Paramount Pictures (Official)',
    dialogueQuote: "I'm going to make him an offer he can't refuse.",
    actorName: 'Marlon Brando',
    characterName: 'Don Vito Corleone',
    thumbnailUrl: 'https://img.youtube.com/vi/D6me2-OurCw/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    subtitles: [
      {
        id: 'sub-1',
        start: 12,
        end: 18,
        en: 'You spend time with your family? Good. Because a man who doesn\'t spend time with his family can never be a real man.',
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
        en: 'Now, tell me about this movie producer. Why won\'t he give you the part in the film?',
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
        en: 'He says I\'m too old, and he wants to teach me a lesson for leaving the band.',
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
        en: 'You look like a Hollywood star. Now, you listen to me. You will get the part. I\'m going to make him an offer he can\'t refuse.',
        arEg: 'أنت شكلك نجم هوليوود يملى العين. اسمعني كويس، أنت هتاخد الدور ده. أنا هقدمله عرض ميعرفش يرفضه أبداً.',
        arFusha: 'أنت تبدو كنجم هوليوود حقيقي. استمع إلي جيداً: ستحصل على هذا الدور. سأقدم له عرضاً لن يستطيع رفضه.',
        speaker: 'Don Corleone',
        keyWords: [
          { word: 'offer he can\'t refuse', ipa: '/ˈɔːfər hiː kænt rɪˈfjuːz/', meaningAr: 'عرض ميترفضش (وفيه تهديد مبطن)', meaningEn: 'an offer backed by irresistible force' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'make an offer one can\'t refuse',
        type: 'idiom',
        meaningAr: 'عرض إجباري لا يقبل الرفض بسبب قوة أو نفوذ من يقدمه',
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
        explanationAr: 'كورليوني يوضح في المشهد: "A man who doesn\'t spend time with his family can never be a real man" (الرجل الذي لا يقضي وقتاً مع عائلته لا يمكن أن يكون رجلاً حقيقياً).',
      },
      {
        id: 'quiz-2',
        type: 'missing-word',
        questionEn: 'Complete the iconic quote: "I\'m going to make him an offer he can\'t _______."',
        questionAr: 'أكمل الاقتباس العالمي الشهير من المشهد:',
        options: ['accept', 'refuse', 'ignore', 'understand'],
        correctIndex: 1,
        explanationAr: 'الكلمة الصحيحة هي "refuse" (يرفض).',
      },
    ],
    speakingLines: [
      { en: "I'm going to make him an offer he can't refuse.", arEg: 'أنا هقدمله عرض ميعرفش يرفضه أبداً.' },
      { en: "A man who doesn't spend time with his family can never be a real man.", arEg: 'الراجل اللي مبيقضيش وقت مع عيلته عمره ما هيبقى راجل بجد.' },
    ],
  },
  {
    id: 'scene-forrest-gump-chocolates',
    movieTitle: 'Forrest Gump',
    releaseYear: 1994,
    director: 'Robert Zemeckis',
    genre: 'Drama / Romance',
    cefrLevel: 'A2',
    sceneTitle: 'Life is Like a Box of Chocolates',
    sceneDescription: 'Sitting at the bus stop bench in Savannah, Forrest shares wisdom his mother gave him.',
    youtubeId: 'vdtqSaJO-iM',
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
    subtitles: [
      {
        id: 'sub-1',
        start: 6,
        end: 15,
        en: 'Hello. My name\'s Forrest, Forrest Gump. Do you want a chocolate?',
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
        en: 'I could eat about a million and a half of these. My mama always said life was like a box of chocolates.',
        arEg: 'أنا ممكن آكل منها يجي مليون ونص حتة. أمي دايماً كانت بتقول لي: الدنيا عاملة زي علبة الشوكولاتة.',
        arFusha: 'يمكنني تناول مليون ونصف من هذه القطع. كانت أمي تقول لي دائماً: الحياة تشبه علبة من الشوكولاتة.',
        speaker: 'Forrest Gump',
        keyWords: [
          { word: 'box of chocolates', ipa: '/bɒks əv ˈtʃɒklɪts/', meaningAr: 'علبة شوكولاتة مشكلة', meaningEn: 'assorted chocolates' },
        ],
      },
      {
        id: 'sub-3',
        start: 35,
        end: 50,
        en: 'You never know what you\'re gonna get.',
        arEg: 'عمرك ما هتعرف الحتة اللي هتطلع في إيدك هتكون إيه!',
        arFusha: 'فأنت لا تدري قط ما الذي ستحصل عليه.',
        speaker: 'Forrest Gump',
        keyWords: [
          { word: 'gonna', ipa: '/ˈɡənə/', meaningAr: 'رايح / هـ (العامية الأمريكية لـ going to)', meaningEn: 'informal for going to' },
        ],
      },
      {
        id: 'sub-4',
        start: 55,
        end: 72,
        en: 'Those must be comfortable shoes. I bet you could walk all day in shoes like that and not feel a thing.',
        arEg: 'الجزمة دي شكلها مريح جداً. أراهنك إنك تقدري تمشي بيها اليوم كله ومتحسيش بأي تعب.',
        arFusha: 'لا بد وأن هذا الحذاء مريح للغاية. أراهن أنكِ تستطيعين المشي طوال اليوم به دون أن تشعري بأي تعب.',
        speaker: 'Forrest Gump',
        keyWords: [
          { word: 'comfortable', ipa: '/ˈkʌmftəbəl/', meaningAr: 'مريح جداً', meaningEn: 'providing physical ease' },
          { word: 'I bet', ipa: '/aɪ bɛt/', meaningAr: 'أراهنك / أنا متأكد', meaningEn: 'I am certain' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'life is like a box of chocolates',
        type: 'idiom',
        meaningAr: 'الحياة مليئة بالمفاجآت غير المتوقعة ولا يمكن التنبؤ بما ستأتيك به الأيام',
        meaningEn: 'Life is unpredictable and brings surprises',
        egyptianEquivalent: 'الدنيا يا نصيب، ومتعرفش بكرة مخبي إيه',
        exampleInScene: "Life was like a box of chocolates. You never know what you're gonna get.",
      },
      {
        term: 'I bet',
        type: 'collocation',
        meaningAr: 'أنا واثق / أراهنك على ذلك',
        meaningEn: 'Used to express confidence in an observation',
        egyptianEquivalent: 'أراهنك على كدة / أنا متأكد',
        exampleInScene: 'I bet you could walk all day in shoes like that.',
      },
    ],
    quizzes: [
      {
        id: 'quiz-fg-1',
        type: 'comprehension',
        questionEn: 'What is the main meaning behind the "box of chocolates" metaphor?',
        questionAr: 'ما هي الرسالة الحياتية وراء تشبيه الحياة بـ "علبة الشوكولاتة"؟',
        options: [
          'Chocolates are expensive and rare',
          'Life is unpredictable and full of surprises',
          'Everyone should eat sweets everyday',
          'Life is always disappointing',
        ],
        correctIndex: 1,
        explanationAr: 'التشبيه يوضح أن الحياة غير متوقعة وتفاجئك دائماً بأحداث لا تعرفها مسبقاً (You never know what you\'re gonna get).',
      },
    ],
    speakingLines: [
      { en: "Life was like a box of chocolates. You never know what you're gonna get.", arEg: 'الحياة عاملة زي علبة الشوكولاتة، عمرك ما هتعرف الحتة اللي هتطلعلك إيه.' },
    ],
  },
  {
    id: 'scene-dark-knight-defines',
    movieTitle: 'The Dark Knight / Batman Begins',
    releaseYear: 2008,
    director: 'Christopher Nolan',
    genre: 'Action / Thriller',
    cefrLevel: 'B2',
    sceneTitle: 'It\'s Not Who I Am Underneath',
    sceneDescription: 'Bruce Wayne reveals his true identity through his philosophy on action versus intention.',
    youtubeId: 'H19vDg1iLRs',
    startTime: 20,
    endTime: 85,
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
    subtitles: [
      {
        id: 'sub-1',
        start: 22,
        end: 32,
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
        start: 35,
        end: 48,
        en: 'It\'s not who you are underneath, it\'s what you do that defines you.',
        arEg: 'المهم مش أنت مين من جوا، أفعالك وتصرفاتك هي اللي بتحدد قيمتك الحقيقية.',
        arFusha: 'الأمر لا يتعلق بما أنت عليه في باطنك، بل بما تفعله وتصنعه هو ما يحدد حقيقتك.',
        speaker: 'Rachel Dawes',
        keyWords: [
          { word: 'underneath', ipa: '/ˌʌndərˈniːθ/', meaningAr: 'في الباطن / من الداخل', meaningEn: 'beneath the surface' },
          { word: 'defines', ipa: '/dɪˈfaɪnz/', meaningAr: 'يحدد الهوية والقيمة', meaningEn: 'determines character' },
        ],
      },
      {
        id: 'sub-3',
        start: 55,
        end: 75,
        en: 'It\'s not who I am underneath, but what I do that defines me.',
        arEg: 'مش المهم أنا مين في الباطن، تصرفاتي وأفعالي هي اللي بتحدد أنا مين بجد.',
        arFusha: 'ليست حقيقتي فيما أضمره في أعماقي، بل ما أفعله وأنجزه هو ما يحدد هويتي.',
        speaker: 'Batman',
        keyWords: [
          { word: 'cleft structure', ipa: '/klɛft/', meaningAr: 'أسلوب توكيد بالتركيز على الفعل', meaningEn: 'emphatic grammatical clause' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'deep down',
        type: 'idiom',
        meaningAr: 'في قرارة النفس / في أعماق القلب الحقيقية',
        meaningEn: 'In reality, beneath superficial outward appearances',
        egyptianEquivalent: 'في قرارة نفسه / من جواه',
        exampleInScene: 'Deep down you may still be that same guy.',
      },
      {
        term: 'what defines someone',
        type: 'collocation',
        meaningAr: 'ما يحدد جوهر شخصية الإنسان الحقيقية',
        meaningEn: 'The deeds that reveal true moral character',
        egyptianEquivalent: 'أفعالك هي اللي بتبين أنت مين بجد',
        exampleInScene: "What I do that defines me.",
      },
    ],
    quizzes: [
      {
        id: 'quiz-dk-1',
        type: 'comprehension',
        questionEn: 'According to Batman, how is a person ultimately judged and defined?',
        questionAr: 'طبقاً لفلسفة باتمان في المشهد، كيف يُحكم على الشخص ويُعرف جوهره؟',
        options: [
          'By their wealth and family heritage',
          'By their actions and what they actually do',
          'By their private thoughts and feelings',
          'By their popularity in Gotham',
        ],
        correctIndex: 1,
        explanationAr: 'الجملة الشهيرة توضح: "what I do that defines me" أي أن أفعال الإنسان العملية وتصرفاته هي التي تحدد هويته وليس مشاعره الدفينة.',
      },
    ],
    speakingLines: [
      { en: "It's not who I am underneath, but what I do that defines me.", arEg: 'مش المهم أنا مين من جوا، تصرفاتي وأفعالي هي اللي بتحدد قيمتي بجد.' },
    ],
  },
  {
    id: 'scene-dead-poets-seize',
    movieTitle: 'Dead Poets Society',
    releaseYear: 1989,
    director: 'Peter Weir',
    genre: 'Drama / Comedy',
    cefrLevel: 'C1',
    sceneTitle: 'Carpe Diem — Seize the Day',
    sceneDescription: 'Mr. Keating takes his students into the hallway to view old photographs of former pupils.',
    youtubeId: 'vi0Lbjs5ECI',
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
    subtitles: [
      {
        id: 'sub-1',
        start: 18,
        end: 32,
        en: 'They\'re not that different from you, are they? Same haircuts. Full of hormones, just like you.',
        arEg: 'هما مش مختلفين عنكم أوي، صح؟ نفس قصات الشعر، ونفس فوران الشباب وطاقتهم، زيكم بالظبط.',
        arFusha: 'إنهم لا يختلفون عنكم كثيراً، أليس كذلك؟ تسريحات الشعر ذاتها، ملؤهم الحيوية وعنفوان الشباب، تماماً مثلكم.',
        speaker: 'John Keating',
        keyWords: [
          { word: 'haircuts', ipa: '/ˈhɛərkʌts/', meaningAr: 'قصات شعر', meaningEn: 'style of hair' },
          { word: 'hormones', ipa: '/ˈhɔːrmoʊnz/', meaningAr: 'هرمونات وحيوية الشباب', meaningEn: 'chemical messengers / youth energy' },
        ],
      },
      {
        id: 'sub-2',
        start: 35,
        end: 50,
        en: 'Invincible, just like you feel. The world is their oyster. They believe they\'re destined for great things.',
        arEg: 'حاسين إنهم لا يقهروا، زي ما أنتم حاسين دلوقتي. الدنيا مفتوحة قدامهم، ومقتنعين إنهم مخلوقين لحاجات عظيمة.',
        arFusha: 'لا يقهرون، تماماً كما تشعرون أنتم. العالم بأسره طوع بنانهم، ويؤمنون بأنهم خُلقوا لإنجاز العظائم.',
        speaker: 'John Keating',
        keyWords: [
          { word: 'invincible', ipa: '/ɪnˈvɪnsəbəl/', meaningAr: 'لا يُقهر ولا يُغلب', meaningEn: 'too powerful to be defeated' },
          { word: 'the world is their oyster', ipa: '/ðə wɜːrld ɪz ðeər ˈɔɪstər/', meaningAr: 'الدنيا كلها قدامهم وتحت أمرهم', meaningEn: 'in a position to take advantage of life\'s opportunities' },
          { word: 'destined for', ipa: '/ˈdɛstɪnd fɔːr/', meaningAr: 'مُقدر له أن يحقق', meaningEn: 'fated to achieve' },
        ],
      },
      {
        id: 'sub-3',
        start: 55,
        end: 78,
        en: 'Carpe diem. Seize the day, boys. Make your lives extraordinary.',
        arEg: 'انتهزوا الفرصة وعيشوا اللحظة يا شباب.. خلوا حياتكم غير عادية وخارجة عن المألوف.',
        arFusha: 'اغتنموا يومكم واقتنصوا اللحظة يا فتية.. اجعلوا حيواتكم استثنائية وباهرة.',
        speaker: 'John Keating',
        keyWords: [
          { word: 'Carpe diem', ipa: '/ˈkɑːrpeɪ ˈdiːɛm/', meaningAr: 'اغتنم اليوم / اللاتينية الشهيرة', meaningEn: 'Latin: seize the day' },
          { word: 'extraordinary', ipa: '/ɪkˈstrɔːrdəneri/', meaningAr: 'استثنائي وفوق العادي', meaningEn: 'very unusual, remarkable' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'seize the day',
        type: 'idiom',
        meaningAr: 'اغتنم يومك واستغل فرصتك في الحاضر قبل فوات الأوان',
        meaningEn: 'To take advantage of present opportunities without worrying about tomorrow',
        egyptianEquivalent: 'عيش اللحظة واستغل كل دقيقة ومتضيعش وقتك',
        exampleInScene: 'Carpe diem. Seize the day, boys.',
      },
      {
        term: 'the world is one\'s oyster',
        type: 'idiom',
        meaningAr: 'العالم كله مفتوح أمامه ولديه كل الفرص لتحقيق ما يشاء',
        meaningEn: 'Having all the opportunities and freedom in the world to succeed',
        egyptianEquivalent: 'الدنيا كلها بين إيديه وفاتحة له دراعاتها',
        exampleInScene: 'The world is their oyster.',
      },
    ],
    quizzes: [
      {
        id: 'quiz-dps-1',
        type: 'comprehension',
        questionEn: 'What Latin phrase translates directly to "Seize the day"?',
        questionAr: 'ما هي العبارة اللاتينية التاريخية التي تترجم إلى "Seize the day"؟',
        options: ['Ad astra', 'Carpe diem', 'Veni vidi vici', 'Status quo'],
        correctIndex: 1,
        explanationAr: 'العبارة اللاتينية هي "Carpe diem" وتعني اقتناص اليوم واستغلال اللحظة الحاضرة.',
      },
    ],
    speakingLines: [
      { en: "Carpe diem. Seize the day, boys. Make your lives extraordinary.", arEg: 'اغتنموا اللحظة يا شباب.. خلوا حياتكم استثنائية وغير عادية.' },
    ],
  },
  {
    id: 'scene-terminator-back',
    movieTitle: 'The Terminator',
    releaseYear: 1984,
    director: 'James Cameron',
    genre: 'Sci-Fi / Action',
    cefrLevel: 'A1',
    sceneTitle: 'I\'ll Be Right Back',
    sceneDescription: 'The T-800 enters the police precinct looking for Sarah Connor and delivers cinema history\'s most quoted one-liner.',
    youtubeId: 'tYc2jQaM8gM',
    startTime: 10,
    endTime: 60,
    clipDuration: '0:50',
    videoSource: 'Metro-Goldwyn-Mayer / Orion Pictures',
    dialogueQuote: "I'll be right back.",
    actorName: 'Arnold Schwarzenegger',
    characterName: 'The Terminator (T-800)',
    thumbnailUrl: 'https://img.youtube.com/vi/tYc2jQaM8gM/hqdefault.jpg',
    category: 'movie_scenes',
    accent: 'American',
    verificationStatus: 'verified_playable',
    lastVerifiedAt: '2026-11-01',
    isEmbeddable: true,
    subtitles: [
      {
        id: 'sub-1',
        start: 12,
        end: 22,
        en: 'I\'m a friend of Sarah Connor. I was told that she was here. Could I see her, please?',
        arEg: 'أنا صاحب سارة كونور. قالولي إنها هنا، ممكن أشوفها بعد إذنك؟',
        arFusha: 'أنا صديق لسارة كونور. قيل لي إنها موجودة هنا، هل يمكنني مقابلتها لو سمحت؟',
        speaker: 'The Terminator',
        keyWords: [
          { word: 'friend', ipa: '/frɛnd/', meaningAr: 'صديق', meaningEn: 'companion' },
          { word: 'see her', ipa: '/siː hɜːr/', meaningAr: 'يقابلها', meaningEn: 'meet with her' },
        ],
      },
      {
        id: 'sub-2',
        start: 25,
        end: 35,
        en: 'No, you can\'t see her right now. She\'s making a statement. You can wait over there in the lobby.',
        arEg: 'لأ، مش هينفع تشوفها دلوقتي خالص. هي بتدلي بأقوالها، تقدر تستنى هناك في الصالة.',
        arFusha: 'كلا، لا يمكنك رؤيتها الآن، فهي تدلي بأقوالها. يمكنك الانتظار هناك في بهو الاستقبال.',
        speaker: 'Desk Sergeant',
        keyWords: [
          { word: 'statement', ipa: '/ˈsteɪtmənt/', meaningAr: 'أقوال / إفادة رسمية', meaningEn: 'official police report' },
          { word: 'lobby', ipa: '/ˈlɒbi/', meaningAr: 'بهو الاستقبال', meaningEn: 'waiting hall' },
        ],
      },
      {
        id: 'sub-3',
        start: 40,
        end: 48,
        en: 'I\'ll be back.',
        arEg: 'هرجعلكم تاني.. (وراها مصيبة).',
        arFusha: 'سوف أعود ثانية.',
        speaker: 'The Terminator',
        keyWords: [
          { word: 'I\'ll be back', ipa: '/aɪl biː bæk/', meaningAr: 'هرجع تاني (وعد بالعودة)', meaningEn: 'future return commitment' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'I\'ll be back / I\'ll be right back',
        type: 'idiom',
        meaningAr: 'سأعود في الحال / راجعلك تاني',
        meaningEn: 'A spoken promise that one will return soon',
        egyptianEquivalent: 'ثانية وراجعلك / هرجعلك تاني حالا',
        exampleInScene: "I'll be back.",
      },
    ],
    quizzes: [
      {
        id: 'quiz-term-1',
        type: 'comprehension',
        questionEn: 'What grammatical contraction does "I\'ll" stand for in the sentence "I\'ll be back"?',
        questionAr: 'ما هو الأصل الكامل للاختصار "I\'ll" في الجملة الشهيرة؟',
        options: ['I will', 'I shall', 'I would', 'I could'],
        correctIndex: 0,
        explanationAr: '"I\'ll" هو الاختصار القياسي لـ "I will" للتعبير عن المستقبل البسيط.',
      },
    ],
    speakingLines: [
      { en: "I'll be right back.", arEg: 'راجعلك تاني حالا.' },
      { en: "I'll be back.", arEg: 'هرجعلكم تاني.' },
    ],
  },
  {
    id: 'scene-pursuit-dream',
    movieTitle: 'The Pursuit of Happyness',
    releaseYear: 2006,
    director: 'Gabriele Muccino',
    genre: 'Biography / Drama',
    cefrLevel: 'B1',
    sceneTitle: 'Protect Your Dream',
    sceneDescription: 'Chris Gardner gives unforgettable advice to his young son Christopher on a basketball court.',
    youtubeId: 'UZb2NOHPA2A',
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
    subtitles: [
      {
        id: 'sub-1',
        start: 18,
        end: 32,
        en: 'Don\'t ever let somebody tell you you can\'t do something. Not even me. All right?',
        arEg: 'إياك في يوم تخلي حد يقولك إنك متعرفش تعمل حاجة، حتى لو كنت أنا.. اتفقنا؟',
        arFusha: 'إياك أن تدع أحداً يخبرك بأنك عاجز عن تحقيق شيء ما، حتى لو كان ذلك الشخص أنا.. مفهوم؟',
        speaker: 'Chris Gardner',
        keyWords: [
          { word: 'don\'t ever let', ipa: '/doʊnt ˈɛvər lɛt/', meaningAr: 'إياك أن تسمح أبداً', meaningEn: 'never permit' },
        ],
      },
      {
        id: 'sub-2',
        start: 35,
        end: 45,
        en: 'You got a dream... you gotta protect it.',
        arEg: 'لو عندك حلم في حياتك.. لازم تحميه بكل قوتك.',
        arFusha: 'إذا كان لديك حلم.. فعليك أن تحميه وتصونه.',
        speaker: 'Chris Gardner',
        keyWords: [
          { word: 'gotta', ipa: '/ˈɡɒtə/', meaningAr: 'لازم / يجب عليك (العامية لـ have got to)', meaningEn: 'informal for must / have got to' },
          { word: 'protect', ipa: '/prəˈtɛkt/', meaningAr: 'يحمي ويصون', meaningEn: 'guard, defend' },
        ],
      },
      {
        id: 'sub-3',
        start: 48,
        end: 65,
        en: 'People can\'t do something themselves, they want to tell you you can\'t do it. If you want something, go get it. Period.',
        arEg: 'الناس اللي فاشلة ومش عارفة تحقق حاجة بنفسها، بيبقوا عايزين يقولولك إنك أنت كمان مش هتقدر. لو عايز حاجة، روح هاتها وعافر عشانها.. نقطة ومن أول السطر.',
        arFusha: 'حين يعجز الناس عن تحقيق شيء بأنفسهم، يرغبون في إخبارك بأنك عاجز عن فعله أيضاً. إذا أردت شيئاً، فاذهب وانتزعه.. انتهى الكلام.',
        speaker: 'Chris Gardner',
        keyWords: [
          { word: 'period', ipa: '/ˈpɪəriəd/', meaningAr: 'نقطة ومن أول السطر / انتهى النقاش', meaningEn: 'no further discussion permitted' },
          { word: 'go get it', ipa: '/ɡoʊ ɡɛt ɪt/', meaningAr: 'روح هاتها وعافر عشانها', meaningEn: 'actively pursue and obtain' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'you gotta protect it',
        type: 'phrasal-verb',
        meaningAr: 'يجب عليك حماية هدفك وحلمك من المثبطين والمحبطين',
        meaningEn: 'Must vigorously defend one\'s ambitions against detractors',
        egyptianEquivalent: 'لازم تحمي حلمك ومحدش يكسر مقاديفك',
        exampleInScene: 'You got a dream... you gotta protect it.',
      },
      {
        term: 'Period.',
        type: 'idiom',
        meaningAr: 'نقطة انتهى / ليس هناك مجال للمناقشة',
        meaningEn: 'Used to indicate that a statement is final and non-negotiable',
        egyptianEquivalent: 'نقطة ومن أول السطر / مفيهاش كلام',
        exampleInScene: 'If you want something, go get it. Period.',
      },
    ],
    quizzes: [
      {
        id: 'quiz-poh-1',
        type: 'comprehension',
        questionEn: 'Why do other people try to tell you that you cannot do something, according to Chris Gardner?',
        questionAr: 'لماذا يحاول بعض الناس إحباطك وإخبارك أنك عاجز عن فعل شيء، بحسب كلام كريس غاردنر؟',
        options: [
          'Because they are wiser than you',
          'Because they cannot do it themselves',
          'Because it is truly impossible',
          'Because they want to save your money',
        ],
        correctIndex: 1,
        explanationAr: 'يوضح كريس أن الناس عندما يعجزون عن فعل الشيء بأنفسهم يرغبون في إيهامك بأنك عاجز أيضاً (People can\'t do something themselves, they want to tell you you can\'t do it).',
      },
    ],
    speakingLines: [
      { en: "Don't ever let somebody tell you you can't do something. Not even me.", arEg: 'إياك تخلي حد يقولك إنك متعرفش تعمل حاجة، حتى لو كنت أنا.' },
      { en: "If you want something, go get it. Period.", arEg: 'لو عايز حاجة، روح هاتها وعافر عشانها.. نقطة ومن أول السطر.' },
    ],
  },
  {
    id: 'scene-jerry-maguire-hello',
    movieTitle: 'Jerry Maguire',
    releaseYear: 1996,
    director: 'Cameron Crowe',
    genre: 'Comedy / Drama / Romance',
    cefrLevel: 'B2',
    sceneTitle: 'You Had Me at Hello',
    sceneDescription: 'Jerry Maguire arrives at Dorothy\'s house and delivers a heartfelt confession in front of her friends.',
    youtubeId: 'AyrP-pwDayE',
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
        arEg: 'اسكت.. خلاص متكملش كلام.',
        arFusha: 'اصمت.. فقط اصمت ولا تكمل.',
        speaker: 'Dorothy Boyd',
        keyWords: [
          { word: 'shut up', ipa: '/ʃʌt ʌp/', meaningAr: 'اسكت / متكملش (عاطفية هنا)', meaningEn: 'affectionate stop speaking' },
        ],
      },
      {
        id: 'sub-3',
        start: 48,
        end: 65,
        en: 'You had me at hello. You had me at hello.',
        arEg: 'أنت أسرت قلبي من أول كلمة "أهلاً".. من أول نظرة ولقاء وأنا خلاص بتاعتك.',
        arFusha: 'لقد ملكت قلبي منذ كلمة "مرحباً" الأولى.. منذ اللحظة الأولى وأنا لك.',
        speaker: 'Dorothy Boyd',
        keyWords: [
          { word: 'you had me at hello', ipa: '/juː hæd miː æt həˈloʊ/', meaningAr: 'سحرتني من أول كلمة ومكنتش محتاج تتكلم', meaningEn: 'fell in love from the very first greeting' },
        ],
      },
    ],
    vocabulary: [
      {
        term: 'you had me at hello',
        type: 'idiom',
        meaningAr: 'وقعت في حبك وأسرتني منذ اللحظة الأولى ومحادثتك الأولى دون الحاجة لأي كلام منمق',
        meaningEn: 'I was won over or fell in love from the very first moment we met',
        egyptianEquivalent: 'أنت خطفت قلبي من أول نظرة ومن أول "أزيك"',
        exampleInScene: 'You had me at hello.',
      },
      {
        term: 'you complete me',
        type: 'collocation',
        meaningAr: 'أنت تكمل روحي وتجعلني إنساناً كاملاً',
        meaningEn: 'You make my life whole and meaningful',
        egyptianEquivalent: 'أنت بتكملني ومالي عليا دنيتي',
        exampleInScene: 'I love you. You complete me.',
      },
    ],
    quizzes: [
      {
        id: 'quiz-jm-1',
        type: 'comprehension',
        questionEn: 'What does the expression "You had me at hello" mean?',
        questionAr: 'ما هو المعنى الدقيق للتعبير الرومانسي الشهير "You had me at hello"؟',
        options: [
          'You should have said goodbye immediately',
          'I was won over from the very first moment we greeted each other',
          'You talk too much on the telephone',
          'I didn\'t understand your accent',
        ],
        correctIndex: 1,
        explanationAr: 'التعبير يعني أن الشخص قد فاز بقلب الطرف الآخر منذ كلمة الترحيب الأولى ولم يكن بحاجة لكل تلك التبريرات اللاحقة.',
      },
    ],
    speakingLines: [
      { en: "You had me at hello.", arEg: 'أنت أسرت قلبي من أول كلمة "أهلاً".' },
      { en: "You complete me.", arEg: 'أنتي بتكمليني ومالية عليا دنيتي.' },
    ],
  },
];
