import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'عن المنصة | Henglish Academy',
  description: 'عن منصة هناوي إنجلش الأكاديمية ورؤيتها لتعليم الإنجليزية.',
};

export default function Page() {
  return <ClientOnly initialRoute="about" />;
}
