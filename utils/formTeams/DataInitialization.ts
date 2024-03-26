/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from '@/lib';
import { setCloustersGroup, setFavouriteClousters } from '@/lib/store/cluster/clusterSlice';
import type { FieldData } from '@/types/Form/FormFieldProps';
import type { Area, Cluster } from '@/types/api/teams';
import { useEffect } from 'react';

export const ClusterOptions = ({ clusters }: { clusters: Cluster[] }): FieldData[] => {
  const dispatch = useAppDispatch();

  const clustersOptions = clusters.map((cluster: Cluster) => ({ value: cluster.id, label: cluster.name }));
  useEffect(() => {
    dispatch(setCloustersGroup(clustersOptions));
  }, [clusters, dispatch]);

  return clustersOptions;
};

export const FavouriteClusters = ({ clusters }: { clusters: Cluster[] | undefined }): void => {
  const teamEdit = useAppSelector((state) => state.teams.teamEdit);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const clusterPpal = clusters?.map((cluster) => ({
      cluster_id: cluster.id,
      isChecked: cluster.favourite_group === teamEdit?.id
    }));
    dispatch(setFavouriteClousters(clusterPpal));
  }, [clusters, dispatch, teamEdit?.id]);
};

export const areaOption = ({ areas }: { areas: Area[] }): FieldData[] => {
  const areasOptions = areas.length ? areas.map((area: Area) => ({ value: area.id, label: area.name })) : [];

  return areasOptions;
};
