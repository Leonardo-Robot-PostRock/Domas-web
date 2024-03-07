import Select from 'react-select';
import type { ReactNode } from 'react';
import { type Control, Controller } from 'react-hook-form';
import type { FormData } from '@/types/Form/teamEdit';
import type { FieldData } from '@/types/Form/FormFieldProps';

interface SelectFieldProps {
  control: Control<FormData>;
  name: string;
  options: FieldData | FieldData[] | undefined;
  defaultValue?: FieldData | FieldData[];
  onChange?: (e: FieldData[]) => any;
  isClearable?: boolean;
  isMulti?: boolean;
  rule: boolean;
}

export const SelectField = ({
  control,
  name,
  options,
  defaultValue,
  onChange,
  isClearable,
  isMulti,
  rule
}: SelectFieldProps): ReactNode => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          {...field}
          defaultValue={defaultValue}
          isClearable={isClearable}
          isMulti={isMulti}
          isSearchable={true}
          onChange={onChange}
          options={options as any}
          placeholder={'Seleccionar...'}
        />
      )}
      rules={{ required: rule }}
    />
  );
};
