import type { TeamEdit } from '@/types/Form/teamEdit';
import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useFormDefaultValues } from './useFormDefaultValues';

export const useFormData = (teamEdit: TeamEdit | null | undefined): FieldValues => {
  const defaultFormValues = useFormDefaultValues(teamEdit);

  return useForm({
    defaultValues: teamEdit ? defaultFormValues : {}
  });
};
