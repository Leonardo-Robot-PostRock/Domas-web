import { useAppDispatch, useAppSelector } from '@/store';
import { setCloustersFav, setCloustersGroup } from '@/store/teams/teamsReducer';

export const handleClusters = (e: any[]) => {
  const dispatch = useAppDispatch();
  const clustersFav = useAppSelector((state) => state.teams.clustersFav);

  console.log('from handleClusters', e);

  dispatch(setCloustersGroup(e));
  const clusters = clustersFav.slice();

  e.forEach((item) => {
    if (!clusters.some((cluster) => cluster.cluster_id === item.value)) {
      clusters.push({ cluster_id: item.value, isChecked: false });
    }
  });

  dispatch(setCloustersFav(clusters));
};
