import { ModalContextType } from '@/types/context/ModalContextType';
import { createContext } from 'react';

export const ModalContext = createContext<ModalContextType | undefined>(undefined);
