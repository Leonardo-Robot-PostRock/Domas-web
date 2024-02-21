import { Cluster } from '@/types/api/clusters';
import { createSlice } from '@reduxjs/toolkit';

interface ClusterData {
  cluster: Cluster[];
  clustersGroup: Cluster[];
  favouriteCluster: Cluster[];
}

const initialState: ClusterData = {
  cluster: [],
  clustersGroup: [],
  favouriteCluster: [],
};

const clusterSlice = createSlice({
  name: 'cluster',
  initialState,
  reducers: {
    setClusterData(state, action) {
      state.cluster = action.payload;
    },

    setCloustersFav(state, action) {
      state.favouriteCluster = action.payload;
    },

    setCloustersGroup(state, action) {
      state.clustersGroup = action.payload;
    },
  },
});

export const { setClusterData, setCloustersFav, setCloustersGroup } = clusterSlice.actions;

export default clusterSlice.reducer;
