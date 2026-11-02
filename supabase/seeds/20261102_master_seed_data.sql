--
-- Henglish Academy (HENGLISH) - MASTER EDUCATIONAL SEED DATA
-- Generated for Supabase Production Database
-- File: supabase/seeds/20261102_master_seed_data.sql
--
BEGIN;

-- 1. COURSES SEED
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('future-perfect', 'Master the Future Perfect Tense', 'المستقبل التام الشامل (Future Perfect Masterclass)', 'Master the Future Perfect Tense', 'كورس ماستر كلاس المستقبل التام المدمج بأكاديمية الجرامر: من الصفر وحتى الاحتراف مع ٨ دروس تفاعلية، خطوط زمنية، كويزات، ألعاب، ومحادثات واقعية.', 'كورس ماستر كلاس المستقبل التام المدمج بأكاديمية الجرامر: من الصفر وحتى الاحتراف مع ٨ دروس تفاعلية، خطوط زمنية، كويزات، ألعاب، ومحادثات واقعية.', 'شامل', 'core', 8, 'ساعتان و٤٥ دقيقة', 4.95, 3840, TRUE, 'أكاديمية الجرامر • المستقبل التام 👑', '⚡', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('present-perfect', 'Present Perfect in Real Life', 'المضارع التام وعلاقته بالحاضر', 'Present Perfect in Real Life', 'افهم الفرق بين الماضي البسيط والمضارع التام بدون تعقيد، مع حالات since وfor وjust وalready.', 'افهم الفرق بين الماضي البسيط والمضارع التام بدون تعقيد، مع حالات since وfor وjust وalready.', 'متوسط', 'core', 6, 'ساعتان', 4.88, 2950, FALSE, 'قواعد حيوية', '🎯', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('conditionals', 'Master All 4 Conditionals', 'قواعد لو والشرط (Zero to 3rd Conditionals)', 'Master All 4 Conditionals', 'دليلك المبسط لحالات If الأربعة، والشرط المختلط (Mixed Conditionals) مع أمثلة حية.', 'دليلك المبسط لحالات If الأربعة، والشرط المختلط (Mixed Conditionals) مع أمثلة حية.', 'متوسط', 'core', 5, 'ساعة ونصف', 4.91, 1820, FALSE, 'قواعد متقدمة', '🔮', 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('tech-english', 'English for Software Engineers', 'الإنجليزية للمبرمجين ومهندسي البرمجيات', 'English for Software Engineers', 'مصطلحات الـ Pull Requests، اجتماعات الـ Daily Standup، نقاشات التصميم المعماري، وكتابة الـ Documentation.', 'مصطلحات الـ Pull Requests، اجتماعات الـ Daily Standup، نقاشات التصميم المعماري، وكتابة الـ Documentation.', 'متقدم', 'core', 10, '٣ ساعات', 4.98, 4210, FALSE, 'مهني وتقني', '💻', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('business-writing', 'Professional Business Correspondence', 'المراسلات المهنية والإيميلات الرسمية', 'Professional Business Correspondence', 'كيف تكتب إيميلات واضحة، مهذبة، ومؤثرة لمديرك، عميلك، أو شركات أجنبية.', 'كيف تكتب إيميلات واضحة، مهذبة، ومؤثرة لمديرك، عميلك، أو شركات أجنبية.', 'متوسط', 'core', 6, 'ساعتان', 4.85, 2100, FALSE, 'بيئة العمل', '✉️', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('ielts-speaking', 'IELTS Speaking & Natural Fluency', 'أسرار الطلاقة ومحادثات الآيلتس (Band 7.5+)', 'IELTS Speaking & Natural Fluency', 'تطوير سرعة التفكير بالإنجليزي، ربط الأفكار، والتحدث التلقائي دون توقف أو تردد.', 'تطوير سرعة التفكير بالإنجليزي، ربط الأفكار، والتحدث التلقائي دون توقف أو تردد.', 'متقدم', 'core', 12, '٤ ساعات', 4.96, 3150, FALSE, 'شهادات دولية', '🎙️', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;

-- 2. GAMEVERSE DEFINITIONS SEED
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('vocab-rush', 'Vocabulary Rush', 'سباق المفردات السريع ⚡', 'اختر المعنى العربي الدقيق للكلمة الإنجليزية الإنجليزية قبل انتهاء العداد الزمني السريع.', 'اختر المعنى العربي الدقيق للكلمة الإنجليزية الإنجليزية قبل انتهاء العداد الزمني السريع.', 'vocabulary', 'beginner', 35, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('word-detective', 'Word Detective', 'المحقق اللغوي 🕵️', 'اكتشف الكلمة الإنجليزية السرية من خلال 3 ألغاز وتلميحات سياقية ذكية.', 'اكتشف الكلمة الإنجليزية السرية من خلال 3 ألغاز وتلميحات سياقية ذكية.', 'vocabulary', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('synonym-hunter', 'Synonym Arena', 'معركة المترادفات 🏹', 'اصطد المترادف الأكثر دقة للكلمة المطلوبة ضمن سياقات متقدمة ومتنوعة.', 'اصطد المترادف الأكثر دقة للكلمة المطلوبة ضمن سياقات متقدمة ومتنوعة.', 'vocabulary', 'intermediate', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('antonym-arena', 'Antonym Arena', 'حلبة الأضداد والمعكوسات ⚖️', 'اختر الكلمة المعاكسة تماماً في المعنى بسرعة تحت ضغط التوقيت المتصاعد.', 'اختر الكلمة المعاكسة تماماً في المعنى بسرعة تحت ضغط التوقيت المتصاعد.', 'vocabulary', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('word-association', 'Word Association', 'الروابط الذهنية والدلالية 🔗', 'اربط الكلمات التي تنتمي لنفس المجال الدلالي واكتشف الكلمة الشاذة أو المرتبطة.', 'اربط الكلمات التي تنتمي لنفس المجال الدلالي واكتشف الكلمة الشاذة أو المرتبطة.', 'vocabulary', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('context-master', 'Context Master', 'سيد السياق والمواقف 🎭', 'اختر الكلمة الأدق لملء الفراغ داخل فقرات وسياقات مهنية وأكاديمية حقيقية.', 'اختر الكلمة الأدق لملء الفراغ داخل فقرات وسياقات مهنية وأكاديمية حقيقية.', 'vocabulary', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('phrasal-quest', 'Phrasal Verb Quest', 'متاهة الأفعال المركبة 🧭', 'طابق الفعل مع حرف الجر المناسب واكتشف التغير الكامل في المعنى الدلالي.', 'طابق الفعل مع حرف الجر المناسب واكتشف التغير الكامل في المعنى الدلالي.', 'vocabulary', 'intermediate', 50, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('idiom-explorer', 'Idiom Explorer', 'مستكشف الأمثال والتعبيرات 🔮', 'فك شفرة المعاني الحقيقية وراء التعبيرات الشعبية والمجازية الشائعة كـ "Bite the bullet".', 'فك شفرة المعاني الحقيقية وراء التعبيرات الشعبية والمجازية الشائعة كـ "Bite the bullet".', 'vocabulary', 'intermediate', 50, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('word-formation', 'Word Formation Lab', 'معمل اشتقاق الكلمات 🧪', 'حوّل جذر الكلمة بإضافة السوابق (Prefixes) واللواحق (Suffixes) لاسم أو صفة أو ظرف.', 'حوّل جذر الكلمة بإضافة السوابق (Prefixes) واللواحق (Suffixes) لاسم أو صفة أو ظرف.', 'vocabulary', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('collocation-challenge', 'Collocation Challenge', 'تحدي المتلازمات اللفظية 🤝', 'اختر الكلمات المتلازمة طبيعياً في لغة أهل اللغة (مثل: make a decision وليس do).', 'اختر الكلمات المتلازمة طبيعياً في لغة أهل اللغة (مثل: make a decision وليس do).', 'vocabulary', 'intermediate', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('sentence-builder', 'Sentence Builder', 'معمل تركيب الجمل 🧩', 'رتّب الكلمات المبعثرة بالترتيب النحوي والسياقي الصحيح لبناء جمل احترافية.', 'رتّب الكلمات المبعثرة بالترتيب النحوي والسياقي الصحيح لبناء جمل احترافية.', 'grammar', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('error-hunter', 'Error Hunter', 'صائد الأخطاء القواعدية 🎯', 'افحص الجمل بدقة خبير لغوي لاكتشاف الأخطاء القواعدية الدفينة وصوبها فوراً.', 'افحص الجمل بدقة خبير لغوي لاكتشاف الأخطاء القواعدية الدفينة وصوبها فوراً.', 'grammar', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('v3-blitz', 'V3 Irregular Verbs Blitz', 'سباق التصريف الثالث V3 ⚡', 'اختر التصريف الثالث (V3) الصحيح للأفعال الشاذة بأقصى سرعة خلال 25 ثانية.', 'اختر التصريف الثالث (V3) الصحيح للأفعال الشاذة بأقصى سرعة خلال 25 ثانية.', 'grammar', 'beginner', 35, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('grammar-tower', 'Grammar Tower', 'برج القواعد المتصاعد 🏰', 'اصعد طوابق البرج بإجابات نحوية صحيحة متتالية؛ أي خطأ قد يكلفك السقوط طابقاً للأسفل!', 'اصعد طوابق البرج بإجابات نحوية صحيحة متتالية؛ أي خطأ قد يكلفك السقوط طابقاً للأسفل!', 'grammar', 'beginner', 60, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('tense-switch', 'Tense Switch', 'محوّل الأزمنة القواعدية ⏳', 'حوّل الجملة بين الأزمنة (المضارع، الماضي، المستقبل التام) مع الحفاظ على القواعد السليمة.', 'حوّل الجملة بين الأزمنة (المضارع، الماضي، المستقبل التام) مع الحفاظ على القواعد السليمة.', 'grammar', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('passive-converter', 'Passive Voice Converter', 'محول المبني للمجهول 🔄', 'رتّب عناصر الجملة لتحويلها من المبني للمعلوم (Active) للمبني للمجهول (Passive).', 'رتّب عناصر الجملة لتحويلها من المبني للمعلوم (Active) للمبني للمجهول (Passive).', 'grammar', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('conditional-architect', 'Conditional Architect', 'مهندس الجمل الشرطية 🏗️', 'ابنِ حالات If الشرطية (Zero, 1st, 2nd, 3rd Conditionals) وطابق جملة الشرط وجوابه بدقة.', 'ابنِ حالات If الشرطية (Zero, 1st, 2nd, 3rd Conditionals) وطابق جملة الشرط وجوابه بدقة.', 'grammar', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('grammar-detective', 'Grammar Detective', 'محقق أجزاء الكلام والأفخاخ 🔍', 'حدد الوظيفة النحوية للكلمات واكتشف الأفخاخ الشائعة في حروف الجر وتوافق الفعل والفاعل.', 'حدد الوظيفة النحوية للكلمات واكتشف الأفخاخ الشائعة في حروف الجر وتوافق الفعل والفاعل.', 'grammar', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('spelling-bee', 'Spelling Bee Challenge', 'تحدي التهجئة والإملاء 🐝', 'استمع للنطق الصوتي واكتب حروف الكلمة الصحيحة بدقة وتجاوز الحروف الصامتة والأفخاخ.', 'استمع للنطق الصوتي واكتب حروف الكلمة الصحيحة بدقة وتجاوز الحروف الصامتة والأفخاخ.', 'vocabulary', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('pronunciation-arena', 'Pronunciation Arena', 'ساحة الرموز الصوتية IPA 🗣️', 'اربط الكلمات برموزها الصوتية الدولية (IPA) واكتشف طريقة النطق المعتمدة عالمياً.', 'اربط الكلمات برموزها الصوتية الدولية (IPA) واكتشف طريقة النطق المعتمدة عالمياً.', 'vocabulary', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('minimal-pairs', 'Minimal Pairs Challenge', 'تحدي الأزواج الصوتية الدقيقة 🎧', 'استمع وفرّق بين الأصوات المتقاربة جداً التي تحيّر المتعلمين مثل /p/ vs /b/ أو ship vs sheep.', 'استمع وفرّق بين الأصوات المتقاربة جداً التي تحيّر المتعلمين مثل /p/ vs /b/ أو ship vs sheep.', 'vocabulary', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('stress-detective', 'Stress Detective', 'محقق نبرة المقاطع الصوتية 🎵', 'حدد المقطع المشدد (Primary Syllable Stress) في الكلمات الإنجليزية الشائعة والمتشابهة.', 'حدد المقطع المشدد (Primary Syllable Stress) في الكلمات الإنجليزية الشائعة والمتشابهة.', 'vocabulary', 'intermediate', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('phoneme-match', 'Phoneme Match', 'مطابقة الفونيمات والأصوات 🔤', 'طابق الأصوات المتحركة والساكنة مع الحروف التي تمثلها في التهجئة الإنجليزية.', 'طابق الأصوات المتحركة والساكنة مع الحروف التي تمثلها في التهجئة الإنجليزية.', 'vocabulary', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('listening-detective', 'Listening Detective', 'محقق الاستماع الصوتي 🕵️‍♂️', 'استمع لمقطع صوتي وأجب عن أسئلة الفهم والاستنتاج للتفاصيل الدقيقة.', 'استمع لمقطع صوتي وأجب عن أسئلة الفهم والاستنتاج للتفاصيل الدقيقة.', 'listening', 'beginner', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('dictation-challenge', 'Dictation Challenge', 'تحدي الإملاء السمعي المباشر 🎙️', 'استمع للجملة المنطوقة كاملة واكتبها بدقة مع تصحيح ذكي يقيس نسبة التطابق.', 'استمع للجملة المنطوقة كاملة واكتبها بدقة مع تصحيح ذكي يقيس نسبة التطابق.', 'listening', 'intermediate', 50, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('listening-gap-fill', 'Listening Gap Fill', 'إكمال الفراغات السمعية 📝', 'استمع للتسجيل واكتشف الكلمة المحذوفة من النص واكتبها بالتهجئة الصحيحة.', 'استمع للتسجيل واكتشف الكلمة المحذوفة من النص واكتبها بالتهجئة الصحيحة.', 'listening', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('accent-detective', 'Accent Detective', 'محقق اللهجات الأمريكية والبريطانية 🌍', 'ميّز بين النطق الأمريكي والنطق البريطاني ومفردات اللهجتين (مثل flat vs apartment).', 'ميّز بين النطق الأمريكي والنطق البريطاني ومفردات اللهجتين (مثل flat vs apartment).', 'listening', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('reading-speedster', 'Reading Speedster', 'محقق القراءة السريعة 📖', 'اقرأ فقرة سريعة تحت مؤقت، ثم أجب عن أسئلة الفهم بعد إخفاء النص لاختبار الذاكرة والاستيعاب.', 'اقرأ فقرة سريعة تحت مؤقت، ثم أجب عن أسئلة الفهم بعد إخفاء النص لاختبار الذاكرة والاستيعاب.', 'interactive', 'intermediate', 50, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('paragraph-builder', 'Paragraph Builder', 'معمار الفقرات والمقالات 📑', 'أعد ترتيب الجمل المبعثرة لبناء فقرة منطقية متماسكة ومترابطة الأفكار.', 'أعد ترتيب الجمل المبعثرة لبناء فقرة منطقية متماسكة ومترابطة الأفكار.', 'interactive', 'intermediate', 50, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('story-completion', 'Story Completion', 'إكمال القصة التفاعلية 🧭', 'عش قصة تفاعلية متعددة المسارات واختر القرار اللغوي السليم للمضي قدماً في الأحداث.', 'عش قصة تفاعلية متعددة المسارات واختر القرار اللغوي السليم للمضي قدماً في الأحداث.', 'interactive', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('ai-duel', 'AI Opponent Duel', 'مبارزة الذكاء الاصطناعي ⚔️', 'ادخل في مواجهة مباشرة وسريعة ضد روبوتات ذكية بمستويات صعوبة متنوعة.', 'ادخل في مواجهة مباشرة وسريعة ضد روبوتات ذكية بمستويات صعوبة متنوعة.', 'speed_trivia', 'beginner', 60, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('flashcards', 'Flashcard Deck', 'بطاقات التكرار المتباعد 🃏', 'راجع الكلمات وحفظها في الذاكرة طويلة المدى باستخدام تقنية التكرار المتباعد (SRS).', 'راجع الكلمات وحفظها في الذاكرة طويلة المدى باستخدام تقنية التكرار المتباعد (SRS).', 'vocabulary', 'beginner', 30, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;

-- 3. VIDEO CATEGORIES SEED
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('movie_scenes', 'Movie Scenes', 'مشاهد سينمائية شهيرة', 'أقوى الحوارات السينمائية من هوليوود مع النطق واللهجات الواقعية', 'Film', 0)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('tv_series', 'TV Series', 'مسلسلات درامية وتلفزيونية', 'مشاهد من أشهر المسلسلات العالمية لتطوير الحصيلة اليومية', 'Tv', 1)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('sitcoms', 'Sitcoms & Comedy', 'مسلسلات كوميدية (Sitcoms)', 'الكوميديا والمفارقات الحوارية (Friends, The Office, Modern Family)', 'Smile', 2)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('interviews', 'Interviews & Talks', 'مقابلات وحوارات حصرية', 'لقاءات المشاهير والخبراء وأصحاب الإنجازات', 'Mic', 3)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('daily_conversations', 'Daily Conversations', 'حوارات ومحادثات يومية', 'مواقف الحياة اليومية في السوق، المطعم، والمواصلات', 'MessageCircle', 4)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('street_interviews', 'Street Interviews', 'لقاءات الشارع الحقيقية', 'حوارات عفوية مع متحدثين أصليين في شوارع لندن ونيويورك', 'Users', 5)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('podcasts', 'Podcasts', 'بودكاست بالإنجليزية', 'مقاطع صوتية وبصرية غنية بالأفكار والمفردات الدقيقة', 'Headphones', 6)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('ted_talks', 'TED Talks', 'أحاديث تيد الملهمة (TED Talks)', 'خطابات ملهمة وأفكار تغير العالم بلغة بليغة وواضحة', 'Sparkles', 7)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('documentaries', 'Documentaries', 'أفلام وثائقية واستكشافية', 'علوم، طبيعة، وتاريخ بلغة فصحى ونطق مدروس', 'Globe', 8)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('business_english', 'Business English', 'الإنجليزية المهنية والشركات', 'بيئة العمل، الاجتماعات، العروض التقديمية، والتفاوض', 'Briefcase', 9)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('travel_english', 'Travel English', 'إنجليزية السفر والمطارات', 'حجوزات الطيران، الفنادق، طلب المساعدة، والتجوال', 'Plane', 10)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('academic_english', 'Academic English', 'الإنجليزية الأكاديمية والجامعية', 'محاضرات ومصطلحات بحثية للجامعات واختبارات الآيلتس والترجمة', 'GraduationCap', 11)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('job_interviews', 'Job Interviews', 'مقابلات التوظيف (Job Interviews)', 'كيف تجيب بثقة وذكاء على أسئلة المقابلات الشخصية بالإنجليزية', 'Award', 12)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('american_english', 'American English', 'الإنجليزية واللكنة الأمريكية 🇺🇸', 'النطق الأمريكي الأصيل، الربط الصوتي، والتعابير المنتشرة', 'Compass', 13)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('british_english', 'British English', 'الإنجليزية واللكنة البريطانية 🇬🇧', 'النطق البريطاني القياسي، نغمات الصوت، ومفردات المملكة المتحدة', 'Compass', 14)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('pronunciation_practice', 'Pronunciation Practice', 'تدريبات النطق الصوتي (Phonetics)', 'مخارج الحروف الصعبة، الربط الصوتي، والرموز الصوتية IPA', 'Volume2', 15)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('slang_and_expressions', 'Slang and Expressions', 'المصطلحات الشعبية والعامية', 'الإيديومات الشائعة وما يتحدث به الشباب في الشارع', 'Flame', 16)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('english_for_beginners', 'English for Beginners', 'إنجليزية المبتدئين (A1 - A2)', 'مقاطع بطيئة وواضحة بجمل بسيطة لبناء الثقة والأساس', 'BookOpen', 17)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('advanced_english', 'Advanced English', 'المستوى المتقدم والطلاقة (C1 - C2)', 'تراكيب بلاغية معقدة، فكاهة ذكية، وسرعة نطق عالية', 'Zap', 18)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('listening_comprehension', 'Listening Comprehension', 'اختبارات وفهم الاستماع', 'تمارين وتحديات فك شفرة الكلام السريع وأسئلة الفهم', 'Ear', 19)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;

-- 4. GRAMMAR TOPICS SEED
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('present-simple', 'Present Simple Tense', NULL, 'أزمنة المضارع', NULL, NULL, NULL, '[{"en":"She manages an engineering team at a multinational software company.","ar":"هي تدير فريقاً هندسياً في شركة برمجيات متعددة الجنسيات.","highlight":"manages","context":"وظيفة وحالة دائمة"},{"en":"The morning train to Alexandria leaves daily at 7:30 AM sharp.","ar":"قطار الصباح إلى الإسكندرية يغادر يومياً في تمام الساعة 7:30 صباحاً.","highlight":"leaves","context":"جدول مواعيد رسمي ثابت"},{"en":"Water boils at 100 degrees Celsius under standard atmospheric pressure.","ar":"يغلي الماء عند 100 درجة مئوية تحت الضغط الجوي المعتاد.","highlight":"boils","context":"حقيقة علمية ثابتة"}]'::jsonb, '[]'::jsonb, 'A1 - مبتدئ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('present-continuous', 'Present Continuous Tense', NULL, 'أزمنة المضارع', NULL, NULL, NULL, '[{"en":"The developers are testing the new payment gateway right now.","ar":"المطورون يختبرون بوابة الدفع الجديدة في هذه اللحظة بالضبط.","highlight":"are testing","context":"حدث يقع الآن مباشرة"},{"en":"Omar is staying at his uncle''s apartment this week until his renovation finishes.","ar":"عمر يقيم في شقة عمه هذا الأسبوع مؤقتاً حتى ينتهي تشطيب شقته.","highlight":"is staying","context":"وضع مؤقت خلال هذا الأسبوع"},{"en":"We are flying to Dubai next Tuesday; the tickets and hotel are already booked.","ar":"نحن مسافرون جواً إلى دبي الثلاثاء القادم، التذاكر والفندق محجوزة بالفعل.","highlight":"are flying","context":"ترتيب مستقبلي محجوز ومؤكد"}]'::jsonb, '[]'::jsonb, 'A1 - مبتدئ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('present-perfect', 'Present Perfect Simple', NULL, 'أزمنة المضارع', NULL, NULL, NULL, '[{"en":"I have lost my passport, so I cannot board the international flight.","ar":"لقد فقدت جواز سفري، ولذلك لا يمكنني الصعود إلى الطائرة الدولية الآن.","highlight":"have lost","context":"فعل ماضٍ أثره مباشر في الحاضر"},{"en":"Has Karim ever worked with international distributed remote teams?","ar":"هل سبق لكريم على الإطلاق العمل مع فرق عمل دولية موزعة عن بعد؟","highlight":"Has Karim ever worked","context":"سؤال عن رصيد الخبرات الحياتية"},{"en":"They have lived in Alexandria since they graduated in 2018.","ar":"هم يعيشون في الإسكندرية منذ تخرجهم في عام 2018.","highlight":"have lived","context":"حدث بدأ في الماضي ومستمر حتى الآن"}]'::jsonb, '[]'::jsonb, 'A2 - تأسيسي')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('present-perfect-continuous', 'Present Perfect Continuous', NULL, 'أزمنة المضارع', NULL, NULL, NULL, '[{"en":"The data science team has been analyzing customer logs since 6 AM.","ar":"فريق علوم البيانات يعكف على تحليل سجلات العملاء باستمرار منذ الساعة السادسة صباحاً.","highlight":"has been analyzing","context":"تركيز على استمرار التحليل والجهد"},{"en":"Why are your hands covered in paint? — I have been painting the studio walls.","ar":"لماذا يداك مغطاة بالطلاء؟ — لأنني كنت أقوم بطلاء جدران الأستوديو طوال الوقت.","highlight":"have been painting","context":"أثر جسدي مباشر لفعل استمر لفترة"}]'::jsonb, '[]'::jsonb, 'B1 - متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('past-simple', 'Past Simple Tense', NULL, 'أزمنة الماضي', NULL, NULL, NULL, '[{"en":"The company launched its revolutionary AI product three weeks ago.","ar":"أطلقت الشركة منتج الذكاء الاصطناعي الثوري قبل ثلاثة أسابيع.","highlight":"launched","context":"حدث ماضٍ مكتمل مع وقت محدد (three weeks ago)"},{"en":"Mona woke up, made a fresh cup of coffee, and walked to her morning seminar.","ar":"استيقظت منى، وأعدت كوباً طازجاً من القهوة، ثم مشت إلى ندوتها الصباحية.","highlight":"woke up, made, walked","context":"سلسلة أحداث متتابعة في الماضي"}]'::jsonb, '[]'::jsonb, 'A1 - مبتدئ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('past-continuous', 'Past Continuous Tense', NULL, 'أزمنة الماضي', NULL, NULL, NULL, '[{"en":"While Karim was debugging the server scripts, the electricity suddenly went out.","ar":"بينما كان كريم يقوم بإصلاح أكواد الخادم، انقطعت الكهرباء فجأة.","highlight":"was debugging / went out","context":"حدث طويل مستمر قطعه حدث مفاجئ"},{"en":"At 10:30 PM last night, I was reviewing the quarterly financial statements.","ar":"في تمام الساعة 10:30 مساء أمس، كنت أراجع القوائم المالية الربع سنوية.","highlight":"was reviewing","context":"حدث كان جارياً في توقيت ماضٍ محدد بدقة"}]'::jsonb, '[]'::jsonb, 'A2 - تأسيسي')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('past-perfect', 'Past Perfect Simple', NULL, 'أزمنة الماضي', NULL, NULL, NULL, '[{"en":"By the time the ambulance arrived at the scene, the doctor had already stabilized the patient.","ar":"بحلول وقت وصول سيارة الإسعاف إلى الموقع، كان الطبيب قد استقر بحالة المريض بالفعل.","highlight":"had already stabilized / arrived","context":"علاج المريض تم أولاً (had stabilized) ثم وصلت الإسعاف ثانياً (arrived)"},{"en":"Laila couldn''t enter the building because she had forgotten her access card at home.","ar":"لم تتمكن ليلى من دخول المبنى لأنها كانت قد نسيت بطاقة الدخول في منزلها مسبقاً.","highlight":"had forgotten / couldn''t enter","context":"نسيان البطاقة حدث أولاً فترتب عليه منع الدخول ثانياً"}]'::jsonb, '[]'::jsonb, 'B1 - متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('past-perfect-continuous', 'Past Perfect Continuous', NULL, 'أزمنة الماضي', NULL, NULL, NULL, '[{"en":"The engineers had been inspecting the bridge for five hours before they detected the structural crack.","ar":"كان المهندسون يفحصون الجسر بصورة مستمرة لمدة خمس ساعات قبل أن يكتشفوا الشرخ الإنشائي.","highlight":"had been inspecting","context":"استمرار الفحص لخمس ساعات قبل الاكتشاف"}]'::jsonb, '[]'::jsonb, 'B2 - فوق متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('future-simple', 'Future Simple (Will)', NULL, 'أزمنة المستقبل', NULL, NULL, NULL, '[{"en":"The phone is ringing. — Don''t worry, I will answer it.","ar":"الهاتف يرن. — لا تقلق، سأرد أنا عليه فوراً.","highlight":"will answer","context":"قرار لحظي سريع"},{"en":"I promise I will never reveal your secret to anyone.","ar":"أعدك بأنني لن أفشي سرك لأي شخص أبداً.","highlight":"will never reveal","context":"وعد مؤكد"}]'::jsonb, '[]'::jsonb, 'A2 - تأسيسي')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('be-going-to', 'Be Going To', NULL, 'أزمنة المستقبل', NULL, NULL, NULL, '[{"en":"Look at those dark clouds! It is going to rain very soon.","ar":"انظر إلى تلك الغيوم الداكنة! إنها على وشك أن تمطر قريباً جداً.","highlight":"is going to rain","context":"تنبؤ قائم على دليل مرئي حسي"},{"en":"We have saved enough capital; we are going to launch our e-commerce store next month.","ar":"لقد ادخرنا رأس مال كافياً؛ وسنطلق متجرنا الإلكتروني الشهر القادم.","highlight":"are going to launch","context":"خطة عمل مدروسة مسبقاً"}]'::jsonb, '[]'::jsonb, 'A2 - تأسيسي')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('future-continuous', 'Future Continuous Tense', NULL, 'أزمنة المستقبل', NULL, NULL, NULL, '[{"en":"This time tomorrow, we will be flying over the Atlantic Ocean on our way to Toronto.","ar":"في مثل هذا الوقت غداً، سنكون محلقين فوق المحيط الأطلسي في طريقنا إلى تورونتو.","highlight":"will be flying","context":"حدث سيكون قيد الحدوث والاستمرار غداً في نفس اللحظة"}]'::jsonb, '[]'::jsonb, 'B1 - متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('future-perfect', 'Future Perfect Tense (Masterclass Core)', NULL, 'أزمنة المستقبل', NULL, NULL, NULL, '[{"en":"By next December, the architectural firm will have completed the new high-speed rail terminal.","ar":"بحلول شهر ديسمبر القادم، ستكون الشركة المعمارية قد أتمت محطة القطار فائق السرعة الجديدة.","highlight":"will have completed","context":"موعد مستقبلي محدد يكتمل قبله الفعل"},{"en":"By the time you finish your presentation, we will have prepared the partnership contract.","ar":"على بال ما تخلص عرضك التقديمي، هنكون جهزنا عقد الشراكة بالكامل.","highlight":"will have prepared","context":"ربط بين جملتين"}]'::jsonb, '[]'::jsonb, 'B2 - فوق متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('future-perfect-continuous', 'Future Perfect Continuous', NULL, 'أزمنة المستقبل', NULL, NULL, NULL, '[{"en":"By this November, engineer Tarek will have been working at Henglish for ten full years.","ar":"بحلول شهر نوفمبر القادم، سيكون المهندس طارق قد أمضى عشر سنوات كاملة في العمل لدى هناوي.","highlight":"will have been working","context":"التركيز على طول فترة الخدمة والعمل المستمر"}]'::jsonb, '[]'::jsonb, 'B2 - فوق متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('zero-conditional', 'Zero Conditional', NULL, 'مواضيع وقواعد أخرى', NULL, NULL, NULL, '[{"en":"If you expose ice to high heat, it melts immediately.","ar":"إذا عرضت الجليد لحرارة مرتفعة، فإنه يذوب فوراً.","highlight":"expose / melts","context":"حقيقة فيزيائية علمية ثابتة"}]'::jsonb, '[]'::jsonb, 'A2 - تأسيسي')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('first-conditional', 'First Conditional', NULL, 'مواضيع وقواعد أخرى', NULL, NULL, NULL, '[{"en":"If the software team deploys the hotfix tonight, the servers will run smoothly tomorrow.","ar":"إذا أطلق فريق البرمجيات التحديث العاجل الليلة، ستعمل الخوادم بسلاسة غداً.","highlight":"deploys / will run","context":"احتمال واقعي وممكن جداً"}]'::jsonb, '[]'::jsonb, 'B1 - متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('second-conditional', 'Second Conditional', NULL, 'مواضيع وقواعد أخرى', NULL, NULL, NULL, '[{"en":"If Karim spoke fluent German, he would apply for the engineering fellowship in Munich.","ar":"لو كان كريم يتحدث الألمانية بطلاقة، لكان قد تقدم لمنحة الهندسة في ميونيخ (لكنه لا يتحدثها حالياً).","highlight":"spoke / would apply","context":"افتراض غير واقعي في الحاضر"},{"en":"If I were you, I would accept the job offer in Dubai immediately.","ar":"لو كنت مكانك، لوافقت على عرض العمل في دبي على الفور.","highlight":"were / would accept","context":"نصيحة ودية"}]'::jsonb, '[]'::jsonb, 'B1 - متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('third-conditional', 'Third Conditional', NULL, 'مواضيع وقواعد أخرى', NULL, NULL, NULL, '[{"en":"If we had booked the airline tickets earlier, we would have saved hundreds of dollars.","ar":"لو كنا حجزنا تذاكر الطيران مبكراً، لكنا وفرنا مئات الدولارات (لكننا تأخرنا وندمنا).","highlight":"had booked / would have saved","context":"ندم تام على فرصة ضائعة في الماضي"}]'::jsonb, '[]'::jsonb, 'B2 - فوق متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('modal-verbs', 'Modal Verbs (Must, Should, Could, Might)', NULL, 'مواضيع وقواعد أخرى', NULL, NULL, NULL, '[{"en":"You must sign the non-disclosure agreement before accessing confidential client data.","ar":"يجب عليك توقيع اتفاقية عدم الإفصاح قبل الاطلاع على بيانات العملاء السرية.","highlight":"must sign","context":"إلزام قانوني وأمني صارم"},{"en":"His office lights are still on and his laptop is open; he must be working on the urgent proposal.","ar":"أضواء مكتبه لا تزال مضاءة وحاسوبه مفتوح؛ لا بد وأنه يعمل على المقترح العاجل بالتأكيد.","highlight":"must be working","context":"استنتاج منطقي قوي مبني على دليل مرئي"}]'::jsonb, '[]'::jsonb, 'B1 - متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('passive-voice', 'Passive Voice Across All Tenses', NULL, 'مواضيع وقواعد أخرى', NULL, NULL, NULL, '[{"en":"The security vulnerability was patched by the cybersecurity team within two hours.","ar":"تمت معالجة الثغرة الأمنية وسدها من قبل فريق الأمن السيبراني في غضون ساعتين.","highlight":"was patched","context":"مبني للمجهول في الماضي البسيط (Past Simple Passive)"},{"en":"By 2030, all official municipal documents will have been digitized across the city.","ar":"بحلول عام 2030، ستكون جميع الوثائق البلدية الرسمية قد تم تحويلها رقمياً بالكامل في أنحاء المدينة.","highlight":"will have been digitized","context":"مبني للمجهول في المستقبل التام (Future Perfect Passive)"}]'::jsonb, '[]'::jsonb, 'B2 - فوق متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('reported-speech', 'Reported Speech (Direct to Indirect)', NULL, 'مواضيع وقواعد أخرى', NULL, NULL, NULL, '[{"en":"\"I will deliver the design files by 5 PM,\" Omar said. ➔ Omar said that he would deliver the design files by 5 PM.","ar":"عمر قال إنه سيسلم ملفات التصميم بحلول الساعة الخامسة مساءً.","highlight":"would deliver","context":"تحويل will إلى would في الكلام المنقول"}]'::jsonb, '[]'::jsonb, 'B2 - فوق متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('relative-clauses', 'Relative Clauses (Who, Which, That, Whose, Where)', NULL, 'مواضيع وقواعد أخرى', NULL, NULL, NULL, '[{"en":"The software engineer who designed our security architecture won the global developer award.","ar":"مهندس البرمجيات الذي صمم بنيتنا الأمنية فاز بجائزة المطورين العالمية.","highlight":"who designed","context":"ضمير وصل للعاقل يحدد الشخص بدقة"}]'::jsonb, '[]'::jsonb, 'B1 - متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('parts-of-speech', 'The 8 Parts of Speech & Sentence Anatomy', NULL, 'الأساسيات والتركيب اللغوي', NULL, NULL, NULL, '[{"en":"The diligent developer rapidly resolved the critical database error.","ar":"قام المطور المجتهد بحل خطأ قاعدة البيانات الحرج بسرعة فائقة.","highlight":"diligent ... rapidly resolved","context":"تطبيق عملي: صفة + فاعل + ظرف + فعل ماضٍ + مفعول"}]'::jsonb, '[]'::jsonb, 'A1 - مبتدئ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('articles-determiners', 'Articles (A, An, The) & Quantifiers', NULL, 'الأساسيات والتركيب اللغوي', NULL, NULL, NULL, '[{"en":"She earned a master’s degree from an accredited university in London.","ar":"حصلت على درجة الماجستير من جامعة معتمدة في لندن.","highlight":"a master’s ... an accredited","context":"استخدام a و an بدقة بحسب الصوت البادئ"}]'::jsonb, '[]'::jsonb, 'A2 - تأسيسي')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('prepositions-mastery', 'Prepositions of Time and Place (In, On, At)', NULL, 'الأساسيات والتركيب اللغوي', NULL, NULL, NULL, '[{"en":"The keynote presentation starts at 9:00 AM sharp on Monday in the main conference hall.","ar":"تبدأ الكلمة الافتتاحية في تمام الساعة 9:00 صباحاً يوم الإثنين في قاعة المؤتمرات الرئيسية.","highlight":"at 9:00 AM ... on Monday ... in the hall","context":"تطبيق هرمي شامل: at للساعة، on لليوم، in للقاعة"}]'::jsonb, '[]'::jsonb, 'A2 - تأسيسي')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('gerunds-infinitives', 'Gerunds and Infinitives (V-ing vs. To + Verb)', NULL, 'الأساسيات والتركيب اللغوي', NULL, NULL, NULL, '[{"en":"The architect managed to secure the approval without compromising the ecological design.","ar":"نجح المهندس المعماري في تأمين الموافقة دون المساومة على التصميم البيئي.","highlight":"managed to secure ... without compromising","context":"manage يتبعه مصدر to secure، وحرف الجر without يتبعه gerund"}]'::jsonb, '[]'::jsonb, 'B2 - فوق متوسط')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('causatives-inversion', 'Causative Verbs (Have/Get) & Negative Inversion', NULL, 'الأساسيات والتركيب اللغوي', NULL, NULL, NULL, '[{"en":"Hardly had the platform launched when it recorded over one hundred thousand active subscribers.","ar":"لم تكد المنصة تنطلق حتى سجلت أكثر من مئة ألف مشترك نشط.","highlight":"Hardly had the platform launched","context":"تقديم سلبي متقدم (Inversion) يماثل أعلى درجات البلاغة الإنجليزية"}]'::jsonb, '[]'::jsonb, 'C1 - متقدم')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;

-- 5. SIMULATION SCENARIOS SEED
INSERT INTO public.simulation_scenarios (id, title, title_ar, category, difficulty, location, ai_role, user_role, initial_prompt, dialogue_script)
VALUES ('sim-airport-checkin', 'Airport Check-in & Baggage Drop', 'Airport Check-in & Baggage Drop', 'travel', NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  initial_prompt = EXCLUDED.initial_prompt;
INSERT INTO public.simulation_scenarios (id, title, title_ar, category, difficulty, location, ai_role, user_role, initial_prompt, dialogue_script)
VALUES ('sim-restaurant-ordering', 'Ordering at a Fine Dining Restaurant', 'Ordering at a Fine Dining Restaurant', 'hospitality', NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  initial_prompt = EXCLUDED.initial_prompt;
INSERT INTO public.simulation_scenarios (id, title, title_ar, category, difficulty, location, ai_role, user_role, initial_prompt, dialogue_script)
VALUES ('sim-doctor-appointment', 'Describing Symptoms to a Doctor', 'Describing Symptoms to a Doctor', 'healthcare', NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  initial_prompt = EXCLUDED.initial_prompt;
INSERT INTO public.simulation_scenarios (id, title, title_ar, category, difficulty, location, ai_role, user_role, initial_prompt, dialogue_script)
VALUES ('sim-job-interview', 'Global Tech Company Job Interview', 'Global Tech Company Job Interview', 'professional', NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  initial_prompt = EXCLUDED.initial_prompt;

-- 6. QUESTIONS SEED
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a1-gram-1', 'grammar', NULL, 'multiple-choice', 'She ______ in a major international hospital in Cairo.', 'اختر تصريف الفعل المناسب في المضارع البسيط مع الفاعل المفرد الغائب:', '["works","work","working","is work"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a1-gram-2', 'grammar', NULL, 'multiple-choice', 'Where ______ you live before moving to Alexandria?', 'اختر الفعل المساعد المناسب لتكوين السؤال في الماضي البسيط:', '["did","do","were","have"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a1-voc-1', 'vocabulary', NULL, 'multiple-choice', 'A person who flies an airplane professionally is called a ______.', 'اختر المسمى الوظيفي الصحيح للشخص الذي يقود الطائرات:', '["pilot","driver","sailor","engineer"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a2-gram-1', 'grammar', NULL, 'multiple-choice', 'Look at those dark storm clouds! It ______ rain very heavily.', 'اختر الصيغة المستقبلية الصحيحة عند وجود دليل مرئي حالي:', '["is going to","will","is","rains"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a2-gram-2', 'grammar', NULL, 'multiple-choice', 'While my brother was cooking dinner, I ______ my homework.', 'اختر الزمن المناسب لحدثين كانا يقعان بالتوازي في الماضي:', '["was doing","did","do","have done"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a2-voc-1', 'vocabulary', NULL, 'multiple-choice', 'To "postpone" a business meeting means to ______ it.', 'ما المعنى الدقيق لكلمة postpone في بيئة العمل؟', '["delay","cancel","start","repeat"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a2-listen-1', 'listening', NULL, 'multiple-choice', 'Listen to the airport announcement: What is the passenger advised to do?', NULL, '["Go directly to gate 14","Collect lost luggage","Wait at passport control","Change flight ticket"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b1-gram-1', 'grammar', NULL, 'multiple-choice', 'Omar is exhausted because he ______ the tech report all morning.', 'اختر الزمن الدال على المجهود واستمرارية الفعل في الماضي والممتد للحاضر:', '["has been writing","wrote","writes","is written"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b1-gram-2', 'grammar', NULL, 'multiple-choice', 'If you ______ harder last semester, you would have passed the scholarship exam.', 'اختر الصيغة الصحيحة لفعل الشرط في الحالة الشرطية الثالثة (الندم على الماضي):', '["had studied","studied","would study","have studied"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b1-gram-3', 'grammar', NULL, 'multiple-choice', 'By the time the delivery courier arrives, we ______ the conference room.', 'اختر زمن المستقبل التام المناسب مع رابط الوقت By the time:', '["will have arranged","will arrange","arranged","have arranged"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b1-voc-1', 'vocabulary', NULL, 'multiple-choice', 'The new mobile application received a ______ response from early testers, exceeding expectations.', 'اختر الكلمة المناسبة لوصف الردود شديدة الإيجابية والحماسية:', '["phenomenal","reluctant","mediocre","tedious"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b1-read-1', 'reading', NULL, 'multiple-choice', 'According to the passage, what do managers consider crucial for remote team success?', 'بناءً على النص، ما الذي يعتبره المديرون ضرورياً لنجاح فرق العمل عن بعد؟', '["Structured documentation and check-ins","Longer daily commutes","Eliminating all meetings","Returning to the office immediately"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b2-gram-1', 'grammar', NULL, 'multiple-choice', 'By next November, Dr. Farida ______ as head of clinical trials for a full decade.', 'اختر الزمن المعبر عن استكمال فترة زمنية كاملة بحلول موعد مستقبلي محدد:', '["will have been serving","will serve","is serving","has served"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b2-gram-2', 'grammar', NULL, 'multiple-choice', 'The financial audit ______ by a team of independent external consultants last week.', 'اختر صيغة المبني للمجهول الصحيحة في الماضي البسيط:', '["was conducted","has conducted","is conducted","conducted"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b2-voc-1', 'vocabulary', NULL, 'multiple-choice', 'To "streamline" a workflow process means to ______.', 'ما المعنى الدقيق لمصطلح Streamline في إدارة الأعمال والبرمجيات؟', '["make it more efficient and simpler","delay it unnecessarily","hire more employees","cancel the project"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b2-usage-1', 'usage', NULL, 'multiple-choice', 'In a formal email negotiation, which phrase is most professional to express polite disagreement?', 'أي من العبارات الآتية هي الأكثر دبلوماسية واحترافية للتعبير عن الاعتراض في إيميل عمل؟', '["While I see your point, our data suggests an alternative approach.","You are completely wrong about this estimate.","I do not care about your perspective.","This proposal makes no sense at all."]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('c1-gram-1', 'grammar', NULL, 'multiple-choice', 'Hardly ______ the stage when the entire auditorium erupted in thunderous applause.', 'اختر الصيغة المعكوسة الصحيحة (Inversion) بعد ظرف النفي Hardly:', '["had the keynote speaker entered","the keynote speaker had entered","did the speaker entered","was the speaker enter"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('c1-voc-1', 'vocabulary', NULL, 'multiple-choice', 'The keynote speaker''s insights were remarkably ______, dissecting macroeconomic trends with razor-sharp precision.', 'اختر الصفة البليغة المناسبة للتعبير عن العمق الفكري والفطنة الثاقبة:', '["incisive","ambiguous","superficial","redundant"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('c1-read-1', 'reading', NULL, 'multiple-choice', 'What core thesis do cognitive linguists advance in the passage?', 'ما هي الأطروحة الجوهرية التي يقدمها علماء اللغة المعرفيون في النص؟', '["Abstract temporal concepts derive organically from physical spatial metaphors","Grammar consists strictly of mathematical algebraic formulas","Languages have no underlying conceptual metaphors","Time expressions cannot be conceptualized by humans"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;

-- 7. CORE VOCABULARY SEED
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('the', 'the', 'noun', 'A1', '/ˈðə/, /ðə/, /ði/', '/ðə, ði/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('of', 'of', 'noun', 'A1', '/ˈəv/', '/ˈɒv/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('and', 'and', 'noun', 'A1', '/ˈænd/, /ənd/', '/ˈænd/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('to', 'to', 'noun', 'A1', '/ˈtu/, /tə/, /tɪ/', '/tˈuː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('in', 'in', 'noun', 'A1', '/ˈɪn/, /ɪn/', '/ˈɪn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('for', 'for', 'noun', 'A1', '/ˈfɔɹ/, /fɝ/, /fɹɝ/', '/fˈɔː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('is', 'is', 'verb', 'A1', '/ˈɪz/, /ɪz/', '/ˈɪz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('on', 'on', 'noun', 'A1', '/ˈɑn/, /ˈɔn/', '/ˈɒn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('that', 'that', 'noun', 'A1', '/ˈðæt/, /ðət/', '/ðˈæt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('by', 'by', 'noun', 'A1', '/ˈbaɪ/', '/bˈaɪ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('this', 'this', 'noun', 'A1', '/ˈðɪs/, /ðɪs/', '/ðˈɪs/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('with', 'with', 'noun', 'A1', '/ˈwɪð/, /ˈwɪθ/, /wɪð/, /wɪθ/', '/wˈɪð/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('you', 'you', 'noun', 'A1', '/ˈju/', '/jˈuː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('it', 'it', 'noun', 'A1', '/ˈɪt/, /ɪt/', '/ˈɪt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('not', 'not', 'noun', 'A1', '/ˈnɑt/', '/nˈɒt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('or', 'or', 'noun', 'A1', '/ˈɔɹ/, /ɝ/', '/ˈɔː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('be', 'be', 'noun', 'A1', '/ˈbi/, /bi/', '/bˈiː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('are', 'are', 'verb', 'A1', '/ˈɑɹ/, /ɝ/', '/ˈɑɹ/, /ɝ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('from', 'from', 'noun', 'A1', '/ˈfɹəm/', '/fɹˈɒm/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('at', 'at', 'noun', 'A1', '/ˈæt/', '/ˈæt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('as', 'as', 'noun', 'A1', '/ˈæz/, /ˈɛz/', '/ˈæz/, /ˈɛz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('your', 'your', 'noun', 'A1', '/ˈjɔɹ/, /ˈjʊɹ/', '/jˈɔː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('all', 'all', 'noun', 'A1', '/ˈɔɫ/', '/ˈɔːl/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('have', 'have', 'noun', 'A1', '/ˈhæv/', '/ˈhæv/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('new', 'new', 'noun', 'A1', '/ˈnju/, /ˈnu/', '/njˈuː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('more', 'more', 'noun', 'A1', '/ˈmɔɹ/', '/mˈɔː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('an', 'an', 'adjective', 'A1', '/ˈæn/, /ən/', '/ˈɐn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('was', 'was', 'verb', 'A1', '/ˈwɑz/, /wəz/', '/wˈɒz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('we', 'we', 'noun', 'A1', '/ˈwi/', '/wˈiː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('will', 'will', 'noun', 'A1', '/ˈwɪɫ/, /wəɫ/', '/wˈɪl/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('home', 'home', 'noun', 'A1', '/ˈhoʊm/', '/hˈəʊm/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('can', 'can', 'noun', 'A1', '/ˈkæn/, /kən/', '/kˈæn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('us', 'us', 'noun', 'A1', '/ˈəs/, /ˌjuˈɛs/', '/ˈʌs/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('if', 'if', 'noun', 'A1', '/ˈɪf/, /ɪf/', '/ˈɪf/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('page', 'page', 'noun', 'A1', '/ˈpeɪdʒ/', '/pˈeɪdʒ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('my', 'my', 'noun', 'A1', '/ˈmaɪ/', '/mˈaɪ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('has', 'has', 'noun', 'A1', '/ˈhæz/, /həz/', '/hˈæz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('search', 'search', 'noun', 'A1', '/ˈsɝtʃ/', '/sˈɜːtʃ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('free', 'free', 'noun', 'A1', '/ˈfɹi/', '/fɹˈiː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('but', 'but', 'noun', 'A1', '/ˈbət/', '/bˈʌt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('our', 'our', 'noun', 'A1', '/ˈaʊɝ/, /ˈaʊɹ/, /ˈɑɹ/', '/ˈaʊə/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('one', 'one', 'noun', 'A1', '/ˈwən/', '/wˈɒn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('other', 'other', 'noun', 'A1', '/ˈəðɝ/', '/ˈʌðɐ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('do', 'do', 'noun', 'A1', '/ˈdu/', '/ˈdu/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('no', 'no', 'noun', 'A1', '/ˈnoʊ/', '/ˈnoʊ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('information', 'information', 'noun', 'A1', '/ˌɪnfɝˈmeɪʃən/, /ɪnˈfɔɹˈmeɪʃən/', '/ˌɪnfəmˈeɪʃən/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('time', 'time', 'noun', 'A1', '/ˈtaɪm/', '/tˈaɪm/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('they', 'they', 'noun', 'A1', '/ˈðeɪ/', '/ðˈeɪ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('site', 'site', 'noun', 'A1', '/ˈsaɪt/', '/sˈaɪt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('he', 'he', 'noun', 'A1', '/ˈhi/', '/ˈhi/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('up', 'up', 'noun', 'A1', '/ˈəp/', '/ˈʌp/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('may', 'may', 'verb', 'A1', '/ˈmeɪ/', '/mˈeɪ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('what', 'what', 'noun', 'A1', '/ˈhwət/, /ˈwət/', '/wˈɒt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('which', 'which', 'noun', 'A1', '/ˈhwɪtʃ/, /ˈwɪtʃ/', '/wˈɪtʃ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('their', 'their', 'noun', 'A1', '/ˈðɛɹ/', '/ðˈeə/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('news', 'news', 'noun', 'A1', '/ˈnjuz/, /ˈnuz/', '/njˈuːz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('out', 'out', 'noun', 'A1', '/ˈaʊt/', '/ˈaʊt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('use', 'use', 'noun', 'A1', '/ˈjus/, /ˈjuz/', '/ˈjus/, /ˈjuz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('any', 'any', 'noun', 'A1', '/ˈɛni/', '/ˈɛni/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('there', 'there', 'noun', 'A1', '/ˈðɛɹ/', '/ðˈeə/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('see', 'see', 'noun', 'A1', '/ˈsi/', '/sˈiː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('only', 'only', 'adverb', 'A1', '/ˈoʊnɫi/', '/ˈəʊnli/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('so', 'so', 'noun', 'A1', '/ˈsoʊ/', '/sˈəʊ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('his', 'his', 'noun', 'A1', '/ˈhɪz/, /hɪz/', '/hˈɪz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('when', 'when', 'noun', 'A1', '/ˈhwɛn/, /ˈhwɪn/, /ˈwɛn/, /ˈwɪn/', '/wˈɛn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('contact', 'contact', 'noun', 'A1', '/ˈkɑnˌtækt/', '/ˈkɑnˌtækt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('here', 'here', 'noun', 'A1', '/ˈhiɹ/', '/hˈiə/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('business', 'business', 'noun', 'A1', '/ˈbɪznəs/, /ˈbɪznɪs/', '/bˈɪznəs/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('who', 'who', 'noun', 'A1', '/ˈhu/', '/hˈuː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('web', 'web', 'noun', 'A1', '/ˈwɛb/', '/wˈɛb/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('also', 'also', 'noun', 'A1', '/ˈɔɫsoʊ/', '/ˈɒlsəʊ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('now', 'now', 'noun', 'A1', '/ˈnaʊ/', '/nˈaʊ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('help', 'help', 'noun', 'A1', '/ˈhɛɫp/', '/hˈɛlp/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('get', 'get', 'noun', 'A1', '/ˈɡɛt/, /ˈɡɪt/', '/ɡˈɛt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('pm', 'pm', 'noun', 'A1', '/ˈpiˈɛm/', '/ˈpiˈɛm/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('view', 'view', 'noun', 'A1', '/ˈvju/', '/vjˈuː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('online', 'online', 'noun', 'A1', '/ˈɔnˌɫaɪn/', '/ˈɒnlaɪn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('first', 'first', 'noun', 'A1', '/ˈfɝst/', '/fˈɜːst/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('am', 'am', 'verb', 'A1', '/ˈæm/, /ˈeɪˈɛm/', '/ˈæm/, /ˈeɪˈɛm/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('been', 'been', 'noun', 'A1', '/ˈbɪn/, /bən/, /bɪn/', '/bˈiːn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('would', 'would', 'verb', 'A1', '/ˈwʊd/', '/wˈʊd/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('how', 'how', 'noun', 'A1', '/ˈhaʊ/', '/hˈaʊ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('were', 'were', 'verb', 'A1', '/ˈwɝ/', '/wˈɜː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('me', 'me', 'noun', 'A1', '/ˈmi/', '/mˈiː/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('services', 'services', 'noun', 'A1', '/ˈsɝvəsəz/, /ˈsɝvɪsɪz/', '/sˈɜːvɪsɪz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('some', 'some', 'noun', 'A1', '/ˈsəm/', '/sˈʌm/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('these', 'these', 'noun', 'A1', '/ˈðiz/', '/ðˈiːz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('click', 'click', 'verb', 'A1', '/ˈkɫɪk/', '/klˈɪk/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('its', 'its', 'noun', 'A1', '/ˈɪts/, /ɪts/', '/ˈɪts/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('like', 'like', 'noun', 'A1', '/ˈɫaɪk/', '/lˈaɪk/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('service', 'service', 'noun', 'A1', '/ˈsɝvəs/, /ˈsɝvɪs/', '/sˈɜːvɪs/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('than', 'than', 'noun', 'A1', '/ˈðæn/, /ðən/', '/ðˈɐn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('find', 'find', 'noun', 'A1', '/ˈfaɪnd/', '/fˈaɪnd/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('price', 'price', 'noun', 'A1', '/ˈpɹaɪs/', '/pɹˈaɪs/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('date', 'date', 'noun', 'A1', '/ˈdeɪt/', '/dˈeɪt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('back', 'back', 'noun', 'A1', '/ˈbæk/', '/bˈæk/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('top', 'top', 'noun', 'A1', '/ˈtɑp/, /ˈtɔp/', '/tˈɒp/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('people', 'people', 'noun', 'A1', '/ˈpipəɫ/', '/pˈiːpəl/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('had', 'had', 'noun', 'A1', '/ˈhæd/', '/hˈæd/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('list', 'list', 'noun', 'A1', '/ˈɫɪst/', '/lˈɪst/')
ON CONFLICT (headword) DO NOTHING;
COMMIT;
-- Master seed generated successfully.