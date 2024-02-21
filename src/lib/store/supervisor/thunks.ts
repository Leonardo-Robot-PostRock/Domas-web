import axios from 'axios';

import { handleAxiosError } from '@/utils/errorHandling';

import { AsyncThunkAction } from '@/types/store/actionType';
import { Role } from '@/types/api/login';
import { setShowSupervisorField, setSupervisorsDataField } from './supervisorSlice';

export const fetchSupervisors = (): AsyncThunkAction => async (dispatch) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin: boolean = userInfo.roles?.some((item: Role) => item.name.toUpperCase() === 'ADMINISTRADOR');
    dispatch(setShowSupervisorField(isAdmin));

    if (isAdmin) {
      const response = await axios.get('/api/supervisor/all');
      const supervisors = response.data.users;
      const supervisorDataField = supervisors.map((item: any) => ({ value: item.id, label: item.name }));

      dispatch(setSupervisorsDataField(supervisorDataField));
    }
  } catch (error: unknown) {
    handleAxiosError(dispatch, error);
  }
};
