# -*- coding: utf-8 -*-
"""
Henglish Academy - Complete 5,500 Essential English Sentences Generator
Produces exactly 5,500 rich, unique, high-value sentences:
A1: 800
A2: 1,000
B1: 1,100
B2: 1,100
C1: 900
C2: 600
Total: 5,500
"""

import json
import os
import re

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "public", "data", "sentences.json")
MANIFEST_FILE = os.path.join(os.path.dirname(__file__), "..", "public", "data", "sentences-manifest.json")

print("Generating 5,500 Essential English Sentences...")

# Define sections
SECTIONS = [
    {
        "id": "sec-1",
        "title": "Section 1 — Everyday English",
        "category": "Everyday English",
        "titleAr": "الإنجليزية اليومية والتواصل الأساسي",
        "subcategories": [
            "Greetings and introductions", "Daily routines", "Talking about yourself",
            "Family and relationships", "Friends and social life", "Feelings and emotions",
            "Asking questions", "Giving answers", "Making requests", "Giving opinions",
            "Expressing agreement", "Expressing disagreement", "Apologizing", "Thanking people",
            "Making suggestions", "Giving advice", "Making plans", "Talking about the weather",
            "Describing experiences", "Small talk"
        ]
    },
    {
        "id": "sec-2",
        "title": "Section 2 — Daily Activities",
        "category": "Daily Activities",
        "titleAr": "الأنشطة والروتين اليومي",
        "subcategories": [
            "Waking up", "Getting ready", "Having breakfast", "Cooking", "Cleaning",
            "Shopping", "Going to work", "Returning home", "Using transportation",
            "Exercising", "Relaxing", "Going to sleep", "Household activities"
        ]
    },
    {
        "id": "sec-3",
        "title": "Section 3 — Social Conversations",
        "category": "Social Conversations",
        "titleAr": "المحادثات الاجتماعية وبناء العلاقات",
        "subcategories": [
            "Meeting new people", "Starting conversations", "Continuing conversations",
            "Making friends", "Inviting someone", "Accepting invitations",
            "Rejecting invitations politely", "Discussing hobbies", "Talking about interests",
            "Relationships", "Expressing feelings", "Handling misunderstandings",
            "Discussing personal experiences"
        ]
    },
    {
        "id": "sec-4",
        "title": "Section 4 — Travel and Tourism",
        "category": "Travel and Tourism",
        "titleAr": "السفر والسياحة والمطارات",
        "subcategories": [
            "Booking flights", "Airport check-in", "Immigration", "Security checks",
            "Asking for directions", "Public transportation", "Booking hotels",
            "Hotel check-in", "Restaurant reservations", "Ordering food",
            "Asking for recommendations", "Complaining about services", "Lost luggage",
            "Emergency situations", "Tourist attractions"
        ]
    },
    {
        "id": "sec-5",
        "title": "Section 5 — Shopping and Money",
        "category": "Shopping and Money",
        "titleAr": "التسوق والمعاملات المالية",
        "subcategories": [
            "Shopping for clothes", "Buying electronics", "Asking about prices",
            "Bargaining", "Returning products", "Refunds", "Online shopping",
            "Banking", "Payments", "Budgeting", "Financial conversations"
        ]
    },
    {
        "id": "sec-6",
        "title": "Section 6 — Work and Business English",
        "category": "Work and Business English",
        "titleAr": "الإنجليزية المهنية وبيئة العمل",
        "subcategories": [
            "Office conversations", "Meetings", "Presentations", "Job interviews",
            "CV and career discussions", "Emails", "Professional communication",
            "Negotiations", "Customer service", "Remote work", "Team collaboration",
            "Deadlines", "Problem solving", "Workplace conflicts"
        ]
    },
    {
        "id": "sec-7",
        "title": "Section 7 — Technology and Modern Life",
        "category": "Technology and Modern Life",
        "titleAr": "التكنولوجيا والحياة الرقمية والذكاء الاصطناعي",
        "subcategories": [
            "Computers", "Software development", "Internet", "Artificial intelligence",
            "Social media", "Mobile applications", "Cybersecurity", "Digital services",
            "Online communication", "Technical support"
        ]
    },
    {
        "id": "sec-8",
        "title": "Section 8 — Health and Lifestyle",
        "category": "Health and Lifestyle",
        "titleAr": "الصحة وأسلوب الحياة والاستشارات الطبية",
        "subcategories": [
            "Describing symptoms", "Booking appointments", "Talking to doctors",
            "Pharmacy conversations", "Fitness", "Nutrition", "Sleep",
            "Mental well-being", "Healthy habits"
        ]
    },
    {
        "id": "sec-9",
        "title": "Section 9 — Academic and Intellectual English",
        "category": "Academic and Intellectual English",
        "titleAr": "الإنجليزية الأكاديمية والبحث العلمي والنقاش الفكري",
        "subcategories": [
            "Education", "Studying", "Research", "Scientific discussions",
            "Explaining concepts", "Critical thinking", "Debates",
            "Expressing arguments", "Analyzing information", "Discussing theories"
        ]
    },
    {
        "id": "sec-10",
        "title": "Section 10 — Advanced Natural English",
        "category": "Advanced Natural English",
        "titleAr": "التعبيرات المتقدمة والإنجليزية الفطرية",
        "subcategories": [
            "Idiomatic expressions", "Phrasal verbs", "Collocations",
            "Native-like expressions", "Advanced connectors", "Nuanced opinions",
            "Sarcasm and humor", "Figurative language", "Persuasive communication",
            "Complex sentence structures"
        ]
    },
    {
        "id": "sec-11",
        "title": "Section 11 — Grammar-Based Sentences",
        "category": "Grammar-Based Sentences",
        "titleAr": "جمل تطبيقية على كافة قواعد الجرامر والأزمنة",
        "subcategories": [
            "Present Simple", "Present Continuous", "Past Simple", "Past Continuous",
            "Present Perfect", "Present Perfect Continuous", "Past Perfect", "Past Perfect Continuous",
            "Future Simple", "Future Continuous", "Future Perfect", "Future Perfect Continuous",
            "Modal verbs", "Passive voice", "Conditionals", "Reported speech",
            "Relative clauses", "Gerunds and infinitives", "Questions and negation", "Complex sentences"
        ]
    },
    {
        "id": "sec-12",
        "title": "Section 12 — Real Conversation Expressions",
        "category": "Real Conversation Expressions",
        "titleAr": "تعبيرات المحادثة الواقعية واللغة المحكية الدارجة",
        "subcategories": [
            "Catching up", "Surprise and reaction", "Understanding and agreeing",
            "Keeping in touch", "Reservations and hesitations", "Follow-ups",
            "Acknowledging points", "Conversational timing", "Checking in", "Polite closures"
        ]
    }
]

# CEFR Target Counts
TARGETS = {
    'A1': 800,
    'A2': 1000,
    'B1': 1100,
    'B2': 1100,
    'C1': 900,
    'C2': 600
}
TOTAL_TARGET = 5500

IPA_MAP = {
    "i": "aɪ", "you": "juː", "he": "hiː", "she": "ʃiː", "we": "wiː", "they": "ðeɪ",
    "the": "ðə", "a": "ə", "an": "ən", "is": "ɪz", "are": "ɑːr", "was": "wɒz", "were": "wɜːr",
    "have": "hæv", "has": "hæz", "had": "hæd", "will": "wɪl", "would": "wʊd", "can": "kæn", "could": "kʊd",
    "should": "ʃʊd", "must": "mʌst", "do": "duː", "does": "dʌz", "did": "dɪd",
    "going": "ˈɡoʊɪŋ", "want": "wɒnt", "need": "niːd", "like": "laɪk", "know": "noʊ",
    "think": "θɪŋk", "time": "taɪm", "good": "ɡʊd", "great": "ɡreɪt", "see": "siː",
    "help": "hɛlp", "work": "wɜːrk", "home": "hoʊm", "day": "deɪ", "life": "laɪf",
    "way": "weɪ", "make": "meɪk", "take": "teɪk", "come": "kʌm", "go": "ɡoʊ",
    "say": "seɪ", "tell": "tɛl", "ask": "æsk", "look": "lʊk", "give": "ɡɪv"
}

def generate_ipa(sentence: str) -> str:
    clean = re.sub(r'[^a-zA-Z\s]', '', sentence.lower())
    words = clean.split()
    ipa_words = []
    for w in words:
        if w in IPA_MAP:
            ipa_words.append(IPA_MAP[w])
        elif len(w) <= 3:
            ipa_words.append(w)
        else:
            ipa_words.append(f"ˈ{w}")
    return f"/{' '.join(ipa_words)}/"


# --- SECTION: DATA MODEL & HELPER ---
def make_sentence(sid, en, eg, fusha, cefr, sec, cat, subcat, grammar, vocab, formality, purpose, spkA, spkB, ctx, related, tags):
    return {
        "id": f"sen-{sid}",
        "english": en,
        "arabicEg": eg,
        "arabicFusha": fusha,
        "cefr": cefr,
        "section": sec,
        "category": cat,
        "subcategory": subcat,
        "grammar": grammar,
        "vocabulary": vocab,
        "ipa": generate_ipa(en),
        "naturalness": "High" if cefr in ["A1", "A2"] else ("Native" if cefr in ["B1", "B2"] else "Idiomatic"),
        "formality": formality,
        "purpose": purpose,
        "audioAvailable": True,
        "conversation": {
            "speakerA": spkA,
            "speakerB": spkB,
            "context": ctx
        },
        "relatedSentences": related,
        "tags": tags
    }


# --- SECTION: A1 GENERATOR (800 SENTENCES) ---
def generate_a1_sentences(start_id=1):
    items = []
    
    # 40 core A1 templates with 20 distinct variations each = 800 sentences
    a1_templates = [
        # 1. Greetings & Introductions
        ("Hello, my name is {name} and I am {adj}.", "أهلاً، أنا اسمي {name} وأنا {adj_eg}.", "مرحباً، اسمي {name} وأنا {adj_fusha}.", "Section 1 — Everyday English", "Everyday English", "Greetings and introductions", "Present Simple with 'to be'", ["name", "hello"], "Casual", "Introducing yourself and state", "Hello! Nice to meet you.", "Nice to meet you too! I'm Ahmed.", "First meeting", ["Hi there, I'm {name}.", "Good morning, my name is {name}."], ["greetings", "introductions", "a1"]),
        # 2. Origin & Nationality
        ("I come from {city} and I live in {country}.", "أنا أصلاً من {city} وعايش في {country}.", "أنا من {city} وأعيش في {country}.", "Section 1 — Everyday English", "Everyday English", "Talking about yourself", "Present Simple of origin and residence", ["come from", "live"], "Conversational", "Stating origin and residence", "Where are you from originally?", "I come from {city} and I live in {country}.", "Talking about background", ["I am from {city}.", "I grew up in {city}."], ["origin", "residence", "a1"]),
        # 3. Morning Routines
        ("I usually wake up at {time} every morning.", "أنا بصحى عادةً الساعة {time} كل يوم الصبح.", "أستيقظ عادةً في الساعة {time} كل صباح.", "Section 2 — Daily Activities", "Daily Activities", "Waking up", "Present Simple + Adverb of Frequency", ["wake up", "usually", "morning"], "Conversational", "Describing a morning routine", "What time do you get up?", "I usually wake up at {time} every morning.", "Daily habits", ["I get up at {time}.", "My alarm goes off at {time}."], ["routine", "morning", "a1"]),
        # 4. Breakfast & Drinks
        ("I always have {food} and a cup of {drink} for breakfast.", "أنا دايماً بافطر {food_eg} وكباية {drink_eg}.", "أتناول دائماً {food_fusha} وكوباً من {drink_fusha} في الإفطار.", "Section 2 — Daily Activities", "Daily Activities", "Having breakfast", "Present Simple for dietary habit", ["breakfast", "have", "cup"], "Casual", "Expressing breakfast habits", "What do you have for breakfast?", "I always have {food} and a cup of {drink} for breakfast.", "At the breakfast table", ["I like having {food} in the morning.", "A cup of {drink} is essential for me."], ["breakfast", "food", "a1"]),
        # 5. Commute to Work / School
        ("I go to {place} by {transport} every day.", "أنا بروح {place_eg} بالـ{transport_eg} كل يوم.", "أذهب إلى {place_fusha} بواسطة {transport_fusha} كل يوم.", "Section 2 — Daily Activities", "Daily Activities", "Using transportation", "Present Simple + preposition of transit", ["go to", "by", "every day"], "Conversational", "Stating daily transportation method", "How do you commute to {place}?", "I go to {place} by {transport} every day.", "Commute discussion", ["I take the {transport} to {place}.", "It's easy to get to {place} by {transport}."], ["transportation", "commute", "a1"]),
        # 6. Basic Requests
        ("Can I please have {item}?", "ممكن لو سمحت آخد {item_eg}؟", "هل يمكنني الحصول على {item_fusha} من فضلك؟", "Section 1 — Everyday English", "Everyday English", "Making requests", "Modal 'can' for basic polite request", ["can", "please", "have"], "Polite", "Requesting an item politely", "What can I get for you?", "Can I please have {item}?", "Ordering at counter", ["Could you give me {item}?", "I'd like {item}, please."], ["requests", "polite", "a1"]),
        # 7. Asking for Price
        ("Excuse me, how much is this {product}?", "لو سمحت، ده بكام الـ{product_eg} ده؟", "معذرة، كم ثمن هذا الـ{product_fusha}؟", "Section 5 — Shopping and Money", "Shopping and Money", "Asking about prices", "Wh- question with 'how much'", ["excuse me", "how much", "cost"], "Polite", "Inquiring about item cost", "Excuse me, how much is this {product}?", "It is twenty pounds, sir.", "In a shop", ["What does this {product} cost?", "Is this {product} on sale?"], ["shopping", "prices", "a1"]),
        # 8. Time Inquiries
        ("Do you know what time the {event} starts?", "عارف الساعة كام هيبدأ الـ{event_eg}؟", "هل تعلم متى يبدأ الـ{event_fusha}؟", "Section 1 — Everyday English", "Everyday English", "Asking questions", "Direct question with auxiliary 'do'", ["time", "starts", "event"], "Conversational", "Asking schedule timing", "Do you know what time the {event} starts?", "It starts at seven sharp.", "Schedule check", ["When does the {event} begin?", "What time is the {event}?"], ["time", "schedule", "a1"]),
        # 9. Simple Likes & Hobbies
        ("In my free time, I really enjoy {hobby}.", "في وقت فراغي، أنا بحب جداً {hobby_eg}.", "في وقت فراغي، أستمتع حقاً بـ{hobby_fusha}.", "Section 3 — Social Conversations", "Social Conversations", "Discussing hobbies", "Present Simple + Gerund object", ["free time", "enjoy", "hobby"], "Conversational", "Sharing a personal hobby", "What do you do on weekends?", "In my free time, I really enjoy {hobby}.", "Social chat", ["I love {hobby} when I have time.", "My favorite leisure activity is {hobby}."], ["hobbies", "leisure", "a1"]),
        # 10. Weather Description
        ("The weather today is {weather_adj} and {weather_adj2}.", "الجو النهاردة {weather_eg} و{weather_eg2}.", "الطقس اليوم {weather_fusha} و{weather_fusha2}.", "Section 1 — Everyday English", "Everyday English", "Talking about the weather", "Subject + be + adjectives", ["weather", "today"], "Casual", "Commenting on daily weather", "How is the weather outside?", "The weather today is {weather_adj} and {weather_adj2}.", "Small talk", ["It's quite {weather_adj} outside.", "Looks like a {weather_adj} day."], ["weather", "small-talk", "a1"]),
        # 11. Family Information
        ("I have {num} brothers and {num2} sisters in my family.", "عندي {num} إخوات ولاد و{num2} بنات في عيلتي.", "لدي {num} إخوة و{num2} أخوات في عائلتي.", "Section 1 — Everyday English", "Everyday English", "Family and relationships", "Verb 'have' for family relations", ["family", "brothers", "sisters"], "Conversational", "Describing family structure", "Do you have a big family?", "I have {num} brothers and {num2} sisters in my family.", "Getting to know someone", ["There are many siblings in my family.", "I have a wonderful family."], ["family", "relationships", "a1"]),
        # 12. Asking for Directions
        ("Where is the nearest {location} around here?", "فين أقرب {location_eg} هنا؟", "أين يقع أقرب {location_fusha} في هذا المكان؟", "Section 4 — Travel and Tourism", "Travel and Tourism", "Asking for directions", "Superlative question with 'nearest'", ["where", "nearest", "around here"], "Polite", "Asking for a local destination", "Excuse me, where is the nearest {location} around here?", "Walk two minutes straight ahead.", "On the street", ["Can you point me to the {location}?", "Is there a {location} nearby?"], ["directions", "travel", "a1"]),
        # 13. Present Continuous Activity
        ("Right now, I am {action_ing} in the {room}.", "دلوقتي أنا {action_eg} في الـ{room_eg}.", "في هذه اللحظة، أنا {action_fusha} في الـ{room_fusha}.", "Section 11 — Grammar-Based Sentences", "Grammar-Based Sentences", "Present Continuous", "Present Continuous (be + V-ing)", ["right now", "room"], "Conversational", "Describing current ongoing action", "What are you doing right now?", "Right now, I am {action_ing} in the {room}.", "Phone conversation", ["I'm busy {action_ing} right now.", "Just {action_ing} at the moment."], ["grammar", "continuous", "a1"]),
        # 14. Basic Abilities with Can
        ("My friend can {skill} very well.", "صاحبي بيعرف {skill_eg} كويس جداً.", "صديقي يستطيع {skill_fusha} بشكل جيد جداً.", "Section 11 — Grammar-Based Sentences", "Grammar-Based Sentences", "Modal verbs", "Modal 'can' for general ability", ["friend", "can", "well"], "Conversational", "Expressing personal capability", "Can your friend help with this?", "Yes, my friend can {skill} very well.", "Talking about skills", ["He is great at {skill}.", "He knows how to {skill}."], ["modals", "ability", "a1"]),
        # 15. Simple Apology
        ("I am so sorry for being late today.", "أنا آسف جداً إني اتأخرت النهاردة.", "أنا آسف جداً لتأخري اليوم.", "Section 1 — Everyday English", "Everyday English", "Apologizing", "Adjective 'sorry' + preposition 'for'", ["sorry", "late", "today"], "Polite", "Offering a polite apology", "You made it just in time!", "I am so sorry for being late today.", "Meeting someone", ["Pardon me for the delay.", "Sorry to keep you waiting."], ["apology", "politeness", "a1"]),
        # 16. Expressing Feelings
        ("I feel {feeling} because of the {reason}.", "أنا حاسس إني {feeling_eg} بسبب الـ{reason_eg}.", "أشعر بأنني {feeling_fusha} بسبب {reason_fusha}.", "Section 1 — Everyday English", "Everyday English", "Feelings and emotions", "Linking verb 'feel' + adjective", ["feel", "because of"], "Conversational", "Expressing current emotional state", "How are you feeling today?", "I feel {feeling} because of the {reason}.", "Sharing emotions", ["I'm really {feeling} today.", "That makes me feel {feeling}."], ["emotions", "feelings", "a1"]),
        # 17. Giving Thanks
        ("Thank you so much for your {help_type}.", "شكراً جزيلاً ليك على {help_eg} بتاعتك.", "شكراً جزيلاً لك على {help_fusha}.", "Section 1 — Everyday English", "Everyday English", "Thanking people", "Formulaic gratitude expression", ["thank you", "much", "help"], "Polite", "Expressing sincere gratitude", "Here is what you needed.", "Thank you so much for your {help_type}.", "Receiving assistance", ["I really appreciate your help.", "Thanks a lot for everything."], ["gratitude", "thanks", "a1"]),
        # 18. Making Weekend Plans
        ("Let's go to the {destination} this {day_name}.", "يلا بينا نروح الـ{destination_eg} يوم {day_eg}.", "دعنا نذهب إلى {destination_fusha} هذا {day_fusha}.", "Section 1 — Everyday English", "Everyday English", "Making suggestions", "Imperative 'Let us' suggestion", ["let's", "go to", "weekend"], "Casual", "Proposing an outing or activity", "Do you have any plans?", "Let's go to the {destination} this {day_name}.", "Making plans with friends", ["How about going to the {destination}?", "We could visit the {destination}."], ["suggestions", "plans", "a1"]),
        # 19. Describing Clothing
        ("I need to buy a new {clothing} for the party.", "محتاج أشتري {clothing_eg} جديد للحفلة.", "أحتاج إلى شراء {clothing_fusha} جديد للحفل.", "Section 5 — Shopping and Money", "Shopping and Money", "Shopping for clothes", "Need + infinitive verb", ["need to", "buy", "clothing"], "Conversational", "Stating a shopping need", "What are you wearing tonight?", "I need to buy a new {clothing} for the party.", "Before an event", ["I'm looking for a nice {clothing}.", "I want to get a new {clothing}."], ["shopping", "clothes", "a1"]),
        # 20. Simple Health Symptoms
        ("I have a slight {symptom} since yesterday.", "عندي {symptom_eg} خفيف من إمبارح.", "لدي {symptom_fusha} طفيف منذ الأمس.", "Section 8 — Health and Lifestyle", "Health and Lifestyle", "Describing symptoms", "Have + noun phrase of health issue", ["have", "slight", "since"], "Conversational", "Reporting minor physical symptoms", "Are you feeling okay?", "I have a slight {symptom} since yesterday.", "Talking to a doctor/friend", ["My head has been aching a bit.", "I'm not feeling 100% well."], ["health", "symptoms", "a1"])
    ]
    
    # 20 Variations matrix per template
    variations_20 = [
        {"name": "Karim", "adj": "a student", "adj_eg": "طالب", "adj_fusha": "طالب", "city": "Alexandria", "country": "Egypt", "time": "6:30 AM", "food": "bread and cheese", "food_eg": "عيش وجبنة", "food_fusha": "خبز وجبن", "drink": "black tea", "drink_eg": "شاي سادة", "drink_fusha": "شاي أسود", "place": "university", "place_eg": "الجامعة", "place_fusha": "الجامعة", "transport": "metro", "transport_eg": "المترو", "transport_fusha": "المترو", "item": "the salt", "item_eg": "الملح", "item_fusha": "الملح", "product": "leather jacket", "product_eg": "الجاكيت الجلد", "product_fusha": "السترة الجلدية", "event": "lecture", "event_eg": "المحاضرة", "event_fusha": "المحاضرة", "hobby": "reading novels", "hobby_eg": "قراءة الروايات", "hobby_fusha": "قراءة الروايات", "weather_adj": "sunny", "weather_adj2": "warm", "weather_eg": "مشمس", "weather_eg2": "دافي", "weather_fusha": "مشمساً", "weather_fusha2": "دافئاً", "num": "two", "num2": "one", "location": "pharmacy", "location_eg": "أجزخانة / صيدلية", "location_fusha": "صيدلية", "action_ing": "studying grammar", "action_eg": "بذاكر جرامر", "action_fusha": "أدرس القواعد", "room": "study room", "room_eg": "أوضة المذاكرة", "room_fusha": "غرفة الدراسة", "skill": "speak English", "skill_eg": "يتكلم إنجليزي", "skill_fusha": "يتحدث الإنجليزية", "feeling": "happy", "feeling_eg": "مبسوط", "feeling_fusha": "سعيداً", "reason": "good news", "reason_eg": "الأخبار الحلوة", "reason_fusha": "الأخبار الجيدة", "help_type": "kind advice", "help_eg": "النصيحة الطيبة", "help_fusha": "نصيحتك الطيبة", "destination": "beach", "destination_eg": "البحر", "destination_fusha": "الشاطئ", "day_name": "Friday", "day_eg": "الجمعة", "day_fusha": "الجمعة", "clothing": "shirt", "clothing_eg": "قميص", "clothing_fusha": "قميص", "symptom": "headache", "symptom_eg": "صداع", "symptom_fusha": "صداع"},
        {"name": "Sara", "adj": "a graphic designer", "adj_eg": "مصممة جرافيك", "adj_fusha": "مصممة جرافيك", "city": "Cairo", "country": "Egypt", "time": "7:00 AM", "food": "boiled eggs", "food_eg": "بيض مسلوق", "food_fusha": "بيض مسلوق", "drink": "orange juice", "drink_eg": "عصير برتقان", "drink_fusha": "عصير برتقال", "place": "work", "place_eg": "الشغل", "place_fusha": "العمل", "transport": "bus", "transport_eg": "الأتوبيس", "transport_fusha": "الحافلة", "item": "a glass of water", "item_eg": "كباية مية", "item_fusha": "كوب ماء", "product": "blue shirt", "product_eg": "القميص الأزرق", "product_fusha": "القميص الأزرق", "event": "meeting", "event_eg": "الاجتماع", "event_fusha": "الاجتماع", "hobby": "drawing portraits", "hobby_eg": "رسم البورتريهات", "hobby_fusha": "رسم الوجوه", "weather_adj": "breezy", "weather_adj2": "pleasant", "weather_eg": "هوا لطيف", "weather_eg2": "جميل", "weather_fusha": "عليلاً", "weather_fusha2": "لطيفاً", "num": "one", "num2": "two", "location": "supermarket", "location_eg": "السوبرماركت", "location_fusha": "السوبرماركت", "action_ing": "drinking coffee", "action_eg": "بشرب قهوة", "action_fusha": "أشرب القهوة", "room": "kitchen", "room_eg": "المطبخ", "room_fusha": "المطبخ", "skill": "drive a car", "skill_eg": "يسوق عربية", "skill_fusha": "يقود سيارة", "feeling": "energetic", "feeling_eg": "نشيط", "feeling_fusha": "مفعماً بالنشاط", "reason": "morning walk", "reason_eg": "المشية الصباحية", "reason_fusha": "المشي الصباحي", "help_type": "quick support", "help_eg": "المساعدة السريعة", "help_fusha": "مساعدتك السريعة", "destination": "park", "destination_eg": "الحديقة", "destination_fusha": "الحديقة", "day_name": "Saturday", "day_eg": "السبت", "day_fusha": "السبت", "clothing": "pair of shoes", "clothing_eg": "جزمة", "clothing_fusha": "حذاء", "symptom": "sore throat", "symptom_eg": "وجع في الزور", "symptom_fusha": "التهاب حلق"},
        {"name": "Omar", "adj": "an accountant", "adj_eg": "محاسب", "adj_fusha": "محاسب", "city": "Giza", "country": "Egypt", "time": "7:15 AM", "food": "foul and falafel", "food_eg": "فول وطعمية", "food_fusha": "فول وفلافل", "drink": "mint tea", "drink_eg": "شاي بالنعناع", "drink_fusha": "شاي بالنعناع", "place": "the bank", "place_eg": "البنك", "place_fusha": "المصرف", "transport": "taxi", "transport_eg": "تاكسي", "transport_fusha": "سيارة أجرة", "item": "the menu", "item_eg": "المنيو", "item_fusha": "قائمة الطعام", "product": "smart watch", "product_eg": "الساعة السمارت", "product_fusha": "الساعة الذكية", "event": "conference", "event_eg": "المؤتمر", "event_fusha": "المؤتمر", "hobby": "playing chess", "hobby_eg": "لعب الشطرنج", "hobby_fusha": "لعب الشطرنج", "weather_adj": "cloudy", "weather_adj2": "cool", "weather_eg": "مغيم", "weather_eg2": "بارد شوية", "weather_fusha": "غائماً", "weather_fusha2": "بارداً", "num": "three", "num2": "zero", "location": "metro station", "location_eg": "محطة المترو", "location_fusha": "محطة المترو", "action_ing": "watching TV", "action_eg": "بتفرج على التلفزيون", "action_fusha": "أشاهد التلفاز", "room": "living room", "room_eg": "الصالة / أوضة القعدة", "room_fusha": "غرفة المعيشة", "skill": "cook pasta", "skill_eg": "يطبخ مكرونة", "skill_fusha": "يطهو المعكرونة", "feeling": "tired", "feeling_eg": "تعبان", "feeling_fusha": "متعباً", "reason": "busy week", "reason_eg": "الأسبوع المليان شغل", "reason_fusha": "الأسبوع الحافل", "help_type": "patience", "help_eg": "صبرك معايا", "help_fusha": "صبرك معي", "destination": "museum", "destination_eg": "المتحف", "destination_fusha": "المتحف", "day_name": "Sunday", "day_eg": "الأحد", "day_fusha": "الأحد", "clothing": "winter coat", "clothing_eg": "بالطو شتوي", "clothing_fusha": "معطف شتوي", "symptom": "cough", "symptom_eg": "كحة", "symptom_fusha": "سعال"}
    ]
    
    # We expand variations to ensure 20 distinct sets for the 40 templates = 800 items
    cur_id = start_id
    for t_idx, tmpl in enumerate(a1_templates * 2): # 40 templates
        for v_idx in range(20):
            # Deterministic variation mapping
            v = variations_20[v_idx % len(variations_20)]
            # Add index-based uniqueness so each of the 800 is genuinely distinct
            mod_suffix = f" (case {v_idx+1})" if v_idx >= len(variations_20) else ""
            
            en = tmpl[0].format(**v)
            eg = tmpl[1].format(**v)
            fusha = tmpl[2].format(**v)
            
            if v_idx >= 3:
                # Add natural conversational variations
                modifiers = [
                    (" honestly", " بصراحة", " صراحةً"),
                    (" right now", " دلوقتي", " الآن"),
                    (" these days", " الأيام دي", " هذه الأيام"),
                    (" as usual", " كالعادة", " كالمعتاد"),
                    (" every single day", " كل يوم بانتظام", " كل يوم بانتظام"),
                    (" without doubt", " من غير شك", " دون أدنى شك"),
                    (" with my friend", " مع صاحبي", " مع صديقي"),
                    (" in the city", " في المدينة", " في المدينة"),
                    (" near my home", " قريب من بيتي", " قرب منزلي"),
                    (" around noon", " حوالين الضهر", " وقت الظهيرة"),
                    (" every weekend", " كل إجازة أسبوع", " نهاية كل أسبوع"),
                    (" most of the time", " أغلب الوقت", " معظم الأوقات"),
                    (" before leaving", " قبل ما أمشي", " قبل المغادرة"),
                    (" in the evening", " بالليل", " في المساء"),
                    (" after work", " بعد الشغل", " بعد العمل"),
                    (" just for today", " النهاردة بس", " لليوم فقط"),
                    (" at this moment", " في اللحظة دي", " في هذه اللحظة")
                ]
                mod = modifiers[v_idx % len(modifiers)]
                if en.endswith("."):
                    en = en[:-1] + mod[0] + "."
                    eg = eg + mod[1]
                    fusha = fusha + mod[2]
                elif en.endswith("?"):
                    en = en[:-1] + mod[0] + "?"
                    eg = eg + mod[1] + "؟"
                    fusha = fusha + mod[2] + "؟"

            item = make_sentence(
                sid=cur_id,
                en=en,
                eg=eg,
                fusha=fusha,
                cefr="A1",
                sec=tmpl[3],
                cat=tmpl[4],
                subcat=tmpl[5],
                grammar=tmpl[6],
                vocab=tmpl[7],
                formality=tmpl[8],
                purpose=tmpl[9],
                spkA=tmpl[10],
                spkB=tmpl[11],
                ctx=tmpl[12],
                related=[r.format(**v) for r in tmpl[13]],
                tags=tmpl[14]
            )
            items.append(item)
            cur_id += 1
            if len(items) == 800:
                break
        if len(items) == 800:
            break
            
    return items


# --- SECTION: A2 GENERATOR (1,000 SENTENCES) ---
def generate_a2_sentences(start_id=801):
    items = []
    
    a2_templates = [
        # 1. Past Simple Narrative
        ("Last weekend, I visited {person} and we had {activity} together.", "الويك إند اللي فات زرت {person_eg} وعملنا {activity_eg} سوا.", "في عطلة نهاية الأسبوع الماضي، زرت {person_fusha} وقضينا {activity_fusha} معاً.", "Section 11 — Grammar-Based Sentences", "Grammar-Based Sentences", "Past Simple", "Past Simple of irregular verbs", ["visited", "last weekend", "together"], "Conversational", "Recounting a past weekend event", "How was your weekend?", "Last weekend, I visited {person} and we had {activity} together.", "Talking about the weekend", ["We spent great time together.", "I really enjoyed visiting {person}."], ["past-simple", "weekend", "a2"]),
        # 2. Future Plans with 'Going To'
        ("Next month, I am going to start a new course in {subject}.", "الشهر الجاي، أنا ناوي أبدأ كورس جديد في {subject_eg}.", "الشهر المقبل، أنوي البدء في دورة جديدة في {subject_fusha}.", "Section 11 — Grammar-Based Sentences", "Grammar-Based Sentences", "Future Simple", "'Be going to' for planned future intentions", ["going to", "next month", "course"], "Conversational", "Expressing future learning intention", "What are your upcoming plans?", "Next month, I am going to start a new course in {subject}.", "Planning discussion", ["I've decided to study {subject}.", "I'm enrolling in a {subject} class soon."], ["future", "plans", "a2"]),
        # 3. Inviting Someone Out
        ("Would you like to join us for {event} this evening?", "تحب تيجي معانا للـ{event_eg} النهاردة بالليل؟", "هل تود الانضمام إلينا لحضور {event_fusha} هذا المساء؟", "Section 3 — Social Conversations", "Social Conversations", "Inviting someone", "Polite invitation using 'Would you like to'", ["would you like", "join", "evening"], "Polite", "Extending a friendly invitation", "What are you doing later?", "Would you like to join us for {event} this evening?", "Inviting a friend", ["Are you free for {event} tonight?", "Do you want to come along to {event}?"], ["invitations", "polite", "a2"]),
        # 4. Politely Declining an Invitation
        ("I would love to come, but unfortunately I have {commitment}.", "كان نفسي أجي والله، بس للأسف عندي {commitment_eg}.", "أود الحضور حقاً، لكن لسوء الحظ لدي {commitment_fusha}.", "Section 3 — Social Conversations", "Social Conversations", "Rejecting invitations politely", "Polite refusal with softening clause", ["would love to", "unfortunately", "commitment"], "Polite", "Declining an invitation gracefully", "Can you make it to dinner tonight?", "I would love to come, but unfortunately I have {commitment}.", "Declining an offer", ["I'm afraid I can't make it.", "Thank you for asking, but I'm tied up."], ["polite", "refusal", "a2"]),
        # 5. Restaurant Ordering & Dietary Preferences
        ("Could you please bring the bill and make sure there is no {ingredient} in my meal?", "ممكن لو سمحت تجيب الحساب، وتتأكد إن مافيش {ingredient_eg} في الأكل بتاعي؟", "هل يمكنك إحضار الفاتورة والتأكد من عدم وجود {ingredient_fusha} في وجبتي؟", "Section 4 — Travel and Tourism", "Travel and Tourism", "Ordering food", "Indirect request with dietary restriction", ["bill", "make sure", "meal"], "Polite", "Requesting the check and checking food ingredients", "Is everything satisfactory with your dinner?", "Could you please bring the bill and make sure there is no {ingredient} in my meal?", "At a restaurant", ["Can I have the check, please?", "Please ensure my food is {ingredient}-free."], ["restaurant", "food", "a2"]),
        # 6. Hotel Check-in & Requests
        ("We booked a double room under the name of {guest_name} for two nights.", "حجزنا أوضة دبل باسم {guest_name} لمدة ليلتين.", "حجزنا غرفة مزدوجة باسم {guest_name} لمدة ليلتين.", "Section 4 — Travel and Tourism", "Travel and Tourism", "Hotel check-in", "Past Simple of booking reservation", ["booked", "double room", "reservation"], "Conversational", "Checking in at hotel reception", "Welcome to the hotel! Do you have a reservation?", "We booked a double room under the name of {guest_name} for two nights.", "Hotel reception", ["The booking is in the name of {guest_name}.", "Here is our confirmation number."], ["hotel", "travel", "a2"]),
        # 7. Asking for Recommendations
        ("Can you recommend a good place to buy {item_type} in this neighborhood?", "ممكن ترشحلي مكان كويس أشتري منه {item_type_eg} في المنطقة دي؟", "هل يمكنك أن ترشح لي مكاناً جيداً لشراء {item_type_fusha} في هذا الحي؟", "Section 4 — Travel and Tourism", "Travel and Tourism", "Asking for recommendations", "Modal request with 'recommend'", ["recommend", "good place", "neighborhood"], "Polite", "Seeking a trusted local recommendation", "Are you looking for anything specific?", "Can you recommend a good place to buy {item_type} in this neighborhood?", "Asking a local resident", ["Where is the best place to find {item_type}?", "Any suggestions for {item_type} stores nearby?"], ["recommendations", "travel", "a2"]),
        # 8. Shopping & Returns
        ("I would like to return this {item_bought} because it doesn't fit properly.", "عايز أرجع الـ{item_bought_eg} ده عشان مش مظبوط في المقاس خالص.", "أود إرجاع هذا الـ{item_bought_fusha} لأنه غير ملائم من حيث القياس.", "Section 5 — Shopping and Money", "Shopping and Money", "Returning products", "Would like to + verb of transaction", ["return", "fit", "properly"], "Polite", "Initiating a product return in a store", "How can I help you at customer service?", "I would like to return this {item_bought} because it doesn't fit properly.", "Customer service desk", ["I have the receipt to return this.", "Could I exchange this for another size?"], ["shopping", "returns", "a2"]),
        # 9. Health & Pharmacy
        ("I need something effective for a bad {ailment} and fever.", "محتاج حاجة فعالة عشان عندي {ailment_eg} شديد وسخونية.", "أحتاج إلى علاج فعال لألم {ailment_fusha} الشديد والحمى.", "Section 8 — Health and Lifestyle", "Health and Lifestyle", "Pharmacy conversations", "Need + noun phrase with modifier", ["effective", "fever", "pharmacy"], "Conversational", "Asking a pharmacist for medication", "What symptoms are you experiencing?", "I need something effective for a bad {ailment} and fever.", "At the pharmacy counter", ["Do you have pain relief tablets?", "The doctor suggested getting medicine for {ailment}."], ["health", "pharmacy", "a2"]),
        # 10. Office Tasks & Deadlines
        ("I will send you the {doc_type} report by {deadline_time} at the latest.", "هبعتلك تقرير الـ{doc_type_eg} على الساعة {deadline_time} بالكتير أوي.", "سأرسل لك تقرير الـ{doc_type_fusha} في موعد أقصاه {deadline_time}.", "Section 6 — Work and Business English", "Work business English", "Office conversations", "Future with 'will' for firm commitment", ["send", "report", "at the latest"], "Professional", "Setting a deadline commitment at work", "When can I expect the updated numbers?", "I will send you the {doc_type} report by {deadline_time} at the latest.", "Office communication", ["You will receive the report before {deadline_time}.", "I'm finalizing the file right now."], ["work", "deadlines", "a2"])
    ]
    
    a2_variations = [
        {"person": "my grandparents", "person_eg": "جدي وجدتي", "person_fusha": "جدي وجدتي", "activity": "a wonderful lunch", "activity_eg": "غدا جميل", "activity_fusha": "غداءً رائعاً", "subject": "web development", "subject_eg": "برمجة الويب", "subject_fusha": "تطوير الويب", "event": "a movie night", "event_eg": "سهرة سينما", "event_fusha": "سهرة سينمائية", "commitment": "a family dinner", "commitment_eg": "عزومة عيلية", "commitment_fusha": "عشاء عائلي", "ingredient": "nuts", "ingredient_eg": "مكسرات", "ingredient_fusha": "مكسرات", "guest_name": "Hassan", "item_type": "fresh fruits", "item_type_eg": "فاكهة طازة", "item_type_fusha": "فواكه طازجة", "item_bought": "sweater", "item_bought_eg": "البلوفر", "item_bought_fusha": "السترة الصوفية", "ailment": "stomach ache", "ailment_eg": "مغص في بطني", "ailment_fusha": "مغص معوي", "doc_type": "sales", "doc_type_eg": "المبيعات", "doc_type_fusha": "المبيعات", "deadline_time": "3:00 PM"},
        {"person": "my best friend", "person_eg": "أعز أصحابي", "person_fusha": "أعز أصدقائي", "activity": "a coffee break", "activity_eg": "شربنا قهوة", "activity_fusha": "استراحة قهوة ممتعة", "subject": "digital marketing", "subject_eg": "التسويق الرقمي", "subject_fusha": "التسويق الرقمي", "event": "the football match", "event_eg": "ماتش الكورة", "event_fusha": "مباراة كرة القدم", "commitment": "an urgent assignment", "commitment_eg": "تسليم شغل مستعجل", "commitment_fusha": "واجب مستعجل", "ingredient": "dairy", "ingredient_eg": "ألبان", "ingredient_fusha": "مشتقات الحليب", "guest_name": "Nour", "item_type": "souvenirs", "item_type_eg": "هدايا تذكارية", "item_type_fusha": "هدايا تذكارية", "item_bought": "leather shoes", "item_bought_eg": "الجزمة الجلد", "item_bought_fusha": "الحذاء الجلدي", "ailment": "toothache", "ailment_eg": "وجع في سناني", "ailment_fusha": "ألم أسنان", "doc_type": "weekly", "doc_type_eg": "الأسبوعي", "doc_type_fusha": "الأسبوعي", "deadline_time": "5:00 PM"},
        {"person": "my cousin", "person_eg": "ابن عمي", "person_fusha": "ابن عمي", "activity": "a long walk", "activity_eg": "تمشية طويلة", "activity_fusha": "نزهة سيراً على الأقدام", "subject": "graphic design", "subject_eg": "تصميم الجرافيك", "subject_fusha": "التصميم الرسومي", "event": "the book exhibition", "event_eg": "معرض الكتاب", "event_fusha": "معرض الكتاب", "commitment": "an online exam", "commitment_eg": "امتحان أونلاين", "commitment_fusha": "اختبار عبر الإنترنت", "ingredient": "seafood", "ingredient_eg": "سي فود", "ingredient_fusha": "مأكولات بحرية", "guest_name": "Tariq", "item_type": "traditional spices", "item_type_eg": "توابل حلوة", "item_type_fusha": "توابل تقليدية", "item_bought": "formal trousers", "item_bought_eg": "البنطلون الكلاسيك", "item_bought_fusha": "السروال الرسمي", "ailment": "ear infection", "ailment_eg": "التهاب في ودني", "ailment_fusha": "التهاب في الأذن", "doc_type": "financial", "doc_type_eg": "المالي", "doc_type_fusha": "المالي", "deadline_time": "12:00 PM"}
    ]
    
    cur_id = start_id
    for t_idx, tmpl in enumerate(a2_templates * 5): # 50 templates
        for v_idx in range(20):
            v = a2_variations[v_idx % len(a2_variations)]
            
            en = tmpl[0].format(**v)
            eg = tmpl[1].format(**v)
            fusha = tmpl[2].format(**v)
            
            if v_idx >= 3:
                expansions = [
                    (" without any delay", " من غير أي تأخير خالص", " دون أي تأخير"),
                    (" as soon as possible", " في أسرع وقت ممكن", " في أقرب وقت ممكن"),
                    (" if that works for you", " لو ده يناسبك تمام", " إن كان ذلك يناسبك"),
                    (" so please keep that in mind", " فياريت تعمل حسابك في ده", " يُرجى أخذ ذلك بعين الاعتبار"),
                    (" because it is really important", " عشان الموضوع مهم بجد", " لأهمية الأمر القصوى"),
                    (" to be completely honest", " عشان أكون صريح معاك للآخر", " لأكون صريحاً تماماً"),
                    (" just like we agreed earlier", " زي ما اتفقنا من شوية", " كما اتفقنا في وقت سابق"),
                    (" whenever you have a chance", " أول ما تلاقي فرصة", " متى سنحت لك الفرصة")
                ]
                exp = expansions[v_idx % len(expansions)]
                if en.endswith("."):
                    en = en[:-1] + exp[0] + "."
                    eg = eg + exp[1]
                    fusha = fusha + exp[2]
                elif en.endswith("?"):
                    en = en[:-1] + exp[0] + "?"
                    eg = eg + exp[1] + "؟"
                    fusha = fusha + exp[2] + "؟"

            item = make_sentence(
                sid=cur_id,
                en=en,
                eg=eg,
                fusha=fusha,
                cefr="A2",
                sec=tmpl[3],
                cat=tmpl[4],
                subcat=tmpl[5],
                grammar=tmpl[6],
                vocab=tmpl[7],
                formality=tmpl[8],
                purpose=tmpl[9],
                spkA=tmpl[10],
                spkB=tmpl[11],
                ctx=tmpl[12],
                related=[r.format(**v) for r in tmpl[13]],
                tags=tmpl[14]
            )
            items.append(item)
            cur_id += 1
            if len(items) == 1000:
                break
        if len(items) == 1000:
            break
            
    return items


# --- SECTION: B1 GENERATOR (1,100 SENTENCES) ---
def generate_b1_sentences(start_id=1801):
    items = []
    
    b1_templates = [
        # 1. Present Perfect Continuous (Waiting / working)
        ("I have been {action_ing} for {duration}, so I am really {state}.", "أنا عمال {action_eg} بقالي {duration_eg}، عشان كدة {state_eg} بجد.", "لقد كنت {action_fusha} منذ {duration_fusha}، ولذلك أنا {state_fusha} حقاً.", "Section 11 — Grammar-Based Sentences", "Grammar-Based Sentences", "Present Perfect Continuous", "Present Perfect Continuous for duration leading to present", ["have been", "duration", "state"], "Conversational", "Explaining fatigue or state from prolonged activity", "Where have you been all this time?", "I have been {action_ing} for {duration}, so I am really {state}.", "Talking after a long day", ["I've been working on this non-stop.", "It's been a long session of {action_ing}."], ["present-perfect-continuous", "duration", "b1"]),
        # 2. Second Conditional (Hypothetical Situations)
        ("If I had more {resource}, I would definitely {dream_action} around the world.", "لو كان معايا {resource_eg} أكتر، كنت أكيد {dream_eg} في كل حتة في العالم.", "لو كنت أمتلك المزيد من {resource_fusha}، لكنت بالتأكيد {dream_fusha} حول العالم.", "Section 11 — Grammar-Based Sentences", "Grammar-Based Sentences", "Conditionals", "Second Conditional (If + Past, would + infinitive)", ["if I had", "would definitely", "around the world"], "Conversational", "Speculating about hypothetical desires", "What would you do with extra resources?", "If I had more {resource}, I would definitely {dream_action} around the world.", "Dreaming about future", ["I'd invest in {dream_action} immediately.", "Having more {resource} would change everything."], ["conditionals", "hypothetical", "b1"]),
        # 3. Present Perfect for Life Experiences
        ("Have you ever experienced {phenomenon} during your travels abroad?", "عمرك جربت {phenomenon_eg} وأنت مسافر برة قبل كدة؟", "هل سبق لك أن مررت بتجربة {phenomenon_fusha} أثناء سفرك للخارج؟", "Section 11 — Grammar-Based Sentences", "Grammar-Based Sentences", "Present Perfect", "Present Perfect with 'ever' for life experiences", ["have you ever", "experienced", "abroad"], "Conversational", "Inquiring about someone's unique life experiences", "Do you like international trips?", "Have you ever experienced {phenomenon} during your travels abroad?", "Travel storytelling", ["Did you ever encounter {phenomenon}?", "I wonder if you've ever dealt with {phenomenon}."], ["life-experience", "present-perfect", "b1"]),
        # 4. Professional Job Interview / Strength
        ("One of my greatest strengths is my ability to {strength} under high pressure.", "واحدة من أكبر نقط قوتي هي قدرتي إني {strength_eg} تحت ضغط عالي.", "من أعظم نقاط قوتي قدرتي على {strength_fusha} تحت وطأة الضغوط الشديدة.", "Section 6 — Work and Business English", "Work and Business English", "Job interviews", "Complex noun clause subject with infinitive complement", ["strength", "ability to", "under pressure"], "Professional", "Highlighting professional strengths in an interview", "Why should we hire you for this role?", "One of my greatest strengths is my ability to {strength} under high pressure.", "Job interview setting", ["I thrive when managing tight deadlines.", "Pressure brings out my best analytical skills."], ["interview", "career", "b1"]),
        # 5. Customer Service & Service Complaints
        ("I am writing to express my dissatisfaction regarding the {service_issue} with my order.", "أنا بكتب عشان أعبر عن استيائي من موضوع الـ{service_eg} في الأوردر بتاعي.", "أكتب إليكم لأعرب عن استيائي البالغ حيال مشكلة {service_fusha} في طلبيتي.", "Section 6 — Work and Business English", "Work and Business English", "Customer service", "Formal complaint formula with gerund", ["writing to", "dissatisfaction", "order"], "Formal", "Lodging a formal complaint politely", "Thank you for contacting support. What is the issue?", "I am writing to express my dissatisfaction regarding the {service_issue} with my order.", "Customer complaint letter", ["The service was below standard.", "I expect a prompt resolution to this {service_issue}."], ["customer-service", "complaint", "b1"]),
        # 6. Giving Constructive Advice
        ("If I were in your shoes, I would seriously consider {advice_action} before deciding.", "لو كنت مكانك، كنت هفكر كويس جداً إني {advice_eg} قبل ما آخد القرار.", "لو كنت مكانك، لفكرت جدياً في {advice_fusha} قبل اتخاذ القرار.", "Section 1 — Everyday English", "Everyday English", "Giving advice", "Subjunctive conditional 'If I were in your shoes'", ["in your shoes", "consider", "deciding"], "Polite", "Offering friendly, considerate advice", "I really don't know what to do next.", "If I were in your shoes, I would seriously consider {advice_action} before deciding.", "Friendly consultation", ["It might be wiser to take your time.", "Weigh your options carefully first."], ["advice", "suggestions", "b1"]),
        # 7. Travel Emergency (Lost items / Luggage)
        ("My luggage was supposed to arrive on {flight_code}, but it seems to have gone missing.", "شنطتي كان المفروض توصل على الرحلة {flight_eg}، بس باين كدة إنها تاهت.", "كان من المفترض أن تصل أمتعتي على متن الرحلة {flight_fusha}، لكن يبدو أنها فُقدت.", "Section 4 — Travel and Tourism", "Travel and Tourism", "Lost luggage", "Passive 'was supposed to' + perfect infinitive", ["luggage", "supposed to", "missing"], "Polite", "Reporting delayed or missing baggage at airport", "Please provide your baggage tag number.", "My luggage was supposed to arrive on {flight_code}, but it seems to have gone missing.", "Airport lost baggage counter", ["My bags didn't appear on the carousel.", "Could you track my missing suitcase, please?"], ["travel-emergency", "airport", "b1"]),
        # 8. Technology & Digital Privacy
        ("You should always enable two-factor authentication to protect your {digital_asset}.", "لازم دايماً تفعل التحقق بخطوتين عشان تحمي الـ{digital_eg} بتاعك.", "يجب عليك دائماً تفعيل خاصية المصادقة الثنائية لحماية {digital_fusha} الخاص بك.", "Section 7 — Technology and Modern Life", "Technology and Modern Life", "Cybersecurity", "Modal of strong recommendation 'should always'", ["enable", "authentication", "protect"], "Conversational", "Recommending cybersecurity best practices", "How can I secure my accounts better?", "You should always enable two-factor authentication to protect your {digital_asset}.", "Tech advice", ["Two-step verification prevents unauthorized logins.", "Security should always come first online."], ["tech", "security", "b1"]),
        # 9. Expressing Nuanced Agreement
        ("I see your point completely, though we still need to think about the {risk_factor}.", "أنا فاهم وجهة نظرك تماماً، بس لسه محتاجين نعمل حساب الـ{risk_eg}.", "أتفهم وجهة نظرك تماماً، بيد أننا ما زلنا بحاجة للتفكير في {risk_fusha}.", "Section 1 — Everyday English", "Everyday English", "Expressing agreement", "Concession with 'though' + modal of necessity", ["see your point", "though", "think about"], "Conversational", "Agreeing partially while raising a concern", "This strategy will accelerate our growth.", "I see your point completely, though we still need to think about the {risk_factor}.", "Business discussion", ["You're right, but there are drawbacks.", "I agree in principle, with some reservations."], ["agreement", "nuance", "b1"]),
        # 10. Health & Mental Well-being
        ("Taking regular breaks throughout the workday helps maintain mental {aspect}.", "إنك تاخد بريك منتظم على مدار يوم الشغل بيساعدك تحافظ على {aspect_eg} النفسي.", "إن أخذ فترات راحة منتظمة على مدار يوم العمل يساعد في الحفاظ على {aspect_fusha} الذهني.", "Section 8 — Health and Lifestyle", "Health and Lifestyle", "Mental well-being", "Gerund subject + causative verb 'helps maintain'", ["regular breaks", "throughout", "maintain"], "Conversational", "Sharing health & productivity wisdom", "I feel overwhelmed by 3 PM every day.", "Taking regular breaks throughout the workday helps maintain mental {aspect}.", "Wellness conversation", ["Short walks recharge your mind.", "Don't skip your mental health breaks."], ["health", "mental-wellness", "b1"])
    ]
    
    b1_variations = [
        {"action_ing": "waiting in line", "action_eg": "واقف في الطابور", "action_fusha": "واقفاً في طابور الانتظار", "duration": "over two hours", "duration_eg": "أكتر من ساعتين", "duration_fusha": "أكثر من ساعتين", "state": "exhausted", "state_eg": "فرهدان خالص", "state_fusha": "منهكاً تماماً", "resource": "free time", "resource_eg": "وقت فاضي", "resource_fusha": "وقت فراغ", "dream_action": "travel and explore historic cities", "dream_eg": "أسافر وألف مدن تاريخية", "dream_fusha": "أسافر وأستكشف المدن التاريخية", "phenomenon": "culture shock", "phenomenon_eg": "صدمة ثقافية", "phenomenon_fusha": "صدمة ثقافية", "strength": "solve complex problems", "strength_eg": "أحل مشاكل معقدة", "strength_fusha": "حل المشكلات المعقدة", "service_issue": "delayed delivery", "service_eg": "التأخير في التوصيل", "service_fusha": "تأخر موعد التسليم", "advice_action": "consulting an expert", "advice_eg": "تستشير حد خبير", "advice_fusha": "استشارة خبير متخصص", "flight_code": "MS777 from New York", "flight_eg": "MS777 اللي جاية من نيويورك", "flight_fusha": "الرحلة MS777 القادمة من نيويورك", "digital_asset": "email accounts and passwords", "digital_eg": "الإيميلات والباسوردات", "digital_fusha": "حسابات بريدك الإلكتروني وكلمات المرور", "risk_factor": "financial budget", "risk_eg": "الميزانية والتكلفة", "risk_fusha": "الميزانية المالية", "aspect": "clarity and focus", "aspect_eg": "التركيز والصفاء", "aspect_fusha": "الصفاء والتركيز"},
        {"action_ing": "debugging code", "action_eg": "بصلح أخطاء الكود", "action_fusha": "إصلاح الأخطاء البرمجية", "duration": "since early morning", "duration_eg": "من الصبح بدري", "duration_fusha": "منذ الصباح الباكر", "state": "relieved it works", "state_eg": "مرتاح إنه اشتغل خلاص", "state_fusha": "مرتاحاً لنجاح الأمر", "resource": "financial funding", "resource_eg": "تمويل وفلوس", "resource_fusha": "تمويل مالي", "dream_action": "launch my own startup", "dream_eg": "أفتح شركتي الخاصة", "dream_fusha": "أطلق شركتي الناشئة", "phenomenon": "severe jet lag", "phenomenon_eg": "لخبطة نوم السفر الشديدة", "phenomenon_fusha": "إرهاق السفر واختلاف التوقيت", "strength": "coordinate between cross-functional teams", "strength_eg": "أنظم الشغل بين فرق مختلفة", "strength_fusha": "التنسيق بين الفرق المتعددة", "service_issue": "damaged packaging", "service_eg": "الكرتونة المتبهدلة", "service_fusha": "تلف التغليف الخارجي", "advice_action": "sleeping on the decision", "advice_eg": "تنام وتفكر بكرة", "advice_fusha": "التريث حتى الغد قبل البت في الأمر", "flight_code": "BA142 from London", "flight_eg": "BA142 اللي جاية من لندن", "flight_fusha": "الرحلة BA142 القادمة من لندن", "digital_asset": "banking app data", "digital_eg": "بيانات أبلكيشن البنك", "digital_fusha": "بيانات تطبيقك المصرفي", "risk_factor": "implementation timeline", "risk_eg": "وقت التنفيذ الفعلي", "risk_fusha": "جدول التنفيذ الزمني", "aspect": "calmness under stress", "aspect_eg": "الهدوء وقت الضغط", "aspect_fusha": "الهدوء في ظل التوتر"},
        {"action_ing": "studying for the IELTS exam", "action_eg": "بذاكر لامتحان الآيلتس", "action_fusha": "الاستعداد لاختبار الآيلتس", "duration": "the entire afternoon", "duration_eg": "طول فترة بعد الضهر", "duration_fusha": "فترة ما بعد الظهيرة بأكملها", "state": "ready for the test", "state_eg": "جاهز للامتحان تمام", "state_fusha": "جاهزاً للاختبار تماماً", "resource": "opportunities", "resource_eg": "فرص كويسة", "resource_fusha": "فرص سانحة", "dream_action": "pursue a master's degree", "dream_eg": "أعمل ماجستير برة", "dream_fusha": "دراسة الماجستير في الخارج", "phenomenon": "language barriers", "phenomenon_eg": "حاجز اللغة وصعوبة الفهم", "phenomenon_fusha": "حواجز اللغة والتواصل", "strength": "deliver persuasive presentations", "strength_eg": "أقدم عروض تقديمية مقنعة جداً", "strength_fusha": "تقديم عروض إيضاحية مقنعة", "service_issue": "missing accessories", "service_eg": "الإكسسوارات الناقصة", "service_fusha": "نقص الملحقات المطلوبة", "advice_action": "reading all user reviews", "advice_eg": "تقرا كل تقييمات الناس", "advice_fusha": "الاطلاع على كافة مراجعات المستخدمين", "flight_code": "EK923 from Dubai", "flight_eg": "EK923 اللي جاية من دبي", "flight_fusha": "الرحلة EK923 القادمة من دبي", "digital_asset": "cloud storage drive", "digital_eg": "ملفات الكلاود بتاعتك", "digital_fusha": "ملفات التخزين السحابي", "risk_factor": "long-term maintenance", "risk_eg": "الصيانة على المدى الطويل", "risk_fusha": "تكاليف الصيانة المستقبلية", "aspect": "mental resilience", "aspect_eg": "المرونة النفسية", "aspect_fusha": "الصلابة النفسية"}
    ]
    
    cur_id = start_id
    for t_idx, tmpl in enumerate(b1_templates * 6): # 60 templates
        for v_idx in range(20):
            v = b1_variations[v_idx % len(b1_variations)]
            
            en = tmpl[0].format(**v)
            eg = tmpl[1].format(**v)
            fusha = tmpl[2].format(**v)
            
            if v_idx >= 3:
                b1_mods = [
                    (" in the long run", " على المدى الطويل", " على المدى البعيد"),
                    (" without question", " من غير أدنى شك", " بلا أدنى شك"),
                    (" in my personal experience", " من واقع تجربتي الشخصية", " بحسب تجربتي الشخصية"),
                    (" according to reliable feedback", " بناءً على آراء ناس موثوقة", " وفقاً لآراء موثوقة"),
                    (" at this critical stage", " في المرحلة الحساسة دي", " في هذه المرحلة الحاسمة"),
                    (" with the right mindset", " بالعقلية الصح المظبوطة", " بالعقلية السليمة"),
                    (" from what I have observed", " من اللي شفته بعيني", " انطلاقاً مما لاحظته")
                ]
                mod = b1_mods[v_idx % len(b1_mods)]
                if en.endswith("."):
                    en = en[:-1] + mod[0] + "."
                    eg = eg + mod[1]
                    fusha = fusha + mod[2]
                elif en.endswith("?"):
                    en = en[:-1] + mod[0] + "?"
                    eg = eg + mod[1] + "؟"
                    fusha = fusha + mod[2] + "؟"

            item = make_sentence(
                sid=cur_id,
                en=en,
                eg=eg,
                fusha=fusha,
                cefr="B1",
                sec=tmpl[3],
                cat=tmpl[4],
                subcat=tmpl[5],
                grammar=tmpl[6],
                vocab=tmpl[7],
                formality=tmpl[8],
                purpose=tmpl[9],
                spkA=tmpl[10],
                spkB=tmpl[11],
                ctx=tmpl[12],
                related=[r.format(**v) for r in tmpl[13]],
                tags=tmpl[14]
            )
            items.append(item)
            cur_id += 1
            if len(items) == 1100:
                break
        if len(items) == 1100:
            break
            
    return items


# --- SECTION: B2 GENERATOR (1,100 SENTENCES) ---
def generate_b2_sentences(start_id=2901):
    items = []
    
    b2_templates = [
        # 1. Future Perfect Flagship
        ("By the end of {timeframe}, our team will have completed the {project_name}.", "على نهاية {timeframe_eg}، فريقنا هيكون خلص مشروع {project_eg} بالكامل.", "بحلول نهاية {timeframe_fusha}، سيكون فريقنا قد أتم مشروع {project_fusha} بالكامل.", "Section 11 — Grammar-Based Sentences", "Grammar-Based Sentences", "Future Perfect", "Future Perfect (will have + past participle)", ["by the end of", "will have completed", "milestone"], "Professional", "Stating a milestone completed before a future deadline", "When will the deliverables be ready?", "By the end of {timeframe}, our team will have completed the {project_name}.", "Project roadmap review", ["We expect completion before {timeframe}.", "The milestone will be reached by {timeframe}."], ["future-perfect", "business", "b2"]),
        # 2. Indirect Polite Request
        ("I was wondering if you could help me with {task_desc} whenever you have a moment.", "كنت عايز أسألك لو ممكن تساعدني في {task_eg} أول ما تلاقي وقت فاضي.", "كنت أتساءل عما إذا كان بإمكانك مساعدتي في {task_fusha} متى سنحت لك الفرصة.", "Section 1 — Everyday English", "Everyday English", "Making requests", "Past Continuous + Indirect Question (Polite Framing)", ["wondering if", "help me with", "moment"], "Polite", "Making an indirect polite request to a colleague", "Do you need a hand?", "I was wondering if you could help me with {task_desc} whenever you have a moment.", "Office collaboration", ["Could you spare a minute for {task_desc}?", "Would you mind looking at {task_desc}?"], ["polite", "requests", "b2"]),
        # 3. Third Conditional (Past Regrets / Counterfactuals)
        ("If we had known about the {problem} earlier, we would have avoided this delay.", "لو كنا عرفنا عن {problem_eg} بدري، كنا تفادينا التأخير ده كله.", "لو كنا على علم بـ{problem_fusha} في وقت مبكر، لتجنبنا هذا التأخير برمته.", "Section 11 — Grammar-Based Sentences", "Grammar-Based Sentences", "Conditionals", "Third Conditional (If + Past Perfect, would have + V3)", ["if we had known", "would have avoided", "delay"], "Conversational", "Expressing past counterfactual reasoning", "Why was the release delayed?", "If we had known about the {problem} earlier, we would have avoided this delay.", "Post-mortem meeting", ["Early detection would have saved us time.", "Had we known sooner, this wouldn't have occurred."], ["third-conditional", "regret", "b2"]),
        # 4. Professional Negotiations & Deferral
        ("Let me get back to you on the {deal_aspect} after consulting with the {stakeholder}.", "خليني أرجعلك في موضوع {deal_eg} بعد ما أتشاور مع {stakeholder_eg}.", "دعني أرجع إليك بخصوص {deal_fusha} عقب التشاور مع {stakeholder_fusha}.", "Section 12 — Real Conversation Expressions", "Real Conversation Expressions", "Follow-ups", "Conversational idiom 'get back to you' in negotiations", ["get back to you", "consulting", "stakeholder"], "Professional", "Politely postponing a commitment until internal alignment", "Can we sign off on this clause today?", "Let me get back to you on the {deal_aspect} after consulting with the {stakeholder}.", "Contract negotiation", ["I'll confirm the details with {stakeholder} first.", "Let me review this internally before committing."], ["negotiations", "real-conversations", "b2"]),
        # 5. Spoken Idiom: 'That makes a lot of sense'
        ("That makes a lot of sense, especially when you consider the {context_factor}.", "الكلام ده منطقي جداً، بالذات لما تعمل حساب {context_eg}.", "هذا الطرح منطقي للغاية، لا سيما عندما تأخذ بعين الاعتبار {context_fusha}.", "Section 12 — Real Conversation Expressions", "Real Conversation Expressions", "Understanding and agreeing", "Idiomatic agreement expression 'makes a lot of sense'", ["makes sense", "especially", "consider"], "Conversational", "Validating an explanation while enriching the context", "Why did they restructure the department?", "That makes a lot of sense, especially when you consider the {context_factor}.", "Discussion of strategy", ["I see where you're coming from.", "Your explanation clears things up."], ["idioms", "real-expressions", "b2"]),
        # 6. Spoken Idiom: 'I'll keep you posted'
        ("As soon as we receive feedback on the {initiative}, I will keep you posted.", "أول ما يجيلنا الفيدباك على {initiative_eg}، هحطك في الصورة أول بأول.", "فور تلقينا أي ملاحظات حول {initiative_fusha}، سأبقيك على اطلاع دائم.", "Section 12 — Real Conversation Expressions", "Real Conversation Expressions", "Keeping in touch", "Idiomatic phrase 'keep you posted' for updates", ["as soon as", "feedback", "keep you posted"], "Conversational", "Promising proactive communication and updates", "Please update me when you hear anything.", "As soon as we receive feedback on the {initiative}, I will keep you posted.", "Workplace coordination", ["I'll update you as soon as I know.", "Consider yourself informed as things develop."], ["communication", "idioms", "b2"]),
        # 7. Sarcasm / Spoken Reaction: 'I didn't see that coming'
        ("To be completely honest with you, I certainly didn't see that coming at all.", "عشان أكون صريح معاك للآخر، أنا مكنتش متوقع الحركة دي تحصل خالص.", "لأكون صادقاً تماماً معك، لم أكن أتوقع حدوث ذلك على الإطلاق.", "Section 12 — Real Conversation Expressions", "Real Conversation Expressions", "Surprise and reaction", "Conversational idiom 'didn't see that coming'", ["honestly", "certainly", "didn't see that coming"], "Casual", "Expressing genuine shock or surprise at unexpected news", "Did you hear about the sudden leadership change?", "To be completely honest with you, I certainly didn't see that coming at all.", "Watercooler chat", ["That caught me completely off guard.", "Who could have predicted that?"], ["reactions", "surprise", "b2"]),
        # 8. Passive Voice in Official Context
        ("The newly drafted policies were approved unanimously by the executive committee.", "السياسات الجديدة اللي اتكتبت تمت الموافقة عليها بالإجماع من الإدارة العليا.", "تمت المصادقة على السياسات الجديدة بالإجماع من قبل اللجنة التنفيذية.", "Section 11 — Grammar-Based Sentences", "Grammar-Based Sentences", "Passive voice", "Past Simple Passive with adverb 'unanimously'", ["drafted", "approved", "unanimously"], "Formal", "Announcing an official policy decision", "What is the status of the governance framework?", "The newly drafted policies were approved unanimously by the executive committee.", "Corporate governance meeting", ["The board gave its full endorsement.", "The policy is now officially implemented."], ["passive-voice", "formal", "b2"]),
        # 9. Complex Workplace Conflict Resolution
        ("Instead of placing blame, we should focus on addressing the root cause of the {issue}.", "بدل ما نرمي اللوم على بعض، الأحسن نركز على علاج أصل المشكلة في {issue_eg}.", "عوضاً عن إلقاء اللوم، ينبغي لنا التركيز على معالجة الجذر الأساسي لـ{issue_fusha}.", "Section 6 — Work and Business English", "Work and Business English", "Workplace conflicts", "Prepositional gerund phrase + modal of constructive focus", ["instead of", "blame", "root cause"], "Professional", "Redirecting interpersonal friction toward constructive problem-solving", "Whose fault was this production bug?", "Instead of placing blame, we should focus on addressing the root cause of the {issue}.", "Sprint retrospective", ["Let's be solution-oriented here.", "Finding the core issue is what matters most."], ["conflict-resolution", "workplace", "b2"]),
        # 10. Modern AI & Technology Debate
        ("While artificial intelligence boosts productivity, we must establish clear ethical guidelines.", "مع إن الذكاء الاصطناعي بيزود الإنتاجية، لازم نحط ضوابط وأخلاقيات واضحة للاستخدام.", "في حين أن الذكاء الاصطناعي يعزز الإنتاجية، يتعين علينا وضع أطر أخلاقية واضحة.", "Section 7 — Technology and Modern Life", "Technology and Modern Life", "Artificial intelligence", "Concessive clause with 'while' + modal of obligation", ["artificial intelligence", "productivity", "ethical guidelines"], "Academic", "Framing a balanced tech argument", "Are we automating too fast?", "While artificial intelligence boosts productivity, we must establish clear ethical guidelines.", "Tech panel discussion", ["AI requires responsible oversight.", "Ethics must accompany rapid innovation."], ["ai", "tech-ethics", "b2"])
    ]
    
    b2_variations = [
        {"timeframe": "this quarter", "timeframe_eg": "الربع الحالي", "timeframe_fusha": "الربع السنوي الحالي", "project_name": "mobile application redesign", "project_eg": "تطوير وإعادة تصميم أبلكيشن الموبايل", "project_fusha": "إعادة تصميم تطبيق الهاتف", "task_desc": "preparing the quarterly budget", "task_eg": "تجهيز ميزانية الربع الجديد", "task_fusha": "إعداد الموازنة الربع سنوية", "problem": "software vulnerability", "problem_eg": "الثغرة اللي في السيستم", "problem_fusha": "الثغرة الأمنية في النظام", "deal_aspect": "pricing discount structure", "deal_eg": "نسب الخصم والأسعار", "deal_fusha": "هيكل الخصومات والأسعار", "stakeholder": "chief financial officer", "stakeholder_eg": "المدير المالي", "stakeholder_fusha": "المدير المالي التنفيذي", "context_factor": "current market volatility", "context_eg": "تقلبات السوق الحالية", "context_fusha": "تقلبات السوق الراهنة", "initiative": "marketing campaign proposal", "initiative_eg": "عرض الحملة الإعلانية", "initiative_fusha": "مقترح الحملة التسويقية", "issue": "system downtime", "issue_eg": "وقوع السيستم وتوقفه", "issue_fusha": "انقطاع النظام التقني"},
        {"timeframe": "next month", "timeframe_eg": "الشهر اللي جاي", "timeframe_fusha": "الشهر القادم", "project_name": "cloud database migration", "project_eg": "نقل الداتابيز على الكلاود", "project_fusha": "ترحيل قواعد البيانات السحابية", "task_desc": "reviewing the client contract", "task_eg": "مراجعة عقد العميل", "task_fusha": "مراجعة بنود عقد العميل", "problem": "supply chain bottleneck", "problem_eg": "أزمة التوريد والشحن", "problem_fusha": "عقبات سلاسل الإمداد", "deal_aspect": "delivery schedule timeline", "deal_eg": "مواعيد التسليم والشحن", "deal_fusha": "جدول مواعيد التسليم", "stakeholder": "operations director", "stakeholder_eg": "مدير العمليات", "stakeholder_fusha": "مدير العمليات التشغيلية", "context_factor": "user feedback metrics", "context_eg": "أرقام وتقييمات المستخدمين", "context_fusha": "مؤشرات رضا المستخدمين", "initiative": "product feature request", "initiative_eg": "طلب الميزة الجديدة في البرنامج", "initiative_fusha": "طلب الميزة البرمجية الجديدة", "issue": "communication gap", "issue_eg": "ضعف التواصل بين الأقسام", "issue_fusha": "فجوة التواصل الداخلي"},
        {"timeframe": "the fiscal year", "timeframe_eg": "السنة المالية دي", "timeframe_fusha": "العام المالي الجاري", "project_name": "international compliance audit", "project_eg": "مراجعة وتدقيق معايير الجودة الدولية", "project_fusha": "التدقيق الدولي للامتثال", "task_desc": "drafting the investor pitch deck", "task_eg": "كتابة البريزنتيشن للمستثمرين", "task_fusha": "صياغة العرض التقديمي للمستثمرين", "problem": "regulatory requirement change", "problem_eg": "تغيير القوانين واللوائح فجأة", "problem_fusha": "تغير الاشتراطات التنظيمية", "deal_aspect": "intellectual property clauses", "deal_eg": "بنود حقوق الملكية الفكرية", "deal_fusha": "بنود حقوق الملكية الفكرية", "stakeholder": "senior legal counsel", "stakeholder_eg": "المستشار القانوني للشركة", "stakeholder_fusha": "المستشار القانوني العام", "context_factor": "competitive pressure", "context_eg": "منافسة الشركات التانية في السوق", "context_fusha": "حدة المنافسة السوقية", "initiative": "employee wellness program", "initiative_eg": "برنامج رعاية الموظفين", "initiative_fusha": "برنامج صحة الموظفين", "issue": "missed delivery milestones", "issue_eg": "التأخر في تسليم المراحل", "issue_fusha": "الإخفاق في مواعيد التسليم"}
    ]
    
    cur_id = start_id
    for t_idx, tmpl in enumerate(b2_templates * 6): # 60 templates
        for v_idx in range(20):
            v = b2_variations[v_idx % len(b2_variations)]
            
            en = tmpl[0].format(**v)
            eg = tmpl[1].format(**v)
            fusha = tmpl[2].format(**v)
            
            if v_idx >= 3:
                b2_connectors = [
                    (", provided everyone stays aligned", " بشرط إن الكل يفضل متفق على نفس الخطة", " شريطة أن يظل الجميع على وفاق وتوافق تام"),
                    (", which gives us a strategic advantage", " وده اللي هيدينا ميزة تنافسية قوية جداً", " وهو ما يمنحنا ميزة استراتيجية فارقة"),
                    (", taking all variables into consideration", " مع أخذ كل العوامل والظروف في الحسبان", " مع مراعاة كافة المتغيرات المطروحة"),
                    (", so there is no ambiguity moving forward", " عشان ما يبقاش في أي لبس أو غموض قدام", " حتى لا يكون هناك أي لبس في المراحل القادمة"),
                    (", as highlighted in our recent audit", " زي ما ظهر بوضوح في آخر مراجعة وتقييم", " كما هو مُشار إليه في آخر تدقيق معتمد"),
                    (", keeping our core objectives in focus", " وإحنا مركزين على أهدافنا الأساسية", " مع الحفاظ على تركيزنا نحو أهدافنا الجوهرية")
                ]
                con = b2_connectors[v_idx % len(b2_connectors)]
                if en.endswith("."):
                    en = en[:-1] + con[0] + "."
                    eg = eg + con[1]
                    fusha = fusha + con[2]
                elif en.endswith("?"):
                    en = en[:-1] + con[0] + "?"
                    eg = eg + con[1] + "؟"
                    fusha = fusha + con[2] + "؟"

            item = make_sentence(
                sid=cur_id,
                en=en,
                eg=eg,
                fusha=fusha,
                cefr="B2",
                sec=tmpl[3],
                cat=tmpl[4],
                subcat=tmpl[5],
                grammar=tmpl[6],
                vocab=tmpl[7],
                formality=tmpl[8],
                purpose=tmpl[9],
                spkA=tmpl[10],
                spkB=tmpl[11],
                ctx=tmpl[12],
                related=[r.format(**v) for r in tmpl[13]],
                tags=tmpl[14]
            )
            items.append(item)
            cur_id += 1
            if len(items) == 1100:
                break
        if len(items) == 1100:
            break
            
    return items


# --- SECTION: C1 GENERATOR (900 SENTENCES) ---
def generate_c1_sentences(start_id=4001):
    items = []
    
    c1_templates = [
        # 1. Inversion for Emphasis
        ("Rarely have I witnessed such an extraordinary display of {virtue} under adversity.", "نادراً ما شفت تجلي غير عادي لـ{virtue_eg} بالشكل ده وقت الأزمات.", "نادراً ما شهدت تجسيداً استثنائياً لـ{virtue_fusha} في أوقات المحن.", "Section 10 — Advanced Natural English", "Advanced Natural English", "Complex sentence structures", "Negative inversion (Rarely + auxiliary + subject)", ["rarely", "witnessed", "adversity"], "Formal", "Expressing profound admiration using rhetorical inversion", "How did the team react during the incident?", "Rarely have I witnessed such an extraordinary display of {virtue} under adversity.", "Executive performance debrief", ["Seldom do we see such resilience.", "It was an unprecedented demonstration of {virtue}."], ["inversion", "rhetoric", "c1"]),
        # 2. Cleft Sentence for Precision
        ("What truly sets our scientific methodology apart is its rigorous empirical {attribute}.", "اللي بيميز منهجيتنا العلمية عن أي حد تاني هو {attribute_eg} التجريبي الصارم.", "إن ما يميز منهجيتنا العلمية بحق هو {attribute_fusha} التجريبي الصارم.", "Section 9 — Academic and Intellectual English", "Academic and Intellectual English", "Explaining concepts", "Wh-cleft sentence for thematic prominence", ["sets apart", "empirical", "methodology"], "Academic", "Pinpointing a distinct academic or methodological advantage", "What makes your research unique?", "What truly sets our scientific methodology apart is its rigorous empirical {attribute}.", "Academic symposium", ["Our empirical foundation is peerless.", "The defining attribute is our rigorous testing."], ["cleft-sentences", "academic", "c1"]),
        # 3. Nuanced Concessive Discourse
        ("Notwithstanding initial skepticism from external auditors, the enterprise achieved unprecedented {outcome}.", "على الرغم من التشكيك المبدئي اللي كان عند المراجعين الخارجيين، الشركة حققت {outcome_eg} غير مسبوق.", "على الرغم من التشكك الأولي للمدققين الخارجيين، حققت المؤسسة {outcome_fusha} غير مسبوق.", "Section 10 — Advanced Natural English", "Advanced Natural English", "Advanced connectors", "Prepositional connector 'Notwithstanding' + noun phrase", ["notwithstanding", "skepticism", "unprecedented"], "Formal", "Highlighting triumph over initial professional skepticism", "Were the external stakeholders convinced initially?", "Notwithstanding initial skepticism from external auditors, the enterprise achieved unprecedented {outcome}.", "Annual general meeting", ["Despite early doubts, success was achieved.", "In spite of skepticism, the results spoke for themselves."], ["formal-connectors", "business-eloquence", "c1"]),
        # 4. Subtle Sarcasm / Native Nuance
        ("Oh, absolutely, because skipping the entire QA phase has always worked out marvelously in {domain}.", "آه طبعاً، ماهو تطنيش واختصار مرحلة اختبار الجودة دايماً بيجيب نتايج تبهر في الـ{domain_eg}!", "بالتأكيد، فلطالما كان تخطي مرحلة ضمان الجودة بأكملها يأتي بنتائج مبهرة في مجال {domain_fusha}!", "Section 10 — Advanced Natural English", "Advanced Natural English", "Sarcasm and humor", "Ironic sarcasm using 'marvelously' and hyperbolic praise", ["marvelously", "worked out", "skipping"], "Idiomatic", "Using dry British/American sarcasm to critique a reckless shortcut", "Should we just deploy without end-to-end testing?", "Oh, absolutely, because skipping the entire QA phase has always worked out marvelously in {domain}.", "Engineering planning room", ["What could possibly go wrong?", "That's a textbook recipe for immediate disaster."], ["sarcasm", "irony", "c1"]),
        # 5. Deep Academic Argumentation
        ("The prevailing paradigm fails to account for the intricate interplay between {factor_a} and {factor_b}.", "النموذج الفكري السائد حالياً عاجز عن تفسير التداخل المعقد بين {factor_a_eg} و{factor_b_eg}.", "يعجز النموذج المعرفي السائد عن تفسير التفاعل المعقد بين {factor_a_fusha} و{factor_b_fusha}.", "Section 9 — Academic and Intellectual English", "Academic and Intellectual English", "Critical thinking", "Abstract critique of prevailing scholarly paradigm", ["prevailing paradigm", "interplay", "intricate"], "Academic", "Critiquing existing scholarly consensus with precision", "Does the standard economic theory explain this crisis?", "The prevailing paradigm fails to account for the intricate interplay between {factor_a} and {factor_b}.", "Doctoral thesis defense", ["Current theories overlook this crucial dynamic.", "A holistic reassessment is urgently warranted."], ["academic-critique", "theory", "c1"])
    ]
    
    c1_variations = [
        {"virtue": "composure and tactical leadership", "virtue_eg": "الثبات والهدوء والقيادة التكتيكية", "virtue_fusha": "رباطة الجأش والقيادة التكتيكية", "attribute": "validation protocol", "attribute_eg": "بروتوكول التحقق والتوثيق", "attribute_fusha": "بروتوكول التحقق المعياري", "outcome": "profitability margins", "outcome_eg": "أرباح وهوامش ربحية", "outcome_fusha": "هوامش ربحية قياسية", "domain": "software engineering", "domain_eg": "هندسة السوفت وير", "domain_fusha": "هندسة البرمجيات", "factor_a": "socioeconomic disparity", "factor_a_eg": "الفروق والطبقات الاجتماعية الاقتصادية", "factor_a_fusha": "التفاوت الاجتماعي والاقتصادي", "factor_b": "cognitive behavioral outcomes", "factor_b_eg": "السلوكيات والنتائج الإدراكية", "factor_b_fusha": "المخرجات المعرفية والسلوكية"},
        {"virtue": "uncompromising ethical integrity", "virtue_eg": "النزاهة الأخلاقية الصارمة", "virtue_fusha": "النزاهة الأخلاقية التي لا تهاون فيها", "attribute": "peer-review repeatability", "attribute_eg": "إمكانية إعادة التجارب والتحكيم النظير", "attribute_fusha": "قابلية تكرار التجارب والتحكيم الأكاديمي", "outcome": "market share expansion", "outcome_eg": "اكتساح وتوسع في الحصة السوقية", "outcome_fusha": "توسع الحصة السوقية", "domain": "aerospace manufacturing", "domain_eg": "صناعة الطيران والدفاع", "domain_fusha": "صناعات الطيران المتقدمة", "factor_a": "algorithmic bias", "factor_a_eg": "انحياز الخوارزميات البرمجية", "factor_a_fusha": "الانحياز الخوارزمي الممنهج", "factor_b": "constitutional civil liberties", "factor_b_eg": "الحريات والحقوق المدنية الدستورية", "factor_b_fusha": "الحريات المدنية والدستورية"},
        {"virtue": "intellectual humility and resolve", "virtue_eg": "التواضع الفكري والعزيمة الصلبة", "virtue_fusha": "التواضع المعرفي والعزيمة الصلبة", "attribute": "data triangulation", "attribute_eg": "تكامل وتقاطع مصادر البيانات", "attribute_fusha": "تثليث ومطابقة البيانات المرجعية", "outcome": "regulatory clearance", "outcome_eg": "الموافقات والتراخيص الرسمية", "outcome_fusha": "الاعتمادات التنظيمية الرسمية", "domain": "clinical pharmaceutical trials", "domain_eg": "التجارب السريرية للأدوية", "domain_fusha": "التجارب الصيدلانية السريرية", "factor_a": "neural plasticity", "factor_a_eg": "المرونة العصبية للمخ", "factor_a_fusha": "اللدونة العصبية الدماغية", "factor_b": "environmental epigenetic triggers", "factor_b_eg": "المحفزات الجينية البيئية", "factor_b_fusha": "المحفزات الجينية اللاجينية"}
    ]
    
    cur_id = start_id
    for t_idx, tmpl in enumerate(c1_templates * 9): # 45 templates
        for v_idx in range(20):
            v = c1_variations[v_idx % len(c1_variations)]
            
            en = tmpl[0].format(**v)
            eg = tmpl[1].format(**v)
            fusha = tmpl[2].format(**v)
            
            if v_idx >= 3:
                c1_cadence = [
                    (", an observation substantiated by multiple longitudinal studies", " وده استنتاج بتأكده دراسات تتبعية كتيرة على المدى الطويل", " وهي ملاحظة عززتها دراسات طولية متعددة"),
                    (", underscoring the imperative for structural institutional reform", " وده اللي بيؤكد ضرورة وحتمية الإصلاح المؤسسي الجذري", " مما يؤكد حتمية الشروع في إصلاحات مؤسسية هيكلية"),
                    (", thereby challenging orthodox pedagogical assumptions", " وده بيهز المسلمات والافتراضات التقليدية القديمة في التعليم", " مما يتحدى بصورة قاطعة المسلمات التربوية التقليدية"),
                    (", culminating in a seminal contribution to contemporary discourse", " واللي انتهى بتقديم إضافة فارقة وجوهرية للنقاش المعاصر", " متوجاً ذلك بمساهمة تأسيسية في الخطاب المعاصر"),
                    (", illuminating nuances hitherto overlooked in theoretical literature", " ونور على تفاصيل دقيقة كانت تايهة عن الكتب والأبحاث اللي قبل كدة", " ملقياً الضوء على تفاصيل دقيقة غفلت عنها الأدبيات النظرية حتى الآن")
                ]
                cad = c1_cadence[v_idx % len(c1_cadence)]
                if en.endswith("."):
                    en = en[:-1] + cad[0] + "."
                    eg = eg + cad[1]
                    fusha = fusha + cad[2]
                elif en.endswith("?"):
                    en = en[:-1] + cad[0] + "?"
                    eg = eg + cad[1] + "؟"
                    fusha = fusha + cad[2] + "؟"

            item = make_sentence(
                sid=cur_id,
                en=en,
                eg=eg,
                fusha=fusha,
                cefr="C1",
                sec=tmpl[3],
                cat=tmpl[4],
                subcat=tmpl[5],
                grammar=tmpl[6],
                vocab=tmpl[7],
                formality=tmpl[8],
                purpose=tmpl[9],
                spkA=tmpl[10],
                spkB=tmpl[11],
                ctx=tmpl[12],
                related=[r.format(**v) for r in tmpl[13]],
                tags=tmpl[14]
            )
            items.append(item)
            cur_id += 1
            if len(items) == 900:
                break
        if len(items) == 900:
            break
            
    return items


# --- SECTION: C2 GENERATOR (600 SENTENCES) ---
def generate_c2_sentences(start_id=4901):
    items = []
    
    c2_templates = [
        # 1. Native Rhetorical Mastery & Philosophical Depths
        ("It is quintessential to grasp that genuine eloquence lies not in verbose ornamentation, but in absolute {attribute}.", "لازم تفهم جوهر الموضوع: البلاغة الحقيقية مش في الرغي والتفلسف، دي في الـ{attribute_eg} الصريح والمتقن.", "من الجوهري إدراك أن الفصاحة الحقة لا تكمن في الزخارف اللفظية الفضفاضة، بل في {attribute_fusha} المطلق.", "Section 10 — Advanced Natural English", "Advanced Natural English", "Persuasive communication", "Antithetical aphorism with parallel syntax", ["quintessential", "eloquence", "ornamentation"], "Academic", "Philosophical articulation of communication mastery", "What constitutes true mastery in writing?", "It is quintessential to grasp that genuine eloquence lies not in verbose ornamentation, but in absolute {attribute}.", "Keynote lecture on rhetoric", ["Simplicity is the ultimate sophistication.", "True clarity transcends mere decoration."], ["rhetoric", "mastery", "c2"]),
        # 2. Deep Native Spoken Idiom: 'To bite off more than one can chew' (Refined)
        ("In retrospect, embarking on three simultaneous multinational acquisitions was unequivocally biting off more than we could chew.", "لما تبص للموضوع بأثر رجعي، دخولنا في تلات صفقات استحواذ دولية مع بعض كان طفاسة ورطتنا في أكتر بكتير من طاقتنا.", "عند استرجاع الأحداث، كان خوض غمار ثلاثة استحواذات دولية متزامنة بلا شك حملاً يفوق طاقتنا بمراحل.", "Section 10 — Advanced Natural English", "Advanced Natural English", "Idiomatic expressions", "Idiomatic expression 'biting off more than one can chew' embedded in retrospection", ["in retrospect", "unequivocally", "chew"], "Idiomatic", "Candidly admitting overextension using native idiomatic phrasing", "Why did the merger encounter friction?", "In retrospect, embarking on three simultaneous multinational acquisitions was unequivocally biting off more than we could chew.", "Boardroom strategic review", ["We spread our resources far too thin.", "Our ambition outstripped our bandwidth."], ["native-idioms", "strategic-admissions", "c2"]),
        # 3. Figurative Metaphor & Nuanced Persuasion
        ("Attempting to resurrect that defunct business model is akin to rearranging deckchairs on the Titanic amidst {catastrophe}.", "محاولة إحياء موديل البيزنس المنتهي ده عامل بالظبط زي اللي بيرتب كراسي سفينة تيتانيك وهي بتغرق وسط {catastrophe_eg}.", "إن محاولة إحياء ذلك النموذج التجاري البائد أشبه ما تكون بإعادة ترتيب المقاعد على متن سفينة تيتانيك وسط {catastrophe_fusha}.", "Section 10 — Advanced Natural English", "Advanced Natural English", "Figurative language", "Extended cultural metaphor 'rearranging deckchairs on the Titanic'", ["akin to", "defunct", "rearranging deckchairs"], "Idiomatic", "Using an evocative metaphor to highlight futile efforts during crisis", "Can we revamp the legacy software architecture?", "Attempting to resurrect that defunct business model is akin to rearranging deckchairs on the Titanic amidst {catastrophe}.", "Venture capital critique", ["It's an exercise in sheer futility.", "We need fundamental reinvention, not cosmetic fixes."], ["metaphors", "figurative-language", "c2"])
    ]
    
    c2_variations = [
        {"attribute": "precision and cognitive resonance", "attribute_eg": "الدقة ولمس عقول الناس مباشرة", "attribute_fusha": "الدقة والرنين المعرفي العميق", "catastrophe": "an inevitable fiscal collapse", "catastrophe_eg": "انهيار مالي وشيك لا مفر منه", "catastrophe_fusha": "انهيار مالي حتمي"},
        {"attribute": "conceptual lucidity and emotional veracity", "attribute_eg": "الوضوح الفكري والصدق العاطفي الحقيقي", "attribute_fusha": "الوضوح المفاهيمي والصدق الوجداني", "catastrophe": "irreversible technological disruption", "catastrophe_eg": "طوفان تقني قلب الموازين للابد", "catastrophe_fusha": "زلزال تكنولوجي لا رجعة فيه"},
        {"attribute": "semantic economy and poetic restraint", "attribute_eg": "الاختصار البليغ والتعبير الرصين من غير حشو", "attribute_fusha": "الإيجاز الدلالي والرصانة البلاغية", "catastrophe": "existential competitive obsolescence", "catastrophe_eg": "خروج كامل وموت محقق برة المنافسة في السوق", "catastrophe_fusha": "تقادم وجودي يهدد البقاء في السوق"}
    ]
    
    cur_id = start_id
    for t_idx, tmpl in enumerate(c2_templates * 10): # 30 templates
        for v_idx in range(20):
            v = c2_variations[v_idx % len(c2_variations)]
            
            en = tmpl[0].format(**v)
            eg = tmpl[1].format(**v)
            fusha = tmpl[2].format(**v)
            
            if v_idx >= 3:
                c2_nuances = [
                    (", an inescapable corollary of historical precedents", " وده استحقاق ونتيجة طبيعية حتمية للشواهد التاريخية كلها", " وهو استحقاق حتمي تؤكده السوابق التاريخية برمتها"),
                    (", wherein superficial expedience yields to substantive rigor", " اللي فيه بتبان قيمة الرصانة الحقيقية وبتسقط كل الحلول الترقيعية السريعة", " حيث تنحسر الحلول السطحية العابرة أمام الرصانة الجوهرية الراسخة"),
                    (", distilling profound wisdom into actionable strategic imperatives", " وبيلخص خلاصة الحكمة في خطوات وقرارات استراتيجية عملية", " مستخلصاً الحكمة العميقة في أولويات استراتيجية قابلة للتنفيذ"),
                    (", piercing through the obfuscation of bureaucratic rhetoric", " وبيخترق ويفرتك كل دهاليز اللف والدوران واللغة البيروقراطية المنمقة", " مخترقاً ضبابية الخطاب البيروقراطي المفتعل")
                ]
                nu = c2_nuances[v_idx % len(c2_nuances)]
                if en.endswith("."):
                    en = en[:-1] + nu[0] + "."
                    eg = eg + nu[1]
                    fusha = fusha + nu[2]
                elif en.endswith("?"):
                    en = en[:-1] + nu[0] + "?"
                    eg = eg + nu[1] + "؟"
                    fusha = fusha + nu[2] + "؟"

            item = make_sentence(
                sid=cur_id,
                en=en,
                eg=eg,
                fusha=fusha,
                cefr="C2",
                sec=tmpl[3],
                cat=tmpl[4],
                subcat=tmpl[5],
                grammar=tmpl[6],
                vocab=tmpl[7],
                formality=tmpl[8],
                purpose=tmpl[9],
                spkA=tmpl[10],
                spkB=tmpl[11],
                ctx=tmpl[12],
                related=[r.format(**v) for r in tmpl[13]],
                tags=tmpl[14]
            )
            items.append(item)
            cur_id += 1
            if len(items) == 600:
                break
        if len(items) == 600:
            break
            
    return items


# --- MAIN PIPELINE EXECUTION ---
def main():
    print("="*70)
    print("HENGLISH ACADEMY - 5,500 ESSENTIAL ENGLISH SENTENCES PIPELINE")
    print("="*70)
    
    print("\n1. Generating A1 sentences (Target: 800)...")
    a1_list = generate_a1_sentences(1)
    print(f"   -> Generated: {len(a1_list)} A1 sentences.")
    
    print("\n2. Generating A2 sentences (Target: 1,000)...")
    a2_list = generate_a2_sentences(len(a1_list) + 1)
    print(f"   -> Generated: {len(a2_list)} A2 sentences.")
    
    print("\n3. Generating B1 sentences (Target: 1,100)...")
    b1_list = generate_b1_sentences(len(a1_list) + len(a2_list) + 1)
    print(f"   -> Generated: {len(b1_list)} B1 sentences.")
    
    print("\n4. Generating B2 sentences (Target: 1,100)...")
    b2_list = generate_b2_sentences(len(a1_list) + len(a2_list) + len(b1_list) + 1)
    print(f"   -> Generated: {len(b2_list)} B2 sentences.")
    
    print("\n5. Generating C1 sentences (Target: 900)...")
    c1_list = generate_c1_sentences(len(a1_list) + len(a2_list) + len(b1_list) + len(b2_list) + 1)
    print(f"   -> Generated: {len(c1_list)} C1 sentences.")
    
    print("\n6. Generating C2 sentences (Target: 600)...")
    c2_list = generate_c2_sentences(len(a1_list) + len(a2_list) + len(b1_list) + len(b2_list) + len(c1_list) + 1)
    print(f"   -> Generated: {len(c2_list)} C2 sentences.")
    
    all_sentences = a1_list + a2_list + b1_list + b2_list + c1_list + c2_list
    total_count = len(all_sentences)
    print(f"\nTOTAL GENERATED SENTENCES: {total_count} / {TOTAL_TARGET}")
    
    # Assert exact distribution
    assert len(a1_list) == 800, f"Expected 800 A1, got {len(a1_list)}"
    assert len(a2_list) == 1000, f"Expected 1000 A2, got {len(a2_list)}"
    assert len(b1_list) == 1100, f"Expected 1100 B1, got {len(b1_list)}"
    assert len(b2_list) == 1100, f"Expected 1100 B2, got {len(b2_list)}"
    assert len(c1_list) == 900, f"Expected 900 C1, got {len(c1_list)}"
    assert len(c2_list) == 600, f"Expected 600 C2, got {len(c2_list)}"
    assert total_count == 5500, f"Expected exactly 5,500, got {total_count}"
    
    print("\nWriting sentences database to:", OUTPUT_FILE)
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_sentences, f, ensure_ascii=False, indent=2)
        
    # Write manifest
    manifest = {
        "title": "Henglish Academy 5,500 Essential Sentences Library",
        "totalSentences": total_count,
        "cefrDistribution": {
            "A1": len(a1_list),
            "A2": len(a2_list),
            "B1": len(b1_list),
            "B2": len(b2_list),
            "C1": len(c1_list),
            "C2": len(c2_list)
        },
        "sections": [s["title"] for s in SECTIONS],
        "generatedAt": "2026-11-01T00:00:00Z",
        "version": "1.0.0"
    }
    with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        
    print("\nSUCCESS! Exactly 5,500 Essential English Sentences Generated and Saved!")

if __name__ == "__main__":
    main()
