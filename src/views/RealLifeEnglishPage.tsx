import React, { useState } from 'react';
import { PageRoute } from '../types';
import { 
  REAL_LIFE_SCENARIOS, 
  SimulationScenario, 
  SimulationTurn,
  DialogueOption 
} from '../data/realLifeSimulationsData';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { Interactive3DWorld } from '../components/Interactive3DWorld';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import {
  Plane,
  UtensilsCrossed,
  Stethoscope,
  Briefcase,
  Coffee,
  Compass,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Award,
  RotateCcw,
  MapPin,
  AlertTriangle,
  Hotel,
  Pill,
} from 'lucide-react';

interface RealLifeEnglishPageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
}

const SCENARIO_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'sim-airport-checkin': Plane,
  'sim-restaurant-ordering': UtensilsCrossed,
  'sim-doctor-appointment': Stethoscope,
  'sim-job-interview': Briefcase,
  'sim-coffee-shop': Coffee,
  'sim-hotel-checkin': Hotel,
  'sim-pharmacy-visit': Pill,
};

export const RealLifeEnglishPage: React.FC<RealLifeEnglishPageProps> = ({ onNavigate }) => {
  const appText = useAppTextMap('realLifeSimulationsData');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(() => {
    try {
      const requested = sessionStorage.getItem('henglish-world-scenario');
      sessionStorage.removeItem('henglish-world-scenario');
      if (REAL_LIFE_SCENARIOS.some(item => item.id === requested)) return requested;
    } catch { /* Storage is optional. */ }
    return null;
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'simulator' | '3d-world'>('simulator');

  // Simulation state
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<DialogueOption | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [scenarioCompleted, setScenarioCompleted] = useState(false);

  const scenario: SimulationScenario | null =
    REAL_LIFE_SCENARIOS.find(s => s.id === selectedScenarioId) || null;

  const filteredScenarios = REAL_LIFE_SCENARIOS.filter(s => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  const resetSimulationState = () => {
    setCurrentTurnIdx(0);
    setSelectedOption(null);
    setTotalScore(0);
    setScenarioCompleted(false);
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };

  const handleSelectScenario = (id: string) => {
    playSound('click');
    setSelectedScenarioId(id);
    resetSimulationState();
    setViewMode('simulator');
    scrollToTop();
  };

  const handleBackToList = () => {
    playSound('click');
    setSelectedScenarioId(null);
    resetSimulationState();
    scrollToTop();
  };

  const handleChooseOption = (opt: DialogueOption) => {
    if (selectedOption) return;
    playSound(opt.isOptimal ? 'correct' : 'wrong');
    setSelectedOption(opt);
    setTotalScore(prev => prev + opt.score);
  };

  const handleNextTurn = () => {
    if (!scenario) return;
    playSound('click');
    if (currentTurnIdx < scenario.turns.length - 1) {
      setCurrentTurnIdx(prev => prev + 1);
      setSelectedOption(null);
      scrollToTop();
    } else {
      // Complete scenario
      setScenarioCompleted(true);
      playSound('fanfare');
      fireCelebration();
      scrollToTop();
    }
  };

  const handleRestartScenario = () => {
    playSound('click');
    resetSimulationState();
    scrollToTop();
  };

  /* ============ LIST SCREEN: situations index ============ */
  if (!scenario) {
    return (
      <div className="space-y-10 pb-16 text-right">

        {/* 1. ACADEMY HERO */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
          <div className="absolute top-0 right-10 w-80 h-80 bg-[#ff4f9a]/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ff4f9a]/20 text-[#ff8bb9] border border-[#ff4f9a]/40 shadow-sm">
                <Compass className="w-4 h-4" />
                <span>IMMERSIVE LIVING SIMULATOR • محاكي الإنجليزية الواقعية التفاعلي</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                إنجليزي المواقف الحقيقية والحياة اليومية
              </h1>

              <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
                مارس الإنجليزية في مواقفك اليومية دون خوف: محادثات حية ومتفرعة في المطار، الفندق، المطعم، المستشفى، ومقابلات العمل، مع نطق بشري حي واختبارات لغوية ذكية.
              </p>

              <p className="text-xs text-[#41e7ff] font-bold">
                اختر موقفاً واحداً لتفتح محادثته وحدها في شاشة تدريب مركزة.
              </p>
            </div>

            {/* Switcher: Simulator vs 3D World */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => {
                  playSound('click');
                  setViewMode(viewMode === 'simulator' ? '3d-world' : 'simulator');
                }}
                className="px-5 py-3 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{viewMode === 'simulator' ? 'استكشاف العالم ثلاثي الأبعاد 3D' : 'العودة لقائمة المواقف'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. OPTIONAL 3D WORLD EMBED */}
        {viewMode === '3d-world' && (
          <Interactive3DWorld
            onNavigate={onNavigate}
            onSelectScenario={handleSelectScenario}
          />
        )}

        {/* 3. SCENARIO SELECTOR CARDS */}
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {[
              { id: 'all', label: 'جميع البيئات' },
              { id: 'travel', label: 'السفر والمطارات' },
              { id: 'hospitality', label: 'المطاعم والضيافة' },
              { id: 'healthcare', label: 'الرعاية الصحية' },
              { id: 'professional', label: 'الوظائف والشركات' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  playSound('click');
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-linear-to-r from-[#ffd166]/20 to-[#41e7ff]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm'
                    : 'bg-white/5 border border-white/10 text-[#b9b6d5] hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Scenario Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredScenarios.map(sc => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                className="p-5 rounded-2xl border text-right transition-colors cursor-pointer flex flex-col justify-between space-y-3 glass-panel border-white/10 hover:border-[#ffd166]/60 hover:bg-white/10"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    {(() => { const IconCmp = SCENARIO_ICONS[sc.id] || Compass; return <IconCmp className="w-7 h-7 text-[#ffd166]" />; })()}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-[#ffd166] font-mono">
                      {sc.level}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">{txText(appText, sc.titleAr)}</h4>
                  <div className="text-[11px] font-mono text-[#b9b6d5] line-clamp-1">{sc.title}</div>
                </div>

                <div className="text-[11px] text-[#41e7ff] font-semibold flex items-center justify-between pt-2 border-t border-white/10">
                  <span>{sc.turns.length} محطات حوارية</span>
                  <span className="text-[#c4ff55]">+{sc.rewardXp} XP</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    );
  }

  /* ============ FOCUSED SIMULATION SCREEN: one conversation only ============ */
  const currentTurn: SimulationTurn = scenario.turns[currentTurnIdx] || scenario.turns[0];
  const progressPct = Math.round(
    ((currentTurnIdx + (scenarioCompleted ? 1 : 0)) / scenario.turns.length) * 100
  );

  return (
    <div className="space-y-6 pb-16 text-right max-w-3xl mx-auto">

      {/* Focused top bar: back to list + progress */}
      <div className="sticky top-0 z-30 -mx-2 px-2 py-3 bg-[#0c0b20]/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToList}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
          >
            <ArrowRight className="w-4 h-4" />
            <span>كل المواقف</span>
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-black text-white truncate">{txText(appText, scenario.titleAr)}</h1>
            <div className="text-[10px] font-mono text-[#b9b6d5]" dir="ltr">
              {scenarioCompleted ? scenario.turns.length : currentTurnIdx + 1} / {scenario.turns.length}
            </div>
          </div>

          <div className="shrink-0 text-[11px] font-bold text-[#c4ff55] bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 font-mono" dir="ltr">
            {totalScore} XP
          </div>
        </div>

        <div className="mt-2.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#ffd166] to-[#41e7ff] transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {!scenarioCompleted ? (
        <section className="glass-panel rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
          {/* Backdrop Visual Environment */}
          <div className="relative h-40 sm:h-56 w-full overflow-hidden">
            <img
              src={scenario.backdropImage}
              alt={txText(appText, scenario.locationName)}
              className="w-full h-full object-cover filter brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0c0b20] via-[#0c0b20]/60 to-transparent" />

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166] text-[#0c0b20] shadow-lg flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{txText(appText, scenario.locationName)}</span>
              </span>
            </div>

            <div className="absolute bottom-4 right-6 left-6">
              <span className="text-xs text-[#ffd166] font-bold">المشهد الحواري {currentTurnIdx + 1} من {scenario.turns.length}</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{txText(appText, scenario.titleAr)}</h2>
            </div>
          </div>

          <div className="p-5 sm:p-10 space-y-8">
            {/* Character Dialogue Bubble */}
            <div className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10">
              <img
                src={currentTurn.speakerAvatar}
                alt={currentTurn.speaker}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#ffd166] shrink-0"
              />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-sm font-black text-white">{currentTurn.speaker}</span>
                    <span className="text-xs text-[#b9b6d5] mr-2">({currentTurn.speakerRole})</span>
                  </div>

                  <button
                    onClick={() => {
                      playSound('click');
                      speakEnglish(currentTurn.textEn);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-[#ffd166] text-[#ffd166] hover:text-[#0c0b20] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="استمع لنطق المتحدث الصوتي"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>تشغيل الصوت</span>
                  </button>
                </div>

                <p className="text-left font-sans text-base sm:text-lg font-bold text-white leading-relaxed" dir="ltr" lang="en">
                  "{currentTurn.textEn}"
                </p>
                <p className="text-xs sm:text-sm text-[#dedbf4]">
                  {currentTurn.textAr}
                </p>
              </div>
            </div>

            {/* Grammar and Cultural Tip */}
            {currentTurn.grammarTipAr && (
              <div className="p-4 rounded-xl bg-[#ffd166]/10 border border-[#ffd166]/30 flex items-start gap-3 text-xs text-[#ffd166]">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span><strong className="font-bold">نصيحة الحوار: </strong>{currentTurn.grammarTipAr}</span>
              </div>
            )}

            {/* Student Response Options */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#41e7ff] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>اختر الرد الأنسب والأكثر لباقة في هذا الموقف:</span>
              </h4>

              <div className="space-y-2.5">
                {currentTurn.options.map((opt, optIdx) => {
                  const isChosen = selectedOption === opt;

                  return (
                    <div key={optIdx} className="space-y-1.5">
                      <button
                        onClick={() => handleChooseOption(opt)}
                        disabled={selectedOption !== null}
                        dir="ltr"
                        lang="en"
                        className={`w-full p-4 rounded-xl border text-left font-sans text-sm sm:text-base font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                          isChosen
                            ? opt.isOptimal
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                              : 'bg-amber-500/20 border-amber-500 text-amber-200'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                        }`}
                      >
                        <div className="space-y-1 text-left min-w-0 break-words" dir="ltr">
                          <div dir="ltr" lang="en">{opt.textEn}</div>
                          <div className="text-xs text-[#b9b6d5] text-right font-sans font-normal" dir="rtl">{opt.textAr}</div>
                        </div>

                        {isChosen && (
                          opt.isOptimal 
                            ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            : <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        )}
                      </button>

                      {isChosen && (
                        <div className={`p-3 rounded-xl text-xs ${opt.isOptimal ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                          {opt.feedbackAr}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Advance to next turn */}
            <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/10">
              <button
                onClick={handleRestartScenario}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#b9b6d5] hover:text-white cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة المحادثة من البداية</span>
              </button>

              <button
                onClick={handleNextTurn}
                disabled={!selectedOption}
                className="px-8 py-3 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-40 transition-all flex items-center gap-2"
              >
                <span>{currentTurnIdx < scenario.turns.length - 1 ? 'متابعة الحوار' : 'إنهاء السيناريو وحصد النقاط'}</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* SCENARIO COMPLETED REWARD SCREEN */
        <section className="glass-panel rounded-3xl p-8 sm:p-14 border border-[#ffd166]/40 text-center space-y-6 shadow-2xl">
          <div className="inline-flex p-4 rounded-3xl bg-[#ffd166]/20 border border-[#ffd166]/40 text-[#ffd166] shadow-xl">
            <Award className="w-14 h-14" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-white">تهانينا! أتممت سيناريو {txText(appText, scenario.titleAr)} بنجاح</h2>
            <p className="text-xs sm:text-sm text-[#dedbf4]">
              لقد مارست الحوار بنجاح كمتحدث أصلي وتجاوزت التحديات اللغوية للموقف.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 max-w-md mx-auto space-y-2">
            <div className="text-xs text-[#b9b6d5]">إجمالي مكافأة النقاط:</div>
            <div className="text-4xl font-black text-[#ffd166] font-mono" dir="ltr">+{scenario.rewardXp + totalScore} XP</div>
            <div className="text-xs text-[#c4ff55]">تم تسجيل الإنجاز في ملفك الأكاديمي</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestartScenario}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة تشغيل المحاكاة</span>
            </button>

            <button
              onClick={handleBackToList}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لقائمة المواقف</span>
            </button>
          </div>
        </section>
      )}

      {/* SURVIVAL VOCABULARY: belongs to the open conversation only */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-[#ffd166]">قاموس النجاة للموقف (Survival Glossary)</span>
            <h3 className="text-xl font-black text-white">أهم الكلمات والعبارات التلقائية لموقف {txText(appText, scenario.titleAr)}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenario.keyVocabulary.map((vocab, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-sm font-sans font-bold text-white">{vocab.en}</div>
                <div className="text-xs text-[#ffd166]">{vocab.ar}</div>
                {vocab.phonetic && (
                  <div className="text-[10px] text-[#b9b6d5] font-mono">{vocab.phonetic}</div>
                )}
              </div>

              <button
                onClick={() => {
                  playSound('click');
                  speakEnglish(vocab.en);
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-[#41e7ff] text-[#41e7ff] hover:text-[#0c0b20] transition-colors cursor-pointer"
                title="استمع للنطق"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
