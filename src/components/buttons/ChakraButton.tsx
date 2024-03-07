import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '@chakra-ui/react';

interface Props extends ButtonProps {
  children: ReactNode;
}

export const ChakraButton = ({ children, ...rest }: Props): ReactNode => {
  return <Button {...rest}>{children}</Button>;
};
