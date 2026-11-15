import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'الشهادات | Henglish Academy',
  description: 'شهادات الإنجاز الأكاديمي والتحقق الرسمي من منصة هناوي.',
};

export default function Page() {
  return <ClientOnly initialRoute="certificates" />;
}
