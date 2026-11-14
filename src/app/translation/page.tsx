import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'استوديو الترجمة | Henglish Academy',
  description: 'استوديو الترجمة والتحليل اللغوي الذكي.',
};

export default function Page() {
  return <ClientOnly />;
}
