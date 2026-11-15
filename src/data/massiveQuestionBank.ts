import { CEFRLevel } from '../types';

export type QuestionSkill = 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'usage';
export type QuestionType = 'multiple-choice' | 'fill-blank' | 'error-correction' | 'word-order' | 'matching';

export interface AssessmentQuestion {
  id: string;
  skill: QuestionSkill;
  type: QuestionType;
  level: CEFRLevel;
  prompt: string;
  promptAr?: string;
  passage?: string; // For reading or listening transcripts
  audioText?: string; // Text to be spoken for listening questions
  options: string[];
  answerIndex: number;
  explanationAr: string;
  wrongOptionHints?: string[];
  topic: string;
}

export const MASSIVE_QUESTION_BANK: AssessmentQuestion[] = [
  // ==========================================
  // LEVEL A1 & A2 (BEGINNER / ELEMENTARY)
  // ==========================================
  {
    id: 'a1-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'She ______ in a major international hospital in Cairo.',
    promptAr: 'اختر تصريف الفعل المناسب في المضارع البسيط مع الفاعل المفرد الغائب:',
    options: ['works', 'work', 'working', 'is work'],
    answerIndex: 0,
    explanationAr: 'الفاعل She مفرد غائب، والحدث يعبر عن حقيقة ووظيفة دائمة، لذلك نضيف s للفعل: works.',
    topic: 'Present Simple',
  },
  {
    id: 'a1-gram-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'Where ______ you live before moving to Alexandria?',
    promptAr: 'اختر الفعل المساعد المناسب لتكوين السؤال في الماضي البسيط:',
    options: ['did', 'do', 'were', 'have'],
    answerIndex: 0,
    explanationAr: 'في السؤال عن الماضي البسيط مع فعل أساسي (live)، نستخدم الأداة did مع المصدر.',
    topic: 'Past Simple Questions',
  },
  {
    id: 'a1-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'A person who flies an airplane professionally is called a ______.',
    promptAr: 'اختر المسمى الوظيفي الصحيح للشخص الذي يقود الطائرات:',
    options: ['pilot', 'driver', 'sailor', 'engineer'],
    answerIndex: 0,
    explanationAr: 'الطيار بالإنجليزية هو Pilot، بينما Driver يقود السيارات و Sailor يبحر بالسفن.',
    topic: 'Professions',
  },
  {
    id: 'a2-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'Look at those dark storm clouds! It ______ rain very heavily.',
    promptAr: 'اختر الصيغة المستقبلية الصحيحة عند وجود دليل مرئي حالي:',
    options: ['is going to', 'will', 'is', 'rains'],
    answerIndex: 0,
    explanationAr: 'عند وجود دليل مادي مرئي أمامنا (dark clouds) نستخدم صيغة is going to للتنبؤ المؤكد.',
    topic: 'Future: Will vs Going to',
  },
  {
    id: 'a2-gram-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'While my brother was cooking dinner, I ______ my homework.',
    promptAr: 'اختر الزمن المناسب لحدثين كانا يقعان بالتوازي في الماضي:',
    options: ['was doing', 'did', 'do', 'have done'],
    answerIndex: 0,
    explanationAr: 'حدثان مستمران في نفس الوقت في الماضي بالتوازي نستخدم معهما الماضي المستمر was doing.',
    topic: 'Past Continuous',
  },
  {
    id: 'a2-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'To "postpone" a business meeting means to ______ it.',
    promptAr: 'ما المعنى الدقيق لكلمة postpone في بيئة العمل؟',
    options: ['delay', 'cancel', 'start', 'repeat'],
    answerIndex: 0,
    explanationAr: 'كلمة Postpone تعني التأجيل إلى وقت لاحق (delay / put off).',
    topic: 'Business Synonyms',
  },
  {
    id: 'a2-listen-1',
    skill: 'listening',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'Listen to the airport announcement: What is the passenger advised to do?',
    audioText: 'Attention passenger Kareem Nour, please proceed immediately to gate 14 for final boarding call.',
    passage: 'Attention passenger Kareem Nour, please proceed immediately to gate 14 for final boarding call.',
    options: ['Go directly to gate 14', 'Collect lost luggage', 'Wait at passport control', 'Change flight ticket'],
    answerIndex: 0,
    explanationAr: 'الإعلان يطلب التوجه فوراً لبوابة 14: "proceed immediately to gate 14".',
    topic: 'Airport Announcements',
  },

  // ==========================================
  // LEVEL B1 (INTERMEDIATE)
  // ==========================================
  {
    id: 'b1-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'Omar is exhausted because he ______ the tech report all morning.',
    promptAr: 'اختر الزمن الدال على المجهود واستمرارية الفعل في الماضي والممتد للحاضر:',
    options: ['has been writing', 'wrote', 'writes', 'is written'],
    answerIndex: 0,
    explanationAr: 'التركيز على طول المدة (all morning) والأثر الواضح في الحاضر (exhausted) يتطلب المضارع التام المستمر has been writing.',
    topic: 'Present Perfect Continuous',
  },
  {
    id: 'b1-gram-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'If you ______ harder last semester, you would have passed the scholarship exam.',
    promptAr: 'اختر الصيغة الصحيحة لفعل الشرط في الحالة الشرطية الثالثة (الندم على الماضي):',
    options: ['had studied', 'studied', 'would study', 'have studied'],
    answerIndex: 0,
    explanationAr: 'جواب الشرط يحتوي على would have passed (حالة ثالثة)، إذن فعل الشرط ماضٍ تام had studied.',
    topic: 'Third Conditional',
  },
  {
    id: 'b1-gram-3',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'By the time the delivery courier arrives, we ______ the conference room.',
    promptAr: 'اختر زمن المستقبل التام المناسب مع رابط الوقت By the time:',
    options: ['will have arranged', 'will arrange', 'arranged', 'have arranged'],
    answerIndex: 0,
    explanationAr: 'الحدث سيكتمل قبل وصول المندوب في المستقبل، لذلك نستخدم will have arranged.',
    topic: 'Future Perfect',
  },
  {
    id: 'b1-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'The new mobile application received a ______ response from early testers, exceeding expectations.',
    promptAr: 'اختر الكلمة المناسبة لوصف الردود شديدة الإيجابية والحماسية:',
    options: ['phenomenal', 'reluctant', 'mediocre', 'tedious'],
    answerIndex: 0,
    explanationAr: 'كلمة Phenomenal تعني استثنائي وباهر، وهي المناسبة لعبارة exceeding expectations.',
    topic: 'Advanced Adjectives',
  },
  {
    id: 'b1-read-1',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'B1',
    passage: 'Remote work has expanded significantly over the past five years. While employees appreciate the elimination of stressful daily commutes and greater flexibility, managers emphasize the importance of asynchronous documentation and structured weekly check-ins to maintain team alignment.',
    prompt: 'According to the passage, what do managers consider crucial for remote team success?',
    promptAr: 'بناءً على النص، ما الذي يعتبره المديرون ضرورياً لنجاح فرق العمل عن بعد؟',
    options: ['Structured documentation and check-ins', 'Longer daily commutes', 'Eliminating all meetings', 'Returning to the office immediately'],
    answerIndex: 0,
    explanationAr: 'النص يذكر نصاً: "managers emphasize the importance of asynchronous documentation and structured weekly check-ins".',
    topic: 'Reading Comprehension',
  },

  // ==========================================
  // LEVEL B2 (UPPER INTERMEDIATE)
  // ==========================================
  {
    id: 'b2-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'By next November, Dr. Farida ______ as head of clinical trials for a full decade.',
    promptAr: 'اختر الزمن المعبر عن استكمال فترة زمنية كاملة بحلول موعد مستقبلي محدد:',
    options: ['will have been serving', 'will serve', 'is serving', 'has served'],
    answerIndex: 0,
    explanationAr: 'التعبير عن استمرار النشاط حتى نقطة مستقبلية وإتمام عقد كامل (a full decade) يتطلب Future Perfect Continuous: will have been serving.',
    topic: 'Future Perfect Continuous',
  },
  {
    id: 'b2-gram-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'The financial audit ______ by a team of independent external consultants last week.',
    promptAr: 'اختر صيغة المبني للمجهول الصحيحة في الماضي البسيط:',
    options: ['was conducted', 'has conducted', 'is conducted', 'conducted'],
    answerIndex: 0,
    explanationAr: 'المراجعة المالية (The audit) مفعول به غير عاقل، وتمت الأسبوع الماضي (last week)، فتصاغ was conducted.',
    topic: 'Passive Voice',
  },
  {
    id: 'b2-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'To "streamline" a workflow process means to ______.',
    promptAr: 'ما المعنى الدقيق لمصطلح Streamline في إدارة الأعمال والبرمجيات؟',
    options: ['make it more efficient and simpler', 'delay it unnecessarily', 'hire more employees', 'cancel the project'],
    answerIndex: 0,
    explanationAr: 'كلمة Streamline تعني تبسيط الإجراءات وجعلها أكثر سرعة وكفاءة وإزالة التعقيدات.',
    topic: 'Professional Collocations',
  },
  {
    id: 'b2-usage-1',
    skill: 'usage',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'In a formal email negotiation, which phrase is most professional to express polite disagreement?',
    promptAr: 'أي من العبارات الآتية هي الأكثر دبلوماسية واحترافية للتعبير عن الاعتراض في إيميل عمل؟',
    options: [
      'While I see your point, our data suggests an alternative approach.',
      'You are completely wrong about this estimate.',
      'I do not care about your perspective.',
      'This proposal makes no sense at all.'
    ],
    answerIndex: 0,
    explanationAr: 'الأسلوب الدبلوماسي يبدأ بالاعتراف بوجهة نظر الطرف الآخر أولاً: "While I see your point, our data suggests...".',
    topic: 'Business Pragmatics',
  },

  // ==========================================
  // LEVEL C1 & C2 (ADVANCED & MASTERY)
  // ==========================================
  {
    id: 'c1-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Hardly ______ the stage when the entire auditorium erupted in thunderous applause.',
    promptAr: 'اختر الصيغة المعكوسة الصحيحة (Inversion) بعد ظرف النفي Hardly:',
    options: ['had the keynote speaker entered', 'the keynote speaker had entered', 'did the speaker entered', 'was the speaker enter'],
    answerIndex: 0,
    explanationAr: 'بعد ظروف النفي التي تبدأ الجملة مثل Hardly / Scarcely / No sooner نستخدم التقديم والتأخير (Inversion): had + subject + V3.',
    topic: 'Grammatical Inversion',
  },
  {
    id: 'c1-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'The keynote speaker\'s insights were remarkably ______, dissecting macroeconomic trends with razor-sharp precision.',
    promptAr: 'اختر الصفة البليغة المناسبة للتعبير عن العمق الفكري والفطنة الثاقبة:',
    options: ['incisive', 'ambiguous', 'superficial', 'redundant'],
    answerIndex: 0,
    explanationAr: 'كلمة Incisive تعني نافذ وثاقب وبصير (clear, penetrating, acute)، بينما الباقي يعني سطحي أو مبهم.',
    topic: 'C1 Academic Vocabulary',
  },
  {
    id: 'c1-read-1',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'C1',
    passage: 'Cognitive linguists postulate that language acquisition is not merely syntactic computation, but deeply embedded in sensorimotor metaphors. Concepts as abstract as temporal deadlines ("By Friday", "Looking ahead") stem organically from spatial orientation.',
    prompt: 'What core thesis do cognitive linguists advance in the passage?',
    promptAr: 'ما هي الأطروحة الجوهرية التي يقدمها علماء اللغة المعرفيون في النص؟',
    options: [
      'Abstract temporal concepts derive organically from physical spatial metaphors',
      'Grammar consists strictly of mathematical algebraic formulas',
      'Languages have no underlying conceptual metaphors',
      'Time expressions cannot be conceptualized by humans'
    ],
    answerIndex: 0,
    explanationAr: 'النص يوضح أن المفاهيم الزمنية المجردة تنبع عضوياً من التوجه المكاني الحسي: "concepts stem organically from spatial orientation".',
    topic: 'C1 Reading Comprehension',
  },

  // ==========================================
  // EXPANSION PACK 2 (20 additional questions)
  // ==========================================
  {
    id: 'a1-gram-3',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'There ______ three students in the classroom right now.',
    promptAr: 'اختر الصيغة الصحيحة لـ There is / There are:',
    options: ['are', 'is', 'be', 'am'],
    answerIndex: 0,
    explanationAr: 'مع الجمع (three students) نستخدم There are.',
    topic: 'There is/There are',
  },
  {
    id: 'a1-gram-4',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'Ahmed ______ TV every evening after dinner.',
    promptAr: 'اختر تصريف الفعل الصحيح في المضارع البسيط:',
    options: ['watches', 'watch', 'watching', 'is watch'],
    answerIndex: 0,
    explanationAr: 'مع الفاعل المفرد الغائب (Ahmed) نضيف es للفعل المنتهي بـ ch: watches.',
    topic: 'Present Simple',
  },
  {
    id: 'a1-voc-2',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'Choose the correct word: A person who teaches students is a ______.',
    promptAr: 'اختر الكلمة المناسبة للوصف:',
    options: ['teacher', 'doctor', 'engineer', 'farmer'],
    answerIndex: 0,
    explanationAr: 'الشخص الذي يدرّس الطلاب هو teacher (معلم).',
    topic: 'Jobs & Occupations',
  },
  {
    id: 'a1-voc-3',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'The opposite of \'hot\' is ______.',
    promptAr: 'اختر عكس كلمة hot:',
    options: ['cold', 'warm', 'big', 'fast'],
    answerIndex: 0,
    explanationAr: 'عكس hot (حار) هو cold (بارد).',
    topic: 'Opposites',
  },
  {
    id: 'a2-gram-3',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'I ______ my grandparents last Friday evening.',
    promptAr: 'اختر التصريف الصحيح في الماضي البسيط:',
    options: ['visited', 'visit', 'visits', 'visiting'],
    answerIndex: 0,
    explanationAr: 'وجود last Friday يدل على الماضي البسيط: visited.',
    topic: 'Past Simple',
  },
  {
    id: 'a2-gram-4',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'We ______ going to the beach next weekend.',
    promptAr: 'اختر الصيغة الصحيحة للتعبير عن خطة مستقبلية مؤكدة:',
    options: ['are', 'is', 'am', 'be'],
    answerIndex: 0,
    explanationAr: 'مع الجمع We نستخدم are في صيغة be going to للخطط المستقبلية.',
    topic: 'Future Plans (be going to)',
  },
  {
    id: 'a2-voc-2',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'Choose the correct word: You wear this on your feet when you run.',
    promptAr: 'اختر الكلمة المناسبة:',
    options: ['sneakers', 'gloves', 'scarf', 'helmet'],
    answerIndex: 0,
    explanationAr: 'ما تلبسه في قدميك أثناء الجري هو sneakers (حذاء رياضي).',
    topic: 'Clothes & Accessories',
  },
  {
    id: 'a2-listen-2',
    skill: 'listening',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'Listen and choose: What is the man\'s job?',
    promptAr: 'استمع للجملة واختر وظيفة المتحدث:',
    audioText: 'I drive a taxi in downtown Cairo, and I meet many tourists every day.',
    options: ['A taxi driver', 'A chef', 'A pilot', 'A teacher'],
    answerIndex: 0,
    explanationAr: 'المتحدث قال إنه يقود سيارة أجرة في وسط القاهرة، إذن وظيفته taxi driver.',
    topic: 'Listening: Jobs',
  },
  {
    id: 'b1-gram-4',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'I have lived in Mansoura ______ 2015.',
    promptAr: 'اختر أداة الربط المناسبة مع المضارع التام:',
    options: ['since', 'for', 'ago', 'from'],
    answerIndex: 0,
    explanationAr: 'مع سنة محددة (2015) نستخدم since، أما for فتستخدم مع مدة زمنية.',
    topic: 'Present Perfect: since/for',
  },
  {
    id: 'b1-gram-5',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'If it rains tomorrow, we ______ at home.',
    promptAr: 'اختر التصريف الصحيح في الحالة الشرطية الأولى:',
    options: ['will stay', 'would stay', 'stay', 'stayed'],
    answerIndex: 0,
    explanationAr: 'الشرطية الأولى: If + مضارع بسيط، وجملة الجواب will + مصدر: will stay.',
    topic: 'First Conditional',
  },
  {
    id: 'b1-gram-6',
    skill: 'grammar',
    type: 'error-correction',
    level: 'B1',
    prompt: 'Find the error: \'She don\'t like spicy food at all.\'',
    promptAr: 'حدد الخطأ النحوي في الجملة:',
    options: ['don\'t should be doesn\'t', 'like should be likes', 'spicy should be spice', 'at all should be in all'],
    answerIndex: 0,
    explanationAr: 'مع الفاعل المفرد الغائب (She) نستخدم doesn\'t وليس don\'t.',
    topic: 'Subject-Verb Agreement',
  },
  {
    id: 'b1-voc-2',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'Choose the word closest in meaning to \'enormous\':',
    promptAr: 'اختر الكلمة الأقرب في المعنى لكلمة enormous:',
    options: ['huge', 'tiny', 'narrow', 'shallow'],
    answerIndex: 0,
    explanationAr: 'enormous تعني ضخم/هائل، والأقرب لها huge.',
    topic: 'Synonyms',
  },
  {
    id: 'b1-read-2',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'Read the passage: Why did Laila move to Cairo?',
    promptAr: 'اقرأ القطعة وأجب: لماذا انتقلت ليلى إلى القاهرة؟',
    passage: 'Laila moved to Cairo last month because she got a new job at a tech company. Although she misses her family in Alexandria, she enjoys the energy of the big city and has already made new friends at work.',
    options: ['To start a new job', 'To visit her family', 'To study medicine', 'To open a restaurant'],
    answerIndex: 0,
    explanationAr: 'القطعة تقول إنها انتقلت لأنها حصلت على وظيفة جديدة في شركة تكنولوجيا.',
    topic: 'Reading: Main Idea',
  },
  {
    id: 'b1-usage-1',
    skill: 'usage',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'Which sentence sounds most natural in everyday English?',
    promptAr: 'اختر الجملة الأكثر طبيعية في الإنجليزية اليومية:',
    options: ['I\'m really into cooking these days.', 'I have a great passion inside cooking currently.', 'Cooking is entered in my heart nowadays.', 'Me and cooking are friends now.'],
    answerIndex: 0,
    explanationAr: 'I\'m really into... تعبير شائع جداً للدلالة على الاهتمام الشديد بشيء.',
    topic: 'Natural Expressions',
  },
  {
    id: 'b2-gram-3',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'By the time the manager arrived, the team ______ the presentation.',
    promptAr: 'اختر الزمن المناسب للتعبير عن حدث تم قبل حدث ماضٍ آخر:',
    options: ['had finished', 'has finished', 'finished', 'will finish'],
    answerIndex: 0,
    explanationAr: 'حدثان في الماضي: الحدث الأسبق (finished) نستخدم معه الماضي التام had finished.',
    topic: 'Past Perfect',
  },
  {
    id: 'b2-voc-2',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'The new policy will ______ significant changes in the education system.',
    promptAr: 'اختر الفعل المناسب لإكمال التعبير الاصطلاحي:',
    options: ['bring about', 'bring down', 'bring up', 'bring back'],
    answerIndex: 0,
    explanationAr: 'bring about تعني \'يُحدِث/يتسبب في\' وهي المصطلح المناسب مع changes.',
    topic: 'Phrasal Verbs',
  },
  {
    id: 'b2-usage-2',
    skill: 'usage',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'Choose the most formal option for a business email opening:',
    promptAr: 'اختر الافتتاحية الأكثر رسمية لبريد عمل:',
    options: ['Dear Mr. Hassan, I am writing to inquire about...', 'Hey Hassan! Wanna ask about...', 'Hi there! Just checking...', 'Yo! Quick question...'],
    answerIndex: 0,
    explanationAr: 'Dear + اللقب + الاسم مع I am writing to inquire هي الصيغة الرسمية المعتمدة في مراسلات العمل.',
    topic: 'Formal Writing',
  },
  {
    id: 'c1-gram-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Scarcely ______ the meeting started when the fire alarm rang.',
    promptAr: 'اختر الصيغة الصحيحة بعد Scarcely في بداية الجملة (القلب اللغوي):',
    options: ['had', 'did', 'was', 'has'],
    answerIndex: 0,
    explanationAr: 'بعد Scarcely في بداية الجملة نستخدم القلب مع الماضي التام: Scarcely had + الفاعل + V3.',
    topic: 'Inversion',
  },
  {
    id: 'c1-voc-2',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Choose the word that best completes the sentence: His argument was so ______ that no one could challenge it.',
    promptAr: 'اختر الكلمة الأنسب لإكمال الجملة:',
    options: ['compelling', 'fragile', 'vague', 'tedious'],
    answerIndex: 0,
    explanationAr: 'compelling تعني \'مُقنع/قاهر\' وهي الوحيدة التي تناسب سياق عدم القدرة على التحدي.',
    topic: 'Academic Vocabulary',
  },
  {
    id: 'c1-read-2',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Read the passage: What is the author\'s attitude toward remote work?',
    promptAr: 'اقرأ القطعة وحدد موقف الكاتب من العمل عن بعد:',
    passage: 'Remote work has undeniably transformed modern employment, offering flexibility that previous generations could only dream of. Yet this freedom comes at a price: the quiet erosion of casual collaboration and the creeping sense of isolation that many remote workers report. The solution, perhaps, lies not in abandoning the model but in refining it.',
    options: ['Cautiously optimistic', 'Completely opposed', 'Entirely indifferent', 'Strongly sarcastic'],
    answerIndex: 0,
    explanationAr: 'الكاتب يذكر المزايا بحماس لكنه يحذر من العزلة، وهذا موقف متفائل بحذر (cautiously optimistic).',
    topic: 'Reading: Tone & Attitude',
  },

  // ==========================================
  // EXPANSION PACK 3 (20 additional questions)
  // ==========================================
  {
    id: 'a1-gram-5',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'This ______ my English teacher, Mr. Adel.',
    promptAr: 'اختر فعل الكينونة المناسب:',
    options: ['is', 'are', 'am', 'be'],
    answerIndex: 0,
    explanationAr: 'مع This المفردة نستخدم is للتعريف بشخص.',
    topic: 'Verb To Be',
  },
  {
    id: 'a1-voc-4',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'A1',
    prompt: 'Choose the correct word: The meal you eat in the morning is ______.',
    promptAr: 'اختر وجبة الصباح:',
    options: ['breakfast', 'dinner', 'lunch', 'supper'],
    answerIndex: 0,
    explanationAr: 'وجبة الصباح هي breakfast (الفطار).',
    topic: 'Food & Meals',
  },
  {
    id: 'a2-gram-5',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'She is ______ than her younger sister.',
    promptAr: 'اختر صيغة المقارنة الصحيحة:',
    options: ['taller', 'tallest', 'more tall', 'most tall'],
    answerIndex: 0,
    explanationAr: 'المقارنة بين شخصين نستخدم فيها الصفة القصيرة + er مع than: taller.',
    topic: 'Comparatives',
  },
  {
    id: 'a2-voc-3',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'Choose the correct word: You buy medicine from a ______.',
    promptAr: 'اختر المكان المناسب لشراء الدواء:',
    options: ['pharmacy', 'bakery', 'library', 'station'],
    answerIndex: 0,
    explanationAr: 'الدواء يُشترى من pharmacy (الصيدلية).',
    topic: 'Places in Town',
  },
  {
    id: 'a2-listen-3',
    skill: 'listening',
    type: 'multiple-choice',
    level: 'A2',
    prompt: 'Listen and choose: Where does the woman want to go?',
    promptAr: 'استمع وحدد المكان الذي تريد المرأة الذهاب إليه:',
    audioText: 'Excuse me, could you tell me how to get to the nearest train station? I have a train to Alexandria in thirty minutes.',
    options: ['The train station', 'The airport', 'The museum', 'The hospital'],
    answerIndex: 0,
    explanationAr: 'المرأة سألت عن أقرب محطة قطار، إذن تريد الذهاب إلى train station.',
    topic: 'Listening: Directions',
  },
  {
    id: 'b1-gram-7',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'I ______ my keys! I cannot find them anywhere.',
    promptAr: 'اختر الزمن المناسب للتعبير عن نتيجة حاضرة لحدث ماضٍ:',
    options: ['have lost', 'lose', 'am losing', 'will lose'],
    answerIndex: 0,
    explanationAr: 'فقدان المفاتيح حدث في الماضي ونتيجته الآن (لا أجدها) = المضارع التام have lost.',
    topic: 'Present Perfect',
  },
  {
    id: 'b1-gram-8',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'You ______ smoke inside the hospital; it is strictly forbidden.',
    promptAr: 'اختر فعل النقص المناسب للمنع القاطع:',
    options: ['mustn\'t', 'don\'t have to', 'couldn\'t', 'might not'],
    answerIndex: 0,
    explanationAr: 'المنع التام بسبب قانون أو قاعدة = mustn\'t. أما don\'t have to فتعني غير ملزم.',
    topic: 'Modals of Prohibition',
  },
  {
    id: 'b1-read-3',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'Read the passage: What is the main advantage of morning exercise, according to the text?',
    promptAr: 'اقرأ القطعة وحدد الميزة الرئيسية للتمرين الصباحي:',
    passage: 'Many fitness experts recommend exercising early in the morning. Studies show that people who work out before breakfast report higher concentration and productivity throughout the day. Morning exercise also regulates sleep cycles, although experts warn it is not a magic solution for everyone.',
    options: ['It improves focus for the rest of the day', 'It helps people sleep immediately', 'It replaces breakfast completely', 'It guarantees weight loss in a week'],
    answerIndex: 0,
    explanationAr: 'القطعة تقول إن التمرين الصباحي يرفع التركيز والإنتاجية لبقية اليوم.',
    topic: 'Reading: Main Idea',
  },
  {
    id: 'b1-voc-3',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'Choose the word closest in meaning to \'reliable\':',
    promptAr: 'اختر الكلمة الأقرب في المعنى لكلمة reliable:',
    options: ['dependable', 'careless', 'temporary', 'ordinary'],
    answerIndex: 0,
    explanationAr: 'reliable تعني جدير بالثقة، والأقرب لها dependable.',
    topic: 'Synonyms',
  },
  {
    id: 'b2-gram-4',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'The report ______ by the assistant before the manager arrived.',
    promptAr: 'اختر الصيغة الصحيحة للمبني للمجهول في الماضي التام:',
    options: ['had been written', 'has been written', 'was writing', 'had wrote'],
    answerIndex: 0,
    explanationAr: 'المبني للمجهول في الماضي التام: had been + V3 (written).',
    topic: 'Passive Voice',
  },
  {
    id: 'b2-gram-5',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'I wish I ______ harder when I was at university.',
    promptAr: 'اختر الزمن المناسب بعد I wish للندم على الماضي:',
    options: ['had studied', 'studied', 'study', 'will study'],
    answerIndex: 0,
    explanationAr: 'الندم على الماضي: I wish + الماضي التام (had studied).',
    topic: 'Wishes & Regrets',
  },
  {
    id: 'b2-voc-3',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'The two companies decided to ______ a partnership to expand into new markets.',
    promptAr: 'اختر الفعل المناسب لإكمال التعبير الاصطلاحي:',
    options: ['forge', 'break', 'shake', 'pull'],
    answerIndex: 0,
    explanationAr: 'forge a partnership تعني \'يُكوّن شراكة قوية\' وهي الاستخدام الاحترافي الدقيق.',
    topic: 'Business Collocations',
  },
  {
    id: 'b2-usage-3',
    skill: 'usage',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'You want to politely disagree in a meeting. Choose the best option:',
    promptAr: 'اختر أسلوب الاعتراض المهذب في اجتماع عمل:',
    options: ['I see your point, but have we considered the budget impact?', 'That is wrong. Next idea, please.', 'No way this works at all.', 'Whatever you say, boss.'],
    answerIndex: 0,
    explanationAr: 'الاعتراض المهذب يبدأ بالاعتراف بوجهة النظر ثم يقدم البديل بصيغة سؤال.',
    topic: 'Meeting English',
  },
  {
    id: 'b2-read-1',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'Read the passage: Why does the author mention the printing press?',
    promptAr: 'اقرأ القطعة وحدد لماذا ذكر الكاتب المطبعة:',
    passage: 'The rise of artificial intelligence in education is often compared to the invention of the printing press. Both technologies democratized access to knowledge, and both faced fierce resistance from traditional institutions before becoming indispensable.',
    options: ['To compare the scale of the AI shift to a historical revolution', 'To explain how books are printed', 'To criticize modern technology', 'To describe medieval education'],
    answerIndex: 0,
    explanationAr: 'الكاتب يقارن حجم تحول الذكاء الاصطناعي بثورة تاريخية كبرى (المطبعة).',
    topic: 'Reading: Inference',
  },
  {
    id: 'c1-gram-3',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Not until the results were announced ______ the true scale of the problem.',
    promptAr: 'اختر الصيغة الصحيحة بعد Not until في بداية الجملة:',
    options: ['did we realize', 'we realized', 'we did realize', 'had we realize'],
    answerIndex: 0,
    explanationAr: 'بعد Not until في البداية نستخدم القلب اللغوي: did + الفاعل + المصدر.',
    topic: 'Inversion',
  },
  {
    id: 'c1-voc-3',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Choose the best word: The committee\'s report was ______; it omitted several critical findings.',
    promptAr: 'اختر الكلمة الأنسب: تقرير اللجنة كان ناقصاً لأنه حذف نتائج جوهرية:',
    options: ['incomplete', 'meticulous', 'exhaustive', 'coherent'],
    answerIndex: 0,
    explanationAr: 'حذف نتائج جوهرية يجعل التقرير incomplete (غير مكتمل).',
    topic: 'Academic Vocabulary',
  },
  {
    id: 'c1-usage-1',
    skill: 'usage',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Choose the most diplomatic way to reject a proposal in writing:',
    promptAr: 'اختر الأسلوب الأكثر دبلوماسية لرفض مقترح كتابياً:',
    options: ['While we appreciate the thorough analysis, we are unable to proceed at this time.', 'Your proposal is rejected. Do not resubmit.', 'We hate this idea completely.', 'Maybe in a hundred years.'],
    answerIndex: 0,
    explanationAr: 'الرفض الرسمي الدبلوماسي يوازن بين التقدير والاعتذار المهني الواضح.',
    topic: 'Diplomatic Writing',
  },
  {
    id: 'c1-read-3',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Read the passage: What is the author\'s main criticism of standardized testing?',
    promptAr: 'اقرأ القطعة وحدد الانتقاد الرئيسي للاختبارات الموحدة:',
    passage: 'Standardized testing, defenders claim, offers objective measurement. Yet beneath this veneer of fairness lies an uncomfortable truth: these exams largely reward the memorization of decontextualized facts while failing to capture creativity, critical thinking, and the subtle intellectual curiosity that genuine education should nurture.',
    options: ['It measures memorization rather than genuine understanding', 'It is too expensive for schools', 'It takes too much classroom time', 'It is unfair to teachers'],
    answerIndex: 0,
    explanationAr: 'الكاتب ينتقد أن الاختبارات تقيس الحفظ لا الفهم الحقيقي.',
    topic: 'Reading: Author\'s Argument',
  },
  {
    id: 'c2-gram-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'C2',
    prompt: '______ the circumstances been different, the merger would have succeeded.',
    promptAr: 'اختر البداية الصحيحة للجملة الشرطية بالقلب اللغوي:',
    options: ['Had', 'Should', 'Were', 'If'],
    answerIndex: 0,
    explanationAr: 'الشرطية الثالثة بالقلب: Had + الفاعل + V3 = If the circumstances had been.',
    topic: 'Inverted Conditionals',
  },
  {
    id: 'c2-voc-1',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'C2',
    prompt: 'Choose the best word: His ______ remarks, though brief, captured the essence of the debate perfectly.',
    promptAr: 'اختر الكلمة الأنسب: ملاحظاته الموجزة البليغة لخصت جوهر النقاش:',
    options: ['succinct', 'verbose', 'obscure', 'redundant'],
    answerIndex: 0,
    explanationAr: 'succinct تعني \'موجز بليغ\' وهي الوحيدة التي تتوافق مع brief و captured the essence.',
    topic: 'Advanced Vocabulary',
  },
  {
    id: 'b1-art-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'Cairo is ______ capital of Egypt and one of the largest cities in Africa.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['the', 'a', 'an', '- (no article)'],
    answerIndex: 0,
    explanationAr: 'العواصم والأسماء المعرفة تأخذ the: the capital of.',
    topic: 'Articles',
  },
  {
    id: 'b1-art-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'She plays ______ piano beautifully and practices every evening.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['the', 'a', 'an', '- (no article)'],
    answerIndex: 0,
    explanationAr: 'الآلات الموسيقية تأخذ the مع play: play the piano.',
    topic: 'Articles',
  },
  {
    id: 'b1-det-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: 'There isn\'t ______ milk left in the fridge; can you buy some?',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['much', 'many', 'few', 'a few'],
    answerIndex: 0,
    explanationAr: 'milk اسم لا يعد، نستخدم much في النفي.',
    topic: 'Determiners',
  },
  {
    id: 'b1-det-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B1',
    prompt: '______ students passed the exam; almost everyone succeeded.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['Most', 'Much', 'A little', 'Any'],
    answerIndex: 0,
    explanationAr: 'students جمع يعد، Most + plural noun هو الصحيح.',
    topic: 'Determiners',
  },
  {
    id: 'b2-rep-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: '\'I am working late tonight,\' he said. → He said ______ working late that night.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['he was', 'I am', 'he is', 'I was'],
    answerIndex: 0,
    explanationAr: 'في الكلام المنقول نرجع زمنًا للخلف: am → was، وtonight → that night.',
    topic: 'Reported Speech',
  },
  {
    id: 'b2-rep-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: '\'Where did you park the car?\' she asked me. → She asked me where ______ the car.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['I had parked', 'did I park', 'I parked', 'had I parked'],
    answerIndex: 0,
    explanationAr: 'السؤال المنقول يفقد صيغة الاستفهام ويتحول لفعل تام: where I had parked.',
    topic: 'Reported Speech',
  },
  {
    id: 'b2-rep-3',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: '\'Don\'t touch the wet paint,\' the teacher told us. → The teacher told us ______ the wet paint.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['not to touch', 'to not touch', 'don\'t touch', 'not touch'],
    answerIndex: 0,
    explanationAr: 'الأمر المنفي المنقول: told + object + not to + infinitive.',
    topic: 'Reported Speech',
  },
  {
    id: 'b2-cond-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'If I ______ taller, I would have joined the basketball team at school.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['were', 'would be', 'had been', 'am'],
    answerIndex: 0,
    explanationAr: 'شرطية مختلطة: ماضٍ بسيط لحالة حالية + would have V3 لنتيجة ماضية.',
    topic: 'Mixed Conditionals',
  },
  {
    id: 'b2-cond-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'B2',
    prompt: 'If you had studied medicine, you ______ a doctor now.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['would be', 'will be', 'would have been', 'are'],
    answerIndex: 0,
    explanationAr: 'الماضي التام في الشرط + would + مصدر لنتيجة حالية.',
    topic: 'Mixed Conditionals',
  },
  {
    id: 'c1-cleft-1',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'C1',
    prompt: '______ I really need now is a long vacation, not more advice.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['What', 'That', 'It', 'Which'],
    answerIndex: 0,
    explanationAr: 'جملة What-cleft للتركيز: What I need is...',
    topic: 'Cleft Sentences',
  },
  {
    id: 'c1-cleft-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'It was in 2019 ______ the company launched its first AI product.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['that', 'when', 'which', 'where'],
    answerIndex: 0,
    explanationAr: 'جملة It-cleft: It was + العنصر المؤكد + that.',
    topic: 'Cleft Sentences',
  },
  {
    id: 'c1-cleft-3',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'All ______ we wanted was a clear answer from the manager.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['that', 'what', 'which', 'it'],
    answerIndex: 0,
    explanationAr: 'All (that) + clause + was/were: that اختيارية بعد All.',
    topic: 'Cleft Sentences',
  },
  {
    id: 'c1-lis-1',
    skill: 'listening',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Listen to the announcement: \'Due to unforeseen circumstances, tonight\'s lecture has been postponed until further notice.\' What happened to the lecture?',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['It was delayed to an unknown date', 'It was cancelled permanently', 'It was moved to a new room', 'It started earlier'],
    answerIndex: 0,
    explanationAr: 'postponed until further notice = مؤجل لأجل غير مسمى.',
    topic: 'Listening: Announcements',
  },
  {
    id: 'c1-lis-2',
    skill: 'listening',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Listen: \'I\'d appreciate it if you could keep the noise down after ten.\' What is the speaker doing?',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['Politely asking for less noise', 'Offering to help with a task', 'Complaining about the weather', 'Inviting someone to a party'],
    answerIndex: 0,
    explanationAr: 'صيغة I\'d appreciate it if you could... طلب مهذب غير مباشر.',
    topic: 'Listening: Polite Requests',
  },
  {
    id: 'c1-read-4',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Read: \'While the policy succeeded in curbing inflation, it inadvertently stifled small business growth.\' What does \'inadvertently\' mean here?',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['Unintentionally', 'Deliberately', 'Gradually', 'Completely'],
    answerIndex: 0,
    explanationAr: 'inadvertently = عن غير قصد، دون قصد.',
    topic: 'Reading: Vocabulary in Context',
  },
  {
    id: 'c1-read-5',
    skill: 'reading',
    type: 'multiple-choice',
    level: 'C1',
    prompt: 'Read: \'The committee\'s decision, though controversial, was ultimately upheld by the board.\' What happened to the decision?',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['The board approved it in the end', 'The board rejected it', 'The committee withdrew it', 'It was postponed'],
    answerIndex: 0,
    explanationAr: 'upheld = أُقرّت وأُيدت رسميًا.',
    topic: 'Reading: Main Idea',
  },
  {
    id: 'c2-gram-2',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'C2',
    prompt: 'Little ______ the committee know that the results had already been leaked.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['did', 'does', 'had', 'was'],
    answerIndex: 0,
    explanationAr: 'بعد Little في بداية الجملة قلب لغوي: Little did they know.',
    topic: 'Negative Inversion',
  },
  {
    id: 'c2-gram-3',
    skill: 'grammar',
    type: 'multiple-choice',
    level: 'C2',
    prompt: 'Scarcely had the meeting begun ______ the fire alarm went off.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['when', 'than', 'then', 'as'],
    answerIndex: 0,
    explanationAr: 'Scarcely... when تركيب ثابت: بالكاد بدأ الاجتماع عندما انطلق الإنذار.',
    topic: 'Negative Inversion',
  },
  {
    id: 'c2-voc-2',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'C2',
    prompt: 'Choose the best word: The negotiations reached an ______, with neither side willing to compromise.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['impasse', 'accord', 'apex', 'incentive'],
    answerIndex: 0,
    explanationAr: 'impasse = طريق مسدود في المفاوضات.',
    topic: 'Advanced Vocabulary',
  },
  {
    id: 'c2-voc-3',
    skill: 'vocabulary',
    type: 'multiple-choice',
    level: 'C2',
    prompt: 'Choose the best word: Her argument was so ______ that even her critics had to agree.',
    promptAr: 'اختر الإجابة الصحيحة:',
    options: ['cogent', 'fallacious', 'tepid', 'obtuse'],
    answerIndex: 0,
    explanationAr: 'cogent = مقنع قوي الحجة.',
    topic: 'Advanced Vocabulary',
  },

];

/**
 * Dynamic Adaptive Session Generator:
 * Generates an individualized placement test session combining questions across skills,
 * randomizing selection to prevent repetition, and calculating personalized CEFR rating.
 */
export function generateAdaptivePlacementSession(previousQuestionIds: string[] = []): AssessmentQuestion[] {
  const skills: QuestionSkill[] = ['grammar', 'vocabulary', 'reading', 'listening', 'usage'];
  const session: AssessmentQuestion[] = [];

  // Filter out recently answered questions if pool allows
  const available = MASSIVE_QUESTION_BANK.filter(q => !previousQuestionIds.includes(q.id));
  const pool = available.length >= 10 ? available : MASSIVE_QUESTION_BANK;

  // 1. Pick balanced distribution across CEFR levels
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

  levels.forEach(lvl => {
    const levelQuestions = pool.filter(q => q.level === lvl);
    // Shuffle and pick 2 per level (Total = 10 dynamic balanced questions per placement session)
    const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
    session.push(...shuffled.slice(0, 2));
  });

  // Final session shuffle
  return session.sort(() => Math.random() - 0.5);
}

export interface AssessmentResultBreakdown {
  score: number;
  total: number;
  overallPercentage: number;
  estimatedLevel: CEFRLevel;
  levelTitleAr: string;
  skillBreakdown: Record<QuestionSkill, { score: number; total: number; percentage: number }>;
  strengths: string[];
  weaknesses: string[];
  recommendedPath: {
    startAcademy: string;
    startRoute: string;
    focusTopics: string[];
  };
  disclaimerAr: string;
}

export function evaluateAssessmentSession(
  questions: AssessmentQuestion[],
  answers: Record<number, number>
): AssessmentResultBreakdown {
  let totalCorrect = 0;
  const skillStats: Record<QuestionSkill, { score: number; total: number }> = {
    grammar: { score: 0, total: 0 },
    vocabulary: { score: 0, total: 0 },
    reading: { score: 0, total: 0 },
    listening: { score: 0, total: 0 },
    usage: { score: 0, total: 0 },
  };

  questions.forEach((q, idx) => {
    const isCorrect = answers[idx] === q.answerIndex;
    if (isCorrect) {
      totalCorrect++;
      skillStats[q.skill].score++;
    }
    skillStats[q.skill].total++;
  });

  const overallPercentage = Math.round((totalCorrect / Math.max(1, questions.length)) * 100);

  let estimatedLevel: CEFRLevel = 'A1';
  let levelTitleAr = 'مبتدئ (Beginner - A1)';

  if (overallPercentage >= 85) {
    estimatedLevel = 'C1';
    levelTitleAr = 'متقدم (Advanced - C1)';
  } else if (overallPercentage >= 70) {
    estimatedLevel = 'B2';
    levelTitleAr = 'فوق المتوسط (Upper Intermediate - B2)';
  } else if (overallPercentage >= 50) {
    estimatedLevel = 'B1';
    levelTitleAr = 'متوسط (Intermediate - B1)';
  } else if (overallPercentage >= 30) {
    estimatedLevel = 'A2';
    levelTitleAr = 'أساسي (Elementary - A2)';
  }

  // Calculate skill percentages
  const skillBreakdown = {} as Record<QuestionSkill, { score: number; total: number; percentage: number }>;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  (Object.keys(skillStats) as QuestionSkill[]).forEach(skill => {
    const stat = skillStats[skill];
    const pct = stat.total > 0 ? Math.round((stat.score / stat.total) * 100) : 100;
    skillBreakdown[skill] = { score: stat.score, total: stat.total, percentage: pct };

    if (pct >= 70) {
      strengths.push(getSkillNameAr(skill));
    } else if (pct < 50) {
      weaknesses.push(getSkillNameAr(skill));
    }
  });

  // Recommended personalized path
  let recommendedPath = {
    startAcademy: 'أكاديمية الجرامر الشاملة',
    startRoute: 'grammar',
    focusTopics: ['المضارع البسيط والروتين', 'الماضي وسرد الأحداث', 'أدوات الربط'],
  };

  if (estimatedLevel === 'B1' || estimatedLevel === 'B2') {
    recommendedPath = {
      startAcademy: 'كورس المستقبل التام والمواقف الحقيقية',
      startRoute: 'courses/grammar/future-perfect',
      focusTopics: ['المستقبل التام Will have + V3', 'إنجليزي الاجتماعات والمطارات', 'أفعال V3 الشاذة'],
    };
  } else if (estimatedLevel === 'C1') {
    recommendedPath = {
      startAcademy: 'المحادثة المتقدمة وإنجليزي الأعمال',
      startRoute: 'speaking',
      focusTopics: ['المفردات الأكاديمية C1', 'المبني للمجهول في التقارير', 'التفاوض الدبلوماسي'],
    };
  }

  return {
    score: totalCorrect,
    total: questions.length,
    overallPercentage,
    estimatedLevel,
    levelTitleAr,
    skillBreakdown,
    strengths: strengths.length > 0 ? strengths : ['الإلمام بالمفاهيم الأولية'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['مواصلة التوسع في المفردات المركبة'],
    recommendedPath,
    disclaimerAr:
      'تنويه أكاديمي هام: هذا الاختبار هو تقييم تشخيصي استرشادي داخلي مبني على معايير الإطار الأوروبي المرجعي المشترك (CEFR) لتحديد نقطة انطلاقك في الأكاديمية، ولا يمثل شهادة توثيق دولية بديلة لاختبارات IELTS أو TOEFL الرسمية.',
  };
}

function getSkillNameAr(skill: QuestionSkill): string {
  switch (skill) {
    case 'grammar':
      return 'القواعد النحوية (Grammar)';
    case 'vocabulary':
      return 'المفردات وحصيلة الكلمات (Vocabulary)';
    case 'reading':
      return 'القراءة واستيعاب النصوص (Reading)';
    case 'listening':
      return 'الاستماع والفهم الصوتي (Listening)';
    case 'usage':
      return 'التعبير والمواقف الوظيفية (Practical Usage)';
  }
}


