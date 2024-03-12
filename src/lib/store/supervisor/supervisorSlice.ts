import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SupervisorData } from '@/types/store/supervisor';
import type { FieldData } from '@/types/Form/FormFieldProps';

const initialState: SupervisorData = {
  showSupervisorField: false,
  supervisorsDataField: [],
  supervisorInField: {
    value: '',
    label: 'Seleccionar...'
  }
};

const supervisorSlice = createSlice({
  name: 'supervisor',
  initialState,
  reducers: {
    setShowSupervisorField(state, action: PayloadAction<boolean>) {
      state.showSupervisorField = action.payload;
    },

    setSupervisorsDataField(state, action: PayloadAction<FieldData[]>) {
      state.supervisorsDataField = action.payload;
    },

    setSupervisorInField(state, action: PayloadAction<FieldData>) {
      state.supervisorInField = action.payload;
    }
  }
});

export const { setShowSupervisorField, setSupervisorsDataField, setSupervisorInField } = supervisorSlice.actions;

export default supervisorSlice.reducer;
