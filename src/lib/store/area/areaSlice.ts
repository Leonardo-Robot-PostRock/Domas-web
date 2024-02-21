import { Area } from '@/types/api/area';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AreaData {
  area: Area[];
  areaGroup: Area[];
}

const initialState: AreaData = {
  area: [],
  areaGroup: [],
};

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {
    setAreaData(state, action) {
      state.area = action.payload;
    },

    setAreaGroup(state, action) {
      state.areaGroup = action.payload;
    },
  },
});

export const { setAreaData, setAreaGroup } = areasSlice.actions;
export default areasSlice.reducer;
