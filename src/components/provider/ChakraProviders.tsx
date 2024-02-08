'use client';
import theme from '@/styles/global';

import { ChakraProvider } from '@chakra-ui/react';

export function ChakraProviders({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
