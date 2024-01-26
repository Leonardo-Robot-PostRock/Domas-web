'use client';

import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import Navbar from './navbar';

export type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props) {
  const router: AppRouterInstance = useRouter();

  console.log('ver', params);

  const pathname: string | null = usePathname();

  const cookiesAuth = Cookies.get();

  if (cookiesAuth && !cookiesAuth.auth_service && pathname !== '/login') {
    router.push('/login');
  }

  const pathnameSplit: string[] | undefined = pathname?.split('/');
  const titlePathname: string | undefined = pathnameSplit ? pathnameSplit[pathnameSplit.length - 1] : '';

  return {
    title:
      process.env.APP_ENV?.toUpperCase() === 'PROD'
        ? process.env.APP_NAME + '|' + titlePathname || 'HOME'
        : process.env.APP_ENV?.toUpperCase() === 'DEV'
          ? 'LOCAL DUMAS'
          : 'TEST DUMAS',
    icons: {
      icon: process.env.APP_ENV?.toUpperCase() === 'PROD' ? '/favicon.ico' : '/faviconLocal.ico',
    },
    description: process.env.APP_NAME,
    openGraph: {
      title: 'Do+',
      images: process.env.APP_ENV?.toUpperCase() === 'PROD' ? '/logo.svg' : '/logoLocal.svg',
    },
  };
}

interface LayoutComponent {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutComponent) {
  const pathname: string | null = usePathname();

  return (
    <>
      <nav>{pathname !== 'LOGIN' && <Navbar />}</nav>
      <main>{children}</main>
    </>
  );
}
