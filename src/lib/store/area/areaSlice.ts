import type { AreaData } from '@/types/store/area';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FieldData } from '@/types/Form/FormFieldProps';

const initialState: AreaData = {
  area: [],
  areaGroup: [{ value: '', label: 'Seleccionar...' }]
};

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {
    setArea(state, action: PayloadAction<FieldData[]>) {
      state.area = action.payload;
    },

    setAreaGroup(state, action: PayloadAction<FieldData[]>) {
      state.areaGroup = action.payload;
    }
  }
});

export const { setArea, setAreaGroup } = areasSlice.actions;
export default areasSlice.reducer;
