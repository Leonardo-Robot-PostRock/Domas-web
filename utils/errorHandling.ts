import type { Dispatch } from 'redux';
import { isAxiosError } from 'axios';
import { toastError } from '@/components/toast';
import { setError } from '@/lib/store/teams/teamsSlice';

export const handleAxiosError = (dispatch: Dispatch, error: any): void => {
  if (isAxiosError(error)) {
    dispatch(setError(error.message));
    toastError('Ocurrió un error durante la operación');
  }
};
