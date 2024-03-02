import { useCallback } from 'react';
import { useAppDispatch } from '@/lib';
import { toastError } from '@/components/toast';
import { fetchArea } from '@/lib/store/area/thunks';
import { fetchCluster } from '@/lib/store/cluster/thunks';
import { fetchTechnician } from '@/lib/store/technicians/thunks';
import { fetchSupervisors } from '@/lib/store/supervisor/thunks';

type FetchDataFunction = () => Promise<void>;

interface UseFetchFormData {
  fetchData: FetchDataFunction;
}

export const useFetchFormData = (): UseFetchFormData => {
  const dispatch = useAppDispatch();

  const fetchData = useCallback<FetchDataFunction>(async () => {
    try {
      await Promise.all([
        dispatch(fetchArea()),
        dispatch(fetchCluster()),
        dispatch(fetchTechnician()),
        dispatch(fetchSupervisors())
      ]);
    } catch (error) {
      toastError('Ocurrió un error al cargar los datos');
    }
  }, [dispatch]);

  return { fetchData };
};
