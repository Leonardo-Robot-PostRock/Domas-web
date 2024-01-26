'use client';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const LoadingSpinner = () => {
  return (
    <Flex minH={'80vh'} minW={'100vh'} justifyContent={'center'} alignItems={'center'}>
      <Spinner size="xl" color="brand.900" />
    </Flex>
  );
};

export default function LoadingRender({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  return loading ? <LoadingSpinner /> : children;
}
