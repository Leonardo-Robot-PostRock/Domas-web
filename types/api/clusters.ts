export interface Cluster {
  id: number;
  cluster: string;
  customers: number[];
}

export interface ClusterResponse {
  data: Cluster;
}
