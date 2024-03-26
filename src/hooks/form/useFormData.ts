import type { TeamEdit } from '@/types/Form/teamEdit';
import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useDefaultValues } from './useDefaultValues';

export const useFormData = (teamEdit: TeamEdit | null | undefined): FieldValues => {
  const defaultFormValues = useDefaultValues(teamEdit);

  return useForm({
    defaultValues: teamEdit ? defaultFormValues : {}
  });
};
