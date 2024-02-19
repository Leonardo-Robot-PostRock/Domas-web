import { createSlice } from '@reduxjs/toolkit';

import { TeamsData } from '@/types/store/teamsData';

const initialState: TeamsData = {
  teamData: null,
  loading: false,
  error: null,
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
    setTeamData(state, action) {
      state.teamData = action.payload;
    },

    setDeleteTeam(state, action) {
      state.teamData = action.payload;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
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
  setTeamData,
  setDeleteTeam,
  setLoading,
  setError,
} = teamsSlice.actions;
export default teamsSlice.reducer;
