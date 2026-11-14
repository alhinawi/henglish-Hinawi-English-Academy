'use client';

import dynamic from 'next/dynamic';

const AppLoader = dynamic(() => import('./AppLoader'), { ssr: false });

export default function ClientOnly() {
  return <AppLoader />;
}
