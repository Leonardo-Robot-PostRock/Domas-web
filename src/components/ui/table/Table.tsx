import { type ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';
import { setData, setModifiedNodes } from '@/lib/store/teamsTable/teamsTableSlice';
import { setTeamEdit } from '@/lib/store/teams/teamsSlice';

import { Box, HStack } from '@chakra-ui/react';
import { CompactTable } from '@table-library/react-table-library/compact';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useColumnsTableTeams } from '@/hooks/tableTeams/useColumnsTableTeams';
import { useModalContext } from '@/hooks/tableTeams/useModalContext';
import { useTableFeatures } from '@/hooks/tableTeams/useTableFeatures';

import { DeleteTeamModal } from '../modals/DeleteTeamModal';
import { DynamicFormModal } from '../modals/DynamicFormModal';
import { PaginationComponent } from './pagination/PaginationComponent';
import { SearchInputComponent } from './searchInput/SearchInputComponent';
import { tableStyle } from '@/styles/tableStyle';
import { ChakraButton } from '@/components/buttons/ChakraButton';

export const Table = (): ReactNode => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teams.teams);
  const data = useAppSelector((state) => state.teamsTable.data);

  /* data object has the structure necessary for react table */

  useEffect(() => {
    dispatch(setData(teams));
  }, [dispatch, teams]);

  /* Others features of the table */

  const { filteredNodes, pagination, sort } = useTableFeatures();

  /* Custom Modifiers */

  useEffect(() => {
    dispatch(setModifiedNodes(data.nodes));
  });

  /* Columns */

  const columns = useColumnsTableTeams();

  const { onOpen } = useModalContext();

  return (
    <>
      <HStack mx={5}>
        <SearchInputComponent />
        <ChakraButton
          backgroundColor="#82AAE3"
          color="white"
          _hover={{ color: '#82AAE3', backgroundColor: 'gray.100' }}
          onClick={() => {
            onOpen();
            dispatch(setTeamEdit(null));
          }}
        >
          Nueva cuadrilla
        </ChakraButton>
      </HStack>

      {/* Table */}
      <Box height={{ md: '600px', lg: '400px' }}>
        <CompactTable
          columns={columns}
          data={{ ...data, nodes: filteredNodes }}
          theme={tableStyle}
          sort={sort}
          pagination={pagination}
        />
      </Box>

      <DeleteTeamModal />
      <DynamicFormModal />
      <PaginationComponent pagination={pagination} />
      <ToastContainer />
    </>
  );
};
