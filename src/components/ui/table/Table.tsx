import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import { setData, setModifiedNodes } from '@/store/squad/squadTableReducer';

import { HStack } from '@chakra-ui/react';

import { CompactTable } from '@table-library/react-table-library/compact';

import { ButtonComponent } from '@/components/buttons/ButtonComponent';
import { PaginationComponent } from './pagination/PaginationComponent';
import { SearchInputComponent } from './searchInput/SearchInputComponent';
import { CustomDrawer } from './modal/CustomDrawer';

import { useColumnsTableTeams } from '@/hooks/tableTeams/useColumnsTableTeams';
import { useHandleDrawer } from '@/hooks/tableTeams/useHandleDrawer';
import { useTableFeatures } from '@/hooks/tableTeams/useTableFeatures';
import { tableStyle } from '@/styles/tableStyle';

export const Table = () => {
  const dispatch = useAppDispatch();
  const squad = useAppSelector((state) => state.squadTable.nodes);
  const data = useAppSelector((state) => state.squadTable.data);

  /* data object has the structure necessary for the react table to work well */

  useEffect(() => {
    dispatch(setData(squad));
  }, [squad]);

  /* Handle Drawer */

  const { handleCancel, handleEdit, handleSave } = useHandleDrawer();

  /* Others features of the table */

  const { filteredNodes, modalOpened, pagination, setModalOpened, sort } = useTableFeatures();

  /* Custom Modifiers */

  useEffect(() => {
    dispatch(setModifiedNodes(data.nodes));
  });

  /* Columns */

  const columns = useColumnsTableTeams();

  return (
    <>
      {/* Form */}

      <HStack mx={5}>
        <SearchInputComponent />
        <ButtonComponent
          backgroundColor="#82AAE3"
          color="white"
          _hover={{ color: '#82AAE3', backgroundColor: 'gray.100' }}
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
      <CustomDrawer handleCancel={handleCancel} handleEdit={handleEdit} handleSave={handleSave} />
    </>
  );
};
