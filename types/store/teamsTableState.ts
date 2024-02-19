import { TableNode } from '@table-library/react-table-library/types/table';

export interface TeamsTableState {
  teams: TableNode[];
  data: { nodes: TableNode[] };
  modifiedNodes: TableNode[];
  search: string;
}
