'use client';
import type { ReactNode } from 'react';
import { Box, Image } from '@chakra-ui/react';

export default function NotFound(): ReactNode {
  return (
    <Box textAlign={'center'} justifyContent={'center'} display={'flex'}>
      <Image src="/images/error/404.svg" alt="404 cat" boxSize="90vh" objectFit="cover" />
    </Box>
  );
}
