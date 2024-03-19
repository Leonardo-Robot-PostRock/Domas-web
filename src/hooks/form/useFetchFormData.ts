import { useCallback } from 'react';
import { useAppDispatch } from '@/lib';
import { fetchArea } from '@/lib/store/area/thunks';
import { fetchCluster } from '@/lib/store/cluster/thunks';
import { fetchTechnicianDataField } from '@/lib/store/technicians/thunks';
import { fetchSupervisors } from '@/lib/store/supervisor/thunks';
import { toast } from 'react-toastify';

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
        dispatch(fetchTechnicianDataField()),
        dispatch(fetchSupervisors())
      ]);
    } catch (error) {
      toast.error('Ocurrió un error al cargar los datos');
    }
  }, [dispatch]);

  return { fetchData };
};
