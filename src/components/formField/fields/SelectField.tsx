import Select, { type GroupBase, type OptionsOrGroups } from 'react-select';
import type { ReactNode } from 'react';
import { type Control, Controller } from 'react-hook-form';
import type { FormData } from '@/types/Form/teamEdit';

interface SelectFieldProps {
  control: Control<FormData>;
  name: string;
  options: OptionsOrGroups<any, GroupBase<any>> | undefined;
}

export const SelectField = ({ control, name, options, ...rest }: SelectFieldProps): ReactNode => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <Select {...field} isSearchable={true} options={options} placeholder={'Seleccionar...'} />}
      {...rest}
      rules={{ required: true }}
    />
  );
};
