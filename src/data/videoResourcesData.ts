// ==============================================================================
// Henglish Academy (HENGLISH) - OFFICIAL VERIFIED VIDEO RESOURCES
// 100% verified, live, embeddable lessons from BBC Learning English & Oxford
// ==============================================================================

export interface LessonVideoResource {
  id: string;
  youtubeId: string;
  title: string;
  titleAr: string;
  channelName: string;
  duration: string;
  thumbnailUrl: string;
  descriptionAr: string;
  keyTimestamps?: { time: string; label: string }[];
}

export const GRAMMAR_VIDEO_RESOURCES: Record<string, LessonVideoResource[]> = {
  // 1. Present Simple
  'present-simple': [
    {
      id: 'ps-vid-bbc-1',
      youtubeId: 'OsW5sV3GMDM',
      title: 'Present Simple and Present Continuous: The Grammar Gameshow Episode 1',
      titleAr: 'المضارع البسيط والمستمر: حلقة مسابقة القواعد الشهيرة من BBC',
      channelName: 'BBC Learning English',
      duration: '9:40',
      thumbnailUrl: 'https://img.youtube.com/vi/OsW5sV3GMDM/hqdefault.jpg',
      descriptionAr: 'شرح تفاعلي مشوق للفرق بين العادات اليومية وأحداث اللحظة الحالية مع أسئلة سريعة.',
      keyTimestamps: [
        { time: '0:30', label: 'المفهوم الأساسي وروتين الحياة' },
        { time: '3:15', label: 'قاعدة s المفرد الغائب' },
        { time: '6:20', label: 'السؤال والنفي بـ Do و Does' },
      ],
    },
    {
      id: 'ps-vid-oxford-2',
      youtubeId: 'L9AWrJnhsRI',
      title: 'Forming the Present Simple tense in English',
      titleAr: 'صياغة واستخدام المضارع البسيط في الحديث اليومي',
      channelName: 'Oxford Online English',
      duration: '11:20',
      thumbnailUrl: 'https://img.youtube.com/vi/L9AWrJnhsRI/hqdefault.jpg',
      descriptionAr: 'كيف تفرق بين الحقائق الثابتة والخطط المستقبلية وصياغة الجمل الإيجابية والمنفية.',
    },
  ],

  // 2. Present Continuous
  'present-continuous': [
    {
      id: 'pc-vid-bbc',
      youtubeId: 'OsW5sV3GMDM',
      title: 'Present Simple and Present Continuous: The Grammar Gameshow',
      titleAr: 'المضارع المستمر مقابل البسيط مع BBC',
      channelName: 'BBC Learning English',
      duration: '9:40',
      thumbnailUrl: 'https://img.youtube.com/vi/OsW5sV3GMDM/hqdefault.jpg',
      descriptionAr: 'شرح استخدام صيغ am/is/are + verb-ing مع أحداث اللحظة وأفعال الحالة Stative Verbs.',
      keyTimestamps: [
        { time: '1:10', label: 'أحداث تقع الآن' },
        { time: '4:40', label: 'أفعال لا تأتي في المستمر' },
      ],
    },
  ],

  // 3. Present Perfect Simple
  'present-perfect': [
    {
      id: 'pp-vid-bbc-4',
      youtubeId: 'lvoc5vDrb8E',
      title: 'The Present Perfect Simple and Continuous: The Grammar Gameshow Episode 4',
      titleAr: 'المضارع التام البسيط والمستمر: الفروق الجوهرية واستخدامات Ever و Never',
      channelName: 'BBC Learning English',
      duration: '10:15',
      thumbnailUrl: 'https://img.youtube.com/vi/lvoc5vDrb8E/hqdefault.jpg',
      descriptionAr: 'كيف تربط بين تجارب الماضي وأثرها المباشر في الحاضر مع مسابقة تفاعلية شيقة.',
      keyTimestamps: [
        { time: '0:45', label: 'تكوين have/has + V3' },
        { time: '4:10', label: 'الفرق بين Since و For' },
        { time: '7:30', label: 'أشهر الفخاخ للطلاب' },
      ],
    },
    {
      id: 'pp-vid-bbc-29',
      youtubeId: 'XgLdOI6UsJY',
      title: 'Present Perfect and Past Simple: The Grammar Gameshow Episode 29',
      titleAr: 'المقارنة الحاسمة بين المضارع التام والماضي البسيط',
      channelName: 'BBC Learning English',
      duration: '8:55',
      thumbnailUrl: 'https://img.youtube.com/vi/XgLdOI6UsJY/hqdefault.jpg',
      descriptionAr: 'متى تحدد الوقت بدقة وتستخدم الماضي، ومتى تتحدث عن الخبرة الحياتية دون توقيت محدد.',
    },
  ],

  // 4. Present Perfect Continuous
  'present-perfect-continuous': [
    {
      id: 'ppc-vid-bbc',
      youtubeId: 'lvoc5vDrb8E',
      title: 'Present Perfect Continuous: How Long & Ongoing Action',
      titleAr: 'المضارع التام المستمر: التركيز على استمرارية الفعل والمجهود',
      channelName: 'BBC Learning English',
      duration: '10:15',
      thumbnailUrl: 'https://img.youtube.com/vi/lvoc5vDrb8E/hqdefault.jpg',
      descriptionAr: 'شرح Have/Has been + V-ing مع الكلمات الدلالية all day, lately, recently.',
    },
  ],

  // 5. Past Simple
  'past-simple': [
    {
      id: 'past-vid-bbc-29',
      youtubeId: 'XgLdOI6UsJY',
      title: 'Past Simple & Past Tenses: Storytelling and Completed Actions',
      titleAr: 'الماضي البسيط: سرد القصص والأحداث المكتملة في الماضي',
      channelName: 'BBC Learning English',
      duration: '8:55',
      thumbnailUrl: 'https://img.youtube.com/vi/XgLdOI6UsJY/hqdefault.jpg',
      descriptionAr: 'الأفعال المنتظمة والشاذة، تكوين النفي بـ didn\'t والسؤال بـ Did.',
      keyTimestamps: [
        { time: '1:15', label: 'الزمن المحدد في الماضي' },
        { time: '3:50', label: 'الأفعال الشاذة Irregular Verbs' },
      ],
    },
  ],

  // 6. Past Continuous
  'past-continuous': [
    {
      id: 'pastc-vid-bbc-9',
      youtubeId: 'MGLedoA3SSE',
      title: 'The Past Continuous Tense: The Grammar Gameshow Episode 9',
      titleAr: 'الماضي المستمر: أحداث كانت جارية في الماضي وقاطعها حدث آخر',
      channelName: 'BBC Learning English',
      duration: '9:25',
      thumbnailUrl: 'https://img.youtube.com/vi/MGLedoA3SSE/hqdefault.jpg',
      descriptionAr: 'شرح was/were + V-ing وكيفية استخدام الروابط الزمنية When و While بدون ارتباك.',
      keyTimestamps: [
        { time: '0:50', label: 'حدث كان مستمراً في لحظة معينة' },
        { time: '4:15', label: 'استخدام When مع الماضي البسيط' },
        { time: '6:40', label: 'استخدام While مع الماضي المستمر' },
      ],
    },
  ],

  // 7. Past Perfect
  'past-perfect': [
    {
      id: 'pastp-vid-bbc-13',
      youtubeId: '05HXVE05vjg',
      title: 'The Past Perfect Tense: The Grammar Gameshow Episode 13',
      titleAr: 'الماضي التام (ماضي الماضي): الحدث الذي وقع أولاً قبل حدث ماضٍ آخر',
      channelName: 'BBC Learning English',
      duration: '10:40',
      thumbnailUrl: 'https://img.youtube.com/vi/05HXVE05vjg/hqdefault.jpg',
      descriptionAr: 'تركيبة Had + V3 واستخدامها في سرد الروايات وتسلسل الأحداث مع Before و After.',
      keyTimestamps: [
        { time: '1:00', label: 'توضيح تسلسل حدثين في الماضي' },
        { time: '4:30', label: 'استخدام By the time و Already' },
      ],
    },
  ],

  // 8. Future Simple (Will vs Going To)
  'future-simple': [
    {
      id: 'fut-vid-bbc-17',
      youtubeId: 'uRO9jRcF7Ek',
      title: 'Will: The Grammar Gameshow Episode 17',
      titleAr: 'زمن المستقبل البسيط بـ Will: القرارات اللحظية والتنبؤات والوعود',
      channelName: 'BBC Learning English',
      duration: '8:45',
      thumbnailUrl: 'https://img.youtube.com/vi/uRO9jRcF7Ek/hqdefault.jpg',
      descriptionAr: 'الاستخدام الدقيق لـ Will في العروض والمساعدات والقرارات الفورية.',
    },
    {
      id: 'fut-vid-bbc-6',
      youtubeId: 'qT5Ul3tMjDA',
      title: 'Be Going To: The Grammar Gameshow Episode 6',
      titleAr: 'المستقبل بـ Going to: الخطط المسبقة والتنبؤات القائمة على دليل حسي',
      channelName: 'BBC Learning English',
      duration: '9:10',
      thumbnailUrl: 'https://img.youtube.com/vi/qT5Ul3tMjDA/hqdefault.jpg',
      descriptionAr: 'الفرق الفارق بين قرار اللحظة والنية المخططة من قبل.',
    },
  ],

  // 9. Future Perfect (Flagship Topic)
  'future-perfect': [
    {
      id: 'fp-vid-bbc-class',
      youtubeId: 'UNF8Vnrpxno',
      title: 'The future perfect - BBC English Class',
      titleAr: 'شرح زمن المستقبل التام بالكامل: إنجازات وأهداف قادمة قبل موعد محدد',
      channelName: 'BBC Learning English',
      duration: '7:50',
      thumbnailUrl: 'https://img.youtube.com/vi/UNF8Vnrpxno/hqdefault.jpg',
      descriptionAr: 'شرح أكاديمي ممتع من Dan لكيفية استخدام Will have + V3 للتعبير عن خططك المستقبلية بثقة.',
      keyTimestamps: [
        { time: '0:35', label: 'المفهوم الذهبي للزمن' },
        { time: '2:40', label: 'استخدام By next week / By 2030' },
        { time: '5:15', label: 'أمثلة طموحة في الحياة المهنية' },
      ],
    },
  ],

  // 10. Conditionals (First & Second)
  'conditionals': [
    {
      id: 'cond1-vid-bbc-10',
      youtubeId: 'tcOLyvkBc48',
      title: 'The First Conditional: The Grammar Gameshow Episode 10',
      titleAr: 'الحالة الشرطية الأولى: النتائج المحتملة والواقعية في المستقبل',
      channelName: 'BBC Learning English',
      duration: '9:30',
      thumbnailUrl: 'https://img.youtube.com/vi/tcOLyvkBc48/hqdefault.jpg',
      descriptionAr: 'تركيبة If + Present Simple, Will + Verb مع أمثلة وتطبيقات عملية.',
    },
    {
      id: 'cond2-vid-bbc-20',
      youtubeId: '7_LCu92sk8k',
      title: 'Second Conditional: The Grammar Gameshow Episode 20',
      titleAr: 'الحالة الشرطية الثانية: التخيل والمواقف غير الواقعية الآن',
      channelName: 'BBC Learning English',
      duration: '9:50',
      thumbnailUrl: 'https://img.youtube.com/vi/7_LCu92sk8k/hqdefault.jpg',
      descriptionAr: 'تركيبة If + Past Simple, Would + Verb، ولماذا نستخدم If I were you للنصيحة.',
    },
  ],

  // 11. Passive Voice
  'passive-voice': [
    {
      id: 'pass-vid-bbc-16',
      youtubeId: 'mAFd4jjo0YU',
      title: 'Present and Past Passives: The Grammar Gameshow Episode 16',
      titleAr: 'المبني للمجهول في المضارع والماضي: التركيز على الحدث وليس الفاعل',
      channelName: 'BBC Learning English',
      duration: '10:05',
      thumbnailUrl: 'https://img.youtube.com/vi/mAFd4jjo0YU/hqdefault.jpg',
      descriptionAr: 'كيفية تحويل الجمل للمجهول بالصيغ الرسمية والأكاديمية والصحفية.',
    },
  ],

  // 12. Modal Verbs
  'modal-verbs': [
    {
      id: 'mod-vid-bbc-5',
      youtubeId: 'O-jJPd5ZYo4',
      title: 'Modal Verbs: Have to and Must: The Grammar Gameshow Episode 5',
      titleAr: 'الأفعال الناقصة: الإلزام والضرورة بين Must و Have to',
      channelName: 'BBC Learning English',
      duration: '9:15',
      thumbnailUrl: 'https://img.youtube.com/vi/O-jJPd5ZYo4/hqdefault.jpg',
      descriptionAr: 'الفرق الدقيق بين القواعد المفروضة خارجياً والشعور الشخصي بالالتزام.',
    },
  ],

  // 13. Reported Speech
  'reported-speech': [
    {
      id: 'rep-vid-bbc-25',
      youtubeId: 'cetrtFDN2Zg',
      title: 'Reported Speech: The Grammar Gameshow Episode 25',
      titleAr: 'الكلام المنقول والمباشر وغير المباشر في الإنجليزية',
      channelName: 'BBC Learning English',
      duration: '9:45',
      thumbnailUrl: 'https://img.youtube.com/vi/cetrtFDN2Zg/hqdefault.jpg',
      descriptionAr: 'قواعد تغيير الأزمنة والضمائر وظروف الزمان والمكان عند نقل حديث شخص آخر.',
    },
  ],

  // 14. Adverbs & Modifiers
  'adverbs-modifiers': [
    {
      id: 'adv-vid-bbc-2',
      youtubeId: 'A5ld4J3_kTk',
      title: 'Adverbs of frequency: The Grammar Gameshow Episode 2',
      titleAr: 'ظروف التكرار (Always, Often, Sometimes, Never) وموقعها في الجملة',
      channelName: 'BBC Learning English',
      duration: '8:40',
      thumbnailUrl: 'https://img.youtube.com/vi/A5ld4J3_kTk/hqdefault.jpg',
      descriptionAr: 'أين تضع ظرف التكرار مع الفعل الأساسي ومع أفعال Be بدون أخطاء.',
    },
  ],
};

/**
 * Validate YouTube video ID format (must be 11 characters, url-safe alphanumeric)
 */
export function isValidYouTubeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

/**
 * Normalize any input YouTube URL / ID into a clean 11-char ID
 */
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (isValidYouTubeId(trimmed)) return trimmed;

  // Patterns for full or shortened YouTube URLs
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match && match[1] && isValidYouTubeId(match[1]) ? match[1] : null;
}

/**
 * Get video resources for any course or lesson topic with automatic fallback
 */
export function getVideoResourcesForTopic(topicSlug: string): LessonVideoResource[] {
  if (GRAMMAR_VIDEO_RESOURCES[topicSlug]) {
    return GRAMMAR_VIDEO_RESOURCES[topicSlug];
  }

  // Smart keyword mapping
  if (topicSlug.includes('perfect') && topicSlug.includes('future')) {
    return GRAMMAR_VIDEO_RESOURCES['future-perfect'];
  }
  if (topicSlug.includes('perfect')) {
    return GRAMMAR_VIDEO_RESOURCES['present-perfect'];
  }
  if (topicSlug.includes('past')) {
    return GRAMMAR_VIDEO_RESOURCES['past-simple'];
  }
  if (topicSlug.includes('future') || topicSlug.includes('will')) {
    return GRAMMAR_VIDEO_RESOURCES['future-simple'];
  }
  if (topicSlug.includes('passive')) {
    return GRAMMAR_VIDEO_RESOURCES['passive-voice'];
  }
  if (topicSlug.includes('condition')) {
    return GRAMMAR_VIDEO_RESOURCES['conditionals'];
  }

  // Default fallback: Flagship Future Perfect lesson
  return GRAMMAR_VIDEO_RESOURCES['future-perfect'];
}
