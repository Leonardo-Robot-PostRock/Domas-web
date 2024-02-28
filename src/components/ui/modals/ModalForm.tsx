import { useEffect, type ReactNode } from 'react';
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react';

import { useModalContext } from '@/hooks/tableTeams/useModalContext';
import type { ModalFormProps } from '@/types/modals/modalForm';
import { useAppDispatch } from '@/lib';
import { setCloustersGroup } from '@/lib/store/cluster/clusterSlice';

export const ModalForm = ({ title, icon, bodyContent }: ModalFormProps): ReactNode => {
  const dispatch = useAppDispatch();

  const { isOpen, onClose } = useModalContext();

  // clear cloustersGroup when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      const clearCloustersGroup = (): void => {
        dispatch(setCloustersGroup([]));
      };
      clearCloustersGroup();
    }
  }, [dispatch, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        sx={{ '.chakra-modal__close-btn': { marginTop: '10px', border: '1px solid #E1E0E0', borderRadius: '30px' } }}
        maxH="95vh"
        mx={2}
        maxW={{ base: '400px', md: '500px', lg: '600px' }}
      >
        <ModalHeader pb={4} boxShadow="1px 8px 33px -5px rgba(0,0,0,0.10)">
          <Flex gap={3} alignItems="center">
            <Box p={2} rounded="3xl">
              {icon}
            </Box>
            {title}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" maxHeight="100vh" p={{ base: 4, md: 10 }}>
          <Text mb={4} fontSize="14px" color="#868383" fontWeight="medium">
            Los campos marcados con asteriscos (*) son obligatorios.
          </Text>
          {bodyContent}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
