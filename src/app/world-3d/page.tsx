import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'العالم الافتراضي 3D | Henglish Academy',
  description: 'عالم ثلاثي الأبعاد تفاعلي لتعلم الإنجليزية بالتجربة.',
};

export default function Page() {
  return <ClientOnly initialRoute="world-3d" />;
}
