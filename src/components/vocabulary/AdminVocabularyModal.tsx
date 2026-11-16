// ==============================================================================
// Henglish Academy (HENGLISH) - ADMIN VOCABULARY MANAGEMENT MODAL
// Loaded vocabulary counts, headword authoring, and JSON/CSV bulk import
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  X,
  Database,
  PlusCircle,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';
import { loadFullVocabulary, LexicalEntry, saveWord } from '../../services/vocabularyService';
import { playSound } from '../../utils/audio';

interface AdminVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWordAdded?: () => void;
}

export const AdminVocabularyModal: React.FC<AdminVocabularyModalProps> = ({
  isOpen,
  onClose,
  onWordAdded,
}) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<{ words: number; audioUs: number; audioUk: number; levels: Record<string, number> } | null>(null);
  const [statsError, setStatsError] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'add' | 'bulk'>('stats');

  // Add form fields
  const [headword, setHeadword] = useState('');
  const [meaningAr, setMeaningAr] = useState('');
  const [definitionEn, setDefinitionEn] = useState('');
  const [cefr, setCefr] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('B1');
  const [pos, setPos] = useState('noun');
  const [ipaUs, setIpaUs] = useState('');
  const [ipaUk, setIpaUk] = useState('');
  const [exampleEn, setExampleEn] = useState('');
  const [exampleAr, setExampleAr] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Bulk Import
  const [bulkData, setBulkData] = useState('');
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);
  const [bulkOk, setBulkOk] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setStats(null);
    setStatsError(false);
    loadFullVocabulary().then(words => {
      if (!active) return;
      const levels: Record<string, number> = {};
      for (const word of words) levels[word.cefr] = (levels[word.cefr] || 0) + 1;
      setStats({ words: words.length, audioUs: words.filter(w => !!w.audioUsUrl).length,
        audioUk: words.filter(w => !!w.audioUkUrl).length, levels });
    }).catch(() => { if (active) setStatsError(true); });
    return () => { active = false; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headword.trim() || !meaningAr.trim()) return;

    const newEntry: LexicalEntry = {
      id: `custom-${Date.now()}`,
      headword: headword.trim(),
      normalized: headword.trim().toLowerCase(),
      pos,
      cefr,
      ipaUs: ipaUs.trim() || `/${headword}/`,
      ipaUk: ipaUk.trim() || ipaUs.trim() || `/${headword}/`,
      frequencyTier: 'academic',
      domain: 'academic',
      formality: 'Neutral',
      meaningAr: meaningAr.trim(),
      definitionEn: definitionEn.trim() || `Refers to ${headword}.`,
      exampleEn: exampleEn.trim() || `Understanding ${headword} is important.`,
      exampleAr: exampleAr.trim() || t('avm.exampleFallback').replace('{m}', meaningAr),
    };

    saveWord(newEntry);
    playSound('success');
    setSuccessMsg(t('avm.addSuccess').replace('{w}', headword));

    // Reset form
    setHeadword('');
    setMeaningAr('');
    setDefinitionEn('');
    setIpaUs('');
    setIpaUk('');
    setExampleEn('');
    setExampleAr('');

    if (onWordAdded) onWordAdded();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleBulkImport = () => {
    try {
      const parsed = JSON.parse(bulkData);
      if (!Array.isArray(parsed)) {
        throw new Error(t('avm.bulkInvalid'));
      }
      let count = 0;
      parsed.forEach((item: any) => {
        if (item.headword && item.meaningAr) {
          saveWord({
            id: item.id || `bulk-${Date.now()}-${count}`,
            headword: item.headword,
            normalized: item.headword.toLowerCase(),
            pos: item.pos || 'noun',
            cefr: item.cefr || 'B1',
            ipaUs: item.ipaUs || `/${item.headword}/`,
            ipaUk: item.ipaUk || `/${item.headword}/`,
            audioUsUrl: item.audioUsUrl,
            audioUkUrl: item.audioUkUrl,
            frequencyTier: item.frequencyTier || 'general',
            domain: item.domain || 'everyday',
            formality: item.formality || 'Neutral',
            meaningAr: item.meaningAr,
            definitionEn: item.definitionEn || `Refers to ${item.headword}.`,
            exampleEn: item.exampleEn || '',
            exampleAr: item.exampleAr || '',
          });
          count++;
        }
      });
      playSound('success');
      setBulkOk(true);
      setBulkStatus(t('avm.bulkSuccess').replace('{n}', String(count)));
      setBulkData('');
      if (onWordAdded) onWordAdded();
    } catch (err: any) {
      playSound('wrong');
      setBulkOk(false);
      setBulkStatus(`${t('avm.bulkError')} ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-3xl rounded-3xl border border-white/15 bg-linear-to-b from-[#15142b] via-[#100f24] to-[#0a0918] p-6 sm:p-8 shadow-2xl text-right space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#41e7ff]/15 text-[#41e7ff]">
              <Database className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-white">
              {t('avm.title')}
            </h3>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-[#41e7ff] text-[#09091a] font-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {t('avm.tabStats')}
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'add'
                ? 'bg-[#c4ff55] text-[#09091a] font-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {t('avm.tabAdd')}
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bulk'
                ? 'bg-[#ffd166] text-[#09091a] font-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {t('avm.tabBulk')}
          </button>
        </div>

        {/* TAB 1: LOADED VOCABULARY STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {statsError ? <p role="status">{t('ev.loadError')}</p> : !stats ? <p role="status">{t('vx.loading')}</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: t('vx.words'), value: stats.words },
                { label: t('avm.statAudioUs'), value: stats.audioUs },
                { label: t('avm.statAudioUk'), value: stats.audioUk },
              ].map(item => <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] text-white/60 font-bold">{item.label}</span>
                <div className="text-2xl font-black text-[#c4ff55]">{item.value.toLocaleString('en-US')}</div>
              </div>)}
            </div>)}

            {stats && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-white/80">CEFR</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries(stats.levels).map(([lvl, count]) => (
                    <div key={lvl} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="font-bold text-white">{lvl}</span>
                      <span className="font-mono text-[#c4ff55]">{count.toLocaleString('en-US')} {t('avm.wordUnit')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        )}

        {/* TAB 2: ADD WORD */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddWord} className="space-y-4">
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white">{t('avm.headwordLabel')} *</label>
                <input
                  type="text"
                  required
                  value={headword}
                  onChange={e => setHeadword(e.target.value)}
                  placeholder="e.g. breakthrough"
                  className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-[#c4ff55]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white">{t('avm.meaningLabel')} *</label>
                <input
                  type="text"
                  required
                  value={meaningAr}
                  onChange={e => setMeaningAr(e.target.value)}
                  placeholder={t('avm.examplePlaceholder')}
                  className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#c4ff55]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white">{t('avm.cefrLabel')}</label>
                <select
                  value={cefr}
                  onChange={e => setCefr(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white">{t('avm.posLabel')}</label>
                <select
                  value={pos}
                  onChange={e => setPos(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs"
                >
                  <option value="noun">{t('avm.posNoun')}</option>
                  <option value="verb">{t('avm.posVerb')}</option>
                  <option value="adjective">{t('avm.posAdjective')}</option>
                  <option value="adverb">{t('avm.posAdverb')}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white">{t('avm.ipaUsLabel')}</label>
                <input
                  type="text"
                  value={ipaUs}
                  onChange={e => setIpaUs(e.target.value)}
                  placeholder="/ˈbreɪk.θruː/"
                  className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white">{t('avm.ipaUkLabel')}</label>
                <input
                  type="text"
                  value={ipaUk}
                  onChange={e => setIpaUk(e.target.value)}
                  placeholder="/ˈbreɪk.θruː/"
                  className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white">{t('avm.defLabel')}</label>
              <textarea
                rows={2}
                value={definitionEn}
                onChange={e => setDefinitionEn(e.target.value)}
                placeholder="A major, sudden development or discovery..."
                className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white font-sans text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white">{t('avm.exampleEnLabel')}</label>
                <input
                  type="text"
                  value={exampleEn}
                  onChange={e => setExampleEn(e.target.value)}
                  placeholder="Scientists made a medical breakthrough."
                  className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white font-sans text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-white">{t('avm.exampleArLabel')}</label>
                <input
                  type="text"
                  value={exampleAr}
                  onChange={e => setExampleAr(e.target.value)}
                  placeholder={t('avm.exampleArPlaceholder')}
                  className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#c4ff55] text-[#09091a] font-black text-sm hover:bg-[#d4ff75] transition-all cursor-pointer"
            >
              {t('avm.saveBtn')}
            </button>
          </form>
        )}

        {/* TAB 3: BULK IMPORT */}
        {activeTab === 'bulk' && (
          <div className="space-y-4">
            <p className="text-xs text-white/70">
              {t('avm.bulkIntro')} <code>[&#123; "headword": "...", "meaningAr": "...", "cefr": "B1" &#125;]</code>.
            </p>

            <textarea
              rows={8}
              value={bulkData}
              onChange={e => setBulkData(e.target.value)}
              placeholder='[
  {
    "headword": "resilience",
    "meaningAr": "المرونة والقدرة على التعافي السريع",
    "cefr": "B2",
    "pos": "noun",
    "ipaUs": "/rɪˈzɪl.jəns/",
    "ipaUk": "/rɪˈzɪl.jəns/",
    "definitionEn": "The capacity to recover quickly from difficulties."
  }
]'
              className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#ffd166]"
              dir="ltr"
            />

            {bulkStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                  bulkOk
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border-red-500/40'
                }`}
              >
                {bulkOk ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{bulkStatus}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleBulkImport}
              disabled={!bulkData.trim()}
              className="w-full py-3 rounded-xl bg-[#ffd166] text-[#09091a] font-black text-sm hover:bg-[#ffe18d] transition-all cursor-pointer disabled:opacity-40"
            >
              {t('avm.bulkBtn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

