import type { FilePondFile } from 'filepond';

export interface FormDataItem {
  label: string;
  file: FilePondFile[];
  title: string;
  name: string;
  setFile: (file: FilePondFile[]) => void;
  validation: string;
}

export interface GenerateFormDataFunction {
  primaryFile: FilePondFile[];
  setPrimaryFile: (files: FilePondFile[]) => void;
  secondaryFile: FilePondFile[];
  setSecondaryFile: (files: FilePondFile[]) => void;
}
