import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TeamsData } from '@/types/store/teamsData';
import { Team } from '@/types/api/teams';

const initialState: TeamsData = {
  primaryFile: [],
  secondaryFile: [],
  technicianDataField: [],
  error: null,
  loading: false,
  teams: [],
  teamEdit: null,
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    addNewTeam(state, action: PayloadAction<Team[]>) {
      state.teams = action.payload;
    },

    setDeleteTeam(state, action) {
      state.teamEdit = action.payload;
    },

    setError(state, action: PayloadAction<Error>) {
      state.error = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setTeams(state, action: PayloadAction<Team[]>) {
      state.teams = action.payload;
    },

    updateTeam(state, action: PayloadAction<Team>) {
      state.teams = state.teams.map((team) => {
        if (team.id === action.payload.id) {
          return action.payload;
        }
        return team;
      });
    },
  },
});

export const { setTeams, setDeleteTeam, setError, setLoading, addNewTeam, updateTeam } = teamsSlice.actions;

export default teamsSlice.reducer;
