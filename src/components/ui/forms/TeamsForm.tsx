import { useEffect, type ReactNode, useState } from 'react';
import { useAppSelector } from '@/lib';
import { Flex, Text } from '@chakra-ui/react';

import { useFetchFormData, useFormData, useFormSubmit, useFormFileField, useFormFieldsSelect } from '@/hooks/form/';
import { useModalContext } from '@/hooks/tableTeams/useModalContext';

import { FilepondComponent } from '@/components/FilepondComponent/FilepondComponent';
import {
  FormField,
  FormFieldTickets,
  CheckboxMainCluster,
  FormFieldStartingPoint,
  FormFieldLayout,
  SelectField,
  SelectFieldCluster,
  SelectFieldTech
} from '@/components/formField/';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import { BackButton } from '@/components/buttons/BackButton';
import { genericFormFields, ticketFormFields } from '@/utils/formTeams/';
import type { FilePondFile } from 'filepond';
import {} from '@/components/formField/fields/SelectFieldTech';

export const TeamsForm = (): ReactNode => {
  const { technicianDataField } = useAppSelector((state) => state.technicians);
  const teamEdit = useAppSelector((state) => state.teams.teamEdit);

  const [primaryFile, setPrimaryFile] = useState<FilePondFile[]>([]);
  const [secondaryFile, setSecondaryFile] = useState<FilePondFile[]>([]);

  const formFileField = useFormFileField({ primaryFile, setPrimaryFile, secondaryFile, setSecondaryFile });
  const formFieldsSelect = useFormFieldsSelect();

  const { fetchData } = useFetchFormData();
  const { onClose } = useModalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useFormData(teamEdit);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onSubmit = useFormSubmit({ primaryFile, secondaryFile });

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
      {formFieldsSelect.map(
        (field) =>
          field.showCondition && (
            <FormFieldLayout errors={errors} name={field.name} key={field.id}>
              <Text mb="10px">{field.label}</Text>
              <SelectField
                key={field.id}
                isMulti={field.isMulti}
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
      <FormFieldLayout errors={errors} name="cluster">
        <Text mb="10px">Cluster*</Text>
        <SelectFieldCluster control={control} errors={errors} />
      </FormFieldLayout>
      <FormFieldLayout>
        <Text mb="10px">Grupo principal del cluster</Text>
        <CheckboxMainCluster control={control} errors={errors} />
      </FormFieldLayout>
      <FormFieldStartingPoint errors={errors} name="starting_point" register={register} />
      {formFileField.map((data) => (
        <FormFieldLayout errors={errors} name={data.name} key={data.title}>
          <Text mb="10px">{data.label}</Text>
          <SelectFieldTech
            key={data.name}
            control={control}
            name={data.name}
            options={technicianDataField}
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
