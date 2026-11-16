import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Palette, X } from 'lucide-react';
import { SITE_THEMES, applySiteTheme, useSiteTheme } from '../utils/siteThemes';

export function ThemePicker({ inline = false }: { inline?: boolean }) {
  const theme = useSiteTheme();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const selected = dialog.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    selected?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab') return;
      const controls = dialog.current?.querySelectorAll<HTMLButtonElement>('button');
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', key); trigger.current?.focus(); };
  }, [open]);
  return <>
    <button ref={trigger} type="button" className={`theme-trigger ${inline ? 'theme-trigger-inline' : ''}`} aria-label="اختيار مظهر الموقع" title={`مظهر الموقع: ${theme.name}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}><Palette size={17} />{inline && <span>مظهر الموقع · {theme.name}</span>}</button>
    {open && createPortal(<div className="theme-backdrop" onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}><div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="site-theme-heading" className="theme-dialog" dir="rtl">
      <div className="theme-dialog-header"><div><span className="theme-eyebrow" dir="ltr">HENGLISH · APPEARANCE</span><h2 id="site-theme-heading">مساحة تشبه ذوقك</h2><p>12 مظهرا. اختر ما يريح عينيك.</p></div><button type="button" className="theme-close" onClick={() => setOpen(false)} aria-label="إغلاق المظاهر"><X size={20} /></button></div>
      <div className="theme-options">{SITE_THEMES.map((t, index) => <button type="button" key={t.id} className="theme-option" aria-pressed={theme.id === t.id} aria-label={t.name} onClick={() => applySiteTheme(t.id)}>
        <span className="theme-preview" aria-hidden="true" style={{ background: t.bg, borderColor: t.raised }}><span className="theme-preview-rail" style={{ background: t.panel }} /><span className="theme-preview-content"><span className="theme-preview-line" style={{ background: t.accent }} /><span className="theme-preview-block" style={{ background: t.panel }}><span style={{ background: t.raised }} /><span style={{ background: t.secondary }} /></span><span className="theme-preview-line short" style={{ background: t.muted }} /></span><span className="theme-preview-number" style={{ color: t.muted }}>{String(index + 1).padStart(2, '0')}</span></span>
        <span className="theme-option-title">{t.name}{theme.id === t.id && <Check size={15} aria-label="محدد" />}</span><span className="theme-option-subtitle">{t.subtitle}</span>
      </button>)}</div>
      <div className="theme-dialog-footer"><p role="status">المظهر الحالي: <strong>{theme.name}</strong></p><span>يُطبّق فورا، ويُحفظ على هذا المتصفح عند إتاحة التخزين.</span><button type="button" onClick={() => setOpen(false)} className="theme-done">تم الاختيار</button></div>
    </div></div>, document.body)}
  </>;
}
