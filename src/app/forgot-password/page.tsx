import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'استعادة كلمة المرور | Henglish Academy',
  description: 'استعد كلمة مرور حسابك في منصة هناوي.',
};

export default function Page() {
  return <ClientOnly initialRoute="forgot-password" />;
}
