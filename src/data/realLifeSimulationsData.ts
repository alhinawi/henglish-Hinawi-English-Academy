import { CEFRLevel } from '../types';

export interface DialogueOption {
  textEn: string;
  textAr: string;
  isOptimal: boolean;
  score: number;
  feedbackAr: string;
  nextStepId?: string;
}

export interface SimulationTurn {
  id: string;
  speaker: string;
  speakerRole: string;
  speakerAvatar: string;
  textEn: string;
  textAr: string;
  options: DialogueOption[];
  expectedKeywordsForFreeText?: string[];
  grammarTipAr?: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  titleAr: string;
  category: 'travel' | 'hospitality' | 'healthcare' | 'daily' | 'professional';
  categoryAr: string;
  level: CEFRLevel;
  locationName: string;
  locationIcon: string;
  backdropImage: string;
  descriptionAr: string;
  keyVocabulary: { en: string; ar: string; phonetic?: string }[];
  turns: SimulationTurn[];
  rewardXp: number;
}

export const REAL_LIFE_SCENARIOS: SimulationScenario[] = [
  // ==========================================
  // 1. TRAVEL: AIRPORT CHECK-IN & BOARDING
  // ==========================================
  {
    id: 'sim-airport-checkin',
    title: 'Airport Check-in & Baggage Drop',
    titleAr: 'إنهاء إجراءات المطار وتسليم الحقائب',
    category: 'travel',
    categoryAr: 'السفر والمطارات',
    level: 'A2',
    locationName: 'Cairo International Airport - Terminal 3',
    locationIcon: '✈️',
    backdropImage: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1200&auto=format&fit=crop&q=80',
    descriptionAr: 'تعلم كيف تتحدث مع موظف الطيران عند شباك التذاكر، تسليم الأمتعة، واختيار مقعد الطائرة المفضل بثقة.',
    keyVocabulary: [
      { en: 'Boarding pass', ar: 'بطاقة صعود الطائرة', phonetic: '/ˈbɔːrdɪŋ pæs/' },
      { en: 'Window seat', ar: 'مقعد بجانب النافذة', phonetic: '/ˈwɪndoʊ siːt/' },
      { en: 'Aisle seat', ar: 'مقعد بجانب الممر', phonetic: '/aɪl siːt/' },
      { en: 'Luggage / Baggage', ar: 'حقائب السفر والأمتعة', phonetic: '/ˈlʌɡɪdʒ/' },
      { en: 'Carry-on bag', ar: 'حقيبة اليد المسموح بها في الطائرة', phonetic: '/ˈkæri ɒn/' },
    ],
    rewardXp: 120,
    turns: [
      {
        id: 'turn-1',
        speaker: 'Sarah Jenkins',
        speakerRole: 'Airline Ground Agent',
        speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        textEn: 'Good morning! Welcome to British Airways. May I please have your passport and booking reference?',
        textAr: 'صباح الخير! مرحباً بكم على متن الخطوط الجوية البريطانية. هل يمكنني الحصول على جواز سفرك ورقم الحجز من فضلك؟',
        grammarTipAr: 'الرد المؤدب دائماً يبدأ بـ "Good morning, here you go" أو "Certainly, here it is".',
        expectedKeywordsForFreeText: ['here', 'passport', 'booking', 'morning'],
        options: [
          {
            textEn: 'Good morning! Here is my passport and e-ticket confirmation.',
            textAr: 'صباح الخير! تفضلي جواز سفري وتأكيد التذكرة الإلكترونية.',
            isOptimal: true,
            score: 10,
            feedbackAr: 'ممتاز جداً! صياغة طبيعية ومهذبة للغاية كما يتحدث أهل اللغة.',
          },
          {
            textEn: 'Take passport and ticket now.',
            textAr: 'خذي الجواز والتذكرة الآن.',
            isOptimal: false,
            score: 3,
            feedbackAr: 'الصيغة جافة وغير مهذبة. من الأفضل دائماً استخدام Here is my passport من فضلك.',
          },
          {
            textEn: 'Yes, I am having passport in pocket.',
            textAr: 'نعم، أنا أملك جواز سفر في جيبي.',
            isOptimal: false,
            score: 5,
            feedbackAr: 'فعل have بمعنى الملكية هو stative verb ولا يفضل وضعه في المضارع المستمر am having.',
          },
        ],
      },
      {
        id: 'turn-2',
        speaker: 'Sarah Jenkins',
        speakerRole: 'Airline Ground Agent',
        speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        textEn: 'Thank you. Do you have any luggage to check in today, or just this carry-on bag?',
        textAr: 'شكراً لك. هل لديك أي حقائب ترغب في شحنها اليوم، أم مجرد هذه الحقيبة المحمولة؟',
        grammarTipAr: 'للإشارة لعدد الحقائب: "I have two bags to check in".',
        expectedKeywordsForFreeText: ['bags', 'suitcases', 'carry', 'check'],
        options: [
          {
            textEn: 'I have one suitcase to check in, and this backpack as a carry-on.',
            textAr: 'لدي حقيبة سفر واحدة لشحنها، وهذه الحقيبة كحقيبة يد محمولة.',
            isOptimal: true,
            score: 10,
            feedbackAr: 'إجابة مثالية ودقيقة بمصطلحات السفر المعتمدة.',
          },
          {
            textEn: 'No check in bag, all bags with me inside plane.',
            textAr: 'لا حقائب شحن، كل الحقائب معي داخل الطائرة.',
            isOptimal: false,
            score: 4,
            feedbackAr: 'قواعدياً ضعيفة، الأصح أن تقول: Just this carry-on bag, please.',
          },
        ],
      },
      {
        id: 'turn-3',
        speaker: 'Sarah Jenkins',
        speakerRole: 'Airline Ground Agent',
        speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        textEn: 'Would you prefer a window seat or an aisle seat for this flight?',
        textAr: 'هل تفضل مقعداً بجوار النافذة أم مقعداً بجانب الممر لهذه الرحلة؟',
        grammarTipAr: 'السؤال بـ Would you prefer يجاب عنه بـ "I would prefer..." أو "A window seat, please".',
        expectedKeywordsForFreeText: ['window', 'aisle', 'prefer', 'please'],
        options: [
          {
            textEn: 'I would prefer a window seat if possible, please.',
            textAr: 'أفضل مقعداً بجوار النافذة إذا كان متاحاً، من فضلك.',
            isOptimal: true,
            score: 10,
            feedbackAr: 'رائع جداً! استخدام if possible يظهر لباقة عالية في الحديث.',
          },
          {
            textEn: 'Give me window!',
            textAr: 'أعطني نافذة!',
            isOptimal: false,
            score: 2,
            feedbackAr: 'أسلوب غير لائق في المحادثات الرسمية. استخدم I would prefer a window seat, please.',
          },
        ],
      },
    ],
  },

  // ==========================================
  // 2. HOSPITALITY: ORDERING AT A RESTAURANT
  // ==========================================
  {
    id: 'sim-restaurant-ordering',
    title: 'Ordering at a Fine Dining Restaurant',
    titleAr: 'طلب الطعام وحجز الطاولة في مطعم راقٍ',
    category: 'hospitality',
    categoryAr: 'الضيافة والمطاعم',
    level: 'B1',
    locationName: 'The Ivy Restaurant - London',
    locationIcon: '🍽️',
    backdropImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    descriptionAr: 'مواقف حقيقية في المطعم: حجز الطاولة، السؤال عن مكونات الطبق، طلب الفاتورة، وتقديم ملاحظة لبقة.',
    keyVocabulary: [
      { en: 'Appetizer / Starter', ar: 'المقبلات والوجبة التمهيدية', phonetic: '/ˈæpɪtaɪzər/' },
      { en: 'Main course', ar: 'الطبق الرئيسي', phonetic: '/meɪn kɔːrs/' },
      { en: 'Allergic to', ar: 'لدي حساسية من', phonetic: '/əˈlɜːrdʒɪk tuː/' },
      { en: 'Could we have the bill?', ar: 'هل يمكننا الحصول على الحساب من فضلك؟', phonetic: '/bɪl/' },
      { en: 'Sparkling or still water', ar: 'مياه غازية أم مياه طبيعية عادية', phonetic: '/ˈspɑːrklɪŋ/' },
    ],
    rewardXp: 140,
    turns: [
      {
        id: 'rest-turn-1',
        speaker: 'Marco Rossi',
        speakerRole: 'Head Waiter',
        speakerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        textEn: 'Good evening, sir. Welcome to The Ivy. Do you have a reservation for this evening?',
        textAr: 'مساء الخير يا سيدي. أهلاً بكم في The Ivy. هل لديكم حجز مسبق لهذه الليلة؟',
        grammarTipAr: 'اذكر اسم صاحب الحجز: "Yes, a table for two under the name of..."',
        expectedKeywordsForFreeText: ['reservation', 'name', 'table', 'two'],
        options: [
          {
            textEn: 'Good evening. Yes, I have a reservation for two under the name of Karim.',
            textAr: 'مساء الخير. نعم، لدي حجز لشخصين باسم كريم.',
            isOptimal: true,
            score: 10,
            feedbackAr: 'صياغة نموذجية وأنيقة جداً لمحادثات المطاعم الراقية.',
          },
          {
            textEn: 'I want food now without table booking.',
            textAr: 'أريد طعاماً الآن بدون حجز طاولة.',
            isOptimal: false,
            score: 2,
            feedbackAr: 'صياغة غير مناسبة. إن لم تكن تملك حجزاً قل: Do you have a table for two available?',
          },
        ],
      },
      {
        id: 'rest-turn-2',
        speaker: 'Marco Rossi',
        speakerRole: 'Head Waiter',
        speakerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        textEn: 'Right this way, please. Here are the menus. Can I start you off with something to drink while you decide?',
        textAr: 'تفضل من هنا من فضلك. تفضل قوائم الطعام. هل يمكنني تقديم مشروب لكم أثناء اختيار الوجبة؟',
        grammarTipAr: 'للطلب المهذب: "Could I have..." أو "We would like..."',
        expectedKeywordsForFreeText: ['water', 'drink', 'sparkling', 'still', 'please'],
        options: [
          {
            textEn: 'Could we please have a bottle of sparkling water with lemon to start?',
            textAr: 'هل يمكننا الحصول على زجاجة مياه فوارة مع ليمون كبداية من فضلك؟',
            isOptimal: true,
            score: 10,
            feedbackAr: 'طلب مهذب واحترافي باستخدام Could we please have.',
          },
          {
            textEn: 'Bring me water fast.',
            textAr: 'أحضر لي ماء سريعاً.',
            isOptimal: false,
            score: 2,
            feedbackAr: 'صيغة أمر مباشرة وتعتبر غير مقبولة في الثقافة الإنجليزية.',
          },
        ],
      },
    ],
  },

  // ==========================================
  // 3. HEALTHCARE: DOCTOR'S CLINIC & PHARMACY
  // ==========================================
  {
    id: 'sim-doctor-appointment',
    title: 'Describing Symptoms to a Doctor',
    titleAr: 'شرح الأعراض المرضية للطبيب والصيدلي',
    category: 'healthcare',
    categoryAr: 'الرعاية الصحية والعيادات',
    level: 'B1',
    locationName: 'St. Mary Medical Center',
    locationIcon: '🩺',
    backdropImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
    descriptionAr: 'كيف تصف للطبيب بدقة ألم الرأس، الحمى، مدة استمرار التعب، ومواضع الشعور بالدوار.',
    keyVocabulary: [
      { en: 'Symptoms', ar: 'الأعراض المرضية', phonetic: '/ˈsɪmptəmz/' },
      { en: 'Severe headache', ar: 'صداع حاد ومؤلم', phonetic: '/sɪˈvɪər ˈhedeɪk/' },
      { en: 'Prescription', ar: 'روشتة أو وصفة طبية', phonetic: '/prɪˈskrɪpʃn/' },
      { en: 'Dizziness / Drowsy', ar: 'دوار وشعور بالنعاس', phonetic: '/ˈdɪzinəs/' },
      { en: 'Side effects', ar: 'الآثار والآثار الجانبية للدواء', phonetic: '/saɪd ɪˈfekts/' },
    ],
    rewardXp: 150,
    turns: [
      {
        id: 'doc-turn-1',
        speaker: 'Dr. Emily Watson',
        speakerRole: 'General Practitioner',
        speakerAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
        textEn: 'Hello there, please take a seat. What seems to be the problem today?',
        textAr: 'مرحباً بك، تفضل بالجلوس من فضلك. ما هي المشكلة أو الأعراض التي تشعر بها اليوم؟',
        grammarTipAr: 'لوصف الأعراض الممتدة: نستخدم المضارع التام المستمر: "I have been having a severe headache since Tuesday".',
        expectedKeywordsForFreeText: ['headache', 'pain', 'fever', 'days', 'sick'],
        options: [
          {
            textEn: 'Doctor, I have been experiencing a severe throbbing headache and fever for the past three days.',
            textAr: 'دكتورة، أعاني من صداع نابض حاد وارتفاع في درجة الحرارة طوال الأيام الثلاثة الماضية.',
            isOptimal: true,
            score: 10,
            feedbackAr: 'وصف طبي رائع ودقيق باستخدام المضارع التام المستمر (have been experiencing).',
          },
          {
            textEn: 'My head is broken since yesterday.',
            textAr: 'رأسي مكسور منذ الأمس.',
            isOptimal: false,
            score: 3,
            feedbackAr: 'broken تستخدم لكسور العظام (broken bone). للصداع نستخدم severe headache.',
          },
        ],
      },
    ],
  },

  // ==========================================
  // 4. PROFESSIONAL: TECH JOB INTERVIEW
  // ==========================================
  {
    id: 'sim-job-interview',
    title: 'Global Tech Company Job Interview',
    titleAr: 'مقابلة عمل رسمية في شركة برمجيات وتكنولوجيا دولية',
    category: 'professional',
    categoryAr: 'إنجليزي الأعمال والوظائف',
    level: 'B2',
    locationName: 'Canary Wharf Tech Headquarters',
    locationIcon: '💼',
    backdropImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    descriptionAr: 'تدريب احترافي للإجابة عن أسئلة المقابلات: تحدث عن نقاط قوتك، أسباب رغبتك بالانضمام، وإنجازاتك السابقة.',
    keyVocabulary: [
      { en: 'Accomplishment', ar: 'إنجاز ملموس', phonetic: '/əˈkɑːmplɪʃmənt/' },
      { en: 'Cross-functional team', ar: 'فريق عمل متعدد التخصصات', phonetic: '/krɔːs ˈfʌŋkʃənl tiːm/' },
      { en: 'Scale the product', ar: 'توسيع نطاق المنتج البرمجي', phonetic: '/skeɪl/' },
      { en: 'Deadline-driven', ar: 'ملتزم بالمواعيد النهائية بصرامة', phonetic: '/ˈdedlaɪn drɪvn/' },
    ],
    rewardXp: 180,
    turns: [
      {
        id: 'job-turn-1',
        speaker: 'David Miller',
        speakerRole: 'VP of Engineering',
        speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        textEn: 'Welcome, we are thrilled to meet you. To kick things off, could you walk us through your most impactful recent project?',
        textAr: 'مرحباً بك، يسعدنا جداً مقابلتك. في البداية، هل يمكنك أن تحدثنا بإيجاز عن أكثر مشروعاتك الأخيرة تأثيراً ونجاحاً؟',
        grammarTipAr: 'استخدم صيغة STAR (الموقف، المهمة، الإجراء، النتيجة) مع أفعال ماضية حركية قوية (led, architected, optimized).',
        expectedKeywordsForFreeText: ['project', 'team', 'led', 'delivered', 'improved'],
        options: [
          {
            textEn: 'Certainly. In my previous role, I spearheaded a team that restructured our cloud database, reducing latency by 45%.',
            textAr: 'بكل تأكيد. في دوري السابق، قدت فريقاً أعاد هيكلة قاعدة البيانات السحابية، مما قلل زمن الاستجابة بنسبة 45%.',
            isOptimal: true,
            score: 10,
            feedbackAr: 'إجابة مذهلة! استخدام أفعال قوية (spearheaded, restructured) مع أرقام دقيقة يعطي انطباعاً قيادياً مبهراً.',
          },
          {
            textEn: 'I worked on a lot of things, everything was fine and I do my best.',
            textAr: 'عملت على الكثير من الأشياء، كل شيء كان جيداً وأبذل ما بوسعي.',
            isOptimal: false,
            score: 4,
            feedbackAr: 'إجابة عامة وغامضة جداً. في المقابلات يجب ذكر أمثلة محددة وإنجازات بالأرقام.',
          },
        ],
      },
    ],
  },
];
