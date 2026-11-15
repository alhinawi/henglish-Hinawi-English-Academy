import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'لوحة المعلم | Henglish Academy',
  description: 'لوحة تحكم المعلم لمتابعة الطلاب والواجبات.',
};

export default function Page() {
  return <ClientOnly initialRoute="teacher-dashboard" />;
}
