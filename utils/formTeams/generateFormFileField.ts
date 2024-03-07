import type { FormDataItem, GenerateFormDataFunction } from '@/types/Form/generateFormData';

export const generateFormFileField = ({
  primaryFile,
  setPrimaryFile,
  secondaryFile,
  setSecondaryFile
}: GenerateFormDataFunction): FormDataItem[] => {
  return [
    { label: 'Lider*', title: 'Foto del lider', name: 'leader', file: primaryFile, setFile: setPrimaryFile },
    {
      label: 'Auxiliar*',
      title: 'Foto del técnico asistente',
      name: 'auxiliar',
      file: secondaryFile,
      setFile: setSecondaryFile
    }
  ];
};
