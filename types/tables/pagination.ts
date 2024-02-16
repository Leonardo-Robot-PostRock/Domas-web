import { Pagination } from '@table-library/react-table-library/types/pagination';
import { TableNode } from '@table-library/react-table-library/types/table';

export interface PaginationComponentProps<T extends TableNode> {
  pagination: Pagination<T>;
}
