import type { FieldValues } from 'react-hook-form';
import type { Cluster } from '../api/clusters';
import type { Team, Technician } from '../api/teams';
import type { FieldData } from './FormFieldProps';

export interface TeamEdit extends Team {}

export interface LeaderField {
  value: number;
  label: string;
}

export interface AssitantField {
  value: number;
  label: string;
}

export interface EditProps {
  dataToEdit: TeamEdit;
}

export interface ItemTeam {
  item: Team;
}

export interface Params {
  technicians: Technician[];
  mesa_username: string;
}

export interface FormData extends Team, Cluster, FieldValues {
  leader?: LeaderField;
  assistant?: AssitantField;
  users_id: number[];
  supervisorField: FieldData;
  primary_file?: string;
  secondary_file?: string;
  cluster_favourite: Array<number | null>;
  cluster_id: number[];
  area_id: number[];
  area?: string;
}
