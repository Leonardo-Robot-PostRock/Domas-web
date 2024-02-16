import { useState } from 'react';
import { useAppSelector } from '@/store';

import { usePagination } from '@table-library/react-table-library/pagination';
import { useSort } from '@table-library/react-table-library/sort';
import { useCustom } from '@table-library/react-table-library/table';
import { Action, State } from '@table-library/react-table-library/types/common';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export const useTableFeatures = () => {
  const data = useAppSelector((state) => state.squadTable.data);
  const modifiedNodes = useAppSelector((state) => state.squadTable.modifiedNodes);
  const search = useAppSelector((state) => state.squadTable.search);

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

  /* Modal */

  const [modalOpened, setModalOpened] = useState(false);

  /* Search */

  const filteredNodes = modifiedNodes.filter((node) => node.name.toLowerCase().includes(search.toLowerCase()));

  return {
    pagination,
    sort,
    filteredNodes,
    modalOpened,
    setModalOpened,
  };
};
