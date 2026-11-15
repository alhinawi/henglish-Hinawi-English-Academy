import React, { useRef, useState } from 'react';
import { X, Camera, Save } from 'lucide-react';
import { UserProfile } from '../types';
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
        className="w-full max-w-sm bg-[#171632] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">الإعدادات</h2>
          <button onClick={onClose} aria-label="إغلاق" className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <img
            src={avatar || userProfile.avatar}
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
