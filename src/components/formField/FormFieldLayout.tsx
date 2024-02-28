import { FormControl } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormFieldLayoutProps {
  children: ReactNode;
  errors?: Record<string, FieldError> | undefined;
  name?: string;
}

export const FormFieldLayout = ({ children, errors, name }: FormFieldLayoutProps): ReactNode => {
  // Check if errors and name are defined
  const isInvalid = errors && name && errors[name] !== undefined;
  return <FormControl isInvalid={isInvalid ? true : undefined}>{children}</FormControl>;
};
