import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'المذكرات وأوراق العمل | Henglish Academy',
  description: 'المذكرات وأوراق العمل القابلة للتحميل مجاناً.',
};

export default function Page() {
  return <ClientOnly initialRoute="resources" />;
}
