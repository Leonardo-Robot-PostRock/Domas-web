'use client';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';
import { fetchTeams } from '@/lib/store/teams/thunks';

import { Box, Text } from '@chakra-ui/react';

import { toastError } from '@/components/toast/toastError';
import { Table } from '@/components/ui/table/Table';
import { ModalProvider } from '@/context/ModalProvider';

export default function Teams(): ReactNode {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teams.teams);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  if (!teams.length) {
    toastError('Ocurrió un error al intentar mostrar las cuadrillas.');
    return null;
  }

  return (
    <Box as="main">
      <Text fontSize="5xl" m="20px">
        Cuadrillas
      </Text>
      <ModalProvider>
        <Box display={{ base: 'none', lg: 'block' }}>
          <Table />
        </Box>
      </ModalProvider>
    </Box>
  );
}
