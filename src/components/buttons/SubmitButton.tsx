import type { ReactNode } from 'react';
import { ChakraButton } from './ChakraButton';

export const SubmitButton = ({ title }: { title: string }): ReactNode => {
  return (
    <ChakraButton
      type="submit"
      width="200px"
      fontWeight="medium"
      fontSize="14px"
      color="white"
      border={'1px solid #D7D5D5'}
      _hover={{ bg: '#EEEEEE', color: '#4361ee' }}
      bg="#4361ee"
      rounded="xl"
    >
      {title}
    </ChakraButton>
  );
};
