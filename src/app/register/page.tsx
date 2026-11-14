import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'إنشاء حساب | Henglish Academy',
  description: 'أنشئ حسابك المجاني واحفظ تقدمك في تعلم الإنجليزية.',
};

export default function Page() {
  return <ClientOnly />;
}
