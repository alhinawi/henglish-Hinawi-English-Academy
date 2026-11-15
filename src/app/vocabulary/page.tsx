import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'أكاديمية الكلمات | Henglish Academy',
  description: 'أكاديمية المفردات وقاعدة الكلمات الشاملة: 55,000 كلمة بالنطق الأمريكي والبريطاني والترجمة.',
};

export default function Page() {
  return <ClientOnly initialRoute="vocabulary" />;
}
