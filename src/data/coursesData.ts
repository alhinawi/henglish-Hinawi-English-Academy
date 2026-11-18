import { ALL_LISTENING_LESSONS } from './listeningAcademyData';


export const COURSE_LEVELS = ['مبتدئ', 'متوسط', 'متقدم', 'شامل'] as const;

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
    tag: 'أكاديمية الجرامر',
    icon: '',
    imageUrl: '/images/catalog/future-perfect.webp',
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
    imageUrl: '/images/catalog/grammar-academy.webp',
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
    imageUrl: '/images/catalog/vocabulary-academy.webp',
    route: 'vocabulary',
    ctaLabel: 'ابدأ حفظ الكلمات',
  },
  {
    id: 'listening-academy',
    title: 'أكاديمية الاستماع الواقعي',
    titleEn: 'Real-Life Listening Academy',
    description: '٦ مقاطع استماع من مواقف حقيقية: إعلانات المطار، اجتماعات العمل، المقابلات الشخصية، عند الطبيب، وفي الفندق، كل مقطع بأسئلة فهم.',
    level: 'شامل',
    lessonsCount: ALL_LISTENING_LESSONS.length,
    countLabel: '٦ مقاطع',
    tag: 'مهارة الاستماع',
    icon: '',
    imageUrl: '/images/catalog/listening-academy.webp',
    route: 'listening',
    ctaLabel: 'ابدأ التدريب',
  },
];

/** Page-level copy for the courses catalog (Arabic source of truth). */
export const COURSES_PAGE_COPY = {
  heroTitle: 'دليل الكورسات والأكاديمية الشاملة',
  heroSubtitle: 'اختر مسارك التعليمي المفضل لتطوير قواعدك، طلاقتك النطقية، ومراسلاتك المهنية باللغة الإنجليزية بأعلى معايير الإتقان.',
  promoChip: 'أكاديمية القواعد الكبرى',
  promoTitle: 'هل تبحث عن شرح كل أزمنة وقواعد الإنجليزي بالترتيب؟',
  promoBody: 'استعرض أكاديمية الجرامر الشاملة: أكثر من 50 قاعدة من الصفر للاحتراف، كل قاعدة بشرح مبسط وأمثلة منطوقة وكويز فهم.',
  promoCta: 'تصفح الأكاديمية الشاملة',
  filterLabel: 'تصفية حسب المستوى:',
  allLevels: 'جميع المستويات',
  lessonsSuffix: 'دروس',
  catalogChip: 'دليل الكورسات',
  /** Full count phrases so MT gets number+noun agreement right per language. */
  lessonsCountPhrases: ['8 دروس'],
  defaultCta: 'استعرض المحتوى',
};
