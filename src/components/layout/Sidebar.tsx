import React from 'react';
import { PageRoute, CEFRLevel, UserRole } from '../../types';
import { Logo } from '../Logo';
import { playSound } from '../../utils/audio';
import {
  LayoutDashboard,
  GraduationCap,
  BookA,
  Mic,
  Headphones,
  BookOpen,
  PenTool,
  Volume2,
  Compass,
  FileCheck2,
  Gamepad2,
  BookmarkCheck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  X,
  Flame,
  Bot,
  Globe,
  Award,
} from 'lucide-react';

interface SidebarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  userRole: UserRole;
  cefrLevel: CEFRLevel;
  xp: number;
}

interface NavGroup {
  groupTitle: string;
  items: {
    label: string;
    labelEn: string;
    route: PageRoute;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    isFlagship?: boolean;
    adminOnly?: boolean;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  userRole,
  cefrLevel,
  xp,
}) => {
  const handleNav = (route: PageRoute) => {
    playSound('click');
    onNavigate(route);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'الرئيسية واللوحة',
      items: [
        {
          label: 'لوحة التحكم',
          labelEn: 'Dashboard',
          route: 'dashboard',
          icon: LayoutDashboard,
        },
        {
          label: 'الكورسات الشاملة',
          labelEn: 'Courses Catalog',
          route: 'courses',
          icon: Layers,
        },
      ],
    },
    {
      groupTitle: 'الأكاديميات الأساسية (A1 - C2)',
      items: [
        {
          label: 'أكاديمية الجرامر',
          labelEn: 'Grammar Academy',
          route: 'grammar',
          icon: GraduationCap,
          badge: '16 قاعدة',
        },
        {
          label: 'المستقبل التام ⚡',
          labelEn: 'Future Perfect',
          route: 'courses/grammar/future-perfect',
          icon: Sparkles,
          isFlagship: true,
          badge: 'كورس رائد',
        },
        {
          label: 'أكاديمية الكلمات',
          labelEn: 'Vocabulary Academy',
          route: 'vocabulary',
          icon: BookA,
          badge: 'V1-V3',
        },
        {
          label: 'أكاديمية المحادثة',
          labelEn: 'Speaking Academy',
          route: 'speaking',
          icon: Mic,
        },
        {
          label: 'أكاديمية الاستماع',
          labelEn: 'Listening Academy',
          route: 'listening',
          icon: Headphones,
        },
        {
          label: 'أكاديمية القراءة',
          labelEn: 'Reading Academy',
          route: 'reading',
          icon: BookOpen,
        },
        {
          label: 'أكاديمية الكتابة',
          labelEn: 'Writing Academy',
          route: 'writing',
          icon: PenTool,
        },
        {
          label: 'أكاديمية النطق والفونيتكس',
          labelEn: 'Pronunciation Academy',
          route: 'pronunciation',
          icon: Volume2,
          badge: 'IPA',
        },
        {
          label: 'إنجليزي المواقف الحقيقية',
          labelEn: 'Real-Life English',
          route: 'real-life',
          icon: Compass,
        },
        {
          label: 'المعلم الذكي AI 🤖',
          labelEn: 'AI English Tutor',
          route: 'ai-tutor' as PageRoute,
          icon: Bot,
          badge: 'وكيل AI',
        },
        {
          label: 'العالم الافتراضي 3D 🏛️',
          labelEn: '3D Campus World',
          route: 'world-3d' as PageRoute,
          icon: Globe,
          badge: 'Three.js',
        },
      ],
    },
    {
      groupTitle: 'المعمل والشهادات',
      items: [
        {
          label: 'تحديد المستوى والاختبارات',
          labelEn: 'Exams & Placement',
          route: 'exams',
          icon: FileCheck2,
          badge: 'CEFR',
        },
        {
          label: 'الشهادات والتوثيق 📜',
          labelEn: 'Certificates',
          route: 'certificates' as PageRoute,
          icon: Award,
          badge: 'رسمي',
        },
        {
          label: 'معمل التمارين والألعاب',
          labelEn: 'Practice Lab',
          route: 'practice',
          icon: Gamepad2,
        },
      ],
    },
    {
      groupTitle: 'مساحتي الخاصة',
      items: [
        {
          label: 'تعلمي والملاحظات',
          labelEn: 'My Learning & Notes',
          route: 'my-learning',
          icon: BookmarkCheck,
        },
      ],
    },
    {
      groupTitle: 'الإدارة الأكاديمية',
      items: [
        {
          label: 'لوحة المعلم والمحتوى',
          labelEn: 'Teacher / Content Studio',
          route: 'admin',
          icon: ShieldCheck,
          badge: userRole === 'student' ? 'معلم' : 'نشط',
          adminOnly: false,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0c0b20] border-l border-white/10 select-none text-right">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <button
          onClick={() => handleNav('dashboard')}
          className="flex items-center gap-3 cursor-pointer focus:outline-none"
          title="الرئيسية هناوي إنجلش"
        >
          <Logo size="sm" showText={!collapsed} />
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-2 rounded-xl text-[#b9b6d5] hover:text-white hover:bg-white/5 cursor-pointer"
          aria-label="إغلاق القائمة"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-[#b9b6d5] hover:text-[#41e7ff] hover:bg-white/5 cursor-pointer transition-colors"
          title={collapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
          aria-label="تبديل عرض القائمة"
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* User Level Strip (when expanded) */}
      {!collapsed && (
        <div className="mx-3 my-3 p-3 rounded-2xl bg-gradient-to-r from-[#ffd166]/10 via-[#41e7ff]/10 to-transparent border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ffd166]/20 border border-[#ffd166]/40 flex items-center justify-center font-black text-[#ffd166] text-xs">
              {cefrLevel}
            </div>
            <div>
              <div className="text-xs font-bold text-white">المستوى الحالي</div>
              <div className="text-[11px] text-[#41e7ff] font-semibold">{xp.toLocaleString()} XP</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-black text-[#ff8bb9] bg-[#ff4f9a]/15 px-2 py-0.5 rounded-full border border-[#ff4f9a]/30">
            <Flame className="w-3 h-3 text-[#ff4f9a]" />
            <span>نشط</span>
          </div>
        </div>
      )}

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-5 custom-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-black uppercase tracking-wider text-[#b9b6d5]/70 mb-1">
                {group.groupTitle}
              </h3>
            )}
            {group.items.map(item => {
              const isActive =
                currentRoute === item.route ||
                (item.route === 'grammar' && currentRoute === 'courses/grammar') ||
                (item.route === 'dashboard' && currentRoute === 'home');
              const Icon = item.icon;

              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group text-right ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ffd166]/20 to-[#41e7ff]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-[0_0_15px_rgba(255,209,102,0.15)] font-black'
                      : item.isFlagship
                      ? 'text-[#41e7ff] hover:bg-white/5 border border-[#41e7ff]/25'
                      : 'text-[#dedbf4] hover:text-[#41e7ff] hover:bg-white/5 border border-transparent'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-[#ffd166]'
                        : item.isFlagship
                        ? 'text-[#41e7ff]'
                        : 'text-[#b9b6d5] group-hover:text-[#41e7ff]'
                    }`}
                  />

                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                            item.isFlagship
                              ? 'bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30'
                              : 'bg-white/10 text-[#ffd166] border border-white/10'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer info in sidebar */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10 text-center">
          <div className="text-[11px] text-[#b9b6d5]">
            <span className="font-bold text-white">Hinawi Academy</span> • v2.0
          </div>
          <div className="text-[10px] text-[#b9b6d5]/70">منهج الإنجليزية التفاعلي المعتمد</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 z-40 sticky top-0 h-screen ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 md:hidden transform transition-transform duration-300 shadow-2xl ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
