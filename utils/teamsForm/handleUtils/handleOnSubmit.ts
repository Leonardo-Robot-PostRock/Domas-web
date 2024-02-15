import { useAppDispatch, useAppSelector } from '@/store';
import { toastSuccess } from '@/components/toast/toastSuccess';
import { closeModal } from '@/store/closeModal/closeModalReducer';
import { mutate } from 'swr';
import { toastError } from '@/components/toast/toastError';
import axios from 'axios';
import { EditProps } from '@/types/Form/teamEdit';

interface Props {
  edit: EditProps;
  data: any;
  submitMethod: 'patch' | 'post';
  submitUrl: string;
}

export const handleOnSubmit = async ({ edit, data, submitMethod, submitUrl }: Props) => {
  const dispatch = useAppDispatch();

  const userSession = JSON.parse(localStorage.getItem('user') as string);

  const showSupervisorField = useAppSelector((state) => state.teams.showSupervisorField);
  const primaryFile = useAppSelector((state) => state.teams.primaryFile);
  const secondaryFile = useAppSelector((state) => state.teams.secondaryFile);
  const clustersGroup = useAppSelector((state) => state.teams.clustersGroup);
  const areaGroup = useAppSelector((state) => state.teams.areaGroup);
  const clustersFav = useAppSelector((state) => state.teams.clustersFav);

  data.supervisor_id = showSupervisorField ? data.supervisor.value : userSession.id || null;
  data.users_id = [];
  if (data.leader) {
    data.users_id.push(data.leader.value);
  }
  if (data.assistant) {
    data.users_id.push(data.assistant.value);
  }
  delete data.supervisor;
  delete data.leader;
  delete data.assistant;

  if (primaryFile.length > 0) {
    data.primary_file = primaryFile[0].getFileEncodeBase64String();
  }
  if (secondaryFile.length > 0) {
    data.secondary_file = secondaryFile[0].getFileEncodeBase64String();
  }

  data.cluster_id = clustersGroup.map((item) => item.value);
  data.cluster_favourite = clustersFav.filter((item) => item.isChecked).map((item) => item.cluster_id);
  data.area_id = areaGroup.map((item) => item.value);

  delete data.cluster;
  delete data.area;

  axios[submitMethod](submitUrl, data)
    .then((res) => {
      mutate('/api/teams/all');
      toastSuccess(edit ? 'Cuadrilla modificada exitosamente' : 'Cuadrilla creada exitosamente');
      dispatch(closeModal());
    })
    .catch((err) => {
      const { data } = err.response;

      toastError(data.message);
    });
};
