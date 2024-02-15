import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCloustersFav } from '@/store/teams/teamsReducer';

export const handleCheckbox = ({ e, cluster_id }: { e: ChangeEvent<HTMLInputElement>; cluster_id: number }) => {
  const clustersFav = useAppSelector((state) => state.teams.clustersFav);
  const dispatch = useAppDispatch();

  const updateClusters = clustersFav.map((item) =>
    item.cluster_id === cluster_id ? { ...item, isCheck: e.target.checked } : item
  );

  dispatch(setCloustersFav(updateClusters));
};
