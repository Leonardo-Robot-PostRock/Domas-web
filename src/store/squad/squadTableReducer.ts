import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TableNode } from '@table-library/react-table-library/types/table';

interface squadTableState {
  nodes: TableNode[];
  drawerId: string | number | null;
  edited: string;
  data: { nodes: TableNode[] };
  modifiedNodes: TableNode[];
}

const initialState: squadTableState = {
  nodes: [],
  drawerId: null,
  edited: '',
  data: {
    nodes: [],
  },
  modifiedNodes: [],
};

const squadTableSlice = createSlice({
  name: 'squadTable',
  initialState,
  reducers: {
    setSquadNodes(state, action: PayloadAction<TableNode[]>) {
      state.nodes = action.payload;
    },

    setSquadDrawerId(state, action: PayloadAction<string | number | null>) {
      state.drawerId = action.payload;
    },

    setSquadEdited(state, action: PayloadAction<string>) {
      state.edited = action.payload;
    },

    clearSquadDrawerState(state) {
      state.drawerId = null;
      state.edited = '';
    },

    setData(state, action: PayloadAction<TableNode[]>) {
      state.data.nodes = action.payload;
    },

    setModifiedNodes(state, action: PayloadAction<TableNode[]>) {
      state.modifiedNodes = action.payload;
    },
  },
});

export const { setSquadDrawerId, setSquadEdited, clearSquadDrawerState, setSquadNodes, setData, setModifiedNodes } =
  squadTableSlice.actions;

export default squadTableSlice.reducer;
