import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'دليل الكورسات | Henglish Academy',
  description: 'دليل الكورسات والأكاديمية الشاملة من المستوى A1 حتى C2.',
};

export default function Page() {
  return <ClientOnly />;
}
