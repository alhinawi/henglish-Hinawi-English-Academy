import React from 'react';

/** First strong letter, after list/markdown punctuation, sets each line's base. */
export function feedbackDirection(text: string): 'rtl' | 'ltr' {
  const first = text.match(/[A-Za-z\u00c0-\u024f\u0600-\u06ff]/)?.[0];
  return first && /[\u0600-\u06ff]/.test(first) ? 'rtl' : 'ltr';
}

function isolated(text: string, key: string) {
  return text.split(/([A-Za-z][^\u0600-\u06ff]*)/g).map((part, index) =>
    /[A-Za-z]/.test(part) ? <bdi key={`${key}-${index}`} dir="ltr">{part}</bdi> : <React.Fragment key={`${key}-${index}`}>{part}</React.Fragment>);
}

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*)/g).map((part, index) => {
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      return <strong key={index} className="font-bold text-white">{isolated(part.slice(2, -2), String(index))}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index} dir="auto" className="font-mono text-[#41e7ff]">{isolated(part.slice(1, -1), String(index))}</code>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={index}>{isolated(part.slice(1, -1), String(index))}</em>;
    return <React.Fragment key={index}>{isolated(part, String(index))}</React.Fragment>;
  });
}

/** Small text-only markdown subset. React escapes all provider text as data. */
export function WritingFeedback({ text }: { text: string }) {
  return <div className="space-y-2 min-w-0" data-writing-feedback="formatted">
    {text.split(/\r?\n/).map((line, index) => {
      if (/^\s*```/.test(line)) return null;
      const heading = /^\s*#{1,6}\s+/.test(line);
      const clean = line.replace(/^\s*#{1,6}\s+/, '').replace(/^\s*[-*]\s+/, '• ');
      if (!clean.trim()) return <div key={index} className="h-1" aria-hidden="true" />;
      return <p key={index} dir={feedbackDirection(clean)} style={{ textAlign: 'start' }} className={`text-xs sm:text-sm leading-7 whitespace-pre-wrap break-words ${heading ? 'font-bold text-white' : 'text-[#dedbf4]'}`}>{inline(clean)}</p>;
    })}
  </div>;
}
