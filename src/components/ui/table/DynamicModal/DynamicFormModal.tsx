import type { ReactNode } from 'react';
import { useAppSelector } from '@/lib';

import { AiOutlineCar } from 'react-icons/ai';

import { ModalForm } from '../../modals/ModalForm';
import { TeamsForm } from '../../forms/TeamsForm';

// This dynamic form modal is used to edit and to add a Team

export const DynamicFormModal = (): ReactNode => {
  const teamEdit = useAppSelector((state) => state.teams.teamEdit);

  return (
    <ModalForm
      icon={<AiOutlineCar />}
      title={teamEdit ? `Editar cuadrilla ${teamEdit.name}` : 'Crear una cuadrilla'}
      bodyContent={<TeamsForm />}
    />
  );
};
