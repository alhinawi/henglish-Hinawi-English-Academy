import { CEFRLevel } from '../types';

export interface DialogueOption {
  textEn: string;
  textAr: string;
  isOptimal: boolean;
  score: number;
  feedbackAr: string;
  nextStepId?: string;
}

export interface SimulationTurn {
  id: string;
  speaker: string;
  speakerRole: string;
  speakerAvatar: string;
  textEn: string;
  textAr: string;
  options: DialogueOption[];
  expectedKeywordsForFreeText?: string[];
  grammarTipAr?: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  titleAr: string;
  category: 'travel' | 'hospitality' | 'healthcare' | 'daily' | 'professional';
  categoryAr: string;
  level: CEFRLevel;
  locationName: string;
  locationIcon: string;
  backdropImage: string;
  descriptionAr: string;
  keyVocabulary: { en: string; ar: string; phonetic?: string }[];
  turns: SimulationTurn[];
  rewardXp: number;
}

export const REAL_LIFE_SCENARIOS: SimulationScenario[] = [
  {
    "id": "sim-airport-checkin",
    "title": "Airport Check-in & Baggage Drop",
    "titleAr": "إنهاء إجراءات المطار وتسليم الحقائب",
    "category": "travel",
    "categoryAr": "السفر والمطارات",
    "level": "A2",
    "locationName": "Cairo International Airport - Terminal 3",
    "locationIcon": "",
    "backdropImage": "/images/reallife/sim-airport-checkin.webp",
    "descriptionAr": "تعلم كيف تتحدث مع موظف الطيران عند شباك التذاكر، تسليم الأمتعة، واختيار مقعد الطائرة المفضل بثقة.",
    "keyVocabulary": [
      {
        "en": "Boarding pass",
        "ar": "بطاقة صعود الطائرة",
        "phonetic": "/ˈbɔːrdɪŋ pæs/"
      },
      {
        "en": "Window seat",
        "ar": "مقعد بجانب النافذة",
        "phonetic": "/ˈwɪndoʊ siːt/"
      },
      {
        "en": "Aisle seat",
        "ar": "مقعد بجانب الممر",
        "phonetic": "/aɪl siːt/"
      },
      {
        "en": "Luggage / Baggage",
        "ar": "حقائب السفر والأمتعة",
        "phonetic": "/ˈlʌɡɪdʒ/"
      },
      {
        "en": "Carry-on bag",
        "ar": "حقيبة اليد المسموح بها في الطائرة",
        "phonetic": "/ˈkæri ɒn/"
      }
    ],
    "rewardXp": 120,
    "turns": [
      {
        "id": "turn-1",
        "speaker": "Sarah Jenkins",
        "speakerRole": "Airline Ground Agent",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Good morning! Welcome to British Airways. May I please have your passport and booking reference?",
        "textAr": "صباح الخير! مرحباً بكم على متن الخطوط الجوية البريطانية. هل يمكنني الحصول على جواز سفرك ورقم الحجز من فضلك؟",
        "grammarTipAr": "الرد المؤدب دائماً يبدأ بـ \"Good morning, here you go\" أو \"Certainly, here it is\".",
        "expectedKeywordsForFreeText": [
          "here",
          "passport",
          "booking",
          "morning"
        ],
        "options": [
          {
            "textEn": "Good morning! Here is my passport and e-ticket confirmation.",
            "textAr": "صباح الخير! تفضلي جواز سفري وتأكيد التذكرة الإلكترونية.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "ممتاز جداً! صياغة طبيعية ومهذبة للغاية كما يتحدث أهل اللغة."
          },
          {
            "textEn": "Take passport and ticket now.",
            "textAr": "خذي الجواز والتذكرة الآن.",
            "isOptimal": false,
            "score": 3,
            "feedbackAr": "الصيغة جافة وغير مهذبة. من الأفضل دائماً استخدام Here is my passport من فضلك."
          },
          {
            "textEn": "Yes, I am having passport in pocket.",
            "textAr": "نعم، أنا أملك جواز سفر في جيبي.",
            "isOptimal": false,
            "score": 5,
            "feedbackAr": "فعل have بمعنى الملكية هو stative verb ولا يفضل وضعه في المضارع المستمر am having."
          },
          {
            "textEn": "Here is my restaurant reservation.",
            "textAr": "ده حجز المطعم بتاعي.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "الموظفة طلبت جواز السفر ومرجع حجز الطيران، مش حجز مطعم."
          }
        ]
      },
      {
        "id": "turn-2",
        "speaker": "Sarah Jenkins",
        "speakerRole": "Airline Ground Agent",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Thank you. Do you have any luggage to check in today, or just this carry-on bag?",
        "textAr": "شكراً لك. هل لديك أي حقائب ترغب في شحنها اليوم، أم مجرد هذه الحقيبة المحمولة؟",
        "grammarTipAr": "للإشارة لعدد الحقائب: \"I have two bags to check in\".",
        "expectedKeywordsForFreeText": [
          "bags",
          "suitcases",
          "carry",
          "check"
        ],
        "options": [
          {
            "textEn": "My suitcase has already boarded the plane by itself.",
            "textAr": "شنطتي ركبت الطيارة لوحدها بالفعل.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "الشنطة مش بتسافر لوحدها. وضّح إذا كنت هتسلّمها ولا هتاخدها معاك."
          },
          {
            "textEn": "I have one suitcase to check in, and this backpack as a carry-on.",
            "textAr": "لدي حقيبة سفر واحدة لشحنها، وهذه الحقيبة كحقيبة يد محمولة.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "إجابة مثالية ودقيقة بمصطلحات السفر المعتمدة."
          },
          {
            "textEn": "No check in bag, all bags with me inside plane.",
            "textAr": "لا حقائب شحن، كل الحقائب معي داخل الطائرة.",
            "isOptimal": false,
            "score": 4,
            "feedbackAr": "قواعدياً ضعيفة، الأصح أن تقول: Just this carry-on bag, please."
          },
          {
            "textEn": "I would like a window seat, please.",
            "textAr": "عايز كرسي جنب الشباك، من فضلك.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "السؤال دلوقتي عن الحقائب، مش نوع المقعد."
          }
        ]
      },
      {
        "id": "turn-3",
        "speaker": "Sarah Jenkins",
        "speakerRole": "Airline Ground Agent",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Would you prefer a window seat or an aisle seat for this flight?",
        "textAr": "هل تفضل مقعداً بجوار النافذة أم مقعداً بجانب الممر لهذه الرحلة؟",
        "grammarTipAr": "السؤال بـ Would you prefer يجاب عنه بـ \"I would prefer...\" أو \"A window seat, please\".",
        "expectedKeywordsForFreeText": [
          "window",
          "aisle",
          "prefer",
          "please"
        ],
        "options": [
          {
            "textEn": "I would prefer a table by the window.",
            "textAr": "أفضل ترابيزة جنب الشباك.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "إحنا في الطيارة. المطلوب window seat مش ترابيزة."
          },
          {
            "textEn": "I would like to check in one suitcase.",
            "textAr": "عايز أسلّم شنطة واحدة.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده رد عن الحقائب، مش اختيار المقعد."
          },
          {
            "textEn": "I would prefer a window seat if possible, please.",
            "textAr": "أفضل مقعداً بجوار النافذة إذا كان متاحاً، من فضلك.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "رائع جداً! استخدام if possible يظهر لباقة عالية في الحديث."
          },
          {
            "textEn": "Give me window!",
            "textAr": "أعطني نافذة!",
            "isOptimal": false,
            "score": 2,
            "feedbackAr": "أسلوب غير لائق في المحادثات الرسمية. استخدم I would prefer a window seat, please."
          }
        ]
      }
    ]
  },
  {
    "id": "sim-restaurant-ordering",
    "title": "Ordering at a Fine Dining Restaurant",
    "titleAr": "طلب الطعام وحجز الطاولة في مطعم راقٍ",
    "category": "hospitality",
    "categoryAr": "الضيافة والمطاعم",
    "level": "B1",
    "locationName": "The Ivy Restaurant - London",
    "locationIcon": "",
    "backdropImage": "/images/reallife/sim-restaurant-ordering.webp",
    "descriptionAr": "مواقف حقيقية في المطعم: حجز الطاولة، السؤال عن مكونات الطبق، طلب الفاتورة، وتقديم ملاحظة لبقة.",
    "keyVocabulary": [
      {
        "en": "Appetizer / Starter",
        "ar": "المقبلات والوجبة التمهيدية",
        "phonetic": "/ˈæpɪtaɪzər/"
      },
      {
        "en": "Main course",
        "ar": "الطبق الرئيسي",
        "phonetic": "/meɪn kɔːrs/"
      },
      {
        "en": "Allergic to",
        "ar": "لدي حساسية من",
        "phonetic": "/əˈlɜːrdʒɪk tuː/"
      },
      {
        "en": "Could we have the bill?",
        "ar": "هل يمكننا الحصول على الحساب من فضلك؟",
        "phonetic": "/bɪl/"
      },
      {
        "en": "Sparkling or still water",
        "ar": "مياه غازية أم مياه طبيعية عادية",
        "phonetic": "/ˈspɑːrklɪŋ/"
      }
    ],
    "rewardXp": 140,
    "turns": [
      {
        "id": "rest-turn-1",
        "speaker": "Marco Rossi",
        "speakerRole": "Head Waiter",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Good evening, sir. Welcome to The Ivy. Do you have a reservation for this evening?",
        "textAr": "مساء الخير يا سيدي. أهلاً بكم في The Ivy. هل لديكم حجز مسبق لهذه الليلة؟",
        "grammarTipAr": "اذكر اسم صاحب الحجز: \"Yes, a table for two under the name of...\"",
        "expectedKeywordsForFreeText": [
          "reservation",
          "name",
          "table",
          "two"
        ],
        "options": [
          {
            "textEn": "I want food now without table booking.",
            "textAr": "أريد طعاماً الآن بدون حجز طاولة.",
            "isOptimal": false,
            "score": 2,
            "feedbackAr": "صياغة غير مناسبة. إن لم تكن تملك حجزاً قل: Do you have a table for two available?"
          },
          {
            "textEn": "Could I have the bill, please?",
            "textAr": "ممكن الحساب، من فضلك؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "لسه وصلت المطعم والسؤال عن الحجز، فطلب الحساب مش مناسب هنا."
          },
          {
            "textEn": "Yes, my flight leaves at eight.",
            "textAr": "أيوه، رحلتي هتقلع الساعة 8.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "السؤال عن حجز المطعم مش موعد الطيران."
          },
          {
            "textEn": "Good evening. Yes, I have a reservation for two under the name of Karim.",
            "textAr": "مساء الخير. نعم، لدي حجز لشخصين باسم كريم.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "صياغة نموذجية وأنيقة جداً لمحادثات المطاعم الراقية."
          }
        ]
      },
      {
        "id": "rest-turn-2",
        "speaker": "Marco Rossi",
        "speakerRole": "Head Waiter",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Right this way, please. Here are the menus. Can I start you off with something to drink while you decide?",
        "textAr": "تفضل من هنا من فضلك. تفضل قوائم الطعام. هل يمكنني تقديم مشروب لكم أثناء اختيار الوجبة؟",
        "grammarTipAr": "للطلب المهذب: \"Could I have...\" أو \"We would like...\"",
        "expectedKeywordsForFreeText": [
          "water",
          "drink",
          "sparkling",
          "still",
          "please"
        ],
        "options": [
          {
            "textEn": "Could we please have a bottle of sparkling water with lemon to start?",
            "textAr": "هل يمكننا الحصول على زجاجة مياه فوارة مع ليمون كبداية من فضلك؟",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "طلب مهذب واحترافي باستخدام Could we please have."
          },
          {
            "textEn": "Bring me water fast.",
            "textAr": "أحضر لي ماء سريعاً.",
            "isOptimal": false,
            "score": 2,
            "feedbackAr": "صيغة أمر مباشرة وتعتبر غير مقبولة في الثقافة الإنجليزية."
          },
          {
            "textEn": "I have a reservation under Karim.",
            "textAr": "عندي حجز باسم كريم.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "الحجز اتأكد بالفعل. المطلوب تختار مشروب."
          },
          {
            "textEn": "Could you weigh my suitcase, please?",
            "textAr": "ممكن توزن شنطتي، من فضلك؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "وزن الحقائب موقف مطار، مش طلب مشروب."
          }
        ]
      }
    ]
  },
  {
    "id": "sim-doctor-appointment",
    "title": "Describing Symptoms to a Doctor",
    "titleAr": "شرح الأعراض المرضية للطبيب والصيدلي",
    "category": "healthcare",
    "categoryAr": "الرعاية الصحية والعيادات",
    "level": "B1",
    "locationName": "St. Mary Medical Center",
    "locationIcon": "",
    "backdropImage": "/images/reallife/sim-doctor-appointment.webp",
    "descriptionAr": "كيف تصف للطبيب بدقة ألم الرأس، الحمى، مدة استمرار التعب، ومواضع الشعور بالدوار.",
    "keyVocabulary": [
      {
        "en": "Symptoms",
        "ar": "الأعراض المرضية",
        "phonetic": "/ˈsɪmptəmz/"
      },
      {
        "en": "Severe headache",
        "ar": "صداع حاد ومؤلم",
        "phonetic": "/sɪˈvɪər ˈhedeɪk/"
      },
      {
        "en": "Prescription",
        "ar": "روشتة أو وصفة طبية",
        "phonetic": "/prɪˈskrɪpʃn/"
      },
      {
        "en": "Dizziness / Drowsy",
        "ar": "دوار وشعور بالنعاس",
        "phonetic": "/ˈdɪzinəs/"
      },
      {
        "en": "Side effects",
        "ar": "الآثار والآثار الجانبية للدواء",
        "phonetic": "/saɪd ɪˈfekts/"
      }
    ],
    "rewardXp": 150,
    "turns": [
      {
        "id": "doc-turn-1",
        "speaker": "Dr. Emily Watson",
        "speakerRole": "General Practitioner",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Hello there, please take a seat. What seems to be the problem today?",
        "textAr": "مرحباً بك، تفضل بالجلوس من فضلك. ما هي المشكلة أو الأعراض التي تشعر بها اليوم؟",
        "grammarTipAr": "لوصف الأعراض الممتدة: نستخدم المضارع التام المستمر: \"I have been having a severe headache since Tuesday\".",
        "expectedKeywordsForFreeText": [
          "headache",
          "pain",
          "fever",
          "days",
          "sick"
        ],
        "options": [
          {
            "textEn": "My appointment is feeling a fever.",
            "textAr": "موعدي حاسس بسخونية.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "الشخص هو اللي عنده حمى. قول I have a fever واشرح المدة."
          },
          {
            "textEn": "Doctor, I have been experiencing a severe throbbing headache and fever for the past three days.",
            "textAr": "دكتورة، أعاني من صداع نابض حاد وارتفاع في درجة الحرارة طوال الأيام الثلاثة الماضية.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "وصف طبي رائع ودقيق باستخدام المضارع التام المستمر (have been experiencing)."
          },
          {
            "textEn": "My head is broken since yesterday.",
            "textAr": "رأسي مكسور منذ الأمس.",
            "isOptimal": false,
            "score": 3,
            "feedbackAr": "broken تستخدم لكسور العظام (broken bone). للصداع نستخدم severe headache."
          },
          {
            "textEn": "I would like a return ticket, please.",
            "textAr": "عايز تذكرة ذهاب وعودة، من فضلك.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "الطبيب بيسأل عن الأعراض، مش حجز السفر."
          }
        ]
      }
    ]
  },
  {
    "id": "sim-job-interview",
    "title": "Global Tech Company Job Interview",
    "titleAr": "مقابلة عمل رسمية في شركة برمجيات وتكنولوجيا دولية",
    "category": "professional",
    "categoryAr": "إنجليزي الأعمال والوظائف",
    "level": "B2",
    "locationName": "Canary Wharf Tech Headquarters",
    "locationIcon": "",
    "backdropImage": "/images/reallife/sim-job-interview.webp",
    "descriptionAr": "تدريب احترافي للإجابة عن أسئلة المقابلات: تحدث عن نقاط قوتك، أسباب رغبتك بالانضمام، وإنجازاتك السابقة.",
    "keyVocabulary": [
      {
        "en": "Accomplishment",
        "ar": "إنجاز ملموس",
        "phonetic": "/əˈkɑːmplɪʃmənt/"
      },
      {
        "en": "Cross-functional team",
        "ar": "فريق عمل متعدد التخصصات",
        "phonetic": "/krɔːs ˈfʌŋkʃənl tiːm/"
      },
      {
        "en": "Scale the product",
        "ar": "توسيع نطاق المنتج البرمجي",
        "phonetic": "/skeɪl/"
      },
      {
        "en": "Deadline-driven",
        "ar": "ملتزم بالمواعيد النهائية بصرامة",
        "phonetic": "/ˈdedlaɪn drɪvn/"
      }
    ],
    "rewardXp": 180,
    "turns": [
      {
        "id": "job-turn-1",
        "speaker": "David Miller",
        "speakerRole": "VP of Engineering",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Welcome, we are thrilled to meet you. To kick things off, could you walk us through your most impactful recent project?",
        "textAr": "مرحباً بك، يسعدنا جداً مقابلتك. في البداية، هل يمكنك أن تحدثنا بإيجاز عن أكثر مشروعاتك الأخيرة تأثيراً ونجاحاً؟",
        "grammarTipAr": "استخدم صيغة STAR (الموقف، المهمة، الإجراء، النتيجة) مع أفعال ماضية حركية قوية (led, architected, optimized).",
        "expectedKeywordsForFreeText": [
          "project",
          "team",
          "led",
          "delivered",
          "improved"
        ],
        "options": [
          {
            "textEn": "I always arrive early and enjoy coffee.",
            "textAr": "أنا دايمًا بوصل بدري وبحب القهوة.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "معلومة عامة مش مثال على مشروع وتأثيره."
          },
          {
            "textEn": "Could you tell me when the flight boards?",
            "textAr": "ممكن تقول لي الصعود للطيارة إمتى؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده سؤال مطار، مش إجابة عن مشروعك في مقابلة عمل."
          },
          {
            "textEn": "Certainly. In my previous role, I spearheaded a team that restructured our cloud database, reducing latency by 45%.",
            "textAr": "بكل تأكيد. في دوري السابق، قدت فريقاً أعاد هيكلة قاعدة البيانات السحابية، مما قلل زمن الاستجابة بنسبة 45%.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "إجابة مذهلة! استخدام أفعال قوية (spearheaded, restructured) مع أرقام دقيقة يعطي انطباعاً قيادياً مبهراً."
          },
          {
            "textEn": "I worked on a lot of things, everything was fine and I do my best.",
            "textAr": "عملت على الكثير من الأشياء، كل شيء كان جيداً وأبذل ما بوسعي.",
            "isOptimal": false,
            "score": 4,
            "feedbackAr": "إجابة عامة وغامضة جداً. في المقابلات يجب ذكر أمثلة محددة وإنجازات بالأرقام."
          }
        ]
      }
    ]
  },
  {
    "id": "sim-coffee-shop",
    "title": "Coffee Shop Order & Friendly Small Talk",
    "titleAr": "طلب القهوة والدردشة الودية في الكافيه",
    "category": "daily",
    "categoryAr": "الحياة اليومية",
    "level": "A1",
    "locationName": "Downtown Specialty Coffee House",
    "locationIcon": "Cafe",
    "backdropImage": "/images/reallife/sim-coffee-shop.webp",
    "descriptionAr": "أشهر موقف يومي على الإطلاق: اطلب قهوتك بالمواصفات اللي تعجبك، اسأل عن الواي فاي، ورد على الدردشة الودية من الباريستا بثقة.",
    "keyVocabulary": [
      {
        "en": "Medium roast",
        "ar": "بن محمص وسط",
        "phonetic": "/ˈmiːdiəm roʊst/"
      },
      {
        "en": "Iced latte",
        "ar": "لاتيه مثلج",
        "phonetic": "/aɪst ˈlɑːteɪ/"
      },
      {
        "en": "For here or to go?",
        "ar": "هنا في الكافيه ولا تيك أواي؟",
        "phonetic": "/fər hɪr ɔːr tə ɡoʊ/"
      },
      {
        "en": "Wifi password",
        "ar": "كلمة سر الواي فاي",
        "phonetic": "/ˈwaɪfaɪ ˈpæswɜːrd/"
      },
      {
        "en": "Keep the change",
        "ar": "اتفضل الباقي (بقشيش)",
        "phonetic": "/kiːp ðə tʃeɪndʒ/"
      }
    ],
    "rewardXp": 100,
    "turns": [
      {
        "id": "turn-1",
        "speaker": "Mona Adel",
        "speakerRole": "Barista",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Hi there! Welcome to Downtown Coffee. What can I get started for you today?",
        "textAr": "أهلاً بك! مرحباً بك في كافيه وسط البلد. ماذا يمكنني أن أحضر لك اليوم؟",
        "grammarTipAr": "للطلب المهذب استخدم \"Can I have...\" أو \"I would like...\" وتجنب كلمة \"Want\" لأنها حادة في المواقف الرسمية.",
        "expectedKeywordsForFreeText": [
          "have",
          "like",
          "coffee",
          "please"
        ],
        "options": [
          {
            "textEn": "Give me coffee. Big one. Fast.",
            "textAr": "هات قهوة. كبيرة. بسرعة.",
            "isOptimal": false,
            "score": 2,
            "feedbackAr": "صيغة أمر حادة جداً وغير مهذبة في الثقافة الإنجليزية. استخدم Can I have بدلاً من Give me."
          },
          {
            "textEn": "I am wanting one coffee, if you are okay.",
            "textAr": "أنا أريد قهوة واحدة، إذا كان ذلك مناسباً لك.",
            "isOptimal": false,
            "score": 4,
            "feedbackAr": "فعل want من أفعال الحالة (Stative Verbs) ولا يستخدم في المستمر. الصح: I would like a coffee, please."
          },
          {
            "textEn": "A table for four, please.",
            "textAr": "ترابيزة لأربعة، من فضلك.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "الموظف بيسأل عن طلبك. ده رد لحجز ترابيزة مش تحديد مشروب."
          },
          {
            "textEn": "Hi! Can I have a large iced latte with caramel, please?",
            "textAr": "أهلاً! ممكن لاتيه مثلج كبير بالكراميل من فضلك؟",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "طلب مثالي: مهذب، واضح، وبالمواصفات الكاملة زي أهل اللغة بالظبط."
          }
        ]
      },
      {
        "id": "turn-2",
        "speaker": "Mona Adel",
        "speakerRole": "Barista",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Great choice! For here or to go?",
        "textAr": "اختيار رائع! هتشربها هنا في الكافيه ولا تيك أواي؟",
        "grammarTipAr": "سؤال For here or to go? هو الأشهر في كل كافيهات العالم. الإجابة بكلمة واحدة كافية: To go, please.",
        "expectedKeywordsForFreeText": [
          "here",
          "go",
          "takeaway",
          "stay"
        ],
        "options": [
          {
            "textEn": "To go, please. I am running a little late for work.",
            "textAr": "تيك أواي من فضلك. أنا متأخر شوية عن الشغل.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "إجابة طبيعية جداً، والتعبير running late هو الأدق للتأخير البسيط."
          },
          {
            "textEn": "I would like an aisle seat, please.",
            "textAr": "عايز مقعد على الممر، من فضلك.",
            "isOptimal": false,
            "score": 5,
            "feedbackAr": "ده رد لاختيار مقعد طيارة، مش لتحديد مكان شرب القهوة."
          },
          {
            "textEn": "Yes, I would like oat milk.",
            "textAr": "أيوه، عايز لبن شوفان.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده رد عن نوع اللبن. المطلوب تحدد هتشرب هنا ولا تاخده معاك."
          },
          {
            "textEn": "The cup is made of paper.",
            "textAr": "الكوباية مصنوعة من الورق.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "نوع الكوباية مش إجابة مباشرة على For here or to go?"
          }
        ]
      },
      {
        "id": "turn-3",
        "speaker": "Mona Adel",
        "speakerRole": "Barista",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Sure! That will be 4.50. Anything else with that? A muffin or a cookie maybe?",
        "textAr": "حاضر! الحساب 4.50. أي حاجة تانية معاها؟ مافين أو كوكيز مثلاً؟",
        "grammarTipAr": "للرفض المهذب استخدم \"No, thanks. That is all.\" وللموافقة \"Yes, please. I will also take...\"",
        "expectedKeywordsForFreeText": [
          "thanks",
          "all",
          "also",
          "cookie"
        ],
        "options": [
          {
            "textEn": "I would like to reserve a room for tonight.",
            "textAr": "عايز أحجز أوضة لليلة دي.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "السؤال عن إضافة حاجة للطلب، مش حجز فندق."
          },
          {
            "textEn": "No, thanks. That is all for today. Oh, and could I get the wifi password, please?",
            "textAr": "لا شكراً. ده كل حاجة النهاردة. آه، وممكن كلمة سر الواي فاي من فضلك؟",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "رد متكامل: رفض مهذب ثم طلب إضافي بصيغة Could I get الاحترافية."
          },
          {
            "textEn": "No. I do not want more things from you now.",
            "textAr": "لا. لا أريد أشياء إضافية منك الآن.",
            "isOptimal": false,
            "score": 3,
            "feedbackAr": "الرد جاف ومباشر بشكل مزعج. كلمة No لوحدها تعتبر غير مهذبة؛ أضف thanks دائماً."
          },
          {
            "textEn": "Could I check in my luggage here?",
            "textAr": "ممكن أسلّم شنطي هنا؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "إحنا عند الكاشير في الكافيه، مش شباك المطار."
          }
        ]
      },
      {
        "id": "turn-4",
        "speaker": "Mona Adel",
        "speakerRole": "Barista",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Of course! The password is on your receipt. Your latte will be ready in two minutes. Have a great day!",
        "textAr": "طبعاً! كلمة السر على الإيصال. اللاتيه بتاعك هيكون جاهز خلال دقيقتين. أتمنى لك يوماً سعيداً!",
        "grammarTipAr": "الرد على Have a great day يكون بـ \"Thanks, you too!\" وهي أشهر عبارة ختامية في المواقف اليومية.",
        "expectedKeywordsForFreeText": [
          "thanks",
          "too",
          "day",
          "thank"
        ],
        "options": [
          {
            "textEn": "Could I have the menu before I order?",
            "textAr": "ممكن المنيو قبل ما أطلب؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "إنت طلبت بالفعل والمشروب بيتجهز. ده مش رد مناسب على الوداع."
          },
          {
            "textEn": "My passport expires next month.",
            "textAr": "جواز سفري هينتهي الشهر الجاي.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "معلومة غير مرتبطة بالوداع في الكافيه."
          },
          {
            "textEn": "Thanks so much, you too! Have a wonderful shift.",
            "textAr": "شكراً جزيلاً، وأنتي كمان! أتمنى لك وردية عمل سعيدة.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "ختام دافئ واحترافي يترك انطباعاً رائعاً، وعبارة you too هي الرد الذهبي السريع."
          },
          {
            "textEn": "Could I have my boarding pass now?",
            "textAr": "ممكن بطاقة صعود الطيارة دلوقتي؟",
            "isOptimal": false,
            "score": 5,
            "feedbackAr": "إحنا في كافيه مش مطار. الرد المناسب على التمنيات هو الشكر ورد التحية."
          }
        ]
      }
    ]
  },
  {
    "id": "sim-hotel-checkin",
    "title": "Hotel Check-in & Room Requests",
    "titleAr": "الحجز والاستقبال في الفندق",
    "category": "hospitality",
    "categoryAr": "الفنادق والضيافة",
    "level": "A2",
    "locationName": "Nile View Grand Hotel",
    "locationIcon": "Hotel",
    "backdropImage": "/images/reallife/sim-hotel-checkin.webp",
    "descriptionAr": "موقف أساسي لأي مسافر: استلم غرفتك في الفندق، اسأل عن مواعيد الإفطار والواي فاي، واطلب أي احتياجات إضافية بأدب واحترافية.",
    "keyVocabulary": [
      {
        "en": "Reservation under the name...",
        "ar": "حجز باسم...",
        "phonetic": "/ˌrezərˈveɪʃən ˈʌndər ðə neɪm/"
      },
      {
        "en": "Check-in / Check-out",
        "ar": "تسجيل الوصول / المغادرة",
        "phonetic": "/tʃek ɪn - tʃek aʊt/"
      },
      {
        "en": "Complimentary breakfast",
        "ar": "إفطار مجاني",
        "phonetic": "/ˌkɑːmplɪˈmentri ˈbrekfəst/"
      },
      {
        "en": "Room service",
        "ar": "خدمة الغرف",
        "phonetic": "/ruːm ˈsɜːrvɪs/"
      },
      {
        "en": "Late check-out",
        "ar": "مغادرة متأخرة",
        "phonetic": "/leɪt ˈtʃek aʊt/"
      }
    ],
    "rewardXp": 120,
    "turns": [
      {
        "id": "hotel-turn-1",
        "speaker": "Karim Samy",
        "speakerRole": "Front Desk Receptionist",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Good evening, welcome to Nile View Grand Hotel. How may I help you?",
        "textAr": "مساء الخير، مرحباً بك في فندق إطلالة النيل الكبير. كيف يمكنني مساعدتك؟",
        "grammarTipAr": "للتعريف بحجزك استخدم: \"I have a reservation under the name...\" وهي الصيغة المعتمدة في كل فنادق العالم.",
        "expectedKeywordsForFreeText": [
          "reservation",
          "booking",
          "name",
          "check"
        ],
        "options": [
          {
            "textEn": "I booked room here. Give me key fast, I am tired.",
            "textAr": "حجزت أوضة هنا. هات المفتاح بسرعة، أنا تعبان.",
            "isOptimal": false,
            "score": 3,
            "feedbackAr": "الطلب جاف ويفتقد الأدب الأساسي. ابدأ بتحية ثم اذكر حجزك بهدوء: I have a reservation."
          },
          {
            "textEn": "Is this hotel? I want sleeping place for night time.",
            "textAr": "هل هذا فندق؟ أريد مكاناً للنوم في الليل.",
            "isOptimal": false,
            "score": 4,
            "feedbackAr": "صياغة غير طبيعية وغير مباشرة. قل بوضوح: I have a reservation / I would like to check in."
          },
          {
            "textEn": "I would like a boarding pass, please.",
            "textAr": "عايز بطاقة صعود الطيارة، من فضلك.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده مكتب استقبال فندق، مش مطار."
          },
          {
            "textEn": "Good evening. I have a reservation under the name Alhinawi for three nights.",
            "textAr": "مساء الخير. عندي حجز باسم الحيناوي لمدة ٣ ليالي.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "افتتاحية مثالية: تحية مهذبة ثم تفاصيل الحجز بالاسم والمدة مباشرة."
          }
        ]
      },
      {
        "id": "hotel-turn-2",
        "speaker": "Karim Samy",
        "speakerRole": "Front Desk Receptionist",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Certainly, Mr. Alhinawi. I found your booking. Would you prefer a room with a Nile view or a city view?",
        "textAr": "بالتأكيد يا مستر الحيناوي. وجدت حجزك. هل تفضل غرفة بإطلالة على النيل أم على المدينة؟",
        "grammarTipAr": "للتعبير عن التفضيل استخدم: \"I would prefer...\" أو \"I would like...\" وهي أرقى من I want.",
        "expectedKeywordsForFreeText": [
          "prefer",
          "view",
          "Nile",
          "like"
        ],
        "options": [
          {
            "textEn": "I would prefer a Nile view, please. And if possible, a quiet room on a high floor.",
            "textAr": "أفضل إطلالة على النيل من فضلك. وإذا أمكن، غرفة هادئة في دور عالي.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "رد راقٍ جداً: I would prefer للتفضيل + if possible لطلب إضافي مهذب."
          },
          {
            "textEn": "Nile. And no noise. I hate noise very much.",
            "textAr": "النيل. وبدون صوت. أنا أكره الصوت جداً.",
            "isOptimal": false,
            "score": 4,
            "feedbackAr": "مفهومة لكن حادة ومباشرة أكثر من اللازم. استخدم I would prefer a quiet room بدلاً من no noise."
          },
          {
            "textEn": "I would prefer the aisle seat.",
            "textAr": "أفضل المقعد اللي على الممر.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "السؤال عن إطلالة الأوضة، مش مقعد طيارة."
          },
          {
            "textEn": "Could I have my coffee to go?",
            "textAr": "ممكن أخد قهوتي معايا؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده مش رد على الاختيار بين إطلالة النيل والمدينة."
          }
        ]
      },
      {
        "id": "hotel-turn-3",
        "speaker": "Karim Samy",
        "speakerRole": "Front Desk Receptionist",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Perfect. Your room is 1205 on the twelfth floor. Breakfast is complimentary from 6:30 to 10:30 in the main restaurant. Is there anything else you need?",
        "textAr": "ممتاز. غرفتك رقم 1205 في الدور الثاني عشر. الإفطار مجاني من 6:30 إلى 10:30 في المطعم الرئيسي. هل تحتاج أي شيء آخر؟",
        "grammarTipAr": "للسؤال عن خدمات الفندق استخدم Could you tell me... أو Could I get... وهي صيغ الاستفسار الرسمية.",
        "expectedKeywordsForFreeText": [
          "wifi",
          "password",
          "check-out",
          "could"
        ],
        "options": [
          {
            "textEn": "I need a prescription for antibiotics.",
            "textAr": "محتاج روشتة مضاد حيوي.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده طلب طبي، مش خدمة من خدمات استقبال الفندق."
          },
          {
            "textEn": "Yes, please. Could you tell me the wifi password? And could I get a late check-out on Friday?",
            "textAr": "أيوه من فضلك. ممكن تقولي كلمة سر الواي فاي؟ وممكن مغادرة متأخرة يوم الجمعة؟",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "استفسار احترافي متكامل بصيغتي Could you tell me و Could I get."
          },
          {
            "textEn": "No. Everything is finished. Goodbye.",
            "textAr": "لا. كل شيء انتهى. وداعاً.",
            "isOptimal": false,
            "score": 5,
            "feedbackAr": "مقبولة لكن جافة. الألطف: No, that is all, thank you very much."
          },
          {
            "textEn": "Please cancel my flight to London.",
            "textAr": "من فضلك الغي رحلتي للندن.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "الاستقبال بيسأل عن احتياجات إقامتك في الفندق، مش إلغاء رحلة."
          }
        ]
      }
    ]
  },
  {
    "id": "sim-pharmacy-visit",
    "title": "Pharmacy Visit & Medicine Instructions",
    "titleAr": "زيارة الصيدلية وتعليمات الدواء",
    "category": "healthcare",
    "categoryAr": "الصحة والمستشفيات",
    "level": "A2",
    "locationName": "City Care Pharmacy",
    "locationIcon": "Pharmacy",
    "backdropImage": "/images/reallife/sim-pharmacy-visit.webp",
    "descriptionAr": "موقف صحي يومي: اشرح أعراضك للصيدلي، اسأل عن الجرعة والأعراض الجانبية، وافهم تعليمات الاستخدام بدقة.",
    "keyVocabulary": [
      {
        "en": "Dosage",
        "ar": "الجرعة المحددة",
        "phonetic": "/ˈdoʊsɪdʒ/"
      },
      {
        "en": "Side effects",
        "ar": "الأعراض الجانبية",
        "phonetic": "/saɪd ɪˈfekts/"
      },
      {
        "en": "Twice a day",
        "ar": "مرتين يومياً",
        "phonetic": "/twaɪs ə deɪ/"
      },
      {
        "en": "On an empty stomach",
        "ar": "على معدة فارغة",
        "phonetic": "/ɑːn ən ˈempti ˈstʌmək/"
      },
      {
        "en": "Prescription",
        "ar": "روشتة طبية",
        "phonetic": "/prɪˈskrɪpʃən/"
      }
    ],
    "rewardXp": 120,
    "turns": [
      {
        "id": "pharm-turn-1",
        "speaker": "Dr. Nour Adel",
        "speakerRole": "Pharmacist",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Good evening! How can I help you today?",
        "textAr": "مساء الخير! أقدر أساعدك إزاي النهاردة؟",
        "grammarTipAr": "لشرح الأعراض استخدم المضارع التام المستمر: \"I have been feeling...\" لوصف أعراض بدأت من فترة ومستمرة حتى الآن.",
        "expectedKeywordsForFreeText": [
          "headache",
          "feeling",
          "pain",
          "since"
        ],
        "options": [
          {
            "textEn": "Head hurt. Want medicine.",
            "textAr": "الراس بتوجع. عايز دوا.",
            "isOptimal": false,
            "score": 5,
            "feedbackAr": "مفهومة لكن ناقصة القواعد. الصح: My head hurts. I need some medicine, please."
          },
          {
            "textEn": "Could I try this jacket in a larger size?",
            "textAr": "ممكن أجرّب الجاكيت ده بمقاس أكبر؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "إحنا في الصيدلية. المطلوب توضح المشكلة الصحية."
          },
          {
            "textEn": "Good evening. I have been having a strong headache since yesterday, and I need something for it.",
            "textAr": "مساء الخير. عندي صداع قوي من امبارح ومحتاج حاجة ليه.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "وصف دقيق للأعراض بالمضارع التام المستمر مع تحديد بدايتها (since yesterday)."
          },
          {
            "textEn": "My head is exploding! Give me your strongest pill immediately!",
            "textAr": "راسي بتنفجر! هات أقوى حباية عندك فوراً!",
            "isOptimal": false,
            "score": 3,
            "feedbackAr": "الصيغة انفعالية وغير مناسبة للموقف الطبي. صف الأعراض بهدوء ودقة بدلاً من طلب \"أقوى دواء\"."
          }
        ]
      },
      {
        "id": "pharm-turn-2",
        "speaker": "Dr. Nour Adel",
        "speakerRole": "Pharmacist",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "I am sorry to hear that. Are you allergic to any medication, or are you taking anything else at the moment?",
        "textAr": "متأسفة لسماع ذلك. هل لديك حساسية من أي دواء، أو بتاخد أي أدوية تانية حالياً؟",
        "grammarTipAr": "للإجابة عن الحساسية استخدم: \"I am allergic to...\" أو للنفي \"No, I am not allergic to anything.\"",
        "expectedKeywordsForFreeText": [
          "allergic",
          "no",
          "yes",
          "taking"
        ],
        "options": [
          {
            "textEn": "I do not know. Doctors never told me these things.",
            "textAr": "مش عارف. الدكاترة ماقالوليش الحاجات دي قبل كده.",
            "isOptimal": false,
            "score": 5,
            "feedbackAr": "الرد غامض وقد يكون خطيراً. إذا لم تكن متأكداً قل: I am not sure, could you check?"
          },
          {
            "textEn": "I would prefer a window seat.",
            "textAr": "أفضل مقعد جنب الشباك.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "الصيدلي سأل عن الحساسية والأدوية الحالية، مش السفر."
          },
          {
            "textEn": "This medicine looks very expensive.",
            "textAr": "الدواء ده شكله غالي أوي.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "السعر مش إجابة عن الحساسية. لازم تجاوب السؤال الصحي بوضوح."
          },
          {
            "textEn": "No, I am not allergic to anything, and I am not taking any other medicine right now.",
            "textAr": "لا، ماعنديش حساسية من أي حاجة، ومش باخد أي دوا تاني حالياً.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "إجابة كاملة وآمنة: نفت الحساسية والأدوية الأخرى بوضوح."
          }
        ]
      },
      {
        "id": "pharm-turn-3",
        "speaker": "Dr. Nour Adel",
        "speakerRole": "Pharmacist",
        "speakerAvatar": "/images/reallife/rl-avatar.webp",
        "textEn": "Alright. This painkiller should help. Take one tablet twice a day after meals for three days. Any questions about the dosage?",
        "textAr": "حسناً. المسكن ده المفروض يساعدك. خد قرص واحد مرتين يومياً بعد الأكل لمدة ٣ أيام. أي أسئلة عن الجرعة؟",
        "grammarTipAr": "للتأكد من الفهم استخدم: \"Just to confirm, should I take it before or after meals?\" صيغة should I للاستفسار عن التعليمات.",
        "expectedKeywordsForFreeText": [
          "confirm",
          "should",
          "meals",
          "after"
        ],
        "options": [
          {
            "textEn": "Just to confirm, should I take it after meals even in the morning? And what should I do if the pain continues?",
            "textAr": "للتأكيد بس، آخده بعد الأكل حتى في الصبح؟ ولو الوجع استمر أعمل إيه؟",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "سؤال تأكيد احترافي يوضح الجرعة ويستفسر عن الخطة الاحتياطية."
          },
          {
            "textEn": "No questions. Pills are pills. Thanks.",
            "textAr": "مفيش أسئلة. الحبوب حبوب. شكراً.",
            "isOptimal": false,
            "score": 4,
            "feedbackAr": "رد مستعجل قد يضيع معلومات مهمة عن الجرعة والتحذيرات. استغل الفرصة للتأكد من التعليمات."
          },
          {
            "textEn": "I will take all the tablets at once.",
            "textAr": "هاخد كل الأقراص مرة واحدة.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده مخالف للتعليمات المذكورة وقد يكون خطرًا. اتبع تعليمات الصيدلي واسأل لو مش فاهم."
          },
          {
            "textEn": "Does this tablet come in blue?",
            "textAr": "القرص ده موجود باللون الأزرق؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "اللون مش السؤال المهم هنا. اتأكد من الجرعة ومواعيد الاستخدام."
          }
        ]
      }
    ]
  },
  {
    "id": "sim-clothing-shopping",
    "title": "Clothes Shopping",
    "titleAr": "شراء الملابس",
    "category": "daily",
    "categoryAr": "الحياة اليومية",
    "level": "A1",
    "locationName": "Clothing Studio",
    "locationIcon": "",
    "backdropImage": "/images/reallife/sim-clothing-shopping.webp",
    "descriptionAr": "السؤال عن المقاس واللون وتجربة الملابس.",
    "keyVocabulary": [
      {
        "en": "Size",
        "ar": "مقاس"
      },
      {
        "en": "Fitting room",
        "ar": "غرفة قياس"
      },
      {
        "en": "Price",
        "ar": "سعر"
      }
    ],
    "rewardXp": 60,
    "turns": [
      {
        "id": "turn-1",
        "speaker": "Mona",
        "speakerRole": "Shop Assistant",
        "speakerAvatar": "/models/city/person-preview.webp",
        "textEn": "Hello! Can I help you find anything?",
        "textAr": "أهلاً! أقدر أساعدك تلاقي حاجة؟",
        "grammarTipAr": "ركز على تركيب I am looking for وبعده الحاجة اللي بتدور عليها.",
        "expectedKeywordsForFreeText": [
          "i",
          "am",
          "looking",
          "for"
        ],
        "options": [
          {
            "textEn": "My flight leaves at six.",
            "textAr": "طيارتي هتقلع الساعة 6.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "موعد الرحلة مش طلب ملابس."
          },
          {
            "textEn": "I am looking for a blue shirt, please.",
            "textAr": "بدوّر على قميص أزرق، من فضلك.",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "صحيح. ركز على تركيب I am looking for وبعده الحاجة اللي بتدور عليها."
          },
          {
            "textEn": "I looking blue.",
            "textAr": "صياغة غير طبيعية تحتاج تصحيح.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ركز على تركيب I am looking for وبعده الحاجة اللي بتدور عليها."
          },
          {
            "textEn": "Could I have the restaurant menu?",
            "textAr": "ممكن منيو المطعم؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "إحنا في محل ملابس. وضّح قطعة اللبس اللي بتدوّر عليها."
          }
        ]
      },
      {
        "id": "turn-2",
        "speaker": "Mona",
        "speakerRole": "Shop Assistant",
        "speakerAvatar": "/models/city/person-preview.webp",
        "textEn": "What size do you need?",
        "textAr": "محتاج مقاس إيه؟",
        "grammarTipAr": "Do you have this in... طريقة طبيعية للسؤال عن المقاس.",
        "expectedKeywordsForFreeText": [
          "do",
          "you",
          "have",
          "this"
        ],
        "options": [
          {
            "textEn": "I would like to pay in cash.",
            "textAr": "عايز أدفع كاش.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "السؤال عن المقاس، مش طريقة الدفع."
          },
          {
            "textEn": "The fitting room is beside the stairs.",
            "textAr": "غرفة القياس جنب السلم.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده وصف مكان، مش تحديد مقاسك."
          },
          {
            "textEn": "Do you have this in a medium?",
            "textAr": "عندكم من ده مقاس متوسط؟",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "صحيح. Do you have this in... طريقة طبيعية للسؤال عن المقاس."
          },
          {
            "textEn": "Give big me.",
            "textAr": "صياغة غير طبيعية تحتاج تصحيح.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "Do you have this in... طريقة طبيعية للسؤال عن المقاس."
          }
        ]
      },
      {
        "id": "turn-3",
        "speaker": "Mona",
        "speakerRole": "Shop Assistant",
        "speakerAvatar": "/models/city/person-preview.webp",
        "textEn": "Of course. Would you like to try it on?",
        "textAr": "طبعًا. تحب تجرّبه؟",
        "grammarTipAr": "Fitting rooms هي غرف قياس الملابس. Try it on معناها تجرّب تلبسه.",
        "expectedKeywordsForFreeText": [
          "yes,",
          "please",
          "where",
          "are"
        ],
        "options": [
          {
            "textEn": "Where clothes box?",
            "textAr": "صياغة غير طبيعية تحتاج تصحيح.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "Fitting rooms هي غرف قياس الملابس. Try it on معناها تجرّب تلبسه."
          },
          {
            "textEn": "Could you weigh these apples?",
            "textAr": "ممكن توزن التفاح ده؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده طلب سوبر ماركت، مش تجربة قميص."
          },
          {
            "textEn": "My booking reference is on my ticket.",
            "textAr": "رقم حجزي على التذكرة.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "رقم حجز السفر مش مرتبط بتجربة الملابس."
          },
          {
            "textEn": "Yes, please. Where are the fitting rooms?",
            "textAr": "أيوه، من فضلك. فين غرف القياس؟",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "صحيح. Fitting rooms هي غرف قياس الملابس. Try it on معناها تجرّب تلبسه."
          }
        ]
      }
    ]
  },
  {
    "id": "sim-supermarket-shopping",
    "title": "At the Supermarket",
    "titleAr": "في السوبر ماركت",
    "category": "daily",
    "categoryAr": "الحياة اليومية",
    "level": "A1",
    "locationName": "Neighbourhood Market",
    "locationIcon": "",
    "backdropImage": "/images/reallife/sim-supermarket-shopping.webp",
    "descriptionAr": "السؤال عن المنتجات والكميات والدفع.",
    "keyVocabulary": [
      {
        "en": "Aisle",
        "ar": "ممر بين الرفوف"
      },
      {
        "en": "Receipt",
        "ar": "إيصال"
      },
      {
        "en": "Checkout",
        "ar": "كاشير"
      }
    ],
    "rewardXp": 60,
    "turns": [
      {
        "id": "turn-1",
        "speaker": "Omar",
        "speakerRole": "Store Assistant",
        "speakerAvatar": "/models/city/person-preview.webp",
        "textEn": "Hi! Do you need a hand finding anything?",
        "textAr": "أهلاً! محتاج مساعدة تلاقي حاجة؟",
        "grammarTipAr": "Where can I find... سؤال مهذب عن مكان المنتج.",
        "expectedKeywordsForFreeText": [
          "yes,",
          "please",
          "where",
          "can"
        ],
        "options": [
          {
            "textEn": "Yes, please. Where can I find the milk?",
            "textAr": "أيوه، من فضلك. ألاقي اللبن فين؟",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "صحيح. Where can I find... سؤال مهذب عن مكان المنتج."
          },
          {
            "textEn": "Milk where give.",
            "textAr": "صياغة غير طبيعية تحتاج تصحيح.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "Where can I find... سؤال مهذب عن مكان المنتج."
          },
          {
            "textEn": "Could I have a room with a view?",
            "textAr": "ممكن أوضة بإطلالة؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده سؤال فندق، مش طلب منتج في سوبر ماركت."
          },
          {
            "textEn": "I need a boarding pass.",
            "textAr": "محتاج بطاقة صعود الطيارة.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده طلب مطار. هنا وضّح المنتج اللي بتدوّر عليه."
          }
        ]
      },
      {
        "id": "turn-2",
        "speaker": "Omar",
        "speakerRole": "Store Assistant",
        "speakerAvatar": "/models/city/person-preview.webp",
        "textEn": "The milk is in aisle three, beside the cheese.",
        "textAr": "اللبن في الممر رقم 3، جنب الجبنة.",
        "grammarTipAr": "For one carton بتوضح إنك بتسأل عن سعر عبوة واحدة.",
        "expectedKeywordsForFreeText": [
          "thank",
          "you",
          "is",
          "this"
        ],
        "options": [
          {
            "textEn": "Could I try this shirt on?",
            "textAr": "ممكن أجرّب القميص ده؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده سؤال محل ملابس، مش سوبر ماركت."
          },
          {
            "textEn": "Thank you. Is this price for one carton?",
            "textAr": "شكرًا. السعر ده للعبوة الواحدة؟",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "صحيح. For one carton بتوضح إنك بتسأل عن سعر عبوة واحدة."
          },
          {
            "textEn": "This price all shop?",
            "textAr": "صياغة غير طبيعية تحتاج تصحيح.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "For one carton بتوضح إنك بتسأل عن سعر عبوة واحدة."
          },
          {
            "textEn": "Is breakfast included in the room rate?",
            "textAr": "الفطار داخل في سعر الأوضة؟",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "ده سؤال فندق. إحنا بنتكلم عن سعر عبوة لبن."
          }
        ]
      },
      {
        "id": "turn-3",
        "speaker": "Omar",
        "speakerRole": "Store Assistant",
        "speakerAvatar": "/models/city/person-preview.webp",
        "textEn": "Yes. Are you paying by cash or card?",
        "textAr": "أيوه. هتدفع كاش ولا بالكارت؟",
        "grammarTipAr": "Receipt يعني إيصال. By card تعبير طبيعي لطريقة الدفع.",
        "expectedKeywordsForFreeText": [
          "by",
          "card,",
          "please",
          "could"
        ],
        "options": [
          {
            "textEn": "I would like a medium shirt.",
            "textAr": "عايز قميص مقاس متوسط.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "السؤال عن الدفع، مش اختيار ملابس."
          },
          {
            "textEn": "My room number is twelve.",
            "textAr": "رقم أوضتي 12.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "رقم الأوضة مش طريقة دفع في سوبر ماركت."
          },
          {
            "textEn": "By card, please. Could I have a receipt?",
            "textAr": "بالكارت، من فضلك. ممكن الإيصال؟",
            "isOptimal": true,
            "score": 10,
            "feedbackAr": "صحيح. Receipt يعني إيصال. By card تعبير طبيعي لطريقة الدفع."
          },
          {
            "textEn": "I want money paper.",
            "textAr": "صياغة غير طبيعية تحتاج تصحيح.",
            "isOptimal": false,
            "score": 0,
            "feedbackAr": "Receipt يعني إيصال. By card تعبير طبيعي لطريقة الدفع."
          }
        ]
      }
    ]
  }
];
