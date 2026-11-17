// Original teaching scenarios. Levels are study guidance, not certification.
export const LITERACY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export interface ReadingFollowUp { question: string; options: string[]; answer: number; explanation: string; }
export interface LiteracyReading { followUp?: ReadingFollowUp; id: string; level: string; title: string; titleAr: string; image: string; imageSource: string; content: string; question: string; options: string[]; answer: number; word: string; meaning: string; }
export interface LiteracyWriting { id: string; level: string; title: string; titleAr: string; image: string; imageSource: string; prompt: string; model: string; }
export const LITERACY_READING: LiteracyReading[] = [
  {
    "id": "literacy-1",
    "level": "A1",
    "title": "A new class",
    "titleAr": "فصل جديد",
    "image": "/images/literacy/literacy-1.webp",
    "imageSource": "",
    "content": "My name is Salma. I am a student. My English class is on Monday. There are eight students in my class. I bring a blue notebook to every lesson.",
    "question": "When is the class?",
    "options": [
      "On Monday",
      "On Friday",
      "Every morning"
    ],
    "answer": 0,
    "word": "Monday",
    "meaning": "الاثنين"
  },
  {
    "id": "literacy-2",
    "level": "A1",
    "title": "At the cafe",
    "titleAr": "في المقهى",
    "image": "/images/literacy/literacy-2.webp",
    "imageSource": "",
    "content": "Adam is at a small cafe. He wants tea and a cheese sandwich. His friend wants water. They sit near the window. Adam pays before they leave.",
    "question": "What does the friend want?",
    "options": [
      "Tea",
      "A sandwich",
      "Water"
    ],
    "answer": 2,
    "word": "water",
    "meaning": "ماء"
  },
  {
    "id": "literacy-3",
    "level": "A1",
    "title": "Market morning",
    "titleAr": "صباح السوق",
    "image": "/images/literacy/literacy-3.webp",
    "imageSource": "",
    "content": "Mona goes to the market with a bag. She buys tomatoes, apples and bread. She does not buy milk because she has milk at home. She walks home with her brother.",
    "question": "Why does she not buy milk?",
    "options": [
      "She has no bag",
      "She has some at home",
      "The market is closed"
    ],
    "answer": 1,
    "word": "home",
    "meaning": "المنزل"
  },
  {
    "id": "literacy-4",
    "level": "A1",
    "title": "My study desk",
    "titleAr": "مكتب المذاكرة",
    "image": "/images/literacy/literacy-4.webp",
    "imageSource": "",
    "content": "This is my desk. A notebook is next to my computer. My phone is in my bag. I study here after lunch. At five, I close the computer and go for a walk.",
    "question": "Where is the phone?",
    "options": [
      "In the bag",
      "On the desk",
      "Under the computer"
    ],
    "answer": 0,
    "word": "bag",
    "meaning": "حقيبة"
  },
  {
    "id": "literacy-5",
    "level": "A1",
    "title": "A library visit",
    "titleAr": "زيارة المكتبة",
    "image": "/images/literacy/literacy-5.webp",
    "imageSource": "",
    "content": "Nour likes the library. It opens at nine. She reads a short story there. She cannot eat inside, so she eats her lunch in the garden. Then she chooses another book.",
    "question": "Where does Nour eat?",
    "options": [
      "In the library",
      "At home",
      "In the garden"
    ],
    "answer": 2,
    "word": "garden",
    "meaning": "حديقة"
  },
  {
    "id": "literacy-6",
    "level": "A1",
    "title": "The weekend walk",
    "titleAr": "نزهة العطلة",
    "image": "/images/literacy/literacy-6.webp",
    "imageSource": "",
    "content": "On Saturday, Ali and his sister walk to a park. They cross a wooden bridge. Ali takes a photo of a tree. His sister sits on a bench. They return home before dinner.",
    "question": "What does Ali photograph?",
    "options": [
      "His dinner",
      "A tree",
      "A bridge"
    ],
    "answer": 1,
    "word": "tree",
    "meaning": "شجرة"
  },
  {
    "id": "literacy-7",
    "level": "A2",
    "title": "A delayed flight",
    "titleAr": "رحلة متأخرة",
    "image": "/images/literacy/literacy-7.webp",
    "imageSource": "",
    "content": "Lina arrived at the airport early, but her flight was delayed. An announcement said the plane would leave two hours later. She called her cousin, who was waiting at the destination. Lina bought a book and found a seat near the gate. She checked the screen regularly to avoid missing the new boarding time.",
    "question": "Why did Lina call her cousin?",
    "options": [
      "To explain the delay",
      "To buy a ticket",
      "To cancel a book"
    ],
    "answer": 0,
    "word": "delayed",
    "meaning": "متأخر"
  },
  {
    "id": "literacy-8",
    "level": "A2",
    "title": "A new colleague",
    "titleAr": "زميل جديد",
    "image": "/images/literacy/literacy-8.webp",
    "imageSource": "",
    "content": "When Sam joined the team, he did not know where to find the shared files. Maya offered to help. She showed him the folders and wrote down the steps. The next day, Sam found a file without asking anyone. He thanked Maya and offered to help the next new team member.",
    "question": "What helped Sam work independently?",
    "options": [
      "A new computer",
      "A day off",
      "Maya's written steps"
    ],
    "answer": 2,
    "word": "steps",
    "meaning": "خطوات"
  },
  {
    "id": "literacy-9",
    "level": "A2",
    "title": "Learning at home",
    "titleAr": "التعلم في المنزل",
    "image": "/images/literacy/literacy-9.webp",
    "imageSource": "",
    "content": "Hala used to study with her phone beside her notebook. She often stopped to read messages. Last week, she put her phone in another room. She still took short breaks, but she finished her homework earlier. She decided to keep this routine for another week before judging the result.",
    "question": "What did Hala change?",
    "options": [
      "She bought a notebook",
      "She moved her phone",
      "She stopped taking breaks"
    ],
    "answer": 1,
    "word": "room",
    "meaning": "غرفة"
  },
  {
    "id": "literacy-10",
    "level": "A2",
    "title": "The missing book",
    "titleAr": "الكتاب المفقود",
    "image": "/images/literacy/literacy-10.webp",
    "imageSource": "",
    "content": "Omar borrowed a book and promised to return it on Thursday. On Wednesday, he could not find it. He searched his bedroom, then remembered reading on the bus. He called the bus office. Luckily, a driver had found the book. Omar collected it the next morning and kept his promise.",
    "question": "Where was the book found?",
    "options": [
      "On the bus",
      "In the bedroom",
      "At a shop"
    ],
    "answer": 0,
    "word": "bus",
    "meaning": "حافلة"
  },
  {
    "id": "literacy-11",
    "level": "A2",
    "title": "A train trip",
    "titleAr": "رحلة بالقطار",
    "image": "/images/literacy/literacy-11.webp",
    "imageSource": "",
    "content": "Sara wanted the early train, but all its seats were booked. She chose an afternoon train instead. This gave her time to have breakfast at home. She saved the tickets on her phone and printed a copy, because her battery sometimes ran out during long journeys.",
    "question": "Why did Sara print the tickets?",
    "options": [
      "Printed tickets were cheaper",
      "She had no phone",
      "Her battery might run out"
    ],
    "answer": 2,
    "word": "battery",
    "meaning": "بطارية"
  },
  {
    "id": "literacy-12",
    "level": "A2",
    "title": "A writing club",
    "titleAr": "نادي الكتابة",
    "image": "/images/literacy/literacy-12.webp",
    "imageSource": "",
    "content": "Four friends started a writing club. Each Friday, they wrote a story and read it aloud. At first, they corrected every mistake. Soon nobody wanted to share unfinished work. They changed the rule: first discuss the story, then suggest one improvement. More people began to bring drafts.",
    "question": "What changed in the club?",
    "options": [
      "They met every day",
      "Feedback became more focused",
      "They stopped writing"
    ],
    "answer": 1,
    "word": "improvement",
    "meaning": "تحسين"
  },
  {
    "id": "literacy-13",
    "level": "B1",
    "title": "The quiet workspace",
    "titleAr": "مساحة العمل الهادئة",
    "image": "/images/literacy/literacy-13.webp",
    "imageSource": "",
    "content": "The office manager wanted a quiet area for concentrated work. Some employees welcomed the idea, while others worried about losing easy access to colleagues. Rather than change the whole office, the manager tested one room for a month. People could book it when needed. Staff found it helpful for complex tasks, although less useful for collaborative projects. The manager kept the room but added a clear booking policy.",
    "question": "What was the manager's approach?",
    "options": [
      "Test a limited change first",
      "Close the entire office",
      "Ban teamwork permanently"
    ],
    "answer": 0,
    "word": "policy",
    "meaning": "سياسة أو قواعد تنظيمية",
    "followUp": {
      "question": "Why was keeping one bookable room a better response than making the whole office quiet?",
      "options": [
        "The room was useful for every kind of project",
        "Different tasks needed different working conditions",
        "Employees no longer needed to meet colleagues"
      ],
      "answer": 1,
      "explanation": "Staff found the room helpful for complex tasks but less useful for collaborative projects. A bookable room kept a useful option without removing access to colleagues."
    }
  },
  {
    "id": "literacy-14",
    "level": "B1",
    "title": "A community garden",
    "titleAr": "حديقة الحي",
    "image": "/images/literacy/literacy-14.webp",
    "imageSource": "",
    "content": "Residents wanted to turn an empty plot into a garden. They assumed everyone would prefer flowers. At a meeting, however, several families asked for vegetables and somewhere to sit. The group divided the plot into sections. Volunteers agreed on a watering schedule, and a carpenter repaired some benches. The final plan reflected more voices than the original design.",
    "question": "Why did the plan change?",
    "options": [
      "Flowers could not grow",
      "The plot was sold",
      "Residents had different needs"
    ],
    "answer": 2,
    "word": "however",
    "meaning": "مع ذلك",
    "followUp": {
      "question": "What did the meeting reveal about the first design?",
      "options": [
        "It included every family request",
        "Vegetables were impossible to grow",
        "The group had assumed a preference that not everyone shared"
      ],
      "answer": 2,
      "explanation": "The first design assumed that everyone wanted flowers. Families also wanted vegetables and seats, so the group divided the plot to include those needs."
    }
  },
  {
    "id": "literacy-15",
    "level": "B1",
    "title": "The feedback meeting",
    "titleAr": "اجتماع المراجعة",
    "image": "/images/literacy/literacy-15.webp",
    "imageSource": "",
    "content": "After a presentation went badly, Rami expected criticism of his speaking. Instead, his manager asked what the audience needed to decide. They noticed that his slides contained details but no clear recommendation. Rami shortened the background and put his main proposal first. His next presentation did not answer every possible question, but the audience understood the decision he was asking them to make.",
    "question": "What was the main problem?",
    "options": [
      "The room was too small",
      "The recommendation was unclear",
      "Rami spoke too quietly"
    ],
    "answer": 1,
    "word": "recommendation",
    "meaning": "توصية",
    "followUp": {
      "question": "What made the next presentation more useful to the audience?",
      "options": [
        "Its main proposal made the requested decision easier to understand",
        "It included every possible background detail",
        "It avoided asking the audience to make a decision"
      ],
      "answer": 0,
      "explanation": "Rami put his main proposal first and shortened the background. The audience then understood the decision, even though some possible questions remained unanswered."
    }
  },
  {
    "id": "literacy-16",
    "level": "B1",
    "title": "A reading journal",
    "titleAr": "دفتر القراءة",
    "image": "/images/literacy/literacy-16.webp",
    "imageSource": "",
    "content": "Dina wrote long summaries after every book. She found this so tiring that she gradually stopped reading for pleasure. Then she tried a shorter journal: one question, one useful phrase and one personal response. It did not record every detail, but helped her notice patterns across books. She treats it as a conversation with the text rather than a test of memory.",
    "question": "What describes the new method?",
    "options": [
      "A personal response to reading",
      "A record of every detail",
      "A memory examination"
    ],
    "answer": 0,
    "word": "rather",
    "meaning": "بدلا من، في rather than",
    "followUp": {
      "question": "Why was a shorter journal a reasonable change for Dina?",
      "options": [
        "It guaranteed that she remembered every detail",
        "It supported engagement with books without an exhausting summary task",
        "It meant she could stop responding to books"
      ],
      "answer": 1,
      "explanation": "Long summaries had made reading tiring. The shorter journal still helped Dina notice patterns and respond personally, without recording every detail of a book."
    }
  },
  {
    "id": "literacy-17",
    "level": "B1",
    "title": "The repair workshop",
    "titleAr": "ورشة الإصلاح",
    "image": "/images/literacy/literacy-17.webp",
    "imageSource": "",
    "content": "A neighbourhood centre held a repair workshop. Visitors brought an object and stayed while a volunteer examined it. The organisers did not promise that everything could be fixed. Their aim was to show people how to investigate problems safely and decide whether repair was possible. Some left with working lamps; others learned why their appliances needed professional attention.",
    "question": "What was the main aim?",
    "options": [
      "Guarantee every repair",
      "Sell new appliances",
      "Teach a practical decision process"
    ],
    "answer": 2,
    "word": "safely",
    "meaning": "بأمان",
    "followUp": {
      "question": "Which outcome would still fit the purpose of the workshop?",
      "options": [
        "A visitor is told that every damaged object is safe to use",
        "A visitor buys a new appliance without discussing the old one",
        "A visitor learns why an appliance needs a professional rather than a volunteer repair"
      ],
      "answer": 2,
      "explanation": "The workshop aimed to teach safe investigation and a decision about whether repair was possible. A successful learning outcome did not require a working object."
    }
  },
  {
    "id": "literacy-18",
    "level": "B1",
    "title": "A change of route",
    "titleAr": "تغيير الطريق",
    "image": "/images/literacy/literacy-18.webp",
    "imageSource": "",
    "content": "A cycling group planned a challenging mountain route. Rain made part of the road unsafe. One member argued that changing the plan would waste weeks of preparation. Another said preparation should help them make better decisions, not prevent them from adapting. They chose a shorter route. Most later agreed that returning safely mattered more than following the original map.",
    "question": "Why did they change route?",
    "options": [
      "They lost the map",
      "Road conditions were unsafe",
      "Nobody had prepared"
    ],
    "answer": 1,
    "word": "adapting",
    "meaning": "التكيف",
    "followUp": {
      "question": "Which statement best expresses the lesson the group accepted?",
      "options": [
        "Preparation should support decisions when conditions change",
        "A prepared plan must be followed whatever happens",
        "Choosing a shorter route means nobody prepared properly"
      ],
      "answer": 0,
      "explanation": "Rain made part of the original road unsafe. The group used the changed conditions to choose a shorter route, rather than treating earlier preparation as a reason to ignore risk."
    }
  },
  {
    "id": "literacy-19",
    "level": "B2",
    "title": "Beyond the open office",
    "titleAr": "ما وراء المكتب المفتوح",
    "image": "/images/literacy/literacy-19.webp",
    "imageSource": "",
    "content": "The open-office debate is often framed as a choice between collaboration and privacy. Yet this overlooks the variety of tasks people perform. A designer may need conversation while exploring ideas and silence while developing a detailed plan. In this imagined redesign, a firm provides several kinds of space rather than expecting one layout to suit everyone. The proposal does not claim that a design guarantees productivity, but that employees should have meaningful choices and clear expectations.",
    "question": "What assumption is challenged?",
    "options": [
      "One layout suits every task",
      "People sometimes collaborate",
      "Workplaces need rules"
    ],
    "answer": 0,
    "word": "overlooks",
    "meaning": "يتجاهل",
    "followUp": {
      "question": "Which arrangement best follows the redesign proposal?",
      "options": [
        "Require everyone to work in silence all day",
        "Let employees choose suitable spaces with clear expectations",
        "Use one open layout for every task"
      ],
      "answer": 1,
      "explanation": "The proposal offers several spaces because people move between different kinds of work. It combines meaningful choice with clear expectations, not a promise of automatic productivity."
    }
  },
  {
    "id": "literacy-20",
    "level": "B2",
    "title": "Reading a headline",
    "titleAr": "قراءة العناوين بحذر",
    "image": "/images/literacy/literacy-20.webp",
    "imageSource": "",
    "content": "A headline says a study proves that a habit causes success. A careful reader asks what was measured. Perhaps the study only found that two things occurred together. Perhaps the sample was too narrow to support a broad conclusion. Neither possibility automatically makes the study worthless. They change how confidently its findings can be applied. Critical reading matches the strength of a claim to its evidence, rather than accepting or rejecting research as a whole.",
    "question": "What does the writer recommend?",
    "options": [
      "Reject all research",
      "Trust strong headlines",
      "Match confidence to evidence"
    ],
    "answer": 2,
    "word": "evidence",
    "meaning": "دليل",
    "followUp": {
      "question": "If a study only shows two things occurring together, what should the reader question?",
      "options": [
        "Whether the headline is justified in claiming one causes the other",
        "Whether all study findings must be false",
        "Whether research can ever be useful"
      ],
      "answer": 0,
      "explanation": "The passage contrasts a causal headline with evidence of things occurring together. The issue is the strength of that particular claim, not the value of all research."
    }
  },
  {
    "id": "literacy-21",
    "level": "B2",
    "title": "A museum without labels",
    "titleAr": "متحف بلا بطاقات",
    "image": "/images/literacy/literacy-21.webp",
    "imageSource": "",
    "content": "For an imagined exhibition, a curator removes the usual explanatory labels. Visitors describe what they notice before learning the objects' histories. Some enjoy the freedom; others find the lack of context frustrating. The curator adds optional information cards. This compromise preserves independent observation while recognising that interpretation is shaped by knowledge. Access to information and space for personal response need not be opposing goals.",
    "question": "Why add optional cards?",
    "options": [
      "To remove personal responses",
      "To balance context and observation",
      "To hide history"
    ],
    "answer": 1,
    "word": "compromise",
    "meaning": "حل وسط",
    "followUp": {
      "question": "Why does making the information optional matter?",
      "options": [
        "It prevents visitors from learning the history of the objects",
        "It proves that observation needs no knowledge",
        "It lets visitors seek context without forcing everyone to start with an explanation"
      ],
      "answer": 2,
      "explanation": "Some visitors wanted freedom to observe, while others wanted context. Optional cards allowed access to information without removing independent observation as a choice."
    }
  },
  {
    "id": "literacy-22",
    "level": "B2",
    "title": "The price of convenience",
    "titleAr": "ثمن السهولة",
    "image": "/images/literacy/literacy-22.webp",
    "imageSource": "",
    "content": "In a fictional town, a delivery service offers lower fees for a wider delivery window. Many people choose it. However, residents with unpredictable schedules find that waiting at home has its own cost. Discussion shifts from the checkout price to the flexibility required from customers. The service is convenient for some but burdensome for others. Evaluating convenience requires asking whose time is saved and whose is used.",
    "question": "What complicates convenience?",
    "options": [
      "Different people bear different time costs",
      "All deliveries are free",
      "Nobody uses delivery"
    ],
    "answer": 0,
    "word": "burdensome",
    "meaning": "مرهق",
    "followUp": {
      "question": "Which customer might find the lower fee less convenient overall?",
      "options": [
        "Someone who is freely available throughout the delivery window",
        "Someone whose changing schedule makes a long wait at home difficult",
        "Someone who wants to compare the fees"
      ],
      "answer": 1,
      "explanation": "The fictional example identifies residents with unpredictable schedules. The lower checkout price does not remove the time and flexibility they must give up."
    }
  },
  {
    "id": "literacy-23",
    "level": "B2",
    "title": "The first draft",
    "titleAr": "المسودة الأولى",
    "image": "/images/literacy/literacy-23.webp",
    "imageSource": "",
    "content": "A tutor asks students to separate drafting from editing. Some object that this encourages careless work. She replies that the distinction concerns timing, not standards. Drafting allows writers to discover what they mean; revision tests whether the text communicates it. Perfecting every sentence immediately can leave an elegant opening attached to an undeveloped argument. She expects accurate final work, but treats temporary uncertainty as part of the process rather than failure.",
    "question": "What does the tutor distinguish?",
    "options": [
      "Accuracy from good writing",
      "All drafting from thinking",
      "Stages of work from final standards"
    ],
    "answer": 2,
    "word": "temporary",
    "meaning": "مؤقت",
    "followUp": {
      "question": "Which practice would the tutor most likely support?",
      "options": [
        "Submit the first draft without checking it",
        "Perfect the first sentence before developing any argument",
        "Develop the argument in a draft,then revise for accurate communication"
      ],
      "answer": 2,
      "explanation": "The tutor separates when tasks happen from the quality expected at the end. Drafting develops meaning;revision checks whether the text communicates it accurately."
    }
  },
  {
    "id": "literacy-24",
    "level": "B2",
    "title": "A coastal decision",
    "titleAr": "قرار على الساحل",
    "image": "/images/literacy/literacy-24.webp",
    "imageSource": "",
    "content": "A fictional community considers a visitor centre. Supporters expect jobs and better facilities; opponents fear traffic and shoreline damage. Planners propose a smaller building, improved bus access and a review after one year. This does not remove uncertainty. It makes the trade-offs explicit and creates opportunities to adjust. A responsible proposal should include conditions for revision, rather than presenting uncertain benefits as guaranteed outcomes.",
    "question": "What makes the proposal responsible?",
    "options": [
      "It ignores transport",
      "It allows review and adjustment",
      "It promises certainty"
    ],
    "answer": 1,
    "word": "trade-offs",
    "meaning": "مفاضلات",
    "followUp": {
      "question": "What would be an appropriate purpose for the one-year review?",
      "options": [
        "Check whether the trade-offs require changes to the plan",
        "Prove that all predicted benefits were guaranteed from the start",
        "Remove any need to consider traffic or shoreline damage"
      ],
      "answer": 0,
      "explanation": "The proposal makes trade-offs explicit and allows adjustment. A review should therefore test the arrangement and guide changes, not turn uncertain forecasts into guaranteed outcomes."
    }
  },
  {
    "id": "literacy-25",
    "level": "C1",
    "title": "Who owns the archive?",
    "titleAr": "من يملك الأرشيف؟",
    "image": "/images/literacy/literacy-25.webp",
    "imageSource": "",
    "content": "An archive is often imagined as a neutral store of what happened. Yet collections embody choices about what was worth preserving and who had the means to leave records. This does not make archives useless. It makes their silences part of the evidence. A historian reading a landlord's records may learn about tenants without hearing them directly. The challenge is to acknowledge that asymmetry without filling gaps with confident invention. Responsible interpretation separates what a document establishes, what it makes plausible, and what remains unknown.",
    "question": "What are an archive's silences?",
    "options": [
      "Missing perspectives that shape interpretation",
      "Proof nothing happened",
      "Documents without words"
    ],
    "answer": 0,
    "word": "asymmetry",
    "meaning": "عدم تماثل",
    "followUp": {
      "question": "Which approach best follows the final sentence?",
      "options": [
        "Treat a plausible tenant motive as a fact",
        "Mark a tenant motive as uncertain when the record does not establish it",
        "Ignore all records written by landlords"
      ],
      "answer": 1,
      "explanation": "The passage separates established facts, plausible interpretations and unknowns. A missing perspective is not permission to invent a certain motive."
    }
  },
  {
    "id": "literacy-26",
    "level": "C1",
    "title": "The value of uncertainty",
    "titleAr": "قيمة عدم اليقين",
    "image": "/images/literacy/literacy-26.webp",
    "imageSource": "",
    "content": "Public communication often rewards certainty when evidence warrants caution. A spokesperson who qualifies a claim may sound less persuasive than one offering a simple promise. Yet removing uncertainty from the message does not remove it from the world. It transfers surprise to the audience when events unfold differently. Effective communication explains both a judgement and the conditions under which it might change. This is not an excuse for indecision: it requires a definite recommendation, clear limits, and willingness to revise when relevant evidence arrives.",
    "question": "What distinction underpins the argument?",
    "options": [
      "Confidence equals accuracy",
      "Recommendations must never change",
      "Uncertainty is not refusal to decide"
    ],
    "answer": 2,
    "word": "qualifies",
    "meaning": "يقيّد الادعاء بتحفظ",
    "followUp": {
      "question": "What would make a cautious recommendation useful rather than indecisive?",
      "options": [
        "Give a clear recommendation and say what evidence could change it",
        "Avoid giving any recommendation",
        "Make a promise without conditions"
      ],
      "answer": 0,
      "explanation": "The final sentences require a definite recommendation, clear limits and revision when relevant evidence arrives. Caution and a decision can coexist."
    }
  },
  {
    "id": "literacy-27",
    "level": "C1",
    "title": "Restoring a landscape",
    "titleAr": "استعادة مشهد طبيعي",
    "image": "/images/literacy/literacy-27.webp",
    "imageSource": "",
    "content": "Restoring a landscape raises a deceptively simple question: restore it to when? A hillside remembered as untouched may have been shaped by grazing and settlement for centuries. Choosing a historical reference point also chooses which human relationships to privilege. This need not paralyse conservation. It encourages planners to specify goals: protecting a habitat, reducing erosion, or preserving a cultural practice. Interventions can then be judged against explicit aims rather than an undefined ideal of original nature.",
    "question": "Why ask the opening question?",
    "options": [
      "To establish an exact date",
      "To expose an assumption about restoration",
      "To deny damage"
    ],
    "answer": 1,
    "word": "privilege",
    "meaning": "يمنح أولوية",
    "followUp": {
      "question": "Which plan would address the problem raised by the passage?",
      "options": [
        "Promise to return the hillside to its original state without defining that state",
        "Avoid every conservation decision",
        "Define habitat protection as the goal and assess interventions against it"
      ],
      "answer": 2,
      "explanation": "The writer asks planners to state goals such as habitat protection, so that interventions can be judged against explicit aims rather than an undefined past."
    }
  },
  {
    "id": "literacy-28",
    "level": "C1",
    "title": "Invisible translation choices",
    "titleAr": "خيارات المترجم الخفية",
    "image": "/images/literacy/literacy-28.webp",
    "imageSource": "",
    "content": "Readers praise translations that flow so naturally they forget they are translations. The compliment can conceal difficult choices about rhythm, ambiguity and cultural reference. Preserving every unfamiliar feature may burden readers; removing all of them may erase the original voice. No universal formula balances these demands. Individual decisions should serve a coherent understanding of the text and be explainable, rather than being defended simply because they sound natural in isolation.",
    "question": "What does the writer question?",
    "options": [
      "Fluency as the only measure of translation",
      "Understanding the original",
      "Cultural references existing"
    ],
    "answer": 0,
    "word": "coherent",
    "meaning": "متسق",
    "followUp": {
      "question": "Why might a very smooth sentence still be a weak translation?",
      "options": [
        "It may erase an ambiguity or voice that matters in the whole text",
        "Smooth language is always inaccurate",
        "A translation must preserve every unfamiliar feature"
      ],
      "answer": 0,
      "explanation": "The passage warns that removing unfamiliar features may erase the original voice. It also rejects a universal formula, so neither smoothness nor unfamiliarity is automatically right."
    }
  },
  {
    "id": "literacy-29",
    "level": "C1",
    "title": "Designing for maintenance",
    "titleAr": "التصميم من أجل الصيانة",
    "image": "/images/literacy/literacy-29.webp",
    "imageSource": "",
    "content": "A digital service is presented at launch, when its interface is clean and promises are easy to demonstrate. Less visible is the work of correcting errors, updating instructions and helping users recover from failure. Treating this as an afterthought creates a misleading picture of innovation. A service that cannot be maintained may impose continuing costs on those who rely on it. Designing for maintenance makes repair, ownership and eventual replacement part of the original proposal.",
    "question": "What is the central criticism?",
    "options": [
      "Interfaces must never change",
      "Every service is harmful",
      "Launch-focused thinking hides continuing responsibilities"
    ],
    "answer": 2,
    "word": "afterthought",
    "meaning": "أمر لم يؤخذ في الحسبان أولا",
    "followUp": {
      "question": "Which question belongs in the original service proposal?",
      "options": [
        "How can the launch avoid mentioning later costs?",
        "Who will correct errors and support users after launch?",
        "How can the interface remain unchanged forever?"
      ],
      "answer": 1,
      "explanation": "The passage places repair, ownership and replacement inside the original proposal. It challenges the idea that responsibility ends at launch."
    }
  },
  {
    "id": "literacy-30",
    "level": "C1",
    "title": "When measures become targets",
    "titleAr": "حين يصبح المقياس هدفا",
    "image": "/images/literacy/literacy-30.webp",
    "imageSource": "",
    "content": "A college rewards students for the number of books finished. The count is easy to compare, but students choose shorter books and avoid difficult ones. Nothing explicitly forbids challenging reading; nevertheless, the incentive changes what feels worthwhile. This does not show measurement is always harmful. It shows that a convenient indicator can drift from its original purpose. Better evaluation combines evidence and asks whether success on the measure still reflects success in the activity.",
    "question": "What goes wrong?",
    "options": [
      "The rule bans difficult books",
      "The indicator distracts from the original purpose",
      "Books cannot be counted"
    ],
    "answer": 1,
    "word": "incentive",
    "meaning": "حافز",
    "followUp": {
      "question": "Which new result would most clearly repeat the problem in the passage?",
      "options": [
        "Students discuss challenging passages in more detail",
        "The college considers reading reflections as well as counts",
        "Completion counts rise while students avoid demanding books"
      ],
      "answer": 2,
      "explanation": "The original purpose concerns reading, but the reward encourages easy-to-count completions. A rising count can therefore hide movement away from the activity being valued."
    }
  },
  {
    "id": "literacy-31",
    "level": "C2",
    "title": "The rhetoric of inevitability",
    "titleAr": "بلاغة الحتمية",
    "image": "/images/literacy/literacy-31.webp",
    "imageSource": "",
    "content": "Describing technological change as inevitable does more than predict it. It narrows responses considered legitimate: if a future cannot be altered, debate appears wasted. Yet technology depends on choices about funding, regulation and access. Recognising these does not imply that any outcome can be produced at will. It rejects the false opposition between total control and helplessness. The useful question is which decisions remain open, who can influence them, and what obligations follow from exercising that influence.",
    "question": "What effect is examined?",
    "options": [
      "Making contestable choices seem beyond debate",
      "Proving every prediction correct",
      "Showing total control is possible"
    ],
    "answer": 0,
    "word": "legitimate",
    "meaning": "مشروع أو مقبول",
    "followUp": {
      "question": "Which response avoids the false opposition the writer rejects?",
      "options": [
        "Assume all technological outcomes can be freely chosen",
        "Identify decisions about funding and access that remain open",
        "Treat every form of debate as pointless"
      ],
      "answer": 1,
      "explanation": "The writer rejects both total control and helplessness. Asking which decisions remain open preserves a limited but real role for choice."
    }
  },
  {
    "id": "literacy-32",
    "level": "C2",
    "title": "An unreliable narrator",
    "titleAr": "راو غير موثوق",
    "image": "/images/literacy/literacy-32.webp",
    "imageSource": "",
    "content": "When the narrator insists he remembers the evening perfectly, the reader has already noticed two contradictions. The insistence has the opposite of its apparent purpose: rather than reassuring us, it reveals the effort of sounding reliable. This does not mean every detail is false. His evasions may reveal more about his priorities than a confession would. Reading requires holding competing possibilities in view, attending to what is said and to what the speaker cannot comfortably acknowledge.",
    "question": "How does the assurance work?",
    "options": [
      "It resolves every contradiction",
      "It proves all details false",
      "It intensifies suspicion"
    ],
    "answer": 2,
    "word": "evasions",
    "meaning": "مراوغات",
    "followUp": {
      "question": "What can the contradictions justify without proving too much?",
      "options": [
        "Questioning the narrator while leaving open which details are accurate",
        "Rejecting every detail as false",
        "Accepting the assurances because they are repeated"
      ],
      "answer": 0,
      "explanation": "The passage explicitly says that not every detail must be false. Contradictions support a questioning reading, not a complete verdict on every statement."
    }
  },
  {
    "id": "literacy-33",
    "level": "C2",
    "title": "The ethics of a blank space",
    "titleAr": "أخلاق المساحة الخالية",
    "image": "/images/literacy/literacy-33.webp",
    "imageSource": "",
    "content": "Reconstructing a life from fragmentary records, a biographer may turn a plausible motive into a settled explanation. Narrative continuity rewards the move: a smooth account is easier to follow than admissions of ignorance. But the convenience belongs to the storyteller, while attributed certainty belongs to someone unable to contest it. Leaving a gap can be ethical as well as evidential. Interpretation should make visible the boundary between documented action and imaginative reconstruction, especially when invention risks becoming the reader's only memory of the subject.",
    "question": "Why can leaving a gap be ethical?",
    "options": [
      "It removes interpretation",
      "It avoids presenting speculation as certain motive",
      "It guarantees entertainment"
    ],
    "answer": 1,
    "word": "fragmentary",
    "meaning": "مجزأ",
    "followUp": {
      "question": "Who carries the risk when a smooth biography presents an invented motive as certain?",
      "options": [
        "Only the storyteller who wanted a smooth account",
        "Nobody,because a plausible account is always accurate",
        "The subject,whose supposed certainty cannot be contested"
      ],
      "answer": 2,
      "explanation": "The passage contrasts convenience for the storyteller with certainty attributed to a person unable to contest it. The boundary between record and reconstruction therefore matters."
    }
  },
  {
    "id": "literacy-34",
    "level": "C2",
    "title": "A language of belonging",
    "titleAr": "لغة الانتماء",
    "image": "/images/literacy/literacy-34.webp",
    "imageSource": "",
    "content": "An institution may proclaim everyone belongs while leaving its everyday language unchanged. The discrepancy need not be deliberate to matter. A welcome expressed in specialist shorthand assumes the familiarity newcomers lack. Simplifying need not strip precision away; it can make the path into precision visible. Definitions, examples and questions redistribute the burden of understanding. Belonging is less a feeling an organisation can announce than a practice tested in ordinary encounters.",
    "question": "What distinction structures the passage?",
    "options": [
      "Announced inclusion versus enacted access",
      "Precision versus all explanation",
      "Newcomers versus all specialists"
    ],
    "answer": 0,
    "word": "discrepancy",
    "meaning": "تباين",
    "followUp": {
      "question": "Which change best puts the stated welcome into practice?",
      "options": [
        "Keep specialist shorthand and repeat that everyone belongs",
        "Add definitions and examples that help newcomers approach precise language",
        "Remove all precise terms without explaining the subject"
      ],
      "answer": 1,
      "explanation": "Definitions, examples and questions make the path into precision visible. The argument is about sharing the work of understanding, not abandoning precision."
    }
  },
  {
    "id": "literacy-35",
    "level": "C2",
    "title": "What a map leaves out",
    "titleAr": "ما تستبعده الخريطة",
    "image": "/images/literacy/literacy-35.webp",
    "imageSource": "",
    "content": "A map including everything would cease to be useful as a map. Selection is a condition of representation, not an accidental flaw. The question is whether simplifications suit the decisions a model supports. A hiking map and a property map can truthfully depict the same ground while foregrounding different relationships. Trouble starts when the authority of one purpose is silently carried into another, turning a partial view into an exhaustive account. The remedy is a clearer scope, not a fantasy of perspective-free vision.",
    "question": "How should simplification be judged?",
    "options": [
      "Total number of details",
      "Claims of no perspective",
      "Fitness for the decision and stated scope"
    ],
    "answer": 2,
    "word": "exhaustive",
    "meaning": "شامل لكل التفاصيل",
    "followUp": {
      "question": "When would the use of a map become misleading according to the passage?",
      "options": [
        "When it leaves out any detail at all",
        "When two maps emphasise different relationships",
        "When a map made for one purpose is treated as a complete account for another"
      ],
      "answer": 2,
      "explanation": "Selection is necessary for a useful map. The problem arises when authority for one purpose is silently transferred to another without stating the limits."
    }
  },
  {
    "id": "literacy-36",
    "level": "C2",
    "title": "Against effortless prose",
    "titleAr": "ضد وهم الكتابة السهلة",
    "image": "/images/literacy/literacy-36.webp",
    "imageSource": "",
    "content": "Effortless prose may conceal labour, but celebrating labour alone misses the point. Revision matters when it brings readers' experience into a better relation with the writer's intention. Sometimes this requires removing an elegant sentence whose function has disappeared. Sometimes it means preserving an awkward detail because smoothing it away would distort the subject. The standard is neither ease nor difficulty, but fidelity to what the text needs to do. Style is not decoration applied to an argument; it shapes how the argument becomes thinkable.",
    "question": "What governs effective revision?",
    "options": [
      "Elegance of every sentence",
      "Faithfully fulfilling the text's purpose",
      "Pain experienced by the writer"
    ],
    "answer": 1,
    "word": "fidelity",
    "meaning": "أمانة",
    "followUp": {
      "question": "Why might a good revision preserve an awkward detail?",
      "options": [
        "Removing it could distort what the text needs to convey",
        "Awkward writing always shows greater effort",
        "Every original sentence must remain unchanged"
      ],
      "answer": 0,
      "explanation": "The passage judges revision by fidelity to the purpose of the text. It allows both removal and preservation, depending on the effect on the subject and the reader."
    }
  }
];
export const LITERACY_WRITING: LiteracyWriting[] = [
  {
    "id": "literacy-writing-1",
    "level": "A1",
    "title": "Introduce yourself",
    "titleAr": "قدّم نفسك",
    "prompt": "Write 4 sentences introducing yourself to a class. Include a name, a place and an interest.",
    "model": "My name is Hana. I live in Cairo. I am a student. I like reading.",
    "image": "/images/literacy/literacy-writing-1.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-2",
    "level": "A1",
    "title": "Describe a friend",
    "titleAr": "صف صديقا",
    "prompt": "Write 4 sentences about a friend. Include a quality and an activity.",
    "model": "My friend is Karim. He is kind. We study English together. He helps me with new words.",
    "image": "/images/literacy/literacy-writing-2.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-3",
    "level": "A1",
    "title": "My routine",
    "titleAr": "روتيني اليومي",
    "prompt": "Describe your morning in order. Use first and then.",
    "model": "First, I get up at seven. I wash my face. Then I have breakfast. I walk to work.",
    "image": "/images/literacy/literacy-writing-3.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-4",
    "level": "A1",
    "title": "Describe a place",
    "titleAr": "صف مكانا",
    "prompt": "Describe your desk. Say where two objects are.",
    "model": "My desk is near the window. A notebook is next to my laptop. My bag is under the desk.",
    "image": "/images/literacy/literacy-writing-4.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-5",
    "level": "A1",
    "title": "Invite a friend",
    "titleAr": "ادع صديقا",
    "prompt": "Invite a friend to tea. Include a day, time and place.",
    "model": "Hi Dina, please come for tea on Saturday at five. We can meet at my home. Are you free?",
    "image": "/images/literacy/literacy-writing-5.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-6",
    "level": "A1",
    "title": "Say thank you",
    "titleAr": "اكتب رسالة شكر",
    "prompt": "Thank a classmate for help with your homework.",
    "model": "Hi Omar, thank you for your help. The homework is clear now. You are a good friend. See you tomorrow.",
    "image": "/images/literacy/literacy-writing-6.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-7",
    "level": "A2",
    "title": "A travel diary",
    "titleAr": "يوميات سفر",
    "prompt": "Describe an imagined day out in the past. Say who was there and how you felt.",
    "model": "Last Saturday, I went to the beach with my cousins. We walked and took photos. It was windy, but we enjoyed the day.\n\nWe ate our lunch near the water. After lunch, my cousin showed me a small shop, and I bought a postcard. We went home by bus in the afternoon. I was tired, but I was happy to spend time with my family.",
    "image": "/images/literacy/literacy-writing-7.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-8",
    "level": "A2",
    "title": "Change a meeting",
    "titleAr": "غيّر موعد لقاء",
    "prompt": "Ask to change a study meeting. Give a reason and suggest another time.",
    "model": "Hi Sara, can we meet at four instead of three? I have an appointment. Please tell me if four works for you.\n\nWe can still meet at the library entrance. I will bring my notebook and the practice questions. If four is too late, we can choose another day. I am free on Wednesday afternoon too. Thank you for understanding.",
    "image": "/images/literacy/literacy-writing-8.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-9",
    "level": "A2",
    "title": "Ask for directions",
    "titleAr": "اطلب وصف الطريق",
    "prompt": "Ask a learning centre how to get there from the station.",
    "model": "Hello, I am coming to your centre tomorrow. Could you tell me how to get there from the station? Can I walk?\n\nMy train arrives at half past nine, and the class starts at ten. I do not know the area well. Is there a bus stop near the centre? Please also tell me which entrance I should use. Thank you for your help.",
    "image": "/images/literacy/literacy-writing-9.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-10",
    "level": "A2",
    "title": "Review a cafe",
    "titleAr": "راجع تجربة مقهى",
    "prompt": "Review an imagined cafe. Mention a good point and something to improve.",
    "model": "The staff were friendly and the tea was good. However, the music was too loud for studying. I would prefer a quieter table.\n\nI visited this imagined cafe with a friend on Saturday afternoon. We ordered sandwiches and sat near the window. Our food arrived quickly, and the table was clean. I would go there again to meet a friend, but not to do my homework.",
    "image": "/images/literacy/literacy-writing-10.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-11",
    "level": "A2",
    "title": "Describe a scene",
    "titleAr": "صف مشهدا",
    "prompt": "Describe an imagined outdoor scene. Separate what you see from what you guess.",
    "model": "In the picture, the sun is rising behind the hills. The sky is orange. The place looks peaceful, but I cannot tell how warm it is.\n\nThere is a path beside the trees, and I cannot see any people. The ground looks dark. It may be wet, but the picture does not show this clearly. I would like to walk there and see what is behind the hill.",
    "image": "/images/literacy/literacy-writing-11.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-12",
    "level": "A2",
    "title": "An apology",
    "titleAr": "رسالة اعتذار",
    "prompt": "Apologise for a missed call. Offer a new time.",
    "model": "Hi Nour, I am sorry I missed your call. I was at work. Can I call you this evening at eight?\n\nI saw your message after my meeting. I am at home now, but I need to finish one small job before we talk. If eight is not a good time, please send me a message. I am free tomorrow morning too.",
    "image": "/images/literacy/literacy-writing-12.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-13",
    "level": "B1",
    "title": "Request course details",
    "titleAr": "اطلب تفاصيل دورة",
    "prompt": "Ask about a course timetable, fees and entry requirements.",
    "model": "Dear Course Team, I am interested in your English course. Could you send me the timetable and current fees? Is there an entry test?\n\nI work during the day, so I am looking for an evening class. I would also like to know how many students usually study in one group and whether course materials are included in the price. If a place is available, please explain how I can apply.\n\nThank you for your time. I look forward to hearing from you.\n\nBest regards,\nLina",
    "image": "/images/literacy/literacy-writing-13.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-14",
    "level": "B1",
    "title": "A cover letter",
    "titleAr": "خطاب تقديم",
    "prompt": "Apply for an imagined assistant role. Connect a skill to a job task.",
    "model": "Dear Hiring Manager, I am applying for the assistant role. In my previous role, I organised appointments and answered questions. I would like to bring these skills to your team.\n\nFor example, I kept a shared calendar and checked meeting details before sending reminders. When a customer asked a question I could not answer, I wrote it down and passed it to the right person. This helped me give clear information without guessing.\n\nI would welcome the chance to discuss the role and learn more about your team.\n\nKind regards,\nSamira",
    "image": "/images/literacy/literacy-writing-14.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-15",
    "level": "B1",
    "title": "A polite complaint",
    "titleAr": "شكوى مهذبة",
    "prompt": "Describe an imagined damaged delivery and request a replacement.",
    "model": "Dear Customer Service Team, the notebook I ordered arrived with a torn cover. Could you arrange a replacement? I can provide a photo of the damage.\n\nThe parcel arrived yesterday, and the notebook has not been used. The pages inside look fine, but the cover does not close properly. Please tell me whether I should return the damaged notebook and how to do this. I would prefer a replacement rather than a different product.\n\nPlease confirm the next step when you have checked the order. Thank you for your help.",
    "image": "/images/literacy/literacy-writing-15.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-16",
    "level": "B1",
    "title": "Explain a process",
    "titleAr": "اشرح خطوات",
    "prompt": "Explain how to prepare for a first class. Use sequence words.",
    "model": "First, check the class time and location. Next, bring a notebook and a pen. Finally, arrive a little early so you can find your room.\n\nIf the class is online, test the meeting link before the lesson starts. Find a quiet place and check that you can hear the sound. You do not need to understand every new word on the first day. Write down questions and ask the teacher when you have a chance.\n\nAfter the lesson, read your notes again and choose one thing to practise before the next class.",
    "image": "/images/literacy/literacy-writing-16.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-17",
    "level": "B1",
    "title": "Recommend a book",
    "titleAr": "رشّح كتابا",
    "prompt": "Recommend an imagined story. Explain who might enjoy it.",
    "model": "I recommend this imagined family story. The language is clear and the ending makes you think. If you enjoy stories about difficult choices, you may like it.\n\nThe story follows two sisters who find an old letter while preparing to move house. They disagree about whether to show it to their mother. I enjoyed the conversations because both sisters have understandable reasons for their choices. Some scenes are slow, but they help the reader notice small changes in the family.\n\nI would recommend it to a reading group because there is plenty to discuss without giving away the ending.",
    "image": "/images/literacy/literacy-writing-17.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-18",
    "level": "B1",
    "title": "Give an opinion",
    "titleAr": "عبّر عن رأيك",
    "prompt": "Explain whether a college should have a quiet study room. Give a reason and example.",
    "model": "I think our college needs a quiet study room. Some students cannot concentrate in a busy library. For example, a separate room could help them revise before exams.\n\nThis does not mean that talking should be banned everywhere. Group work is useful, and students also need places where they can ask questions. A clearly marked quiet room would give people a choice without changing the whole library. The college could try this in one room for a month and ask students for feedback.\n\nIf the trial works well, the room could become a regular part of the study space.",
    "image": "/images/literacy/literacy-writing-18.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-19",
    "level": "B2",
    "title": "A project update",
    "titleAr": "تحديث مشروع",
    "prompt": "Write an imagined update: progress, risk, next step.",
    "model": "The draft guide is complete, and the team is reviewing it. However, two examples still need permission. We will publish only after those permissions are confirmed.\n\nThis week, the reviewers are checking that each instruction matches the current process. They will record unclear steps in the shared document rather than changing the live service. The main risk is that the permissions may arrive after the planned publication date. If that happens, we can either delay the guide or replace the examples with ones we are allowed to use.\n\nThe next update will confirm which option is possible. Until then, the publication date should be treated as provisional.",
    "image": "/images/literacy/literacy-writing-19.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-20",
    "level": "B2",
    "title": "Compare options",
    "titleAr": "قارن خيارين",
    "prompt": "Compare online and classroom study for a working learner. Qualify your recommendation.",
    "model": "Online study offers flexibility, whereas classroom lessons provide a fixed routine. For someone with changing work hours, online study may be more practical, provided that regular study time is protected.\n\nThe choice also depends on the type of online course. Recorded lessons can be watched at different times, but a live session may be just as difficult to attend as a classroom lesson. Classroom study can make it easier to ask a quick question, although travel adds time and cost. Neither format guarantees regular practice.\n\nI would first compare the actual timetable, feedback and opportunities to speak. For this learner, a flexible course with scheduled feedback would be a sensible option to investigate, not an automatic best choice.",
    "image": "/images/literacy/literacy-writing-20.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-21",
    "level": "B2",
    "title": "A balanced review",
    "titleAr": "مراجعة متوازنة",
    "prompt": "Review an imagined library space. Include benefits and limitations.",
    "model": "The new area is bright and well organised. Its booking system makes busy periods easier to manage. Nevertheless, limited opening hours may exclude evening students.\n\nIn this imagined library, the quiet desks are separated from the group tables, so readers can choose a suitable space. Clear signs also make the different areas easy to find. The main limitation is that the building closes before some evening classes finish. A well-designed room offers little help to someone who cannot reach it while it is open.\n\nI would recommend the space for daytime study. Before recommending it more widely, I would want the library to review demand for later hours and explain what staffing that would require.",
    "image": "/images/literacy/literacy-writing-21.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-22",
    "level": "B2",
    "title": "Decline diplomatically",
    "titleAr": "ارفض بدبلوماسية",
    "prompt": "Decline an extra task because of current work. Offer a realistic alternative.",
    "model": "Thank you for considering me. I cannot take on the full report without delaying our agreed deadline. I could review the introduction on Thursday if that would help.\n\nMy current priority is to finish the course guide, including the final checks we agreed last week. The additional report would require research as well as writing, so fitting it into the same period would put both pieces of work at risk. I do not want to promise a date I cannot meet.\n\nIf the report is more urgent, we could discuss changing the order of the work. Otherwise, I can offer the limited review above and suggest questions for the person who takes the report forward.",
    "image": "/images/literacy/literacy-writing-22.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-23",
    "level": "B2",
    "title": "Summarise a proposal",
    "titleAr": "لخّص مقترحا",
    "prompt": "Summarise a proposal for a three-month book-exchange trial. Preserve its provisional status.",
    "model": "The club proposes a three-month trial of a monthly book exchange. Members would bring books they no longer need. Participation would be reviewed before deciding whether to continue.\n\nThe proposal suggests using the room after an existing club meeting, which could avoid the need for a separate booking. A volunteer would record the number of participants and note practical problems, such as books left behind. Members would not be required to bring a book every month. The plan has not yet been approved, and volunteer cover still needs to be confirmed.\n\nAt the end of the trial, the club would consider attendance and feedback alongside the work involved. The proposal does not commit the club to running a permanent exchange.",
    "image": "/images/literacy/literacy-writing-23.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-24",
    "level": "B2",
    "title": "Open a story",
    "titleAr": "افتتح قصة",
    "prompt": "Open a fictional story in an empty street. Introduce a detail that creates tension.",
    "model": "The street was almost empty when Leila left the station. Rain shone under the lamps. She reached for her ticket, but found a folded note in her pocket instead.\n\nIt was not the shopping list she had written that morning. The paper was thick and dry, and her name appeared on the outside in small, careful letters. She looked back at the station doors. A cleaner was stacking chairs inside, and the last passenger had already turned the corner.\n\nLeila opened the note beneath a lamp. There were only five words: Do not take the bridge. Across the road, the signal changed, although no car was waiting. She put the paper back in her pocket and stayed where she was.",
    "image": "/images/literacy/literacy-writing-24.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-25",
    "level": "C1",
    "title": "A cautious recommendation",
    "titleAr": "توصية محسوبة",
    "prompt": "Recommend a pilot project without overstating uncertain benefits.",
    "model": "I recommend a limited pilot, subject to an agreed review point. The proposal may improve access, but the current evidence does not establish how different groups would be affected.\n\nThe pilot should therefore test a specific question: whether an evening session helps residents who cannot attend during the day. Before it begins, the organisers should agree how attendance, waiting times and access problems will be recorded. Participation alone would not show that the service meets everyone's needs; feedback from people who could not attend would also matter.\n\nAt the review, the team should compare the practical benefits with the staffing required. Expansion should depend on that assessment, rather than on the assumption that a small trial will necessarily succeed at a larger scale.",
    "image": "/images/literacy/literacy-writing-25.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-26",
    "level": "C1",
    "title": "An executive summary",
    "titleAr": "ملخص تنفيذي",
    "prompt": "Summarise a fictional request for longer library hours when staffing is unresolved.",
    "model": "Students requested longer opening hours before exams. The consultation identifies a need, but staffing remains unresolved. A short evening trial would allow the college to assess demand before making a permanent commitment.\n\nThe immediate decision is therefore whether the college can support a trial, not whether extended hours should become a permanent service. A workable plan would need to identify who opens and closes the building, how students obtain help, and what happens if a staff member is absent. These arrangements should be costed before dates are announced.\n\nIf the trial proceeds, the review should consider both use of the space and the burden on staff. A busy first evening would be encouraging, but it would not by itself establish that the arrangement is sustainable.",
    "image": "/images/literacy/literacy-writing-26.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-27",
    "level": "C1",
    "title": "Challenge an assumption",
    "titleAr": "ناقش افتراضا",
    "prompt": "Challenge the idea that a longer guide is always more useful. Concede a reasonable point.",
    "model": "A longer guide can provide valuable detail. Its length, however, is not evidence of usefulness. Readers also need a clear structure and a quick route to the information required for their task.\n\nThere is a reasonable case for including exceptions, worked examples and explanations of unfamiliar terms. Removing them merely to achieve a shorter document could leave readers unable to act. The better distinction is between detail that supports a decision and detail that interrupts it. A short overview can explain the main steps, while clearly labelled sections preserve material needed only in particular circumstances.\n\nThe guide should then be tested with realistic questions. If readers repeatedly overlook an essential condition, adding another paragraph may be less effective than changing the heading or moving the condition beside the relevant step.",
    "image": "/images/literacy/literacy-writing-27.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-28",
    "level": "C1",
    "title": "A funding proposal",
    "titleAr": "مقترح تمويل",
    "prompt": "Propose a fictional reading space with purpose, delivery and evaluation. Invent no outcomes.",
    "model": "The proposed space would give residents somewhere quiet to study. Volunteers would supervise a weekly programme. Attendance and participant feedback would inform a review after the first term.\n\nThe initial programme would use an existing room for one evening each week. Before opening, the organisers would confirm access arrangements, a safeguarding contact and a named person responsible for each session. Volunteers would receive clear instructions about the support they can offer and when to refer a question elsewhere. The proposal does not assume that volunteers can replace specialist teaching.\n\nEvaluation would include recorded attendance, reasons for missed sessions where participants choose to share them, and comments on the space. No improvement in examination results is promised. The first review would determine whether the service is useful, manageable and worth continuing.",
    "image": "/images/literacy/literacy-writing-28.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-29",
    "level": "C1",
    "title": "An abstract",
    "titleAr": "ملخص بحث",
    "prompt": "Describe a proposed study of feedback. Make clear that there are no results yet.",
    "model": "This proposed study examines responses to written feedback. It would compare guided revision tasks with general comments. No data have yet been collected, so no claims about effectiveness are made.\n\nParticipants would revise a short piece of writing after receiving one of the two forms of feedback. A second task would explore whether they can apply the same point without further guidance. The analysis would distinguish changes made to the original draft from evidence of later independent use. These are related outcomes, but they should not be treated as interchangeable.\n\nParticipation would be voluntary, and the study would set out how writing samples are stored and anonymised. Any eventual report would describe the sample and the limits of the design. A difference between groups would require interpretation, not an automatic claim that one approach is best for every learner.",
    "image": "/images/literacy/literacy-writing-29.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-30",
    "level": "C1",
    "title": "Revise for concision",
    "titleAr": "راجع للإيجاز",
    "prompt": "Replace wordy expressions with clear verbs in a plan to review a procedure.",
    "model": "We plan to review the current procedure. The review will focus on unclear steps and avoid changing requirements that already work. We will explain the reasons for any proposed changes.\n\nFirst, we will ask staff to identify the points where they most often need clarification. We will then compare those questions with the written instructions. This will help us separate missing information from information that is present but difficult to find. We will test revised wording with a small group before asking the whole team to use it.\n\nThe final version will name the person responsible for each step and show where to report a problem. We will keep a record of the changes so that staff can understand what is different. The aim is a procedure people can follow, not a shorter document at any cost.",
    "image": "/images/literacy/literacy-writing-30.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-31",
    "level": "C2",
    "title": "A critical response",
    "titleAr": "استجابة نقدية",
    "prompt": "Discuss why fluency alone cannot measure translation quality.",
    "model": "Fluency matters, but it cannot be the sole measure of a translation. A readable sentence may erase ambiguity central to the original. The judgement must consider what kind of reading the source makes possible.\n\nImagine a fictional letter whose final line can be read as either an invitation or a dismissal. A translator who makes the intention explicit may produce a smoother sentence while settling a question the writer deliberately leaves open. Conversely, preserving every feature of the source in an unfamiliar form could create confusion that the original audience never experienced. Neither ease nor difficulty is inherently faithful.\n\nThe relevant judgement is therefore relational: what has changed, for which readers, and with what effect? A useful assessment would consider meaning, register, rhythm and purposeful uncertainty alongside readability. It would also acknowledge choices that cannot all be satisfied at once. Fluency remains an important achievement, but it is evidence to examine rather than a verdict that ends the discussion.",
    "image": "/images/literacy/literacy-writing-31.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-32",
    "level": "C2",
    "title": "A policy caveat",
    "titleAr": "قيد في توصية",
    "prompt": "Write a scoped policy recommendation and a condition for revising it.",
    "model": "The recommendation applies to the pilot sites only. Extension would require evidence of comparable support elsewhere. If implementation reveals unequal access, the policy should be revised rather than its assumptions defended at any cost.\n\nFor the pilot, each site should retain a staffed alternative to the new booking process. This is a precaution, not a prediction that the digital route will fail. The review should record whether people can complete the process, where they need help, and whether the alternative is available when they need it. A high overall completion rate could otherwise conceal a serious obstacle affecting a smaller group.\n\nThe decision to extend the policy should follow that review and include the resources needed to maintain both routes. If the evidence is incomplete, the appropriate response may be to continue a narrower trial. The condition for expansion is a service that people can actually use, not simply the successful installation of the software.",
    "image": "/images/literacy/literacy-writing-32.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-33",
    "level": "C2",
    "title": "An interpretation",
    "titleAr": "فقرة تأويلية",
    "prompt": "Interpret a fictional narrator who repeatedly insists he is calm. Do not claim certainty.",
    "model": "Repeated assurances of calm may suggest an effort to control perception. They do not prove the account false; rather, they invite attention to the tension between stated composure and the need to insist on it.\n\nIn the imagined passage, the narrator returns to the same assurance even when no other character has questioned his behaviour. One possible reading is that he anticipates the reader's suspicion and tries to answer it in advance. Another is that the repeated phrase offers reassurance to himself. The distinction matters: a defensive voice need not be a deliberately deceptive one.\n\nA stronger interpretation would connect this pattern with other details in the passage, such as interruptions, changes of tense or gaps in the account. Without those details, certainty would exceed the evidence. The repetition gives us a reason to question the narrator's presentation, but it does not supply a complete explanation of his motives. Its force lies in keeping that uncertainty active.",
    "image": "/images/literacy/literacy-writing-33.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-34",
    "level": "C2",
    "title": "A counterargument",
    "titleAr": "حجة مضادة",
    "prompt": "Answer the fair objection that consultation takes time. Acknowledge urgency.",
    "model": "Consultation can delay a decision, and urgency sometimes limits what is possible. Yet speed alone does not establish soundness. Early objections may reveal costs that would otherwise emerge only after implementation.\n\nThe fair objection is not that affected people have nothing useful to say, but that a decision may lose its purpose if every disagreement must first be settled. That concern deserves an answer about scope and time. An urgent decision can still include a short opportunity to identify immediate barriers, a clear account of who was not reached, and a date for reconsidering the arrangement. These steps do not amount to full consultation, and they should not be described as such.\n\nWhere action cannot wait, the decision should be as limited and reversible as the circumstances allow. Urgency may justify a different process; it does not make the consequences disappear. The responsibility is to act while preserving a practical route for correction.",
    "image": "/images/literacy/literacy-writing-34.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-35",
    "level": "C2",
    "title": "A reflective conclusion",
    "titleAr": "خاتمة تأملية",
    "prompt": "Conclude an essay about travel without claiming every journey changes everyone.",
    "model": "Travel does not guarantee understanding. Its value may lie less in distance than in the habits of attention carried home. Whether a journey matters depends partly on what the traveller is willing to question afterwards.\n\nThis leaves room for modest outcomes. A conversation may unsettle a familiar assumption without replacing it with a complete explanation of another place. An uncomfortable mistake may prompt greater care, although discomfort alone is no proof of learning. Even an uneventful journey can matter if the traveller notices how much ordinary life escapes a visitor's brief view.\n\nThe conclusion, then, should resist both the promise of automatic transformation and the dismissal of travel as empty consumption. What deserves attention is the relationship between encounter and response. The journey supplies an opportunity, not a certificate of openness. Its significance remains unfinished when the traveller returns, because understanding depends on what is done with the questions that remain.",
    "image": "/images/literacy/literacy-writing-35.webp",
    "imageSource": ""
  },
  {
    "id": "literacy-writing-36",
    "level": "C2",
    "title": "A precise editorial",
    "titleAr": "افتتاحية دقيقة",
    "prompt": "Introduce an argument for maintaining digital services. Separate a principle from a fact claim.",
    "model": "A public service should be judged throughout its use, not only at launch. This is a principle of accountability, not a claim that every new system fails. It asks who will correct errors and support users.\n\nA launch can demonstrate that a service works under tested conditions. It cannot settle every question about future demand, changing rules or the circumstances of people who were not represented in those tests. The argument for maintenance does not depend on predicting a particular failure. It follows from the decision to make people rely on a service whose conditions may change.\n\nA credible plan would therefore identify who receives reports, how urgent problems are assessed, and which alternatives remain available during an interruption. It would also make responsibility visible when suppliers or staff change. These are proposals about how a service ought to be run. Claims about its actual performance would still need evidence from use, rather than reassurance drawn from the fact that it launched successfully.",
    "image": "/images/literacy/literacy-writing-36.webp",
    "imageSource": ""
  }
];
