import axios from 'axios';
import { mutate } from 'swr';

import { setDeleteTeam, setLoading, setTeams } from './teamsSlice';
import { toaster } from '@/components/toast';

import { handleAxiosError } from '@/utils/errorHandling';

import type { AsyncThunkAction } from '@/types/store/actionType';
import type { FormData } from '@/types/Form/teamEdit';
import type { Team } from '@/types/api/teams';
import type { TeamById } from '@/types/api/teamById';

export const deleteTeam = (teamId: number | null): AsyncThunkAction => {
  return async (dispatch) => {
    if (teamId) {
      try {
        await axios.delete<TeamById>(`/api/teams/delete/${teamId}`);
        dispatch(setDeleteTeam(teamId));
        await Promise.all([mutate('/api/teams/all'), dispatch(fetchTeams())]);
        toaster.success({ title: 'La cuadrilla ha sido eliminada', text: 'Buen trabajo! :)' }, { autoClose: 8000 });
      } catch (error) {
        handleAxiosError(dispatch, error);
      }
    }
  };
};

export const fetchTeams = (): AsyncThunkAction => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get('/api/teams/all');
      const teams: Team[] = response.data;

      dispatch(setTeams(teams));
    } catch (error) {
      handleAxiosError(dispatch, error);
    } finally {
      dispatch(setLoading(false));
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
      await Promise.all([await mutate('/api/teams/all'), dispatch(fetchTeams())]);
      toaster.success(
        { title: data ? 'Cuadrilla modificada exitosamente' : 'Cuadrilla creada exitosamente', text: 'Buen trabajo' },
        { autoClose: 8000 }
      );
    } catch (error) {
      handleAxiosError(dispatch, error);
    }
  };
};
