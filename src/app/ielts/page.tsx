import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'IELTS | Henglish Academy',
  description: 'أهم كلمات الـ IELTS مرتبة من الأكثر استخداماً بمعناها بالمصري وأمثلة محققة.',
};

export default function Page() {
  return <ClientOnly initialRoute="ielts" />;
}
