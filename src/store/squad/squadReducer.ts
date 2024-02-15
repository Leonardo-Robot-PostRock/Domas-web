import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TableNode } from '@table-library/react-table-library/types/table';

interface squadState {
  nodes: TableNode[];
  drawerId: string | number | null;
  edited: string;
  data: { nodes: TableNode[] };
}

const initialState: squadState = {
  nodes: [],
  drawerId: null,
  edited: '',
  data: {
    nodes: [],
  },
};

const squadSlice = createSlice({
  name: 'squad',
  initialState,
  reducers: {
    setSquadNodes(state, action: PayloadAction<TableNode[]>) {
      state.nodes = action.payload;
    },

    setSquadDrawerId: (state, action: PayloadAction<string | number | null>) => {
      state.drawerId = action.payload;
    },

    setSquadEdited: (state, action: PayloadAction<string>) => {
      state.edited = action.payload;
    },

    clearSquadDrawerState: (state) => {
      state.drawerId = null;
      state.edited = '';
    },

    setData: (state, action: PayloadAction<TableNode[]>) => {
      state.data.nodes = action.payload;
    },
  },
});

export const { setSquadDrawerId, setSquadEdited, clearSquadDrawerState, setSquadNodes, setData } = squadSlice.actions;

export default squadSlice.reducer;
