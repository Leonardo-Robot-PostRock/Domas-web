import { useEffect, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';

import { useDataInitialization } from '@/hooks/form/useDataInitialization';
import { useFormData } from '@/hooks/form/useFormData';
import { useFormSubmit } from '@/hooks/form/useFormSubmit';

import { FilepondComponent } from '../../FilepondComponent/FilepondComponent';
import { FormField } from '@/components/formField/fields/FormField';
import { FormFieldLayout } from '@/components/formField/FormFieldLayout';
import { FormFieldTickets } from '@/components/formField/fields/FormFieldTickets';
import { SelectField } from '@/components/formField/fields/SelectField';
import { FormValidations } from '@/utils/TeamsFormUtils';
import { Label } from '@/components/label/Label';
import { SelectFieldCluster } from '../../formField/fields/SelectFieldCluster';
import { fetchCluster } from '@/lib/store/cluster/thunks';
import { toastError } from '@/components/toast';
import { SelectFieldMainCluster } from '@/components/formField/fields/SelectFieldMainCluster';

export const TeamsForm = (): ReactNode => {
  const dispatch = useAppDispatch();
  const { primaryFile, secondaryFile } = useAppSelector((state) => state.teams);
  const { supervisorsDataField, showSupervisorField } = useAppSelector((state) => state.supervisor);

  const teamEdit = useDataInitialization();
  const onSubmit = useFormSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useFormData(teamEdit);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  useEffect(() => {
    const fetchClusterData = async (): Promise<void> => {
      try {
        await dispatch(fetchCluster());
      } catch (error) {
        toastError('Ocurrió un error al cargar los cluster');
      }
    };
    void fetchClusterData();
  }, [dispatch]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px', width: '100%' }}
      onKeyDown={handleKeyDown}
    >
      <FormField errors={errors} label="Nombre" name="name" register={register} validation={FormValidations.REQUIRED} />

      <FormField
        errors={errors}
        label="Google Calender ID"
        name="google_calendar_id"
        register={register}
        validation={FormValidations.GOOGLE_CALENDAR_ID}
      />

      <FormField
        errors={errors}
        label="Usuario de mesa"
        name="mesa_username"
        register={register}
        validation={FormValidations.REQUIRED}
      />

      <FormFieldTickets
        errors={errors}
        label="Mínimo de tickets a realizar"
        name="min_tickets_to_do"
        register={register}
      />

      <FormFieldTickets
        errors={errors}
        label="Máximo de tickets a realizar (Solo para OMNICANALIDAD)"
        name="max_tickets_to_do_only_omnichannel"
        register={register}
      />

      {showSupervisorField && (
        <FormFieldLayout>
          <Label>Supervisor*</Label>
          <SelectField control={control} name="supervisor" options={supervisorsDataField} />
        </FormFieldLayout>
      )}

      <FormFieldLayout errors={errors.cluster} name="cluster">
        <Label>Cluster*</Label>
        <SelectFieldCluster control={control} errors={errors} />
      </FormFieldLayout>

      <FormFieldLayout>
        <Label>Grupo principal del cluster</Label>
        <SelectFieldMainCluster control={control} errors={errors} />
      </FormFieldLayout>

      <FilepondComponent file={primaryFile} title="Foto del lider" />
      <FilepondComponent file={secondaryFile} title="Foto del técnico asistente" />
    </form>
  );
};
