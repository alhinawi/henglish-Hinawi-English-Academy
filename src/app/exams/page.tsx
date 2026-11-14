import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'تحديد المستوى والاختبارات | Henglish Academy',
  description: 'اختبار تحديد المستوى والتقييم الأكاديمي وفق الإطار الأوروبي CEFR.',
};

export default function Page() {
  return <ClientOnly />;
}
