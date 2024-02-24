import { headers } from 'next/headers';

import Navbar from '@/components/ui/nav/LayoutSidebar';
import { getTitlePathname, handleRedirectAndTitle } from '@/utils/metadaUtils';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata(): Metadata {
  const headersList = headers();
  const pathname = headersList.get('next-url') ?? null;
  const titlePathname = getTitlePathname(pathname);

  const title =
    process.env.APP_ENV?.toUpperCase() === 'PROD'
      ? process.env.APP_NAME + '|' + titlePathname || 'HOME'
      : process.env.APP_ENV?.toUpperCase() === 'DEV'
        ? 'LOCAL DUMAS'
        : 'TEST DUMAS';

  return {
    metadataBase: new URL(process.env.API_URL ?? ''),
    title,
    icons: {
      icon: process.env.APP_ENV?.toUpperCase() === 'PROD' ? '/favicon.ico' : '/faviconLocal.ico'
    },
    description: process.env.APP_NAME,
    openGraph: {
      title: 'Do+',
      images: process.env.APP_ENV?.toUpperCase() === 'PROD' ? '/logo.svg' : '/logoLocal.svg'
    }
  };
}

export default function Layout({ children }: Props): ReactNode {
  const headersList = headers();
  const pathname = headersList.get('next-url') ?? null;
  const titlePathname = handleRedirectAndTitle(pathname);

  return (
    <>
      <nav>{!titlePathname.includes('/') && <Navbar>{children}</Navbar>}</nav>
    </>
  );
}
