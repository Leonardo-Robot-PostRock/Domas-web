import { RootState } from '@/lib';
import { UnknownAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

export type AsyncThunkAction = ThunkAction<void, RootState, unknown, UnknownAction>;
