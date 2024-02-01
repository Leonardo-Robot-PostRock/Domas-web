import { Inputs } from '@/types/Form/inputs';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';

interface Props {
  register: UseFormRegister<Inputs>;
  errors: any;
  warning: string;
  title: string;
  type: string;
  id: keyof Inputs;
}

export const InputComponent = ({ register, errors, warning, title, type, id }: Props) => (
  <FormControl id={id} isInvalid={!!errors}>
    <FormLabel>{title}</FormLabel>
    <Input type={type} {...register(id, { required: true })} />
    {errors.password && <FormErrorMessage>{warning}</FormErrorMessage>}
  </FormControl>
);
