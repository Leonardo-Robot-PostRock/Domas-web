import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AreaData, AreaField } from '@/types/store/area';

const initialState: AreaData = {
  area: [],
  areaGroup: []
};

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {
    setArea(state, action: PayloadAction<AreaField[]>) {
      state.area = action.payload;
    },

    setAreaGroup(state, action: PayloadAction<AreaField[]>) {
      state.areaGroup = action.payload;
    }
  }
});

export const { setArea, setAreaGroup } = areasSlice.actions;
export default areasSlice.reducer;
