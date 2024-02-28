export interface ClusterOption {
  readonly value: number | null;
  readonly label: string;
}

export interface SelectCluster {
  isChecked: boolean;
  cluster_id: number | null;
}

export interface ClusterData {
  cluster: readonly ClusterOption[];
  clustersGroup: readonly ClusterOption[];
  favouriteCluster: readonly SelectCluster[];
}
