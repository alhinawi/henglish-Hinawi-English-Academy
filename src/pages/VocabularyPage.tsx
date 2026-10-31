import React, { useState } from 'react';
import { VERB_TOOLKIT } from '../data/verbsData';
import { playSound, speakEnglish } from '../utils/audio';
import { Search, Volume2, Sparkles } from 'lucide-react';

export const VocabularyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [irregularOnly, setIrregularOnly] = useState(false);

  const categories = [
    { id: 'all', label: 'جميع الأفعال' },
    { id: 'study', label: 'الدراسة والتعليم' },
    { id: 'work', label: 'العمل والمشاريع' },
    { id: 'tech', label: 'البرمجة والتكنولوجيا' },
    { id: 'daily', label: 'الحياة اليومية' },
  ];

  const filteredVerbs = VERB_TOOLKIT.filter(v => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      v.v1.toLowerCase().includes(term) ||
      v.v2.toLowerCase().includes(term) ||
      v.v3.toLowerCase().includes(term) ||
      v.meaningAr.toLowerCase().includes(term);

    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesIrreg = !irregularOnly || v.isIrregular;

    return matchesSearch && matchesCat && matchesIrreg;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#c4ff55]/15 text-[#c4ff55] border border-[#c4ff55]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>V3 VERB TOOLKIT • حقيبة أفعال التصريف الثالث</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          دليل تصريفات الأفعال V1, V2, V3 📚
        </h1>
        <p className="text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
          المستقبل التام يعتمد كلياً على التصريف الثالث (V3). ابحث عن أي فعل واستمع لنطقه الإنجليزي واقرأ أمثلة عملية جاهزة.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-[#41e7ff] absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              dir="auto"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ابحث عن فعل بالإنجليزية أو العربية (write, done, يكتب...)"
              className="w-full pl-4 pr-12 py-3 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-[#b9b6d5]/50 text-sm focus:outline-none focus:border-[#41e7ff]"
            />
          </div>

          {/* Irregular Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-bold text-white shrink-0">
            <input
              type="checkbox"
              checked={irregularOnly}
              onChange={e => setIrregularOnly(e.target.checked)}
              className="w-4 h-4 rounded accent-[#ffd166]"
            />
            <span>أفعال شاذة فقط (Irregular only)</span>
          </label>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => {
                playSound('click');
                setSelectedCategory(c.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black'
                  : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verbs Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#201d43]/80 text-xs sm:text-sm font-black text-[#ffd166]">
                <th className="p-4 sm:p-5">Base (V1)</th>
                <th className="p-4 sm:p-5">Past Simple (V2)</th>
                <th className="p-4 sm:p-5 text-[#c4ff55]">Past Participle (V3) ⭐</th>
                <th className="p-4 sm:p-5">المعنى بالعربي</th>
                <th className="p-4 sm:p-5">مثال في المستقبل التام</th>
                <th className="p-4 sm:p-5 text-center">نطق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {filteredVerbs.map((verb) => (
                <tr 
                  key={verb.v1}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4 sm:p-5 font-bold text-white en">
                    {verb.v1}
                    {verb.isIrregular && (
                      <span className="mr-2 px-1.5 py-0.5 rounded text-[10px] bg-[#ffd166]/20 text-[#ffd166] font-['Cairo']">
                        شاذ
                      </span>
                    )}
                  </td>
                  <td className="p-4 sm:p-5 text-[#dedbf4] en font-semibold">
                    {verb.v2}
                  </td>
                  <td className="p-4 sm:p-5 en font-black text-[#c4ff55] text-sm sm:text-base">
                    {verb.v3}
                  </td>
                  <td className="p-4 sm:p-5 text-[#dedbf4] font-bold">
                    {verb.meaningAr}
                  </td>
                  <td className="p-4 sm:p-5 en text-xs text-[#b9b6d5] max-w-xs">
                    {verb.example}
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <button
                      onClick={() => {
                        playSound('click');
                        speakEnglish(`${verb.v1}, ${verb.v2}, ${verb.v3}`);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#41e7ff] transition-colors cursor-pointer inline-flex items-center justify-center"
                      title="استمع لتصريفات الفعل"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVerbs.length === 0 && (
          <div className="p-12 text-center text-[#b9b6d5]">
            <p className="text-base font-bold">لم نجد أفعالاً مطابقة لبحثك.</p>
          </div>
        )}
      </div>

    </div>
  );
};
