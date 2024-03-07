import type { TeamEdit } from '@/types/Form/teamEdit';
import { getDefaultValues } from '@/utils/formTeams/formDefaultValues';
import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';

export const useFormData = (teamEdit: TeamEdit | null | undefined): FieldValues => {
  return useForm({
    defaultValues: teamEdit ? getDefaultValues(teamEdit) : {}
  });
};
