import type { ReactNode } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { ModalContext } from './ModalContext';

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps): ReactNode => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const props = {
    isOpen,
    onOpen,
    onClose,
    isOpenDelete,
    onOpenDelete,
    onCloseDelete
  };

  return <ModalContext.Provider value={props}>{children}</ModalContext.Provider>;
};
