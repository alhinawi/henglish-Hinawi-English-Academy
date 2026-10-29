export interface CourseItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'شامل';
  lessonsCount: number;
  duration: string;
  rating: number;
  studentsCount: number;
  isFlagship?: boolean;
  tag: string;
  icon: string;
}

export const COURSES_CATALOG: CourseItem[] = [
  {
    id: 'future-perfect',
    title: 'المستقبل التام الشامل (Future Perfect Masterclass)',
    titleEn: 'Master the Future Perfect Tense',
    description: 'الكورس الرائد والكامل: من الصفر وحتى الاحتراف مع ٨ دروس تفاعلية، خطوط زمنية، كويزات، ألعاب، ومحادثات واقعية.',
    level: 'شامل',
    lessonsCount: 8,
    duration: 'ساعتان و٤٥ دقيقة',
    rating: 4.95,
    studentsCount: 3840,
    isFlagship: true,
    tag: 'الكورس الرائد 👑',
    icon: '⚡',
  },
  {
    id: 'present-perfect',
    title: 'المضارع التام وعلاقته بالحاضر',
    titleEn: 'Present Perfect in Real Life',
    description: 'افهم الفرق بين الماضي البسيط والمضارع التام بدون تعقيد، مع حالات since وfor وjust وalready.',
    level: 'متوسط',
    lessonsCount: 6,
    duration: 'ساعتان',
    rating: 4.88,
    studentsCount: 2950,
    tag: 'قواعد حيوية',
    icon: '🎯',
  },
  {
    id: 'conditionals',
    title: 'قواعد لو والشرط (Zero to 3rd Conditionals)',
    titleEn: 'Master All 4 Conditionals',
    description: 'دليلك المبسط لحالات If الأربعة، والشرط المختلط (Mixed Conditionals) مع أمثلة حية.',
    level: 'متوسط',
    lessonsCount: 5,
    duration: 'ساعة ونصف',
    rating: 4.91,
    studentsCount: 1820,
    tag: 'قواعد متقدمة',
    icon: '🔮',
  },
  {
    id: 'tech-english',
    title: 'الإنجليزية للمبرمجين ومهندسي البرمجيات',
    titleEn: 'English for Software Engineers',
    description: 'مصطلحات الـ Pull Requests، اجتماعات الـ Daily Standup، نقاشات التصميم المعماري، وكتابة الـ Documentation.',
    level: 'متقدم',
    lessonsCount: 10,
    duration: '٣ ساعات',
    rating: 4.98,
    studentsCount: 4210,
    tag: 'مهني وتقني',
    icon: '💻',
  },
  {
    id: 'business-writing',
    title: 'المراسلات المهنية والإيميلات الرسمية',
    titleEn: 'Professional Business Correspondence',
    description: 'كيف تكتب إيميلات واضحة، مهذبة، ومؤثرة لمديرك، عميلك، أو شركات أجنبية.',
    level: 'متوسط',
    lessonsCount: 6,
    duration: 'ساعتان',
    rating: 4.85,
    studentsCount: 2100,
    tag: 'بيئة العمل',
    icon: '✉️',
  },
  {
    id: 'ielts-speaking',
    title: 'أسرار الطلاقة ومحادثات الآيلتس (Band 7.5+)',
    titleEn: 'IELTS Speaking & Natural Fluency',
    description: 'تطوير سرعة التفكير بالإنجليزي، ربط الأفكار، والتحدث التلقائي دون توقف أو تردد.',
    level: 'متقدم',
    lessonsCount: 12,
    duration: '٤ ساعات',
    rating: 4.96,
    studentsCount: 3150,
    tag: 'شهادات دولية',
    icon: '🎙️',
  },
];
