import React from 'react';
import { PageRoute, UserProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { playSound } from '../utils/audio';
import {
  Settings, BookOpen, Award, ShieldCheck, Repeat, LogOut,
  ChevronLeft, ChevronRight, User,
} from 'lucide-react';

interface ProfilePageProps {
  userProfile: UserProfile;
  isLoggedIn: boolean;
  onNavigate: (route: PageRoute) => void;
  onOpenSettings: () => void;
  onToggleRole?: () => void;
  onSignOut?: () => void;
  onRequestAuth: () => void;
}

interface ProfileRow {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  isLoggedIn,
  onNavigate,
  onOpenSettings,
  onToggleRole,
  onSignOut,
  onRequestAuth,
}) => {
  const { t, dir } = useLanguage();
  const isAr = dir === 'rtl';
  const Chevron = isAr ? ChevronLeft : ChevronRight;

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto text-center space-y-5 pt-10">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center">
          <User className="w-7 h-7 text-[#b9b6d5]" />
        </div>
        <p dir="auto" className="text-sm font-bold text-white">{t('header.guestTitle')}</p>
        <button
          onClick={() => { playSound('click'); onRequestAuth(); }}
          className="px-6 py-3 rounded-2xl bg-[#c4ff55] text-[#09091a] text-sm font-black hover:brightness-110 cursor-pointer"
        >
          <span dir="auto">{t('header.login')}</span>
        </button>
      </div>
    );
  }

  const isOwner = userProfile.email?.toLowerCase() === '3asfuur@gmail.com';

  const rows: ProfileRow[] = [
    { key: 'settings', icon: <Settings className="w-5 h-5 text-[#41e7ff]" />, label: t('settings.title'), onClick: () => onOpenSettings() },
    { key: 'my-learning', icon: <BookOpen className="w-5 h-5 text-[#41e7ff]" />, label: t('header.mySpaceNotes'), onClick: () => onNavigate('my-learning') },
    { key: 'certificates', icon: <Award className="w-5 h-5 text-[#ffd166]" />, label: t('header.myCertificates'), onClick: () => onNavigate('certificates') },
    ...(isOwner ? [{ key: 'admin', icon: <ShieldCheck className="w-5 h-5 text-[#ffd166]" />, label: t('header.adminPanel'), onClick: () => onNavigate('admin') } as ProfileRow] : []),
    ...(onToggleRole ? [{ key: 'role', icon: <Repeat className="w-5 h-5 text-[#c4ff55]" />, label: `${t('header.roleToggle')}${userProfile.role === 'student' ? t('header.teacher') : t('header.student')}`, onClick: () => onToggleRole() } as ProfileRow] : []),
    ...(onSignOut ? [{ key: 'logout', icon: <LogOut className="w-5 h-5 text-red-400" />, label: t('header.logout'), onClick: () => onSignOut(), danger: true } as ProfileRow] : []),
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 dir="auto" className="text-xl font-black text-white" style={{ textAlign: 'start' }}>{t('profile.title')}</h1>

      {/* Identity card */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <img
          src={userProfile.avatar}
          alt={userProfile.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#ffd166]/60 shadow-lg shrink-0"
        />
        <div className="min-w-0 flex-1" style={{ textAlign: 'start' }}>
          <div className="text-lg font-black text-white truncate">{userProfile.nameAr}</div>
          <div dir="ltr" className="text-xs text-[#b9b6d5] truncate mt-0.5">{userProfile.email}</div>
          <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-black px-2 py-0.5 rounded-md bg-[#ffd166]/20 text-[#ffd166]">
            {userProfile.role === 'teacher' ? t('header.rankTeacher') : t('header.cefrLevel').replace('{level}', userProfile.currentLevel)}
          </span>
        </div>
      </div>

      {/* Account actions */}
      <div className="space-y-2">
        {rows.map(row => (
          <button
            key={row.key}
            onClick={() => { playSound('click'); row.onClick(); }}
            className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border transition-colors cursor-pointer ${
              row.danger
                ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {row.icon}
            <span dir="auto" className="flex-1 text-sm font-bold truncate" style={{ textAlign: 'start' }}>{row.label}</span>
            {!row.danger && <Chevron className="w-4 h-4 text-[#b9b6d5] shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
};
