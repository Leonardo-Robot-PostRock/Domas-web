import { Button, HStack, IconButton } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { useAppSelector } from '@/store';
import { TableNode } from '@table-library/react-table-library/types/table';
import { PaginationComponentProps } from '@/types/tables/pagination';

export const PaginationComponent = <T extends TableNode>({ pagination }: PaginationComponentProps<T>) => {
  const data = useAppSelector((state) => state.squadTable.data);

  return (
    <HStack justify="flex-end" mx={5}>
      <IconButton
        aria-label="previous page"
        icon={<FaChevronLeft color="#82AAE3" />}
        variant="ghost"
        isDisabled={pagination.state.page === 0}
        onClick={() => pagination.fns.onSetPage(pagination.state.page - 1)}
      />

      {pagination.state.getPages(data.nodes).map((_: any, index: number) => (
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
  );
};
