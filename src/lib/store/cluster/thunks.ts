import axios from 'axios';
import { handleAxiosError } from '@/utils/errorHandling';
import { setCluster } from './clusterSlice';

import type { AsyncThunkAction } from '@/types/store/actionType';
import type { Cluster } from '@/types/api/clusters';
import type { FieldData } from '@/types/Form/FormFieldProps';

export const fetchCluster = (): AsyncThunkAction => {
  return async (dispatch) => {
    const response = await axios.get<Cluster[]>('/api/cluster');
    const data = response.data;

    try {
      const cluster: FieldData[] = data.map((item: Cluster) => ({
        value: item.id,
        label: item.cluster
      }));

      dispatch(setCluster(cluster));
    } catch (error) {
      handleAxiosError(dispatch, error);
    }
  };
};
