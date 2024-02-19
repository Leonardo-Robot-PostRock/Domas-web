import {
  Box,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { useModalContext } from '@/hooks/tableTeams/useModalContext';
import { ModalFormProps } from '@/types/modals/modalForm';

export const ModalForm = ({ title, icon, description, bodyContent }: ModalFormProps) => {
  const { isOpen, onClose } = useModalContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        sx={{ '.chakra-modal__close-btn': { marginTop: '10px', border: '1px solid #E1E0E0', borderRadius: '30px' } }}
        margin={'1.5vh'}
        maxH={'90vh'}
      >
        <ModalHeader pb={4} boxShadow={'1px 8px 33px -5px rgba(0,0,0,0.10)'}>
          <Flex gap={3} alignItems={'center'}>
            <Box p={2} rounded={'3xl'}>
              {icon}
            </Box>
            {title}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY={'auto'} maxHeight={'100vh'} mt={5} m={0}>
          <Text mb={4} mt={2} fontSize={'12px'} color={'#868383'} fontWeight={'medium'}>
            {description}
          </Text>
          <Divider />
          {bodyContent}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
