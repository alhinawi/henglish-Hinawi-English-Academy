export interface SentenceBuilderChallenge {
  id: string;
  scrambledWords: string[];
  correctSentence: string;
  hintAr: string;
  audioText: string;
}

export const SENTENCE_BUILDER_CHALLENGES: SentenceBuilderChallenge[] = [
  {
    id: 'sb-1',
    scrambledWords: ['finished', 'homework', 'will', 'my', 'I', 'have', 'by', '8 p.m.'],
    correctSentence: 'I will have finished my homework by 8 p.m.',
    hintAr: 'ابدأ بالفاعل (I) ثم will have ثم التصريف الثالث finished.',
    audioText: 'I will have finished my homework by 8 p.m.',
  },
  {
    id: 'sb-2',
    scrambledWords: ['the', 'report', 'will', 'have', 'by', 'submitted', 'Friday', 'she'],
    correctSentence: 'She will have submitted the report by Friday',
    hintAr: 'الفاعل she يأتي بعده will have ثم submitted.',
    audioText: 'She will have submitted the report by Friday.',
  },
  {
    id: 'sb-3',
    scrambledWords: ['arrived', 'by', 'they', 'noon', 'won’t', 'have'],
    correctSentence: 'They won’t have arrived by noon',
    hintAr: 'جملة منفية: They won’t have arrived by noon.',
    audioText: 'They won’t have arrived by noon.',
  },
  {
    id: 'sb-4',
    scrambledWords: ['you', 'completed', 'will', 'have', 'the', 'exam', 'by', 'noon?'],
    correctSentence: 'Will you have completed the exam by noon?',
    hintAr: 'سؤال: ابدأ بـ Will ثم الفاعل you ثم have completed.',
    audioText: 'Will you have completed the exam by noon?',
  },
  {
    id: 'sb-5',
    scrambledWords: ['the', 'dad', 'by', 'arrives,', 'I', 'will', 'have', 'slept', 'time'],
    correctSentence: 'By the time dad arrives, I will have slept',
    hintAr: 'ابدأ بـ By the time dad arrives متبوعة بالجملة الرئيسية.',
    audioText: 'By the time dad arrives, I will have slept.',
  },
];

export interface MistakeHunterCase {
  id: string;
  sentence: string;
  hasError: boolean;
  errorWord?: string;
  correction: string;
  explanationAr: string;
}

export const MISTAKE_HUNTER_CASES: MistakeHunterCase[] = [
  {
    id: 'mh-1',
    sentence: 'She will has finished her medical training by 2029.',
    hasError: true,
    errorWord: 'will has',
    correction: 'She will have finished her medical training by 2029.',
    explanationAr: 'لا نستخدم has أبداً بعد will، بل have دائماً.',
  },
  {
    id: 'mh-2',
    sentence: 'By the time the guests will arrive, we will have prepared dinner.',
    hasError: true,
    errorWord: 'will arrive',
    correction: 'By the time the guests arrive, we will have prepared dinner.',
    explanationAr: 'في جملة by the time نستخدم المضارع البسيط (arrive) وليس will arrive.',
  },
  {
    id: 'mh-3',
    sentence: 'By next Friday, the developers will have deployed the new mobile app.',
    hasError: false,
    correction: 'الجملة صحيحة تماماً ولا يوجد بها خطأ! ✅',
    explanationAr: 'الفاعل الجمع + will have + التصريف الثالث deployed + الموعد by next Friday.',
  },
  {
    id: 'mh-4',
    sentence: 'I will have wrote ten letters before tomorrow morning.',
    hasError: true,
    errorWord: 'wrote',
    correction: 'I will have written ten letters before tomorrow morning.',
    explanationAr: 'wrote تصريف ثانٍ (V2)، والصحيح استخدام التصريف الثالث (V3) وهو written.',
  },
  {
    id: 'mh-5',
    sentence: 'Will you have graduated from the academy before next summer?',
    hasError: false,
    correction: 'سؤال سليم ١٠٠٪! ✅',
    explanationAr: 'تكوين السؤال: Will + you + have + V3 (graduated) + ظرف الموعد المستقبلي.',
  },
];
