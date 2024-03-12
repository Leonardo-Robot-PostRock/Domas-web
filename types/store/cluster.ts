import type { FieldData } from '../Form/FormFieldProps';

export interface SelectCluster {
  isChecked: boolean;
  cluster_id: number | null | string;
}

export interface ClusterData {
  cluster: FieldData[];
  clustersGroup: readonly FieldData[];
  favouriteCluster: readonly SelectCluster[];
}
