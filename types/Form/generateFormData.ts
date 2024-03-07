import type { FilePondFile } from 'filepond';

export interface FormDataItem {
  label: string;
  file: FilePondFile[];
  title: string;
  name: string;
  setFile: (file: FilePondFile[]) => void;
}

export interface GenerateFormDataFunction {
  primaryFile: FilePondFile[];
  setPrimaryFile: React.Dispatch<React.SetStateAction<FilePondFile[]>>;
  secondaryFile: FilePondFile[];
  setSecondaryFile: React.Dispatch<React.SetStateAction<FilePondFile[]>>;
}
