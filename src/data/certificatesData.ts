import { CEFRLevel } from "../types";

export interface CertificateDefinition {
  id: string;
  titleAr: string;
  titleEn: string;
  cefrLevel: CEFRLevel;
  requiredCompletedLessons: number;
  minQuizAverage: number;
  descriptionAr: string;
  badgeIcon: string;
}

export interface IssuedCertificate {
  certificateId: string;
  studentNameAr: string;
  studentNameEn: string;
  courseTitleAr: string;
  courseTitleEn: string;
  cefrLevel: CEFRLevel;
  issueDate: string;
  verificationCode: string;
  finalScorePercentage: number;
  status: "valid" | "revoked";
  instructorName: string;
}

export const CERTIFICATE_DEFINITIONS: CertificateDefinition[] = [
  {
    id: "cert-grammar-foundations",
    titleAr: "شهادة إتقان أساسيات الجرامر",
    titleEn: "Certificate of Grammar Foundations",
    cefrLevel: "A1",
    requiredCompletedLessons: 4,
    minQuizAverage: 70,
    descriptionAr:
      "تُمنح للطلاب الذين أتموا دراسة واجتياز اختبارات أزمنة المضارع والماضي البسيط بنجاح.",
    badgeIcon: "",
  },
  {
    id: "cert-future-mastery",
    titleAr: "شهادة إتقان كورس المستقبل التام الشامل",
    titleEn: "Mastery of the Future Perfect Tense",
    cefrLevel: "B2",
    requiredCompletedLessons: 8,
    minQuizAverage: 75,
    descriptionAr:
      "الشهادة التخصصية المعتمدة لإتقان صيغ المستقبل التام، قواعد By the time، واختبارات المواعيد النهائية.",
    badgeIcon: "",
  },
  {
    id: "cert-real-life-fluency",
    titleAr: "شهادة إنجليزي المواقف الحقيقية اليومية",
    titleEn: "Real-Life Situational English Fluency",
    cefrLevel: "B1",
    requiredCompletedLessons: 4,
    minQuizAverage: 80,
    descriptionAr:
      "تُمنح لإتقان مهارات الحوار التفاعلي في المطار، الفندق، المطعم، والمواقف الطارئة.",
    badgeIcon: "",
  },
  {
    id: "cert-academy-diploma",
    titleAr: "دبلوم التميز الأكاديمي الشامل في اللغة الإنجليزية",
    titleEn: "Henglish Academy Comprehensive Diploma",
    cefrLevel: "C1",
    requiredCompletedLessons: 14,
    minQuizAverage: 85,
    descriptionAr:
      "أعلى وسام أكاديمي في المنصة يمنح للطلاب المتميزين الذين أكملوا مسارات الجرامر والمحادثة والمحاكاة.",
    badgeIcon: "",
  },
  {
    id: "cert-vocab-builder",
    titleAr: "شهادة بناء المفردات المتقدمة",
    titleEn: "Advanced Vocabulary Builder",
    cefrLevel: "B1",
    requiredCompletedLessons: 6,
    minQuizAverage: 75,
    descriptionAr:
      "تُمنح لإتقان أهم 1,000 كلمة إنجليزية شائعة مع المرادفات والمتضادات والتعبيرات الاصطلاحية.",
    badgeIcon: "",
  },
  {
    id: "cert-speaking-confidence",
    titleAr: "شهادة الطلاقة والمحادثة الواثقة",
    titleEn: "Speaking Confidence & Fluency",
    cefrLevel: "B2",
    requiredCompletedLessons: 5,
    minQuizAverage: 80,
    descriptionAr:
      "تُمنح لإتمام تدريبات المحادثة الظلية (Shadowing) والأزواج الصوتية الدقيقة ومواقف الحوار الحي بنجاح.",
    badgeIcon: "",
  },
];
