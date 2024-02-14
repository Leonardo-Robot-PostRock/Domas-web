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

    setCloustersGroup(state, action) {
      state.clustersGroup = action.payload;
    },

    setCloustersFav(state, action) {
      state.clustersFav = action.payload;
    },
  },
});

export const { setShowSupervisorField, setSupervisorsDataField, setCloustersGroup, setCloustersFav } =
  teamsSlice.actions;
export default teamsSlice.reducer;
