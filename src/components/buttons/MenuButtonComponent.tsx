import { useAppDispatch } from '@/lib';
import { setSquadData } from '@/lib/store/teams/teamsReducer';

import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { GiFountainPen } from 'react-icons/gi';

import { useModalContext } from '@/context/ModalContext';
import { TeamEdit } from '@/types/Form/teamEdit';

export const MenuButtonComponent = ({ item }: TeamEdit) => {
  const dispatch = useAppDispatch();

  const { onOpen, onOpenDelete } = useModalContext();

  return (
    <Menu>
      <MenuButton
        aria-label="Options"
        as={IconButton}
        icon={<GiFountainPen size={15} color="863A6F" />}
        size="xs"
        padding={2}
        variant="ghost"
        colorScheme="#4a5568"
        _hover={{ backgroundColor: '#82AAE3' }}
      ></MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            onOpen();
            dispatch(setSquadData(item));
          }}
        >
          <EditIcon />
          Editar
        </MenuItem>
        <MenuItem onClick={() => onOpenDelete()}>
          <DeleteIcon />
          Eliminar
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
