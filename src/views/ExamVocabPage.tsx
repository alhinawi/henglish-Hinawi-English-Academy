// ==============================================================================
// Henglish Academy (HENGLISH) - EXAM VOCAB PAGE
// One page per exam word list (IELTS / TOEFL), shared panel inside.
// ==============================================================================

import React from 'react';
import { ExamVocabPanel } from '../components/ExamVocabPanel';
import { ExamId } from '../services/examVocabService';

const EXAM_COPY: Record<ExamId, { titleAr: string; blurbAr: string }> = {
  ielts: {
    titleAr: 'IELTS',
    blurbAr: 'أهم كلمات الـ IELTS مرتبة من الأكثر استخداماً، بمعناها بالمصري ومثال حقيقي عليها، مع المستوى والـ Band والـ Collocation الشائعة.',
  },
  toefl: {
    titleAr: 'TOEFL',
    blurbAr: 'كلمات الـ TOEFL الأساسية مرتبة من الأكثر استخداماً، بمعناها بالمصري وأمثلة محققة، مع المستوى والموضوع.',
  },
};

interface ExamVocabPageProps {
  exam: ExamId;
}

export const ExamVocabPage: React.FC<ExamVocabPageProps> = ({ exam }) => {
  const copy = EXAM_COPY[exam];
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right">
      <ExamVocabPanel exam={exam} titleAr={copy.titleAr} blurbAr={copy.blurbAr} />
    </div>
  );
};
