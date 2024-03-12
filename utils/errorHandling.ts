import type { Dispatch } from 'redux';
import { isAxiosError } from 'axios';
import { setError } from '@/lib/store/teams/teamsSlice';
import { toast } from 'react-toastify';

export const handleAxiosError = (dispatch: Dispatch, error: any): void => {
  if (isAxiosError(error)) {
    dispatch(setError(error.message));
    toast.error(error.message);
  }
};
