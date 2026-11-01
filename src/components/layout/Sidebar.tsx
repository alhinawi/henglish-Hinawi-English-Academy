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
  ChevronDown,
  Sparkles,
  Layers,
  X,
  Flame,
  Bot,
  Globe,
  Award,
  Film,
  BookText,
  Languages,
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

interface NavSubItem {
  label: string;
  labelEn: string;
  route: PageRoute;
  targetId?: string;
  badge?: string;
  isFlagship?: boolean;
}

interface NavSubSection {
  title: string;
  titleEn: string;
  items: NavSubItem[];
}

interface NavItem {
  label: string;
  labelEn: string;
  route: PageRoute;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isFlagship?: boolean;
  adminOnly?: boolean;
  subSections?: NavSubSection[];
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
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
  const [openGrammarSubMenu, setOpenGrammarSubMenu] = React.useState(true);
  const [activeGrammarSection, setActiveGrammarSection] = React.useState<string>('Future Tenses');

  const handleNav = (route: PageRoute, targetId?: string) => {
    playSound('click');
    if (route === 'grammar' && targetId) {
      window.location.hash = `grammar/${targetId}`;
      onNavigate('grammar-lesson');
    } else {
      onNavigate(route);
    }
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
          badge: '21+ قاعدة',
          subSections: [
            {
              title: 'أزمنة المستقبل',
              titleEn: 'Future Tenses',
              items: [
                {
                  label: 'المستقبل التام ⚡',
                  labelEn: 'Future Perfect',
                  route: 'courses/grammar/future-perfect',
                  badge: 'ماستر كلاس 👑',
                  isFlagship: true,
                },
                {
                  label: 'المستقبل البسيط (Will)',
                  labelEn: 'Future Simple (Will)',
                  route: 'grammar',
                  targetId: 'future-simple',
                },
                {
                  label: 'صيغة Be Going To',
                  labelEn: 'Be Going To',
                  route: 'grammar',
                  targetId: 'be-going-to',
                },
                {
                  label: 'المستقبل المستمر',
                  labelEn: 'Future Continuous',
                  route: 'grammar',
                  targetId: 'future-continuous',
                },
                {
                  label: 'المستقبل التام المستمر',
                  labelEn: 'Future Perfect Continuous',
                  route: 'grammar',
                  targetId: 'future-perfect-continuous',
                },
              ],
            },
            {
              title: 'أزمنة المضارع',
              titleEn: 'Present Tenses',
              items: [
                { label: 'المضارع البسيط', labelEn: 'Present Simple', route: 'grammar', targetId: 'present-simple' },
                { label: 'المضارع المستمر', labelEn: 'Present Continuous', route: 'grammar', targetId: 'present-continuous' },
                { label: 'المضارع التام', labelEn: 'Present Perfect', route: 'grammar', targetId: 'present-perfect' },
                { label: 'المضارع التام المستمر', labelEn: 'Present Perfect Continuous', route: 'grammar', targetId: 'present-perfect-continuous' },
              ],
            },
            {
              title: 'أزمنة الماضي',
              titleEn: 'Past Tenses',
              items: [
                { label: 'الماضي البسيط', labelEn: 'Past Simple', route: 'grammar', targetId: 'past-simple' },
                { label: 'الماضي المستمر', labelEn: 'Past Continuous', route: 'grammar', targetId: 'past-continuous' },
                { label: 'الماضي التام', labelEn: 'Past Perfect', route: 'grammar', targetId: 'past-perfect' },
                { label: 'الماضي التام المستمر', labelEn: 'Past Perfect Continuous', route: 'grammar', targetId: 'past-perfect-continuous' },
              ],
            },
            {
              title: 'مواضيع وقواعد أخرى',
              titleEn: 'Other Grammar Topics',
              items: [
                { label: 'حالة الشرط الصفرية', labelEn: 'Zero Conditional', route: 'grammar', targetId: 'zero-conditional' },
                { label: 'حالة الشرط الأولى', labelEn: 'First Conditional', route: 'grammar', targetId: 'first-conditional' },
                { label: 'حالة الشرط الثانية', labelEn: 'Second Conditional', route: 'grammar', targetId: 'second-conditional' },
                { label: 'حالة الشرط الثالثة', labelEn: 'Third Conditional', route: 'grammar', targetId: 'third-conditional' },
                { label: 'الأفعال الناقصة', labelEn: 'Modal Verbs', route: 'grammar', targetId: 'modal-verbs' },
                { label: 'المبني للمجهول', labelEn: 'Passive Voice', route: 'grammar', targetId: 'passive-voice' },
                { label: 'الكلام المنقول', labelEn: 'Reported Speech', route: 'grammar', targetId: 'reported-speech' },
                { label: 'ضمائر وجمل الوصل', labelEn: 'Relative Clauses', route: 'grammar', targetId: 'relative-clauses' },
              ],
            },
          ],
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
          label: 'مكتبة 5,500 جملة 📚',
          labelEn: '5,500 Sentences',
          route: 'sentences' as PageRoute,
          icon: BookText,
          badge: '5,500 جملة',
        },
        {
          label: 'اتعلم من الأفلام 🎬',
          labelEn: 'Movie Studio',
          route: 'movies' as PageRoute,
          icon: Film,
          badge: 'ستوديو AI',
        },
        {
          label: 'ترجمة (استوديو AI) 🌐',
          labelEn: 'Translation',
          route: 'translation' as PageRoute,
          icon: Languages,
          badge: 'AI رائد',
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
        ...(userRole === 'teacher' || userRole === 'admin'
          ? [
              {
                label: 'لوحة المعلم الأكاديمي 👨‍🏫',
                labelEn: 'Teacher Dashboard',
                route: 'teacher-dashboard' as PageRoute,
                icon: GraduationCap,
                badge: 'معلم',
                adminOnly: false,
              },
            ]
          : []),
        ...(userRole === 'admin'
          ? [
              {
                label: 'لوحة التحكم الإدارية 🛡️',
                labelEn: 'Admin Control Panel',
                route: 'admin' as PageRoute,
                icon: ShieldCheck,
                badge: 'Admin',
                adminOnly: true,
              },
            ]
          : []),
      ],
    },
  ];

  const renderSidebarContent = (isMobileDrawer: boolean) => {
    const isCollapsed = isMobileDrawer ? false : collapsed;

    return (
      <div className="flex flex-col h-full bg-[#0c0b20] border-l border-white/10 select-none text-right">
        {/* Brand Header */}
        <div
          className={`h-20 flex items-center ${
            isCollapsed ? 'justify-center px-2 relative' : 'justify-between px-4'
          } border-b border-white/10`}
        >
          <button
            onClick={() => handleNav('dashboard')}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} cursor-pointer focus:outline-none`}
            title="الرئيسية هناوي إنجلش"
          >
            <Logo size="sm" showText={!isCollapsed} />
          </button>

          {isMobileDrawer ? (
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-xl text-[#dedbf4] hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onToggleCollapse}
              className={`p-1.5 rounded-lg text-[#b9b6d5] hover:text-[#41e7ff] hover:bg-white/5 cursor-pointer transition-all ${
                isCollapsed
                  ? 'absolute -left-3 top-7 w-6 h-6 rounded-full bg-[#171632] border border-white/20 flex items-center justify-center text-[#41e7ff] hover:text-white hover:scale-110 shadow-lg z-50'
                  : 'hidden md:flex'
              }`}
              title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
              aria-label="تبديل عرض القائمة"
            >
              {isCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* User Level Strip (when expanded) */}
        {!isCollapsed && (
          <div className="mx-3 my-3 p-3 rounded-2xl bg-linear-to-r from-[#ffd166]/10 via-[#41e7ff]/10 to-transparent border border-white/10 flex items-center justify-between">
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
              {!isCollapsed && (
                <h3 className="px-3 text-[10px] font-black uppercase tracking-wider text-[#b9b6d5]/70 mb-1">
                  {group.groupTitle}
                </h3>
              )}
              {group.items.map(item => {
                const isGrammar = item.route === 'grammar';
                const isGrammarChildActive =
                  currentRoute === 'courses/grammar/future-perfect' ||
                  currentRoute === 'grammar-lesson' ||
                  currentRoute === 'courses/grammar';
                const isActive =
                  currentRoute === item.route ||
                  (isGrammar && isGrammarChildActive) ||
                  (item.route === 'dashboard' && currentRoute === 'home');
                const Icon = item.icon;
                const hasSubSections = Boolean(item.subSections && item.subSections.length > 0);

                return (
                  <div key={item.route} className="space-y-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleNav(item.route)}
                        className={`w-full flex items-center ${
                          isCollapsed ? 'justify-center px-0 text-center' : 'gap-3 px-3 text-right'
                        } py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                          isActive
                            ? 'bg-linear-to-r from-[#ffd166]/20 to-[#41e7ff]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-[0_0_15px_rgba(255,209,102,0.15)] font-black'
                            : item.isFlagship
                            ? 'text-[#41e7ff] hover:bg-white/5 border border-[#41e7ff]/25'
                            : 'text-[#dedbf4] hover:text-[#41e7ff] hover:bg-white/5 border border-transparent'
                        }`}
                        title={isCollapsed ? item.label : undefined}
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

                        {!isCollapsed && (
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

                      {!isCollapsed && hasSubSections && (
                        <button
                          onClick={() => {
                            playSound('click');
                            setOpenGrammarSubMenu(prev => !prev);
                          }}
                          className="p-2 rounded-lg text-[#b9b6d5] hover:text-white hover:bg-white/5 cursor-pointer transition-transform"
                          title={openGrammarSubMenu ? 'طي الأقسام الفرعية' : 'عرض الأقسام الفرعية'}
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openGrammarSubMenu ? 'rotate-180 text-[#41e7ff]' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Expandable Grammar Curriculum Sub-Tree */}
                    {!isCollapsed && hasSubSections && openGrammarSubMenu && item.subSections && (
                      <div className="mr-3 pr-2 border-r-2 border-[#41e7ff]/20 space-y-2 py-1">
                        {/* Sub-Section Tabs (Future, Present, Past, Other) */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                          {item.subSections.map(sec => {
                            const isSecActive = activeGrammarSection === sec.titleEn;
                            return (
                              <button
                                key={sec.titleEn}
                                onClick={() => {
                                  playSound('click');
                                  setActiveGrammarSection(sec.titleEn);
                                }}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                                  isSecActive
                                    ? 'bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/40 font-black'
                                    : 'text-[#b9b6d5] hover:text-white hover:bg-white/5'
                                }`}
                              >
                                {sec.title}
                              </button>
                            );
                          })}
                        </div>

                        {/* Items under active section */}
                        <div className="space-y-1">
                          {item.subSections
                            .find(sec => sec.titleEn === activeGrammarSection)
                            ?.items.map(subItem => {
                              const isSubActive =
                                (subItem.route === 'courses/grammar/future-perfect' && currentRoute === 'courses/grammar/future-perfect');

                              return (
                                <button
                                  key={subItem.labelEn}
                                  onClick={() => handleNav(subItem.route, subItem.targetId)}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-right cursor-pointer transition-all ${
                                    isSubActive
                                      ? 'bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 font-black shadow-xs'
                                      : subItem.isFlagship
                                      ? 'text-[#41e7ff] hover:bg-[#41e7ff]/10 font-bold'
                                      : 'text-[#dedbf4]/80 hover:text-white hover:bg-white/5'
                                  }`}
                                >
                                  <span className="truncate">{subItem.label}</span>
                                  {subItem.badge && (
                                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30 shrink-0 mr-1">
                                      {subItem.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        {!isCollapsed && (
          <div className="p-3 border-t border-white/10 text-center">
            <div className="text-[11px] text-[#b9b6d5]">
              <span className="font-bold text-white">Hinawi Academy</span> • v2.0
            </div>
            <div className="text-[10px] text-[#b9b6d5]/70">منهج الإنجليزية التفاعلي المعتمد</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-[width] duration-300 z-40 sticky top-0 h-screen ${
          collapsed ? 'w-20' : 'w-72'
        }`}
        aria-label="القائمة الجانبية للكمبيوتر"
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 md:hidden transform transition-transform duration-300 shadow-2xl ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="القائمة الجانبية للشاشات الصغيرة"
      >
        {renderSidebarContent(true)}
      </aside>
    </>
  );
};
