import React from 'react';
import { PageRoute, CEFRLevel, UserRole, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { Logo } from '../Logo';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ALL_GRAMMAR_RULES } from '../../data/allGrammarRules';
import { loadSentences } from '../../services/sentencesService';
import { playSound } from '../../utils/audio';
import {
  LayoutDashboard,
  GraduationCap,
  BookMarked,
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
  Quote,
  MessagesSquare,
  Zap,
  Library,
  User,
  Settings,
  LogOut,
  Repeat,
  LogIn,
  UserPlus,
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
  // Mobile drawer account block (Hinawi 7:32: profile lives in the burger menu).
  userProfile?: UserProfile;
  authSessionType?: 'guest' | 'authenticated';
  onOpenSettings?: () => void;
  onOpenAuthModal?: (tab?: 'login' | 'register' | 'migrate') => void;
  onToggleRole?: () => void;
  onSignOut?: () => void;
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
  badgeKey?: string;
  badgeCount?: number;
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
  userProfile,
  authSessionType = 'authenticated',
  onOpenSettings,
  onOpenAuthModal,
  onToggleRole,
  onSignOut,
}) => {
  const [openGrammarSubMenu, setOpenGrammarSubMenu] = React.useState(true);
  // Collapse the grammar sub-menu whenever the mobile drawer closes so the
  // next open starts collapsed.
  const prevMobileOpen = React.useRef(mobileOpen);
  React.useEffect(() => {
    if (prevMobileOpen.current && !mobileOpen) setOpenGrammarSubMenu(false);
    prevMobileOpen.current = mobileOpen;
  }, [mobileOpen]);
  // Collapsing the desktop rail also closes any expanded sub-menu.
  React.useEffect(() => {
    if (collapsed) setOpenGrammarSubMenu(false);
  }, [collapsed]);
  const [activeGrammarSection, setActiveGrammarSection] = React.useState<string>('Future Tenses');

  const { t, dir } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [sentenceCount, setSentenceCount] = React.useState<number | null>(null);
  React.useEffect(() => {
    let live = true;
    loadSentences().then(list => { if (live) setSentenceCount(list.length); }).catch(() => {});
    return () => { live = false; };
  }, []);
  // Nav data stores i18n keys directly.
  const tl = (key: string) => t(key);

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
      groupTitle: 'sidebar.group.home',
      items: [
        {
          label: 'nav.dashboard',
          labelEn: 'Dashboard',
          route: 'dashboard',
          icon: LayoutDashboard,
        },
        {
          label: 'nav.courses',
          labelEn: 'Courses Catalog',
          route: 'courses',
          icon: Layers,
        },
        {
          label: 'nav.games',
          labelEn: 'Games Arena',
          route: 'games',
          icon: Gamepad2,
          badge: 'sidebar.new',
        },
        {
          label: 'nav.resources',
          labelEn: 'Resources',
          route: 'sources',
          icon: Library,
          badge: 'sidebar.new',
        },
      ],
    },
    {
      groupTitle: 'sidebar.group.academies',
      items: [
        {
          label: 'nav.grammar',
          labelEn: 'Grammar Academy',
          route: 'grammar',
          icon: GraduationCap,
          badgeKey: 'sidebar.rulesBadge',
          badgeCount: ALL_GRAMMAR_RULES.length,
          subSections: [
            {
              title: 'grammar.section.future',
              titleEn: 'Future Tenses',
              items: [
                {
                  label: 'grammar.item.futurePerfect',
                  labelEn: 'Future Perfect',
                  route: 'courses/grammar/future-perfect',
                  
                  
                },
                {
                  label: 'grammar.item.futureSimpleWill',
                  labelEn: 'Future Simple (Will)',
                  route: 'grammar',
                  targetId: 'future-simple',
                },
                {
                  label: 'grammar.item.beGoingTo',
                  labelEn: 'Be Going To',
                  route: 'grammar',
                  targetId: 'be-going-to',
                },
                {
                  label: 'grammar.item.futureContinuous',
                  labelEn: 'Future Continuous',
                  route: 'grammar',
                  targetId: 'future-continuous',
                },
                {
                  label: 'grammar.item.futurePerfectContinuous',
                  labelEn: 'Future Perfect Continuous',
                  route: 'grammar',
                  targetId: 'future-perfect-continuous',
                },
              ],
            },
            {
              title: 'grammar.section.present',
              titleEn: 'Present Tenses',
              items: [
                { label: 'grammar.item.presentSimple', labelEn: 'Present Simple', route: 'grammar', targetId: 'present-simple' },
                { label: 'grammar.item.presentContinuous', labelEn: 'Present Continuous', route: 'grammar', targetId: 'present-continuous' },
                { label: 'grammar.item.presentPerfect', labelEn: 'Present Perfect', route: 'grammar', targetId: 'present-perfect' },
                { label: 'grammar.item.presentPerfectContinuous', labelEn: 'Present Perfect Continuous', route: 'grammar', targetId: 'present-perfect-continuous' },
              ],
            },
            {
              title: 'grammar.section.past',
              titleEn: 'Past Tenses',
              items: [
                { label: 'grammar.item.pastSimple', labelEn: 'Past Simple', route: 'grammar', targetId: 'past-simple' },
                { label: 'grammar.item.pastContinuous', labelEn: 'Past Continuous', route: 'grammar', targetId: 'past-continuous' },
                { label: 'grammar.item.pastPerfect', labelEn: 'Past Perfect', route: 'grammar', targetId: 'past-perfect' },
                { label: 'grammar.item.pastPerfectContinuous', labelEn: 'Past Perfect Continuous', route: 'grammar', targetId: 'past-perfect-continuous' },
              ],
            },
            {
              title: 'grammar.section.other',
              titleEn: 'Other Grammar Topics',
              items: [
                { label: 'grammar.item.conditional0', labelEn: 'Zero Conditional', route: 'grammar', targetId: 'zero-conditional' },
                { label: 'grammar.item.conditional1', labelEn: 'First Conditional', route: 'grammar', targetId: 'first-conditional' },
                { label: 'grammar.item.conditional2', labelEn: 'Second Conditional', route: 'grammar', targetId: 'second-conditional' },
                { label: 'grammar.item.conditional3', labelEn: 'Third Conditional', route: 'grammar', targetId: 'third-conditional' },
                { label: 'grammar.item.modals', labelEn: 'Modal Verbs', route: 'grammar', targetId: 'modal-verbs' },
                { label: 'grammar.item.passive', labelEn: 'Passive Voice', route: 'grammar', targetId: 'passive-voice' },
                { label: 'grammar.item.reportedSpeech', labelEn: 'Reported Speech', route: 'grammar', targetId: 'reported-speech' },
                { label: 'grammar.item.relativeClauses', labelEn: 'Relative Clauses', route: 'grammar', targetId: 'relative-clauses' },
              ],
            },
          ],
        },
        {
          label: 'nav.vocabulary',
          labelEn: 'Vocabulary Academy',
          route: 'vocabulary',
          icon: BookA,
          
        },
        {
          label: 'Idioms',
          labelEn: 'Idioms Bank',
          route: 'idioms',
          icon: Quote,
        },
        {
          label: 'Slang',
          labelEn: 'Slang Bank',
          route: 'slang',
          icon: MessagesSquare,
        },
        {
          label: 'Gen Z',
          labelEn: 'Gen Z Slang',
          route: 'genz',
          icon: Zap,
        },
        {
          label: 'IELTS',
          labelEn: 'IELTS Vocabulary',
          route: 'ielts',
          icon: GraduationCap,
        },
        {
          label: 'TOEFL',
          labelEn: 'TOEFL Vocabulary',
          route: 'toefl',
          icon: BookMarked,
        },
        {
          label: 'nav.speaking',
          labelEn: 'Speaking Academy',
          route: 'speaking',
          icon: Mic,
        },
        {
          label: 'nav.listening',
          labelEn: 'Listening Academy',
          route: 'listening',
          icon: Headphones,
        },
        {
          label: 'nav.reading',
          labelEn: 'Reading Academy',
          route: 'reading',
          icon: BookOpen,
        },
        {
          label: 'nav.writing',
          labelEn: 'Writing Academy',
          route: 'writing',
          icon: PenTool,
        },
        {
          label: 'nav.pronunciation',
          labelEn: 'Pronunciation Academy',
          route: 'pronunciation',
          icon: Volume2,
          badge: 'IPA',
        },
        {
          label: 'nav.realLife',
          labelEn: 'Real-Life English',
          route: 'real-life',
          icon: Compass,
        },
        {
          label: 'nav.sentences',
          labelEn: '5,000 Sentences',
          route: 'sentences' as PageRoute,
          icon: BookText,
          badgeKey: 'sidebar.sentencesBadge',
          badgeCount: sentenceCount ?? 0,
        },
        {
          label: 'nav.movies',
          labelEn: 'Movie Studio',
          route: 'movies' as PageRoute,
          icon: Film,
          
        },
        {
          label: 'nav.translation',
          labelEn: 'Translation',
          route: 'translation' as PageRoute,
          icon: Languages,
          
        },
        {
          label: 'nav.assistant',
          labelEn: 'Learning Assistant',
          route: 'ai-tutor' as PageRoute,
          icon: Bot,
          
        },
        {
          label: 'nav.world3d',
          labelEn: '3D Campus World',
          route: 'world-3d' as PageRoute,
          icon: Globe,
          badge: 'Three.js',
        },
      ],
    },
    {
      groupTitle: 'sidebar.group.lab',
      items: [
        {
          label: 'nav.exams',
          labelEn: 'Exams & Placement',
          route: 'exams',
          icon: FileCheck2,
          badge: 'CEFR',
        },
        {
          label: 'nav.certificates',
          labelEn: 'Certificates',
          route: 'certificates' as PageRoute,
          icon: Award,
          badge: 'sidebar.official',
        },
        {
          label: 'nav.practice',
          labelEn: 'Practice Lab',
          route: 'practice',
          icon: Gamepad2,
        },
      ],
    },
    {
      groupTitle: 'nav.mySpace',
      items: [
        { label: 'header.leaderboard', labelEn: 'Leaderboard', route: 'leaderboard', icon: Award },
        {
          label: 'nav.myLearning',
          labelEn: 'My Learning & Notes',
          route: 'my-learning',
          icon: BookmarkCheck,
        },
      ],
    },
    {
      groupTitle: 'sidebar.adminSection',
      items: [
        ...(userRole === 'teacher' || userRole === 'admin'
          ? [
              {
                label: 'sidebar.teacherPanel',
                labelEn: 'Teacher Dashboard',
                route: 'teacher-dashboard' as PageRoute,
                icon: GraduationCap,
                badge: 'header.teacher',
                adminOnly: false,
              },
            ]
          : []),
        ...(userRole === 'admin'
          ? [
              {
                label: 'header.adminPanel',
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
      <div className="relative flex flex-col h-full bg-[#0c0b20] border-l border-white/10 select-none text-right">
        {isMobileDrawer && profileMenuOpen && (
          <div className="absolute inset-0 z-10" onClick={() => setProfileMenuOpen(false)} aria-hidden="true" />
        )}
        {/* Top controls row - the logo lives in the site header only
            (Hinawi 7:01: one logo, no duplicate in the sidebar). */}
        {(!isCollapsed || isMobileDrawer) && (
          <div className={`h-14 flex items-center ${isMobileDrawer ? 'justify-end' : 'justify-between'} px-4 border-b border-white/10`}>
            {isMobileDrawer ? (
              <button
                onClick={onCloseMobile}
                className="p-2 rounded-xl text-[#dedbf4] hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label={t('sidebar.close')}
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <>
              <button
                onClick={() => handleNav('dashboard')}
                className="cursor-pointer shrink-0"
                aria-label={t('sidebar.brandHome')}
                title={t('sidebar.brandHome')}
              >
                <Logo size="sm" />
              </button>
              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg text-[#b9b6d5] hover:text-[#41e7ff] hover:bg-white/5 cursor-pointer transition-all hidden md:flex"
                title={t('sidebar.collapse')}
                aria-label={t('sidebar.collapse')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              </>
            )}
          </div>
        )}

        {/* Mobile account block (Hinawi 7:32): profile + account actions at
            the top of the burger drawer; the header avatar is hidden on mobile. */}
        {/* Mobile account block (Hinawi 7:32 + 7:51): guests keep the
            sign-in prompt at the top of the burger drawer; signed-in users
            get a compact profile row pinned at the bottom (opens /profile). */}
        {isMobileDrawer && userProfile && authSessionType === 'guest' && (
            <div className="mx-3 mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#b9b6d5]" />
                </div>
                <div dir="auto" className="text-xs font-bold text-white" style={{ textAlign: 'start' }}>
                  {t('header.guestTitle')}
                </div>
              </div>
              {onOpenAuthModal && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { playSound('click'); onCloseMobile(); onOpenAuthModal('register'); }}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#c4ff55] text-[#09091a] text-xs font-black hover:brightness-110 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span dir="auto">{t('header.createAccount')}</span>
                  </button>
                  <button
                    onClick={() => { playSound('click'); onCloseMobile(); onOpenAuthModal('login'); }}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-bold hover:bg-white/10 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-[#41e7ff]" />
                    <span dir="auto">{t('header.login')}</span>
                  </button>
                </div>
              )}
            </div>
        )}

        {/* Expand control (collapsed rail): in-flow so it can never clip at
            the screen edge, fully tappable in RTL and LTR. The desktop rail
            sits on the right, so expansion grows leftward. */}
        {!isMobileDrawer && isCollapsed && (
          <>
          <button
            onClick={() => handleNav('dashboard')}
            className="mx-auto mt-3 block cursor-pointer"
            aria-label={t('sidebar.brandHome')}
            title={t('sidebar.brandHome')}
          >
            <img
              src="/logo-clean.png"
              alt="Henglish"
              width={36}
              height={36}
              className="w-9 h-9 object-contain filter drop-shadow-[0_0_10px_rgba(255,209,102,0.45)]"
            />
          </button>
          <button
            onClick={onToggleCollapse}
            className="mx-2.5 mt-2.5 p-1.5 rounded-lg bg-[#171632] border border-white/15 text-[#41e7ff] hover:text-white hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-center"
            title={t('sidebar.expand')}
            aria-label={t('sidebar.expand')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          </>
        )}

        {/* User Level Strip (when expanded) */}
        {!isCollapsed && (
          <div className="mx-3 my-3 p-3 rounded-2xl bg-linear-to-r from-[#ffd166]/10 via-[#41e7ff]/10 to-transparent border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ffd166]/20 border border-[#ffd166]/40 flex items-center justify-center font-black text-[#ffd166] text-xs">
                {cefrLevel}
              </div>
              <div>
                <div dir="auto" className="text-xs font-bold text-white" style={{ textAlign: 'start' }}>{t('sidebar.currentLevel')}</div>
                <div className="text-[11px] text-[#41e7ff] font-semibold">{xp.toLocaleString()} XP</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-[#ff8bb9] bg-[#ff4f9a]/15 px-2 py-0.5 rounded-full border border-[#ff4f9a]/30">
              <Flame className="w-3 h-3 text-[#ff4f9a]" />
              <span dir="auto">{t('sidebar.active')}</span>
            </div>
          </div>
        )}

        {/* Navigation Scroll Area */}
        {/* Natural direction: a direction-flipped scroll container breaks
            Android Chrome's scroll anchoring and momentum (the "snapping"
            Hinawi reported). The thin styled scrollbar follows the content
            edge (left in RTL, right in LTR); overscroll is contained so the
            drawer never chain-scrolls the page behind it. */}
        <div
          dir={dir}
          className="flex-1 overflow-y-auto px-2.5 py-2 space-y-5 custom-scrollbar overscroll-contain"
        >
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && (
                <h3 dir="auto" className="px-3 text-[10px] font-black uppercase tracking-wider text-[#b9b6d5]/70 mb-1" style={{ textAlign: 'start' }}>
                  {tl(group.groupTitle)}
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
                            <span className="truncate flex-1" dir="auto" style={{ textAlign: 'start' }}>{tl(item.label)}</span>
                            {(item.badgeKey ? (item.badgeCount ?? 0) > 0 : !!item.badge) && (
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                  item.isFlagship
                                    ? 'bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30'
                                    : 'bg-white/10 text-[#ffd166] border border-white/10'
                                }`}
                              >
                                <span dir="auto">{item.badgeKey ? t(item.badgeKey).replace('{count}', (item.badgeCount ?? 0).toLocaleString('en-US')) : tl(item.badge!)}</span>
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
                          title={openGrammarSubMenu ? t('sidebar.collapseSections') : t('sidebar.expandSections')}
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
                                <span dir="auto">{tl(sec.title)}</span>
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
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                                    isSubActive
                                      ? 'bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 font-black shadow-xs'
                                      : subItem.isFlagship
                                      ? 'text-[#41e7ff] hover:bg-[#41e7ff]/10 font-bold'
                                      : 'text-[#dedbf4]/80 hover:text-white hover:bg-white/5'
                                  }`}
                                >
                                  <span className="truncate flex-1" dir="auto" style={{ textAlign: 'start' }}>{tl(subItem.label)}</span>
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

        {/* In-drawer profile popover (Hinawi 8:02): pops up above the pinned
            row, inside the drawer; the drawer itself stays open. */}
        <AnimatePresence>
          {isMobileDrawer && profileMenuOpen && userProfile && authSessionType !== 'guest' && (
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              transition={{ duration: reduceMotion ? 0.05 : 0.16, ease: 'easeOut' }}
              role="dialog"
              aria-label={t('profile.title')}
              className="mx-3 mt-2 rounded-2xl bg-[#1b1939] border border-white/15 shadow-xl overflow-hidden relative z-20"
            >
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10">
                <span dir="auto" className="text-[11px] font-black text-[#b9b6d5]">{t('profile.title')}</span>
                <button
                  onClick={() => setProfileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#dedbf4] hover:text-white hover:bg-white/10 cursor-pointer"
                  aria-label={t('sidebar.close')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-1.5 space-y-0.5 text-xs font-bold">
                {onOpenSettings && (
                  <button
                    onClick={() => { playSound('click'); setProfileMenuOpen(false); onCloseMobile(); onOpenSettings(); }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#41e7ff]" />
                    <span dir="auto" className="flex-1 truncate" style={{ textAlign: 'start' }}>{t('settings.title')}</span>
                  </button>
                )}
                <button
                  onClick={() => { setProfileMenuOpen(false); handleNav('my-learning'); }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#41e7ff]" />
                  <span dir="auto" className="flex-1 truncate" style={{ textAlign: 'start' }}>{t('header.mySpaceNotes')}</span>
                </button>
                <button
                  onClick={() => { setProfileMenuOpen(false); handleNav('certificates'); }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#ffd166]" />
                  <span dir="auto" className="flex-1 truncate" style={{ textAlign: 'start' }}>{t('header.myCertificates')}</span>
                </button>
                {userProfile.email?.toLowerCase() === '3asfuur@gmail.com' && (
                  <button
                    onClick={() => { setProfileMenuOpen(false); handleNav('admin'); }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#ffd166]" />
                    <span dir="auto" className="flex-1 truncate" style={{ textAlign: 'start' }}>{t('header.adminPanel')}</span>
                  </button>
                )}
                {onToggleRole && (
                  <button
                    onClick={() => { playSound('click'); setProfileMenuOpen(false); onToggleRole(); }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-[#dedbf4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                  >
                    <Repeat className="w-4 h-4 text-[#c4ff55]" />
                    <span dir="auto" className="flex-1 truncate" style={{ textAlign: 'start' }}>{t('header.roleToggle')}{userProfile.role === 'student' ? t('header.teacher') : t('header.student')}</span>
                  </button>
                )}
                {onSignOut && (
                  <button
                    onClick={() => { playSound('click'); setProfileMenuOpen(false); onCloseMobile(); onSignOut(); }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer border border-red-500/20"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span dir="auto" className="flex-1 truncate" style={{ textAlign: 'start' }}>{t('header.logout')}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile profile footer (Hinawi 7:51): ChatGPT-style pinned row at
            the bottom of the drawer; tap opens the dedicated profile page. */}
        {isMobileDrawer && userProfile && authSessionType !== 'guest' && (
          <button
            onClick={() => { playSound('click'); setProfileMenuOpen(v => !v); }}
            className="mx-3 mt-2 mb-1 flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer shrink-0 relative z-20"
            aria-haspopup="dialog"
            aria-expanded={profileMenuOpen}
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-9 h-9 rounded-xl object-cover border border-[#ffd166]/40 shrink-0"
            />
            <div className="min-w-0 flex-1" style={{ textAlign: 'start' }}>
              <div className="text-sm font-black text-white truncate">{userProfile.nameAr}</div>
              <div dir="ltr" className="text-[11px] text-[#b9b6d5] truncate">{userProfile.email}</div>
            </div>
            {dir === 'rtl'
              ? <ChevronLeft className="w-4 h-4 text-[#b9b6d5] shrink-0" />
              : <ChevronRight className="w-4 h-4 text-[#b9b6d5] shrink-0" />}
          </button>
        )}

        {/* Footer info in sidebar */}
        {!isCollapsed && (
          <div className="p-3 border-t border-white/10 text-center">
            <div className="text-[11px] text-[#b9b6d5]">
              <span className="font-bold text-white">Henglish Academy</span> • v2.0
            </div>
            <div className="text-[10px] text-[#b9b6d5]/70">{t('sidebar.tagline')}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        dir={dir}
        className={`hidden md:block shrink-0 order-2 transition-[width] duration-300 z-40 sticky top-0 h-screen ${
          collapsed ? 'w-20' : 'w-72'
        }`}
        aria-label={t('sidebar.desktopAria')}
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
        dir={dir}
        className={`fixed top-0 bottom-0 w-80 max-w-[85vw] z-50 md:hidden transform transition-transform duration-300 shadow-2xl ${
          dir === 'rtl' ? 'right-0' : 'left-0'
        } ${
          mobileOpen ? 'translate-x-0' : dir === 'rtl' ? 'translate-x-full' : '-translate-x-full'
        }`}
        aria-label={t('sidebar.mobileAria')}
      >
        {renderSidebarContent(true)}
      </aside>

    </>
  );
};
