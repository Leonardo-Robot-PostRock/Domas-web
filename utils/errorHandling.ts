import { Dispatch } from 'redux';
import { isAxiosError } from 'axios';
import { toastError } from '@/components/toast';
import { setError } from '@/lib/store/teams/teamsSlice';

export const handleAxiosError = (dispatch: Dispatch, error: any) => {
  if (isAxiosError(error)) {
    const errorMessage = error.message || 'Ha ocurrido un error durante la operación';
    const errorObject = new Error(errorMessage);
    dispatch(setError(errorObject));
    toastError('Ocurrió un error durante la operación');
  }
};
