import { TableNode } from '@table-library/react-table-library/types/table';

export interface TeamsTableState {
  data: { nodes: TableNode[] };
  modifiedNodes: TableNode[];
  search: string;
}
