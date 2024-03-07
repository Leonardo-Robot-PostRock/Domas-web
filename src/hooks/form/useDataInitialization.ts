import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';

import { setAreaGroup } from '@/lib/store/area/areaSlice';
import { setCloustersGroup, setFavouriteClousters } from '@/lib/store/cluster/clusterSlice';

import type { TeamEdit } from '@/types/Form/teamEdit';
import type { Area } from '@/types/api/teams';
import type { FieldData } from '@/types/Form/FormFieldProps';

export const useDataInitialization = (): TeamEdit | null | undefined => {
  const dispatch = useAppDispatch();
  const teamEdit = useAppSelector((state) => state.teams.teamEdit);

  useEffect(() => {
    const initializeData = (): void => {
      const clusterGroupData = teamEdit ? teamEdit.clusters.map((item) => ({ value: item.id, label: item.name })) : [];

      const areaGroupData: FieldData[] = teamEdit?.areas
        ? teamEdit.areas.map((item: Area) => ({ value: item.id, label: item.name }))
        : [];

      const favouriteClusterData = teamEdit?.clusters
        ? teamEdit.clusters.map((item) => ({ cluster_id: item.id, isChecked: item.favourite_group === teamEdit.id }))
        : [];

      dispatch(setFavouriteClousters(favouriteClusterData));
      dispatch(setAreaGroup(areaGroupData));
      dispatch(setCloustersGroup(clusterGroupData));
    };

    initializeData();
  }, [dispatch, teamEdit]);

  return teamEdit;
};
