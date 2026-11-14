import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'اتعلم من الأفلام | Henglish Academy',
  description: 'استوديو الفيديو والأفلام: 50 مقطع مترجم بتحليل للكلمات وتمارين تفاعلية.',
};

export default function Page() {
  return <ClientOnly />;
}
