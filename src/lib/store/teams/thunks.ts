import axios from 'axios';
import { mutate } from 'swr';

import { setLoading } from './teamsSlice';

import { handleAxiosError } from '@/utils/errorHandling';

import { AsyncThunkAction } from '@/types/store/actionType';
import { TeamById } from '@/types/api/teamById';

export const deleteTeam = (teamId: number): AsyncThunkAction => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      await axios.delete<TeamById>(`/api/teams/${teamId}`);
      dispatch(deleteTeam(teamId));

      mutate('/api/teams/all');
    } catch (error: unknown) {
      handleAxiosError(dispatch, error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const addNewTeam = () => {};
