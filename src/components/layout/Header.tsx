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
  Lock
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
  onOpenAuthModal: (tab?: 'login' | 'register' | 'demo' | 'migrate') => void;
  userProfile: UserProfile;
  notifications: AppNotification[];
  unreadCount: number;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onToggleRole: () => void;
  onResetProgress: () => void;
  onSignOut?: () => void;
  authSessionType?: 'guest' | 'demo' | 'authenticated';
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
  const [grammarMenuOpen, setGrammarMenuOpen] = useState(false);
  const [skillsMenuOpen, setSkillsMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const grammarRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close all dropdowns on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (grammarRef.current && !grammarRef.current.contains(target)) {
        setGrammarMenuOpen(false);
      }
      if (skillsRef.current && !skillsRef.current.contains(target)) {
        setSkillsMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(target)) {
        setMoreMenuOpen(false);
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
        setGrammarMenuOpen(false);
        setSkillsMenuOpen(false);
        setMoreMenuOpen(false);
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
    setGrammarMenuOpen(false);
    setSkillsMenuOpen(false);
    setMoreMenuOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
    onNavigate(route, lessonId);
  };

  return (
    <header className="sticky top-0 z-50 h-20 bg-[#0c0b20]/95 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-3 select-none">
      
      {/* LEFT: Mobile Menu Hamburger & Desktop Main Navigation Menus */}
      <div className="flex items-center gap-3 xl:gap-4 min-w-0">
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
          aria-label={mobileOpen ? 'إغلاق القائمة الجانبية' : 'فتح القائمة الجانبية'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5 text-[#ffd166]" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop Primary Navigation with Non-Clipped Dropdowns */}
        <nav aria-label="شريط التنقل العلوي" className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-[#dedbf4]">
          
          {/* 1. Home Link */}
          <button
            onClick={() => handleNav('dashboard')}
            className={`px-3 py-2 rounded-xl transition-colors cursor-pointer ${
              currentRoute === 'dashboard' || currentRoute === 'home'
                ? 'bg-white/10 text-[#ffd166] font-black'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            الرئيسية
          </button>

          {/* 2. Grammar Academy Dropdown */}
          <div className="relative" ref={grammarRef}>
            <button
              onClick={() => {
                setGrammarMenuOpen(prev => !prev);
                setSkillsMenuOpen(false);
                setMoreMenuOpen(false);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRoute === 'grammar' || currentRoute.startsWith('courses/grammar')
                  ? 'bg-linear-to-r from-[#ffd166]/20 to-[#41e7ff]/20 text-[#ffd166] border border-[#ffd166]/40 font-black'
                  : 'hover:text-white hover:bg-white/5'
              }`}
              aria-haspopup="true"
              aria-expanded={grammarMenuOpen}
            >
              <span>أكاديمية الجرامر 🦅</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${grammarMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu (Positioned safely within viewport) */}
            <AnimatePresence>
              {grammarMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-[#171632] border border-white/20 shadow-2xl p-3 z-50 text-right space-y-1.5"
                >
                  <button
                    onClick={() => handleNav('grammar')}
                    className="w-full p-2.5 rounded-xl bg-linear-to-r from-[#ffd166]/15 to-[#41e7ff]/15 hover:brightness-110 text-white font-black text-xs flex items-center justify-between cursor-pointer border border-[#ffd166]/30"
                  >
                    <span>فهرس القواعد الشامل (16 قاعدة) 📖</span>
                    <span className="text-[10px] text-[#ffd166]">A1 - C1</span>
                  </button>

                  <div className="pt-1 pb-1 border-t border-white/10 text-[10px] text-[#b9b6d5] font-bold px-2">
                    أهم الدروس المباشرة:
                  </div>

                  <button
                    onClick={() => handleNav('courses/grammar/future-perfect')}
                    className="w-full p-2 rounded-xl hover:bg-white/5 text-[#41e7ff] hover:text-white text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>المستقبل التام الشامل ⚡ (كورس رائد)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#41e7ff]/20 text-[#41e7ff]">B2</span>
                  </button>

                  <button
                    onClick={() => {
                      window.location.hash = 'grammar/future-simple';
                      handleNav('grammar');
                    }}
                    className="w-full p-2 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#ffd166] text-xs font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span>المستقبل البسيط: Will مقابل Going to</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">A2</span>
                  </button>

                  <button
                    onClick={() => {
                      window.location.hash = 'grammar/present-simple';
                      handleNav('grammar');
                    }}
                    className="w-full p-2 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#ffd166] text-xs font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span>المضارع البسيط: العادات والحقائق الثابتة</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">A1</span>
                  </button>

                  <button
                    onClick={() => {
                      window.location.hash = 'grammar/present-perfect';
                      handleNav('grammar');
                    }}
                    className="w-full p-2 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#ffd166] text-xs font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span>المضارع التام: الخبرات وأثر الماضي</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">A2</span>
                  </button>

                  <button
                    onClick={() => {
                      window.location.hash = 'grammar/conditionals-all';
                      handleNav('grammar');
                    }}
                    className="w-full p-2 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#ffd166] text-xs font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span>حالات لو والشرط الأربعة (Conditionals 0-3)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">B1</span>
                  </button>

                  <button
                    onClick={() => {
                      window.location.hash = 'grammar/passive-voice';
                      handleNav('grammar');
                    }}
                    className="w-full p-2 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#ffd166] text-xs font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span>المبني للمجهول (Passive Voice) الشامل</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">B2</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Skills Academies Dropdown */}
          <div className="relative" ref={skillsRef}>
            <button
              onClick={() => {
                setSkillsMenuOpen(prev => !prev);
                setGrammarMenuOpen(false);
                setMoreMenuOpen(false);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
              className="px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 hover:text-white hover:bg-white/5"
              aria-haspopup="true"
              aria-expanded={skillsMenuOpen}
            >
              <span>الأكاديميات المهارية 🎯</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${skillsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {skillsMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#171632] border border-white/20 shadow-2xl p-3 z-50 text-right space-y-1.5"
                >
                  <button
                    onClick={() => handleNav('vocabulary')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#41e7ff] text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>أكاديمية الكلمات وتصريف V1-V3 📚</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">معجم</span>
                  </button>
                  <button
                    onClick={() => handleNav('speaking')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#41e7ff] text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>أكاديمية المحادثة والطلاقة 🗣️</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">حوار</span>
                  </button>
                  <button
                    onClick={() => handleNav('listening')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#41e7ff] text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>أكاديمية الاستماع والفهم 🎧</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">لهجات</span>
                  </button>
                  <button
                    onClick={() => handleNav('reading')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#41e7ff] text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>أكاديمية القراءة واستيعاب النصوص 📖</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">نصوص</span>
                  </button>
                  <button
                    onClick={() => handleNav('writing')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#41e7ff] text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>أكاديمية الكتابة والمراسلات ✍️</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">إيميل</span>
                  </button>
                  <button
                    onClick={() => handleNav('pronunciation')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-[#dedbf4] hover:text-[#41e7ff] text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>أكاديمية النطق والفونيتكس 🎙️</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#ffd166]">IPA</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. Real-Life English Simulator */}
          <button
            onClick={() => handleNav('real-life')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              currentRoute === 'real-life'
                ? 'bg-white/10 text-[#ffd166] font-black'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            إنجليزي المواقف الحقيقية 🌍
          </button>

          {/* 5. AI English Tutor */}
          <button
            onClick={() => handleNav('ai-tutor')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              currentRoute === 'ai-tutor'
                ? 'bg-linear-to-r from-[#ffd166]/20 to-[#41e7ff]/20 text-[#ffd166] border border-[#ffd166]/40 font-black'
                : 'text-[#41e7ff] hover:bg-white/5'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>المعلم الذكي AI 🤖</span>
          </button>

          {/* 6. Placement & Exams */}
          <button
            onClick={() => handleNav('exams')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              currentRoute === 'exams'
                ? 'bg-white/10 text-[#ffd166] font-black'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            تحديد المستوى 🎯
          </button>

          {/* 7. Certificates & Verification */}
          <button
            onClick={() => handleNav('certificates')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              currentRoute === 'certificates'
                ? 'bg-white/10 text-[#ffd166] font-black'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            الشهادات 📜
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
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#dedbf4] hover:text-[#41e7ff] transition-all cursor-pointer"
          title="بحث شامل في الأكاديميات (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-[#41e7ff]" />
          <span className="hidden md:inline">بحث...</span>
          <kbd className="hidden lg:inline px-1 py-0.5 rounded text-[9px] bg-black/40 border border-white/10 text-[#b9b6d5]">
            Ctrl K
          </kbd>
        </button>

        {/* Voice Control Modal Trigger (Natural Male / Preserved Female Voice) */}
        <button
          onClick={() => {
            playSound('click');
            onOpenVoiceSettings();
          }}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#dedbf4] hover:text-[#ffd166] transition-colors cursor-pointer"
          title="إعدادات الصوت والنطق الصوتي (ذكر / أنثى طبيعي)"
          aria-label="إعدادات الصوت"
        >
          <Volume2 className="w-4 h-4 text-[#ffd166]" />
        </button>

        {/* Streak Indicator */}
        <div 
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-linear-to-r from-[#ff4f9a]/15 to-[#ffd166]/15 border border-[#ff4f9a]/30 text-xs font-black text-[#ffd166]"
          title={`استمرارية التعلم: ${userProfile.streakDays} أيام متتالية`}
        >
          <Flame className="w-4 h-4 text-[#ff4f9a] animate-pulse" />
          <span className="hidden sm:inline">{userProfile.streakDays} أيام</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              playSound('click');
              setNotifOpen(prev => !prev);
              setProfileOpen(false);
              setGrammarMenuOpen(false);
              setSkillsMenuOpen(false);
            }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#dedbf4] hover:text-white transition-colors relative cursor-pointer"
            aria-label="الإشعارات"
            title="الإشعارات والتحديثات"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff4f9a] text-[10px] font-black text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute left-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#171632] border border-white/20 shadow-2xl p-4 z-50 text-right space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#ffd166]" />
                  الإشعارات الأكاديمية
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => onMarkAllNotificationsRead()}
                    className="text-[11px] text-[#41e7ff] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    تحديد الكل كمقروء
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

        {/* User Account / Auth Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              playSound('click');
              setProfileOpen(prev => !prev);
              setNotifOpen(false);
              setGrammarMenuOpen(false);
              setSkillsMenuOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            aria-label="قائمة الحساب"
          >
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
                {userProfile.role === 'teacher' ? 'مدرس معتمد 🎓' : `مستوى ${userProfile.currentLevel}`}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute left-0 mt-3 w-72 rounded-2xl bg-[#171632] border border-white/20 shadow-2xl p-4 z-50 text-right space-y-3">
              {/* Profile Card Summary */}
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
                    <span>{userProfile.role === 'teacher' ? 'رتبة: معلم وأستاذ 👨‍🏫' : `مستوى CEFR: ${userProfile.currentLevel}`}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5 text-xs">
                {/* Auth Modal Trigger / Account Switch */}
                <button
                  onClick={() => {
                    playSound('click');
                    onOpenAuthModal('login');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-linear-to-r from-[#ffd166]/20 to-[#41e7ff]/20 border border-[#ffd166]/40 text-white font-bold hover:brightness-110 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#ffd166]" />
                    <span>إدارة الحساب ووضع الـ Demo</span>
                  </span>
                  <span className="text-[10px] text-[#ffd166] font-black underline">تغيير</span>
                </button>

                <button
                  onClick={() => handleNav('my-learning')}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#41e7ff]" />
                  <span>مساحتي الخاصة والملاحظات</span>
                </button>

                <button
                  onClick={() => handleNav('certificates')}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#ffd166]" />
                  <span>شهاداتي المعتمدة والتوثيق</span>
                </button>

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
                    <span>تبديل الدور: {userProfile.role === 'student' ? 'المعلم' : 'الطالب'}</span>
                  </span>
                </button>

                {onSignOut && (
                  <button
                    onClick={() => {
                      playSound('click');
                      setProfileOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer border border-red-500/20 font-bold"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>تسجيل الخروج من الحساب</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
