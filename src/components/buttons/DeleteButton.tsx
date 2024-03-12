import type { MouseEventHandler, ReactNode } from 'react';
import { ChakraButton } from './ChakraButton';

export const DeleteButton = ({
  title,
  onDelete
}: {
  title: string;
  onDelete: () => MouseEventHandler<HTMLButtonElement>;
}): ReactNode => {
  return (
    <ChakraButton
      type="submit"
      width="200px"
      fontWeight="medium"
      fontSize="14px"
      onClick={onDelete}
      color="white"
      border={'1px solid #D7D5D5'}
      _hover={{ bg: '#EEEEEE', color: 'red' }}
      bg={'red'}
      rounded="xl"
    >
      {title}
    </ChakraButton>
  );
};
