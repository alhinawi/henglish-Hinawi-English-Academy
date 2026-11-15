import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | Henglish Academy',
  description: 'سجّل دخولك لحفظ تقدمك ونقاطك في منصة هناوي.',
};

export default function Page() {
  return <ClientOnly initialRoute="login" />;
}
