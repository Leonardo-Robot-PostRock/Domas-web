'use client';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';
import { fetchTeams } from '@/lib/store/teams/thunks';

import { Box, Text } from '@chakra-ui/react';

import { Table } from '@/components/ui/table/Table';
import { ModalProvider } from '@/context/ModalProvider';
import { toast } from 'react-toastify';
import Loading from '@/app/loading';

export default function Teams(): ReactNode {
  const dispatch = useAppDispatch();
  const { teams, loading } = useAppSelector((state) => state.teams);

  useEffect(() => {
    void (async () => {
      await dispatch(fetchTeams());
    })();
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (!(teams.length > 0)) {
        toast.error('Ocurrió un error al intentar mostrar las cuadrillas.');
      }
    }
  }, [teams, loading]);

  if (loading) {
    return <Loading />;
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
