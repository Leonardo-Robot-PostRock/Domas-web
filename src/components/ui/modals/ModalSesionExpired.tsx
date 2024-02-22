import React, { type ReactNode } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SessionExpiredModal = ({ isOpen, onClose }: Props): ReactNode => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sesión Expirada</ModalHeader>
        <ModalBody>Tu sesión ha expirado. Por favor, vuelve a iniciar sesión para continuar.</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="ghost">Iniciar Sesión</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SessionExpiredModal;
