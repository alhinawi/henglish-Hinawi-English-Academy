import React, { useState } from 'react';
import { PageRoute, UserProfile, AppNotification } from '../../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from '../Footer';
import { useLanguage } from '../../i18n/LanguageContext';

interface MainLayoutProps {
  currentRoute: PageRoute;
  activeLessonId?: string;
  onNavigate: (route: PageRoute, lessonId?: string) => void;
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
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentRoute,
  activeLessonId,
  onNavigate,
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
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on desktop breakpoints
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile drawer is open to prevent background scrolling
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Physical layout stays identical in every language: sidebar pinned to the
  // right edge, content column to its left (flex order locked via dir="ltr").
  const { dir } = useLanguage();
  return (
    <div dir="ltr" className="min-h-screen flex bg-[#0c0b20] text-[#f7f5ff] selection:bg-[#ff4f9a]/30 selection:text-[#ffd166]">
      {/* Collapsible Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(prev => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        userRole={userProfile.role}
        cefrLevel={userProfile.currentLevel}
        xp={userProfile.xp}
        userProfile={userProfile}
        authSessionType={authSessionType}
        onOpenSettings={onOpenSettings}
        onOpenAuthModal={onOpenAuthModal}
        onToggleRole={onToggleRole}
        onSignOut={onSignOut}
      />

      {/* Main Content Area - no overflow-x-hidden on parent of Header to prevent dropdown clipping */}
      <div dir={dir} className="flex-1 flex flex-col min-w-0 min-h-screen relative order-1">
        {/* Top Header */}
        <Header
          currentRoute={currentRoute}
          activeLessonId={activeLessonId}
          onNavigate={onNavigate}
          mobileOpen={mobileOpen}
          onToggleMobile={() => setMobileOpen(prev => !prev)}
          onCloseMobile={() => setMobileOpen(false)}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenSearch={onOpenSearch}
          onOpenVoiceSettings={onOpenVoiceSettings}
          onOpenSettings={onOpenSettings}
          onOpenAuthModal={onOpenAuthModal}
          userProfile={userProfile}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkNotificationRead={onMarkNotificationRead}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          onToggleRole={onToggleRole}
          onResetProgress={onResetProgress}
          onSignOut={onSignOut}
          authSessionType={authSessionType}
        />

        {/* Page Content Body */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};
