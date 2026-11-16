import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'Slang | بنك الـ Slang | Henglish Academy',
  description: 'الـ Slang الأمريكي والبريطاني اليومي بمعناه بالمصري وسياق استخدامه.',
};

export default function Page() {
  return <ClientOnly initialRoute="slang" />;
}
