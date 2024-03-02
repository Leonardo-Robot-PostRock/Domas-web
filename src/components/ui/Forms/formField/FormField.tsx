import type { ReactNode } from 'react';

import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

import type { FieldError, Message, UseFormRegister, ValidationRule } from 'react-hook-form';
import type { FormData } from '@/types/Form/teamEdit';

interface FormFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<FormData>;
  errors: Record<string, FieldError>;
  validation?: Message | ValidationRule<boolean>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export const FormField = ({ label, name, register, errors, validation, ...rest }: FormFieldProps): ReactNode => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel>{label}</FormLabel>
      <Input type="text" {...register(name, { required: validation })} {...rest} />
      {errors[name] && <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>}
    </FormControl>
  );
};
