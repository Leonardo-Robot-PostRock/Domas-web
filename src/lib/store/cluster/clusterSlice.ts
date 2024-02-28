import { createSlice } from '@reduxjs/toolkit';
import type { ClusterData } from '@/types/store/cluster';

const initialState: ClusterData = {
  cluster: [
    {
      value: null,
      label: ''
    }
  ],
  clustersGroup: [],
  favouriteCluster: []
};

const clusterSlice = createSlice({
  name: 'cluster',
  initialState,
  reducers: {
    setCluster(state, action) {
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

export const { setCluster, setFavouriteClousters, setCloustersGroup } = clusterSlice.actions;

export default clusterSlice.reducer;
