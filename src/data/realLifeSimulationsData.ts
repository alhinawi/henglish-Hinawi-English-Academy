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
    locationIcon: '',
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
    locationIcon: '',
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
    locationIcon: '',
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
    locationIcon: '',
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
  // ==========================================
  // 5. DAILY: COFFEE SHOP ORDER & SMALL TALK
  // ==========================================
  {
    id: 'sim-coffee-shop',
    title: 'Coffee Shop Order & Friendly Small Talk',
    titleAr: 'طلب القهوة والدردشة الودية في الكافيه',
    category: 'daily',
    categoryAr: 'الحياة اليومية',
    level: 'A1',
    locationName: 'Downtown Specialty Coffee House',
    locationIcon: 'Cafe',
    backdropImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
    descriptionAr: 'أشهر موقف يومي على الإطلاق: اطلب قهوتك بالمواصفات اللي تعجبك، اسأل عن الواي فاي، ورد على الدردشة الودية من الباريستا بثقة.',
    keyVocabulary: [
      { en: 'Medium roast', ar: 'بن محمص وسط', phonetic: '/ˈmiːdiəm roʊst/' },
      { en: 'Iced latte', ar: 'لاتيه مثلج', phonetic: '/aɪst ˈlɑːteɪ/' },
      { en: 'For here or to go?', ar: 'هنا في الكافيه ولا تيك أواي؟', phonetic: '/fər hɪr ɔːr tə ɡoʊ/' },
      { en: 'Wifi password', ar: 'كلمة سر الواي فاي', phonetic: '/ˈwaɪfaɪ ˈpæswɜːrd/' },
      { en: 'Keep the change', ar: 'اتفضل الباقي (بقشيش)', phonetic: '/kiːp ðə tʃeɪndʒ/' },
    ],
    rewardXp: 100,
    turns: [
      {
        id: 'turn-1',
        speaker: 'Mona Adel',
        speakerRole: 'Barista',
        speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        textEn: 'Hi there! Welcome to Downtown Coffee. What can I get started for you today?',
        textAr: 'أهلاً بك! مرحباً بك في كافيه وسط البلد. ماذا يمكنني أن أحضر لك اليوم؟',
        grammarTipAr: 'للطلب المهذب استخدم "Can I have..." أو "I would like..." وتجنب كلمة "Want" لأنها حادة في المواقف الرسمية.',
        expectedKeywordsForFreeText: ['have', 'like', 'coffee', 'please'],
        options: [
          {
            textEn: 'Hi! Can I have a large iced latte with caramel, please?',
            textAr: 'أهلاً! ممكن لاتيه مثلج كبير بالكراميل من فضلك؟',
            isOptimal: true,
            score: 10,
            feedbackAr: 'طلب مثالي: مهذب، واضح، وبالمواصفات الكاملة زي أهل اللغة بالظبط.',
          },
          {
            textEn: 'Give me coffee. Big one. Fast.',
            textAr: 'هات قهوة. كبيرة. بسرعة.',
            isOptimal: false,
            score: 2,
            feedbackAr: 'صيغة أمر حادة جداً وغير مهذبة في الثقافة الإنجليزية. استخدم Can I have بدلاً من Give me.',
          },
          {
            textEn: 'I am wanting one coffee, if you are okay.',
            textAr: 'أنا أريد قهوة واحدة، إذا كان ذلك مناسباً لك.',
            isOptimal: false,
            score: 4,
            feedbackAr: 'فعل want من أفعال الحالة (Stative Verbs) ولا يستخدم في المستمر. الصواب: I would like a coffee, please.',
          },
        ],
      },
      {
        id: 'turn-2',
        speaker: 'Mona Adel',
        speakerRole: 'Barista',
        speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        textEn: 'Great choice! For here or to go?',
        textAr: 'اختيار رائع! هتشربها هنا في الكافيه ولا تيك أواي؟',
        grammarTipAr: 'سؤال For here or to go? هو الأشهر في كل كافيهات العالم. الإجابة بكلمة واحدة كافية: To go, please.',
        expectedKeywordsForFreeText: ['here', 'go', 'takeaway', 'stay'],
        options: [
          {
            textEn: 'To go, please. I am running a little late for work.',
            textAr: 'تيك أواي من فضلك. أنا متأخر شوية عن الشغل.',
            isOptimal: true,
            score: 10,
            feedbackAr: 'إجابة طبيعية جداً، والتعبير running late هو الأدق للتأخير البسيط.',
          },
          {
            textEn: 'I will drink it outside the shop in my car.',
            textAr: 'سأشربها خارج المحل في سيارتي.',
            isOptimal: false,
            score: 5,
            feedbackAr: 'مفهومة لكن مطولة وغير طبيعية. أهل اللغة يقولون ببساطة: To go, please.',
          },
        ],
      },
      {
        id: 'turn-3',
        speaker: 'Mona Adel',
        speakerRole: 'Barista',
        speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        textEn: 'Sure! That will be 4.50. Anything else with that? A muffin or a cookie maybe?',
        textAr: 'حاضر! الحساب 4.50. أي حاجة تانية معاها؟ مافين أو كوكيز مثلاً؟',
        grammarTipAr: 'للرفض المهذب استخدم "No, thanks. That is all." وللموافقة "Yes, please. I will also take..."',
        expectedKeywordsForFreeText: ['thanks', 'all', 'also', 'cookie'],
        options: [
          {
            textEn: 'No, thanks. That is all for today. Oh, and could I get the wifi password, please?',
            textAr: 'لا شكراً. ده كل حاجة النهاردة. آه، وممكن كلمة سر الواي فاي من فضلك؟',
            isOptimal: true,
            score: 10,
            feedbackAr: 'رد متكامل: رفض مهذب ثم طلب إضافي بصيغة Could I get الاحترافية.',
          },
          {
            textEn: 'No. I do not want more things from you now.',
            textAr: 'لا. لا أريد أشياء إضافية منك الآن.',
            isOptimal: false,
            score: 3,
            feedbackAr: 'الرد جاف ومباشر بشكل مزعج. كلمة No لوحدها تعتبر غير مهذبة؛ أضف thanks دائماً.',
          },
        ],
      },
      {
        id: 'turn-4',
        speaker: 'Mona Adel',
        speakerRole: 'Barista',
        speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        textEn: 'Of course! The password is on your receipt. Your latte will be ready in two minutes. Have a great day!',
        textAr: 'طبعاً! كلمة السر على الإيصال. اللاتيه بتاعك هيكون جاهز خلال دقيقتين. أتمنى لك يوماً سعيداً!',
        grammarTipAr: 'الرد على Have a great day يكون بـ "Thanks, you too!" وهي أشهر عبارة ختامية في المواقف اليومية.',
        expectedKeywordsForFreeText: ['thanks', 'too', 'day', 'thank'],
        options: [
          {
            textEn: 'Thanks so much, you too! Have a wonderful shift.',
            textAr: 'شكراً جزيلاً، وأنتي كمان! أتمنى لك وردية عمل سعيدة.',
            isOptimal: true,
            score: 10,
            feedbackAr: 'ختام دافئ واحترافي يترك انطباعاً رائعاً، وعبارة you too هي الرد الذهبي السريع.',
          },
          {
            textEn: 'Okay. Bye bye now.',
            textAr: 'حسناً. مع السلامة الآن.',
            isOptimal: false,
            score: 5,
            feedbackAr: 'مقبولة لكنها تفتقد اللطف. تذكر الرد على التمني الطيب بتمني مماثل: You too!',
          },
        ],
      },
    ],
  },
  {
    id: 'sim-hotel-checkin',
    title: 'Hotel Check-in & Room Requests',
    titleAr: 'الحجز والاستقبال في الفندق',
    category: 'hospitality',
    categoryAr: 'الفنادق والضيافة',
    level: 'A2',
    locationName: 'Nile View Grand Hotel',
    locationIcon: 'Hotel',
    backdropImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    descriptionAr: 'موقف أساسي لأي مسافر: استلم غرفتك في الفندق، اسأل عن مواعيد الإفطار والواي فاي، واطلب أي احتياجات إضافية بأدب واحترافية.',
    keyVocabulary: [
      { en: 'Reservation under the name...', ar: 'حجز باسم...', phonetic: '/ˌrezərˈveɪʃən ˈʌndər ðə neɪm/' },
      { en: 'Check-in / Check-out', ar: 'تسجيل الوصول / المغادرة', phonetic: '/tʃek ɪn - tʃek aʊt/' },
      { en: 'Complimentary breakfast', ar: 'إفطار مجاني', phonetic: '/ˌkɑːmplɪˈmentri ˈbrekfəst/' },
      { en: 'Room service', ar: 'خدمة الغرف', phonetic: '/ruːm ˈsɜːrvɪs/' },
      { en: 'Late check-out', ar: 'مغادرة متأخرة', phonetic: '/leɪt ˈtʃek aʊt/' },
    ],
    rewardXp: 120,
    turns: [
      {
        id: 'hotel-turn-1',
        speaker: 'Karim Samy',
        speakerRole: 'Front Desk Receptionist',
        speakerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        textEn: 'Good evening, welcome to Nile View Grand Hotel. How may I help you?',
        textAr: 'مساء الخير، مرحباً بك في فندق إطلالة النيل الكبير. كيف يمكنني مساعدتك؟',
        grammarTipAr: 'للتعريف بحجزك استخدم: "I have a reservation under the name..." وهي الصيغة المعتمدة في كل فنادق العالم.',
        expectedKeywordsForFreeText: ['reservation', 'booking', 'name', 'check'],
        options: [
          {
            textEn: 'Good evening. I have a reservation under the name Alhinawi for three nights.',
            textAr: 'مساء الخير. عندي حجز باسم الحيناوي لمدة ٣ ليالي.',
            isOptimal: true,
            score: 10,
            feedbackAr: 'افتتاحية مثالية: تحية مهذبة ثم تفاصيل الحجز بالاسم والمدة مباشرة.',
          },
          {
            textEn: 'I booked room here. Give me key fast, I am tired.',
            textAr: 'حجزت أوضة هنا. هات المفتاح بسرعة، أنا تعبان.',
            isOptimal: false,
            score: 3,
            feedbackAr: 'الطلب جاف ويفتقد الأدب الأساسي. ابدأ بتحية ثم اذكر حجزك بهدوء: I have a reservation.',
          },
          {
            textEn: 'Is this hotel? I want sleeping place for night time.',
            textAr: 'هل هذا فندق؟ أريد مكاناً للنوم في الليل.',
            isOptimal: false,
            score: 4,
            feedbackAr: 'صياغة غير طبيعية وغير مباشرة. قل بوضوح: I have a reservation / I would like to check in.',
          },
        ],
      },
      {
        id: 'hotel-turn-2',
        speaker: 'Karim Samy',
        speakerRole: 'Front Desk Receptionist',
        speakerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        textEn: 'Certainly, Mr. Alhinawi. I found your booking. Would you prefer a room with a Nile view or a city view?',
        textAr: 'بالتأكيد يا مستر الحيناوي. وجدت حجزك. هل تفضل غرفة بإطلالة على النيل أم على المدينة؟',
        grammarTipAr: 'للتعبير عن التفضيل استخدم: "I would prefer..." أو "I would like..." وهي أرقى من I want.',
        expectedKeywordsForFreeText: ['prefer', 'view', 'Nile', 'like'],
        options: [
          {
            textEn: 'I would prefer a Nile view, please. And if possible, a quiet room on a high floor.',
            textAr: 'أفضل إطلالة على النيل من فضلك. وإذا أمكن، غرفة هادئة في دور عالي.',
            isOptimal: true,
            score: 10,
            feedbackAr: 'رد راقٍ جداً: I would prefer للتفضيل + if possible لطلب إضافي مهذب.',
          },
          {
            textEn: 'Nile. And no noise. I hate noise very much.',
            textAr: 'النيل. وبدون صوت. أنا أكره الصوت جداً.',
            isOptimal: false,
            score: 4,
            feedbackAr: 'مفهومة لكن حادة ومباشرة أكثر من اللازم. استخدم I would prefer a quiet room بدلاً من no noise.',
          },
        ],
      },
      {
        id: 'hotel-turn-3',
        speaker: 'Karim Samy',
        speakerRole: 'Front Desk Receptionist',
        speakerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        textEn: 'Perfect. Your room is 1205 on the twelfth floor. Breakfast is complimentary from 6:30 to 10:30 in the main restaurant. Is there anything else you need?',
        textAr: 'ممتاز. غرفتك رقم 1205 في الدور الثاني عشر. الإفطار مجاني من 6:30 إلى 10:30 في المطعم الرئيسي. هل تحتاج أي شيء آخر؟',
        grammarTipAr: 'للسؤال عن خدمات الفندق استخدم Could you tell me... أو Could I get... وهي صيغ الاستفسار الرسمية.',
        expectedKeywordsForFreeText: ['wifi', 'password', 'check-out', 'could'],
        options: [
          {
            textEn: 'Yes, please. Could you tell me the wifi password? And could I get a late check-out on Friday?',
            textAr: 'أيوه من فضلك. ممكن تقولي كلمة سر الواي فاي؟ وممكن مغادرة متأخرة يوم الجمعة؟',
            isOptimal: true,
            score: 10,
            feedbackAr: 'استفسار احترافي متكامل بصيغتي Could you tell me و Could I get.',
          },
          {
            textEn: 'No. Everything is finished. Goodbye.',
            textAr: 'لا. كل شيء انتهى. وداعاً.',
            isOptimal: false,
            score: 5,
            feedbackAr: 'مقبولة لكن جافة. الألطف: No, that is all, thank you very much.',
          },
        ],
      },
    ],
  },
];
