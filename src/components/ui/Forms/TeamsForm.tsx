import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';

import { useForm } from 'react-hook-form';

import { getDefaultValues } from '@/utils/formDefaultValues';

import { EditProps } from '@/types/Form/teamEdit';
import { setShowSupervisorField, setSupervisorsDataField, setTechnicianDataField } from '@/store/teams/teamsReducer';
import { handleCheckbox, handleClusters, handleOnSubmit } from '@/utils/teamsForm';
import { toastError } from '@/components/toast/toastError';
import axios from 'axios';

export const TeamsForm = ({ edit }: EditProps) => {
  const dispatch = useAppDispatch();
  const showSupervisorField = useAppSelector((state) => state.teams.showSupervisorField);

  const submitUrl = edit ? `/api/teams/${edit.id}` : `/api/teams/new`;
  const submitMethod = edit ? `patch` : 'post';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaultValues(edit),
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user') as string);

    dispatch(setShowSupervisorField(userInfo.roles.some((item) => item.name.toUpperCase() === 'ADMINISTRADOR')));
  });

  useEffect(() => {
    if (showSupervisorField) {
      axios
        .get('/api/supervisor/all')
        .then((res) => {
          const supervisors = res.data.users;

          setSupervisorsDataField(supervisors.map((item) => ({ value: item.id, label: item.name })));
        })
        .catch(() => toastError('Ocurrió un error al obtener los supervisores'));
    }

    axios
      .get('/api/technician/all')
      .then((res) => {
        const technicians = res.data.users;

        const updateTechnicianData = technicians.map((item) => {
          let team = dataTeams.find((team) => team.technicians.some((tech) => tech.id == item.id));

          return { value: item.id, label: `${item.name} - ${team?.name || 'libre'}` };
        });
        dispatch(setTechnicianDataField(updateTechnicianData));
      })
      .catch((err) => toastError('Ocurrió un error al obtener los técnicos'));
  }, [showSupervisorField]);

  return <div>TeamsForm</div>;
};
