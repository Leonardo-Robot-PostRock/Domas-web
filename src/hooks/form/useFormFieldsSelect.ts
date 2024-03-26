import { useAppSelector } from '@/lib';
import { setAreaGroup } from '@/lib/store/area/areaSlice';
import { setSupervisorInField } from '@/lib/store/supervisor/supervisorSlice';
import type { FieldData } from '@/types/Form/FormFieldProps';
import { FormValidations } from '@/utils/formTeams';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

export interface FormDataItem {
  dataInit: FieldData[] | FieldData | null;
  dispatchAction: ActionCreatorWithPayload<FieldData[]> | ActionCreatorWithPayload<FieldData>;
  id: string;
  isMulti: boolean;
  label: string;
  name: string;
  options: string | FieldData | FieldData[];
  showCondition: boolean;
  validation: string;
}

export const useFormFieldsSelect = (): FormDataItem[] => {
  const { showSupervisorField, supervisorInField, supervisorsDataField } = useAppSelector((state) => state.supervisor);
  const { areaGroup, area } = useAppSelector((state) => state.area);

  return [
    {
      dataInit: supervisorInField,
      dispatchAction: setSupervisorInField,
      id: 'supervisorField',
      isMulti: false,
      label: 'Supervisor*',
      name: 'supervisor',
      options: supervisorsDataField,
      showCondition: showSupervisorField,
      validation: FormValidations.SUPERVISOR_REQUIRED
    },
    {
      dataInit: areaGroup,
      dispatchAction: setAreaGroup,
      id: 'areaField',
      isMulti: true,
      label: 'Area*',
      name: 'area',
      options: area,
      showCondition: true,
      validation: FormValidations.AREA_REQUIRED
    }
  ];
};
