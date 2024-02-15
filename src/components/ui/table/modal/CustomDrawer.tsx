import { useAppSelector } from '@/store';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';

import { ChangeEvent } from 'react';

interface Props {
  handleCancel: () => void;
  handleEdit: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
}

export const CustomDrawer = ({ handleCancel, handleEdit, handleSave }: Props) => {
  const drawerId = useAppSelector((state) => state.squadTable.drawerId);
  const edited = useAppSelector((state) => state.squadTable.edited);

  const data = useAppSelector((state) => state.squadTable.data);

  return (
    <Drawer isOpen={drawerId ? true : false} onClose={handleCancel} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Editar cuadrilla</DrawerHeader>

        <DrawerBody></DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} backgroundColor="#82AAE3">
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
