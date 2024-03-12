import { useAppDispatch, useAppSelector } from '@/lib';

import type { FormData } from '@/types/Form/teamEdit';
import type { SubmitHandler } from 'react-hook-form';
import type { User } from '@/types/api/login';
import { submitTeamData } from '@/lib/store/teams/thunks';
import type { FilePondFile } from 'filepond';

export const useFormSubmit = (primaryFile: FilePondFile[], secondaryFile: FilePondFile[]): SubmitHandler<FormData> => {
  const dispatch = useAppDispatch();

  const clustersGroup = useAppSelector((state) => state.cluster.clustersGroup);
  const favouriteCluster = useAppSelector((state) => state.cluster.favouriteCluster);
  const areaGroup = useAppSelector((state) => state.area.areaGroup);
  const showSupervisorField = useAppSelector((state) => state.supervisor.showSupervisorField);

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    const userSessionString = localStorage.getItem('user');
    const userSession: User = userSessionString ? JSON.parse(userSessionString) : null;

    data.supervisor_id = showSupervisorField ? Number(data.supervisorField?.value) : userSession.id ?? null;
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

    data.cluster_id = clustersGroup.map((item) => Number(item.value));
    data.cluster_favourite = favouriteCluster.filter((item) => item.isChecked).map((item) => Number(item.cluster_id));

    data.area_id = areaGroup?.length ? areaGroup.map((item) => Number(item.value)) : [];

    delete data.cluster;
    delete data.area;

    await dispatch(submitTeamData(data));
  };

  return onSubmit;
};
