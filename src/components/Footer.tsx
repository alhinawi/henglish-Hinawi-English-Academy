import React from "react";
import { Logo } from "./Logo";
import { PageRoute } from "../types";
import { ArrowUp, Sparkles } from "lucide-react";
import { playSound } from "../utils/audio";

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    playSound("click");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#09091a] relative overflow-hidden">
      {/* Decorative Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-24 bg-linear-to-r from-[#ffd166]/10 via-[#ff4f9a]/10 to-[#41e7ff]/10 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-[#b9b6d5] leading-relaxed">
              منصة هناوي إنجلش الأكاديمية — تحويل قواعد اللغة الإنجليزية الصعبة
              إلى مفاهيم بديهية وتطبيقات عملية سلسة تناسب المتعلم العربي.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#c4ff55] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Learn it. Use it. Own it.</span>
            </div>
          </div>

          {/* Quick Links Col 1: Flagship Course */}
          <div>
            <h4 className="text-sm font-black text-[#ffd166] uppercase tracking-wider mb-4">
              كورس المستقبل التام
            </h4>
            <ul className="space-y-2.5 text-sm text-[#dedbf4]">
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("courses/grammar/future-perfect");
                  }}
                  className="hover:text-[#41e7ff] transition-colors cursor-pointer text-right"
                >
                  نظرة عامة على الكورس الكامل
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("practice");
                  }}
                  className="hover:text-[#41e7ff] transition-colors cursor-pointer text-right"
                >
                  معمل التمارين وتكوين الجمل
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("quizzes");
                  }}
                  className="hover:text-[#41e7ff] transition-colors cursor-pointer text-right"
                >
                  بنك الأسئلة الشامل (Quiz Bank)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("homework");
                  }}
                  className="hover:text-[#41e7ff] transition-colors cursor-pointer text-right"
                >
                  الواجب المنزلي ونماذج الإجابة
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Col 2: Interactive Hubs & Academy */}
          <div>
            <h4 className="text-sm font-black text-[#41e7ff] uppercase tracking-wider mb-4">
              الأكاديمية والمراكز
            </h4>
            <ul className="space-y-2.5 text-sm text-[#dedbf4]">
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("courses/grammar");
                  }}
                  className="hover:text-[#ffd166] text-[#ffd166] font-bold transition-colors cursor-pointer text-right"
                >
                  أكاديمية الجرامر الشاملة (١٦ قاعدة) 🦅
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("games");
                  }}
                  className="hover:text-[#ffd166] transition-colors cursor-pointer text-right"
                >
                  ألعاب القواعد وصياد الأخطاء 🎮
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("speaking");
                  }}
                  className="hover:text-[#ffd166] transition-colors cursor-pointer text-right"
                >
                  مختبر المحادثات والنطق الصوتي 💬
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("vocabulary");
                  }}
                  className="hover:text-[#ffd166] transition-colors cursor-pointer text-right"
                >
                  دليل الأفعال والتصريف الثالث V3 📚
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("progress");
                  }}
                  className="hover:text-[#ffd166] transition-colors cursor-pointer text-right"
                >
                  لوحة المتابعة وتتبع الإنجاز 🏆
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Col 3: Resources & Printables */}
          <div>
            <h4 className="text-sm font-black text-[#ff4f9a] uppercase tracking-wider mb-4">
              المذكرات والطباعة
            </h4>
            <ul className="space-y-2.5 text-sm text-[#dedbf4]">
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("resources");
                  }}
                  className="hover:text-[#c4ff55] transition-colors cursor-pointer text-right"
                >
                  مذكرة المراجعة السريعة (Cheat Sheet)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("resources");
                  }}
                  className="hover:text-[#c4ff55] transition-colors cursor-pointer text-right"
                >
                  أوراق العمل الجاهزة للطباعة
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("about");
                  }}
                  className="hover:text-[#c4ff55] transition-colors cursor-pointer text-right"
                >
                  عن منهجية هناوي في التدريس
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#b9b6d5]">
          <div className="flex items-center gap-2">
            <span>
              © {new Date().getFullYear()} Henglish Academy. جميع الحقوق محفوظة.
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#41e7ff] hover:text-white transition-colors cursor-pointer font-bold"
          >
            <span>العودة للأعلى</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
