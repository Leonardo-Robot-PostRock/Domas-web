import axios, { isAxiosError } from 'axios';
import { Team } from '@/types/api/getTicketsFromDb';
import { setTeams } from './teamsTableSlice';
import { toastError } from '@/components/toast';
import { AsyncThunkAction } from '@/types/store/actionType';

export const fetchTeams = (): AsyncThunkAction => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/api/teams/all');
      const teams: Team[] = response.data;
      dispatch(setTeams(teams));
    } catch (error) {
      if (isAxiosError(error)) {
        toastError('Ocurrio un error al intentar mostrar las cuadrillas.');
        throw error;
      }
    }
  };
};
