export interface VocabWord {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaningAr: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  category:
    | "everyday"
    | "business"
    | "tech"
    | "academic"
    | "travel"
    | "workplace"
    | "medical"
    | "food"
    | "hotel"
    | "phrasal_verbs"
    | "idioms"
    | "collocations";
  exampleEn: string;
  exampleAr: string;
  highlight: string;
  collocation?: string;
}

export const VOCABULARY_ACADEMY_WORDS: VocabWord[] = [
  // 1. Business & Workplace
  {
    id: "voc-biz-1",
    word: "deadline",
    ipa: "/ˈded.laɪn/",
    partOfSpeech: "noun",
    meaningAr: "الموعد النهائي لتسليم العمل",
    level: "B1",
    category: "business",
    exampleEn:
      "By Friday at 5 PM, we will have met the final project deadline.",
    exampleAr:
      "قبل يوم الجمعة في الخامسة مساءً، سنكون قد أوفينا بالموعد النهائي للمشروع.",
    highlight: "deadline",
    collocation: "meet a deadline / tight deadline",
  },
  {
    id: "voc-biz-2",
    word: "stakeholder",
    ipa: "/ˈsteɪkˌhəʊl.dər/",
    partOfSpeech: "noun",
    meaningAr: "صاحب مصلحة / شريك أو طرف معني في المشروع",
    level: "B2",
    category: "business",
    exampleEn:
      "The executive presented the strategic quarterly updates to all key stakeholders.",
    exampleAr:
      "قدم المدير التنفيذي التحديثات الربع سنوية الاستراتيجية لجميع الأطراف المعنية.",
    highlight: "stakeholders",
    collocation: "key stakeholders",
  },
  {
    id: "voc-biz-3",
    word: "negotiate",
    ipa: "/nəˈɡəʊ.ʃi.eɪt/",
    partOfSpeech: "verb",
    meaningAr: "يتفاوض للوصول إلى اتفاق",
    level: "B2",
    category: "business",
    exampleEn:
      "We negotiated better contract terms before signing the partnership agreement.",
    exampleAr: "تفاوضنا للحصول على شروط عقد أفضل قبل توقيع اتفاقية الشراكة.",
    highlight: "negotiated",
    collocation: "negotiate a deal",
  },
  {
    id: "voc-biz-4",
    word: "collaboration",
    ipa: "/kəˌlæb.əˈreɪ.ʃən/",
    partOfSpeech: "noun",
    meaningAr: "التعاون المشترك والعمل بروح الفريق",
    level: "B1",
    category: "workplace",
    exampleEn:
      "Cross-functional collaboration between marketing and engineering was essential.",
    exampleAr: "كان التعاون المشترك بين فريقي التسويق والهندسة أمراً جوهرياً.",
    highlight: "collaboration",
    collocation: "close collaboration",
  },
  {
    id: "voc-biz-5",
    word: "workflow",
    ipa: "/ˈwɜːk.fləʊ/",
    partOfSpeech: "noun",
    meaningAr: "مسار وسير العمل الإداري أو التقني",
    level: "B1",
    category: "workplace",
    exampleEn:
      "Automating repetitive tasks streamlined our daily editorial workflow.",
    exampleAr:
      "أدت أتمتة المهام المتكررة إلى تسهيل مسار عملنا التحريري اليومي.",
    highlight: "workflow",
    collocation: "streamline workflow",
  },

  // 2. Technology & Software
  {
    id: "voc-tech-1",
    word: "deployment",
    ipa: "/dɪˈplɔɪ.mənt/",
    partOfSpeech: "noun",
    meaningAr: "نشر وإطلاق البرمجيات في بيئة الإنتاج الحية",
    level: "B2",
    category: "tech",
    exampleEn:
      "The DevOps engineer scheduled the cloud deployment for midnight.",
    exampleAr: "جدول مهندس العمليات السحابية نشر البرمجيات في منتصف الليل.",
    highlight: "deployment",
    collocation: "production deployment",
  },
  {
    id: "voc-tech-2",
    word: "scalable",
    ipa: "/ˈskeɪ.lə.bəl/",
    partOfSpeech: "adjective",
    meaningAr: "قابل للتوسع وزيادة القدرة الاستيعابية",
    level: "B2",
    category: "tech",
    exampleEn:
      "Our microservices architecture ensures the platform is fully scalable.",
    exampleAr:
      "تضمن بنيتنا المبنية على الخدمات المصغرة أن المنصة قابلة للتوسع تماماً.",
    highlight: "scalable",
    collocation: "scalable architecture",
  },
  {
    id: "voc-tech-3",
    word: "algorithm",
    ipa: "/ˈæl.ɡə.rɪ.ðəm/",
    partOfSpeech: "noun",
    meaningAr: "خوارزمية حسابية ومنطقية",
    level: "B1",
    category: "tech",
    exampleEn:
      "The search algorithm ranks educational lessons based on student relevance.",
    exampleAr:
      "ترتب خوارزمية البحث الدروس التعليمية بناءً على ملاءمتها للطالب.",
    highlight: "algorithm",
    collocation: "search algorithm",
  },

  // 3. Travel, Airport & Hotel
  {
    id: "voc-travel-1",
    word: "boarding pass",
    ipa: "/ˈbɔː.dɪŋ ˌpɑːs/",
    partOfSpeech: "noun",
    meaningAr: "بطاقة صعود الطائرة",
    level: "A2",
    category: "travel",
    exampleEn: "Please have your passport and boarding pass ready at gate 14.",
    exampleAr: "يرجى تجهيز جواز سفرك وبطاقة صعود الطائرة عند البوابة رقم 14.",
    highlight: "boarding pass",
    collocation: "issue boarding pass",
  },
  {
    id: "voc-travel-2",
    word: "reservation",
    ipa: "/ˌrez.əˈveɪ.ʃən/",
    partOfSpeech: "noun",
    meaningAr: "حجز مسبق (فندق، تذكرة، طاولة)",
    level: "A2",
    category: "hotel",
    exampleEn:
      "I have a confirmed hotel reservation under the name Ahmed Hinawi.",
    exampleAr: "لدي حجز فندقي مؤكد باسم أحمد هناوي.",
    highlight: "reservation",
    collocation: "make a reservation / confirmed reservation",
  },
  {
    id: "voc-travel-3",
    word: "amenities",
    ipa: "/əˈmiː.nə.tiz/",
    partOfSpeech: "noun (plural)",
    meaningAr: "مرافق وخدمات الراحة والترفيه في الفندق",
    level: "B1",
    category: "hotel",
    exampleEn:
      "The five-star resort offers high-speed Wi-Fi, swimming pools, and spa amenities.",
    exampleAr:
      "يوفر المنتجع ذو الخمس نجوم إنترنت عالي السرعة، حمامات سباحة، ومرافق سبا.",
    highlight: "amenities",
    collocation: "hotel amenities",
  },

  // 4. Food & Restaurant
  {
    id: "voc-food-1",
    word: "appetizer",
    ipa: "/ˈæp.ə.taɪ.zər/",
    partOfSpeech: "noun",
    meaningAr: "المقبلات أو فاتح الشهية قبل الوجبة الرئيسية",
    level: "A2",
    category: "food",
    exampleEn:
      "We ordered crispy garlic bread and a fresh Caesar salad as appetizers.",
    exampleAr: "طلبنا خبز الثوم المقرمش وسلطة سيزر طازجة كمقبلات.",
    highlight: "appetizers",
    collocation: "order an appetizer",
  },
  {
    id: "voc-food-2",
    word: "recommendation",
    ipa: "/ˌrek.ə.menˈdeɪ.ʃən/",
    partOfSpeech: "noun",
    meaningAr: "توصية وترشيح الشيف أو النادل",
    level: "B1",
    category: "food",
    exampleEn:
      "Could you give us the chef’s special recommendation for seafood tonight?",
    exampleAr: "هل يمكنك أن تعطينا ترشيح الشيف الخاص للمأكولات البحرية الليلة؟",
    highlight: "recommendation",
    collocation: "chef recommendation",
  },

  // 5. Medical & Health
  {
    id: "voc-med-1",
    word: "prescription",
    ipa: "/prɪˈskrɪp.ʃən/",
    partOfSpeech: "noun",
    meaningAr: "روشتة طبية / وصفة علاجية مكتوبة من الطبيب",
    level: "B1",
    category: "medical",
    exampleEn:
      "The doctor wrote a prescription for antibiotics to cure the chest infection.",
    exampleAr: "كتب الطبيب وصفة طبية لمضادات حيوية لعلاج التهاب الصدر.",
    highlight: "prescription",
    collocation: "write / fill a prescription",
  },
  {
    id: "voc-med-2",
    word: "symptoms",
    ipa: "/ˈsɪmp.təmz/",
    partOfSpeech: "noun (plural)",
    meaningAr: "أعراض المرض (حرارة، صداع، سعال)",
    level: "A2",
    category: "medical",
    exampleEn:
      "Tell the nurse if you experience any mild fever or flu-like symptoms.",
    exampleAr:
      "أخبر الممرضة إذا شعرت بأي حمى خفيفة أو أعراض شبيهة بالإنفلونزا.",
    highlight: "symptoms",
    collocation: "relieve symptoms",
  },

  // 6. Phrasal Verbs
  {
    id: "voc-phr-1",
    word: "carry out",
    ipa: "/ˈkær.i aʊt/",
    partOfSpeech: "phrasal verb",
    meaningAr: "ينفّذ أو يُجري (مهمة، تجربة، بحث)",
    level: "B1",
    category: "phrasal_verbs",
    exampleEn:
      "Scientists carried out extensive clinical trials before approving the vaccine.",
    exampleAr: "أجرى العلماء تجارب سريرية واسعة النطاق قبل اعتماد اللقاح.",
    highlight: "carried out",
    collocation: "carry out research / instructions",
  },
  {
    id: "voc-phr-2",
    word: "figure out",
    ipa: "/ˈfɪɡ.ər aʊt/",
    partOfSpeech: "phrasal verb",
    meaningAr: "يستوعب ويفهم الحل بعد تفكير",
    level: "A2",
    category: "phrasal_verbs",
    exampleEn:
      "After reading the grammar explanation, she finally figured out the rule.",
    exampleAr: "بعد قراءة شرح القواعد، استوعبت في النهاية طريقة عمل القاعدة.",
    highlight: "figured out",
    collocation: "figure out the problem",
  },
  {
    id: "voc-phr-3",
    word: "call off",
    ipa: "/kɔːl ɒf/",
    partOfSpeech: "phrasal verb",
    meaningAr: "يلغي موعداً أو حدثاً أو مباراة",
    level: "B1",
    category: "phrasal_verbs",
    exampleEn:
      "Due to severe storm weather, the airline called off all domestic flights.",
    exampleAr:
      "بسبب العاصفة الجوية الشديدة، ألغت شركة الطيران جميع الرحلات الداخلية.",
    highlight: "called off",
    collocation: "call off the meeting",
  },

  // 7. Idioms & Expressions
  {
    id: "voc-id-1",
    word: "hit the nail on the head",
    ipa: "/hɪt ðə neɪl ɒn ðə hed/",
    partOfSpeech: "idiom",
    meaningAr: "أصاب كبد الحقيقة / وصف الأمر بدقة بالغة",
    level: "B2",
    category: "idioms",
    exampleEn:
      "When Omar explained why Future Perfect is essential, he hit the nail on the head.",
    exampleAr:
      "عندما شرح عمر سبب أهمية المستقبل التام، أصاب كبد الحقيقة تماماً.",
    highlight: "hit the nail on the head",
    collocation: "exactly right",
  },
  {
    id: "voc-id-2",
    word: "piece of cake",
    ipa: "/piːs əv keɪk/",
    partOfSpeech: "idiom",
    meaningAr: "أمر غاية في السهولة والبساطة",
    level: "A2",
    category: "idioms",
    exampleEn:
      "Once you understand the golden formula, English tenses become a piece of cake.",
    exampleAr:
      "بمجرد أن تفهم الصيغة الذهبية، تصبح أزمنة الإنجليزية غاية في السهولة.",
    highlight: "piece of cake",
    collocation: "very easy",
  },
  {
    id: "voc-id-3",
    word: "burn the midnight oil",
    ipa: "/bɜːn ðə ˈmɪd.naɪt ɔɪl/",
    partOfSpeech: "idiom",
    meaningAr: "يسهر لوقت متأخر جداً في الدراسة أو العمل الشاق",
    level: "B2",
    category: "idioms",
    exampleEn:
      "She burned the midnight oil all week to complete her master thesis.",
    exampleAr:
      "سهرت حتى ساعات متأخرة طوال الأسبوع لإتمام رسالة الماجستير الخاصة بها.",
    highlight: "burned the midnight oil",
    collocation: "study hard late",
  },

  // 8. Academic Vocabulary
  {
    id: "voc-acad-1",
    word: "hypothesis",
    ipa: "/haɪˈpɒθ.ə.sɪs/",
    partOfSpeech: "noun",
    meaningAr: "فرضية علمية أو نظرية قيد الاختبار",
    level: "B2",
    category: "academic",
    exampleEn:
      "The research team gathered empirical data to test their initial hypothesis.",
    exampleAr: "جمع فريق البحث بيانات تجريبية لاختبار فرضيتهم الأولية.",
    highlight: "hypothesis",
    collocation: "test a hypothesis",
  },
  {
    id: "voc-acad-2",
    word: "comprehensive",
    ipa: "/ˌkɒm.prɪˈhen.sɪv/",
    partOfSpeech: "adjective",
    meaningAr: "شامل، وافٍ، ويغطي كافة الجوانب",
    level: "B2",
    category: "academic",
    exampleEn:
      "Henglish Academy provides a comprehensive curriculum from A1 to C2.",
    exampleAr:
      "تقدم أكاديمية هناوي إنجلش منهجاً شاملاً يمتد من مستوى A1 وحتى C2.",
    highlight: "comprehensive",
    collocation: "comprehensive curriculum",
  },
];
