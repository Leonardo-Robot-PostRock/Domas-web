import LoginForm from '@/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.API_URL as string),
  title: 'Bienvenidos a Do+',
  description: 'Página de incio de sesión',
  icons: {
    icon: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/favicon.ico' : '/faviconLocal.ico',
  },
  openGraph: {
    title: 'Do+',
    images: {
      url: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/logo.svg' : '/logoLocal.svg',
      width: 800,
      height: 600,
    },
  },
};

export default function SignInPage() {
  return (
    <>
      <LoginForm />
    </>
  );
}
