import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Team } from '@/types/api/teams';
import type { TeamsState } from '@/types/store/teamsState';

const initialState: TeamsState = {
  technicianDataField: [],
  error: null,
  loading: false,
  teams: [],
  teamEdit: null
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setDeleteTeam(state, action) {
      const teamId = action.payload;
      state.teams = state.teams.filter((team) => team.id !== teamId);
    },

    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setTeamEdit(state, action: PayloadAction<Team | null>) {
      state.teamEdit = action.payload;
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
    }
  }
});

export const { setDeleteTeam, setError, setLoading, setTeamEdit, setTeams, updateTeam } = teamsSlice.actions;

export default teamsSlice.reducer;
