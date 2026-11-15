'use client';

import { App } from '../App';
import { AuthProvider } from '../context/AuthContext';
import type { PageRoute } from '../types';

export default function AppLoader({ initialRoute }: { initialRoute?: PageRoute }) {
  return (
    <AuthProvider>
      <App initialRoute={initialRoute} />
    </AuthProvider>
  );
}
