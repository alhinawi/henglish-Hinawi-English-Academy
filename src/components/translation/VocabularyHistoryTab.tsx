// ==============================================================================
// Henglish Academy (HENGLISH) - TRANSLATION HISTORY & SAVED VOCABULARY TAB
// Searchable history logs, custom decks, SM-2 SRS integration, and reuse
// ==============================================================================

import { vocabularyCollectionLabel } from '../../services/vocabularyCollectionLabel';
import React, { useState } from 'react';
import {
  TranslationHistoryItem,
  SavedVocabularyCard,
  VocabularyCollection,
} from '../../types/translation';
import {
  getTranslationHistory,
  toggleHistoryFavorite,
  deleteHistoryItem,
  clearTranslationHistory,
  getSavedVocabularyCards,
  deleteSavedVocabularyCard,
  getVocabularyCollections,
  createVocabularyCollection,
} from '../../services/translationService';
import { playSound } from '../../utils/audio';
import { LessonSpeechButton } from '../LessonSpeechButton';
import {
  History,
  Bookmark,
  Star,
  Search,
  Trash2,
  RotateCcw,
  Volume2,
  FolderPlus,
  Plus,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface VocabularyHistoryTabProps {
  learnerId?: string;
  onReuseTranslation: (sourceText: string, mode: string) => void;
}

export const VocabularyHistoryTab: React.FC<VocabularyHistoryTabProps> = ({
  onReuseTranslation,
  learnerId,
}) => {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<'history' | 'vocabulary'>('history');

  // History State
  const [historyItems, setHistoryItems] = useState<TranslationHistoryItem[]>(() =>
    getTranslationHistory(learnerId)
  );
  const [historySearch, setHistorySearch] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Vocabulary State
  const [vocabCards, setVocabCards] = useState<SavedVocabularyCard[]>(() =>
    getSavedVocabularyCards(learnerId)
  );
  const [collections, setCollections] = useState<VocabularyCollection[]>(() =>
    getVocabularyCollections(learnerId)
  );
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string>('all');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [collectionSaveFailed, setCollectionSaveFailed] = useState(false);

  // Filtered History
  const filteredHistory = historyItems.filter(item => {
    if (onlyFavorites && !item.isFavorite) return false;
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      return (
        item.sourceText.toLowerCase().includes(q) ||
        item.translatedText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Vocabulary
  const filteredVocab = vocabCards.filter(card => {
    if (selectedCollectionFilter !== 'all' && card.collectionId !== selectedCollectionFilter) {
      return false;
    }
    return true;
  });

  const handleToggleFav = (id: string) => {
    playSound('click');
    const updated = toggleHistoryFavorite(id, learnerId);
    setHistoryItems(updated);
  };

  const handleDeleteHistory = (id: string) => {
    playSound('click');
    const updated = deleteHistoryItem(id, learnerId);
    setHistoryItems(updated);
  };

  const handleClearAllHistory = () => {
    if (confirm(t('vh.confirmClear'))) {
      playSound('click');
      clearTranslationHistory(learnerId);
      setHistoryItems([]);
    }
  };

  const handleDeleteVocab = (id: string) => {
    playSound('click');
    const updated = deleteSavedVocabularyCard(id, learnerId);
    setVocabCards(updated);
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    playSound('click');
    setCollectionSaveFailed(false);
    try {
      const created = createVocabularyCollection(newCollectionName.trim(), newCollectionName.trim(), undefined, undefined, learnerId);
      setCollections(prev => [...prev, created]);
      setNewCollectionName('');
      setIsCreatingCollection(false);
    } catch {
      setCollectionSaveFailed(true);
    }
  };



  return (
    <div className="space-y-6 text-right">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between p-2 bg-[#0e0c26] rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setSubTab('history');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'history'
                ? 'bg-[#41e7ff] text-black shadow-md shadow-[#41e7ff]/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{t('vh.tabHistory')} <bdi dir="ltr" className="whitespace-nowrap">({historyItems.length})</bdi></span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              setSubTab('vocabulary');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'vocabulary'
                ? 'bg-[#41e7ff] text-black shadow-md shadow-[#41e7ff]/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{t('vh.tabVocab')} <bdi dir="ltr" className="whitespace-nowrap">({vocabCards.length})</bdi></span>
          </button>
        </div>

        {subTab === 'history' && historyItems.length > 0 && (
          <button
            type="button"
            onClick={handleClearAllHistory}
            className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('vh.clearHistory')}</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: TRANSLATION HISTORY                                            */}
      {/* ========================================================================= */}
      {subTab === 'history' && (
        <div className="space-y-4">
          {/* Search & Favorites Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute right-3.5 top-3 text-[#b9b6d5]" />
              <input
                type="text"
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                placeholder={t('vh.searchPlaceholder')}
                className="w-full bg-[#0e0c26] border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-[#b9b6d5]/40 focus:outline-none focus:border-[#41e7ff]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setOnlyFavorites(prev => !prev);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shrink-0 ${
                onlyFavorites
                  ? 'bg-[#ffb84d] text-black font-bold shadow-md shadow-[#ffb84d]/20'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
              <span>{t('vh.favoritesOnly')}</span>
            </button>
          </div>

          {/* History Items Grid */}
          {filteredHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredHistory.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#0e0c26] border border-white/10 hover:border-[#41e7ff]/30 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#41e7ff] bg-[#41e7ff]/10 px-2 py-0.5 rounded">
                        {item.mode}
                      </span>
                      <span className="text-[10px] text-[#b9b6d5]/50">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleFav(item.id)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          item.isFavorite
                            ? 'text-[#ffb84d] hover:text-[#ffb84d]/80'
                            : 'text-slate-500 hover:text-white'
                        }`}
                        title={t('vh.addFavorite')}
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHistory(item.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title={t('vh.deleteHistory')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Texts */}
                  <div className="space-y-1.5">
                    <p className="text-xs text-white font-medium line-clamp-2">
                      {item.sourceText}
                    </p>
                    <p className="text-xs text-[#41e7ff] font-bold line-clamp-2">
                      {item.translatedText}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-wrap items-start justify-between gap-3 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        onReuseTranslation(item.sourceText, item.mode);
                      }}
                      className="flex items-center gap-1.5 text-xs text-[#41e7ff] hover:underline font-semibold cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('vh.reuseInEditor')}</span>
                    </button>

                    <LessonSpeechButton text={item.translatedText} language={item.targetLang} label={t('vh.listen')} iconOnly
                      className="p-1.5 rounded-lg text-[#b9b6d5] hover:text-white hover:bg-white/5 transition-colors cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-[#b9b6d5]/50 bg-[#0e0c26] rounded-2xl border border-white/10">
              <History className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#41e7ff]" />
              <p className="text-sm">{t('vh.noHistory')}</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: SAVED VOCABULARY & COLLECTIONS                                 */}
      {/* ========================================================================= */}
      {subTab === 'vocabulary' && (
        <div className="space-y-5">
          {/* Collections Selector & Creator */}
          <div className="p-4 rounded-2xl bg-[#0e0c26] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#41e7ff]" />
                <span>{t('vh.decksTitle')}</span>
              </h4>

              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setIsCreatingCollection(prev => !prev);
                }}
                className="text-xs text-[#41e7ff] hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('vh.newDeck')}</span>
              </button>
            </div>

            <p role="status" className="text-xs leading-6 text-amber-200">{collectionSaveFailed ? t('vocab.saveError') : ''}</p>
            {/* Create Collection Form */}
            {isCreatingCollection && (
              <form onSubmit={handleCreateCollection} className="flex gap-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={e => { setNewCollectionName(e.target.value); setCollectionSaveFailed(false); }}
                  placeholder={t('vh.deckNamePlaceholder')}
                  className="min-w-0 flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#b9b6d5]/40 focus:outline-none focus:border-[#41e7ff]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#41e7ff] text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  {t('vh.create')}
                </button>
              </form>
            )}

            {/* Collection Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setSelectedCollectionFilter('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shrink-0 ${
                  selectedCollectionFilter === 'all'
                    ? 'bg-[#41e7ff] text-black font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {t('vh.allWords')} <bdi dir="ltr" className="whitespace-nowrap">({vocabCards.length})</bdi>
              </button>

              {collections.map(col => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setSelectedCollectionFilter(col.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    selectedCollectionFilter === col.id
                      ? 'bg-gradient-to-r from-[#41e7ff]/30 to-[#a855f7]/30 border border-[#41e7ff] text-white font-bold'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <span>{vocabularyCollectionLabel(col, t)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredVocab.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredVocab.map(card => (
                <div
                  key={card.id}
                  className="p-4 rounded-2xl bg-[#0e0c26] border border-white/10 hover:border-[#a855f7]/40 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-[#a855f7]/20 text-[#a855f7] font-bold">
                        {card.cefrLevel || 'B1'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteVocab(card.id)}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        title={t('vh.deleteVocab')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-lg font-black text-white font-sans tracking-wide">
                      {card.wordOrPhrase}
                    </h4>
                    <p className="text-xs text-[#41e7ff] font-semibold mt-0.5">
                      {card.translationAr}
                    </p>

                    {card.ipa && (
                      <span className="text-[11px] text-[#b9b6d5] font-mono block mt-1">
                        {card.ipa}
                      </span>
                    )}

                    {card.personalNotes && (
                      <p className="text-[11px] text-slate-300 bg-black/40 p-2 rounded-lg mt-2 border border-white/5">
                        <span className="text-[#ffb84d] font-semibold ml-1">{t('vh.noteLabel')}</span>
                        {card.personalNotes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-start justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                    <span className="text-[10px] text-[#10b981] font-medium">
                      {t('vh.srsActive')}
                    </span>
                    <LessonSpeechButton text={card.wordOrPhrase} label={t('vh.listen')} iconOnly
                      className="p-1 rounded-md text-[#b9b6d5] hover:text-[#41e7ff] cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-[#b9b6d5]/50 bg-[#0e0c26] rounded-2xl border border-white/10">
              <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#41e7ff]" />
              <p className="text-sm">{t('vh.noDeckWords')}</p>
              <p className="text-xs text-[#b9b6d5]/30 mt-1">
                {t('vh.noDeckWordsHint')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
