import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TechniciansData } from '@/types/store/technician';
import type { FieldData } from '@/types/Form/FormFieldProps';

const initialState: TechniciansData = {
  technicianDataField: []
};

const techniciansSlice = createSlice({
  name: 'technicians',
  initialState,
  reducers: {
    setTechnicianDataField(state, action: PayloadAction<FieldData[]>) {
      state.technicianDataField = action.payload;
    }
  }
});

export const { setTechnicianDataField } = techniciansSlice.actions;

export default techniciansSlice.reducer;
