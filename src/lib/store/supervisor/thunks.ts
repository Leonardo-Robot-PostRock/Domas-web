import axios from 'axios';

import { setShowSupervisorField, setSupervisorsDataField } from './supervisorSlice';
import { handleAxiosError } from '@/utils/errorHandling';

import type { AsyncThunkAction } from '@/types/store/actionType';
import type { Role } from '@/types/api/login';
import type { User } from '@/types/api/supervisor';
import type { FieldData } from '@/types/Form/FormFieldProps';

export const fetchSupervisors = (): AsyncThunkAction => async (dispatch) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('user') ?? '{}');
    const isAdmin: boolean = userInfo.roles?.some((item: Role) => item.name.toUpperCase() === 'ADMINISTRADOR');
    dispatch(setShowSupervisorField(isAdmin));

    if (isAdmin) {
      const response = await axios.get('/api/supervisor/all');
      const supervisors = response.data.users;
      const supervisorDataField: FieldData[] = supervisors.map((item: User) => ({
        value: item.id,
        label: item.name
      }));

      dispatch(setSupervisorsDataField(supervisorDataField));
    }
  } catch (error) {
    handleAxiosError(dispatch, error);
  }
};
