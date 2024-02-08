import { createSlice } from '@reduxjs/toolkit';

import { TeamsData } from '@/types/store/teamsData';

const initialState: TeamsData = {
  showSupervisorField: false,
  supervisorsDataField: [],
  technicianDataField: [],
  primaryFile: [],
  secondaryFile: [],
  clusterData: [],
  areaData: [],
  clustersGroup: [],
  areaGroup: [],
  clustersFav: [],
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setShowSupervisorField(state, action) {
      state.showSupervisorField = action.payload;
    },
    setSupervisorsDataField(state, action) {
      state.supervisorsDataField = action.payload;
    },
    // Define otras acciones aquí...
  },
});

export const { setShowSupervisorField, setSupervisorsDataField } = teamsSlice.actions;
export default teamsSlice.reducer;
2;
