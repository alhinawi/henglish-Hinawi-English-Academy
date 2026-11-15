'use client';

import dynamic from 'next/dynamic';
import type { PageRoute } from '../types';

const AppLoader = dynamic(() => import('./AppLoader'), { ssr: false });

export default function ClientOnly({ initialRoute }: { initialRoute?: PageRoute }) {
  return <AppLoader initialRoute={initialRoute} />;
}
