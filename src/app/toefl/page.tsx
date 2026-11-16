import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'TOEFL | Henglish Academy',
  description: 'كلمات الـ TOEFL الأساسية مرتبة من الأكثر استخداماً بمعناها بالمصري وأمثلة محققة.',
};

export default function Page() {
  return <ClientOnly initialRoute="toefl" />;
}
