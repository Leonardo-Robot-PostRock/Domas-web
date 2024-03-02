import { type ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';

import { ChakraProviders } from '@/components/provider/ChakraProviders';

import './globals.css';
import Loading from './loading';
import { Providers } from '@/lib/Providers';

export const metadata: Metadata = {
  title: 'Bienvenidos a Do+',
  description: 'Página de gestión de clientes, tickets y empleados'
};

export default function RootLayout({ children }: { children: React.ReactNode }): ReactNode {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body>
        <Providers>
          <ChakraProviders>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </ChakraProviders>
        </Providers>
      </body>
    </html>
  );
}
