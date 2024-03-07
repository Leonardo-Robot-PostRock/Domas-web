'use client';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '.';

export const Providers = ({ children }: { children: ReactNode }): ReactNode => {
  return <Provider store={store}>{children}</Provider>;
};
