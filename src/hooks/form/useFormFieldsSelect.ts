import { useAppSelector } from '@/lib';
import { setAreaGroup } from '@/lib/store/area/areaSlice';
import { setSupervisorInField } from '@/lib/store/supervisor/supervisorSlice';
import type { FieldData } from '@/types/Form/FormFieldProps';
import { FormValidations } from '@/utils/formTeams';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

export interface FormDataItem {
  id: string;
  label: string;
  name: string;
  showCondition: boolean;
  options: string | FieldData | FieldData[];
  dataInit: FieldData[] | FieldData | null;
  dispatchAction: ActionCreatorWithPayload<FieldData[]> | ActionCreatorWithPayload<FieldData>;
  validation: string;
}

export const useFormFieldsSelect = (): FormDataItem[] => {
  const { showSupervisorField, supervisorInField, supervisorsDataField } = useAppSelector((state) => state.supervisor);
  const { areaGroup, area } = useAppSelector((state) => state.area);

  return [
    {
      id: 'supervisorField',
      label: 'Supervisor*',
      name: 'supervisor',
      showCondition: showSupervisorField,
      options: supervisorsDataField,
      dataInit: supervisorInField,
      dispatchAction: setSupervisorInField,
      validation: FormValidations.SUPERVISOR_REQUIRED
    },
    {
      id: 'areaField',
      label: 'Area*',
      name: 'area',
      showCondition: true,
      options: area,
      dataInit: areaGroup,
      dispatchAction: setAreaGroup,
      validation: FormValidations.AREA_REQUIRED
    }
  ];
};
