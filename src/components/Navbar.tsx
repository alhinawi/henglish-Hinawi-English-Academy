import React, { useState } from 'react';
import { Logo } from './Logo';
import { PageRoute } from '../types';
import { playSound } from '../utils/audio';
import { 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onOpenSearch: () => void;
  completionPercentage: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  completionPercentage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (route: PageRoute) => {
    playSound('click');
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'الرئيسية', route: 'home' as PageRoute },
    { label: 'أكاديمية الجرامر 🦅', route: 'courses/grammar' as PageRoute, isHighlighted: true },
    { label: 'الكورسات', route: 'courses' as PageRoute },
    { label: 'المستقبل التام ⚡', route: 'courses/grammar/future-perfect' as PageRoute },
    { label: 'التمارين', route: 'practice' as PageRoute },
    { label: 'الاختبارات', route: 'quizzes' as PageRoute },
    { label: 'الألعاب', route: 'games' as PageRoute },
    { label: 'المحادثات', route: 'speaking' as PageRoute },
    { label: 'الأفعال V3', route: 'vocabulary' as PageRoute },
    { label: 'المذكرات', route: 'resources' as PageRoute },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0c0b20]/90 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNav('home')}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#41e7ff] rounded-xl p-1"
            aria-label="الرئيسية هناوي إنجلش"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2" aria-label="شريط التنقل الرئيسي">
            {navLinks.map(link => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNav(link.route)}
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ffd166]/20 to-[#41e7ff]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-[0_0_15px_rgba(255,209,102,0.15)]'
                      : link.isHighlighted
                      ? 'text-[#41e7ff] hover:text-white hover:bg-white/5 border border-[#41e7ff]/30'
                      : 'text-[#dedbf4] hover:text-[#41e7ff] hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Progress, CTA */}
          <div className="flex items-center gap-3">
            {/* Global Search Button */}
            <button
              onClick={() => {
                playSound('click');
                onOpenSearch();
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#dedbf4] hover:text-[#41e7ff] transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold"
              title="بحث شامل في المنصة (Ctrl+K)"
              aria-label="فتح البحث"
            >
              <Search className="w-4 h-4 text-[#41e7ff]" />
              <span className="hidden sm:inline">بحث...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 rounded text-[10px] bg-black/40 border border-white/10 text-[#b9b6d5]">
                Ctrl K
              </kbd>
            </button>

            {/* Course Progress Pill */}
            <button
              onClick={() => handleNav('progress')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#201d43]/80 hover:bg-[#201d43] border border-white/10 text-xs font-bold text-[#b9b6d5] hover:text-white transition-all cursor-pointer"
              title="لوحة الإنجازات والتقدم"
            >
              <Award className="w-4 h-4 text-[#ffd166]" />
              <span>الإنجاز:</span>
              <span className="text-[#c4ff55] font-black">{completionPercentage}%</span>
              <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ffd166] to-[#c4ff55] rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </button>

            {/* CTA Button */}
            <button
              onClick={() => handleNav('practice')}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] hover:brightness-110 shadow-[0_4px_16px_rgba(255,156,102,0.25)] transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>ابدأ التمارين</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                playSound('click');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="xl:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#dedbf4] hover:text-[#41e7ff] cursor-pointer"
              aria-label="فتح القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-white/10 bg-[#0c0b20]/95 backdrop-blur-2xl px-4 py-6 overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map(link => {
                const isActive = currentRoute === link.route;
                return (
                  <button
                    key={link.route}
                    onClick={() => handleNav(link.route)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ffd166]/20 to-[#41e7ff]/20 text-[#ffd166] border border-[#ffd166]/40'
                        : 'text-[#dedbf4] hover:bg-white/5 hover:text-[#41e7ff]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.isHighlighted && <span className="text-xs text-[#41e7ff] font-semibold">مميز</span>}
                  </button>
                );
              })}

              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => handleNav('progress')}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#201d43] border border-white/10 text-sm font-bold text-white"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#ffd166]" />
                    لوحة الإنجازات ونسبة الإكمال
                  </span>
                  <span className="text-[#c4ff55] font-black">{completionPercentage}%</span>
                </button>

                <button
                  onClick={() => handleNav('practice')}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-black bg-gradient-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c]"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>ابدأ الاختبارات التفاعلية الآن</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
