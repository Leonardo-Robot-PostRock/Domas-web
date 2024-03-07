import type { ReactNode } from 'react';
import { ChakraButton } from './ChakraButton';

export const DeleteButton = ({ title, onDelete }: { title: string; onDelete: () => void }): ReactNode => {
  return (
    <ChakraButton
      type="button"
      width="200px"
      fontWeight="medium"
      fontSize="14px"
      onClick={onDelete}
      color="red"
      border={'1px solid #D7D5D5'}
      _hover={{ bg: '#EEEEEE' }}
      bg={'transparent'}
      rounded="xl"
    >
      {title}
    </ChakraButton>
  );
};
