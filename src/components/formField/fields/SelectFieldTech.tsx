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
  errors: Record<string, FieldError>;
  isClearable?: boolean;
  isMulti?: boolean;
  name: string;
  options: FieldData[];
  validation: string | undefined;
}

export const SelectFieldTech = ({
  control,
  errors,
  isClearable,
  name,
  options,
  validation
}: SelectFieldProps): ReactNode => {
  const dispatch = useAppDispatch();
  const selectedLeader = useAppSelector((state) => state.technicians.selectedTechnicians.leader);
  const selectedAssistant = useAppSelector((state) => state.technicians.selectedTechnicians.assistant);

  const filteredOptions = options.filter((option: FieldData) => {
    const isOptionSelected = option.value === selectedLeader.value || option.value === selectedAssistant.value;
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
            isClearable={isClearable}
            isSearchable={true}
            onChange={(selectedOption: FieldData & FieldData[]) => {
              dispatch(setSelectedTechnician({ field: name, technicians: selectedOption }));
              field.onChange(selectedOption);
            }}
            placeholder="Seleccionar..."
            options={filteredOptions}
          />
        )}
        rules={{ required: true }}
      />
      <ErrorDisplay errors={errors[name]} message={validation} />
    </>
  );
};
