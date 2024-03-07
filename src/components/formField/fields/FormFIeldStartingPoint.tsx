import type { ReactNode } from 'react';

import { FormControl, FormHelperText, Input, Link } from '@chakra-ui/react';

import type { FormFieldProps } from '@/types/Form/FormFieldProps';
import { Label } from '@/components/label/Label';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { FormValidations } from '@/utils/formTeams/TeamsFormUtils';

export const FormFieldStartingPoint = ({ id, label, name, register, errors }: FormFieldProps): ReactNode => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <Label id={id} label={label} />
      <Input
        id={id}
        type="text"
        placeholder="Ej: -34.603722, -58.381592"
        {...register('starting_point', {
          required: false,
          pattern: {
            value: /^-?\d{1,2}\.\d+,\s*-?\d{1,3}\.\d+$/,
            message: FormValidations.GEOLOCATION
          }
        })}
        variant="flushed"
      />
      <FormHelperText>
        La geolocalización puede ser extraida desde{' '}
        <Link href="https://www.google.com/maps/" isExternal={true} color={'#0568FF'}>
          Google Maps
        </Link>
        .
      </FormHelperText>
      <ErrorDisplay errors={errors[name]} message={errors.starting_point?.message} />
    </FormControl>
  );
};
