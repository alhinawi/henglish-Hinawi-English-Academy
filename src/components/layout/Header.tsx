import React, { useState, useRef, useEffect } from 'react';
import { PageRoute, UserProfile, AppNotification } from '../../types';
import { playSound } from '../../utils/audio';
import {
  Menu,
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
} from 'lucide-react';

interface HeaderProps {
  currentRoute: PageRoute;
  activeLessonId?: string;
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  onOpenMobile: () => void;
  onOpenSearch: () => void;
  userProfile: UserProfile;
  notifications: AppNotification[];
  unreadCount: number;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onToggleRole: () => void;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  activeLessonId,
  onNavigate,
  onOpenMobile,
  onOpenSearch,
  userProfile,
  notifications,
  unreadCount,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onToggleRole,
  onResetProgress,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs: { label: string; route?: PageRoute }[] = [
      { label: 'الرئيسية', route: 'dashboard' },
    ];

    if (currentRoute === 'courses') {
      crumbs.push({ label: 'الكورسات' });
    } else if (currentRoute === 'grammar' || currentRoute === 'courses/grammar') {
      crumbs.push({ label: 'أكاديمية الجرامر' });
    } else if (currentRoute === 'courses/grammar/future-perfect') {
      crumbs.push({ label: 'أكاديمية الجرامر', route: 'grammar' });
      crumbs.push({ label: 'المستقبل التام الشامل' });
    } else if (currentRoute === 'lesson') {
      crumbs.push({ label: 'أكاديمية الجرامر', route: 'grammar' });
      crumbs.push({ label: 'المستقبل التام', route: 'courses/grammar/future-perfect' });
      crumbs.push({ label: activeLessonId ? `درس ${activeLessonId.replace('lesson-', '#')}` : 'الدرس التفاعلي' });
    } else if (currentRoute === 'vocabulary') {
      crumbs.push({ label: 'أكاديمية الكلمات والأفعال' });
    } else if (currentRoute === 'speaking') {
      crumbs.push({ label: 'أكاديمية المحادثة والطلاقة' });
    } else if (currentRoute === 'listening') {
      crumbs.push({ label: 'أكاديمية الاستماع' });
    } else if (currentRoute === 'reading') {
      crumbs.push({ label: 'أكاديمية القراءة والفهم' });
    } else if (currentRoute === 'writing') {
      crumbs.push({ label: 'أكاديمية الكتابة' });
    } else if (currentRoute === 'pronunciation') {
      crumbs.push({ label: 'أكاديمية النطق والفونيتكس' });
    } else if (currentRoute === 'real-life') {
      crumbs.push({ label: 'إنجليزي المواقف الحقيقية' });
    } else if (currentRoute === 'exams') {
      crumbs.push({ label: 'تحديد المستوى والاختبارات' });
    } else if (currentRoute === 'practice') {
      crumbs.push({ label: 'معمل التمارين' });
    } else if (currentRoute === 'my-learning') {
      crumbs.push({ label: 'مساحتي الخاصة' });
    } else if (currentRoute === 'admin') {
      crumbs.push({ label: 'استوديو المعلم والمحتوى' });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#0c0b20]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4">
      
      {/* Left: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-xl text-[#dedbf4] hover:text-white hover:bg-white/5 cursor-pointer"
          aria-label="فتح القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="مسار التنقل" className="hidden sm:flex items-center gap-1.5 text-xs text-[#b9b6d5] font-semibold truncate">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-white/30 text-[10px]">/</span>}
                {crumb.route && !isLast ? (
                  <button
                    onClick={() => {
                      playSound('click');
                      onNavigate(crumb.route!);
                    }}
                    className="hover:text-[#41e7ff] transition-colors cursor-pointer truncate"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className={isLast ? 'text-[#ffd166] font-bold truncate' : 'truncate'}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Search, Streak, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        
        {/* Search Trigger */}
        <button
          onClick={() => {
            playSound('click');
            onOpenSearch();
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#dedbf4] hover:text-[#41e7ff] transition-all cursor-pointer"
          title="بحث شامل في الأكاديميات (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-[#41e7ff]" />
          <span className="hidden md:inline">بحث في المنصة...</span>
          <kbd className="hidden lg:inline px-1.5 py-0.5 rounded text-[10px] bg-black/40 border border-white/10 text-[#b9b6d5]">
            Ctrl K
          </kbd>
        </button>

        {/* Streak Indicator */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff4f9a]/15 to-[#ffd166]/15 border border-[#ff4f9a]/30 text-xs font-black text-[#ffd166]"
          title={`استمرارية التعلم: ${userProfile.streakDays} أيام متتالية`}
        >
          <Flame className="w-4 h-4 text-[#ff4f9a] animate-pulse" />
          <span>{userProfile.streakDays} أيام</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              playSound('click');
              setNotifOpen(prev => !prev);
              setProfileOpen(false);
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
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#171632] border border-white/15 shadow-2xl p-4 z-50 text-right space-y-3">
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
                        onNavigate(n.actionRoute);
                        setNotifOpen(false);
                      }
                    }}
                    className={`p-2.5 rounded-xl text-right transition-colors cursor-pointer border ${
                      n.read
                        ? 'bg-white/5 border-transparent text-[#b9b6d5]'
                        : 'bg-gradient-to-r from-[#41e7ff]/10 to-transparent border-[#41e7ff]/30 text-white font-semibold'
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

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              playSound('click');
              setProfileOpen(prev => !prev);
              setNotifOpen(false);
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
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-3 w-72 rounded-2xl bg-[#171632] border border-white/15 shadow-2xl p-4 z-50 text-right space-y-3">
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
                {/* Switch Role Feature */}
                <button
                  onClick={() => {
                    playSound('click');
                    onToggleRole();
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#ffd166]/15 to-[#ff4f9a]/15 border border-[#ffd166]/30 text-white font-bold hover:brightness-110 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#ffd166]" />
                    <span>تبديل الدور: {userProfile.role === 'student' ? 'المعلم / الإدارة' : 'الطالب'}</span>
                  </span>
                  <span className="text-[10px] text-[#ffd166] font-black underline">تبديل</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    onNavigate('my-learning');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#41e7ff]" />
                  <span>مساحتي الخاصة والملاحظات</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    onNavigate('dashboard');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#c4ff55]" />
                  <span>لوحة التحكم الرئيسية</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('هل أنت متأكد من رغبتك في إعادة ضبط بيانات التقدم التجريبية؟')) {
                      playSound('click');
                      onResetProgress();
                      setProfileOpen(false);
                    }
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#ff8bb9] hover:bg-[#ff4f9a]/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#ff4f9a]" />
                  <span>إعادة تعيين التقدم التجريبي</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
