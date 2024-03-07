import axios from 'axios';
import { mutate } from 'swr';

import { setDeleteTeam, setLoading, setTeams } from './teamsSlice';

import { handleAxiosError } from '@/utils/errorHandling';

import { toastSuccess } from '@/components/toast';

import type { AsyncThunkAction } from '@/types/store/actionType';
import type { FormData } from '@/types/Form/teamEdit';
import type { Team } from '@/types/api/teams';
import type { TeamById } from '@/types/api/teamById';

export const deleteTeam = (teamId: number | null): AsyncThunkAction => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    if (teamId) {
      try {
        await axios.delete<TeamById>(`/api/teams/${teamId}`);
        dispatch(setDeleteTeam(teamId));

        await mutate('/api/teams/all');
      } catch (error) {
        handleAxiosError(dispatch, error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };
};

export const fetchTeams = (): AsyncThunkAction => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/api/teams/all');
      const teams: Team[] = response.data;

      dispatch(setTeams(teams));
    } catch (error) {
      handleAxiosError(dispatch, error);
    }
  };
};

export const submitTeamData = (data: FormData): AsyncThunkAction => {
  return async (dispatch, getState) => {
    const teamEdit = getState().teams.teamEdit;

    try {
      const submitUrl = teamEdit ? `/api/teams/update/${teamEdit.id}` : `/api/teams/new`;
      const submitMethod = teamEdit ? `patch` : 'post';

      await axios[submitMethod](submitUrl, data);
      await mutate('/api/teams/all');
      void toastSuccess(data ? 'Cuadrilla modificada exitosamente' : 'Cuadrilla creada exitosamente');
    } catch (error) {
      handleAxiosError(dispatch, error);
    }
  };
};

export const addNewTeam = (): AsyncThunkAction => {
  return async (dispatch) => {};
};
