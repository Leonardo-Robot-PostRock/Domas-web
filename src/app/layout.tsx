import { Suspense } from 'react';
import type { Metadata } from 'next';

import { ChakraProviders } from '@/components/provider/ChakraProviders';
import { NavigationEvents } from '@/shared/navigation-events';
import Loading from '@/shared/loading';
import { Providers } from '@/lib/store/Providers';

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
          <ChakraProviders>
            {children}
            <Suspense fallback={<Loading />}>
              <NavigationEvents />
            </Suspense>
          </ChakraProviders>
        </Providers>
      </body>
    </html>
  );
}
