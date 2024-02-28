import { ModalContext } from '@/context/ModalContext';
import { useContext } from 'react';
import type { ModalContextType } from '@/types/context/ModalContextType';

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
