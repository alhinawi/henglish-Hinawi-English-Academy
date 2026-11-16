import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'أهم المصادر | Resources | Henglish Academy',
  description: 'أهم القنوات والكتب والتطبيقات والمواقع لتعلم وممارسة الإنجليزي، مختارة ومتحقق منها.',
};

export default function Page() {
  return <ClientOnly initialRoute="sources" />;
}
