import type { SupervisorField } from '@/types/Form/teamEdit';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SupervisorData {
  showSupervisorField: boolean;
  supervisorsDataField: SupervisorField[];
}

const initialState: SupervisorData = {
  showSupervisorField: false,
  supervisorsDataField: []
};

const supervisorSlice = createSlice({
  name: 'supervisor',
  initialState,
  reducers: {
    setShowSupervisorField(state, action: PayloadAction<boolean>) {
      state.showSupervisorField = action.payload;
    },

    setSupervisorsDataField(state, action: PayloadAction<SupervisorField[]>) {
      state.supervisorsDataField = action.payload;
    }
  }
});

export const { setShowSupervisorField, setSupervisorsDataField } = supervisorSlice.actions;

export default supervisorSlice.reducer;
