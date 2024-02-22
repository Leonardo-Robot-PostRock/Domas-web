import { useAppSelector } from '@/lib';

import { FilepondComponent } from '../../FilepondComponent/FilepondComponent';

import { useDataInitialization } from '@/hooks/useDataInitialization';
import { useFormData } from '@/hooks/useFormData';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export const TeamsForm = (): ReactNode => {
  const teamEdit = useDataInitialization();
  const primaryFile = useAppSelector((state) => state.teams.primaryFile);
  const secondaryFile = useAppSelector((state) => state.teams.secondaryFile);

  const {
    handleSubmit,
    formState: { errors },
    control
  } = useFormData(teamEdit);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const onSubmit = useFormSubmit();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh', marginTop: '2vh' }}
      onKeyDown={handleKeyDown}
    >
      <Text>Datos de la cuadrilla</Text>

      <FilepondComponent file={primaryFile} title="Foto del Lider" />
      <FilepondComponent file={secondaryFile} title="Foto del Técnico asistente" />
    </form>
  );
};
