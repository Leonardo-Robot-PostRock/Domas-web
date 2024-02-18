import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import teamsReducer from './store/teams/teamsReducer';
import formReducer from './store/formData/formReducer';
import squadTableReducer from './store/squadTable/squadTableReducer';

export const store = () => {
  return configureStore({
    reducer: {
      teams: teamsReducer,
      squadTable: squadTableReducer,
      form: formReducer,
    },
  });
};

// Infer the type of store
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch'];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;