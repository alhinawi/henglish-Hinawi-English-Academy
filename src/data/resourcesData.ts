import { VERB_TOOLKIT } from './verbsData';

export interface LearningResource {
  id: string;
  title: string;
  subtitle: string;
  category: "revision" | "worksheet" | "verbs" | "exam";
  description: string;
  pages: number;
  badge: string;
  downloadFilename: string;
  contentMarkdown: string;
}

export const DOWNLOADABLE_RESOURCES: LearningResource[] = [
  {
    id: "res-cheat-sheet",
    title: "مذكرة المراجعة السريعة الشاملة (Cheat Sheet)",
    subtitle: "Future Perfect Master Summary",
    category: "revision",
    description:
      "ملخص مركز في صفحة واحدة يجمع القاعدة الذهبية، حالات النفي والسؤال، فخ by the time، والمقارنة مع باقي الأزمنة.",
    pages: 1,
    badge: "مراجعة سريعة",
    downloadFilename: "hinawi-future-perfect-summary.txt",
    contentMarkdown: `==========================================================
Henglish ACADEMY — FUTURE PERFECT CHEAT SHEET
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
    id: "res-worksheet",
    title: "ورقة عمل وتمارين منزلية مع نموذج الإجابة",
    subtitle: "Practice Worksheet & Answer Key",
    category: "worksheet",
    description:
      "تتضمن ١٠ أسئلة إكمال جمل، ٥ أسئلة تصحيح أخطاء، وسؤال كتابة شخصي، مع مفتاح إجابات نموذجي ومشروح.",
    pages: 2,
    badge: "تطبيقي",
    downloadFilename: "hinawi-future-perfect-worksheet.txt",
    contentMarkdown: `==========================================================
Henglish ACADEMY — HOMEWORK WORKSHEET
==========================================================
Part A • Complete with the correct Future Perfect form:
1. By 10 p.m. tonight, I ______________ (finish) my revision.
2. By next year, my brother ______________ (graduate) from college.
3. They ______________ (not / arrive) by noon.
4. ______________ you ______________ (save) enough money by December?
5. By the time she ______________ (get) home, we will have eaten.
6. What ______________ you ______________ (achieve) by 2030?
7. By Friday, Salma ______________ (write) all three reports.
8. By the time the lesson ______________ (start), we will have read the text.
9. We ______________ (not / take) the final exam by next Monday.
10. How many books ______________ he ______________ (read) by the end of the month?

Part B • Find and correct the single error in each sentence:
1. He will has repaired the car by tomorrow afternoon.
2. By the time the train will arrive, we will have bought the tickets.
3. She will have wrote three letters before sunset.
4. Will they have finish the project by Monday?
5. By the time he gets home, we will have ate dinner.

Part C • Write about your own study goals (60-80 words):
Describe three things you will have completed by the end of next month.
Use one negative form and one sentence beginning with "By the time".
Choose realistic goals and include a clear deadline.
Self-check: three completed actions; will have + V3; one negative;
Present Simple after by the time; a clear deadline; 60-80 words.

==========================================================
ANSWER KEY & EXPLANATIONS (مفتاح الإجابات)
==========================================================
Part A:
1. will have finished - completion before tonight's deadline.
2. will have graduated - will have + the past participle graduated.
3. will not have arrived / won't have arrived - not goes after will.
4. Will / have saved - invert will and the subject for a question.
5. gets - Present Simple after by the time; she takes -s.
6. will / have achieved - keep have + V3 after the subject in a question.
7. will have written - written is the past participle of write.
8. starts - use Present Simple in the by-the-time clause.
9. will not have taken / won't have taken - taken, not took, follows have.
10. will / have read - keep have read together; read here sounds /red/.

Part B:
1. will has -> will have: He will have repaired the car by tomorrow afternoon.
   After will, use the base form have, not has.
2. will arrive -> arrives: By the time the train arrives, we will have bought the tickets.
   The time clause takes Present Simple, not will.
3. wrote -> written: She will have written three letters before sunset.
   Have requires the past participle written, not the past form wrote.
4. finish -> finished: Will they have finished the project by Monday?
   Question order is Will + subject + have + V3.
5. ate -> eaten: By the time he gets home, we will have eaten dinner.
   Eaten is the past participle; gets already uses the correct time-clause form.

Part C • One possible answer (your own goals may differ):
By the end of next month, I will have finished two English books.
I will have written a short diary entry every week, and I will have
learned twenty useful expressions. I will not have completed the
whole course, because I want time to practise each unit. By the time
my next class starts, I will have prepared three questions to ask
my teacher. These goals will help me study regularly.
Check your own work against the task, not against this model's exact words.
==========================================================`,
  },
  {
    id: "res-verbs",
    title: "دليل التصريف الثالث للأفعال الشائعة (V3 Guide)",
    subtitle: "50 Most Essential V3 Participles",
    category: "verbs",
    description:
      "جدول الأفعال الأكثر تكراراً في امتحانات اللغة الإنجليزية ومحادثات العمل مع التصريفات الثلاثة والترجمة.",
    pages: 3,
    badge: "مرجع دائم",
    downloadFilename: "hinawi-v3-verbs-guide.txt",
    contentMarkdown: `==========================================================
Henglish ACADEMY — V1, V2, V3 ESSENTIAL TOOLKIT
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
read /riːd/  | read /red/       | read /red/           | يقرأ
${VERB_TOOLKIT.filter((verb, index, all) => all.findIndex(entry => entry.v1 === verb.v1) === index && !['write', 'do', 'go', 'see', 'take', 'make', 'eat', 'speak', 'fly', 'buy', 'find', 'learn', 'read'].includes(verb.v1)).slice(0, 37).map(verb => `${verb.v1.padEnd(12)} | ${verb.v2.padEnd(16)} | ${verb.v3.padEnd(20)} | ${verb.meaningAr}`).join('\n')}
come         | came             | come                 | يأتي

Usage notes:
After will have, always use the V3 column, not V2.
Regular verbs often share V2 and V3; irregular forms must be learned.
Read is /riːd/ in the base form and /red/ in the past and participle.
Both learned and learnt are accepted; use either consistently.
==========================================================`,
  },
  {
    id: "res-irregular-verbs",
    title: "جدول الأفعال الشاذة الأربعين الأكثر استخداماً",
    subtitle: "Top 40 Irregular Verbs Reference",
    category: "verbs",
    description:
      "مرجع سريع يجمع التصاريف الثلاثة (V1, V2, V3) لأهم 40 فعل شاذ مع مثال مستقبل تام لكل فعل.",
    pages: 2,
    badge: "مرجع أساسي",
    downloadFilename: "hinawi-top-40-irregular-verbs.txt",
    contentMarkdown: `==========================================================
HENGLISH ACADEMY — TOP 40 IRREGULAR VERBS (V1 / V2 / V3)
==========================================================
write  - wrote  - written    يكتب
  By June, she will have written the report.
speak  - spoke  - spoken     يتحدث
  By the interview, he will have spoken to the manager.
take   - took   - taken      يأخذ
  By noon, I will have taken my medicine.
see    - saw    - seen       يرى
  By 8 p.m., we will have seen the whole movie.
go     - went   - gone       يذهب
  By the time you call, they will have gone home.
do     - did    - done       يفعل
  By Friday, we will have done all the tasks.
eat    - ate    - eaten      يأكل
  By 2 p.m., I will have eaten lunch.
give   - gave   - given      يعطي
  By Monday, the teacher will have given us the results.
build  - built  - built      يبني
  By 2028, they will have built the new bridge.
buy    - bought - bought     يشتري
  By noon, we will have bought all the groceries.
catch  - caught - caught     يلحق / يمسك
  By 7 a.m., she will have caught the early train.
choose - chose  - chosen     يختار
  By graduation, he will have chosen his career path.
fall   - fell   - fallen     يسقط
  By winter, the leaves will have fallen.
forget - forgot - forgotten  ينسى
  By the end of the trip, you will have forgotten the stress.
grow   - grew   - grown      ينمو
  By next year, the startup will have grown to 50 employees.
know   - knew   - known      يعرف
  By December, you will have known all the answers.
leave  - left   - left       يغادر
  By the time we arrive, the plane will have left.
make   - made   - made       يصنع
  By tonight, the chef will have made 300 dishes.
meet   - met    - met        يقابل
  By the conference, I will have met the industry leaders.
read   - read   - read       يقرأ
  By summer, Omar will have read twenty novels.
win    - won    - won        يفوز
  By the final whistle, our team will have won the cup.
fly    - flew   - flown      يطير
  By morning, the aircraft will have flown three continents.
begin  - began  - begun      يبدأ
  By 9 a.m., the workshop will have begun.
break  - broke  - broken     يكسر
  By evening, the news will have broken all records.
bring  - brought- brought    يحضر
  By dinner, she will have brought the desserts.
come   - came   - come       يأتي
  By sunset, the guests will have come from everywhere.
drink  - drank  - drunk      يشرب
  By noon, he will have drunk three cups of coffee.
drive  - drove  - driven     يقود
  By midnight, we will have driven 400 kilometers.
feel   - felt   - felt       يشعر
  By the results day, you will have felt every emotion.
find   - found  - found      يجد
  By Friday, the committee will have found a solution.
get    - got    - gotten     يحصل على
  By 2027, she will have gotten her master's degree.
hear   - heard  - heard      يسمع
  By evening, everyone will have heard the announcement.
keep   - kept   - kept       يحتفظ
  By year-end, the museum will have kept every artifact.
learn  - learnt - learnt     يتعلم
  By December, she will have learnt 1,000 words.
run    - ran    - run        يجري
  By April, he will have run three marathons.
sing   - sang   - sung       يغني
  By midnight, the band will have sung all their hits.
sleep  - slept  - slept      ينام
  By exam day, you will have slept enough to focus.
teach  - taught - taught     يعلّم
  By June, Mr. Adel will have taught 300 students.
think  - thought- thought    يفكر
  By the deadline, they will have thought of a plan.
wear   - wore   - worn       يلبس
  By the party, she will have worn her new dress.
==========================================================`,
  },
  {
    id: "res-writing-pack",
    title: "حزمة قوالب الكتابة الرسمية الخمسة",
    subtitle: "Formal Writing Templates Pack",
    category: "worksheet",
    description:
      "خمسة قوالب كتابة جاهزة: إيميل عمل، خطاب تقديم لوظيفة، مقال أكاديمي، خطاب شكوى، ومقال تقديم جامعي مع قواعد كل قالب.",
    pages: 3,
    badge: "جديد",
    downloadFilename: "hinawi-writing-templates-pack.txt",
    contentMarkdown: `==========================================================
HENGLISH ACADEMY — FORMAL WRITING TEMPLATES PACK
==========================================================
1) FORMAL BUSINESS EMAIL
Subject: Project Milestone Delivery & Q4 Roadmap
Dear Mr. Henderson,
I am writing to provide you with a comprehensive status update
regarding our software migration. By next Friday at 5:00 PM, our
engineering team will have deployed all microservices to production.
Best regards, [Name]

2) JOB APPLICATION COVER LETTER
Dear Hiring Committee,
I am writing to express my strong enthusiasm for the position.
By the completion of this quarter, I will have led three major
initiatives, demonstrating my ability to deliver results.
Sincerely, [Name]

3) ACADEMIC OPINION ESSAY
Hook + Thesis: In recent decades, urban centers have embraced
sustainable infrastructure. By 2040, major cities will have
transitioned to ninety percent clean energy.

4) FORMAL COMPLAINT LETTER
Dear Customer Service Manager,
I am writing to express my dissatisfaction with order #4821.
By the time your team responds, three weeks will have passed
since the promised delivery date.
Yours faithfully, [Name]

5) UNIVERSITY PERSONAL STATEMENT
Ever since I wrote my first line of code at fourteen, I have been
fascinated by software. By the time I begin my studies, I will have
completed three independent projects.
==========================================================`,
  },
];
