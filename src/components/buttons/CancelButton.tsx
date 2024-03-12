import type { ReactNode } from 'react';
import { ChakraButton } from './ChakraButton';

export const CancelButton = ({ title, onClose }: { title: string; onClose: () => void }): ReactNode => {
  return (
    <ChakraButton
      _hover={{ bg: '#EEEEEE', color: 'rgb(130, 170, 227)' }}
      bg={'tranparent'}
      border={'1px solid rgb(130, 170, 227)'}
      colorScheme="ghost"
      color={'rgb(130, 170, 270)'}
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
