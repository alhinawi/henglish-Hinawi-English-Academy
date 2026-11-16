import { ThemePicker } from './ThemePicker';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES } from '../i18n/languages';
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, Save } from 'lucide-react';
import { UserProfile } from '../types';
import { ANONYMOUS_AVATAR } from '../services/authService';
import { PRESET_COUNT, presetSvg, svgToDataUrl } from '../utils/avatarPresets';
import { apiUpdateMe } from '../services/henglishApi';

interface SettingsModalProps {
  userProfile: UserProfile;
  accessToken: string | undefined;
  onClose: () => void;
  onSaved: (patch: { name?: string; avatar?: string | null }) => void;
}

// Compact account settings: profile picture (upload or clear back to the
// neutral placeholder) and display name. Saves through the accounts API.
export const SettingsModal: React.FC<SettingsModalProps> = ({ userProfile, accessToken, onClose, onSaved }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const { lang, setLang, t } = useLanguage();
  const [name, setName] = useState(userProfile.nameAr || userProfile.name);
  const [avatar, setAvatar] = useState<string | null>(userProfile.avatar);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        setAvatar(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!accessToken) {
      setError('الجلسة مش جاهزة. سجّل دخولك من جديد.');
      return;
    }
    setSaving(true);
    setError(null);
    const trimmed = name.trim();
    const res = await apiUpdateMe(accessToken, {
      ...(trimmed.length >= 2 ? { name: trimmed } : {}),
      avatar: avatar || null,
    });
    setSaving(false);
    if (!res) {
      setError('حصلت مشكلة أثناء الحفظ. حاول تاني.');
      return;
    }
    onSaved({ name: trimmed.length >= 2 ? trimmed : undefined, avatar: avatar || null });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" aria-label="إعدادات الحساب"
        className="w-full max-w-sm max-h-[90dvh] overflow-y-auto bg-[#171632] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">{t('settings.title')}</h2>
          <button onClick={onClose} aria-label="إغلاق" className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <ThemePicker inline />

        {/* Interface language */}
        <div className="space-y-2">
          <label htmlFor="ui-language" className="text-sm font-bold text-white">
            {t('settings.language')}
          </label>
          <select
            id="ui-language"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#ffd166]/50 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-[#171632] text-white">
                {l.nativeName} · {l.englishName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center gap-3">
          <img
            src={avatar || ANONYMOUS_AVATAR}
            alt="الصورة الشخصية"
            className="w-24 h-24 rounded-2xl object-cover border-2 border-[#ffd166]/60 bg-slate-800"
          />
          <div className="flex gap-2">
            <button
              onClick={pickFile}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>غيّر صورتك</span>
            </button>
            <button
              onClick={() => setAvatar(null)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
            >
              من غير صورة
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>

        <fieldset className="space-y-3"><legend className="text-xs text-slate-300 mb-2">أو اختار أفاتار جاهز</legend><div className="grid grid-cols-6 gap-2">{Array.from({length: PRESET_COUNT}, (_, i) => <button key={i} type="button" aria-label={`أفاتار ${i + 1}`} onClick={async () => { try { setAvatar(await svgToDataUrl(presetSvg(i))); } catch { setError('مش قادرين نجهز الأفاتار. جرّب صورة تانية.'); } }} className="aspect-square rounded-xl overflow-hidden [&>svg]:w-full [&>svg]:h-full border border-white/15 hover:border-[#ffd166] focus-visible:outline-2 focus-visible:outline-[#ffd166]" dangerouslySetInnerHTML={{__html: presetSvg(i)}} />)}</div></fieldset>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">الاسم الظاهر</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="w-full px-4 py-3 bg-slate-950/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {error && <p className="text-xs text-red-300">{error}</p>}

        <button
          onClick={save}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-sm hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'بيحفظ...' : 'احفظ التغييرات'}</span>
        </button>
      </div>
    </div>
  );
};
