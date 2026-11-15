import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'لوحة التحكم | Henglish Academy',
  description: 'تابع تقدمك اليومي، نقاط XP، وأهدافك التعليمية في منصة هناوي.',
};

export default function Page() {
  return <ClientOnly initialRoute="dashboard" />;
}
