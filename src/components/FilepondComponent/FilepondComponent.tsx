import { useAppDispatch } from '@/lib';
import { setPrimaryFile } from '@/lib/store/teams/teamsSlice';

import { FormControl, FormLabel } from '@chakra-ui/react';

// css filepond library
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// filepond library for more information read the documentation
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

import type { ReactNode } from 'react';
import type { FilePondFile, FilePondInitialFile } from 'filepond';

interface FilepondComponentProps {
  file: FilePondFile[];
  title: string;
}

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode);

export const FilepondComponent = ({ file, title }: FilepondComponentProps): ReactNode => {
  const dispatch = useAppDispatch();

  const initialFiles: FilePondInitialFile[] = file.map((file: FilePondFile) => ({
    source: file.file.name, // file name selected
    options: {
      type: 'local' // locally avalaible file
    }
  }));

  const handleUpdateFiles = (files: FilePondFile[]): void => {
    dispatch(setPrimaryFile(files));
  };
  return (
    <FormControl>
      <FormLabel>{title}</FormLabel>
      <FilePond
        files={initialFiles}
        onupdatefiles={handleUpdateFiles}
        allowMultiple={false}
        maxFiles={1}
        name="files"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        credits={false}
      />
    </FormControl>
  );
};
