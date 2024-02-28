import { useAppSelector } from '@/lib';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { type Pagination, usePagination } from '@table-library/react-table-library/pagination';
import { type Sort, useSort } from '@table-library/react-table-library/sort';
import { type TableNode, useCustom } from '@table-library/react-table-library/table';
import { type Action, type State } from '@table-library/react-table-library/types/common';

interface UseTableFeaturesReturnType {
  pagination: Pagination<TableNode>;
  sort: Sort<TableNode>;
  filteredNodes: TableNode[];
}

export const useTableFeatures = (): UseTableFeaturesReturnType => {
  const data = useAppSelector((state) => state.teamsTable.data);
  const modifiedNodes = useAppSelector((state) => state.teamsTable.modifiedNodes);
  const search = useAppSelector((state) => state.teamsTable.search);

  /* Pagination */

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 4
    },
    onChange: onPaginationChange
  });

  function onPaginationChange(action: Action, state: State): void {}

  /* Search */

  useCustom('search', data, {
    state: { search },
    onChange: onSearchChange
  });

  function onSearchChange(action: Action, state: State): void {
    pagination.fns.onSetPage(0);
  }

  /* Sort */

  const sort = useSort(
    data,
    {
      onChange: onSortChange
    },
    {
      sortIcon: {
        iconDefault: null,
        iconUp: <FaChevronUp />,
        iconDown: <FaChevronDown />
      },
      sortFns: {
        NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name))
      }
    }
  );

  function onSortChange(action: Action, state: State): void {}

  /* Search */

  const filteredNodes = modifiedNodes.filter((node) => node.name.toLowerCase().includes(search.toLowerCase()));

  return {
    pagination,
    sort,
    filteredNodes
  };
};
