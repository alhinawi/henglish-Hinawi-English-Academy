import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'إعادة تعيين كلمة المرور | Henglish Academy',
  description: 'عيّن كلمة مرور جديدة لحسابك.',
};

export default function Page() {
  return <ClientOnly />;
}
