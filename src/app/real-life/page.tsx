import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';

export const metadata: Metadata = {
  title: 'إنجليزي المواقف الحقيقية | Henglish Academy',
  description: 'محاكاة مواقف الحياة اليومية بالإنجليزية: مطار، مطعم، شغل، وسفر.',
};

export default function Page() {
  return <ClientOnly initialRoute="real-life" />;
}
