import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TechniciansData } from '@/types/store/technician';
import type { FieldData } from '@/types/Form/FormFieldProps';

const initialState: TechniciansData = {
  technicianDataField: [],
  selectedTechnicians: {
    leader: { value: '', label: '' },
    assistant: { value: '', label: '' }
  }
};

const techniciansSlice = createSlice({
  name: 'technicians',
  initialState,
  reducers: {
    setTechnicianDataField(state, action: PayloadAction<FieldData[]>) {
      state.technicianDataField = action.payload;
    },

    setSelectedTechnician(state, action: PayloadAction<{ field: string; technicians: FieldData }>) {
      const { field, technicians } = action.payload;
      state.selectedTechnicians = { ...state.selectedTechnicians, [field]: technicians };
    }
  }
});

export const { setTechnicianDataField, setSelectedTechnician } = techniciansSlice.actions;

export default techniciansSlice.reducer;
