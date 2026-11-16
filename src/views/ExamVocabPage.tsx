// ==============================================================================
// Henglish Academy (HENGLISH) - EXAM VOCAB PAGE
// One page per exam word list (IELTS / TOEFL), shared panel inside.
// ==============================================================================

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ExamVocabPanel } from '../components/ExamVocabPanel';
import { ExamId } from '../services/examVocabService';

const EXAM_COPY: Record<ExamId, { titleAr: string; blurbKey: string }> = {
  ielts: {
    titleAr: 'IELTS',
    blurbKey: 'ex.ieltsBlurb',
  },
  toefl: {
    titleAr: 'TOEFL',
    blurbKey: 'ex.toeflBlurb',
  },
};

interface ExamVocabPageProps {
  exam: ExamId;
}

export const ExamVocabPage: React.FC<ExamVocabPageProps> = ({ exam }) => {
  const { t } = useLanguage();
  const copy = EXAM_COPY[exam];
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right">
      <ExamVocabPanel exam={exam} titleAr={copy.titleAr} blurbAr={t(copy.blurbKey)} />
    </div>
  );
};
