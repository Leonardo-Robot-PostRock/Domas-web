import type { FormDataItem } from '@/types/Form/generateFormData';
import type { FilePondFile } from 'filepond';

export const generateFormFileField = (
  primaryFile: FilePondFile[],
  setPrimaryFile: (files: FilePondFile[]) => void,
  secondaryFile: FilePondFile[],
  setSecondaryFile: (files: FilePondFile[]) => void
): FormDataItem[] => {
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
