import { Flex, Spinner } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export default function Loading(): ReactNode {
  return (
    <Flex w="100vw" h="100vh" justifyContent={'center'} alignItems={'center'}>
      <Spinner size="xl" color="brand.900" />
    </Flex>
  );
}
