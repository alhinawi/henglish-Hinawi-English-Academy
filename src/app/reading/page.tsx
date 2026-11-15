import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'أكاديمية القراءة | Henglish Academy',
  description: 'أكاديمية القراءة والفهم السريع بنصوص متدرجة المستوى.',
};

export default function Page() {
  return <ClientOnly initialRoute="reading" />;
}
