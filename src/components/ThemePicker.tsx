import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Palette, X } from 'lucide-react';
import { SITE_THEMES, applySiteTheme, useSiteTheme } from '../utils/siteThemes';
import { useLanguage } from '../i18n/LanguageContext';

export function ThemePicker({ inline = false }: { inline?: boolean }) {
  const { t } = useLanguage();
  const theme = useSiteTheme();
  const themeName = (id: string) => t(`st.${id}.name`);
  const themeSubtitle = (id: string) => t(`st.${id}.subtitle`);
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
    <button ref={trigger} type="button" className={`theme-trigger ${inline ? 'theme-trigger-inline' : ''}`} aria-label={t('st.triggerAria')} title={`${t('st.triggerTitle')}: ${themeName(theme.id)}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}><Palette size={17} />{inline && <span>{t('st.triggerTitle')} · {themeName(theme.id)}</span>}</button>
    {open && createPortal(<div className="theme-backdrop" onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}><div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="site-theme-heading" className="theme-dialog" dir="rtl">
      <div className="theme-dialog-header"><div><span className="theme-eyebrow" dir="ltr">HENGLISH · APPEARANCE</span><h2 id="site-theme-heading">{t('st.heading')}</h2><p>{SITE_THEMES.length} {t('st.sub')}</p></div><button type="button" className="theme-close" onClick={() => setOpen(false)} aria-label={t('st.closeAria')}><X size={20} /></button></div>
      <div className="theme-options">{SITE_THEMES.map((th, index) => <button type="button" key={th.id} className="theme-option" aria-pressed={theme.id === th.id} aria-label={themeName(th.id)} onClick={() => applySiteTheme(th.id)}>
        <span className="theme-preview" aria-hidden="true" style={{ background: th.bg, borderColor: th.raised }}><span className="theme-preview-rail" style={{ background: th.panel }} /><span className="theme-preview-content"><span className="theme-preview-line" style={{ background: th.accent }} /><span className="theme-preview-block" style={{ background: th.panel }}><span style={{ background: th.raised }} /><span style={{ background: th.secondary }} /></span><span className="theme-preview-line short" style={{ background: th.muted }} /></span><span className="theme-preview-number" style={{ color: th.muted }}>{String(index + 1).padStart(2, '0')}</span></span>
        <span className="theme-option-title">{themeName(th.id)}{theme.id === th.id && <Check size={15} aria-label={t('st.selectedAria')} />}</span><span className="theme-option-subtitle">{themeSubtitle(th.id)}</span>
      </button>)}</div>
      <div className="theme-dialog-footer"><p role="status">{t('st.currentLabel')}: <strong>{themeName(theme.id)}</strong></p><span>{t('st.footerNote')}</span><button type="button" onClick={() => setOpen(false)} className="theme-done">{t('st.done')}</button></div>
    </div></div>, document.body)}
  </>;
}
