import { TableNode } from '@table-library/react-table-library/types/table';

export interface squadTableState {
  nodes: TableNode[];
  drawerId: string | number | null;
  edited: string;
  data: { nodes: TableNode[] };
  modifiedNodes: TableNode[];
  search: string;
}
