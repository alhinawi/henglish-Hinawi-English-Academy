import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'Gen Z | تعبيرات الجيل الجديد | Henglish Academy',
  description: 'تعبيرات Gen Z وثقافة الإنترنت مترجمة وموضحة بالمصري.',
};

export default function Page() {
  return <ClientOnly initialRoute="genz" />;
}
