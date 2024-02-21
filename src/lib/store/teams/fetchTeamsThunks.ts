import axios, { isAxiosError } from 'axios';
import { setTeams } from './teamsSlice';
import { toastError } from '@/components/toast';
import { AsyncThunkAction } from '@/types/store/actionType';
import { Team } from '@/types/api/teams';
import { handleAxiosError } from '@/utils/errorHandling';

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
