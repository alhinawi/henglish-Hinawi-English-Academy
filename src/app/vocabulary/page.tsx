import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'أكاديمية الكلمات | Henglish Academy',
  description: 'أكاديمية المفردات وقاعدة الكلمات الشاملة: أكثر من 21,000 كلمة محققة بالترجمة والرموز الصوتية IPA.',
};

export default function Page() {
  return <ClientOnly initialRoute="vocabulary" />;
}
