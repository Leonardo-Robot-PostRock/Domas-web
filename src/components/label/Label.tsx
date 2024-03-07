import { FormLabel } from '@chakra-ui/react';
import type { CSSProperties, ReactNode } from 'react';

interface LabelProps {
  id: string;
  label?: ReactNode | string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const Label = ({ id, children, label, style }: LabelProps): ReactNode => {
  return (
    <FormLabel htmlFor={id} style={style}>
      {label}
      {children}
    </FormLabel>
  );
};
