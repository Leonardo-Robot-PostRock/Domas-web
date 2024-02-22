import type { Cluster } from '@/types/api/clusters';
import { createSlice } from '@reduxjs/toolkit';

interface ClusterData {
  cluster: Cluster[];
  clustersGroup: { value: number | null; label: string }[];
  favouriteCluster: {
    isChecked: boolean;
    cluster_id: number | null;
  }[];
}

const initialState: ClusterData = {
  cluster: [],
  clustersGroup: [
    {
      value: null,
      label: ''
    }
  ],
  favouriteCluster: [
    {
      isChecked: false,
      cluster_id: null
    }
  ]
};

const clusterSlice = createSlice({
  name: 'cluster',
  initialState,
  reducers: {
    setClusterData(state, action) {
      state.cluster = action.payload;
    },

    setFavouriteClousters(state, action) {
      state.favouriteCluster = action.payload;
    },

    setCloustersGroup(state, action) {
      state.clustersGroup = action.payload;
    }
  }
});

export const { setClusterData, setFavouriteClousters, setCloustersGroup } = clusterSlice.actions;

export default clusterSlice.reducer;
