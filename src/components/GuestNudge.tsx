import React, { useEffect, useRef, useState } from 'react';
import { Info, X } from 'lucide-react';
import { PageRoute } from '../types';

interface GuestNudgeProps {
  isGuest: boolean;
  currentRoute: PageRoute;
  onRegister: () => void;
}

// Routes where a "save your progress" hint makes sense (actual learning services)
const SERVICE_ROUTES: PageRoute[] = [
  'dashboard', 'lesson', 'grammar', 'grammar-lesson', 'vocabulary',
  'speaking', 'listening', 'reading', 'writing', 'pronunciation',
  'real-life', 'exams', 'quizzes', 'games', 'movies', 'sentences',
  'practice', 'courses', 'my-learning', 'certificates', 'ai-tutor',
  'translation', 'resources', 'world-3d', 'homework', 'progress',
];

const AUTO_HIDE_MS = 9000;

export const GuestNudge: React.FC<GuestNudgeProps> = ({ isGuest, currentRoute, onRegister }) => {
  const [visible, setVisible] = useState(false);
  const shownFor = useRef<Set<string>>(new Set());

  // Hide the moment the session resolves to a signed-in user (e.g. right after
  // a Google sign-in redirect, where the route effect can fire while the
  // session is still guest).
  useEffect(() => {
    if (!isGuest) setVisible(false);
  }, [isGuest]);

  useEffect(() => {
    if (!isGuest || !SERVICE_ROUTES.includes(currentRoute)) return;
    if (shownFor.current.has(currentRoute)) return;
    shownFor.current.add(currentRoute);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    return () => clearTimeout(t);
  }, [isGuest, currentRoute]);

  if (!visible) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 end-4 z-40 max-w-xs bg-slate-900/95 backdrop-blur border border-amber-500/40 text-slate-100 rounded-xl shadow-xl px-4 py-3 flex items-start gap-3"
      role="status"
    >
      <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <div className="text-xs leading-relaxed">
        <p>سجّل حساب عشان بياناتك وتقدمك يتحفظوا. التسجيل اختياري ومش هيوقفك عن حاجة.</p>
        <button
          onClick={onRegister}
          className="mt-1 text-amber-400 font-bold hover:text-amber-300 underline underline-offset-2"
        >
          إنشاء حساب
        </button>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="إغلاق"
        className="text-slate-400 hover:text-slate-200 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
