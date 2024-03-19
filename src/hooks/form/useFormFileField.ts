import { useAppSelector } from '@/lib';
import type { FormDataItem, GenerateFormDataFunction } from '@/types/Form/generateFormData';
import { FormValidations } from '@/utils/formTeams';

export const useFormFileField = ({
  primaryFile,
  setPrimaryFile,
  secondaryFile,
  setSecondaryFile
}: GenerateFormDataFunction): FormDataItem[] => {
  const selectedTechnicians = useAppSelector((state) => state.technicians.selectedTechnicians);

  return [
    {
      dataInit: selectedTechnicians.leader,
      file: primaryFile,
      label: 'Lider*',
      name: 'leader',
      setFile: setPrimaryFile,
      title: 'Foto del lider',
      validation: FormValidations.LIDER_REQUIRED
    },
    {
      dataInit: selectedTechnicians.assistant,
      label: 'Auxiliar*',
      title: 'Foto del técnico asistente',
      name: 'assistant',
      file: secondaryFile,
      setFile: setSecondaryFile,
      validation: FormValidations.ASSISTANT_REQUIRED
    }
  ];
};
