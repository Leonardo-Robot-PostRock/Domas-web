import axios from 'axios';
import { handleAxiosError } from '@/utils/errorHandling';
import { setCluster } from './clusterSlice';

import type { AsyncThunkAction } from '@/types/store/actionType';
import type { Cluster } from '@/types/api/clusters';
import type { ClusterOption } from '@/types/store/cluster';

export const fetchCluster = (): AsyncThunkAction => {
  return async (dispatch) => {
    const response = await axios.get<Cluster>('/api/cluster');
    const data: Cluster = response.data;

    try {
      if (Array.isArray(data)) {
        const cluster: ClusterOption[] = data.map((item) => ({
          value: item.id,
          label: item.cluster
        }));

        dispatch(setCluster(cluster));
      }
    } catch (error) {
      handleAxiosError(dispatch, error);
    }
  };
};
