import { headers } from 'next/headers';

import Navbar from '@/components/navbar';
import { getTitlePathname, handleRedirectAndTitle } from '@/utils/metadaUtils';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata() {
  const headersList = headers();
  const pathname = headersList.get('next-url') || null;
  const titlePathname = getTitlePathname(pathname);

  const title =
    process.env.APP_ENV!.toUpperCase() === 'PROD'
      ? process.env.APP_NAME + '|' + titlePathname || 'HOME'
      : process.env.APP_ENV!.toUpperCase() === 'DEV'
        ? 'LOCAL DUMAS'
        : 'TEST DUMAS';

  return {
    metadataBase: new URL(process.env.API_URL as string),
    title,
    icons: {
      icon: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/favicon.ico' : '/faviconLocal.ico',
    },
    description: process.env.APP_NAME,
    openGraph: {
      title: 'Do+',
      images: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/logo.svg' : '/logoLocal.svg',
    },
  };
}

export default function DomasLayout({ children }: Props) {
  const headersList = headers();
  const pathname = headersList.get('next-url') || null;
  const titlePathname = handleRedirectAndTitle(pathname);

  return (
    <>
      <nav>{!titlePathname.includes('LOGIN') && <Navbar />}</nav>
      <main>{children}</main>
    </>
  );
}
