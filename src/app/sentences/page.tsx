import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'مكتبة الجمل | Henglish Academy',
  description: 'موسوعة التحدث الإنجليزي الذكية: 5,000 جملة أساسية بترجمة ونطق.',
};

export default function Page() {
  return <ClientOnly />;
}
