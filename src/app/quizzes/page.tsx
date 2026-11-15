import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'بنك الاختبارات | Henglish Academy',
  description: 'بنك الاختبارات ومولّد الكويزات الذكي لكل المستويات.',
};

export default function Page() {
  return <ClientOnly initialRoute="quizzes" />;
}
