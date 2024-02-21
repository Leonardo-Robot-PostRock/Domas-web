import { AsyncThunkAction } from '@/types/store/actionType';
import axios from 'axios';
import { Cluster } from '@/types/api/clusters';
import { handleAxiosError } from '@/utils/errorHandling';
import { setClusterData } from './clusterSlice';

export const fetchCluster = (): AsyncThunkAction => {
  return async (dispatch) => {
    const response = await axios.get<Cluster>('/api/cluster/all');

    const data = response.data;

    try {
      if (Array.isArray(data)) {
        const cluster = data.map((item: Cluster) => ({
          value: item.id,
          label: item.cluster,
        }));

        dispatch(setClusterData(cluster));
      }
    } catch (error: unknown) {
      handleAxiosError(dispatch, error);
    }
  };
};
