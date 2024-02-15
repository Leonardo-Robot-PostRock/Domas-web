import React, { useEffect, useState } from 'react';

import { Box, Button, HStack, IconButton, Input, InputGroup, InputLeftElement, Modal } from '@chakra-ui/react';

import { FaSearch, FaChevronRight, FaChevronDown, FaChevronUp, FaChevronLeft } from 'react-icons/fa';

import { Action, State } from '@table-library/react-table-library/common';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useCustom } from '@table-library/react-table-library/table';
import { usePagination } from '@table-library/react-table-library/pagination';
import { useSort } from '@table-library/react-table-library/sort';

import { tableStyle } from '@/styles/tableStyle';
import { useHandleDrawer } from '@/hooks/tableTeams/useHandleDrawer';
import { useAppDispatch, useAppSelector } from '@/store';
import { setData, setModifiedNodes } from '@/store/squad/squadTableReducer';
import { useColumnsTableTeams } from '@/hooks/tableTeams/useColumnsTableTeams';
import { CustomDrawer } from './modal/CustomDrawer';

export const Table = () => {
  const squad = useAppSelector((state) => state.squadTable.nodes);
  const data = useAppSelector((state) => state.squadTable.data);
  let modifiedNodes = useAppSelector((state) => state.squadTable.modifiedNodes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setData(squad));
  }, [squad]);

  /* Resize */

  const resize = { resizerHighlight: '#dee2e6' };

  /* Pagination */

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 4,
    },
    onChange: onPaginationChange,
  });

  function onPaginationChange(action: Action, state: State) {
    console.log(action, state);
  }

  /* Search */

  const [search, setSearch] = useState('');

  useCustom('search', data, {
    state: { search },
    onChange: onSearchChange,
  });

  function onSearchChange(action: Action, state: State) {
    pagination.fns.onSetPage(0);
  }

  /* Sort */

  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortIcon: {
        iconDefault: null,
        iconUp: <FaChevronUp />,
        iconDown: <FaChevronDown />,
      },
      sortFns: {
        NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
      },
    }
  );

  function onSortChange(action: Action, state: State) {
    console.log(action, state);
  }

  /* Drawer */

  const { handleCancel, handleEdit, handleSave } = useHandleDrawer();

  /* Modal */

  const [modalOpened, setModalOpened] = useState(false);

  /* Custom Modifiers */

  useEffect(() => {
    dispatch(setModifiedNodes(data.nodes));
  });

  /* Search */

  const filteredNodes = modifiedNodes.filter((node) => node.name.toLowerCase().includes(search.toLowerCase()));

  /* Columns */

  const columns = useColumnsTableTeams();

  return (
    <>
      {/* Form */}

      <HStack mx={5}>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<FaSearch style={{ color: '#4a5568' }} />} />
          <Input placeholder="Buscar cuadrilla" value={search} onChange={(event) => setSearch(event.target.value)} />
        </InputGroup>
      </HStack>

      {/* Table */}
      <CompactTable
        columns={columns}
        data={{ ...data, nodes: filteredNodes }}
        theme={tableStyle}
        sort={sort}
        pagination={pagination}
      />

      <HStack justify="flex-end" mx={5}>
        <IconButton
          aria-label="previous page"
          icon={<FaChevronLeft color="#82AAE3" />}
          variant="ghost"
          isDisabled={pagination.state.page === 0}
          onClick={() => pagination.fns.onSetPage(pagination.state.page - 1)}
        />

        {pagination.state.getPages(data.nodes).map((row: any, index: number) => (
          <Button
            key={index}
            variant={pagination.state.page === index ? 'solid' : 'ghost'}
            onClick={() => pagination.fns.onSetPage(index)}
            style={{
              backgroundColor: pagination.state.page === index ? '#82AAE3' : 'transparent',
              color: pagination.state.page === index ? 'white' : 'gray',
            }}
          >
            {index + 1}
          </Button>
        ))}
        <IconButton
          aria-label="next page"
          icon={<FaChevronRight color="#82AAE3" />}
          variant="ghost"
          isDisabled={pagination.state.page + 1 === pagination.state.getTotalPages(data.nodes)}
          onClick={() => pagination.fns.onSetPage(pagination.state.page + 1)}
        />
      </HStack>
      <CustomDrawer handleCancel={handleCancel} handleEdit={handleEdit} handleSave={handleSave} />
    </>
  );
};
