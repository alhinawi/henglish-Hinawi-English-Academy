import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'أكاديمية الاستماع | Henglish Academy',
  description: 'أكاديمية الاستماع وفهم لكنات الإنجليزية بتدريبات متدرجة.',
};

export default function Page() {
  return <ClientOnly initialRoute="listening" />;
}
