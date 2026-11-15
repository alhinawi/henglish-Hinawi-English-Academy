import { ONLINE_IMAGES } from './imageAssets';

export interface CourseItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'شامل';
  lessonsCount: number;
  duration?: string;
  rating?: number;
  studentsCount?: number;
  isFlagship?: boolean;
  tag: string;
  icon: string;
  imageUrl?: string;
  /** Where the card leads. ruleId deep-links into a single grammar lesson. */
  route?: string;
  ruleId?: string;
  ctaLabel?: string;
  /** Overrides the default "N دروس" meta label (words, rules, tracks...). */
  countLabel?: string;
}

export const COURSES_CATALOG: CourseItem[] = [
  {
    id: 'future-perfect',
    title: 'ماستر كلاس المستقبل التام (Future Perfect)',
    titleEn: 'Master the Future Perfect Tense',
    description: 'كورس المستقبل التام المدمج بأكاديمية الجرامر: ٨ دروس تفاعلية من الصفر وحتى الاحتراف، مع خطوط زمنية، كويزات فهم، ومحادثات واقعية بنطق واضح.',
    level: 'شامل',
    lessonsCount: 8,
    isFlagship: true,
    tag: 'أكاديمية الجرامر 👑',
    icon: '',
    imageUrl: ONLINE_IMAGES.courses.futurePerfect,
    route: 'courses/grammar/future-perfect',
    ctaLabel: 'ابدأ دراسة الكورس (٨ دروس)',
  },
  {
    id: 'grammar-academy',
    title: 'أكاديمية الجرامر الشاملة',
    titleEn: 'The Complete Grammar Academy',
    description: 'كل أزمنة وقواعد الإنجليزية مرتبة من الصفر للاحتراف: أكثر من ٥٠ قاعدة بشرح مبسط، أمثلة منطوقة، وأخطاء شائعة، مع كويز فهم بعد كل قاعدة.',
    level: 'شامل',
    lessonsCount: 53,
    countLabel: 'أكثر من ٥٠ قاعدة',
    tag: 'الأساس الكامل',
    icon: '',
    imageUrl: ONLINE_IMAGES.courses.conditionals,
    route: 'courses/grammar',
    ctaLabel: 'تصفح الأكاديمية',
  },
  {
    id: 'vocabulary-academy',
    title: 'أكاديمية المفردات المصنفة',
    titleEn: 'The Vocabulary Academy',
    description: 'أكثر من ١٥٠٠ كلمة إنجليزية مصنفة حسب المستوى والموضوع، بمعانيها الدقيقة وأمثلة استخدام منطوقة لتثبيتها في الذاكرة الطويلة.',
    level: 'شامل',
    lessonsCount: 1580,
    countLabel: 'أكثر من ١٥٠٠ كلمة',
    tag: 'بناء الحصيلة اللغوية',
    icon: '',
    imageUrl: ONLINE_IMAGES.courses.techEnglish,
    route: 'vocabulary',
    ctaLabel: 'ابدأ حفظ الكلمات',
  },
  {
    id: 'present-perfect',
    title: 'المضارع التام وعلاقته بالحاضر',
    titleEn: 'Present Perfect in Real Life',
    description: 'افهم الفرق بين الماضي البسيط والمضارع التام بدون تعقيد، مع حالات since ﻥ for ﻥ just ﻥ already وأمثلة من حياتك اليومية.',
    level: 'متوسط',
    lessonsCount: 1,
    countLabel: 'درس تفاعلي',
    tag: 'قواعد حيوية',
    icon: '',
    imageUrl: ONLINE_IMAGES.courses.presentPerfect,
    ruleId: 'present-perfect',
    ctaLabel: 'ادرس القاعدة الآن',
  },
  {
    id: 'conditionals',
    title: 'حالات الشرط الأربعة (Conditionals)',
    titleEn: 'Master All 4 Conditionals',
    description: 'دليلك المبسط لحالات If الأربعة من Zero حتى Third Conditional، كل حالة بقاعدتها وأمثلتها وأخطائها الشائعة في درس مستقل.',
    level: 'متوسط',
    lessonsCount: 4,
    countLabel: '٤ دروس',
    tag: 'قواعد متقدمة',
    icon: '',
    imageUrl: ONLINE_IMAGES.courses.ieltsSpeaking,
    ruleId: 'zero-conditional',
    ctaLabel: 'ابدأ بالحالة الأولى',
  },
  {
    id: 'listening-academy',
    title: 'أكاديمية الاستماع الواقعي',
    titleEn: 'Real-Life Listening Academy',
    description: '٦ مقاطع استماع من مواقف حقيقية: إعلانات المطار، اجتماعات العمل، المقابلات الشخصية، عند الطبيب، وفي الفندق، كل مقطع بأسئلة فهم.',
    level: 'متوسط',
    lessonsCount: 6,
    countLabel: '٦ مقاطع',
    tag: 'مهارة الاستماع',
    icon: '',
    imageUrl: ONLINE_IMAGES.courses.businessWriting,
    route: 'listening',
    ctaLabel: 'ابدأ التدريب',
  },
];
