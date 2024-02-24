import { FormLabel } from '@chakra-ui/react';
import type { CSSProperties, ReactNode } from 'react';

interface LabelProps {
  label?: ReactNode | string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const Label = ({ children, label, style }: LabelProps): ReactNode => {
  return (
    <FormLabel style={style}>
      {label}
      {children}
    </FormLabel>
  );
};
