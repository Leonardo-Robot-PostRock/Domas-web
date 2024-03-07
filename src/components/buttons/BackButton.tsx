import type { ReactNode } from 'react';
import { ChakraButton } from './ChakraButton';

export const BackButton = ({ title, onClose }: { title: string; onClose: () => void }): ReactNode => {
  return (
    <ChakraButton
      type="button"
      width="200px"
      fontWeight="medium"
      fontSize="14px"
      color="#868383"
      border={'1px solid #D7D5D5'}
      _hover={{ bg: '#EEEEEE' }}
      bg={'transparent'}
      rounded="xl"
      onClick={onClose}
    >
      {title}
    </ChakraButton>
  );
};
