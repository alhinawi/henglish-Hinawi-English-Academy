import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'أكاديمية الجرامر | Henglish Academy',
  description: 'أكاديمية قواعد اللغة الإنجليزية بالكامل من A1 إلى C2 بشرح مصري مبسط وتدريبات تفاعلية.',
};

export default function Page() {
  return <ClientOnly initialRoute="grammar" />;
}
