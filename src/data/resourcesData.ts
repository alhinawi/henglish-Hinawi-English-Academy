export interface LearningResource {
  id: string;
  title: string;
  subtitle: string;
  category: 'revision' | 'worksheet' | 'verbs' | 'exam';
  description: string;
  pages: number;
  badge: string;
  downloadFilename: string;
  contentMarkdown: string;
}

export const DOWNLOADABLE_RESOURCES: LearningResource[] = [
  {
    id: 'res-cheat-sheet',
    title: 'مذكرة المراجعة السريعة الشاملة (Cheat Sheet) ⚡',
    subtitle: 'Future Perfect Master Summary',
    category: 'revision',
    description: 'ملخص مركز في صفحة واحدة يجمع القاعدة الذهبية، حالات النفي والسؤال، فخ by the time، والمقارنة مع باقي الأزمنة.',
    pages: 1,
    badge: 'الأكثر تحميلاً',
    downloadFilename: 'hinawi-future-perfect-summary.txt',
    contentMarkdown: `==========================================================
HINAWI ENGLISH ACADEMY — FUTURE PERFECT CHEAT SHEET
==========================================================
القاعدة الذهبية (Golden Formula):
  [Subject] + will have + [Past Participle (V3)]
  مثال: By 8 p.m., I will have finished my homework.

صيغة النفي (Negative Form):
  [Subject] + won't have + [Past Participle (V3)]
  مثال: She won't have completed the task before Friday.

صيغة السؤال (Questions):
  Will + [Subject] + have + [Past Participle (V3)]?
  مثال: Will you have graduated by 2028?

فخ By the time الشهير:
  By the time + [Present Simple], [will have + V3]
  صح: By the time dad arrives, I will have gone to bed.
  غلط: By the time dad will arrive... ❌

مقارنة الأزمنة السريعة:
  - Future Simple: I will finish at 8 (في اللحظة نفسها).
  - Future Continuous: At 8, I will be working (مستمر وقتها).
  - Future Perfect: By 8, I will have finished (اكتمل قبل الموعد).
==========================================================`,
  },
  {
    id: 'res-worksheet',
    title: 'ورقة عمل وتمارين منزلية مع نموذج الإجابة 📝',
    subtitle: 'Practice Worksheet & Answer Key',
    category: 'worksheet',
    description: 'تتضمن ١٠ أسئلة إكمال جمل، ٥ أسئلة تصحيح أخطاء، وسؤال كتابة شخصي، مع مفتاح إجابات نموذجي ومشروح.',
    pages: 2,
    badge: 'تطبيقي',
    downloadFilename: 'hinawi-future-perfect-worksheet.txt',
    contentMarkdown: `==========================================================
HINAWI ENGLISH ACADEMY — HOMEWORK WORKSHEET
==========================================================
Part A • Complete with the correct Future Perfect form:
1. By 10 p.m. tonight, I ______________ (finish) my revision.
2. By next year, my brother ______________ (graduate) from college.
3. They ______________ (not / arrive) by noon.
4. ______________ you ______________ (save) enough money by December?
5. By the time she ______________ (get) home, we will have eaten.
6. What ______________ you ______________ (achieve) by 2030?

Part B • Find and correct the single error in each sentence:
1. He will has repaired the car by tomorrow afternoon.
2. By the time the train will arrive, we will have bought the tickets.
3. She will have wrote three letters before sunset.

==========================================================
ANSWER KEY & EXPLANATIONS (مفتاح الإجابات)
==========================================================
Part A:
1. will have finished
2. will have graduated
3. will not have arrived / won't have arrived
4. Will / have saved
5. gets (Present Simple after by the time)
6. will / have achieved

Part B:
1. will has -> will have repaired
2. will arrive -> arrives
3. wrote -> written (V3 is required)
==========================================================`,
  },
  {
    id: 'res-verbs',
    title: 'دليل التصريف الثالث للأفعال الشائعة (V3 Guide) 📚',
    subtitle: '50 Most Essential V3 Participles',
    category: 'verbs',
    description: 'جدول الأفعال الأكثر تكراراً في امتحانات اللغة الإنجليزية ومحادثات العمل مع التصريفات الثلاثة والترجمة.',
    pages: 3,
    badge: 'مرجع دائم',
    downloadFilename: 'hinawi-v3-verbs-guide.txt',
    contentMarkdown: `==========================================================
HINAWI ENGLISH ACADEMY — V1, V2, V3 ESSENTIAL TOOLKIT
==========================================================
V1 (Base)    | V2 (Past Simple) | V3 (Past Participle) | Meaning (AR)
----------------------------------------------------------
write        | wrote            | written              | يكتب
do           | did              | done                 | يفعل
go           | went             | gone                 | يذهب
see          | saw              | seen                 | يرى
take         | took             | taken                | يأخذ
make         | made             | made                 | يصنع
eat          | ate              | eaten                | يأكل
speak        | spoke            | spoken               | يتحدث
fly          | flew             | flown                | يطير / يسافر
buy          | bought           | bought               | يشتري
find         | found            | found                | يجد
learn        | learned / learnt | learned / learnt     | يتعلم
read         | read (نطق ريد)   | read (نطق رد)        | يقرأ
==========================================================`,
  },
];
