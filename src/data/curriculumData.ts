import { CEFRLevel } from '../types';

export interface CEFRLevelInfo {
  level: CEFRLevel;
  title: string;
  titleAr: string;
  descriptionAr: string;
  color: string;
  targetCanDo: string[];
  grammarTopics: string[];
  vocabCount: string;
}

export const CEFR_LEVELS_DATA: Record<CEFRLevel, CEFRLevelInfo> = {
  A1: {
    level: 'A1',
    title: 'Beginner / Breakthrough',
    titleAr: 'المستوى المبتدئ والتأسيسي',
    descriptionAr: 'فهم واستخدام التعبيرات اليومية المألوفة والجمل البسيطة جداً لتلبية احتياجات ملموسة.',
    color: '#c4ff55',
    targetCanDo: [
      'التعريف بنفسك وبالآخرين وطرح أسئلة شخصية بسيطة',
      'التفاعل بطريقة بسيطة إذا تحدث الطرف الآخر ببطء ووضوح',
      'فهم الإشارات واللافتات اليومية البسيطة والأسعار',
    ],
    grammarTopics: [
      'Present Simple (Verb to be & regular verbs)',
      'Subject Pronouns & Possessive Adjectives',
      'Articles (a, an, the)',
      'Basic Plural Nouns & Demonstratives (this/that)',
      'Basic Prepositions of Place and Time (in, on, at)',
    ],
    vocabCount: '٥٠٠ - ٨٠٠ كلمة شائعة',
  },
  A2: {
    level: 'A2',
    title: 'Elementary / Waystage',
    titleAr: 'المستوى فوق المبتدئ',
    descriptionAr: 'فهم الجمل والعبارات الشائعة المتعلقة بمجالات ذات صلة مباشرة (مثل التسوق، الأسرة، والعمل).',
    color: '#41e7ff',
    targetCanDo: [
      'التواصل في مهام بسيطة وروتينية تتطلب تبادلاً مباشراً للمعلومات',
      'وصف جوانب من خلفيتك، بيئتك المباشرة، واحتياجاتك العاجلة',
      'إجراء محادثات قصيرة في المطاعم والمحلات ومحطات القطار',
    ],
    grammarTopics: [
      'Past Simple (Regular & Irregular verbs)',
      'Present Continuous for present & future arrangements',
      'Countable and Uncountable Nouns (some, any, much, many)',
      'Comparatives and Superlatives (faster, the biggest)',
      'Modals of ability and obligation (can, could, must, should)',
    ],
    vocabCount: '١,٠٠٠ - ١,٥٠٠ كلمة أساسية',
  },
  B1: {
    level: 'B1',
    title: 'Intermediate / Threshold',
    titleAr: 'المستوى المتوسط المستقل',
    descriptionAr: 'فهم النقاط الرئيسية للمواضيع المألوفة التي تواجهها بانتظام في العمل أو المدرسة أو أوقات الفراغ.',
    color: '#ffd166',
    targetCanDo: [
      'التعامل مع معظم المواقف التي قد تطرأ أثناء السفر في منطقة ناطقة بالإنجليزية',
      'إنتاج نصوص متصلة وبسيطة حول مواضيع مألوفة أو ذات اهتمام شخصي',
      'وصف التجارب والأحداث والأحلام والآمال مع إبداء أسباب وشروحات موجزة',
    ],
    grammarTopics: [
      'Present Perfect vs Past Simple',
      'Future Forms (will, going to, present continuous for future)',
      'Zero and 1st Conditionals',
      'Modal verbs of deduction and probability (might, may, must)',
      'Passive Voice (Present and Past Simple)',
      'Relative Clauses (who, which, that, where)',
    ],
    vocabCount: '٢,٠٠٠ - ٢,٥٠٠ كلمة متنوعة',
  },
  B2: {
    level: 'B2',
    title: 'Upper Intermediate / Vantage',
    titleAr: 'المستوى فوق المتوسط والطلاقة المستقلة',
    descriptionAr: 'فهم الأفكار الرئيسية للنصوص المعقدة حول مواضيع ملموسة ومجردة، بما في ذلك المناقشات الفنية.',
    color: '#ff4f9a',
    targetCanDo: [
      'التفاعل بدرجة من الطلاقة والعفوية تجعل التفاعل المنتظم مع الناطقين الأصليين ممكناً',
      'إنتاج نصوص واضحة ومفصلة حول مجموعة واسعة من الموضوعات',
      'شرح وجهة نظر حول قضية موضوعية مع إعطاء مزايا وعيوب خيارات مختلفة',
    ],
    grammarTopics: [
      'Future Perfect & Future Continuous (المستقبل التام والمستمر)',
      'Past Perfect & Past Perfect Continuous',
      '2nd and 3rd Conditionals & Mixed Conditionals',
      'Reported Speech & Reporting Verbs',
      'Passive Voice across all tenses',
      'Gerunds and Infinitives in complex verbs',
    ],
    vocabCount: '٣,٥٠٠ - ٤,٥٠٠ كلمة ومصطلح واصطلاح',
  },
  C1: {
    level: 'C1',
    title: 'Advanced / Effective Operational Proficiency',
    titleAr: 'المستوى المتقدم والاحترافي',
    descriptionAr: 'فهم مجموعة واسعة من النصوص الصعبة والأطول، وإدراك المعنى الضمني بدون مجهود.',
    color: '#9b7bff',
    targetCanDo: [
      'التعبير عن الأفكار بطلاقة وعفوية دون بحث ملحوظ عن العبارات',
      'استخدام اللغة بمرونة وفعالية للأغراض الاجتماعية والأكاديمية والمهنية',
      'إنتاج نصوص واضحة وجيدة التنظيم ومفصلة حول مواضيع معقدة',
    ],
    grammarTopics: [
      'Inversion with negative adverbials (Seldom have I seen...)',
      'Cleft Sentences for emphasis (What I really need is...)',
      'Subjunctive mood & Advanced Conditionals (Had I known...)',
      'Participle Clauses (Having finished the task...)',
      'Advanced discourse markers and stylistic nuances',
    ],
    vocabCount: '٦,٠٠٠ - ٨,٠٠٠ كلمة واصطلاحات متقدمة',
  },
  C2: {
    level: 'C2',
    title: 'Proficiency / Mastery',
    titleAr: 'مستوى الإتقان التام والاحتراف الأكاديمي',
    descriptionAr: 'فهم كل ما يُسمع أو يُقرأ بسهولة تامة، وإعادة صياغة الحجج بطريقة متماسكة ودقيقة.',
    color: '#ffd166',
    targetCanDo: [
      'التعبير عن النفس بعفوية ودقة تامة مع تمييز الفروق الدقيقة في المعنى',
      'فهم اللهجات الإقليمية واللغة الاصطلاحية والتعبيرات الأدبية',
      'إلقاء المحاضرات والمشاركة في المناظرات والاجتماعات القيادية الدولية',
    ],
    grammarTopics: [
      'Complete mastery of nuances, register, and socio-linguistic subtleties',
      'Rhetorical devices and literary stylistic inversion',
      'Idiomatic syntactic variations across international dialects',
    ],
    vocabCount: '١٠,٠٠٠+ كلمة ومصطلح متخصص',
  },
};
