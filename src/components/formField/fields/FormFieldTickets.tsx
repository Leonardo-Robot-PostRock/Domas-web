import type { ReactNode } from 'react';

import { FormControl, FormHelperText, Input } from '@chakra-ui/react';

import { dynamicHelperText, dynamicLabel } from '@/utils/formTeams/TeamsFormUtils';

import type { FormFieldProps } from '@/types/Form/FormFieldProps';
import { LabelTooltip } from '@/components/tooltips/LabelTooltip';
import { Label } from '@/components/label/Label';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';

export const FormFieldTickets = ({ label, name, register, errors }: FormFieldProps): ReactNode => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <Label id={`tickets ${label}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {label}
        <LabelTooltip
          label={label === 'Mínimo de tickets a realizar' ? dynamicLabel.minTicketsTodo : dynamicLabel.maxTicketsTodo}
        />
      </Label>
      <Input
        id={`tickets ${label}`}
        autoComplete="off"
        type="text"
        {...register(name, { min: { value: 1, message: 'El valor mínimo es 1' } })}
        variant="flushed"
      />
      <ErrorDisplay errors={errors[name]} message={errors[name]?.message} />
      <FormHelperText>
        {label === 'Mínimo de tickets a realizar'
          ? dynamicHelperText.minTodoHelperText
          : dynamicHelperText.maxTodoHelperText}
      </FormHelperText>
    </FormControl>
  );
};
