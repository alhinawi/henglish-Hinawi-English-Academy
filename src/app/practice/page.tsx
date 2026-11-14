import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'مركز التدريبات | Henglish Academy',
  description: 'مركز التدريبات والتمارين التفاعلية لتثبيت الإنجليزية.',
};

export default function Page() {
  return <ClientOnly />;
}
