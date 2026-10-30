import React, { useState } from 'react';
import { PageRoute, UserProfile, AppNotification } from '../../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from '../Footer';

interface MainLayoutProps {
  currentRoute: PageRoute;
  activeLessonId?: string;
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  onOpenSearch: () => void;
  userProfile: UserProfile;
  notifications: AppNotification[];
  unreadCount: number;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onToggleRole: () => void;
  onResetProgress: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentRoute,
  activeLessonId,
  onNavigate,
  onOpenSearch,
  userProfile,
  notifications,
  unreadCount,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onToggleRole,
  onResetProgress,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0c0b20] text-[#f7f5ff] selection:bg-[#ff4f9a]/30 selection:text-[#ffd166]">
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
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header
          currentRoute={currentRoute}
          activeLessonId={activeLessonId}
          onNavigate={onNavigate}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenSearch={onOpenSearch}
          userProfile={userProfile}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkNotificationRead={onMarkNotificationRead}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          onToggleRole={onToggleRole}
          onResetProgress={onResetProgress}
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
