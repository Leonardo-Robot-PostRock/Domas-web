import { useAppSelector } from '@/lib';

import { AiOutlineCar } from 'react-icons/ai';

import { ModalForm } from '../../modals/ModalForm';
import { TeamsForm } from '../../Forms/TeamsForm';

export const TeamFormModal = () => {
  const teamData = useAppSelector((state) => state.teams.teamData);

  return (
    <ModalForm
      icon={<AiOutlineCar />}
      title={teamData ? `Editar cuadrilla ${teamData.name}` : 'Nueva cuadrilla'}
      description={'Los campos marcados con asteriscos (*) son obligatorios.'}
      bodyContent={<TeamsForm />}
    />
  );
};
