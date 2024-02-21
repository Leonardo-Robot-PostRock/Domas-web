'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';
import { fetchTeams } from '@/lib/store/teams/fetchTeamsThunks';

import { Box, Text } from '@chakra-ui/react';

import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';

import { toastError } from '@/components/toast/toastError';
import { Table } from '@/components/ui/table/Table';
import { ModalProvider } from '@/context/ModalProvider';

export default function Teams() {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teams.teams);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  if (!teams.length) {
    toastError('Ocurrió un error al intentar mostrar las cuadrillas.');
    return null;
  }

  const theme = useTheme(getTheme());

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
