import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { TableNode } from '@table-library/react-table-library/types/table';
import { TeamsTableState } from '@/types/store/teamsTableState';

const initialState: TeamsTableState = {
  teams: [],
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
    setTeams(state, action: PayloadAction<TableNode[]>) {
      state.teams = action.payload;
    },

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

export const { setTeams, setData, setModifiedNodes, setSearch } = teamsTableSlice.actions;

export default teamsTableSlice.reducer;
