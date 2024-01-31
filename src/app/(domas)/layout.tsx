'use client';

import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
// import { Metadata } from 'next';
import Cookies from 'js-cookie';

interface Props {
  children: React.ReactNode;
}

// import { Metadata } from 'next';

// type Props = {
//   params: { id: string };
//   searchParams?: { [key: string]: string | string[] | undefined };
// };

// export function generateMetadata({ params, searchParams }: Props): Metadata {
//   return {
//     metadataBase: new URL(process.env.API_URL as string),
//     title:
//       process.env.APP_ENV!.toUpperCase() === 'PROD'
//         ? process.env.APP_NAME + '|' + searchParams || 'HOME'
//         : process.env.APP_ENV!.toUpperCase() === 'DEV'
//           ? 'LOCAL DUMAS'
//           : 'TEST DUMAS',
//     icons: {
//       icon: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/favicon.ico' : '/faviconLocal.ico',
//     },
//     description: process.env.APP_NAME,
//     openGraph: {
//       title: 'Do+',
//       images: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/logo.svg' : '/logoLocal.svg',
//     },
//   };
// }

export default function DomasLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const cookiesAuth = Cookies.get();
  if (cookiesAuth && !cookiesAuth.auth_service && pathname != '/login') {
    router.push('/login');
  }

  const pathnameSplit = pathname.split('/');
  const titlePathname = pathnameSplit[pathnameSplit.length - 1].toUpperCase();

  return (
    <>
      <nav>{titlePathname !== 'LOGIN' && <Navbar />}</nav>
      <main>{children}</main>
    </>
  );
}
