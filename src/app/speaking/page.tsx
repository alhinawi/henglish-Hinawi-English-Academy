import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'أكاديمية المحادثة | Henglish Academy',
  description: 'أكاديمية المحادثة والطلاقة الشفوية: حوارات يومية وتدريب نطق تفاعلي.',
};

export default function Page() {
  return <ClientOnly />;
}
