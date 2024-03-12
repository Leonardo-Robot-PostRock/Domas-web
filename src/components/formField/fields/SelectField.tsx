import Select from 'react-select';
import type { ReactNode } from 'react';
import { type Control, Controller, type FieldError } from 'react-hook-form';
import type { FormData } from '@/types/Form/teamEdit';
import type { FieldData } from '@/types/Form/FormFieldProps';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/lib';

interface SelectFieldProps {
  control: Control<FormData>;
  dataInit?: FieldData[] | null | undefined | FieldData;
  errors: Record<string, FieldError>;
  isClearable?: boolean;
  isMulti?: boolean;
  name: string;
  dispatchAction?: ActionCreatorWithPayload<FieldData> | ActionCreatorWithPayload<FieldData[]>;
  options: FieldData | FieldData[] | undefined | null | string;
  rule: boolean;
  validation: string | undefined;
}

export const SelectField = ({
  control,
  dataInit,
  errors,
  dispatchAction,
  isClearable,
  isMulti,
  name,
  options,
  rule,
  validation
}: SelectFieldProps): ReactNode => {
  const dispatch = useAppDispatch();

  const handleDispatchAction = (selectedOption: FieldData & FieldData[]): void => {
    if (dispatchAction) {
      dispatch(dispatchAction(selectedOption));
    }
  };

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            key={field.name}
            defaultValue={dataInit}
            isClearable={isClearable}
            isMulti={isMulti}
            isSearchable={true}
            onChange={(selectedOption: FieldData & FieldData[]) => {
              handleDispatchAction(selectedOption);
              field.onChange(selectedOption);
            }}
            placeholder="Seleccionar..."
            options={options as any}
          />
        )}
        rules={{ required: rule }}
      />
      <ErrorDisplay errors={errors[name]} message={validation} />
    </>
  );
};
