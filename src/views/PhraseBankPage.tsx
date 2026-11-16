// ==============================================================================
// Henglish Academy (HENGLISH) - PHRASE BANK PAGE
// One page per phrase bank (idioms / slang / genz), shared panel inside.
// ==============================================================================

import React from 'react';
import { PhraseBankPanel } from '../components/PhraseBankPanel';
import { PhraseBankId } from '../services/phraseBankService';

const BANK_COPY: Record<PhraseBankId, { titleAr: string; blurbAr: string }> = {
  idioms: {
    titleAr: 'بنك التعابير الاصطلاحية',
    blurbAr: 'أشهر التعابير الاصطلاحية الإنجليزية بمعناها بالمصري، مع مثال إنجليزي وترجمته لكل تعبير. كل التعابير مراجعة ومحققة يدوياً.',
  },
  slang: {
    titleAr: 'بنك السلانج',
    blurbAr: 'التعبيرات العامية الأمريكية والبريطانية المستخدمة في الحياة اليومية، بمعناها بالمصري وتوضيح السياق المناسب لاستخدامها.',
  },
  genz: {
    titleAr: 'بنك سلانج الجيل Z',
    blurbAr: 'تعبيرات الجيل الجديد وثقافة الإنترنت - اللي بتسمعه على السوشيال ميديا وفي الأغاني، مترجم وموضح بالمصري.',
  },
};

interface PhraseBankPageProps {
  bank: PhraseBankId;
}

export const PhraseBankPage: React.FC<PhraseBankPageProps> = ({ bank }) => {
  const copy = BANK_COPY[bank];
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right">
      <PhraseBankPanel bank={bank} titleAr={copy.titleAr} blurbAr={copy.blurbAr} />
    </div>
  );
};
