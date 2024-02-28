import type { ReactNode } from 'react';

import { FormControl, Input } from '@chakra-ui/react';

import type { FormFieldProps } from '@/types/Form/FormFieldProps';
import { Label } from '@/components/label/Label';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { FormValidations } from '@/utils/TeamsFormUtils';

export const FormField = ({ label, name, register, errors, validation, ...rest }: FormFieldProps): ReactNode => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <Label label={label} />
      <Input type="text" {...register(name, { required: validation })} {...rest} variant="flushed" />
      <ErrorDisplay errors={errors[name]} message={FormValidations.REQUIRED} />
    </FormControl>
  );
};
