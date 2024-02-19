import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';
import { setCloustersFav } from '@/lib/store/teams/teamsSlice';

export const handleCheckbox = ({ e, cluster_id }: { e: ChangeEvent<HTMLInputElement>; cluster_id: number }) => {
  const clustersFav = useAppSelector((state) => state.teams.clustersFav);
  const dispatch = useAppDispatch();

  const updateClusters = clustersFav.map((item) =>
    item.cluster_id === cluster_id ? { ...item, isCheck: e.target.checked } : item
  );

  dispatch(setCloustersFav(updateClusters));
};
