import type { ReactNode } from 'react';
import { ChakraButton } from './ChakraButton';

export const CancelButton = ({ title, onClose }: { title: string; onClose: () => void }): ReactNode => {
  return (
    <ChakraButton
      _hover={{ bg: '#EEEEEE' }}
      bg={'transparent'}
      border={'1px solid #D7D5D5'}
      colorScheme="ghost"
      fontSize="14px"
      fontWeight="medium"
      onClick={onClose}
      rounded="xl"
      type="button"
      width="200px"
    >
      {title}
    </ChakraButton>
  );
};
