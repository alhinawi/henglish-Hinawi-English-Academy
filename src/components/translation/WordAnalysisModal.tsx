// ==============================================================================
// Henglish Academy (HENGLISH) - INTERACTIVE WORD ANALYSIS MODAL
// Detailed phonetic, morphological, and lexical analysis for any clicked word
// ==============================================================================

import React, { useState } from 'react';
import { WordAnalysisDetail, VocabularyCollection } from '../../types/translation';
import { playSound, speakMultilingualText } from '../../utils/audio';
import {
  X,
  Volume2,
  BookmarkPlus,
  Check,
  Sparkles,
  BookA,
  FolderPlus,
  Layers,
} from 'lucide-react';

interface WordAnalysisModalProps {
  word: WordAnalysisDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVocabulary: (word: WordAnalysisDetail, collectionId?: string, notes?: string) => void;
  collections: VocabularyCollection[];
}

export const WordAnalysisModal: React.FC<WordAnalysisModalProps> = ({
  word,
  isOpen,
  onClose,
  onSaveToVocabulary,
  collections,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !word) return null;

  const handleSpeak = () => {
    playSound('click');
    speakMultilingualText(word.word, 'en');
  };

  const handleSave = () => {
    playSound('click');
    onSaveToVocabulary(word, selectedCollection || undefined, personalNotes.trim() || undefined);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e0c26] border border-white/20 rounded-3xl shadow-2xl overflow-hidden text-right">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-white/10 to-transparent border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#b9b6d5] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#41e7ff]/20 text-[#41e7ff] font-bold border border-[#41e7ff]/30">
              {word.cefrLevel || 'B1'}
            </span>
            <span className="text-xs text-[#b9b6d5] font-medium">التحليل المعجمي والصوتي</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Main Word Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={handleSpeak}
              title="استمع للنطق"
              className="p-3 rounded-xl bg-[#41e7ff] text-black hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#41e7ff]/20"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <div className="flex flex-col text-right">
              <h2 className="text-2xl font-black text-white tracking-wide font-sans">
                {word.word}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-[#41e7ff] font-mono">{word.ipa || `/${word.word}/`}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  {word.partOfSpeechAr || word.partOfSpeech || 'اسم'}
                </span>
              </div>
            </div>
          </div>

          {/* Meaning & Definition */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#41e7ff]/10 to-[#a855f7]/10 border border-[#41e7ff]/20 space-y-1">
            <span className="text-xs text-[#41e7ff] font-bold block">المعنى في السياق الحالي:</span>
            <p className="text-base font-bold text-white leading-relaxed">{word.meaningAr}</p>
          </div>

          {/* Example Sentence */}
          {(word.exampleEn || word.exampleAr) && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs text-[#b9b6d5] font-semibold flex items-center gap-1.5">
                <BookA className="w-4 h-4 text-[#ffb84d]" />
                <span>مثال تطبيقي في جملة:</span>
              </span>
              {word.exampleEn && (
                <p className="text-sm text-white font-sans text-left ltr bg-black/40 p-2.5 rounded-lg border border-white/5">
                  "{word.exampleEn}"
                </p>
              )}
              {word.exampleAr && (
                <p className="text-xs text-slate-300 leading-normal">
                  {word.exampleAr}
                </p>
              )}
            </div>
          )}

          {/* Synonyms & Antonyms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {word.synonyms?.length > 0 && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-[#10b981] font-bold block mb-1.5">المرادفات (Synonyms):</span>
                <div className="flex flex-wrap gap-1">
                  {word.synonyms.map((syn, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-black/30 text-slate-200">
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {word.antonyms?.length > 0 && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-red-400 font-bold block mb-1.5">المتضادات (Antonyms):</span>
                <div className="flex flex-wrap gap-1">
                  {word.antonyms.map((ant, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-black/30 text-slate-200">
                      {ant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Collocations */}
          {word.collocations?.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
              <span className="text-[#ffb84d] font-bold block">
                متلازمات لفظية شائعة (Common Collocations):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {word.collocations.map((col, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-black/40 text-slate-200 border border-white/5 font-mono"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Save to Vocabulary Section */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookmarkPlus className="w-4 h-4 text-[#41e7ff]" />
                <span>حفظ في المفردات ونظام التكرار المتباعد (SRS)</span>
              </span>
              <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded">
                خوارزمية SM-2
              </span>
            </div>

            {/* Collection Picker */}
            {collections.length > 0 && (
              <div>
                <label className="text-xs text-[#b9b6d5] block mb-1">
                  اختر المجموعة أو المجلد:
                </label>
                <select
                  value={selectedCollection}
                  onChange={e => setSelectedCollection(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#41e7ff]"
                >
                  <option value="">بدون مجموعة خاصة (المفردات العامة)</option>
                  {collections.map(col => (
                    <option key={col.id} value={col.id}>
                      {col.nameAr} ({col.name})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Personal Notes */}
            <div>
              <label className="text-xs text-[#b9b6d5] block mb-1">
                ملاحظاتك الشخصية للتذكر (اختياري):
              </label>
              <input
                type="text"
                value={personalNotes}
                onChange={e => setPersonalNotes(e.target.value)}
                placeholder="مثال: استخدمتها في إيميل شركة كذا..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#b9b6d5]/40 focus:outline-none focus:border-[#41e7ff]"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={savedSuccess}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                savedSuccess
                  ? 'bg-[#10b981] text-black shadow-lg shadow-[#10b981]/20'
                  : 'bg-gradient-to-r from-[#41e7ff] to-[#7c3aed] text-black hover:brightness-110 active:scale-95 shadow-lg shadow-[#41e7ff]/20'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم الحفظ في بنك المفردات وجدول المراجعة!</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  <span>حفظ في مفرداتي (Save to My Vocabulary)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
