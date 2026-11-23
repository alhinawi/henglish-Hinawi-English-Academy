export type SpeakingLevel = 'A1' | 'A2' | 'B1' | 'B2';
export interface SpeakingLesson {
 id: string; level: SpeakingLevel; unit: string; title: string; titleEn: string;
 dialogue: {role: string; en: string; ar: string}[]; options: string[]; answer: number;
 phrase: string; gap: string; gapPrompt: string; image: string; imageAlt: string; photoSource: string; prompt: string; tip: string;
}
// Original learning dialogues. Levels describe intended practice difficulty, not certification.
export const SPEAKING_LESSONS: SpeakingLesson[] = [
  {
    "id": "conversation-01",
    "level": "A1",
    "unit": "التعارف والبدايات",
    "title": "أول مقابلة",
    "titleEn": "Meeting someone new",
    "dialogue": [
      {
        "role": "A",
        "en": "What is your name?",
        "ar": "اسمك إيه؟"
      },
      {
        "role": "B",
        "en": "My name is Salma. Nice to meet you.",
        "ar": "اسمي سلمى. مبسوطة بمعرفتك."
      },
      {
        "role": "A",
        "en": "Nice to meet you too. Are you a student?",
        "ar": "وأنا كمان مبسوط بمعرفتك. إنت طالب؟"
      },
      {
        "role": "B",
        "en": "Yes, I study English.",
        "ar": "أيوه، بدرس إنجليزي."
      }
    ],
    "options": [
      "My name is Salma. Nice to meet you.",
      "My name are Salma.",
      "I am name Salma."
    ],
    "answer": 0,
    "phrase": "My name is Salma. Nice to meet you.",
    "gap": "name",
    "gapPrompt": "My ____ is Salma. Nice to meet you.",
    "image": "/images/speaking/conversation-01.webp",
    "imageAlt": "Portrait of a woman",
    "photoSource": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    "prompt": "What is your name? Nice to meet you too. Are you a student?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-02",
    "level": "A1",
    "unit": "التعارف والبدايات",
    "title": "تقديم صديق",
    "titleEn": "Introducing a friend",
    "dialogue": [
      {
        "role": "A",
        "en": "Who is this?",
        "ar": "مين ده؟"
      },
      {
        "role": "B",
        "en": "This is my friend Omar.",
        "ar": "ده صاحبي عمر."
      },
      {
        "role": "A",
        "en": "Hello, Omar. Where are you from?",
        "ar": "أهلا يا عمر. إنت منين؟"
      },
      {
        "role": "B",
        "en": "I am from Cairo.",
        "ar": "أنا من القاهرة."
      }
    ],
    "options": [
      "This is my friend Omar.",
      "This my friend Omar is.",
      "These is my friend Omar."
    ],
    "answer": 0,
    "phrase": "This is my friend Omar.",
    "gap": "friend",
    "gapPrompt": "This is my ____ Omar.",
    "image": "/images/speaking/conversation-02.webp",
    "imageAlt": "Young man",
    "photoSource": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "prompt": "Who is this? Hello, Omar. Where are you from?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-03",
    "level": "A1",
    "unit": "التعارف والبدايات",
    "title": "في الفصل",
    "titleEn": "In the classroom",
    "dialogue": [
      {
        "role": "A",
        "en": "Can you spell your surname?",
        "ar": "ممكن تهجي اسم عيلتك؟"
      },
      {
        "role": "B",
        "en": "Yes. It is H-A-S-S-A-N.",
        "ar": "أيوه، هجاء اسم العيلة حسن هو H-A-S-S-A-N."
      },
      {
        "role": "A",
        "en": "Thank you. Please write it here.",
        "ar": "شكرا. اكتبه هنا لو سمحت."
      },
      {
        "role": "B",
        "en": "Of course.",
        "ar": "طبعا."
      }
    ],
    "options": [
      "Yes. It is H-A-S-S-A-N.",
      "Yes. It are Hassan.",
      "Yes. I spell not."
    ],
    "answer": 0,
    "phrase": "Yes. It is H-A-S-S-A-N.",
    "gap": "Yes",
    "gapPrompt": "____ It is H-A-S-S-A-N.",
    "image": "/images/speaking/conversation-03.webp",
    "imageAlt": "Classroom",
    "photoSource": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
    "prompt": "Can you spell your surname? Thank you. Please write it here.",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-04",
    "level": "A1",
    "unit": "التعارف والبدايات",
    "title": "طلب التوضيح",
    "titleEn": "Asking for repetition",
    "dialogue": [
      {
        "role": "A",
        "en": "Please turn to page fourteen.",
        "ar": "افتح على صفحة أربعة عشر لو سمحت."
      },
      {
        "role": "B",
        "en": "Could you say that again, please?",
        "ar": "ممكن تقول ده تاني لو سمحت؟"
      },
      {
        "role": "A",
        "en": "Page fourteen. One four.",
        "ar": "صفحة أربعة عشر. واحد أربعة."
      },
      {
        "role": "B",
        "en": "Thank you. I understand now.",
        "ar": "شكرا. فهمت دلوقتي."
      }
    ],
    "options": [
      "Could you say that again, please?",
      "You speak again now!",
      "Could say again you?"
    ],
    "answer": 0,
    "phrase": "Could you say that again, please?",
    "gap": "again",
    "gapPrompt": "Could you say that ____ please?",
    "image": "/images/speaking/conversation-04.webp",
    "imageAlt": "Teacher helping a learner",
    "photoSource": "https://images.unsplash.com/photo-1577896851231-70ef18881754",
    "prompt": "Please turn to page fourteen. Page fourteen. One four.",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-05",
    "level": "A1",
    "unit": "يومي وحياتي",
    "title": "روتين الصبح",
    "titleEn": "Morning routine",
    "dialogue": [
      {
        "role": "A",
        "en": "What time do you get up?",
        "ar": "بتصحى الساعة كام؟"
      },
      {
        "role": "B",
        "en": "I get up at seven every day.",
        "ar": "بصحى الساعة 7 كل يوم."
      },
      {
        "role": "A",
        "en": "Do you have breakfast at home?",
        "ar": "بتفطر في البيت؟"
      },
      {
        "role": "B",
        "en": "Yes, I usually have eggs.",
        "ar": "أيوه، غالبا باكل بيض."
      }
    ],
    "options": [
      "I get up at seven every day.",
      "I gets up at seven.",
      "I getting up at seven."
    ],
    "answer": 0,
    "phrase": "I get up at seven every day.",
    "gap": "seven",
    "gapPrompt": "I get up at ____ every day.",
    "image": "/images/speaking/conversation-05.webp",
    "imageAlt": "Coffee and work desk",
    "photoSource": "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    "prompt": "What time do you get up? Do you have breakfast at home?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-06",
    "level": "A1",
    "unit": "يومي وحياتي",
    "title": "كتاب مفضل",
    "titleEn": "A favourite book",
    "dialogue": [
      {
        "role": "A",
        "en": "What do you like reading?",
        "ar": "بتحب تقرأ إيه؟"
      },
      {
        "role": "B",
        "en": "I like reading short stories.",
        "ar": "بحب أقرأ قصص قصيرة."
      },
      {
        "role": "A",
        "en": "Do you read every evening?",
        "ar": "بتقرأ كل يوم بالليل؟"
      },
      {
        "role": "B",
        "en": "Yes, before I go to bed.",
        "ar": "أيوه، قبل ما أنام."
      }
    ],
    "options": [
      "I like reading short stories.",
      "I like readed stories.",
      "I likes reading stories."
    ],
    "answer": 0,
    "phrase": "I like reading short stories.",
    "gap": "stories",
    "gapPrompt": "I like reading short ____",
    "image": "/images/speaking/conversation-06.webp",
    "imageAlt": "Stack of books",
    "photoSource": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6",
    "prompt": "What do you like reading? Do you read every evening?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-07",
    "level": "A1",
    "unit": "يومي وحياتي",
    "title": "مذاكرة مع صاحبك",
    "titleEn": "Studying together",
    "dialogue": [
      {
        "role": "A",
        "en": "Are you free this afternoon?",
        "ar": "إنت فاضي بعد الضهر النهارده؟"
      },
      {
        "role": "B",
        "en": "Yes. Shall we study together?",
        "ar": "أيوه. إيه رأيك نذاكر سوا؟"
      },
      {
        "role": "A",
        "en": "Good idea. At the library?",
        "ar": "فكرة حلوة. في المكتبة؟"
      },
      {
        "role": "B",
        "en": "Yes, see you there at three.",
        "ar": "أيوه، أشوفك هناك الساعة تلاتة."
      }
    ],
    "options": [
      "Yes. Shall we study together?",
      "Yes. We shall studying?",
      "Yes. Shall study we together?"
    ],
    "answer": 0,
    "phrase": "Yes. Shall we study together?",
    "gap": "together",
    "gapPrompt": "Yes. Shall we study ____",
    "image": "/images/speaking/conversation-07.webp",
    "imageAlt": "Students working together",
    "photoSource": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    "prompt": "Are you free this afternoon? Good idea. At the library?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-08",
    "level": "A1",
    "unit": "يومي وحياتي",
    "title": "هواية الكتابة",
    "titleEn": "Talking about a hobby",
    "dialogue": [
      {
        "role": "A",
        "en": "What do you do in your free time?",
        "ar": "بتعمل إيه في وقت فراغك؟"
      },
      {
        "role": "B",
        "en": "I write stories in my notebook.",
        "ar": "بكتب قصص في كشكولي."
      },
      {
        "role": "A",
        "en": "That sounds interesting. How often?",
        "ar": "ده شكله ممتع. بتعمل كده كل قد إيه؟"
      },
      {
        "role": "B",
        "en": "Every weekend.",
        "ar": "كل ويك إند."
      }
    ],
    "options": [
      "I write stories in my notebook.",
      "I writing stories yesterday every day.",
      "I writes stories."
    ],
    "answer": 0,
    "phrase": "I write stories in my notebook.",
    "gap": "notebook",
    "gapPrompt": "I write stories in my ____",
    "image": "/images/speaking/conversation-08.webp",
    "imageAlt": "Writing in a notebook",
    "photoSource": "https://images.unsplash.com/photo-1455390582262-044cdead277a",
    "prompt": "What do you do in your free time? That sounds interesting. How often?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-09",
    "level": "A2",
    "unit": "سفر ومشاوير",
    "title": "في المطار",
    "titleEn": "At the airport",
    "dialogue": [
      {
        "role": "A",
        "en": "May I see your passport, please?",
        "ar": "ممكن أشوف جواز سفرك لو سمحت؟"
      },
      {
        "role": "B",
        "en": "Here you are. Is this the right queue?",
        "ar": "اتفضل. ده الطابور الصح؟"
      },
      {
        "role": "A",
        "en": "Yes. Where are you flying today?",
        "ar": "أيوه. مسافر فين النهارده؟"
      },
      {
        "role": "B",
        "en": "I am flying to London.",
        "ar": "مسافر لندن."
      }
    ],
    "options": [
      "Here you are. Is this the right queue?",
      "Here are you passport I.",
      "Where queue right is this?"
    ],
    "answer": 0,
    "phrase": "Here you are. Is this the right queue?",
    "gap": "queue",
    "gapPrompt": "Here you are. Is this the right ____",
    "image": "/images/speaking/conversation-09.webp",
    "imageAlt": "Aircraft in flight",
    "photoSource": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
    "prompt": "May I see your passport, please? Yes. Where are you flying today?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-10",
    "level": "A2",
    "unit": "سفر ومشاوير",
    "title": "بوابة الطيارة",
    "titleEn": "Finding the gate",
    "dialogue": [
      {
        "role": "A",
        "en": "Excuse me, where is gate twelve?",
        "ar": "لو سمحت، فين البوابة اتناشر؟"
      },
      {
        "role": "B",
        "en": "Go straight ahead and turn left.",
        "ar": "امشي على طول وبعدها لف شمال."
      },
      {
        "role": "A",
        "en": "Is it near the coffee shop?",
        "ar": "هي قريبة من الكافيه؟"
      },
      {
        "role": "B",
        "en": "Yes, just past it.",
        "ar": "أيوه، بعده على طول."
      }
    ],
    "options": [
      "Go straight ahead and turn left.",
      "Go straighted and turning left.",
      "Go ahead straightly yesterday."
    ],
    "answer": 0,
    "phrase": "Go straight ahead and turn left.",
    "gap": "left",
    "gapPrompt": "Go straight ahead and turn ____",
    "image": "/images/speaking/conversation-10.webp",
    "imageAlt": "Airport terminal",
    "photoSource": "https://images.unsplash.com/photo-1517400508447-f8dd518b86db",
    "prompt": "Excuse me, where is gate twelve? Is it near the coffee shop?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-11",
    "level": "A2",
    "unit": "سفر ومشاوير",
    "title": "تغيير خطة",
    "titleEn": "Changing a plan",
    "dialogue": [
      {
        "role": "A",
        "en": "Shall we meet in the city centre?",
        "ar": "إيه رأيك نتقابل في وسط البلد؟"
      },
      {
        "role": "B",
        "en": "Could we meet at the station instead?",
        "ar": "ينفع نتقابل في المحطة بدل كده؟"
      },
      {
        "role": "A",
        "en": "Sure. Would five o'clock suit you?",
        "ar": "تمام. الساعة خمسة مناسبة ليك؟"
      },
      {
        "role": "B",
        "en": "Yes, that works for me.",
        "ar": "أيوه، ده مناسب ليا."
      }
    ],
    "options": [
      "Could we meet at the station instead?",
      "Could we met at station instead?",
      "We could meeting instead station?"
    ],
    "answer": 0,
    "phrase": "Could we meet at the station instead?",
    "gap": "instead",
    "gapPrompt": "Could we meet at the station ____",
    "image": "/images/speaking/conversation-11.webp",
    "imageAlt": "City skyline",
    "photoSource": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    "prompt": "Shall we meet in the city centre? Sure. Would five o'clock suit you?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-12",
    "level": "A2",
    "unit": "سفر ومشاوير",
    "title": "في سوق الخضار",
    "titleEn": "At the market",
    "dialogue": [
      {
        "role": "A",
        "en": "How much are these tomatoes?",
        "ar": "الطماطم دي بكام؟"
      },
      {
        "role": "B",
        "en": "They are twenty pounds a kilo.",
        "ar": "سعرها 20 جنيه للكيلو في الحوار ده."
      },
      {
        "role": "A",
        "en": "I would like half a kilo, please.",
        "ar": "عايز نص كيلو لو سمحت."
      },
      {
        "role": "B",
        "en": "Certainly. Anything else?",
        "ar": "حاضر. أي حاجة تانية؟"
      }
    ],
    "options": [
      "They are twenty pounds a kilo.",
      "They is twenty pounds kilo.",
      "It are twenty pounds."
    ],
    "answer": 0,
    "phrase": "They are twenty pounds a kilo.",
    "gap": "kilo",
    "gapPrompt": "They are twenty pounds a ____",
    "image": "/images/speaking/conversation-12.webp",
    "imageAlt": "Fresh produce at a market",
    "photoSource": "https://images.unsplash.com/photo-1488459716781-31db52582fe9",
    "prompt": "How much are these tomatoes? I would like half a kilo, please.",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-13",
    "level": "A2",
    "unit": "خبرات وتجارب",
    "title": "زيارة الدكتور",
    "titleEn": "At the doctor's",
    "dialogue": [
      {
        "role": "A",
        "en": "How long have you had this cough?",
        "ar": "بقالك قد إيه عندك الكحة دي؟"
      },
      {
        "role": "B",
        "en": "I have had it since Monday.",
        "ar": "الكحة عندي من يوم الاتنين."
      },
      {
        "role": "A",
        "en": "Do you have any other symptoms?",
        "ar": "عندك أي أعراض تانية؟"
      },
      {
        "role": "B",
        "en": "I also have a sore throat.",
        "ar": "عندي كمان التهاب في الزور."
      }
    ],
    "options": [
      "I have had it since Monday.",
      "I have it since Monday had have.",
      "I has had it since Monday."
    ],
    "answer": 0,
    "phrase": "I have had it since Monday.",
    "gap": "since",
    "gapPrompt": "I have had it ____ Monday.",
    "image": "/images/speaking/conversation-13.webp",
    "imageAlt": "Healthcare consultation",
    "photoSource": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
    "prompt": "How long have you had this cough? Do you have any other symptoms?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-14",
    "level": "A2",
    "unit": "خبرات وتجارب",
    "title": "حكاية امبارح",
    "titleEn": "Telling a short story",
    "dialogue": [
      {
        "role": "A",
        "en": "How was your weekend?",
        "ar": "الويك إند كان عامل إيه؟"
      },
      {
        "role": "B",
        "en": "I visited a museum with my sister.",
        "ar": "زرت متحف مع أختي."
      },
      {
        "role": "A",
        "en": "What did you enjoy most?",
        "ar": "إيه أكتر حاجة عجبتك؟"
      },
      {
        "role": "B",
        "en": "The old maps were amazing.",
        "ar": "الخرايط القديمة كانت مدهشة."
      }
    ],
    "options": [
      "I visited a museum with my sister.",
      "I visit a museum yesterday usually.",
      "I visited to a museum with yesterday."
    ],
    "answer": 0,
    "phrase": "I visited a museum with my sister.",
    "gap": "visited",
    "gapPrompt": "I ____ a museum with my sister.",
    "image": "/images/speaking/conversation-14.webp",
    "imageAlt": "Old books and history",
    "photoSource": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d",
    "prompt": "How was your weekend? What did you enjoy most?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-15",
    "level": "A2",
    "unit": "خبرات وتجارب",
    "title": "التحضير للامتحان",
    "titleEn": "Preparing for an exam",
    "dialogue": [
      {
        "role": "A",
        "en": "Have you finished your revision yet?",
        "ar": "خلصت المراجعة ولا لسه؟"
      },
      {
        "role": "B",
        "en": "Not yet, but I have reviewed two chapters.",
        "ar": "لسه، بس راجعت فصلين."
      },
      {
        "role": "A",
        "en": "Would you like to revise together?",
        "ar": "تحب نراجع سوا؟"
      },
      {
        "role": "B",
        "en": "Yes, that would help.",
        "ar": "أيوه، ده هيساعد."
      }
    ],
    "options": [
      "Not yet, but I have reviewed two chapters.",
      "I has reviewed two chapters.",
      "I have review two chapters."
    ],
    "answer": 0,
    "phrase": "Not yet, but I have reviewed two chapters.",
    "gap": "reviewed",
    "gapPrompt": "Not yet, but I have ____ two chapters.",
    "image": "/images/speaking/conversation-15.webp",
    "imageAlt": "Exam preparation desk",
    "photoSource": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
    "prompt": "Have you finished your revision yet? Would you like to revise together?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-16",
    "level": "A2",
    "unit": "خبرات وتجارب",
    "title": "يوم التخرج",
    "titleEn": "Graduation plans",
    "dialogue": [
      {
        "role": "A",
        "en": "What are you going to do after graduation?",
        "ar": "ناوي تعمل إيه بعد التخرج؟"
      },
      {
        "role": "B",
        "en": "I am going to apply for a teaching job.",
        "ar": "ناوي أقدم على وظيفة مدرس."
      },
      {
        "role": "A",
        "en": "That sounds exciting. Where?",
        "ar": "ده شكله حلو. فين؟"
      },
      {
        "role": "B",
        "en": "At a local language school.",
        "ar": "في مدرسة لغات قريبة."
      }
    ],
    "options": [
      "I am going to apply for a teaching job.",
      "I going apply job.",
      "I am going to applied for a job."
    ],
    "answer": 0,
    "phrase": "I am going to apply for a teaching job.",
    "gap": "apply",
    "gapPrompt": "I am going to ____ for a teaching job.",
    "image": "/images/speaking/conversation-16.webp",
    "imageAlt": "Students planning together",
    "photoSource": "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    "prompt": "What are you going to do after graduation? That sounds exciting. Where?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-17",
    "level": "B1",
    "unit": "علاقات ومحادثات",
    "title": "استمرار الكلام",
    "titleEn": "Keeping a conversation going",
    "dialogue": [
      {
        "role": "A",
        "en": "I started learning Italian last month.",
        "ar": "بدأت أتعلم إيطالي الشهر اللي فات."
      },
      {
        "role": "B",
        "en": "Really? What made you choose Italian?",
        "ar": "بجد؟ إيه اللي خلاك تختار الإيطالي؟"
      },
      {
        "role": "A",
        "en": "I want to visit my cousins in Rome.",
        "ar": "عايز أزور قرايبي في روما."
      },
      {
        "role": "B",
        "en": "That sounds like a good reason.",
        "ar": "ده شكله سبب كويس."
      }
    ],
    "options": [
      "Really? What made you choose Italian?",
      "That is irrelevant. Stop talking.",
      "No question. Conversation finished."
    ],
    "answer": 0,
    "phrase": "Really? What made you choose Italian?",
    "gap": "choose",
    "gapPrompt": "Really? What made you ____ Italian?",
    "image": "/images/speaking/conversation-17.webp",
    "imageAlt": "Group of colleagues",
    "photoSource": "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    "prompt": "I started learning Italian last month. I want to visit my cousins in Rome.",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-18",
    "level": "B1",
    "unit": "علاقات ومحادثات",
    "title": "نصيحة لصاحبك",
    "titleEn": "Giving friendly advice",
    "dialogue": [
      {
        "role": "A",
        "en": "I find it hard to study after work.",
        "ar": "بلاقي المذاكرة بعد الشغل صعبة."
      },
      {
        "role": "B",
        "en": "Why don't you try a short session before work?",
        "ar": "ليه متجربش تذاكر شوية قبل الشغل؟"
      },
      {
        "role": "A",
        "en": "That might work. How long should I study?",
        "ar": "ممكن ده ينفع. أذاكر قد إيه؟"
      },
      {
        "role": "B",
        "en": "Start with fifteen minutes.",
        "ar": "ابدأ بخمستاشر دقيقة."
      }
    ],
    "options": [
      "Why don't you try a short session before work?",
      "You must never sleep again.",
      "Your problem is not important."
    ],
    "answer": 0,
    "phrase": "Why don't you try a short session before work?",
    "gap": "try",
    "gapPrompt": "Why don't you ____ a short session before work?",
    "image": "/images/speaking/conversation-18.webp",
    "imageAlt": "Study materials",
    "photoSource": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8",
    "prompt": "I find it hard to study after work. That might work. How long should I study?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-19",
    "level": "B1",
    "unit": "علاقات ومحادثات",
    "title": "اعتذار مناسب",
    "titleEn": "Apologising and repairing",
    "dialogue": [
      {
        "role": "A",
        "en": "You missed our meeting yesterday.",
        "ar": "محضرتش اجتماعنا امبارح."
      },
      {
        "role": "B",
        "en": "I am sorry. I should have let you know.",
        "ar": "أنا آسف. كان المفروض أبلغك."
      },
      {
        "role": "A",
        "en": "Thanks for saying that. Can we reschedule?",
        "ar": "شكرا إنك قلت كده. ينفع نحدد معاد تاني؟"
      },
      {
        "role": "B",
        "en": "Yes. Would tomorrow afternoon work?",
        "ar": "أيوه. بكرة بعد الضهر مناسب؟"
      }
    ],
    "options": [
      "I am sorry. I should have let you know.",
      "It is your fault I forgot.",
      "I never need to apologise."
    ],
    "answer": 0,
    "phrase": "I am sorry. I should have let you know.",
    "gap": "sorry",
    "gapPrompt": "I am ____ I should have let you know.",
    "image": "/images/speaking/conversation-19.webp",
    "imageAlt": "Planning and calendar",
    "photoSource": "https://images.unsplash.com/photo-1506784365847-bbad939e9335",
    "prompt": "You missed our meeting yesterday. Thanks for saying that. Can we reschedule?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-20",
    "level": "B1",
    "unit": "علاقات ومحادثات",
    "title": "مقابلة عمل",
    "titleEn": "A job interview",
    "dialogue": [
      {
        "role": "A",
        "en": "Why would you like to work here?",
        "ar": "إيه اللي مخليك عايز تشتغل هنا؟"
      },
      {
        "role": "B",
        "en": "Your training programme matches my career goals.",
        "ar": "برنامج التدريب عندكم مناسب لأهدافي المهنية."
      },
      {
        "role": "A",
        "en": "Could you give us an example?",
        "ar": "ممكن تدينا مثال؟"
      },
      {
        "role": "B",
        "en": "I want to develop my classroom skills.",
        "ar": "عايز أطور مهاراتي في التدريس جوه الفصل."
      }
    ],
    "options": [
      "Your training programme matches my career goals.",
      "Because every other company is terrible.",
      "I have no interest in the role."
    ],
    "answer": 0,
    "phrase": "Your training programme matches my career goals.",
    "gap": "career",
    "gapPrompt": "Your training programme matches my ____ goals.",
    "image": "/images/speaking/conversation-20.webp",
    "imageAlt": "Job interview",
    "photoSource": "https://images.unsplash.com/photo-1565688534245-05d6b5be184a",
    "prompt": "Why would you like to work here? Could you give us an example?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-21",
    "level": "B1",
    "unit": "شغل وتعاون",
    "title": "تحديث مشروع",
    "titleEn": "A project update",
    "dialogue": [
      {
        "role": "A",
        "en": "How is the website coming along?",
        "ar": "وصلتوا لفين في الموقع؟"
      },
      {
        "role": "B",
        "en": "We have finished the design, but testing is still in progress.",
        "ar": "خلصنا التصميم، لكن الاختبار لسه شغال."
      },
      {
        "role": "A",
        "en": "What do you need from us?",
        "ar": "محتاجين إيه مننا؟"
      },
      {
        "role": "B",
        "en": "Feedback on the mobile layout, please.",
        "ar": "ملاحظات على تنسيق نسخة الموبايل لو سمحت."
      }
    ],
    "options": [
      "We have finished the design, but testing is still in progress.",
      "Everything is finished, but nothing has started.",
      "I cannot discuss any update ever."
    ],
    "answer": 0,
    "phrase": "We have finished the design, but testing is still in progress.",
    "gap": "testing",
    "gapPrompt": "We have finished the design, but ____ is still in progress.",
    "image": "/images/speaking/conversation-21.webp",
    "imageAlt": "Computer used for development",
    "photoSource": "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "prompt": "How is the website coming along? What do you need from us?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-22",
    "level": "B1",
    "unit": "شغل وتعاون",
    "title": "توزيع المهام",
    "titleEn": "Sharing the workload",
    "dialogue": [
      {
        "role": "A",
        "en": "Could you take care of the slides?",
        "ar": "ممكن تتولى تجهيز الشرائح؟"
      },
      {
        "role": "B",
        "en": "Yes, as long as you send me the figures today.",
        "ar": "أيوه، بشرط تبعتلي الأرقام النهارده."
      },
      {
        "role": "A",
        "en": "That is fine. I will send them by noon.",
        "ar": "تمام. هبعتها قبل الضهر أو على الضهر بالكتير."
      },
      {
        "role": "B",
        "en": "Great. I will start after lunch.",
        "ar": "حلو. هبدأ بعد الغدا."
      }
    ],
    "options": [
      "Yes, as long as you send me the figures today.",
      "Yes, although I refuse to do the slides.",
      "No. You always do everything wrong."
    ],
    "answer": 0,
    "phrase": "Yes, as long as you send me the figures today.",
    "gap": "send",
    "gapPrompt": "Yes, as long as you ____ me the figures today.",
    "image": "/images/speaking/conversation-22.webp",
    "imageAlt": "Team meeting",
    "photoSource": "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    "prompt": "Could you take care of the slides? That is fine. I will send them by noon.",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-23",
    "level": "B1",
    "unit": "شغل وتعاون",
    "title": "تأكيد التسليم",
    "titleEn": "Confirming a deadline",
    "dialogue": [
      {
        "role": "A",
        "en": "Will the report be ready by Friday?",
        "ar": "التقرير هيكون جاهز بحلول يوم الجمعة؟"
      },
      {
        "role": "B",
        "en": "Yes. We will have completed it by Thursday evening.",
        "ar": "أيوه. هنكون خلصناه بحلول مساء الخميس."
      },
      {
        "role": "A",
        "en": "Will there be time for a final check?",
        "ar": "هيكون فيه وقت لمراجعة أخيرة؟"
      },
      {
        "role": "B",
        "en": "Yes, we have allowed an extra day.",
        "ar": "أيوه، عاملين حساب يوم زيادة."
      }
    ],
    "options": [
      "Yes. We will have completed it by Thursday evening.",
      "Yes. We will have complete it Thursday.",
      "Yes. We will had completed it."
    ],
    "answer": 0,
    "phrase": "Yes. We will have completed it by Thursday evening.",
    "gap": "completed",
    "gapPrompt": "Yes. We will have ____ it by Thursday evening.",
    "image": "/images/speaking/conversation-23.webp",
    "imageAlt": "Clock and time management",
    "photoSource": "https://images.unsplash.com/photo-1508962914676-134849a727f0",
    "prompt": "Will the report be ready by Friday? Will there be time for a final check?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-24",
    "level": "B1",
    "unit": "شغل وتعاون",
    "title": "شرح مشكلة تقنية",
    "titleEn": "Explaining a technical problem",
    "dialogue": [
      {
        "role": "A",
        "en": "What happens when you open the file?",
        "ar": "إيه اللي بيحصل لما تفتح الملف؟"
      },
      {
        "role": "B",
        "en": "An error message appears, and the screen goes blank.",
        "ar": "بتظهر رسالة خطأ والشاشة بتفضى."
      },
      {
        "role": "A",
        "en": "Have you tried restarting the application?",
        "ar": "جربت تقفل البرنامج وتفتحه تاني؟"
      },
      {
        "role": "B",
        "en": "Yes, but the problem is still there.",
        "ar": "أيوه، بس المشكلة لسه موجودة."
      }
    ],
    "options": [
      "An error message appears, and the screen goes blank.",
      "Everything works, so the file never opens.",
      "It is definitely your fault without checking."
    ],
    "answer": 0,
    "phrase": "An error message appears, and the screen goes blank.",
    "gap": "appears",
    "gapPrompt": "An error message ____ and the screen goes blank.",
    "image": "/images/speaking/conversation-24.webp",
    "imageAlt": "Laptop and digital work",
    "photoSource": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    "prompt": "What happens when you open the file? Have you tried restarting the application?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-25",
    "level": "B2",
    "unit": "نقاش وإقناع",
    "title": "اختلاف باحترام",
    "titleEn": "Disagreeing respectfully",
    "dialogue": [
      {
        "role": "A",
        "en": "We should cancel all face-to-face meetings.",
        "ar": "المفروض نلغي كل الاجتماعات اللي بالحضور."
      },
      {
        "role": "B",
        "en": "I see your point, but some discussions work better in person.",
        "ar": "فاهم وجهة نظرك، بس بعض النقاشات بتكون أحسن وجها لوجه."
      },
      {
        "role": "A",
        "en": "Which discussions do you have in mind?",
        "ar": "أنهي نقاشات تقصد؟"
      },
      {
        "role": "B",
        "en": "Sensitive feedback and team planning.",
        "ar": "الملاحظات الحساسة والتخطيط مع الفريق."
      }
    ],
    "options": [
      "I see your point, but some discussions work better in person.",
      "That is the stupidest idea I have heard.",
      "You are not allowed to disagree with me."
    ],
    "answer": 0,
    "phrase": "I see your point, but some discussions work better in person.",
    "gap": "point",
    "gapPrompt": "I see your ____ but some discussions work better in person.",
    "image": "/images/speaking/conversation-25.webp",
    "imageAlt": "People discussing ideas",
    "photoSource": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    "prompt": "We should cancel all face-to-face meetings. Which discussions do you have in mind?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-26",
    "level": "B2",
    "unit": "نقاش وإقناع",
    "title": "اقتراح بديل",
    "titleEn": "Suggesting an alternative",
    "dialogue": [
      {
        "role": "A",
        "en": "The only solution is to hire more staff.",
        "ar": "الحل الوحيد إننا نوظف ناس أكتر."
      },
      {
        "role": "B",
        "en": "Have we considered improving the booking system first?",
        "ar": "فكرنا نحسن نظام الحجز الأول؟"
      },
      {
        "role": "A",
        "en": "How would that help?",
        "ar": "ده هيساعد إزاي؟"
      },
      {
        "role": "B",
        "en": "It could reduce the time spent on routine tasks.",
        "ar": "ممكن يقلل الوقت اللي بيضيع في المهام الروتينية."
      }
    ],
    "options": [
      "Have we considered improving the booking system first?",
      "There are no other solutions, ever.",
      "Do what I say and stop asking."
    ],
    "answer": 0,
    "phrase": "Have we considered improving the booking system first?",
    "gap": "considered",
    "gapPrompt": "Have we ____ improving the booking system first?",
    "image": "/images/speaking/conversation-26.webp",
    "imageAlt": "Team brainstorming",
    "photoSource": "https://images.unsplash.com/photo-1552664730-d307ca884978",
    "prompt": "The only solution is to hire more staff. How would that help?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-27",
    "level": "B2",
    "unit": "نقاش وإقناع",
    "title": "مميزات وعيوب",
    "titleEn": "Weighing up options",
    "dialogue": [
      {
        "role": "A",
        "en": "Should we move the course online?",
        "ar": "ننقل الكورس أونلاين؟"
      },
      {
        "role": "B",
        "en": "On the one hand, it is flexible; on the other hand, some learners need classroom support.",
        "ar": "من ناحية ده مرن، ومن ناحية تانية بعض الطلبة محتاجين دعم في الفصل."
      },
      {
        "role": "A",
        "en": "Could we offer both formats?",
        "ar": "ينفع نوفر الطريقتين؟"
      },
      {
        "role": "B",
        "en": "Yes, a mixed approach might work.",
        "ar": "أيوه، طريقة بتجمع الاتنين ممكن تنفع."
      }
    ],
    "options": [
      "On the one hand, it is flexible; on the other hand, some learners need classroom support.",
      "There can never be any disadvantages.",
      "Only my preference matters here."
    ],
    "answer": 0,
    "phrase": "On the one hand, it is flexible; on the other hand, some learners need classroom support.",
    "gap": "hand",
    "gapPrompt": "On the one ____ it is flexible; on the other hand, some learners need classroom support.",
    "image": "/images/speaking/conversation-27.webp",
    "imageAlt": "Learning with technology",
    "photoSource": "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    "prompt": "Should we move the course online? Could we offer both formats?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-28",
    "level": "B2",
    "unit": "نقاش وإقناع",
    "title": "حل وسط",
    "titleEn": "Reaching a compromise",
    "dialogue": [
      {
        "role": "A",
        "en": "We need the whole budget for advertising.",
        "ar": "محتاجين الميزانية كلها للإعلانات."
      },
      {
        "role": "B",
        "en": "What if we split it between advertising and training?",
        "ar": "إيه رأيك نقسمه بين الإعلان والتدريب؟"
      },
      {
        "role": "A",
        "en": "I could agree to that if we review the results next month.",
        "ar": "ممكن أوافق لو راجعنا النتايج الشهر الجاي."
      },
      {
        "role": "B",
        "en": "That seems fair.",
        "ar": "ده شكله عادل."
      }
    ],
    "options": [
      "What if we split it between advertising and training?",
      "Give me everything and do not discuss it.",
      "There is no need to hear your view."
    ],
    "answer": 0,
    "phrase": "What if we split it between advertising and training?",
    "gap": "split",
    "gapPrompt": "What if we ____ it between advertising and training?",
    "image": "/images/speaking/conversation-28.webp",
    "imageAlt": "Business discussion",
    "photoSource": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    "prompt": "We need the whole budget for advertising. I could agree to that if we review the results next month.",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-29",
    "level": "B2",
    "unit": "عرض وحكي متقدم",
    "title": "افتتاح عرض",
    "titleEn": "Opening a presentation",
    "dialogue": [
      {
        "role": "A",
        "en": "What will your presentation cover?",
        "ar": "العرض بتاعك هيغطي إيه؟"
      },
      {
        "role": "B",
        "en": "I will outline the problem, compare two options, and recommend a solution.",
        "ar": "هوضح المشكلة وأقارن اختيارين وأقترح حل."
      },
      {
        "role": "A",
        "en": "How will you involve the audience?",
        "ar": "هتشرك الجمهور إزاي؟"
      },
      {
        "role": "B",
        "en": "I will begin with a short question.",
        "ar": "هبدأ بسؤال قصير."
      }
    ],
    "options": [
      "I will outline the problem, compare two options, and recommend a solution.",
      "I will talk randomly with no purpose.",
      "There is nothing for the audience to understand."
    ],
    "answer": 0,
    "phrase": "I will outline the problem, compare two options, and recommend a solution.",
    "gap": "outline",
    "gapPrompt": "I will ____ the problem, compare two options, and recommend a solution.",
    "image": "/images/speaking/conversation-29.webp",
    "imageAlt": "Professional in business clothing",
    "photoSource": "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    "prompt": "What will your presentation cover? How will you involve the audience?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-30",
    "level": "B2",
    "unit": "عرض وحكي متقدم",
    "title": "متابعة إجابة",
    "titleEn": "Asking a follow-up question",
    "dialogue": [
      {
        "role": "A",
        "en": "The new design is more accessible.",
        "ar": "التصميم الجديد أسهل في الاستخدام لناس بقدرات مختلفة."
      },
      {
        "role": "B",
        "en": "Could you explain what you mean by accessible in this context?",
        "ar": "ممكن توضح قصدك بإمكانية الوصول في السياق ده؟"
      },
      {
        "role": "A",
        "en": "The text is easier to read, and the buttons work with a keyboard.",
        "ar": "النص أسهل في القراءة، والأزرار بتشتغل بلوحة المفاتيح."
      },
      {
        "role": "B",
        "en": "Thank you. That makes it clearer.",
        "ar": "شكرا. كده المعنى أوضح."
      }
    ],
    "options": [
      "Could you explain what you mean by accessible in this context?",
      "I already know everything, so stop.",
      "That word cannot mean anything."
    ],
    "answer": 0,
    "phrase": "Could you explain what you mean by accessible in this context?",
    "gap": "context",
    "gapPrompt": "Could you explain what you mean by accessible in this ____",
    "image": "/images/speaking/conversation-30.webp",
    "imageAlt": "Design and planning",
    "photoSource": "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    "prompt": "The new design is more accessible. The text is easier to read, and the buttons work with a keyboard.",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-31",
    "level": "B2",
    "unit": "عرض وحكي متقدم",
    "title": "سرد تجربة صعبة",
    "titleEn": "Reflecting on a challenge",
    "dialogue": [
      {
        "role": "A",
        "en": "Tell us about a difficult project.",
        "ar": "احكيلنا عن مشروع صعب."
      },
      {
        "role": "B",
        "en": "Although we missed the first deadline, we used the feedback to improve the final result.",
        "ar": "رغم إننا فوتنا أول موعد، استخدمنا الملاحظات عشان نحسن النتيجة."
      },
      {
        "role": "A",
        "en": "What did you learn from it?",
        "ar": "اتعلمت إيه منه؟"
      },
      {
        "role": "B",
        "en": "To test our assumptions earlier.",
        "ar": "إننا نختبر افتراضاتنا بدري أكتر."
      }
    ],
    "options": [
      "Although we missed the first deadline, we used the feedback to improve the final result.",
      "We failed once, therefore learning is impossible.",
      "I blame everyone and learned nothing."
    ],
    "answer": 0,
    "phrase": "Although we missed the first deadline, we used the feedback to improve the final result.",
    "gap": "Although",
    "gapPrompt": "____ we missed the first deadline, we used the feedback to improve the final result.",
    "image": "/images/speaking/conversation-31.webp",
    "imageAlt": "Engineering project work",
    "photoSource": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    "prompt": "Tell us about a difficult project. What did you learn from it?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  },
  {
    "id": "conversation-32",
    "level": "B2",
    "unit": "عرض وحكي متقدم",
    "title": "خاتمة مقنعة",
    "titleEn": "Closing a discussion",
    "dialogue": [
      {
        "role": "A",
        "en": "How would you sum up the discussion?",
        "ar": "تلخص النقاش إزاي؟"
      },
      {
        "role": "B",
        "en": "We agree on the goal, but we still need to compare the costs before deciding.",
        "ar": "متفقين على الهدف، لكن لسه محتاجين نقارن التكاليف قبل القرار."
      },
      {
        "role": "A",
        "en": "What is the next step?",
        "ar": "إيه الخطوة الجاية؟"
      },
      {
        "role": "B",
        "en": "Let us gather the figures and meet again on Monday.",
        "ar": "نجمع الأرقام ونتقابل تاني يوم الاتنين."
      }
    ],
    "options": [
      "We agree on the goal, but we still need to compare the costs before deciding.",
      "We have agreed on nothing, so I will decide alone.",
      "No next step is needed for an unresolved decision."
    ],
    "answer": 0,
    "phrase": "We agree on the goal, but we still need to compare the costs before deciding.",
    "gap": "costs",
    "gapPrompt": "We agree on the goal, but we still need to compare the ____ before deciding.",
    "image": "/images/speaking/conversation-32.webp",
    "imageAlt": "Colleagues reviewing a decision",
    "photoSource": "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    "prompt": "How would you sum up the discussion? What is the next step?",
    "tip": "اسمع الرد، لاحظ تركيبه، وبعدها بدّل التفاصيل عشان تحكي عن نفسك. الردود الغلط هنا أمثلة غير مناسبة للموقف أو فيها خطأ لغوي."
  }
];
