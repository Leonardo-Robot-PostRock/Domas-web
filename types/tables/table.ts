import { Identifier, TableNode } from '@table-library/react-table-library/types/table';
import { Nullish } from '@table-library/react-table-library/types/common';

export interface Nodes {
  nodes: TableNode[];
}

export interface Props {
  teams: Nodes;
}

export interface EditedNode {
  name: string;
  id?: Identifier | undefined;
  nodes?: TableNode[] | Nullish;
}
