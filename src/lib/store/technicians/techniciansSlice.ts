import { createSlice } from '@reduxjs/toolkit';
import type { TechniciansData } from '@/types/store/technician';

const initialState: TechniciansData = {
  technicianDataField: []
};

const techniciansSlice = createSlice({
  name: 'technicians',
  initialState,
  reducers: {
    setTechnicianDataField(state, action) {
      state.technicianDataField = action.payload;
    }
  }
});

export const { setTechnicianDataField } = techniciansSlice.actions;

export default techniciansSlice.reducer;
