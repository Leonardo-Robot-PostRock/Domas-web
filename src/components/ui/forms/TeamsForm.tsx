import { useEffect, type ReactNode, useState } from 'react';
import { useAppSelector } from '@/lib';
import { Flex, Text } from '@chakra-ui/react';

import {
  useDataInitialization,
  useFetchFormData,
  useFormData,
  useFormSubmit,
  useFormFileField,
  useFormFieldsSelect
} from '@/hooks/form/';
import { useModalContext } from '@/hooks/tableTeams/useModalContext';

import { FilepondComponent } from '@/components/FilepondComponent/FilepondComponent';
import {
  FormField,
  FormFieldTickets,
  SelectField,
  SelectFieldCluster,
  CheckboxMainCluster,
  FormFieldStartingPoint,
  FormFieldLayout
} from '@/components/formField/';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import { BackButton } from '@/components/buttons/BackButton';
import { genericFormFields, ticketFormFields } from '@/utils/formTeams/';
import type { FilePondFile } from 'filepond';

export const TeamsForm = (): ReactNode => {
  const { technicianDataField } = useAppSelector((state) => state.technicians);
  // useState for handle images files
  const [primaryFile, setPrimaryFile] = useState<FilePondFile[]>([]);
  const [secondaryFile, setSecondaryFile] = useState<FilePondFile[]>([]);
  // Array for files field
  const formFileField = useFormFileField({ primaryFile, setPrimaryFile, secondaryFile, setSecondaryFile });
  const formFieldsSelect = useFormFieldsSelect();
  // Custom hooks to manage method onSubmit, todo fetch to the api/teams, initialize data and to handle the modal form.
  const teamEdit = useDataInitialization();
  const { fetchData } = useFetchFormData();
  const { onClose } = useModalContext();
  const onSubmit = useFormSubmit(primaryFile, secondaryFile);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useFormData(teamEdit);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px', width: '100%' }}
      onKeyDown={handleKeyDown}
    >
      {/* ---- team name, google calendar and mesa username fields  ---- */}
      {genericFormFields.map((field) => (
        <FormField
          errors={errors}
          key={field.id}
          id={field.id}
          label={field.label}
          name={field.name}
          register={register}
          validation={field.validation}
        />
      ))}
      {/* ---- Tickets form fields ---- */}
      {ticketFormFields.map((field) => (
        <FormFieldTickets
          key={field.id}
          id={field.id}
          errors={errors}
          label={field.label}
          name={field.name}
          register={register}
        />
      ))}
      {/* ---- Supervisor and Area fields ---- */}
      {formFieldsSelect.map(
        (field) =>
          field.showCondition && (
            <FormFieldLayout errors={errors} name={field.name} key={field.id}>
              <Text mb="10px">{field.label}</Text>
              <SelectField
                key={field.id}
                control={control}
                errors={errors}
                name={field.name}
                options={field.options}
                dataInit={field.dataInit}
                rule={true}
                dispatchAction={field.dispatchAction}
                validation={field.validation}
              />
            </FormFieldLayout>
          )
      )}
      {/* ---- Cluster field ---- */}
      <FormFieldLayout errors={errors} name="cluster">
        <Text mb="10px">Cluster*</Text>
        <SelectFieldCluster control={control} errors={errors} />
      </FormFieldLayout>
      {/* ---- Main cluster checkbox ---- */}
      <FormFieldLayout>
        <Text mb="10px">Grupo principal del cluster</Text>
        <CheckboxMainCluster control={control} errors={errors} />
      </FormFieldLayout>
      {/* ---- Starting point field ---- */}
      <FormFieldStartingPoint errors={errors} name="starting_point" register={register} />
      {/* ---- Select leader, assistant fields and upload photos with FilePond ---- */}
      {formFileField.map((data) => (
        <FormFieldLayout errors={errors} name={data.name} key={data.title}>
          <Text mb="10px">{data.label}</Text>
          <SelectField
            key={data.name}
            control={control}
            name={data.name}
            options={technicianDataField}
            rule={true}
            errors={errors}
            validation={data.validation}
          />
          <FilepondComponent file={data.file} title={data.title} setFile={data.setFile} />
        </FormFieldLayout>
      ))}
      <Flex justifyContent="center" gap={4}>
        <BackButton onClose={onClose} title="Volver" />
        <SubmitButton title={teamEdit ? 'Actualizar cuadrilla' : 'Crear nueva cuadrilla'} />
      </Flex>
    </form>
  );
};
