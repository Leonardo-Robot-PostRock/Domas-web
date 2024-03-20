import type { FormDataItem, GenerateFormDataFunction } from '@/types/Form/generateFormData';
import { FormValidations } from '@/utils/formTeams';

export const useFormFileField = ({
  primaryFile,
  setPrimaryFile,
  secondaryFile,
  setSecondaryFile
}: GenerateFormDataFunction): FormDataItem[] => {
  return [
    {
      file: primaryFile,
      label: 'Lider*',
      name: 'leader',
      setFile: setPrimaryFile,
      title: 'Foto del lider',
      validation: FormValidations.LIDER_REQUIRED
    },
    {
      label: 'Auxiliar*',
      title: 'Foto del técnico asistente',
      name: 'assistant',
      file: secondaryFile,
      setFile: setSecondaryFile,
      validation: FormValidations.ASSISTANT_REQUIRED
    }
  ];
};
