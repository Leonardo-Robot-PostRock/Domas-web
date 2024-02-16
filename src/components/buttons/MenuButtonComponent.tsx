import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import { GiFountainPen } from 'react-icons/gi';

export const MenuButtonComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

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
        // onClick={() => dispatch(setSquadDrawerId(item.id))}
      >
        <MenuList>
          <MenuItem onClick={() => onOpen()}>
            <EditIcon />
            Editar
          </MenuItem>
          <MenuItem onClick={() => onOpenDelete()}>
            <DeleteIcon />
            Eliminar
          </MenuItem>
        </MenuList>
      </MenuButton>
    </Menu>
  );
};
