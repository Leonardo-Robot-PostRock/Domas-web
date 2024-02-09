'use client';
import { useCallback, useEffect, useState } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { CompactTable } from '@table-library/react-table-library/compact';

import { Message } from 'react-hook-form';
import axios from 'axios';

import { COLUMNS } from '@/components/table/columns/columns';
import { toastError } from '@/components/toast/toastError';
import { Team } from '@/types/api/teamById';
import { tableStyle } from '@/styles/tableStyle';

interface Props {
  message: Message;
  position?: string;
}

export default function Teams() {
  const [userInfo, setUserInfo] = useState();
  const [editInfo, setEditInfo] = useState();
  const [teams, setTeams] = useState({ nodes: [] });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') as string);

    console.log('USER', user);
    setUserInfo(user);
  }, []);

  const teamsAll = '/api/teams/all';

  const fetchData = useCallback(async () => {
    const result: Team = await axios.get(teamsAll);

    setTeams({ nodes: result.data });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!teams) {
    const errorProps: Props = {
      message: 'Ocurrió un error al intentar mostrar las cuadrillas.',
    };
    toastError(errorProps);
  }

  const theme = useTheme(getTheme());

  return (
    <Box as="main">
      <Text fontSize="5xl" m="20px">
        Cuadrillas
      </Text>
      <Box display={{ base: 'none', lg: 'block' }}>
        <CompactTable columns={COLUMNS} data={teams} theme={tableStyle} />
      </Box>
    </Box>
  );
}
