// ==============================================================================
// Henglish Academy (HENGLISH) - SAFE EDUCATIONAL MARKDOWN RENDERER
// Handles Headings, Tables, Code Blocks, LTR English Isolation, & Platform Deep-Links
// ==============================================================================

import React from 'react';
import { PageRoute } from '../types';
import { Volume2, ExternalLink, Copy, Check } from 'lucide-react';
import { speakEnglishVoice, playSound } from '../utils/audio';

interface AiMarkdownRendererProps {
  content: string;
  onNavigate?: (route: PageRoute) => void;
}

export const AiMarkdownRenderer: React.FC<AiMarkdownRendererProps> = ({ content, onNavigate }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    playSound('click');
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to determine if a string is predominantly English
  const isEnglishText = (str: string): boolean => {
    const clean = str.replace(/[0-9\s.,!?'"()[\]{}:;\\/-]/g, '');
    if (!clean) return false;
    const arabicCount = (clean.match(/[\u0600-\u06FF]/g) || []).length;
    const latinCount = (clean.match(/[a-zA-Z]/g) || []).length;
    return latinCount > arabicCount;
  };

  // Format inline markdown (bold, italic, code, links)
  const renderInlineFormatted = (text: string, keyPrefix: string): React.ReactNode => {
    // Check for platform markdown links [Title](route)
    const linkRegex = /\[([^\]]+)\]\((#[^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(renderBasicTokens(text.substring(lastIndex, matchIndex), `${keyPrefix}-txt-${lastIndex}`));
      }

      const linkTitle = match[1];
      const linkHash = match[2].replace('#', '');

      parts.push(
        <button
          key={`${keyPrefix}-lnk-${matchIndex}`}
          onClick={() => {
            playSound('click');
            if (onNavigate) {
              onNavigate(linkHash as PageRoute);
            } else {
              window.location.hash = linkHash;
            }
          }}
          className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-lg bg-[#ffd166]/20 hover:bg-[#ffd166]/30 border border-[#ffd166]/50 text-[#ffd166] text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
        >
          <span>{linkTitle}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(renderBasicTokens(text.substring(lastIndex), `${keyPrefix}-txt-${lastIndex}`));
    }

    return parts.length > 0 ? parts : renderBasicTokens(text, keyPrefix);
  };

  // Helper for Bold, Italic, and Inline Code
  const renderBasicTokens = (text: string, keyPrefix: string): React.ReactNode => {
    // Regex for inline code `...`, bold **...**, and italic *...*
    const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const segments = text.split(tokenRegex);

    return segments.map((seg, i) => {
      if (seg.startsWith('`') && seg.endsWith('`')) {
        const code = seg.slice(1, -1);
        return (
          <code
            key={`${keyPrefix}-c-${i}`}
            dir="ltr"
            className="px-2 py-0.5 mx-1 rounded-md bg-[#0c0b20] border border-white/20 text-[#41e7ff] font-mono text-xs sm:text-[13px] font-bold select-all inline-block"
          >
            {code}
          </code>
        );
      }
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return (
          <strong key={`${keyPrefix}-b-${i}`} className="font-black text-white px-0.5">
            {seg.slice(2, -2)}
          </strong>
        );
      }
      if (seg.startsWith('*') && seg.endsWith('*') && !seg.startsWith('**')) {
        const italic = seg.slice(1, -1);
        const isEn = isEnglishText(italic);
        return (
          <span
            key={`${keyPrefix}-i-${i}`}
            dir={isEn ? 'ltr' : 'auto'}
            className={`italic ${isEn ? 'font-mono text-[#ffd166] font-semibold' : 'text-[#dedbf4]'}`}
          >
            {italic}
          </span>
        );
      }
      return <span key={`${keyPrefix}-s-${i}`}>{seg}</span>;
    });
  };

  // Parse lines
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];
  let codeBlockLang = '';
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = (index: number) => {
    if (tableRows.length === 0) return;
    const [header, , ...body] = tableRows;
    renderedElements.push(
      <div key={`table-${index}`} className="my-4 overflow-x-auto rounded-2xl border border-white/15 bg-black/30 shadow-lg">
        <table className="w-full text-right text-xs">
          {header && (
            <thead className="bg-white/10 text-[#ffd166] border-b border-white/15 font-bold">
              <tr>
                {header.map((col, cIdx) => (
                  <th key={cIdx} className="p-3">
                    {renderInlineFormatted(col.trim(), `th-${index}-${cIdx}`)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-white/10 text-[#dedbf4]">
            {body.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-3" dir={isEnglishText(cell) ? 'ltr' : 'auto'}>
                    {renderInlineFormatted(cell.trim(), `td-${index}-${rIdx}-${cIdx}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        const codeText = codeBlockBuffer.join('\n');
        const codeIndex = lineIdx;
        renderedElements.push(
          <div key={`codeblock-${lineIdx}`} className="my-3 rounded-2xl overflow-hidden border border-white/20 bg-[#09081a] shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-[11px] text-[#b9b6d5]">
              <span className="font-mono font-bold text-[#41e7ff] uppercase">
                {codeBlockLang || 'English Expression / Formula'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakEnglishVoice(codeText)}
                  className="p-1 hover:text-[#ffd166] text-[#b9b6d5] transition-colors cursor-pointer"
                  title="استمع للنطق"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleCopy(codeText, codeIndex)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#b9b6d5] hover:text-white transition-all cursor-pointer"
                  title="نسخ النص"
                >
                  {copiedIndex === codeIndex ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">نسخ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre dir="ltr" className="p-4 text-xs sm:text-sm font-mono text-[#dedbf4] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        codeBlockBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeBlockLang = trimmed.replace('```', '').trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      return;
    }

    // Tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      const columns = trimmed.slice(1, -1).split('|');
      tableRows.push(columns);
      return;
    } else if (inTable) {
      flushTable(lineIdx);
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      renderedElements.push(
        <h3 key={lineIdx} className="text-base sm:text-lg font-black text-white mt-4 mb-2 flex items-center gap-2 border-r-4 border-[#ffd166] pr-2.5">
          {renderInlineFormatted(trimmed.replace('### ', ''), `h3-${lineIdx}`)}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      renderedElements.push(
        <h2 key={lineIdx} className="text-lg sm:text-xl font-black text-[#ffd166] mt-5 mb-2.5 flex items-center gap-2 border-r-4 border-[#41e7ff] pr-3">
          {renderInlineFormatted(trimmed.replace('## ', ''), `h2-${lineIdx}`)}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      renderedElements.push(
        <h1 key={lineIdx} className="text-xl sm:text-2xl font-black text-white mt-6 mb-3 border-b border-white/20 pb-2">
          {renderInlineFormatted(trimmed.replace('# ', ''), `h1-${lineIdx}`)}
        </h1>
      );
      return;
    }

    // Blockquotes
    if (trimmed.startsWith('> ')) {
      renderedElements.push(
        <blockquote
          key={lineIdx}
          className="my-3 p-3.5 sm:p-4 rounded-2xl bg-linear-to-r from-[#ffd166]/15 to-[#41e7ff]/10 border-r-4 border-[#ffd166] text-xs sm:text-sm font-medium text-white shadow-md leading-relaxed"
        >
          {renderInlineFormatted(trimmed.replace('> ', ''), `bq-${lineIdx}`)}
        </blockquote>
      );
      return;
    }

    // Bullet points (•, -, *)
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const cleanBullet = trimmed.substring(2);
      const isEn = isEnglishText(cleanBullet);
      return renderedElements.push(
        <div key={lineIdx} className="flex items-start gap-2.5 my-1.5 text-xs sm:text-sm leading-relaxed">
          <span className="w-2 h-2 rounded-full bg-[#ffd166] mt-2 shrink-0 shadow-sm" />
          <div dir={isEn ? 'ltr' : 'auto'} className="flex-1 text-[#dedbf4]">
            {renderInlineFormatted(cleanBullet, `li-${lineIdx}`)}
          </div>
        </div>
      );
    }

    // Numbered lists (1., 2., etc.)
    const numMatch = trimmed.match(/^(\d+)[.)]\s+(.*)/);
    if (numMatch) {
      const num = numMatch[1];
      const rest = numMatch[2];
      const isEn = isEnglishText(rest);
      return renderedElements.push(
        <div key={lineIdx} className="flex items-start gap-2.5 my-2 text-xs sm:text-sm leading-relaxed">
          <span className="w-5 h-5 rounded-lg bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/40 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
            {num}
          </span>
          <div dir={isEn ? 'ltr' : 'auto'} className="flex-1 text-[#dedbf4]">
            {renderInlineFormatted(rest, `ol-${lineIdx}`)}
          </div>
        </div>
      );
    }

    // Empty line spacer
    if (!trimmed) {
      renderedElements.push(<div key={lineIdx} className="h-2" />);
      return;
    }

    // Standard paragraph
    const isEnPara = isEnglishText(trimmed);
    renderedElements.push(
      <p
        key={lineIdx}
        dir={isEnPara ? 'ltr' : 'auto'}
        className={`my-1.5 text-xs sm:text-sm leading-relaxed ${isEnPara ? 'font-mono text-[#41e7ff]' : 'text-[#dedbf4]'}`}
      >
        {renderInlineFormatted(trimmed, `p-${lineIdx}`)}
      </p>
    );
  });

  if (inTable) {
    flushTable(lines.length);
  }

  return <div className="space-y-1">{renderedElements}</div>;
};
