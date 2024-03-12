import type { MouseEventHandler, ReactNode } from 'react';
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

import type { Technician } from '@/types/api/teams';
import { deleteTeam } from '@/lib/store/teams/thunks';
import { CancelButton } from '@/components/buttons/CancelButton';
import { DeleteButton } from '@/components/buttons/DeleteButton';

type FuncType = () => MouseEventHandler<HTMLButtonElement>;

export const DeleteTeamModal = (): ReactNode => {
  const dispatch = useAppDispatch();
  const teamEdit = useAppSelector((state) => state.teams.teamEdit);

  const { isOpenDelete, onCloseDelete } = useModalContext();

  const handleDeleteTeam = async (): Promise<void> => {
    if (teamEdit) {
      await dispatch(deleteTeam(teamEdit.id));
    }
    onCloseDelete();
  };

  return (
    <Modal isOpen={isOpenDelete} onClose={onCloseDelete} isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="#C53030A6" />
      <ModalContent>
        <ModalHeader textAlign="center">{`¿Eliminar cuadrilla ${teamEdit?.name}?`}</ModalHeader>
        <ModalBody textAlign="center">
          <Text>{`¿Estás seguro qué quieres eliminar la cuadrilla ${teamEdit?.name}?`}</Text>
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
            <DeleteButton title="Eliminar" onDelete={handleDeleteTeam as unknown as FuncType} />
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
