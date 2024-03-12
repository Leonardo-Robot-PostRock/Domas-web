import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Slices
import areaSlice from './store/area/areaSlice';
import clusterSlice from './store/cluster/clusterSlice';
import supervisorSlice from './store/supervisor/supervisorSlice';
import teamsSlice from './store/teams/teamsSlice';
import teamsTableSlice from './store/teamsTable/teamsTableSlice';
import techniciansSlice from './store/technicians/techniciansSlice';

export const store = configureStore({
  reducer: {
    area: areaSlice,
    cluster: clusterSlice,
    supervisor: supervisorSlice,
    teams: teamsSlice,
    teamsTable: teamsTableSlice,
    technicians: techniciansSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
