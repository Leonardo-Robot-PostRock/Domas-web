import type { Metadata } from 'next';
import { Providers } from './providers';
import { Suspense } from 'react';
import { NavigationEvents } from '@/components/navigation-events';
import Loading from '@/components/loading';

export const metadata: Metadata = {
  title: 'Bienvenidos a Do+',
  description: 'Página de gestión de clientes, tickets y empleados',
  icons: {
    icon: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/favicon.ico' : '/faviconLocal.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
          <Suspense fallback={<Loading />}>
            <NavigationEvents />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
