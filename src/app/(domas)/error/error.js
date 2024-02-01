'use client';
import { Box, Image } from '@chakra-ui/react';

export default function NotFound() {
  return (
    <Box textAlign={'-webkit-center'}>
      <Image src="/images/error/404.svg" alt="404 cat" boxSize="90vh" objectFit="cover" />
    </Box>
  );
}
