import type { Inputs } from '@/types/Form/inputs';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { UseFormRegister } from 'react-hook-form';

interface Props {
  register: UseFormRegister<Inputs>;
  errors: any;
  warning: string;
  title: string;
  type: string;
  id: keyof Inputs;
}

export const InputComponent = ({ register, errors, warning, title, type, id }: Props): ReactNode => (
  <FormControl id={id} isInvalid={!!errors}>
    <FormLabel>{title}</FormLabel>
    <Input type={type} {...register(id, { required: true })} autoComplete="on" />
    {errors.password && <FormErrorMessage>{warning}</FormErrorMessage>}
  </FormControl>
);
