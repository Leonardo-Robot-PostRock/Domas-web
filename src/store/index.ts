import { configureStore } from '@reduxjs/toolkit';
import teamsReducer from './teams/teamsReducer';
import formReducer from './formData/formReducer';

export const store = configureStore({
  reducer: {
    teams: teamsReducer,
    form: formReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
