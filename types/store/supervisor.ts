import type { FieldData } from '../Form/FormFieldProps';

export interface SupervisorData {
  showSupervisorField: boolean;
  supervisorsDataField: FieldData[] | string;
  supervisorInField: FieldData;
}
