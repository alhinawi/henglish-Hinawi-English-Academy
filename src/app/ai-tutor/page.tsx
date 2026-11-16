import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'المعلم الذكي AI | Henglish Academy',
  description: 'أكاديمية المعلم التفاعلي: معلم إنجليزي شخصي يجاوب ويصحح.',
};

export default function Page() {
  return <ClientOnly initialRoute="ai-tutor" />;
}
