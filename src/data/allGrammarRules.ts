import { ONLINE_IMAGES } from './imageAssets';

export interface GrammarExample {
  en: string;
  ar: string;
  highlight: string;
  context: string;
}

export interface GrammarQuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface GrammarRuleItem {
  id: string;
  order: number;
  category: 'أزمنة المضارع' | 'أزمنة الماضي' | 'أزمنة المستقبل' | 'مواضيع وقواعد أخرى' | 'حالات الشرط' | 'المبني للمجهول والتركيب' | 'الأساسيات والتركيب اللغوي';
  categoryEn: string;
  titleAr: string;
  titleEn: string;
  level: 'A1 - مبتدئ' | 'A2 - تأسيسي' | 'B1 - متوسط' | 'B2 - فوق متوسط' | 'C1 - متقدم';
  goldenFormula: string;
  negativeFormula: string;
  questionFormula: string;
  summaryAr: string;
  timelineDescription: string;
  imageUrl: string;
  imageAlt: string;
  keyUsagePoints: string[];
  egyptianTips: string[];
  commonTraps: string[];
  examples: GrammarExample[];
  miniQuiz: GrammarQuizQuestion[];
  isMasterclass?: boolean;
  masterclassBadge?: string;
  masterclassRoute?: string;
  masterclassLessonsCount?: number;
}

export const ALL_GRAMMAR_RULES: GrammarRuleItem[] = [
  // ==========================================
  // 1. PRESENT TENSES (أزمنة المضارع)
  // ==========================================
  {
    id: 'present-simple',
    order: 1,
    category: 'أزمنة المضارع',
    categoryEn: 'Present Tenses',
    titleAr: 'المضارع البسيط: العادات والحقائق والمواعيد',
    titleEn: 'Present Simple Tense',
    level: 'A1 - مبتدئ',
    goldenFormula: 'I/You/We/They + V1  |  He/She/It + V1+(s/es/ies)',
    negativeFormula: "Don't / Doesn't + Base Verb (V1)",
    questionFormula: 'Do / Does + Subject + Base Verb?',
    summaryAr: 'المضارع البسيط مش معناه حاجة بتحصل دلوقتي حالاً! هو زمن الروتين، العادات الثابتة، الحقائق العلمية، والمواعيد الرسمية المجدولة.',
    timelineDescription: 'أفعال تتكرر بانتظام عبر الماضي والحاضر والمستقبل كحقائق أو عادات مستقرة.',
    imageUrl: ONLINE_IMAGES.grammar.presentSimple,
    imageAlt: 'Morning coffee routine and daily desk work setup',
    keyUsagePoints: [
      'العادات والروتين اليومي (Habits & Daily Routines)',
      'الحقائق العلمية والعامة الثابتة (General & Scientific Facts)',
      'الجداول الزمنية الثابتة والمواصلات (Fixed Timetables)',
      'الحالات الدائمة والمشاعر (Stative Verbs & Permanent States)'
    ],
    egyptianTips: [
      'أي حاجة بتعملها كروتين، حط الفعل في المصدر مع I/You/We/They وزود s مع المفرد الغائب He/She/It.',
      'أول ما تشوف Always, Usually, Often, Every day، فكر فوراً في المضارع البسيط.',
      'بعد does أو doesn\'t بنشيل الـ s من الفعل فوراً: He doesn\'t speak (مش speaks)!'
    ],
    commonTraps: [
      'فخ نسيان الـ s مع المفرد الغائب: الخطأ She work here، الصواب: She works here.',
      'فخ وضع s بعد doesn\'t: الخطأ He doesn\'t knows، الصواب: He doesn\'t know.',
      'استخدامه للحدث الذي يقع في نفس اللحظة: الخطأ I eat now، الصواب: I am eating now.'
    ],
    examples: [
      {
        en: 'She manages an engineering team at a multinational software company.',
        ar: 'هي تدير فريقاً هندسياً في شركة برمجيات متعددة الجنسيات.',
        highlight: 'manages',
        context: 'وظيفة وحالة دائمة'
      },
      {
        en: 'The morning train to Alexandria leaves daily at 7:30 AM sharp.',
        ar: 'قطار الصباح إلى الإسكندرية يغادر يومياً في تمام الساعة 7:30 صباحاً.',
        highlight: 'leaves',
        context: 'جدول مواعيد رسمي ثابت'
      },
      {
        en: 'Water boils at 100 degrees Celsius under standard atmospheric pressure.',
        ar: 'يغلي الماء عند 100 درجة مئوية تحت الضغط الجوي المعتاد.',
        highlight: 'boils',
        context: 'حقيقة علمية ثابتة'
      }
    ],
    miniQuiz: [
      {
        question: 'Sarah ______ hard for her medical exams every single evening.',
        options: ['studies', 'study', 'is study', 'studying'],
        correct: 0,
        explanation: 'الفاعل Sarah مفرد غائب، والحدث روتين يومي (every evening) لذلك نختار studies.'
      },
      {
        question: 'The library ______ open on Friday mornings.',
        options: ['doesn\'t', 'isn\'t', 'don\'t', 'aren\'t'],
        correct: 1,
        explanation: 'كلمة open هنا صفة (adjective)، لذلك ننفي بفعل to be: isn\'t open.'
      }
    ]
  },

  {
    id: 'present-continuous',
    order: 2,
    category: 'أزمنة المضارع',
    categoryEn: 'Present Tenses',
    titleAr: 'المضارع المستمر: الأحداث الجارية والترتيبات',
    titleEn: 'Present Continuous Tense',
    level: 'A1 - مبتدئ',
    goldenFormula: 'am / is / are + Verb-ing',
    negativeFormula: "am not / isn't / aren't + Verb-ing",
    questionFormula: 'Am / Is / Are + Subject + Verb-ing?',
    summaryAr: 'زمن الكاميرا الحية! بنستخدمه لما نتكلم عن حاجة بتحصل قدام عنينا دلوقتي حالا، أو أحداث مؤقتة في الفترة الحالية، أو ترتيبات مستقبلية مؤكدة بنسبة 100%.',
    timelineDescription: 'فعل قيد الحدوث في لحظة الكلام أو مشروع مؤقت يستغرق فترة زمنية حالية.',
    imageUrl: ONLINE_IMAGES.grammar.presentContinuous,
    imageAlt: 'Professional developer typing on laptop during active sprint',
    keyUsagePoints: [
      'فعل يحدث الآن في لحظة الكلام بالضبط (Happening right now)',
      'مواقف ومشاريع مؤقتة في هذه الفترة (Temporary situations)',
      'تغيرات وتطورات تدريجية مستمرة (Changing & evolving trends)',
      'ترتيبات مستقبلية مؤكدة ومحجوزة (Confirmed future arrangements)'
    ],
    egyptianTips: [
      'الكلمة السحرية في المصري: "شغّال بيعمل كذا دلوقتي" أو "مرتب ومسافر بكرة".',
      'افتكر إن أفعال الحواس والمشاعر والتفكير (Stative Verbs) زي like, know, understand, believe مبتاخدش ing في العادة!',
      'لما تقول I am meeting the CEO tomorrow، ده معناه إنك حاجز الميعاد ومأكده خلاص.'
    ],
    commonTraps: [
      'فخ وضع ing بدون am/is/are: الخطأ I studying now، الصواب: I am studying now.',
      'فخ استخدام ing مع أفعال المشاعر والحواس: الخطأ I am knowing the answer، الصواب: I know the answer.'
    ],
    examples: [
      {
        en: 'The developers are testing the new payment gateway right now.',
        ar: 'المطورون يختبرون بوابة الدفع الجديدة في هذه اللحظة بالضبط.',
        highlight: 'are testing',
        context: 'حدث يقع الآن مباشرة'
      },
      {
        en: 'Omar is staying at his uncle\'s apartment this week until his renovation finishes.',
        ar: 'عمر يقيم في شقة عمه هذا الأسبوع مؤقتاً حتى ينتهي تشطيب شقته.',
        highlight: 'is staying',
        context: 'وضع مؤقت خلال هذا الأسبوع'
      },
      {
        en: 'We are flying to Dubai next Tuesday; the tickets and hotel are already booked.',
        ar: 'نحن مسافرون جواً إلى دبي الثلاثاء القادم، التذاكر والفندق محجوزة بالفعل.',
        highlight: 'are flying',
        context: 'ترتيب مستقبلي محجوز ومؤكد'
      }
    ],
    miniQuiz: [
      {
        question: 'Please be quiet; the professor ______ the research methodology.',
        options: ['is explaining', 'explains', 'explain', 'are explaining'],
        correct: 0,
        explanation: 'الحدث يقع الآن في لحظة التنبيه (Please be quiet) والفاعل مفرد، فنختار is explaining.'
      }
    ]
  },

  {
    id: 'present-perfect',
    order: 3,
    category: 'أزمنة المضارع',
    categoryEn: 'Present Tenses',
    titleAr: 'المضارع التام: الخبرات وأثر الماضي على الحاضر',
    titleEn: 'Present Perfect Simple',
    level: 'A2 - تأسيسي',
    goldenFormula: 'have / has + Past Participle (V3)',
    negativeFormula: "haven't / hasn't + Past Participle (V3)",
    questionFormula: 'Have / Has + Subject + V3?',
    summaryAr: 'كوبري يربط الماضي بالحاضر! لا نهتم بموعد حدوث الفعل في الماضي، بل نهتم بنتيجته وأثره الحيّ الآن، أو رصيد تجاربك الحياتية حتى اللحظة.',
    timelineDescription: 'فعل حدث في وقت غير محدد في الماضي، أو بدأ في الماضي ولا زال أثره ممتداً إلى الحاضر.',
    imageUrl: ONLINE_IMAGES.grammar.presentPerfect,
    imageAlt: 'Confident student holding certificate after hard study',
    keyUsagePoints: [
      'تجارب وخبرات حياتية سابقة بدون تحديد وقت (Life Experiences with Ever / Never)',
      'فعل ماضٍ له أثر ونتيجة واضحة في الحاضر (Past action with present result)',
      'فعل تم إنجازه منذ لحظات قليلة (Just / Already)',
      'فعل لم يكتمل بعد ومتوقع حدوثه (Yet in negatives and questions)'
    ],
    egyptianTips: [
      'لو حددت الوقت بالظبط (yesterday, in 2021, two days ago) استخدم ماضي بسيط مش مضارع تام!',
      'الفرق بين gone to و been to: He has gone to London يعني سافر ولسه هناك، He has been to London يعني راح وزار ورجع.',
      'Since بيجي بعدها نقطة بداية زمنية محددة (2018, Monday, 3 PM)، بينما For بيجي بعدها مدة إجمالية (5 years, 3 hours).'
    ],
    commonTraps: [
      'فخ استخدام الماضي البسيط مع الكلمات التي لها أثر: الخطأ I lost my keys so I can\'t enter، الصواب: I have lost my keys (لأن النتيجة أنني عاجز عن الدخول الآن).',
      'فخ استخدام المضارع التام مع وقت ماضٍ محدد: الخطأ I have visited Paris last year، الصواب: I visited Paris last year.'
    ],
    examples: [
      {
        en: 'I have lost my passport, so I cannot board the international flight.',
        ar: 'لقد فقدت جواز سفري، ولذلك لا يمكنني الصعود إلى الطائرة الدولية الآن.',
        highlight: 'have lost',
        context: 'فعل ماضٍ أثره مباشر في الحاضر'
      },
      {
        en: 'Has Karim ever worked with international distributed remote teams?',
        ar: 'هل سبق لكريم على الإطلاق العمل مع فرق عمل دولية موزعة عن بعد؟',
        highlight: 'Has Karim ever worked',
        context: 'سؤال عن رصيد الخبرات الحياتية'
      },
      {
        en: 'They have lived in Alexandria since they graduated in 2018.',
        ar: 'هم يعيشون في الإسكندرية منذ تخرجهم في عام 2018.',
        highlight: 'have lived',
        context: 'حدث بدأ في الماضي ومستمر حتى الآن'
      }
    ],
    miniQuiz: [
      {
        question: 'Layla ______ three cups of coffee this morning and she still feels sleepy.',
        options: ['has drunk', 'drank', 'is drinking', 'drinks'],
        correct: 0,
        explanation: 'الفترة الزمنية (this morning) لم تنتهِ بعد، والحدث له أثر في الحاضر فنستخدم has drunk.'
      }
    ]
  },

  {
    id: 'present-perfect-continuous',
    order: 4,
    category: 'أزمنة المضارع',
    categoryEn: 'Present Tenses',
    titleAr: 'المضارع التام المستمر: التركيز على استمرارية الفعل وتأثيره',
    titleEn: 'Present Perfect Continuous',
    level: 'B1 - متوسط',
    goldenFormula: 'have / has + been + Verb-ing',
    negativeFormula: "haven't / hasn't + been + Verb-ing",
    questionFormula: 'Have / Has + Subject + been + Verb-ing?',
    summaryAr: 'لما تحب تركز على "التعب والمجهود والوقت اللي استغرقه الفعل"! فعل بدأ في الماضي وقضيت فيه ساعات أو أيام، ولسه شغال أو لسه خلصان حالا وآثاره باينة على وشك.',
    timelineDescription: 'فعل بدأ في الماضي واستمر لفترة ممتدة حتى الحاضر، مع التركيز على طول المدة أو الإرهاق الناتج.',
    imageUrl: ONLINE_IMAGES.grammar.presentPerfectContinuous,
    imageAlt: 'Tired student with open textbooks studying for hours',
    keyUsagePoints: [
      'فعل بدأ في الماضي ومستمر دون انقطاع حتى الآن (How long...)',
      'فعل استمر لفترة طويلة ونتائجه المادية واضحة الآن (You look exhausted!)',
      'التركيز على النشاط المستمر وليس على المنتج النهائي (Activity vs Result)'
    ],
    egyptianTips: [
      'لو عايز تقول "بقالي ٣ ساعات بذاكر وعيني وجعتني"، الصيغة الأنسب فوراً هي: I have been studying for 3 hours.',
      'لو بتركز على "العدد المنجز" (قرأت ٣ كتب) استخدم التام البسيط I have read 3 books، لو بتركز على "المدة" استخدم المستمر I have been reading all morning.'
    ],
    commonTraps: [
      'فخ استخدام أفعال الحالة (stative verbs) في هذا الزمن: الخطأ I have been knowing him for years، الصواب: I have known him for years.'
    ],
    examples: [
      {
        en: 'The data science team has been analyzing customer logs since 6 AM.',
        ar: 'فريق علوم البيانات يعكف على تحليل سجلات العملاء باستمرار منذ الساعة السادسة صباحاً.',
        highlight: 'has been analyzing',
        context: 'تركيز على استمرار التحليل والجهد'
      },
      {
        en: 'Why are your hands covered in paint? — I have been painting the studio walls.',
        ar: 'لماذا يداك مغطاة بالطلاء؟ — لأنني كنت أقوم بطلاء جدران الأستوديو طوال الوقت.',
        highlight: 'have been painting',
        context: 'أثر جسدي مباشر لفعل استمر لفترة'
      }
    ],
    miniQuiz: [
      {
        question: 'How long ______ English at the academy?',
        options: ['have you been learning', 'are you learning', 'do you learn', 'have you learn'],
        correct: 0,
        explanation: 'السؤال بـ How long عن حدث مستمر حتى الحاضر يتطلب المضارع التام المستمر have you been learning.'
      }
    ]
  },

  // ==========================================
  // 2. PAST TENSES (أزمنة الماضي)
  // ==========================================
  {
    id: 'past-simple',
    order: 5,
    category: 'أزمنة الماضي',
    categoryEn: 'Past Tenses',
    titleAr: 'الماضي البسيط: الأفعال المكتملة في وقت ماضٍ محدد',
    titleEn: 'Past Simple Tense',
    level: 'A1 - مبتدئ',
    goldenFormula: 'Subject + V2 (Regular: -ed / Irregular: V2 form)',
    negativeFormula: "didn't + Base Verb (V1)",
    questionFormula: 'Did + Subject + Base Verb (V1)?',
    summaryAr: 'زمن سرد القصص والتاريخ! فعل بدأ وانتهى تماماً في نقطة زمنية محددة في الماضي، ولا يمتد تأثيره كحالة قائمة إلى الحاضر.',
    timelineDescription: 'نقطة مكتملة ومغلقة تماماً على الخط الزمني في الماضي.',
    imageUrl: ONLINE_IMAGES.grammar.pastSimple,
    imageAlt: 'Vintage books and compass depicting finished history',
    keyUsagePoints: [
      'حدث تم وانتهى في وقت محدد في الماضي (yesterday, last week, in 2015)',
      'سلسلة أحداث متتالية في قصة (Sequential actions in a narrative)',
      'عادات ماضية لم تعد قائمة (Past habits with used to)'
    ],
    egyptianTips: [
      'بعد didn\'t أو did في السؤال، الفعل بيرجع لأصله المجرد تماماً بدون ed وبدون تحويل: Did you go? (مش Did you went).',
      'الأفعال غير المنتظمة (Irregular verbs) زي go ➔ went، write ➔ wrote، لازم تتحفظ كويس لأنها العمود الفقري للتحدث.'
    ],
    commonTraps: [
      'فخ استخدام التصريف الثاني بعد didn\'t: الخطأ I didn\'t saw him، الصواب: I didn\'t see him.'
    ],
    examples: [
      {
        en: 'The company launched its revolutionary AI product three weeks ago.',
        ar: 'أطلقت الشركة منتج الذكاء الاصطناعي الثوري قبل ثلاثة أسابيع.',
        highlight: 'launched',
        context: 'حدث ماضٍ مكتمل مع وقت محدد (three weeks ago)'
      },
      {
        en: 'Mona woke up, made a fresh cup of coffee, and walked to her morning seminar.',
        ar: 'استيقظت منى، وأعدت كوباً طازجاً من القهوة، ثم مشت إلى ندوتها الصباحية.',
        highlight: 'woke up, made, walked',
        context: 'سلسلة أحداث متتابعة في الماضي'
      }
    ],
    miniQuiz: [
      {
        question: 'Where ______ your primary school graduation certificate?',
        options: ['did you obtain', 'did you obtained', 'do you obtained', 'were you obtain'],
        correct: 0,
        explanation: 'في السؤال بصيغة الماضي، نستخدم did مع المصدر المجرد did you obtain.'
      }
    ]
  },

  {
    id: 'past-continuous',
    order: 6,
    category: 'أزمنة الماضي',
    categoryEn: 'Past Tenses',
    titleAr: 'الماضي المستمر: أحداث كانت جارية وقطعها حدث آخر',
    titleEn: 'Past Continuous Tense',
    level: 'A2 - تأسيسي',
    goldenFormula: 'was / were + Verb-ing',
    negativeFormula: "wasn't / weren't + Verb-ing",
    questionFormula: 'Was / Were + Subject + Verb-ing?',
    summaryAr: 'شريط فيديو كان شغال في لحظة معينة في الماضي! لما تحب توصف خلفية المشهد أو حدث كان مستمراً ولحظة ما كان شغال دخل عليه حدث تاني مفاجئ وقطعه.',
    timelineDescription: 'فترة زمنية ممتدة في الماضي تتقاطع أحياناً مع حدث لحظي قاطع بصيغة الماضي البسيط.',
    imageUrl: ONLINE_IMAGES.grammar.pastContinuous,
    imageAlt: 'Business meeting in progress interrupted by a phone call',
    keyUsagePoints: [
      'حدث كان مستمراً في وقت محدد بالضبط في الماضي (At 8 PM yesterday)',
      'حدث كان مستمراً وقطعه حدث ماضٍ بسيط مفاجئ (While I was studying, the phone rang)',
      'حدثان كانا يحدثان بالتوازي في نفس الوقت (While she was reading, he was cooking)'
    ],
    egyptianTips: [
      'القاعدة الذهبية للربط: While بيجي بعدها ماضي مستمر (was/were + ing)، وWhen غالباً بيجي بعدها الحدث القاطع في الماضي البسيط.',
      'افتكر: الحدث الطويل اللي واخد وقت هو المستمر، والحدث القصير اللي قطعه فجأة هو البسيط.'
    ],
    commonTraps: [
      'فخ الخلط بين الحدث القصير والطويل: الخطأ When I was dropping my phone, it broke، الصواب: While I was walking, I dropped my phone.'
    ],
    examples: [
      {
        en: 'While Karim was debugging the server scripts, the electricity suddenly went out.',
        ar: 'بينما كان كريم يقوم بإصلاح أكواد الخادم، انقطعت الكهرباء فجأة.',
        highlight: 'was debugging / went out',
        context: 'حدث طويل مستمر قطعه حدث مفاجئ'
      },
      {
        en: 'At 10:30 PM last night, I was reviewing the quarterly financial statements.',
        ar: 'في تمام الساعة 10:30 مساء أمس، كنت أراجع القوائم المالية الربع سنوية.',
        highlight: 'was reviewing',
        context: 'حدث كان جارياً في توقيت ماضٍ محدد بدقة'
      }
    ],
    miniQuiz: [
      {
        question: 'Tarek ______ when the delivery courier knocked loudly at the door.',
        options: ['was sleeping', 'slept', 'is sleeping', 'sleeps'],
        correct: 0,
        explanation: 'النوم كان حدثاً مستمراً طويلاً قطعه طرق الباب، لذلك نستخدم الماضي المستمر was sleeping.'
      }
    ]
  },

  {
    id: 'past-perfect',
    order: 7,
    category: 'أزمنة الماضي',
    categoryEn: 'Past Tenses',
    titleAr: 'الماضي التام: الحدث الأسبق بين حدثين في الماضي',
    titleEn: 'Past Perfect Simple',
    level: 'B1 - متوسط',
    goldenFormula: 'had + Past Participle (V3)',
    negativeFormula: "hadn't + Past Participle (V3)",
    questionFormula: 'Had + Subject + Past Participle (V3)?',
    summaryAr: 'ماضي الماضي (Past of the Past)! لما يكون عندك حاجتين حصلوا في الماضي، وعايز توضح للقارئ مين فيهم اللي حصل الأول خالص ومين اللي جه بعده، الحدث الأول هو الماضي التام.',
    timelineDescription: 'حدث اكتمل وانتهى قبل وقوع حدث آخر في الماضي على الخط الزمني.',
    imageUrl: ONLINE_IMAGES.grammar.pastPerfect,
    imageAlt: 'Antique timeline clocks showing sequence of historical events',
    keyUsagePoints: [
      'لتوضيح أسبقية الأحداث عندما يجتمع حدثان في الماضي',
      'مع روابط الزمن: After, Before, By the time, As soon as, When',
      'مع أسباب الشعور في الماضي (She was stressed because she had lost her bag)'
    ],
    egyptianTips: [
      'معادلة الترتيب بالمصري: الحدث رقم 1 (الأولاني خالص في الحدوث) = had + V3. الحدث رقم 2 (اللي جه بعده) = ماضي بسيط V2.',
      'مع After: بيجي بعدها الحدث الأول had + V3: After I had studied, I slept.',
      'مع Before أو By the time: بيجي بعدها الحدث الثاني الماضي البسيط: Before I slept, I had studied.'
    ],
    commonTraps: [
      'فخ استخدام had + V3 للحدثين معاً: الخطأ After I had studied, I had gone to bed، الصواب: After I had studied, I went to bed.'
    ],
    examples: [
      {
        en: 'By the time the ambulance arrived at the scene, the doctor had already stabilized the patient.',
        ar: 'بحلول وقت وصول سيارة الإسعاف إلى الموقع، كان الطبيب قد استقر بحالة المريض بالفعل.',
        highlight: 'had already stabilized / arrived',
        context: 'علاج المريض تم أولاً (had stabilized) ثم وصلت الإسعاف ثانياً (arrived)'
      },
      {
        en: 'Laila couldn\'t enter the building because she had forgotten her access card at home.',
        ar: 'لم تتمكن ليلى من دخول المبنى لأنها كانت قد نسيت بطاقة الدخول في منزلها مسبقاً.',
        highlight: 'had forgotten / couldn\'t enter',
        context: 'نسيان البطاقة حدث أولاً فترتب عليه منع الدخول ثانياً'
      }
    ],
    miniQuiz: [
      {
        question: 'When we arrived at the cinema, the movie ______ fifteen minutes earlier.',
        options: ['had already started', 'already started', 'has already started', 'was starting'],
        correct: 0,
        explanation: 'الفيلم بدأ قبل وصولنا للسينما (الحدث الأسبق)، لذلك نستخدم الماضي التام had already started.'
      }
    ]
  },

  {
    id: 'past-perfect-continuous',
    order: 8,
    category: 'أزمنة الماضي',
    categoryEn: 'Past Tenses',
    titleAr: 'الماضي التام المستمر: المدة التي استغرقها الحدث الأول في الماضي',
    titleEn: 'Past Perfect Continuous',
    level: 'B2 - فوق متوسط',
    goldenFormula: 'had + been + Verb-ing',
    negativeFormula: "hadn't + been + Verb-ing",
    questionFormula: 'Had + Subject + been + Verb-ing?',
    summaryAr: 'شقيق الماضي التام، لكنه يركز على الفترة الزمنية المستمرة التي قضاها الفاعل في القيام بالحدث الأول قبل أن يقع الحدث الثاني في الماضي.',
    timelineDescription: 'فعل استمر لفترة زمنية متصلة في الماضي قبل أن يقطعه أو يتبعه حدث ماضٍ آخر.',
    imageUrl: ONLINE_IMAGES.grammar.pastPerfectContinuous,
    imageAlt: 'Exhausted marathon runner catching breath after long run',
    keyUsagePoints: [
      'التعبير عن طول مدة النشاط الأول قبل وقوع الحدث الثاني في الماضي',
      'تفسير سبب حالة أو مظهر شخص في الماضي (His eyes were red because he had been crying)'
    ],
    egyptianTips: [
      'لو عايز تقول: "كان بقالهم ٥ ساعات سايقين لما العربية عطلت"، استخدم had been driving.',
      'الفرق بينه وبين الماضي التام البسيط هو التركيز على طول المدة (duration) والإرهاق.'
    ],
    commonTraps: [
      'عدم استخدامه مع أفعال الحالة (stative verbs): نستخدم had had وليس had been having عند التعبير عن الملكية.'
    ],
    examples: [
      {
        en: 'The engineers had been inspecting the bridge for five hours before they detected the structural crack.',
        ar: 'كان المهندسون يفحصون الجسر بصورة مستمرة لمدة خمس ساعات قبل أن يكتشفوا الشرخ الإنشائي.',
        highlight: 'had been inspecting',
        context: 'استمرار الفحص لخمس ساعات قبل الاكتشاف'
      }
    ],
    miniQuiz: [
      {
        question: 'She was completely out of breath because she ______ for two miles without stopping.',
        options: ['had been running', 'has been running', 'was ran', 'had ran'],
        correct: 0,
        explanation: 'انقطاع النفس كان في الماضي (was)، والسبب جري استمر لمسافة ميلين قبله، فنختار had been running.'
      }
    ]
  },

  // ==========================================
  // 3. FUTURE TENSES (أزمنة المستقبل)
  // ==========================================
  {
    id: 'future-simple',
    order: 9,
    category: 'أزمنة المستقبل',
    categoryEn: 'Future Tenses',
    titleAr: 'المستقبل البسيط بـ Will: القرارات اللحظية والوعود والتنبؤ',
    titleEn: 'Future Simple (Will)',
    level: 'A2 - تأسيسي',
    goldenFormula: 'will + Base Verb (V1)',
    negativeFormula: "won't (will not) + Base Verb (V1)",
    questionFormula: 'Will + Subject + Base Verb (V1)?',
    summaryAr: 'صيغة القرارات السريعة اللحظية، والوعود، والعروض، والتهديدات، والتنبؤ العام بالمستقبل دون الاستناد إلى دليل ملموس.',
    timelineDescription: 'قرار أو نبوءة تنطلق من لحظة الكلام متجهة مباشرة نحو المستقبل.',
    imageUrl: ONLINE_IMAGES.grammar.futureSimple,
    imageAlt: 'Business strategist making decisions',
    keyUsagePoints: [
      'القرارات الفورية التلقائية المتخذة في نفس لحظة الحديث (Spontaneous decisions)',
      'الوعود والعهود الشخصية (Promises: I will help you)',
      'العروض وتقديم المساعدة (Offers: I will carry that bag for you)',
      'التنبؤ بالمستقبل بدون دليل حسي (Predictions based on opinion/guess)'
    ],
    egyptianTips: [
      'لو جرس الباب رن دلوقتي حالا: I will open the door (قرار لحظي مش متخطط له).',
      'مع عبارات الشك والاعتقاد: I think, I hope, I believe, Maybe دايماً بنستخدم will.',
      'اختصار will هو \'ll، واختصار will not هو won\'t (انتبه لنطقها مش want).'
    ],
    commonTraps: [
      'فخ استخدام will مع أحداث لها دليل مرئي مباشر: الصواب استخدام Going to.'
    ],
    examples: [
      {
        en: 'The phone is ringing. — Don\'t worry, I will answer it.',
        ar: 'الهاتف يرن. — لا تقلق، سأرد أنا عليه فوراً.',
        highlight: 'will answer',
        context: 'قرار لحظي سريع'
      },
      {
        en: 'I promise I will never reveal your secret to anyone.',
        ar: 'أعدك بأنني لن أفشي سرك لأي شخص أبداً.',
        highlight: 'will never reveal',
        context: 'وعد مؤكد'
      }
    ],
    miniQuiz: [
      {
        question: 'Someone is knocking at the door. — I ______ and see who it is.',
        options: ['will go', 'am going to go', 'went', 'have gone'],
        correct: 0,
        explanation: 'قرار سريع وفوري اتخذ في لحظة سماع الطرق على الباب، فيستخدم will go.'
      }
    ]
  },

  {
    id: 'be-going-to',
    order: 10,
    category: 'أزمنة المستقبل',
    categoryEn: 'Future Tenses',
    titleAr: 'المستقبل بـ Be Going To: الخطط والنوايا والتنبؤ بدليل مرئي',
    titleEn: 'Be Going To',
    level: 'A2 - تأسيسي',
    goldenFormula: 'am / is / are + going to + Base Verb (V1)',
    negativeFormula: 'am / is / are + not + going to + Base Verb (V1)',
    questionFormula: 'Am / Is / Are + Subject + going to + Base Verb (V1)?',
    summaryAr: 'صيغة الخطط والقرارات المسبقة المدروسة، والتنبؤ بأمر وشيك الحدوث بناءً على دليل حسي تراه بعينيك الآن.',
    timelineDescription: 'خطة مسبقة أو شواهد مرئية في الحاضر تشير حتماً إلى وقوع الحدث مستقبلاً.',
    imageUrl: ONLINE_IMAGES.courses.techEnglish,
    imageAlt: 'Project team discussing planned sprint roadmaps',
    keyUsagePoints: [
      'خطط ونوايا مسبقة ومدروسة تم اتخاذ القرار بشأنها قبل لحظة الكلام (Prior plans & intentions)',
      'تنبؤ بأمر حتمي أو وشيك مبني على دليل مرئي حالي (Predictions with present evidence)',
      'التحذير من خطر وشيك الوقوع أمامك'
    ],
    egyptianTips: [
      'لو شايف غيوم سودا كثيفة في السما: It is going to rain (تنبؤ بدليل مش مجرد تخمين).',
      'لو محوش فلوس ومجهز نفسك تشتري لابتوب: I am going to buy a laptop (خطة مجهزة).',
      'في النطق السريع اليومي للأمريكان بتتنطق Gonna بس متكتبهاش في الإيميلات الرسمية.'
    ],
    commonTraps: [
      'فخ نسيان verb to be: الخطأ I going to travel، الصواب: I am going to travel.'
    ],
    examples: [
      {
        en: 'Look at those dark clouds! It is going to rain very soon.',
        ar: 'انظر إلى تلك الغيوم الداكنة! إنها على وشك أن تمطر قريباً جداً.',
        highlight: 'is going to rain',
        context: 'تنبؤ قائم على دليل مرئي حسي'
      },
      {
        en: 'We have saved enough capital; we are going to launch our e-commerce store next month.',
        ar: 'لقد ادخرنا رأس مال كافياً؛ وسنطلق متجرنا الإلكتروني الشهر القادم.',
        highlight: 'are going to launch',
        context: 'خطة عمل مدروسة مسبقاً'
      }
    ],
    miniQuiz: [
      {
        question: 'Look at that fragile shelf; it ______ collapse under the heavy load!',
        options: ['is going to', 'will', 'is', 'has'],
        correct: 0,
        explanation: 'الرف يهتز والكتب ثقيلة (دليل حسي مباشر أمامك)، فنستخدم is going to collapse.'
      }
    ]
  },

  {
    id: 'future-continuous',
    order: 11,
    category: 'أزمنة المستقبل',
    categoryEn: 'Future Tenses',
    titleAr: 'المستقبل المستمر: حدث سيكون مستمراً في وقت محدد غداً',
    titleEn: 'Future Continuous Tense',
    level: 'B1 - متوسط',
    goldenFormula: 'will + be + Verb-ing',
    negativeFormula: "won't + be + Verb-ing",
    questionFormula: 'Will + Subject + be + Verb-ing?',
    summaryAr: 'تخيّل كاميرا بتصورك بكرة في نفس الوقت ده بالظبط! حدث هيكون شغال وفي منتصف حدوثه عند نقطة زمنية معينة في المستقبل.',
    timelineDescription: 'فترة زمنية مستمرة تحيط بنقطة محددة في المستقبل.',
    imageUrl: ONLINE_IMAGES.grammar.futureContinuous,
    imageAlt: 'Auditorium lecture in session during future business conference',
    keyUsagePoints: [
      'حدث سيكون في منتصف حدوثه في وقت محدد في المستقبل (This time tomorrow...)',
      'السؤال بأدب ولطف شديد عن خطط شخص آخر (Will you be using your car tonight?)',
      'أحداث روتينية طبيعية متوقعة كجزء من المعتاد'
    ],
    egyptianTips: [
      'الكلمات المفتاحية الشهيرة: At this time tomorrow, At 4 PM next Sunday, During the weekend.',
      'بالمصري: "زي دلوقتي بكرة، هكون طاير في الطيارة فوق السحاب" = I will be flying over the clouds.'
    ],
    commonTraps: [
      'فخ نسيان be: الخطأ I will working at 5 PM، الصواب: I will be working at 5 PM.'
    ],
    examples: [
      {
        en: 'This time tomorrow, we will be flying over the Atlantic Ocean on our way to Toronto.',
        ar: 'في مثل هذا الوقت غداً، سنكون محلقين فوق المحيط الأطلسي في طريقنا إلى تورونتو.',
        highlight: 'will be flying',
        context: 'حدث سيكون قيد الحدوث والاستمرار غداً في نفس اللحظة'
      }
    ],
    miniQuiz: [
      {
        question: 'Don\'t call her at 3 PM; she ______ a live webinar to 500 trainees.',
        options: ['will be delivering', 'will deliver', 'delivers', 'is delivered'],
        correct: 0,
        explanation: 'في تمام الساعة 3 عصراً ستكون المحاضرة قيد الإلقاء مستمرة، فنختار will be delivering.'
      }
    ]
  },

  {
    id: 'future-perfect',
    order: 12,
    category: 'أزمنة المستقبل',
    categoryEn: 'Future Tenses',
    titleAr: 'المستقبل التام الشامل: اكتمال الفعل قبل موعد مستقبلي',
    titleEn: 'Future Perfect Tense (Masterclass Core)',
    level: 'B2 - فوق متوسط',
    goldenFormula: 'will + have + Past Participle (V3)',
    negativeFormula: "won't + have + Past Participle (V3)",
    questionFormula: 'Will + Subject + have + V3?',
    summaryAr: 'الكورس الرائد المدمج في أكاديمية الجرامر! تقف في نقطة مستقبلية وتنظر إلى الخلف لترى أن الفعل قد اكتمل وانتهى أمره تماماً قبل موعد التسليم أو النقطة المحددة.',
    timelineDescription: 'نقطة انتهاء مكتملة تقع قبل موعد مستقبلي نهائي محدد (Deadline).',
    imageUrl: ONLINE_IMAGES.grammar.futurePerfect,
    imageAlt: 'Calendar deadline and completed milestone roadmap',
    isMasterclass: true,
    masterclassBadge: 'الكورس الرائد  (8 دروس تفاعلية)',
    masterclassRoute: 'courses/grammar/future-perfect',
    masterclassLessonsCount: 8,
    keyUsagePoints: [
      'اكتمال فعل قبل حلول موعد مستقبلي محدد (By 8 PM, By 2030)',
      'الربط مع الروابط الزمنية (By the time, Before) مع مضارع بسيط',
      'التعبير عن المدة التي ستكون قد اكتملت بحلول موعد قادم'
    ],
    egyptianTips: [
      'مستحيل نقول will has مهما كان الفاعل مفرد (لأن will بيجي بعدها المصدر have دائماً).',
      'بعد By the time أو Before نستخدم مضارع بسيط وليس will: By the time dad arrives (مش will arrive).'
    ],
    commonTraps: [
      'فخ استخدام will has: خطأ شنيع، الصح دايماً will have مع كل الضمائر.',
      'فخ وضع will في جملة by the time: خطأ، نضع مضارع بسيط.'
    ],
    examples: [
      {
        en: 'By next December, the architectural firm will have completed the new high-speed rail terminal.',
        ar: 'بحلول شهر ديسمبر القادم، ستكون الشركة المعمارية قد أتمت محطة القطار فائق السرعة الجديدة.',
        highlight: 'will have completed',
        context: 'موعد مستقبلي محدد يكتمل قبله الفعل'
      },
      {
        en: 'By the time you finish your presentation, we will have prepared the partnership contract.',
        ar: 'على بال ما تخلص عرضك التقديمي، هنكون جهزنا عقد الشراكة بالكامل.',
        highlight: 'will have prepared',
        context: 'ربط بين جملتين'
      }
    ],
    miniQuiz: [
      {
        question: 'By the end of this academic year, Dr. Mostafa ______ 25 peer-reviewed papers.',
        options: ['will have published', 'will publish', 'will has published', 'has published'],
        correct: 0,
        explanation: 'الموعد المستقبلي (By the end of this year) مع اكتمال الإنجاز يتطلب will have published.'
      }
    ]
  },

  {
    id: 'future-perfect-continuous',
    order: 13,
    category: 'أزمنة المستقبل',
    categoryEn: 'Future Tenses',
    titleAr: 'المستقبل التام المستمر: قياس مدة استمرار الفعل حتى نقطة مستقبلية',
    titleEn: 'Future Perfect Continuous',
    level: 'B2 - فوق متوسط',
    goldenFormula: 'will + have + been + Verb-ing',
    negativeFormula: "won't + have + been + Verb-ing",
    questionFormula: 'Will + Subject + have + been + Verb-ing?',
    summaryAr: 'التركيز على المدة الزمنية المستمرة لحدث سيظل قيد التنفيذ والاستمرار حتى حلول موعد مستقبلي محدد (مثال: بحلول الشهر القادم هكون شغال في الشركة بقالي ٥ سنين).',
    timelineDescription: 'شريط زمني يمتد في الماضي أو الحاضر وصولاً لنقطة مستقبلية مع التركيز على طول المدة.',
    imageUrl: ONLINE_IMAGES.grammar.pastPerfectContinuous,
    imageAlt: 'Engineer working on project continuously until milestone deadline',
    keyUsagePoints: [
      'التركيز على استمرارية وطول مدة الحدث قبل نقطة مستقبلية محددة',
      'الاستخدام الدائم مع تعبيرات المدة (for 10 years, for five hours)',
      'الربط مع By the time أو By next...'
    ],
    egyptianTips: [
      'الفرق بينه وبين المستقبل التام العادي: المستقبل التام بيركز على النتيجة (هكون خلصت)، بينما المستمر بيركز على طول التعب والمجهود (هكون بقالي كذا سنة شغال).',
      'أفعال السكون Stative Verbs (زي know, believe) لا تقبل الاستمرار، فتستخدم معها المستقبل التام العادي: By 2030, I will have known him for a decade.'
    ],
    commonTraps: [
      'فخ استخدام أفعال الحالة في صيغة الاستمرار: الخطأ will have been knowing، الصواب: will have known.'
    ],
    examples: [
      {
        en: 'By this November, engineer Tarek will have been working at Henglish for ten full years.',
        ar: 'بحلول شهر نوفمبر القادم، سيكون المهندس طارق قد أمضى عشر سنوات كاملة في العمل لدى هناوي.',
        highlight: 'will have been working',
        context: 'التركيز على طول فترة الخدمة والعمل المستمر'
      }
    ],
    miniQuiz: [
      {
        question: 'By midnight, the developers ______ for 14 continuous hours without sleep.',
        options: ['will have been coding', 'will code', 'are coding', 'coded'],
        correct: 0,
        explanation: 'التركيز على مدة الاستمرار الشاقة (for 14 continuous hours) بحلول منتصف الليل يتطلب will have been coding.'
      }
    ]
  },

  // ==========================================
  // 4. OTHER GRAMMAR TOPICS (مواضيع وقواعد أخرى)
  // ==========================================
  {
    id: 'zero-conditional',
    order: 14,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'حالة الشرط الصفرية: الحقائق العلمية والبديهيات الثابتة',
    titleEn: 'Zero Conditional',
    level: 'A2 - تأسيسي',
    goldenFormula: 'If / When + Present Simple, ... Present Simple',
    negativeFormula: "If + don't/doesn't + V1, ... don't/doesn't + V1",
    questionFormula: 'What happens if + Subject + Present Simple?',
    summaryAr: 'تُستخدم للحقائق العلمية، البديهيات الطبيعية، والنتائج الحتمية التي لا تتغير أبداً عند تحقق الشرط.',
    timelineDescription: 'حقيقة مطلقة: كلما وقع السبب (أ) حدثت النتيجة (ب) فوراً ودائماً في الحاضر والماضي والمستقبل.',
    imageUrl: ONLINE_IMAGES.grammar.conditionals,
    imageAlt: 'Natural scientific laws and equilibrium',
    keyUsagePoints: [
      'الحقائق العلمية والقوانين الفيزيائية (Scientific facts)',
      'العادات والروتين الدائم الحتمي (General truths & personal rules)',
      'إمكانية استبدال If بـ When دون أي تغيير في المعنى'
    ],
    egyptianTips: [
      'ممنوع تحط will أبداً في الصفرية! الطرفين مضارع بسيط: If you heat water, it boils (مش will boil).',
      'بالمصري: "لما بتسخن المية لـ 100 بتغلي" — دي حقيقة كونية مش مجرد احتمال!'
    ],
    commonTraps: [
      'فخ وضع will في جواب الشرط: الخطأ If ice melts, it will become water، الصواب: it becomes water.'
    ],
    examples: [
      {
        en: 'If you expose ice to high heat, it melts immediately.',
        ar: 'إذا عرضت الجليد لحرارة مرتفعة، فإنه يذوب فوراً.',
        highlight: 'expose / melts',
        context: 'حقيقة فيزيائية علمية ثابتة'
      }
    ],
    miniQuiz: [
      {
        question: 'If people don\'t drink enough water, they ______ dehydrated.',
        options: ['become', 'will become', 'became', 'would become'],
        correct: 0,
        explanation: 'حقيقة بيولوجية وصحية عامة، لذلك نستخدم الحالة الصفرية: become.'
      }
    ]
  },

  {
    id: 'first-conditional',
    order: 15,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'حالة الشرط الأولى: احتمالات ونتائج واقعية في المستقبل',
    titleEn: 'First Conditional',
    level: 'B1 - متوسط',
    goldenFormula: 'If + Present Simple, ... will / can / may + Base Verb (V1)',
    negativeFormula: "If + don't/doesn't + V1, ... won't + V1 (or Unless + affirmative)",
    questionFormula: 'If + Present Simple, what will + Subject + do?',
    summaryAr: 'موقف محتمل وواقعي جداً في المستقبل؛ إذا تحقق الشرط الآن أو لاحقاً، ستحدث النتيجة في المستقبل.',
    timelineDescription: 'شرط واقعي في الحاضر يؤدي إلى نتيجة محتملة بقوة في المستقبل.',
    imageUrl: ONLINE_IMAGES.grammar.conditionals,
    imageAlt: 'Real opportunities and future pathways',
    keyUsagePoints: [
      'توقعات واحتمالات مستقبلية حقيقية وممكنة الحدوث (Real future possibilities)',
      'التحذيرات والوعود والاتفاقات المشروطة',
      'استخدام Unless بمعنى "إذا لم" (Unless = If not)'
    ],
    egyptianTips: [
      'افتكر القاعدة الذهبية: جملة If بيجي بعدها مضارع بسيط، وجواب الشرط هو اللي بياخد will: If I study, I will pass.',
      'إياك تحط will جنب If على طول: الخطأ الشائع If I will study!'
    ],
    commonTraps: [
      'فخ وضع will في جملة الشرط: الخطأ If it will rain, we will stay، الصواب: If it rains, we will stay.'
    ],
    examples: [
      {
        en: 'If the software team deploys the hotfix tonight, the servers will run smoothly tomorrow.',
        ar: 'إذا أطلق فريق البرمجيات التحديث العاجل الليلة، ستعمل الخوادم بسلاسة غداً.',
        highlight: 'deploys / will run',
        context: 'احتمال واقعي وممكن جداً'
      }
    ],
    miniQuiz: [
      {
        question: 'If you ______ the project ahead of time, the client will award our agency a bonus.',
        options: ['deliver', 'will deliver', 'delivered', 'delivering'],
        correct: 0,
        explanation: 'في جملة If للحالة الأولى نستخدم مضارع بسيط deliver، بينما will تأتي في جواب الشرط.'
      }
    ]
  },

  {
    id: 'second-conditional',
    order: 16,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'حالة الشرط الثانية: التخيلات والفرضيات غير الحقيقية في الحاضر والنصيحة',
    titleEn: 'Second Conditional',
    level: 'B1 - متوسط',
    goldenFormula: 'If + Past Simple, ... would / could / might + Base Verb (V1)',
    negativeFormula: "If + didn't + V1, ... wouldn't + V1",
    questionFormula: 'What would you do if + Subject + Past Simple?',
    summaryAr: 'أحلام اليقظة وتخيل سيناريوهات خيالية غير واقعية في الوقت الحاضر، واستخدام If I were you لتقديم النصيحة الودية.',
    timelineDescription: 'عالم موازٍ وخيالي يختلف عن واقع الحاضر، مع التعبير عما كان سيحدث لو كان الواقع مختلفاً.',
    imageUrl: ONLINE_IMAGES.grammar.conditionals,
    imageAlt: 'Imagination and hypothetical choices',
    keyUsagePoints: [
      'تخيل مواقف غير حقيقية أو مستحيلة في الحاضر (Unreal or imaginary present)',
      'تقديم النصيحة المشهورة: If I were you, I would...',
      'استخدام were مع جميع الضمائر حتى المفرد (If he were here...)'
    ],
    egyptianTips: [
      'بالمصري: "لو كان معايا مليون دولار كنت اشتريت جزيرة" (بس الحقيقة إن معيش دلوقتي!).',
      'في النصيحة بنقول If I were you مش was.'
    ],
    commonTraps: [
      'فخ وضع would في جملة If: الخطأ If I would have money، الصواب: If I had money.'
    ],
    examples: [
      {
        en: 'If Karim spoke fluent German, he would apply for the engineering fellowship in Munich.',
        ar: 'لو كان كريم يتحدث الألمانية بطلاقة، لكان قد تقدم لمنحة الهندسة في ميونيخ (لكنه لا يتحدثها حالياً).',
        highlight: 'spoke / would apply',
        context: 'افتراض غير واقعي في الحاضر'
      },
      {
        en: 'If I were you, I would accept the job offer in Dubai immediately.',
        ar: 'لو كنت مكانك، لوافقت على عرض العمل في دبي على الفور.',
        highlight: 'were / would accept',
        context: 'نصيحة ودية'
      }
    ],
    miniQuiz: [
      {
        question: 'If we ______ a larger budget, we would hire three senior cloud engineers.',
        options: ['had', 'have', 'would have', 'will have'],
        correct: 0,
        explanation: 'الحالة الشرطية الثانية (تخيل في الحاضر): فعل الشرط ماضٍ بسيط had وجواب الشرط would hire.'
      }
    ]
  },

  {
    id: 'third-conditional',
    order: 17,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'حالة الشرط الثالثة: الندم على الماضي والفرص التي فات أوانها',
    titleEn: 'Third Conditional',
    level: 'B2 - فوق متوسط',
    goldenFormula: 'If + Past Perfect (had + V3), ... would have + Past Participle (V3)',
    negativeFormula: "If + hadn't + V3, ... wouldn't have + V3",
    questionFormula: 'What would have happened if + Subject + had + V3?',
    summaryAr: 'قاعدة الندم ولوم النفس! التعبير عن أحداث وقعت وانتهت تماماً في الماضي، وتخيل نتيجة بديلة مستحيلة الحدوث لأن الزمن فات.',
    timelineDescription: 'نقطة ماضية حُسمت بالفعل، والنظر إلى سيناريو بديل كان يمكن أن يحدث لو تغير الماضي.',
    imageUrl: ONLINE_IMAGES.grammar.conditionals,
    imageAlt: 'Looking back at the past with lessons learned',
    keyUsagePoints: [
      'الندم والتحسر على قرارات وأخطاء الماضي (Past regrets)',
      'انتقاد تصرفات سابقة وتخيل نتائجها البديلة',
      'تركيبتها الصارمة: had + V3 يقابلها would have + V3'
    ],
    egyptianTips: [
      'بالمصري: "لو كنت ذاكرت كويس ساعتها، كان زماني نجحت في الامتحان" (لكن للأسف لا ذاكرت ولا نجحت!).',
      'طالما الحدث في الماضي ومستحيل يتغير، دي الحالة التالتة فوراً.'
    ],
    commonTraps: [
      'فخ نسيان have في جواب الشرط: الخطأ would passed، الصواب: would have passed.'
    ],
    examples: [
      {
        en: 'If we had booked the airline tickets earlier, we would have saved hundreds of dollars.',
        ar: 'لو كنا حجزنا تذاكر الطيران مبكراً، لكنا وفرنا مئات الدولارات (لكننا تأخرنا وندمنا).',
        highlight: 'had booked / would have saved',
        context: 'ندم تام على فرصة ضائعة في الماضي'
      }
    ],
    miniQuiz: [
      {
        question: 'If you ______ regular backups of your database, you wouldn\'t have lost all customer records.',
        options: ['had kept', 'keep', 'kept', 'would keep'],
        correct: 0,
        explanation: 'جواب الشرط يحتوي على wouldn\'t have lost (حالة ثالثة)، إذن فعل الشرط ماضٍ تام: had kept.'
      }
    ]
  },

  {
    id: 'modal-verbs',
    order: 18,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'الأفعال الناقصة والتعبير عن الاحتمال والالتزام',
    titleEn: 'Modal Verbs (Must, Should, Could, Might)',
    level: 'B1 - متوسط',
    goldenFormula: 'Modal + Base Verb (V1)',
    negativeFormula: "Must not / Shouldn't / Couldn't / Might not + V1",
    questionFormula: 'Modal + Subject + Base Verb?',
    summaryAr: 'الأفعال المساعدة التي تضفي نكهة المعنى على الجملة: الإلزام الإجباري (Must)، النصيحة (Should)، القدرة (Can/Could)، والاحتمالية الضعيفة أو القوية (Might/May/Must be).',
    timelineDescription: 'درجات مختلفة من اليقين والاحتمال والواجب والقدرة.',
    imageUrl: ONLINE_IMAGES.grammar.modalVerbs,
    imageAlt: 'Business team evaluating possibilities and strategic priorities',
    keyUsagePoints: [
      'الإلزام والضرورة الصارمة (Must vs Have to)',
      'المنع والتحريم القانوني القاطع (Mustn\'t)',
      'النصيحة والاقتراح الأفضل (Should / Ought to)',
      'الاستنتاج القائم على دليل (Deduction: Must be vs Can\'t be)'
    ],
    egyptianTips: [
      'Mustn\'t معناها "ممنوع قطعاً ضد القانون!" زي ممنوع الركن هنا أو التدخين في المستشفى.',
      'Don\'t have to معناها "مش لازم.. إنت براحتك"، مش ممنوع لكن مفيش داعي.',
      'في الاستنتاج: He must be rich يعني "أكيد غني جداً من غير شك". He can\'t be poor يعني "مستحيل يكون فقير".'
    ],
    commonTraps: [
      'فخ وضع to بعد can أو must أو should: الخطأ He must to go، الصواب: He must go.'
    ],
    examples: [
      {
        en: 'You must sign the non-disclosure agreement before accessing confidential client data.',
        ar: 'يجب عليك توقيع اتفاقية عدم الإفصاح قبل الاطلاع على بيانات العملاء السرية.',
        highlight: 'must sign',
        context: 'إلزام قانوني وأمني صارم'
      },
      {
        en: 'His office lights are still on and his laptop is open; he must be working on the urgent proposal.',
        ar: 'أضواء مكتبه لا تزال مضاءة وحاسوبه مفتوح؛ لا بد وأنه يعمل على المقترح العاجل بالتأكيد.',
        highlight: 'must be working',
        context: 'استنتاج منطقي قوي مبني على دليل مرئي'
      }
    ],
    miniQuiz: [
      {
        question: 'You ______ show your boarding pass at the gate; otherwise, security won\'t let you board.',
        options: ['have to', 'should', 'might', 'would'],
        correct: 0,
        explanation: 'إلزام خارجي وقانوني إجباري من سلطات المطار، لذلك نستخدم have to.'
      }
    ]
  },

  {
    id: 'passive-voice',
    order: 19,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'المبني للمجهول الشامل في جميع الأزمنة',
    titleEn: 'Passive Voice Across All Tenses',
    level: 'B2 - فوق متوسط',
    goldenFormula: 'Object + Appropriate Form of "Be" + Past Participle (V3)',
    negativeFormula: "Be + not + V3",
    questionFormula: 'Be + Object + V3?',
    summaryAr: 'المبني للمجهول هو لغة الأخبار الرسمية، التقارير العلمية، وتكنولوجيا المعلومات! بنستخدمه لما يكون المفعول به والحدث نفسه أهم بكتير من الشخص اللي عمله، أو لما يكون الفاعل مجهولاً أو بديهياً.',
    timelineDescription: 'نقل بؤرة التركيز من الفاعل (المبتدئ) إلى المتلقي والمفعول والنتيجة المنجزة.',
    imageUrl: ONLINE_IMAGES.grammar.passiveVoice,
    imageAlt: 'Modern high-tech engineering and robotics manufacturing line',
    keyUsagePoints: [
      'عندما يكون الحدث أو النتيجة أهم من الفاعل نفسه',
      'في المقالات والتقارير الأكاديمية والصحفية الرسمية',
      'عندما يكون الفاعل مجهولاً تماماً أو واضحاً للجميع بالبديهة'
    ],
    egyptianTips: [
      'القاعدة الذهبية لتحويل أي زمن لمبني للمجهول: 1) ابدأ بالمفعول به. 2) صرّف فعل be في نفس زمن الجملة الأصلي. 3) حط الفعل الأساسي في التصريف الثالث V3.',
      'في المستقبل التام: will have ➔ will have been + V3: The project will have been delivered.',
      'في المضارع المستمر: is doing ➔ is being done: The bridge is being repaired.'
    ],
    commonTraps: [
      'فخ نسيان تصريف be: الخطأ The email sent yesterday، الصواب: The email was sent yesterday.'
    ],
    examples: [
      {
        en: 'The security vulnerability was patched by the cybersecurity team within two hours.',
        ar: 'تمت معالجة الثغرة الأمنية وسدها من قبل فريق الأمن السيبراني في غضون ساعتين.',
        highlight: 'was patched',
        context: 'مبني للمجهول في الماضي البسيط (Past Simple Passive)'
      },
      {
        en: 'By 2030, all official municipal documents will have been digitized across the city.',
        ar: 'بحلول عام 2030، ستكون جميع الوثائق البلدية الرسمية قد تم تحويلها رقمياً بالكامل في أنحاء المدينة.',
        highlight: 'will have been digitized',
        context: 'مبني للمجهول في المستقبل التام (Future Perfect Passive)'
      }
    ],
    miniQuiz: [
      {
        question: 'The new national museum ______ by the prime minister next Thursday.',
        options: ['will be inaugurated', 'will inaugurate', 'is inaugurated', 'inaugurated'],
        correct: 0,
        explanation: 'المتحف مفعول به وسيتم افتتاحه في المستقبل من قبل رئيس الوزراء، فنستخدم will be inaugurated.'
      }
    ]
  },

  {
    id: 'reported-speech',
    order: 20,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'الكلام المنقول: نقل الجمل والأسئلة باحترافية',
    titleEn: 'Reported Speech (Direct to Indirect)',
    level: 'B2 - فوق متوسط',
    goldenFormula: 'Backshift: Present ➔ Past | Past ➔ Past Perfect | Will ➔ Would',
    negativeFormula: 'Told me not to + V1',
    questionFormula: 'Asked me if / wh-word + Subject + Verb',
    summaryAr: 'إزاي تنقل كلام شخص تاني بدقة دون أن تكرره بين أقواس تنصيص؟ السر يكمن في "خطوة واحدة إلى الوراء في الزمن" (Backshift of tenses) مع ضبط الضمائر والظروف الزمانية.',
    timelineDescription: 'إرجاع الزمن خطوة إلى الماضي للتعبير عن كلام قيل في نقطة سابقة.',
    imageUrl: ONLINE_IMAGES.grammar.reportedSpeech,
    imageAlt: 'Journalist conducting professional interview with audio recorder',
    keyUsagePoints: [
      'نقل الأخبار والتصريحات الصحفية والمراسلات الرسمية',
      'تحويل الأسئلة المباشرة إلى أسئلة غير مباشرة (Embedded Questions)',
      'تغيير ظروف الزمان والمكان (now ➔ then, tomorrow ➔ the next day)'
    ],
    egyptianTips: [
      'في نقل السؤال، بنلغي تكوين السؤال ونرجعه جملة عادية: He asked where I lived (مش where did I live)!',
      'Said بيجي بعدها الكلام مباشرة، بينما Told لازم يجي بعدها مفعول به يوضح مين اللي سمع: He told ME that...'
    ],
    commonTraps: [
      'فخ إبقاء صيغة السؤال المعكوس: الخطأ She asked me what was my name، الصواب: She asked me what my name was.'
    ],
    examples: [
      {
        en: '"I will deliver the design files by 5 PM," Omar said. ➔ Omar said that he would deliver the design files by 5 PM.',
        ar: 'عمر قال إنه سيسلم ملفات التصميم بحلول الساعة الخامسة مساءً.',
        highlight: 'would deliver',
        context: 'تحويل will إلى would في الكلام المنقول'
      }
    ],
    miniQuiz: [
      {
        question: 'Sarah told me that she ______ her master\'s degree the previous year.',
        options: ['had completed', 'has completed', 'will complete', 'completes'],
        correct: 0,
        explanation: 'الزمن الماضي الأصلي يعود خطوة للوراء ليصبح ماضياً تاماً had completed في الكلام المنقول.'
      }
    ]
  },

  {
    id: 'relative-clauses',
    order: 21,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'ضمائر الوصل وجمل الصلة: دمج الجمل بسلاسة',
    titleEn: 'Relative Clauses (Who, Which, That, Whose, Where)',
    level: 'B1 - متوسط',
    goldenFormula: 'Noun + Relative Pronoun (Who / Which / That / Whose / Where) + Clause',
    negativeFormula: 'Without relative pronoun (contact clauses)',
    questionFormula: 'Who / Which...',
    summaryAr: 'ربط الجمل والأفكار بطريقة سلسة دون تكرار الكلمات الممل: Who للعاقل، Which لغير العاقل، That للاثنين، Whose للملكية، وWhere للمكان.',
    timelineDescription: 'وصل بين فكرتين أو جملتين لتعريف اسم معين أو إضافة معلومة إضافية عنه.',
    imageUrl: ONLINE_IMAGES.grammar.relativeClauses,
    imageAlt: 'Connected global network bridging teams together',
    keyUsagePoints: [
      'جمل الوصل المحددة (Defining): أساسية لفهم المعنى ولا توضع بين فواصل',
      'جمل الوصل غير المحددة (Non-defining): معلومات إضافية بين فاصلتين وتستخدم which للعاقل ولا تستخدم that أبداً',
      'حذف ضمير الوصل إذا جاء بعده فاعل وفعل (Contact clauses)'
    ],
    egyptianTips: [
      'في الجمل اللي فيها فواصل (Non-defining)، ممنوع تستخدم That نهائياً! استخدم who أو which.',
      'Whose بتيجي بين اسمين وبتعبر عن ملكية الاسم التاني للأولاني: The student whose car was stolen.'
    ],
    commonTraps: [
      'فخ استخدام that بعد فاصلة: الخطأ Cairo, that is the capital...، الصواب: Cairo, which is the capital...'
    ],
    examples: [
      {
        en: 'The software engineer who designed our security architecture won the global developer award.',
        ar: 'مهندس البرمجيات الذي صمم بنيتنا الأمنية فاز بجائزة المطورين العالمية.',
        highlight: 'who designed',
        context: 'ضمير وصل للعاقل يحدد الشخص بدقة'
      }
    ],
    miniQuiz: [
      {
        question: 'This is the senior data scientist ______ algorithm increased our accuracy by 40%.',
        options: ['whose', 'who', 'which', 'whom'],
        correct: 0,
        explanation: 'الخوارزمية ملك للعالمة، لذلك نستخدم ضمير الملكية whose.'
      }
    ]
  },

  {
    id: 'parts-of-speech',
    order: 22,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Grammar Foundations',
    titleAr: 'أقسام الكلام الثمانية وتشريح الجملة الإنجليزية',
    titleEn: 'The 8 Parts of Speech & Sentence Anatomy',
    level: 'A1 - مبتدئ',
    goldenFormula: 'Subject + Verb + Object / Complement (S + V + O)',
    negativeFormula: 'Subject + Auxiliary + Not + Main Verb',
    questionFormula: '(Question Word) + Auxiliary + Subject + Main Verb?',
    summaryAr: 'كل كلمة باللغة الإنجليزية تنتمي لواحد من أقسام الكلام الثمانية: الاسم، الضمير، الفعل، الصفة، الظرف، حرف الجر، الرابط، وأداة التعجب. فهم وظيفة كل كلمة هو حجر الأساس لبناء جملة صحيحة بدون أخطاء.',
    timelineDescription: 'البنية الهيكلية الثابتة للجملة في الإنجليزية.',
    imageUrl: ONLINE_IMAGES.modernClassroom,
    imageAlt: 'Grammar board and structured language foundations lecture',
    keyUsagePoints: [
      'الاسم والضمير (Nouns & Pronouns): يمثلان الفاعل أو المفعول به في الجملة.',
      'الفعل (Verbs): قلب الجملة النابض ومحدد زمن الحدث.',
      'الصفة (Adjectives): تصف الاسم وتأتي قبله دائماً في الإنجليزية (a brilliant engineer).',
      'الظرف (Adverbs): يصف الفعل أو الصفة أو ظرفاً آخر وغالباً ينتهي بـ -ly (spoke fluently).'
    ],
    egyptianTips: [
      'في العربي الصفة بتيجي بعد الموصوف (مهندس شاطر)، لكن في الإنجليزي العكس تماماً: الصفة بتيجي الأول (a clever engineer).',
      'مستحيل في الإنجليزية جملة بدون فعل! جملة زي "هو طبيب" في العربي لازم في الإنجليزي يبقى فيها فعل كينونة: He is a doctor.'
    ],
    commonTraps: [
      'فخ الجملة بدون فعل: الخطأ He doctor، الصواب: He is a doctor.',
      'فخ موقع الصفة الخاطئ: الخطأ He bought a car red، الصواب: He bought a red car.'
    ],
    examples: [
      {
        en: 'The diligent developer rapidly resolved the critical database error.',
        ar: 'قام المطور المجتهد بحل خطأ قاعدة البيانات الحرج بسرعة فائقة.',
        highlight: 'diligent ... rapidly resolved',
        context: 'تطبيق عملي: صفة + فاعل + ظرف + فعل ماضٍ + مفعول'
      }
    ],
    miniQuiz: [
      {
        question: 'In the sentence "The team worked extraordinarily hard", the word "extraordinarily" functions as a/an ______.',
        options: ['adverb (ظرف)', 'adjective (صفة)', 'verb (فعل)', 'noun (اسم)'],
        correct: 0,
        explanation: 'الكلمة تنتهي بـ -ly وتصف الظرف hard، لذا هي adverb (ظرف درجة).'
      }
    ]
  },

  {
    id: 'articles-determiners',
    order: 23,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Articles & Quantifiers',
    titleAr: 'أدوات النكرة والمعرفة والكميات: A, An, The & Quantifiers',
    titleEn: 'Articles (A, An, The) & Quantifiers',
    level: 'A2 - تأسيسي',
    goldenFormula: 'a / an + singular countable noun | the + specific noun',
    negativeFormula: 'no / none of + noun',
    questionFormula: 'How much (uncountable) / How many (countable)?',
    summaryAr: 'أدوات التعريف والتنكير من أكبر التحديات للمتحدث العربي. نستخدم a/an مع الأسماء المفردة المعدودة غير المحددة، بينما نستخدم the عندما يكون الشيء معروفاً للسامع، ونستخدم zero article مع الجمع العام والأسماء المعنوية.',
    timelineDescription: 'تحديد دقة الإشارة للاسم: عام، مجهول، أم محدد بعينه.',
    imageUrl: ONLINE_IMAGES.libraryStudy,
    imageAlt: 'Library books and precise article reference materials',
    keyUsagePoints: [
      'A / An: نكرة للاسم المفرد المعدود، نستخدم an قبل الأصوات المتحركة (an honest man, an hour).',
      'The: أداة المعرفة الوحيدة في الإنجليزية للشيء المحدد أو الفريد من نوعه (the sun, the CEO).',
      'Much / Many: Much للكميات غير المعدودة (much water)، Many للأعداد المعدودة (many books).',
      'Few / Little: Few مع المعدود، Little مع غير المعدود (A few/A little تعني كمية كافية إيجابية).'
    ],
    egyptianTips: [
      'العبرة في استخدام an بالصوت مش بالحرف! كلمة honest بتبدأ بحرف ساكن h بس صوته أ /ɒ/ عشان كده بتاخد an honest person.',
      'الأسماء المعنوية والوجبات والرياضات واللغات مبتاخدش the في العموم: English is fun (مش The English).'
    ],
    commonTraps: [
      'فخ وضع a مع اسم لا يُعد: الخطأ a news / an advice، الصواب: a piece of news / a piece of advice.',
      'فخ استخدام an مع University: الخطأ an university، الصواب: a university لأن الصوت الأول ي /j/ ساكن وليس متحركاً.'
    ],
    examples: [
      {
        en: 'She earned a master’s degree from an accredited university in London.',
        ar: 'حصلت على درجة الماجستير من جامعة معتمدة في لندن.',
        highlight: 'a master’s ... an accredited',
        context: 'استخدام a و an بدقة بحسب الصوت البادئ'
      }
    ],
    miniQuiz: [
      {
        question: 'It took him ______ hour to finish reading ______ interesting book I lent him.',
        options: ['an / the', 'a / the', 'an / an', 'the / a'],
        correct: 0,
        explanation: 'كلمة hour تبدأ بصوت متحرك فتأخذ an، والكتاب محدد ومعروف للمتحدث فتأخذ the.'
      }
    ]
  },

  {
    id: 'prepositions-mastery',
    order: 24,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Prepositions of Time & Place',
    titleAr: 'حروف الجر للزمان والمكان: هرم In, On, At',
    titleEn: 'Prepositions of Time and Place (In, On, At)',
    level: 'A2 - تأسيسي',
    goldenFormula: 'In (عام/واسع) → On (متوسط/أيام/شوارع) → At (دقيق/ساعات/عناوين)',
    negativeFormula: 'without + noun / pronoun',
    questionFormula: 'At what time? / On which day? / Where in...?',
    summaryAr: 'تذكر هرم حروف الجر الشهير: In للأوسع والأكبر (السنوات، الفصول، الشهور، المدن، الدول). On للأضيق قليلاً (الأيام، التواريخ المحددة، الشوارع). At للنقطة المحددة بدقة متناهية (الساعات، العناوين المحددة برقم، الأماكن النقطية).',
    timelineDescription: 'تدرج من النطاق الزمني والمكاني العام إلى النقطة المتناهية الدقة.',
    imageUrl: ONLINE_IMAGES.mentorStudent,
    imageAlt: 'Mentor guiding student through precise location maps and schedules',
    keyUsagePoints: [
      'At: للوقت الدقيق (at 5 PM, at midnight, at noon) والمواقع المحددة (at the bus stop, at 45 Baker St).',
      'On: للأيام والتواريخ (on Monday, on October 25th) والأسطح ووسائل المواصلات العامة (on the bus, on the plane).',
      'In: للشهور والسنوات والقرون (in 2026, in July, in winter) والأماكن المغلقة والمدن والدول (in Egypt, in Cairo).'
    ],
    egyptianTips: [
      'سر وسائل المواصلات: المركبة اللي تقدر تقف فيها وتمشي بتاخد on (on the train, on the plane, on the bus)، بينما المركبة اللي لازم تقعد فيها وتنحني بتاخد in (in the car, in the taxi).',
      'مع عطلة نهاية الأسبوع البريطانيون بيقولوا at the weekend، بينما الأمريكيون بيفضلوا on the weekend.'
    ],
    commonTraps: [
      'فخ استخدام at مع الشهور والسنوات: الخطأ at July / at 2026، الصواب: in July / in 2026.',
      'فخ وضع on قبل الساعات: الخطأ on 8:00 AM، الصواب: at 8:00 AM.'
    ],
    examples: [
      {
        en: 'The keynote presentation starts at 9:00 AM sharp on Monday in the main conference hall.',
        ar: 'تبدأ الكلمة الافتتاحية في تمام الساعة 9:00 صباحاً يوم الإثنين في قاعة المؤتمرات الرئيسية.',
        highlight: 'at 9:00 AM ... on Monday ... in the hall',
        context: 'تطبيق هرمي شامل: at للساعة، on لليوم، in للقاعة'
      }
    ],
    miniQuiz: [
      {
        question: 'The global summit will take place ______ Dubai ______ October 15th ______ 10:00 AM.',
        options: ['in / on / at', 'at / in / on', 'on / at / in', 'in / at / on'],
        correct: 0,
        explanation: 'المدينة تأخذ in، والتاريخ المحدد باليوم يأخذ on، والساعة الدقيقة تأخذ at.'
      }
    ]
  },

  {
    id: 'gerunds-infinitives',
    order: 25,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Gerunds & Infinitives',
    titleAr: 'المصدر واسم الفاعل: Gerund (V-ing) vs. Infinitive (To + V)',
    titleEn: 'Gerunds and Infinitives (V-ing vs. To + Verb)',
    level: 'B2 - فوق متوسط',
    goldenFormula: 'Verb + Gerund (V-ing) OR Verb + Full Infinitive (to + V)',
    negativeFormula: 'not to + V / not + V-ing',
    questionFormula: 'Do you enjoy doing...? / Would you like to do...?',
    summaryAr: 'متى نضع بعد الفعل to + المصدر ومتى نضع ing؟ بعض الأفعال تشترط المصدر مثل (decide, hope, manage, promise)، وأفعال أخرى تشترط اسم الفاعل مثل (enjoy, avoid, suggest, admit). وهناك أفعال يتغير معناها بالكامل مثل stop و remember!',
    timelineDescription: 'تحديد دلالة الفعل الثاني: هدف مستقبلي (to + V) أم تجربة وفعل مستمر (V-ing).',
    imageUrl: ONLINE_IMAGES.grammar.gerundsInfinitives,
    imageAlt: 'Writer taking handwritten notes planning creative goals',
    keyUsagePoints: [
      'Verbs followed by Gerund: enjoy, avoid, practice, mind, consider, postpone, keep.',
      'Verbs followed by Infinitive: decide, plan, hope, expect, offer, agree, afford.',
      'Preposition + Gerund: أي حرف جر في الإنجليزية يتبعه V-ing حتماً (interested in learning, good at speaking).',
      'Change in meaning: Remember to do (تذكر أن يفعل - تذكر أولاً ثم فعل) مقابل Remember doing (يتذكر أنه فعل في الماضي).'
    ],
    egyptianTips: [
      'بعد حروف الجر بدون استثناء بنحط ing: I am looking forward to meeting you (هنا to حرف جر وليس علامة مصدر).',
      'فعل stop to do معناها توقف لكي يفعل شيئاً آخر: He stopped to drink water (وقف عشان يشرب). أما stop doing معناها امتنع عن العادة: He stopped smoking (بطل تدخين نهائياً).'
    ],
    commonTraps: [
      'فخ استخدام المصدر بعد look forward to: الخطأ I look forward to meet you، الصواب: I look forward to meeting you.',
      'فخ وضع to بعد enjoy: الخطأ I enjoy to swim، الصواب: I enjoy swimming.'
    ],
    examples: [
      {
        en: 'The architect managed to secure the approval without compromising the ecological design.',
        ar: 'نجح المهندس المعماري في تأمين الموافقة دون المساومة على التصميم البيئي.',
        highlight: 'managed to secure ... without compromising',
        context: 'manage يتبعه مصدر to secure، وحرف الجر without يتبعه gerund'
      }
    ],
    miniQuiz: [
      {
        question: 'She decided ______ abroad, and she is truly looking forward to ______ her studies.',
        options: ['to travel / commencing', 'traveling / commence', 'to travel / commence', 'traveling / commencing'],
        correct: 0,
        explanation: 'الفعل decide يتبعه مصدر to travel، والتعبير looking forward to يتبعه gerund فتكون commencing.'
      }
    ]
  },

  {
    id: 'causatives-inversion',
    order: 26,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Causatives & Inversion',
    titleAr: 'الصيغ السببية والتقديم البلاغي: Causatives & Negative Inversion',
    titleEn: 'Causative Verbs (Have/Get) & Negative Inversion',
    level: 'C1 - متقدم',
    goldenFormula: 'have/get + object + V3 (Causative) | Negative Adverb + Aux + Subject + Verb (Inversion)',
    negativeFormula: 'Never / Rarely / Seldom / Under no circumstances + Auxiliary + S + V',
    questionFormula: 'Did you have it done? / Had she known...?',
    summaryAr: 'من أقوى أساليب الإنجليزية المتقدمة لإبهار لجان التقييم وممتحني الآيلتس والحديث الاحترافي! السببية (Causative) تعني أنك لم تقم بالعمل بنفسك بل طلبت من متخصص إنجازه. وأسلوب التقديم (Inversion) يقلب ترتيب الجملة لتوكيد بلاغي فائق.',
    timelineDescription: 'توكيد بلاغي راقٍ وتكليف بالمهام للمحترفين.',
    imageUrl: ONLINE_IMAGES.onlineTechLecture,
    imageAlt: 'Executive presentation showing advanced linguistic mastery and rhetoric',
    keyUsagePoints: [
      'Causative Have / Get: have something done (I had my laptop repaired = الفني هو اللي صلحها مش أنا).',
      'Active Causatives: have someone do (مصدر بدون to) مقابل get someone to do (مع to).',
      'Negative Inversion: عند بدء الجملة بظرف سلبي مثل (Never, Seldom, Rarely, Hardly, Scarcely, Not only)، تأخذ الجملة شكل صيغة السؤال: Never have I seen such dedication!',
      'Conditional Inversion: Had I known, I would have warned you (بديلة عن If I had known).'
    ],
    egyptianTips: [
      'لما تقول I cut my hair معناه مسكت المقص وقصيت شعرك بنفسك! لو روّحت للحلاق الصح تقول: I had my hair cut.',
      'في الـ Inversion، أول ما تبدأ الجملة بـ Never أو Seldom، عامل باقي الجملة زي تكوين السؤال: حط الفعل المساعد قبل الفاعل.'
    ],
    commonTraps: [
      'فخ الترتيب العادي بعد الظرف السلبي: الخطأ Rarely she speaks in public، الصواب: Rarely does she speak in public.',
      'فخ الخلط بين have و get مع الفاعل: الخطأ I had him to clean، الصواب: I had him clean / I got him to clean.'
    ],
    examples: [
      {
        en: 'Hardly had the platform launched when it recorded over one hundred thousand active subscribers.',
        ar: 'لم تكد المنصة تنطلق حتى سجلت أكثر من مئة ألف مشترك نشط.',
        highlight: 'Hardly had the platform launched',
        context: 'تقديم سلبي متقدم (Inversion) يماثل أعلى درجات البلاغة الإنجليزية'
      }
    ],
    miniQuiz: [
      {
        question: 'Under no circumstances ______ reveal your security password to unauthorized personnel.',
        options: ['should you', 'you should', 'you must', 'you ought'],
        correct: 0,
        explanation: 'البدء بالتعبير السلبي Under no circumstances يستوجب الـ Inversion (تقديم الفعل المساعد should على الفاعل you).'
      }
    ]
  },

  {
    id: 'question-tags',
    order: 27,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Question Tags',
    titleAr: 'الأسئلة المذيلة: إزاي تخلي كلامك ودود وتأكيدي',
    titleEn: 'Question Tags',
    level: 'A2 - تأسيسي',
    goldenFormula: "Statement, + opposite auxiliary + pronoun? (You are coming, aren't you?)",
    negativeFormula: "Negative statement, + positive tag? (He isn't ready, is he?)",
    questionFormula: "Positive statement, + negative tag? (She speaks French, doesn't she?)",
    summaryAr: 'السؤال المذيل هو ذيل صغير في آخر الجملة بيحول الكلام الخبري لسؤال لطيف، وبيدي إحساس بالثقة والألفة في المحادثة. القاعدة الذهبية: جملة موجبة تأخذ ذيل منفي، وجملة منفية تأخذ ذيل موجب.',
    timelineDescription: 'أداة محادثة يومية للتأكد من المعلومة أو فتح كلام ودود.',
    imageUrl: ONLINE_IMAGES.mentorStudent,
    imageAlt: 'Friendly conversation confirming information with a question tag',
    keyUsagePoints: [
      'القاعدة الأساسية: جملة موجبة + ذيل منفي، وجملة منفية + ذيل موجب.',
      'الذيل بيستخدم نفس الفعل المساعد بتاع الجملة: is, do, did, will, have, can.',
      "لو الجملة مفيهاش فعل مساعد، بنستخدم do/does/did حسب الزمن: You like coffee, don't you?",
      "حالات خاصة: I am → aren't I | Let's → shall we | الأوامر → will you?"
    ],
    egyptianTips: [
      "فكر فيها زي كلمة 'صح؟' أو 'مش كده؟' في المصري: انت جاي، صح؟ = You are coming, aren't you?",
      'النبرة بتفرق: لو نازلة في الآخر يبقى انت متأكد وبتأكد المعلومة، لو طالعة يبقى بتسأل فعلاً ومش متأكد.',
      "متنساش قاعدة I am: الذيل بتاعها aren't I مش amn't I: I'm late, aren't I?"
    ],
    commonTraps: [
      "فخ تطابق الإيجاب مع الإيجاب: الخطأ You are tired, are you? الصواب: You are tired, aren't you?",
      "فخ نسيان do مع الأفعال العادية: الخطأ He plays well, playsn't he? الصواب: He plays well, doesn't he?",
      "فخ ترجمة 'صح' حرفياً بـ true: الذيل لازم يكون فعل مساعد + ضمير، مش كلمة ثابتة."
    ],
    examples: [
      {
        en: "The meeting starts at 9 AM, doesn't it?",
        ar: 'الاجتماع يبدأ الساعة 9 الصبح، صح؟',
        highlight: "doesn't it",
        context: 'جملة موجبة في المضارع البسيط تأخذ ذيل منفي بـ does'
      },
      {
        en: "You haven't finished the report yet, have you?",
        ar: 'لسه مخلصتش التقرير، صح؟',
        highlight: 'have you',
        context: 'جملة منفية بـ haven\'t تأخذ ذيل موجب'
      },
      {
        en: "Let's review the lesson together, shall we?",
        ar: 'يلا نراجع الدرس سوا، موافق؟',
        highlight: 'shall we',
        context: "حالة خاصة: Let's دايماً ذيلها shall we"
      },
      {
        en: "I'm joining the new course next week, aren't I?",
        ar: 'أنا هدخل الكورس الجديد الأسبوع الجاي، مش كده؟',
        highlight: "aren't I",
        context: 'الحالة الخاصة للفعل am في المتكلم المفرد'
      }
    ],
    miniQuiz: [
      {
        question: 'She can swim very well, ______?',
        options: ["can she", "can't she", "does she", "isn't she"],
        correct: 1,
        explanation: 'الجملة موجبة والفعل المساعد can، فالذيل لازم يكون منفي: can\'t she.'
      },
      {
        question: 'They moved to Cairo last year, ______?',
        options: ["did they", "didn't they", "don't they", "weren't they"],
        correct: 1,
        explanation: 'الفعل moved في الماضي البسيط بدون مساعد ظاهر، فالذيل يكون didn\'t they.'
      },
      {
        question: 'Close the window, ______?',
        options: ["do you", "will you", "won't you", "shall we"],
        correct: 1,
        explanation: 'بعد جملة الأمر بنستخدم will you كذيل مهذب شائع.'
      }
    ]
  },

  {
    id: 'used-to-would',
    order: 28,
    category: 'أزمنة الماضي',
    categoryEn: 'Past Habits',
    titleAr: 'عادات الماضي المنقطعة: الفرق بين Used to و Would',
    titleEn: 'Used To & Would for Past Habits',
    level: 'B1 - متوسط',
    goldenFormula: 'Subject + used to / would + base verb (I used to play / I would play)',
    negativeFormula: "Subject + didn't use to + base verb",
    questionFormula: 'Did + subject + use to + base verb?',
    summaryAr: 'زمن خاص للحاجات اللي كانت بتحصل في الماضي وبطلت دلوقتي: عادات قديمة، أوضاع اتغيرت، ذكريات. Used to تصلح للأفعال والحالات، لكن Would تصلح للأفعال المتكررة بس وممنوعة مع أفعال الحالة.',
    timelineDescription: 'عادات وأوضاع كانت موجودة في الماضي وانتهت تماماً الآن.',
    imageUrl: ONLINE_IMAGES.grammar.pastSimple,
    imageAlt: 'Old photo album representing past habits and memories',
    keyUsagePoints: [
      'Used to + مصدر: عادة أو حالة في الماضي انتهت: I used to smoke (بطلت التدخين).',
      'Would + مصدر: عادة ماضية متكررة (فعل حركة بس): We would walk to school together.',
      'ممنوع Would مع أفعال الحالة زي be, have, live, like: مينفعش I would be shy.',
      "في النفي والسؤال بنشيل حرف الـ d: didn't use to / Did you use to?"
    ],
    egyptianTips: [
      'Used to معناها بالظبط "كنت بـ... وأيامها خلاص راحت": I used to play football = كنت بلعب كورة زمان.',
      'لو الفعل حالة مش حركة (زي أكون، أحب، أسكن) استخدم used to بس وانسَ would.',
      "افتكر إن بعد didn't و Did بنرجع لـ use to بدون d لأن الـ d راحت للفعل المساعد."
    ],
    commonTraps: [
      "فخ كتابة didn't used to: الخطأ He didn't used to swim، الصواب: He didn't use to swim.",
      'فخ استخدام would مع حالة: الخطأ I would be very shy as a child، الصواب: I used to be very shy as a child.',
      'فخ الخلط مع be used to + gerund (معتاد على): I am used to waking up early معناها أنا متعود، مش عادة ماضية.'
    ],
    examples: [
      {
        en: 'When I was a kid, we used to spend every summer at my grandmother\'s house in the village.',
        ar: 'لما كنت صغير، كنا بنقضي كل صيف في بيت تيتة في القرية.',
        highlight: 'used to spend',
        context: 'عادة ماضية منتظمة انتهت'
      },
      {
        en: 'My grandfather would tell us amazing stories about his travels every evening.',
        ar: 'جدي كان يحكيلنا حكايات مذهلة عن رحلاته كل مساء.',
        highlight: 'would tell',
        context: 'فعل حركة متكرر في الماضي - would مناسبة هنا'
      },
      {
        en: 'I didn\'t use to like coffee, but now I can\'t start my day without it.',
        ar: 'ماكنتش بحب القهوة زمان، بس دلوقتي مبقدرش أبدأ يومي من غيرها.',
        highlight: "didn't use to like",
        context: 'نفي صحيح بدون حرف d + فعل حالة like'
      },
      {
        en: 'Did you use to play any musical instruments when you were at school?',
        ar: 'كنت بتلعب على أي آلة موسيقية وأنت في المدرسة؟',
        highlight: 'Did you use to play',
        context: 'صيغة سؤال صحيحة عن عادة ماضية'
      }
    ],
    miniQuiz: [
      {
        question: 'There ______ a small cinema in our street, but it closed years ago.',
        options: ['would be', 'used to be', 'was used to be', 'use to be'],
        correct: 1,
        explanation: 'الجملة عن حالة (وجود سينما) انتهت، وأفعال الحالة تأخذ used to وليس would.'
      },
      {
        question: 'Every Friday, we ______ visit our relatives and have lunch together.',
        options: ['use to', 'would', 'are used to', 'used'],
        correct: 1,
        explanation: 'عادة ماضية متكررة (فعل حركة visit) فتصلح would.'
      },
      {
        question: 'Did you ______ wear a uniform at your old school?',
        options: ['used to', 'use to', 'using to', 'would to'],
        correct: 1,
        explanation: 'بعد Did في السؤال نستخدم use to بدون d.'
      }
    ]
  },

  {
    id: 'comparatives-superlatives',
    order: 29,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Comparison',
    titleAr: 'المقارنة والتفضيل: إزاي تقول الأحسن والأفضل صح',
    titleEn: 'Comparatives & Superlatives',
    level: 'A2 - تأسيسي',
    goldenFormula: 'short adj + er + than | more + long adj + than | the + adj + est / the most + adj',
    negativeFormula: 'not as + adjective + as (This book is not as interesting as that one)',
    questionFormula: 'Which is + comparative, A or B? / What is the + superlative?',
    summaryAr: 'عشان تقارن بين حاجتين بنضيف er للصفة القصيرة أو more للطويلة، وعشان نفضل حاجة على الكل بنستخدم the est أو the most. وفي صفات شاذة لازم تحفظها زي good/better/best.',
    timelineDescription: 'بناء ثابت في المستوى التأسيسي للمقارنات اليومية والتفضيل.',
    imageUrl: ONLINE_IMAGES.learningStudyGroup,
    imageAlt: 'Students comparing results and choosing the best option',
    keyUsagePoints: [
      'صفة من مقطع واحد: + er / the + est (tall / taller / the tallest).',
      'صفة طويلة (مقطعين فأكثر): more / the most (more beautiful / the most beautiful).',
      'صفة منتهية بـ y: تتحول لـ ier / iest (happy / happier / the happiest).',
      'الشواذ المحفوظة: good/better/best, bad/worse/worst, far/further/furthest.'
    ],
    egyptianTips: [
      'قاعدة سريعة: الصفة القصيرة تاخد er، والطويلة تاخد more. لو شكيت، more غالباً صح.',
      'متنساش than بعد المقارنة و the قبل التفضيل: taller than / the tallest.',
      "طريقة not as ... as حلوة جداً للدبلوماسية: بدل ما تقول أسوأ، قول مش بنفس الجودة: not as good as."
    ],
    commonTraps: [
      'فخ جمع الاثنين: الخطأ more taller، الصواب: taller (اختار طريقة واحدة بس).',
      'فخ نسيان the مع التفضيل: الخطأ Cairo is biggest city، الصواب: Cairo is the biggest city.',
      'فخ الشواذ: الخطأ gooder / baddest، الصواب: better / worst.'
    ],
    examples: [
      {
        en: 'Cairo is much bigger than Alexandria, but Alexandria is quieter in winter.',
        ar: 'القاهرة أكبر بكتير من الإسكندرية، بس الإسكندرية أهدى في الشتا.',
        highlight: 'bigger than',
        context: 'مقارنة بين مدينتين بصفة قصيرة + than'
      },
      {
        en: 'This is the most useful English course I have ever taken.',
        ar: 'ده أنفع كورس إنجليزي خدته في حياتي.',
        highlight: 'the most useful',
        context: 'تفضيل لصفة طويلة مع تجربة حياتية (Present Perfect)'
      },
      {
        en: 'The new metro line is faster and more comfortable than the old buses.',
        ar: 'المترو الجديد أسرع وأريح من الأتوبيسات القديمة.',
        highlight: 'faster and more comfortable',
        context: 'مقارنة مزدوجة: صفة قصيرة + صفة طويلة في جملة واحدة'
      },
      {
        en: 'My English is not as fluent as I want, but it is getting better every month.',
        ar: 'إنجليزيتي مش بطلاقة اللي عايزها، بس بتتحسن كل شهر.',
        highlight: 'not as fluent as',
        context: 'المقارنة بالتساوي المنفي + التحسن التدريجي'
      }
    ],
    miniQuiz: [
      {
        question: 'This exercise is ______ than the one we did yesterday.',
        options: ['more easier', 'easier', 'most easy', 'easiest'],
        correct: 1,
        explanation: 'الصفة القصيرة easy تتحول لـ easier، ولا تجمع بين more و er.'
      },
      {
        question: 'Mount Everest is ______ mountain in the world.',
        options: ['the higher', 'higher', 'the highest', 'most high'],
        correct: 2,
        explanation: 'التفضيل على كل الجبال يستلزم the + highest.'
      },
      {
        question: 'My new phone is ______ than my old one, but the camera is ______.',
        options: ['gooder / worse', 'better / worse', 'better / badder', 'best / worst'],
        correct: 1,
        explanation: 'الشواذ: good تعطي better و bad تعطي worse في المقارنة.'
      }
    ]
  },
  {
    id: 'countable-uncountable',
    order: 30,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Nouns & Quantities',
    titleAr: 'الأسماء المعدودة وغير المعدودة: امتى many وامتى much',
    titleEn: 'Countable & Uncountable Nouns',
    level: 'A1 - مبتدئ',
    goldenFormula: 'Countable: a/an, many, few | Uncountable: much, little, some (no plural)',
    negativeFormula: "not many + countable | not much + uncountable",
    questionFormula: 'How many + countable? / How much + uncountable?',
    summaryAr: 'في الإنجليزي الأسماء نوعين: حاجات بتتعد (كتاب، كتب) وحاجات متتعدش (مية، معلومة، نصيحة). والنوع التاني ممنوع ياخد a/an أو جمع s، وده اللي بيحدد تستخدم many ولا much و few ولا little.',
    timelineDescription: 'قاعدة تأسيسية بتأثر على كل جملة فيها كمية أو عدد.',
    imageUrl: ONLINE_IMAGES.libraryStudy,
    imageAlt: 'Books and coffee showing countable and uncountable everyday items',
    keyUsagePoints: [
      'المعدود: يقبل a/an والجمع s: a book, two books, many books.',
      'غير المعدود: ممنوع a/an أو s: water, information, advice, money, furniture.',
      'many/few/a few مع المعدود، و much/little/a little مع غير المعدود.',
      'عشان تعد غير المعدود استخدم وحدات: a piece of advice, a glass of water, two slices of bread.'
    ],
    egyptianTips: [
      'كلمة information دايماً مفرد في الإنجليزي حتى لو قصدك معلومات: متقولش informations أبداً.',
      'Advice أشهر فخ: الصح some advice أو a piece of advice، ومفيش advices.',
      'Money غير معدودة رغم إن الفلوس بتتعد عندنا! قول much money مش many money.'
    ],
    commonTraps: [
      'فخ جمع غير المعدود: الخطأ informations / furnitures / homeworks، الصواب: information / furniture / homework.',
      'فخ a مع غير المعدود: الخطأ an advice، الصواب: a piece of advice أو some advice.',
      'فخ many مع غير المعدود: الخطأ How many money? الصواب: How much money?'
    ],
    examples: [
      {
        en: 'Could you give me some advice about improving my English pronunciation?',
        ar: 'ممكن تديني شوية نصايح عن تحسين النطق بتاعي في الإنجليزي؟',
        highlight: 'some advice',
        context: 'advice غير معدودة فتأخذ some بدون a'
      },
      {
        en: 'How many lessons have you completed this week?',
        ar: 'كملت كام درس الأسبوع ده؟',
        highlight: 'How many lessons',
        context: 'lessons معدودة فتأخذ How many'
      },
      {
        en: 'There isn\'t much furniture in the new apartment yet.',
        ar: 'لسه مفيش عفش كتير في الشقة الجديدة.',
        highlight: 'much furniture',
        context: 'furniture غير معدودة رغم إنها قطع كتير في الواقع'
      },
      {
        en: 'She gave me three useful tips and a piece of paper with the new vocabulary.',
        ar: 'ادتني 3 نصايح مفيدة وورقة فيها الكلمات الجديدة.',
        highlight: 'a piece of paper',
        context: 'عدّ الاسم غير المعدود باستخدام وحدة قياس'
      }
    ],
    miniQuiz: [
      {
        question: 'I need ______ information about the new English course.',
        options: ['an', 'some', 'many', 'a few'],
        correct: 1,
        explanation: 'information غير معدودة فتأخذ some، وممنوع an أو many.'
      },
      {
        question: 'How ______ time do we have before the exam starts?',
        options: ['many', 'much', 'few', 'number of'],
        correct: 1,
        explanation: 'time بمعنى الوقت غير معدودة فالسؤال يكون How much.'
      },
      {
        question: 'She has very ______ friends here, so she feels lonely.',
        options: ['little', 'much', 'few', 'less'],
        correct: 2,
        explanation: 'friends معدودة فتأخذ few، و little تصلح فقط مع غير المعدود.'
      }
    ]
  },

  {
    id: 'adverbs-frequency',
    order: 31,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Adverbs',
    titleAr: 'ظروف التكرار: إزاي تقول دايماً وأحياناً ونادراً بترتيب صح',
    titleEn: 'Adverbs of Frequency',
    level: 'A1 - مبتدئ',
    goldenFormula: 'Subject + adverb + main verb | Subject + be + adverb (I always study / I am always happy)',
    negativeFormula: 'Subject + adverb + negative verb (I never smoke / She is rarely late)',
    questionFormula: 'How often + do/does + subject + verb?',
    summaryAr: 'كلمات صغيرة زي always و usually و sometimes بتوصف التكرار، وعندها مكان ثابت في الجملة: قبل الفعل الأساسي، لكن بعد فعل الكينونة be. والترتيب ده بيفرق جداً في إن جملتك تطلع طبيعية.',
    timelineDescription: 'ترتيب الكلمات داخل الجملة لوصف العادات والتكرار.',
    imageUrl: ONLINE_IMAGES.grammar.presentSimple,
    imageAlt: 'Weekly planner showing daily habits and routines',
    keyUsagePoints: [
      'السلم من فوق لتحت: always 100% > usually > often > sometimes > rarely > never 0%.',
      'المكان الذهبي: قبل الفعل الأساسي: I usually drink tea.',
      'بعد فعل be: She is always on time.',
      'مع الأفعال المساعدة: بين المساعد والأساسي: I have never been to London.'
    ],
    egyptianTips: [
      'افتكر: الظرف بيحب يقف جنب الفعل اللي بيوصفه على طول، مش في آخر الجملة زي العربي.',
      'never لوحدها بتنفي الجملة كلها، فمتحطش not معاها: I never lie مش I don\'t never lie.',
      'How often هو سؤال التكرار الجاهز: How often do you exercise? = بتلعب رياضة كل قد إيه؟'
    ],
    commonTraps: [
      'فخ آخر الجملة: الخطأ I drink coffee always في بداية التعلم، الصواب الطبيعي: I always drink coffee.',
      'فخ النفي المزدوج: الخطأ I don\'t never go، الصواب: I never go.',
      'فخ مكان الظرف مع be: الخطأ She always is late، الصواب: She is always late.'
    ],
    examples: [
      {
        en: 'I always revise my vocabulary before bed, and I never skip a day.',
        ar: 'دايماً براجع كلماتي قبل النوم، وعمري ما بفوّت يوم.',
        highlight: 'always revise',
        context: 'الظرف قبل الفعل الأساسي في العادة اليومية'
      },
      {
        en: 'She is rarely late for work, even when the traffic is terrible.',
        ar: 'نادراً ما بتتأخر عن الشغل، حتى لما الزحمة تبقى وحشة.',
        highlight: 'is rarely',
        context: 'الظرف بعد فعل الكينونة is'
      },
      {
        en: 'They have never travelled abroad, but they are planning their first trip now.',
        ar: 'عمرهم ما سافروا بره، بس بيخططوا لأول رحلة دلوقتي.',
        highlight: 'have never travelled',
        context: 'الظرف بين have والتصريف الثالث في المضارع التام'
      },
      {
        en: 'How often do you practise speaking English with a partner?',
        ar: 'بتتمرن على الكلام بالإنجليزي مع حد كل قد إيه؟',
        highlight: 'How often',
        context: 'سؤال التكرار الجاهز للمحادثة'
      }
    ],
    miniQuiz: [
      {
        question: 'He ______ late for class. The teacher is very happy with him.',
        options: ['is never', 'never is', 'does never be', 'not ever'],
        correct: 0,
        explanation: 'مع فعل be يأتي الظرف بعده: is never.'
      },
      {
        question: 'I ______ junk food because I care about my health.',
        options: ['don\'t never eat', 'never eat', 'eat never', 'not eat never'],
        correct: 1,
        explanation: 'never تنفي وحدها بدون not، وتأتي قبل الفعل الأساسي.'
      },
      {
        question: '______ do you go to the gym? - About three times a week.',
        options: ['How long', 'How many', 'How often', 'How much'],
        correct: 2,
        explanation: 'السؤال عن التكرار يكون بـ How often.'
      }
    ]
  },

  {
    id: 'quantifiers',
    order: 32,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Quantifiers',
    titleAr: 'كلمات الكمية: some و any و no و a lot of في مكانهم الصح',
    titleEn: 'Quantifiers: Some, Any, No, Plenty',
    level: 'A2 - تأسيسي',
    goldenFormula: 'some + positive | any + negative/question | no + positive verb (I have some / I don\'t have any / I have no time)',
    negativeFormula: "not + any (I don't have any questions) OR no + noun (I have no questions)",
    questionFormula: 'Would you like some...? / Do you have any...?',
    summaryAr: 'Some للإيجاب والعروض، any للنفي والأسئلة، و no مع فعل موجب بتديك جملة منفية المعنى. القاعدة دي أساس المحادثة اليومية كله: طلبات، أسئلة، وصف الكميات.',
    timelineDescription: 'وصف الكميات في الجمل الموجبة والمنفية والاستفهامية.',
    imageUrl: ONLINE_IMAGES.modernClassroom,
    imageAlt: 'Classroom discussion about quantities and amounts',
    keyUsagePoints: [
      'some في الجملة الموجبة: I bought some new books.',
      'any في النفي والسؤال: I don\'t have any money / Do you have any questions?',
      'استثناء مهم: some في العروض والطلبات المهذبة: Would you like some tea?',
      'no + فعل موجب = نفي كامل: I have no time = I don\'t have any time.'
    ],
    egyptianTips: [
      'قاعدة الشارع: شفت not أو علامة استفهام؟ حط any. شفت عرض مهذب Would you like؟ حط some.',
      'جملة فيها no مبتحتاجش not: I have no idea صح، وممنوع I don\'t have no idea.',
      'Plenty of معناها كتير أوي وكفاية: plenty of time = وقت كتير ومفيش ضغط.'
    ],
    commonTraps: [
      'فخ any في الجملة الموجبة العادية: الخطأ I have any friends، الصواب: I have some friends.',
      'فخ النفي المزدوج مع no: الخطأ I don\'t have no money، الصواب: I have no money أو I don\'t have any money.',
      'فخ any في العرض المهذب: الطبيعي Would you like some coffee؟ مش any coffee.'
    ],
    examples: [
      {
        en: 'There is some good news: the academy has opened new speaking sections.',
        ar: 'فيه أخبار حلوة: الأكاديمية فتحت أقسام محادثة جديدة.',
        highlight: 'some good news',
        context: 'some مع اسم غير معدود في جملة موجبة'
      },
      {
        en: 'I don\'t have any free time on weekdays, but I study English every weekend.',
        ar: 'ماعنديش أي وقت فاضي في أيام الأسبوع، بس بذاكر إنجليزي كل ويك إند.',
        highlight: "any free time",
        context: 'any مع النفي don\'t'
      },
      {
        en: 'Would you like some help with your homework?',
        ar: 'تحب مساعدة في الواجب بتاعك؟',
        highlight: 'some help',
        context: 'عرض مهذب يأخذ some رغم أنه سؤال'
      },
      {
        en: 'There were no tickets left for the match, so we watched it at home.',
        ar: 'مافضلش ولا تذكرة للماتش، فاتفرجنا عليه في البيت.',
        highlight: 'no tickets',
        context: 'no مع فعل موجب تعطي معنى منفي كامل'
      }
    ],
    miniQuiz: [
      {
        question: 'Do you have ______ brothers or sisters?',
        options: ['some', 'any', 'no', 'much'],
        correct: 1,
        explanation: 'في السؤال العادي نستخدم any.'
      },
      {
        question: 'I\'m thirsty. Could I have ______ water, please?',
        options: ['any', 'no', 'some', 'none'],
        correct: 2,
        explanation: 'الطلب المهذب يأخذ some رغم صيغة السؤال.'
      },
      {
        question: 'There is ______ milk in the fridge. We need to buy more.',
        options: ['no any', 'not', 'no', 'some'],
        correct: 2,
        explanation: 'no + فعل موجب is تعطي النفي الكامل: مفيش لبن خالص.'
      }
    ]
  },
  {
    id: 'subject-verb-agreement',
    order: 33,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Agreement',
    titleAr: 'توافق الفاعل والفعل: القاعدة اللي بتكشف مستواك الحقيقي',
    titleEn: 'Subject-Verb Agreement',
    level: 'A2 - تأسيسي',
    goldenFormula: 'Singular subject + singular verb (s) | Plural subject + base verb',
    negativeFormula: "He doesn't / They don't (never: He don't)",
    questionFormula: 'Does he...? / Do they...? / Is there...? / Are there...?',
    summaryAr: 'أشهر غلطة بتفرق بين المبتدئ والمحترف: الفعل لازم يوافق فاعله في العدد. المفرد ياخد s في المضارع، والجمع ياخد المصدر. وفي كلمات مخادعة زي everyone و news شكلها جمع لكنها مفرد.',
    timelineDescription: 'قاعدة بنيوية تظهر في كل جملة مضارع تكتبها أو تقولها.',
    imageUrl: ONLINE_IMAGES.mentorStudent,
    imageAlt: 'Teacher correcting a sentence on a whiteboard',
    keyUsagePoints: [
      'المفرد الغائب (He/She/It) يأخذ s في المضارع البسيط: She works hard.',
      'الكلمات المخادعة المفردة: everyone, everybody, someone, each, every, news, mathematics.',
      'There is + مفرد / There are + جمع: There is a problem / There are two problems.',
      'الفاعل الحقيقي هو اللي يحكم: The quality of the courses is excellent (quality مفردة).'
    ],
    egyptianTips: [
      'في العربي بنقول الناس بتقول، لكن في الإنجليزي people دايماً جمع: People say مش says.',
      'كلمة news آخرها s بس معناها مفرد: The news is good.',
      'لو لقيت everyone أو each في الجملة، عاملها زي He بالظبط: Everyone is welcome.'
    ],
    commonTraps: [
      'فخ everyone تعتبر جمع: الخطأ Everyone are here، الصواب: Everyone is here.',
      'فخ الفاعل البعيد عن الفعل: الخطأ The list of names are long، الصواب: The list of names is long (الفاعل list).',
      'فخ people تعتبر مفرد: الخطأ People is kind here، الصواب: People are kind here.'
    ],
    examples: [
      {
        en: 'Everybody in my class loves the new English teacher.',
        ar: 'كل واحد في فصلي بيحب مدرس الإنجليزي الجديد.',
        highlight: 'Everybody ... loves',
        context: 'everybody مفردة فتأخذ الفعل مع s'
      },
      {
        en: 'There are many new students at the academy this term.',
        ar: 'فيه طلاب جدد كتير في الأكاديمية الترم ده.',
        highlight: 'There are',
        context: 'الجمع students يستلزم There are'
      },
      {
        en: 'The news about the exam results is very encouraging.',
        ar: 'أخبار نتيجة الامتحان مبشرة جداً.',
        highlight: 'The news ... is',
        context: 'news مفردة رغم حرف s في آخرها'
      },
      {
        en: 'My friend and his brother study German together twice a week.',
        ar: 'صاحبي وأخوه بيذاكروا ألماني سوا مرتين في الأسبوع.',
        highlight: 'study',
        context: 'فاعل مركب من شخصين = جمع، فالفعل بدون s'
      }
    ],
    miniQuiz: [
      {
        question: 'Each of the students ______ a personal study plan.',
        options: ['have', 'has', 'are having', 'having'],
        correct: 1,
        explanation: 'Each مفردة دائماً فتأخذ has.'
      },
      {
        question: 'There ______ a lot of new vocabulary in this lesson.',
        options: ['are', 'is', 'be', 'were'],
        correct: 1,
        explanation: 'vocabulary اسم غير معدود يعامل كمفرد: There is.'
      },
      {
        question: 'Mathematics ______ my favourite subject at school.',
        options: ['are', 'were', 'is', 'have been'],
        correct: 2,
        explanation: 'أسماء المواد المنتهية بـ ics مفردة: Mathematics is.'
      }
    ]
  },

  {
    id: 'modal-perfect',
    order: 34,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Modal Perfect',
    titleAr: 'الأفعال الناقصة مع الماضي: كان لازم، كان ممكن، كان يستحيل',
    titleEn: 'Modal Perfect (Should/Must/Can\'t + Have + V3)',
    level: 'B2 - فوق متوسط',
    goldenFormula: 'modal + have + V3 (should have studied / must have forgotten / can\'t have seen)',
    negativeFormula: "shouldn't have + V3 / can't have + V3",
    questionFormula: 'Could he have + V3? / Would you have + V3?',
    summaryAr: 'التركيبة دي بتخليك تحلل الماضي زي المحترفين: should have معناها كان لازم تعمل ومعملتش، must have معناها أكيد حصل، و can\'t have معناها يستحيل يكون حصل. أساس أي محادثة عن ندم أو استنتاج أو لوم.',
    timelineDescription: 'تحليل أحداث ماضية بالندم أو الاستنتاج المنطقي.',
    imageUrl: ONLINE_IMAGES.grammar.pastPerfect,
    imageAlt: 'Person reflecting on a past decision at a crossroads',
    keyUsagePoints: [
      'should have + V3: ندم أو لوم على حاجة محصلتش: I should have studied harder (كان لازم أذاكر).',
      'must have + V3: استنتاج مؤكد عن الماضي: She must have left early (أكيد مشيت بدري).',
      'can\'t have + V3: استنتاج بالاستحالة: He can\'t have seen me (يستحيل يكون شافني).',
      'could have + V3: إمكانية ضاعت: We could have won (كان ممكن نكسب).'
    ],
    egyptianTips: [
      'should have = ياريتني أو كان لازم: أشهر تركيبة ندم في اللغة كلها.',
      'متقولش musted أو shoulded: الأفعال الناقصة متتصرفش، ودايماً بعدها have + V3.',
      'في النطق الطبيعي should have بتتقال shoulda /ʃʊdə/ - اسمعها كتير في الأغاني والأفلام.'
    ],
    commonTraps: [
      'فخ should have + مصدر: الخطأ I should have study، الصواب: I should have studied (لازم V3).',
      'فخ ترجمة كان لازم بـ must have: الخطأ I must have studied بمعنى الندم، الصواب: should have. Must have معناها استنتاج مش ندم.',
      'فخ نسيان have: الخطأ You should told me، الصواب: You should have told me.'
    ],
    examples: [
      {
        en: 'I should have started learning English years ago, but it is never too late.',
        ar: 'كان لازم أبدأ أتعلم إنجليزي من سنين، بس العمر مبيروحش أبداً.',
        highlight: 'should have started',
        context: 'ندم على قرار ماضي لم يحدث'
      },
      {
        en: 'The lights are off; they must have gone to bed already.',
        ar: 'النور مطفي؛ أكيد دخلوا يناموا خلاص.',
        highlight: 'must have gone',
        context: 'استنتاج منطقي مؤكد عن الماضي'
      },
      {
        en: 'You can\'t have finished the whole book in one day! It is 400 pages.',
        ar: 'يستحيل تكون خلصت الكتاب كله في يوم واحد! ده 400 صفحة.',
        highlight: "can't have finished",
        context: 'استنتاج بالاستحالة'
      },
      {
        en: 'We could have caught the train if we had left five minutes earlier.',
        ar: 'كان ممكن نلحق القطر لو كنا خرجنا بدري 5 دقايق.',
        highlight: 'could have caught',
        context: 'إمكانية ماضية ضاعت بسبب شرط لم يتحقق'
      }
    ],
    miniQuiz: [
      {
        question: 'You look exhausted. You ______ stayed up all night studying.',
        options: ['should have', 'must have', 'can\'t have', 'would'],
        correct: 1,
        explanation: 'استنتاج مؤكد من دليل واضح (المظهر المرهق) يأخذ must have.'
      },
      {
        question: 'I ______ called her yesterday. She was waiting for my call all day.',
        options: ['must have', 'should have', 'can\'t have', 'would'],
        correct: 1,
        explanation: 'لوم على شيء لم يحدث: should have called (كان لازم أتصل).'
      },
      {
        question: 'He ______ stolen the money; he was with me the whole evening.',
        options: ['must have', 'should have', 'can\'t have', 'could have'],
        correct: 2,
        explanation: 'الدليل يجعل الحدث مستحيلاً: can\'t have.'
      }
    ]
  },

  {
    id: 'wish-if-only',
    order: 35,
    category: 'حالات الشرط',
    categoryEn: 'Wishes & Regrets',
    titleAr: 'التمني والندم: Wish و If only لأحلام مستحيلة وندم حقيقي',
    titleEn: 'Wish & If Only',
    level: 'B2 - فوق متوسط',
    goldenFormula: 'wish + past simple (حاضر) | wish + past perfect (ماضي) | wish + would (شكوى)',
    negativeFormula: "I wish I didn't... / I wish I hadn't...",
    questionFormula: 'Do you ever wish you had...?',
    summaryAr: 'لما تتمنى حاجة عكس الواقع، الإنجليزي بيرجع بك زمن ورا: تمني عن الحاضر ياخد ماضي بسيط، وتمني عن الماضي ياخد ماضي تام، والشكوى من تصرف حد تاخد would. If only نفس القواعد بس أقوى في الإحساس.',
    timelineDescription: 'أمنيات غير واقعية في الحاضر أو ندم على الماضي.',
    imageUrl: ONLINE_IMAGES.grammar.conditionals,
    imageAlt: 'Person looking at the horizon wishing for a different reality',
    keyUsagePoints: [
      'تمني عن الحاضر: wish + ماضي بسيط: I wish I lived near the sea (بس الحقيقة مش ساكن).',
      'تمني عن الماضي: wish + ماضي تام: I wish I had studied harder (ندم).',
      'شكوى وتمني تغيير: wish + would: I wish you would listen to me.',
      'في الجمل الرسمية: I wish I were أصح من I wish I was.'
    ],
    egyptianTips: [
      'قاعدة الرجوع زمن واحد ورا: حاضر؟ استخدم ماضي بسيط. ماضي؟ استخدم ماضي تام.',
      'If only معناها يا ريت بس بقوة أكبر: If only I had more time = يا ريت كان عندي وقت أكتر.',
      'wish + would بتستخدمها لما بتزعق من تصرف حد تاني: I wish the weather would change.'
    ],
    commonTraps: [
      'فخ استخدام المضارع بعد wish: الخطأ I wish I have a car، الصواب: I wish I had a car.',
      'فخ would مع نفس الفاعل للتمني الشخصي: الخطأ I wish I would be taller، الصواب: I wish I were taller.',
      'فخ نسيان had للندم: الخطأ I wish I didn\'t miss the bus (لو الندم على ماضي بعيد)، الأدق: I wish I hadn\'t missed the bus.'
    ],
    examples: [
      {
        en: 'I wish I spoke English fluently; it would open so many doors for me.',
        ar: 'يا ريتني بتكلم إنجليزي بطلاقة؛ ده كان هيفتحلي أبواب كتير.',
        highlight: 'I wish I spoke',
        context: 'تمني عن وضع حاضر غير حقيقي بماضي بسيط'
      },
      {
        en: 'She wishes she had accepted that job offer last year.',
        ar: 'نفسها تكون قبلت عرض الشغل ده السنة اللي فاتت.',
        highlight: 'had accepted',
        context: 'ندم على قرار ماضي بماضي تام'
      },
      {
        en: 'If only the traffic in Cairo would improve, life would be much easier.',
        ar: 'يا ريت زحمة القاهرة تتحسن، الحياة كانت هتبقى أسهل بكتير.',
        highlight: 'If only ... would improve',
        context: 'شكوى وتمني تغيير بـ would'
      },
      {
        en: 'I wish I were on a beach in Alexandria right now instead of studying.',
        ar: 'يا ريتني على شط إسكندرية دلوقتي بدل المذاكرة.',
        highlight: 'I wish I were',
        context: 'الصيغة الرسمية were مع جميع الضمائر'
      }
    ],
    miniQuiz: [
      {
        question: 'I wish I ______ taller. All my friends are taller than me.',
        options: ['am', 'were', 'would be', 'will be'],
        correct: 1,
        explanation: 'تمني عن الحاضر يأخذ ماضي بسيط، و were هي الصيغة المثلى.'
      },
      {
        question: 'He wishes he ______ the exam more seriously last month.',
        options: ['took', 'takes', 'had taken', 'would take'],
        correct: 2,
        explanation: 'ندم على الماضي يستلزم الماضي التام: had taken.'
      },
      {
        question: 'I wish it ______ raining. I want to go out.',
        options: ['stops', 'stopped', 'would stop', 'had stopped'],
        correct: 2,
        explanation: 'الرغبة في تغيير موقف مزعج خارج عن إرادتك تأخذ would + مصدر.'
      }
    ]
  },
  {
    id: 'mixed-conditionals',
    order: 36,
    category: 'حالات الشرط',
    categoryEn: 'Mixed Conditionals',
    titleAr: 'الجمل الشرطية المختلطة: لما الماضي يأثر على الحاضر',
    titleEn: 'Mixed Conditionals',
    level: 'C1 - متقدم',
    goldenFormula: 'If + past perfect, would + base verb (ماضي غير حاضر) | If + past simple, would have + V3 (حاضر غير ماضي)',
    negativeFormula: "If I hadn't studied, I wouldn't be confident now.",
    questionFormula: 'How would your life be different if you had...?',
    summaryAr: 'المستوى المتقدم من الـ if: خلط زمنين في جملة واحدة. أشهر صورة: شرط في الماضي محصلش ونتيجته في الحاضر: If I had studied medicine, I would be a doctor now. التركيبة دي علامة الطلاقة الحقيقية في المحادثة والامتحانات الدولية.',
    timelineDescription: 'ربط أحداث ماضية بنتائج حاضرة، أو صفات دائمة بنتائج ماضية.',
    imageUrl: ONLINE_IMAGES.grammar.conditionals,
    imageAlt: 'Timeline showing a past decision affecting the present',
    keyUsagePoints: [
      'النوع الأول: If + past perfect + would + مصدر: ماضي محصلش أثره حاضر: If I had saved money, I would be rich now.',
      'النوع التاني: If + past simple + would have + V3: صفة دائمة أثرت على الماضي: If I were braver, I would have applied.',
      'الفرق الجوهري: بص على زمن النتيجة: now أو today يبقى would + مصدر.',
      'بتلاقيها بكثرة في كلام الندم الواقعي وتحليل القرارات الحياتية.'
    ],
    egyptianTips: [
      'اختصرها كده: الشرط دايماً ماضي، بس النتيجة هي اللي بتقرر: لو النتيجة دلوقتي استخدم would + مصدر، لو في الماضي استخدم would have + V3.',
      'كلمة now أو today في آخر الجملة هي العلامة المميزة للنوع الأول.',
      'متخافش من طول الجملة: رتبها في دماغك شرط ثم نتيجة، والزمن هيضبط نفسه.'
    ],
    commonTraps: [
      'فخ استخدام النوع التالت كامل مع نتيجة حاضرة: الخطأ If I had studied, I would have a job now (تصلح لكنها تعني نتيجة ماضية)، الأدق للحاضر: I would have a job now مع would + مصدر: If I had studied, I would have... انتبه: الصح هنا would have مش would have had إلا للملكية.',
      'فخ الخلط: الخطأ If I studied harder, I would be passed، الصواب: If I had studied harder, I would pass / would have passed.',
      'فخ will بعد if: الخطأ If I will have time، الصواب: If I had time (في الشرط غير الحقيقي).'
    ],
    examples: [
      {
        en: 'If I had learned English when I was younger, I would be working abroad now.',
        ar: 'لو كنت اتعلمت إنجليزي وأنا صغير، كنت هبقى شغال بره دلوقتي.',
        highlight: 'had learned ... would be working',
        context: 'شرط ماضي + نتيجة حاضرة: أشهر صورة للشرط المختلط'
      },
      {
        en: 'If she weren\'t so talented, she wouldn\'t have won the scholarship last year.',
        ar: 'لو مكانتش موهوبة كده، مكانتش كسبت المنحة السنة اللي فاتت.',
        highlight: "weren't ... wouldn't have won",
        context: 'صفة دائمة (حاضر) + نتيجة ماضية'
      },
      {
        en: 'If we had booked the tickets earlier, we wouldn\'t be paying double the price today.',
        ar: 'لو كنا حجزنا التذاكر بدري، مكناش هندفع الضعف النهاردة.',
        highlight: 'had booked ... wouldn\'t be paying',
        context: 'قرار ماضي أثره المالي مستمر في الحاضر'
      }
    ],
    miniQuiz: [
      {
        question: 'If I had taken that course, I ______ much more confident speaking English today.',
        options: ['would have been', 'would be', 'will be', 'am'],
        correct: 1,
        explanation: 'النتيجة في الحاضر (today) تأخذ would + مصدر: would be.'
      },
      {
        question: 'If he were more organized, he ______ the deadline last week.',
        options: ['wouldn\'t miss', 'wouldn\'t have missed', 'didn\'t miss', 'won\'t miss'],
        correct: 1,
        explanation: 'صفة دائمة (were) مع نتيجة ماضية (last week) تأخذ would have + V3.'
      },
      {
        question: 'If they had invested in their education, they ______ in a better position now.',
        options: ['would have been', 'will be', 'would be', 'are'],
        correct: 2,
        explanation: 'now تشير لنتيجة حاضرة: would be.'
      }
    ]
  },

  {
    id: 'linking-words',
    order: 37,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Connectors',
    titleAr: 'أدوات الربط: السر اللي بيخلي كتابتك وكلامك مترابط',
    titleEn: 'Linking Words & Connectors',
    level: 'B1 - متوسط',
    goldenFormula: 'although + sentence | despite + noun/gerund | however, + sentence | so / therefore + result',
    negativeFormula: 'despite / in spite of + noun (NOT: despite of)',
    questionFormula: 'How do you connect two contrasting ideas?',
    summaryAr: 'الفرق بين كلام مكسّر وكلام مترابط هو أدوات الربط. لكن في فخاخ شهيرة: although و but ممنوع يجوا مع بعض، و despite ممنوع تاخد of، و however بتحتاج فاصلة. القواعد الصغيرة دي بتفرق جداً في الكتابة الأكاديمية والآيلتس.',
    timelineDescription: 'ربط الأفكار في الكتابة والمحادثة بشكل منطقي متسلسل.',
    imageUrl: ONLINE_IMAGES.grammar.gerundsInfinitives,
    imageAlt: 'Connected chain links representing logical flow of ideas',
    keyUsagePoints: [
      'التناقض: although/even though + جملة كاملة، لكن despite/in spite of + اسم أو gerund.',
      'النتيجة: so (غير رسمي) و therefore/as a result (رسمي) مع فاصلة.',
      'الإضافة: moreover / furthermore / in addition للكتابة الرسمية.',
      'السبب: because + جملة، لكن because of / due to + اسم.'
    ],
    egyptianTips: [
      'أهم قاعدة: although و but زي بعض بالظبط، فمتحطهمش في نفس الجملة: اختار واحد بس.',
      'despite لوحدها أبداً: مفيش despite of. عايز of؟ استخدم in spite of.',
      'because وراها جملة كاملة، و because of وراها اسم: because it rained / because of the rain.'
    ],
    commonTraps: [
      'فخ although + but: الخطأ Although it was raining, but we went out، الصواب: Although it was raining, we went out.',
      'فخ despite of: الخطأ Despite of the traffic، الصواب: Despite the traffic / In spite of the traffic.',
      'فخ because of + جملة: الخطأ because of I was late، الصواب: because I was late / because of my delay.'
    ],
    examples: [
      {
        en: 'Although the lesson was difficult, all the students understood the main idea.',
        ar: 'بالرغم إن الدرس كان صعب، كل الطلاب فهموا الفكرة الأساسية.',
        highlight: 'Although',
        context: 'although + جملة كاملة بدون but'
      },
      {
        en: 'Despite living far from the academy, he never misses a class.',
        ar: 'بالرغم إنه ساكن بعيد عن الأكاديمية، عمره ما فوّت حصة.',
        highlight: 'Despite living',
        context: 'despite + gerund (فعل في ing)'
      },
      {
        en: 'The course was expensive; however, it was worth every pound.',
        ar: 'الكورس كان غالي؛ بس، كان يستاهل كل قرش.',
        highlight: 'however',
        context: 'however بين جملتين مع فاصلة منقوطة وفاصلة'
      },
      {
        en: 'She passed the speaking test because of her daily practice with a partner.',
        ar: 'نجحت في اختبار المحادثة بسبب تمرنها اليومي مع شريك.',
        highlight: 'because of',
        context: 'because of + عبارة اسمية'
      }
    ],
    miniQuiz: [
      {
        question: '______ it was very late, they continued studying for the exam.',
        options: ['Despite', 'Although', 'But', 'However'],
        correct: 1,
        explanation: 'قبل الجملة الكاملة (it was very late) نستخدم Although.'
      },
      {
        question: 'She succeeded ______ her lack of experience.',
        options: ['despite of', 'although', 'in spite of', 'because'],
        correct: 2,
        explanation: 'قبل العبارة الاسمية نستخدم in spite of أو despite (بدون of).'
      },
      {
        question: 'He was tired; ______, he finished all his homework before bed.',
        options: ['because', 'although', 'therefore', 'despite'],
        correct: 2,
        explanation: 'التعب هو السبب وإنهاء الواجب هو النتيجة، فالرابط المنطقي therefore (لذلك).'
      }
    ]
  },

  {
    id: 'phrasal-verbs-mastery',
    order: 38,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Phrasal Verbs',
    titleAr: 'الأفعال المركبة: لغة الأمريكاني الحقيقية اللي مش في الكتب',
    titleEn: 'Phrasal Verbs Mastery',
    level: 'B1 - متوسط',
    goldenFormula: 'verb + particle (give up, look after, put off) | separable: pick it up | inseparable: look after it',
    negativeFormula: "don't give up / never put off",
    questionFormula: 'Did you figure it out? / Are you looking forward to it?',
    summaryAr: 'الأفعال المركبة هي قلب الإنجليزي المحكي: فعل + حرف صغير بيغير المعنى كلياً. give معناها يعطي، لكن give up معناها يستسلم. إتقان الأشهر منها بيخلي كلامك طبيعي جداً، وهي أساس الفهم في الأفلام والمحادثات الحقيقية.',
    timelineDescription: 'مفردات المحادثة اليومية الطبيعية في كل المواقف.',
    imageUrl: ONLINE_IMAGES.onlineTechLecture,
    imageAlt: 'Casual conversation full of natural phrasal verbs',
    keyUsagePoints: [
      'الفعل المركب معناه جديد كلياً: look up (يبحث)، look after (يرعى)، look forward to (يتشوق لـ).',
      'قابل للفصل: الضمير يجي في النص دايماً: pick it up مينفعش pick up it.',
      'غير قابل للفصل: run into someone، get over an illness.',
      'looking forward to الـ to فيها حرف جر، فبعدها gerund: I look forward to meeting you.'
    ],
    egyptianTips: [
      'متترجمش كل كلمة لوحدها: put off معناها يأجل ومش ليها علاقة بالوضع أو الإطفاء.',
      'احفظها في جملة من يومك: I gave up sugar = بطلت سكر. كده مش هتنساها.',
      'أشهر 10 بداية: get up, go on, come back, find out, give up, look for, put on, take off, turn on, work out.'
    ],
    commonTraps: [
      'فخ الضمير في الآخر مع القابل للفصل: الخطأ I picked up it، الصواب: I picked it up.',
      'فخ المصدر بعد look forward to: الخطأ I look forward to meet you، الصواب: to meeting you.',
      'فخ الترجمة الحرفية: الخطأ ترجمة give up على إنها يعطي لفوق، الصواب: يستسلم أو يقلع عن عادة.'
    ],
    examples: [
      {
        en: 'Never give up on your dream of speaking English fluently, no matter how hard it gets.',
        ar: 'متستسلمش أبداً عن حلمك إنك تتكلم إنجليزي بطلاقة، مهما كان صعب.',
        highlight: 'give up on',
        context: 'الاستسلام عن هدف - من أشهر الأفعال المركبة'
      },
      {
        en: 'I came across an amazing English podcast while I was looking for something else.',
        ar: 'صادفت بودكاست إنجليزي مذهل وأنا بدور على حاجة تانية خالص.',
        highlight: 'came across',
        context: 'المصادفة غير المتوقعة - غير قابل للفصل'
      },
      {
        en: 'Can you put the meeting off until Friday? I have too much work this week.',
        ar: 'ممكن تأجل الاجتماع ليوم الجمعة؟ عندي شغل كتير الأسبوع ده.',
        highlight: 'put ... off',
        context: 'التأجيل - قابل للفصل والاسم جاء في النص'
      },
      {
        en: 'It took me two weeks to get over the flu and go back to work.',
        ar: 'خدت مني أسبوعين عشان أتعافى من الأنفلونزا وأرجع الشغل.',
        highlight: 'get over',
        context: 'التعافي من مرض أو صدمة - غير قابل للفصل'
      }
    ],
    miniQuiz: [
      {
        question: 'I don\'t know this word. I will ______ in the dictionary.',
        options: ['look after it', 'look it up', 'look it forward', 'look over it'],
        correct: 1,
        explanation: 'البحث عن معنى كلمة هو look up، وهو قابل للفصل فالضمير يأتي في الوسط: look it up.'
      },
      {
        question: 'We are really looking forward to ______ you at the academy.',
        options: ['meet', 'meeting', 'met', 'meets'],
        correct: 1,
        explanation: 'بعد look forward to يأتي الفعل في صورة gerund: meeting.'
      },
      {
        question: 'The plane ______ at 6 AM, so we need to be at the airport by 4.',
        options: ['takes on', 'takes off', 'takes up', 'takes after'],
        correct: 1,
        explanation: 'إقلاع الطائرة هو take off.'
      }
    ]
  },
  // ==========================================
  // BATCH A1-A2 COMPLETION (الأساسيات)
  // ==========================================
  {
    id: 'verb-to-be',
    order: 39,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Essentials & Sentence Structure',
    titleAr: 'فعل To Be: عمود الجملة الإنجليزية (am / is / are)',
    titleEn: 'Verb To Be (am / is / are)',
    level: 'A1 - مبتدئ',
    goldenFormula: 'I + am  |  He/She/It + is  |  You/We/They + are',
    negativeFormula: "Subject + am/is/are + not  (isn't / aren't / 'm not)",
    questionFormula: 'Am / Is / Are + Subject + ... ?',
    summaryAr: 'فعل To Be هو أول فعل لازم تتقنه: بيستخدم للوصف والتعريف والحالة، ومعناه "يكون" لكن في الإنجليزي بنحطه في الجملة دايماً، حتى لو مالوش ترجمة واضحة بالعربي.',
    timelineDescription: 'حالة أو وصف ثابت في الزمن الحاضر: الاسم، السن، الشغلانة، المكان، الإحساس.',
    imageUrl: ONLINE_IMAGES.learningStudyGroup,
    imageAlt: 'Students introducing themselves in a study group',
    keyUsagePoints: [
      'التعريف بالنفس والآخرين (I am Mohamed / She is Sara)',
      'الوصف والحالة (The test is easy / We are tired)',
      'المكان والموقع (They are at home / Cairo is big)',
      'السن والمهنة (I am 27 years old / He is a doctor)'
    ],
    egyptianTips: [
      'في العربي بنقول "أنا مدرس" من غير فعل، لكن في الإنجليزي لازم: I AM a teacher. ممنوع تنساه.',
      'الاختصارات هي الطبيعي في الكلام: I\'m, He\'s, They\'re. اكتبها كاملة في الرسمي بس.',
      'في النفي: isn\'t و aren\'t أشهر بكتير من is not و are not في المحادثة.'
    ],
    commonTraps: [
      'نسيان الفعل خالص: الخطأ "She doctor"، الصواب: She IS a doctor.',
      'خلط is مع I: الخطأ "I is"، الصواب: I am. الـ is مخصصة لـ He/She/It بس.',
      'ترجمة "عمري 27 سنة" حرفياً: الخطأ "I have 27 years" (دي فرنساوي!)، الصواب: I am 27 years old.'
    ],
    examples: [
      { en: 'My brother is a pharmacist in Alexandria.', ar: 'أخويا صيدلي في الإسكندرية.', highlight: 'is', context: 'مهنة وتعريف' },
      { en: 'We are very proud of our national team.', ar: 'إحنا فخورين جداً بمنتخبنا القومي.', highlight: 'are', context: 'شعور وحالة' },
      { en: 'Is the new metro line open yet?', ar: 'هل خط المترو الجديد اتفتح لسه؟', highlight: 'Is', context: 'سؤال عن حالة' },
      { en: 'The streets are not crowded this morning.', ar: 'الشوارع مش زحمة الصبح ده.', highlight: 'are not', context: 'نفي وصف' }
    ],
    miniQuiz: [
      {
        question: 'My parents ______ at work right now.',
        options: ['is', 'am', 'are', 'be'],
        correct: 2,
        explanation: 'الفاعل My parents جمع (they)، ومع الجمع دايماً are.'
      },
      {
        question: '______ your sister a student at Cairo University?',
        options: ['Are', 'Am', 'Is', 'Does'],
        correct: 2,
        explanation: 'الفاعل your sister مفرد غائب (she)، فالسؤال يبدأ بـ Is.'
      }
    ]
  },
  {
    id: 'subject-object-pronouns',
    order: 40,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Essentials & Sentence Structure',
    titleAr: 'ضمائر الفاعل والمفعول: I و Me إيه الفرق؟',
    titleEn: 'Subject & Object Pronouns',
    level: 'A1 - مبتدئ',
    goldenFormula: 'فاعل: I, you, he, she, it, we, they  |  مفعول: me, you, him, her, it, us, them',
    negativeFormula: 'لا يوجد نفي خاص بالضمائر؛ النفي في الفعل الذي يليها',
    questionFormula: 'الضمير يحل محل الاسم في نفس مكانه في السؤال',
    summaryAr: 'الضمائر بتغنيك عن تكرار الأسماء. سرّها بسيط: الضمير اللي بيعمل الفعل = فاعل (I, he, they)، واللي بيتعمل فيه الفعل أو بييجي بعد حرف جر = مفعول (me, him, them).',
    timelineDescription: 'قاعدة تركيبية ثابتة لا ترتبط بزمن معين؛ تُستخدم في كل الجمل.',
    imageUrl: ONLINE_IMAGES.mentorStudent,
    imageAlt: 'Teacher pointing at pronouns chart with a student',
    keyUsagePoints: [
      'ضمائر الفاعل تأتي قبل الفعل مباشرة (She loves coffee)',
      'ضمائر المفعول تأتي بعد الفعل أو حرف الجر (I called him / Talk to me)',
      'It للأشياء والحيوانات وغير العاقل عموماً',
      'They يمكن استخدامها للمفرد عند عدم تحديد النوع (Someone left their bag)'
    ],
    egyptianTips: [
      'اسأل نفسك: مين اللي عمل الفعل؟ الإجابة هي الفاعل. "أنا شفته" = I (فاعل) saw him (مفعول).',
      'بعد with, to, for, about لازم ضمير مفعول: Come with me (مش with I).',
      'بالعامية بنقول "هو" و"هي" كتير، وفي الإنجليزي نفس الراحة موجودة: he للولد، she للبنت، it للحاجة.'
    ],
    commonTraps: [
      'استخدام I مكان me بعد حرف الجر: الخطأ "between you and I"، الصواب: between you and me.',
      'نسيان ضمير الفاعل في الجملة: الخطأ "Is raining"، الصواب: IT is raining.',
      'استخدام her كفاعل: الخطأ "Her is my friend"، الصواب: SHE is my friend.'
    ],
    examples: [
      { en: 'Ahmed called me after the match finished.', ar: 'أحمد كلمّني بعد ما الماتش خلص.', highlight: 'me', context: 'ضمير مفعول بعد الفعل' },
      { en: 'We watched the movie yesterday, but we did not like it.', ar: 'إحنا اتفرجنا على الفيلم إمبارح، بس معجبنيش.', highlight: 'it', context: 'It للحاجة (الفيلم)' },
      { en: 'My neighbours are kind; I always help them with their groceries.', ar: 'جيراني ناس لطاف؛ دايماً بساعدهم في المشتريات.', highlight: 'them', context: 'ضمير مفعول للجمع' }
    ],
    miniQuiz: [
      {
        question: 'My manager is busy today; please send the report to ______.',
        options: ['she', 'her', 'hers', 'herself'],
        correct: 1,
        explanation: 'بعد حرف الجر to نستخدم ضمير المفعول: her.'
      },
      {
        question: '______ are planning a trip to Siwa next month.',
        options: ['Us', 'Them', 'We', 'Our'],
        correct: 2,
        explanation: 'محتاجين ضمير فاعل قبل الفعل are planning: We.'
      }
    ]
  },
  {
    id: 'possessives',
    order: 41,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Essentials & Sentence Structure',
    titleAr: 'الملكية: My و Mine وعلامة الـ \'s',
    titleEn: 'Possessive Adjectives, Pronouns & \'s',
    level: 'A1 - مبتدئ',
    goldenFormula: "صفة ملكية + اسم: my car  |  ضمير ملكية لوحده: mine  |  اسم شخص + 's: Sara's car",
    negativeFormula: 'لا نفي خاص؛ النفي في الفعل: This is not my bag',
    questionFormula: 'Whose + اسم؟ (Whose bag is this?)',
    summaryAr: 'ثلاث طرق للملكية: صفة ملكية قبل الاسم (my, his, their)، ضمير ملكية يستغني عن الاسم (mine, hers, theirs)، والـ \'s بعد اسم الشخص أو الحيوان (my father\'s house).',
    timelineDescription: 'قاعدة تركيبية ثابتة للتعبير عن الملكية أو النسبة في أي زمن.',
    imageUrl: ONLINE_IMAGES.modernClassroom,
    imageAlt: 'Students pointing at their own books in a classroom',
    keyUsagePoints: [
      'صفات الملكية لا تأتي أبداً بدون اسم بعدها (my phone, our house)',
      'ضمائر الملكية تأتي بدون اسم بعدها (The phone is mine)',
      "الـ 's للعاقل أساساً: Omar's car / the cat's tail",
      'للأشياء غير العاقلة نفضّل of: the leg of the table (وليس the table\'s leg في الرسمي)'
    ],
    egyptianTips: [
      'العربي عنده نفس الفكرة: "عربيتي" = my car (صفة + اسم)، و"العربية بتاعتي" = the car is mine.',
      'مش كل حاجة تاخد \'s: البيت بتاع الترباس؟ لا. قول the leg of the table مش the table\'s leg.',
      'its بدون فاصلة عليا = ملكية (its color)، و it\'s بفاصلة = اختصار it is. دي أشهر غلطة إملائية!'
    ],
    commonTraps: [
      'وضع اسم بعد ضمير الملكية: الخطأ "This is mine book"، الصواب: This is my book / This book is mine.',
      'الخلط بين its و it\'s: الخطأ "Its raining"، الصواب: It\'s raining.',
      'استخدام \'s مع الجمع المنتهي بـ s خطأ: الصواب "my parents\' house" (فاصلة بس من غير s تانية).'
    ],
    examples: [
      { en: 'My sister\'s wedding is next Friday.', ar: 'فرح أختي الجمعة الجاية.', highlight: "sister's", context: 'الـ \'s مع شخص' },
      { en: 'This umbrella is not mine; I think it is hers.', ar: 'الشمسية دي مش بتاعتي؛ أظن إنها بتاعتها هي.', highlight: 'mine', context: 'ضمير ملكية بدون اسم' },
      { en: 'We painted our balcony before Eid.', ar: 'إحنا دهنّا البلكونة بتاعتنا قبل العيد.', highlight: 'our', context: 'صفة ملكية قبل الاسم' }
    ],
    miniQuiz: [
      {
        question: 'This is not my dictionary. It is ______.',
        options: ['her', 'hers', 'she', 'she\'s'],
        correct: 1,
        explanation: 'مفيش اسم بعد الفراغ، فمحتاجين ضمير ملكية: hers.'
      },
      {
        question: 'The cat is playing with ______ tail.',
        options: ["it's", 'its', 'it', 'theirs'],
        correct: 1,
        explanation: 'ملكية للحيوان = its بدون فاصلة عليا. it\'s معناها it is.'
      }
    ]
  },
  {
    id: 'there-is-there-are',
    order: 42,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Essentials & Sentence Structure',
    titleAr: 'There is / There are: التعبير عن الوجود',
    titleEn: 'There is / There are',
    level: 'A1 - مبتدئ',
    goldenFormula: 'There is + مفرد/غير معدود  |  There are + جمع',
    negativeFormula: "There isn't / There aren't + ...",
    questionFormula: 'Is there / Are there + ... ?',
    summaryAr: 'لما تعايز تقول "في" بمعنى الوجود (في مطعم كويس هنا)، استخدم There is للمفرد و There are للجمع. دي أسرع طريقة توصف بيها مكان أو تسأل عن وجود حاجة.',
    timelineDescription: 'وصف وجود شيء في الحاضر؛ للماضي نستخدم There was / There were.',
    imageUrl: ONLINE_IMAGES.libraryStudy,
    imageAlt: 'A library with many books on shelves',
    keyUsagePoints: [
      'There is + اسم مفرد (There is a pharmacy nearby)',
      'There is + اسم غير معدود (There is some water)',
      'There are + اسم جمع (There are three banks in this street)',
      'There was / There were للماضي البسيط'
    ],
    egyptianTips: [
      '"في" بالعربي مبتتغيرش، لكن الإنجليزي بيتنازع بين is و are على حسب الاسم اللي بعدها. بصّ للاسم مش لـ there.',
      'لو الاسم سلسلة مرتبطة (a bed, a desk, and a chair)، الإنجليزي بيمشي مع أقرب اسم: There IS a bed and two chairs.',
      'في الأسئلة السريعة اسمع للاختصار: Is there...? بتتنطق "إز ذير".'
    ],
    commonTraps: [
      'استخدام There is مع جمع: الخطأ "There is many people"، الصواب: There ARE many people.',
      'ترجمة "في" بالحرف have: الخطأ "The room has a window" لما تقصد الوجود العام، الأدق: There is a window in the room.',
      'نسيان some/any: في النفي نقول There aren\'t any taxis (مش There aren\'t taxis في وصف عدم الوجود المطلق).'
    ],
    examples: [
      { en: 'There is a famous koshary restaurant near my office.', ar: 'في مطعم كشري مشهور جنب شغلي.', highlight: 'There is', context: 'وجود مفرد' },
      { en: 'Are there any seats left for the nine o\'clock show?', ar: 'في كراسي فاضلة لعرض الساعة تسعة؟', highlight: 'Are there', context: 'سؤال عن وجود جمع' },
      { en: 'There were a lot of fans outside the stadium last night.', ar: 'كان في جماهير كتير بره الاستاد مبارح بالليل.', highlight: 'There were', context: 'وجود في الماضي' }
    ],
    miniQuiz: [
      {
        question: 'There ______ a lot of traffic on the bridge this morning.',
        options: ['are', 'is', 'be', 'were'],
        correct: 1,
        explanation: 'Traffic اسم غير معدود (زي المية)، فنستخدم is رغم إن المعنى "زحمة كبيرة".'
      },
      {
        question: '______ any ATMs in this neighbourhood?',
        options: ['Is there', 'There is', 'Are there', 'There are'],
        correct: 2,
        explanation: 'سؤال عن جمع (ATMs) في الحاضر = Are there.'
      }
    ]
  },
  {
    id: 'have-got',
    order: 43,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Essentials & Sentence Structure',
    titleAr: 'Have got: "عندي" بالإنجليزي البريطاني',
    titleEn: 'Have Got (Possession)',
    level: 'A1 - مبتدئ',
    goldenFormula: "I/You/We/They + have got  |  He/She/It + has got  ('ve got / 's got)",
    negativeFormula: "haven't got / hasn't got",
    questionFormula: 'Have you got ... ? / Has she got ... ?',
    summaryAr: 'Have got = "عندي/معايا" في الإنجليزي البريطاني المحكي. معناها ملكية أو صفة ثابتة، وليست زمن تام رغم شكلها. الأمريكي بيقول have بس، لكن البريطاني والكتب بتفضّل have got في الكلام.',
    timelineDescription: 'ملكية أو صفة ثابتة في الحاضر فقط؛ لا تُستخدم للماضي (نستخدم had).',
    imageUrl: ONLINE_IMAGES.graduationCelebration,
    imageAlt: 'Friends celebrating, showing what they have achieved',
    keyUsagePoints: [
      'الملكية (I have got a new phone)',
      'الصفات الجسدية والعائلية (She has got blue eyes / We have got two kids)',
      'الأمراض والحالات المؤقتة (I have got a headache)',
      'الماضي = had (I had a bike when I was young)، وليس had got'
    ],
    egyptianTips: [
      'Have got هنا شكلها مضارع تام لكن معناها مضارع بسيط خالص. متترجمهاش "لقد حصلت".',
      'في الكلام الـ have بتختفي تقريباً: "I\'ve got an idea" بتتسمع "آي ڤْ جَت".',
      'الماضي الوحيد المقبول هو had: "كان عندي عربية" = I had a car (مش I had got).'
    ],
    commonTraps: [
      'استخدام do في السؤال: الخطأ "Do you have got a pen?"، الصواب: Have you got a pen? أو Do you have a pen?',
      'استخدامها للماضي: الخطأ "I had got a bike"، الصواب: I had a bike.',
      'الخلط مع got للحصول: I have got a car = عندي عربية، أما I got a car أمس = اشتريت عربية.'
    ],
    examples: [
      { en: 'I have got a big family; we are six brothers and sisters.', ar: 'أنا عندي عيلة كبيرة؛ إحنا ستة إخوات ولاد وبنات.', highlight: 'have got', context: 'ملكية/عائلة' },
      { en: 'Has your flat got a balcony overlooking the Nile?', ar: 'شقتك فيها بلكونة على النيل؟', highlight: 'Has', context: 'سؤال عن صفة ثابتة' },
      { en: 'She has not got any free time this week.', ar: 'ماعندهاش أي وقت فاضي الأسبوع ده.', highlight: 'has not got', context: 'نفي الملكية' }
    ],
    miniQuiz: [
      {
        question: 'Ahmed ______ two tickets for the concert tonight.',
        options: ['have got', 'has got', 'is got', 'got have'],
        correct: 1,
        explanation: 'الفاعل Ahmed مفرد غائب (he)، فنستخدم has got.'
      },
      {
        question: '______ a charger I can borrow, please?',
        options: ['Do you have got', 'Have you got', 'You have got', 'Got you'],
        correct: 1,
        explanation: 'السؤال بـ have got يبدأ بـ Have you got ... ?'
      }
    ]
  },
  {
    id: 'imperatives',
    order: 44,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Essentials & Sentence Structure',
    titleAr: 'صيغة الأمر: الأوامر والتعليمات والنصايح',
    titleEn: 'Imperatives',
    level: 'A1 - مبتدئ',
    goldenFormula: 'فعل في المصدر (V1) في أول الجملة: Open the door.',
    negativeFormula: "Don't + V1: Don't be late.",
    questionFormula: 'لا توجد صيغة سؤال؛ للطلب المهذب: Could you / Can you + V1 ... ?',
    summaryAr: 'صيغة الأمر أبسط صيغة في الإنجليزي: جملة بتبدأ بالفعل في المصدر من غير فاعل. بنستخدمها للأوامر، التعليمات، الإرشادات، الوصفات، والتحذيرات.',
    timelineDescription: 'لا زمن محدد؛ توجه المستمع لفعل مطلوب الآن أو كقاعدة عامة.',
    imageUrl: ONLINE_IMAGES.mentorStudent,
    imageAlt: 'Coach giving instructions to a player',
    keyUsagePoints: [
      'الأوامر والتعليمات المباشرة (Sit down. / Turn left at the corner.)',
      'الإرشادات والوصفات (Add two spoons of sugar.)',
      'التحذيرات واللافتات (Do not smoke. / Watch your step.)',
      'العروض والدعوات الودودة (Have some tea. / Come in!)'
    ],
    egyptianTips: [
      'زي العربي بالظبط: "افتح الباب" = Open the door. مفيش فاعل ومفيش تعقيد.',
      'عشان تبقى مهذب، زوّد please في الأول أو الآخر: Close the window, please.',
      'النفي دايماً Don\'t: "متتأخرش" = Don\'t be late. ومتقولش "No + فعل" زي اللافتات المصرية الغلط.'
    ],
    commonTraps: [
      'إضافة to قبل الفعل: الخطأ "To open the door"، الصواب: Open the door.',
      'استخدام الفاعل you بصوت عالي: "You sit down!" تبدو فظة؛ الأفضل: Sit down, please.',
      'نفي خاطئ: الخطأ "Not touch"، الصواب: Don\'t touch. / Do not touch.'
    ],
    examples: [
      { en: 'Take the second street on your left, then go straight.', ar: 'خد تاني شارع على شمالك، وبعدين امشي على طول.', highlight: 'Take', context: 'إرشادات طريق' },
      { en: 'Do not park here; your car will be towed.', ar: 'متركنش هنا؛ عربيتك هتتسحب.', highlight: 'Do not park', context: 'تحذير رسمي' },
      { en: 'Try the molokhia here; it is their best dish.', ar: 'جرّب الملوخية هنا؛ أحسن حاجة عندهم.', highlight: 'Try', context: 'نصيحة ودودة' }
    ],
    miniQuiz: [
      {
        question: '______ quiet, please. The baby is sleeping.',
        options: ['To be', 'Be', 'Being', 'You are'],
        correct: 1,
        explanation: 'صيغة الأمر تبدأ بالفعل في المصدر: Be quiet.'
      },
      {
        question: '______ your phone in the classroom.',
        options: ['Not use', 'No use', "Don't use", "Doesn't use"],
        correct: 2,
        explanation: 'نفي الأمر = Don\'t + المصدر: Don\'t use.'
      }
    ]
  },
  {
    id: 'can-for-ability',
    order: 45,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Essentials & Sentence Structure',
    titleAr: 'Can و Could: القدرة والاستطاعة والإذن',
    titleEn: 'Can / Could for Ability & Permission',
    level: 'A1 - مبتدئ',
    goldenFormula: 'Subject + can + مصدر (I can swim)  |  الماضي: could (I could swim when I was ten)',
    negativeFormula: "can't / cannot  |  الماضي: couldn't",
    questionFormula: 'Can you ... ? / Could you ... ? (أكثر تهذيباً)',
    summaryAr: 'Can معناها "يقدر / يعرف / ممكن": قدرة، مهارة، أو إذن. ماضيها could. سهلة لأن الفعل بعدها دايماً في المصدر من غير to ومن غير أي إضافات.',
    timelineDescription: 'قدرة حالية (can) أو قدرة في الماضي (could)؛ لا تصريف ثالث لها.',
    imageUrl: ONLINE_IMAGES.learningStudyGroup,
    imageAlt: 'Young people learning new skills together',
    keyUsagePoints: [
      'القدرة والمهارة (She can drive / I can cook)',
      'الإذن والسماح (Can I go out? / You can use my laptop)',
      'الطلبات (Can you open the window?)',
      'الإمكانية العامة (It can get very hot in August)'
    ],
    egyptianTips: [
      'بعد can الفعل في المصدر دايماً: He can swim (مش swims ومش to swim).',
      'النفي can\'t بتتنطق أمريكي "كانت" وبريطاني "كانت" بحركة أطول؛ في الامتحانات اسمع للـ t.',
      'Could you ... ؟ أسلوب أشيك للطلبات: Could you help me, please?'
    ],
    commonTraps: [
      'إضافة s للمفرد الغائب: الخطأ "He cans swim"، الصواب: He can swim.',
      'إضافة to بعد can: الخطأ "I can to speak"، الصواب: I can speak.',
      'استخدام could للحاضر: الخطأ "I could help you tomorrow" لو تقصد عرض حاضر، الصواب: I can help you tomorrow.'
    ],
    examples: [
      { en: 'My grandmother can read without glasses.', ar: 'جدتي تقدر تقرا من غير نضارة.', highlight: 'can read', context: 'قدرة حالية' },
      { en: 'When I lived in Hurghada, I could swim every day.', ar: 'لما كنت ساكن في الغردقة، كنت أقدر أعوم كل يوم.', highlight: 'could swim', context: 'قدرة في الماضي' },
      { en: 'Could you send me the file before noon, please?', ar: 'ممكن تبعتلي الملف قبل الضهر من فضلك؟', highlight: 'Could you send', context: 'طلب مهذب' }
    ],
    miniQuiz: [
      {
        question: 'Omar is a mechanic. He ______ fix any car.',
        options: ['cans', 'can to', 'can', 'is can'],
        correct: 2,
        explanation: 'Can لا تأخذ s ولا to بعدها: He can fix.'
      },
      {
        question: 'I ______ ride a bike when I was five, but now I can.',
        options: ["can't", 'could', "couldn't", 'cannot'],
        correct: 2,
        explanation: 'الجملة فيها but now I can، يعني الماضي كان منفياً: couldn\'t.'
      }
    ]
  },
  {
    id: 'wh-questions',
    order: 46,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Essentials & Sentence Structure',
    titleAr: 'أدوات الاستفهام: What و Where و Why وإخواتها',
    titleEn: 'Wh- Questions',
    level: 'A1 - مبتدئ',
    goldenFormula: 'Wh- word + do/does/is/are + subject + verb?',
    negativeFormula: 'Why don\'t you ... ? (للاقتراح) / Why didn\'t ... ?',
    questionFormula: 'هي نفسها صيغة السؤال: What do you want? / Where does he live?',
    summaryAr: 'أدوات الاستفهام هي مفاتيح أي محادثة: What لمين/إيه، Where لفين، When لإمتى، Why ليه، Who لمين، How إزاي، Which أنهي، Whose بتاعة مين. ترتيبها ثابت: أداة + فعل مساعد + فاعل + فعل.',
    timelineDescription: 'تُستخدم في كل الأزمنة؛ المساعد يتغير حسب الزمن (do/did/will/is).',
    imageUrl: ONLINE_IMAGES.onlineTechLecture,
    imageAlt: 'A student asking questions in an online class',
    keyUsagePoints: [
      'What للأشياء والمعلومات / Who للأشخاص',
      'Where للمكان / When للوقت / Why للسبب',
      'How للطريقة والحال (How are you?) ومركباتها: How much/how many/how often',
      'Which للاختيار بين محدود / Whose للملكية'
    ],
    egyptianTips: [
      'الترتيب الذهبي: أداة الاستفهام + المساعد + الفاعل + الفعل: Where DO you LIVE?',
      'متنساش المساعد: الخطأ الشائع "Where you live?"، الصواب: Where do you live?',
      'لو Who/What هي نفسها الفاعل، منحتاجش مساعد: Who called you? (مين اتصل؟) مش Who did call you?'
    ],
    commonTraps: [
      'نسيان المساعد do/does: الخطأ "What he wants?"، الصواب: What DOES he want?',
      'إضافة s للفعل بعد does: الخطأ "Where does he lives?"، الصواب: Where does he live?',
      'استخدام How بمعنى What: الخطأ "How is your name?"، الصواب: What is your name?'
    ],
    examples: [
      { en: 'What time does the train to Mansoura leave?', ar: 'الساعة كام بيتحرك قطار المنصورة؟', highlight: 'What time does', context: 'سؤال عن موعد' },
      { en: 'Why did you choose engineering?', ar: 'ليه اخترت الهندسة؟', highlight: 'Why did', context: 'سؤال عن سبب في الماضي' },
      { en: 'How often do you go to the gym?', ar: 'بتروح الجيم كام مرة؟ / بتروح الجيم كل قد إيه؟', highlight: 'How often do', context: 'سؤال عن التكرار' }
    ],
    miniQuiz: [
      {
        question: '______ does your father work? - At a bank.',
        options: ['When', 'Why', 'Where', 'Who'],
        correct: 2,
        explanation: 'الإجابة مكان (at a bank)، فالسؤال بـ Where.'
      },
      {
        question: 'Who ______ the window? - Tamer did.',
        options: ['did break', 'breaks', 'broke', 'break'],
        correct: 2,
        explanation: 'Who هنا هي الفاعل، فالفعل يتصرف مباشرة بدون مساعد: broke.'
      }
    ]
  },
  {
    id: 'demonstratives-plurals',
    order: 47,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Essentials & Sentence Structure',
    titleAr: 'This و That و These و Those + جموع الأسماء',
    titleEn: 'Demonstratives & Plural Nouns',
    level: 'A1 - مبتدئ',
    goldenFormula: 'قريب: this (مفرد) / these (جمع)  |  بعيد: that (مفرد) / those (جمع)',
    negativeFormula: 'النفي في الفعل: This is not mine. / These are not mine.',
    questionFormula: 'What is this/that? / What are these/those?',
    summaryAr: 'أسماء الإشارة بتشاور على الحاجات: this/these للقريب، that/those للبعيد، والمفرد ياخد is والجمع ياخد are. ومعاها جموع الأسماء: أغلبها s منتظمة، وشوية شواذ لازم يتحفظوا.',
    timelineDescription: 'قاعدة تركيبية ثابتة للإشارة والعد؛ تُستخدم في كل الأزمنة.',
    imageUrl: ONLINE_IMAGES.modernClassroom,
    imageAlt: 'A teacher pointing at near and far objects in class',
    keyUsagePoints: [
      'This + is للمفرد القريب / That + is للمفرد البعيد',
      'These + are للجمع القريب / Those + are للجمع البعيد',
      'الجمع المنتظم: +s أو +es (books, watches, boxes)',
      'الجموع الشاذة الشهيرة: men, women, children, people, feet, teeth, mice'
    ],
    egyptianTips: [
      'this = ده/دي (قريب)، that = ده/دا البعيد، these = دول، those = دول بتوع بعيد. الفرق في الإنجليزي أهم لأن الفعل بيتغير.',
      'الاسم اللي بينتهي بـ s/sh/ch/x/o بياخد es: bus-buses, dish-dishes, watch-watches, potato-potatoes.',
      'الاسم اللي بينتهي بحرف علة + y بياخد s عادي (days)، لكن ساكن + y يتحول لـ ies (city-cities, story-stories).'
    ],
    commonTraps: [
      'خلط this مع الجمع: الخطأ "This are my friends"، الصواب: These are my friends.',
      'جمع مزدوج: الخطأ "childs / childrens"، الصواب: children.',
      'نسيان التحويل لـ ies: الخطأ "citys"، الصواب: cities.'
    ],
    examples: [
      { en: 'This is my colleague Mariam, and those are her brothers over there.', ar: 'دي زميلتي مريم، ودول إخواتها اللي واقفين هناك.', highlight: 'those', context: 'إشارة لجمع بعيد' },
      { en: 'These boxes are too heavy for one person.', ar: 'الكراتين دي تقيلة أوي على واحد لوحده.', highlight: 'These boxes', context: 'جمع منتظم +es' },
      { en: 'How many people live in this building?', ar: 'كام شخص ساكن في العمارة دي؟', highlight: 'people', context: 'جمع شاذ' }
    ],
    miniQuiz: [
      {
        question: '______ are my new glasses; I bought them yesterday.',
        options: ['This', 'That', 'These', 'It'],
        correct: 2,
        explanation: 'Glasses جمع وقريبة (بتتكلم عنها)، فالإشارة These.'
      },
      {
        question: 'The ______ are playing in the garden.',
        options: ['childs', 'childrens', 'children', 'child'],
        correct: 2,
        explanation: 'جمع child الشاذ هو children بدون أي إضافة.'
      }
    ]
  },
  {
    id: 'too-enough-so-such',
    order: 48,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'Too و Enough و So و Such: الدرجة والزيادة والكفاية',
    titleEn: 'Too / Enough / So / Such',
    level: 'A2 - تأسيسي',
    goldenFormula: 'too + صفة | صفة + enough | so + صفة | such + (a/an) + صفة + اسم',
    negativeFormula: 'not + صفة + enough (The bag is not big enough)',
    questionFormula: 'Is it too far? / Is it big enough? / Is it so expensive?',
    summaryAr: 'أربع كلمات بتوصّف الدرجة: too = زيادة عن اللزوم (سلبي)، enough = كفاية (محايد/إيجابي)، so = جداً للتأكيد والنتيجة، such = جداً لكن مع اسم. الفرق بينهم في الترتيب: too قبل الصفة، و enough بعدها.',
    timelineDescription: 'أدوات وصف للدرجة؛ تدخل في كل الأزمنة دون تغيير.',
    imageUrl: ONLINE_IMAGES.libraryStudy,
    imageAlt: 'A suitcase too heavy to lift at a station',
    keyUsagePoints: [
      'too + صفة (+ to + مصدر): too tired to work',
      'صفة + enough (+ to + مصدر): old enough to drive',
      'enough + اسم: enough money / enough time',
      'so + صفة + that للنتيجة: so hot that we stayed home | such + a + اسم: such a nice day'
    ],
    egyptianTips: [
      'افتكر الميزان: too ميلة زيادة (سلبي)، enough مظبوطة بالكفاية. "الشاي سخن أوي" = too hot، "الشاي سخن كفاية؟" = hot enough?',
      'Enough مع الصفة ييجي بعدها، ومع الاسم ييجي قبلها: tall enough لكن enough money.',
      'so و such زي "جداً": so + صفة (so beautiful)، لكن such + a + صفة + اسم مفرد (such a beautiful girl).'
    ],
    commonTraps: [
      'وضع enough قبل الصفة: الخطأ "He is enough tall"، الصواب: He is tall enough.',
      'استخدام too بمعنى إيجابي "جداً": الخطأ "She is too beautiful" لو تقصد مدح، الصواب: so/very beautiful. Too دايماً فيها إحساس سلبي.',
      'نسيان a بعد such: الخطأ "It is such nice car"، الصواب: It is such a nice car.'
    ],
    examples: [
      { en: 'The exam was too difficult; nobody finished on time.', ar: 'الامتحان كان صعب زيادة عن اللزوم؛ محدش خلص في الوقت.', highlight: 'too difficult', context: 'زيادة سلبية' },
      { en: 'You are old enough to make your own decisions.', ar: 'انت كبير كفاية إنك تاخد قراراتك بنفسك.', highlight: 'old enough', context: 'كفاية بعد الصفة' },
      { en: 'It was such a crowded train that we stood all the way to Tanta.', ar: 'القطار كان زحمة جداً لدرجة إننا وقفنا طول الطريق لطنطا.', highlight: 'such a crowded', context: 'such + a + صفة + اسم' }
    ],
    miniQuiz: [
      {
        question: 'This coffee is ______ hot to drink now; wait a minute.',
        options: ['enough', 'so', 'too', 'such'],
        correct: 2,
        explanation: 'سخونة زيادة عن اللزوم (سلبي) + to drink = too hot to drink.'
      },
      {
        question: 'He is not tall ______ to reach the top shelf.',
        options: ['too', 'enough', 'so', 'such'],
        correct: 1,
        explanation: 'الكفاية مع الصفة تأتي بعدها: tall enough.'
      }
    ]
  },
  {
    id: 'both-either-neither',
    order: 49,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'Both و Either و Neither: الاتنين وواحد منهم ولا واحد',
    titleEn: 'Both / Either / Neither',
    level: 'A2 - تأسيسي',
    goldenFormula: 'both (الاتنين) + جمع | either (أي واحد من الاتنين) + مفرد | neither (ولا واحد) + مفرد',
    negativeFormula: 'neither بحد ذاتها نفي؛ ممنوع neither ... not',
    questionFormula: 'Which one do you want? - Either is fine. / Neither.',
    summaryAr: 'لما الكلام عن اختيارين بس: both يعني الاتنين مع بعض، either يعني أي واحد فيهم، و neither يعني ولا واحد فيهم. مع both ... and و either ... or و neither ... nor بتبقى أقوى.',
    timelineDescription: 'أدوات تحديد للكمية والاختيار؛ تدخل في كل الأزمنة دون تغيير.',
    imageUrl: ONLINE_IMAGES.learningStudyGroup,
    imageAlt: 'Two paths crossing in a park, a choice between two options',
    keyUsagePoints: [
      'Both + جمع: Both restaurants are good',
      'Either + مفرد: Either restaurant is fine (أي واحد ينفع)',
      'Neither + مفرد بمعنى نفي: Neither answer is correct',
      'التراكيب: both A and B / either A or B / neither A nor B'
    ],
    egyptianTips: [
      'neither لوحدها نفي كامل: Neither bus came = ولا أوتوبيس جه. متقولش Neither bus didn\'t come.',
      'في الكلام، "مش أنا كمان" = Me neither (مش Me either!). "I don\'t like foul" - "Me neither".',
      'either أو neither مع or/nor بيراعوا أقرب اسم في الفعل: Neither the players nor the COACH was ready.'
    ],
    commonTraps: [
      'نفي مزدوج مع neither: الخطأ "Neither of them isn\'t coming"، الصواب: Neither of them is coming.',
      'استخدام both بمعنى سلبي: الخطأ "I don\'t like both" لما تقصد ولا واحد، الصواب: I like neither.',
      'استخدام either مع أكثر من اختيارين: لثلاثة أو أكثر استخدم any، مش either.'
    ],
    examples: [
      { en: 'Both teams played well, but only one could win the cup.', ar: 'الفريقين لعبوا كويس، بس واحد بس اللي يقدر ياخد الكأس.', highlight: 'Both teams', context: 'الاتنين مع بعض' },
      { en: 'You can take either road; they both lead to the corniche.', ar: 'خد أي طريق فيهم؛ الاتنين بيوصلوا للكورنيش.', highlight: 'either road', context: 'أي واحد من الاتنين' },
      { en: 'Neither of my parents speaks English, so I translate for them.', ar: 'ولا واحد من والديّ بيتكلم إنجليزي، فأنا بترجملهم.', highlight: 'Neither of', context: 'نفي الاتنين' }
    ],
    miniQuiz: [
      {
        question: '______ of the two buses goes to the airport; you can take any of them.',
        options: ['Both', 'Neither', 'Either', 'All'],
        correct: 2,
        explanation: 'أي واحد من الاتنين + فعل مفرد goes = Either.'
      },
      {
        question: 'I like ______ tea nor coffee; I prefer fresh juice.',
        options: ['both', 'either', 'neither', 'not'],
        correct: 2,
        explanation: 'التركيب neither ... nor للنفي الكامل: neither tea nor coffee.'
      }
    ]
  },
  {
    id: 'going-to-vs-will',
    order: 50,
    category: 'أزمنة المستقبل',
    categoryEn: 'Future Tenses',
    titleAr: 'Will و Be going to: الفرق الحقيقي بينهم',
    titleEn: 'Will vs Be Going To',
    level: 'A2 - تأسيسي',
    goldenFormula: 'قرار لحظي/وعد/توقع رأي = will  |  خطة مسبقة/دليل واضح = be going to',
    negativeFormula: "won't + مصدر  |  am/is/are + not going to + مصدر",
    questionFormula: 'Will you ... ?  |  Are you going to ... ?',
    summaryAr: 'الاتنين للمستقبل بس المعنى مختلف: will للقرار اللي اتخد في لحظة الكلام، الوعود، والتوقعات الرأيية. و be going to للخطط المتخدة من قبل الكلام، وللتوقع المبني على دليل شايفه قدامك.',
    timelineDescription: 'نقطة مستقبلية؛ الاختيار بين will و going to يعتمد على لحظة اتخاذ القرار ووجود دليل.',
    imageUrl: ONLINE_IMAGES.grammar.futureSimple,
    imageAlt: 'A person planning the future on a calendar',
    keyUsagePoints: [
      'Will: قرار فوري (I will help you with that bag!)',
      'Will: وعد أو عرض (I will call you tonight / Will you marry me?)',
      'Going to: خطة مسبقة (We are going to visit Aswan in December)',
      'Going to: توقع بدليل حاضر (Look at those clouds; it is going to rain)'
    ],
    egyptianTips: [
      'اختبار سريع: قررت إمتى؟ لو دلوقتي وأنت بتتكلم = will. لو من بدري = going to.',
      'شايف دليل قدامك؟ going to: "العيادة مقفولة، هتتأجل المعاد" = Look, nobody is here; the appointment is going to be delayed.',
      'التوقعات مع I think / I hope / probably غالباً will: I think Egypt will win.'
    ],
    commonTraps: [
      'استخدام will لخطة متفق عليها: الخطأ "I will travel next Friday; I booked last month"، الأدق: I am going to travel / I am travelling.',
      'نسيان be في going to: الخطأ "I going to study"، الصواب: I AM going to study.',
      'استخدام going to لقرار لحظي: الخطأ "The phone is ringing! I am going to answer it"، الطبيعي: I WILL answer it.'
    ],
    examples: [
      { en: 'We are going to renovate the flat next summer; we already bought the paint.', ar: 'إحنا هنعمل الصيانة للشقة الصيف الجاي؛ إحنا أصلاً اشترينا الدهانات.', highlight: 'are going to renovate', context: 'خطة مسبقة بدليل' },
      { en: 'It is very hot in here. I will open the window.', ar: 'الجو حر أوي هنا. هفتح الشباك.', highlight: 'will open', context: 'قرار لحظي' },
      { en: 'Watch out! You are going to drop your phone.', ar: 'حاول تاخد بالك! موبايلك هيقع.', highlight: 'going to drop', context: 'توقع بدليل واضح' }
    ],
    miniQuiz: [
      {
        question: 'A: I have decided to lose weight. B: Really? I ______ join the gym with you!',
        options: ['am going to', 'will', 'go to', 'would'],
        correct: 1,
        explanation: 'قرار اتخذ في لحظة الكلام (رد فعل فوري) = will.'
      },
      {
        question: 'Look at the dark sky! It ______ rain any minute.',
        options: ['will', 'is going to', 'rains', 'would'],
        correct: 1,
        explanation: 'توقع مبني على دليل حاضر (السما مغيمة) = is going to.'
      }
    ]
  },
  {
    id: 'present-perfect-vs-past-simple',
    order: 51,
    category: 'أزمنة الماضي',
    categoryEn: 'Past Tenses',
    titleAr: 'المضارع التام ضد الماضي البسيط: أشهر معركة في القواعد',
    titleEn: 'Present Perfect vs Past Simple',
    level: 'A2 - تأسيسي',
    goldenFormula: 'زمن محدد في الماضي؟ = Past Simple  |  زمن مفتوح/خبرة/أثر حاضر؟ = Present Perfect',
    negativeFormula: "didn't + مصدر  |  haven't/hasn't + تصريف ثالث",
    questionFormula: 'Did you ... ?  |  Have you ever ... ?',
    summaryAr: 'القاعدة الذهبية: لو في وقت ماضي محدد في الجملة (yesterday, in 2019, last week) استخدم الماضي البسيط. لو الكلام عن خبرة من غير وقت، أو حاجة ليها أثر دلوقتي، استخدم المضارع التام. ممنوع تخلط وقت ماضي محدد مع المضارع التام!',
    timelineDescription: 'الماضي البسيط نقطة مغلقة انتهت؛ المضارع التام جسر بين الماضي والحاضر.',
    imageUrl: ONLINE_IMAGES.grammar.presentPerfect,
    imageAlt: 'A bridge between past and present on a timeline',
    keyUsagePoints: [
      'Past Simple مع أدوات الوقت المحدد: yesterday, ago, last, in 2010',
      'Present Perfect للخبرة العامة: Have you ever tried koshary?',
      'Present Perfect مع just/already/yet/since/for: I have just eaten',
      'Present Perfect لحدث له أثر حاضر: I have lost my keys (يعني مش معايا دلوقتي)'
    ],
    egyptianTips: [
      'شفت yesterday أو ago أو last؟ اقفل على الماضي البسيط فوراً: I SAW him yesterday (مش have seen).',
      'سؤال الخبرة المصري "جربت كذا قبل كده؟" = Have you ever tried ... ?',
      'Since + نقطة بداية (since 2015)، و for + مدة (for ten years).'
    ],
    commonTraps: [
      'استخدام المضارع التام مع وقت محدد: الخطأ "I have met him yesterday"، الصواب: I MET him yesterday.',
      'استخدام الماضي البسيط مع ever: الخطأ "Did you ever visit Luxor?" في سؤال خبرة عامة، الأدق: Have you ever visited Luxor?',
      'نسيان التصريف الثالث: الخطأ "I have went"، الصواب: I have gone.'
    ],
    examples: [
      { en: 'I visited the Grand Egyptian Museum last month.', ar: 'زرت المتحف المصري الكبير الشهر اللي فات.', highlight: 'visited', context: 'وقت محدد = ماضي بسيط' },
      { en: 'Have you ever eaten liver sandwiches from a street cart?', ar: 'كلت سندوتشات كبدة من عربة شارع قبل كده؟', highlight: 'Have you ever eaten', context: 'خبرة عامة = مضارع تام' },
      { en: 'She has lived in Mansoura since 2018, but she was born in Port Said.', ar: 'هي عايشة في المنصورة من 2018، بس اتولدت في بورسعيد.', highlight: 'has lived', context: 'مدة ممتدة للحاضر + ميلاد منتهي' }
    ],
    miniQuiz: [
      {
        question: 'I ______ my best friend in 2015, and we are still close.',
        options: ['have met', 'met', 'meet', 'have been meeting'],
        correct: 1,
        explanation: 'وجود سنة محددة (2015) يفرض الماضي البسيط: met.'
      },
      {
        question: 'We ______ already ______ this series; let us watch something else.',
        options: ['did / watch', 'have / watched', 'are / watching', 'had / watch'],
        correct: 1,
        explanation: 'Already من أدوات المضارع التام: have watched.'
      }
    ]
  },
  {
    id: 'adverbs-of-manner',
    order: 52,
    category: 'الأساسيات والتركيب اللغوي',
    categoryEn: 'Essentials & Sentence Structure',
    titleAr: 'ظروف الحال: بإتقان، بسرعة، بهدوء',
    titleEn: 'Adverbs of Manner',
    level: 'A2 - تأسيسي',
    goldenFormula: 'صفة + ly = ظرف حال: slow -> slowly  |  مكانها: بعد الفعل أو بعد المفعول',
    negativeFormula: 'النفي في الفعل: He does not drive carefully',
    questionFormula: 'How + فعل مساعد + فاعل + فعل؟ (How does she sing?)',
    summaryAr: 'ظرف الحال بيجاوب على سؤال "إزاي؟": بيسوّق إزاي؟ بيتكلم إزاي؟ أغلبها صفة + ly، بمكانها الطبيعي بعد الفعل أو بعد المفعول مباشرة، مش بين الفعل ومفعوله.',
    timelineDescription: 'تصف كيفية الفعل في أي زمن دون أن تتصرف.',
    imageUrl: ONLINE_IMAGES.grammar.pastContinuous,
    imageAlt: 'A person driving carefully on a wet road',
    keyUsagePoints: [
      'التكوين: صفة + ly (quick-quickly, careful-carefully)',
      'الشواذ المهمة: good -> well / fast -> fast / hard -> hard / late -> late',
      'المكان: بعد الفعل أو بعد المفعول (She sings beautifully / She closed the door quietly)',
      'الصفات المنتهية بـ y تتحول لـ ily (easy-easily) والمنتهية بـ le تتحول لـ ly (gentle-gently)'
    ],
    egyptianTips: [
      'Good صفة و Well ظرف: هو لاعب كويس = He is a good player، بيلعب كويس = He plays well.',
      'Hard و late زي ما هما: يشتغل بجد = works hard (مش hardly! دي معناها "بالكاد").',
      'مكان الظرف مهم: متقولش She closed quietly the door، الصواب: She closed the door quietly.'
    ],
    commonTraps: [
      'استخدام الصفة مكان الظرف: الخطأ "He drives good"، الصواب: He drives well.',
      'الخلط بين hard و hardly: I hardly work = بالكاد بشتغل (عكس المعنى المقصود غالباً!).',
      'وضع الظرف بين الفعل والمفعول: الخطأ "She speaks slowly English"، الصواب: She speaks English slowly.'
    ],
    examples: [
      { en: 'The taxi driver drove quickly through the empty streets at dawn.', ar: 'سواق التاكسي ساق بسرعة في الشوارع الفاضية وقت الفجر.', highlight: 'quickly', context: 'ظرف بعد الفعل' },
      { en: 'She explained the lesson so clearly that everyone understood.', ar: 'هي شرحت الدرس بوضوح لدرجة إن الكل فهم.', highlight: 'clearly', context: 'صفة + ly' },
      { en: 'The team trained hard all week for the final.', ar: 'الفريق اتمرن بجد طول الأسبوع عشان النهائي.', highlight: 'hard', context: 'ظرف شاذ' }
    ],
    miniQuiz: [
      {
        question: 'My little sister draws really ______ for her age.',
        options: ['good', 'well', 'nice', 'beautiful'],
        correct: 1,
        explanation: 'بنوصف الفعل draws فمحتاجين ظرف: well.'
      },
      {
        question: 'He works ______; he barely takes a day off.',
        options: ['hardly', 'hard', 'harderly', 'good'],
        correct: 1,
        explanation: 'يعمل بجد = works hard. Hardly معناها "بالكاد" وهي عكس المعنى هنا.'
      }
    ]
  },
  {
    id: 'must-and-have-to',
    order: 53,
    category: 'مواضيع وقواعد أخرى',
    categoryEn: 'Other Grammar Topics',
    titleAr: 'Must و Have to: اللزوم والضرورة - وفرق النفي الخطير',
    titleEn: 'Must / Have to (Obligation)',
    level: 'A2 - تأسيسي',
    goldenFormula: 'must + مصدر (رأي المتكلم/قانون قوي)  |  have/has to + مصدر (ظرف خارجي يفرض)',
    negativeFormula: "mustn't = ممنوع!  |  don't have to = مش لازم (اختياري)",
    questionFormula: 'Do you have to ... ? (السؤال بـ must نادر ورسمي)',
    summaryAr: 'الاتنين "لازم": must لما اللزوم من رأي المتكلم أو قاعدة صارمة، و have to لما ظرف خارجي هو اللي بيفرض. لكن في النفي الفرق خطير: mustn\'t يعني ممنوع، و don\'t have to يعني مش مطلوب منك (تقدر تعمله براحتك).',
    timelineDescription: 'لزوم في الحاضر؛ الماضي = had to، والمستقبل = will have to.',
    imageUrl: ONLINE_IMAGES.grammar.modalVerbs,
    imageAlt: 'A stop sign and a mandatory direction sign on a road',
    keyUsagePoints: [
      'Must: قواعد صارمة ونصيحة قوية (You must see a doctor)',
      'Have to: التزامات خارجية (I have to wear a uniform at work)',
      "Mustn't: منع صريح (You mustn't smoke here)",
      "Don't have to: غياب اللزوم (You don't have to come early)"
    ],
    egyptianTips: [
      'المصري بيقول "مش لازم" بمعنى اختياري: ترجمتها don\'t have to. لو قلت mustn\'t فانت بتقول "ممنوع"!',
      'Has to للمفرد الغائب: She has to leave early.',
      'الماضي من الاتنين = had to: I had to work yesterday. مفيش musted!'
    ],
    commonTraps: [
      'ترجمة "مش لازم" بـ mustn\'t: الخطأ "You mustn\'t bring food" لو تقصد مش مطلوب، الصواب: You don\'t have to bring food.',
      'إضافة to بعد must: الخطأ "You must to go"، الصواب: You must go.',
      'نسيان do في سؤال have to: الخطأ "Have you to work?"، الصواب: Do you have to work?'
    ],
    examples: [
      { en: 'All passengers must show their tickets before boarding the train.', ar: 'كل الركاب لازم يورّوا تذاكرهم قبل ركوب القطار.', highlight: 'must show', context: 'قاعدة رسمية' },
      { en: 'You must not use your phone during the exam.', ar: 'ممنوع تستخدم موبايلك أثناء الامتحان.', highlight: 'must not use', context: 'منع صريح' },
      { en: 'Tomorrow is a holiday, so you do not have to wake up early.', ar: 'بكرة أجازة، فمش لازم تصحى بدري.', highlight: 'do not have to wake', context: 'غياب اللزوم' }
    ],
    miniQuiz: [
      {
        question: 'You ______ bring your laptop; the office provides computers. (مش لازم)',
        options: ["mustn't", "don't have to", 'must', 'have to'],
        correct: 1,
        explanation: 'المعنى "مش مطلوب منك" (اختياري) = don\'t have to. Mustn\'t تعني ممنوع.'
      },
      {
        question: 'Visitors ______ touch the paintings in the museum. (ممنوع)',
        options: ["don't have to", 'must', "mustn't", 'has to'],
        correct: 2,
        explanation: 'المنع الصريح = mustn\'t.'
      }
    ]
  },
];
