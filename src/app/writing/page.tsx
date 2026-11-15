import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'أكاديمية الكتابة | Henglish Academy',
  description: 'أكاديمية الكتابة والمراسلات الرسمية بالإنجليزية.',
};

export default function Page() {
  return <ClientOnly initialRoute="writing" />;
}
