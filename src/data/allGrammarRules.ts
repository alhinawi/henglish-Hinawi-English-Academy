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
  category: 'أزمنة المضارع' | 'أزمنة الماضي' | 'أزمنة المستقبل' | 'حالات الشرط' | 'المبني للمجهول والتركيب' | 'الأساسيات والتركيب اللغوي';
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
    titleAr: 'المستقبل البسيط: المقارنة الشاملة بين Will و Going to',
    titleEn: 'Future Simple (Will vs Going to)',
    level: 'A2 - تأسيسي',
    goldenFormula: 'Will + V1  vs  am/is/are + going to + V1',
    negativeFormula: "Won't + V1  vs  am/is/are not going to + V1",
    questionFormula: 'Will + Subject + V1?  vs  Am/Is/Are + Subject + going to + V1?',
    summaryAr: 'المعركة الشهيرة في الإنجليزي! Will للقرارات السريعة اللحظية، والوعود، والتنبؤ بدون دليل. بينما Going to للخطط المسبقة، والقرارات المدروسة، والتنبؤ القائم على دليل مرئي حالي.',
    timelineDescription: 'نظرة إلى نقطة مستقبلية بناءً على قرار فوري أو خطة مسبقة أو علامة مادية واضحة.',
    imageUrl: ONLINE_IMAGES.grammar.futureSimple,
    imageAlt: 'Business strategist pointing at future company projections',
    keyUsagePoints: [
      'Will: قرارات لحظية فورية (Quick spontaneous decisions)',
      'Will: الوعود والعروض والتهديدات (Promises, Offers, Warnings)',
      'Going to: نوايا وخطط مسبقة ومدروسة (Prior plans & intentions)',
      'Going to: تنبؤ مبني على دليل مرئي في اللحظة (Prediction with physical evidence)'
    ],
    egyptianTips: [
      'لو جرس الباب رن دلوقتي حالا: I will open the door (قرار لحظي).',
      'لو شايف غيوم سوداء كثيفة في السما: It is going to rain (تنبؤ بدليل مرئي).',
      'لو ناوي تشتري لابتوب ومحوش فلوسه: I am going to buy a new laptop (خطة مسبقة).'
    ],
    commonTraps: [
      'فخ استخدام will مع التنبؤ القائم على دليل: الخطأ Look at the clouds, it will rain، الصواب: It is going to rain.'
    ],
    examples: [
      {
        en: 'The phone is ringing. — Don\'t worry, I will answer it.',
        ar: 'الهاتف يرن. — لا تقلق، سأرد أنا عليه فوراً.',
        highlight: 'will answer',
        context: 'قرار لحظي سريع'
      },
      {
        en: 'Look at that fragile shelf; it is going to collapse under the heavy books!',
        ar: 'انظر إلى ذلك الرف الهش؛ إنه على وشك الانهيار تحت وطأة الكتب الثقيلة!',
        highlight: 'is going to collapse',
        context: 'تنبؤ مبني على دليل مرئي واضح'
      }
    ],
    miniQuiz: [
      {
        question: 'I have already purchased the tickets; I ______ my grandparents in Luxor next Friday.',
        options: ['am going to visit', 'will visit', 'visit', 'visited'],
        correct: 0,
        explanation: 'شراء التذاكر مسبقاً يعني خطة ونية مؤكدة مسبقاً، فنستخدم am going to visit.'
      }
    ]
  },

  {
    id: 'future-continuous',
    order: 10,
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
    order: 11,
    category: 'أزمنة المستقبل',
    categoryEn: 'Future Tenses',
    titleAr: 'المستقبل التام الشامل: اكتمال الفعل قبل موعد مستقبلي',
    titleEn: 'Future Perfect Tense (Masterclass Core)',
    level: 'B2 - فوق متوسط',
    goldenFormula: 'will + have + Past Participle (V3)',
    negativeFormula: "won't + have + Past Participle (V3)",
    questionFormula: 'Will + Subject + have + V3?',
    summaryAr: 'الكورس الرائد للمنصة! تقف في نقطة مستقبلية وتنظر إلى الخلف لترى أن الفعل قد اكتمل وانتهى أمره تماماً قبل موعد التسليم أو النقطة المحددة.',
    timelineDescription: 'نقطة انتهاء مكتملة تقع قبل موعد مستقبلي نهائي محدد (Deadline).',
    imageUrl: ONLINE_IMAGES.grammar.futurePerfect,
    imageAlt: 'Calendar deadline and completed milestone roadmap',
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

  // ==========================================
  // 4. CONDITIONALS & MODALS (الشرط والأفعال الناقصة)
  // ==========================================
  {
    id: 'conditionals-all',
    order: 12,
    category: 'حالات الشرط',
    categoryEn: 'Conditionals & Modals',
    titleAr: 'حالات لو والشرط الأربعة: من الصفرية وحتى المستحيلة',
    titleEn: 'All 4 Conditionals (0, 1st, 2nd, 3rd)',
    level: 'B1 - متوسط',
    goldenFormula: 'Zero: If + Pres, Pres | 1st: If + Pres, will+V1 | 2nd: If + Past, would+V1 | 3rd: If + had+V3, would have+V3',
    negativeFormula: 'Unless = If not',
    questionFormula: 'What would you do if...?',
    summaryAr: 'كل قواعد "لو"! الصفرية للحقائق العلمية، الأولى لاحتمالات واقعية في المستقبل، الثانية لتخيلات غير حقيقية في الحاضر، والثالثة للندم على ما فات في الماضي.',
    timelineDescription: 'شجرة احتمالات تربط بين السبب والنتيجة عبر الواقع والتخيل والندم التاريخي.',
    imageUrl: ONLINE_IMAGES.grammar.conditionals,
    imageAlt: 'Fork in the road representing conditional choices and outcomes',
    keyUsagePoints: [
      'Zero Conditional: حقائق علمية وعامة (If water reaches 100°C, it boils)',
      'First Conditional: احتمالات مستقبلية واقعية وممكنة (If it rains, we will stay home)',
      'Second Conditional: افتراضات وتخيلات غير واقعية في الحاضر (If I had a million dollars, I would travel)',
      'Third Conditional: ندم وفرص ضائعة في الماضي يستحيل تغييرها (If I had studied harder, I would have passed)'
    ],
    egyptianTips: [
      'افتكر الحالة التانية: بنستخدم If I were you (مش was) لما نيجي ننصح حد "لو كنت مكانك".',
      'افتكر الحالة التالتة: ندم تام على الماضي! "لو كان حصل كذا، كان زمان حصل كذا" = If + had + V3 ➔ would have + V3.',
      'كلمة Unless معناها "إذا لم" (If... not)، وبيجي بعدها إثبات دايماً بدون نفي مزدوج.'
    ],
    commonTraps: [
      'فخ وضع would في جملة If: الخطأ If I would know, I would tell you، الصواب: If I knew, I would tell you.'
    ],
    examples: [
      {
        en: 'If the software team deploys the hotfix tonight, the servers will run smoothly tomorrow.',
        ar: 'إذا أطلق فريق البرمجيات التحديث العاجل الليلة، ستعمل الخوادم بسلاسة غداً.',
        highlight: 'deploys / will run',
        context: 'الحالة الشرطية الأولى (First Conditional)'
      },
      {
        en: 'If Karim spoke fluent German, he would apply for the engineering fellowship in Munich.',
        ar: 'لو كان كريم يتحدث الألمانية بطلاقة، لكان قد تقدم لمنحة الهندسة في ميونيخ (لكنه لا يتحدثها حالياً).',
        highlight: 'spoke / would apply',
        context: 'الحالة الشرطية الثانية (تخيل وفرضية غير واقعية الآن)'
      },
      {
        en: 'If we had booked the airline tickets earlier, we would have saved hundreds of dollars.',
        ar: 'لو كنا حجزنا تذاكر الطيران مبكراً، لكنا وفرنا مئات الدولارات (لكننا لم نحجز وندمنا).',
        highlight: 'had booked / would have saved',
        context: 'الحالة الشرطية الثالثة (ندم تام على الماضي)'
      }
    ],
    miniQuiz: [
      {
        question: 'If you ______ regular backups of your database, you wouldn\'t have lost all customer records.',
        options: ['had kept', 'keep', 'kept', 'would keep'],
        correct: 0,
        explanation: 'جواب الشرط يحتوي على wouldn\'t have lost (حالة ثالثة)، إذن فعل الشرط يجب أن يكون ماضياً تاماً: had kept.'
      }
    ]
  },

  {
    id: 'modal-verbs',
    order: 13,
    category: 'حالات الشرط',
    categoryEn: 'Conditionals & Modals',
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

  // ==========================================
  // 5. ADVANCED STRUCTURES (المبني للمجهول والتركيب)
  // ==========================================
  {
    id: 'passive-voice',
    order: 14,
    category: 'المبني للمجهول والتركيب',
    categoryEn: 'Advanced Structures',
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
    order: 15,
    category: 'المبني للمجهول والتركيب',
    categoryEn: 'Advanced Structures',
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
    order: 16,
    category: 'المبني للمجهول والتركيب',
    categoryEn: 'Advanced Structures',
    titleAr: 'ضمائر الوصل وجمل الصلة: دمج الجمل بسلاسة',
    titleEn: 'Relative Clauses (Who, Which, That, Whose, Where)',
    level: 'B1 - متوسط',
    goldenFormula: 'Noun + Relative Pronoun + Clause',
    negativeFormula: 'Without relative pronoun (contact clauses)',
    questionFormula: 'Who / Which...',
    summaryAr: 'الأداة السحرية التي تحول لغتك من جمل قصيرة مكسرة إلى لغة متحدث أصلي سلسة وأنيقة! ضمائر الوصل تدمج فكرتين وتصف الأسماء بدقة بالغة.',
    timelineDescription: 'حلقات وصل لغوية تربط الأسماء بصفاتها ومعلوماتها الإيضاحية.',
    imageUrl: ONLINE_IMAGES.grammar.relativeClauses,
    imageAlt: 'Connected networks and collaborative team working together',
    keyUsagePoints: [
      'Who: للأشخاص العاقلين (The engineer who solved the bug)',
      'Which / That: للأشياء غير العاقلة والحيوانات (The app which went viral)',
      'Whose: للملكية (The author whose book was published)',
      'Where / When: للأماكن والأوقات (The hub where we innovate)'
    ],
    egyptianTips: [
      'في جمل الوصل المحددة (Defining)، لو ضمير الوصل بيعود على مفعول به، نقدر نحذفه تماماً: The book I read أمس هو نفسه The book which I read.',
      'في جمل الوصل غير المحددة (Non-defining بين فصلتين)، مستحيل نستخدم that ولا يمكن حذف الضمير.'
    ],
    commonTraps: [
      'فخ استخدام that بعد فاصلة: الخطأ Cairo, that is my hometown, is lively، الصواب: Cairo, which is my hometown, is lively.'
    ],
    examples: [
      {
        en: 'The senior architect who designed the modern library received an international award.',
        ar: 'المهندس المعماري البارز الذي صمم المكتبة الحديثة حصل على جائزة دولية.',
        highlight: 'who designed',
        context: 'ضمير وصل يعود على فاعل عاقل'
      }
    ],
    miniQuiz: [
      {
        question: 'The startup ______ pitch won the venture funding is expanding rapidly.',
        options: ['whose', 'who', 'which', 'where'],
        correct: 0,
        explanation: 'العرض التقديمي ملك للشركة الناشئة، لذلك نستخدم ضمير الملكية whose.'
      }
    ]
  },

  // ==========================================
  // 6. FOUNDATIONS & ADVANCED SYNTAX (الأساسيات والتركيب اللغوي)
  // ==========================================
  {
    id: 'parts-of-speech',
    order: 17,
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
    order: 18,
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
    order: 19,
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
    order: 20,
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
    order: 21,
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
  }
];
