import { Technician } from '@/types/api/technician';
import { createSlice } from '@reduxjs/toolkit';

interface TechniciansData {
  technicianDataField: Technician | null;
}

const initialState: TechniciansData = {
  technicianDataField: null,
};

const techniciansSlice = createSlice({
  name: 'technicians',
  initialState,
  reducers: {
    setTechnicianDataField(state, action) {
      state.technicianDataField = action.payload;
    },
  },
});

export const { setTechnicianDataField } = techniciansSlice.actions;

export default techniciansSlice.reducer;
