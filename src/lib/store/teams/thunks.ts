import axios from 'axios';
import { mutate } from 'swr';

import { setDeleteTeam, setLoading, setTeams } from './teamsSlice';

import { handleAxiosError } from '@/utils/errorHandling';

import type { AsyncThunkAction } from '@/types/store/actionType';
import type { TeamById } from '@/types/api/teamById';
import type { Team } from '@/types/api/teams';

export const deleteTeam = (teamId: number): AsyncThunkAction => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      await axios.delete<TeamById>(`/api/teams/${teamId}`);
      dispatch(setDeleteTeam(teamId));

      await mutate('/api/teams/all');
    } catch (error: unknown) {
      handleAxiosError(dispatch, error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const fetchTeams = (): AsyncThunkAction => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/api/teams/all');
      const teams: Team[] = response.data;

      console.log('teams', teams);

      dispatch(setTeams(teams));
    } catch (error: unknown) {
      handleAxiosError(dispatch, error);
    }
  };
};

export const addNewTeam = (): AsyncThunkAction => {
  return async (dispatch) => {};
};
