import { useSyncExternalStore } from 'react';

export type SiteTheme = {
  id: string; mode: 'dark' | 'light';
  bg: string; panel: string; raised: string; ink: string; muted: string; accent: string; secondary: string;
};
export const SITE_THEMES: SiteTheme[] = [
  { id: 'signature', mode: 'dark', bg: '#0c0b20', panel: '#171632', raised: '#242144', ink: '#f7f5ff', muted: '#c0bed7', accent: '#72e8f9', secondary: '#f4cc83' },
  { id: 'daylight', mode: 'light', bg: '#f1f5fa', panel: '#ffffff', raised: '#e4ebf4', ink: '#15243b', muted: '#47566d', accent: '#075a88', secondary: '#814c00' },
  { id: 'midnight', mode: 'dark', bg: '#070f20', panel: '#101e34', raised: '#1c304a', ink: '#edf4ff', muted: '#b1c3db', accent: '#94bcff', secondary: '#c2b5ff' },
  { id: 'sunset', mode: 'dark', bg: '#211017', panel: '#351b27', raised: '#482838', ink: '#fff3ed', muted: '#dbc0c3', accent: '#ffb58d', secondary: '#f4c979' },
  { id: 'forest', mode: 'dark', bg: '#0a1a16', panel: '#122b24', raised: '#203e32', ink: '#effaf2', muted: '#b2cdbf', accent: '#a4e1b4', secondary: '#e3d29c' },
  { id: 'ocean', mode: 'dark', bg: '#071b26', panel: '#102d3c', raised: '#1b4050', ink: '#effbff', muted: '#afcbd6', accent: '#79e3e1', secondary: '#b6cfff' },
  { id: 'royal', mode: 'dark', bg: '#17140e', panel: '#282318', raised: '#3c3321', ink: '#fff8e8', muted: '#d4c5a5', accent: '#f1cf83', secondary: '#e7b6a0' },
  { id: 'lavender', mode: 'dark', bg: '#191326', panel: '#2b203d', raised: '#3c2f50', ink: '#faf1ff', muted: '#cfbedf', accent: '#dcc0ff', secondary: '#f7b8cc' },
  { id: 'graphite', mode: 'dark', bg: '#141619', panel: '#23262b', raised: '#34383e', ink: '#f5f7fa', muted: '#c2c7ce', accent: '#c5d6e7', secondary: '#e2ccb3' },
  { id: 'ivory', mode: 'light', bg: '#f5f0e6', panel: '#fffdf7', raised: '#e9e0d0', ink: '#30271d', muted: '#685745', accent: '#74521b', secondary: '#825442' },
  { id: 'mint', mode: 'light', bg: '#edf6f0', panel: '#fcfffd', raised: '#dcebe1', ink: '#19392c', muted: '#446352', accent: '#126746', secondary: '#66551b' },
  { id: 'rose', mode: 'light', bg: '#fbf0f2', panel: '#fffafb', raised: '#f1dfe5', ink: '#402334', muted: '#725365', accent: '#913956', secondary: '#6e4a87' },
];
const KEY = 'henglish-site-theme-v1';
const resolve = (id: string | null) => SITE_THEMES.find(t => t.id === id) || SITE_THEMES[0];
let current = SITE_THEMES[0];
const listeners = new Set<() => void>();
export function applySiteTheme(id: string, persist = true) {
  current = resolve(id);
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.dataset.siteTheme = current.id;
    root.dataset.themeMode = current.mode;
    root.classList.toggle('dark', current.mode === 'dark');
    root.style.colorScheme = current.mode;
    const vars: Record<string, string> = { 'bg-dark': current.bg, 'panel-dark': current.panel, 'panel-darker': current.raised, ink: current.ink, muted: current.muted, cyan: current.accent, gold: current.secondary, 'theme-accent': current.accent, 'theme-secondary': current.secondary, 'theme-on-accent': current.bg, 'theme-line': current.mode === 'dark' ? '#ffffff26' : '#18253626', 'theme-wash': current.mode === 'dark' ? '#ffffff09' : '#1a294309' };
    Object.entries(vars).forEach(([k,v]) => root.style.setProperty(`--${k}`, v));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', current.bg);
    if (persist) { try { localStorage.setItem(KEY, current.id); } catch { /* Session-only when storage is unavailable. */ } }
  }
  listeners.forEach(fn => fn());
}
if (typeof window !== 'undefined') {
  let stored: string | null = null;
  try { stored = localStorage.getItem(KEY); } catch { /* Use signature palette. */ }
  applySiteTheme(resolve(stored).id, false);
  window.addEventListener('storage', e => { if (e.key === KEY) applySiteTheme(resolve(e.newValue).id, false); });
}
function subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }
export function useSiteTheme() { return useSyncExternalStore(subscribe, () => current, () => SITE_THEMES[0]); }
