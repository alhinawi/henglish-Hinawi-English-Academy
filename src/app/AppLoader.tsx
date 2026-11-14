'use client';

import { App } from '../App';
import { AuthProvider } from '../context/AuthContext';

export default function AppLoader() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
