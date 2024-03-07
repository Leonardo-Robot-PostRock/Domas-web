import type { ReactNode } from 'react';
import type { UseFormRegister } from 'react-hook-form';

import { Stack } from '@chakra-ui/react';

import { InputComponent } from '@/components/inputs/Input';
import { LoginButton } from '@/components/buttons/LoginButton';

import type { Inputs } from '@/types/Form/inputs';

interface Props {
  onSubmit: () => void;
  isLoading: boolean;
  register: UseFormRegister<Inputs>;
  errors: any;
}

export const AuthForm = ({ onSubmit, isLoading, errors, register }: Props): ReactNode => {
  return (
    <Stack spacing={4}>
      <InputComponent
        register={register}
        errors={!!errors.username}
        warning="El usuario es obligatorio."
        title="Usuario"
        type="text"
        id="username"
      />
      <InputComponent
        register={register}
        errors={!!errors.password}
        warning="La contraseña es obligatoria"
        title="Contraseña"
        type="password"
        id="password"
      />
      <LoginButton onSubmit={onSubmit} isLoading={isLoading} />
    </Stack>
  );
};
