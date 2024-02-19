import { useAppDispatch } from '@/lib';
import { setTeamData } from '@/lib/store/teams/teamsSlice';

import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { GiFountainPen } from 'react-icons/gi';

import { useModalContext } from '@/hooks/tableTeams/useModalContext';

import { ItemTeam } from '@/types/Form/teamEdit';

export const MenuButtonComponent = ({ item }: ItemTeam) => {
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
      <MenuList fontSize={12} p={2}>
        <MenuItem
          _hover={{ backgroundColor: 'blue.500', color: 'white' }}
          gap={2}
          h={10}
          alignItems="center"
          onClick={() => {
            onOpen();
            dispatch(setTeamData(item));
          }}
        >
          <EditIcon />
          Editar
        </MenuItem>
        <MenuItem
          _hover={{ backgroundColor: 'red', color: 'white' }}
          gap={2}
          h={10}
          onClick={() => {
            onOpenDelete();
            dispatch(setTeamData(item));
          }}
        >
          <DeleteIcon />
          Eliminar
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
