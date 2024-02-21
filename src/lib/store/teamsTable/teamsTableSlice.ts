import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { TableNode } from '@table-library/react-table-library/types/table';
import { TeamsTableState } from '@/types/store/teamsTableState';

const initialState: TeamsTableState = {
  data: {
    nodes: [],
  },
  modifiedNodes: [],
  search: '',
};

const teamsTableSlice = createSlice({
  name: 'teamsTable',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<TableNode[]>) {
      state.data.nodes = action.payload;
    },

    setModifiedNodes(state, action: PayloadAction<TableNode[]>) {
      state.modifiedNodes = action.payload;
    },

    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
  },
});

export const { setData, setModifiedNodes, setSearch } = teamsTableSlice.actions;

export default teamsTableSlice.reducer;
