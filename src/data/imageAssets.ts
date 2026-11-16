export interface OnlineImageAsset {
  id: string;
  url: string;
  alt: string;
  captionAr: string;
  category: 'lesson' | 'course' | 'avatar' | 'context' | 'banner' | 'grammar';
}

export const ONLINE_IMAGES = {
  // Course Cover Banners & Academy Heroes
  futurePerfectHero: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80',
  learningStudyGroup: '/images/pool/learningStudyGroup.webp',
  graduationCelebration: '/images/pool/graduationCelebration.webp',
  modernClassroom: '/images/pool/modernClassroom.webp',
  libraryStudy: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
  mentorStudent: '/images/pool/mentorStudent.webp',
  onlineTechLecture: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',

  // 8 Specific Future Perfect Flagship Lesson Photographs
  lessons: {
    lesson1: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80', // Hourglass deadline
    lesson2: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', // Architecture / formula construction
    lesson3: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80', // Time clock / stop
    lesson4: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', // Meeting questions
    lesson5: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80', // Calendar deadline
    lesson6: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80', // Airport terminal
    lesson7: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', // Finish line runner
    lesson8: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', // Developer night coding
  },

  // Complete Grammar Masterclass Photographs
  grammar: {
    presentSimple: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80', // Daily routine coffee desk
    presentContinuous: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', // Action happening now laptop
    presentPerfect: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80', // Experience and achievement
    presentPerfectContinuous: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80', // Ongoing study session
    pastSimple: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80', // Vintage book history
    pastContinuous: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80', // Meeting interrupted
    pastPerfect: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=800&q=80', // Clock timeline before
    pastPerfectContinuous: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', // Exhausted marathon runner long run
    futureSimple: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', // Business future planning
    futureContinuous: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', // At this time tomorrow
    futurePerfect: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80', // Deadline calendar
    conditionals: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80', // Fork in road decisions
    passiveVoice: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', // Engineering manufactured
    modalVerbs: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', // Team brainstorming
    reportedSpeech: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80', // Interview conversation
    relativeClauses: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', // Connected community
    gerundsInfinitives: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=800&q=80', // Creative writing
  },

  // Courses Catalog Images
  courses: {
    futurePerfect: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80',
    presentPerfect: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    conditionals: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
    techEnglish: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    businessWriting: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    ieltsSpeaking: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    allTenses: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    passiveVoice: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },

  // Dialogue Avatars (Real High-Resolution Portraits)
  avatars: {
    mona: '/images/pool/av-mona.webp',
    omar: '/images/pool/av-omar.webp',
    laila: '/images/pool/av-laila.webp',
    karim: '/images/pool/av-karim.webp',
    tariq: '/images/pool/av-tariq.webp',
    hassan: '/images/pool/av-hassan.webp',
    nour: '/images/pool/av-nour.webp',
    interviewer: '/images/pool/av-interviewer.webp',
    youssef: '/images/pool/av-youssef.webp',
    salma: '/images/pool/av-salma.webp',
  },

  // Contextual Scene Photos for Dialogues
  dialogueScenes: {
    study: '/images/pool/scene-study.webp',
    coding: '/images/pool/scene-coding.webp',
    travel: '/images/pool/scene-travel.webp',
    market: '/images/pool/scene-market.webp',
    doctor: '/images/pool/scene-doctor.webp',
    interview: '/images/pool/scene-interview.webp',
    airport: '/images/pool/scene-airport.webp',
    career: '/images/pool/scene-career.webp',
  },

  // Real-Life Visual Scenarios Gallery
  scenariosGallery: [
    {
      id: 'gallery-dev',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      tag: 'Tech & Startups',
      sentence: 'By 8:00 PM tonight, the engineering team will have deployed the new platform release.',
      translationAr: 'بحلول الساعة الثامنة مساء اليوم، هيكون فريق الهندسة أطلق الإصدار الجديد من المنصة.',
      focusRule: 'Future Perfect • Specific Deadline',
    },
    {
      id: 'gallery-grad',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      tag: 'University & Milestones',
      sentence: 'By next July, they will have graduated with honors from the faculty of engineering.',
      translationAr: 'بحلول شهر يوليو القادم، هيكونوا اتخرجوا بمرتبة الشرف من كلية الهندسة.',
      focusRule: 'Future Perfect • Life Milestone',
    },
    {
      id: 'gallery-airport',
      imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
      tag: 'Aviation & Travel',
      sentence: 'By the time you wake up tomorrow, our flight will have landed in London.',
      translationAr: 'على بال ما تصحى بكرة، هتكون طيارتنا هبطت بالفعل في مطار لندن.',
      focusRule: 'By the time + Present Simple ➔ will have + V3',
    },
    {
      id: 'gallery-study',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      tag: 'Exam Preparation',
      sentence: 'Before the final exam begins, Sarah will have revised all 12 grammar units.',
      translationAr: 'قبل ما الامتحان النهائي يبدأ، هتكون سارة راجعت كل وحدات القواعد الـ ١٢.',
      focusRule: 'Before + Present Simple ➔ will have + V3',
    },
    {
      id: 'gallery-city',
      imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
      tag: 'Future Predictions',
      sentence: 'By 2030, green energy will have transformed urban public transit worldwide.',
      translationAr: 'بحلول عام ٢٠٣٠، هتكون الطاقة النظيفة غيرت النقل الحضري تماماً حول العالم.',
      focusRule: 'By [Future Year] + will have + V3',
    },
    {
      id: 'gallery-architect',
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      tag: 'Architecture & Design',
      sentence: 'By Sunday morning, the lead architect will have completed the master skyscraper plan.',
      translationAr: 'قبل صباح الأحد، هيكون المهندس المعماري أنجز المخطط الرئيسي لبرج السحاب.',
      focusRule: 'By [Day] + will have completed',
    },
  ],

  // Vocabulary & Verbs Contextual Photos
  vocab: {
    write: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    reading: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    fly: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=600&q=80',
    building: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
  }
};
