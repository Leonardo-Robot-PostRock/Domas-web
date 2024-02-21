import { Supervisor } from '@/types/api/teams';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SupervisorData {
  showSupervisorField: boolean;
  supervisorsDataField: Supervisor[];
}

const initialState: SupervisorData = {
  showSupervisorField: false,
  supervisorsDataField: [],
};

const supervisorSlice = createSlice({
  name: 'supervisor',
  initialState,
  reducers: {
    setShowSupervisorField(state, action: PayloadAction<boolean>) {
      state.showSupervisorField = action.payload;
    },

    setSupervisorsDataField(state, action: PayloadAction<Supervisor[]>) {
      state.supervisorsDataField = action.payload;
    },
  },
});

export const { setShowSupervisorField, setSupervisorsDataField } = supervisorSlice.actions;

export default supervisorSlice.reducer;
