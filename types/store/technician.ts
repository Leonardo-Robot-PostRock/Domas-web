import type { FieldData } from '../Form/FormFieldProps';

export interface TechniciansData {
  technicianDataField: FieldData[];
  selectedTechnicians: {
    leader: FieldData;
    assistant: FieldData;
  };
}
