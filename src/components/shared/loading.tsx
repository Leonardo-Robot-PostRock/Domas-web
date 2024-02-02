import { Flex, Spinner } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Flex minH={'80vh'} minW={'100vh'} justifyContent={'center'} alignItems={'center'}>
      <Spinner size="xl" color="brand.900" />
    </Flex>
  );
}
