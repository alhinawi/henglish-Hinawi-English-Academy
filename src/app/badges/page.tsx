import type { Metadata } from 'next';
import ClientOnly from '../ClientOnly';
export const metadata: Metadata = { title: 'Medals | Henglish Academy' };
export default function Page() { return <ClientOnly initialRoute="badges" />; }
