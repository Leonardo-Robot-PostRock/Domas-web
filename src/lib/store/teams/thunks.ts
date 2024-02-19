import { mutate } from 'swr';
import axios, { isAxiosError } from 'axios';

import { toastError } from '@/components/toast';
import { setError, setLoading } from './teamsSlice';

import { AsyncThunkAction } from '@/types/store/actionType';

export const deleteTeam = (teamId: number): AsyncThunkAction => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      await axios.delete(`/api/teams/${teamId}`);
      dispatch(deleteTeam(teamId));

      mutate('/api/teams/all');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        dispatch(setError(error.message));

        toastError('Error al eliminar la cuadrilla');
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
};
