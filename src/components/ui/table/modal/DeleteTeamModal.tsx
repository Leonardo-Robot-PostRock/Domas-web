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
  Text,
} from '@chakra-ui/react';

import { useModalContext } from '@/hooks/tableTeams/useModalContext';

import { ButtonComponent } from '@/components/buttons/ButtonComponent';
import { deleteTeam } from '@/lib/store/teams/thunks';
import { Technician } from '@/types/api/teamById';
import { toastSuccess } from '@/components/toast';

export const DeleteTeamModal = () => {
  const dispatch = useAppDispatch();
  const teamData = useAppSelector((state) => state.teams.teamData);

  const { isOpenDelete, onCloseDelete } = useModalContext();

  const handleDeleteTeam = () => {
    if (teamData) {
      dispatch(deleteTeam(teamData.id));
      toastSuccess(`La cuadrilla ${teamData?.name} ha sido eliminada`);
    }

    onCloseDelete();
  };

  return (
    <Modal isOpen={isOpenDelete} onClose={onCloseDelete} isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="#C53030A6" />
      <ModalContent>
        <ModalHeader textAlign="center">{`¿Eliminar cuadrilla ${teamData?.name}?`}</ModalHeader>
        <ModalBody textAlign="center">
          <Text>{`¿Estás seguro de que queres eliminar a la cuadrilla ${teamData?.name}?`}</Text>
          <Text fontWeight={'bold'}>Esta acción no se puede deshacer.</Text>
          <Alert status="error" mt={'20px'} mb="10px" textAlign="start" rounded="lg">
            <AlertIcon />
            <AlertDescription fontWeight="bold">{`Esta acción provocara que ${teamData?.technicians
              .map((item: Technician) => item.name)
              .toString()
              .replace(',', ' y ')} se queden sin cuadrilla.`}</AlertDescription>
          </Alert>
        </ModalBody>

        <ModalFooter>
          <Flex justifyContent="center" w="full" gap={5}>
            <ButtonComponent variant="ghost" onClick={onCloseDelete} w="150px">
              Cancelar
            </ButtonComponent>
            <ButtonComponent colorScheme="red" onClick={handleDeleteTeam} w="150px">
              Eliminar
            </ButtonComponent>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
