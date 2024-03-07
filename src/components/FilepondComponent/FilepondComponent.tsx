import { FormControl, Text } from '@chakra-ui/react';

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
  setFile: (files: FilePondFile[]) => void;
  title: string;
}

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode);

export const FilepondComponent = ({ file, title, setFile }: FilepondComponentProps): ReactNode => {
  const initialFiles: FilePondInitialFile[] = file.map((file: FilePondFile) => ({
    source: file.file.name, // file name selected
    options: {
      type: 'local',
      file: file.file
    }
  }));

  return (
    <FormControl>
      <Text my="10px">{title}</Text>
      <FilePond
        key={title}
        files={initialFiles}
        onupdatefiles={setFile}
        allowMultiple={false}
        maxFiles={1}
        name="files"
        labelIdle='Arrastra y suelta tus archivos o <span class="filepond--label-action">Examinar</span>'
        credits={false}
      />
    </FormControl>
  );
};
