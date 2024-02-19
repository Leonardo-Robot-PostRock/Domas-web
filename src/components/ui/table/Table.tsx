import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';
import { setData, setModifiedNodes } from '@/lib/store/teamsTable/teamsTableSlice';
import { setTeamData } from '@/lib/store/teams/teamsSlice';

import { HStack } from '@chakra-ui/react';

import { CompactTable } from '@table-library/react-table-library/compact';

import { useColumnsTableTeams } from '@/hooks/tableTeams/useColumnsTableTeams';
import { useModalContext } from '@/hooks/tableTeams/useModalContext';
import { useTableFeatures } from '@/hooks/tableTeams/useTableFeatures';

import { ButtonComponent } from '@/components/buttons/ButtonComponent';
import { DeleteTeamModal } from './modal/DeleteTeamModal';
import { PaginationComponent } from './pagination/PaginationComponent';
import { SearchInputComponent } from './searchInput/SearchInputComponent';
import { TeamFormModal } from './modal/TeamFormModal';
import { tableStyle } from '@/styles/tableStyle';

export const Table = () => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teamsTable.teams);
  const data = useAppSelector((state) => state.teamsTable.data);

  /* data object has the structure necessary for react table */

  useEffect(() => {
    dispatch(setData(teams));
  }, [teams]);

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
        <ButtonComponent
          backgroundColor="#82AAE3"
          color="white"
          _hover={{ color: '#82AAE3', backgroundColor: 'gray.100' }}
          onClick={() => {
            onOpen();
            dispatch(setTeamData(null));
          }}
        >
          Nueva cuadrilla
        </ButtonComponent>
      </HStack>

      {/* Table */}

      <CompactTable
        columns={columns}
        data={{ ...data, nodes: filteredNodes }}
        theme={tableStyle}
        sort={sort}
        pagination={pagination}
      />

      <PaginationComponent pagination={pagination} />
      <TeamFormModal />
      <DeleteTeamModal />
    </>
  );
};
