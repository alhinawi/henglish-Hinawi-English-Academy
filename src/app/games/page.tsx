import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'ساحة الألعاب | Henglish Academy',
  description: 'ساحة الألعاب والمبارزات اللغوية: اتعلم وانت بتلعب.',
};

export default function Page() {
  return <ClientOnly initialRoute="games" />;
}
