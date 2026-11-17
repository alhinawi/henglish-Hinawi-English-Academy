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
These are original practice scenarios, not real reports or personal claims.
Adapt the details to your own situation. Do not copy invented experience
into a real application. Bracketed fields are for your own details.

1) FORMAL BUSINESS EMAIL
Purpose: give a clear project update and request a specific next step.
Subject: Migration Update and Testing Plan
Dear [Recipient name],
I am writing to update you on our planned software migration.
The team has finished the initial checks and is testing the remaining
services. By next Friday at 5 p.m., we will have completed the planned
tests, provided that no major issues appear. We will send a separate
notice before any change affects users. Could you confirm who should
receive the final test summary?
Best regards,
[Your name]
Rules and checks:
- State the purpose in the first sentence; keep the subject specific.
- Separate completed work, current work and planned work.
- Use will have + V3 for completion before a future deadline.
- Label conditions honestly; do not promise unverified results.
- End with one clear request and an appropriate sign-off.
Practice: write 80-100 words about a study-group project. Include a
status update, a deadline and a request for your reader.

2) JOB APPLICATION COVER LETTER
Purpose: connect relevant evidence to the role, not repeat a full CV.
Dear Hiring Committee,
I am applying for the [role title] position advertised on [source].
In my [real project or role], I [specific action and result]. This
experience helped me develop [skill relevant to the vacancy].
I am interested in your team because [reason grounded in the advert].
By the interview date, I will have completed [relevant planned work],
if that statement is accurate. I would welcome the opportunity to
discuss how my experience matches the role.
Sincerely,
[Your name]
Rules and checks:
- Use the exact role title and check the employer's instructions.
- Give one concrete example of your own work; never invent experience.
- Link each example to a skill the vacancy actually requests.
- Use past forms for completed achievements and future forms for plans.
- Keep the close polite; check the name, role and contact details.
Practice: choose a real vacancy and write 100-120 words using only
experience you can explain and support. Mark any missing detail.

3) ACADEMIC OPINION ESSAY
Purpose: state a position, support it and consider a limitation.
Practice question: Should an imagined city expand renewable energy?
An imagined city is considering a proposal to expand solar and wind
power. The proposal could reduce reliance on some existing energy
sources, but its value depends on cost, reliability and fair access.
If the first phase meets its targets, the city will have tested new
capacity before deciding whether to expand it. Supporters should
explain how the plan would be funded; critics should identify
specific risks rather than dismissing it without evidence.
A cautious, evaluated trial is more defensible than an unsupported
promise of complete success.
Rules and checks:
- Answer the question with a clear position rather than a slogan.
- Give a reason and explain how it supports the position.
- Distinguish an imagined scenario, a proposal and an established fact.
- Discuss a relevant limitation and explain your response to it.
- Use a conclusion that follows from the argument; invent no statistics.
Practice: write 120-150 words on the question. Include one supporting
reason, one limitation and a conclusion. Cite any real factual claim.

4) FORMAL COMPLAINT LETTER
Purpose: explain the problem and ask for a practical remedy.
Subject: Delayed Order [order reference]
Dear Customer Service Team,
I am writing about order [reference], placed on [date]. The promised
delivery date was [date], but the order has not arrived. I contacted
support on [date] and have not yet received a revised delivery date.
By next Monday, two weeks will have passed since the promised date.
Please confirm the order status and explain the available delivery
or refund options. I have attached [relevant evidence, if available].
I would appreciate a reply by [reasonable date].
Yours faithfully,
[Your name]
Rules and checks:
- Present dates and events in order; use only facts you can verify.
- Include the reference number, but no unnecessary sensitive data.
- State the remedy you want without threats or unsupported legal claims.
- Use Present Perfect for an unresolved problem and past forms for dates.
- Check attachments exist before saying they are attached.
Practice: write 100-120 words about a clearly labelled fictional
purchase. Include the timeline, problem, requested remedy and reply date.

5) UNIVERSITY PERSONAL STATEMENT
Purpose: explain academic interest with specific evidence and reflection.
My interest in [subject] developed through [your real experience].
During [project or activity], I [what you actually did]. The work
showed me [what you learned] and raised a question about [topic].
I explored that question by [reading, practice or another real step].
I now want to study [specific area] in more depth. By the start of the
course, I will have completed [accurate preparation plan]. I hope to
contribute [specific interest or experience] while developing the
skills needed for [thoughtful academic or career goal].
Rules and checks:
- Follow the university's current prompt and word limit.
- Use specific real examples rather than a list of flattering adjectives.
- Explain what you learned and why it connects to the subject.
- Distinguish completed experience from preparation you only plan to do.
- Check every personal claim and remove details you cannot support.
Practice: write 120-150 words about your own academic interest.
Include one example, one reflection and one preparation goal.

FINAL SELF-CHECK FOR ALL FIVE TASKS
Who is the reader, and what do they need to know or do?
Is the purpose clear, with relevant details in a logical order?
Are facts, examples and plans clearly distinguished?
Are tense, agreement, spelling and punctuation consistent?
Have you replaced every bracketed field and checked the task length?

==========================================================`,
  },
];
