'use client';
import { Provider } from 'react-redux';
import { AppStore, store } from '..';
import { useRef } from 'react';

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = store();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
