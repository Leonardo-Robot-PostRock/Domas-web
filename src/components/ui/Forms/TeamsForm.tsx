import { useEffect, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';
import { setAreaGroup } from '@/lib/store/area/areaSlice';

import { useDataInitialization } from '@/hooks/form/useDataInitialization';
import { useFormData } from '@/hooks/form/useFormData';
import { useFetchFormData } from '@/hooks/form/useFetchFormData';
import { useFormSubmit } from '@/hooks/form/useFormSubmit';

import { FilepondComponent } from '../../FilepondComponent/FilepondComponent';
import { FormField } from '@/components/formField/fields/FormField';
import { FormFieldLayout } from '@/components/formField/FormFieldLayout';
import { FormFieldTickets } from '@/components/formField/fields/FormFieldTickets';
import { SelectField } from '@/components/formField/fields/SelectField';
import { FormValidations } from '@/utils/TeamsFormUtils';
import { Label } from '@/components/label/Label';
import { SelectFieldCluster } from '../../formField/fields/SelectFieldCluster';
import { SelectFieldMainCluster } from '@/components/formField/fields/SelectFieldMainCluster';

export const TeamsForm = (): ReactNode => {
  const dispatch = useAppDispatch();
  const { area, areaGroup } = useAppSelector((state) => state.area);
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

  const { fetchData } = useFetchFormData();

  useEffect(() => {
    void fetchData();
  }, [dispatch, fetchData]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px', width: '100%' }}
      onKeyDown={handleKeyDown}
    >
      {/* Cuadrilla name */}
      <FormField errors={errors} label="Nombre" name="name" register={register} validation={FormValidations.REQUIRED} />
      {/* id google calendar */}
      <FormField
        errors={errors}
        label="Google Calender ID"
        name="google_calendar_id"
        register={register}
        validation={FormValidations.GOOGLE_CALENDAR_ID}
      />
      {/* Mesa username */}
      <FormField
        errors={errors}
        label="Usuario de mesa"
        name="mesa_username"
        register={register}
        validation={FormValidations.REQUIRED}
      />
      {/* Tickets form fields */}
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
      {/* Supervisor field */}
      {showSupervisorField && (
        <FormFieldLayout>
          <Label>Supervisor*</Label>
          <SelectField control={control} name="supervisor" options={supervisorsDataField} rule={true} />
        </FormFieldLayout>
      )}
      {/* Cluster field */}
      <FormFieldLayout errors={errors} name="cluster">
        <Label>Cluster*</Label>
        <SelectFieldCluster control={control} errors={errors} />
      </FormFieldLayout>
      {/* Main cluster checkbox */}
      <FormFieldLayout>
        <Label>Grupo principal del cluster</Label>
        <SelectFieldMainCluster control={control} errors={errors} />
      </FormFieldLayout>
      {/* Area field */}
      <FormFieldLayout errors={errors} name="area">
        <Label>Area*</Label>
        <SelectField
          control={control}
          name="area"
          options={area}
          defaultValue={areaGroup}
          onChange={(e) => setAreaGroup(e)}
          rule={!(areaGroup.length > 0)}
        />
      </FormFieldLayout>
      {/* Upload photos */}
      <FilepondComponent file={primaryFile} title="Foto del lider" />
      <FilepondComponent file={secondaryFile} title="Foto del técnico asistente" />
    </form>
  );
};
