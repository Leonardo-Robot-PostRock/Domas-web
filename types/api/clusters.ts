export interface Cluster {
  id: number;
  cluster?: string;
  customers: number[];
}

export interface ClusterData {
  data: Cluster[];
}
