import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'Idioms | بنك الـ Idioms | Henglish Academy',
  description: 'أشهر الـ Idioms الإنجليزية بمعناها بالمصري مع أمثلة محققة.',
};

export default function Page() {
  return <ClientOnly initialRoute="idioms" />;
}
