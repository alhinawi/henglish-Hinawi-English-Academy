import { useLanguage } from '../../i18n/LanguageContext';
import React, { useState, useRef, useEffect } from 'react';
import { PageRoute, UserProfile, AppNotification } from '../../types';
import { playSound } from '../../utils/audio';
import {
  Menu,
  X,
  Search,
  Bell,
  Flame,
  User,
  ShieldCheck,
  CheckCheck,
  RotateCcw,
  BookOpen,
  LogOut,
  ChevronDown,
  Sparkles,
  GraduationCap,
  Volume2,
  Compass,
  FileCheck2,
  Award,
  Layers,
  Bot,
  Gamepad2,
  Globe,
  Settings,
  Lock,
  LogIn,
  UserPlus,
  ChevronLeft,
  Mail,
  KeyRound,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  currentRoute: PageRoute;
  activeLessonId?: string;
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  mobileOpen?: boolean;
  onToggleMobile?: () => void;
  onOpenMobile?: () => void;
  onCloseMobile?: () => void;
  onOpenSearch: () => void;
  onOpenVoiceSettings: () => void;
  onOpenSettings: () => void;
  onOpenAuthModal: (tab?: 'login' | 'register' | 'migrate') => void;
  userProfile: UserProfile;
  notifications: AppNotification[];
  unreadCount: number;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onToggleRole: () => void;
  onResetProgress: () => void;
  onSignOut?: () => void;
  authSessionType?: 'guest' | 'authenticated';
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  activeLessonId,
  onNavigate,
  mobileOpen = false,
  onToggleMobile,
  onOpenMobile,
  onCloseMobile,
  onOpenSearch,
  onOpenVoiceSettings,
  onOpenSettings,
  onOpenAuthModal,
  userProfile,
  notifications,
  unreadCount,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onToggleRole,
  onResetProgress,
  onSignOut,
  authSessionType = 'authenticated',
}) => {
  const [accountOpen, setAccountOpen] = useState(false);
  const [academiesMenuOpen, setAcademiesMenuOpen] = useState(false);
  const [banksMenuOpen, setBanksMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { t, dir } = useLanguage();
  const isAr = dir === 'rtl';

  const academiesRef = useRef<HTMLDivElement>(null);
  const banksRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close all dropdowns on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (academiesRef.current && !academiesRef.current.contains(target)) {
        setAcademiesMenuOpen(false);
      }
      if (banksRef.current && !banksRef.current.contains(target)) {
        setBanksMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileOpen && onCloseMobile) {
          onCloseMobile();
        }
        setAcademiesMenuOpen(false);
        setBanksMenuOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen, onCloseMobile]);

  const handleNav = (route: PageRoute, lessonId?: string) => {
    playSound('click');
    if (onCloseMobile) {
      onCloseMobile();
    }
    setAcademiesMenuOpen(false);
    setBanksMenuOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
    onNavigate(route, lessonId);
  };

  const mobileMenuButton = (
    <button
      onClick={() => {
        playSound('click');
        if (onToggleMobile) {
          onToggleMobile();
        } else if (onOpenMobile) {
          onOpenMobile();
        }
      }}
      className={`md:hidden p-2 rounded-xl transition-all cursor-pointer relative z-50 ${
        mobileOpen
          ? 'bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm'
          : 'text-[#dedbf4] hover:text-white hover:bg-white/5 border border-transparent'
      }`}
      aria-label={mobileOpen ? t('header.menuClose') : t('header.menuOpen')}
      aria-expanded={mobileOpen}
    >
      {mobileOpen ? <X className="w-5 h-5 text-[#ffd166]" /> : <Menu className="w-5 h-5" />}
    </button>
  );

  return (
    <header
      dir="ltr"
      className="sticky top-0 z-50 min-h-20 bg-[#0c0b20]/95 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-3 select-none"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      
      {/* LEFT: Mobile Menu Hamburger & Desktop Main Navigation Menus */}
      <div className="flex items-center gap-3 xl:gap-4 min-w-0">
        {!isAr && mobileMenuButton}

        {/* Brand: site name + logo, links home (hidden on xl where the full nav shows) */}
        <button
          onClick={() => handleNav('dashboard')}
          className="lg:hidden flex items-center gap-2 cursor-pointer p-1 -m-1 shrink-0"
          aria-label={t('header.brandHome')}
          title={t('header.brandHome')}
        >
          <img
            src="/logo-clean.png"
            alt="Henglish Academy"
            width={36}
            height={36}
            className="w-9 h-9 object-contain filter drop-shadow-[0_0_10px_rgba(255,209,102,0.45)]"
          />
        </button>

        {/* Desktop top nav bar (>=1024px): main sections with hover dropdowns */}
        <nav aria-label={t('header.navBar')} className="hidden lg:flex items-center gap-0 xl:gap-0.5 text-[10px] xl:text-xs font-bold text-[#dedbf4]">

          {/* 1. Dashboard */}
          <button
            onClick={() => handleNav('dashboard')}
            className={`px-1 xl:px-1.5 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              currentRoute === 'dashboard' || currentRoute === 'home'
                ? 'bg-white/10 text-[#ffd166] font-black'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <span dir="auto">{t('nav.dashboard')}</span>
          </button>

          {/* 2. Courses */}
          <button
            onClick={() => handleNav('courses')}
            className={`px-1 xl:px-1.5 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              currentRoute === 'courses' || currentRoute.startsWith('courses/')
                ? 'bg-white/10 text-[#ffd166] font-black'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <span dir="auto">{t('nav.courses')}</span>
          </button>

          {/* 3. Academies dropdown (hover + click) */}
          <div
            className="relative"
            ref={academiesRef}
            onMouseEnter={() => { setAcademiesMenuOpen(true); setBanksMenuOpen(false); setNotifOpen(false); setProfileOpen(false); }}
            onMouseLeave={() => setAcademiesMenuOpen(false)}
          >
            <button
              onClick={() => {
                setAcademiesMenuOpen(prev => !prev);
                setBanksMenuOpen(false);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
              className={`px-1 xl:px-1.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                ['grammar','vocabulary','listening','speaking','reading','writing','pronunciation'].includes(currentRoute)
                  ? 'bg-linear-to-r from-[#ffd166]/20 to-[#41e7ff]/20 text-[#ffd166] border border-[#ffd166]/40 font-black'
                  : 'hover:text-white hover:bg-white/5'
              }`}
              aria-haspopup="true"
              aria-expanded={academiesMenuOpen}
            >
              <span dir="auto">{t('nav.academies')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${academiesMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {academiesMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-[#171632] border border-white/20 shadow-2xl p-2 z-50 text-left space-y-0.5"
                >
                  {([
                    ['grammar', 'nav.grammar'],
                    ['vocabulary', 'nav.vocabulary'],
                    ['listening', 'nav.listening'],
                    ['speaking', 'nav.speaking'],
                    ['reading', 'nav.reading'],
                    ['writing', 'nav.writing'],
                    ['pronunciation', 'nav.pronunciation'],
                  ] as [PageRoute, string][]).map(([route, key]) => (
                    <button
                      key={route}
                      onClick={() => handleNav(route)}
                      className={`w-full p-2 rounded-xl hover:bg-white/5 text-xs font-bold flex items-center justify-between cursor-pointer ${
                        currentRoute === route ? 'text-[#ffd166] bg-white/5' : 'text-[#dedbf4] hover:text-[#ffd166]'
                      }`}
                    >
                      <span dir="auto">{t(key)}</span>
                      <ChevronLeft className="w-3 h-3 opacity-40" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. Phrase banks dropdown (hover + click) */}
          <div
            className="relative"
            ref={banksRef}
            onMouseEnter={() => { setBanksMenuOpen(true); setAcademiesMenuOpen(false); setNotifOpen(false); setProfileOpen(false); }}
            onMouseLeave={() => setBanksMenuOpen(false)}
          >
            <button
              onClick={() => {
                setBanksMenuOpen(prev => !prev);
                setAcademiesMenuOpen(false);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
              className={`px-1 xl:px-1.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                ['slang','idioms','genz','ielts','toefl','sentences'].includes(currentRoute)
                  ? 'bg-linear-to-r from-[#ffd166]/20 to-[#41e7ff]/20 text-[#ffd166] border border-[#ffd166]/40 font-black'
                  : 'hover:text-white hover:bg-white/5'
              }`}
              aria-haspopup="true"
              aria-expanded={banksMenuOpen}
            >
              <span dir="auto">{t('nav.phraseBanks')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${banksMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {banksMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-[#171632] border border-white/20 shadow-2xl p-2 z-50 text-left space-y-0.5"
                >
                  {([
                    ['slang', 'nav.slang'],
                    ['idioms', 'nav.idioms'],
                    ['genz', 'nav.genz'],
                    ['ielts', 'nav.ielts'],
                    ['toefl', 'nav.toefl'],
                    ['sentences', 'nav.sentences'],
                  ] as [PageRoute, string][]).map(([route, key]) => (
                    <button
                      key={route}
                      onClick={() => handleNav(route)}
                      className={`w-full p-2 rounded-xl hover:bg-white/5 text-xs font-bold flex items-center justify-between cursor-pointer ${
                        currentRoute === route ? 'text-[#ffd166] bg-white/5' : 'text-[#dedbf4] hover:text-[#ffd166]'
                      }`}
                    >
                      <span dir="auto">{t(key)}</span>
                      <ChevronLeft className="w-3 h-3 opacity-40" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Practice */}
          <button
            onClick={() => handleNav('practice')}
            className={`px-1 xl:px-1.5 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              currentRoute === 'practice' || currentRoute === 'games'
                ? 'bg-white/10 text-[#ffd166] font-black'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <span dir="auto">{t('nav.practice')}</span>
          </button>

          {/* 6. Resources */}
          <button
            onClick={() => handleNav('resources')}
            className={`px-1 xl:px-1.5 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              currentRoute === 'resources' || currentRoute === 'sources'
                ? 'bg-white/10 text-[#ffd166] font-black'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <span dir="auto">{t('nav.resources')}</span>
          </button>

          {/* 7. Leaderboard */}
          <button
            onClick={() => handleNav('leaderboard')}
            className={`px-1 xl:px-1.5 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              currentRoute === 'leaderboard'
                ? 'bg-white/10 text-[#ffd166] font-black'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <span dir="auto">{t('header.leaderboard')}</span>
          </button>
        </nav>
      </div>

      {/* RIGHT: Search, Voice Settings, Streak, Notifications, Account */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Search Trigger */}
        <button
          onClick={() => {
            playSound('click');
            onOpenSearch();
          }}
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#dedbf4] hover:text-[#41e7ff] transition-all cursor-pointer"
          title={t('header.searchTitle')}
          aria-label={t('header.searchTitle')}
        >
          <Search className="w-4 h-4 text-[#41e7ff]" />
          <span className="hidden 2xl:inline">{t('header.searchDots')}</span>
          <kbd className="hidden 2xl:inline px-1 py-0.5 rounded text-[9px] bg-black/40 border border-white/10 text-[#b9b6d5]">
            Ctrl K
          </kbd>
        </button>

        {/* Voice Control Modal Trigger (Natural Male / Preserved Female Voice) */}
        <button
          onClick={() => {
            playSound('click');
            onOpenVoiceSettings();
          }}
          className="hidden xl:block p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#dedbf4] hover:text-[#ffd166] transition-colors cursor-pointer"
          title={t('header.voiceTitle')}
          aria-label={t('header.voiceShort')}
        >
          <Volume2 className="w-4 h-4 text-[#ffd166]" />
        </button>

        {/* Streak Indicator */}
        <div 
          className="hidden xl:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-linear-to-r from-[#ff4f9a]/15 to-[#ffd166]/15 border border-[#ff4f9a]/30 text-xs font-black text-[#ffd166]"
          title={t('header.streakTitle').replace('{days}', userProfile.streakDays.toLocaleString('en-US'))}
          aria-label={t('header.streakTitle').replace('{days}', userProfile.streakDays.toLocaleString('en-US'))}
          data-testid="header-streak"
        >
          <Flame className="w-4 h-4 text-[#ff4f9a]" />
          <span dir="ltr" className="tabular-nums">{userProfile.streakDays.toLocaleString('en-US')}</span><span className="hidden sm:inline">{t('header.days')}</span>
        </div>

        {/* Notifications Popover (on mobile it opens from the overflow menu) */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              playSound('click');
              setNotifOpen(prev => !prev);
              setProfileOpen(false);
              setAcademiesMenuOpen(false);
              setBanksMenuOpen(false);
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#dedbf4] hover:text-white transition-colors relative cursor-pointer"
            aria-label={t('header.notificationsShort')}
            title={t('header.notifications')}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff4f9a] text-[10px] font-black text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute left-0 mt-3 w-80 sm:w-96 max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:w-auto max-sm:top-24 rounded-2xl bg-[#171632] border border-white/20 shadow-2xl p-4 z-50 text-right space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#ffd166]" />
                  {t('header.notificationsFeed')}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => onMarkAllNotificationsRead()}
                    className="text-[11px] text-[#41e7ff] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span dir="auto">{t('header.markAllRead')}</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 custom-scrollbar">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onMarkNotificationRead(n.id);
                      if (n.actionRoute) {
                        handleNav(n.actionRoute);
                      }
                    }}
                    className={`p-2.5 rounded-xl text-right transition-colors cursor-pointer border ${
                      n.read
                        ? 'bg-white/5 border-transparent text-[#b9b6d5]'
                        : 'bg-linear-to-r from-[#41e7ff]/10 to-transparent border-[#41e7ff]/30 text-white font-semibold'
                    }`}
                  >
                    <div className="text-xs font-bold mb-1 flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#b9b6d5]/70 font-normal">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Auth Menu. Signed-in: hidden on mobile (lives at the
            top of the burger drawer). Guest: the one-word دخول button stays
            visible on every screen size (Hinawi: sign-in is one word). */}
        <div className={`relative ${authSessionType === 'guest' ? '' : 'hidden md:block'}`} ref={profileRef}>
          <button
            onClick={() => {
              playSound('click');
              setProfileOpen(prev => !prev);
              setNotifOpen(false);
              setAcademiesMenuOpen(false);
              setBanksMenuOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            aria-label={t('header.accountMenu')}
          >
            {authSessionType === 'guest' ? (
              <span className="flex items-center gap-1.5 px-1 sm:px-2">
                <LogIn className="w-4 h-4 text-[#c4ff55]" />
                <span className="text-xs font-black text-white whitespace-nowrap">{t('header.login')}</span>
              </span>
            ) : (
              <>
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-lg object-cover border border-[#ffd166]/40"
                />
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-black text-white leading-tight flex items-center gap-1">
                    {userProfile.nameAr}
                    <ChevronDown className="w-3 h-3 text-[#b9b6d5]" />
                  </span>
                  <span className="text-[10px] text-[#ffd166] font-semibold leading-tight">
                    {userProfile.role === 'teacher' ? t('header.certifiedTeacher') : t('header.levelShort').replace('{level}', userProfile.currentLevel)}
                  </span>
                </div>
              </>
            )}
          </button>

          {profileOpen && (
            <div className="absolute end-0 mt-3 w-72 max-w-[calc(100vw-1rem)] rounded-2xl bg-[#171632] border border-white/20 shadow-2xl p-4 z-50 text-right space-y-3">
              {/* Profile Card Summary */}
              {authSessionType === 'guest' ? (
                <div className="pb-3 border-b border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#b9b6d5]" />
                    </div>
                    <div className="min-w-0">
                      <div dir="auto" className="text-sm font-black text-white">{t('header.guestTitle')}</div>
                      <div dir="auto" className="text-[11px] text-[#b9b6d5] leading-relaxed mt-0.5">
                        {t('header.guestBody')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playSound('click');
                      onOpenAuthModal('register');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#c4ff55] text-[#09091a] font-black hover:brightness-110 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span dir="auto">{t('header.createAccount')}</span>
                  </button>
                  <button
                    onClick={() => {
                      playSound('click');
                      onOpenAuthModal('login');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/15 text-white font-bold hover:bg-white/10 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-[#41e7ff]" />
                    <span dir="auto">{t('header.login')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-11 h-11 rounded-xl object-cover border-2 border-[#ffd166]"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-black text-white truncate">{userProfile.nameAr}</div>
                    <div className="text-xs text-[#b9b6d5] truncate">{userProfile.email}</div>
                    <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-[#ffd166]/20 text-[#ffd166]">
                      <span>{userProfile.role === 'teacher' ? t('header.rankTeacher') : t('header.cefrLevel').replace('{level}', userProfile.currentLevel)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile tools: search, notifications, voice, settings */}
              <div className="md:hidden pb-3 border-b border-white/10 space-y-1">
                <button
                  onClick={() => {
                    playSound('click');
                    setProfileOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#41e7ff]" />
                  {t('header.search')}
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    setProfileOpen(false);
                    onOpenVoiceSettings();
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-[#c4ff55]" />
                  {t('header.voice')}
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    setProfileOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#b9b6d5]" />
                  {t('header.settings')}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5 text-xs">
                {/* Account Management */}
                {authSessionType === 'authenticated' && (
                  <button
                    onClick={() => {
                      playSound('click');
                      setAccountOpen(true);
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-linear-to-r from-[#ffd166]/20 to-[#41e7ff]/20 border border-[#ffd166]/40 text-white font-bold hover:brightness-110 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#ffd166]" />
                      <span dir="auto">{t('header.accountManage')}</span>
                    </span>
                    <ChevronLeft className="w-4 h-4 text-[#ffd166]" />
                  </button>
                )}

                <button onClick={() => handleNav('leaderboard')} className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#dedbf4] hover:bg-white/5"><Award className="w-4 h-4 text-[#ffd166]"/><span dir="auto">{t('header.leaderboard')}</span></button>

                {userProfile.email?.toLowerCase() === '3asfuur@gmail.com' && <button onClick={() => handleNav('admin')} className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#dedbf4] hover:bg-white/5"><ShieldCheck className="w-4 h-4 text-[#ffd166]"/><span dir="auto">{t('header.adminPanel')}</span></button>}

                <button
                  onClick={() => handleNav('my-learning')}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#41e7ff]" />
                  <span dir="auto">{t('header.mySpaceNotes')}</span>
                </button>

                <button
                  onClick={() => handleNav('certificates')}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#ffd166]" />
                  <span dir="auto">{t('header.myCertificates')}</span>
                </button>

                {authSessionType !== 'guest' && (
                  <button
                    onClick={() => {
                      playSound('click');
                      onToggleRole();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-[#dedbf4] hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#c4ff55]" />
                      <span>{t('header.roleToggle')}{userProfile.role === 'student' ? t('header.teacher') : t('header.student')}</span>
                    </span>
                  </button>
                )}

                {authSessionType === 'authenticated' && (
                  <button
                    onClick={() => {
                      playSound('click');
                      onOpenSettings();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#41e7ff]" />
                    <span dir="auto">{t('settings.title')}</span>
                  </button>
                )}

                {onSignOut && authSessionType === 'authenticated' && (
                  <button
                    onClick={() => {
                      playSound('click');
                      setProfileOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer border border-red-500/20 font-bold"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span dir="auto">{t('header.logout')}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {isAr && mobileMenuButton}
      </div>

      {/* Account Management Modal */}
      <AnimatePresence>
        {accountOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setAccountOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-linear-to-b from-[#1b1939] to-[#0c0b20] border border-white/20 p-6 sm:p-7 space-y-5 shadow-2xl text-right"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#ffd166] shadow-lg"
                  />
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-white truncate">{userProfile.nameAr}</h3>
                    <div className="text-xs text-[#b9b6d5] truncate flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span dir="ltr">{userProfile.email}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black px-2 py-0.5 rounded-md bg-[#ffd166]/20 text-[#ffd166]">
                      {userProfile.role === 'teacher' ? t('header.rankTeacher') : t('header.cefrLevel').replace('{level}', userProfile.currentLevel)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAccountOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => {
                    playSound('click');
                    setAccountOpen(false);
                    onNavigate('my-learning');
                  }}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#41e7ff]" />
                  <span dir="auto">{t('header.mySpaceProgress')}</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    setAccountOpen(false);
                    onNavigate('certificates');
                  }}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#ffd166]" />
                  <span dir="auto">{t('header.myCertificatesShort')}</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    setAccountOpen(false);
                    onNavigate('forgot-password');
                  }}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[#c4ff55]" />
                  <span dir="auto">{t('header.changePassword')}</span>
                </button>

                {onSignOut && (
                  <button
                    onClick={() => {
                      playSound('click');
                      setAccountOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer border border-red-500/20 font-bold"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span dir="auto">{t('header.logout')}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
