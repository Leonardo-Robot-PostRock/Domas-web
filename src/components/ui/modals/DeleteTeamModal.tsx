import type { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react';

import { useModalContext } from '@/hooks/tableTeams/useModalContext';

import { toastSuccess } from '@/components/toast';
import type { Technician } from '@/types/api/teams';
import { deleteTeam } from '@/lib/store/teams/thunks';
import { CancelButton } from '@/components/buttons/CancelButton';
import { DeleteButton } from '@/components/buttons/DeleteButton';

export const DeleteTeamModal = (): ReactNode => {
  const dispatch = useAppDispatch();
  const teamEdit = useAppSelector((state) => state.teams.teamEdit);

  const { isOpenDelete, onCloseDelete } = useModalContext();

  const handleDeleteTeam = async (): Promise<void> => {
    if (teamEdit) {
      try {
        await dispatch(deleteTeam(teamEdit.id));
        void toastSuccess(`La cuadrilla ${teamEdit?.name} ha sido eliminada`);
      } catch (error) {
        // Manejar cualquier error que ocurra durante el dispatch
        console.error('Error al eliminar el equipo:', error);
      }
    }

    onCloseDelete();
  };

  return (
    <Modal isOpen={isOpenDelete} onClose={onCloseDelete} isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="#C53030A6" />
      <ModalContent>
        <ModalHeader textAlign="center">{`¿Eliminar cuadrilla ${teamEdit?.name}?`}</ModalHeader>
        <ModalBody textAlign="center">
          <Text>{`¿Estás seguro que quieres eliminar a la cuadrilla ${teamEdit?.name}?`}</Text>
          <Text fontWeight="bold">Esta acción no se puede deshacer.</Text>
          <Alert status="error" mt="20px" mb="10px" textAlign="start" rounded="lg">
            <AlertIcon />
            <AlertDescription fontWeight="bold">{`Esta acción provocara que ${teamEdit?.technicians
              .map((item: Technician) => item.name)
              .toString()
              .replace(',', ' y ')} se queden sin cuadrilla.`}</AlertDescription>
          </Alert>
        </ModalBody>

        <ModalFooter>
          <Flex justifyContent="center" w="full" gap={5}>
            <CancelButton title="Cancelar" onClose={onCloseDelete} />
            <DeleteButton title="Eliminar" onDelete={() => handleDeleteTeam} />
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
