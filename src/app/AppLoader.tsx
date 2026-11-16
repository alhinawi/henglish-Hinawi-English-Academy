'use client';

import { useEffect } from 'react';
import { App } from '../App';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../i18n/LanguageContext';
import type { PageRoute } from '../types';

export default function AppLoader({ initialRoute }: { initialRoute?: PageRoute }) {
  useEffect(() => {
    document.getElementById('boot-splash')?.remove();
  }, []);
  return (
    <LanguageProvider>
      <AuthProvider>
        <App initialRoute={initialRoute} />
      </AuthProvider>
    </LanguageProvider>
  );
}
