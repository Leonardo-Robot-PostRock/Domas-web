import LoginForm from '@/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bienvenidos a Do+',
  description: 'Página de incio de sesión',
  icons: {
    icon: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/favicon.ico' : '/faviconLocal.ico',
  },
  openGraph: {
    title: 'Do+',
    images: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/logo.svg' : '/logoLocal.svg',
  },
};

export default function SignInPage() {
  return (
    <>
      <LoginForm />
    </>
  );
}
