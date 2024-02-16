import { Button, ButtonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props extends ButtonProps {
  children: ReactNode;
}

export const ButtonComponent = ({ children, ...rest }: Props) => {
  return <Button {...rest}>{children}</Button>;
};
