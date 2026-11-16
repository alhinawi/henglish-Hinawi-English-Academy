'use client';

import { App } from '../App';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../i18n/LanguageContext';
import type { PageRoute } from '../types';

export default function AppLoader({ initialRoute }: { initialRoute?: PageRoute }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <App initialRoute={initialRoute} />
      </AuthProvider>
    </LanguageProvider>
  );
}
