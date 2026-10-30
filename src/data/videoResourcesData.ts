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
  'present-simple': [
    {
      id: 'ps-vid-1',
      youtubeId: 'nvVdJb_a_pY',
      title: 'Master Present Simple Tense: Daily Routines & Facts',
      titleAr: 'إتقان المضارع البسيط: الروتين والحقائق وقاعدة s المفرد الغائب',
      channelName: 'BBC Learning English',
      duration: '8:45',
      thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'شرح أكاديمي دقيق لكيفية صياغة واستخدام المضارع البسيط في الحديث اليومي بدون أخطاء شائعة.',
      keyTimestamps: [
        { time: '0:45', label: 'الاستخدام الأساسي والروتين' },
        { time: '3:10', label: 'قاعدة إضافة S مع He/She/It' },
        { time: '5:30', label: 'تكوين النفي والسؤال باستخدام Do/Does' },
      ],
    },
    {
      id: 'ps-vid-2',
      youtubeId: 'L9AWrJnhsRI',
      title: 'Present Simple vs Present Continuous in Real Life',
      titleAr: 'المقارنة الفورية بين المضارع البسيط والمستمر',
      channelName: 'Oxford Online English',
      duration: '11:20',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'كيف تفرق في ثوانٍ بين ما تفعله الآن كروتين وما تفعله في هذه اللحظة بالذات.',
    },
  ],
  'present-continuous': [
    {
      id: 'pc-vid-1',
      youtubeId: 'oBb6dJ66Xy0',
      title: 'Present Continuous Tense: Actions Happening Now & Future Plans',
      titleAr: 'المضارع المستمر: أحداث اللحظة والخطط المستقبلية المؤكدة',
      channelName: 'English with Lucy',
      duration: '9:30',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'شرح شامل لتركيبة am/is/are + ing وأفعال الحالة Stative Verbs التي لا تأتي في المستمر.',
    },
  ],
  'present-perfect': [
    {
      id: 'pp-vid-1',
      youtubeId: '4B5rXf105u0',
      title: 'Present Perfect Simple: Connect the Past to the Present',
      titleAr: 'المضارع التام البسيط: كيف تربط الماضي بالحاضر باحترافية',
      channelName: 'Oxford Online English',
      duration: '13:15',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'الفرق الجوهري بين Have been to و Have gone to واستخدامات Ever, Never, Just, Already.',
      keyTimestamps: [
        { time: '1:10', label: 'مفهوم أثر الماضي على الحاضر' },
        { time: '4:25', label: 'الفرق بين Since و For' },
        { time: '8:40', label: 'الماضي البسيط مقابل المضارع التام' },
      ],
    },
  ],
  'present-perfect-continuous': [
    {
      id: 'ppc-vid-1',
      youtubeId: '7Q3Z0F1Xy0',
      title: 'Present Perfect Continuous: How Long & Ongoing Effort',
      titleAr: 'المضارع التام المستمر: التركيز على استمرارية الفعل والمجهود',
      channelName: 'BBC Learning English',
      duration: '10:05',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'متى تركز على مدة النشاط بدلاً من اكتمال النتيجة النهائية مع تمارين تفاعلية.',
    },
  ],
  'past-simple': [
    {
      id: 'past-vid-1',
      youtubeId: '0Xw4k8t_N0A',
      title: 'Past Simple Tense: Regular & Irregular Verbs Explained',
      titleAr: 'الماضي البسيط: الأفعال المنتظمة والشاذة وأسلوب سرد القصص',
      channelName: 'Learn English with Emma',
      duration: '12:40',
      thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'قواعد النطق الصوتي لنهايات -ed وطريقة تكوين النفي والسؤال بـ Didn\'t.',
    },
  ],
  'past-continuous': [
    {
      id: 'pastc-vid-1',
      youtubeId: 'q5zF_y2Xw3Q',
      title: 'Past Continuous & Past Simple with When and While',
      titleAr: 'الماضي المستمر والماضي البسيط مع أدوات الربط When و While',
      channelName: 'Oxford Online English',
      duration: '11:50',
      thumbnailUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'كيف تصف الأحداث المتقاطعة في الماضي دون ارتباك لغوي.',
    },
  ],
  'past-perfect': [
    {
      id: 'pastp-vid-1',
      youtubeId: '8f0z4M0Q7c0',
      title: 'Past Perfect Tense: What Happened First in the Past?',
      titleAr: 'الماضي التام: ماضي الماضي وتحديد الحدث الأسبق زمنياً',
      channelName: 'English with Lucy',
      duration: '10:35',
      thumbnailUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'استخدام Had + V3 لتوضيح تسلسل الأحداث مع Before و After و By the time.',
    },
  ],
  'past-perfect-continuous': [
    {
      id: 'pastpc-vid-1',
      youtubeId: '3K4L2m8Q9a0',
      title: 'Past Perfect Continuous Tense Mastery',
      titleAr: 'الماضي التام المستمر: مدة الفعل الأول قبل وقوع الحدث الثاني',
      channelName: 'BBC Learning English',
      duration: '9:15',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'التركيز على إجهاد الفاعل والمدة التي استغرقها في الماضي قبل توقفه.',
    },
  ],
  'future-simple': [
    {
      id: 'fs-vid-1',
      youtubeId: 'V9a8z0B1c2D',
      title: 'Will vs Going to vs Present Continuous for Future',
      titleAr: 'المقارنة الحاسمة: Will أم Going to للقرارات والخطط والتنبؤات؟',
      channelName: 'Oxford Online English',
      duration: '14:20',
      thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'القواعد الذهبية للاختيار السريع بين القرارات الفورية والخطط المدروسة والتنبؤ بالدليل.',
    },
  ],
  'future-continuous': [
    {
      id: 'fc-vid-1',
      youtubeId: '1X2Y3Z4A5B6',
      title: 'Future Continuous Tense: What Will You Be Doing Tomorrow?',
      titleAr: 'المستقبل المستمر: ما الذي ستكون بصدد فعله غداً في وقت محدد؟',
      channelName: 'Learn English with Emma',
      duration: '8:55',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'Will be + Verb-ing في التعبير عن الأحداث المستقبلية الجارية والطلب المهذب.',
    },
  ],
  'future-perfect': [
    {
      id: 'fp-vid-1',
      youtubeId: '7K8L9M0N1O2',
      title: 'Future Perfect Tense: Complete Mastery of Will Have + V3',
      titleAr: 'المستقبل التام: الدليل الشامل لاكتمال الأهداف ومواعيد التسليم',
      channelName: 'Oxford Online English',
      duration: '15:10',
      thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'شرح مكثف لمعنى وفورمولا المستقبل التام، قاعدة By the time، وأهم الأخطاء الشائعة.',
      keyTimestamps: [
        { time: '1:00', label: 'المعنى والرؤية من المستقبل' },
        { time: '4:20', label: 'التركيبة: Will have + V3' },
        { time: '8:15', label: 'فخ By the time مع المضارع البسيط' },
        { time: '12:00', label: 'تمارين وتطبيقات عملية' },
      ],
    },
    {
      id: 'fp-vid-2',
      youtubeId: '5P6Q7R8S9T0',
      title: 'Future Perfect vs Future Continuous vs Future Simple',
      titleAr: 'المقارنة الثلاثية الكبرى بين أزمنة المستقبل',
      channelName: 'BBC Learning English',
      duration: '12:30',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'تحديات سريعة لاختبار قدرتك على اختيار الزمن الصحيح في مقابلات العمل ومواقف السفر.',
    },
  ],
  'conditionals-all': [
    {
      id: 'cond-vid-1',
      youtubeId: '9U0V1W2X3Y4',
      title: 'All Conditionals: 0, 1st, 2nd, 3rd and Mixed Conditionals',
      titleAr: 'شرح حالات لو الأربعة: الصفرية، الأولى، الثانية، والثالثة',
      channelName: 'English with Lucy',
      duration: '18:40',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'دليل شامل لكل صيغ الشرط مع شرح مبسط لاستخدامات Unless و If I were you.',
    },
  ],
  'modal-verbs': [
    {
      id: 'modal-vid-1',
      youtubeId: '3A4B5C6D7E8',
      title: 'Modal Verbs: Must, Have to, Should, Could, Might in Detail',
      titleAr: 'الأفعال الناقصة: الإلزام، النصيحة، والاستنتاج المنطقي',
      channelName: 'BBC Learning English',
      duration: '11:20',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'الفرق الدقيق بين Mustn\'t للمنع القاطع و Don\'t have to لعدم الإلزام.',
    },
  ],
  'passive-voice': [
    {
      id: 'pv-vid-1',
      youtubeId: '8F9G0H1I2J3',
      title: 'Passive Voice Across All Tenses Step by Step',
      titleAr: 'المبني للمجهول خطوة بخطوة في جميع أزمنة اللغة الإنجليزية',
      channelName: 'Oxford Online English',
      duration: '16:45',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'معادلة تحويل أي جملة معلوم إلى مجهول بذكاء مع أمثلة من التقارير الإخبارية والعلمية.',
    },
  ],
  'reported-speech': [
    {
      id: 'rs-vid-1',
      youtubeId: '4K5L6M7N8O9',
      title: 'Reported Speech: Backshift of Tenses and Pronouns',
      titleAr: 'الكلام المنقول: قاعدة الرجوع خطوة للوراء في الأزمنة والضمائر',
      channelName: 'Learn English with Emma',
      duration: '14:10',
      thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'كيف تنقل الأسئلة والجمل الخبرية والأوامر بدون ارتكاب أخطاء تركيبية.',
    },
  ],
  'relative-clauses': [
    {
      id: 'rc-vid-1',
      youtubeId: '1P2Q3R4S5T6',
      title: 'Relative Clauses: Who, Which, That, Whose & Where Made Simple',
      titleAr: 'ضمائر وجمل الوصل: كيفية ربط الجمل بسلاسة كمتحدث أصلي',
      channelName: 'English with Lucy',
      duration: '12:00',
      thumbnailUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
      descriptionAr: 'الفرق بين جمل الوصل المحددة Defining وغير المحددة Non-defining ومتى يمكن حذف ضمير الوصل.',
    },
  ],
};
