import Navbar from '../../../components/navbar';
import { Metadata } from 'next';

interface LayoutComponent {
  children: React.ReactNode;
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

type Props = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function generateMetadata({ searchParams }: Props): Metadata {
  return {
    metadataBase: new URL(process.env.API_URL as string),
    title:
      process.env.APP_ENV!.toUpperCase() === 'PROD'
        ? process.env.APP_NAME + '|' + searchParams || 'HOME'
        : process.env.APP_ENV!.toUpperCase() === 'DEV'
          ? 'LOCAL DUMAS'
          : 'TEST DUMAS',
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

export default function Layout({ children, params }: LayoutComponent) {
  // const pathname: string | null = usePathname();
  const { id } = params;

  return (
    <>
      <nav>{id?.toLocaleUpperCase() !== 'LOGIN' && <Navbar />}</nav>
      <main>{children}</main>
    </>
  );
}
