import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SupervisorData } from '@/types/store/supervisor';
import type { FieldData } from '@/types/Form/FormFieldProps';

const initialState: SupervisorData = {
  showSupervisorField: false,
  supervisorsDataField: { value: '', label: 'Seleccionar...' }
};

const supervisorSlice = createSlice({
  name: 'supervisor',
  initialState,
  reducers: {
    setShowSupervisorField(state, action: PayloadAction<boolean>) {
      state.showSupervisorField = action.payload;
    },

    setSupervisorsDataField(state, action: PayloadAction<FieldData>) {
      state.supervisorsDataField = action.payload;
    }
  }
});

export const { setShowSupervisorField, setSupervisorsDataField } = supervisorSlice.actions;

export default supervisorSlice.reducer;
