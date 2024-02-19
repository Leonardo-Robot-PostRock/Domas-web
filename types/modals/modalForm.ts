import { ReactNode } from 'react';

export interface ModalFormProps {
  title: string;
  icon: ReactNode;
  description: string;
  bodyContent: ReactNode;
}
