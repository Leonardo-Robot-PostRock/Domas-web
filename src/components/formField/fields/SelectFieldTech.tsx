import Select from 'react-select';
import type { ReactNode } from 'react';
import { type Control, Controller, type FieldError } from 'react-hook-form';
import type { FormData } from '@/types/Form/teamEdit';
import type { FieldData } from '@/types/Form/FormFieldProps';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { useAppDispatch, useAppSelector } from '@/lib';
import { setSelectedTechnician } from '@/lib/store/technicians/techniciansSlice';

interface SelectFieldProps {
  control: Control<FormData>;
  dataInit?: FieldData[] | null | undefined | FieldData;
  errors: Record<string, FieldError>;
  isClearable?: boolean;
  isMulti?: boolean;
  name: string;
  options: FieldData[];
  rule: boolean;
  validation: string | undefined;
}

export const SelectFieldTech = ({
  control,
  errors,
  isClearable,
  isMulti,
  name,
  options,
  rule,
  validation
}: SelectFieldProps): ReactNode => {
  const dispatch = useAppDispatch();
  const selectedTechnician = useAppSelector((state) => state.technicians.selectedTechnicians);

  const filteredOptions = options.filter((option: FieldData) => {
    const isOptionSelected =
      option.value === selectedTechnician.leader.value || option.value === selectedTechnician.assistant.value;
    return !isOptionSelected;
  });

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            defaultValue={selectedTechnician}
            isClearable={isClearable}
            isMulti={isMulti}
            isSearchable={true}
            onChange={(selectedOption: FieldData & FieldData[]) => {
              dispatch(setSelectedTechnician({ field: name, technicians: selectedOption }));
              field.onChange(selectedOption);
            }}
            placeholder="Seleccionar..."
            options={filteredOptions as any}
          />
        )}
        rules={{ required: rule }}
      />
      <ErrorDisplay errors={errors[name]} message={validation} />
    </>
  );
};
