'use client';
import { useCallback, useEffect, useState } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';

import axios from 'axios';

import { toastError } from '@/components/toast/toastError';
import { Table } from '@/components/ui/table/Table';
import { Team } from '@/types/api/teamById';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSquadNodes } from '@/store/squad/squadReducer';

export default function Teams() {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.squad.nodes);

  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') as string);

    setUserInfo(user);
  }, []);

  const teamsAll = '/api/teams/all';

  const fetchData = useCallback(async () => {
    try {
      const result: Team = await axios.get(teamsAll);

      dispatch(setSquadNodes(result.data));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!nodes.length) {
    const errorProps = 'Ocurrió un error al intentar mostrar las cuadrillas.';
    toastError(errorProps);
    return null;
  }

  const theme = useTheme(getTheme());

  return (
    <Box as="main">
      <Text fontSize="5xl" m="20px">
        Cuadrillas
      </Text>
      <Box display={{ base: 'none', lg: 'block' }}>
        <Table />
      </Box>
    </Box>
  );
}
