'use client';
import theme from '@/styles/global';

import { ChakraProvider } from '@chakra-ui/react';

import type { ReactNode } from 'react';

export function ChakraProviders({ children }: { children: React.ReactNode }): ReactNode {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
