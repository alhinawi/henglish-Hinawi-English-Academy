import React, { useEffect, useState } from 'react';
import { apiGetAuthConfig, googleLoginUrl } from '../services/henglishApi';

// Google sign-in block shared by the login page, register page and auth modal.
// Renders nothing until the worker confirms OAuth is configured, so the button
// only appears once the OAuth secrets exist on the backend.
export const GoogleSignInBlock: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiGetAuthConfig().then((cfg) => {
      if (!cancelled) setEnabled(cfg.google);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => {
          window.location.href = googleLoginUrl();
        }}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-xl transition-all shadow-md cursor-pointer"
      >
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41.4 35.1 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"/>
        </svg>
        <span>المتابعة بحساب Google</span>
      </button>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-700/60"></div>
        <span className="text-xs font-bold text-slate-400">أو بالإيميل</span>
        <div className="flex-1 h-px bg-slate-700/60"></div>
      </div>
    </div>
  );
};
