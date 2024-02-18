import { createSlice } from '@reduxjs/toolkit';

import { TeamsData } from '@/types/store/teamsData';

const initialState: TeamsData = {
  squadData: null,
  // showSupervisorField: false,
  // supervisorsDataField: [],
  // technicianDataField: [],
  // primaryFile: [],
  // secondaryFile: [],
  // clusterData: [],
  // areaData: [],
  // clustersGroup: [],
  // areaGroup: [],
  // clustersFav: [],
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setSquadData(state, action) {
      state.squadData = action.payload;
    },

    // setShowSupervisorField(state, action) {},

    // setSupervisorsDataField(state, action) {},

    // setCloustersGroup(state, action) {},

    // setCloustersFav(state, action) {},

    // setTechnicianDataField(state, action) {},
  },
});

export const {
  // setShowSupervisorField,
  // setSupervisorsDataField,
  // setCloustersGroup,
  // setCloustersFav,
  // setTechnicianDataField,
  setSquadData,
} = teamsSlice.actions;
export default teamsSlice.reducer;
