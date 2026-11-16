// ==============================================================================
// Henglish Academy (HENGLISH) - PHRASE BANK PAGE
// One page per phrase bank (idioms / slang / genz), shared panel inside.
// ==============================================================================

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { PhraseBankPanel } from '../components/PhraseBankPanel';
import { PhraseBankId } from '../services/phraseBankService';

const BANK_COPY: Record<PhraseBankId, { titleAr: string; blurbKey: string }> = {
  idioms: {
    titleAr: 'Idioms',
    blurbKey: 'pb.idiomsBlurb',
  },
  slang: {
    titleAr: 'Slang',
    blurbKey: 'pb.slangBlurb',
  },
  genz: {
    titleAr: 'Gen Z',
    blurbKey: 'pb.genzBlurb',
  },
};

interface PhraseBankPageProps {
  bank: PhraseBankId;
}

export const PhraseBankPage: React.FC<PhraseBankPageProps> = ({ bank }) => {
  const { t } = useLanguage();
  const copy = BANK_COPY[bank];
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right">
      <PhraseBankPanel bank={bank} titleAr={copy.titleAr} blurbAr={t(copy.blurbKey)} />
    </div>
  );
};
