import { Suspense } from 'react';
import type { Metadata } from 'next';

import { Providers } from '@/components/provider/providers';
import { NavigationEvents } from '@/shared/navigation-events';
import Loading from '@/shared/loading';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bienvenidos a Do+',
  description: 'Página de gestión de clientes, tickets y empleados',
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
