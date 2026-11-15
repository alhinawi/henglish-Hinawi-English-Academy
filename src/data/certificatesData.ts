import { CEFRLevel } from "../types";
import { ALL_GRAMMAR_RULES } from "./allGrammarRules";

export interface CertificateDefinition {
  id: string;
  titleAr: string;
  titleEn: string;
  cefrLevel: CEFRLevel;
  // Real lesson/rule IDs from the platform that must appear in the student's
  // completed lessons for this certificate to unlock.
  requiredLessonIds: string[];
  // Minimum average percentage across the student's real recorded quiz scores.
  // 0 means no quiz requirement.
  minQuizAverage: number;
  descriptionAr: string;
  requirementAr: string;
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
  // Real average of the student's recorded quiz scores at issue time.
  // Null when the certificate has no quiz requirement and no scores exist.
  finalScorePercentage: number | null;
  status: "valid" | "revoked";
  instructorName: string;
}

// Grammar rules are tagged with their CEFR level; completing a rule records
// `rule-<id>` in the student's completed lessons.
const ruleIdsForLevel = (level: "A1" | "A2" | "B1" | "B2" | "C1"): string[] =>
  ALL_GRAMMAR_RULES.filter((rule) => rule.level.startsWith(level)).map(
    (rule) => `rule-${rule.id}`,
  );

// The flagship Future Perfect Masterclass has 8 real lessons (lesson-1..lesson-8).
const FUTURE_PERFECT_LESSON_IDS = Array.from(
  { length: 8 },
  (_, i) => `lesson-${i + 1}`,
);

const A1_RULE_IDS = ruleIdsForLevel("A1");
const A2_RULE_IDS = ruleIdsForLevel("A2");
const B1_RULE_IDS = ruleIdsForLevel("B1");
const B2_RULE_IDS = ruleIdsForLevel("B2");

export const CERTIFICATE_DEFINITIONS: CertificateDefinition[] = [
  {
    id: "cert-level-a1",
    titleAr: "شهادة إتمام المستوى A1",
    titleEn: "Certificate of Completion - Level A1",
    cefrLevel: "A1",
    requiredLessonIds: A1_RULE_IDS,
    minQuizAverage: 0,
    descriptionAr:
      "تُمنح للطالب الذي أكمل دراسة جميع قواعد المستوى A1 في أكاديمية الجرامر: الأساسيات والتركيب اللغوي وأزمنة المضارع.",
    requirementAr: `إتمام قواعد المستوى A1 كاملة (${A1_RULE_IDS.length} قواعد)`,
  },
  {
    id: "cert-level-a2",
    titleAr: "شهادة إتمام المستوى A2",
    titleEn: "Certificate of Completion - Level A2",
    cefrLevel: "A2",
    requiredLessonIds: A2_RULE_IDS,
    minQuizAverage: 0,
    descriptionAr:
      "تُمنح للطالب الذي أكمل دراسة جميع قواعد المستوى A2 في أكاديمية الجرامر: أزمنة الماضي وأساسيات التأسيس اللغوي.",
    requirementAr: `إتمام قواعد المستوى A2 كاملة (${A2_RULE_IDS.length} قاعدة)`,
  },
  {
    id: "cert-level-b1",
    titleAr: "شهادة إتمام المستوى B1",
    titleEn: "Certificate of Completion - Level B1",
    cefrLevel: "B1",
    requiredLessonIds: B1_RULE_IDS,
    minQuizAverage: 0,
    descriptionAr:
      "تُمنح للطالب الذي أكمل دراسة جميع قواعد المستوى B1 في أكاديمية الجرامر: حالات الشرط والأزمنة المتوسطة.",
    requirementAr: `إتمام قواعد المستوى B1 كاملة (${B1_RULE_IDS.length} قواعد)`,
  },
  {
    id: "cert-level-b2",
    titleAr: "شهادة إتمام المستوى B2",
    titleEn: "Certificate of Completion - Level B2",
    cefrLevel: "B2",
    requiredLessonIds: B2_RULE_IDS,
    minQuizAverage: 0,
    descriptionAr:
      "تُمنح للطالب الذي أكمل دراسة جميع قواعد المستوى B2 في أكاديمية الجرامر: المبني للمجهول والتراكيب فوق المتوسطة.",
    requirementAr: `إتمام قواعد المستوى B2 كاملة (${B2_RULE_IDS.length} قواعد)`,
  },
  {
    id: "cert-future-perfect",
    titleAr: "شهادة إتمام كورس المستقبل التام الشامل",
    titleEn: "Certificate of Completion - Future Perfect Masterclass",
    cefrLevel: "B2",
    requiredLessonIds: FUTURE_PERFECT_LESSON_IDS,
    minQuizAverage: 70,
    descriptionAr:
      "تُمنح للطالب الذي أكمل دروس كورس المستقبل التام الشامل الثمانية كاملة، مع متوسط لا يقل عن 70% في اختباراته المسجلة على المنصة.",
    requirementAr: `إتمام دروس الكورس الثمانية + متوسط اختبارات ≥ 70%`,
  },
  {
    id: "cert-grammar-diploma",
    titleAr: "دبلوم إتمام أكاديمية الجرامر الكامل",
    titleEn: "Grammar Academy Full Diploma",
    cefrLevel: "C1",
    requiredLessonIds: [
      ...A1_RULE_IDS,
      ...A2_RULE_IDS,
      ...B1_RULE_IDS,
      ...B2_RULE_IDS,
      ...ruleIdsForLevel("C1"),
      ...FUTURE_PERFECT_LESSON_IDS,
    ],
    minQuizAverage: 80,
    descriptionAr:
      "أعلى شهادة في المنصة: تُمنح للطالب الذي أكمل كل قواعد أكاديمية الجرامر بجميع مستوياتها وكورس المستقبل التام الشامل، مع متوسط اختبارات لا يقل عن 80%.",
    requirementAr: `إتمام كل قواعد الأكاديمية ودروس الكورس + متوسط اختبارات ≥ 80%`,
  },
];
