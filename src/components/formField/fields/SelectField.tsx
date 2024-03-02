import Select, { type GroupBase, type OptionsOrGroups } from 'react-select';
import type { ReactNode } from 'react';
import { type Control, Controller } from 'react-hook-form';
import type { FormData, SupervisorField } from '@/types/Form/teamEdit';
import type { AreaField } from '@/types/store/area';

interface SelectFieldProps {
  control: Control<FormData>;
  name: string;
  options: OptionsOrGroups<any, GroupBase<any>> | undefined;
  defaultValue?: SupervisorField[] | AreaField[];
  onChange?: (e: AreaField[]) => any;
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
          options={options}
          placeholder={'Seleccionar...'}
        />
      )}
      rules={{ required: rule }}
    />
  );
};
