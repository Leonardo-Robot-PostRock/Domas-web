import axios from 'axios';

import { handleAxiosError } from '@/utils/errorHandling';
import { setAreaData } from './areaSlice';

import { AsyncThunkAction } from '@/types/store/actionType';
import { Area } from '@/types/api/area';

export const fetchArea = (): AsyncThunkAction => {
  return async (dispatch) => {
    const response = await axios.get<Area>('/api/area');

    const data = response.data;

    try {
      if (Array.isArray(data)) {
        const area = data.map((item: Area) => ({
          value: item.id,
          label: item.name,
        }));

        dispatch(setAreaData(area));
      }
    } catch (error: unknown) {
      handleAxiosError(dispatch, error);
    }
  };
};
