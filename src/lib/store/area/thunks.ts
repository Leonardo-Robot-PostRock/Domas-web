import axios from 'axios';

import { handleAxiosError } from '@/utils/errorHandling';
import { setArea } from './areaSlice';

import type { AsyncThunkAction } from '@/types/store/actionType';
import type { Area } from '@/types/api/area';
import type { FieldData } from '@/types/Form/FormFieldProps';

export const fetchArea = (): AsyncThunkAction => {
  return async (dispatch) => {
    const response = await axios.get<Area[]>('/api/area');

    const data = response.data;

    try {
      const area: FieldData[] = data.map((item: Area) => ({
        value: item.id,
        label: item.name
      }));

      dispatch(setArea(area));
    } catch (error: unknown) {
      handleAxiosError(dispatch, error);
    }
  };
};
