import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'مساحتي الخاصة | Henglish Academy',
  description: 'سجل تعلمك وكلماتك المحفوظة وإنجازاتك في مكان واحد.',
};

export default function Page() {
  return <ClientOnly initialRoute="my-learning" />;
}
