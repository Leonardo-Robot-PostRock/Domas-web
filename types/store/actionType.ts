import type { RootState } from '@/lib';
import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';

export type AsyncThunkAction = ThunkAction<Promise<void>, RootState, unknown, UnknownAction>;
