import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'أكاديمية النطق IPA | Henglish Academy',
  description: 'أكاديمية النطق والفونيتكس IPA: اتعلم أصوات الإنجليزية صح.',
};

export default function Page() {
  return <ClientOnly initialRoute="pronunciation" />;
}
